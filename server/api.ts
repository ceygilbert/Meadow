import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { query, execute, getDbPool, isMysqlConfigured, getDbStatus } from './db';

export const apiRouter = Router();

// Allowed tables whitelist for SQL injection prevention
const ALLOWED_TABLES = new Set([
  'products',
  'categories',
  'subcategories',
  'brands',
  'units',
  'orders',
  'order_items',
  'stock_logs',
  'profiles',
  'app_settings',
  'stores',
]);

// GET /api/db-status
apiRouter.get('/db-status', async (_req: Request, res: Response) => {
  const status = getDbStatus();
  let tableCounts: Record<string, number> = {};

  if (status.connected) {
    try {
      for (const tbl of ['products', 'categories', 'subcategories', 'brands', 'units', 'orders', 'profiles']) {
        const rows = await query<any>(`SELECT COUNT(*) as cnt FROM \`${tbl}\``);
        tableCounts[tbl] = rows[0]?.cnt || 0;
      }
    } catch (e: any) {
      console.warn('[DB Status count error]:', e.message);
    }
  }

  res.json({
    ...status,
    tableCounts,
  });
});

// POST /api/db/query - Universal query handler compatible with Supabase Client operations
apiRouter.post('/db/query', async (req: Request, res: Response) => {
  try {
    if (!isMysqlConfigured()) {
      return res.status(503).json({ error: 'MySQL is not configured on server', data: null });
    }

    const {
      table,
      action = 'select',
      select = '*',
      filters = [],
      order,
      limit,
      offset,
      data: payload,
    } = req.body;

    if (!table || !ALLOWED_TABLES.has(table)) {
      return res.status(400).json({ error: `Invalid or disallowed table: ${table}`, data: null });
    }

    // --- 1. SELECT ---
    if (action === 'select') {
      let sql = `SELECT * FROM \`${table}\``;
      const params: any[] = [];
      const whereClauses: string[] = [];

      if (Array.isArray(filters)) {
        for (const f of filters) {
          const { column, op, value } = f;
          if (!/^[a-zA-Z0-9_]+$/.test(column)) continue;

          switch (op) {
            case 'eq':
              whereClauses.push(`\`${column}\` = ?`);
              params.push(value);
              break;
            case 'neq':
              whereClauses.push(`\`${column}\` != ?`);
              params.push(value);
              break;
            case 'gt':
              whereClauses.push(`\`${column}\` > ?`);
              params.push(value);
              break;
            case 'gte':
              whereClauses.push(`\`${column}\` >= ?`);
              params.push(value);
              break;
            case 'lt':
              whereClauses.push(`\`${column}\` < ?`);
              params.push(value);
              break;
            case 'lte':
              whereClauses.push(`\`${column}\` <= ?`);
              params.push(value);
              break;
            case 'like':
            case 'ilike':
              whereClauses.push(`\`${column}\` LIKE ?`);
              params.push(value);
              break;
            case 'in':
              if (Array.isArray(value) && value.length > 0) {
                const placeholders = value.map(() => '?').join(',');
                whereClauses.push(`\`${column}\` IN (${placeholders})`);
                params.push(...value);
              }
              break;
            case 'is':
              if (value === null) {
                whereClauses.push(`\`${column}\` IS NULL`);
              } else {
                whereClauses.push(`\`${column}\` = ?`);
                params.push(value);
              }
              break;
          }
        }
      }

      if (whereClauses.length > 0) {
        sql += ` WHERE ` + whereClauses.join(' AND ');
      }

      if (order && order.column && /^[a-zA-Z0-9_]+$/.test(order.column)) {
        const dir = order.ascending ? 'ASC' : 'DESC';
        sql += ` ORDER BY \`${order.column}\` ${dir}`;
      }

      if (typeof limit === 'number' && limit > 0) {
        sql += ` LIMIT ${Math.min(limit, 1000)}`;
      }

      if (typeof offset === 'number' && offset > 0) {
        sql += ` OFFSET ${offset}`;
      }

      const rows = await query<any>(sql, params);

      // Parse JSON columns if any (specs, banners, categories in settings)
      const sanitizedRows = rows.map((r) => {
        if (r.specs && typeof r.specs === 'string') {
          try {
            r.specs = JSON.parse(r.specs);
          } catch (e) {}
        }
        return r;
      });

      return res.json({ data: sanitizedRows, error: null });
    }

    // --- 2. INSERT ---
    if (action === 'insert') {
      const records = Array.isArray(payload) ? payload : [payload];
      if (records.length === 0) {
        return res.json({ data: [], error: null });
      }

      const insertedRecords: any[] = [];
      for (const rec of records) {
        const item = { ...rec };
        if (!item.id) {
          item.id = uuidv4();
        }

        const keys = Object.keys(item).filter((k) => /^[a-zA-Z0-9_]+$/.test(k));
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map((k) => {
          const val = item[k];
          if (typeof val === 'object' && val !== null) {
            return JSON.stringify(val);
          }
          return val;
        });

        const sql = `INSERT INTO \`${table}\` (${keys.map((k) => `\`${k}\``).join(', ')}) VALUES (${placeholders})`;
        await execute(sql, values);
        insertedRecords.push(item);
      }

      return res.json({ data: Array.isArray(payload) ? insertedRecords : insertedRecords[0], error: null });
    }

    // --- 2b. UPSERT (INSERT ... ON DUPLICATE KEY UPDATE) ---
    if (action === 'upsert') {
      const records = Array.isArray(payload) ? payload : [payload];
      if (records.length === 0) {
        return res.json({ data: [], error: null });
      }

      const upsertedRecords: any[] = [];
      for (const rec of records) {
        const item = { ...rec };
        if (!item.id) {
          item.id = uuidv4();
        }

        const keys = Object.keys(item).filter((k) => /^[a-zA-Z0-9_]+$/.test(k));
        const placeholders = keys.map(() => '?').join(', ');
        const updateClauses = keys.filter(k => k !== 'id').map(k => `\`${k}\` = VALUES(\`${k}\`)`).join(', ');
        const values = keys.map((k) => {
          const val = item[k];
          if (typeof val === 'object' && val !== null) {
            return JSON.stringify(val);
          }
          return val;
        });

        const sql = `INSERT INTO \`${table}\` (${keys.map((k) => `\`${k}\``).join(', ')}) VALUES (${placeholders}) ${updateClauses.length > 0 ? `ON DUPLICATE KEY UPDATE ${updateClauses}` : ''}`;
        await execute(sql, values);
        upsertedRecords.push(item);
      }

      return res.json({ data: Array.isArray(payload) ? upsertedRecords : upsertedRecords[0], error: null });
    }

    // --- 3. UPDATE ---
    if (action === 'update') {
      const keys = Object.keys(payload).filter((k) => /^[a-zA-Z0-9_]+$/.test(k) && k !== 'id');
      if (keys.length === 0) {
        return res.json({ data: payload, error: null });
      }

      const setClauses = keys.map((k) => `\`${k}\` = ?`).join(', ');
      const values = keys.map((k) => {
        const val = payload[k];
        if (typeof val === 'object' && val !== null) {
          return JSON.stringify(val);
        }
        return val;
      });

      let sql = `UPDATE \`${table}\` SET ${setClauses}`;
      const params = [...values];
      const whereClauses: string[] = [];

      if (Array.isArray(filters)) {
        for (const f of filters) {
          const { column, op, value } = f;
          if (!/^[a-zA-Z0-9_]+$/.test(column)) continue;
          if (op === 'eq') {
            whereClauses.push(`\`${column}\` = ?`);
            params.push(value);
          } else if (op === 'in' && Array.isArray(value) && value.length > 0) {
            const placeholders = value.map(() => '?').join(',');
            whereClauses.push(`\`${column}\` IN (${placeholders})`);
            params.push(...value);
          }
        }
      }

      if (whereClauses.length > 0) {
        sql += ` WHERE ` + whereClauses.join(' AND ');
      } else {
        return res.status(400).json({ error: 'Update requires at least one filter clause', data: null });
      }

      await execute(sql, params);
      return res.json({ data: payload, error: null });
    }

    // --- 4. DELETE ---
    if (action === 'delete') {
      let sql = `DELETE FROM \`${table}\``;
      const params: any[] = [];
      const whereClauses: string[] = [];

      if (Array.isArray(filters)) {
        for (const f of filters) {
          const { column, op, value } = f;
          if (!/^[a-zA-Z0-9_]+$/.test(column)) continue;
          if (op === 'eq') {
            whereClauses.push(`\`${column}\` = ?`);
            params.push(value);
          } else if (op === 'in' && Array.isArray(value) && value.length > 0) {
            const placeholders = value.map(() => '?').join(',');
            whereClauses.push(`\`${column}\` IN (${placeholders})`);
            params.push(...value);
          }
        }
      }

      if (whereClauses.length > 0) {
        sql += ` WHERE ` + whereClauses.join(' AND ');
      } else {
        return res.status(400).json({ error: 'Delete requires at least one filter clause', data: null });
      }

      await execute(sql, params);
      return res.json({ data: true, error: null });
    }

    res.status(400).json({ error: `Unsupported action: ${action}`, data: null });
  } catch (err: any) {
    console.error('[DB Query Error]:', err);
    res.status(500).json({ error: err.message || 'Database query failed', data: null });
  }
});

// GET /api/products
apiRouter.get('/products', async (req: Request, res: Response) => {
  try {
    if (!isMysqlConfigured()) {
      return res.status(503).json({ error: 'MySQL not configured' });
    }

    const { category, brand, search, featured, promo, limit = 50, offset = 0 } = req.query;
    let sql = `SELECT p.*, c.name as category_name, b.name as brand_name 
               FROM products p
               LEFT JOIN categories c ON p.category_id = c.id
               LEFT JOIN brands b ON p.brand_id = b.id
               WHERE 1=1`;
    const params: any[] = [];

    if (category) {
      sql += ` AND (p.category_id = ? OR c.slug = ?)`;
      params.push(category, category);
    }

    if (brand) {
      sql += ` AND p.brand_id = ?`;
      params.push(brand);
    }

    if (featured === 'true' || featured === '1') {
      sql += ` AND p.is_Featured = 1`;
    }

    if (promo === 'true' || promo === '1') {
      sql += ` AND p.is_Promo = 1`;
    }

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(String(limit), 10), parseInt(String(offset), 10));

    const rows = await query<any>(sql, params);
    res.json({ success: true, data: rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders (Transaction-based checkout)
apiRouter.post('/orders', async (req: Request, res: Response) => {
  const pool = getDbPool();
  if (!pool) {
    return res.status(503).json({ error: 'MySQL not configured' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      total_amount,
      payment_method,
      items,
    } = req.body;

    const orderId = uuidv4();
    await conn.execute(
      `INSERT INTO orders (id, customer_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        orderId,
        customer_id || null,
        customer_name || 'Guest',
        customer_email || '',
        customer_phone || '',
        shipping_address || '',
        total_amount || 0.0,
        payment_method || 'manual',
      ]
    );

    if (Array.isArray(items)) {
      for (const item of items) {
        const itemId = uuidv4();
        await conn.execute(
          `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, created_at)
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [itemId, orderId, item.product_id, item.quantity, item.unit_price]
        );

        // Deduct stock
        await conn.execute(
          `UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?`,
          [item.quantity, item.product_id]
        );
      }
    }

    await conn.commit();
    res.json({ success: true, orderId, message: 'Order created successfully' });
  } catch (err: any) {
    await conn.rollback();
    console.error('[Create Order Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to create order' });
  } finally {
    conn.release();
  }
});

// Helper to manage persistent settings file fallback
const SETTINGS_FILE = path.join(process.cwd(), 'data', 'app_settings.json');

function readSettingsFile(): Record<string, any> {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.warn('[Settings File] Read error:', e);
  }
  return {};
}

function writeSettingsFile(key: string, value: any) {
  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const current = readSettingsFile();
    current[key] = value;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[Settings File] Write error:', e);
  }
}

// GET & POST & DELETE /api/settings/:key
apiRouter.get('/settings/:key', async (req: Request, res: Response) => {
  try {
    const key = String(req.params.key);

    // 1. Try MySQL app_settings first if configured
    if (isMysqlConfigured()) {
      try {
        const rows = await query<any>('SELECT setting_value FROM app_settings WHERE setting_key = ? LIMIT 1', [key]);
        if (rows.length > 0) {
          let parsed: any;
          try {
            parsed = JSON.parse(rows[0].setting_value);
          } catch {
            parsed = rows[0].setting_value;
          }
          // Also sync to local backup
          writeSettingsFile(key, parsed);
          return res.json({ data: parsed });
        }
      } catch (dbErr: any) {
        console.warn(`[Settings] DB read warning for ${key}:`, dbErr.message);
      }
    }

    // 2. Fallback to file storage
    const fileData = readSettingsFile();
    if (key in fileData) {
      return res.json({ data: fileData[key] });
    }

    return res.json({ data: null });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/settings/:key', async (req: Request, res: Response) => {
  try {
    const key = String(req.params.key);
    const { value } = req.body;

    // 1. Always write to file backup immediately
    writeSettingsFile(key, value);

    // 2. Persist to MySQL app_settings if configured
    if (isMysqlConfigured()) {
      try {
        const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        await execute(
          `INSERT INTO app_settings (setting_key, setting_value, updated_at)
           VALUES (?, ?, NOW())
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
          [key, valStr]
        );
      } catch (dbErr: any) {
        console.warn(`[Settings] MySQL write warning for ${key}:`, dbErr.message);
      }
    }

    res.json({ success: true, key, value });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/settings/:key', async (req: Request, res: Response) => {
  try {
    const key = String(req.params.key);
    try {
      const fileData = readSettingsFile();
      delete fileData[key];
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(fileData, null, 2), 'utf-8');
    } catch {}

    if (isMysqlConfigured()) {
      try {
        await execute('DELETE FROM app_settings WHERE setting_key = ?', [key]);
      } catch (e: any) {
        console.warn(`[Settings] DB delete warning for ${key}:`, e.message);
      }
    }

    res.json({ success: true, key });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stores - Fetch all stores directly from MariaDB stores table
apiRouter.get('/stores', async (_req: Request, res: Response) => {
  try {
    if (isMysqlConfigured()) {
      try {
        const rows = await query<any>('SELECT * FROM stores ORDER BY sort_order ASC, name ASC');
        if (rows && rows.length > 0) {
          const parsed = rows.map((r: any) => ({
            id: r.id,
            name: r.name,
            badge: r.badge || '',
            badgeType: r.badge_type || 'meadow',
            category: r.category || 'Meadow Computer',
            address: r.address || '',
            phone: r.phone || '',
            hours: r.hours || '',
            googleMapsUrl: r.google_maps_url || '',
            embedMapUrl: r.embed_map_url || '',
            image: r.image_url || '',
            description: r.description || '',
            tags: typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : (r.tags || []),
            features: typeof r.features === 'string' ? JSON.parse(r.features || '[]') : (r.features || []),
            isActive: r.is_active !== 0,
            order: r.sort_order ?? 0,
          }));
          return res.json({ data: parsed });
        }
      } catch (dbErr: any) {
        console.warn('[Stores GET] MySQL error:', dbErr.message);
      }
    }

    // Fallback to settings
    const fileData = readSettingsFile();
    if (fileData['our_stores'] && Array.isArray(fileData['our_stores'].stores)) {
      return res.json({ data: fileData['our_stores'].stores });
    }

    return res.json({ data: [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stores/sync - Authoritative dual-persistence to both app_settings & stores table
apiRouter.post('/stores/sync', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // 1. Dual-write to local JSON fallback
    writeSettingsFile('our_stores', payload);

    if (isMysqlConfigured()) {
      // 2. Persist to app_settings
      try {
        await execute(
          `INSERT INTO app_settings (setting_key, setting_value, updated_at)
           VALUES ('our_stores', ?, NOW())
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
          [JSON.stringify(payload)]
        );
      } catch (appErr: any) {
        console.warn('[Stores Sync] app_settings save warning:', appErr.message);
      }

      // 3. Persist each store item into MariaDB `stores` table
      if (Array.isArray(payload.stores) && payload.stores.length > 0) {
        const storeIds: string[] = [];
        for (const st of payload.stores) {
          if (!st.id) continue;
          storeIds.push(st.id);

          const tagsStr = JSON.stringify(Array.isArray(st.tags) ? st.tags : []);
          const featuresStr = JSON.stringify(Array.isArray(st.features) ? st.features : []);
          const isActive = st.isActive !== false ? 1 : 0;
          const sortOrder = typeof st.order === 'number' ? st.order : 0;

          await execute(
            `INSERT INTO stores (
              id, name, badge, badge_type, category, address, phone, hours, 
              google_maps_url, embed_map_url, image_url, description, tags, features, 
              is_active, sort_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              name = VALUES(name),
              badge = VALUES(badge),
              badge_type = VALUES(badge_type),
              category = VALUES(category),
              address = VALUES(address),
              phone = VALUES(phone),
              hours = VALUES(hours),
              google_maps_url = VALUES(google_maps_url),
              embed_map_url = VALUES(embed_map_url),
              image_url = VALUES(image_url),
              description = VALUES(description),
              tags = VALUES(tags),
              features = VALUES(features),
              is_active = VALUES(is_active),
              sort_order = VALUES(sort_order),
              updated_at = NOW()`,
            [
              st.id,
              st.name || 'Store',
              st.badge || '',
              st.badgeType || 'meadow',
              st.category || 'Meadow Computer',
              st.address || '',
              st.phone || '',
              st.hours || '',
              st.googleMapsUrl || '',
              st.embedMapUrl || '',
              st.image || '',
              st.description || '',
              tagsStr,
              featuresStr,
              isActive,
              sortOrder
            ]
          );
        }

        // Clean up any stores deleted from UI
        if (storeIds.length > 0) {
          try {
            const placeholders = storeIds.map(() => '?').join(', ');
            await execute(
              `DELETE FROM stores WHERE id NOT IN (${placeholders})`,
              storeIds
            );
          } catch (delErr: any) {
            console.warn('[Stores Sync] Delete cleanup warning:', delErr.message);
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'All stores and page data saved to MariaDB database successfully.',
      data: payload
    });
  } catch (err: any) {
    console.error('[Stores Sync Error]:', err);
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// INBOX / MAILBOX DATABASE PERSISTENCE (Newsletter & Career Applications)
// =========================================================================
const INBOX_DB_ID = '00000000-0000-0000-0000-000000000008';
const INBOX_DB_PREFIX = 'INBOX_MESSAGES:';

function getSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function readInboxMessages(): Promise<any[]> {
  let dbList: any[] = [];

  // 1. Read from Supabase database
  const sb = getSupabaseServerClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('units')
        .select('*')
        .eq('id', INBOX_DB_ID)
        .maybeSingle();

      if (!error && data && typeof data.name === 'string' && data.name.startsWith(INBOX_DB_PREFIX)) {
        const parsed = JSON.parse(data.name.substring(INBOX_DB_PREFIX.length));
        if (Array.isArray(parsed)) {
          dbList = parsed;
        }
      }
    } catch (e) {
      console.warn('[Inbox] Supabase read warning:', e);
    }
  }

  // 2. Read from MySQL app_settings if configured
  if (isMysqlConfigured() && dbList.length === 0) {
    try {
      const rows = await query<any>("SELECT setting_value FROM app_settings WHERE setting_key = 'inbox_messages' LIMIT 1");
      if (rows.length > 0 && rows[0].setting_value) {
        const parsed = JSON.parse(rows[0].setting_value);
        if (Array.isArray(parsed)) {
          dbList = parsed;
        }
      }
    } catch (e) {}
  }

  // 3. Merge with local settings file if any
  const fileData = readSettingsFile();
  const localInbox = Array.isArray(fileData['inbox_messages']) ? fileData['inbox_messages'] : [];
  const legacyCareer = Array.isArray(fileData['career_applications']) ? fileData['career_applications'] : [];

  const mergedMap = new Map<string, any>();

  for (const item of [...dbList, ...localInbox]) {
    if (item && item.id) {
      mergedMap.set(item.id, item);
    }
  }

  // Migrate any legacy career_applications entries
  for (const c of legacyCareer) {
    if (c && c.id && !mergedMap.has(c.id)) {
      mergedMap.set(c.id, {
        id: c.id,
        type: 'career',
        fullName: c.fullName || '',
        email: c.email || '',
        phone: c.phone || '',
        position: c.position || 'General Application',
        employmentType: c.employmentType || 'Full-Time',
        preferredBranch: c.preferredBranch || 'Any Johor Branch',
        earliestStartDate: c.earliestStartDate || '',
        coverLetter: c.coverLetter || '',
        resume: c.resume || null,
        isRead: false,
        isStarred: false,
        status: 'unread',
        createdAt: c.submittedAt || new Date().toISOString(),
      });
    }
  }

  const finalItems = Array.from(mergedMap.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  return finalItems;
}

async function saveInboxMessages(messages: any[]): Promise<void> {
  // 1. Write to local file backup
  writeSettingsFile('inbox_messages', messages);

  // 2. Persist to Supabase database
  const sb = getSupabaseServerClient();
  if (sb) {
    try {
      await sb.from('units').upsert(
        {
          id: INBOX_DB_ID,
          name: INBOX_DB_PREFIX + JSON.stringify(messages),
        },
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('[Inbox] Supabase write warning:', e);
    }
  }

  // 3. Persist to MySQL app_settings if configured
  if (isMysqlConfigured()) {
    try {
      await execute(
        `INSERT INTO app_settings (setting_key, setting_value, updated_at)
         VALUES ('inbox_messages', ?, NOW())
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
        [JSON.stringify(messages)]
      );
    } catch (e) {
      console.warn('[Inbox] MySQL write warning:', e);
    }
  }
}

// GET /api/inbox - Retrieve all inbox messages (Career Resumes + Newsletter Subscriptions)
apiRouter.get('/inbox', async (_req: Request, res: Response) => {
  try {
    const messages = await readInboxMessages();
    res.json({ data: messages });
  } catch (err: any) {
    console.error('[Inbox GET Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to load inbox messages' });
  }
});

// POST /api/inbox/newsletter - Save a newsletter subscription to database
apiRouter.post('/inbox/newsletter', async (req: Request, res: Response) => {
  try {
    const { email, source } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await readInboxMessages();

    const record = {
      id: uuidv4(),
      type: 'newsletter',
      fullName: cleanEmail.split('@')[0],
      email: cleanEmail,
      subject: 'Newsletter Subscription',
      source: source || 'Website Footer',
      isRead: false,
      isStarred: false,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    const updated = [record, ...existing];
    await saveInboxMessages(updated);

    res.json({
      success: true,
      message: 'Subscribed to newsletter successfully.',
      data: record,
    });
  } catch (err: any) {
    console.error('[Newsletter Subscribe Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to subscribe' });
  }
});

// POST /api/inbox/career & POST /api/career/apply - Save a career application + resume to database
const handleCareerApply = async (req: Request, res: Response) => {
  try {
    const application = req.body;
    if (!application || !application.fullName || !application.email) {
      return res.status(400).json({ error: 'Full name and email are required.' });
    }

    const existing = await readInboxMessages();

    const record = {
      id: uuidv4(),
      type: 'career',
      fullName: application.fullName.trim(),
      email: application.email.trim(),
      phone: application.phone || '',
      position: application.position || 'General Application',
      employmentType: application.employmentType || 'Full-Time',
      preferredBranch: application.preferredBranch || 'Any Johor Branch',
      earliestStartDate: application.earliestStartDate || '',
      coverLetter: application.coverLetter || '',
      resume: application.resume || null,
      subject: `Job Application: ${application.position || 'General Application'}`,
      isRead: false,
      isStarred: false,
      status: 'unread',
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    };

    const updated = [record, ...existing];
    await saveInboxMessages(updated);

    res.json({
      success: true,
      message: 'Career application submitted and saved to database.',
      data: record,
    });
  } catch (err: any) {
    console.error('[Career Apply Error]:', err);
    res.status(500).json({ error: err.message || 'Failed to submit application' });
  }
};

apiRouter.post('/inbox/career', handleCareerApply);
apiRouter.post('/career/apply', handleCareerApply);

// PATCH /api/inbox/:id - Update read/starred/status state of a message
apiRouter.patch('/inbox/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const existing = await readInboxMessages();

    let updatedRecord: any = null;
    const updatedList = existing.map((item) => {
      if (item.id === id) {
        updatedRecord = {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return updatedRecord;
      }
      return item;
    });

    await saveInboxMessages(updatedList);
    res.json({ success: true, data: updatedRecord });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inbox/batch - Batch mark read/unread or delete
apiRouter.post('/inbox/batch', async (req: Request, res: Response) => {
  try {
    const { ids, action } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No message IDs provided' });
    }

    const idSet = new Set(ids);
    const existing = await readInboxMessages();
    let updatedList: any[] = [];

    if (action === 'delete') {
      updatedList = existing.filter((item) => !idSet.has(item.id));
    } else if (action === 'mark_read') {
      updatedList = existing.map((item) =>
        idSet.has(item.id) ? { ...item, isRead: true, status: item.status === 'unread' ? 'read' : item.status } : item
      );
    } else if (action === 'mark_unread') {
      updatedList = existing.map((item) =>
        idSet.has(item.id) ? { ...item, isRead: false, status: 'unread' } : item
      );
    } else {
      updatedList = existing;
    }

    await saveInboxMessages(updatedList);
    res.json({ success: true, data: updatedList });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/inbox/:id - Delete a single inbox message
apiRouter.delete('/inbox/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await readInboxMessages();
    const updated = existing.filter((item) => item.id !== id);
    await saveInboxMessages(updated);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/career/applications - Retrieve submitted career applications
apiRouter.get('/career/applications', async (_req: Request, res: Response) => {
  try {
    const all = await readInboxMessages();
    res.json({ data: all.filter((m) => m.type === 'career') });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});



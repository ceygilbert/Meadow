import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
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

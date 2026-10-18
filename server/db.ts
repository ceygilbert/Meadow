import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;
let isConnected = false;

export function isMysqlConfigured(): boolean {
  return !!(
    process.env.DB_NAME &&
    process.env.DB_USER &&
    (process.env.DB_PASSWORD !== undefined || process.env.DB_HOST)
  );
}

export function getDbPool(): mysql.Pool | null {
  if (pool) return pool;

  if (!isMysqlConfigured()) {
    return null;
  }

  try {
    let port = parseInt(process.env.DB_PORT || '3306', 10);
    // Port 3006 is a common typo for standard MySQL port 3306
    if (port === 3006 || isNaN(port) || port <= 0) {
      console.warn(`[MySQL] Auto-correcting DB_PORT ${process.env.DB_PORT} to standard MySQL port 3306`);
      port = 3306;
    }

    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      connectTimeout: 5000,
      charset: 'utf8mb4',
    });

    return pool;
  } catch (err) {
    console.error('[MySQL] Failed to initialize connection pool:', err);
    return null;
  }
}

export async function testDbConnection(): Promise<boolean> {
  const currentPool = getDbPool();
  if (!currentPool) {
    console.log('[MySQL] Database credentials not set in .env. Running in Supabase/Fallback mode.');
    isConnected = false;
    return false;
  }

  try {
    const connection = await currentPool.getConnection();
    await connection.ping();

    // Auto-ensure auth_users view exists for users expecting auth.users or auth_users in MySQL
    try {
      await connection.query('CREATE OR REPLACE VIEW auth_users AS SELECT id, email, password_hash, role, created_at FROM profiles');
    } catch {}

    connection.release();
    isConnected = true;
    console.log(`[MySQL] Successfully connected to MariaDB/MySQL database: ${process.env.DB_NAME} on ${process.env.DB_HOST || 'localhost'}`);
    return true;
  } catch (err: any) {
    console.warn(`[MySQL] Could not connect to database (${err.message}). Will fallback to Supabase if available.`);
    isConnected = false;
    return false;
  }
}

export function getDbStatus() {
  let port = parseInt(process.env.DB_PORT || '3306', 10);
  if (port === 3006) port = 3306;
  return {
    configured: isMysqlConfigured(),
    connected: isConnected,
    host: process.env.DB_HOST || 'localhost',
    port,
    database: process.env.DB_NAME || null,
  };
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const currentPool = getDbPool();
  if (!currentPool) {
    throw new Error('MySQL connection pool is not configured');
  }
  const [rows] = await currentPool.query(sql, params);
  return rows as T[];
}

export async function execute(sql: string, params: any[] = []): Promise<mysql.ResultSetHeader> {
  const currentPool = getDbPool();
  if (!currentPool) {
    throw new Error('MySQL connection pool is not configured');
  }
  const [result] = await currentPool.execute(sql, params);
  return result as mysql.ResultSetHeader;
}

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://ecscjefihrntuhumtqwe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjc2NqZWZpaHJudHVodW10cXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MjE0NDQsImV4cCI6MjEwNTA5NzQ0NH0.e5O14flqHFoue0297dp6JXmAAmDbrpkMp7-M66RE3k8'
);

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (typeof val === 'object') {
    return "'" + JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }
  // Format ISO timestamp for MySQL if valid date
  const str = String(val);
  return "'" + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
}

async function exportAll() {
  let sql = `-- =====================================================================
-- Hostinger MariaDB / MySQL Seed Data Export
-- Generated for Meadow IT E-Commerce
-- Compatible with Hostinger phpMyAdmin and MariaDB 10.3+ / MySQL 8.0+
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

`;

  const tables = ['categories', 'subcategories', 'brands', 'units', 'products', 'profiles'];
  for (const table of tables) {
    const { data, error } = await sb.from(table).select('*');
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
      continue;
    }
    if (!data || data.length === 0) continue;

    console.log(`Exporting ${table}: ${data.length} rows`);
    sql += `-- ---------------------------------------------------------------------\n`;
    sql += `-- Table: \`${table}\` (${data.length} rows)\n`;
    sql += `-- ---------------------------------------------------------------------\n`;

    for (const row of data) {
      const keys = Object.keys(row).map((k) => `\`${k}\``);
      const values = Object.values(row).map(escapeSql);
      sql += `INSERT INTO \`${table}\` (${keys.join(', ')}) VALUES (${values.join(', ')}) ON DUPLICATE KEY UPDATE \`id\`=\`id\`;\n`;
    }
    sql += `\n`;
  }

  sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
  fs.writeFileSync('mysql-data-seed.sql', sql, 'utf8');
  console.log('Successfully written mysql-data-seed.sql with exact table and column names!');
}

exportAll();

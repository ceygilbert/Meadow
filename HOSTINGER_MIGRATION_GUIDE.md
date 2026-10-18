# Hostinger Node.js & MariaDB / MySQL Migration Guide
**Project:** Meadow IT E-Commerce  
**Database:** MariaDB / MySQL (Hostinger)  
**Backend:** Node.js Express (`server.ts` / `dist/server.cjs`)

---

## 1. Overview of Prepared Files

We have generated all database and data export files directly in your repository:

| File | Purpose |
| :--- | :--- |
| `mysql-schema.sql` | Complete MariaDB / MySQL schema: creates all 10 tables (`profiles`, `categories`, `subcategories`, `brands`, `units`, `products`, `orders`, `order_items`, `stock_logs`, `app_settings`) with primary keys, indexes, and foreign keys. |
| `mysql-data-seed.sql` | **Live Store Data Export** extracted from Supabase: contains all **119 products**, **10 categories**, **46 subcategories**, **11 brands**, **5 units**, and user profiles. Ready to import directly into Hostinger phpMyAdmin so you don't lose any data! |
| `scripts/export_to_mysql.js` | Export script that can be run anytime (`node scripts/export_to_mysql.js`) to re-sync or re-export live data from Supabase before final cutover. |

---

## 2. Step 1: Create Database in Hostinger hPanel

1. Log into your **Hostinger hPanel**.
2. Navigate to **Databases** > **Management**.
3. Under **Create a New MySQL Database and Database User**:
   - **Database Name**: e.g. `u123456789_meadow`
   - **Username**: e.g. `u123456789_meadow_user`
   - **Password**: enter a strong password (save this for your `.env`).
4. Click **Create**.
5. Once created, click **Enter phpMyAdmin** next to your new database.

---

## 3. Step 2: Import Tables & Seed Data in phpMyAdmin

1. In phpMyAdmin, click your database name on the left sidebar.
2. Click the **Import** tab at the top.
3. Click **Choose File** and select `mysql-schema.sql`.
4. Click **Go** at the bottom. (All 10 tables will be created).
5. Next, click **Import** tab again.
6. Click **Choose File** and select `mysql-data-seed.sql`.
7. Click **Go**. (All 119 products, categories, subcategories, brands, and units will be populated instantly).

---

## 4. Step 3: Hostinger Node.js Web App Configuration

Hostinger supports Node.js applications (via Cloud / Business / VPS hosting with Node.js Application Manager).

1. In Hostinger hPanel, go to **Websites** > click **Manage** > go to **Node.js** (or search "Node.js" in the top bar).
2. Click **Create Application** (or Edit if already exists):
   - **Node.js Version**: Select `18.x` or `20.x` LTS.
   - **Application Mode**: `Production`
   - **Application Root**: `/home/uXXXXX/domains/yourdomain.com/public_html`
   - **Application Startup File**: `dist/server.cjs` (or `server.js`)
3. Under **Environment Variables**, add the following keys:
   ```env
   NODE_ENV=production
   PORT=3000
   DB_HOST=localhost
   DB_USER=u123456789_meadow_user
   DB_PASSWORD=your_database_password
   DB_NAME=u123456789_meadow
   DB_PORT=3306
   JWT_SECRET=meadow_secret_secure_key_2026
   ```

---

## 5. Architectural Blueprint: How the 3 Supabase Services are Replaced

### A. Database (PostgreSQL / Supabase -> MariaDB / MySQL)
* **In Node.js backend**: Use `mysql2/promise` with a connection pool.
* **API Endpoints**: The Express server (`server.ts`) handles API routes:
  - `GET /api/products` (with filters for category, brand, search, pagination)
  - `GET /api/categories` & `GET /api/subcategories`
  - `GET /api/brands`
  - `POST /api/orders` & `GET /api/orders`
  - `PUT /api/admin/products/:id`, etc.

### B. User Authentication (Supabase Auth -> Native JWT & bcrypt)
* Supabase Auth has a 50,000 monthly active user limit on free tier.
* Hostinger MySQL has **no user quota**.
* How it works:
  - Users are stored in the `profiles` table with a secure `password_hash` column (hashed with `bcryptjs`).
  - In Supabase, passwords were kept hidden inside Supabase's private internal schema (`auth.users`), which is why the original Supabase `profiles` table had no password column.
  - In MySQL, we added `password_hash VARCHAR(255)` directly to the `profiles` table in `mysql-schema.sql`.
  - **First-Time Login for Existing Admin Accounts**: Because Supabase never exports passwords from `auth.users`, your 2 exported admin accounts initially have `password_hash = NULL`. The backend has an automatic bootstrap feature: the very first time you log in with your email and password, it will automatically hash your password with bcrypt and save it into `profiles.password_hash`! From then on, your password is permanently encrypted in MySQL.
  - `POST /api/auth/login` verifies email/password and returns a JWT token.
  - `POST /api/auth/register` creates account with hashed password.
  - `GET /api/auth/me` validates the token and returns user profile + role (`admin` / `customer` / `superadmin`).

### C. Image & Media Storage (Supabase Storage -> Hostinger Local Disk)
* Supabase Storage free tier is capped at 1 GB.
* Hostinger plans provide **50 GB to 200 GB+** NVMe SSD storage for free!
* How it works:
  - Uploads are received by `multer` in Express.
  - Images are saved directly to `/public/uploads/` on your Hostinger web server.
  - Express serves `/uploads/*` statically.
  - Zero quota, zero third-party dependency!

---

## 6. Deployment Workflow (When Ready to Switch)

```bash
# 1. Install production dependencies
npm install mysql2 bcryptjs jsonwebtoken multer @types/jsonwebtoken @types/bcryptjs @types/multer

# 2. Build frontend and bundle server
npm run build

# 3. Upload dist/ and package.json to Hostinger public_html
# 4. In Hostinger Node.js manager, click "Run NPM Install" & "Restart Application"
```

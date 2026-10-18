-- =====================================================================
-- Meadow IT E-Commerce Database Schema for MySQL / MariaDB (Hostinger)
-- Compatible with Hostinger phpMyAdmin, MariaDB 10.3+ & MySQL 8.0+
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. Table: `profiles` (Users, Admins & Customer Accounts)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` VARCHAR(36) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `full_name` VARCHAR(255) DEFAULT '',
  `phone` VARCHAR(50) DEFAULT '',
  `address` TEXT DEFAULT NULL,
  `avatar_url` TEXT DEFAULT NULL,
  `role` ENUM('admin', 'customer', 'superadmin') NOT NULL DEFAULT 'customer',
  `total_spent` DECIMAL(12, 2) DEFAULT 0.00,
  `order_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_profiles_email` (`email`),
  INDEX `idx_profiles_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Table: `categories`
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image_url` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Table: `subcategories`
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `subcategories` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `category_id` VARCHAR(36) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image_url` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_subcategories_cat_id` (`category_id`),
  CONSTRAINT `fk_subcategories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Table: `brands`
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `brands` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `logo_url` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `on_list` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Table: `units` (Units & Key-Value Configuration Store)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `units` (
  `id` VARCHAR(36) NOT NULL,
  `name` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Table: `products`
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `category_id` VARCHAR(36) NOT NULL,
  `subcategory_id` VARCHAR(36) DEFAULT NULL,
  `brand_id` VARCHAR(36) NOT NULL,
  `unit_id` VARCHAR(36) DEFAULT NULL,
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `discount_type` ENUM('none', 'percentage', 'fixed') NOT NULL DEFAULT 'none',
  `discount_value` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `stock` INT NOT NULL DEFAULT 0,
  `image_url` TEXT DEFAULT NULL,
  `description` LONGTEXT DEFAULT NULL,
  `additional_details` LONGTEXT DEFAULT NULL,
  `ddr_type` VARCHAR(20) DEFAULT '',
  `specs` JSON DEFAULT NULL,
  `is_custom_build` TINYINT(1) DEFAULT 0,
  `is_customised` TINYINT(1) DEFAULT 0,
  `is_Featured` TINYINT(1) DEFAULT 0,
  `is_Promo` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_products_cat` (`category_id`),
  INDEX `idx_products_subcat` (`subcategory_id`),
  INDEX `idx_products_brand` (`brand_id`),
  INDEX `idx_products_price` (`price`),
  INDEX `idx_products_featured` (`is_Featured`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Table: `orders`
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(36) NOT NULL,
  `customer_id` VARCHAR(36) DEFAULT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(50) DEFAULT NULL,
  `shipping_address` TEXT DEFAULT NULL,
  `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `payment_status` VARCHAR(50) DEFAULT 'unpaid',
  `payment_method` VARCHAR(50) DEFAULT 'manual',
  `status` ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `tracking_number` VARCHAR(100) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_orders_customer` (`customer_id`),
  INDEX `idx_orders_status` (`status`),
  INDEX `idx_orders_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Table: `order_items`
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` VARCHAR(36) NOT NULL,
  `order_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_order_items_order` (`order_id`),
  INDEX `idx_order_items_product` (`product_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. Table: `stock_logs`
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `stock_logs` (
  `id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `change_amount` INT NOT NULL,
  `previous_stock` INT NOT NULL,
  `new_stock` INT NOT NULL,
  `reason` VARCHAR(255) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_stock_logs_product` (`product_id`),
  CONSTRAINT `fk_stock_logs_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. Table: `stores` (Physical Retail Locations & Service Centers)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `stores` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `badge` VARCHAR(100) DEFAULT '',
  `badge_type` VARCHAR(50) DEFAULT 'meadow',
  `category` VARCHAR(100) DEFAULT 'Meadow Computer',
  `address` TEXT NOT NULL,
  `phone` VARCHAR(100) DEFAULT '',
  `hours` VARCHAR(255) DEFAULT '',
  `google_maps_url` TEXT DEFAULT NULL,
  `embed_map_url` TEXT DEFAULT NULL,
  `image_url` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `tags` LONGTEXT DEFAULT NULL,
  `features` LONGTEXT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 11. Table: `app_settings` (Structured Key-Value Storage for Banners/Pages)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 12. View: `auth_users` (Alias for Supabase auth.users compatibility)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW `auth_users` AS
SELECT
  `id`,
  `email`,
  `password_hash`,
  `role`,
  `created_at`
FROM `profiles`;

SET FOREIGN_KEY_CHECKS = 1;

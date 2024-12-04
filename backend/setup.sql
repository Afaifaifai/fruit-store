SHOW DATABASES;
USE fruit_store;
SHOW TABLES;
DROP TABLE IF EXISTS fruits;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS inactive_members;
DROP TABLE IF EXISTS suppliers;

CREATE TABLE fruits (
			fruit_id VARCHAR(10) PRIMARY KEY CHECK (fruit_id LIKE '^\d{2}-\d{3}-\d{3}-\d{2}$'), -- 水果編號 (格式: YY-YYY-YYY-YY)
			fruit_name VARCHAR(12) NOT NULL,          											-- 水果名稱 (最多 12 個字元)
			supplier_name VARCHAR(12) NOT NULL,       											-- 水果供應商名稱 (最多 12 個字元)
			quantity INT CHECK (quantity >= 0 AND quantity <= 999999), 							-- 公司內現有數量 (最多 6 位整數，且不可為負數)
			unit VARCHAR(4) NOT NULL,                 											-- 單位 (最多 4 個字元)
			purchase_price DECIMAL(8, 2) CHECK (purchase_price >= 0), 							-- 進貨單價 (6 位整數 + 2 位小數)
			total_value DECIMAL(8, 2) GENERATED ALWAYS AS (quantity * purchase_price), 			-- 現有價值小計
			storage_location VARCHAR(12) NOT NULL,    											-- 公司內存放位置 (最多 12 個字元)
			purchase_date DATE NOT NULL,              											-- 進貨日期
			promotion_start_date DATE,                											-- 開始促銷日期
			discard_date DATE                         											-- 該丟棄之日期
		)
        
CREATE TABLE members (
			member_id VARCHAR(10) PRIMARY KEY CHECK (member_id REGEXP '^[A-Z][0-9]{9}$'), -- 格式: 1 英文字母 + 9 數字
			member_name VARCHAR(12) NOT NULL,
			phone_number VARCHAR(10) CHECK (attribute LIKE '^\d{2}-\d{4}-\d{4}$'),
			mobile_number VARCHAR(10) CHECK (attribute LIKE '^\d{4}-\d{3}-\d{3}$'),
			email VARCHAR(36) NOT NULL,
			joined_line BOOLEAN DEFAULT FALSE,
			address VARCHAR(60),
			age INT CHECK (age >= 0),
			photo_base64 LONGTEXT, 
			discount DECIMAL(3, 2) DEFAULT 1.00 CHECK (discount >= 0 AND discount <= 1)
		)
-- CREATE TABLE fruits (
--     fruit_id VARCHAR(15) PRIMARY KEY,          -- 水果編號 (格式: YY-YYY-YYY-YY)
--     fruit_name VARCHAR(12) NOT NULL,          -- 水果名稱 (最多 12 個字元)
--     supplier_name VARCHAR(12) NOT NULL,       -- 水果供應商名稱 (最多 12 個字元)
--     quantity INT CHECK (quantity >= 0 AND quantity <= 999999), -- 公司內現有數量 (最多 6 位整數，且不可為負數)
--     unit VARCHAR(4) NOT NULL,                 -- 單位 (最多 4 個字元)
--     purchase_price DECIMAL(8, 2) CHECK (purchase_price >= 0), -- 進貨單價 (6 位整數 + 2 位小數)
--     total_value DECIMAL(8, 2) GENERATED ALWAYS AS (quantity * purchase_price), -- 現有價值小計
--     storage_location VARCHAR(12) NOT NULL,    -- 公司內存放位置 (最多 12 個字元)
--     purchase_date DATE NOT NULL,              -- 進貨日期
--     promotion_start_date DATE,                -- 開始促銷日期
--     discard_date DATE                         -- 該丟棄之日期
-- );

-- SELECT * FROM fruits;

-- CREATE TABLE members (
--     member_id VARCHAR(10) PRIMARY KEY CHECK (member_id REGEXP '^[A-Z][0-9]{9}$'), -- 格式: 1 英文字母 + 9 數字
--     member_name VARCHAR(12) NOT NULL,
--     phone_number VARCHAR(16),
--     mobile_number VARCHAR(16),
--     email VARCHAR(36) NOT NULL,
--     joined_line BOOLEAN DEFAULT FALSE,
--     address VARCHAR(60),
--     age INT CHECK (age >= 0),
--     photo_base64 LONGTEXT, 
--     discount DECIMAL(3, 2) DEFAULT 1.00 CHECK (discount >= 0 AND discount <= 1)
-- );

-- SELECT * FROM members;

-- CREATE TABLE inactive_members (
--     member_id VARCHAR(10) PRIMARY KEY CHECK (member_id REGEXP '^[A-Z][0-9]{9}$'), -- 格式: 1 英文字母 + 9 數字
--     member_name VARCHAR(12) NOT NULL,
--     phone_number VARCHAR(16),
--     mobile_number VARCHAR(16),
--     email VARCHAR(36) NOT NULL,
--     joined_line BOOLEAN DEFAULT FALSE,
--     address VARCHAR(60),
--     age INT CHECK (age >= 0),
--     photo_base64 LONGTEXT, 
--     discount DECIMAL(3, 2) DEFAULT 1.00 CHECK (discount >= 0 AND discount <= 1)
-- );

-- SELECT * FROM inactive_members;


-- CREATE TABLE suppliers (
--     supplier_id VARCHAR(8) PRIMARY KEY,        -- 供應商統一編號 (8 位數字)
--     supplier_name VARCHAR(12) NOT NULL,       -- 供應商名稱 (最多 12 個字元)
--     phone_number VARCHAR(16),                 -- 電話
--     email VARCHAR(36) NOT NULL,               -- Email
--     address VARCHAR(60),                      -- 住址
--     contact_name VARCHAR(12) NOT NULL         -- 負責人姓名
-- );

-- SELECT * FROM suppliers;
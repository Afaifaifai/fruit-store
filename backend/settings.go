package main

import "fmt"

const USERNAME string = "root"
const PASSWORD string = "0000"
const IP string = "127.0.0.1"
const SQL_PORT string = "3306"
const LISTEN_PORT = 8080

var dsn string = fmt.Sprintf("%s:%s@tcp(%s:%s)/", USERNAME, PASSWORD, IP, SQL_PORT) // username:password@tcp(ip:port)/mysql

const DATABASE_NAME = "fruit_store"

var TABLES = map[string]string{
	"fruits": `
		CREATE TABLE fruits (
			fruit_id VARCHAR(15) PRIMARY KEY CHECK (attribute ~ '^\d{2}-\d{3}-\d{3}-\d{2}$')    -- 水果編號 (格式: YY-YYY-YYY-YY)
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
	`,
	"members": `
		CREATE TABLE members (
			member_id VARCHAR(10) PRIMARY KEY CHECK (member_id REGEXP '^[A-Z][0-9]{9}$'), -- 格式: 1 英文字母 + 9 數字
			member_name VARCHAR(12) NOT NULL,
			phone_number VARCHAR(16) CHECK (attribute ~ '^\d{2}-\d{4}-\d{4}$'),
			mobile_number VARCHAR(16) CHECK (attribute ~ '^\d{4}-\d{3}-\d{3}$'),
			email VARCHAR(36) NOT NULL,
			joined_line BOOLEAN DEFAULT FALSE,
			address VARCHAR(60),
			age INT CHECK (age >= 0),
			photo_base64 LONGTEXT, 
			discount DECIMAL(3, 2) DEFAULT 1.00 CHECK (discount >= 0 AND discount <= 1)
		)
	`,
	"inactive_members": `
		CREATE TABLE inactive_members (
			member_id VARCHAR(10) PRIMARY KEY CHECK (member_id REGEXP '^[A-Z][0-9]{9}$'), -- 格式: 1 英文字母 + 9 數字
			member_name VARCHAR(12) NOT NULL,
			phone_number VARCHAR(16) CHECK (attribute ~ '^\d{2}-\d{4}-\d{4}$') ,
			mobile_number VARCHAR(16) CHECK (attribute ~ '^\d{4}-\d{3}-\d{3}$'),
			email VARCHAR(36) NOT NULL,
			joined_line BOOLEAN DEFAULT FALSE,
			address VARCHAR(60),
			age INT CHECK (age >= 0),
			photo_base64 LONGTEXT, 
			discount DECIMAL(3, 2) DEFAULT 1.00 CHECK (discount >= 0 AND discount <= 1)
		)
	`,
	"suppliers": `
		CREATE TABLE suppliers (
			supplier_id VARCHAR(8) PRIMARY KEY,       -- 供應商統一編號 (8 位數字)
			supplier_name VARCHAR(12) NOT NULL,       -- 供應商名稱 (最多 12 個字元)
			phone_number VARCHAR(16),                 -- 電話
			email VARCHAR(36) NOT NULL,               -- Email
			address VARCHAR(60),                      -- 住址
			contact_name VARCHAR(12) NOT NULL         -- 負責人姓名
		)
	`,
}

var TABLE_INSERT = map[string][]string{
	"fruits": {
		`INSERT INTO fruits (fruit_id, fruit_name, email, supplier_name, quantity, unit, purchase_price, total_value, storage_location, purchase_date, promotion_start_date, discard_date) 
		VALUES ('12-345-678-90', '火龍果', '銘傳水果公司', 30, '粒', 10.00, 300.00, '一樓冷藏倉庫', 2022-11-04, 2022-11-08, 2022-11-12)`,
		`INSERT INTO fruits (fruit_id, fruit_name, email, supplier_name, quantity, unit, purchase_price, total_value, storage_location, purchase_date, promotion_start_date, discard_date),
		VALUES ('12-345-678-91', '蘋果', '銘傳水果公司司', 30, '粒', 10.00, 300.00, '一樓冷藏倉庫', 2022-11-04, 2022-11-08, 2022-11-12)`,
		`INSERT INTO fruits (fruit_id, fruit_name, email, supplier_name, quantity, unit, purchase_price, total_value, storage_location, purchase_date, promotion_start_date, discard_date),
		VALUES ('12-345-678-92', '蘋果', '銘傳水果公司司', 30, '粒', 10.00, 300.00, '一樓冷藏倉庫', 2022-11-04, 2022-11-08, 2022-11-12)`,
	},
	"members": {
		`INSERT INTO members (member_id, member_name, phone_number, mobile_number, email, joined_line, address, age, discount) 
		VALUES ('B123456789', '純純', '04-2345-6666', '0910-000-000', 'xxxx@thu.edu.tw', '是', '台中市仰德大道 YY 號', 20, 0.88)`,
		`INSERT INTO members (member_id, member_name, phone_number, mobile_number, email, joined_line, address, age, discount) 
		VALUES ('A123456789', '一純純', '04-2345-6666', '0910-000-001', 'yxxx@thu.edu.tw', '是', '台中市仰德大道 YY 號', 20, 0.88)`,
		`INSERT INTO members (member_id, member_name, phone_number, mobile_number, email, joined_line, address, age, discount) 
		VALUES ('C123456789', '二純純', '04-2345-6666', '0910-000-001', 'yyxx@thu.edu.tw', '是', '台中市仰德大道 YY 號', 20, 0.88)`,
	},
	"inactive_members": {
		`INSERT INTO members (member_id, member_name, phone_number, mobile_number, email, joined_line, address, age, discount) 
		VALUES ('D123456789', '三純純', '04-2345-6666', '0910-000-000', 'xxxx@thu.edu.tw', '是', '台中市仰德大道 YY 號', 20, 0.88)`,
		`INSERT INTO members (member_id, member_name, phone_number, mobile_number, email, joined_line, address, age, discount) 
		VALUES ('E123456789', '四純純', '04-2345-6666', '0910-000-001', 'yxxx@thu.edu.tw', '是', '台中市仰德大道 YY 號', 20, 0.88)`,
		`INSERT INTO members (member_id, member_name, phone_number, mobile_number, email, joined_line, address, age, discount) 
		VALUES ('F123456789', '五純純', '04-2345-6666', '0910-000-001', 'yyxx@thu.edu.tw', '是', '台中市仰德大道 YY 號', 20, 0.88)`,
	},
	"suppliers": {
		`INSERT INTO suppliers (supplier_id, supplier_name, phone_number, email, address, contact_name) 
		VALUES ('12345678', '海岸水果批發公司', 04-2359-0121, 'yyyy@coast.com', '台中市仰德大道ZZ號', '王海東')`,
		"INSERT INTO suppliers VALUES (2, 'ProductB', 15.49)",
		"INSERT INTO suppliers VALUES ('12345678', '海岸水果批發公司', 04-2359-0121, 'yyyy@coast.com', '台中市仰德大道ZZ號', '王海東')",
		// 添加更多初始化元組的指令
	},
}

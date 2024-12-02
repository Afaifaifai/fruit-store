package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// 設定資料庫連線資訊
	dsn := "root:0000@tcp(127.0.0.1:3306)/mysql" // 替換為你的 MySQL 資料庫資訊

	// 建立資料庫連線
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("資料庫連線失敗: %v", err)
	}
	defer db.Close()

	// 測試資料庫連線
	err = db.Ping()
	if err != nil {
		log.Fatalf("資料庫Ping失敗: %v", err)
	}
	fmt.Println("資料庫連線成功！")

	// 測試調出資料
	query := "SELECT * FROM fruits" // 替換為你的資料表名稱
	rows, err := db.Query(query)
	if err != nil {
		log.Fatalf("查詢資料失敗: %v", err)
	}
	defer rows.Close()

	// 解析資料
	columns, err := rows.Columns()
	if err != nil {
		log.Fatalf("獲取欄位名稱失敗: %v", err)
	}

	// 動態掃描每列資料
	for rows.Next() {
		// 建立一個切片用於儲存每列資料
		values := make([]interface{}, len(columns))
		for i := range values {
			values[i] = new(interface{})
		}

		// 掃描這列資料到 values
		err := rows.Scan(values...)
		if err != nil {
			log.Fatalf("掃描資料失敗: %v", err)
		}

		// 顯示資料
		fmt.Println("資料列:")
		for i, column := range columns {
			fmt.Printf("  %s: %v\n", column, *(values[i].(*interface{})))
		}
	}

	if err = rows.Err(); err != nil {
		log.Fatalf("處理列時出現錯誤: %v", err)
	}
	fmt.Println("資料查詢成功！")
}

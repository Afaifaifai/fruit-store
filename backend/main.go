package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

// import (
// 	_ "github.com/go-sql-driver/mysql"
// )

// func main() {
// fmt.Println(Dsn)
// Init()

// 設定資料庫連線資訊
// dsn := "root:0000@tcp(127.0.0.1:3306)/mysql" // 替換為你的 MySQL 資料庫資訊

// // 建立資料庫連線
// db, err := sql.Open("mysql", dsn)
// if err != nil {
// 	log.Fatalf("Cannot connect to the MySQL server: %v", err)
// }
// defer db.Close()

// var db_name string = "fruit_store"
// // 測試資料庫連線
// err = db.Ping()
// if err != nil {
// 	log.Fatalf("資料庫Ping失敗: %v", err)
// }
// fmt.Println("資料庫連線成功！")

// // 測試調出資料
// query := "SELECT * FROM fruits" // 替換為你的資料表名稱
// rows, err := db.Query(query)
// if err != nil {
// 	log.Fatalf("查詢資料失敗: %v", err)
// }
// defer rows.Close()

// // 解析資料
// columns, err := rows.Columns()
// if err != nil {
// 	log.Fatalf("獲取欄位名稱失敗: %v", err)
// }

// // 動態掃描每列資料
// for rows.Next() {
// 	// 建立一個切片用於儲存每列資料
// 	values := make([]interface{}, len(columns))
// 	for i := range values {
// 		values[i] = new(interface{})
// 	}

// 	// 掃描這列資料到 values
// 	err := rows.Scan(values...)
// 	if err != nil {
// 		log.Fatalf("掃描資料失敗: %v", err)
// 	}

// 	// 顯示資料
// 	fmt.Println("資料列:")
// 	for i, column := range columns {
// 		fmt.Printf("  %s: %v\n", column, *(values[i].(*interface{})))
// 	}
// }

// if err = rows.Err(); err != nil {
// 	log.Fatalf("處理列時出現錯誤: %v", err)
// }
// fmt.Println("資料查詢成功！")

// }

// import (
// 	"encoding/json"
// 	"fmt"
// 	"io/ioutil"
// 	"log"
// 	"net/http"
// 	"strings"
// )

// CORS middleware to allow all origins
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 設置 CORS 標頭
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")

		// 處理預檢請求
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// 繼續處理下一個處理器
		next.ServeHTTP(w, r)
	})
}

// 通用 API 處理器
func apiHandler(w http.ResponseWriter, r *http.Request) {
	// 獲取 API 路徑，例如 /api/fruits -> fruits
	fmt.Println(r.URL.Path)
	pathParts := strings.Split(r.URL.Path, "/")
	fmt.Println(pathParts)
	if len(pathParts) < 3 {
		http.Error(w, "無效的 API 路徑", http.StatusBadRequest)
		return
	}
	apiResource := pathParts[2]

	// 讀取請求體
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "無法讀取請求體", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// 如果內容類型是 JSON，則解析並打印
	if strings.Contains(r.Header.Get("Content-Type"), "application/json") {
		var jsonData interface{}
		if err := json.Unmarshal(body, &jsonData); err != nil {
			log.Printf("收到非有效 JSON 格式的請求: %s", err)
			fmt.Println("收到非有效 JSON 格式的請求")
		} else {
			prettyJSON, _ := json.MarshalIndent(jsonData, "", "  ")
			// log.Printf("收到 JSON 請求資源: %s\n內容:\n%s\n", apiResource, string(prettyJSON))
			fmt.Printf("收到 JSON 請求資源: %s\n內容:\n%s\n", apiResource, string(prettyJSON))
		}
	} else {
		// 否則，作為純文字打印
		// log.Printf("收到非 JSON 請求資源: %s\n內容:\n%s\n", apiResource, string(body))
		fmt.Printf("收到非 JSON 請求資源: %s\n內容:\n%s\n", apiResource, string(body))
	}

	// 回應客戶端
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{
		"status":  "success",
		"message": "訊息已收到並打印",
	}
	json.NewEncoder(w).Encode(response)
}

func main() {
	// 設置 API 路由
	http.Handle("/api/", enableCORS(http.HandlerFunc(apiHandler)))

	// 啟動伺服器
	port := ":8080"
	log.Printf("伺服器啟動中，監聽端口 %s", port)
	fmt.Printf("伺服器啟動中，監聽端口 %s\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("伺服器啟動失敗: %s", err)
	}
}

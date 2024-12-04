package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	fmt.Println(dsn)
	Init()

	// http.Handle("/api/", enableCORS(http.HandlerFunc(apiHandler)))

	// // 啟動伺服器
	// port := ":8080"
	// log.Printf("伺服器啟動中，監聽端口 %s", port)
	// fmt.Printf("伺服器啟動中，監聽端口 %s\n", port)
	// if err := http.ListenAndServe(port, nil); err != nil {
	// 	log.Fatalf("伺服器啟動失敗: %s", err)
	// }
	
}

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

	api_table, api_method := pathParts[len(pathParts)-2], pathParts[len(pathParts)-1]
	fmt.Printf("%s %s\n", api_table, api_method)

	// 讀取請求體
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "無法讀取請求體", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	fmt.Println(r.Method)
	// 如果內容類型是 JSON，則解析並打印
	if strings.Contains(r.Header.Get("Content-Type"), "application/json") {
		var jsonData interface{}
		if err := json.Unmarshal(body, &jsonData); err != nil {
			log.Printf("收到非有效 JSON 格式的請求: %s", err)
			fmt.Println("收到非有效 JSON 格式的請求")
		} else {
			prettyJSON, _ := json.MarshalIndent(jsonData, "", "  ")
			// log.Printf("收到 JSON 請求資源: %s\n內容:\n%s\n", apiResource, string(prettyJSON))
			fmt.Printf("收到 JSON 請求資源: %s %s\n內容:\n%s\n", api_table, api_method, string(prettyJSON))
		}
	} else {
		// 否則，作為純文字打印
		// log.Printf("收到非 JSON 請求資源: %s\n內容:\n%s\n", apiResource, string(body))
		// fmt.Printf("收到非 JSON 請求資源: %s\n內容:\n%s\n", apiResource, string(body))
		var jsonData interface{}
		if err := json.Unmarshal(body, &jsonData); err != nil {
			log.Printf("收到非有效 JSON 格式的請求: %s", err)
			fmt.Println("收到非有效 JSON 格式的請求")
		} else {
			prettyJSON, _ := json.MarshalIndent(jsonData, "", "  ")
			// log.Printf("收到 JSON 請求資源: %s\n內容:\n%s\n", apiResource, string(prettyJSON))
			fmt.Printf("收到 JSON 請求資源: %s %s\n內容:\n%s\n", api_table, api_method, string(prettyJSON))
		}
	}

	// 回應客戶端
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{
		"status":  "success",
		"message": "訊息已收到並打印",
	}
	json.NewEncoder(w).Encode(response)
}

// func main() {
// 	// 設置 API 路由
// 	http.Handle("/api/", enableCORS(http.HandlerFunc(apiHandler)))

// 	// 啟動伺服器
// 	port := ":8080"
// 	log.Printf("伺服器啟動中，監聽端口 %s", port)
// 	fmt.Printf("伺服器啟動中，監聽端口 %s\n", port)
// 	if err := http.ListenAndServe(port, nil); err != nil {
// 		log.Fatalf("伺服器啟動失敗: %s", err)
// 	}
// }

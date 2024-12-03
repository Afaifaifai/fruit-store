package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/rs/cors"
)

type Response struct {
	Message string `json:"message"`
	Time    string `json:"time"`
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("收到請求:", r.Method, r.URL.Path)
	w.Header().Set("Content-Type", "application/json")
	resp := Response{
		Message: "Hello from Go!",
		Time:    time.Now().Format(time.RFC3339),
	}
	json.NewEncoder(w).Encode(resp)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/hello", helloHandler)

	// 設定 CORS，允許多個前端來源
	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000",
			"http://192.168.168.204:3000",
			"http://169.254.85.142:3000",
			"http://127.0.0.1:3000",
			// 如果有更多前端來源，繼續添加
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true, // 如果需要攜帶憑證（如 Cookies）
	})

	// 將 CORS 中間件包裝到 mux
	handler := c.Handler(mux)

	log.Println("Server is running on http://localhost:8080")
	if err := http.ListenAndServe("0.0.0.0:8080", handler); err != nil {
		log.Fatal(err)
	}
}

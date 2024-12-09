package main

import (
	"fmt"
	"os"
)

const LISTEN_PORT string = "0.0.0.0:8080"

var USERNAME string = os.Getenv("DB_USER")       // 從環境變數中讀取
var PASSWORD string = os.Getenv("DB_PASSWORD")   // 從環境變數中讀取
var IP string = os.Getenv("DB_HOST")             // 從環境變數中讀取
var SQL_PORT string = os.Getenv("DB_PORT")       // 從環境變數中讀取

var dsn string = fmt.Sprintf("%s:%s@tcp(%s:%s)/", USERNAME, PASSWORD, IP, SQL_PORT)

const DATABASE_NAME string = "fruit_store"
const RESET_DATABASE bool = true

var Tables []Table = []Table{fruits, members, inactive, suppliers, transactions}


package main

import "fmt"

const USERNAME string = "sa"
const PASSWORD string = "0000"
const SERVER_IP string = "127.0.0.1"
const SQL_PORT string = "1433"
const LISTEN_PORT string = "0.0.0.0:8080"

const DATABASE_NAME string = "DESKTOP-4HA740L"

var dsn string = fmt.Sprintf("server=%s;port=%s;user id=%s;password=%s;database=%s", SERVER_IP, SQL_PORT, USERNAME, PASSWORD, DATABASE_NAME) // username:password@tcp(ip:port)/mysql

const RESET_DATABASE bool = true

var Tables []Table = []Table{fruits, members, inactive, suppliers, transactions}

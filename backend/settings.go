package main

import "fmt"

const USERNAME string = "root"
const PASSWORD string = "0000"
const IP string = "127.0.0.1"
const SQL_PORT string = "3306"
const LISTEN_PORT = 8080

var dsn string = fmt.Sprintf("%s:%s@tcp(%s:%s)/", USERNAME, PASSWORD, IP, SQL_PORT) // username:password@tcp(ip:port)/mysql

const DATABASE_NAME string = "fruit_store"

const RESET_DATABASE bool = true

var Tables []Table = []Table{fruits, members, inactive_members, suppliers, transactions}

package main

import "fmt"

const USERNAME string = "root"
const PASSWORD string = "0000"
const IP string = "127.0.0.1"
const PORT string = "3306"

var dsn string = fmt.Sprintf("%s:%s@tcp(%s:%s)/", USERNAME, PASSWORD, IP, PORT) // username:password@tcp(ip:port)/mysql

const DATABASE_NAME = "fruit_store"

var TABLES = map[string]string{
	"users": `
		CREATE TABLE users (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`,
	"products": `
		CREATE TABLE products (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			price DECIMAL(10, 2) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`,
}

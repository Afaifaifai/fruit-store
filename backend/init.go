package main

import (
	"database/sql"
	"fmt"
	"log"
)

func Init() {
	// Database connection string, first connect to the MySQL server
	fmt.Println(dsn)
	db_server, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to the MySQL server: %v", err)
	}
	// defer db_server.Close()

	err = ensure_database_exists(db_server, DATABASE_NAME)
	if err != nil {
		log.Fatalf("Failed to initialize the database: %v", err)
	}

	// Connect to the specified database
	dsn_with_DB := fmt.Sprintf(dsn + DATABASE_NAME)
	db, err := sql.Open("mysql", dsn_with_DB)
	if err != nil {
		log.Fatalf("Failed to connect to the specified database %s: %v", DATABASE_NAME, err)
	}
	defer db.Close()

	// Check and initialize tables
	for table_name, table_content := range TABLES {
		err = ensure_table_exists(db, table_name, table_content)
		if err != nil {
			log.Fatalf("Failed to initialize the table %s: %v", table_name, err)
		}
	}
	fmt.Println("Database and tables initialization complete!")
}

func ensure_database_exists(db *sql.DB, database_name string) error {
	// Check if the database exists
	query := fmt.Sprintf("SHOW DATABASES LIKE '%s'", database_name)
	fmt.Println(query)
	var result string
	err := db.QueryRow(query).Scan(&result)
	if err != nil && err != sql.ErrNoRows {
		return fmt.Errorf("failed to check the database: %v", err)
	}

	// If the database does not exist, create it
	if result == "" {
		fmt.Printf("The database %s does not exist, creating...\n", database_name)
		_, err := db.Exec(fmt.Sprintf("CREATE DATABASE %s", database_name))
		if err != nil {
			return fmt.Errorf("failed to create the database: %v", err)
		}
		fmt.Printf("The database %s has been created successfully!\n", database_name)
	} else {
		fmt.Printf("The database %s already exists.\n", database_name)
	}

	return nil
}

// Ensure the table exists function
func ensure_table_exists(db *sql.DB, table_name string, table_content string) error {
	// Check if the table exists
	query := fmt.Sprintf("SHOW TABLES LIKE '%s'", table_name)
	var result string
	err := db.QueryRow(query).Scan(&result)
	if err != nil && err != sql.ErrNoRows {
		return fmt.Errorf("failed to check the table: %v", err)
	}

	// If the table does not exist, create it
	if result == "" {
		fmt.Printf("The table %s does not exist, creating...\n", table_name)
		_, err := db.Exec(table_content)
		if err != nil {
			return fmt.Errorf("failed to create the table: %v", err)
		}
		fmt.Printf("The table %s has been created successfully!\n", table_name)
	} else {
		fmt.Printf("The table %s already exists.\n", table_name)
	}

	return nil
}

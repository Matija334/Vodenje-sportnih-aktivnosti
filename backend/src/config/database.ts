import sqlite3 from "sqlite3";
import { Database } from "sqlite3";

// Uporabimo verbose način SQLite
const sqlite = sqlite3.verbose();

// Inicializiramo bazo podatkov
const db: Database = new sqlite.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Database connected successfully.");

        // Ustvarimo tabelo 'events'
        db.run(`
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                date TEXT,
                location TEXT,
                organizer TEXT
            );
        `, (err) => {
            if (err) {
                console.error("Error creating 'events' table:", err.message);
            } else {
                console.log("'events' table created or already exists.");
            }
        });

        // Ustvarimo tabelo 'users'
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                password TEXT,
                fullName TEXT,
                role TEXT
            );
        `, (err) => {
            if (err) {
                console.error("Error creating 'users' table:", err.message);
            } else {
                console.log("'users' table created or already exists.");
            }
        });

        // Ustvarimo tabelo 'Registrations'
        db.run(`
            CREATE TABLE IF NOT EXISTS Registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER,
                user_id INTEGER,
                FOREIGN KEY (event_id) REFERENCES events(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `, (err) => {
            if (err) {
                console.error("Error creating 'Registrations' table:", err.message);
            } else {
                console.log("'Registrations' table created or already exists.");
            }
        });

        // Ustvarimo tabelo 'notifications'
        db.run(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                message TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `, (err) => {
            if (err) {
                console.error("Error creating 'notifications' table:", err.message);
            } else {
                console.log("'notifications' table created or already exists.");
            }
        });
    }
});

// Izvoz baze podatkov
export default db;

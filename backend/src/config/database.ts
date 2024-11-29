import sqlite3, { Database } from 'sqlite3';

const isTestEnv = process.env.NODE_ENV === 'test';

// Izbira baze glede na okolje: testno (`:memory:`) ali produkcijsko
const db: Database = new sqlite3.Database(
    isTestEnv ? ':memory:' : './database.sqlite',
    (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Database connected successfully.');
            initializeDatabase();
        }
    }
);

// Funkcija za inicializacijo baze
const initializeDatabase = () => {
    db.serialize(() => {
        // Tabela 'events'
        db.run(
            `CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        location TEXT,
        organizer TEXT NOT NULL
      );`,
            (err) => {
                if (err) {
                    console.error('Error creating "events" table:', err.message);
                } else {
                    console.log('"events" table created or already exists.');
                }
            }
        );

        // Tabela 'users'
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        fullName TEXT NOT NULL,
        role TEXT NOT NULL
      );`,
            (err) => {
                if (err) {
                    console.error('Error creating "users" table:', err.message);
                } else {
                    console.log('"users" table created or already exists.');
                }
            }
        );

        // Tabela 'registrations'
        db.run(
            `CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (event_id) REFERENCES events(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );`,
            (err) => {
                if (err) {
                    console.error('Error creating "registrations" table:', err.message);
                } else {
                    console.log('"registrations" table created or already exists.');
                }
            }
        );

        // Tabela 'notifications'
        db.run(
            `CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );`,
            (err) => {
                if (err) {
                    console.error('Error creating "notifications" table:', err.message);
                } else {
                    console.log('"notifications" table created or already exists.');
                }
            }
        );
    });
};

export default db;

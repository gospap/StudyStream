import Database from "better-sqlite3";

// Δημιουργία ή άνοιγμα μόνιμης βάσης
const db = new Database("./database.sqlite");

// Δημιουργία πινάκων αν δεν υπάρχουν
db.exec(`CREATE TABLE IF NOT EXISTS users (                   
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

db.exec(`CREATE TABLE IF NOT EXISTS courses (
    course_id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    description TEXT,
    link TEXT UNIQUE
)`);

export default db;

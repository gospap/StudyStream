import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Εκτελείται αμέσως και δημιουργεί πίνακες
(async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      email TEXT UNIQUE,
      reset_token TEXT,
      reset_token_expiry TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS courses (
      course_id SERIAL PRIMARY KEY,
      name TEXT UNIQUE,
      description TEXT,
      link TEXT UNIQUE
    )`);
  } catch (err) {
    console.error("Error creating tables:", err);
  }
})();

export default {
  query: (text, params) => pool.query(text, params),
};

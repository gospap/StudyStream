import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import db from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const JWT_SECRET = process.env.JWT_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json()); // Parse incoming JSON requests

const PORT = 4000;

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username or password is missing" });
    }

    const { rows } = await db.query(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);
    const searchUsername = rows[0];

    if (!searchUsername) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(
      password,
      searchUsername.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token and send it back
    const token = jwt.sign(
      { id: searchUsername.id, username: searchUsername.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Signup endpoint
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const { rows } = await db.query(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);
    const check = rows[0];

    if (check) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [
      username,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add course endpoint (only accessible to authenticated users)
app.post("/api/course", async (req, res) => {
  const { course_id, name, description, link } = req.body;

  // Check if course already exists
  const { rows } = await db.query(`SELECT * FROM courses WHERE course_id=$1`, [
    course_id,
  ]);
  const exists = rows[0];
  if (exists) {
    return res.status(400).json({ message: "Course already exists" });
  }

  // Insert new course
  try {
    await db.query(
      `INSERT INTO courses (course_id, name, description, link) VALUES ($1, $2, $3, $4)`,
      [course_id, name, description, link]
    );
    res.status(201).json({ message: "Course added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/deletecourse", async (req, res) => {
  const { course_id } = req.body;

  console.log("Received course_id:", course_id); // Log the received course_id

  // Check if the course exists
  const { rows } = await db.query(`SELECT * FROM courses WHERE course_id=$1`, [
    course_id,
  ]);
  const course = rows[0];

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  console.log("Course found:", course); // Log the course to confirm it exists

  // Proceed with deleting the course
  try {
    await db.query(`DELETE FROM courses WHERE course_id=$1`, [course_id]);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err); // Log the error
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all courses endpoint
app.get("/api/getcourses", async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * FROM courses`);
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

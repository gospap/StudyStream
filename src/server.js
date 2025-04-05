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

    const searchUsername = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);
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

    const check = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);
    if (check) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertion = db.prepare(
      `INSERT INTO users (username, password) VALUES (?, ?)`
    );
    insertion.run(username, hashedPassword);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add course endpoint (only accessible to authenticated users)
app.post("/api/course", (req, res) => {
  const { course_id, name, description, link } = req.body;

  // Check if course already exists
  const exists = db
    .prepare(`SELECT * FROM courses WHERE course_id=?`)
    .get(course_id);
  if (exists) {
    return res.status(400).json({ message: "Course already exists" });
  }

  // Insert new course
  try {
    const insertCourse = db.prepare(
      `INSERT INTO courses (course_id, name, description, link) VALUES (?, ?, ?, ?)`
    );
    insertCourse.run(course_id, name, description, link);
    res.status(201).json({ message: "Course added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all courses endpoint
app.get("/api/getcourses", (req, res) => {
  try {
    const courses = db.prepare(`SELECT * FROM courses`).all();
    res.json(courses);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import db from "./db.js";
import bcrypt from "bcryptjs";
const app = express();
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
app.use(express.json());
const PORT = 4000;

const JWT_SECRET = process.env.JWT_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//post endpoint for logging in a user | get the fields from the front end make a token make sure it matches and then go to next() after verification
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(404)
        .json({ message: "password or username is missing" });
    }

    const searchUsername = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);
    if (!searchUsername) {
      return res.status(404).json({ message: "user not found" });
    }

    // Await the bcrypt comparison
    const isPasswordValid = await bcrypt.compare(
      password,
      searchUsername.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create the token and return it
    const token = jwt.sign(
      { id: searchUsername.id, username: searchUsername.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token }); // return it

    // as soon as the user has logged in then he/she can navigate through the app
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//post endpoint for creating a user | get the req body and destructure it hash the password and enter at db
app.post("/api/signup", (req, res) => {
  try {
    const { username, password } = req.body;

    // check if its an existing user
    const check = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);
    if (check) {
      // the user already exists
      res.status(409).json({ message: "user already exists" });
    }

    // hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);
    //insert user to the table users
    const insertion = db.prepare(
      `INSERT INTO users (username,password) VALUES (?,?)`
    );
    insertion.run(username, hashedPassword);
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500); // error in backend
  }
});

// add a course
app.post("/api/course", (req, res) => {
  try {
    const { course_id, name, description, link } = req.body;
    //check if it already exists in the db
    const exists = db
      .prepare(`SELECT * FROM courses WHERE course_id=?`)
      .get(course_id);

    if (exists) {
      res.status(404).json({ message: "already exists" });
    }

    //insert it into the database
    const insertCourse = db.prepare(`INSERT INTO courses VALUES (?,?,?,?)`);
    insertCourse.run(course_id, name, description, link);
    res.sendStatus(201);
  } catch (err) {
    res.status(503).json("internal server error");
  }
});

// return to front end all courses
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
  console.log(`server is running -> http://localhost:${PORT}`);
});

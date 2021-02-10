require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const PORT = process.env.PORT;
const uploadMiddleware = require("./middleware/multer.middleware");
const fs = require("fs");
const path = require("path");
async function startServer() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST, // address of the server
    user: process.env.DB_USER, // username
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const app = express();

  app.use(express.json());
  app.use(cors());

  app.get(
    "/",
    (req, res) => {
      res.json({ message: "Welcome to Your projects" });
    }
  );

  app.post("/api/projects", uploadMiddleware, async (req, res) => {
    const { projectTitle, projectDescription, projectURL, githubLink } = req.body;
    const projectImage = req.file.filename;

    if (projectTitle, projectDescription, projectURL, projectImage, githubLink) {
      await db.execute(
        `insert into projects(title, description ,project_URL, project_image, github_link) values(?, ? ,? ,?, ?)`,
        [
          projectTitle,
          projectDescription,
          projectURL,
          projectImage,
          githubLink
        ]
      );

      res.json({ message: "project added" });
    } else {
      res.status(400).json({
        error: "project could not be created.Please enter all details!",
      });
    }
  });

  app.get("/api/projects", async (req, res) => {
    const [results] = await db.execute(
      `SELECT *
    FROM projects`
    );

    res.json(results);
  });

  app.use("/api/image", express.static("uploads"));
  
  await createTables(db);

  app.listen(PORT, () => {
    console.log(`serving on http://localhost:${PORT}`);
  });
}

startServer();

async function createTables(db) {
  await db.execute(`
  DROP TABLE projects;
  `);
  await db.execute(`
  CREATE TABLE IF NOT EXISTS projects(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500) NOT NULL,
    project_URL VARCHAR(255) NOT NULL,
    github_link VARCHAR(255) NOT NULL,
    project_image VARCHAR(255) NOT NULL
  );
  `);
}

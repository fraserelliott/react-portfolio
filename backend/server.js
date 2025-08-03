const express = require("express");
const path = require("path");
const cors = require("cors");

console.log("Working directory:", process.cwd());
console.log("Env vars:", {
  DATABASE_URL: process.env.DATABASE_URL,
});

const { sequelize, testConnection } = require("./config/connection");
testConnection(); // Exits loudly if there's an issue in the config

const app = express();
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

const routes = require("./routes/index.route");
app.use("/api", routes);

// TODO: Page for individual project viewing, serve index still but page will need to check href.location
// app.get("/project/:id", (req, res) => {
//     res.sendFile(path.join(__dirname, "static-pages", "project.html"));
// });

// Custom 404 page
app.all(/.*/, (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "static-pages", "404.html"));
});

// Error logging
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3001;

// Sync database
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
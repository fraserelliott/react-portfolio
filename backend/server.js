const express = require("express");
const path = require("path");

const { sequelize, testConnection } = require("./config/connection");
testConnection(); // Exits loudly if there's an issue in the config

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const routes = require("./routes/index.route");
app.use("/api", routes);

// Page for individual project viewing
app.get("/project/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "static-pages", "project.html"));
});

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
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const cors = require("cors");

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

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
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
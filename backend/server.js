  const express = require("express");
  const cors = require("cors");
  const path = require("path");
  const app = express();
  const bodyParser = require("body-parser");
  const PORT = 8050;  
  const db = require("./db");
  const router = require("./routes/router");
  // const authRoutes = require('./auth/authRoutes');

  // Database connection
  db.connect();

  // Middleware
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  app.use(cors());

  // // API routes
  app.use(router);

  // Serve static files from the frontend build folder
  app.use(express.static(path.join(__dirname, "/../frontend/build")));

  // For any other routes, serve the React app
  app.get("*", (req, res) => {
    try {
      res.sendFile(path.join(__dirname, "/../frontend/build/index.html"));
    } catch (e) {
      res.send("Oops! unexpected error");
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Listening on port no ${PORT}`);
  });

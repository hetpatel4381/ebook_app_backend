import express from "express";

const app = express();

// Routes
// Http: methods:- GET, POST, PATCH, DELETE.
app.get("/", (req, res) => {
  res.json({ message: "Welcome to elib apis" });
});

export default app;

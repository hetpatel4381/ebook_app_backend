import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRoutes from "./user/userRoutes";

const app = express();

// Routes
// Http: methods:- GET, POST, PATCH, DELETE.
app.get("/", (req, res) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use("/api/users", userRoutes);

// Global error handler.
app.use(globalErrorHandler);

export default app;

import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRoutes from "./user/userRoutes";
import bookRoutes from "./book/bookRoutes";

const app = express();
app.use(express.json());

// Routes
// Http: methods:- GET, POST, PATCH, DELETE.
app.get("/", (req, res) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

// Global error handler.
app.use(globalErrorHandler);

export default app;

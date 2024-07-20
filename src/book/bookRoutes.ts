import express from "express";
import {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
} from "./bookController";
import multer from "multer";
import path from "path";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

// file store local -->
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 1e7 },
});

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

// update book
bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

// get all books
bookRouter.get("/", getAllBooks);
bookRouter.get("/:bookId", getSingleBook);

export default bookRouter;

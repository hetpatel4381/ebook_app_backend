import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "fs";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;

    // const userId = req.user._id;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );

    const uploadCoverImage = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileMemeType = files.file[0].mimetype.split("/").at(-1);
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const uploadBookFile = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-files",
      format: bookFileMemeType,
    });

    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadCoverImage.secure_url,
      file: uploadBookFile.secure_url,
    });

    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    return res.status(201).send({ newBook: newBook });
  } catch (error) {
    return next(createHttpError(500, "Error while uploading the files!"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book Not Found!"));
    }

    // Check access
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "User is not Authorized!"));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // check if the coverImage is exists.
    let completeCoverImage = "";
    if (files.coverImage) {
      const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
      const fileName = files.coverImage[0].filename;
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
      );

      const uploadCoverImage = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: "book-covers",
        format: coverImageMimeType,
      });

      completeCoverImage = uploadCoverImage.secure_url;
      await fs.promises.unlink(filePath);
    }

    // check if the file is exists.
    let completeFile = "";
    if (files.file) {
      const bookFileMemeType = files.file[0].mimetype.split("/").at(-1);
      const bookFileName = files.file[0].filename;
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        bookFileName
      );

      const uploadBookFile = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-files",
        format: bookFileMemeType,
      });

      completeFile = uploadBookFile.secure_url;
      await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        title: title,
        genre: genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeFile ? completeFile : book.file,
      },
      { new: true }
    );

    return res.status(200).send({ updatedBook: updatedBook });
  } catch (error) {
    return next(createHttpError(500, "Error while updating Book!"));
  }
};

export { createBook, updateBook };
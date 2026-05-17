import { Request } from "express";
import multer, { diskStorage, FileFilterCallback } from "multer";
import path from "path"
import { AppError } from "../utils/app.error";

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads")
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}${path.extname(file.originalname)}`
        cb(null, fileName)
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new AppError(400, "Only JPEG, PNG, and GIF files are allowed"))
    }
    cb(null, true)
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})
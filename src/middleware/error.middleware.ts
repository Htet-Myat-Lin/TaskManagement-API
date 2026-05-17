import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../utils/app.error";
import { ZodError } from "zod";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err)

    if (err instanceof ZodError) {
        return res.status(400).json({
            status: "error",
            errors: err.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message
            })),
            message: "Validation error"
        })
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            const fields =
                (err.meta as any)?.target ||
                (err.meta as any)?.driverAdapterError?.cause?.constraint?.fields;

            const fieldName = fields?.join(", ") || "field";
            return res.status(400).json({
                status: "error",
                message: `${fieldName} already exists.`
            })
        }
        if (err.code === "P2025") {
            return res.status(404).json({
                status: "error",
                message: "Record not found."
            })
        }
    }

    if (err instanceof AppError) {
        const { statusCode, message } = err;
        return res.status(statusCode).json({
            status: "error",
            message
        })
    }

    res.status(500).json({
        status: "error",
        message: "An unexpected error occurred."
    })
}
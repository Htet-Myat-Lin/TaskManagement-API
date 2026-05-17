import { Response } from "express"

export const sendSuccessResponse = (res: Response, statusCode: number = 200, content: any = null, message: string = "Success") => {
    return res.status(statusCode).json({
        status: "success",
        message,
        content
    })
} 
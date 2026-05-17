import express from "express"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"
import { globalErrorHandler } from "./middleware/error.middleware"
import { memberRouter } from "./features/members/member.route"
import { taskRouter } from "./features/tasks/task.route"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(morgan("dev"))
app.use(cors({ origin: "http://localhost:7000" }))

app.use("/uploads", express.static("uploads"))
app.use("/api/v1/members", memberRouter)
app.use("/api/v1/tasks", taskRouter)

app.use(globalErrorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
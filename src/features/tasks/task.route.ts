import { Router } from "express";
import { bulkDeleteTasks, bulkStatusUpdate, createTask, deleteTask, editTask, getTaskCountByStatus, getTasks, getTasksByStatus } from "./task.controller";
import { validate } from "../../middleware/validation.middleware";
import { createTaskSchema } from "./task.validate";

const router = Router()

router.route("/")
    .get(getTasks)
    .post(validate(createTaskSchema), createTask)

router.delete("/bulk-delete", bulkDeleteTasks)
router.patch("/bulk-status-update", bulkStatusUpdate)

router.route("/:id")
    .patch(validate(createTaskSchema), editTask)
    .delete(deleteTask)

router.get("/status-count", getTaskCountByStatus)
router.get("/status/:status", getTasksByStatus)

export { router as taskRouter }
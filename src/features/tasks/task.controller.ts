import { NextFunction, Request, Response } from "express";
import { bulkDeleteTasksService, bulkStatusUpdateService, createTaskService, deleteTaskService, editTaskService, getTaskCountByStatusService, getTasksByStatusService, getTasksService } from "./task.service";
import { sendSuccessResponse } from "../../utils/api.response";
import { AppError } from "../../utils/app.error";
import { Status } from "../../../generated/prisma/enums";

export interface TaskFilters {
    status?: Status;
    title?: string;
    description?: string;
    page: number;
    limit: number;
    sortBy?: string;
}

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const task = await createTaskService(req.body)
        sendSuccessResponse(res, 201, { task }, "Task created successfully")
    } catch (e) {
        next(e)
    }
}

export const editTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    if (!id) throw new AppError(400, "Task ID is required")

    try {
        const task = await editTaskService(id as string, req.body)
        sendSuccessResponse(res, 200, { task }, "Task updated successfully")
    } catch (e) {
        next(e)
    }
}

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filters: TaskFilters = {
            status: req.query.status as Status,
            title: req.query.title as string,
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            sortBy: req.query.sortBy as string
        }
        const { taskList, totalTaskCount } = await getTasksService(filters)
        sendSuccessResponse(res, 200, { taskList, totalTaskCount }, "Tasks fetched successfully")
    } catch (e) {
        next(e)
    }
}

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    if (!id) throw new AppError(400, "Task ID is required")
    try {
        const { message } = await deleteTaskService(id as string)
        sendSuccessResponse(res, 200, null, message)
    } catch (e) {
        next(e)
    }
}

export const bulkDeleteTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ids: string[] = req.body.ids
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new AppError(400, "IDs array is required")
    }
    try {
        const { message } = await bulkDeleteTasksService(ids)
        sendSuccessResponse(res, 200, null, message)
    } catch (e) {
        next(e)
    }
}

export const getTasksByStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { status } = req.params
    if (!status) throw new AppError(400, "Status is required")

    const filters: TaskFilters = {
        status: status as Status,
        title: req.query.title as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string
    }

    try {
        const { taskList, totalTaskCount } = await getTasksByStatusService(filters)
        sendSuccessResponse(res, 200, { taskList, totalTaskCount }, "Tasks fetched successfully")
    } catch (e) {
        next(e)
    }
}

export const bulkStatusUpdate = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    const ids: string[] = req.body.ids
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new AppError(400, "IDs array is required")
    }
    try {
        const { message } = await bulkStatusUpdateService(ids, req.body.status as Status)
        sendSuccessResponse(res, 200, null, message)
    } catch (e) {
        next(e)
    }
}

export const getTaskCountByStatus = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const result = await getTaskCountByStatusService()
        sendSuccessResponse(res, 200, { result }, "Task count by status fetched successfully")
    } catch (e) {
        next(e)
    }
}

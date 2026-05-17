import { Status, Task } from "../../../generated/prisma/client";
import { AppError } from "../../utils/app.error";
import { getTaskQuery } from "../../utils/build.task.query";
import { TaskFilters } from "./task.controller";
import { TaskRepository } from "./task.repository";
import { createTaskType } from "./task.validate";

export const createTaskService = async (data: createTaskType) : Promise<Task> => {
    return await TaskRepository.create(data)
}

export const editTaskService = async (id: string, data: createTaskType) : Promise<Task> => {
    const task = await TaskRepository.findById(id as string)
    if (!task) throw new AppError(404, "Task not found")
    return await TaskRepository.update(id, data)
}

export const getTasksService = async (filters: TaskFilters) : Promise<{ taskList: Task[], totalTaskCount: number }>  => {
    const { whereCaluse, sort, skip } = getTaskQuery(filters)
    return await TaskRepository.findAll(whereCaluse, sort, skip)
}

export const deleteTaskService = async (id: string) : Promise<{ message: string }> => {
    const task = await TaskRepository.findById(id as string)
    if (!task) throw new AppError(404, "Task not found")
    await TaskRepository.delete(id)
    return { message: "Task deleted successfully" }
}

export const bulkDeleteTasksService = async (ids: string[]) : Promise<{ message: string }> => {
    const tasks = await TaskRepository.findManyByIds(ids)
    if (tasks.length !== ids.length) throw new AppError(404, "One or more tasks not found")
    await TaskRepository.bulkDelete(ids)
    return { message: "Tasks deleted successfully" }
}

export const getTasksByStatusService = async ( filters: TaskFilters) : Promise<{ taskList: Task[], totalTaskCount: number }> => {
    const { whereCaluse, sort, skip } = getTaskQuery(filters)
    return await TaskRepository.findAll(whereCaluse, sort, skip)
}

export const bulkStatusUpdateService = async (ids: string[], status: Status) : Promise<{ message: string }> => {
    const tasks = await TaskRepository.findManyByIds(ids)
    if (tasks.length !== ids.length) throw new AppError(404, "One or more tasks not found")
    await TaskRepository.bulkStatusUpdate(ids, status)
    return { message: "Tasks status updated successfully" }
}

export const getTaskCountByStatusService = async () => {
    return await TaskRepository.getStatusCount()
}
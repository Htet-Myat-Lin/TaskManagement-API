import { Status, Task } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { createTaskType } from "./task.validate";

export class TaskRepository {
    static async create (data: createTaskType) : Promise<Task> {
        const { memberIds, ...rest } = data
        return prisma.task.create({
            data: {
                ...rest,
                members: { connect: memberIds.map(id => ({ id})) }
            }
        })
    }

    static async update (id: string, data: createTaskType) : Promise<Task> {
        const { memberIds, ...rest } = data
        return prisma.task.update({
            where: { id },
            data: {
                ...rest,
                members: { connect: memberIds.map(id => ({ id})) }
            }
        })
    }

    static async findById (id: string) : Promise<Task | null> {
        return prisma.task.findUnique({
            where: { id }
        })
    }

    static async findAll (where: any, orderBy: any, skip: number) : Promise<{ taskList: Task[], totalTaskCount: number }> {
        const tasks = prisma.task.findMany({
            where,
            orderBy,
            skip
        })
        const total = prisma.task.count({ where })
        const [taskList, totalTaskCount] = await Promise.all([tasks, total])
        return { taskList, totalTaskCount }
    } 

    static async findManyByIds (ids: string[]) : Promise<Task[]> {
       return prisma.task.findMany({
           where: { id: { in: ids }}
       }) 
    }

    static async getStatusCount () {
        return prisma.task.groupBy({
            by: ["status"],
            _count: true
        })
    }

    static async delete (id: string) {
        return prisma.task.delete({
            where: { id }
        })
    }

    static async bulkDelete (ids: string[]) {
        return prisma.task.deleteMany({
            where: { id: { in: ids } }
        })
    }

    static async bulkStatusUpdate (ids: string[], status: Status) {
        return prisma.task.updateMany({
            where: { id: { in: ids } },
            data: { status }
        })
    }
}
import { TaskFilters } from "../features/tasks/task.controller";

export const getTaskQuery = (filters: TaskFilters) => {
    const whereCaluse: any = {}
    if (filters.name) whereCaluse.name = { contains: filters.name, mode: "insensitive" }
    if (filters.description) whereCaluse.description = { contains: filters.description, mode: "insensitive" }
    if (filters.status) whereCaluse.status = filters.status

    const sort: any = {}
    if (filters.sortBy) {
        const [field, order] = filters.sortBy.split(":")
        sort[field] = order === "desc" ? "desc" : "asc"
    } else {
        sort.createdAt = "desc"
    }

    const skip = (filters.page - 1) * filters.limit

    return { whereCaluse, sort, skip }
}
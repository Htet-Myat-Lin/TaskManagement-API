import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(5, "Description must be at least 5 characters long"),
    startDate: z.preprocess(
        (arg) => (arg instanceof Date ? arg : new Date(arg as any)),
        z.date().min(new Date(), "Start date cannot be in the past")
    ),
    endDate: z.preprocess((arg) => (arg instanceof Date ? arg : new Date(arg as any)), z.date()),
    memberIds: z.array(z.string()).min(1, "At least one member must be assigned to the task"),
})
.refine((data) => data.endDate >= data.startDate, {
    message: "End date must not be before start date",
    path: ["endDate"],
})

export type createTaskType = z.infer<typeof createTaskSchema>
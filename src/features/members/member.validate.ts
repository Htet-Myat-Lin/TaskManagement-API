import { z } from "zod";

export const createMemberSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    profileImage: z.string().optional(),
    dateOfBirth: z.date().optional()
})

export type CreateMemberType = z.infer<typeof createMemberSchema>
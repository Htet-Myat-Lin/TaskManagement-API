import { Member } from "../../../generated/prisma/client";
import { AppError } from "../../utils/app.error";
import { MemberFilters } from "./member.controller";
import { MemberRepository } from "./member.repository";
import { CreateMemberType } from "./member.validate";

export const createMemberService = async (data: CreateMemberType) : Promise<Member> => {
    return await MemberRepository.create(data)
}

export const editMemberService = async (id: string, data: CreateMemberType) : Promise<Member> => {
    return await MemberRepository.update(id, data)
}

export const getMembersService = async (filters: MemberFilters) : Promise<{ memberList: Member[], totalMemberCount: number }> => {
    let whereClause: any = {}
    if (filters.name) {
        whereClause.name = { contains: filters.name, mode: "insensitive" }
    }
    if (filters.email) {
        whereClause.email = { contains: filters.email, mode: "insensitive" }
    }
    if (filters.createdFrom || filters.createdTo) {
        whereClause.createdAt = {}
        if (filters.createdFrom) {
            whereClause.createdAt.gte = filters.createdFrom
        }
        if (filters.createdTo) {
            whereClause.createdAt.lte = filters.createdTo
        }
    }
    
    const skip = (filters.page -1) * filters.limit

    const sort : any = {}
    if (filters.sortBy) {
        const [field, order] = filters.sortBy.split(":")
        sort[field] = order === "desc" ? "desc" : "asc"
    } else {
        sort.createdAt = "desc"
    }

    return await MemberRepository.findAll(whereClause, sort, skip)
}

export const deleteMemberService = async (id: string) : Promise<{ message: string }> => {
    const member = await MemberRepository.findById(id)
    if (!member) {
        throw new AppError(404, "Member not found")
    }
    await MemberRepository.delete(id)
    return { message: "Member deleted successfully" }
}

export const bulkDeleteMembersService = async (ids: string[]) : Promise<{ message: string }> => {
    const members = await MemberRepository.findManyByIds(ids)
    if (members.length !== ids.length) {
        throw new AppError(404, "One or more members not found")
    }
    await MemberRepository.bulkDelete(ids)
    return { message: "Members deleted successfully" }
}

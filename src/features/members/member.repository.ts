import { Member } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateMemberType } from "./member.validate";

export class MemberRepository {
    static async create(data: CreateMemberType) : Promise<Member> {
        return prisma.member.create({
            data
        })
    }

    static async findById (id: string) : Promise<Member | null> {
        return prisma.member.findUnique({
            where: { id }
        })
    }

    static async findAll(where: any, orderBy: any, skip: number) : Promise<{ memberList: Member[], totalMemberCount: number }> {
        const members = prisma.member.findMany({
            where,
            orderBy,
            skip
        })
        const total = prisma.member.count({ where})
        const [memberList, totalMemberCount] = await Promise.all([members, total])
        return { memberList, totalMemberCount }
    }

    static async findManyByIds (ids: string[]) : Promise<Member[]> {
        return prisma.member.findMany({
            where: { id: { in: ids }}
        })
    }

    static async update(id: string, data: CreateMemberType) : Promise<Member> {
        return prisma.member.update({
            where: { id },
            data
        })
    }

    static async delete(id: string) {
        return prisma.member.delete({
            where: { id }
        })
    }

    static async bulkDelete(ids: string[]) {
        return prisma.member.deleteMany({
            where: { id: { in: ids}}
        })
    }
}
import { NextFunction, Request, Response } from "express";
import { bulkDeleteMembersService, createMemberService, deleteMemberService, editMemberService, getMembersService } from "./member.service";
import { sendSuccessResponse } from "../../utils/api.response";
import fs from "node:fs";
import { AppError } from "../../utils/app.error";
import { MemberRepository } from "./member.repository";

export interface MemberFilters {
    name?: string;
    email?: string;
    createdFrom?: Date;
    createdTo?: Date;
    page: number;
    limit: number;
    sortBy?: string;
}

export const createMember = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    const file = req.file as Express.Multer.File | undefined
    try {
        if (file) {
            req.body.profileImage = `${process.env.IMAGES_PATH}${file.fieldname}`
        }
        const member = await createMemberService(req.body)
        sendSuccessResponse(res, 201, { member }, "Member created successfully")
    } catch (e) {
        if (file) {
            // Delete uploaded file if there was an error
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path)
            }
        }
        next(e)
    }
}

export const getMembers = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const filters: MemberFilters = {
            name: req.query.name as string,
            email: req.query.email as string,
            createdFrom: req.query.createdFrom ? new Date(req.query.createdFrom as string) : undefined,
            createdTo: req.query.createdTo ? new Date(req.query.createdTo as string) : undefined,
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            sortBy: req.query.sortBy as string
        }
        const { memberList, totalMemberCount } = await getMembersService(filters)
        sendSuccessResponse(res, 200, { memberList, totalMemberCount }, "Members fetched successfully")
    } catch (e) {
        next(e)
    }
}

export const editMember = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    const file = req.file as Express.Multer.File | undefined
    const memberId = req.params.id
    if (!memberId) throw new AppError(400, "Member ID is required")
    try {
        const member = await MemberRepository.findById(memberId as string)
        if (!member) throw new AppError(404, "Member not found")
        if (file) {
            req.body.profileImage = `${process.env.IMAGES_PATH}${file.fieldname}`

            // Delete old image if editing member with new profile image
            if (member.profileImage) {
                const oldImagePath = member.profileImage.replace(process.env.IMAGES_PATH as string, "src/uploads/")
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath)
                }
            }

        }
        const updatedMember = await editMemberService(memberId as string, req.body)
        sendSuccessResponse(res, 200, { member: updatedMember }, "Member updated successfully")
    } catch (e) {
        if (file) {
            // Delete uploaded file if there was an error
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path)
            }
        }
        next(e)
    }
}

export const deleteMember = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    const memberId = req.params.id
    if (!memberId) throw new AppError(400, "Member ID is required")
    try {
        const { message } = await deleteMemberService(memberId as string)
        sendSuccessResponse(res, 200, null, message)
    } catch (e) {
        next(e)
    }
}

export const bulkDeleteMembers = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    const ids: string[] = req.body.ids
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new AppError(400, "IDs array is required")
    }
    try {
        const { message } = await bulkDeleteMembersService(ids)
        sendSuccessResponse(res, 200, null, message)
    } catch (e) {
        next(e)
    }
}
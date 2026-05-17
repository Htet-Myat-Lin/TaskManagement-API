import { Router } from "express";
import { bulkDeleteMembers, createMember, deleteMember, editMember, getMembers } from "./member.controller";
import { upload } from "../../middleware/upload.middleware";
import { validate } from "../../middleware/validation.middleware";
import { createMemberSchema } from "./member.validate";

const router = Router()

router.route("/")
    .post(upload.single("profileImage"), validate(createMemberSchema), createMember)
    .get(getMembers)

router.route("/:id")
    .patch(upload.single("profileImage"), validate(createMemberSchema), editMember)
    .delete(deleteMember)

router.delete("/bulk-delete", bulkDeleteMembers)

export { router as memberRouter }
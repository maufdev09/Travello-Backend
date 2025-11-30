import { Router } from "express"
import { userController } from "./user.controller"


const router= Router()

router.post("/create-guide", userController.ctreateGuideController)



export const userRoutes= router
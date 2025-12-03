import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userService } from "./user.service";

const  ctreateGuideController= catchAsync(async (req, res) => {

    

const result= await  userService.ctreateGuideService(req)

sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Guide Created successfully!",
        data: result,
    })


})

export const userController = {
    ctreateGuideController
}
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const  ctreateGuideController= catchAsync(async (req, res) => {

const result= await  ctreateGuideService(req)

sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Guide Created successfuly!",
        data: result
    })


})

export const userController = {
    ctreateGuideController
}
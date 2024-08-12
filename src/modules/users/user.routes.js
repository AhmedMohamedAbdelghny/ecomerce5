import express from "express";
import * as UC from "./user.controller.js";
const userRouter = express.Router();



userRouter.post("/signUp", UC.signUp)
userRouter.get("/verifyEmail/:token", UC.verifyEmail)
userRouter.get("/refReshToken/:rfToken", UC.refReshToken)
userRouter.patch("/sendCode", UC.forgetPassword)
userRouter.patch("/resetPassword", UC.resetPassword)
userRouter.post("/signIn", UC.signIn)




export default userRouter;

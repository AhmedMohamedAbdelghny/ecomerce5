import express from "express";
import * as CC from "./coupon.controller.js";
import { multerHost, multerLocal, validExtensions } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
import { validation } from '../../middleware/validation.js';
import * as CV from "./coupon.validation.js";
const couponRouter = express.Router();



couponRouter.post("/",
    validation(CV.createCoupon),
    auth(),
    CC.createCoupon)



couponRouter.put("/:id",
    validation(CV.updateCoupon),
    auth(),
    CC.updateCoupon)







export default couponRouter;

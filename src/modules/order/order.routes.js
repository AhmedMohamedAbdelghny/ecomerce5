import express from "express";
import * as OC from "./order.controller.js";
import { multerHost, multerLocal, validExtensions } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
import { validation } from '../../middleware/validation.js';
import * as OV from "./order.validation.js";
const orderRouter = express.Router();



orderRouter.post("/",
    validation(OV.createOrder),
    auth(),
    OC.createOrder)


orderRouter.put("/:id",
    validation(OV.cancelOrder),
    auth(),
    OC.cancelOrder)










export default orderRouter;

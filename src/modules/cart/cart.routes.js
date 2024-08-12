import express from "express";
import * as CC from "./cart.controller.js";
import { multerHost, multerLocal, validExtensions } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
import { validation } from '../../middleware/validation.js';
import * as CV from "./cart.validation.js";
const cartRouter = express.Router();



cartRouter.post("/",
    validation(CV.createCart),
    auth(),
    CC.createCart)

cartRouter.patch("/",
    validation(CV.removeCart),
    auth(),
    CC.removeCart)


cartRouter.put("/",
    validation(CV.clearCart),
    auth(),
    CC.clearCart)










export default cartRouter;

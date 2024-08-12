import express from "express";
import * as CC from "./brand.controller.js";
import { multerHost, multerLocal, validExtensions } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
import { validation } from './../../middleware/validation.js';
import * as BV from "./brand.validation.js";
const brandRouter = express.Router();



brandRouter.post("/",
    multerHost(validExtensions.image).single("image"),
    validation(BV.createBrand),
    auth(),
    CC.createBrand)







export default brandRouter;

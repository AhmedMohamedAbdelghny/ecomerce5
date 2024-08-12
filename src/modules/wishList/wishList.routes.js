import express from "express";
import * as CC from "./wishList.controller.js";
import { multerHost, multerLocal, validExtensions } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
import { validation } from '../../middleware/validation.js';
import * as CV from "./wishList.validation.js";
const wishListRouter = express.Router({ mergeParams: true });



wishListRouter.post("/",
    // validation(CV.createWishList),
    auth(),
    CC.createWishList)











export default wishListRouter;

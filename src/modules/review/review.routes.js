import express from "express";
import * as CC from "./review.controller.js";
import { multerHost, multerLocal, validExtensions } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
import { validation } from '../../middleware/validation.js';
import * as CV from "./review.validation.js";
const reviewRouter = express.Router({ mergeParams: true });



reviewRouter.post("/",
    validation(CV.createReview),
    auth(),
    CC.createReview)



reviewRouter.delete("/:id",
    // validation(CV.createReview),
    auth(),
    CC.deleteReview)










export default reviewRouter;

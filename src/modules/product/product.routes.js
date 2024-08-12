import express from "express";
import * as PC from "./product.controller.js";
import { multerHost, multerLocal, validExtensions } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
import { validation } from '../../middleware/validation.js';
import * as SCV from './product.validation.js';
import reviewRouter from "../review/review.routes.js";
import wishListRouter from "../wishList/wishList.routes.js";
const productRouter = express.Router({ mergeParams: true });


productRouter.use("/:productId/reviews", reviewRouter)
productRouter.use("/:productId/wishLists", wishListRouter)


productRouter.post("/",
    multerHost(validExtensions.image).fields([
        { name: "image", maxCount: 1 }, //[{}]
        { name: "coverImages", maxCount: 3 },
    ]),
    validation(SCV.createProduct),
    auth(),
    PC.createProduct)

productRouter.put("/:id",
    multerHost(validExtensions.image).fields([
        { name: "image", maxCount: 1 }, //[{}]
        { name: "coverImages", maxCount: 3 },
    ]),
    validation(SCV.updateProduct),
    auth(),
    PC.updateProduct)

productRouter.get("/", PC.getProducts)





export default productRouter;

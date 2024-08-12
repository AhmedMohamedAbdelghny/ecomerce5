import express from "express";
import subCategoryRouter from './../subCategory/subCategory.routes.js';
import * as CC from "./category.controller.js";
import { multerHost, multerLocal, validExtensions } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
const categoryRouter = express.Router({ caseSensitive: true });

categoryRouter.use("/:categoryId/subCategories", subCategoryRouter)

categoryRouter.post("/",
    auth(),
    multerHost(validExtensions.image).single("image"),
    CC.createCategory)



categoryRouter.put("/:id",
    auth(),
    multerLocal(validExtensions.image).single("image"),
    CC.updateCategory)


categoryRouter.delete("/:id",
    auth(),
    CC.deleteCategory)



categoryRouter.get("/", CC.getCategories)






export default categoryRouter;

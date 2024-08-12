import brandModel from "../../../db/models/brand.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import fs from "fs";
import slugify from "slugify";
import cloudinary from '../../utils/cloudinary.js';
import { nanoid } from "nanoid";





export const createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body

    const brandExist = await brandModel.findOne({ name: name.toLowerCase() })
    if (brandExist) {
        return next(new AppError("brand already exist", 409))
    }


    if (!req.file) {
        return next(new AppError("image is required", 400))
    }

    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `Ecommercec42Thur/Brands/${customId}`
    })

    const brand = await brandModel.create({
        name,
        slug: slugify(name, {
            lower: true,
            replacement: "_"
        }),
        createdBy: req.user._id,
        image: { secure_url, public_id },
        customId

    })

    res.status(201).json({ status: "done", brand })

})




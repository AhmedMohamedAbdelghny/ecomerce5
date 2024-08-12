import categoryModel from "../../../db/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import slugify from "slugify";
import cloudinary from './../../utils/cloudinary.js';
import { nanoid } from "nanoid";
import subCategoryModel from "../../../db/models/subCategory.model.js";





export const createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body

    const categoryExist = await categoryModel.findOne({ name: name.toLowerCase() })
    if (categoryExist) {
        return next(new AppError("category already exist", 409))
    }

    if (!req.file) {
        return next(new AppError("image is required", 400))
    }

    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `Ecommercec42Thur/categories/${customId}`
    })
    req.filePath = `Ecommercec42Thur/categories/${customId}`



    const category = await categoryModel.create({
        name,
        slug: slugify(name, {
            lower: true,
            replacement: "_"
        }),
        createdBy: req.user._id,
        image: { secure_url, public_id },
        customId

    })
    req.data = {
        model: categoryModel,
        id: category._id
    }
    const x = 5
    x = 4


    res.status(201).json({ status: "done", category })

})



export const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body

    const category = await categoryModel.findOne({ _id: id, createdBy: req.user._id })//{}  null
    if (!category) {
        return next(new AppError("category not exist or not owner", 404))
    }

    if (name) {
        if (category.name == name) {
            return next(new AppError("category name match with old name", 400))
        }
        if (await categoryModel.findOne({ name: name.toLowerCase() })) {
            return next(new AppError("category name already exist", 400))
        }
        category.name = name.toLowerCase()
        category.slug = slugify(name, {
            lower: true,
            replacement: "_"
        })

    }

    if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommercec42Thur/categories/${category.customId}`
        })
        category.image = { secure_url, public_id }
    }

    await category.save()
    res.status(201).json({ status: "done", category })

})




export const getCategories = asyncHandler(async (req, res, next) => {

    const categories = await categoryModel.find({}).populate([
        {
            path: "subCategories",

        }
    ])

    // let list = []
    // for (const category of categories) {
    //     const subCategories = await subCategoryModel.find({ category: category._id })//[]
    //     const newCategory = category.toObject();
    //     newCategory.subCategories = subCategories
    //     list.push(newCategory)
    // }

    res.status(201).json({ status: "done", categories })

})


export const deleteCategory = asyncHandler(async (req, res, next) => {

    //delete from cb
    const category = await categoryModel.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id })
    if (!category) {
        return next(new AppError("category not exist or not owner", 404))
    }
    //delete related subCategories 
    await subCategoryModel.deleteMany({ category: category._id })


    await cloudinary.api.delete_resources_by_prefix(`Ecommercec42Thur/categories/${category.customId}`)
    await cloudinary.api.delete_folder(`Ecommercec42Thur/categories/${category.customId}`)

    res.status(201).json({ status: "done", category })

})


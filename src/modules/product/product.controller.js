import productModel from "../../../db/models/product.model.js";
import categoryModel from '../../../db/models/category.model.js';
import subCategoryModel from './../../../db/models/subCategory.model.js';
import brandModel from './../../../db/models/brand.model.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import slugify from "slugify";
import cloudinary from '../../utils/cloudinary.js';
import { nanoid } from "nanoid";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { MongooseError } from "mongoose";




export const createProduct = asyncHandler(async (req, res, next) => {
    const { title, description, category, subCategory, brand, price, discount, stock } = req.body

    //check category exist
    const categoryExist = await categoryModel.findById(category)
    if (!categoryExist) {
        return next(new AppError("category not exist", 404))
    }
    //check subCategory exist
    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category })
    if (!subCategoryExist) {
        return next(new AppError("subCategory not exist", 404))
    }
    //check brand exist
    const brandExist = await brandModel.findById(brand)
    if (!brandExist) {
        return next(new AppError("brand not exist", 404))
    }

    const productExist = await productModel.findOne({ title: title.toLowerCase() })
    if (productExist) {
        return next(new AppError("product already exist", 409))
    }


    if (!req.files) {
        return next(new AppError("image is required", 400))
    }

    const customId = nanoid(5)
    let list = []
    for (const file of req.files.coverImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `Ecommercec42Thur/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/coverImages`

        })
        list.push({ secure_url, public_id })
    }
    console.log(req.files);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: `Ecommercec42Thur/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/image`
    })



    let subPrice = price - price * ((discount || 0) / 100)


    const product = await productModel.create({
        title,
        slug: slugify(title, { lower: true, replacement: "_" }),
        description,
        category,
        subCategory,
        brand,
        createdBy: req.user._id,
        price,
        discount,
        subPrice,
        stock,
        image: { secure_url, public_id },
        coverImages: list,
        customId
    })

    res.status(201).json({ status: "done", product })

})




export const updateProduct = asyncHandler(async (req, res, next) => {
    const { title, description, category, subCategory, brand, price, discount, stock } = req.body

    //check category exist
    const categoryExist = await categoryModel.findById(category)
    if (!categoryExist) {
        return next(new AppError("category not exist", 404))
    }
    //check subCategory exist
    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category })
    if (!subCategoryExist) {
        return next(new AppError("subCategory not exist", 404))
    }
    //check brand exist
    const brandExist = await brandModel.findById(brand)
    if (!brandExist) {
        return next(new AppError("brand not exist", 404))
    }

    const product = await productModel.findOne({ _id: req.params.id, createdBy: req.user._id })
    if (!product) {
        return next(new AppError("product not exist", 404))
    }


    if (title) {
        if (title.toLowerCase == product.title) {
            return next(new AppError("title match with old title", 409))
        }
        if (await productModel.findOne({ title: title.toLowerCase() })) {
            return next(new AppError("title already exist", 409))
        }
        product.title = title.toLowerCase()
        product.slug = slugify(title, { lower: true, replacement: "_" })
    }


    if (description) {
        product.description = description
    }

    if (stock) {
        product.stock = stock
    }

    if (price & discount) {
        product.subPrice = price - price * (discount / 100)
        product.price = price
        product.discount = discount
    } else if (price) {
        product.subPrice = price - price * (product.discount / 100)
        product.price = price

    } else if (discount) {
        product.subPrice = product.price - product.price * (discount / 100)
        product.discount = discount

    }

    if (req.files) {
        if (req?.files?.image?.length) {
            await cloudinary.uploader.destroy(product.image.public_id)

            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: `Ecommercec42Thur/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/image`
            })
            product.image = { secure_url, public_id }
        }

        if (req?.files?.coverImages?.length) {
            await cloudinary.api.delete_resources_by_prefix(`Ecommercec42Thur/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/coverImages`)
            let list = []
            for (const file of req.files.coverImages) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: `Ecommercec42Thur/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/coverImages`

                })
                list.push({ secure_url, public_id })
            }
            product.coverImages = list
        }
    }


    await product.save()


    res.status(200).json({ status: "done", product })

})




export const getProducts = asyncHandler(async (req, res, next) => {


    const apiFeatures = new ApiFeatures(productModel.find(), req.query)
        .pagination()
        .filter()
        .search()
        .select()
        .sort()

    const products = await apiFeatures.mongooseQuery

    res.status(200).json({ msg: "done", page: apiFeatures.page, products })
})
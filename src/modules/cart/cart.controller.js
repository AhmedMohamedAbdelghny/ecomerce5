import cartModel from "../../../db/models/cart.model.js";
import productModel from "../../../db/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";






export const createCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body


    const product = await productModel.findOne({
        _id: productId,
        stock: { $gte: quantity }
    })
    if (!product) {
        return next(new AppError("product not exist or out of stock", 404))
    }

    const cartExist = await cartModel.findOne({ user: req.user._id })
    if (!cartExist) {
        const cart = await cartModel.create({
            user: req.user._id,
            products: [{
                productId,
                quantity
            }]
        })
        return res.status(201).json({ status: "done", cart })
    }


    let flag = false
    for (const product of cartExist.products) {
        if (productId == product.productId) {
            product.quantity = quantity
            flag = true
        }
    }

    if (!flag) {
        cartExist.products.push({ productId, quantity })
    }

    await cartExist.save()

    return res.status(201).json({ status: "done", cartExist })

})





export const removeCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.body


    const cart = await cartModel.findOneAndUpdate({
        user: req.user._id,
        "products.productId": productId
    }, {
        $pull: { products: { productId } }
    }, {
        new: true
    })
    if (!cart) {
        return next(new AppError("product not exist in cart", 404))
    }


    return res.status(201).json({ status: "done", cart })

})



export const clearCart = asyncHandler(async (req, res, next) => {


    const cart = await cartModel.findOneAndUpdate({
        user: req.user._id,
    }, {
        products: []
    }, {
        new: true
    })
    if (!cart) {
        return next(new AppError("user not have cart", 404))
    }


    return res.status(201).json({ status: "done", cart })

})



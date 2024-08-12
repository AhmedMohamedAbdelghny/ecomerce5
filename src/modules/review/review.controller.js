import orderModel from "../../../db/models/order.model.js";
import productModel from "../../../db/models/product.model.js";
import reviewModel from "../../../db/models/review.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";






export const createReview = asyncHandler(async (req, res, next) => {
    const { comment, rate } = req.body
    const { productId } = req.params

    const productExist = await productModel.findById(productId)
    if (!productExist) {
        return next(new AppError("product not exist", 404))
    }

    // const reviewExist = await reviewModel.findOne({ createdBy: req.user._id, productId })
    // if (reviewExist) {
    //     return next(new AppError("review already exist", 409))
    // }

    const order = await orderModel.findOne({
        user: req.user._id,
        "products.productId": productId,
        status: "delivered"
    })
    if (!order) {
        return next(new AppError("order not exist", 409))
    }

    const review = await reviewModel.create({ comment, rate, productId, createdBy: req.user._id })

    // const reviews = await reviewModel.find({ productId }) //[]
    // let sum = 0
    // for (const review of reviews) {
    //     sum += review.rate
    // }
    // productExist.rateAvg = sum / reviews.length
    // await productExist.save()

    let sum = productExist.rateAvg * productExist.rateNum
    sum = sum + rate
    productExist.rateAvg = sum / (productExist.rateNum + 1)
    productExist.rateNum += 1
    await productExist.save()

    res.status(201).json({ status: "done", review })

})




export const deleteReview = asyncHandler(async (req, res, next) => {

    const { id } = req.params


    const reviewExist = await reviewModel.findOneAndDelete({ createdBy: req.user._id, _id: id })
    if (!reviewExist) {
        return next(new AppError("review not exist", 404))
    }


    const productExist = await productModel.findById(reviewExist.productId)

    let sum = productExist.rateAvg * productExist.rateNum
    sum = sum - reviewExist.rate
    productExist.rateAvg = sum / (productExist.rateNum - 1)
    productExist.rateNum -= 1
    await productExist.save()

    res.status(201).json({ status: "done" })

})





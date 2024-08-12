import couponModel from "../../../db/models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";






export const createCoupon = asyncHandler(async (req, res, next) => {
    const { code, amount, fromDate, toDate } = req.body

    const couponExist = await couponModel.findOne({ code: code.toLowerCase() })
    if (couponExist) {
        return next(new AppError("coupon already exist", 409))
    }

    const coupon = await couponModel.create({
        code,
        amount,
        createdBy: req.user._id,
        fromDate,
        toDate
    })

    res.status(201).json({ status: "done", coupon })

})





export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { code, amount, fromDate, toDate } = req.body
    const { id } = req.params

    const coupon = await couponModel.findOneAndUpdate({ _id: id, createdBy: req.user._id }, {
        code,
        amount,
        fromDate,
        toDate
    }, {
        new: true
    }) //owner
    if (!coupon) {
        return next(new AppError("coupon not exist", 404))
    }

    res.status(201).json({ status: "done", coupon })

})




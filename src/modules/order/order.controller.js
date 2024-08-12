import orderModel from "../../../db/models/order.model.js";
import productModel from "../../../db/models/product.model.js";
import couponModel from './../../../db/models/coupon.model.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cartModel from "../../../db/models/cart.model.js";
import { createInvoice } from "../../utils/pdf.js";
import { sendEmail } from './../../service/sendEmail.js';






export const createOrder = asyncHandler(async (req, res, next) => {
    const { productId, quantity, couponCode, address, phone, paymentMethod } = req.body

    //check coupon
    if (couponCode) {
        const coupon = await couponModel.findOne({
            code: couponCode.toLowerCase(),
            usedBy: { $nin: [req.user._id] },
        })
        if (!coupon || coupon.toDate < new Date) {
            return next(new AppError("coupon not exist or expired", 404))
        }
        req.body.coupon = coupon
    }

    let products = []
    let flag = false
    if (productId) {
        products = [{ productId, quantity }] //js
    } else {
        const cart = await cartModel.findOne({ user: req.user._id })
        if (!cart) {
            return next(new AppError("please add product to create order", 404))
        }
        products = cart.products //BSON
        flag = true
    }


    let dummyData = []
    let subPrice = 0
    for (let product of products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity }
        })
        if (!checkProduct) {
            return next(new AppError("product not exist or out of stock", 404))
        }
        if (flag) {
            product = product.toObject()
        }
        product.title = checkProduct.title
        product.price = checkProduct.subPrice
        product.finalPrice = checkProduct.subPrice * product.quantity
        subPrice += product.finalPrice
        dummyData.push(product)
    }

    let totalPrice = subPrice - (subPrice * ((req.body?.coupon?.amount || 0) / 100))

    const order = await orderModel.create({
        user: req.user._id,
        products: dummyData,
        subPrice,
        couponId: req.body?.coupon?._id,
        totalPrice,
        address,
        phone,
        paymentMethod,
        status: paymentMethod == "cash" ? "placed" : "waitPayment"
    })

    for (const product of dummyData) {
        await productModel.updateOne({
            _id: product.productId,
        }, {
            $inc: {
                stock: -product.quantity
            }
        })
    }

    if (req.body?.coupon) {
        await couponModel.updateOne({
            code: couponCode.toLowerCase(),
        }, {
            $push: {
                usedBy: req.user._id
            }
        })
    }

    if (flag) {
        await cartModel.updateOne({ user: req.user._id }, {
            products: [],
        })
    }

    //create invoice


    const invoice = {
        shipping: {
            name: req.user.name,
            address: req.user.address,
            city: "San Francisco",
            state: "CA",
            country: "US",
            postal_code: 94111
        },
        items: order.products,
        subtotal: subPrice * 100,
        paid: order.totalPrice * 100,
        invoice_nr: order._id,
        date: order.createdAt,
        coupon: req?.body?.coupon?.amount
    };

    await createInvoice(invoice, "invoice.pdf");

    await sendEmail(req.user.email, "invoice.pdf", "invoice", [
        {
            path: "invoice.pdf",
            contentType: "application/pdf",
        }
    ])


    return res.status(201).json({ status: "done", order })

})




export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { reason } = req.body
    const { id } = req.params


    const order = await orderModel.findOne({
        _id: id,
        user: req.user._id
    })

    if (!order) {
        return next(new AppError("order not found", 404))
    }
    if ((order.status != "placed" && order.paymentMethod == "cash") || (order.status != "waitPayment" && order.paymentMethod == "card")) {
        return next(new AppError("order can not be canceled", 404))
    }

    await orderModel.updateOne({
        _id: id
    }, {
        status: "canceled",
        cancelledBy: req.user._id,
        reason
    })

    if (order?.couponId) {
        await couponModel.updateOne({
            _id: order.couponId,
        }, {
            $pull: {
                usedBy: req.user._id
            }
        })
    }

    for (const product of order.products) {
        await productModel.updateOne({
            _id: product.productId,
        }, {
            $inc: {
                stock: product.quantity
            }
        })
    }


    return res.status(201).json({ status: "done", order })

})


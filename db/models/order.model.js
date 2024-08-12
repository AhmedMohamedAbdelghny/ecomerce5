import mongoose, { Types } from "mongoose";


const orderSchema = new mongoose.Schema({

    user: {
        type: Types.ObjectId, ref: "user", required: [true, "createdBy is required"],
    },
    products: [{
        title: { type: String, required: [true, "title is required"] },
        productId: { type: Types.ObjectId, ref: "product", required: [true, "product is required"], },
        quantity: { type: Number, required: [true, "quantity is required"] },
        price: { type: Number, required: [true, "price is required"] },
        finalPrice: { type: Number, required: [true, "finalPrice is required"] },
    }],
    subPrice: { type: Number, required: [true, "finalPrice is required"] },
    couponId: { type: Types.ObjectId, ref: "coupon" },
    totalPrice: { type: Number, required: [true, "finalPrice is required"] },
    address: { type: String, required: [true, "address is required"] },
    phone: { type: String, required: [true, "address is required"] },
    paymentMethod: {
        type: String,
        enum: ["cash", "card"],
        required: true
    },
    status: {
        type: String,
        enum: ["placed", "waitPayment", "onWay", "delivered", "canceled", "rejected"],
        default: "placed"
    },
    cancelledBy: {
        type: Types.ObjectId, ref: "user"
    },
    reason: {
        type: String
    }

}, {
    timestamps: true,
    versionKey: false,

})



const orderModel = mongoose.model("order", orderSchema)

export default orderModel;

import mongoose, { Types } from "mongoose";


const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, "comment is required"],
        trim: true,
        minLength: [3, "comment must be at least 3 characters"],
    },
    rate: {
        type: Number,
        required: [true, "rate is required"],
        min: [1, "rate must be at least 3 characters"],
        max: [5, "rate must be at most 32 characters"],
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "createdBy is required"],
    },
    productId: {
        type: Types.ObjectId,
        ref: "product",
        required: [true, "productId is required"],
    },

}, {
    timestamps: true,
    versionKey: false,

})



const reviewModel = mongoose.model("review", reviewSchema)

export default reviewModel;

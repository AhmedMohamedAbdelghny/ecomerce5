import mongoose, { Types } from "mongoose";


const wishListSchema = new mongoose.Schema({

    user: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "createdBy is required"],
    },
    products: [{
        type: Types.ObjectId,
        ref: "product",
        required: [true, "product is required"],
    }]

}, {
    timestamps: true,
    versionKey: false,

})



const wishListModel = mongoose.model("wishList", wishListSchema)

export default wishListModel;

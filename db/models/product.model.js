import mongoose, { Types } from "mongoose";


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        unique: true,
        minLength: [3, "name must be at least 3 characters"],
        maxLength: [32, "name must be at most 32 characters"],
        lowercase: true,
    },
    slug: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: [3, "name must be at least 3 characters"],
        maxLength: [32, "name must be at most 32 characters"],
        lowercase: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: [3, "name must be at least 3 characters"],
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "createdBy is required"],
    },
    category: {
        type: Types.ObjectId,
        ref: "category",
        required: [true, "category is required"],
    },
    subCategory: {
        type: Types.ObjectId,
        ref: "subCategory",
        required: [true, "subCategory is required"],
    },
    brand: {
        type: Types.ObjectId,
        ref: "brand",
        required: [true, "brand is required"],
    },
    image: {
        secure_url: String,
        public_id: String
    },
    coverImages: [{
        secure_url: String,
        public_id: String
    }],
    customId: String,
    price: {
        type: Number,
        required: [true, "price is required"]
    },
    discount: {
        type: Number,
        default: 0
    },
    subPrice: {
        type: Number,
        required: [true, "subPrice is required"]
    },
    stock: {
        type: Number,
        required: [true, "price is required"]
    },
    rateAvg: {
        type: Number,
        default: 0
    },
    rateNum: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false,

})





const productModel = mongoose.model("product", productSchema)

export default productModel;

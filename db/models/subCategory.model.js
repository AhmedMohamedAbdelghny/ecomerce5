import mongoose, { Types } from "mongoose";


const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: [3, "name must be at least 3 characters"],
        maxLength: [32, "name must be at most 32 characters"],
        lowercase: true,
        unique: true,
    },
    slug: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: [3, "name must be at least 3 characters"],
        maxLength: [32, "name must be at most 32 characters"],
        lowercase: true,
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
    image: {
        secure_url: String,
        public_id: String
    },
    customId: String
}, {
    timestamps: true,
    versionKey: false,

})





const subCategoryModel = mongoose.model("subCategory", subCategorySchema)

export default subCategoryModel;

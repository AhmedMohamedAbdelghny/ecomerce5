import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: [3, "name must be at least 3 characters"],
        maxLength: [32, "name must be at most 32 characters"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [8, "password must be at least 8 characters"],
        trim: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    phone: [String],
    address: [String],
    code:String
    
}, {
    timestamps: true,
    versionKey: false,
})


const userModel = mongoose.model("user", userSchema)

export default userModel;

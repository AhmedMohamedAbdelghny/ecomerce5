import userModel from "../../../db/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { sendEmail } from './../../service/sendEmail.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { customAlphabet } from "nanoid";




export const signUp = asyncHandler(async (req, res, next) => {
    const { name, email, password, phone, address } = req.body

    const userExist = await userModel.findOne({ email: email.toLowerCase() })
    if (userExist) {
        return next(new AppError("user already exist", 409))
    }

    const token = jwt.sign({ email }, 'generateTokenSecret', { expiresIn: 60 * 2 })
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`

    await sendEmail(email, "verify your email", `<a href="${link}">click here</a>`)

    const hash = bcrypt.hashSync(password, 10)

    const user = await userModel.create({
        name,
        email,
        password: hash,
        phone,
        address
    })
    res.status(201).json({ status: "done", user })

})




export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params

    const decoded = jwt.verify(token, 'generateTokenSecret')
    if (!decoded?.email) {
        return next(new AppError("invalid token", 400))
    }
    console.log(decoded);
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true })
    if (!user) {
        return next(new AppError("user not exist or already confirmed", 404))
    }

    res.status(200).json({ msg: "done" })

})







export const refReshToken = asyncHandler(async (req, res, next) => {
    const { rfToken } = req.params

    const decoded = jwt.verify(rfToken, process.env.signatureTokenREfresh)
    if (!decoded?.email) {
        return next(new AppError("invalid token", 400))
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false })
    if (!user) {
        return next(new AppError("user not exist or already confirmed", 404))
    }
    const token = jwt.sign({ email: decoded.email }, process.env.signature, { expiresIn: 30 })
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`
    await sendEmail(decoded.email, "verify your email", `<a href="${link}">click here to confirm email</a> `)

    res.status(200).json({ msg: "done" })
})





export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOneAndUpdate({ email, confirmed: true })
    if (!user) {
        return next(new AppError("user not exist or not confirmed", 404))
    }

    const code = customAlphabet("0123456789", 5)
    const newCode = code()
    await sendEmail(email, "code to reset password", `<h1> code :${newCode}</h1> `)

    await userModel.updateOne({ email }, { code: newCode })

    res.status(200).json({ msg: "done" })
})



export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, code, password } = req.body
    const user = await userModel.findOne({ email, code })
    if (!user || code == "") {
        return next(new AppError("user not exist or inValid code", 404))
    }

    const hash = bcrypt.hashSync(password, +process.env.saltRounds)
    await userModel.updateOne({ email }, { password: hash, code: "", passwordChangedAt: Date.now() })

    res.status(200).json({ msg: "done" })
})




export const signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email, confirmed: true })
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return next(new AppError("user not exist or inValid password", 404))
    }
    const token = jwt.sign({ email, role: user.role }, process.env.signature)

    await userModel.updateOne({ email }, { loggedIn: true })

    res.status(200).json({ msg: "done", token })
})




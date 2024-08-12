
import jwt from "jsonwebtoken"
import userModel from "../../db/models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"



export const auth = () => {
    return asyncHandler(async (req, res, next) => {

        const { token } = req.headers
        if (!token) {
            return res.status(400).json({ msg: "token not exist" })
        }
        if (!token.startsWith(process.env.bearerKey)) {
            return res.status(400).json({ msg: "inValid bearer key" })
        }
        const newToken = token.split(process.env.bearerKey)[1]
        if (!newToken) {
            return res.status(400).json({ msg: "invalid token" })
        }
        const decoded = jwt.verify(newToken, process.env.signature)
        if (!decoded?.email) {
            return res.status(400).json({ msg: "invalid token payload" })
        }
        const user = await userModel.findOne({ email: decoded.email })
        if (!user) {
            return res.status(409).json({ msg: "user not exist" })
        }

        req.user = user
        next()

    })

}

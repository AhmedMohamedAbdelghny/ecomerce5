import connectionDB from "../db/connection.js";
import { AppError } from "../src/utils/classError.js";
import { GlobalErrorHandler } from "../src/utils/asyncHandler.js";
import * as routers from "../src/modules/index.routes.js";
import { deleteFromCloudinary } from "./utils/deleteFromCloudinary.js";
import { deleteFromDB } from "./utils/deleteFromDB.js";
import cors from "cors"
import morgan from 'morgan'

export const initApp = (express, app) => {


    app.use(cors())

    app.use((req, res, next) => {
        if (req.originalUrl == "/orders/webhook") {
            next();
        } else {
            express.json()(req, res, next)
        }
    });

    app.use(morgan('dev'))
    app.get("/", (req, res) => {
        res.status(200).json({ msg: "hello on my ecommerce application" })
    })

    app.use("/users", routers.userRouter)
    app.use("/categories", routers.categoryRouter)
    app.use("/subCategories", routers.subCategoryRouter)
    app.use("/brands", routers.brandRouter)
    app.use("/products", routers.productRouter)
    app.use("/coupons", routers.couponRouter)
    app.use("/carts", routers.cartRouter)
    app.use("/orders", routers.orderRouter)


    //connect to db
    connectionDB()

    //handle invalid URLs.
    app.use("*", (req, res, next) => {
        next(new AppError(`inValid url ${req.originalUrl}`))
    })

    //GlobalErrorHandler
    app.use(GlobalErrorHandler, deleteFromCloudinary, deleteFromDB)



}
import mongoose from "mongoose";


const connectionDB = async () => {
    return await mongoose.connect(process.env.BD_URL_Online)
        .then(() => {
            console.log(`connected to database ${process.env.BD_URL_Online}`)
        }).catch((err) => {
            console.log({ msg: "fail to connect", err })
        })
}

export default connectionDB
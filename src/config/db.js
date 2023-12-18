// setup of database
import mongoose from "mongoose";
import envConfig from "../config/envConfig.js";

mongoose.connect(
    envConfig.DB_URL
).then(() => {
    console.log('database is connected')
})
    .catch(() => {
        console.log('error to connect database')
    })

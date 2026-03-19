import {Sequelize} from "sequelize"
import { DB_DIALECT, DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from "../utils/constants.js"

export const sequelize=new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        host:DB_HOST,
        dialect:DB_DIALECT,
        logging:false
    }
)

export const connectDB=async()=>{
    try {
        await sequelize.authenticate()
        console.log("DB Connected")
    } catch (error) {
        console.error("DB connection failed",error)
    }
}
import { DataTypes } from "sequelize"
import {sequelize} from "../../config/database.js"

const User=sequelize.define(
    "User",
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        role:{
            type:DataTypes.ENUM("admin","voter"),
            defaultValue:"voter"
        },
        is_verified:{
            type: DataTypes.BOOLEAN,
            defaultValue:false
        }
    },
    {
        tableName: "users",
        timestamps:true
    }
)

export default User
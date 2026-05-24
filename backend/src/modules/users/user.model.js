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
            type: DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        mobile:{
            type: DataTypes.STRING,
            allowNull:true,
            unique:true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        role:{
            type:DataTypes.ENUM("god","admin","voter"),
            defaultValue:"voter"
        },
        isVerified:{
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
        isSuspended:{
            type: DataTypes.BOOLEAN,
            defaultValue:false,
        },
        isMobileVerified:{
            type: DataTypes.BOOLEAN,
            defaultValue:false,
        },
        verificationToken:{
            type: DataTypes.STRING,
            allowNull: true
        },
        otp:{
            type: DataTypes.STRING,
            allowNull: true
        },
        otpExpiresAt:{
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "users",
        timestamps:true
    }
)

export default User
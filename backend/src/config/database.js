import { Sequelize } from "sequelize"
import * as pg from "@neondatabase/serverless"
import { DATABASE_URL, DB_DIALECT, DB_HOST, DB_INSTANCE, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "../utils/constants.js"

export let sequelize;

if (DATABASE_URL) {
    sequelize = new Sequelize(DATABASE_URL, {
        dialect: "postgres",
        dialectModule: pg,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    })
} else {
    const dialectOptions = {}

    if (DB_DIALECT === "mssql") {
        dialectOptions.options = {
            encrypt: false,
            trustServerCertificate: true,
            ...(DB_INSTANCE ? { instanceName: DB_INSTANCE } : {})
        }
    }

    sequelize = new Sequelize(
        DB_NAME,
        DB_USER,
        DB_PASSWORD,
        {
            host: DB_HOST,
            port: DB_PORT,
            dialect: DB_DIALECT,
            dialectOptions,
            logging: false
        }
    )
}

export const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log("DB Connected to " + (DATABASE_URL ? "PostgreSQL (Neon)" : DB_DIALECT))
    } catch (error) {
        console.error("DB connection failed", error)
    }
}


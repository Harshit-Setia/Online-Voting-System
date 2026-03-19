import { PORT } from "./utils/constants.js"
import { sequelize,connectDB } from "./config/database.js"
import app from "./app.js"
import "./models/index.js"


await connectDB()
await sequelize.sync()
app.listen(PORT,()=>{
    console.log("server started at http://localhost:"+PORT)
})
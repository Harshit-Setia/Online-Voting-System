import "dotenv/config"
import { PORT } from "./utils/constants.js"
import { sequelize, connectDB } from "./config/database.js"
import app from "./app.js"
import "./models/index.js"

await connectDB()
try {
  await sequelize.sync()
} catch (err) {
  console.error('Sequelize sync error:', err)
}

app.listen(PORT, () => {
    console.log("server started at http://localhost:" + PORT)
})

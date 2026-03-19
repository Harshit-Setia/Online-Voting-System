import { DataTypes } from "sequelize"
import { sequelize } from "../../config/database.js"

const Election = sequelize.define(
  "Election",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT
    },

    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },

    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("upcoming", "active", "ended"),
      defaultValue: "upcoming"
    }
  },
  {
    tableName: "elections",
    timestamps: true
  }
)

export default Election
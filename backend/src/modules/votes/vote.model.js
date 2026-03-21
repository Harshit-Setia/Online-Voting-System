import { DataTypes } from "sequelize"
import { sequelize } from "../../config/database.js"

const Vote = sequelize.define(
  "Vote",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    voter_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    election_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "votes",
    timestamps: true,

    // Prevent duplicate voting
    indexes: [
      {
        unique: true,
        fields: ["voter_id", "election_id"]
      }
    ]
  }
)

export default Vote
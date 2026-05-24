import { DataTypes } from "sequelize"
import { sequelize } from "../../config/database.js"

const Candidate = sequelize.define(
  "Candidate",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    party: {
      type: DataTypes.STRING
    },

    photo_url: {
      type: DataTypes.STRING
    },

    election_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  },
  {
    tableName: "candidates",
    timestamps: true
  }
)

export default Candidate
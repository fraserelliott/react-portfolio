const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../../config");

class IdeaTag extends Model {}

IdeaTag.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    exclusive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "ideatags",
  },
);

module.exports = IdeaTag;

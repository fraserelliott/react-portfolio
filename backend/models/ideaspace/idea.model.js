const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../config");

class Idea extends Model {}

Idea.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isIdea: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "ideas",
  },
);

module.exports = Idea;

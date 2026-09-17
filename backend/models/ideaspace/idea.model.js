const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../config");

class Idea extends Model {}

Idea.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isIdea: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
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

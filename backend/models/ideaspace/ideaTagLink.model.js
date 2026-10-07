const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

class IdeaTagLink extends Model {}

IdeaTagLink.init(
  {
    ideaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ideaTagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "IdeaTagLink",
    tableName: "IdeaTagLinks",
    timestamps: false,
  },
);

module.exports = IdeaTagLink;

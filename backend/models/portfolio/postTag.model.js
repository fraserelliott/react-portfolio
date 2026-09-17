const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../config/sequelize");

class PostTag extends Model {}

PostTag.init(
  {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PostTag",
    tableName: "PostTags",
    timestamps: false,
  },
);

module.exports = PostTag;

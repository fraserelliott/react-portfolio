const {Model, DataTypes} = require('sequelize');
const {sequelize, cloudinary} = require("../config");

class Image extends Model {
}

Image.init(
  {
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_reference",
        msg: "Reference must be unique"
      }
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {isUrl: true}
    },
    publicId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Image',
    tableName: 'images',
    timestamps: true,
    underscored: true,
  }
)

Image.addHook('afterUpdate', (image, options) => {
  if (!image.changed('publicId')) return;
  const oldId = image.previous('publicId');
  if (!oldId) return;

  const destroy = () => cloudinary.uploader.destroy(oldId).catch(() => {
    // log if you have a logger
  });

  if (options?.transaction) {
    options.transaction.afterCommit(destroy);
  } else {
    setImmediate(destroy);
  }
});

Image.addHook('afterDestroy', (image, options) => {
  const id = image.publicId;
  if (!id) return;

  const destroy = () => cloudinary.uploader.destroy(id).catch(() => {
    // TODO: logging
  });

  if (options?.transaction) {
    options.transaction.afterCommit(destroy);
  } else {
    setImmediate(destroy);
  }
});

module.exports = Image;
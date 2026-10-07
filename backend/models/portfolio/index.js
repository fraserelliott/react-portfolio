const User = require("./user.model");
const Post = require("./post.model");
const Tag = require("./tag.model");
const Image = require("./image.model");
const PostTag = require("./postTag.model");

// Using a junction table PostTags so tags can be retrieved. This junction table maps the post"s id to potentially multiple tag ids.
Post.belongsToMany(Tag, {
  through: PostTag,
  as: "tags",
  foreignKey: "postId",
  otherKey: "tagId",
  onDelete: "CASCADE",
});

Tag.belongsToMany(Post, {
  through: PostTag,
  as: "posts",
  foreignKey: "tagId",
  otherKey: "postId",
  onDelete: "CASCADE",
});

module.exports = {
  User,
  Post,
  Tag,
  Image,
  PostTag,
};

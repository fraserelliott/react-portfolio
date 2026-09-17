const Idea = require("./idea.model");
const IdeaTag = require("./ideaTag.model");
const IdeaTagLink = require("./ideaTagLink.model");

Idea.belongsToMany(IdeaTag, {
  through: IdeaTagLink,
  as: "ideatags",
  foreignKey: "ideaId",
  otherKey: "ideaTagId",
  onDelete: "CASCADE",
});

IdeaTag.belongsToMany(Idea, {
  through: IdeaTagLink,
  as: "ideas",
  foreignKey: "ideaTagId",
  otherKey: "ideaId",
  onDelete: "CASCADE",
});

module.exports = { Idea, IdeaTag, IdeaTagLink };

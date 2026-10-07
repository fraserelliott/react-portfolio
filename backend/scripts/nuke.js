require("dotenv").config();

const { sequelize, testConnection } = require("../config/sequelize");
const { Post, Tag, PostTag, Idea, IdeaTag, IdeaTagLink } = require("../models");

async function nuke() {
  try {
    await testConnection();

    // Junction tables first because they reference the parent tables.
    await PostTag.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await IdeaTagLink.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    // Then parent tables.
    await Post.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await Tag.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await Idea.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await IdeaTag.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    console.log("💥 Database data nuked successfully.");
  } catch (error) {
    console.error("❌ Nuke failed:", error);
  } finally {
    await sequelize.close();
  }
}

nuke();

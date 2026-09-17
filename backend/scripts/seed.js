require("dotenv").config();
const { sequelize, testConnection } = require("../config/sequelize");
const { Post, Tag, PostTag, Idea, IdeaTag, IdeaTagLink } = require("../models");

const posts = require("../seed-data/posts.json");
const tags = require("../seed-data/tags.json");
const ideas = require("../seed-data/ideas.json");
const ideaTags = require("../seed-data/idea_tags.json");

const stripIds = (data) => data.map(({ id, ...rest }) => rest);

async function seed() {
  try {
    await testConnection();

    const createdPosts = await Post.bulkCreate(stripIds(posts), {
      validate: true,
    });

    const createdTags = await Tag.bulkCreate(stripIds(tags), {
      validate: true,
    });

    const postTagLinks = createdPosts.flatMap((post) =>
      getRandomItems(createdTags).map((tag) => ({
        postId: post.id,
        tagId: tag.id,
      })),
    );

    await PostTag.bulkCreate(postTagLinks, {
      validate: true,
    });

    const createdIdeas = await Idea.bulkCreate(stripIds(ideas), {
      validate: true,
    });

    const createdIdeaTags = await IdeaTag.bulkCreate(stripIds(ideaTags), {
      validate: true,
    });

    const ideaTagLinks = createdIdeas.flatMap((idea) =>
      getRandomItems(createdIdeaTags).map((tag) => ({
        ideaId: idea.id,
        ideaTagId: tag.id,
      })),
    );

    await IdeaTagLink.bulkCreate(ideaTagLinks, {
      validate: true,
    });

    console.log("✅ Seeding completed successfully.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await sequelize.close();
  }
}

function getRandomItems(items, min = 1, max = 4) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;

  return [...items]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, items.length));
}

seed();

const router = require("express").Router();
const { Op } = require("sequelize");
const { Post, Tag } = require("../models/index.model");
const { sequelize } = require("../config/connection");
const { FailSchema, StringField, BooleanField } = require("@fraserelliott/fail");
const inputValidation = require("../middleware/inputvalidation.middleware");
const auth = require("../middleware/auth.middleware");

// Define validation rules for posts
const postSchema = new FailSchema();
postSchema.add("title", new StringField().required().nonNull().maxLength(255));
postSchema.add("content", new StringField().required().nonNull());
postSchema.add("featured", new BooleanField().required().nonNull());
postSchema.add("repoLink", new StringField().required().nonNull().website());
// TODO: add ArrayField to FAIL

// Route to create a new post
router.post("/", auth.validateToken, inputValidation.validate(postSchema), async (req, res) => {
    try {
        const { title, content, repoLink, imageUrl, featured, tags } = req.body;

        // Verify all provided tags exist
        const existingTags = await verifyTags(tags);
        if (!existingTags)
            return res.status(400).json({ error: "One or more tag IDs are invalid." });

        // Create post and associate tags
        const post = await Post.create({ title, content, repoLink, imageUrl, featured });
        await post.addTags(existingTags);

        // Reload to include tags in response
        await post.reload({
            include: [
                { model: Tag, as: "tags", attributes: ["id", "name"], through: { attributes: [] } }
            ]
        });
        res.status(201).json(post);
    } catch (error) {
        return res.status(500).json({ error: "Error creating post." });
    }
});

// Route to get all posts, optionally filtered by featured or tags
// We filter post IDs manually to avoid Sequelize's include.where
// limiting the returned tags instead of filtering posts.
// This ensures we get *all* tags on matching posts, not just the filtered ones.
router.get("/", async (req, res) => {
    try {
        let where = {};
        if (req.query.featured)
            where.featured = (req.query.featured === "true");
        const tags = req.query.tags;

        if (tags) {
            // Support tags as array or comma-separated string e.g. ?tags=1&tags=2 or ?tags=1,2
            const tagIds = Array.isArray(req.query.tags)
                ? req.query.tags.map(Number)
                : req.query.tags.split(",").map(Number);

            // Find post IDs linked to any of the tag IDs (junction table)
            const postIds = await sequelize.models.PostTags.findAll({
                where: { tag_id: { [Op.in]: tagIds } },
                attributes: ["post_id"],
                group: ["post_id"],
                raw: true
            }).then(results => results.map(r => r.post_id));

            where.id = { [Op.in]: postIds };
        }

        // Fetch posts with tags included, applying filters
        const posts = await Post.findAll({
            include: {
                model: Tag,
                as: "tags",
                attributes: ["id", "name"],
                through: { attributes: [] }, // hide join table IDs
                required: false
            },
            where,
        });
        res.json(posts);
    } catch (error) {
        return res.status(500).json({ error: "Error retrieving posts." });
    }
});

// Route to get a single post by ID
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: {
                model: Tag,
                as: "tags",
                attributes: ["id", "name"],
                through: { attributes: [] }, // hide join table IDs
            }
        });
        if (!post)
            res.status(404).json({ error: "Post not found." });
        res.json(post);
    } catch (error) {
        return res.status(500).json({ error: "Error retrieving post." });
    }
});

// Route to update a post by ID
router.put("/:id", auth.validateToken, inputValidation.validate(postSchema), async (req, res) => {
    try {
        const { title, content, repoLink, imageUrl, featured, tags } = req.body;
        const id = req.params.id;

        // Check tag validity
        const existingTags = await verifyTags(tags);
        if (!existingTags)
            return res.status(400).json({ error: "One or more tag IDs are invalid." });

        // Check post exists
        const post = await Post.findByPk(id);
        if (!post)
            return res.status(404).json({ error: "Post not found." });

        await post.update({ title, content, repoLink, imageUrl, featured });
        await post.setTags(existingTags);
        // update tags in return data
        await post.reload({
            include: [
                { model: Tag, as: "tags", attributes: ["id", "name"], through: { attributes: [] } }
            ]
        });
        res.json(post);
    } catch (error) {
        return res.status(500).json({ error: "Error updating post." });
    }
});

// Route to delete a post
router.delete("/:id", auth.validateToken, async (req, res) => {
    try {
        const id = req.params.id;

        // Check post exists
        const post = await Post.findByPk(id);
        if (!post)
            return res.status(404).json({ error: "Post not found." });

        await post.destroy();
        res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: "Error deleting post." });
    }
});

// Helper: Verify all tag IDs exist in DB, return array or null
async function verifyTags(tagIds) {
    const existingTags = await Tag.findAll({
        where: { id: tagIds }
    });

    return existingTags.length === tagIds.length ? existingTags : null;
}

module.exports = router;
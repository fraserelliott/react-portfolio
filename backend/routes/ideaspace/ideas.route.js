const router = require("express").Router();
const { Idea, IdeaTag } = require("../../models");
const { sequelize } = require("../../config");
const {
  FailSchema,
  StringField,
  BooleanField,
  NumberField,
} = require("@fraserelliott/fail");
const inputValidation = require("../../middleware/inputvalidation.middleware");
const auth = require("../../middleware/auth.middleware");
const trim = require("../../middleware/trim.middleware");
const { Op } = require("sequelize");

const includeIdeaTags = {
  model: IdeaTag,
  as: "ideatags",
  attributes: ["id", "name"],
  through: { attributes: [] },
  required: false,
};

// Define validation rules for an idea
const ideaSchema = new FailSchema();
ideaSchema.add("name", new StringField().required().nonNull().maxLength(255));
ideaSchema.add("isIdea", new BooleanField().required().nonNull());

const validateNameSchema = new FailSchema();
validateNameSchema.add(
  "name",
  new StringField().required().nonNull().minLength(1),
);
validateNameSchema.add("excludeId", new NumberField().nonNull());

const validateSlugSchema = new FailSchema();
validateSlugSchema.add(
  "slug",
  new StringField()
    .required()
    .nonNull()
    .minLength(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
);
validateSlugSchema.add("excludeId", new NumberField().nonNull());

// Route to create a new idea
router.post(
  "/",
  auth.validateToken,
  inputValidation.validate(ideaSchema),
  async (req, res) => {
    try {
      const { name, isIdea } = req.body;

      const idea = await Idea.create({
        name,
        isIdea,
      });

      await idea.reload({
        include: includeIdeaTags,
      });

      res.status(201).json(idea);
    } catch (error) {
      return res.status(500).json({ error: "Error creating idea" });
    }
  },
);

router.get("/", async (req, res) => {
  try {
    const ideas = await Idea.findAll({
      where: { slug: { [Op.not]: null } },
      attributes: ["id", "name", "isIdea", "slug", "updatedAt"],
      include: includeIdeaTags,
    });
    res.json(ideas);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving ideas." });
  }
});

router.get("/dashboard", auth.validateToken, async (req, res) => {
  try {
    const ideas = await Idea.findAll({
      attributes: ["id", "name", "isIdea", "slug", "updatedAt"],
      include: includeIdeaTags,
    });
    res.json(ideas);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving ideas." });
  }
});

router.get("/dashboard/:id", auth.validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const idea = await Idea.findByPk(id, { include: includeIdeaTags });
    if (!idea) return res.status(404).json({ error: "Idea not found." });
    return res.status(200).json(idea);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving idea." });
  }
});

router.put(
  "/dashboard/:id",
  auth.validateToken,
  trim.trimBody,
  inputValidation.validate(ideaSchema),
  async (req, res) => {
    try {
      const { name, isIdea, content, summary, slug, ideatags } = req.body;
      const id = req.params.id;

      const idea = await Idea.findByPk(id);
      if (!idea) return res.status(404).json({ error: "Idea not found" });

      const existingTags = await verifyTags(ideatags);
      if (!existingTags)
        return res
          .status(400)
          .json({ error: "One or more tag IDs are invalid." });

      await idea.update({ name, isIdea, content, summary, slug });
      await idea.setIdeatags(existingTags);

      await idea.reload({ include: includeIdeaTags });
      res.json(idea);
    } catch (error) {
      return res.status(500).json({ error: "Error updating idea." });
    }
  },
);

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const idea = await Idea.findByPk(id, { include: includeIdeaTags });
    if (!idea) return res.status(404).json({ error: "Idea not found." });
    if (!idea.slug)
      return res.status(401).json({ error: "Action requires authentication." });
    return res.status(200).json(idea);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving idea." });
  }
});

router.post(
  "/validate-name",
  auth.validateToken,
  trim.trimBody,
  inputValidation.validate(validateNameSchema),
  async (req, res) => {
    try {
      const { excludeId, name } = req.body;
      const foundIdea = await Idea.findOne({ where: { name } });
      if (!foundIdea || foundIdea.id === excludeId)
        return res.status(200).json({ valid: true });
      else return res.status(409).json({ valid: false, reason: "NAME_EXISTS" });
    } catch (error) {
      return res.status(500).json({ error: "Error validating name." });
    }
  },
);

router.post(
  "/validate-slug",
  auth.validateToken,
  trim.trimBody,
  inputValidation.validate(validateSlugSchema),
  async (req, res) => {
    try {
      const { excludeId, slug } = req.body;
      const foundIdea = await Idea.findOne({ where: { slug } });
      if (!foundIdea || foundIdea.id === excludeId)
        return res.status(200).json({ valid: true });
      else return res.status(409).json({ valid: false, reason: "SLUG_EXISTS" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error validating slug." });
    }
  },
);

router.delete("/:id", auth.validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const idea = await Idea.findByPk(id);
    if (!idea) return res.status(404).json({ error: "Idea not found." });

    await idea.destroy();
    return res.status(200).json({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting idea." });
  }
});

// Helper: Verify all tag IDs exist in DB, return array or null
async function verifyTags(tags) {
  const tagIds = tags.map((t) => t.id);
  const existingTags = await IdeaTag.findAll({
    where: { id: tagIds },
  });

  return existingTags.length === tagIds.length ? existingTags : null;
}

module.exports = router;

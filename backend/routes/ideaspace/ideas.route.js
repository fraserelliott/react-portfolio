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
const { Op } = require("sequelize");

const includeIdeaTags = {
  model: IdeaTag,
  as: "ideatags",
  attributes: ["id", "name"],
  through: { attributes: [] },
  required: false,
};

function trimName(req, res, next) {
  if (typeof req.body?.name === "string") {
    req.body.name = req.body.name.trim();
  }

  next();
}

// Define validation rules for an idea
const ideaSchema = new FailSchema();
ideaSchema.add("name", new StringField().required().nonNull().maxLength(255));
ideaSchema.add("isIdea", new BooleanField().required().nonNull());

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
      attributes: ["id", "name", "isIdea", "updatedAt"],
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
      include: includeIdeaTags,
    });
    res.json(ideas);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving ideas." });
  }
});

const validateNameSchema = new FailSchema();
validateNameSchema.add(
  "name",
  new StringField().required().nonNull().minLength(1),
);
validateNameSchema.add("excludeId", new NumberField().nonNull());

router.post(
  "/validate-name",
  auth.validateToken,
  trimName,
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

module.exports = router;

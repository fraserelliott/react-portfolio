const router = require("express").Router();
const { Idea, IdeaTag } = require("../../models/");
const {
  FailSchema,
  StringField,
  BooleanField,
  NumberField,
} = require("@fraserelliott/fail");
const inputValidation = require("../../middleware/inputvalidation.middleware");
const auth = require("../../middleware/auth.middleware");
const trim = require("../../middleware/trim.middleware");
const {
  validateIdeatagNameAvailable,
} = require("../../middleware/validateName.middleware");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

const ideatagSchema = new FailSchema();
ideatagSchema.add("name", new StringField().required().nonNull().maxLength(20));
ideatagSchema.add("exclusive", new BooleanField().nonNull());

const validateNameSchema = new FailSchema();
validateNameSchema.add(
  "name",
  new StringField().required().nonNull().minLength(1),
);
validateNameSchema.add("excludeId", new NumberField().nonNull());

router.post(
  "/",
  auth.validateToken,
  trim.trimBody,
  inputValidation.validate(ideatagSchema),
  validateIdeatagNameAvailable,
  async (req, res) => {
    try {
      const { name, exclusive } = req.body;
      const ideatag = await IdeaTag.create({ name, exclusive });
      res.status(201).json(ideatag);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError")
        return res
          .status(409)
          .json({ error: "An ideatag with this name already exists." });
      return res.status(500).json({ error: "Error creating ideatag." });
    }
  },
);

router.post(
  "/validate-name",
  trim.trimBody,
  inputValidation.validate(validateNameSchema),
  validateIdeatagNameAvailable,
  (req, res) => {
    return res.sendStatus(200);
  },
);

async function validateName(name, excludeId) {}

router.put(
  "/:id",
  auth.validateToken,
  trim.trimBody,
  inputValidation.validate(ideatagSchema),
  async (req, res) => {
    try {
      const { name, exclusive } = req.body;
      const id = req.params.id;

      const ideatag = await IdeaTag.findByPk(id);
      if (!ideatag) return res.status(404).json({ error: "Ideatag not found" });

      await ideatag.update({ name, exclusive });
      res.json(ideatag);
    } catch (error) {
      return res.status(500).json({ error: "Error updating ideatag." });
    }
  },
);

router.get("/", async (req, res) => {
  try {
    const ideatags = await IdeaTag.findAll({
      attributes: [
        "id",
        "name",
        "exclusive",
        // count join rows; cast to int for convenience
        [
          Sequelize.cast(
            Sequelize.fn("COUNT", Sequelize.col("ideas->IdeaTagLink.ideaId")),
            "integer",
          ),
          "usageCount",
        ],
      ],
      include: [
        {
          model: Idea,
          as: "ideas",
          attributes: [],
          through: { attributes: [] },
          required: false, // LEFT JOIN so tags with 0 posts stay included
        },
      ],
      group: ["ideatags.id", "ideatags.name"],
      order: [["name", "ASC"]],
    });
    res.json(ideatags);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving ideatags." });
  }
});

router.delete("/:id", auth.validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const tag = await IdeaTag.findByPk(id);
    if (!tag) return res.status(404).json({ error: "Ideatag not found." });
    await tag.destroy();
    return res.status(200).json({ success: true, deletedId: id });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting ideatag." });
  }
});

module.exports = router;

const router = require("express").Router();
const { Idea, IdeaTag } = require("../../models/");
const {
  FailSchema,
  StringField,
  BooleanField,
} = require("@fraserelliott/fail");
const inputValidation = require("../../middleware/inputvalidation.middleware");
const auth = require("../../middleware/auth.middleware");
const trim = require("../../middleware/trim.middleware");
const { Sequelize } = require("sequelize");

const ideatagSchema = new FailSchema();
ideatagSchema.add("name", new StringField().required().nonNull().maxLength(20));
ideatagSchema.add("exclusive", new BooleanField().nonNull());

router.post(
  "/",
  auth.validateToken,
  trim.trimBody,
  inputValidation.validate(ideatagSchema),
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

module.exports = router;

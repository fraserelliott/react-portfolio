const { Idea, IdeaTag } = require("../models");
const { Op } = require("sequelize");

exports.validateIdeatagNameAvailable = async (req, res, next) => {
  try {
    const { name } = req.body;
    const excludeId = req.body.excludeId ?? req.body.id;

    const foundIdeatag = await IdeaTag.findOne({
      where: {
        name: {
          [Op.iLike]: name,
        },
      },
    });

    if (foundIdeatag && foundIdeatag.id !== excludeId) {
      return res.status(409).json({
        valid: false,
        reason: "NAME_EXISTS",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: "Error validating ideatag name.",
    });
  }
};

exports.validateIdeaNameAvailable = async (req, res, next) => {
  try {
    const { name } = req.body;
    const excludeId = req.body.excludeId ?? req.body.id;

    const foundIdea = await Idea.findOne({
      where: {
        name: {
          [Op.iLike]: name,
        },
      },
    });

    if (foundIdea && foundIdea.id !== excludeId) {
      return res.status(409).json({
        valid: false,
        reason: "NAME_EXISTS",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: "Error validating idea name.",
    });
  }
};

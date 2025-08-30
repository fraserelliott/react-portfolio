const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const {cloudinary} = require('../config/');
const {uploadImage} = require('../middleware/upload.middleware');
const {Image} = require('../models/index.model');
const multer = require('multer');
const {sequelize} = require('../config/sequelize');

const upload = multer({
  storage: multer.memoryStorage(), limits: {fileSize: 10 * 1024 * 1024}, fileFilter: (req, file, cb) => {
    if (!file.mimetype?.startsWith('image/')) return cb(new Error('Invalid file type'));
    cb(null, true);
  }
});


async function retrieveFromDB(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({error: "Invalid id or not a number"});

    const image = await Image.findByPk(id);
    if (!image) return res.status(404).json({error: "Image not found"});

    req.dbImage = image;
    next();
  } catch (error) {
    return res.status(500).json({error: "Error finding image"});
  }
}

router.post("/", auth.validateToken, upload.single("image"), uploadImage, async (req, res) => {
  try {
    const image = await Image.create({
      reference: req.body.reference, url: req.image.url, publicId: req.image.public_id
    });
    res.status(201).json(image);
  } catch (error) {
    if (req.image?.public_id) {
      await cloudinary.uploader.destroy(req.image.public_id).catch(() => {
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({error: 'Reference must be unique'});
    }
    return res.status(500).json({error: "Error creating image"});
  }
});

router.get("/", async (req, res) => {
  try {
    const images = await Image.findAll();
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Error fetching images"});
  }
})

router.put("/:id/content", auth.validateToken, retrieveFromDB, upload.single("image"), uploadImage, async (req, res) => {
  const tx = await sequelize.transaction();
  try {
    await req.dbImage.update({url: req.image.url, publicId: req.image.public_id}, {transaction: tx});
    await tx.commit();
    res.status(200).json(req.dbImage);
  } catch (error) {
    await tx.rollback();
    if (req.image?.public_id) {
      await cloudinary.uploader.destroy(req.image.public_id).catch(() => {
      });
    }
    return res.status(500).json({error: "Error updating image content"});
  }
});

router.put("/:id/metadata", auth.validateToken, retrieveFromDB, async (req, res) => {
  try {
    if (!req.body.reference) return res.status(400).json({error: "No reference provided to update"});

    await req.dbImage.update({reference: req.body.reference});
    res.status(200).json(req.dbImage);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({error: 'Reference must be unique'});
    }
    return res.status(500).json({error: "Error updating image metadata"});
  }
});

router.delete("/:id", auth.validateToken, retrieveFromDB, async (req, res) => {
  const tx = await sequelize.transaction();
  try {
    await req.dbImage.destroy({transaction: tx});
    await tx.commit();
    res.sendStatus(204);
  } catch (error) {
    await tx.rollback();
    return res.status(500).json({error: "Error deleting image"});
  }
});

module.exports = router;
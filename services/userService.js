const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = require("../config/s3Client");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const errorObject = require("../utils/errorObject");

const awsBuckName = process.env.AWS_BUCKET_NAME;

// Upload single image
exports.uploadImage = uploadSingleImage("profileImage");

// Image processing
exports.resizeImage = asyncHandler(async (req, _, next) => {
  if (req.file) {
    const imageFormat = "png";

    const buffer = await sharp(req.file.buffer)
      .resize(800, 800)
      .toFormat(imageFormat)
      .jpeg({ quality: 100 })
      .toBuffer();

    const imageName = `${"user"}-${uuidv4()}-${Date.now()}.${imageFormat}`;

    const params = {
      Bucket: awsBuckName,
      Key: `${"users"}/${imageName}`,
      Body: buffer,
      ContentType: `image/${imageFormat}`,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Save image name to Into Your db
    req.body.profileImage = imageName;
  }

  next();
});

// @desc user get my data
// @route GET /api/v1/user
// @access
exports.userGetMyData = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const document = await userModel.findById(id);

  if (!document) {
    const message = `No user for this ID ${id}.`;
    throw next(
      new ApiError(message, errorObject(id, message, "id", "params"), 404)
    );
  }

  res.status(200).json({
    data: document,
  });
});

// @desc user update my data
// @route PUT /api/v1/user
// @access
exports.userUpdateMyData = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { body } = req;

  if (body.profileImage) {
    let document = await userModel.findByIdAndUpdate(
      id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        country: req.body.country,
        profileImage: req.body.profileImage,
      },
    );

    if (!document) {
      const message = `No user for this ID ${id}.`;
      throw next(
        new ApiError(message, errorObject(id, message, "id", "params"), 404)
      );
    };

    const imageUrl = `${document.profileImage}`;
    const baseUrl = `${process.env.AWS_BASE_URL}/`;
    const restOfUrl = imageUrl.replace(baseUrl, "");
    const key = restOfUrl.slice(0, restOfUrl.indexOf("?"));

    const params = {
      Bucket: awsBuckName,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);

    document = await userModel.find({ _id: id });
    res.status(200).json({ data: document[0] });
  } else {
    const document = await userModel.findByIdAndUpdate(
      id, 
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        country: req.body.country,
      },
      { new: true });

    if (!document) {
      const message = `No user for this ID ${id}.`;
      throw next(
        new ApiError(message, errorObject(id, message, "id", "params"), 404)
      );
    };

    res.status(200).json({ data: document });
  };
});
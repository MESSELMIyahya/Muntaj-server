const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = require('../config/s3Client');
const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");
const errorObject = require("../utils/errorObject");

const awsBuckName = process.env.AWS_BUCKET_NAME;

exports.resizeImage = (...names) => 
  asyncHandler(async (req, _, next) => {

    if (req.file) {

      const imageFormat = 'png';

      const buffer = await sharp(req.file.buffer)
      .resize(800, 800)
      .toFormat(imageFormat)
      .jpeg({ quality: 100 })
      .toBuffer();

      const imageName = `${names[1]}-${uuidv4()}-${Date.now()}.${imageFormat}`;

      const params = {
        Bucket: awsBuckName,
        Key: `${names[0]}/${imageName}`,
        Body: buffer,
        ContentType: `image/${imageFormat}`,
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      // Save image name to Into Your db
      req.body.image = imageName;

    };

    next();
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {

    const document = await model.create(req.body);

    res.status(201).json({
      data: document,
    });

  });

exports.getAll = (model, modelName) =>
  asyncHandler(async (req, res) => {

    let filter = {};

    if (req.filterObj) {
      filter = req.filterObj;
    };

    // Get count of products
    const countDocuments = await model.countDocuments();

    // Build query
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields(modelName)
      .search(modelName)
      .paginate(countDocuments);

    // Execute Query
    const { mongooseQuery, paginationResults } = apiFeatures;
    const document = await mongooseQuery;

    res.status(200).json({
      result: document.length,
      paginationResults,
      data: document,
    });

  });

exports.getOne = (model, name) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await model.findById(id);

    if (!document) {
      const message = `No ${name} for this ID ${id}.`;
      throw next(
        new ApiError(message, errorObject(id, message, "id", "params"), 404)
      );
    }

    res.status(200).json({
      data: document,
    });
  });

exports.updateOne = (model, name) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    if (body.image) {
      let document = await model.findByIdAndUpdate(id, body);

      if (!document) {
        const message = `No ${name} for this ID ${id}.`;
        throw next(
          new ApiError(message, errorObject(id, message, "id", "params"), 404)
        );
      };

      const imageUrl = `${document.image}`;
      const baseUrl = `${process.env.AWS_BASE_URL}/`;
      const restOfUrl = imageUrl.replace(baseUrl, "");
      const key = restOfUrl.slice(0, restOfUrl.indexOf("?"));

      const params = {
        Bucket: awsBuckName,
        Key: key,
      };

      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);

      document = await model.find({ _id: id });
      res.status(200).json({ data: document[0] });
    } else {
      const document = await model.findByIdAndUpdate(id, body, { new: true });

      if (!document) {
        const message = `No ${name} for this ID ${id}.`;
        throw next(
          new ApiError(message, errorObject(id, message, "id", "params"), 404)
        );
      };

      res.status(200).json({ data: document });
    };
  });

exports.deleteOne = (model, name, containsImage = false) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await model.findByIdAndDelete(id);

    if (!document) {
      const message = `No ${name} for this ID ${id}.`;
      throw next(
        new ApiError(message, errorObject(id, message, "id", "params"), 404)
      );
    };

    if (!containsImage) {

      res.status(200).json({ data: document });

    } else {
      const imageUrl = `${document.image}`;
      const baseUrl = `${process.env.AWS_BASE_URL}/`;
      const restOfUrl = imageUrl.replace(baseUrl, "");
      const key = restOfUrl.slice(0, restOfUrl.indexOf("?"));

      const params = {
        Bucket: awsBuckName,
        Key: key,
      };

      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);

      res.status(200).json({ data: document });
    };
  });
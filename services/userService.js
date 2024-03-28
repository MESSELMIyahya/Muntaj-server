const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const { 
  createOne,
  getAll,
} = require("./handlersFactory");
const s3Client = require("../config/s3Client");
const { uploadSingleImage, uploadMultipleImages } = require("../middlewares/uploadImageMiddleware");
const userModel = require("../models/userModel");
const storeModel = require("../models/storeModel");
const productModel = require("../models/productModel");
const reviewModel = require("../models/reviewModel");
const ApiError = require("../utils/apiError");
const errorObject = require("../utils/errorObject");

const awsBuckName = process.env.AWS_BUCKET_NAME;

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.resizeUserImage = asyncHandler(async (req, _, next) => {
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
// @route GET /api/v1/user/me
// @access
exports.userGetMyData = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const document = await userModel.findById(id);

  if (!document) {
    const message = `No user for this ID ${id}.`;
    throw next(
      new ApiError(message, errorObject(id, message, undefined, undefined), 404)
    );
  }

  res.status(200).json({
    data: document,
  });
});

// @desc user update my data
// @route PUT /api/v1/user/me
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
        new ApiError(message, errorObject(id, message, undefined, undefined), 404)
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
        new ApiError(message, errorObject(id, message, undefined, undefined), 404)
      );
    };

    res.status(200).json({ data: document });
  };
});






exports.uploadStoreImages = uploadMultipleImages([
  {
    name: "storeImage",
    maxCount: 1,
  },
  {
    name: "storeCoverImage",
    maxCount: 1,
  },
]);

exports.resizStoreImages = asyncHandler(async (req, _, next) => {

  if (req.files.storeImage) {

    const imageFormat = 'png';

    const buffer = await sharp(req.files.storeImage[0].buffer)
    .resize(800, 800)
    .toFormat(imageFormat)
    .jpeg({ quality: 100 })
    .toBuffer();

    const storeImageName = `store-${uuidv4()}-${Date.now()}.${imageFormat}`;

    const params = {
      Bucket: awsBuckName,
      Key: `store/${storeImageName}`,
      Body: buffer,
      ContentType: `image/${imageFormat}`,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Save image name to Into Your db
    req.body.storeImage = storeImageName;

  };

  if (req.files.storeCoverImage) {

    const imageFormat = 'png';

    const buffer = await sharp(req.files.storeCoverImage[0].buffer)
    .toFormat(imageFormat)
    .jpeg({ quality: 100 })
    .toBuffer();

    const storeCoverImageName = `store-${uuidv4()}-${Date.now()}.${imageFormat}`;

    const params = {
      Bucket: awsBuckName,
      Key: `store/${storeCoverImageName}`,
      Body: buffer,
      ContentType: `image/${imageFormat}`,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Save image name to Into Your db
    req.body.storeCoverImage = storeCoverImageName;

  };

  next();
});

// @desc user create store
// @route PUT /api/v1/user/store
// @access
exports.userCreateStore = createOne(storeModel);

// @desc user get my store
// @route GET /api/v1/user/store
// @access
exports.userGetMyeStore = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const document = await storeModel.findOne({
    owner: id,
  });

  if (!document) {
    const message = `This user does not own a Store.`;
    throw next(
      new ApiError(message, errorObject(undefined, message, undefined, undefined), 404)
    );
  }

  res.status(200).json({
    data: document,
  });
});

// @desc user update my store
// @route PUT /api/v1/user/store
// @access
exports.userUpdateMyeStore = asyncHandler(async (req, res, next) => {

  const { id } = req.user;
  const { body } = req;

  if (body.storeImage || body.storeCoverImage) {

    let store = await storeModel.findOneAndUpdate(
      { owner: id },
      body,
    );

    if (!store) {
      const message = `This user does not own a Store.`;
      throw next(
        new ApiError(message, errorObject(undefined, message, undefined, undefined), 404)
      );
    };

    // eslint-disable-next-line prefer-const
    let allUrlsImages = [];
    if (body.storeImage) {
      allUrlsImages.push(store.storeImage);
    };
    if (body.storeCoverImage) {
      allUrlsImages.push(store.storeCoverImage);
    };
  
    const keys = allUrlsImages.map((item) => {
      const imageUrl = `${item}`;
      const baseUrl = `${process.env.AWS_BASE_URL}/`;
      const restOfUrl = imageUrl.replace(baseUrl, '');
      const key = restOfUrl.slice(0, restOfUrl.indexOf('?'));
      return key;
    });

    await Promise.all(
  
      keys.map(async (key) => {
  
        const params = {
          Bucket: awsBuckName,
          Key: key,
        };
  
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
  
      })
  
    );

    store = await storeModel.find({ owner: id });

    res.status(200).json({ data: store[0] });

  } else {

    const store = await storeModel.findOneAndUpdate(
      { owner: id },
      body,
      { new: true }
    );

    if (!store) {
      const message = `This user does not own a Store.`;
      throw next(
        new ApiError(message, errorObject(undefined, message, undefined, undefined), 404)
      );
    };
  
    res.status(200).json({ data: store });

  };

});

// @desc user delete my store
// @route DELETE /api/v1/user/store
// @access
exports.userDeleteMyeStore = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const document = await storeModel.findOneAndDelete({
    owner: id,
  });

  if (!document) {
    const message = `This user does not own a Store.`;
    throw next(
      new ApiError(message, errorObject(undefined, message, undefined, undefined), 404)
    );
  };

  if (document.storeImage) {

    const imageUrl = `${document.storeImage}`;
    const baseUrl = `${process.env.AWS_BASE_URL}/`;
    const restOfUrl = imageUrl.replace(baseUrl, "");
    const key = restOfUrl.slice(0, restOfUrl.indexOf("?"));
  
    const params = {
      Bucket: awsBuckName,
      Key: key,
    };
  
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);

  };

  if (document.storeCoverImage) {

    const imageUrl = `${document.storeCoverImage}`;
    const baseUrl = `${process.env.AWS_BASE_URL}/`;
    const restOfUrl = imageUrl.replace(baseUrl, "");
    const key = restOfUrl.slice(0, restOfUrl.indexOf("?"));
  
    const params = {
      Bucket: awsBuckName,
      Key: key,
    };
  
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);

  };

  await productModel.deleteMany({ store: document._id });

  res.status(200).json({ data: document });

});






exports.uploadProductImagesAndVideo = uploadMultipleImages([
  {
    name: "primaryImage",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 6,
  },
  {
    name: "video",
    maxCount: 1,
  },
]);

exports.resizeProductImagesAndVideo = asyncHandler(async (req, res, next) => {

  if (req.files.primaryImage) {

    if (!`${req.files.primaryImage[0].mimetype}`.startsWith('image')) {
      const message = `Primary image must be of type image.`;
      throw next(
        new ApiError(message, errorObject(undefined, message, 'primaryImage', 'body'), 400)
      );
    };

    const imageFormat = 'jpg';

    const buffer = await sharp(req.files.primaryImage[0].buffer)
    .toFormat(imageFormat)
    .jpeg({ quality: 100 })
    .toBuffer();

    const fileName = `product-image-${uuidv4()}-${Date.now()}.${imageFormat}`;

    const params = {
      Bucket: awsBuckName,
      Key: `products/${fileName}`,
      Body: buffer,
      ContentType: `image/${imageFormat}`,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    req.body.primaryImage = fileName;

  };

  if (req.files.images) {

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < req.files.images.length; i++) {
      if (!`${req.files.images[i].mimetype}`.startsWith('image')) {
        const message = `Images must be of type image.`;
        throw next(
          new ApiError(message, errorObject(undefined, message, 'images', 'body'), 400)
        );
      };
    };

    req.body.images = [];

    await Promise.all(

      req.files.images.map(async (img, index) => {

        const imageFormat = 'jpg';

        const buffer = await sharp(img.buffer)
        .toFormat(imageFormat)
        .jpeg({ quality: 100 })
        .toBuffer();

        const imageName = `product-image-${uuidv4()}-${Date.now()}-${index + 1}.${imageFormat}`;
    
        const params = {
          Bucket: awsBuckName,
          Key: `products/${imageName}`,
          Body: buffer,
          ContentType: `image/${imageFormat}`,
        };
    
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
    
        // Save image name to Into Your db
        req.body.images.push(`${imageName}`);

      })

    );

  };

  if (req.files.video) {

    if (!`${req.files.video[0].mimetype}`.startsWith('video')) {
      const message = `Video must be of type video.`;
      throw next(
        new ApiError(message, errorObject(undefined, message, 'video', 'body'), 400)
      );
    };

    const {mimetype} = req.files.video[0];

    const imageFormat = `${mimetype}`.slice(`${mimetype}`.indexOf('/') + 1);

    const {buffer} = req.files.video[0];

    const fileName = `product-video-${uuidv4()}-${Date.now()}.${imageFormat}`;

    const params = {
      Bucket: awsBuckName,
      Key: `products/${fileName}`,
      Body: buffer,
      ContentType: `image/${imageFormat}`,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    req.body.video = fileName;

  };

  next();
});

// @desc user create product
// @route POST /api/v1/user/product
// @access
exports.userCreateProduct = createOne(productModel);

// @desc user get my product
// @route GET /api/v1/user/product
// @access
exports.userGetMyeProductsFilterObj = asyncHandler(async (req, _, next) => {
  const {id} = req.user;
  req.filterObj = {
    owner: id,
  };
  next();
});
exports.userGetMyeProducts = getAll(productModel);

// @desc user get my product
// @route PUT /api/v1/user/product/:id
// @access
exports.userUpdateMyProduct = asyncHandler(async (req,res, next) => {

  const { id } = req.params;
  const {body} = req;

  if (body.primaryImage || body.images || body.video) {

    let product = await productModel.findByIdAndUpdate(
      id,
      body,
    );

    if (!product) {
      const message = `No product for this ID ${id}.`;
      throw next(
        new ApiError(message, errorObject(id, message, undefined, undefined), 404)
      );
    };

    // eslint-disable-next-line prefer-const
    let allUrlsImages = [];
    if (body.primaryImage) {
      allUrlsImages.push(product.primaryImage);
    };
    if (body.video) {
      allUrlsImages.push(product.video);
    };    
    if (body.images) {
      allUrlsImages.push(...product.images);
    };
  
    const keys = allUrlsImages.map((item) => {
      const imageUrl = `${item}`;
      const baseUrl = `${process.env.AWS_BASE_URL}/`;
      const restOfUrl = imageUrl.replace(baseUrl, '');
      const key = restOfUrl.slice(0, restOfUrl.indexOf('?'));
      return key;
    });

    await Promise.all(
  
      keys.map(async (key) => {
  
        const params = {
          Bucket: awsBuckName,
          Key: key,
        };
  
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
  
      })
  
    );

    product = await productModel.find({ _id: id });

    res.status(200).json({ data: product[0] });

  } else {

    const product = await productModel.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!product) {
      const message = `No product for this ID ${id}.`;
      throw next(
        new ApiError(message, errorObject(id, message, undefined, undefined), 404)
      );
    };
  
    res.status(200).json({ data: product });

  }

});

// @desc user delete my product
// @route DELETE /api/v1/user/product
// @access
exports.userDeleteMyeProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;

  const product = await productModel.findOneAndDelete({
    _id: productId,
    owner: userId,
  });

  if (!product) {
    const message = `No product for this ID ${productId}.`;
    throw next(
      new ApiError(message, errorObject(undefined, message, undefined, undefined), 404)
    );
  };

  // eslint-disable-next-line prefer-const
  let allUrlsImages = [];
  if (product.images) {
    allUrlsImages.push(...product.images);
  };
  if (product.primaryImage) {
    allUrlsImages.push(product.primaryImage);
  };
  if (product.video) {
    allUrlsImages.push(product.video);
  };

  const keys = allUrlsImages.map((item) => {
    const imageUrl = `${item}`;
    const baseUrl = `${process.env.AWS_BASE_URL}/`;
    const restOfUrl = imageUrl.replace(baseUrl, '');
    const key = restOfUrl.slice(0, restOfUrl.indexOf('?'));
    return key;
  });

  await Promise.all(

    keys.map(async (key) => {

      const params = {
        Bucket: awsBuckName,
        Key: key,
      };

      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);

    })

  );

  await reviewModel.deleteMany({ product: productId });

  res.status(200).json({ data: product });

});
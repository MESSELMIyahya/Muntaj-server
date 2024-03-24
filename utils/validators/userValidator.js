const asyncHandler = require("express-async-handler");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const storeModel = require("../../models/storeModel");
const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const ApiError = require("../apiError");
const errorObject = require('../errorObject');

exports.userUpdateMyDataValidator = [
  check("firstName")
    .optional()
    .isString()
    .withMessage("First name must be of type string.")
    .isLength({ min: 2, max: 16 })
    .withMessage("First name should be between 2 and 16 characters"),

  check("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be of type string.")
    .isLength({ min: 2, max: 16 })
    .withMessage("Last name should be between 2 and 16 characters"),

  check("userName")
    .optional()
    .isString()
    .withMessage("user name must be of type string.")
    .isLength({ min: 4, max: 32 })
    .withMessage("user name should be between 4 and 32 characters"),

  check("country")
    .optional()
    .isString()
    .withMessage("Country name must be of type string.")
    .isLength({ min: 2, max: 16 })
    .withMessage("Country name should be between 2 and 16 characters"),

  check("profileImage")
    .custom((_, { req }) => {
      if (!(req.body.profileImage === undefined)) {
        throw new Error('The field you entered for profileImage is not an Image type.');
      };
      return true;
    }),

  validatorMiddleware,
];






exports.userCreateStoreMiddlewareValidator = asyncHandler(
  async (req, _, next) => {
    const { id } = req.user;
    const store = await storeModel.findOne({
      owner: id,
    });
    if (store) {
      const message = `You cannot create more then one store.`;
      throw next(
        new ApiError(message, errorObject(
          undefined,
          message,
          undefined,
          undefined
        ), 404)
      );
    };
    req.body.owner = id;
    next();
  }
);

exports.userCreateStoreValidator = [
  check("name")
    .notEmpty()
    .withMessage("Store name is required.")
    .isString()
    .withMessage("Store name must be of type string.")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Store name must be at least 2 characters.")
    .isLength({ max: 16 })
    .withMessage("Store name cannot exceed 16 characters.")
    .custom(async (val) => {
      const data = await storeModel.findOne({
        name: val,
      });
      if (data) {
        throw new Error("This store name already used.");
      }
    }),

  check("storeImage")
    .custom((_, { req }) => {
      if (!(req.body.storeImage === undefined)) {
        throw new Error('The field you entered for storeImage is not an Image type.');
      };
      return true;
    }),

  check("storeCoverImage")
    .custom((_, { req }) => {
      if (!(req.body.storeCoverImage === undefined)) {
        throw new Error('The field you entered for storeCoverImage is not an Image type.');
      };
      return true;
    }),

  check("location.country")
    .notEmpty()
    .withMessage("Country is required.")
    .isString()
    .withMessage("Country must be of type string.")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Country must be at least 2 characters.")
    .isLength({ max: 16 })
    .withMessage("Country cannot exceed 16 characters."),

  check("location.address")
    .notEmpty()
    .withMessage("Address is required.")
    .isString()
    .withMessage("Address must be of type string.")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Address must be at least 8 characters.")
    .isLength({ max: 32 })
    .withMessage("Address cannot exceed 32 characters."),

  check("contact.phoneNumbers")
    .notEmpty()
    .withMessage("phone numbers is required.")
    .isArray()
    .withMessage("phone numbers must be of type array."),

  check("contact.phoneNumbers.*")
    .isString()
    .withMessage("Phone number must be of type string.")
    .isMobilePhone()
    .withMessage("Invalid phone number."),

  check("contact.email")
    .notEmpty()
    .withMessage("Enail is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .trim(),

  check("contact.website")
    .optional()
    .isURL()
    .withMessage("Website Invalid URL format."),

  check("contact.socialMedia.facebook")
    .optional()
    .isURL()
    .withMessage("Facebook Invalid URL format."),

  check("contact.socialMedia.instagran")
    .optional()
    .isURL()
    .withMessage("Instagram Invalid URL format."),

  check("contact.socialMedia.twitter")
    .optional()
    .isURL()
    .withMessage("Twitter Invalid URL format."),

  check("contact.socialMedia.linkedIn")
    .optional()
    .isURL()
    .withMessage("LinkedIn Invalid URL format."),

  check("contact.socialMedia.youtube")
    .optional()
    .isURL()
    .withMessage("Youtube Invalid URL format."),

  validatorMiddleware,
];

exports.userUpdateStoreValidator = [
  check("name")
    .optional()
    .isString()
    .withMessage("Store name must be of type string.")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Store name must be at least 2 characters.")
    .isLength({ max: 16 })
    .withMessage("Store name cannot exceed 16 characters.")
    .custom(async (val) => {
      const data = await storeModel.findOne({
        name: val,
      });
      if (data) {
        throw new Error("This store name already used.");
      }
    }),

  check("storeImage")
    .custom((_, { req }) => {
      if (!(req.body.storeImage === undefined)) {
        throw new Error('The field you entered for storeImage is not an Image type.');
      };
      return true;
    }),

  check("storeCoverImage")
    .custom((_, { req }) => {
      if (!(req.body.storeCoverImage === undefined)) {
        throw new Error('The field you entered for storeCoverImage is not an Image type.');
      };
      return true;
    }),

  check("location.country")
    .optional()
    .isString()
    .withMessage("Country must be of type string.")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Country must be at least 2 characters.")
    .isLength({ max: 16 })
    .withMessage("Country cannot exceed 16 characters."),

  check("location.address")
    .optional()
    .isString()
    .withMessage("Address must be of type string.")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Address must be at least 8 characters.")
    .isLength({ max: 32 })
    .withMessage("Address cannot exceed 32 characters."),

  check("contact.phoneNumbers")
    .optional()
    .isArray()
    .withMessage("phone numbers must be of type array."),

  check("contact.phoneNumbers.*")
    .optional()
    .isString()
    .withMessage("Phone number must be of type string.")
    .isMobilePhone()
    .withMessage("Invalid phone number."),

    check("contact.email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .trim(),

  check("contact.website")
    .optional()
    .isURL()
    .withMessage("Website Invalid URL format."),

  check("contact.socialMedia.facebook")
    .optional()
    .isURL()
    .withMessage("Facebook Invalid URL format."),

  check("contact.socialMedia.instagran")
    .optional()
    .isURL()
    .withMessage("Instagram Invalid URL format."),

  check("contact.socialMedia.twitter")
    .optional()
    .isURL()
    .withMessage("Twitter Invalid URL format."),

  check("contact.socialMedia.linkedIn")
    .optional()
    .isURL()
    .withMessage("LinkedIn Invalid URL format."),

  check("contact.socialMedia.youtube")
    .optional()
    .isURL()
    .withMessage("Youtube Invalid URL format."),

  validatorMiddleware,
];






exports.userCreateProductMiddlewareValidator = asyncHandler(
  async (req, _, next) => {

    const { id } = req.user;

    const store = await storeModel.findOne({
      owner: id,
    });
  
    if (!store) {
      const message = `This user does not own a Store.`;
      throw next(
        new ApiError(message, errorObject(undefined, message, undefined, undefined), 400)
      );
    };
  
    req.body.owner = id;
    req.body.store = store._id;
  
    if (req.files.primaryImage) {
      if (!`${req.files.primaryImage[0].mimetype}`.startsWith('image')) {
        const message = `Primary image must be of type image.`;
        throw next(
          new ApiError(message, errorObject(undefined, message, 'primaryImage', 'body'), 400)
        );
      };
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
    };
  
    if (req.files.video) {
      if (!`${req.files.video[0].mimetype}`.startsWith('video')) {
        const message = `Video must be of type video.`;
        throw next(
          new ApiError(message, errorObject(undefined, message, 'video', 'body'), 400)
        );
      };
    };

    next();

  }
);

exports.userCreateProductValidator = [
  check('name')
    .notEmpty()
    .withMessage('Product name is required.')
    .isString()
    .withMessage('Product name must be a string.')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Product name must be at least 2 characters.')
    .isLength({ max: 64 })
    .withMessage('Product name cannot exceed 64 characters.'),

  check('description')
    .notEmpty()
    .withMessage('Product description is required.')
    .isString()
    .withMessage('Product description must be a string.')
    .trim()
    .isLength({ min: 20 })
    .withMessage('Product description must be at least 20 characters.'),

  check("primaryImage")
    .custom((_, { req }) => {
      if (!(req.body.primaryImage === undefined)) {
        throw new Error('The field you entered for primary image is not an Image type.');
      };
      return true;
    }),

  check("images")
    .custom((_, { req }) => {
      if (!(req.body.images === undefined)) {
        throw new Error('The field you entered for Images is not an Image type.');
      };
      return true;
    }),

  check("video")
    .custom((_, { req }) => {
      if (!(req.body.video === undefined)) {
        throw new Error('The field you entered for video is not an Image type.');
      };
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category.")
    .isMongoId()
    .withMessage("Invalid category id format.")
    .custom(async (_, { req }) => {
      const id = req.body.category;
      const category = await categoryModel.findById(id);
      if (category) {
        return true;
      } 
      throw new Error(`No category for this id ${id}.`);
    }),

  check('colors.*')
    .trim()
    .isString()
    .withMessage('Product color must be a string.')
    .isLength({ min: 2 })
    .withMessage('Product color must be at least 2 characters.')
    .isLength({ max: 16 })
    .withMessage('Product color cannot exceed 16 characters.'),

  check('sizes.sm')
    .trim()
    .isString().withMessage('Small size must be a string.')
    .isLength({ min: 2 }).withMessage('Small size must be at least 2 characters.')
    .isLength({ max: 16 }).withMessage('Small size cannot exceed 16 characters.'),

  check('sizes.md')
    .trim()
    .isString().withMessage('Medium size must be a string.')
    .isLength({ min: 2 }).withMessage('Medium size must be at least 2 characters.')
    .isLength({ max: 16 }).withMessage('Medium size cannot exceed 16 characters.'),

  check('sizes.lg')
    .trim()
    .isString().withMessage('Large size must be a string.')
    .isLength({ min: 2 }).withMessage('Large size must be at least 2 characters.')
    .isLength({ max: 16 }).withMessage('Large size cannot exceed 16 characters.'),

  check('sizes.xl')
    .trim()
    .isString().withMessage('Extra Large size must be a string.')
    .isLength({ min: 2 }).withMessage('Extra Large size must be at least 2 characters.')
    .isLength({ max: 16 }).withMessage('Extra Large size cannot exceed 16 characters.'),

  validatorMiddleware,
];

exports.userCreateProductImageValidator = [
  check("primaryImage")
    .notEmpty()
    .withMessage("Product primary image is required."),

  validatorMiddleware,
];

exports.userUpdateProductMiddlewareValidator = asyncHandler(
  async (req, _, next) => {

    const productId = req.params.id;
    const userId = req.user.id;
  
    const product = await productModel.findOne({
      _id: productId,
      owner: userId,
    });
  
    if (!product) {
      const message = `No product for this ID ${productId}.`;
      throw next(
        new ApiError(message, errorObject(productId, message, undefined, undefined), 404)
      );
    };
  
    if (req.files.primaryImage) {
      if (!`${req.files.primaryImage[0].mimetype}`.startsWith('image')) {
        const message = `Primary image must be of type image.`;
        throw next(
          new ApiError(message, errorObject(undefined, message, 'primaryImage', 'body'), 400)
        );
      };
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
    };
  
    if (req.files.video) {
      if (!`${req.files.video[0].mimetype}`.startsWith('video')) {
        const message = `Video must be of type video.`;
        throw next(
          new ApiError(message, errorObject(undefined, message, 'video', 'body'), 400)
        );
      };
    };

    next();

  }
);

exports.userUpdateProductValidator = [
  check('name')
    .optional()
    .isString()
    .withMessage('Product name must be a string.')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Product name must be at least 2 characters.')
    .isLength({ max: 64 })
    .withMessage('Product name cannot exceed 64 characters.'),

  check('description')
    .optional()
    .isString()
    .withMessage('Product description must be a string.')
    .trim()
    .isLength({ min: 20 })
    .withMessage('Product description must be at least 20 characters.'),

  check("primaryImage")
    .custom((_, { req }) => {
      if (!(req.body.primaryImage === undefined)) {
        throw new Error('The field you entered for primary image is not an Image type.');
      };
      return true;
    }),

  check("images")
    .custom((_, { req }) => {
      if (!(req.body.images === undefined)) {
        throw new Error('The field you entered for Images is not an Image type.');
      };
      return true;
    }),

  check("video")
    .custom((_, { req }) => {
      if (!(req.body.video === undefined)) {
        throw new Error('The field you entered for video is not an Image type.');
      };
      return true;
    }),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category id format.")
    .custom(async (_, { req }) => {
      const id = req.body.category;
      const category = await categoryModel.findById(id);
      if (category) {
        return true;
      } 
      throw new Error(`No category for this id ${id}.`);
    }),

  check('colors.*')
    .trim()
    .isString()
    .withMessage('Product color must be a string.')
    .isLength({ min: 2 })
    .withMessage('Product color must be at least 2 characters.')
    .isLength({ max: 16 })
    .withMessage('Product color cannot exceed 16 characters.'),

  check('sizes.sm')
    .optional()
    .trim()
    .isString().withMessage('Small size must be a string.')
    .isLength({ min: 2 }).withMessage('Small size must be at least 2 characters.')
    .isLength({ max: 16 }).withMessage('Small size cannot exceed 16 characters.'),

  check('sizes.md')
    .optional()
    .trim()
    .isString().withMessage('Medium size must be a string.')
    .isLength({ min: 2 }).withMessage('Medium size must be at least 2 characters.')
    .isLength({ max: 16 }).withMessage('Medium size cannot exceed 16 characters.'),

  check('sizes.lg')
    .optional()
    .trim()
    .isString().withMessage('Large size must be a string.')
    .isLength({ min: 2 }).withMessage('Large size must be at least 2 characters.')
    .isLength({ max: 16 }).withMessage('Large size cannot exceed 16 characters.'),

  check('sizes.xl')
    .optional()
    .trim()
    .isString().withMessage('Extra Large size must be a string.')
    .isLength({ min: 2 }).withMessage('Extra Large size must be at least 2 characters.')
    .isLength({ max: 16 }).withMessage('Extra Large size cannot exceed 16 characters.'),

  validatorMiddleware,
];

exports.validateIDParams = [
  check("id")
    .isMongoId()
    .withMessage("Invalid product id format."),

  validatorMiddleware,
];
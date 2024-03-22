const asyncHandler = require("express-async-handler");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const storeModel = require("../../models/storeModel");
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

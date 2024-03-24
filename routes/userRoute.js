const express = require(`express`);

const {
  userUpdateMyDataValidator,

  userCreateStoreMiddlewareValidator,
  userCreateStoreValidator,
  userUpdateStoreValidator,

  userCreateProductMiddlewareValidator,
  userCreateProductValidator,
  userCreateProductImageValidator,
  userUpdateProductMiddlewareValidator,
  userUpdateProductValidator,
  validateIDParams
} = require("../utils/validators/userValidator");
const {
  uploadUserImage,
  resizeUserImage,
  userGetMyData,
  userUpdateMyData,

  uploadStoreImages,
  resizStoreImages,
  userCreateStore,
  userGetMyeStore,
  userUpdateMyeStore,
  userDeleteMyeStore,

  uploadProductImagesAndVideo,
  resizeProductImagesAndVideo,
  userCreateProduct,
  userGetMyeProductsFilterObj,
  userGetMyeProducts,
  userUpdateMyProduct,
  userDeleteMyeProduct
} = require("../services/userService");

const authVerifierMiddleware = require('../middlewares/auth/index');

const router = express.Router();

router.use(
  authVerifierMiddleware,
);

router.route("/me")
  .get(
    userGetMyData,
  )
  .put(
    uploadUserImage,
    userUpdateMyDataValidator,
    resizeUserImage,
    userUpdateMyData,
  );

router.route("/store")
  .get(
    userGetMyeStore
  )
  .post(
    uploadStoreImages,
    userCreateStoreMiddlewareValidator,
    userCreateStoreValidator,
    resizStoreImages,
    userCreateStore
  )
  .put(
    uploadStoreImages,
    userUpdateStoreValidator,
    resizStoreImages,
    userUpdateMyeStore,
  )
  .delete(
    userDeleteMyeStore
  );

router.route("/product")
  .get(
    userGetMyeProductsFilterObj,
    userGetMyeProducts
  )
  .post(
    uploadProductImagesAndVideo,
    userCreateProductMiddlewareValidator,
    userCreateProductValidator,
    resizeProductImagesAndVideo,
    userCreateProductImageValidator,    
    userCreateProduct
  )

router.route("/product/:id")
  .put(
    uploadProductImagesAndVideo,
    validateIDParams,
    userUpdateProductMiddlewareValidator,
    userUpdateProductValidator,
    resizeProductImagesAndVideo,
    userUpdateMyProduct
  )
  .delete(
    validateIDParams,
    userDeleteMyeProduct
  );

module.exports = router;
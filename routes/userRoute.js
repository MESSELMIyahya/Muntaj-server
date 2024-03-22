const express = require(`express`);

const {
  userUpdateMyDataValidator,
  userCreateStoreMiddlewareValidator,
  userCreateStoreValidator,
  userUpdateStoreValidator,
} = require("../utils/validators/userValidator");
const {
  uploadImage,
  resizeImage,
  userGetMyData,
  userUpdateMyData,
  uploadImages,
  resizImages,
  userCreateStore,
  userGetMyeStore,
  userUpdateMyeStore,
  userDeleteMyeStore
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
    uploadImage,
    userUpdateMyDataValidator,
    resizeImage,
    userUpdateMyData,
  );

router.route("/store")
  .get(
    userGetMyeStore
  )
  .post(
    uploadImages,
    userCreateStoreMiddlewareValidator,
    userCreateStoreValidator,
    resizImages,
    userCreateStore
  )
  .put(
    uploadImages,
    userUpdateStoreValidator,
    resizImages,
    userUpdateMyeStore,
  )
  .delete(
    userDeleteMyeStore
  )

module.exports = router;
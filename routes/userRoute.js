const express = require(`express`);

const {
  userUpdateMyDataValidator,
} = require("../utils/validators/userValidator");
const {
  uploadImage,
  resizeImage,
  userGetMyData,
  userUpdateMyData,
} = require("../services/userService");

const authVerifierMiddleware = require('../middlewares/auth/index');

const router = express.Router();

router.use(
  authVerifierMiddleware,
);

router.route("/")
  .get(
    userGetMyData,
  )
  .put(
    uploadImage,
    userUpdateMyDataValidator,
    resizeImage,
    userUpdateMyData,
  );

module.exports = router;
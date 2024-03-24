const express = require(`express`);

const {
  getProductValidator
} = require("../utils/validators/productValidator");
const {
  getProducts,
  getProduct,
} = require("../services/productService");

const router = express.Router();

router.route("/")
  .get(
    getProducts
  )

router
  .route("/:id")
  .get(
    getProductValidator,
    getProduct
  )

module.exports = router;
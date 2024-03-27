const express = require(`express`);

const {
  getCategoryValidator,
} = require("../utils/validators/categoryValidator");
const {
  getCategories,
  getCategory,
} = require("../services/categoryService");

const router = express.Router();

router.route("/")
  .get(
    getCategories
  )

router
  .route("/:id")
  .get(
    getCategoryValidator,
    getCategory
  )

module.exports = router;
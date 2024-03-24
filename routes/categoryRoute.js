const express = require(`express`);

const {
  getCategoryValidator,
  // createCategoryValidator,
  // updateCategoryValidator,
  // deleteCategoryValidator,
  // imageValidator
} = require("../utils/validators/categoryValidator");
const {
  // uploadCategoryImage,
  // resizeImage,
  // createCategory,
  getCategories,
  getCategory,
  // updateCategory,
  // deleteCategory,
} = require("../services/categoryService");

const router = express.Router();

router.route("/")
  .get(
    getCategories
  )
  // .post(
  //   uploadCategoryImage,
  //   createCategoryValidator,
  //   resizeImage,
  //   imageValidator,
  //   createCategory
  // );

router
  .route("/:id")
  .get(
    getCategoryValidator,
    getCategory
  )
  // .put(
  //   uploadCategoryImage,
  //   updateCategoryValidator,
  //   resizeImage,
  //   updateCategory
  // ).delete(
  //   deleteCategoryValidator,
  //   deleteCategory
  // );

module.exports = router;
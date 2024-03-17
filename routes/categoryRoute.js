const express = require(`express`);

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  imageValidator
} = require("../utils/validators/categoryValidator");
const {
  uploadCategoryImage,
  resizeImage,
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require(`../services/categoryService`);
// const protect_allowedTo = require("../services/authServises/protect&allowedTo");
// const subCategoriesRoute = require("./subCategoryRoute");

const router = express.Router();

// router.use(
//     "/:categoryId/subcategories",
//     subCategoriesRoute
//   );

router.route("/")
  .get(
    getCategories
  ).post(
    // protect_allowedTo.protect(),
    // protect_allowedTo.allowedTo("admin", "manager"),
    uploadCategoryImage,
    createCategoryValidator,
    resizeImage,
    imageValidator,
    createCategory
  );

router
  .route("/:id")
  .get(
    getCategoryValidator,
    getCategory
  ).put(
    // protect_allowedTo.protect(),
    // protect_allowedTo.allowedTo("admin", "manager"),
    uploadCategoryImage,
    updateCategoryValidator,
    resizeImage,
    updateCategory
  ).delete(
    // protect_allowedTo.protect(),
    // protect_allowedTo.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
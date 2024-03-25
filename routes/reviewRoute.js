const express = require("express");

const {
  getReviewsValidator,
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  createFilterObj,
  getReviews,
  getReview,
  setProductIdAndUserIdToBody,
  createReview,
  updateReview,
  deleteReview,
} = require("../services/reviewService");

const authVerifierMiddleware = require('../middlewares/auth/index');

const router = express.Router( { mergeParams: true } );

router.use(
  authVerifierMiddleware,
);

router
  .route("/")
  .get(
    getReviewsValidator,
    createFilterObj,
    getReviews
  ).post(
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(
    getReviewValidator,
    getReview
  )
  .put(
    updateReviewValidator,
    updateReview
  )
  .delete(
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
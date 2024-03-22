const express = require(`express`);

const {
  getStoreValidator
} = require("../utils/validators/storeValidator");
const {
  getStores,
  getStore,
} = require("../services/storeService");

const router = express.Router();

router.route("/")
  .get(
    getStores
  )

router
  .route("/:id")
  .get(
    getStoreValidator,
    getStore
  )

module.exports = router;
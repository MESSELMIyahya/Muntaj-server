const {
  getAll,
  getOne,
} = require("./handlersFactory");

const storeModel = require(`../models/storeModel`);

// @desc Get list of stores
// @route GET /api/v1/store
// @access
exports.getStores = getAll(storeModel);

// @desc Get store by id
// @route GET /api/v1/store/:id
// @access
exports.getStore = getOne(storeModel, 'store');
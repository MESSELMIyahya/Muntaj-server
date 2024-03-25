const categoryRoutes = require(`./categoryRoute`);
const userRoute = require(`./userRoute`);
const storeRoute = require(`./storeRoute`);
const productRoute = require(`./productRoute`);
const reviewRoute = require(`./reviewRoute`);

const authRoutes = require("./auth/index");

const mountRoutes = (app) => {
  app.use(`/api/v1/categories`, categoryRoutes);
  app.use(`/api/v1/user`, userRoute);
  app.use(`/api/v1/store`, storeRoute);
  app.use(`/api/v1/product`, productRoute);
  app.use(`/api/v1/review`, reviewRoute);
  app.use(`/auth`, authRoutes);
};

module.exports = mountRoutes;
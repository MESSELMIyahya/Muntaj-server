const categoryRoutes = require(`./categoryRoute`);
const userRoute = require(`./userRoute`);

const authRoutes = require("./auth/index");

const mountRoutes = (app) => {
  app.use(`/api/v1/categories`, categoryRoutes);
  app.use(`/api/v1/user`, userRoute);  
  app.use(`/auth`, authRoutes);
};

module.exports = mountRoutes;
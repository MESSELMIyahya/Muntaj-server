const categoryRoutes = require(`./categoryRoute`);

const mountRoutes = (app) => {
  app.use(`/api/v1/categories`, categoryRoutes);
};

module.exports = mountRoutes;
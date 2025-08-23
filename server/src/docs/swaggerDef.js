const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  basePath: '/v1',
  info: {
    title: 'Eventify API',
    version,
    description: 'Eventify API documentation',
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/v1',
    createProxyMiddleware({
      target: 'https://server-app-js.herokuapp.com/',
      changeOrigin: true,
    })
  );
};
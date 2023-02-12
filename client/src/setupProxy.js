const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/v1',
    createProxyMiddleware({
      target: 'https://my-blog-kfgs.vercel.app/',
      changeOrigin: true,
    })
  );
};
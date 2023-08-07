const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Specify the endpoint you want to proxy
    createProxyMiddleware({
      target: 'http://localhost:3000', // Replace with your backend server URL
      changeOrigin: true,
    })
  );
};

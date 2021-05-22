const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config')
const app = express()
const path = require('path')
const {port, target} = config
const options = {
  target,
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  // pathRewrite: {
  //   '^/api/old-path': '/api/new-path', // rewrite path
  //   '^/api/remove/path': '/path', // remove base path
  // }
};
const exampleProxy = createProxyMiddleware(options);
app.use('/api', exampleProxy)
app.use(express.static('dist'))
app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'))
})

// console.log(port)
app.listen(port, () => {
  console.log(`server is running at port ${port}`)
})
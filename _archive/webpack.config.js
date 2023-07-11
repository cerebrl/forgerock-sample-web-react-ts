const path = require('path');

module.exports = {
  entry: {
    interceptor: './src/interceptor.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
  },
};
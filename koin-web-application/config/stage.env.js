'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"stage"',
  ROOT_API: '"http://stage.api.koreatech.in/"',
  FONT_FLAG: '"false"'
});

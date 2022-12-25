module.exports = {
  transform: {
    '\\.ts$': ['babel-jest', { configFile: './.jest/babel.config.js' }]
  }
}
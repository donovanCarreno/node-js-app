const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-tutorial', 'root', 'password', {
  dialect: 'mysql',
  host: 'localhost'
})

module.exports = sequelize

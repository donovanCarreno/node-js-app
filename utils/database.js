// const Sequelize = require('sequelize')

// const sequelize = new Sequelize('node-tutorial', 'root', 'password', {
//   dialect: 'mysql',
//   host: 'localhost'
// })

// module.exports = sequelize

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = (cb) => {
  MongoClient.connect('mongodb+srv://donovan:pwd@node-js-0gkfp.mongodb.net/shop?retryWrites=true&w=majority')
  .then(client => {
    console.log('Connected!')
    _db = client.db()
    cb()
  })
  .catch(err => {
    console.log({err})
    throw err
  })
}

const getDb = () => {
  if (_db) {
    return _db
  }
  throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb

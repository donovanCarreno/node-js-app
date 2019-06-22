const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const expressHbs = require('express-handlebars')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require('./controllers/error')

// const sequelize = require('./utils/database')

// const Product = require('./models/product-sql')
// const User = require('./models/user')
// const Cart = require('./models/cart-sql')
// const CartItem = require('./models/cart-item')
// const Order = require('./models/order')
// const OrderItem = require('./models/order-item')

// const mongoConnect = require('./utils/database').mongoConnect
// const User = require('./models/user-mdb')

const mongoose = require('mongoose')
const User = require('./models/user-mg')

const app = express()

// app.engine('hbs', expressHbs({
//   layoutsDir: 'views/layouts/',
//   defaultLayout: 'main-layout',
//   extname: 'hbs'
// }))
// app.set('view engine', 'hbs')
// app.set('view engine', 'pug')
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  // sql
  // User.findById(1)
  //   .then(user => {
  //     req.user = user
  //     next()
  //   })
  //   .catch(e => console.log({e}))

  // mongodb
  // User.findById('5d04ef73e749c50fe39e7ea1')
  //   .then(user => {
  //     req.user = new User(user.name, user.email, user.cart, user._id)
  //     next()
  //   })
  //   .catch(e => console.log({e}))  

  // mongoose
  User
    .findById('5d0c24565c46a4213cf5df83')
    .then(user => {
      req.user = user
      next()
    })
    .catch(e => console.log({e}))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

// mongoConnect(() => {
//   app.listen(3000)
// })

mongoose.connect('mongodb+srv://donovan:pwd@node-js-0gkfp.mongodb.net/shop?retryWrites=true&w=majority')
  .then(res => {
    User
      .findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: 'donovan',
            email: 'me@me.com',
            cart: {
              items: []
            }
          })
          user.save()
        }
      })
    app.listen(3000)
  })
  .catch(e => console.log({e}))

// Product.belongsTo(User, {
//   constraints: true,
//   onDelete: 'CASCADE'
// })

// User.hasMany(Product)
// User.hasOne(Cart)
// Cart.belongsTo(User)
// Cart.belongsToMany(Product, {through: CartItem})
// Product.belongsToMany(Cart, {through: CartItem})
// Order.belongsTo(User)
// User.hasMany(Order)
// Order.belongsToMany(Product, {through: OrderItem})


// sequelize
//   // .sync({force: true})  // used only for dev
//   .sync()
//   .then(res => {
//     return User.findById(1)
//   })
//   .then(user => {
//     if (!user) {
//       return User.create({name: 'donovan', email: 'me@me.com'})
//     }
//     return user
//   })
//   .then(user => {
//     return user.createCart()
//     app.listen(3000)
//   })
//   .then(cart => {
//     app.listen(3000)
//   })
//   .catch(e => console.log({e}))

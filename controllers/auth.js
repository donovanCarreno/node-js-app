const User = require('../models/user-mg')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  })
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  })
}

exports.postLogin = (req, res, next) => {
  const {email, password} = req.body
  User
    .findOne({email})
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password')
        return res.redirect('/login')
      }

      bcrypt
        .compare(password, user.password)
        .then(pwdMatch => {
          if (pwdMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(err => {
              console.log({err})
              res.redirect('/')
            })
          }
          req.flash('error', 'Invalid email or password')
          res.redirect('/login')
        })
        .catch(e => {
          console.log({e})
          res.redirect('/login')
        })
    })
    .catch(e => console.log({e}))
}

exports.postSignup = (req, res, next) => {
  const {email, password, confirmPassword} = req.body

  User
    .findOne({email})
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-mail exists already, please pick a different one')
        return res.redirect('/signup')
      }
      
      return bcrypt
        .hash(password, 12)
        .then(hashedPwd => {
          const user = new User({
            email,
            password: hashedPwd,
            cart: {items: []}
          })
    
          return user.save()
        })
        .then(result => {
          res.redirect('/login')
        })
    })
    .catch(e => console.log({e}))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log({err})
    res.redirect('/')
  })
}

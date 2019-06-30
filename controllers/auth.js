const User = require('../models/user-mg')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

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

exports.getReset = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log({err})
      return res.redirect('/reset')
    }

    const token = buffer.toString('hex')
    User
      .findOne({email: req.body.email})
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.')
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save()
      })
      .then(result => {
        // send email
        res.redirect('/')
      })
      .catch(e => console.log({e}))
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token

  User
    .findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
      let message = req.flash('error')
      if (message.length > 0) {
        message = message[0]
      } else {
        message = null
      }

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(e => console.log({e}))
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password
  const userId = req.body.userId
  const passwordToken = req.body.passwordToken
  let resetUser
  User
  .findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId
  })
  .then(user => {
    resetUser = user
    return bcrypt.hash(newPassword, 12)
  })
  .then(hashedPwd => {
    resetUser.password = hashedPwd
    resetUser.resetToken = null
    resetTokenExpiration = undefined
    return resetUser.save()
  })
  .then(result => {
    res.redirect('/login')
  })
  .catch(e => console.log({e}))
}

const User = require('../models/user-mg')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  })
}

exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true')
  User
    .findById('5d0c24565c46a4213cf5df83')
    .then(user => {
      req.session.isLoggedIn = true
      req.session.user = user
      req.session.save(err => {
        console.log({err})
        res.redirect('/')
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

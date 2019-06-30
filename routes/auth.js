const express = require('express')
const {check} = require('express-validator/check')

const User = require('../models/user-mg')

const authController = require('../controllers/auth')

const router = express.Router()

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.post('/login', authController.postLogin)

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(value => {
        return User
          .findOne({email: value})
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('E-mail exists already, please pick a different one.')
            }
          })
      })
      .normalizeEmail(),
    check('password', 'Please enter valid password.')
      .isLength({min: 2})
      .isAlphanumeric()
      .trim(),
    check('confirmPassword')
      .trim()
      .custom((value, {req}) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!')
        }
        return true
      })
  ],
  authController.postSignup
)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router

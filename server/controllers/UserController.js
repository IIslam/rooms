const User = require('../models/User')
const PasswordReset = require('../models/PasswordReset')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailService = require('../services/mail')
module.exports = {
  async login(req, res) {
    const { email, password } = req.body
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(401).send({
        message: 'Invalid Credentials.'
      })
    }
    bcrypt.compare(password, user.password, (err, isMatching) => {
      if (!isMatching || err) {
        return res.status(401).send({
          message: 'Invalid Credentials.'
        })
      }
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h"
        }
      )
      return res.status(200).send({
        message: 'Logged In.',
        user: {
          email: user.email,
          rooms: user.rooms,
          id: user.id
        },
        meta: {
          token
        }
      })
    })
  },
  async register(req, res, next) {
    const { email, password } = req.body
    User.find({ email }).exec().then(user => {
      if (user.length) {
        return res.status(403).send({
          message: 'Mail exists'
        })
      }
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({
            error: err
          })
        }
        const user = new User({
          email: email,
          password: hash
        })
        user.save().then(user => {
          res.status(200).send({
            message: 'User Created',
          })
        }).catch(e => next(e))
      })
    })

  },
  async resetPassword(req, res) {
    PasswordReset.findOne({ token: req.query.token }).populate('user').exec((err, reset) => {
      if (reset) {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) {
            return res.status(500).send({
              error
            })
          }
          reset.user[0].updateOne({ password: hash }).then(() => {
            reset.delete()
            res.status(201).send({
              message: 'Password has been changed successfully'
            })
          }).catch(e => next(e))
        })
      } else {
        res.status(422).send({
          message: 'Invalid Token'
        })
      }
    })

  },
  async forgotPassword(req, res) {
    let user = await User.findOne({ email: req.body.email }).exec()
    let passwordReset = await PasswordReset.create({
      _id: new mongoose.Types.ObjectId(),
      user: user._id,
      token: Math.random().toString(36).substr(2)
    })
    mailService.sendMail({
      from: process.env.USER_MAIL,
      to: req.body.email,
      subject: 'Reset your password',
      text: passwordReset.token
    }, (error, info) => {
      if (error) {
      } else {
        res.status(200).send({
          message: 'Token is sent, kindly check your mail.'
        })
      }
    })
  },
  async me(req, res) {
    res.status(200).send({ data: req.userData })
  },
  async destroy(req, res) {
    let user = await User.findByIdAndRemove(req.params.id)
    if (user) {
      res.status(200).send({
        message: 'You have deleted your account.'
      })
    }
  }
}

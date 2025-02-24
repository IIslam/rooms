const User = require("../models/User");
const Reservation = require("../models/Reservation");
const PasswordReset = require("../models/PasswordReset");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailService = require("../services/mail");
module.exports = {
  async logout(req, res) {
    return res.json({
      status: "OK"
    });
  },
  async login(req, res) {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).populate("reservations");
    if (!user) {
      return res.status(401).send({
        message: "Invalid Credentials."
      });
    }
    bcrypt.compare(password, user.password, (err, isMatching) => {
      if (!isMatching || err) {
        return res.status(401).send({
          message: "Invalid Credentials."
        });
      }
      const token = jwt.sign(
        {
          id: user._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h"
        }
      );
      return res.status(200).send({
        message: "Logged In.",
        meta: {
          token
        }
      });
    });
  },
  async register(req, res, next) {
    const { email, password, name } = req.body;
    User.find({ email })
      .exec()
      .then(user => {
        if (user.length) {
          return res.status(403).send({
            message: "Mail exists"
          });
        }
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              error: err
            });
          }
          const user = new User({
            email: email,
            password: hash,
            name: name
          });
          user
            .save()
            .then(user => {
              res.status(200).send({
                message: "User Created"
              });
            })
            .catch(e => next(e));
        });
      });
  },
  async resetPassword(req, res) {
    PasswordReset.findOne({ token: req.query.token })
      .populate("user")
      .exec((err, reset) => {
        if (reset) {
          bcrypt.hash(req.body.password, 10, (error, hash) => {
            if (error) {
              return res.status(500).send({
                error
              });
            }
            reset.user[0]
              .updateOne({ password: hash })
              .then(() => {
                reset.delete();
                res.status(201).send({
                  message: "Password has been changed successfully"
                });
              })
              .catch(e => next(e));
          });
        } else {
          res.status(422).send({
            message: "Invalid Token"
          });
        }
      });
  },
  async forgotPassword(req, res) {
    let user = await User.findOne({ email: req.body.email }).exec();
    let passwordReset = await PasswordReset.create({
      _id: new mongoose.Types.ObjectId(),
      user: user._id,
      token: Math.random()
        .toString(36)
        .substr(2)
    });
    mailService.sendMail(
      {
        from: process.env.USER_MAIL,
        to: req.body.email,
        subject: "Reset your password",
        html: `Hello There, click this link in order to reset your password <a href="http://localhost:3000/auth/reset-password?token=${
          passwordReset.token
        }"> here </a>`
      },
      (error, info) => {
        if (error) {
          return res.status(500).send({
            error
          });
        } else {
          res.status(200).send({
            message: "Token is sent, kindly check your mail."
          });
        }
      }
    );
  },
  me(req, res) {
    User.findOne({ _id: req.userData.id }, (err, user) => {
      console.log('>>>>>>', user)
    })
    Reservation.find(
      {
        user: req.userData.id
      },
      (err, reservations) => {
        if (err) {
          return res.status(500).send({
            error
          });
        } else {
          req.userData.reservations = reservations;
          return res.status(200).json({ user: req.userData });
        }
      }
    );
  },
  async destroy(req, res) {
    let user = await User.findByIdAndRemove(req.params.id);
    if (user) {
      res.status(200).send({
        message: "You have deleted your account."
      });
    }
  }
};

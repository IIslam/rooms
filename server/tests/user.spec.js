process.env.NODE_ENV = 'test';

const app = require("../app")
const chai = require('chai')
const chaiHTTP = require('chai-http')
const testVars = require('./testvars.json')
const expect = chai.expect
const User = require('../models/User')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const should = chai.should()

chai.use(chaiHTTP)

describe('User Test',  function () {
  let token = '';
  let user = new User({});

  beforeEach(() => {
    user = new User({
      name: testVars.user.name,
      password: testVars.user.password,
      email: testVars.user.email,
    });
    user.save(() => {});
    token = jwt.sign(
      {
        email: user.email,
        id: user._id
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h"
      }
    )
  });

  afterEach((done) => {
    User.deleteOne(() => {});
    mongoose.models = {};
    token = ''
    mongoose.modelSchemas = {};

    done()
  });

  it('Should delete user account with the correct token', (done) => {
    chai.request(app)
        .delete(`/api/user/${user._id}`)
        .set('authorization',`Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          expect(res.body.message).to.equal('You have deleted your account.')
          done()

        })
  })

  it('Should register a new user with correct info', (done) => {
    chai.request(app)
      .post('/api/user/register')
      .send({
        name: 'hellothere',
        email: 'example@ieee.org',
        password: '159753123Aa',
        password_confirmation: '159753123Aa'
      })
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

  it('Should not register a user with an already existing email', (done) => {
    chai.request(app)
      .post('/api/user/register')
      .send({
        name: 'hellothere',
        email: testVars.user.email,
        password: '159753123Aa',
        password_confirmation: '159753123Aa'
      })
      .end((err, res) => {
        res.should.have.status(403)
        expect(res.body.message).to.equal('Mail exists')
        done()
      })
  })

  it('Should not register a user with invalid password confirmation', (done) => {
    chai.request(app)
      .post('/api/user/register')
      .send({
        name: 'hellothere',
        email: 'new@test.com',
        password: '159753123Aa',
        password_confirmation: '159753123AaA'
      })
      .end((err, res) => {
        res.should.have.status(422)
        done()
      })
  })

  it('Should login a user with the correct credentials', (done) => {
    chai.request(app)
      .post('/api/user/login')
      .send({
        email: user.email,
        password: 'laravelproject'
      })
      .end((err, res) => {
        res.should.have.status(200)
        expect(res.body).to.have.keys('message', 'meta')
        done()
      })
  })

  it('Should not login a user with invalid credentials', (done) => {
    chai.request(app)
      .post('/api/user/login')
      .send({
        email: 'mohammedosama@ieee.org',
        password: '159753123AaA'
      })
      .end((err, res) => {
        res.should.have.status(401)
        expect(res.body.message).to.equal('Invalid Credentials.')
        done()
      })
  })

  it('Should get logged in user data with the correct token', (done) => {
    chai.request(app)
      .get('/api/user/')
      .set("authorization",`Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200)
        expect(res.body.user.email).to.equal(testVars.user.email)
        done()
      })
  })
})

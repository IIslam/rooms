process.env.NODE_ENV = 'test';

const fs = require('fs')
const app = require("../app")
const chai = require('chai')
const chaiHTTP = require('chai-http')
const testVars = require('./testvars.json')
const should = chai.should()
const expect = chai.expect
const User = require('../models/User')
const Room = require('../models/Room')
const Reservation = require('../models/Reservation')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
chai.use(chaiHTTP)

chai.use(chaiHTTP)

describe('Reservations Test', function() {
  this.timeout(15000)
  let token = '';

  let user = new User({});

  let reservation = new Reservation({})
  
  let room = new Room({})

  beforeEach(() => {
    
    user = new User({
      password: testVars.user.password,
      email: testVars.user.email,
    });
    user.save(() => {})
    
    room = new Room({
      user: user._id,
      name: 'Vodafone meeting room',
      'location': 'C2',
      'start_hour': 5,
      'end_hour': 10
    })
    room.save(() => {})
    
    reservation = new Reservation({
      start_date: '2019-02-12T05:00:00.000+0000',
      end_date: '2019-02-12T07:00:00.000+0000',
      user: user._id,
      room: room._id
    })
    reservation.save(() => {})
    
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

    Room.deleteOne(() => {})
    
    Reservation.deleteOne(() => {})
    
    mongoose.models = {};
    
    token = ''

    mongoose.modelSchemas = {};
    
    done()
  });

  it('Should return an array of reservations', (done) => {
    chai.request(app)
      .get('/api/reservations')
      .set('authorization', token)
      .end((err, res) => {
        res.should.have.status(200)
        expect(res.body).to.be.an('array')
        done()
      })
    
  });

  it('Should return a 404 response if showing a non-existing reservation', (done) => {
    chai.request(app)
      .get('/api/reservations/abc')
      .set('authorization', token)
      .end((err, res) => {

        res.should.have.status(404)

        expect(res.body).to.have.key('err')

        done()
      })
    
  });

  it('Should return the showing reservation', function(done){
    chai.request(app)
      .get('/api/reservations/' + reservation.id)
      .set('authorization', token)
      .end((err, res) => {
        
        res.should.have.status(200)

        expect(res.body).to.have.keys('user', 'room', '_id', 'start_date', 'end_date', '__v')
        
        done()
      })

    
  });
  
  it('Should update an existing reservation', (done) => {
    chai.request(app)
      .put(`/api/reservations/${reservation.id}/rooms/${room.id}`)
      .set('authorization', token)
      .send({
        start_date: '2019-02-12T05:00:00.000+0000',
        end_date: '2019-02-12T07:00:00.000+0000',
      })
      .end((err, res) => {
        console.log(res.body)
        done()
      })  
  });
  
  it('Should delete a reservation', (done) => {
    chai.request(app)
      .delete('/api/reservations/' + reservation.id)
      .set('authorization', token)
      .end((err, res) => {

        res.should.have.status(200)

        expect(res.body).to.have.all.keys('message', 'reservation')

        done()
      })
  });
  
})

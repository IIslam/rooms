process.env.NODE_ENV = "test";
const app = require("../app");
const chai = require("chai");
const chaiHTTP = require("chai-http");
const testVars = require("./testvars.json");
const should = chai.should();
const expect = chai.expect;
const User = require("../models/User");
const Room = require("../models/Room");
const Reservation = require("../models/Reservation");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
chai.use(chaiHTTP);

chai.use(chaiHTTP);

describe("Rooms Test", function() {
  let token = "";

  let user = new User({});

  let reservation = new Reservation({});

  let room = new Room({});

  beforeEach(() => {
    user = new User({
      password: testVars.user.password,
      email: testVars.user.email,
      name: testVars.user.name
    });
    user.save(() => {});

    room = new Room({
      user: user._id,
      name: "Vodafone meeting room",
      location: "C2",
      start_hour: 5,
      end_hour: 10
    });
    room.save(() => {});

    token = jwt.sign(
      {
        email: user.email,
        id: user._id
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h"
      }
    );
  });

  afterEach(done => {
    User.deleteOne(() => {});

    Room.deleteMany(() => {});

    mongoose.models = {};

    token = "";

    mongoose.modelSchemas = {};

    done();
  });

  it("Should return an array of rooms", done => {
    chai
      .request(app)
      .get("/api/rooms")
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });
  it("Should return a 404 response if showing a non-existing reservation", done => {
    chai
      .request(app)
      .get("/api/rooms/abc")
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(404);

        expect(res.body).to.have.key("err");

        done();
      });
  });
  it("Should return the showing room", function(done) {
    chai
      .request(app)
      .get("/api/rooms/" + room.id)
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.keys(
          "user",
          "reservations",
          "_id",
          "name",
          "end_hour",
          "start_hour",
          "__v",
          "location"
        );

        done();
      });
  });
  it("Should respond with 404 if trying to delete a non-existing room", done => {
    chai
      .request(app)
      .delete("/api/rooms/abc")
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(404);

        expect(res.body).to.have.keys("err");

        done();
      });
  });
  it("Should store a room", done => {
    chai
      .request(app)
      .post("/api/rooms")
      .set("authorization", `Bearer ${token}`)
      .send({
        name: "Vodafone meeting room A",
        location: "C2",
        start_hour: 5,
        end_hour: 10
      })
      .end((err, res) => {
        res.should.have.status(201);

        expect(res.body).to.have.keys("message", "room");

        done();
      });
  });
  it("Should update the room", done => {
    chai
      .request(app)
      .put(`/api/rooms/${room.id}`)
      .set("authorization", `Bearer ${token}`)
      .send({
        location: "C3"
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.keys(
          "user",
          "reservations",
          "_id",
          "name",
          "location",
          "__v",
          "start_hour",
          "end_hour"
        );

        done();
      });
  });

  it("Should not delete a room if it has reservations", async () => {
    reservation = await Reservation.create({
      start_date: "2019-02-12T05:00:00.000+0000",
      end_date: "2019-02-12T07:00:00.000+0000",
      user: user.id,
      room: room.id
    });
    await Room.findByIdAndUpdate(room.id, {
      $push: { reservations: reservation._id }
    });
    chai
      .request(app)
      .delete("/api/rooms/" + room.id)
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(400);

        expect(res.body).to.have.keys("error");
      });
  });

  it("Should search for rooms by hours", done => {
    Room.create(
      {
        user: user._id,
        name: "Vodafone meeting room for developers",
        location: "C2",
        start_hour: 3,
        end_hour: 11
      },
      (err, room) => {
        chai
          .request(app)
          .post("/api/rooms/search")
          .set("authorization", `Bearer ${token}`)
          .send({
            start_hour: 3,
            end_hour: 8
          })
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.have.all.keys("message", "rooms");
            expect(res.body.rooms.length).to.be.equal(2);
            done();
          });
      }
    );
  });
  it("Should delete a room", done => {
    chai
      .request(app)
      .delete("/api/rooms/" + room.id)
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);

        expect(res.body).to.have.all.keys("message", "room");

        done();
      });
  });
});

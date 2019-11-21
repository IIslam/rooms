const Reservation = require("../models/Reservation");
const Room = require("../models/Room");
const User = require("../models/User");
module.exports = {
    index(req, res) {
        Reservation.find()
            .populate("user", "email")
            .exec((err, reservations) => {
                if (reservations.length) {
                    return res.json(reservations);
                } else {
                    return res.status(404).json({
                        message: "No Entries Found"
                    });
                }
            });
    },

    show(req, res) {
        Reservation.findById(req.params.id)
            .populate("user")
            .exec((err, reservation) => {
                if (err) {
                    return res.status(404).json({
                        err
                    });
                }

                return res.status(200).json(reservation);
            });
    },

    async store(req, res) {
        const room = await Room.findById(req.params.roomId).populate(
            "reservations"
        );
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);
        const reservations = await Reservation.find({
            room: room.id
        })
            Reservation.countDocuments(
                {
                    start_date: {
                        $lte: req.body.start_date
                    },
                    end_date: {
                        $gte: req.body.start_date
                    },
                    room: room.id
                },
                (err, count) => {
                    if (err) {
                        return res.status(400).json({
                            err
                        });
                    }

                    if (count) {
                        return res.status(422).json({
                            error: {
                                message:
                                    "Room is already reserved at this time."
                            }
                        });
                    }
                    req.body.user = req.userData.id;
                    req.body.room = room.id;

                    Reservation.create(req.body, (err, reservation) => {
                        Room.findByIdAndUpdate(req.params.roomId, {
                            $push: { reservations: reservation._id }
                        });
                        User.findByIdAndUpdate(req.userData.id, {
                            $push: { reservations: reservation._id }
                        });
                        return res.status(201).json({
                            reservation,
                            message: "Alright, we picked up the room for you."
                        });
                    });
                }
            );
    },
    update(req, res) {
        req.body.start_date = new Date(req.body.start_date);
        req.body.end_date = new Date(req.body.end_date);

        Room.findById(req.params.roomId)
            .populate("reservations")
            .exec((err, room) => {
                if (_.size(room.reservations)) {
                    Reservation.count(
                        {
                            start_date: {
                                $lte: req.body.start_date
                            },
                            end_date: {
                                $gte: req.body.start_date
                            },
                            room: room.id
                        },
                        (err, count) => {
                            if (count) {
                                return res.status(422).json({
                                    error: {
                                        message:
                                            "Room is already reserved at this time."
                                    }
                                });
                            }

                            if (err) {
                                return res.status(400).json({
                                    err
                                });
                            }
                        }
                    );
                }
            });

        Reservation.findByIdAndUpdate(
            req.params.reservationId,
            {
                start_date: req.body.start_date,
                end_date: req.body.end_date
            },
            (err, reservation) => {
                if (err) {
                    return res.status(400).json({
                        err
                    });
                }

                return res.status(200).json({
                    reservation,
                    message: "Your reservation has been updated."
                });
            }
        );
    },
    destroy(req, res) {
        Reservation.findByIdAndRemove(req.params.id, (err, reservation) => {
            if (err) {
                return res.status(404).send({
                    err
                });
            }
            return res.json({
                message: "Your reservation has been cancelled.",
                reservation
            });
        });
    }
};

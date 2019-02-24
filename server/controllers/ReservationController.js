const Reservation = require('../models/Reservation')
const Room = require('../models/Room')
const mongoose = require('mongoose')
const moment = require('moment');

module.exports = {

    index(req, res) {
        Reservation.find().populate('user', 'email').exec((err, reservations) => {
            if (reservations.length) {
                return res.json(reservations)
            } else {
                res.status(404).json({
                    message: 'No Entries Found'
                })
            }
        })
    },

    show(req, res) {
        Reservation.findById(req.params.id).populate('user').exec((err, reservation) => {

            if (err) {

                return res.status(404).json({
                    err
                })

            }

            return res.json(reservation)

        })
    },

    async store(req, res) {
        const room = await Room.findById(req.params.roomId).populate('reservations')
        req.body.start_date = new Date(req.body.start_date)
        req.body.end_date = new Date(req.body.end_date)

        if (_.size(room.reservations)) {
            let number = await Reservation.count({
                "start_date": {
                    $lte: req.body.start_date
                },
                "end_date": {
                    $gte: req.body.start_date
                }
            })
            res.status(422).json({
                error: {
                    message: 'Room is already reserved at this time.'
                }
            })
        }

        req.body.user = req.userData.id
        req.body.room = room.id

        const reservation = await Reservation.create(req.body)

        await Room.findByIdAndUpdate(req.params.roomId, { reservations: { $push: reservation._id } })

        res.status(201).json(reservation)

    },
    update(req, res) {
    
        req.body.start_date = new Date(req.body.start_date)
        req.body.end_date = new Date(req.body.end_date)
    
        Room.findById(mongoose.Types.ObjectId(req.params.roomId)).populate('reservations').exec((err, room) => {
            if (_.size(room.reservations)) {
            // count reservations for the room we are currently at.
                Reservation.count({
                    "start_date": {
                        $lte: req.body.start_date
                    },
                    "end_date": {
                        $gte: req.body.start_date
                    }
                }, (err, count) => {

                    if (count) {

                        return res.status(422).json({
                            error: {
                                message: 'Room is already reserved at this time.'
                            }
                        })

                    }

                    if (err) {

                        return res.status(400).json({
                            err
                        })

                    }
                })
            }

        })

        req.body.user = req.userData.id
        req.body.room = room.id
        console.log('here')
        Reservation.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.reservationId), {
            start_date: req.body.start_date,
            end_date: req.body.end_date
        }, (err, reservation) => {

            if (err) {

                return res.status(400).json({
                    err
                })

            }

            return res.status(200).json(reservation)
        
        })


    },
    async destroy(req, res, next) {
        Reservation.findByIdAndRemove(req.params.id, (err, reservation) => {
            if (err) {
                res.status(404).send({
                    err
                })
            }
            res.json({
                message: 'Your reservation has been cancelled.',
                reservation
            })
        })


    }
}

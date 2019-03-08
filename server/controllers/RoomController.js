const Room = require('../models/Room')
const mongoose = require('mongoose')

module.exports = {
    index (req, res) {
        Room.find().populate('user', 'email rooms').exec((err, rooms) => {
    
            if (err) {
                return res.status(500).json({
                    err
                })
            }

            if (rooms.length) {
                return res.status(200).json(
                    rooms
                )
            }
    
            return res.status(404).json({
                error: {
                    message: 'No Entries Found'
                }
            })       

        })
    },

    show (req, res, next) {
        Room.findById(req.params.id).populate('reservations').populate('user').exec((err, room) => {

            if (err) {
                return res.status(404).json({
                    err
                })

            }

            return res.status(200).json(room)

        })
    },
    store(req, res) {
        req.body.user = req.userData.id
        
        Room.create(req.body, (err, room) => {
            if (err) {

                return res.status(404).json({
                    err
                })
            }

            if (room) {
                return res.status(201).json({
                    room,
                    message: 'Room is created successfully'
                })
            }


        })
    },
    update(req, res) {
        Room.findById(req.params.id, (err, room) => {
            if (err) {
                return res.status(404).json({
                    err
                })
            }

            if(room && !_.size(room.reservations)){
                Room.findByIdAndUpdate(room.id, req.body, {
                    new: true
                }, (err, r) => {
                    if (err) {

                        return res.status(404).json({
                            err
                        })
                    }
                    if (r) {

                        return res.status(200).json(r)
                    }                    
                })
            }else {
                return res.status(400).json({
                    error: {
                        message: 'Room is already reserved, you can not update it at the moment.'
                    }
                })
            }
    
    
        })
    },
    destroy (req, res) {
        Room.findById(req.params.id).populate('reservations').exec((err, room) => {
            if (err) {
                return res.status(404).json({
                    err
                })

            }


            if(room &&  !_.size(room.reservations)) {
                Room.findByIdAndRemove(room.id, (err, room) => {
                    if (err) {
                        return res.status(404).json({
                            err
                        })

                    }
                    return res.status(200).send({
                        "message": 'You have deleted this room.',
                        room
                    })

                })
            }else{
                return res.status(400).json({
                    error: {
                        message: 'Room is already reserved, you can not delete it at the moment.'
                    }
                })

            }
        })
    }
}

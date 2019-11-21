const Room = require("../models/Room");
const moment = require("moment");
const mongoose = require("mongoose");

module.exports = (req, res, next) => {
    Room.findById(req.params.roomId, (err, room) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if (!room) {
            return res.status(404).json({
                error: {
                    message: "Could not find this entity."
                }
            });
        }
        const start_hour = moment(req.body.start_date).format("hh:mm");
        const end_hour = moment(req.body.end_date).format("hh:mm");
        console.log(
            start_hour,
            room.start_hour,
            end_hour,
            room.end_hour,
            start_hour === room.start_hour,
            start_hour < room.end_hour,
            end_hour > start_hour,
            room.end_hour >= end_hour
        );
        if (
            start_hour >= room.start_hour &&
            start_hour < room.end_hour &&
            end_hour > start_hour &&
            room.end_hour >= end_hour
        ) {
            next();
        } else {
            return res.status(422).json({
                error: {
                    message: "Invalid hours for reservation."
                }
            });
        }
    });
};

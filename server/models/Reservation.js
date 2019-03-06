const mongoose = require('mongoose').set('debug', true)
const Schema = mongoose.Schema
const reservationSchema = new Schema({
    user : {
    type: Schema.Types.ObjectId,
        ref: 'User'
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    }
})
module.exports = mongoose.model('Reservation', reservationSchema)

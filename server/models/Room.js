const mongoose = require('mongoose').set('debug', true)
const Schema = mongoose.Schema
const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    start_hour: {
        type: Number,
        required: true,
    },
    end_hour: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    user : [{
        type: Schema.Types.ObjectId,
        ref: 'User'
   }],
    reservations : [{
        type: Schema.Types.ObjectId,
        ref: 'Reservation'
   }],

})

module.exports = mongoose.model('Room', roomSchema)

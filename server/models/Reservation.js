const mongoose = require("mongoose").set("debug", true);
const Schema = mongoose.Schema;
const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room"
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    }
});
reservationSchema.post("find", async (docs, next) => {
    for (let doc of docs) {
        await doc.populate("room").execPopulate();
    }
    next();
});

module.exports = mongoose.model("Reservation", reservationSchema);

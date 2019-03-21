const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    rooms: [
        {
            type: Schema.Types.ObjectId,
            ref: "Room"
        }
    ],
    reservations: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reservation"
        }
    ]
});
userSchema.post("find", async (docs, next) => {
    for (let doc of docs) {
        await doc.populate("rooms").execPopulate();
        await doc.populate("reservations").execPopulate();
    }

    next();
});
userSchema.post("save", (doc, next) => {
    doc.populate("rooms")
        .execPopulate()
        .then(() => next());
    doc.populate("reservations")
        .execPopulate()
        .then(() => next());
    console.log(doc)
});

module.exports = mongoose.model("User", userSchema);

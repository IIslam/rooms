const mongoose = require("mongoose").set("debug", true);
const Schema = mongoose.Schema;
const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    start_hour: {
        type: String,
        required: true
    },
    end_hour: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reservations: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reservation"
        }
    ]
});
roomSchema.post("findByIdAndRemove", async (doc, next) => {
    console.log('>>>>>', doc)
    // for (let doc of docs) {
    //     await doc.populate("rooms").execPopulate();
    //     await doc.populate("reservations").execPopulate();
    // }

    next();
});


module.exports = mongoose.model("Room", roomSchema);

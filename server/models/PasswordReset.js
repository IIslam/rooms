const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passwordResetSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    token: {
        type: String,
        required: true
    },
    completed_at: {
        type: Date,
        default: null
    }
});
module.exports = mongoose.model("PasswordReset", passwordResetSchema);

const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.USER_PASS
    }
});

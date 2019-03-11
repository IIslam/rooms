const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    if (!req.headers.hasOwnProperty("authorization")) {
        return next();
    }
    return res.status(301).json({
        message: "You should be a guest to view this page."
    });
};

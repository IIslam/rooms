const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    if (req.headers.hasOwnProperty("authorization")) {
        jwt.verify(
            req.headers.authorization.split(" ")[1],
            process.env.JWT_KEY,
            (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        err
                    });
                }
                req.userData = decoded;
                next();
            }
        );
    } else {
        return res.status(401).json({
            message: "Unauthorized action"
        });
    }
};

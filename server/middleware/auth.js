const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {

  jwt.verify(req.headers.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        err
      })
    }
    req.userData = decoded
    next()
  })

}

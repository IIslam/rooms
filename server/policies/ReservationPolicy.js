const Joi = require('joi')
module.exports = {
  put (req, res, next) {
    const schema = {
      start_date: Joi.date().iso().less(Joi.ref('end_date')).required(),
      end_date: Joi.date().iso().required()
    }
    const { error, value } = Joi.validate(req.body, schema)
    if (error) {
      return res.status(422).json({
        messages: error.details.map((error) => error.message),
        data: value
      });
    }
    next()
  },
}

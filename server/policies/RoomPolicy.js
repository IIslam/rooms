const Joi = require('joi')

module.exports = {
    store (req, res, next) {
        const schema = {
          start_hour: Joi.number().min(0).max(24).integer().required(),
          end_hour: Joi.number().min(0).max(24).integer().required(),
          name: Joi.string().min(3).max(32).required(),
          location: Joi.required()
        }
        const { error, value } = Joi.validate(req.body, schema)

        if (error) {
            return res.status(422).json({
                messages: error.details.map((error) => error.message),
                data: value
            });
        }

        if (req.body.start_hour > req.body.end_hour) {
            return res.status(422).json({
                error: {
                    message: "Start hour should be less than end hour."
                }
            })
        }
        next()
    },
    put (req, res, next) {
        const schema = {
          start_hour: Joi.number().min(0).max(24).integer().optional(),
          end_hour: Joi.number().min(0).max(24).integer().optional(),
          name: Joi.string().min(3).max(32),
          location: Joi.optional()
        }
        const { error, value } = Joi.validate(req.body, schema)

        if (error) {
            return res.status(422).json({
                messages: error.details.map((error) => error.message),
                data: value
            });
        }

        if (req.body.start_hour > req.body.end_hour) {
            return res.status(422).json({
                error: {
                    message: "Start hour should be less than end hour."
                }
            })
        }
        next()
    },


}

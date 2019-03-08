const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

global._ = require('lodash')

if (process.env.NODE_ENV == 'test'){
    process.env.JWT_KEY = 'somesecret'
    mongoose.connect('mongodb://localhost/rooms-testing', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
} else
    mongoose.connect('mongodb://localhost/rest-rooms', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })

mongoose.Promise = global.Promise
// middlewares
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(express.static('uploads'))
// routes
app.use('/api/rooms', require('./routes/rooms'))
app.use('/api/user', require('./routes/users'))
app.use('/api/reservations', require('./routes/reservations'))
// generic errors
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            message: error.message
        }
    })
})

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
    console.log("app running on port.", server.address().port);
})

module.exports = app

const express = require('express')
const router = express.Router()
const RoomController = require('../controllers/RoomController')
const auth = require('../middleware/auth')
const guest = require('../middleware/guest')

const RoomPolicy = require('../policies/RoomPolicy')
router.post('/', [auth, RoomPolicy.store], RoomController.store)
router.get('/', RoomController.index)
router.get('/:id', RoomController.show)
router.put('/:id', auth, RoomController.update)
router.delete('/:id', [auth, RoomPolicy.put], RoomController.destroy)
module.exports = router;

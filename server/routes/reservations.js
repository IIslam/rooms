const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/ReservationController");
const auth = require("../middleware/auth");
const guest = require("../middleware/guest");
const validateHours = require("../middleware/validateHours");
const ReservationPolicy = require("../policies/ReservationPolicy.js");

router.get("/", auth, ReservationController.index);
router.get("/:id", auth, ReservationController.show);

router.post(
    "/:roomId",
    [auth, ReservationPolicy.put, validateHours],
    ReservationController.store
);
router.put(
    "/:reservationId/rooms/:roomId",
    [auth, ReservationPolicy.put, validateHours],
    ReservationController.update
);
router.delete("/:id", auth, ReservationController.destroy);

module.exports = router;

const express = require("express")
const router = express.Router()
const {sendBookingOTP, bookEvent, confirmBooking, getMyBookings, cancleBooking} = require("../controllers/bookingController.js")
const {protect, admin} = require("../middleware/auth.middleware.js")

router.post('/', protect, bookEvent);
router.post("/send-otp", protect, sendBookingOTP)
router.put('/:id/confirm', protect, admin, confirmBooking)
router.get('/my', protect, getMyBookings);
router.delete('/:id', protect, cancleBooking);

module.exports = router
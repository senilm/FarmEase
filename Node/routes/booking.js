import express from 'express'
import { addBooking, getBooking, getBookings, updateBooking, deleteBooking, getAllBooking } from '../controllers/booking.js';
const router = express.Router();

router.route('/all/:farmId').get(getAllBooking)
router.route('/farm/:farmId').get(getBookings)
router.route('/').post(addBooking)
router.route('/:bookingId').get(getBooking)
router.route('/:bookingId').delete(deleteBooking)
router.route('/:bookingId').patch(updateBooking)


export default router
import * as bookingModel from '../models/bookingModel.js';

export async function getBookings(req, res) {
  try {
    const bookings = await bookingModel.getAllBookingsByUser(req.userId);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

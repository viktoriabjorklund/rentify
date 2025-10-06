import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, bookingController.getBookings);

export default router;

import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as requestController from '../controllers/requestController.js';

const router = express.Router();

router.get('/sentrequests', authMiddleware, requestController.getSentRequests);
router.get('/recievedrequests', authMiddleware, requestController.getRecievedRequests);
router.post('/', authMiddleware, requestController.createRequest);

export default router;

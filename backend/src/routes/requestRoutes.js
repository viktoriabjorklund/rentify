import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as requestController from '../controllers/requestController.js';

const router = express.Router();

router.get('/sent', authMiddleware, requestController.getSentRequests);
router.get('/recieved', authMiddleware, requestController.getRecievedRequests);
router.put('/:id/viewed', authMiddleware, requestController.markRequestAsViewed);
router.post('/', authMiddleware, requestController.createRequest);
router.get('/:id', authMiddleware, requestController.getRequest);
router.delete('/:id', authMiddleware, requestController.deleteRequest);
router.put('/:id', authMiddleware, requestController.updateRequest);




export default router;

import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as requestController from '../controllers/requestController.js';

const router = express.Router();

router.get('/sent', authMiddleware, requestController.getSentRequests);
router.get('/received', authMiddleware, requestController.getRecievedRequests); //det var felstavat innan
router.put('/:id/viewed', authMiddleware, requestController.markRequestAsViewed);
router.post('/', authMiddleware, requestController.createRequest);
router.get('/:id', authMiddleware, requestController.getRequest);
router.delete('/:id', authMiddleware, requestController.deleteRequest);
router.put('/:id', authMiddleware, requestController.updateRequest);




export default router;

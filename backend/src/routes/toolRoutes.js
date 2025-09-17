import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as toolController from '../controllers/toolController.js';

const router = express.Router();

router.get('/', authMiddleware, toolController.getTools);
router.post('/', authMiddleware, toolController.createTool);
router.put('/:id', authMiddleware, toolController.updateTool);
router.delete('/:id', authMiddleware, toolController.deleteTool);

export default router;

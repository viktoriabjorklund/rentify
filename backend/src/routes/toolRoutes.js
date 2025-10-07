import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as toolController from '../controllers/toolController.js';

const router = express.Router();
// tog bort för att kunna browsa utan att behöva logga in.
router.get('/', toolController.getTools);
router.get('/mytools', authMiddleware, toolController.getMyTools);
router.post('/', authMiddleware, toolController.createTool);
router.put('/:id', authMiddleware, toolController.updateTool);
router.delete('/:id', authMiddleware, toolController.deleteTool);
router.get('/:id', authMiddleware, toolController.displayTool);



export default router;

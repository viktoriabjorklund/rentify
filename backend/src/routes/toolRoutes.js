import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as toolController from '../controllers/toolController.js';
import { upload } from '../middleware/uploadMiddleware.js'; // importera Multer

const router = express.Router();

router.get('/', authMiddleware, toolController.getTools);

// för att hantera filuppladningar:
router.post(
  '/',
  authMiddleware,
  upload.single('photo'),   
  toolController.createTool
);

router.put('/:id', authMiddleware, toolController.updateTool);
router.delete('/:id', authMiddleware, toolController.deleteTool);
router.get('/mytools', authMiddleware, toolController.getMyTools);

export default router;

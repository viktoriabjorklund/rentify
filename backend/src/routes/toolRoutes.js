import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as toolController from '../controllers/toolController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();


router.get('/', toolController.getTools);

router.post(
  '/',
  authMiddleware,
  upload.single('photo'),   
  toolController.createTool
);

router.get('/mytools', authMiddleware, toolController.getMyTools);
router.put('/:id', authMiddleware, upload.single('photo'), toolController.updateTool);
router.delete('/:id', authMiddleware, toolController.deleteTool);
router.get('/:id', authMiddleware, toolController.displayTool);


export default router;

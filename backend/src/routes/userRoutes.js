import express from 'express';
import * as userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', userController.register);
router.put('/:username', authMiddleware, userController.updateUser);
router.get('/:username', authMiddleware, userController.displayUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.post('/login', userController.login);

export default router;
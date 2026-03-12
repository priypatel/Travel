import { Router } from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/auth.controller.js';
import validate from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import protect from '../middleware/protect.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;

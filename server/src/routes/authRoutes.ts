import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authControllers.js';
import { protect, type AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// --- RUTA PRIVADA DE EJEMPLO ---
// GET /api/auth/profile
// Solo puedes ver esto si envías un token válido.
router.get('/profile', protect, (req: AuthRequest, res) => {
  res.json(req.user);
});

export default router;
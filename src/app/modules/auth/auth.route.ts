
import express from 'express';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/client/enums';

const router = express.Router();

router.post('/login', authController.login);
router.get('/me',auth(UserRole.ADMIN,UserRole.GUIDE,UserRole.TOURIST) ,authController.getMe);
// router.post('/register', authController.register);
// router.post('/logout', authController.logout);
// router.post('/refresh-token', authController.refreshToken);

export const authRoute= router;
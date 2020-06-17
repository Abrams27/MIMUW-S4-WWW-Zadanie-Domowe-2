import { Router } from 'express';
import UserRouter from './User';

const router = Router();

router.use('/user', UserRouter);

export default router;

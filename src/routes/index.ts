import { Router } from 'express';
import UserRouter from './UserRoute';
import QuizRouter from './QuizRoute'

const router = Router();

router.use('/user', UserRouter);
router.use('/quiz', QuizRouter);

export default router;

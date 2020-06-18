import {Request, Response, Router} from 'express';
import 'express-session';
import {OK} from 'http-status-codes';
import {asyncDbAll} from '@shared/databaseUtils';

const router = Router();


router.get('/list', async (req: Request, res: Response) => {
  const all = await asyncDbAll('SELECT name FROM quizzes');
  
  res.json(all);
  return res.status(OK).end();
});


export default router;

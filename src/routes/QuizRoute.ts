import {Request, Response, Router} from 'express';
import 'express-session';
import {OK} from 'http-status-codes';
import {asyncDbAll, asyncDbGet} from '@shared/databaseUtils';

const router = Router();


router.get('/list', async (req: Request, res: Response) => {
  const all = await asyncDbAll('SELECT name FROM quizzes');

  res.json(all);
  return res.status(OK).end();
});

router.get('/scores', async (req: Request, res: Response) => {
  const all: number[] = await asyncDbAll('SELECT score FROM scores');

  res.json(all);
  return res.status(OK).end();
});

router.get('/name/:quizName', async (req: Request, res: Response) => {
  const all = await asyncDbGet('SELECT quiz FROM quizzes WHERE name = ?', [req.params.quizName]);

  res.json(all);
  return res.status(OK).end();
});

export default router;

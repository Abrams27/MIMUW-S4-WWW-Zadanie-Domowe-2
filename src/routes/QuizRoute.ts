import {Request, Response, Router} from 'express';
import 'express-session';
import {OK, UNAUTHORIZED} from 'http-status-codes';
import {asyncDbAll, asyncDbGet} from '@shared/databaseUtils';
import {csrfProtectionMiddleware} from '../middlewares/csrf';
import {QuizDetailedScoreboard, QuizPercentageTimeDetailedScoreboard} from '@shared/scoreboard';
import {Quiz} from '@shared/quizzes';

const router = Router();


router.get('/list', async (req: Request, res: Response) => {
  if (req.session) {
    const all = await asyncDbAll('SELECT id, name FROM quizzes');
    const solved = await asyncDbAll('SELECT quiz_id FROM scores WHERE user_id = ?', [req.session.user_id]);

    const unsolvedQuizzes = all.filter(a => solved.find( o => o.quiz_id === a.id) === undefined);
    console.log(req.session.user_id);
    console.log(all);
    console.log(solved);
    console.log(unsolvedQuizzes);


    res.json(unsolvedQuizzes);
    return res.status(OK).end();
  }

  return res.status(UNAUTHORIZED).end();
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

let xd: QuizDetailedScoreboard;
router.post('/name/:quizName', csrfProtectionMiddleware, async (req: Request, res: Response) => {
  console.log(req.session!.username);
  console.log(req.session!.user_id);
  console.log(req.body.quizName);
  const quizPercentageTimeDetailedScoreboard: QuizPercentageTimeDetailedScoreboard =
      QuizPercentageTimeDetailedScoreboard.copyOf(req.body);
  console.log(quizPercentageTimeDetailedScoreboard);

  const quizJson = await asyncDbGet('SELECT quiz FROM quizzes WHERE name = ?', [quizPercentageTimeDetailedScoreboard.getQuizName()]);
  console.log(quizJson.quiz);
  console.log(Quiz.fromJson(quizJson.quiz));
  const quiz = Quiz.fromJson(quizJson.quiz);
  console.log(QuizDetailedScoreboard.fromQuizAndQuizPercentageTimeDetailedScoreboard(quiz, quizPercentageTimeDetailedScoreboard, 5));
  xd = QuizDetailedScoreboard.fromQuizAndQuizPercentageTimeDetailedScoreboard(quiz, quizPercentageTimeDetailedScoreboard, 5);

  return res.status(OK).end();
});

router.get('/result/:quizName', async (req: Request, res: Response) => {
  // const all = await asyncDbGet('SELECT quiz FROM quizzes WHERE name = ?', [req.params.quizName]);
  console.log(req.session!.username);
  console.log(req.session!.user_id);

  res.json(JSON.stringify(xd));
  return res.status(OK).end();
});

export default router;

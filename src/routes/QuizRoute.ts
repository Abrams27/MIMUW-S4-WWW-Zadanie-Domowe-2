import {Request, Response, Router} from 'express';
import 'express-session';
import {OK, UNAUTHORIZED} from 'http-status-codes';
import {csrfProtectionMiddleware} from '../middlewares/csrfMiddleware';
import {QuizDetailedScoreboard} from '@shared/scoreboard';
import {QuizShortDB, QuizWithJsonDB, ScoreDB} from '@shared/databaseService';
import {quizService} from '@shared/quizService';
import {isUserLoggedMiddleware} from '../middlewares/userMiddleware';

const router = Router();


router.get('/list', isUserLoggedMiddleware, async (req: Request, res: Response) => {
  if (req.session !== undefined) {
    const userId: number = req.session.userId;

    const unsolvedQuizzes: QuizShortDB[] = await quizService.getAllUnsolvedQuizzes(userId);

    res.json(unsolvedQuizzes);
    return res.status(OK).end();
  }

  return res.status(UNAUTHORIZED).end();
});


router.get('/solved', isUserLoggedMiddleware, async (req: Request, res: Response) => {
  if (req.session !== undefined) {
    const userId: number = req.session.userId;

    const solvedQuizzes: QuizShortDB[] = await quizService.getAllSolvedQuizzes(userId);

    res.json(solvedQuizzes);
    return res.status(OK).end();
  }

  return res.status(UNAUTHORIZED).end();
});


router.get('/scores', isUserLoggedMiddleware, async (req: Request, res: Response) => {
  const all: ScoreDB[] = await quizService.getQuizzesScores();

  res.json(all);
  return res.status(OK).end();
});


router.get('/name/:quizName', isUserLoggedMiddleware, async (req: Request, res: Response) => {
  if (req.session !== undefined) {
    const quizName: string = req.params.quizName;
    const currentTime: number = Date.now().valueOf();

    const quiz: QuizWithJsonDB  = await quizService.getQuizWithName(quizName);
    req.session.startTimestamp = currentTime;

    res.json(quiz);
    return res.status(OK).end();
  }

  return res.status(UNAUTHORIZED).end();
});


router.post('/result/:quizName', csrfProtectionMiddleware, isUserLoggedMiddleware, async (req: Request, res: Response) => {
  if (req.session !== undefined) {
    const userId: number = req.session.userId;
    const quizResultJson: any = req.body;
    const answerTime: number = (Date.now().valueOf() - req.session.startTimestamp) / 1000;

    await quizService.saveQuizResult(userId, quizResultJson, answerTime);

    return res.status(OK).end();
  }

  return res.status(UNAUTHORIZED).end();
});


router.get('/result/:quizName', isUserLoggedMiddleware, async (req: Request, res: Response) => {
  if (req.session) {
    const userId: number = req.session.userId;
    const quizName: string = req.params.quizName;

    const quizDetailedScoreboard: QuizDetailedScoreboard = await quizService.getQuizResult(userId, quizName);

    res.json(quizDetailedScoreboard.toJson());
    return res.status(OK).end();
  }

  return res.status(UNAUTHORIZED).end();
});


router.get('/result/best/:quizName', isUserLoggedMiddleware, async (req: Request, res: Response) => {
  if (req.session) {
    const quizName: string = req.params.quizName;

    const quizTopScores: ScoreDB[] = await quizService.getQuizTopScores(quizName);

    res.json(quizTopScores);
    return res.status(OK).end();
  }

  return res.status(UNAUTHORIZED).end();
});


export default router;

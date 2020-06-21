import {Request, Response, Router} from 'express';
import 'express-session';
import {OK, UNAUTHORIZED} from 'http-status-codes';
import {csrfProtectionMiddleware} from '../middlewares/csrf';
import {QuizDetailedScoreboard, QuizPercentageTimeDetailedScoreboard} from '@shared/scoreboard';
import {Quiz} from '@shared/quizzes';
import {databaseService} from '@shared/databaseService';

const router = Router();

router.get('/list', async (req: Request, res: Response) => {
  if (req.session) {
    const userId: number = req.session.user_id;

    const all = await databaseService.getAllQuizzesIdsAndNames();
    const solved = await databaseService.getSolvedQuizzesIdsByUser(userId);

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


router.get('/solved', async (req: Request, res: Response) => {
  if (req.session) {
    const userId: number = req.session.user_id;

    const all = await databaseService.getAllQuizzesIdsAndNames();
    const solved = await databaseService.getSolvedQuizzesIdsByUser(userId);

    const unsolvedQuizzes = all.filter(a => solved.find( o => o.quiz_id === a.id) !== undefined);
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
  const all: number[] = await databaseService.getAllScores();

  res.json(all);
  return res.status(OK).end();
});

router.get('/name/:quizName', async (req: Request, res: Response) => {
  if (req.session) {
    const quizName: string = req.params.quizName;

    const all = await databaseService.getQuizWithName(quizName);

    req.session.start_timestamp = Date.now().valueOf();

    res.json(all);
    return res.status(OK).end();
  }

  return res.status(UNAUTHORIZED).end();
});

router.post('/result/:quizName', csrfProtectionMiddleware, async (req: Request, res: Response) => {
  if (req.session) {
    const userId = req.session.user_id;
    const answerTime = Date.now().valueOf() - req.session.start_timestamp;

    const quizPercentageTimeDetailedScoreboard: QuizPercentageTimeDetailedScoreboard = QuizPercentageTimeDetailedScoreboard.copyOf(req.body);
    const quizName: string = quizPercentageTimeDetailedScoreboard.getQuizName();
    const quizJson = await databaseService.getQuizWithName(quizName);
    const quiz = Quiz.fromJson(quizJson.quiz);

    const quizDetailedScoreboard: QuizDetailedScoreboard =
        QuizDetailedScoreboard.fromQuizAndQuizPercentageTimeDetailedScoreboard(quiz, quizPercentageTimeDetailedScoreboard, answerTime);

    console.log(quizDetailedScoreboard);
    const quizId = await databaseService.getQuizIdWithName(quizName);
    console.log(quizId.id);
    console.log(userId);
    console.log(quizDetailedScoreboard.getQuizScore().getScore());

    await databaseService.saveQuizScore(quizId.id, userId, quizDetailedScoreboard.getQuizScore().getScore(), quizDetailedScoreboard.toJson());

    return res.status(OK).end();
  }

  return res.status(UNAUTHORIZED).end();
});

router.get('/result/:quizName', async (req: Request, res: Response) => {
  if (req.session) {

    const userId: number = req.session.user_id;
    const quizName: string = req.params.quizName;

    console.log(quizName);
    const quizId = await databaseService.getQuizIdWithName(quizName);
    console.log(quizId);
    const userQuizScoreJson = await databaseService.getUserQuizScore(quizId.id, userId);

    console.log(userQuizScoreJson);
    const quizDetailedScoreboard: QuizDetailedScoreboard =
        QuizDetailedScoreboard.fromJson(userQuizScoreJson.stats);

    res.json(quizDetailedScoreboard.toJson());
    return res.status(OK).end();
  }

  return res.status(UNAUTHORIZED).end();
});

export default router;

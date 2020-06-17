import {Request, Response, Router} from 'express';
import 'express-session';
import {OK, UNAUTHORIZED} from 'http-status-codes';
import {asyncDbGet} from '@shared/databaseUtils';
import {comparePasswordWithHash} from '@shared/hashUtils';

const router = Router();

interface User {
  id: number,
  username: string,
  password_hash: string,
  password_generation: number
}

router.post('/login', async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    console!.log(username);
    console!.log(password);

    const loginUserResult = await loginUser(req, username, password);
    console!.log(req.session);

    if (loginUserResult) {
      res.redirect('/static/quiz.html');
      return res.status(OK).end();
    }
  }

  res.redirect('/static/login.html');
  return res.status(UNAUTHORIZED).end();
});

async function loginUser(req: Request, username: string, password: string): Promise<boolean> {
  const user = await getUserWithName(username);

  if (user !== undefined) {
    const correctUser: User = user as User;
    const isPasswordCorrect = comparePasswordWithHash(password, correctUser.password_hash);

    if (isPasswordCorrect) {
      return loginCorrectUser(req, correctUser);
    }
  }

  return false;
}

async function getUserWithName(username: string): Promise<any> {
  return await asyncDbGet('SELECT * FROM users WHERE username = ?', [username]);
}

function loginCorrectUser(req: Request, user: User): boolean {
  if (req.session !== undefined) {
    req.session.username = user;
    req.session.user_id = user.id;
    req.session.password_generation = user.password_generation;

    return true;
  }

  return false;
}


export default router;

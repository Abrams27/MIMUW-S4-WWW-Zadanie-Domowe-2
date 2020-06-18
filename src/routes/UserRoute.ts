import {NextFunction, Request, Response, Router} from 'express';
import 'express-session';
import {OK, UNAUTHORIZED} from 'http-status-codes';
import {asyncDbGet, asyncDbRun} from '@shared/databaseUtils';
import {comparePasswordWithHash, hashPassword} from '@shared/hashUtils';
import {csrfProtectionMiddleware} from '../middlewares/csrf';

const router = Router();

interface UserRoute {
  id: number,
  username: string,
  password_hash: string,
  password_generation: number
}

router.post('/login', csrfProtectionMiddleware, async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const loginUserResult = await loginUser(req, username, password);

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
    const correctUser: UserRoute = user as UserRoute;
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

function loginCorrectUser(req: Request, user: UserRoute): boolean {
  if (req.session !== undefined) {
    req.session.username = user.username;
    req.session.user_id = user.id;
    req.session.password_generation = user.password_generation;

    return true;
  }

  return false;
}


router.get('/logout', async (req: Request, res: Response) => {
  if (req.session !== undefined) {
    req.session.destroy(() => {
      res.redirect('/static/login.html')
    })
  }
});






async function isUserLoggedMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.session !== undefined && req.session.username !== undefined) {
    const username: string = req.session.username;
    const user: any = await getUserWithName(username);

    if (user !== undefined) {
      const correctUser: UserRoute = user as UserRoute;

      if (isUserLogged(req, correctUser)) {
        next();
        return;
      }
    }
  }

  res.redirect('/static/login.html');
}

function isUserLogged(req: Request, user: UserRoute): boolean {
  return user.password_generation === req.session!.password_generation;
}

router.post('/change', csrfProtectionMiddleware, isUserLoggedMiddleware, async (req: Request, res: Response) => {
  const oldPassword: string = req.body.oldPassword;
  const newPassword: string = req.body.newPassword;
  const newPasswordConfirmation: string = req.body.newPasswordConfirmation;
  const username: string = req.session!.username;

  if (oldPassword && newPassword && newPasswordConfirmation) {
    const changeUserPasswordResult = await changeUserPassword(req, username, oldPassword, newPassword, newPasswordConfirmation);

    if (changeUserPasswordResult) {
      res.redirect('logout');
      return res.status(OK).end();
    }
  }

  res.redirect('/static/passwordChange.html');
  return res.status(UNAUTHORIZED).end();
});

async function changeUserPassword(req: Request, username: string, oldPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<boolean> {
  const user = await getUserWithName(username);

  if (newPassword === newPasswordConfirmation && user !== undefined) {
    const correctUser: UserRoute = user as UserRoute;

    await changeUserPasswordWithConfirmedPassword(req, correctUser, newPassword);
    return true;
  }

  return false;
}

async function changeUserPasswordWithConfirmedPassword(req: Request, user: UserRoute, newPassword: string) {
  await updateUserPasswordAndPasswordGeneration(user, newPassword);

  req.session!.password_generation += 1;
}

async function updateUserPasswordAndPasswordGeneration(user: UserRoute, newPassword: string) {
  const hashedNewPassword: string = hashPassword(newPassword);
  const newPasswordGeneration: number = user.password_generation + 1;
  const username: string = user.username;

  await asyncDbRun('UPDATE users SET password_hash = ?, password_generation = ? WHERE username = ?',
      [hashedNewPassword, newPasswordGeneration, username]);
}

export default router;

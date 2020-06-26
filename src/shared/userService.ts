import {NextFunction, Request, Response, Router} from 'express';
import {databaseService} from '@shared/databaseService';
import {comparePasswordWithHash, hashPassword} from '@shared/hashUtils';

interface UserProperties {
  id: number,
  username: string,
  password_hash: string,
  password_generation: number
}

class UserService {

  public async loginUser(req: Request, username: string, password: string): Promise<boolean> {
    const user: any = await databaseService.getUserWithName(username);

    if (user !== undefined) {
      const correctUser: UserProperties = user as UserProperties;
      const isPasswordCorrect = comparePasswordWithHash(password, correctUser.password_hash);

      if (isPasswordCorrect) {
        return this.loginCorrectUser(req, correctUser);
      }
    }

    return false;
  }

  private loginCorrectUser(req: Request, user: UserProperties): boolean {
    if (req.session !== undefined) {
      req.session.username = user.username;
      req.session.user_id = user.id;
      req.session.password_generation = user.password_generation;

      return true;
    }

    return false;
  }


  public async logoutUser(req: Request): Promise<void> {
    if (req.session !== undefined) {
      return new Promise( (resolve, _) => req.session!.destroy(resolve));
    }
  }


  public async changeUserPassword(req: Request, username: string, oldPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<boolean> {
    const user: any = await databaseService.getUserWithName(username);

    if (newPassword === newPasswordConfirmation && user !== undefined) {
      const correctUser: UserProperties = user as UserProperties;

      return await this.changeUserPasswordWithConfirmedPassword(req, correctUser, newPassword);
    }

    return false;
  }

  private async changeUserPasswordWithConfirmedPassword(req: Request, user: UserProperties, newPassword: string): Promise<boolean> {
    if (req.session !== undefined) {
      const username: string = user.username;
      const newPasswordGeneration: number = user.password_generation + 1;
      req.session.passwordGeneration = newPasswordGeneration;

      await this.updateUserPasswordAndPasswordGeneration(username, newPasswordGeneration, newPassword);


      return true;
    }

    return false;
  }

  private async updateUserPasswordAndPasswordGeneration(username: string, newPasswordGeneration: number, newPassword: string) {
    const hashedNewPassword: string = hashPassword(newPassword);

    await databaseService.updateUserPassword(username, hashedNewPassword, newPasswordGeneration);
  }


  public async isUserLoggedWithLatestPassword(username: string, passwordGeneration: number): Promise<boolean> {
    const user: any = await databaseService.getUserWithName(username);

    if (user !== undefined) {
      const correctUser: UserProperties = user as UserProperties;
      const userPasswordLatestPasswordGeneration: number = correctUser.password_generation;

      return this.isUserPasswordLatestOne(userPasswordLatestPasswordGeneration, passwordGeneration);
    }

    return false;
  }

  private isUserPasswordLatestOne(userPasswordLatestPasswordGeneration: number, passwordGeneration: number): boolean {
    return userPasswordLatestPasswordGeneration === passwordGeneration;
  }
}


export const userService = new UserService();

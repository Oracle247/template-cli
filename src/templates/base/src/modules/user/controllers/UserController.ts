import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services';
import { successResponse } from '../../../core/utils/responses.utils';
import { StatusCodes } from 'http-status-codes';


class UserController {

  public userService = new UserService()

  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const result = await this.userService.getUser(req.params.id);

      return successResponse(
        res,
        "User Fetched successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error: any) {
      next(error);
    }
  }

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const result = await this.userService.createUser(req.body);

      return successResponse(
        res,
        "User Created successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const userData = { ...req.body };

      const result = await this.userService.updateUserById(userId, userData);

      return successResponse(
        res,
        "User updated successfully",
        StatusCodes.OK,
        result,
      );

    } catch (error: any) {
      next(error);
    }
  }

  public getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.getAllUsers({
        page: req.query.page as string,
        limit: req.query.limit as string,
      });

      return successResponse(
        res,
        "Users retrieved successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error: any) {
      next(error);
    }
  }

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;

      const result = await this.userService.deleteUserById(userId);

      return successResponse(
        res,
        "User deleted successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error: any) {
      next(error);
    }
  }
}

export { UserController };

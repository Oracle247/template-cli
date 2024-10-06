import { NextFunction, Response, Request } from 'express';
import { HttpException } from '../../core/exceptions';
import { User } from '../../modules/user/models'
import { HttpCodes } from '../../core/constants'
import TokenService from '../../modules/authentication/services/Token.service';
import { AdminService } from '../../modules/admin/services/AdminService';
import { UserService } from '../../modules/user/services';

export const isAdminAuthenticated = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const _noAuth = () =>
      next(
        new HttpException(
          HttpCodes.UNAUTHORIZED,
          `Oops!, you are not authenticated, login`
        ),
      );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { authorization } = req.headers;
    const _authHeader = authorization;
    if (!_authHeader) return _noAuth();
    const [id, token] = _authHeader.split(' ');
    if (!id || !token) return _noAuth();
    if (id.trim().toLowerCase() !== 'bearer') return _noAuth();
    const decodedToken = await new TokenService().verifyToken(token);
    const { sub, type }: any = decodedToken;
    if (type === 'refresh')
      return next(
        new HttpException(HttpCodes.UNAUTHORIZED, 'Oops!, wrong token type'),
      );
    const admin = await new AdminService().getAdminById(sub);
    if (!admin)
      return next(
        new HttpException(HttpCodes.NOT_FOUND, 'Oops!, admin does not exist'),
      );

    /** Store the result in a req object */
    req.admin = admin
    next();
  } catch (err: any) {
    return next(
      new HttpException(err.status || HttpCodes.UNAUTHORIZED, err.message),
    );
  }
};

export const isUserAuthenticated = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const _noAuth = () =>
      next(
        new HttpException(
          HttpCodes.UNAUTHORIZED,
          `Oops!, you are not authenticated, login`
        ),
      );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { authorization } = req.headers;
    const _authHeader = authorization;
    if (!_authHeader) return _noAuth();
    const [id, token] = _authHeader.split(' ');
    if (!id || !token) return _noAuth();
    if (id.trim().toLowerCase() !== 'bearer') return _noAuth();
    const decodedToken = await new TokenService().verifyToken(token);
    const { sub, type }: any = decodedToken;
    if (type === 'refresh')
      return next(
        new HttpException(HttpCodes.UNAUTHORIZED, 'Oops!, wrong token type'),
      );
    const user = await new UserService().getUserById(sub);
    if (!user)
      return next(
        new HttpException(HttpCodes.NOT_FOUND, 'Oops!, admin does not exist'),
      );

    /** Store the result in a req object */
    req.user = user;
    next();
  } catch (err: any) {
    return next(
      new HttpException(err.status || HttpCodes.UNAUTHORIZED, err.message),
    );
  }
};

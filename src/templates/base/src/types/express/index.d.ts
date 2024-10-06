/* eslint-disable @typescript-eslint/no-empty-interface */
import { AdminDocument } from "../../modules/admin/interface/Admin";
import { Request as ExpressRequest } from "express";
import { UserDocument } from "../../modules/user/interfaces/UserInterface";

// Extend the Request interface to include the user property when the middleware is used
declare module "express-serve-static-core" {
  interface Admin extends AdminDocument { }
  interface User extends UserDocument { }
  interface Request {
    admin?: Admin;
    user?: User;
  }
}

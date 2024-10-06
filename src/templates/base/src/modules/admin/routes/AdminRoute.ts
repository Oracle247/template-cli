
import { isAdminAuthenticated } from "../../../core/middlewares/AuthMiddleware";
import { Request, Response, NextFunction, Router } from 'express';
import { AdminController } from '../controllers';
import { Routes } from "../../../core/routes/interfaces";
class AdminRoute implements Routes {
  public path = '/admin';
  public router = Router();
  public adminController = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next()
    })

    this.router.get(`${this.path}`, isAdminAuthenticated, this.adminController.getAllAdmin);

    this.router.get(`${this.path}/:id`, isAdminAuthenticated, this.adminController.getAdmin);

    this.router.post(`${this.path}/`, isAdminAuthenticated, this.adminController.createAdmin);

    this.router.put(`${this.path}/:id`, isAdminAuthenticated, this.adminController.updateAdmin);

    this.router.delete(`${this.path}/:id`, isAdminAuthenticated, this.adminController.deleteAdmin);
  }
}

export { AdminRoute };


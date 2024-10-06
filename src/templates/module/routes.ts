//@ts-nocheck
import { isUserAuthenticated } from "../../../core/middlewares/AuthMiddleware";
import { Request, Response, NextFunction, Router } from 'express';
import { __MODULE__Controller } from '../controllers';
import { Routes } from "../../../core/routes/interfaces";
class __MODULE__Route implements Routes {
    public path = '/__module__';
    public router = Router();
    public __module__Controller = new __MODULE__Controller();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
            next()
        })

        this.router.post(`${this.path}`, this.__module__Controller.create__MODULE__);

        this.router.get(`${this.path}`, isUserAuthenticated, this.__module__Controller.getAll__MODULE__);

        this.router.get(`${this.path}/:id`, isUserAuthenticated, this.__module__Controller.get__MODULE__);

        this.router.put(`${this.path}/:id`, isUserAuthenticated, this.__module__Controller.update__MODULE__);

        this.router.delete(`${this.path}/:id`, isUserAuthenticated, this.__module__Controller.delete__MODULE__);
    }
}

export { __MODULE__Route };


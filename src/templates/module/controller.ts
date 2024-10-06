//@ts-nocheck
import { NextFunction, Request, Response } from 'express';
import { __MODULE__Service } from '../services';
import { successResponse } from '../../../core/utils/responses.utils';
import { StatusCodes } from 'http-status-codes';


class __MODULE__Controller {
    public __module__Service = new __MODULE__Service()

    public get__MODULE__ = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const result = await this.__module__Service.get__MODULE__(req.params.id);

            return successResponse(
                res,
                "__MODULE__ Fetched successfully",
                StatusCodes.OK,
                result,
            );
        } catch (error: any) {
            next(error);
        }
    }

    public create__MODULE__ = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const result = await this.__module__Service.create__MODULE__(req.body);

            return successResponse(
                res,
                "__MODULE__ Created successfully",
                StatusCodes.OK,
                result,
            );
        } catch (error) {
            next(error);
        }
    }

    public update__MODULE__ = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const __module__Id = req.params.id;
            const __module__Data = { ...req.body };

            const result = await this.__module__Service.update__MODULE__ById(__module__Id, __module__Data);

            return successResponse(
                res,
                "__MODULE__ updated successfully",
                StatusCodes.OK,
                result,
            );

        } catch (error: any) {
            next(error);
        }
    }

    public getAll__MODULE__ = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.__module__Service.getAll__MODULE__s({
                page: req.query.page as string,
                limit: req.query.limit as string,
            });

            return successResponse(
                res,
                "__MODULE__s retrieved successfully",
                StatusCodes.OK,
                result,
            );
        } catch (error: any) {
            next(error);
        }
    }

    public delete__MODULE__ = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const __module__Id = req.params.id;

            const result = await this.__module__Service.delete__MODULE__ById(__module__Id);

            return successResponse(
                res,
                "__MODULE__ deleted successfully",
                StatusCodes.OK,
                result,
            );
        } catch (error: any) {
            next(error);
        }
    }
}

export { __MODULE__Controller };

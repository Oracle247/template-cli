import { NextFunction, Request, Response } from "express";
import { ActivityService } from "../services/Activity.service";
import { successResponse } from "../../../core/utils/responses.utils";
import { StatusCodes } from "http-status-codes";

export class ActivityController {
  public activityService = new ActivityService()

  public getActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.activityService.getActivity(req.params.id);

      return successResponse(
        res,
        "Activity fetched successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  public createActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.activityService.createActivity(req.body);

      return successResponse(
        res,
        "Activity created successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  public updateActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activityId = req.params.id;
      const activityData = { ...req.body };

      const result = await this.activityService.updateActivityById(activityId, activityData);

      return successResponse(
        res,
        "Activity updated successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  public getAllActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.activityService.getAllActivities({
        page: req.query.page as string,
        limit: req.query.limit as string,
      });

      return successResponse(
        res,
        "Storefront Products retrieved successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error: any) {
      next(error);
    }
  }

  public deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ActivityId = req.params.id;

      const result = await this.activityService.deleteActivityById(ActivityId, req.admin._id);

      return successResponse(
        res,
        "Activity Deleted successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error: any) {
      next(error);
    }
  }
}

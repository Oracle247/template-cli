import { NextFunction, Response, Request } from "express";
import { AdminService } from "../services/AdminService";
import { successResponse } from "../../../core/utils/responses.utils";
import { StatusCodes } from "http-status-codes";

class AdminController {
  public adminService = new AdminService()

  public getAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const result = await this.adminService.getAdmin(req.params.id);

      return successResponse(
        res,
        "Admin Fetched successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error: any) {
      next(error);
    }
  }

  public createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const result = await this.adminService.createAdmin(req.body, req.admin._id);

      return successResponse(
        res,
        "Admin Created successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  public updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = req.params.id;
      const adminData = { ...req.body };

      const result = await this.adminService.updateAdminById(adminId, adminData, req.admin._id);

      return successResponse(
        res,
        "Admin updated successfully",
        StatusCodes.OK,
        result,
      );

    } catch (error: any) {
      next(error);
    }
  }

  public getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adminService.getAllAdmins({
        page: req.query.page as string,
        limit: req.query.limit as string,
      });

      return successResponse(
        res,
        "Admins retrieved successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error: any) {
      next(error);
    }
  }

  public deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId = req.params.id;

      const result = await this.adminService.deleteAdminById(adminId, req.admin._id);

      return successResponse(
        res,
        "Admin deleted successfully",
        StatusCodes.OK,
        result,
      );
    } catch (error: any) {
      next(error);
    }
  }
}

export { AdminController }

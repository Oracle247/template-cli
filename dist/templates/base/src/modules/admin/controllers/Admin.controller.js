"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const AdminService_1 = require("../services/AdminService");
const responses_utils_1 = require("../../../core/utils/responses.utils");
const http_status_codes_1 = require("http-status-codes");
class AdminController {
    constructor() {
        this.adminService = new AdminService_1.AdminService();
        this.getAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminService.getAdmin(req.params.id);
                return (0, responses_utils_1.successResponse)(res, "Admin Fetched successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.createAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminService.createAdmin(req.body, req.admin._id);
                return (0, responses_utils_1.successResponse)(res, "Admin Created successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = req.params.id;
                const adminData = Object.assign({}, req.body);
                const result = yield this.adminService.updateAdminById(adminId, adminData, req.admin._id);
                return (0, responses_utils_1.successResponse)(res, "Admin updated successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminService.getAllAdmins({
                    page: req.query.page,
                    limit: req.query.limit,
                });
                return (0, responses_utils_1.successResponse)(res, "Admins retrieved successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = req.params.id;
                const result = yield this.adminService.deleteAdminById(adminId, req.admin._id);
                return (0, responses_utils_1.successResponse)(res, "Admin deleted successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminController = AdminController;

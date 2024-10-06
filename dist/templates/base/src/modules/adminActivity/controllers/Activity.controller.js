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
exports.ActivityController = void 0;
const Activity_service_1 = require("../services/Activity.service");
const responses_utils_1 = require("../../../core/utils/responses.utils");
const http_status_codes_1 = require("http-status-codes");
class ActivityController {
    constructor() {
        this.activityService = new Activity_service_1.ActivityService();
        this.getActivity = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.activityService.getActivity(req.params.id);
                return (0, responses_utils_1.successResponse)(res, "Activity fetched successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.createActivity = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.activityService.createActivity(req.body);
                return (0, responses_utils_1.successResponse)(res, "Activity created successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateActivity = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const activityId = req.params.id;
                const activityData = Object.assign({}, req.body);
                const result = yield this.activityService.updateActivityById(activityId, activityData);
                return (0, responses_utils_1.successResponse)(res, "Activity updated successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllActivity = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.activityService.getAllActivities({
                    page: req.query.page,
                    limit: req.query.limit,
                });
                return (0, responses_utils_1.successResponse)(res, "Storefront Products retrieved successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteActivity = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ActivityId = req.params.id;
                const result = yield this.activityService.deleteActivityById(ActivityId, req.admin._id);
                return (0, responses_utils_1.successResponse)(res, "Activity Deleted successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ActivityController = ActivityController;

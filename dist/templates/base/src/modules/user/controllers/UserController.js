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
exports.UserController = void 0;
const services_1 = require("../services");
const responses_utils_1 = require("../../../core/utils/responses.utils");
const http_status_codes_1 = require("http-status-codes");
class UserController {
    constructor() {
        this.userService = new services_1.UserService();
        this.getUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.getUser(req.params.id);
                return (0, responses_utils_1.successResponse)(res, "User Fetched successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.createUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.createUser(req.body);
                return (0, responses_utils_1.successResponse)(res, "User Created successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const userData = Object.assign({}, req.body);
                const result = yield this.userService.updateUserById(userId, userData);
                return (0, responses_utils_1.successResponse)(res, "User updated successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.getAllUsers({
                    page: req.query.page,
                    limit: req.query.limit,
                });
                return (0, responses_utils_1.successResponse)(res, "Users retrieved successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const result = yield this.userService.deleteUserById(userId);
                return (0, responses_utils_1.successResponse)(res, "User deleted successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;

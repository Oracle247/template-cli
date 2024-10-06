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
exports.__MODULE__Controller = void 0;
const services_1 = require("../services");
const responses_utils_1 = require("../../../core/utils/responses.utils");
const http_status_codes_1 = require("http-status-codes");
class __MODULE__Controller {
    constructor() {
        this.__module__Service = new services_1.__MODULE__Service();
        this.get__MODULE__ = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.__module__Service.get__MODULE__(req.params.id);
                return (0, responses_utils_1.successResponse)(res, "__MODULE__ Fetched successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.create__MODULE__ = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.__module__Service.create__MODULE__(req.body);
                return (0, responses_utils_1.successResponse)(res, "__MODULE__ Created successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.update__MODULE__ = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const __module__Id = req.params.id;
                const __module__Data = Object.assign({}, req.body);
                const result = yield this.__module__Service.update__MODULE__ById(__module__Id, __module__Data);
                return (0, responses_utils_1.successResponse)(res, "__MODULE__ updated successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAll__MODULE__ = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.__module__Service.getAll__MODULE__s({
                    page: req.query.page,
                    limit: req.query.limit,
                });
                return (0, responses_utils_1.successResponse)(res, "__MODULE__s retrieved successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.delete__MODULE__ = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const __module__Id = req.params.id;
                const result = yield this.__module__Service.delete__MODULE__ById(__module__Id);
                return (0, responses_utils_1.successResponse)(res, "__MODULE__ deleted successfully", http_status_codes_1.StatusCodes.OK, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.__MODULE__Controller = __MODULE__Controller;

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
exports.__MODULE__Service = void 0;
const constants_1 = require("../../../interfaces/constants");
const paginate_1 = require("../../../core/utils/paginate");
const models_1 = require("../models");
const exceptions_1 = require("../../../core/exceptions");
const http_status_codes_1 = require("http-status-codes");
class __MODULE__Service {
    get__MODULE__(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.__MODULE__.findById(id);
        });
    }
    create__MODULE__(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing__MODULE__ = yield models_1.__MODULE__.findOne({ title: payload.title });
            if (existing__MODULE__) {
                throw new exceptions_1.AppError("__MODULE__ with the same name already exists.", 400);
            }
            const __module__Post = yield models_1.__MODULE__.create(Object.assign(Object.assign({}, payload), { status: constants_1.Status.ACTIVE }));
            return __module__Post;
        });
    }
    getAll__MODULE__s(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit = "10", page = "1", search, }) {
            const limitNum = parseInt(limit, 10);
            const pageNum = parseInt(page, 10);
            const query = search ? { username: { $regex: new RegExp(search, "i") } } : {};
            const total = yield models_1.__MODULE__.countDocuments(query);
            const pagination = (0, paginate_1.generatePagination)({
                limit: limitNum,
                total,
                page: pageNum,
            });
            const __module__Posts = yield models_1.__MODULE__.find(query)
                .skip(pagination.skip)
                .limit(pagination.limit);
            return {
                results: __module__Posts,
                pagination,
            };
        });
    }
    get__MODULE__ById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, eagerLoad = true, load) {
            const data = eagerLoad
                ? yield models_1.__MODULE__.findById(id).populate(load)
                : models_1.__MODULE__.findById(id);
            if (!data)
                throw new exceptions_1.AppError(`__MODULE__ with id: ${id} does not exist`, http_status_codes_1.StatusCodes.BAD_REQUEST);
            return data;
        });
    }
    update__MODULE__ById(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.get__MODULE__ById(id);
            if (!user) {
                throw new exceptions_1.AppError(`Oops!, __MODULE__ does not exist`, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            Object.assign(user, payload);
            yield user.save();
            return user;
        });
    }
    delete__MODULE__ById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.get__MODULE__ById(id);
            if (!data) {
                throw new exceptions_1.AppError(`Oops!, __MODULE__ does not exist`, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const deleteData = yield models_1.__MODULE__.findByIdAndDelete(id);
            return deleteData;
        });
    }
}
exports.__MODULE__Service = __MODULE__Service;

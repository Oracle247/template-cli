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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const Activity_model_1 = __importDefault(require("../models/Activity.model"));
const paginate_1 = require("../../../core/utils/paginate");
class ActivityService {
    getActivity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activity = (yield Activity_model_1.default.findById(id)).populate({
                    path: "admin",
                    select: "full_name",
                    populate: {
                        path: "role",
                        select: "title"
                    }
                });
                return activity;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch Activity');
            }
        });
    }
    createActivity(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activity = yield Activity_model_1.default.create(Object.assign({}, payload));
                return activity;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch Activity');
            }
        });
    }
    getAllActivities(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit = "10", page = "1", search, }) {
            try {
                let query = {};
                // Search
                const searchQuery = search
                    ? { username: { $regex: new RegExp(search, "i") } }
                    : {};
                query = Object.assign(Object.assign({}, query), searchQuery);
                const total = yield Activity_model_1.default.countDocuments(query);
                const pagination = (0, paginate_1.generatePagination)({
                    limit,
                    total,
                    page,
                });
                const storefronts = yield Activity_model_1.default
                    .find(query)
                    .populate({
                    path: "admin",
                    select: "fullname",
                    populate: {
                        path: "role",
                        select: "title"
                    }
                })
                    .skip(pagination.skip)
                    .limit(pagination.limit);
                return {
                    results: storefronts,
                    pagination,
                };
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch Activities');
            }
        });
    }
    getActivityById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, eagerLoad = true, load) {
            const data = eagerLoad
                ? yield Activity_model_1.default.findById(id).populate(load)
                : Activity_model_1.default.findById(id);
            if (!data)
                throw new Error(`Activity with id: ${id} does not exist`);
            return data;
        });
    }
    updateActivityById(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activity = yield this.getActivityById(id);
                if (!activity) {
                    throw new Error(`Oops!, Activity does not exist`);
                }
                Object.assign(activity, payload);
                yield activity.save();
                return activity;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch Activity');
            }
        });
    }
    deleteActivityById(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.getActivityById(id);
                if (!data) {
                    throw new Error(`Oops!, Activity does not exist`);
                }
                const deleteData = yield Activity_model_1.default.findByIdAndDelete(id);
                yield this.createActivity({
                    admin: admin,
                    type: "Delete Activity"
                });
                return deleteData;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch Activity');
            }
        });
    }
}
exports.ActivityService = ActivityService;

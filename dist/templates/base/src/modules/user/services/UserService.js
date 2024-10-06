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
exports.UserService = void 0;
const constants_1 = require("../../../interfaces/constants");
const paginate_1 = require("../../../core/utils/paginate");
const models_1 = require("../models");
class UserService {
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.User.findById(id);
                return user;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch User');
            }
        });
    }
    createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                payload.email = payload.email.toLowerCase();
                const existingEmail = yield models_1.User.findOne({ email: payload.email });
                const existingPhoneNumber = yield models_1.User.findOne({ phoneNumber: payload.phoneNumber });
                if (existingEmail) {
                    throw new Error('Oops, Email already exists');
                }
                if (existingPhoneNumber) {
                    throw new Error('Oops, Phone number already exists');
                }
                const user = yield models_1.User.create(Object.assign(Object.assign({}, payload), { status: constants_1.Status.ACTIVE }));
                return user;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch User');
            }
        });
    }
    getAllUsers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit = "10", page = "1", search, }) {
            try {
                let query = {};
                // Search
                const searchQuery = search
                    ? { username: { $regex: new RegExp(search, "i") } }
                    : {};
                query = Object.assign(Object.assign({}, query), searchQuery);
                const total = yield models_1.User.countDocuments(query);
                const pagination = (0, paginate_1.generatePagination)({
                    limit,
                    total,
                    page,
                });
                const result = yield models_1.User
                    .find(query)
                    .skip(pagination.skip)
                    .limit(pagination.limit);
                return {
                    results: result,
                    pagination,
                };
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch Activities');
            }
        });
    }
    getUserById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, eagerLoad = true, load) {
            const data = eagerLoad
                ? yield models_1.User.findById(id).populate(load)
                : models_1.User.findById(id);
            if (!data)
                throw new Error(`User with id: ${id} does not exist`);
            return data;
        });
    }
    updateUserById(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.getUserById(id);
                if (!user) {
                    throw new Error(`Oops!, User does not exist`);
                }
                Object.assign(user, payload);
                yield user.save();
                return user;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch User');
            }
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.getUserById(id);
                if (!data) {
                    throw new Error(`Oops!, User does not exist`);
                }
                const deleteData = yield models_1.User.findByIdAndDelete(id);
                return deleteData;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch User');
            }
        });
    }
}
exports.UserService = UserService;

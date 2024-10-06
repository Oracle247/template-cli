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
exports.AdminService = void 0;
// import Role from "../../role/models/Role.model";
const constants_1 = require("../../../interfaces/constants");
const Activity_service_1 = require("../../adminActivity/services/Activity.service");
const paginate_1 = require("../../../core/utils/paginate");
const models_1 = require("../models");
class AdminService {
    getAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield models_1.Admin.findById(id);
                return admin;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch Admin');
            }
        });
    }
    createAdmin(payload, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                payload.email = payload.email.toLowerCase();
                const existingEmail = yield models_1.Admin.findOne({ email: payload.email });
                const existingPhoneNumber = yield models_1.Admin.findOne({ phoneNumber: payload.phoneNumber });
                if (existingEmail) {
                    throw new Error('Oops, Email already exists');
                }
                if (existingPhoneNumber) {
                    throw new Error('Oops, Phone number already exists');
                }
                const admin = yield models_1.Admin.create(Object.assign(Object.assign({}, payload), { status: constants_1.Status.ACTIVE }));
                yield (new Activity_service_1.ActivityService).createActivity({
                    admin: adminId,
                    type: "Create New Admin"
                });
                return admin;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch Admin');
            }
        });
    }
    getAllAdmins(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit = "10", page = "1", search, }) {
            try {
                let query = {};
                // Search
                const searchQuery = search
                    ? { username: { $regex: new RegExp(search, "i") } }
                    : {};
                query = Object.assign(Object.assign({}, query), searchQuery);
                const total = yield models_1.Admin.countDocuments(query);
                const pagination = (0, paginate_1.generatePagination)({
                    limit,
                    total,
                    page,
                });
                const result = yield models_1.Admin
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
    getAdminById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, eagerLoad = true, load) {
            const data = eagerLoad
                ? yield models_1.Admin.findById(id).populate(load)
                : models_1.Admin.findById(id);
            if (!data)
                throw new Error(`Admin with id: ${id} does not exist`);
            return data;
        });
    }
    updateAdminById(id, payload, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.getAdminById(id);
                if (!admin) {
                    throw new Error(`Oops!, Admin does not exist`);
                }
                // let newPayload;
                // if (payload.role) {
                //   const role = await Role.findOne({ title: payload.role });
                //   if (!role) {
                //     throw new Error('Role not found');
                //   }
                //   newPayload = {
                //     ...payload,
                //     role: role._id
                //   }
                // }
                // newPayload = {
                //   ...payload
                // }
                Object.assign(admin, payload);
                yield admin.save();
                yield (new Activity_service_1.ActivityService).createActivity({
                    admin: adminId,
                    type: "Create New Admin"
                });
                return admin;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch Admin');
            }
        });
    }
    deleteAdminById(id, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.getAdminById(id);
                if (!data) {
                    throw new Error(`Oops!, Admin does not exist`);
                }
                const deleteData = yield models_1.Admin.findByIdAndDelete(id);
                yield (new Activity_service_1.ActivityService).createActivity({
                    admin: adminId,
                    type: "Create New Admin"
                });
                return deleteData;
            }
            catch (err) {
                console.error(err);
                throw new Error('Failed to fetch Admin');
            }
        });
    }
}
exports.AdminService = AdminService;

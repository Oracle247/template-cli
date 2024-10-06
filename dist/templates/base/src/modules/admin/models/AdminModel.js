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
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../interfaces/constants");
const Encrypt_service_1 = __importDefault(require("../../authentication/services/Encrypt.service"));
const adminSchema = new mongoose_1.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: Object.values(constants_1.GENDER),
    },
    username: String,
    password: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    backupEmail: {
        type: String,
        trim: true,
        unique: true,
    },
    mfa: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: Object.values(constants_1.Status),
        default: constants_1.Status.ACTIVE,
    },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role'
    },
    image: {
        url: String,
        source: String,
        public_id: String,
    },
    dob: Date,
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (_doc, ret) {
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        },
    },
});
adminSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = this;
        if (admin.isModified('password')) {
            admin.password = yield (new Encrypt_service_1.default).hashPassword(admin.password);
        }
        next();
    });
});
const Admin = (0, mongoose_1.model)("Admin", adminSchema);
exports.Admin = Admin;

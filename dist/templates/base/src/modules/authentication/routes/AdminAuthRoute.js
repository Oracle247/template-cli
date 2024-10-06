"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
// import validate from "../../../middleware/validation/validate";
// import { changePasswordValidator, loginAdminValidator, mfaValidator, resetPasswordValidator, sendResetLinkValidator } from "../../../shared/utils/validators/auth.admin.validator";
// import { createAdminValidator } from "../../../shared/utils/validators/admin.validator";
const AdminAuthRouter = express_1.default.Router();
const adminAuthController = new controllers_1.AdminAuthController();
AdminAuthRouter.post("/login", adminAuthController.login);
AdminAuthRouter.post("/create", adminAuthController.create);
AdminAuthRouter.post("/reset-password", adminAuthController.passwordReset);
AdminAuthRouter.post("/mfa", adminAuthController.mfa);
AdminAuthRouter.post("/send-reset-link", adminAuthController.sendResetLink);
AdminAuthRouter.post("/change-password", adminAuthController.changePassword);
exports.default = AdminAuthRouter;

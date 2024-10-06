import express, { Router } from "express";
import { AdminAuthController } from "../controllers";

// import validate from "../../../middleware/validation/validate";
// import { changePasswordValidator, loginAdminValidator, mfaValidator, resetPasswordValidator, sendResetLinkValidator } from "../../../shared/utils/validators/auth.admin.validator";
// import { createAdminValidator } from "../../../shared/utils/validators/admin.validator";

const AdminAuthRouter: Router = express.Router();

const adminAuthController = new AdminAuthController();

AdminAuthRouter.post("/login", adminAuthController.login);

AdminAuthRouter.post("/create", adminAuthController.create);

AdminAuthRouter.post("/reset-password", adminAuthController.passwordReset);

AdminAuthRouter.post("/mfa", adminAuthController.mfa);

AdminAuthRouter.post("/send-reset-link", adminAuthController.sendResetLink);

AdminAuthRouter.post("/change-password", adminAuthController.changePassword);

export default AdminAuthRouter;

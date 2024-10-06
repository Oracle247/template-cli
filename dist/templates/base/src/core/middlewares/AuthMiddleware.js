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
exports.isUserAuthenticated = exports.isAdminAuthenticated = void 0;
const exceptions_1 = require("../../core/exceptions");
const constants_1 = require("../../core/constants");
const Token_service_1 = __importDefault(require("../../modules/authentication/services/Token.service"));
const AdminService_1 = require("../../modules/admin/services/AdminService");
const services_1 = require("../../modules/user/services");
const isAdminAuthenticated = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _noAuth = () => next(new exceptions_1.HttpException(constants_1.HttpCodes.UNAUTHORIZED, `Oops!, you are not authenticated, login`));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const { authorization } = req.headers;
        const _authHeader = authorization;
        if (!_authHeader)
            return _noAuth();
        const [id, token] = _authHeader.split(' ');
        if (!id || !token)
            return _noAuth();
        if (id.trim().toLowerCase() !== 'bearer')
            return _noAuth();
        const decodedToken = yield new Token_service_1.default().verifyToken(token);
        const { sub, type } = decodedToken;
        if (type === 'refresh')
            return next(new exceptions_1.HttpException(constants_1.HttpCodes.UNAUTHORIZED, 'Oops!, wrong token type'));
        const admin = yield new AdminService_1.AdminService().getAdminById(sub);
        if (!admin)
            return next(new exceptions_1.HttpException(constants_1.HttpCodes.NOT_FOUND, 'Oops!, admin does not exist'));
        /** Store the result in a req object */
        req.admin = admin;
        next();
    }
    catch (err) {
        return next(new exceptions_1.HttpException(err.status || constants_1.HttpCodes.UNAUTHORIZED, err.message));
    }
});
exports.isAdminAuthenticated = isAdminAuthenticated;
const isUserAuthenticated = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _noAuth = () => next(new exceptions_1.HttpException(constants_1.HttpCodes.UNAUTHORIZED, `Oops!, you are not authenticated, login`));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const { authorization } = req.headers;
        const _authHeader = authorization;
        if (!_authHeader)
            return _noAuth();
        const [id, token] = _authHeader.split(' ');
        if (!id || !token)
            return _noAuth();
        if (id.trim().toLowerCase() !== 'bearer')
            return _noAuth();
        const decodedToken = yield new Token_service_1.default().verifyToken(token);
        const { sub, type } = decodedToken;
        if (type === 'refresh')
            return next(new exceptions_1.HttpException(constants_1.HttpCodes.UNAUTHORIZED, 'Oops!, wrong token type'));
        const user = yield new services_1.UserService().getUserById(sub);
        if (!user)
            return next(new exceptions_1.HttpException(constants_1.HttpCodes.NOT_FOUND, 'Oops!, admin does not exist'));
        /** Store the result in a req object */
        req.user = user;
        next();
    }
    catch (err) {
        return next(new exceptions_1.HttpException(err.status || constants_1.HttpCodes.UNAUTHORIZED, err.message));
    }
});
exports.isUserAuthenticated = isUserAuthenticated;

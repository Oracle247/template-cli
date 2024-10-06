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
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = require("path");
const promises_1 = require("fs/promises");
const node_crypto_1 = require("node:crypto");
const helper_1 = __importDefault(require("../../../core/utils/helper"));
const config_1 = require("../../../config");
let PRIVATE_KEY = "";
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        PRIVATE_KEY = yield (0, promises_1.readFile)((0, path_1.join)(__dirname, "../../../certs/private_key.pem"), "utf8");
    }
    catch (err) { }
}))();
let PUBLIC_KEY = "";
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        PUBLIC_KEY = yield (0, promises_1.readFile)((0, path_1.join)(__dirname, "../../../certs/public_key.pem"), "utf8");
    }
    catch (err) { }
}))();
class TokenService {
    /**
     * @param uuid
     * @returns
     */
    _generateAccessToken(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ sub: id, name, type: "access" }, PRIVATE_KEY, {
                algorithm: "RS512",
                expiresIn: config_1.JWT_ACCESS_TOKEN_EXPIRES,
            });
            return token;
        });
    }
    _generateRefreshToken(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ sub: id, name, type: "refresh" }, PRIVATE_KEY, {
                algorithm: "RS512",
                expiresIn: config_1.JWT_REFRESH_TOKEN_EXPIRES,
            });
            return token;
        });
    }
    generateToken(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield this._generateAccessToken(id, name);
            const refreshToken = yield this._generateRefreshToken(id, name);
            return { accessToken, refreshToken };
        });
    }
    /**
     * @param token refers to the token that you want to verify
     * @param next inbuilt middleware function
     * @returns
     */
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _token = jsonwebtoken_1.default.verify(token, PUBLIC_KEY, { algorithms: ["RS512"] });
                return _token;
            }
            catch (err) {
                if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError")
                    throw new Error(`Oops! your token has expired or is invalid`);
                throw new Error(err.message);
            }
        });
    }
    /**Generate token that will be sent to the users email for verification
     * Generate random string using randomBytes from node crypto library
     */
    TokenGenerator() {
        return __awaiter(this, void 0, void 0, function* () {
            const Token = helper_1.default.generateRandomChar(50, "lower-num");
            const hashedToken = (0, node_crypto_1.createHash)("sha512").update(Token).digest("hex");
            return { Token, hashedToken };
        });
    }
}
exports.default = TokenService;

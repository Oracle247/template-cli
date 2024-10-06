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
const bcrypt_1 = __importDefault(require("bcrypt"));
const node_crypto_1 = require("node:crypto");
class EncryptionService {
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptedPassword = yield bcrypt_1.default.hash(password, 14);
            return encryptedPassword;
        });
    }
    comparePassword(password, storedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const _checkPassword = yield bcrypt_1.default.compare(storedPassword, password);
            return _checkPassword;
        });
    }
    hashString(string) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedString = (0, node_crypto_1.createHash)('sha512').update(string).digest('hex');
            return hashedString;
        });
    }
}
exports.default = EncryptionService;

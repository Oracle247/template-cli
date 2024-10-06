"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileSync = exports.ensureDirSync = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const ensureDirSync = (dir) => {
    if (!fs_extra_1.default.existsSync(dir)) {
        fs_extra_1.default.mkdirSync(dir, { recursive: true });
    }
};
exports.ensureDirSync = ensureDirSync;
const writeFileSync = (filePath, content) => {
    fs_extra_1.default.writeFileSync(filePath, content);
};
exports.writeFileSync = writeFileSync;

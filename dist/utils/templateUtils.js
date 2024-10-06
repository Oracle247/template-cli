"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTemplate = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const readTemplate = (templateName) => {
    const templatePath = path_1.default.join(__dirname, '../templates/module', templateName);
    return fs_extra_1.default.readFileSync(templatePath, 'utf-8');
};
exports.readTemplate = readTemplate;

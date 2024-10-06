"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileLink = void 0;
const config_1 = require("../../config");
const getFileLink = (req) => {
    console.log(config_1.NODE_ENV);
    if (config_1.NODE_ENV == "development") {
        return `${req.protocol}://${req.hostname}:${config_1.PORT}/uploads/${(req.file.filename)}`;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return `${"https" !== null && "https" !== void 0 ? "https" : req.protocol}://${req.hostname}/uploads/${(req.file.filename)}`;
};
exports.getFileLink = getFileLink;

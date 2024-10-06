"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const config_1 = require("../../config");
const dbConnection = {
    url: config_1.DB_URI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
};
exports.dbConnection = dbConnection;

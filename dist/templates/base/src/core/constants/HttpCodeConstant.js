"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCodes = void 0;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["CREATED"] = 201] = "CREATED";
    HttpCodes[HttpCodes["CONTINUE"] = 202] = "CONTINUE";
    HttpCodes[HttpCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpCodes[HttpCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpCodes[HttpCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpCodes[HttpCodes["CONFLICT"] = 409] = "CONFLICT";
    HttpCodes[HttpCodes["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    HttpCodes[HttpCodes["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(HttpCodes || (exports.HttpCodes = HttpCodes = {}));

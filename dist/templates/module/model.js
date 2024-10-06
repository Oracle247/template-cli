"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__MODULE__ = void 0;
// @ts-nocheck
const mongoose_1 = require("mongoose");
const __module__Schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (_doc, ret) {
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        },
    },
});
const __MODULE__ = (0, mongoose_1.model)("__MODULE__", __module__Schema);
exports.__MODULE__ = __MODULE__;

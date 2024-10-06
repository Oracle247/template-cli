// @ts-nocheck
import { Schema, model } from "mongoose";
import { __MODULE__Document } from "../interfaces";

const __module__Schema = new Schema<__MODULE__Document>(
    {
        name: {
            type: String,
            required: true
        },
    },
    {
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
    }
);

const __MODULE__ = model<__MODULE__Document>(
    "__MODULE__",
    __module__Schema
);

export { __MODULE__ };

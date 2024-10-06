// @ts-nocheck

import mongoose, { Schema, Document } from 'mongoose';

export interface I__MODULE__ extends Document {
    name: string;
}

const __MODULE__Schema: Schema = new Schema({
    name: { type: String, required: true },
});

export const __MODULE__Model = mongoose.model < I__MODULE__('__MODULE__', __MODULE__Schema);

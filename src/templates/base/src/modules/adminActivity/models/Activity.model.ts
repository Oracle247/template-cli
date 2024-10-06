import { Schema, model } from "mongoose";
import { IActivity, ActivityDocument } from "../interface/Activity.interface";

const activitySchema = new Schema<ActivityDocument>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);


const Activity = model<ActivityDocument>(
  "Activity",
  activitySchema
);

export default Activity;

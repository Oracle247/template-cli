import { Document, Types } from "mongoose";


interface IActivity {
  admin: Types.ObjectId;
  type: string;
}


interface ActivityDocument extends IActivity, Document { }

export { IActivity, ActivityDocument }

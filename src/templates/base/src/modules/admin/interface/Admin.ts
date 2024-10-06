import { Document, Types } from "mongoose";
import {
  GENDER,
  Status,
} from "../../../interfaces/constants";

interface IAdmin {
  full_name: string;
  username: string;
  phoneNumber: string;
  password: string;
  email: string;
  backupEmail?: string;
  gender: GENDER;
  status: Status;
  dob: Date;
  mfa: boolean;
  role: Types.ObjectId
  image: { url: string; source: string; public_id: string };
}

export interface AdminInput {
  full_name: string;
  username: string;
  phoneNumber: string;
  email: string;
  backupEmail?: string;
  gender: GENDER;
  role: string;
}

interface AdminDocument extends IAdmin, Document { }

export { IAdmin, AdminDocument }

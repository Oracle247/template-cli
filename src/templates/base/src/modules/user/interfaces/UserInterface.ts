import { Document, Types } from "mongoose";
import {
  GENDER,
  Status,
} from "../../../interfaces/constants";

interface IUser {
  full_name: string;
  username: string;
  phoneNumber: string;
  password: string;
  email: string;
  gender: GENDER;
  status: Status;
  dob: Date;
  mfa: boolean;
  image: { url: string; source: string; public_id: string };
}

export interface UserInput {
  full_name: string;
  username?: string;
  phoneNumber?: string;
  email: string;
}

interface UserDocument extends IUser, Document { }

export { IUser, UserDocument }

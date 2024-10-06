import { Schema, model } from "mongoose";
import {
  GENDER,
  Status,
} from "../../../interfaces/constants";
import { UserDocument } from "../interfaces/UserInterface";
import EncryptionService from "../../authentication/services/Encrypt.service";

const userSchema = new Schema<UserDocument>(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    username: String,
    password: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    mfa: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },

    image: {
      url: String,
      source: String,
      public_id: String,
    },

    dob: Date,
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

userSchema.pre('save', async function (next) {
  const user = this as UserDocument

  if (user.isModified('password')) {
    user.password = await (new EncryptionService).hashPassword(user.password)
  }
  next()
})


const User = model<UserDocument>(
  "User",
  userSchema
);

export { User };

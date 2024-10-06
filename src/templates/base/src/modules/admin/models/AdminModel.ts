import { Schema, model } from "mongoose";
import {
  GENDER,
  Status,
} from "../../../interfaces/constants";
import { AdminDocument, IAdmin } from "../interface/Admin";
import EncryptionService from "../../authentication/services/Encrypt.service";

const adminSchema = new Schema<AdminDocument>(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
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
    backupEmail: {
      type: String,
      trim: true,
      unique: true,
    },
    mfa: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role'
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

adminSchema.pre('save', async function (next) {
  const admin = this as AdminDocument

  if (admin.isModified('password')) {
    admin.password = await (new EncryptionService).hashPassword(admin.password)
  }
  next()
})


const Admin = model<AdminDocument>(
  "Admin",
  adminSchema
);

export { Admin };

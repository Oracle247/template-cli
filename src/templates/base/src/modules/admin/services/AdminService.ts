import { AdminDocument, IAdmin } from "../interface/Admin";
// import Role from "../../role/models/Role.model";
import { Status } from "../../../interfaces/constants";
import { ActivityService } from "../../adminActivity/services/Activity.service";
import { generatePagination } from "../../../core/utils/paginate";
import Activity from "../../adminActivity/models/Activity.model";
import { Admin } from "../models";



class AdminService {
  async getAdmin(
    id: string,
  ): Promise<AdminDocument | null> {
    try {
      const admin = await Admin.findById(id);

      return admin;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch Admin');
    }
  }

  async createAdmin(payload: Partial<IAdmin>, adminId: AdminDocument["_id"]): Promise<AdminDocument> {
    try {
      payload.email = payload.email.toLowerCase()

      const existingEmail = await Admin.findOne({ email: payload.email })

      const existingPhoneNumber = await Admin.findOne({ phoneNumber: payload.phoneNumber })

      if (existingEmail) {
        throw new Error('Oops, Email already exists')
      }

      if (existingPhoneNumber) {
        throw new Error('Oops, Phone number already exists')
      }

      const admin = await Admin.create({
        ...payload,
        status: Status.ACTIVE
      });

      await (new ActivityService).createActivity({
        admin: adminId,
        type: "Create New Admin"
      })

      return admin;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch Admin');
    }
  }

  async getAllAdmins({
    limit = "10",
    page = "1",
    search,
  }: {
    limit?: string;
    page?: string;
    search?: string;
  }) {
    try {
      let query = {};

      // Search
      const searchQuery = search
        ? { username: { $regex: new RegExp(search, "i") } }
        : {};

      query = {
        ...query,
        ...searchQuery,
      };
      const total = await Admin.countDocuments(query);
      const pagination = generatePagination({
        limit,
        total,
        page,
      });
      const result = await Admin
        .find(query)
        .skip(pagination.skip)
        .limit(pagination.limit);

      return {
        results: result,
        pagination,
      };
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch Activities');
    }
  }

  async getAdminById(
    id: string,
    eagerLoad = true,
    load?: string
  ): Promise<AdminDocument> {
    const data = eagerLoad
      ? await Admin.findById(id).populate(load)
      : Admin.findById(id);
    if (!data) throw new Error(`Admin with id: ${id} does not exist`);
    return data;
  }

  async updateAdminById(
    id: string,
    payload: Partial<IAdmin>,
    adminId: AdminDocument["_id"]
  ): Promise<AdminDocument> {
    try {
      const admin = await this.getAdminById(id);

      if (!admin) {
        throw new Error(`Oops!, Admin does not exist`);
      }

      // let newPayload;
      // if (payload.role) {
      //   const role = await Role.findOne({ title: payload.role });
      //   if (!role) {
      //     throw new Error('Role not found');
      //   }

      //   newPayload = {
      //     ...payload,
      //     role: role._id
      //   }
      // }


      // newPayload = {
      //   ...payload
      // }

      Object.assign(admin, payload);

      await admin.save()

      await (new ActivityService).createActivity({
        admin: adminId,
        type: "Create New Admin"
      })

      return admin;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch Admin');
    }

  }

  async deleteAdminById(id: string, adminId: AdminDocument["_id"]): Promise<AdminDocument> {
    try {
      const data = await this.getAdminById(id);
      if (!data) {
        throw new Error(`Oops!, Admin does not exist`);
      }
      const deleteData = await Admin.findByIdAndDelete(id);

      await (new ActivityService).createActivity({
        admin: adminId,
        type: "Create New Admin"
      })

      return deleteData;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch Admin');
    }
  }
}

export { AdminService }

import Activity from "../models/Activity.model";
import { ActivityDocument, IActivity } from "../interface/Activity.interface";
import { AdminDocument } from "../../admin/interface/Admin";
import { generatePagination } from "../../../core/utils/paginate";


export class ActivityService {
  async getActivity(
    id: string,
  ): Promise<ActivityDocument | null> {
    try {
      const activity = (await Activity.findById(id)).populate({
        path: "admin",
        select: "full_name",
        populate: {
          path: "role",
          select: "title"
        }
      })

      return activity;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch Activity');
    }
  }

  async createActivity(payload: Partial<IActivity>): Promise<ActivityDocument> {
    try {
      const activity = await Activity.create({
        ...payload
      });

      return activity;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch Activity');
    }
  }

  async getAllActivities({
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
      const total = await Activity.countDocuments(query);
      const pagination = generatePagination({
        limit,
        total,
        page,
      });
      const storefronts = await Activity
        .find(query)
        .populate({
          path: "admin",
          select: "fullname",
          populate: {
            path: "role",
            select: "title"
          }
        })
        .skip(pagination.skip)
        .limit(pagination.limit);

      return {
        results: storefronts,
        pagination,
      };
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch Activities');
    }
  }

  async getActivityById(
    id: string,
    eagerLoad = true,
    load?: string
  ): Promise<ActivityDocument> {
    const data = eagerLoad
      ? await Activity.findById(id).populate(load)
      : Activity.findById(id);
    if (!data) throw new Error(`Activity with id: ${id} does not exist`);
    return data;
  }

  async updateActivityById(
    id: string,
    payload: Partial<IActivity>
  ): Promise<ActivityDocument> {
    try {
      const activity = await this.getActivityById(id);
      if (!activity) {
        throw new Error(`Oops!, Activity does not exist`);
      }

      Object.assign(activity, payload);

      await activity.save()
      return activity;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch Activity');
    }

  }

  async deleteActivityById(id: string, admin: AdminDocument['_id']): Promise<ActivityDocument> {
    try {
      const data = await this.getActivityById(id);
      if (!data) {
        throw new Error(`Oops!, Activity does not exist`);
      }
      const deleteData = await Activity.findByIdAndDelete(id);

      await this.createActivity({
        admin: admin,
        type: "Delete Activity"
      })
      return deleteData;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch Activity');
    }
  }

}

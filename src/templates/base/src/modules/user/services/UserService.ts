
import { IUser, UserDocument } from '../interfaces/UserInterface';
import { Status } from '../../../interfaces/constants';
import { generatePagination } from '../../../core/utils/paginate';
import { User } from '../models';


class UserService {
  async getUser(
    id: string,
  ): Promise<UserDocument | null> {
    try {
      const user = await User.findById(id);

      return user;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch User');
    }
  }

  async createUser(payload: Partial<IUser>): Promise<UserDocument> {
    try {
      payload.email = payload.email.toLowerCase()

      const existingEmail = await User.findOne({ email: payload.email })

      const existingPhoneNumber = await User.findOne({ phoneNumber: payload.phoneNumber })

      if (existingEmail) {
        throw new Error('Oops, Email already exists')
      }

      if (existingPhoneNumber) {
        throw new Error('Oops, Phone number already exists')
      }

      const user = await User.create({
        ...payload,
        status: Status.ACTIVE
      });

      return user;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch User');
    }
  }

  async getAllUsers({
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
      const total = await User.countDocuments(query);
      const pagination = generatePagination({
        limit,
        total,
        page,
      });
      const result = await User
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

  async getUserById(
    id: string,
    eagerLoad = true,
    load?: string
  ): Promise<UserDocument> {
    const data = eagerLoad
      ? await User.findById(id).populate(load)
      : User.findById(id);
    if (!data) throw new Error(`User with id: ${id} does not exist`);
    return data;
  }

  async updateUserById(
    id: string,
    payload: Partial<IUser>
  ): Promise<UserDocument> {
    try {
      const user = await this.getUserById(id);

      if (!user) {
        throw new Error(`Oops!, User does not exist`);
      }

      Object.assign(user, payload);

      await user.save()

      return user;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch User');
    }

  }

  async deleteUserById(id: string): Promise<UserDocument> {
    try {
      const data = await this.getUserById(id);
      if (!data) {
        throw new Error(`Oops!, User does not exist`);
      }
      const deleteData = await User.findByIdAndDelete(id);

      return deleteData;
    } catch (err: any) {
      console.error(err)
      throw new Error('Failed to fetch User');
    }
  }
}

export { UserService }

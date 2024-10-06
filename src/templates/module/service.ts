//@ts-nocheck
import { I__MODULE__, __MODULE__Document } from '../interfaces';
import { Status } from '../../../interfaces/constants';
import { generatePagination } from '../../../core/utils/paginate';
import { __MODULE__ } from '../models';
import { AppError } from '../../../core/exceptions';
import { StatusCodes } from 'http-status-codes';


class __MODULE__Service {
    async get__MODULE__(
        id: string,
    ): Promise<__MODULE__Document | null> {
        return await __MODULE__.findById(id);
    }

    async create__MODULE__(payload: Partial<I__MODULE__>): Promise<__MODULE__Document> {
        const existing__MODULE__ = await __MODULE__.findOne({ title: payload.title });

        if (existing__MODULE__) {
            throw new AppError("__MODULE__ with the same name already exists.", 400);
        }

        const __module__Post = await __MODULE__.create({
            ...payload,
            status: Status.ACTIVE,
        });

        return __module__Post;
    }

    async getAll__MODULE__s({
        limit = "10",
        page = "1",
        search,
    }: {
        limit?: string;
        page?: string;
        search?: string;
    }) {
        const limitNum = parseInt(limit, 10);
        const pageNum = parseInt(page, 10);

        const query = search ? { username: { $regex: new RegExp(search, "i") } } : {};

        const total = await __MODULE__.countDocuments(query);

        const pagination = generatePagination({
            limit: limitNum,
            total,
            page: pageNum,
        });

        const __module__Posts = await __MODULE__.find(query)
            .skip(pagination.skip)
            .limit(pagination.limit);

        return {
            results: __module__Posts,
            pagination,
        };
    }

    async get__MODULE__ById(
        id: string,
        eagerLoad = true,
        load?: string
    ): Promise<__MODULE__Document> {
        const data = eagerLoad
            ? await __MODULE__.findById(id).populate(load)
            : __MODULE__.findById(id);
        if (!data) throw new AppError(`__MODULE__ with id: ${id} does not exist`, StatusCodes.BAD_REQUEST);
        return data;
    }

    async update__MODULE__ById(
        id: string,
        payload: Partial<I__MODULE__>
    ): Promise<__MODULE__Document> {
        const user = await this.get__MODULE__ById(id);

        if (!user) {
            throw new AppError(`Oops!, __MODULE__ does not exist`, StatusCodes.BAD_REQUEST);
        }

        Object.assign(user, payload);

        await user.save()

        return user;
    }

    async delete__MODULE__ById(id: string): Promise<__MODULE__Document> {
        const data = await this.get__MODULE__ById(id);
        if (!data) {
            throw new AppError(`Oops!, __MODULE__ does not exist`, StatusCodes.BAD_REQUEST);
        }
        const deleteData = await __MODULE__.findByIdAndDelete(id);

        return deleteData;
    }
}

export { __MODULE__Service }

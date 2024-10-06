import { Request } from "express";
import { Document, FilterQuery } from "mongoose";

interface CustomPaginationOptions {
  page?: number;
  limit?: number;
  sort?: any;
  filter?: object;
  select?: string | string[];
  populate?: string | object;
  allowDiskUse?: boolean;
}

const paginate = async (
  model: any,
  query: FilterQuery<Document>,
  req: Request,
  populateOptions?: CustomPaginationOptions["populate"],
  exclude?: FilterQuery<Document>,
  forceLimit?: number,
) => {
  const options: CustomPaginationOptions = {
    page: Number(req.query.page || 0),
    limit: Number(req.query.limit || 10),
    populate: populateOptions || undefined,
    sort: "createdAt",
  };
  const page = parseInt(String(options.page), 10) || 1;
  const limit = parseInt(String(options.limit), 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  console.log("Paginating!!!", { query, exclude });
  const qq = model.find(query, exclude || {});
  const total = await (forceLimit ? qq.limit(forceLimit) : qq).countDocuments();
  const totalPages = Math.ceil(total / limit);

  let modelResponse = model.find(query);

  if (limit !== 0) {
    modelResponse = modelResponse.skip(startIndex).limit(limit);
  }

  if (options.populate) {
    modelResponse = modelResponse.populate(options.populate);
  }

  if (options.sort) {
    const sortBy = options.sort.split(",").join("");
    const sortObjs: any = {};
    sortBy.split(",").map((d: any) => (sortObjs[d] = -1));

    modelResponse = modelResponse.sort(sortObjs);
  }

  if (options.select) {
    modelResponse = modelResponse.select(options.select);
  }

  if (options.filter) {
    modelResponse = modelResponse.filter(options.filter);
  }

  if (options.allowDiskUse) {
    modelResponse = modelResponse.allowDiskUse(options.allowDiskUse);
  }

  console.log("Leaning!!!");
  const results = await modelResponse.lean();

  // Pagination result
  const pagination = { next: {}, prev: {} };

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  return {
    total,
    page,
    limit,
    totalPages,
    results,
    pagination,
  };
};

export { paginate };
export interface Pagination {
  limit: number;
  total: number;
  page: number;
  skip: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const generatePagination = ({
  limit = 10,
  total = 0,
  page = 1,
}: {
  limit: number | string;
  total: number | string;
  page: number | string;
}): Pagination => {
  const parsedPage = Number.parseInt(page.toString()) || 1;
  const parsedLimit = Number.parseInt(limit.toString()) || 10;
  const parsedTotal = Number.parseInt(total.toString()) || 0;

  const totalPages = Math.max(Math.ceil(parsedTotal / parsedLimit), 1);
  const currentPage = Math.min(Math.max(1, parsedPage), totalPages);
  console.log({ page, limit, total, currentPage, totalPages });
  const skip = Math.abs((currentPage - 1) * parsedLimit);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    limit: parsedLimit,
    total: parsedTotal,
    page: currentPage,
    skip,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

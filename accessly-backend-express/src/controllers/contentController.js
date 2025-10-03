import { Op } from "sequelize";
import { Content } from "../database/models/index.js";
import { success, error } from "../utils/response.js";
import { buildPagination } from "../utils/pagination.js";

export const getContent = async (req, res) => {
  try {
    const { page, limit, offset, search, filterBy, filterValue } = req.pagination;

    // Build where clause
    const where = {};

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    if (filterBy && filterValue) {
      where[filterBy] = filterValue;
    }

    const { count, rows } = await Content.findAndCountAll({
      where,
      offset,
      limit
    });

    return success(res, "Contents retrieved", {
      contents: rows,
      pagination: buildPagination(count, { page, limit }),
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getContentById = async (req, res) => {
  try {
    const Content = await Content.findByPk(req.params.id);
    if (!Content) return error(res, "Content not found", 404);
    return success(res, "Content retrieved", Content);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const createContent = async (req, res) => {
  try {
    const { type } = req.body;
    const Content = await Content.create({ type });
    return success(res, "Content created", Content);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateContent = async (req, res) => {
  try {
    const { type } = req.body;
    const Content = await Content.findByPk(req.params.id);
    if (!Content) return error(res, "Content not found", 404);

    Content.type = type || Content.type;
    await Content.save();

    return success(res, "Content updated", Content);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteContent = async (req, res) => {
  try {
    const Content = await Content.findByPk(req.params.id);
    if (!Content) return error(res, "Content not found", 404);

    await Content.destroy();
    return success(res, "Content deleted");
  } catch (err) {
    return error(res, err.message, 500);
  }
};
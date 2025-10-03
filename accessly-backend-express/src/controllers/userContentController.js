import { Op } from "sequelize";
import { Content, User, Membership } from "../database/models/index.js";
import { success, error } from "../utils/response.js";
import { buildPagination } from "../utils/pagination.js";

export const getUserContents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit, offset, search, filterBy, filterValue } = req.pagination;

    const user = await User.findByPk(userId, {
      include: [{ model: Membership, as: "memberships" }],
    });

    if (!user || !user.memberships ) {
      return error(res, "User has no membership", 403);
    }

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
      include: [
        {
          model: Membership,
          as: "memberships",
          where: { id: user.memberships.id },
          through: { attributes: [] },
        },
      ],
      order: [["id", "DESC"]],
      offset,
      limit,
      distinct: true,
    });

    return success(res, "Content loaded", {
      contents: rows,
      pagination: buildPagination(count, { page, limit }),
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

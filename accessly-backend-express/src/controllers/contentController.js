import { Content, User, Membership } from '../database/models/index.js';
import { success, error } from '../utils/response.js';

export const getContent = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [{ model: Membership, as: 'membership' }],
    });

    if (!user || !user.membership) {
      return error(res, "User has no membership", 403);
    }

    const contents = await Content.findAll({
      include: [
        {
          model: Membership,
          where: { id: user.membership.id },
          through: { attributes: [] }, 
        },
      ],
      order: [["id", "DESC"]],
    });

    return success(res, "Content loaded", { contents });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
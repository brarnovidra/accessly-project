import { Membership } from '../database/models/index.js';
import { success, error } from "../utils/response.js";

export const getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.findAll();
    return success(res, "Memberships retrieved", memberships);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getMembershipById = async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id);
    if (!membership) return error(res, "Membership not found", 404);
    return success(res, "Membership retrieved", membership);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const createMembership = async (req, res) => {
  try {
    const { type } = req.body;
    const membership = await Membership.create({ type });
    return success(res, "Membership created", membership);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateMembership = async (req, res) => {
  try {
    const { type } = req.body;
    const membership = await Membership.findByPk(req.params.id);
    if (!membership) return error(res, "Membership not found", 404);

    membership.type = type || membership.type;
    await membership.save();

    return success(res, "Membership updated", membership);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id);
    if (!membership) return error(res, "Membership not found", 404);

    await membership.destroy();
    return success(res, "Membership deleted");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

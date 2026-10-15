import { getUserPerformance } from '../services/performance.service.js';

export const getPerformance = async (req, res, next) => {
  try {
    const performance = await getUserPerformance(req.user._id);

    return res.json({
      success: true,
      data: performance,
    });
  } catch (error) {
    next(error);
  }
};
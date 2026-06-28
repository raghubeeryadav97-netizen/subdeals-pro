import Order from '../models/Order.js';
import User from '../models/User.js';
import Plan from '../models/Plan.js';
import Review from '../models/Review.js';
import SupportTicket from '../models/SupportTicket.js';

export const getDashboardStats = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));

  const [
    totalOrders, pendingOrders, completedOrders, totalCustomers, totalPlans, pendingReviews,
    openTickets, monthlyRevenue, dailyRevenue, totalRevenue, expiringSoon,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'pending' }),
    Order.countDocuments({ orderStatus: 'completed' }),
    User.countDocuments({ role: 'customer' }),
    Plan.countDocuments({ status: 'active' }),
    Review.countDocuments({ status: 'pending' }),
    SupportTicket.countDocuments({ status: 'open' }),
    Order.aggregate([{ $match: { orderStatus: 'completed', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$finalPrice' } } }]),
    Order.aggregate([{ $match: { orderStatus: 'completed', createdAt: { $gte: startOfDay } } }, { $group: { _id: null, total: { $sum: '$finalPrice' } } }]),
    Order.aggregate([{ $match: { orderStatus: 'completed' } }, { $group: { _id: null, total: { $sum: '$finalPrice' } } }]),
    Order.countDocuments({ orderStatus: 'completed', expiryDate: { $gte: now, $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }),
  ]);

  res.json({
    success: true,
    stats: {
      totalOrders, pendingOrders, completedOrders, totalCustomers, totalPlans, pendingReviews, openTickets, expiringSoon,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      dailyRevenue: dailyRevenue[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
  });
};

export const getAnalytics = async (req, res) => {
  const { period = 'monthly' } = req.query;
  let groupBy;
  if (period === 'daily') groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
  else if (period === 'yearly') groupBy = { $dateToString: { format: '%Y', date: '$createdAt' } };
  else groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

  const [revenue, orders, topPlans, aiSales, entertainmentSales, customerGrowth, couponUsage] = await Promise.all([
    Order.aggregate([{ $match: { orderStatus: 'completed' } }, { $group: { _id: groupBy, revenue: { $sum: '$finalPrice' }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Order.aggregate([{ $group: { _id: groupBy, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Order.aggregate([{ $match: { orderStatus: 'completed' } }, { $group: { _id: '$planName', sales: { $sum: 1 }, revenue: { $sum: '$finalPrice' } } }, { $sort: { sales: -1 } }, { $limit: 10 }]),
    Order.aggregate([{ $match: { orderStatus: 'completed' } }, { $lookup: { from: 'plans', localField: 'plan', foreignField: '_id', as: 'planData' } }, { $unwind: '$planData' }, { $match: { 'planData.type': 'ai' } }, { $group: { _id: null, total: { $sum: '$finalPrice' }, count: { $sum: 1 } } }]),
    Order.aggregate([{ $match: { orderStatus: 'completed' } }, { $lookup: { from: 'plans', localField: 'plan', foreignField: '_id', as: 'planData' } }, { $unwind: '$planData' }, { $match: { 'planData.type': 'entertainment' } }, { $group: { _id: null, total: { $sum: '$finalPrice' }, count: { $sum: 1 } } }]),
    User.aggregate([{ $match: { role: 'customer' } }, { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Order.aggregate([{ $match: { couponCode: { $ne: '' } } }, { $group: { _id: '$couponCode', usage: { $sum: 1 }, discount: { $sum: '$discountAmount' } } }]),
  ]);

  const completedOrders = await Order.countDocuments({ orderStatus: 'completed' });
  const renewedOrders = await Order.countDocuments({ orderStatus: 'completed', renewalCount: { $gt: 0 } });
  const avgOrder = await Order.aggregate([{ $match: { orderStatus: 'completed' } }, { $group: { _id: null, avg: { $avg: '$finalPrice' } } }]);

  res.json({
    success: true,
    analytics: {
      revenue, orders, topPlans,
      aiSales: aiSales[0] || { total: 0, count: 0 },
      entertainmentSales: entertainmentSales[0] || { total: 0, count: 0 },
      customerGrowth, couponUsage,
      renewalRate: completedOrders ? Math.round((renewedOrders / completedOrders) * 100) : 0,
      averageOrderValue: Math.round(avgOrder[0]?.avg || 0),
    },
  });
};
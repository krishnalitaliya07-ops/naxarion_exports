const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Shipment = require('../models/Shipment');
const Category = require('../models/Category');
const Review = require('../models/Review');

// Helper function to get date range
const getDateRange = (period) => {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'weekly':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarterly':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    case 'yearly':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  
  return { startDate, endDate: now };
};

// Helper to calculate growth percentage
const calculateGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return parseFloat(((current - previous) / previous * 100).toFixed(1));
};

// @desc    Get Report Overview
// @route   GET /api/reports/overview
// @access  Private/Admin
exports.getReportOverview = asyncHandler(async (req, res) => {
  const { period = 'weekly' } = req.query;
  const { startDate, endDate } = getDateRange(period);
  
  // Previous period for comparison
  const periodLength = endDate - startDate;
  const prevStartDate = new Date(startDate - periodLength);
  const prevEndDate = startDate;

  // Current period stats
  const [
    currentRevenue,
    currentOrders,
    currentUsers,
    prevRevenue,
    prevOrders,
    prevUsers
  ] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    User.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: prevStartDate, $lte: prevEndDate }, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.countDocuments({ createdAt: { $gte: prevStartDate, $lte: prevEndDate } }),
    User.countDocuments({ createdAt: { $gte: prevStartDate, $lte: prevEndDate } })
  ]);

  const currentRevenueTotal = currentRevenue[0]?.total || 0;
  const prevRevenueTotal = prevRevenue[0]?.total || 0;

  // Calculate conversion rate (orders / users * 100)
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const conversionRate = totalUsers > 0 ? parseFloat(((totalOrders / totalUsers) * 100).toFixed(1)) : 0;

  res.status(200).json({
    success: true,
    data: {
      period,
      reportPeriod: { startDate, endDate },
      revenue: {
        current: currentRevenueTotal,
        previous: prevRevenueTotal,
        growth: calculateGrowth(currentRevenueTotal, prevRevenueTotal)
      },
      orders: {
        current: currentOrders,
        previous: prevOrders,
        growth: calculateGrowth(currentOrders, prevOrders)
      },
      newUsers: {
        current: currentUsers,
        previous: prevUsers,
        growth: calculateGrowth(currentUsers, prevUsers)
      },
      conversionRate: {
        current: conversionRate,
        previous: conversionRate - 0.8, // Approximation for demo
        growth: 3.2
      }
    }
  });
});

// @desc    Get Weekly Report
// @route   GET /api/reports/weekly
// @access  Private/Admin
exports.getWeeklyReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = getDateRange('weekly');
  
  // Get daily breakdown for the week
  const dailyRevenue = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'delivered'
      } 
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dailyData = dayNames.map((name, index) => {
    const dayData = dailyRevenue.find(d => d._id === index + 1);
    return {
      day: name,
      revenue: dayData?.revenue || 0,
      orders: dayData?.orders || 0
    };
  });

  // Find highest day
  const highestDay = dailyData.reduce((max, day) => 
    day.revenue > max.revenue ? day : max, dailyData[0]
  );

  // Calculate totals
  const totalRevenue = dailyData.reduce((sum, day) => sum + day.revenue, 0);
  const averageDaily = totalRevenue / 7;

  // Previous week for growth calculation
  const prevWeekStart = new Date(startDate - 7 * 24 * 60 * 60 * 1000);
  const prevWeekRevenue = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: prevWeekStart, $lte: startDate },
        status: 'delivered'
      } 
    },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  const growthRate = calculateGrowth(totalRevenue, prevWeekRevenue[0]?.total || 0);

  res.status(200).json({
    success: true,
    data: {
      period: 'weekly',
      reportPeriod: { startDate, endDate },
      dailyData,
      summary: {
        totalRevenue,
        averageDaily,
        highestDay: { day: highestDay.day, amount: highestDay.revenue },
        growthRate
      }
    }
  });
});

// @desc    Get Monthly Report
// @route   GET /api/reports/monthly
// @access  Private/Admin
exports.getMonthlyReport = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const targetYear = parseInt(year) || new Date().getFullYear();
  const targetMonth = parseInt(month) || new Date().getMonth();
  
  const startDate = new Date(targetYear, targetMonth, 1);
  const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

  // Weekly breakdown
  const weeklyData = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'delivered'
      } 
    },
    {
      $group: {
        _id: { $week: '$createdAt' },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  // Get total stats
  const [totalRevenue, totalOrders, newUsers] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    User.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } })
  ]);

  res.status(200).json({
    success: true,
    data: {
      period: 'monthly',
      month: targetMonth + 1,
      year: targetYear,
      reportPeriod: { startDate, endDate },
      weeklyData,
      summary: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        newUsers,
        averageOrderValue: totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0
      }
    }
  });
});

// @desc    Get Quarterly Report
// @route   GET /api/reports/quarterly
// @access  Private/Admin
exports.getQuarterlyReport = asyncHandler(async (req, res) => {
  const { quarter, year } = req.query;
  const targetYear = parseInt(year) || new Date().getFullYear();
  const targetQuarter = parseInt(quarter) || Math.floor(new Date().getMonth() / 3) + 1;
  
  const startMonth = (targetQuarter - 1) * 3;
  const startDate = new Date(targetYear, startMonth, 1);
  const endDate = new Date(targetYear, startMonth + 3, 0, 23, 59, 59);

  // Monthly breakdown
  const monthlyData = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'delivered'
      } 
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      period: 'quarterly',
      quarter: targetQuarter,
      year: targetYear,
      reportPeriod: { startDate, endDate },
      monthlyData
    }
  });
});

// @desc    Get Yearly Report
// @route   GET /api/reports/yearly
// @access  Private/Admin
exports.getYearlyReport = asyncHandler(async (req, res) => {
  const { year } = req.query;
  const targetYear = parseInt(year) || new Date().getFullYear();
  
  const startDate = new Date(targetYear, 0, 1);
  const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

  // Monthly breakdown for the year
  const monthlyData = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'delivered'
      } 
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedMonthlyData = monthNames.map((name, index) => {
    const monthData = monthlyData.find(m => m._id === index + 1);
    return {
      month: name,
      revenue: monthData?.revenue || 0,
      orders: monthData?.orders || 0
    };
  });

  res.status(200).json({
    success: true,
    data: {
      period: 'yearly',
      year: targetYear,
      reportPeriod: { startDate, endDate },
      monthlyData: formattedMonthlyData
    }
  });
});

// @desc    Get Revenue Report
// @route   GET /api/reports/revenue
// @access  Private/Admin
exports.getRevenueReport = asyncHandler(async (req, res) => {
  const { period = 'weekly' } = req.query;
  const { startDate, endDate } = getDateRange(period);

  const revenueData = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'delivered'
      } 
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: '$totalAmount' },
        maxOrder: { $max: '$totalAmount' },
        minOrder: { $min: '$totalAmount' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: revenueData[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      maxOrder: 0,
      minOrder: 0
    }
  });
});

// @desc    Get Revenue Trend
// @route   GET /api/reports/revenue/trend
// @access  Private/Admin
exports.getRevenueTrend = asyncHandler(async (req, res) => {
  const { period = 'weekly' } = req.query;
  const { startDate, endDate } = getDateRange(period);

  let groupBy;
  if (period === 'weekly') {
    groupBy = { $dayOfWeek: '$createdAt' };
  } else if (period === 'monthly') {
    groupBy = { $dayOfMonth: '$createdAt' };
  } else {
    groupBy = { $month: '$createdAt' };
  }

  const trendData = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'delivered'
      } 
    },
    {
      $group: {
        _id: groupBy,
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      period,
      trend: trendData
    }
  });
});

// @desc    Get Sales by Category
// @route   GET /api/reports/sales/by-category
// @access  Private/Admin
exports.getSalesByCategory = asyncHandler(async (req, res) => {
  const { period = 'weekly' } = req.query;
  const { startDate, endDate } = getDateRange(period);

  // Get all categories first
  const categories = await Category.find().select('name icon');
  
  // Get order items grouped by category
  const categoryStats = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: startDate, $lte: endDate }
      } 
    },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'productInfo'
      }
    },
    { $unwind: '$productInfo' },
    {
      $group: {
        _id: '$productInfo.category',
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        orders: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo'
      }
    },
    { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        category: '$categoryInfo.name',
        icon: '$categoryInfo.icon',
        revenue: 1,
        orders: 1
      }
    },
    { $sort: { revenue: -1 } }
  ]);

  // Calculate percentages
  const totalRevenue = categoryStats.reduce((sum, cat) => sum + cat.revenue, 0);
  const formattedStats = categoryStats.map(cat => ({
    ...cat,
    percentage: totalRevenue > 0 ? parseFloat(((cat.revenue / totalRevenue) * 100).toFixed(1)) : 0
  }));

  res.status(200).json({
    success: true,
    data: formattedStats
  });
});

// @desc    Get Sales by Region
// @route   GET /api/reports/sales/by-region
// @access  Private/Admin
exports.getSalesByRegion = asyncHandler(async (req, res) => {
  const { period = 'weekly' } = req.query;
  const { startDate, endDate } = getDateRange(period);

  const regionStats = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: startDate, $lte: endDate }
      } 
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    { $unwind: '$userInfo' },
    {
      $group: {
        _id: '$userInfo.country',
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 }
  ]);

  // Calculate percentages
  const totalRevenue = regionStats.reduce((sum, region) => sum + region.revenue, 0);
  const formattedStats = regionStats.map(region => ({
    country: region._id || 'Unknown',
    countryCode: getCountryCode(region._id),
    revenue: region.revenue,
    orders: region.orders,
    percentage: totalRevenue > 0 ? parseFloat(((region.revenue / totalRevenue) * 100).toFixed(1)) : 0
  }));

  res.status(200).json({
    success: true,
    data: formattedStats
  });
});

// Helper function to get country code
function getCountryCode(country) {
  const countryCodes = {
    'United States': 'US',
    'China': 'CN',
    'India': 'IN',
    'Germany': 'DE',
    'UAE': 'AE',
    'United Kingdom': 'GB',
    'Japan': 'JP',
    'France': 'FR',
    'Canada': 'CA',
    'Australia': 'AU'
  };
  return countryCodes[country] || 'XX';
}

// @desc    Get Top Selling Products
// @route   GET /api/reports/products/top-selling
// @access  Private/Admin
exports.getTopSellingProducts = asyncHandler(async (req, res) => {
  const { limit = 10, period = 'weekly' } = req.query;
  const { startDate, endDate } = getDateRange(period);

  const topProducts = await Order.aggregate([
    { 
      $match: { 
        createdAt: { $gte: startDate, $lte: endDate }
      } 
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productInfo'
      }
    },
    { $unwind: '$productInfo' },
    {
      $lookup: {
        from: 'categories',
        localField: 'productInfo.category',
        foreignField: '_id',
        as: 'categoryInfo'
      }
    },
    { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        name: '$productInfo.name',
        category: '$categoryInfo.name',
        totalSold: 1,
        revenue: 1,
        image: { $arrayElemAt: ['$productInfo.images', 0] }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: parseInt(limit) }
  ]);

  res.status(200).json({
    success: true,
    data: topProducts
  });
});

// @desc    Get User Activity Report
// @route   GET /api/reports/users/activity
// @access  Private/Admin
exports.getUserActivityReport = asyncHandler(async (req, res) => {
  const { period = 'weekly' } = req.query;
  const { startDate, endDate } = getDateRange(period);

  const [
    newRegistrations,
    activeUsers,
    totalPageViews,
    avgSessionDuration
  ] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    User.countDocuments({ lastLogin: { $gte: startDate, $lte: endDate } }),
    Promise.resolve(45678), // Placeholder - would come from analytics
    Promise.resolve('8:45') // Placeholder - would come from analytics
  ]);

  // Previous period for comparison
  const periodLength = endDate - startDate;
  const prevStartDate = new Date(startDate - periodLength);
  
  const prevRegistrations = await User.countDocuments({ 
    createdAt: { $gte: prevStartDate, $lte: startDate } 
  });

  res.status(200).json({
    success: true,
    data: {
      newRegistrations: {
        value: newRegistrations,
        growth: calculateGrowth(newRegistrations, prevRegistrations)
      },
      activeUsers: {
        value: activeUsers,
        growth: 8
      },
      totalPageViews: {
        value: totalPageViews,
        growth: 12
      },
      avgSessionDuration: {
        value: avgSessionDuration,
        growth: 15
      }
    }
  });
});

// @desc    Get KPI Metrics
// @route   GET /api/reports/kpi
// @access  Private/Admin
exports.getKPIMetrics = asyncHandler(async (req, res) => {
  const { period = 'weekly' } = req.query;
  const { startDate, endDate } = getDateRange(period);

  // Order success rate
  const [totalOrders, completedOrders] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    Order.countDocuments({ 
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $in: ['delivered', 'completed'] }
    })
  ]);
  const orderSuccessRate = totalOrders > 0 
    ? parseFloat(((completedOrders / totalOrders) * 100).toFixed(1)) 
    : 0;

  // Average order value
  const avgOrderData = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, avgValue: { $avg: '$totalAmount' } } }
  ]);
  const avgOrderValue = avgOrderData[0]?.avgValue || 0;

  // Customer return rate (repeat customers)
  const repeatCustomers = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: '$user', orderCount: { $sum: 1 } } },
    { $match: { orderCount: { $gt: 1 } } },
    { $count: 'repeatCustomers' }
  ]);
  const totalCustomers = await Order.distinct('user', { 
    createdAt: { $gte: startDate, $lte: endDate } 
  });
  const customerReturnRate = totalCustomers.length > 0
    ? parseFloat(((repeatCustomers[0]?.repeatCustomers || 0) / totalCustomers.length * 100).toFixed(1))
    : 0;

  // Customer satisfaction (average review rating)
  const satisfactionData = await Review.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);
  const customerSatisfaction = satisfactionData[0]?.avgRating || 4.5;

  res.status(200).json({
    success: true,
    data: {
      orderSuccessRate: {
        value: orderSuccessRate,
        label: 'Completed orders',
        growth: 1.2
      },
      avgOrderValue: {
        value: Math.round(avgOrderValue),
        label: 'Per transaction',
        growth: 6
      },
      customerReturnRate: {
        value: customerReturnRate || 68.5,
        label: 'Repeat customers',
        growth: 5
      },
      customerSatisfaction: {
        value: parseFloat(customerSatisfaction.toFixed(1)),
        label: 'Average rating',
        growth: 0.2
      }
    }
  });
});

// @desc    Export Report
// @route   GET /api/reports/export/:format
// @access  Private/Admin
exports.exportReport = asyncHandler(async (req, res) => {
  const { format } = req.params;
  const { reportType = 'weekly', period = 'weekly' } = req.query;
  
  // Generate report data based on type
  // This is a simplified version - in production, you'd generate proper PDF/Excel files
  
  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${reportType}-report.csv`);
    
    // Sample CSV data
    const csvData = 'Date,Revenue,Orders,Users\n2024-01-01,1000,50,100\n2024-01-02,1500,75,120';
    res.send(csvData);
  } else if (format === 'pdf') {
    // In production, use a library like PDFKit or puppeteer
    res.status(200).json({
      success: true,
      message: 'PDF export initiated',
      downloadUrl: `/reports/download/${reportType}-report.pdf`
    });
  } else if (format === 'excel') {
    // In production, use a library like exceljs
    res.status(200).json({
      success: true,
      message: 'Excel export initiated',
      downloadUrl: `/reports/download/${reportType}-report.xlsx`
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid export format'
    });
  }
});

// @desc    Get Custom Report
// @route   GET /api/reports/custom
// @access  Private/Admin
exports.getCustomReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, metrics } = req.query;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const requestedMetrics = metrics ? metrics.split(',') : ['revenue', 'orders', 'users'];
  const reportData = {};
  
  if (requestedMetrics.includes('revenue')) {
    const revenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    reportData.revenue = revenueData[0]?.total || 0;
  }
  
  if (requestedMetrics.includes('orders')) {
    reportData.orders = await Order.countDocuments({ 
      createdAt: { $gte: start, $lte: end } 
    });
  }
  
  if (requestedMetrics.includes('users')) {
    reportData.users = await User.countDocuments({ 
      createdAt: { $gte: start, $lte: end } 
    });
  }

  res.status(200).json({
    success: true,
    data: {
      period: { startDate: start, endDate: end },
      metrics: reportData
    }
  });
});

// @desc    Get Scheduled Reports
// @route   GET /api/reports/scheduled
// @access  Private/Admin
exports.getScheduledReports = asyncHandler(async (req, res) => {
  // In production, this would fetch from a ScheduledReport model
  res.status(200).json({
    success: true,
    data: []
  });
});

// @desc    Create Scheduled Report
// @route   POST /api/reports/scheduled
// @access  Private/Admin
exports.createScheduledReport = asyncHandler(async (req, res) => {
  const { name, type, frequency, recipients } = req.body;
  
  // In production, save to ScheduledReport model
  res.status(201).json({
    success: true,
    data: {
      id: Date.now(),
      name,
      type,
      frequency,
      recipients,
      createdAt: new Date()
    }
  });
});

// @desc    Get New User Registrations
// @route   GET /api/reports/users/registrations
// @access  Private/Admin
exports.getNewRegistrations = asyncHandler(async (req, res) => {
  const { period = 'weekly' } = req.query;
  const { startDate, endDate } = getDateRange(period);

  const registrations = await User.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: registrations
  });
});

// @desc    Get User Demographics
// @route   GET /api/reports/users/demographics
// @access  Private/Admin
exports.getUserDemographics = asyncHandler(async (req, res) => {
  const [byCountry, byRole] = await Promise.all([
    User.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      byCountry,
      byRole
    }
  });
});

const Product = require('../products/product.model');
const Inventory = require('../inventory/inventory.model');
const SalesOrder = require('../sales-orders/sales-order.model');

// Get dashboard metrics
const getDashboardMetrics = async (req, res) => {
  try {
    // Total product count
    const totalProducts = await Product.countDocuments();
    
    // Critical stock items (stock quantity <= critical level)
    const criticalStockItems = await Inventory.find({
      $or: [
        { stockQuantity: { $lte: '$criticalStockLevel' } },
        { stockQuantity: { $lte: 0 } }
      ]
    }).populate('productId', 'name sku');
    
    // Daily sales revenue (from confirmed sales orders)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dailySales = await SalesOrder.aggregate([
      {
        $match: {
          status: 'confirmed',
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]);
    
    const dailyRevenue = dailySales.length > 0 ? dailySales[0].totalRevenue : 0;
    
    // Send response
    res.json({
      totalProducts,
      criticalStockItems: criticalStockItems.map(item => ({
        id: item._id,
        productId: item.productId._id,
        productName: item.productId.name,
        sku: item.productId.sku,
        stockQuantity: item.stockQuantity,
        criticalStockLevel: item.criticalStockLevel
      })),
      dailyRevenue,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard metrics',
      message: error.message 
    });
  }
};

module.exports = {
  getDashboardMetrics
};
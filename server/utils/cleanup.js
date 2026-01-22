const User = require('../models/User');

// Clean up unverified users older than 15 minutes
const cleanupUnverifiedUsers = async () => {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const result = await User.deleteMany({
      isEmailVerified: false,
      isActive: false,
      createdAt: { $lt: fifteenMinutesAgo }
    });
    
    if (result.deletedCount > 0) {
      console.log(`🗑️  Cleaned up ${result.deletedCount} unverified user(s)`);
    }
  } catch (error) {
    console.error('Cleanup job error:', error.message);
  }
};

// Run cleanup every 10 minutes
const startCleanupJob = () => {
  // Run immediately on start
  cleanupUnverifiedUsers();
  
  // Then run every 10 minutes
  setInterval(cleanupUnverifiedUsers, 10 * 60 * 1000);
  
  console.log('✅ Cleanup job started - will run every 10 minutes');
};

module.exports = { startCleanupJob, cleanupUnverifiedUsers };

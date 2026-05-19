import cron from 'node-cron';
import CustomerPlan from '../models/CustomerPlan';

export const startExpireCustomerPlansJob = () => {
  // Run every day at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Running expireCustomerPlans job...');
    try {
      const now = new Date();
      
      const result = await CustomerPlan.updateMany(
        {
          status: 'Active',
          expiresAt: { $lt: now }
        },
        {
          $set: { status: 'Expired' }
        }
      );
      
      console.log(`[CRON] Expired ${result.modifiedCount} customer plans.`);
    } catch (error) {
      console.error('[CRON] Error expiring customer plans:', error);
    }
  });
};

const cron = require('node-cron');
const Booking = require('../models/Booking');

const startCronJobs = () => {
  // Runs every day at 00:00 (Midnight)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running nightly cron job: Sweeping for expired bookings...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const result = await Booking.updateMany(
        {
          preferredDate: { $lt: today },
          status: { $in: ['Pending', 'Confirmed'] }
        },
        { $set: { status: 'Expired' } }
      );

      console.log(`Cron job complete. Expired ${result.modifiedCount} bookings.`);
    } catch (error) {
      console.error('CRON ERROR: Failed to update expired bookings:', error);
    }
  });
};

module.exports = startCronJobs;
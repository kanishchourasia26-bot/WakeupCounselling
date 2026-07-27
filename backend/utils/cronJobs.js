const cron = require('node-cron');
const Booking = require('../models/Booking');
const sendEmail = require('./sendEmail'); // Adjust this path if your email utility is elsewhere

const startCronJobs = () => {
  // ---------------------------------------------------------
  // JOB 1: Expire old pending bookings (Runs daily at Midnight)
  // ---------------------------------------------------------
  cron.schedule('0 0 * * *', async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const result = await Booking.updateMany(
        {
          status: 'Pending',
          preferredDate: { $lt: today }
        },
        {
          $set: { status: 'Expired' }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[Cron] Cleaned up ${result.modifiedCount} expired bookings.`);
      }
    } catch (error) {
      console.error('[Cron] Error updating expired bookings:', error);
    }
  });

  // ---------------------------------------------------------
  // JOB 2: 24-Hour Session Reminders (Runs daily at 8:00 AM)
  // ---------------------------------------------------------
  cron.schedule('0 8 * * *', async () => {
    try {
      // 1. Calculate exactly what "tomorrow" is
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // 2. Find all "Confirmed" bookings for tomorrow and populate user details
      const upcomingBookings = await Booking.find({
        status: 'Confirmed',
        preferredDate: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow
        }
      }).populate('user', 'fullName email');

      if (upcomingBookings.length === 0) {
        console.log('[Cron] No confirmed sessions for tomorrow. No reminders sent.');
        return;
      }

      console.log(`[Cron] Found ${upcomingBookings.length} sessions for tomorrow. Sending reminders...`);

      // 3. Loop through each booking and send emails
      for (const booking of upcomingBookings) {
        const sessionDate = new Date(booking.preferredDate).toLocaleDateString('en-IN', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        });
        const sessionTime = booking.preferredTime || 'your scheduled time';
        const clientName = booking.user.fullName.split(' ')[0]; // First name

        // --- EMAIL TO CLIENT ---
        const clientMessage = `
          <h3>Session Reminder</h3>
          <p>Hi ${clientName},</p>
          <p>This is a friendly reminder that you have a confirmed counseling session scheduled for tomorrow:</p>
          <ul>
            <li><strong>Date:</strong> ${sessionDate}</li>
            <li><strong>Time:</strong> ${sessionTime}</li>
            <li><strong>Booking ID:</strong> ${booking.bookingId}</li>
          </ul>
          <p>If you need to cancel or reschedule, please log into your dashboard as soon as possible.</p>
          <p>We look forward to seeing you!</p>
        `;

        await sendEmail({
          email: booking.user.email,
          subject: 'Reminder: Your Counseling Session is Tomorrow',
          message: clientMessage
        });

        // --- EMAIL TO ADMIN / COUNSELLOR ---
        const adminMessage = `
          <h3>Upcoming Session Alert</h3>
          <p>Hello Admin,</p>
          <p>This is an automated reminder that you have a confirmed session scheduled for tomorrow:</p>
          <ul>
            <li><strong>Client:</strong> ${booking.user.fullName} (${booking.user.email})</li>
            <li><strong>Date:</strong> ${sessionDate}</li>
            <li><strong>Time:</strong> ${sessionTime}</li>
            <li><strong>Booking ID:</strong> ${booking.bookingId}</li>
          </ul>
          <p>Please ensure you are prepared for this appointment.</p>
        `;

        await sendEmail({
          email: process.env.ADMIN_EMAIL, // Pulls the admin email from your .env
          subject: `Upcoming Session: ${booking.user.fullName} - ${sessionDate}`,
          message: adminMessage
        });
      }

      console.log('[Cron] Successfully sent all 24-hour reminders.');
    } catch (error) {
      console.error('[Cron] Error sending reminder emails:', error);
    }
  });

  console.log('Background Cron Jobs initialized.');
};

module.exports = startCronJobs;
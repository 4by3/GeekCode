const schedule = require('node-schedule');
const { CHANNEL_ID, VOICE_CHANNEL_ID } = require('../config/env');
const { deductPoints } = require('../utils/scoreManager');

// Schedule daily message
const startRule = new schedule.RecurrenceRule();
startRule.hour = 13;
startRule.minute = 30;
startRule.second = 0;
startRule.tz = 'Australia/Sydney';

// Schedule point deduction
const endRule = new schedule.RecurrenceRule();
endRule.hour = 15;
endRule.minute = 30;
endRule.second = 0;
endRule.tz = 'Australia/Sydney';

function setupSchedules(client, dailyMessageRef, lockedInUsers) {
    // Send daily message schedule
    schedule.scheduleJob(startRule, async () => {
        // Reset locked-in users
        lockedInUsers.clear();

        // Fetch IDs from env
        const channel = await client.channels.fetch(CHANNEL_ID).catch(error => {
            console.error('Error fetching channel:', error);
            return null;
        });
        const voice_channel = await client.channels.fetch(VOICE_CHANNEL_ID).catch(error => {
            console.error('Error fetching channel:', error);
            return null;
        });

        // Send new daily message
        if (channel) {
            try {
                dailyMessageRef.message = await channel.send({
                    content: `Join the voice channel <#${voice_channel}> before ${endRule.hour}:${endRule.minute.toString().padStart(2, '0')} to lock in.`,
                });
            } catch (error) {
                console.error('Error sending daily message:', error);
            }
        } else {
            console.error('Target channel not found. Please check the channel ID.');
        }
    });

    // Deduct points schedule
    schedule.scheduleJob(endRule, async () => {
        if (dailyMessageRef.message) {
            try {
                await dailyMessageRef.message.edit({
                    content: `Lock-in period has ended.`,
                });
                // Deduct points for users who didn't lock in
                deductPoints(lockedInUsers);
            } catch (error) {
                console.error('Error updating message or deducting points:', error);
            }
        }
    });
}

// Export the rules for use in other modules
module.exports = {
    setupSchedules,
    getRules: () => ({
        startTime: { hour: startRule.hour, minute: startRule.minute, second: startRule.second },
        endTime: { hour: endRule.hour, minute: endRule.minute, second: endRule.second },
        timezone: startRule.tz
    })
};

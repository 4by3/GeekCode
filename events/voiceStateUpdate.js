const { Events } = require('discord.js');
const { addPoint } = require('../utils/scoreManager');
const { getRules } = require('../utils/scheduleManager');
const { DateTime } = require('luxon');
const { VOICE_CHANNEL_ID } = require('../config/env');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState, dailyMessageRef, lockedInUsers) {
        if (newState.channelId === VOICE_CHANNEL_ID && oldState.channelId !== VOICE_CHANNEL_ID) {
            const userId = newState.id;
            const { startTime, endTime, timezone } = getRules();

            // Get current time in the specified timezone
            const now = DateTime.now().setZone(timezone);
            const currentTimeInSeconds = now.hour * 3600 + now.minute * 60 + now.second;

            // Convert rule times to seconds
            const startTimeInSeconds = startTime.hour * 3600 + startTime.minute * 60 + startTime.second;
            const endTimeInSeconds = endTime.hour * 3600 + endTime.minute * 60 + endTime.second;

            // Check if current time is within the lock-in window and user not locked in yet
            if (currentTimeInSeconds >= startTimeInSeconds && currentTimeInSeconds <= endTimeInSeconds && !lockedInUsers.has(userId)) {
                try {
                    lockedInUsers.add(userId);
                    addPoint(userId);
                    const textChannel = await newState.client.channels.fetch(dailyMessageRef.message?.channelId);
                    if (textChannel) {
                        await textChannel.send({ content: `<@${userId}> has locked in by joining the voice channel!` });
                    }
                } catch (error) {
                    console.error('Error handling voice state update:', error);
                    const textChannel = await newState.client.channels.fetch(dailyMessageRef.message?.channelId);
                    if (textChannel) {
                        await textChannel.send({ content: `<@${userId}>, there was an error processing your lock-in!`, ephemeral: true });
                    }
                }
            }
        }
    },
};
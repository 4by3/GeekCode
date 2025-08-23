const { Events } = require('discord.js');
const { setupSchedules } = require('../utils/scheduleManager');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client, dailyMessageRef, clickedUsers) {
        try {
            console.log(`Logged in as ${client.user.tag}!`);
            setupSchedules(client, dailyMessageRef, clickedUsers);
        }
        catch (error) {
            console.error('Failed to setup schedule', error);
        }
    },
};
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { DISCORD_TOKEN, PORT } = require('./config/env');

// // Webserver config for Render
const express = require('express')
const app = express()
const port = PORT || 4000 
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`GeekCode listening on port ${port}`)
})


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Store commands
client.commands = new Collection();

// Load commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Shared state for daily message and locked-in users
const dailyMessageRef = { message: null };
const lockedInUsers = new Set();

// Load event handlers
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const eventModule = require(filePath);

    // Handle default export (e.g., InteractionCreate)
    if (eventModule.name && eventModule.execute) {
        if (eventModule.once) {
            client.once(eventModule.name, (...args) => eventModule.execute(...args, dailyMessageRef, lockedInUsers));
        } else {
            client.on(eventModule.name, (...args) => eventModule.execute(...args, dailyMessageRef, lockedInUsers));
        }
    }
}

client.login(DISCORD_TOKEN);
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    CHANNEL_ID: process.env.CHANNEL_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    GUILD_ID: process.env.GUILD_ID,
    VOICE_CHANNEL_ID: process.env.VOICE_CHANNEL_ID,
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
};
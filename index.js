const { Client } = require('discord.js');

// Initializing client
const client = new Client({ intents: 32767 });
module.exports = client;

// Global Variables
client.config = require('./storage/config.json');
client.colors = require('./storage/colors.json');

// Initializing the project
require('./handler')(client);

// Error handling
process.on('unhandledRejection', (error) => {
  process.stdout.write(`${error}\n`);
});
process.on('uncaughtException', (error) => {
  process.stdout.write(`${error}\n`);
});
process.on('multipleResolves', (error) => {
  process.stdout.write(`${error}\n`);
});
process.on('exit', (error) => {
  process.stdout.write(`${error}\n`);
});

// Login to bot
client.login(client.config.token);

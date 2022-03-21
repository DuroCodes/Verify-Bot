const client = require('../index');

client.on('ready', () => {
  // Log that the bot is online
  process.stdout.write(`${client.user.tag} is online! ✅\n`);
});

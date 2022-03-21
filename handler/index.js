/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */

const { glob } = require('glob');
const { promisify } = require('util');

const globPromise = promisify(glob);
const mongoose = require('mongoose');

// Pterodactyl panel things
process.stdout.write('"done": "change this part"\n');
console.clear();

module.exports = async () => {
  // Events
  const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
  eventFiles.map((value) => require(value));

  // MongoDB
  const { mongooseConnectionString } = require('../storage/config.json');
  if (!mongooseConnectionString) return;

  mongoose.connect(mongooseConnectionString).then(() => {
    process.stdout.write('Connected to MongoDB ✅\n');
  }).catch((err) => process.stdout.write(`Error connecting to MongoDB: ${err}\n`));
};

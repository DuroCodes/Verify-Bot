/* eslint-disable consistent-return */
const { MessageEmbed, MessageAttachment } = require('discord.js');
const VerifiedUser = require('../schemas/verifiedUsers');
const client = require('../index');

const randomString = (length) => {
  let str = '';
  const range = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < length; i += 1) {
    str += range.charAt(Math.floor(Math.random() * range.length));
  }
  return str;
};

client.on('guildMemberAdd', async (member) => {
  const verifiedUser = await VerifiedUser.findOne({ userID: member.id, verified: true });
  if (verifiedUser) {
    const role = member.guild.roles.cache.find((r) => r.name === client.config.verifiedRole);
    member.roles.add(role);
  }
  if (!verifiedUser) {
    const captcha = randomString(6);
    const image = `https://cryptons-api.herokuapp.com/api/v1/captcha?code=${encodeURI(captcha)}`;
    const attachment = new MessageAttachment(image, 'captcha.png');

    const embed = new MessageEmbed()
      .setImage('attachment://captcha.png')
      .setTitle('Verify Yourself')
      .setDescription('Please type what you see in the captcha below. (There are only letters)')
      .setColor(client.colors.invisible);

    const msg = await member.user.send({
      files: [attachment],
      embeds: [embed],
    });

    const filter = (message) => {
      if (message.author.id !== member.id) return;
      if (message.content.toUpperCase() === captcha) return true;
      member.send('Incorrect Captcha.');
    };
    try {
      const response = await msg.channel.awaitMessages({
        filter,
        max: 1,
        time: 60000,
        errors: ['time'],
      });

      if (response) {
        const role = member.guild.roles.cache.find((r) => r.name === client.config.verifiedRole);
        member.roles.add(role);
        member.send({
          embeds: [
            new MessageEmbed()
              .setDescription(`${client.config.check} **Success:** You have been successfully verified.`)
              .setColor(client.colors.green),
          ],
        });
        const data = new VerifiedUser({
          userID: member.id,
          verified: true,
        });
        data.save();
      } else if (!response) {
        member.send({
          embeds: [
            new MessageEmbed()
              .setDescription(`${client.config.wrong} **Error:** Failed to complete captcha. Please rejoin and try again.`)
              .setColor(client.colors.red),
          ],
        });
        member.kick('Failed to complete captcha');
      }
    } catch (err) {
      member.send({
        embeds: [
          new MessageEmbed()
            .setDescription(`${client.config.wrong} **Error:** Failed to complete captcha. Please rejoin and try again.`)
            .setColor(client.colors.red),
        ],
      });
      member.kick('Failed to complete captcha');
      process.stderr.write(`Error: ${err}\n`);
    }
  }
});

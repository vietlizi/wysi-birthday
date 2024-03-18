const Discord = require('discord.js');
const client = new Discord.Client();

const PREFIX = '!';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  if (command === 'setbirthday' && message.channel.name === 'birthday') {
    const birthday = args.join(' ');
    if (!birthday) {
      return message.reply('Please provide your birthday in the format MM/DD.');
    }
    await db.saveBirthday(message.author.id, birthday);
    
    return message.reply('Your birthday has been set successfully! stay wysi');
  }
});
client.setInterval(() => {
  const today = new Date();
  const todayString = `${today.getMonth() + 1}/${today.getDate()}`;
  const birthdays = db.getBirthdayByDate(todayString);
  if (!birthdays || birthdays.length === 0) return;

  const birthdayChannel = getChannelByName('birthday');
  if (!birthdayChannel) return;

  birthdays.forEach(birthday => {
    const user = client.users.cache.get(birthday.userId);
    if (!user) return;

    birthdayChannel.send(`Happy Birthday, ${user}! 🎉🎂`);
  });
}, 24 * 60 * 60 * 1000); // Check once a day

function getChannelByName(channelName) {
  return client.channels.cache.find(channel => channel.name === channelName);
}

client.login('YOUR_DISCORD_BOT_TOKEN');

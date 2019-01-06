
const Discord = require('discord.io');
const auth = require('../config.json').discordToken;
const sheets = require('./sheetsAccess');
const googleCreds = require('../credentials.json');
// Configure logger setting
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth,
   autorun: true
});
bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'hi': 
                bot.sendMessage({
                    to: channelID,
                    message: "Hi! 👋"
                });
                break;
            case 'whitelist':
                sheets.doRequest(googleCreds, sheets.writeToWhitelist, {bot, channelID, message});
                break;
            // Just add any case commands if you want to..
         }
     }
});
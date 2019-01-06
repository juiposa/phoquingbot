const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

const spreadsheetId = require("../config.json").sheetId;
const dataRange = 'Sheet1!A2:D';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function doRequest(credentials, callback, discord) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, discord);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function writeToWhitelist(auth, discord) {
  const parsedMessage = parseWhitelistMessage(discord.message);
  if ( !parsedMessage ) {
    discord.bot.sendMessage({
      to: discord.channelID,
      message: "Invalid format, please only add your username (in quotes) and Steam64, " + 
               "i.e. `!whitelist \"Uncle Phoquer\" 76561198029451156`"
    })
    return;
  }
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: dataRange,
    insertDataOption: 'INSERT_ROWS',
    valueInputOption: 'USER_ENTERED',

    resource: {
      majorDimension: "ROWS",
      values: [
        [
          "",
          parsedMessage.username,
          "Whitelist",
          parsedMessage.steam64
        ],
      ]
    }
  }, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }

    discord.bot.sendMessage({
      to: discord.channelID,
      message: "Welcome to The Directory, " + parsedMessage.username + "! Hope to see you on soon!"
    })

    console.log("Adding user to whitelist: " + parsedMessage.username + " " + parsedMessage.steam64)
  })
}

function parseWhitelistMessage(message) {
  const split = message.match(/("[^"]*")|[^ ]+/g);
  if (split.length !== 3) {
    return null
  } else {
    return {
      username: split[1].replace(/\"+/g, ''),
      steam64: split[2]
    }
  }
}

module.exports = {
  writeToWhitelist,
  doRequest
};
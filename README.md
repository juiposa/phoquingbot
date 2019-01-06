# phoquingbot
A simple Discord bot for adding to a Squad server whitelist via Google Sheets.

# Install

## Dependencies

Node.js: https://nodejs.org/en/download/

Yarn as a package manager is prefered, but not necessary: https://yarnpkg.com/en/docs/install

## Google Sheets

Navigate here: https://developers.google.com/sheets/api/quickstart/nodejs

Click "Enable The API" button, name the project and click "Next".

Click the "Download Client Configuration" button, it will download a file called `credentials.json`.
Paste that file into this directory.

Now paste the ID of the Google Sheet into `sheet.json`. This ID is the random string of characters in the Sheet's URL.

i.e. the `13NOITWHDeWcfLpi4n6ef8lkDR3utpwmHiRv4GeUEfE8` in `https://docs.google.com/spreadsheets/d/13NOITWHDeWcfLpi4n6ef8lkDR3utpwmHiRv4GeUEfE8/edit`

## Discord

Navigate here: https://discordapp.com/developers/applications/

Click "Create an application", rename the application, then the "Bot" tab on the left. And then create one.

On the bot's page click the "Copy" button under the "Token". Paste that token into `discordAuth.json`

Back on the "General Information" tab on the left, there is a, 18 digit number called "Client ID".

Copy it into this URL: https://discordapp.com/oauth2/authorize?&client_id=CLIENT-ID-HERE&scope=bot&permissions=0
replacing `CLIENT-ID-HERE`. 

This will allow you to invite the bot to any Discord server you have admin access to as a user with no perms. 

# Start

Type `yarn start` to start ther server. If you didn't install Yarn, use `npm run start`. 

The first time the bot attempts to access your Google sheet, it will need to obtain authorization. Do a dry run command to the bot in your Discord: `!whitelist "Uncle Phoquer" 76561198029451156`

The Bot will prompt you with `Authorize this app by visiting this url:` in the terminal, followed by a long Google OAuth URL. Copy that URL into your browser, authenticate as the Google user with access to the Google Sheet you want the Bot to edit, allow access to the app asking for it, and then copy the code Google will read back to you, and paste it into the terminal.

Run `!whitelist "Uncle Phoquer" 76561198029451156` again and confirm that your Sheet is now being edited by the Bot!
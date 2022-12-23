const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { client, commands } = require('./index.js');

for (const guild in client.guilds){

    const rest = new REST({version: "9"}).setToken(TOKEN)
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, guild.id), {body: commands})
    .then(() => {
        console.log("Slash commands loaded for: " + guild.name)
    })
    .catch((err) =>{
        console.log(err)
        process.exit(1);
    })

}
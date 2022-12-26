const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { client, commands } = require('./index.js');
const dotenv = require("dotenv");

dotenv.config()
const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

function updateSlashCommands(){

    const guildIds = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({version: "9"}).setToken(TOKEN)
    for (const guildId in guildIds){

        rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId.id), {body: commands})
        .then(() => {
            console.log("Slash commands loaded for: " + guildId.name)
        })
        .catch((err) =>{
            console.log(err)
        })
    
    }
}

module.exports = { updateSlashCommands }
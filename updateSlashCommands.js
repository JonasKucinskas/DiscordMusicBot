const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const dotenv = require("dotenv");

dotenv.config()
const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

function updateSlashCommands(client, commands){

    const guildIds = client.guilds.cache.map(guild => guild.id);
    const guildNames = client.guilds.cache.map(guild => guild.name);

    const rest = new REST({version: "9"}).setToken(TOKEN)
    for (const guildNum in guildIds){

        let guildId = guildIds[guildNum];

        rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {body: commands})
        .then(() => {
            console.log("Slash commands loaded for: " + guildNames[guildNum] + " " + client.guilds.cache.get(guildId))
        })
        .catch((err) =>{
            console.log(err)
        })
    
    }

    return
}

module.exports = { updateSlashCommands }
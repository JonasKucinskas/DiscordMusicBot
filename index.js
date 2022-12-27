const fs = require("fs");
const path = require("node:path");
const Discord = require("discord.js");
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { Player } = require("discord-player")

dotenv.config()
const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID


const client = new Discord.Client({
    intents: [
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMessages,
        Discord.IntentsBitField.Flags.GuildVoiceStates
    ]
});



client.commands = new Discord.Collection();
client.player = new Player(client, {
    ytdlOptions:{
        quality: "highestaudio",
        highWaterMark: 1 << 58
    }
})

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

let commands = []

for (const file in commandFiles){
    
    const filePath = path.join(commandsPath, commandFiles[file]);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.once("ready", () => {
    console.log("online");

}); 

client.on("guildCreate", guild => {//when new server is joined, load slash commands to it.
    const rest = new REST({version: "9"}).setToken(TOKEN)
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, guild.id), {body: commands})
    .then(() => {
        console.log("Slash commands loaded for: " + guild.name)
    })
    .catch((err) =>{
        console.log(err)
        process.exit(1);
    })
})
var guildIds = client.guilds.cache.map(guild => guild.id)

client.on("interactionCreate", async interaction =>{//if slash command it used.
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try{
        await command.execute({client, interaction})
    }
    catch(err){
        console.log(err)
        await interaction.reply("mano kodas neveikia, idk");
    }
}) 
client.login(TOKEN);

module.exports = { guildIds, commands };
const { updateSlashCommands } = require('./updateSlashCommands.js');
updateSlashCommands()



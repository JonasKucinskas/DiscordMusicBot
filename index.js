const fs = require("node:fs");
const path = require("node:path");
const Discord = require("discord.js");
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { Player } = require("discord-player")

dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"
const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = "1046049503494553600"

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

    if ("data" in command && "execute" in command){
        client.commands.set(command.data.name, command);
        if (LOAD_SLASH) commands.push(command.data.toJSON());
    }
    else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once("ready", () => {
    console.log("online");
}); 

if (LOAD_SLASH){
    const rest = new REST({version: "9"}).setToken(TOKEN)
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Slash commands loaded")
        process.exit(0);
    })
    .catch((err) =>{
        console.log(err)
        process.exit(1)
    })
}
else {
    
    client.on("interactionCreate", async interaction =>{
        if(!interaction.isCommand()) return;
    
        const command = client.commands.get(interaction.commandName);
        if(!command) return;
    
        try{
            await command.execute({client, interaction})
        }
        catch(err){
            console.log(err)
            await interaction.reply("mano kodas neveikia");
        }
        
    }) 
}

client.login(TOKEN);
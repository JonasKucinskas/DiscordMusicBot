const Genius = require("genius-lyrics");
const dotenv = require("dotenv")
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

dotenv.config()
GENIUS_TOKEN = process.env.GENIUS_TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replays current song.'),
    execute: async ({client, interaction}) => {

        const queue = await client.player.getQueue(interaction.guildId);

        if (!queue){
            await interaction.reply('No song is playing');
            return;
        }

        
        await queue.seek(0);
        
        const song = queue.current;

        await interaction.reply(`${song.title} replayed.`)
    }
}
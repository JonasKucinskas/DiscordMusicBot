const dotenv = require("dotenv")
const Genius = require("genius-lyrics");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

dotenv.config()
const GENIUS_TOKEN = process.env.GENIUS_TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Displays lyrics for the song.'),
    execute: async ({client, interaction}) => {
        
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue){
            await interaction.reply("No song is playing.");
            return;
        }

        const geniusClient = new Genius.Client(GENIUS_TOKEN);
            
        const song = queue.current;
        const searches = await geniusClient.songs.search(song.title);
        const lyrics = await searches[0].lyrics();
   
        if (!lyrics){
            await interaction.reply('Lyrics not found.')
            return
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Lyrics for **[${song.title}](${song.url})**:`)
                    .setDescription(lyrics)
                    .setThumbnail(song.thumbnail)
            ]
        })
    }
}
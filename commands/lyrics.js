const getLyrics = require('../lib/getLyrics.js')
const dotenv = require("dotenv")
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

dotenv.config()
GENIUS_TOKEN = process.env.GENIUS_TOKEN;

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

        const currentSong = queue.current;

        const options={
            apiKey: GENIUS_TOKEN,
            title: currentSong.title,
            artist: currentSong.author,
            optimizeQuery:true
        }

        const songLyrics = await getLyrics(options)

        if (!songLyrics){
            await interaction.reply('Lyrics not found.')
            return
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Lyrics for **[${currentSong.title}](${currentSong.url})**:`)
                    .setDescription(songLyrics)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}
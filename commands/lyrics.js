const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { getLyrics } = require("lyrics-dumper");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Displays lyrics for the song.'),
    execute: async ({client, interaction}) => {
        
        const queue = client.player.getQueue(interaction.guildId);
        const song = queue.current;
        
        if (!song){
            await interaction.reply("No song is playing.");
            return;
        }

        let result;
        try{
            result = await getLyrics(song.title);
        }
        catch(err){
            await interaction.reply("Kartais neveikia ir as nzn kodel, cia yra vienas tu atveju.");
        }

        if (!result){
            await interaction.reply("Lyrics not found.");
            return;
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Lyrics for **[${song.title}](${song.url})**:`)
                    .setDescription(result.lyrics)
                    .setThumbnail(song.thumbnail)
            ]
        })
        
    }
}
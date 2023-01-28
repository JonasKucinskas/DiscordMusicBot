const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { getLyrics } = require("lyrics-dumper");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Displays lyrics for the song.'),
    execute: async ({client, interaction}) => {
        
        const queue = client.player.getQueue(interaction.guildId);
        const currentSong = queue.current;
        
        if (!currentSong){
            await interaction.reply("No song is playing.");
            return;
        }

        let result = await getLyrics(currentSong.title);

        if (!result){
            await interaction.reply("Lyrics not found.");  
            return;
        }

        let title = `Lyrics for **[${currentSong.title}](${currentSong.url})**:\n\n`;
        let footer = "\n\nNot all lyrics could fit into this message."
        
        if (result.lyrics.length + title.length + footer.length > 4096){//interaction.reply cant be longer than 4096 characters.
            result.lyrics = result.lyrics.substring(0, 4096 - title.length - footer.length) + footer;
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(title + result.lyrics)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { addTime } = require('../util/addTime');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('q')
        .setDescription('displays songs in the queue'),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guildId);
        const currentSong = queue.current;

        if (queue.tracks.length == 0 && !currentSong){
            await interaction.reply("Queue is empty");
            return;
        }


        let timeUntilPlayback = currentSong.duration.replace(':', '.');//need to replace : with . so i can convert stings to ints later.
        // - queue.current.beenPlaying

        let item = `1. **[${currentSong.title}](${currentSong.url})**  starts in: Currently playing.\n`;//add current song to queue list.

        for (let i = 1; i < queue.tracks.length + 1; i++){// i = 1, because current song is added in 0'th place 
            const song = queue.tracks[i-1];
            const songDuration = song.duration.replace(':', '.');
            item += `${i + 1}. **[${song.title}](${song.url})**  starts in: ${timeUntilPlayback}\n`,
            
            timeUntilPlayback = addTime(timeUntilPlayback, songDuration);
        }

        await interaction.reply({
            
            embeds: [
            new EmbedBuilder()
                .setTitle(`Number of songs in the queue: ${queue.tracks.length + 1}\n` )
                .setDescription(item)
                .setFooter({text:`Total queue duration: ${timeUntilPlayback}`}),
            ]
        })
    },
};
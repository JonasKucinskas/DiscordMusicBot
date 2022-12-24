const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('q')
        .setDescription('displays songs in the queue'),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guildId);

        if (queue.tracks.length == 0){
            await interaction.reply("Queue is empty");
            return;
        }

        let timeUntilPlayback = queue.current.duration;// - queue.current.beenPlaying
        let item = '';
        
        for (let i = 0; i < queue.tracks.length; i++){
            const song = queue.tracks[i];
            const songDuration = song.duration.replace(':', '.')//need to replace : with ., so I can add strigs as ints later.
            item += `**[${song.title}](${song.url})**  starts in: ${timeUntilPlayback}\n`,
            timeUntilPlayback += +songDuration;
            timeUntilPlayback = Math.round(timeUntilPlayback * 100) / 100;
        }

        await interaction.reply({
            
            embeds: [
            new EmbedBuilder()
                .setTitle(`Number of songs in the queue: ${queue.tracks.length}\n` )
                .setDescription(item)
                .setFooter({text:`Total queue song duration: ${timeUntilPlayback}`}),
            ]
        })
    },
};
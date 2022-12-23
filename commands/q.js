const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('q')
        .setDescription('displays songs in the queue'),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guildId);

        if (!queue){
            await interaction.reply("No song is playing");
            return;
        }

        let timeUntilPlayback = 0;
        let item = '';
        
        queue.tracks.forEach(song => item += `**[${song.title}](${song.url})**  (${timeUntilPlayback += parseInt(song.duration)})\n`)

        await interaction.reply({
            
            embeds: [
            new EmbedBuilder()
                .setTitle(`Number of songs in the queue: ${queue.tracks.length + 1}\n` )
                .addFields(
                    { name: 'Time until Playback', value: 'Some value here' },
                )
                .setDescription(item)
                .setFooter({text:`Total song duration: ${timeUntilPlayback}`})
            ]
        })
    },
};
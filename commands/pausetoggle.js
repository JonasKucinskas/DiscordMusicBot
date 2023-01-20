const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('pausetoggle')
        .setDescription('pauses and unpauses a song.'),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guildId);//get current queue.

        if(!interaction.member.voice.channel){

            await interaction.reply("reikia buti voice channelyje ;)");
            return;
        }

        if (!queue){
            await interaction.reply("No song is playing");
            return;
        }

        if (queue.setPaused()){//if paused, unpause, if unpaused, pause.
            queue.setPaused(false);
        }
        else queue.setPaused(true);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${queue.current.title} has been paused!`)
                    .setThumbnail(queue.current.thumbnail)
            ]
        })
    },
};
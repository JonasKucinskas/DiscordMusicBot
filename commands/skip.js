const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips a song.'),
    execute: async ({client, interaction}) => {
        
        if(!interaction.member.voice.channel){

            await interaction.reply("reikia buti voice channelyje ;)");
            return;
        }

        const queue = client.player.getQueue(interaction.guildId);
        const currentSong = queue.current;
        
        if (!currentSong){
            await interaction.reply("No song is playing.");
            return;
        }

        queue.skip();


        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**[${currentSong.title}](${currentSong.url})** has been skipped!`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    },
};
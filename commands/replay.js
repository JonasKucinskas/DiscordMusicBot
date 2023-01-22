const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replays current song.'),
    execute: async ({client, interaction}) => {

        // this command starts playing current song from the beginning.

        if(!interaction.member.voice.channel){

            await interaction.reply("reikia buti voice channelyje ;)");
            return;
        }


        const queue = await client.player.getQueue(interaction.guildId);
        const currentSong = queue.current;

        if (!currentSong){
            await interaction.reply('No song is playing');
            return;
        }
        
        await queue.seek(0);
        
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**[${currentSong.title}](${currentSong.url})** has been added replayed.`)
                    .setThumbnail(currentSong.thumbnail)
                    .setFooter({text: `Duration: ${currentSong.duration}`})
            ]
        })
    }
}
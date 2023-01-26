const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Replays current song.')
        .addIntegerOption(option =>
            option.setName("seconds").setDescription("Seek to set time").setRequired(false)
        ),
    execute: async ({client, interaction}) => {

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
        
        const time = interaction.options.getInteger("seconds") * 1000;

        if (!time){
            await queue.seek(0);
        }
        
        let songDuration = currentSong.duration.replace(':', '') * 1000;

        if (time / 1000 > songDuration){
            await interaction.reply(`Can't seek further than song duration. (${currentSong.duration})`);
            return;
        }
        else if (time < 0){
            await interaction.reply(`Can't seek less than 0.`);
            return;
        }
        else await queue.seek(time);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**[${currentSong.title}](${currentSong.url})** seeked at ${time / 1000} seconds.`)
                    .setThumbnail(currentSong.thumbnail)
                    .setFooter({ text: `Duration: ${currentSong.duration}`})
            ]
        })
    }
}
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replays current song.'),
    execute: async ({client, interaction}) => {

        if(!interaction.member.voice.channel){

            await interaction.reply("reikia buti voice channelyje ;)");
            return;
        }

        const queue = await client.player.getQueue(interaction.guildId);

        if (!queue){
            await interaction.reply('No song is playing');
            return;
        }
        
        await queue.seek(0);
        
        const song = queue.current;

        await interaction.reply(`${song.title} replayed.`)
    }
}
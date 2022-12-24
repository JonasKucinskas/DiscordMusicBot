const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops a song and clears the queue.'),
    execute: async({client, interaction}) => {
        
        
        const queue = client.player.getQueue(interaction.guildId);
        
        if (!queue){
            await interaction.reply("No song is playing.");
            return;
        }
        
        queue.clear();
        queue.skip();
        
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Queue has been cleared.`)
            ]
        })
    },
};
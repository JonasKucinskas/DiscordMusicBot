const { SlashCommandBuilder, GuildExplicitContentFilter } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stops a song'),
    async execute(interaction){
        await interaction.reply('test veikia stop');
    },
};
const { SlashCommandBuilder, GuildExplicitContentFilter } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skips a song'),
    async execute(interaction){
        await interaction.reply('test veikia skip');
    },
};
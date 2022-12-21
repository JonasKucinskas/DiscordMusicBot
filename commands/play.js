const { SlashCommandBuilder, GuildExplicitContentFilter } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('plays a song'),
    async execute(interaction){
        await interaction.reply('test veikia');
    },
};
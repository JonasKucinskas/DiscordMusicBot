const { QueryType } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('plays a song')
        .addStringOption(option =>
            option.setName("searchterms").setDescription("search keywords").setRequired(true)
        ),
    execute: async({client, interaction}) => {
       
        if(!interaction.member.voice.channel){

            await interaction.reply("reikia buti voice channelyje ;)");
            return;
        }
        
        const queue = await client.player.createQueue(interaction.guild);

        let searchterms = interaction.options.getString("searchterms");

        const result = await client.player.search(searchterms, {

            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        })
        
        if (result.tracks.length === 0){
            await interaction.reply("no results");
            return
        }

        var song = result.tracks[0];
        await queue.addTrack(song);
            
        if (!queue.connection){
            await queue.connect(interaction.member.voice.channel)
        }

        if (!queue.playing){
            await queue.play();
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue (${queue.tracks.length + 1})`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})
            ]
        })
    }
};



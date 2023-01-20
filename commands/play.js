const { QueryType } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Adds song to the queue.')
        .addStringOption(option =>
            option.setName("searchterms").setDescription("search keywords").setRequired(true)
        ),
    execute: async({client, interaction}) => {
       
        if(!interaction.member.voice.channel){

            await interaction.reply("reikia buti voice channelyje ;)");
            return;
        }
        
        let queue = client.player.getQueue(interaction.guildId);

        if (!queue){//if queue does'nt exits, create new queue.
            queue = await client.player.createQueue(interaction.guild);
        }

        let searchterms = interaction.options.getString("searchterms");//user typed parameter for slash command.

        const result = await client.player.search(searchterms, {//search for tracks based on user input.

            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        })
        
        if (result.tracks.length === 0){
            await interaction.reply("no results?");
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
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})
            ]
        })
    }
};



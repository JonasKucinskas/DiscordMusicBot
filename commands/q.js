const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

function addTime(num1, num2){//doesnt account for hours, cuz rare case.
    var seconds1 = num1 - Math.floor(num1);
    var seconds2 = num2 - Math.floor(num2);

    var minutes1 = Math.floor(num1);
    var minutes2 = Math.floor(num2);

    var minutes = minutes1 + minutes2;
    var seconds = seconds1 + seconds2;


    if (seconds1 + seconds2 > 0.6){
        seconds = seconds1 + seconds2 - 0.6;
        minutes += 1;
    }

    let time = minutes + seconds;

    return Math.round(time * 100) / 100;
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('q')
        .setDescription('displays songs in the queue'),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guildId);

        if (queue.tracks.length == 0){
            await interaction.reply("Queue is empty");
            return;
        }

        const currentSong = queue.current;

        let timeUntilPlayback = currentSong.duration.replace(':', '.');// - queue.current.beenPlaying

        let item = `1. **[${currentSong.title}](${currentSong.url})**  starts in: Currently playing.\n`;//add current song to queue list.

        for (let i = 1; i < queue.tracks.length + 1; i++){
            const song = queue.tracks[i-1];
            const songDuration = song.duration.replace(':', '.')//need to replace : with ., so I can add strigs as ints later.
            item += `${i+1}. **[${song.title}](${song.url})**  starts in: ${timeUntilPlayback}\n`,
            
            timeUntilPlayback = addTime(timeUntilPlayback, songDuration);
        }

        await interaction.reply({
            
            embeds: [
            new EmbedBuilder()
                .setTitle(`Number of songs in the queue: ${queue.tracks.length + 1}\n` )
                .setDescription(item)
                .setFooter({text:`Total queue duration: ${timeUntilPlayback}`}),
            ]
        })
    },
};
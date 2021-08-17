const Discord = require('discord.js'),
    Command = require('../Structures/Command'),
    fs = require('fs'),
    path = require('path');

module.exports = new Command ({
    name: "help",
    description: "Gives you the description of every command and how to use it.",

    async run(message, args, run) {
        // Require all files from the commands folder and fetch description
        let cmds = fs.readdirSync(__dirname).filter(x => x.endsWith('.js') && x != 'help.js');
        let cmdsDesc = [];
        for (let cmd of cmds) {
            const cmdEntry = require(path.join(__dirname, cmd));
            cmdsDesc.push({"name": cmdEntry.name, "description": cmdEntry.description});
        }
        // Send the description to the user
        const helpEmbed = new Discord.MessageEmbed();
        helpEmbed.setTitle(":grey_question: Help");
        helpEmbed.setDescription("Here is a list of every command and how to use it.");
        helpEmbed.setColor(0xFF8C61);
        for (let cmd of cmdsDesc) {
            helpEmbed.addField(":hammer: `" + cmd.name + "`", cmd.description);
        }
        await message.channel.send({embeds: [helpEmbed]});
//!!recommend userName genre
        
    }
})
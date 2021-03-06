const Discord = require("discord.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js");

const name = "character";
const usage = "character <name>";
const description = "Gets a character from anilist's DB based on a search result.";

module.exports = new Command({
    name,
    usage,
    description,
    type: CommandCategories.Anilist,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The query to search for')
                .setRequired(true)),

    async run(interaction, args, run) {
        let vars = { charName: interaction.options.getString('query') };

        GraphQLRequest(GraphQLQueries.Character, vars)
            .then((response, headers) => {
                let data = response.Character;
                if (data) {
                    //^ Fix the description by replacing and converting HTML tags
                    let description =
                        data.description
                            ?.replace(/<br><br>/g, "\n")
                            .replace(/<br>/g, "\n")
                            .replace(/<[^>]+>/g, "")
                            .replace(/&nbsp;/g, " ")
                            .replace(/~!|!~/g, "||") /*.replace(/\n\n/g, "\n")*/ || "No description available.";
                    //console.log(data.dateOfBirth.day || 'no' + data.dateOfBirth.month + data.dateOfBirth.year)
                    const charEmbed = new EmbedBuilder()
                        .setThumbnail(data.image.large)
                        .setTitle(data.name.full)
                        .setDescription(description || "No description available.")
                        .addFields(
                            //age
                            {
                                name: "Character Info: \n",
                                value: `**Age**: ${data.age || "No age specified"}\n **Gender**: ${data.gender || "No gender specified."}`,
                            }
                            //gender
                            //{name: "Gender", value: `${data.gender || 'No gender specified'}`},
                            //Date of birth
                            //{name: "Date Of Birth", value: `${data.dateOfBirth.day || 'no' + data.dateOfBirth.month + data.dateOfBirth.year || 'No date of birth specified'}`},
                            //BloodType
                            //{name: "Blood Type", value: `${data.bloodType || 'No blood type specified'}`}
                        )
                        .setURL(data.siteUrl)
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));
                    //data.description.split("<br>").forEach(line => titleEmbed.addField(line, "", true))
                    interaction.reply({ embeds: [charEmbed] });
                } else {
                    return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
                }
            })
            .catch((error) => {
                console.log(error)
                interaction.reply({ embeds: [EmbedError(error, vars)] });
            });
    },
});

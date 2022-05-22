// #bug-reports & button handler

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const User = require("../../schemas/user");

let embed, row;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Displays your inventory")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user of who to view the inventory")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option
        .setName("page")
        .setDescription("The page to view")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    // Options

    let user = interaction.options.getUser("user")
      ? interaction.options.getUser("user")
      : interaction.user;
    let page = interaction.options.getNumber("page");

    // Initialization

    const userProfile = await client.createUser(user);

    // Embeds & rows

    const inventory1 = new MessageEmbed()
      .setTitle(`${user.tag}'s inventory`)
      .addFields(
        {
          name: "Common Fish",
          value: `『${userProfile.codLevel}』Cod: ${userProfile.cod}\n『${userProfile.herringLevel}』Herring: ${userProfile.herring}\n『${userProfile.pufferfishLevel}』Pufferfish: ${userProfile.pufferfish}\n『${userProfile.salmonLevel}』Salmon: ${userProfile.salmon}\n『${userProfile.shrimpLevel}』:shrimp: Shrimp: ${userProfile.shrimp}`,
          inline: true,
        },
        {
          name: "Uncommon Fish",
          value: `『${userProfile.butterfishLevel}』Butterfish: ${userProfile.butterfish}\n『${userProfile.clownfishLevel}』Clownfish: ${userProfile.clownfish}\n『${userProfile.duckLevel}』:duck: Duck: ${userProfile.duck}\n『${userProfile.penguinLevel}』:penguin: Penguin: ${userProfile.penguin}\n『${userProfile.squidLevel}』:squid: Squid: ${userProfile.squid}`,
          inline: true,
        },
        {
          name: "Rare Fish",
          value: `『${userProfile.crabLevel}』:crab: Crab: ${userProfile.crab}\n『${userProfile.orcaLevel}』Orca: ${userProfile.orca}\n『${userProfile.otterLevel}』:otter: Otter: ${userProfile.otter}\n『${userProfile.sharkLevel}』:shark: Shark: ${userProfile.shark}\n『${userProfile.whaleLevel}』:whale: Whale: ${userProfile.whale}`,
          inline: true,
        },
        {
          name: "Epic Fish",
          value: `『${userProfile.jellyfishLevel}』Jellyfish: ${userProfile.jellyfish}\n『${userProfile.octopusLevel}』:octopus: Octopus: ${userProfile.octopus}\n『${userProfile.seahorseLevel}』Seahorse: ${userProfile.seahorse}\n『${userProfile.sealLevel}』:seal: Seal: ${userProfile.seal}\n『${userProfile.walrusLevel}』Walrus: ${userProfile.walrus}`,
          inline: true,
        },
        {
          name: "Mythic Fish",
          value: `『${userProfile.coralLevel}』Coral: ${userProfile.coral}\n『${userProfile.crocodileLevel}』:crocodile: Crocodile: ${userProfile.crocodile}\n『${userProfile.flamingoLevel}』:flamingo: Flamingo: ${userProfile.flamingo}\n『${userProfile.manateeLevel}』Manatee: ${userProfile.manatee}\n『${userProfile.turtleLevel}』:turtle: Turtle: ${userProfile.turtle}`,
          inline: true,
        },
        {
          name: "Legendary Fish",
          value: `『${userProfile.blobfishLevel}』Blobfish: ${userProfile.blobfish}\n『${userProfile.catfishLevel}』Catfish: ${userProfile.catfish}\n『${userProfile.dolphinLevel}』:dolphin: Dolphin: ${userProfile.dolphin}\n『${userProfile.mermaidLevel}』Mermaid: ${userProfile.mermaid}\n『${userProfile.starfishLevel}』Starfish: ${userProfile.starfish}`,
          inline: true,
        }
      )
      .setFooter({ text: `Page 1/2 | Requested by ${interaction.user.tag}` })
      .setColor("#ADD8E6")
      .setTimestamp();

    const inventory2 = new MessageEmbed()
      .setTitle(`${user.tag}'s inventory`)
      .addFields(
        {
          name: "Currency",
          value: `<:FishCoin:937423381756772364> Fish Coins: ${userProfile.fishCoins}\nFish Crystals: ${userProfile.fishCrystals}`,
        },
        {
          name: "Fishing rods",
          value: `Common rod: Unlocked! 🔓\nExquisite rod: ${userProfile.exquisiteRod}\nPrecious rod: ${userProfile.preciousRod}\nLuxurious rod: ${userProfile.luxuriousRod}\nDivine rod: ${userProfile.divineRod}`,
        },
        {
          name: "Loot Boxes",
          value: `⭐: ${userProfile.s1LootBox}\n⭐⭐: ${userProfile.s2LootBox}\n⭐⭐⭐: ${userProfile.s3LootBox}\n⭐⭐⭐⭐: ${userProfile.s4LootBox}\n⭐⭐⭐⭐⭐: ${userProfile.s5LootBox}\n`,
          inline: true,
        }
      )
      .setFooter({ text: `Page 2/2 | Requested by ${interaction.user.tag}` })
      .setColor("#ADD8E6")
      .setTimestamp();

    // const inventory1_ = new MessageActionRow().addComponents(
    //   new MessageButton()
    //     .setCustomId("nothing")
    //     .setLabel("Previous page")
    //     .setEmoji("⬅️")
    //     .setStyle("PRIMARY")
    //     .setDisabled(true),
    //   new MessageButton()
    //     .setCustomId("inventory2")
    //     .setLabel("Next page")
    //     .setEmoji("➡️")
    //     .setStyle("PRIMARY")
    //     .setDisabled(false)
    // );

    // const inventory2_ = new MessageActionRow().addComponents(
    //   new MessageButton()
    //     .setCustomId("inventory1")
    //     .setLabel("Previous page")
    //     .setEmoji("⬅️")
    //     .setStyle("PRIMARY")
    //     .setDisabled(false),
    //   new MessageButton()
    //     .setCustomId("nothing")
    //     .setLabel("Next page")
    //     .setEmoji("➡️")
    //     .setStyle("PRIMARY")
    //     .setDisabled(true)
    // );

    // Code

    if (page === 1 || page === 2) {
      switch (page) {
        case 1:
          embed = inventory1;
          // row = inventory1_;
          break;
        case 2:
          embed = inventory2;
          // row = inventory2_;
          break;
      }

      await interaction.reply({
        content: `${interaction.user}`,
        embeds: [embed],
        // components: [row],
      });
    } else if (!page) {
      await interaction.reply({
        content: `${interaction.user}`,
        embeds: [inventory1],
        // components: [inventory1_],
      });
    } else {
      await interaction.reply({
        content: `That page does not exist! Valid pages: 1, 2`,
        ephemeral: true,
      });
    }

    // const collector = interaction.channel.createMessageComponentCollector({
    //   componentType: "BUTTON",
    // });

    // collector.on("collect", async (i) => {
    //   if (i.user.id === interaction.user.id) {
    //     switch (i.customId) {
    //       case "inventory1":
    //         embed = inventory1;
    //         row = inventory1_;
    //         break;
    //       case "inventory2":
    //         embed = inventory2;
    //         row = inventory2_;
    //         break;
    //     }

    //     await i.update({
    //       content: `${interaction.user}`,
    //       embeds: [embed],
    //       components: [row],
    //     });
    //   } else {
    //     i.reply({
    //       content: `These aren't your buttons!`,
    //       ephemeral: true,
    //     });
    //   }
    // });
  },
};

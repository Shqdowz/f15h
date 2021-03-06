const { MessageEmbed } = require("discord.js");
const User = require("../schemas/user");

let embed;

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;
    if (!interaction.guild) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const userProfile = await client.createUser(interaction.member);

    if (userProfile.userTag != interaction.user.tag) {
      await User.findOneAndUpdate(
        { _id: userProfile._id },
        { userTag: interaction.user.tag }
      );
    }

    if (userProfile.commandCounter >= 20) {
      if (Math.ceil(Math.random() * 20) == 20) {
        await User.findOneAndUpdate(
          { _id: userProfile._id },
          {
            needVerify: (userProfile.needVerify = true),
            firstInt: (userProfile.firstInt = true),
            commandCounter: (userProfile.commandCounter = 0),
          }
        );
      }
    }

    let execute;

    if (userProfile.wrongCodeCounter >= 5) {
      await User.findOneAndUpdate(
        { _id: userProfile._id },
        {
          isBlacklisted: (userProfile.isBlacklisted = true),
          wrongCodeCounter: (userProfile.wrongCodeCounter = 0),
        }
      );
    }
    if (userProfile.isBlacklisted) {
      await interaction.reply({
        content: `You have been blacklisted from using the bot!`,
        ephemeral: true,
      });
    } else if (userProfile.firstTime) {
      const embed = new MessageEmbed()
        .setTitle(`Welcome to the world of F15H!`)
        .setDescription(
          `Go fishing for animals, sell them for Fish Coins, take them into battles against other users, upgrade them and compete on the global leaderboards!\n\nHere are a few commands to get you started:\n- \`/help\` - Displays the help pages\n- \`/fish\` - Fish with your fishing rod\n- \`/inventory\` - Displays your inventory\n\nI hope you will have a great time with F15H. As a welcome gift, here's a gift code! -> \`F15Hlaunch\``
        )
        .setFooter({ text: "- Shqdowz#2521" })
        .setColor("#ADD8E6");

      await interaction.reply({ embeds: [embed], ephemeral: true });

      await User.findOneAndUpdate(
        { _id: userProfile._id },
        { firstTime: (userProfile.firstTime = false) }
      );
    } else if (userProfile.needVerify) {
      if (userProfile.firstInt) {
        const code = `${Math.floor(Math.random() * 9)}${Math.floor(
          Math.random() * 9
        )}${Math.floor(Math.random() * 9)}${Math.floor(
          Math.random() * 9
        )}${Math.floor(Math.random() * 9)}`;

        await User.findOneAndUpdate(
          { _id: userProfile._id },
          {
            verifyCode: (userProfile.verifyCode = code),
            firstInt: (userProfile.firstInt = false),
          }
        );

        await interaction.reply({
          content: `Please /v (verify) the following code to prove you aren't afk: \`${code}\``,
          ephemeral: true,
        });
      } else if (interaction.commandName != "v" && !userProfile.firstInt) {
        await User.findOneAndUpdate(
          { _id: userProfile._id },
          { wrongCodeCounter: (userProfile.wrongCodeCounter += 1) }
        );
        if (userProfile.wrongCodeCounter < 5) {
          await interaction.reply({
            content: `Wrong code! /v (verify) your code to prove you aren't afk: \`${userProfile.verifyCode}\``,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `You have been auto blacklisted from the bot due to too many wrong codes!`,
            ephemeral: true,
          });

          const guild = client.guilds.cache.get("937018874572972112");
          const channel = "976933257583144980";

          const logEmbed = new MessageEmbed()
            .setTitle("Blacklist")
            .setDescription(
              `${interaction.user.tag} (id: ${interaction.user.id}) got auto-blacklisted by the anti-afk system.`
            )
            .setColor("#000000")
            .setTimestamp();

          await guild.channels.cache.get(channel).send({
            embeds: [logEmbed],
          });
        }
      } else {
        try {
          await command.execute(interaction, client);
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    } else {
      const secondsLeft =
        Math.round((userProfile.globalCooldown - Date.now()) / 100) / 10;

      if (secondsLeft >= 0) {
        await interaction.reply({
          content: `You are on global cooldown! Please wait ${secondsLeft} more seconds.`,
          ephemeral: true,
        });

        execute = false;
      } else {
        execute = true;

        const cooldown = Date.now() + 3 * 1000;

        await User.findOneAndUpdate(
          { _id: userProfile._id },
          { globalCooldown: (userProfile.globalCooldown = cooldown) }
        );
      }
    }

    if (execute) {
      await User.findOneAndUpdate(
        { _id: userProfile._id },
        { commandCounter: (userProfile.commandCounter += 1) }
      );

      if (userProfile.experience > userProfile.neededExperience) {
        await User.findOneAndUpdate(
          { _id: userProfile._id },
          {
            experience: (userProfile.experience -=
              userProfile.neededExperience),
            level: (userProfile.level += 1),
            neededExperience: (userProfile.neededExperience += 250),
          }
        );

        embed = new MessageEmbed()
          .setTitle("Level up!")
          .setDescription(
            `Congratulations ${interaction.user.tag}, you advanced to level ${userProfile.level}!`
          )
          .setColor("#ADD8E6")
          .setTimestamp();

        await interaction.channel.send({
          content: `${interaction.user}`,
          embeds: [embed],
        });
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};

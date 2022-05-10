const { Client, Intents, Collection } = require("discord.js");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

client.commands = new Collection();

const functions = fs
  .readdirSync("./functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");

for (file of functions) {
  require(`./functions/${file}`)(client);
}

client.handleEvents(eventFiles, "./events");
client.handleCommands(commandFolders, "./commands");

client.login(process.env.token);
client.dbLogin();

mongoose.connect(process.env.dbToken, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// const clientId = "967030090875670598";
// const DiscordRPC = require("discord-rpc");
// const RPC = new DiscordRPC.Client({ transport: "ipc" });

// DiscordRPC.register(clientId);

// async function setActivity() {
//   if (!RPC) return;
//   RPC.setActivity({
//     details: `Coding a Discord bot`,
//     largeImageKey: `f15h`,
//     instance: false,
//   });
// }

// RPC.on("ready", async () => {
//   setActivity();
//   console.log("RPC is ready!");
// });

// RPC.login({ clientId }).catch((err) => console.log(err));

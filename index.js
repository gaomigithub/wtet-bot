const { prefix, token } = require("./config.json");
const { data, total } = require("./menuData.json");
const botCommands = require("./commands");
const Discord = require("discord.js");
// Config
const configSchema = {
  triggerWords: {
    eat: "吃了",
    wish: "想吃"
  },
  defaultColors: {
    success: "#41b95f",
    neutral: "#287db4",
    warning: "#ff7100",
    error: "#c63737"
  }
};
const bot = {
  client: new Discord.Client(),
  log: console.log,
  commands: new Discord.Collection(),
  config: configSchema,
  data: data,
  total: total,
  prefix: prefix
};
const customMenu = data.map((item) => item.name);

/*
 * Define all the core functions for the bot lifecycle
 */

// Load the bot
bot.load = function load() {
  console.log("Loading commands...");
  Object.keys(botCommands).forEach((key) => {
    this.commands.set(botCommands[key].name, botCommands[key]);
  });
  console.log("Connecting...");
  this.client.login(token);
};

// Check and react to messages
bot.onMessage = async function onMessage(message) {
  // ignore all other messages without our prefix
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.split(/ +/);
  // get the first word (lowercase) and remove the prefix
  const command = args.shift().toLowerCase().slice(prefix.length);
  if (!this.commands.has(command)) return;
  try {
    bot.log(`args: ${args}`);
    this.commands.get(command).execute(message, args, bot, customMenu);
  } catch (error) {
    this.log(error);
    message.reply("there was an error trying to execute that command!");
  }
};

/*
 * Register event listeners
 */

bot.client.once("ready", () => {
  console.log("GUNDAM, On!");
});
bot.client.on("reconnecting", () => {
  bot.log("Reconnecting...");
});
bot.client.on("disconnect", (evt) => {
  bot.log(`Disconnected: ${evt.reason} (${evt.code})`);
});
bot.client.on("message", bot.onMessage.bind(bot));

// Boot the bot
bot.load();

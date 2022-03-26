import Discord from "discord.js";
import fetch from 'node-fetch';

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const config = {
  ANIME_TOKEN: process.env.ANIME_TOKEN,
  BOT_TOKEN: process.env.BOT_TOKEN,
  PREFIX: "!"
}

client.login(config.BOT_TOKEN);

const prefix = config.PREFIX;

const removeFirstWord = (str) => {
  return str.replace(/^\w+\s*/, '');
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  const anime = removeFirstWord(commandBody);

  if (command === 'anime') {
    const params = new URLSearchParams();
    const url = `https://anime-slackbot.netlify.app/api/anime`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    params.append('text', anime);
    params.append('response_url', 'slack');
    params.append('token', config.ANIME_TOKEN);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: params,
    });

    if (response.ok) {
      const json = await response.json();

      message.channel.send(json.text);
    } else {
      message.channel.send(`Something went wrong looking up ${anime}`);
    }
  }
});

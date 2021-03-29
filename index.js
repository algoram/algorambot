require("dotenv").config();
const { Telegraf } = require("telegraf");
const https = require("https");
const fetch = require("node-fetch");

const token = process.env.TELEGRAM_TOKEN ?? "";
const apiKey = process.env.MESSARI_API_KEY ?? "";

const bot = new Telegraf(token);

const wantedAssets = ["BTC", "ETH", "ADA", "GRT", "DOGE"];

bot.start((context) => {
	context.reply("Hi there\n\nThis bot will display crypto values");
});

bot.command("crypto", (context) => {
	context.reply("Loading data...");

	let replyString = "Here are your cryptos:\n";

	fetch("https://data.messari.io/api/v2/assets")
		.then((res) => res.json())
		.then((res) => res.data)
		.then((data) => {
			data.forEach((coin) => {
				if (wantedAssets.indexOf(coin.symbol) > -1) {
					replyString += `\n${coin.symbol}: ${
						Math.round(coin.metrics.market_data.price_usd * 100) / 100
					}$`;
				}
			});

			context.reply(replyString);
		});
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

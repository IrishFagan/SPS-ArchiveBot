const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client()

client.login(config.TOKEN)

function archiveCommand(message) {
	return message.content === "!archive"
}

client.on("message", (message) => {
	if(archiveCommand(message)) {
		message.reply("Archived!")
	}
})
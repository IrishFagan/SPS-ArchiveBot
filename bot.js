const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client()

client.login(config.TOKEN)

function archiveCommand(message) {
	return message.content === "!archive"
}

function imageAttached(message) {
	return message.attachments.array()[0].url
}

client.on("message", (message) => {
	if(archiveCommand(message) && imageAttached(message)) {
		message.reply("Archived!")
		const archiveChannel = client.channels.cache.find(channel => channel.name === 'bike-archive')
		console.log(message.attachments)
		archiveChannel.send(message.attachments.array()[0].url)
	}
})
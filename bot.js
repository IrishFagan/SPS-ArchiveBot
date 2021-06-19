const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client()

client.login(config.TOKEN)

function archiveCommand(message) {
	return message.content === "!archive"
}

function imageAttached(message) {
	return message.attachments.array()[0] !== undefined
}

function properArchivePost(message) {
	return (archiveCommand(message) && imageAttached(message))
}

function notArchiveBot(message) {
	return message.author !== 'ArchiveBot'
}

client.on("message", (message) => {
	if(properArchivePost(message) && notArchiveBot(message)) {
		message.reply("Archived!")
		const archiveChannel = client.channels.cache.find(channel => channel.name === 'bike-archive')
		archiveChannel.send(message.attachments.array()[0].url)
		archiveChannel.send(message.author.username)
	}

	if(archiveCommand(message) && !imageAttached(message) && notArchiveBot(message)) {
		message.reply("Not a proper archive post.\nPlease attach an image for it to moved to 'bike-archive'!")
	}
})
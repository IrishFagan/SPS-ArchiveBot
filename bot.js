const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client()

client.login(process.env.TOKEN)

function archiveCommand(message) {
	return message.content === "!archive"
}

function imageAttached(message) {
	return message.attachments.array()[0] !== undefined
}

function properArchivePost(message) {
	return (archiveCommand(message) && imageAttached(message) && notArchiveBot(message))
}

function archiveCommandWithoutImage(message) {
	return (archiveCommand(message) && !imageAttached(message) && notArchiveBot(message))
}

function notArchiveBot(message) {
	return message.author !== 'ArchiveBot'
}

client.on("message", (message) => {
	if(properArchivePost(message)) {
		const archiveChannel = client.channels.cache.find(channel => channel.name === 'bike-archive')

		message.reply("Archived!")
		
		archiveChannel.send(message.attachments.array()[0].url)
		archiveChannel.send(message.author.username)
	}

	if(archiveCommandWithoutImage(message)) {
		message.reply("Not a proper archive post.\nPlease attach an image for it to be moved to 'bike-archive'!")
	}
})
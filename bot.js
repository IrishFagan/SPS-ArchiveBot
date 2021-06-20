const Discord = require('discord.js')
require('dotenv').config()
const client = new Discord.Client()

client.login(process.env.TOKEN)

function archiveCommand(message) {
	return message.content.includes("!archive")
}

function imageAttached(message) {
	return message.attachments.array()[0] !== undefined
}

function linkAttached(message) {
	var link = new RegExp("http[A-Za-z0-9_\/\:.]*(.jpg|.png)")
	return link.test(message)
}

function attachedImageArchivePost(message) {
	return (archiveCommand(message) && imageAttached(message) && notArchiveBot(message))
}

function attachedLinkArchivePost(message) {
	return (archiveCommand(message) && linkAttached(message))
}

function archiveCommandWithoutImage(message) {
	return (archiveCommand(message) && !imageAttached(message) && !linkAttached(message) && notArchiveBot(message))
}

function notArchiveBot(message) {
	return message.author !== 'ArchiveBot'
}

client.on("message", (message) => {
	const archiveChannel = client.channels.cache.find(channel => channel.name === 'bike-archive')

	if(attachedImageArchivePost(message)) {

		message.reply("Archived!")
		
		archiveChannel.send(message.attachments.array()[0].url)
		archiveChannel.send(message.author.username)
	}

	if(attachedLinkArchivePost(message)) {
		
	}

	if(archiveCommandWithoutImage(message)) {
		message.reply("Not a proper archive post.\nPlease attach an image for it to be moved to 'bike-archive'!")
	}
})
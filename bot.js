const Discord = require('discord.js')
require('dotenv').config()

const client = new Discord.Client()
const linkRegex = new RegExp("http[A-Za-z0-9_\/\:.]*(.jpg|.png)")

client.login(process.env.TOKEN)

function archiveCommand(message) {
	return message.content.includes(process.env.COMMAND)
}

function imageAttached(message) {
	return message.attachments.array()[0] !== undefined
}

function linkAttached(message) {
	return linkRegex.test(message)
}

function attachedImageArchivePost(message) {
	return (archiveCommand(message) && imageAttached(message))
}

function attachedLinkArchivePost(message) {
	return (archiveCommand(message) && linkAttached(message))
}

function archiveCommandWithoutImageOrLink(message) {
	return (archiveCommand(message) && !imageAttached(message) && !linkAttached(message))
}

function sendArchiveMessage(message, attachment, author) {
	const archiveChannel = client.channels.cache.find(channel => channel.name === process.env.CHANNEL)

	message.reply("Archived!")

	archiveChannel.send(attachment)
	archiveChannel.send(author)
}

function checkArchiveMessage(message) {
	if(attachedImageArchivePost(message)) {
		console.log('attached image')
		sendArchiveMessage(
			message,
			message.attachments.array()[0].url,
			message.author.username
		)
	}

	if(attachedLinkArchivePost(message)) {
		console.log('attached link')
		sendArchiveMessage(
			message,
			message.content.match(linkRegex)[0],
			`Shared by ${message.author.username}`
		)
	}

	if(archiveCommandWithoutImageOrLink(message)) {
		message.reply("Not a proper archive post.\nPlease attach an image for it to be moved to 'bike-archive'!")
	}
}

client.on("message", (message) => {
	if (message.author.bot) return

	collector = message.createReactionCollector(() => ['🅰️'], { max: 100})
		
	collector.on('collect', (reaction, reactionCollector) => {

			if(reaction.emoji.name === '🅰️' && reaction.count > 1) return

			if(reaction.emoji.name === '🅰️' && imageAttached(message)) {
				sendArchiveMessage(
					message,
					message.attachments.array()[0].url,
					message.author.username
				)
			}
		})

	checkArchiveMessage(message)
})
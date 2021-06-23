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

function notArchiveBot(message) {
	return message.author !== 'ArchiveBot'
}

client.on("message", (message) => {
	if (message.author.bot) return

	message.awaitReactions(() => ['🅰️'], { max: 1})
		.then(collected => {
			const reaction = collected.first();

			if(reaction.emoji.name === '🅰️') {
				message.reply("Archived!")

				archiveChannel.send(message.attachments.array()[0].url)
				archiveChannel.send(message.author.username)
			}
		})

	if(attachedImageArchivePost(message)) {
		message.reply("Archived!")
		
		archiveChannel.send(message.attachments.array()[0].url)
		archiveChannel.send(message.author.username)
	}

	if(attachedLinkArchivePost(message)) {
		message.reply("Archived!")

		archiveChannel.send(message.content.match(linkRegex)[0])
		archiveChannel.send(`Shared by ${message.author.username}`)
	}

	if(archiveCommandWithoutImageOrLink(message)) {
		message.reply("Not a proper archive post.\nPlease attach an image for it to be moved to 'bike-archive'!")
	}
})
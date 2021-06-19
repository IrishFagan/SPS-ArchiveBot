const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client()

client.login(config.TOKEN)

function command(message) {
	return message.content.substring(0, 1) === "!"
}

client.on("message", (message) => {
	if(command(message)) {
		
	}
})
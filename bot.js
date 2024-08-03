const dateMaster = require('node_modules//datejs-master')
const Sentencer = require('node_modules//sentencer');
const Discord = require('node_modules/discord.js');
const logger = require('node_modules/winston');
const auth = require('auth.json');

targetDate = new Date().set({day: 1})
targetDate.addMonths(1)

//channel to target
const CHANNEL_KEY = undefined
//only admin can communicate with bot
const ADMIN_ID = undefined
const BOT_TRIGGER_KEY = "!mother"
const TIME_HOUR = 3600000

// Initialize Discord client
var client = new Discord.Client()
var targetChannel = null

client.login(auth.token)


function updatePrompt(){

	let NewPrompt = Sentencer.make("{{ an_adjective }} {{ noun }}.")
	let prompt_text = 'NEW MONTHLY PROMPT: ' + NewPrompt
	let topic_text = 'CURRENT PROMPT: ' + NewPrompt + '  |  Make anything you want! Art, music, writing, etc.'

    targetChannel.send(prompt_text)
    targetChannel.setTopic(topic_text)

    //set the new target date a month ahead on the 1st
	targetDate = new Date().set({day: 1})
	targetDate.addMonths(1)

}

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(7)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[1]

	//if we want to force a prompt update
    if (primaryCommand == "force") {
        updatePrompt()
    } 
}

function checkDate(){
		let todayDate = new Date()
	    //check if todays date is the target date
		//if so, update prompt
	    if (todayDate.toString("M/d/yyyy") == targetDate.toString("M/d/yyyy")) {
	    	updatePrompt()
	    }
}

client.on('ready', () => {
	 targetChannel = client.channels.get(CHANNEL_KEY)

	 setInterval(function(){
	 	//check to see if the date is the 1st
	 	checkDate()
	 	//check the date every hour
	 }, TIME_HOUR)
})

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }

    // only allow eric and I to communicate with mother
    if (receivedMessage.content.startsWith(BOT_TRIGGER_KEY) && receivedMessage.author.id == ADMIN_ID) {

    	if (receivedMessage.channel.type == "dm"){
        	processCommand(receivedMessage)
    	}
    }
})
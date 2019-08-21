//TO DO
//

var dateMaster = require('./datejs-master')
var Sentencer = require('./sentencer');
const Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
//var targetDate = new Date().set({day: 1})
//targetDate.addMonths(1)
targetDate = new Date().set({day: 1})
targetDate.addMonths(1)
var todayDate = new Date()


// Initialize Discord client
var client = new Discord.Client()
client.login(auth.token)

var channelID = client.id 
var targetChannel = null


function updatePrompt(){

	var NewPrompt = Sentencer.make("{{ an_adjective }} {{ noun }}.")
    targetChannel.send('NEW MONTHLY PROMPT: ' + NewPrompt)
    targetChannel.setTopic('CURRENT PROMPT: ' + NewPrompt + '  |  Make anything you want! Art, music, writing, etc.')

    //set the new target date a month ahead on the 1st
	targetDate = new Date().set({day: 1})
	targetDate.addMonths(1)
	console.log("todays date: " + todayDate)
	console.log("target date: " + targetDate)

}

function processCommand(receivedMessage) {

    let fullCommand = receivedMessage.content.substr(7) // Remove '!mother'
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[1] // The second word is the command

    console.log("Command received: " + primaryCommand)

    if (primaryCommand == "force") {

    	console.log("Command is 'force'")
        updatePrompt()
    } 

}

function checkDate(){

		todayDate = new Date()
		console.log("checking date ...")
		console.log("todays date: " + todayDate.toString("M/d/yyyy"))
    	console.log("target date: " + targetDate.toString("M/d/yyyy"))


	    //check if todays date is the target date
	    if (todayDate.toString("M/d/yyyy") == targetDate.toString("M/d/yyyy")) {

	    	updatePrompt()

	    }

}

client.on('ready', () => {

	//general for testing
	 //targetChannel = client.channels.get('266722720698466304')
	 //monthly-art-challenge in smack chat
	 targetChannel = client.channels.get('611729389834731560')

	 setInterval(function(){

	 	//check to see if the date is the 1st
	 	checkDate()

	 	//check the date every hour
	 }, 3600 * 1000)

})

client.on('message', (receivedMessage) => {

    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {

        return

    }

    console.log("User is" + receivedMessage.author.id)

    // only allow eric and I to communicate with mother
    if (receivedMessage.content.startsWith("!mother") && (receivedMessage.author.id == '266699996559179776'||receivedMessage.author.id == '301054774810378241')) {

    	if (receivedMessage.channel.type == "dm"){

        	processCommand(receivedMessage)

    	}

    }

})
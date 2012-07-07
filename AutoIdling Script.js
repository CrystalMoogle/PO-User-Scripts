//really simple script to make you idle on log on. Requested by [LD]Jirachier :x
//commands are ~idle on/off to turn auto-idling on/off respectively

({
	clientStartUp: function () {
		sys.delayedCall(function() { script.awayFunction(); },1) //apparently it crashes if you call it the instant of starting up...
	}
	,
	awayFunction: function(){
		if(sys.getVal("idle") === "true"){
			client.goAway(true)
		}else{
			client.goAway(false)
		}
	}
	,
	beforeSendMessage: function (msg, channel) {
		 if (msg.substr(0, 6) == "~idle ") {
            sys.stopEvent()
            if (msg.substr(6) == "on") {
                client.goAway(true)
                sys.saveVal('idle', true)
                client.printChannelMessage("+ClientBot: You turned auto-idling on!", channel, false)
                return;
            }
            if (msg.substr(6) == "off") {
                client.goAway(false)
				sys.saveVal('idle', false)
                client.printChannelMessage("+ClientBot: You turned auto-idling off!", channel, false)
                return;
            }
            client.printChannelMessage("+ClientBot: Please use on/off", channel, false)
        }
	}
})
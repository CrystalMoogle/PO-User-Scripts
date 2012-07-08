//really simple script to make you idle on log on. Requested by [LD]Jirachier :x
//commands are ~idle on/off to turn auto-idling on/off respectively
({
    clientStartUp: function () {
        this.stepEvent()
    },
    awayFunction: function () {
        if (sys.getVal("idle") === "true") {
            client.goAway(true)
        } else {
            client.goAway(false)
        }
    },
    stepEvent: function () {
        var id = client.ownId()
        if (id === -1) {
            sys.quickCall(function () {
                script.stepEvent()
            }, 1)
        } else {
            this.awayFunction();
        }
    },
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
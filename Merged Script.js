//this script has all the current scripts merged together into one neat package
//report bugs to Crystal Moogle
//feel free to use it, edit it, improve it, do whatever.
//lot of stuff "borrowed" from main scripts :3
//commands are ~idle on/off, ~etext on/off and ~greentext on/off
//currently needs 2.0.05 to fix channel links
var auth_symbol = {
    "0": "",
    "1": "+",
    "2": "+",
    "3": "+",
    "4": ""
    //change these to what you have set yourself
}
var stalkwords = [] // add stalkwords for you to be pinged format is ["word1","word2"], obviously you can add more than 2
var hilight = "BACKGROUND-COLOR: #ffff00" //change this if you want a different hilight colour when pinged (leave background there unless you want a different style)
var fontcolour = "#000000" //change this for different font colours
var fontstyle = "" //this changes the font type of your text, leave it blank for default
var fontsize = 3 //this changes the font size of your text, 3 is default
var greentext = '#789922' //changes the text when someone quotes with ">" at the start
//these things below shouldn't be touched unless you know what you're doing~
function init() {
        if (sys.getVal('etext') === "true") {
            etext = "true"
        } else {
            etext = "false"
        }
        if (sys.getVal('tgreentext') === "true") {
            tgreentext = "true"
        } else {
            tgreentext = "false"
        }
    }
init()
poScript = ({
    clientStartUp: function () {
        init()
        this.stepEvent()
    },
    awayFunction: function () {
        if (sys.getVal("idle") === "true") {
            client.goAway(true)
        } else {
            client.goAway(false)
        }
    },
    channelLinks: function (string) {
        var channels = client.channelNames()
        var newstring = string
        for (x in channels) {
            if (string.toLowerCase().indexOf("#" + channels[x].toLowerCase()) != -1) {
                var channel = new RegExp("#" + channels[x], "i")
                newstring = string.replace(channel, '<a href="po:join/' + channels[x] + '">#' + channels[x] + "</a>")
            }
        }
        return newstring
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
    html_escape: function (text) {
        var m = String(text);
        if (m.length > 0) {
            var amp = "&am" + "p;";
            var lt = "&l" + "t;";
            var gt = "&g" + "t;";
            return m.replace(/&/g, amp).replace(/</g, lt).replace(/>/g, gt);
        } else {
            return "";
        }
    },
    beforeChannelMessage: function (message, chan, html) {
        var pos = message.indexOf(': ');
        if (pos != -1) {
            if (client.id(message.substring(0, pos)) == -1) {
                return;
            }
            var id = client.id(message.substring(0, pos))
            var playname = message.substring(0, pos)
            var playmessage = this.html_escape(message.substr(pos + 2))
            var msg = playmessage.split(' ')
            for (x in msg) {
                var msgnew = ""
                var msgl = msg[x].length
                var start = msg[x][0]
                var end = msg[x][parseInt(msgl - 1)]
                if (start == ".") {
                    start = msg[x][1]
                }
                if (msg[x].substr(0, 7) == "http://" || msg[x].substr(0, 8) == "https://") {
                    var link = msg[x]
                    msgnew = "<a href = '" + link + "'>" + link + "</a>"
                    playmessage = playmessage.replace(msg[x], msgnew)
                }
                if (((start == "*" && end == "*" && msgl > 2) || ((start == "/" || start == "\\") && (end == "/" || end == "\\") && msgl > 2) || (start == "_" && end == "_" && msgl > 2)) && etext === "true") {
                    var modifier = ""
                    var endmodifier = ""
                    if (start == "*") {
                        modifier = "<b>"
                        endmodifier = "</b>"
                    }
                    if (start == "/" || start == "\\") {
                        modifier = "<i>"
                        endmodifier = "</i>"
                    }
                    if (start == "_") {
                        modifier = "<u>"
                        endmodifier = "</u>"
                    }
                    var i = msg[x].lastIndexOf(end)
                    if (i >= 0 && i + end.length >= msg[x].length) {
                        newmsg = msg[x].substring(0, i) + endmodifier
                    }
                    msgnew = newmsg.replace(start, modifier)
                    playmessage = playmessage.replace(msg[x], msgnew)
                }
            }
            var colour = client.color(id)
            if (colour === "#000000") {
                var clist = ['#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f', '#1b1390', '#028678', '#0324b1'];
                colour = clist[src % clist.length];
            }
            if (playmessage.toLowerCase().indexOf(client.ownName().toLowerCase()) != -1 && playname !== client.ownName()) {
                var name = new RegExp("\\b" + client.ownName() + "\\b", "i")
                newplaymessage = playmessage.replace(name, "<span style='" + hilight + "'>" + client.ownName() + "</span>")
                if (newplaymessage !== playmessage) {
                    playmessage = newplaymessage.replace(newplaymessage, "<i> " + newplaymessage + "</i><ping/>")
                }
            }
            for (x in stalkwords) {
                if (playmessage.toLowerCase().indexOf(stalkwords[x].toLowerCase()) != -1 && playname !== client.ownName()) {
                    var stalk = new RegExp("\\b" + stalkwords[x] + "\\b", "i")
                    newplaymessage = playmessage.replace(stalk, "<span style='" + hilight + "'>" + stalkwords[x] + "</span>")
                    if (newplaymessage !== playmessage) {
                        playmessage = newplaymessage.replace(newplaymessage, "<i> " + newplaymessage + "</i><ping/>")
                    }
                }
            }
            if (playmessage.substr(0, 4) == "&gt;" && tgreentext === "true") {
                playmessage = "<font color = '" + greentext + "'>" + playmessage + "</font>"
            } else {
                playmessage = "<font color = '" + fontcolour + "'>" + playmessage
            }
            playmessage = this.channelLinks(playmessage)
            if (client.auth(id) > 0 && client.auth(id) < 4) {
                client.printChannelMessage("<font face ='" + fontstyle + "'><font size = " + fontsize + "><font color='" + colour + "'><timestamp/><b> " + auth_symbol[client.auth(id)] + "<i>" + playname + ": </font></i></b>" + playmessage, chan, true)
                sys.stopEvent()
                return;
            }
            client.printChannelMessage("<font color='" + colour + "'><timestamp/><b>" + playname + ": </font></b>" + playmessage, chan, true)
            sys.stopEvent()
        }
    },
    beforeSendMessage: function (msg, channel) {
        if (msg.substr(0, 7) == "~etext ") {
            sys.stopEvent()
            if (msg.substr(7) == "on") {
                etext = "true"
                sys.saveVal('etext', true)
                client.printChannelMessage("+ClientBot: You turned Enriched text on!", channel, false)
                return;
            }
            if (msg.substr(7) == "off") {
                etext = "false"
                sys.saveVal('etext', false)
                client.printChannelMessage("+ClientBot: You turned Enriched text off!", channel, false)
                return;
            }
            client.printChannelMessage("+ClientBot: Please use on/off", channel, false)
        }
        if (msg.substr(0, 11) == "~greentext ") {
            sys.stopEvent()
            if (msg.substr(11) == "on") {
                tgreentext = "true"
                sys.saveVal('tgreentext', true)
                client.printChannelMessage("+ClientBot: You turned greentext on!", channel, false)
                return;
            }
            if (msg.substr(11) == "off") {
                tgreentext = "false"
                sys.saveVal('tgreentext', false)
                client.printChannelMessage("+ClientBot: You turned greentext off!", channel, false)
                return;
            }
            client.printChannelMessage("+ClientBot: Please use on/off", channel, false)
        }
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
        if (msg.substr(0, 6) == "~eval ") {
            sys.stopEvent()
            var cd = msg.substr(6)
            eval(cd)
        }
    },
})
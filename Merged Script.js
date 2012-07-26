//this script has all the current scripts merged together into one neat package
//report bugs to Crystal Moogle
//feel free to use it, edit it, improve it, do whatever.
//lot of stuff "borrowed" from main scripts and stackoverflow~ :3
//commands found by using ~commandlist
//currently needs 2.0.05 to fix channel links
var auth_symbol = {
    "0": "",
    "1": "+",
    "2": "+",
    "3": "+",
    "4": ""
    //change these to what you have set yourself and more if needed using the format "x": "symbol",
}
var auth_style = {
    "0": "<b>",
    "1": "<i><b>",
    "2": "<i><b>",
    "3": "<i><b>",
    "4": "<b>"
    //change this to the style you have set, only start tags are needed
}
var commandsymbol = "~" //change this if you want to use another symbol. Make sure it is 1 character still and if you use "!" or "/" that it doesn't conflict with existing scripts
var stalkwords = [] // add stalkwords for you to be pinged format is ["word1","word2"], obviously you can add more than 2
var hilight = "BACKGROUND-COLOR: #ffcc00" //change this if you want a different hilight colour when pinged (leave background there unless you want a different style)
var fontcolour = "#000000" //change this for different font colours
var fonttype = "" //this changes the font type of your text, leave it blank for default
var fontstyle = "" //this changes the style of the font (bold/italics/etc), start tags only are needed.
var fontsize = 3 //this changes the font size of your text, 3 is default
var greentext = '#789922' //changes the text when someone quotes with ">" at the start
//var punctuation = [".", ",", "\"", "'", "&", ";", ":"] //list of common punctuation, increase or decrease as you see fit. No longer needed with the new way of doing enriched text, will probably remove after more testing is done on the new method
var flash = true //turns flashes on/off (probably best to use ~flash on/off though)
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
        if (sys.getVal('stalkwords') !== "") {
            var nstalkwords = sys.getVal('stalkwords').split(",")
            stalkwords = nstalkwords.concat(stalkwords)
            stalkwords = eliminateDuplicates(stalkwords)
        }
    }

    function eliminateDuplicates(arr) { //stolen from http://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/
        var i,
        len = arr.length,
            out = [],
            obj = {};
        for (i = 0; i < len; i++) {
            obj[arr[i]] = 0;
        }
        for (i in obj) {
            out.push(i);
        }
        return out;
    }
if (client.ownId() !== -1) {
    init()
}
client.network().playerLogin.connect(function () {
    script.awayFunction()
    init()
})
poScript = ({
    awayFunction: function () {
        if (sys.getVal("idle") === "true") {
            client.goAway(true)
        } else {
            client.goAway(false)
        }
    },
    tagEnd: function (string) {
        newstring = string.replace(/</g, "</")
        return newstring
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
    htmlLinks: function (text) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        var found = text.match(exp)
        var newtext
        var newfound
        for (x in found) {
            newfound = found[x].replace(/\//g	, sys.md5('/'))
            newfound = newfound.replace(/_/g, sys.md5('_'))
            text = text.replace(found[x], newfound)
            newtext = ("<a href ='" + newfound + "'>" + newfound + "</a>").replace(/&amp;/gi, "&")
            text = text.replace(newfound, newtext)
        }
        if (etext == "true") {
            text = this.enrichedText(text)
        }
        var expt = new RegExp(sys.md5('/'), "g")
        if (text.search(expt) != -1) {
            text = text.replace(expt, "/")
        }
        expt = new RegExp(sys.md5('_'), "g")
        if (text.search(expt) != -1) {
            text = text.replace(expt, "_")
        }
        return text
    },
    enrichedText: function (text) {
        var expi = new RegExp("/(\\S+)/(?![^\\s<]*>)", "g")
        text = text.replace(expi, "<i>$1</i>")
        var expii = new RegExp("\\\\(\\S+)\\\\(?![^\\s<]*>)", "g")
        text = text.replace(expii, "<i>$1</i>")
        var expb = new RegExp("\\*(\\S+)\\*(?![^\\s<]*>)", "g")
        text = text.replace(expb, "<b>$1</b>")
        var expu = new RegExp("_(\\S+)_(?![^\\s<]*>)", "g")
        text = text.replace(expu, "<u>$1</u>")
        return text
    },
    sendMessage: function (message, channel) {
        if (channel === undefined) {
            channel = client.currentChannel()
        }
        client.printChannelMessage(message, channel, false)
        return;
    },
    beforeChannelMessage: function (message, channel, html) {
        var chan = channel
        var pos = message.indexOf(': ');
        if (pos != -1) {
            if (client.id(message.substring(0, pos)) == -1) {
                return;
            }
            var id = client.id(message.substring(0, pos))
            if (client.isIgnored(id)) {
                return;
            }
            var playname = message.substring(0, pos)
            var playmessage = this.html_escape(message.substr(pos + 2))
            var msg = playmessage.split(' ')
            var link, linkplaceholder
            /*for (x in msg) {
                var msgnew = "",
                    otherend = ""
                var msgl = msg[x].length
                var nmsgl = msg[x].length
                var start = msg[x][0]
                var end = msg[x][parseInt(msgl - 1)]
                for (y in punctuation) {
                    if (start == punctuation[y]) {
                        start = msg[x][1]
                        msgl = msgl - 1
                    }
                    if (end == punctuation[y]) {
                        end = msg[x][parseInt(nmsgl - 2)]
                        otherend = punctuation[y]
                        msgl = msgl - 1
                    }
                }
                if (((start == "*" && end == "*" && msgl > 2) || ((start == "/" || start == "\\") && (end == "/" || end == "\\") && msgl > 2) || (start == "_" && end == "_" && msgl > 2)) && etext === "true") {
                    var modifier, endmodifier, newmsg
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
                    if (i >= 0) {
                        newmsg = msg[x].substring(0, i) + endmodifier + (otherend == undefined ? "" : otherend)
                    }
                    msgnew = newmsg.replace(start, modifier)
                    playmessage = playmessage.replace(msg[x], msgnew)
                }
            }*/
            var colour = client.color(id)
            if (colour === "#000000") {
                var clist = ['#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f', '#1b1390', '#028678', '#0324b1'];
                colour = clist[src % clist.length];
            }
            var ownName = this.html_escape(client.ownName())
            if (playmessage.toLowerCase().indexOf(ownName.toLowerCase()) != -1 && playname !== ownName && flash !== false) {
                var name = new RegExp("\\b" + ownName + "\\b", "i")
                newplaymessage = playmessage.replace(name, "<span style='" + hilight + "'>" + client.ownName() + "</span>")
                if (newplaymessage !== playmessage) {
                    playmessage = newplaymessage.replace(newplaymessage, "<i> " + newplaymessage + "</i><ping/>")
                }
            }
            for (x in stalkwords) {
                var stalk = new RegExp("\\b" + stalkwords[x] + "\\b", "i")
                var stalks = playmessage.match(stalk)
                if (playmessage.toLowerCase().search(stalk) != -1 && playname !== client.ownName() && flash !== false) {
                    newplaymessage = playmessage.replace(stalk, "<span style='" + hilight + "'>" + stalks + "</span>")
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
            var symbolLength = 0
            for (x in auth_symbol) {
                if (x > symbolLength) {
                    symbolLength = x
                }
            }
            var auth = client.auth(id)
            if (auth > symbolLength) {
                auth = 0
            }
            playmessage = client.channel(chan).addChannelLinks(playmessage)
            playmessage = this.htmlLinks(playmessage)
            client.printChannelMessage("<font face ='" + fonttype + "'><font size = " + fontsize + "><font color='" + colour + "'><timestamp/> " + auth_symbol[auth] + auth_style[auth] + playname + ": </font>" + this.tagEnd(auth_style[auth]) + fontstyle + playmessage + this.tagEnd(fontstyle), chan, true)
            sys.stopEvent()
        }
    },
    beforeSendMessage: function (message, channel) {
        if (message[0] == commandsymbol) {
            var command, commandData
            var pos = message.indexOf(' ');
            if (pos != -1) {
                command = message.substring(1, pos).toLowerCase();
                commandData = message.substr(pos + 1);
            } else {
                command = message.substr(1).toLowerCase();
            }
            if (command == "commandlist" || command == "commandslist") {
                sys.stopEvent()
                this.sendMessage("*** Client Commands ***")
                this.sendMessage(commandsymbol + "etext on/off: Allows you to turn Enriched text on/off")
                this.sendMessage(commandsymbol + "greentext on/off: Allows you to turn greentext on/off")
                this.sendMessage(commandsymbol + "idle on/off: Allows you to turn auto-idle on/off")
                this.sendMessage(commandsymbol + "goto channel: Allows you to switch to that channel (joins if you're not in that channel)")
                this.sendMessage(commandsymbol + "stalkwords: Allows you to view your current stalkwords")
                this.sendMessage(commandsymbol + "[add/remove]stalkword: Allows you to add/remove stalkwords")
                this.sendMessage(commandsymbol + "flash on/off: Allows you to turn flashes on/off")
            }
            if (command == "etext") {
                sys.stopEvent()
                if (commandData == "on") {
                    etext = "true"
                    sys.saveVal('etext', true)
                    this.sendMessage("+ClientBot: You turned Enriched text on!")
                    return;
                }
                if (commandData == "off") {
                    etext = "false"
                    sys.saveVal('etext', false)
                    this.sendMessage("+ClientBot: You turned Enriched text off!")
                    return;
                }
                this.sendMessage("+ClientBot: Please use on/off")
            }
            if (command == "greentext") {
                sys.stopEvent()
                if (commandData == "on") {
                    tgreentext = "true"
                    sys.saveVal('tgreentext', true)
                    this.sendMessage("+ClientBot: You turned greentext on!")
                    return;
                }
                if (commandData == "off") {
                    tgreentext = "false"
                    sys.saveVal('tgreentext', false)
                    this.sendMessage("+ClientBot: You turned greentext off!")
                    return;
                }
                this.sendMessage("+ClientBot: Please use on/off")
            }
            if (command == "idle") {
                sys.stopEvent()
                if (commandData == "on") {
                    client.goAway(true)
                    sys.saveVal('idle', true)
                    this.sendMessage("+ClientBot: You turned auto-idling on!")
                    return;
                }
                if (commandData == "off") {
                    client.goAway(false)
                    sys.saveVal('idle', false)
                    this.sendMessage("+ClientBot: You turned auto-idling off!")
                    return;
                }
                this.sendMessage("+ClientBot: Please use on/off")
            }
            if (command == "goto") {
                sys.stopEvent()
                var channela = commandData
                var channels = client.channelNames()
                for (x in channels) {
                    if (channela === channels[x].toLowerCase()) {
                        channela = channels[x]
                        if (!client.hasChannel(client.channelId(channela))) {
                            client.join(channela)
                            return;
                        }
                        client.activateChannel(channela)
                        return;
                    }
                }
                this.sendMessage("+ClientBot: That is not a channel!")
            }
            if (command == "stalkwords") {
                sys.stopEvent()
                this.sendMessage("+ClientBot: Your stalkwords are: " + stalkwords)
            }
            if (command == "addstalkword") {
                sys.stopEvent()
                var nstalkwords = commandData
                if (nstalkwords.search(/, /g) !== -1 || nstalkwords.search(/ ,/g) !== -1) {
                    nstalkwords = nstalkwords.replace(/, /g, ",").replace(/ ,/g, ",")
                }
                nstalkwords = nstalkwords.split(",")
                stalkwords = eliminateDuplicates(nstalkwords.concat(stalkwords))
                sys.saveVal('stalkwords', stalkwords.toString())
                this.sendMessage("+ClientBot: You added " + commandData + " to your stalkwords!")
            }
            if (command == "removestalkword") {
                sys.stopEvent()
                commandData = commandData.toLowerCase()
                for (x in stalkwords) {
                    if (stalkwords[x].toLowerCase() === commandData) {
                        stalkwords.splice(x, 1)
                        sys.saveVal('stalkwords', stalkwords.toString())
                        this.sendMessage("+ClientBot: You removed " + commandData + " from your stalkwords!")
                        return;
                    }
                }
                this.sendMessage("+ClientBot: " + commandData + " is not a stalkword!")
            }
            if (command == "flash" || command == "flashes") {
                sys.stopEvent()
                if (commandData == "on") {
                    flash = true
                    this.sendMessage("+ClientBot: You turned flashes on!")
                    return;
                } else {
                    flash = false
                    this.sendMessage("+ClientBot: You turned flashes off!")
                    return;
                }
            }
            if (command == "eval") {
                sys.stopEvent()
                eval(commandData)
            }
            if (command == "evalp") {
                sys.stopEvent()
                var bindChannel = channel;
                try {
                    var res = eval(commandData);
                    this.sendMessage("Got from eval: " + res, bindChannel);
                } catch (err) {
                    this.sendMessage("Error in eval: " + err, bindChannel);
                }
                return;
            }
        }
    },
})
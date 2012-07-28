//this script has all the current scripts merged together into one neat package
//report bugs to Crystal Moogle
//feel free to use it, edit it, improve it, do whatever.
//lot of stuff "borrowed" from main scripts and stackoverflow~ :3
//commands found by using ~commandlist
//currently needs 2.0.05 to fix channel links

//Config settings has been moved to ~commandslist
//Make sure to check them to set everything :x
//these things below shouldn't be touched unless you know what you're doing~
var script_url = "https://raw.github.com/CrystalMoogle/PO-User-Scripts/master/Merged%20Script.js" //where the script is stored
    function init() {
        if(sys.getVal('etext') === "true") {
            etext = "true"
        } else {
            etext = "false"
        }
        if(sys.getVal('tgreentext') === "true") {
            tgreentext = "true"
        } else {
            tgreentext = "false"
        }
        if(sys.getVal('flash') === "false") { //making sure flash is on always unless specified to not be
            flash = false
        } else {
            flash = true
        }
        if(sys.getVal('friendsflash') === "true") {
            friendsflash = true
        } else {
            friendsflash = false
        }
        if(sys.getVal('checkversion') === "true") {
            checkversion = "true"
        } else {
            checkversion = "false"
        }
        clientbotname = "+ClientBot"
        if(sys.getVal('clientbotname').length > 0) {
            clientbotname = sys.getVal('clientbotname')
        }
        clientbotcolour = "#3DAA68"
        if(sys.getVal('clientbotcolour').length > 0) {
            clientbotcolour = sys.getVal('clientbotcolour')
        }
        greentext = '#789922'
        if(sys.getVal('greentext').length > 0) {
            greentext = sys.getVal('greentext')
        }
        fontcolour = "#000000"
        if(sys.getVal('fontcolour').length > 0) {
            fontcolour = sys.getVal('fontcolour')
        }
        fonttype = ""
        if(sys.getVal('fonttype').length > 0) {
            fonttype = sys.getVal('fonttype')
        }
        fontsize = 3
        if(sys.getVal('fontsize').length > 0) {
            fontsize = sys.getVal('fontsize')
        }
        fontstyle = ""
        if(sys.getVal('fontstyle').length > 0) {
            fontstyle = sys.getVal('fontstyle')
        }
        commandsymbol = "~"
        if(sys.getVal('commandsymbol').length > 0) {
            commandsymbol = sys.getVal('commandsymbol')
        }
        hilight = "BACKGROUND-COLOR: #ffcc00"
        if(sys.getVal('hilight').length > 0) {
            hilight = sys.getVal('hilight')
        }
        stalkwords = []
        friends = []
        ignore = []
        if(sys.getVal('stalkwords') !== "") {
            var nstalkwords = sys.getVal('stalkwords').split(",")
            stalkwords = nstalkwords.concat(stalkwords)
            stalkwords = eliminateDuplicates(stalkwords)
        }
        if(sys.getVal('friends') !== "") {
            var nfriends = sys.getVal('friends').split(",")
            friends = nfriends.concat(friends)
            friends = eliminateDuplicates(friends)
        }
        if(sys.getVal('ignore') !== "") {
            var nignore = sys.getVal('ignore').split(",")
            ignore = nignore.concat(ignore)
            ignore = eliminateDuplicates(ignore)
        }
        auth_symbol = new Array()
        for(var x = 0; x < 5; x++) {
            if(sys.getVal('auth: ' + x).length > 0) {
                auth_symbol[x] = sys.getVal('auth: ' + x)
                continue;
            }
            if(x == 0 || x == 4) {
                auth_symbol[x] = ""
                continue
            }
            auth_symbol[x] = "+"
        }
        auth_style = new Array()
        for(var x = 0; x < 5; x++) {
            if(sys.getVal('auths: ' + x).length > 0) {
                auth_style[x] = sys.getVal('auths: ' + x)
                continue;
            }
            if(x == 0 || x == 4) {
                auth_style[x] = "<b>"
                continue
            }
            auth_style[x] = "<i><b>"
        }
        if(sys.isSafeScripts() !== true) {
            checkScriptVersion()
        }
    }

    function checkScriptVersion(bool) {
        var checkscript, version
        var regex = /"([^"]*)"/g
        if(bool === undefined) {
            bool = false
        }
        if(checkversion === "false" && bool === false) {
            return;
        }
        sys.webCall(script_url, function (resp) {
            if(resp.length === 0) {
                script.sendBotMessage("There was an error accessing the script, paste the contents of (link) into your PO folder and restart, or wait for a client update", undefined, "https://github.com/downloads/coyotte508/pokemon-online/ssl.zip")
                return
            }
            checkscript = resp.split('\n')
            for(x in checkscript) {
                if(checkscript[x].substr(0, 14) == "Script_Version") {
                    version = String(checkscript[x].match(regex))
                }
            };
            if(version === undefined) {
                script.sendBotMessage('There was an error with the version, please report to Crystal Moogle')
                return;
            }
            version = version.replace(/"/g, "")
            var type = {
                "0": "Major Release (huge changes)",
                "1": "Minor Release (new features)",
                "2": "Bug fixes/Minor Update"
            }
            if(version !== Script_Version) {
                var typeno
                nversion = version.split('.')
                cversion = Script_Version.split('.')
                for(x in nversion) {
                    if(nversion[x] !== cversion[x]) {
                        typeno = x
                        break;
                    }
                }
                if(typeno === undefined) { //this shouldn't ever happen though
                    return;
                }
                script.sendBotMessage("A client script update is avaiable, type: " + type[typeno] + ". Use " + commandsymbol + "updatescripts. Use " + commandsymbol + "changelog " + version + " to see the changes", undefined, script_url)
                return;
            }
            if(bool === true) {
                script.sendBotMessage("No update detected")
            }
        })
    }

    function eliminateDuplicates(arr) { //stolen from http://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/
        var i,
        len = arr.length,
            out = [],
            obj = {};
        for(i = 0; i < len; i++) {
            obj[arr[i]] = 0;
        }
        for(i in obj) {
            out.push(i);
        }
        return out;
    }
if(client.ownId() !== -1) {
    init()
}
client.network().playerLogin.connect(function () {
    script.awayFunction()
    versionupdate = sys.getVal('versionupdate')
    if(versionupdate.length > 0) {
        var resp = sys.getVal('versionscript')
        if(resp.length === 0) {
            return;
        }
        var checkscript, version
        var regex = /"([^"]*)"/g
        checkscript = resp.split('\n')
        for(x in checkscript) {
            if(checkscript[x].substr(0, 14) == "Script_Version") {
                version = String(checkscript[x].match(regex))
            }
        };
        version = version.replace(/"/g, "")
        if(version === versionupdate) {
            versionupdate = undefined
            sys.changeScript(resp, false)
        }
    }
    init()
})
Script_Version = "1.4.01"
poScript = ({
    clientStartUp: function () {
        this.sendMessage('Script Check: OK')
    },
    awayFunction: function () {
        if(sys.getVal("idle") === "true") {
            client.goAway(true)
        } else {
            client.goAway(false)
        }
    },
    tagEnd: function (string) {
        newstring = string.replace(/</g, "</")
        return newstring
    },
    onPlayerReceived: function (id) {
        var flashvar = ""
        if(friendsflash === true) {
            flashvar = "<ping/>"
        }
        for(x in friends) {
            if(client.name(id).toLowerCase() === friends[x].toLowerCase() && flash === true) {
                this.sendBotMessage("User " + client.name(id) + " has logged in" + flashvar + "", client.currentChannel(), "<ping/>")
            }
        }
        for(x in ignore) {
            if(client.name(id).toLowerCase() === ignore[x].toLowerCase()) {
                client.ignore(id, true)
            }
        }
    },
    html_escape: function (text) {
        var m = String(text);
        if(m.length > 0) {
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
        for(x in found) {
            newfound = found[x].replace(/\//g, sys.md5('/'))
            newfound = newfound.replace(/_/g, sys.md5('_'))
            text = text.replace(found[x], newfound)
            newtext = ("<a href ='" + newfound + "'>" + newfound + "</a>").replace(/&amp;/gi, "&")
            text = text.replace(newfound, newtext)
        }
        if(etext == "true") {
            text = this.enrichedText(text)
        }
        var expt = new RegExp(sys.md5('/'), "g")
        if(text.search(expt) != -1) {
            text = text.replace(expt, "/")
        }
        expt = new RegExp(sys.md5('_'), "g")
        if(text.search(expt) != -1) {
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
    isSafeScripts: function () {
        if(sys.isSafeScripts()) {
            this.sendBotMessage("You have safescripts on, you will not be able to update your scripts through the internet, though it should help against any harmful scripts, to turn it off, untick the box in the Script Window")
            return true
        }
        return false
    },
    sendMessage: function (message, channel) {
        if(channel === undefined) {
            channel = client.currentChannel()
        }
        client.printChannelMessage(message, channel, false)
        return;
    },
    sendBotMessage: function (message, channel, link) {
        if(channel === undefined) {
            channel = client.currentChannel()
        }
        message = this.html_escape(message)
        if(link == "<ping/>") {
            message = message.replace(/&lt;ping\/&gt;/g, link)
        }
        if(message.indexOf("(link)") !== -1 && link !== undefined) {
            message = message.replace(/\(link\)/g, "<a href ='" + link + "'>" + link + "</a>")
        }
        client.printChannelMessage("<font color = '" + this.html_escape(clientbotcolour) + "'><timestamp/><b>" + this.html_escape(clientbotname) + ":</font></b> " + message, channel, true)
        return;
    },
    beforeChannelMessage: function (message, channel, html) {
        var chan = channel
        var bot = false
        if(html == true) {
            return;
        }
        var pos = message.indexOf(': ');
        if(pos != -1) {
            if(client.id(message.substring(0, pos)) == -1 || client.id(message.substring(0, pos)) === undefined) {
                bot = true
            }
            if(bot === false) {
                var id = client.id(message.substring(0, pos))
                if(client.isIgnored(id)) {
                    return;
                }
            }
            var playname = message.substring(0, pos)
            var playmessage = this.html_escape(message.substr(pos + 2))
            var colour = client.color(id)
            if(bot === true) {
                colour = clientbotcolour
            }
            if(colour === "#000000") {
                var clist = ['#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f', '#1b1390', '#028678', '#0324b1'];
                colour = clist[src % clist.length];
            }
            var ownName = this.html_escape(client.ownName())
            if(playmessage.toLowerCase().indexOf(ownName.toLowerCase()) != -1 && playname !== ownName && flash !== false) {
                var name = new RegExp("\\b" + ownName + "\\b", "i")
                newplaymessage = playmessage.replace(name, "<span style='" + hilight + "'>" + client.ownName() + "</span>")
                if(newplaymessage !== playmessage) {
                    playmessage = newplaymessage.replace(newplaymessage, "<i> " + newplaymessage + "</i><ping/>")
                }
            }
            for(x in stalkwords) {
                var stalk = new RegExp("\\b" + stalkwords[x] + "\\b", "i")
                var stalks = playmessage.match(stalk)
                if(playmessage.toLowerCase().search(stalk) != -1 && playname !== client.ownName() && flash !== false) {
                    newplaymessage = playmessage.replace(stalk, "<span style='" + hilight + "'>" + stalks + "</span>")
                    if(newplaymessage !== playmessage) {
                        playmessage = newplaymessage.replace(newplaymessage, "<i> " + newplaymessage + "</i><ping/>")
                    }
                }
            }
            if(playmessage.substr(0, 4) == "&gt;" && tgreentext === "true") {
                playmessage = "<font color = '" + greentext + "'>" + playmessage + "</font>"
            } else {
                playmessage = "<font color = '" + fontcolour + "'>" + playmessage
            }
            var auth = client.auth(id)
            if(auth > 4) {
                auth = 4
            }
            playmessage = client.channel(chan).addChannelLinks(playmessage)
            playmessage = this.htmlLinks(playmessage)
            var symbol = auth_symbol[auth]
            if(bot === true) {
                symbol = ""
            }
            client.printChannelMessage("<font face ='" + fonttype + "'><font size = " + fontsize + "><font color='" + colour + "'><timestamp/> " + symbol + auth_style[auth] + playname + ": </font>" + this.tagEnd(auth_style[auth]) + fontstyle + playmessage + this.tagEnd(fontstyle), chan, true)
            sys.stopEvent()
        }
    },
    beforeSendMessage: function (message, channel) {
        if(message[0] == commandsymbol) {
            var command, commandData, type
            var pos = message.indexOf(' ');
            if(pos != -1) {
                command = message.substring(1, pos).toLowerCase();
                commandData = message.substr(pos + 1);
            } else {
                command = message.substr(1).toLowerCase();
            }
            if(command == "commandlist" || command == "commandslist") {
                sys.stopEvent()
                this.sendMessage("*** Client Commands ***")
                this.sendMessage(commandsymbol + "etext on/off: Allows you to turn Enriched text on/off")
                this.sendMessage(commandsymbol + "greentext on/off: Allows you to turn greentext on/off")
                this.sendMessage(commandsymbol + "idle on/off: Allows you to turn auto-idle on/off")
                this.sendMessage(commandsymbol + "goto channel: Allows you to switch to that channel (joins if you're not in that channel)")
                this.sendMessage(commandsymbol + "stalkwords: Allows you to view your current stalkwords")
                this.sendMessage(commandsymbol + "[add/remove]stalkword: Allows you to add/remove stalkwords")
                this.sendMessage(commandsymbol + "flash on/off: Allows you to turn flashes on/off")
                this.sendMessage(commandsymbol + "friends: Allows you to view your current friends")
                this.sendMessage(commandsymbol + "[add/remove]friend: Allows you to add/remove friends")
                this.sendMessage(commandsymbol + "friendflash: Allows you turn friend flashes on/off")
                this.sendMessage(commandsymbol + "ignorelist: Allows you to view your autoignore list")
                this.sendMessage(commandsymbol + "[add/remove]ignore: Allows you to add/remove people from your ignore list")
                this.sendMessage(commandsymbol + "changebotcolo(u)r: Allows you to change the bot's (client and server) colour")
                this.sendMessage(commandsymbol + "changebotname: Allows you to change clientbot's name")
                this.sendMessage(commandsymbol + "resetbot: Allows you to reset the bot to its default values")
                this.sendMessage(commandsymbol + "checkversion: Allows you to check for updates")
                this.sendMessage(commandsymbol + "updatealert on/off: Allows you to get automatically alerted about new versions")
                this.sendMessage(commandsymbol + "changelog version: Allows you to view the changelog")
                this.sendMessage(commandsymbol + "versions: Allows you to view the current versions")
                this.sendMessage(commandsymbol + "updatescripts: Allows you to updatescripts")
                this.sendMessage(commandsymbol + "authsymbols auth:symbol: Allows you to change authsymbols. If symbol is left blank, then it removes the current auth symbol")
                this.sendMessage(commandsymbol + "authstyle auth:htmltag: Allows you to change the name style of auth. Make sure to use start tags only. If htmltag is left blank, then it will remove the current style")
                this.sendMessage(commandsymbol + "highlight colour: Allows you to change the colour of the highlight when flashed")
                this.sendMessage(commandsymbol + "commandsymbol symbol: Allows you to change the command symbol")
                this.sendMessage(commandsymbol + "fontcommands: Shows you the font command details")
            }
            if(command == "fontcommands") {
                sys.stopEvent()
                this.sendMessage("*** Font Command Details ***")
                this.sendMessage("Command: " + commandsymbol + "font type:modifier")
                this.sendMessage("Type: Types are 'colo(u)r', 'style', 'type', 'size'")
                this.sendMessage("Colour: Defines the colour of the font")
                this.sendMessage("Style: Defines the style of the font (bold/italics/underline)")
                this.sendMessage("Type: Defines the font face")
                this.sendMessage("Size: Defines the font size")
                this.sendMessage("Modifier: Modifiers vary from types. Colour modifiers are any valid colour. Style is any valid HTML start tag. Type is any type of font face. Size is any number")
                this.sendMessage("Example: " + commandsymbol + "font color:red, will make all text red")
                return;
            }
            if(command == "etext") {
                sys.stopEvent()
                if(commandData == "on") {
                    etext = "true"
                    sys.saveVal('etext', true)
                    this.sendBotMessage("You turned Enriched text on!")
                    return;
                }
                if(commandData == "off") {
                    etext = "false"
                    sys.saveVal('etext', false)
                    this.sendBotMessage("You turned Enriched text off!")
                    return;
                }
                this.sendBotMessage("Please use on/off")
            }
            if(command == "greentext") {
                sys.stopEvent()
                if(commandData == "on") {
                    tgreentext = "true"
                    sys.saveVal('tgreentext', true)
                    this.sendBotMessage("You turned greentext on!")
                    return;
                }
                if(commandData == "off") {
                    tgreentext = "false"
                    sys.saveVal('tgreentext', false)
                    this.sendBotMessage("You turned greentext off!")
                    return;
                }
                this.sendBotMessage("Please use on/off")
            }
            if(command == "idle") {
                sys.stopEvent()
                if(commandData == "on") {
                    client.goAway(true)
                    sys.saveVal('idle', true)
                    this.sendBotMessage("You turned auto-idling on!")
                    return;
                }
                if(commandData == "off") {
                    client.goAway(false)
                    sys.saveVal('idle', false)
                    this.sendBotMessage("You turned auto-idling off!")
                    return;
                }
                this.sendBotMessage("Please use on/off")
            }
            if(command == "checkversion") {
                sys.stopEvent()
                if(this.isSafeScripts()) {
                    return;
                }
                this.sendBotMessage("Checking script version please wait. (Current Version: " + Script_Version + ")")
                checkScriptVersion(true)
                return;
            }
            if(command == "updatealert") {
                sys.stopEvent()
                if(this.isSafeScripts()) {
                    return;
                }
                if(commandData == "on") {
                    checkversion = true
                    sys.saveVal('checkversion', true)
                    this.sendBotMessage("You now get alerted about new versions")
                    checkScriptVersion()
                    return;
                }
                if(commandData == "off") {
                    checkversion = false
                    sys.saveVal('checkversion', false)
                    this.sendBotMessage("You no longer get alerted about new versions")
                    return;
                }
                this.sendBotMessage("Please use on/off")
            }
            if(command == "goto") {
                sys.stopEvent()
                var channela = commandData
                var channels = client.channelNames()
                for(x in channels) {
                    if(channela === channels[x].toLowerCase()) {
                        channela = channels[x]
                        if(!client.hasChannel(client.channelId(channela))) {
                            client.join(channela)
                            return;
                        }
                        client.activateChannel(channela)
                        return;
                    }
                }
                this.sendBotMessage("That is not a channel!")
            }
            if(command == "stalkwords") {
                sys.stopEvent()
                this.sendBotMessage("Your stalkwords are: " + stalkwords)
            }
            if(command == "addstalkword") {
                sys.stopEvent()
                var nstalkwords = commandData
                if(nstalkwords.search(/, /g) !== -1 || nstalkwords.search(/ ,/g) !== -1) {
                    nstalkwords = nstalkwords.replace(/, /g, ",").replace(/ ,/g, ",")
                }
                nstalkwords = nstalkwords.split(",")
                stalkwords = eliminateDuplicates(nstalkwords.concat(stalkwords))
                sys.saveVal('stalkwords', stalkwords.toString())
                this.sendBotMessage("You added " + commandData + " to your stalkwords!")
            }
            if(command == "removestalkword") {
                sys.stopEvent()
                commandData = commandData.toLowerCase()
                for(x in stalkwords) {
                    if(stalkwords[x].toLowerCase() === commandData) {
                        stalkwords.splice(x, 1)
                        sys.saveVal('stalkwords', stalkwords.toString())
                        this.sendBotMessage("You removed " + commandData + " from your stalkwords!")
                        return;
                    }
                }
                this.sendBotMessage("" + commandData + " is not a stalkword!")
            }
            if(command == "flash" || command == "flashes") {
                sys.stopEvent()
                if(commandData == "on") {
                    flash = true
                    sys.saveVal('flash', true)
                    this.sendBotMessage("You turned flashes on!")
                    return;
                } else {
                    flash = false
                    sys.saveVal('flash', false)
                    this.sendBotMessage("You turned flashes off!")
                    return;
                }
            }
            if(command == "friends") {
                sys.stopEvent()
                this.sendBotMessage("Your friends are: " + friends)
            }
            if(command == "addfriend") {
                sys.stopEvent()
                var nfriends = commandData
                if(nfriends.search(/, /g) !== -1 || nfriends.search(/ ,/g) !== -1) {
                    nfriends = nfriends.replace(/, /g, ",").replace(/ ,/g, ",")
                }
                nfriends = nfriends.split(",")
                friends = eliminateDuplicates(nfriends.concat(friends))
                sys.saveVal('friends', friends.toString())
                this.sendBotMessage("You added " + commandData + " to your friends!")
            }
            if(command == "removefriend") {
                sys.stopEvent()
                commandData = commandData.toLowerCase()
                for(x in friends) {
                    if(friends[x].toLowerCase() === commandData) {
                        friends.splice(x, 1)
                        sys.saveVal('friends', friends.toString())
                        this.sendBotMessage("You removed " + commandData + " from your friends!")
                        return;
                    }
                }
                this.sendBotMessage(commandData + " is not a friend!")
            }
            if(command == "friendflash" || command == "friendsflash") {
                sys.stopEvent()
                if(commandData === "on") {
                    friendsflash = true
                    sys.saveVal('friendsflash', true)
                    this.sendBotMessage("You turned friend flashes on!")
                    return;
                } else {
                    friendsflash = false
                    sys.saveVal('friendsflash', false)
                    this.sendBotMessage("You turned friend flashes off!")
                }
                return;
            }
            if(command == "ignorelist") {
                sys.stopEvent()
                this.sendBotMessage("Your ignorelist is: " + ignore)
            }
            if(command == "addignore") {
                sys.stopEvent()
                if(commandData === client.ownName()) {
                    return;
                }
                var nignore = commandData
                if(nignore.search(/, /g) !== -1 || nignore.search(/ ,/g) !== -1) {
                    nignore = nignore.replace(/, /g, ",").replace(/ ,/g, ",")
                }
                nignore = nignore.split(",")
                ignore = eliminateDuplicates(nignore.concat(ignore))
                sys.saveVal('ignore', ignore.toString())
                if(client.id(commandData) != -1) {
                    client.ignore(client.id(commandData), true)
                }
                this.sendBotMessage("You added " + commandData + " to your ignorelist!")
            }
            if(command == "removeignore") {
                sys.stopEvent()
                commandData = commandData.toLowerCase()
                for(x in ignore) {
                    if(ignore[x].toLowerCase() === commandData) {
                        ignore.splice(x, 1)
                        sys.saveVal('ignore', ignore.toString())
                        if(client.id(commandData) != -1) {
                            client.ignore(client.id(commandData), false)
                        }
                        this.sendBotMessage("You removed " + commandData + " from your ignorelist!")
                        return;
                    }
                }
                this.sendBotMessage(commandData + " is not on the ignorelist!")
            }
            if(command == "changebotname") {
                sys.stopEvent()
                if(commandData == undefined) {
                    return;
                }
                clientbotname = commandData
                this.sendBotMessage(clientbotname + " is now your clientbot's name!")
                sys.saveVal("clientbotname", clientbotname)
                return;
            }
            if(command == "changebotcolour" || command == "changebotcolor") {
                sys.stopEvent()
                if(commandData == undefined) {
                    return;
                }
                clientbotcolour = commandData
                this.sendBotMessage(clientbotcolour + " is now your clientbot's colour!")
                sys.saveVal("clientbotcolour", clientbotcolour)
                return;
            }
            if(command == "greentextcolor" || command == "greentextcolour") {
                sys.stopEvent()
                if(commandData == undefined) {
                    return;
                }
                greentext = commandData
                this.sendBotMessage(greentext + " is now your greentext colour!")
                sys.saveVal("greentext", greentext)
                return;
            }
            if(command == "resetbot") {
                sys.stopEvent()
                clientbotcolour = "#3DAA68"
                clientbotname = "+ClientBot"
                sys.saveVal("clientbotcolour", clientbotcolour)
                sys.saveVal("clientbotname", clientbotname)
                this.sendBotMessage("You reset your bot to default values")
                return;
            }
            if(command == "font") {
                sys.stopEvent()
                if(commandData == undefined) {
                    return
                }
                var type = commandData.split(":")
                if(type.length < 1) {
                    this.sendBotMessage('Usage is ' + commandsymbol + 'font type:modifier')
                    return;
                }
                var modifier = type[1]
                var types = ["colour", "color", "style", "type", "size"]
                if(types.indexOf(type[0]) === -1) {
                    this.sendBotMessage('Invalid type, valid types are: colo(u)r, style, type, size')
                    return
                }
                if(type[0] === "colour" || type[0] === "color") {
                    if(modifier === undefined || modifier == "") {
                        modifier = "#000000"
                        this.sendBotMessage("You changed your font style to the default")
                        return;
                    }
                    fontcolour = modifier
                    sys.saveVal('fontcolour', modifier)
                    this.sendBotMessage("You changed your font colour to: " + modifier)
                    return;
                }
                if(type[0] === "style") {
                    if(modifier === undefined || modifier == "") {
                        modifier = ""
                        this.sendBotMessage("You changed your font style to the default")
                        return
                    }
                    if(modifier.indexOf('</') !== -1) {
                        this.sendBotMessage("End tags are not needed, please only use start ones")
                        return;
                    }
                    fontstyle = modifier
                    sys.saveVal('fontstyle', modifier)
                    this.sendBotMessage("You changed your font style to: " + modifier)
                    return;
                }
                if(type[0] === "type") {
                    if(modifier === undefined || modifier == "") {
                        modifier = ""
                        this.sendBotMessage("You changed your font style to the default")
                        return;
                    }
                    fonttype = modifier
                    sys.saveVal('fonttype', modifier)
                    this.sendBotMessage("You changed your font to: " + modifier)
                    return;
                }
                if(type[0] === "size") {
                    if(modifier === undefined || modifier == "" || isNaN(parseInt(modifier))) {
                        modifier = 3
                        this.sendBotMessage("You changed your font style to the default")
                        return;
                    }
                    fontsize = modifier
                    sys.saveVal('fontsize', modifier)
                    this.sendBotMessage("You changed your font size to: " + modifier)
                    return;
                }
            }
            if(command == "changelog") {
                sys.stopEvent()
                if(this.isSafeScripts()) {
                    return;
                }
                var changelog = sys.synchronousWebCall("https://raw.github.com/gist/3189629/ChangeLog.json")
                if(changelog.length < 1) {
                    this.sendBotMessage("Error retrieving file")
                    return;
                }
                changelog = JSON.parse(changelog)
                if(changelog.versions[commandData] === undefined) {
                    this.sendBotMessage("Version does not exist! Use " + commandsymbol + "versions to check versions")
                    return;
                }
                var details = changelog.versions[commandData].split('\n')
                this.sendBotMessage("Details for version: " + commandData)
                for(x in details) {
                    this.sendBotMessage(details[x])
                }
                return;
            }
            if(command == "versions") {
                sys.stopEvent()
                var version = []
                if(this.isSafeScripts()) {
                    return;
                }
                var changelog = sys.synchronousWebCall("https://raw.github.com/gist/3189629/ChangeLog.json")
                if(changelog.length < 1) {
                    this.sendBotMessage("Error retrieving file")
                    return;
                }
                changelog = JSON.parse(changelog)
                for(x in changelog.versions) {
                    version.push(" " + x)
                }
                this.sendBotMessage('Versions of this script are: ' + version)
                return;
            }
            if(command == "updatescripts") {
                sys.stopEvent()
                if(this.isSafeScripts()) {
                    return;
                }
                this.sendBotMessage("Fetching scripts...");
                var updateURL = script_url
                if(commandData !== undefined && (commandData.substring(0, 7) == 'http://' || commandData.substring(0, 8) == 'https://')) {
                    updateURL = commandData;
                }
                var channel_local = channel;
                var changeScript = function (resp) {
                    if(resp === "") {
                        this.sendBotMessage("There was an error accessing the script, paste the contents of (link) into your PO folder and restart, or wait for a client update", undefined, "https://github.com/downloads/coyotte508/pokemon-online/ssl.zip")
                        return
                    }
                    var checkscript = resp.split('\n')
                    var regex = /"([^"]*)"/g
                    for(x in checkscript) {
                        if(checkscript[x].substr(0, 14) == "Script_Version") {
                            version = String(checkscript[x].match(regex))
                        }
                    };
                    version = version.replace(/"/g, "")
                    try {
                        sys.changeScript(resp, false);
                        sys.saveVal("versionupdate", version)
                        sys.saveVal('versionscript', resp)
                        script.sendBotMessage('Scripts Check: OK')
                    } catch(err) {
                        sys.changeScript(sys.getVal('versionscript'), false);
                    }
                };
                this.sendBotMessage("Fetching scripts from (link)", channel_local, updateURL);
                sys.webCall(updateURL, changeScript);
                return;
            }
            if(command == "authsymbol" || command == "authsymbols") {
                sys.stopEvent()
                var symbols = commandData.split(":")
                var auth = symbols[0]
                var symbol = symbols[1]
                if(symbols.length > 2 || symbols.length < 1) {
                    this.sendBotMessage("Command usage is: \"" + commandsymbol + "changesymbols number:symbol\"")
                    return;
                }
                if(isNaN(parseInt(auth))) {
                    this.sendBotMessage("The first parameter must be a number!")
                    return;
                }
                if(auth < 0 || auth > 4) {
                    this.sendBotMessage("Auth must be between 0 and 4")
                    return;
                }
                if(symbol === undefined) {
                    symbol = ""
                }
                auth_symbol[auth] = symbol
                sys.saveVal("auth: " + auth, symbol)
                if(symbol === "") {
                    this.sendBotMessage("Auth " + auth + " now has no symbol")
                    return;
                }
                this.sendBotMessage("Auth symbol for auth " + auth + " is " + symbol)
                return;
            }
            if(command == "authstyle") {
                sys.stopEvent()
                var styles = commandData.split(":")
                var auth = styles[0]
                var style = styles[1]
                if(styles.length > 2 || styles.length < 1) {
                    this.sendBotMessage("Command usage is: \"" + commandstyle + "changestyles number:html\"")
                    return;
                }
                if(isNaN(parseInt(auth))) {
                    this.sendBotMessage("The first parameter must be a number!")
                    return;
                }
                if(auth < 0 || auth > 4) {
                    this.sendBotMessage("Auth must be between 0 and 4")
                    return;
                }
                if(style.indexOf('</') !== -1) {
                    this.sendBotMessage("End tags are not needed, please only use start ones")
                    return;
                }
                if(style === undefined) {
                    style = ""
                }
                auth_style[auth] = style
                sys.saveVal("auth: " + auth, style)
                if(style === "") {
                    this.sendBotMessage("Auth " + auth + " now has no style")
                    return;
                }
                this.sendBotMessage("Auth style for auth " + auth + " is " + style)
                return;
            }
            if(command == "commandsymbol") {
                sys.stopEvent()
                var symbol = commandData
                if(symbol === undefined) {
                    return;
                }
                if(symbol.length !== 1) {
                    this.sendBotMessage("Must be 1 character long")
                    return;
                }
                if(symbol === "!" || symbol === "/") {
                    this.sendBotMessage("Warning: This symbol is the same one used for most server scripts, you can still use it for client scripts, but it may interfere with server ones")
                }
                commandsymbol = symbol
                sys.saveVal('commandsymbol', symbol)
                this.sendBotMessage("Command symbol is set to: " + symbol)
                return;
            }
            if(command == "highlight" || command == "flashcolour") {
                sys.stopEvent()
                if(commandData === undefined) {
                    hilight = "BACKGROUND-COLOR: #ffcc00"
                    sys.saveVal('hilight', hilight)
                    this.sendBotMessage("Highlight colour set to the default")
                    return;
                }
                hilight = "BACKGROUND-COLOR: " + commandData
                sys.saveVal('hilight', hilight)
                this.sendBotMessage("Highlight colour set to: " + hilight)
                return;
            }
            if(command == "eval") {
                sys.stopEvent()
                eval(commandData)
            }
            if(command == "evalp") {
                sys.stopEvent()
                var bindChannel = channel;
                try {
                    var res = eval(commandData);
                    this.sendMessage("Got from eval: " + res, bindChannel);
                } catch(err) {
                    this.sendMessage("Error in eval: " + err, bindChannel);
                }
                return;
            }
        }
    },
})
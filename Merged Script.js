//this script has all the current scripts merged together into one neat package
//report bugs to Crystal Moogle
//feel free to use it, edit it, improve it, do whatever.
//lot of stuff "borrowed" from main scripts and stackoverflow~ :3
//commands found by using ~commandlist
//currently needs 2.0.05 to fix channel links
//Config settings has been moved to ~commandslist
//Make sure to check them to set everything :x
//these things below shouldn't be touched unless you know what you're doing~
var script_url = "https://raw.github.com/CrystalMoogle/PO-User-Scripts/master/Merged%20Script.js"; //where the script is stored
function init() { //defines all the variables that are going to be used in the script, uses default if no saved settings are found
    if(sys.getVal('etext') === "true") {
        etext = "true";
    } else {
        etext = "false";
    };
    if(sys.getVal('tgreentext') === "true") {
        tgreentext = "true";
    } else {
        tgreentext = "false";
    };
    if(sys.getVal('flash') === "false") { //making sure flash is on always unless specified to not be
        flash = false;
    } else {
        flash = true;
    };
    if(sys.getVal('autoresponse') === true) {
        autoresponse = true;
    } else {
        autoresponse = false;
    };
    if(sys.getVal('friendsflash') === "true") {
        friendsflash = true;
    } else {
        friendsflash = false;
    };
    if(sys.getVal('checkversion') === "true") {
        checkversion = "true";
    } else {
        checkversion = "false";
    };
    clientbotname = "+ClientBot";
    if(sys.getVal('clientbotname').length > 0) {
        clientbotname = sys.getVal('clientbotname');
    };
    clientbotcolour = "#3DAA68";
    if(sys.getVal('clientbotcolour').length > 0) {
        clientbotcolour = sys.getVal('clientbotcolour');
    };
    clientbotstyle = "<b>";
    if(sys.getVal('clientbotstyle').length > 0) {
        clientbotstyle = sys.getVal('clientbotstyle');
    };
    greentext = '#789922';
    if(sys.getVal('greentext').length > 0) {
        greentext = sys.getVal('greentext');
    };
    fontcolour = "#000000";
    if(sys.getVal('fontcolour').length > 0) {
        fontcolour = sys.getVal('fontcolour');
    };
    fonttype = "";
    if(sys.getVal('fonttype').length > 0) {
        fonttype = sys.getVal('fonttype');
    };
    fontsize = 3;
    if(sys.getVal('fontsize').length > 0) {
        fontsize = sys.getVal('fontsize');
    };
    fontstyle = "";
    if(sys.getVal('fontstyle').length > 0) {
        fontstyle = sys.getVal('fontstyle');
    };
    commandsymbol = "~";
    if(sys.getVal('commandsymbol').length > 0) {
        commandsymbol = sys.getVal('commandsymbol');
    };
    hilight = "BACKGROUND-COLOR: #ffcc00";
    if(sys.getVal('hilight').length > 0) {
        hilight = sys.getVal('hilight');
    };
    armessage = sys.getVal('armessage');
    arstart = sys.getVal('arstart');
    arend = sys.getVal('arend');
    artype = sys.getVal('artype');
    stalkwords = [];
    friends = [];
    ignore = [];
    logchannel = [];
    fchannel = [];
    if(sys.getVal('stalkwords') !== "") {
        var nstalkwords = sys.getVal('stalkwords').split(",");
        stalkwords = nstalkwords.concat(stalkwords);
        stalkwords = eliminateDuplicates(stalkwords);
    };
    if(sys.getVal('friends') !== "") {
        var nfriends = sys.getVal('friends').split(",");
        friends = nfriends.concat(friends);
        friends = eliminateDuplicates(friends);
    };
    if(sys.getVal('ignore') !== "") {
        var nignore = sys.getVal('ignore').split(",");
        ignore = nignore.concat(ignore);
        ignore = eliminateDuplicates(ignore);
    };
    if(sys.getVal('logchannel') !== "") {
        var nlogchannel = sys.getVal('logchannel').split(",");
        logchannel = nlogchannel.concat(logchannel);
        logchannel = eliminateDuplicates(logchannel);
    };
    if(sys.getVal('fchannel') !== "") {
        var nfchannel = sys.getVal('fchannel').split(",");
        fchannel = nfchannel.concat(fchannel);
        fchannel = eliminateDuplicates(fchannel);
    };
    auth_symbol = new Array();
    for(var x = 0; x < 5; x++) {
        if(sys.getVal('auth: ' + x).length > 0) {
            auth_symbol[x] = sys.getVal('auth: ' + x);
            continue;
        };
        if(x == 0 || x == 4) {
            auth_symbol[x] = "";
            continue;
        };
        auth_symbol[x] = "+";
    };
    auth_style = new Array();
    for(var x = 0; x < 5; x++) {
        if(sys.getVal('auths: ' + x).length > 0) {
            auth_style[x] = sys.getVal('auths: ' + x);
            continue;
        };
        if(x == 0 || x == 4) {
            auth_style[x] = "<b>";
            continue;
        };
        auth_style[x] = "<i><b>";
    };
    playerswarn = [];
    channelusers = [];
    if(sys.isSafeScripts() !== true) {
        checkScriptVersion();
    };
};

function checkScriptVersion(bool) { //checks the current script version with the one saved on Github, if the versions do not match, then it gives a warning
    var checkscript, version;
    var regex = /"([^"]*)"/g;
    if(bool === undefined) {
        bool = false;
    };
    if(checkversion === "false" && bool === false) {
        return;
    };
    sys.webCall(script_url, function (resp) {
        if(resp.length === 0) {
            sendBotMessage("There was an error accessing the script, paste the contents of (link) into your PO folder and restart, or wait for a client update", undefined, "https://github.com/downloads/coyotte508/pokemon-online/ssl.zip");
            return;
        };
        checkscript = resp.split('\n');
        for(var x in checkscript) {
            if(checkscript[x].substr(0, 14) == "Script_Version") {
                version = String(checkscript[x].match(regex));
            };
        };
        if(version === undefined) {
            sendBotMessage('There was an error with the version, please report to Crystal Moogle');
            return;
        };
        version = version.replace(/"/g, "");
        var type = {
            "0": "Major Release (huge changes)",
            "1": "Minor Release (new features)",
            "2": "Bug fixes/Minor Update"
        };
        if(version !== Script_Version) {
            var typeno;
            nversion = version.split('.');
            cversion = Script_Version.split('.');
            for(var x in nversion) {
                if(nversion[x] !== cversion[x]) {
                    typeno = x;
                    break;
                };
            };
            if(typeno === undefined) { //this shouldn't ever happen though
                return;
            };
            sendBotMessage("A client script update is avaiable, type: " + type[typeno] + ". Use " + commandsymbol + "updatescripts. Use " + commandsymbol + "changelog " + version + " to see the changes", undefined, script_url); //TODO make sure the script actually is a new version, rather than a previous version
            return;
        };
        if(bool === true) {
            sendBotMessage("No update detected");
        };
    });
};

function eliminateDuplicates(arr) { //stolen from http://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/ eliminates any duplicates that are in an array
    var i,
    len = arr.length,
        out = [],
        obj = {};
    for(i = 0; i < len; i++) {
        obj[arr[i]] = 0;
    };
    for(i in obj) {
        out.push(i);
    };
    return out;
};

function saveToLog(message, channel) { //saves messages to a log file
    var logging = false;
    for(var x in logchannel) {
        if(client.channelName(channel).toLowerCase() === logchannel[x].toLowerCase()) {
            logging = true;
            break;
        };
    };
    if(logging === false) {
        return;
    };
    var time = new Date();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    var d = time.getDate();
    var mo = parseInt(time.getMonth() + 1);
    var y = time.getFullYear();
    var date = d + "-" + mo + "-" + y;
    m = checkTime(m);
    s = checkTime(s);
    var timestamp = h + ":" + m + ":" + s;
    sys.appendToFile("Channel Logs/" + client.channelName(channel) + " " + date + ".txt", "(" + timestamp + ") " + message + "\n");
};

function checkTime(i) { //adds a 0 in front of one digit minutes/seconds
    if(i < 10) {
        i = "0" + i;
    };
    return i;
};

function getName(string, type) { //gets the name from rainbow/me messages
    var name = "";
    if(type == "rainbow") {
        var regex = /(<([^>]+)>)/ig;
        string = string.replace(regex, "");
        var pos = string.indexOf(': ');
        if(pos != -1) {
            name = string.substring(0, pos);
            if(name[0] == "+") { //auth symbol is + here rather than user defined, since the PO Server Scripts print "+" out automatically for auth
                name = name.substr(1);
            };
        };
    };
    if(type == "me") {
        name = string.substring(string.indexOf('<b>') + 3, string.indexOf('</b>')); //this is assuming it's used on PO Server Scripts, or any scripts that use the same /me system
    };
    return name;
};

function sendBotMessage(message, channel, link) { //sends a mesage with the bot name in front of it
    if(channel === undefined) {
        channel = client.currentChannel();
    };
    message = html_escape(message);
    if(link == "<ping/>") {
        message = message.replace(/&lt;ping\/&gt;/g, link);
    };
    if(message.indexOf("(link)") !== -1 && link !== undefined) {
        message = message.replace(/\(link\)/g, "<a href ='" + link + "'>" + link + "</a>");
    };
    client.printChannelMessage("<font color = '" + html_escape(clientbotcolour) + "'><timestamp/>" + clientbotstyle + html_escape(clientbotname) + ":" + tagend(clientbotstyle) + "</font> " + message, channel, true);
    return;
};

function html_escape(text) { //escapes any characters that won't appear correctly in HTMLmessages
    var m = String(text);
    if(m.length > 0) {
        var amp = "&am" + "p;";
        var lt = "&l" + "t;";
        var gt = "&g" + "t;";
        return m.replace(/&/g, amp).replace(/</g, lt).replace(/>/g, gt);
    } else {
        return "";
    };
};

function tagend(string) { //automatically creates an end tag from a html tagsent to it
    newstring = string.replace(/</g, "</");
    return newstring;
};

function awayFunction() { //makes the user go away if needed
    if(sys.getVal("idle") === "true") {
        client.goAway(true);
    } else {
        client.goAway(false);
    };
};

function stalkWordCheck(string, playname, bot, channel) { //adds flashes to names/stalkwords
    var ownName = html_escape(client.ownName());
    if(string.toLowerCase().indexOf(ownName.toLowerCase()) != -1 && playname !== ownName && flash !== false && bot === false && fchannel.indexOf(client.channelName(channel)) === -1) {
        var name = new RegExp("\\b" + ownName + "\\b", "i");
        newstring = string.replace(name, "<span style='" + hilight + "'>" + client.ownName() + "</span>");
        if(newstring !== string) {
            string = newstring.replace(newstring, "<i> " + newstring + "</i><ping/>");
        };
    };
    for(var x in stalkwords) {
        var stalk = new RegExp("\\b" + stalkwords[x] + "\\b", "i");
        var stalks = string.match(stalk);
        if(string.toLowerCase().search(stalk) != -1 && playname !== client.ownName() && flash !== false && bot === false && fchannel.indexOf(client.channelName(channel)) === -1) {
            newstring = string.replace(stalk, "<span style='" + hilight + "'>" + stalks + "</span>");
            if(newstring !== string) {
                string = newstring.replace(newstring, "<i> " + newstring + "</i><ping/>");
            };
        };
    };
    return string
};

function htmllinks(text) { //makes sure links get linked!
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\(\)\[\]\/%?=~_|!:,.;']*[-A-Z0-9+&@#\/\(\)\[\]%=~_|'])/ig;
    var found = text.match(exp);
    var newtext;
    var newfound;
    for(var x in found) {
        newfound = found[x].replace(/\//g, sys.md5('/')).replace(/_/g, sys.md5('_'))
        newtext = ("<a href ='" + newfound + "'>" + newfound + "</a>").replace(/&amp;/gi, "&");
        text = text.replace(found[x], newtext);
    };
    return encodeURIComponent(text).replace(/%20/g, " ")
};

function addExtras(text, playname, bot, channel) { //adds stalkwords/links/enriched text etc   
    text = htmllinks(text);
    text = enrichedText(text);
    text = decodeURIComponent(text);
    text = client.channel(channel).addChannelLinks(text);
    text = greenText(text)
    text = stalkWordCheck(text, playname, bot, channel);
    var md5 = new RegExp(sys.md5('/'), "g")
    var md51 = new RegExp(sys.md5('_'), "g")
    text = text.replace(md5, '/').replace(md51, "_")
    return text;
};

function enrichedText(text) { //applies the enriched text, adapted from the PO 1.0.60 source
    if(etext == false) {
        return text;
    };
    var expi = new RegExp("%2F(\\S+)%2F(?![^\\s<]*>)", "g");
    text = text.replace(expi, "<i>$1</i>");
    var expii = new RegExp("%5C(\\S+)%5C(?![^\\s<]*>)", "g");
    text = text.replace(expii, "<i>$1</i>");
    var expb = new RegExp("\\*(\\S+)\\*(?![^\\s<]*>)", "g");
    text = text.replace(expb, "<b>$1</b>");
    var expu = new RegExp("_(\\S+)_(?![^\\s<]*>)", "g");
    text = text.replace(expu, "<u>$1</u>");
    return text;
};

function greenText(text) { //applies greentext
    if(text.substr(0, 4) == "&gt;" && tgreentext === "true") {
        text = "<font color = '" + greentext + "'>" + text + "</font>";
    } else {
        text = "<font color = '" + fontcolour + "'>" + text;
    };
    return text
}

function isSafeScripts() { //checks if safe scripts is on and if it is it sends a message
    if(sys.isSafeScripts()) {
        sendBotMessage("You have safescripts on, you will not be able to update your scripts through the internet, though it should help against any harmful scripts, to turn it off, untick the box in the Script Window");
        return true;
    };
    return false;
};

function sendMessage(message, channel) { //sends a message to the user
    if(channel === undefined) {
        channel = client.currentChannel();
    };
    client.printChannelMessage(message, channel, false);
    return;
};

function ignoreCheck(name) { //checks if ignored, this is used since it's possible to bypass the autoignore function by logging in via an alt then switching names
    for(i in ignore) {
        if(name.toLowerCase() === ignore[i].toLowerCase()) {
            client.ignore(client.id(name), true);
        };
    };
    if(client.isIgnored(client.id(name))) {
        return true;
    };
    return false;
};

function sendHtmlMessage(message, channel) { //sends a html message to the user
    if(channel === undefined) {
        channel = client.currentChannel();
    };
    client.printChannelMessage(message, channel, true);
    return;
};
if(client.ownId() !== -1) {
    init();
};
client.network().channelCommandReceived.connect(function (command, channel) {
    var tempchannelusers;
    var tempusers = [];
    var logging = false;
    for(z in logchannel) {
        if(logchannel[z].toLowerCase() == client.channelName(channel).toLowerCase()) {
            logging = true;
            break;
        };
    };
    if(logging !== true) {
        return;
    };
    for(var x in playersonline) {
        if(client.channel(channel).hasPlayer(playersonline[x])) {
            tempusers.push(playersonline[x]);
        };
    };
    tempchannelusers = tempusers.join(':');
    if(typeof channelusers[channel] === "undefined") {
        channelusers[channel] = tempchannelusers;
        return;
    };
    if(command == 46) { //command for joining
        var a = channelusers[channel].split(':');
        var b = tempchannelusers.split(':');
        for(var y in b) {
            if(a[y] !== b[y]) {
                saveToLog(client.name(b[y]) + " joined the channel", channel);
                break;
            };
        };
        channelusers[channel] = tempchannelusers;
    };
    if(command == 47) { //command for leaving
        var a = channelusers[channel].split(':');
        var b = tempchannelusers.split(':');
        for(var y in a) {
            if(a[y] !== b[y]) {
                saveToLog(client.name(a[y]) + " left the channel", channel);
                break;
            };
        };
        channelusers[channel] = tempchannelusers;
    };
});
client.network().playerLogin.connect(function () { //only call when the user has logged in to prevent any crashes
    awayFunction();
    init();
});
Script_Version = "1.6.11"; //version the script is currently on
poScript = ({
    clientStartUp: function () {
        sendMessage('Script Check: OK'); //use this to send a message on update scripts
    },
    onPlayerRemoved: function (id) { //detects when  a player is no longer visible to the client (mostly log outs, but may happen from leaving all channels)
        for(var x in playersonline); {
            if(playersonline[x] === id); {
                playersonline.splice(x, 1);
            };
        };
    },
    onPlayerReceived: function (id) { //detects when a player is visible to the client (mostly logins, but may also happen upon joining a new channel)
        if(typeof playersonline === "undefined") {
            playersonline = [];
        };
        playersonline.push(id);
        var flashvar = "";
        if(friendsflash === true) {
            flashvar = "<ping/>";
        };
        for(var x in friends) {
            if(client.name(id).toLowerCase() === friends[x].toLowerCase() && flash === true) {
                sendBotMessage("User " + client.name(id) + " has logged in" + flashvar + "", client.currentChannel(), "<ping/>");
            };
        };
        for(var x in ignore) {
            if(client.name(id).toLowerCase() === ignore[x].toLowerCase()) {
                client.ignore(id, true);
            };
        };
    },
    beforeChannelMessage: function (message, channel, html) { //detects a channel specific message
        var chan = channel;
        var bot = false;
        if(message.indexOf('<timestamp/> *** <b>') !== -1) {
            var ignored = getName(message, "me");
            if(ignoreCheck(ignored)) {
                sys.stopEvent();
                return;
            };
        };
        if(message.indexOf('<timestamp/><b><span style') !== -1) {
            var ignored = getName(message, "rainbow");
            if(ignoreCheck(ignored)) {
                sys.stopEvent();
                return;
            };
        };
        if(html == true) {
            return;
        };
        saveToLog(message, channel);
        var pos = message.indexOf(': ');
        if(pos != -1) {
            if(client.id(message.substring(0, pos)) == -1 || client.id(message.substring(0, pos)) === undefined) {
                bot = true;
            };
            var playname = message.substring(0, pos);
            if(ignoreCheck(playname)) {
                sys.stopEvent();
                return;
            };
            var id = client.id(playname);
            var playmessage = html_escape(message.substr(pos + 2));
            var colour = client.color(id);
            if(bot === true) {
                colour = clientbotcolour;
            };
            if(colour === "#000000") {
                var clist = ['#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f', '#1b1390', '#028678', '#0324b1'];
                colour = clist[client.id(playname) % clist.length];
            }
            var auth = client.auth(id);
            if(auth > 4) {
                auth = 4;
            };
            playmessage = addExtras(playmessage, playname, bot, channel);
            var symbol = auth_symbol[auth];
            if(bot === true) {
                symbol = "";
            };
            client.printChannelMessage("<font face ='" + fonttype + "'><font size = " + fontsize + "><font color='" + colour + "'><timestamp/> " + symbol + auth_style[auth] + playname + ": </font>" + tagend(auth_style[auth]) + fontstyle + playmessage + tagend(fontstyle), chan, true);
            sys.stopEvent();
        };
    },
    beforePMReceived: function (id, message) { // called before a PM is received
        if(ignoreCheck(client.name(id))) {
            sys.stopEvent();
            return;
        };
    },
    afterPMReceived: function (id, message) { //called after a PM is received
        if(playerswarn[id] === true) {
            return;
        };
        var time = new Date();
        var h = time.getHours();
        if(artype === "time") {
            if(arstart < arend) {
                if(h >= arstart && h < arend) {
                    client.network().sendPM(id, armessage);
                    playerswarn[id] = true;
                    return;
                };
            };
            if(h >= arend && h < arstart) {
                client.network().sendPM(id, armessage);
                playerswarn[id] = true;
                return;
            };
        };
        if(autoresponse === true) {
            client.network().sendPM(id, armessage);
            playerswarn[id] = true;
            return;
        };
        return;
    },
    beforeSendMessage: function (message, channel) { //detects messages sent by the client
        if(message.toLowerCase() == "reset symbol") {
            sys.stopEvent();
            commandsymbol = "~";
            sendBotMessage('You reset your command symbol to "~"!');
            sys.saveVal('commandsymbol', commandsymbol);
            return;
        };
        if(message[0] == commandsymbol) {
            var command, commandData, type;
            var pos = message.indexOf(' ');
            if(pos != -1) {
                command = message.substring(1, pos).toLowerCase();
                commandData = message.substr(pos + 1);
            } else {
                command = message.substr(1).toLowerCase();
            };
            if(command == "commandlist" || command == "commandslist") {
                sys.stopEvent();
                sendMessage("*** Client Commands ***");
                sendMessage(commandsymbol + "etext on/off: Allows you to turn Enriched text on/off");
                sendMessage(commandsymbol + "greentext on/off: Allows you to turn greentext on/off");
                sendMessage(commandsymbol + "idle on/off: Allows you to turn auto-idle on/off");
                sendMessage(commandsymbol + "goto channel: Allows you to switch to that channel (joins if you're not in that channel)");
                sendMessage(commandsymbol + "stalkwords: Allows you to view your current stalkwords");
                sendMessage(commandsymbol + "[add/remove]stalkword word: Allows you to add/remove stalkwords");
                sendMessage(commandsymbol + "flash on/off:channel: Allows you to turn flashes on/off. Channel is an optional parameter to turn flashes off for one channel");
                sendMessage(commandsymbol + "friends: Allows you to view your current friends and their online status");
                sendMessage(commandsymbol + "[add/remove]friend friend: Allows you to add/remove friends");
                sendMessage(commandsymbol + "friendflash on/off: Allows you turn friend flashes on/off");
                sendMessage(commandsymbol + "ignorelist: Allows you to view your autoignore list");
                sendMessage(commandsymbol + "[add/remove]ignore user: Allows you to add/remove people from your ignore list");
                sendMessage(commandsymbol + "logchannels: Allows you to view your log channels");
                sendMessage(commandsymbol + "[add/remove]logchannel channel: Allows you to add/remove channels from the channels you log");
                sendMessage(commandsymbol + "changebotcolo(u)r colour: Allows you to change the bot's (client and server) colour");
                sendMessage(commandsymbol + "changebotname name: Allows you to change clientbot's name");
                sendMessage(commandsymbol + "changebotstyle htmltag: Allows you to change the style of the client bot (start tags only)");
                sendMessage(commandsymbol + "resetbot: Allows you to reset the bot to its default values");
                sendMessage(commandsymbol + "checkversion: Allows you to check for updates");
                sendMessage(commandsymbol + "updatealert on/off: Allows you to get automatically alerted about new versions");
                sendMessage(commandsymbol + "changelog version: Allows you to view the changelog");
                sendMessage(commandsymbol + "versions: Allows you to view the current versions");
                sendMessage(commandsymbol + "updatescripts: Allows you to updatescripts");
                sendMessage(commandsymbol + "authsymbols auth:symbol: Allows you to change authsymbols. If symbol is left blank, then it removes the current auth symbol");
                sendMessage(commandsymbol + "authstyle auth:htmltag: Allows you to change the name style of auth. Make sure to use start tags only. If htmltag is left blank, then it will remove the current style");
                sendMessage(commandsymbol + "highlight colour: Allows you to change the colour of the highlight when flashed");
                sendMessage(commandsymbol + "commandsymbol symbol: Allows you to change the command symbol");
                sendMessage(commandsymbol + "armessage: Sets your autoresponse message");
                sendMessage(commandsymbol + "artype [command/time]: Sets how to activate your autoresponse, time does it between certain hours, command activates it by command");
                sendMessage(commandsymbol + "ar[on/off]: Turns your autoresponse on/off if type if command");
                sendMessage(commandsymbol + "artime hour1:hour2: Sets your autoresponse to activate between hour1 and hour2");
                sendMessage(commandsymbol + "fontcommands: Shows you the font command details");
                sendMessage(commandsymbol + "damagecalc [s]atk:move power:modifier:[s]def:HP: Basic damage calculator");
                sendMessage("Explanation: [s]atk is the attacking pokémon's exact stat (not base), move power is the move's base power, modifier is any modifiers that need to be added (e.g. life orb is 1.3), HP/[s]def is the defending pokémon's exact HP/Def stats (not base)");
                sendMessage("Example: " + commandsymbol + "damagecalc 100:100:1.3:100:100 will show you the result of a pokémon with 100 [s]atk, with Life Orb using a 100bp move against a pokémon with 100HP/[s]def");
                sendMessage('If you ever forget your command symbol, type "reset symbol" to revert it back to "~"');
                return;
            };
            if(command == "fontcommands") {
                sys.stopEvent();
                sendMessage("*** Font Command Details ***");
                sendMessage("Command: " + commandsymbol + "font type:modifier");
                sendMessage("Type: Types are 'colo(u)r', 'style', 'type', 'size'");
                sendMessage("Colour: Defines the colour of the font");
                sendMessage("Style: Defines the style of the font (bold/italics/underline)");
                sendMessage("Type: Defines the font face");
                sendMessage("Size: Defines the font size");
                sendMessage("Modifier: Modifiers vary from types. Colour modifiers are any valid colour. Style is any valid HTML start tag. Type is any type of font face. Size is any number");
                sendMessage("Example: " + commandsymbol + "font color:red, will make all text red");
                return;
            };
            if(command == "etext") {
                sys.stopEvent();
                if(commandData == "on") {
                    etext = "true";
                    sys.saveVal('etext', true);
                    sendBotMessage("You turned Enriched text on!");
                    return;
                };
                if(commandData == "off") {
                    etext = "false";
                    sys.saveVal('etext', false);
                    sendBotMessage("You turned Enriched text off!");
                    return;
                };
                sendBotMessage("Please use on/off");
            };
            if(command == "greentext") {
                sys.stopEvent();
                if(commandData == "on") {
                    tgreentext = "true";
                    sys.saveVal('tgreentext', true);
                    sendBotMessage("You turned greentext on!");
                    return;
                };
                if(commandData == "off") {
                    tgreentext = "false";
                    sys.saveVal('tgreentext', false);
                    sendBotMessage("You turned greentext off!");
                    return;
                };
                sendBotMessage("Please use on/off");
            };
            if(command == "idle") {
                sys.stopEvent();
                if(commandData == "on") {
                    client.goAway(true);
                    sys.saveVal('idle', true);
                    sendBotMessage("You turned auto-idling on!");
                    return;
                };
                if(commandData == "off") {
                    client.goAway(false);
                    sys.saveVal('idle', false);
                    sendBotMessage("You turned auto-idling off!");
                    return;
                };
                sendBotMessage("Please use on/off");
            };
            if(command == "checkversion") {
                sys.stopEvent();
                if(isSafeScripts()) {
                    return;
                };
                sendBotMessage("Checking script version please wait. (Current Version: " + Script_Version + ")");
                checkScriptVersion(true);
                return;
            };
            if(command == "updatealert") {
                sys.stopEvent();
                if(isSafeScripts()) {
                    return;
                };
                if(commandData == "on") {
                    checkversion = true;
                    sys.saveVal('checkversion', true);
                    sendBotMessage("You now get alerted about new versions");
                    checkScriptVersion();
                    return;
                };
                if(commandData == "off") {
                    checkversion = false;
                    sys.saveVal('checkversion', false);
                    sendBotMessage("You no longer get alerted about new versions");
                    return;
                };
                sendBotMessage("Please use on/off");
            };
            if(command == "goto") {
                sys.stopEvent();
                var channela = commandData.toLowerCase();
                var channels = client.channelNames();
                for(var x in channels) {
                    if(channela === channels[x].toLowerCase()) {
                        channela = channels[x];
                        if(!client.hasChannel(client.channelId(channela))) {
                            client.join(channela);
                            return;
                        };
                        client.activateChannel(channela);
                        return;
                    };
                };
                sendBotMessage("That is not a channel!");
            };
            if(command == "stalkwords") {
                sys.stopEvent();
                sendBotMessage("Your stalkwords are: " + stalkwords);
            };
            if(command == "addstalkword") {
                sys.stopEvent();
                var nstalkwords = commandData;
                if(nstalkwords.search(/, /g) !== -1 || nstalkwords.search(/ ,/g) !== -1) {
                    nstalkwords = nstalkwords.replace(/, /g, ",").replace(/ ,/g, ",");
                };
                nstalkwords = nstalkwords.split(",");
                stalkwords = eliminateDuplicates(nstalkwords.concat(stalkwords));
                sys.saveVal('stalkwords', stalkwords.toString());
                sendBotMessage("You added " + commandData + " to your stalkwords!");
            };
            if(command == "removestalkword") {
                sys.stopEvent();
                commandData = commandData.toLowerCase();
                for(var x in stalkwords) {
                    if(stalkwords[x].toLowerCase() === commandData) {
                        stalkwords.splice(x, 1);
                        sys.saveVal('stalkwords', stalkwords.toString());
                        sendBotMessage("You removed " + commandData + " from your stalkwords!");
                        return;
                    };
                };
                sendBotMessage("" + commandData + " is not a stalkword!");
            };
            if(command == "flash" || command == "flashes") {
                sys.stopEvent();
                commandData = commandData.split(':');
                if(commandData.length < 2 || commandData[1] === "") {
                    if(commandData[0] == "on") {
                        flash = true;
                        sys.saveVal('flash', true);
                        sendBotMessage("You turned flashes on!");
                        return;
                    } else {
                        flash = false;
                        sys.saveVal('flash', false);
                        sendBotMessage("You turned flashes off!");
                        return;
                    };
                };
                var nfchannel = commandData[1];
                if(commandData[0] == "off") {
                    if(nfchannel.search(/, /g) !== -1 || nfchannel.search(/ ,/g) !== -1) {
                        nfchannel = nfchannel.replace(/, /g, ",").replace(/ ,/g, ",");
                    };
                    nfchannel = nfchannel.split(",");
                    fchannel = eliminateDuplicates(nfchannel.concat(fchannel));
                    sys.saveVal('fchannel', fchannel.toString());
                    sendBotMessage("You won't be flashed in " + commandData[1]);
                } else {
                    commandData[1] = commandData[1].toLowerCase();
                    for(var x in fchannel) {
                        if(fchannel[x].toLowerCase() === commandData[1]) {
                            fchannel.splice(x, 1);
                            sys.saveVal('fchannel', fchannel.toString());
                            sendBotMessage("You will be flashed in " + commandData[1]);
                            return;
                        };
                    };
                };
            };
            if(command == "friends") {
                sys.stopEvent();
                var check = [];
                for(var x in friends) {
                    if(client.id(friends[x]) !== -1) {
                        check.push(friends[x] + " (online)");
                        continue;
                    };
                    check.push(friends[x] + " (offline)");
                };
                sendBotMessage("Your friends are: " + check);
                return;
            };
            if(command == "addfriend") {
                sys.stopEvent();
                var nfriends = commandData;
                if(nfriends.search(/, /g) !== -1 || nfriends.search(/ ,/g) !== -1) {
                    nfriends = nfriends.replace(/, /g, ",").replace(/ ,/g, ",");
                };
                nfriends = nfriends.split(",");
                friends = eliminateDuplicates(nfriends.concat(friends));
                sys.saveVal('friends', friends.toString());
                sendBotMessage("You added " + commandData + " to your friends!");
            };
            if(command == "removefriend") {
                sys.stopEvent();
                commandData = commandData.toLowerCase();
                for(var x in friends) {
                    if(friends[x].toLowerCase() === commandData) {
                        friends.splice(x, 1);
                        sys.saveVal('friends', friends.toString());
                        sendBotMessage("You removed " + commandData + " from your friends!");
                        return;
                    };
                };
                sendBotMessage(commandData + " is not a friend!");
            };
            if(command == "friendflash" || command == "friendsflash") {
                sys.stopEvent();
                if(commandData === "on") {
                    friendsflash = true;
                    sys.saveVal('friendsflash', true);
                    sendBotMessage("You turned friend flashes on!");
                    return;
                } else {
                    friendsflash = false;
                    sys.saveVal('friendsflash', false);
                    sendBotMessage("You turned friend flashes off!");
                };
                return;
            };
            if(command == "ignorelist") {
                sys.stopEvent();
                sendBotMessage("Your ignorelist is: " + ignore);
            };
            if(command == "addignore") {
                sys.stopEvent();
                if(commandData === client.ownName()) {
                    return;
                };
                var nignore = commandData;
                if(nignore.search(/, /g) !== -1 || nignore.search(/ ,/g) !== -1) {
                    nignore = nignore.replace(/, /g, ",").replace(/ ,/g, ",");
                };
                nignore = nignore.split(",");
                ignore = eliminateDuplicates(nignore.concat(ignore));
                sys.saveVal('ignore', ignore.toString());
                if(client.id(commandData) != -1) {
                    client.ignore(client.id(commandData), true);
                };
                sendBotMessage("You added " + commandData + " to your ignorelist!");
            };
            if(command == "removeignore") {
                sys.stopEvent();
                commandData = commandData.toLowerCase();
                for(var x in ignore) {
                    if(ignore[x].toLowerCase() === commandData) {
                        ignore.splice(x, 1);
                        sys.saveVal('ignore', ignore.toString());
                        if(client.id(commandData) != -1) {
                            client.ignore(client.id(commandData), false);
                        };
                        sendBotMessage("You removed " + commandData + " from your ignorelist!");
                        return;
                    };
                };
                sendBotMessage(commandData + " is not on the ignorelist!");
            };
            if(command == "changebotname") {
                sys.stopEvent();
                if(commandData == undefined) {
                    return;
                };
                clientbotname = commandData;
                sendBotMessage(clientbotname + " is now your clientbot's name!");
                sys.saveVal("clientbotname", clientbotname);
                return;
            };
            if(command == "changebotstyle") {
                sys.stopEvent();
                if(commandData === undefined) {
                    clientbotstyle = "";
                    sendBotMessage("You removed your client bot style!");
                    sys.saveVal("clientbotstyle", clientbotstyle);
                    return;
                };
                clientbotstyle = commandData;
                sendBotMessage(clientbotstyle + " is now your clientbot's style!");
                sys.saveVal("clientbotstyle", clientbotstyle);
                return;
            };
            if(command == "changebotcolour" || command == "changebotcolor") {
                sys.stopEvent();
                if(commandData == undefined) {
                    return;
                };
                clientbotcolour = commandData;
                sendBotMessage(clientbotcolour + " is now your clientbot's colour!");
                sys.saveVal("clientbotcolour", clientbotcolour);
                return;
            };
            if(command == "greentextcolor" || command == "greentextcolour") {
                sys.stopEvent();
                if(commandData == undefined) {
                    return;
                };
                greentext = commandData;
                sendBotMessage(greentext + " is now your greentext colour!");
                sys.saveVal("greentext", greentext);
                return;
            };
            if(command == "resetbot") {
                sys.stopEvent();
                clientbotcolour = "#3DAA68";
                clientbotname = "+ClientBot";
                sys.saveVal("clientbotcolour", clientbotcolour);
                sys.saveVal("clientbotname", clientbotname);
                sendBotMessage("You reset your bot to default values");
                return;
            };
            if(command == "font") {
                sys.stopEvent();
                if(commandData == undefined) {
                    return;
                };
                var type = commandData.split(":");
                if(type.length < 1) {
                    sendBotMessage('Usage is ' + commandsymbol + 'font type:modifier');
                    return;
                };
                var modifier = type[1];
                var types = ["colour", "color", "style", "type", "size"];
                if(types.indexOf(type[0]) === -1) {
                    sendBotMessage('Invalid type, valid types are: colo(u)r, style, type, size');
                    return;
                };
                if(type[0] === "colour" || type[0] === "color") {
                    if(modifier === undefined || modifier == "") {
                        modifier = "#000000";
                        fontcolour = modifier;
                        sys.saveVal('fontcolour', modifier);
                        sendBotMessage("You changed your font colour to the default");
                        return;
                    };
                    fontcolour = modifier;
                    sys.saveVal('fontcolour', modifier);
                    sendBotMessage("You changed your font colour to: " + modifier);
                    return;
                };
                if(type[0] === "style") {
                    if(modifier === undefined || modifier == "") {
                        modifier = "";
                        fontstyle = modifier;
                        sys.saveVal('fontstyle', modifier);
                        sendBotMessage("You changed your font style to the default");
                        return;
                    };
                    if(modifier.indexOf('</') !== -1) {
                        sendBotMessage("End tags are not needed, please only use start ones");
                        return;
                    };
                    fontstyle = modifier;
                    sys.saveVal('fontstyle', modifier);
                    sendBotMessage("You changed your font style to: " + modifier);
                    return;
                };
                if(type[0] === "type") {
                    if(modifier === undefined || modifier == "") {
                        modifier = "";
                        fonttype = modifier;
                        sys.saveVal('fonttype', modifier);
                        sendBotMessage("You changed your font type to the default");
                        return;
                    };
                    fonttype = modifier;
                    sys.saveVal('fonttype', modifier);
                    sendBotMessage("You changed your font to: " + modifier);
                    return;
                };
                if(type[0] === "size") {
                    if(modifier === undefined || modifier == "" || isNaN(parseInt(modifier))) {
                        modifier = 3;
                        fontsize = modifier;
                        sys.saveVal('fontsize', modifier);
                        sendBotMessage("You changed your font size to the default");
                        return;
                    };
                    fontsize = modifier;
                    sys.saveVal('fontsize', modifier);
                    sendBotMessage("You changed your font size to: " + modifier);
                    return;
                };
            };
            if(command == "changelog") {
                sys.stopEvent();
                if(isSafeScripts()) {
                    return;
                };
                var changelog = sys.synchronousWebCall("https://raw.github.com/gist/3189629/ChangeLog.json");
                if(changelog.length < 1) {
                    sendBotMessage("Error retrieving file");
                    return;
                };
                changelog = JSON.parse(changelog);
                if(changelog.versions[commandData] === undefined) {
                    sendBotMessage("Version does not exist! Use " + commandsymbol + "versions to check versions");
                    return;
                };
                var details = changelog.versions[commandData].split('\n');
                sendBotMessage("Details for version: " + commandData);
                for(var x in details) {
                    sendBotMessage(details[x]);
                };
                return;
            };
            if(command == "versions") {
                sys.stopEvent();
                var version = [];
                if(isSafeScripts()) {
                    return;
                };
                var changelog = sys.synchronousWebCall("https://raw.github.com/gist/3189629/ChangeLog.json");
                if(changelog.length < 1) {
                    sendBotMessage("Error retrieving file");
                    return;
                };
                changelog = JSON.parse(changelog);
                for(var x in changelog.versions) {
                    version.push(" " + x);
                };
                sendBotMessage('Versions of this script are: ' + version);
                return;
            };
            if(command == "updatescripts") {
                sys.stopEvent();
                if(isSafeScripts()) {
                    return;
                };
                sendBotMessage("Fetching scripts...");
                var updateURL = script_url;
                if(commandData !== undefined && (commandData.substring(0, 7) == 'http://' || commandData.substring(0, 8) == 'https://')) {
                    updateURL = commandData;
                };
                var channel_local = channel;
                var changeScript = function (resp) {
                    if(resp === "") {
                        sendBotMessage("There was an error accessing the script, paste the contents of (link) into your PO folder and restart, or wait for a client update", undefined, "https://github.com/downloads/coyotte508/pokemon-online/ssl.zip");
                        return;
                    };
                    try {
                        sys.changeScript(resp, true);
                        sys.writeToFile(sys.scriptsFolder + "scripts.js", resp);
                    } catch(err) {
                        sys.changeScript(sys.getFileContent(sys.scriptsFolder + 'scripts.js'));
                        sendBotMessage('Updating failed, loaded old scripts!');
                    };
                };
                sendBotMessage("Fetching scripts from (link)", channel_local, updateURL);
                sys.webCall(updateURL, changeScript);
                return;
            };
            if(command == "authsymbol" || command == "authsymbols") {
                sys.stopEvent();
                var symbols = commandData.split(":");
                var auth = symbols[0];
                var symbol = symbols[1];
                if(symbols.length > 2 || symbols.length < 1) {
                    sendBotMessage("Command usage is: \"" + commandsymbol + "changesymbols number:symbol\"");
                    return;
                };
                if(isNaN(parseInt(auth))) {
                    sendBotMessage("The first parameter must be a number!");
                    return;
                };
                if(auth < 0 || auth > 4) {
                    sendBotMessage("Auth must be between 0 and 4");
                    return;
                };
                if(symbol === undefined) {
                    symbol = "";
                };
                auth_symbol[auth] = symbol;
                sys.saveVal("auth: " + auth, symbol);
                if(symbol === "") {
                    sendBotMessage("Auth " + auth + " now has no symbol");
                    return;
                };
                sendBotMessage("Auth symbol for auth " + auth + " is " + symbol);
                return;
            };
            if(command == "authstyle") {
                sys.stopEvent();
                var styles = commandData.split(":");
                var auth = styles[0];
                var style = styles[1];
                if(styles.length > 2 || styles.length < 2) {
                    sendBotMessage("Command usage is: \"" + commandstyle + "changestyles number:html\"");
                    return;
                };
                if(isNaN(parseInt(auth))) {
                    sendBotMessage("The first parameter must be a number!");
                    return;
                };
                if(auth < 0 || auth > 4) {
                    sendBotMessage("Auth must be between 0 and 4");
                    return;
                };
                if(style.indexOf('</') !== -1) {
                    sendBotMessage("End tags are not needed, please only use start ones");
                    return;
                };
                if(style === undefined) {
                    style = "";
                };
                auth_style[auth] = style;
                sys.saveVal("auths: " + auth, style);
                if(style === "") {
                    sendBotMessage("Auth " + auth + " now has no style");
                    return;
                };
                sendBotMessage("Auth style for auth " + auth + " is " + style);
                return;
            };
            if(command == "damagecalc") {
                sys.stopEvent();
                var paras = commandData.split(':');
                if(paras.length !== 5) {
                    sendBotMessage("Format is [s]atk:movepower:boosts:[s]def:hp");
                    return;
                };
                for(var x in paras) {
                    paras[x] = parseFloat(paras[x]);
                    if(isNaN(paras[x])) {
                        sendBotMessage('Parameters must be all numbers!');
                        return;
                    };
                };
                if(paras[2] == 0) {
                    paras[2] = 1;
                };
                var calc = (84 * paras[0] * paras[1] * paras[2]) / (paras[3] * paras[4]);
                sendBotMessage(paras[1] + "BP move coming from " + paras[0] + "[s]atk with a " + paras[2] + " modifier on " + paras[4] + "HP and " + paras[3] + "[s]def, does approxmiately " + calc + " damage");
                return;
            };
            if(command == "commandsymbol") {
                sys.stopEvent();
                var symbol = commandData;
                if(symbol === undefined) {
                    return;
                };
                if(symbol.length !== 1) {
                    sendBotMessage("Must be 1 character long");
                    return;
                };
                if(symbol === "!" || symbol === "/") {
                    sendBotMessage("Warning: This symbol is the same one used for most server scripts, you can still use it for client scripts, but it may interfere with server ones");
                };
                commandsymbol = symbol;
                sys.saveVal('commandsymbol', symbol);
                sendBotMessage("Command symbol is set to: " + symbol);
                return;
            };
            if(command == "highlight" || command == "flashcolour") {
                sys.stopEvent();
                if(commandData === undefined) {
                    hilight = "BACKGROUND-COLOR: #ffcc00";
                    sys.saveVal('hilight', hilight);
                    sendBotMessage("Highlight colour set to the default");
                    return;
                };
                hilight = "BACKGROUND-COLOR: " + commandData;
                sys.saveVal('hilight', hilight);
                sendBotMessage("Highlight colour set to: " + hilight);
                return;
            };
            if(command == "logchannels") {
                sys.stopEvent();
                sendBotMessage("You are logging: " + logchannel);
            };
            if(command == "addlogchannel") {
                sys.stopEvent();
                if(isSafeScripts()) {
                    return;
                };
                if(typeof (sys.filesForDirectory('Channel Logs')) === "undefined") {
                    sendBotMessage("Please make a folder in your PO folder called \"Channel Logs\"");
                    return;
                };
                var nlogchannel = commandData;
                if(nlogchannel.search(/, /g) !== -1 || nlogchannel.search(/ ,/g) !== -1) {
                    nlogchannel = nlogchannel.replace(/, /g, ",").replace(/ ,/g, ",");
                };
                nlogchannel = nlogchannel.split(",");
                logchannel = eliminateDuplicates(nlogchannel.concat(logchannel));
                sys.saveVal('logchannel', logchannel.toString());
                sendBotMessage("You added " + commandData + " to your log channels!");
            };
            if(command == "removelogchannel") {
                sys.stopEvent();
                commandData = commandData.toLowerCase();
                for(var x in logchannel) {
                    if(logchannel[x].toLowerCase() === commandData) {
                        logchannel.splice(x, 1);
                        sys.saveVal('logchannel', logchannel.toString());
                        sendBotMessage("You removed " + commandData + " from your log channels!");
                        return;
                    };
                };
                sendBotMessage(commandData + " is not a log channel!");
            };
            if(command == "armessage") {
                sys.stopEvent();
                armessage = commandData;
                sys.saveVal('armessage', armessage);
                sendBotMessage('You set your auto-respond message to: ' + armessage);
                return;
            };
            if(command == "artype") {
                sys.stopEvent();
                if(commandData == "command") {
                    artype = "command";
                    sys.saveVal('artype', artype);
                    sendBotMessage('Your auto-respond message will be activated by command');
                    return;
                };
                if(commandData == "time") {
                    artype = "time";
                    sys.saveVal('artype', artype);
                    sendBotMessage('Your auto-respond message will be activated by time');
                    return;
                };
                sendBotMessage('This is not a valid type!');
                return;
            };
            if(command == "artime") {
                sys.stopEvent();
                var time = commandData.split(':');
                if(time.length !== 2) {
                    sendBotMessage('Usage of this command is: ' + commandsymbol + 'artime starthour:endhour');
                    return;
                };
                if(isNaN(time[0]) || isNaN(time[1]) || time[0] < 0 || time[0] > 24 || time[1] < 0 || time[1] > 24 || time[0] == "" || time[1] == "") {
                    sendBotMessage('Make sure both parameters are numbers and are between 0 and 24');
                    return;
                };
                arstart = time[0];
                arend = time[1];
                sys.saveVal('arend', arend);
                sys.saveVal('arstart', arstart);
                sendBotMessage('You auto response message will activate between ' + arstart + ':00 and ' + arend + ':00');
                return;
            };
            if(command == "aron") {
                sys.stopEvent();
                if(artype !== "command") {
                    return;
                };
                autoresponse = true;
                sys.saveVal('autoresponse', autoresponse);
                sendBotMessage('You turned your auto response on');
                return;
            };
            if(command == "aroff") {
                sys.stopEvent();
                if(artype !== "command") {
                    return;
                };
                autoresponse = false;
                sys.saveVal('autoresponse', autoresponse);
                sendBotMessage('You turned your auto response off');
                return;
            };
            if(command == "eval") {
                sys.stopEvent();
                eval(commandData);
                return;
            };
            if(command == "evalp") {
                sys.stopEvent();
                var bindChannel = channel;
                try {
                    var res = eval(commandData);
                    sendMessage("Got from eval: " + res, bindChannel);
                } catch(err) {
                    sendMessage("Error in eval: " + err, bindChannel);
                };
                return;
            };
        };
    },
})
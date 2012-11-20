/*  
    Client Scripts
    Make sure you check ~commandslist for a list of commands
    Currently needs PO Version 2.0.06 to run correctly (Though 2.0.07 is strongly recommended)
    Report bugs here: http://pokemon-online.eu/forums/showthread.php?15079 and read over the thread to check for anything
    Needed files: Utilities.js
    If it doesn't automatically download them, get them from https://raw.github.com/CrystalMoogle/PO-User-Scripts/master/clientscripts/utilities.js and save them as utilities.js in a folder called "ClientScripts" in your main PO Folder
*/
//these things below shouldn't be touched unless you know what you're doing~
/*jshint "laxbreak":true,"shadow":true,"undef":true,"evil":true,"trailing":true,"proto":true,"withstmt":true*/
/*global sys,client, playerswarn:true */
var script_url = "https://raw.github.com/CrystalMoogle/PO-User-Scripts/devel/"; //where the script is stored
var scriptsFolder = "ClientScripts"; //replace with undefined if you don't want a folder
var global = this;
var poScript, Script_Version, initCheck, repoFolder, etext, tgreentext, flash, autoresponse, friendsflash, checkversion, clientbotname, clientbotcolour, clientbotstyle, greentext, fontcolour, fonttype, fontsize, fontstyle, commandsymbol, hilight, armessage, arstart, arend, artype, stalkwords, friends, ignore, logchannel, fchannel, auth_symbol, auth_style, src, globalMessageCheck, globalMessage, Utilities;

//easier importing of server scripts
sys.name = client.name, sys.id = client.id, src = client.ownId();
sys.sendAll = function (message, channel) {
    say(message, channel);
};
sys.sendMessage = function (id, message, channel) {
    sendMessage(message, channel);
};
checkFiles();
Utilities = importScript('utilities.js');

function print(message) {
    sendMessage(message);
}

function importScript(file) {
    if (scriptsFolder !== undefined) {
        return eval(sys.getFileContent(scriptsFolder + "/" + file));
    }
    return eval(sys.getFileContent(file));
}

function cleanFile(filename) {
    sys.appendToFile(filename, "");
}

function checkFiles() {
    sys.makeDir(scriptsFolder);
    cleanFile(scriptsFolder + '/utilities.js');
    if (sys.getFileContent(scriptsFolder + '/utilities.js') === "") {
        sys.writeToFile(scriptsFolder + "/" + 'utilities.js', sys.synchronousWebCall(script_url + "clientscripts/utilities.js"));
    }
}

function init() { //defines all the variables that are going to be used in the script, uses default if no saved settings are found
    if (sys.isSafeScripts() !== true) {
        Utilities.loadSettings();
        checkScriptVersion();
    }
    else {
        Utilities.loadFromRegistry();
    }
    initCheck = true;
}

function checkScriptVersion(bool) { //checks the current script version with the one saved on Github, if the versions do not match, then it gives a warning
    var checkscript, version;
    var regex = /"([^"]*)"/g;
    if (bool === undefined) {
        bool = false;
    }
    if (checkversion === "false" && bool === false) {
        return;
    }
    sys.webCall(script_url, function (resp) {
        if (resp.length === 0) {
            sendBotMessage("There was an error accessing the script, paste the contents of (link) into your PO folder and restart, or wait for a client update", undefined, "https://github.com/downloads/coyotte508/pokemon-online/ssl.zip");
            return;
        }
        checkscript = resp.split('\n');
        for (var x in checkscript) {
            if (checkscript[x].substr(0, 14) === "Script_Version") {
                version = String(checkscript[x].match(regex));
            }
        }
        if (version === undefined) {
            sendBotMessage('There was an error with the version, please report to Crystal Moogle');
            return;
        }
        version = version.replace(/"/g, "");
        var type = {
            "0": "Major Release (huge changes)",
                "1": "Minor Release (new features)",
                "2": "Bug fixes/Minor Update"
        };
        if (version !== Script_Version) {
            var typeno;
            var nversion = version.split('.');
            var cversion = Script_Version.split('.');
            for (var x in nversion) {
                if (nversion[x] !== cversion[x]) {
                    typeno = x;
                    break;
                }
            }
            if (typeno === undefined) { //this shouldn't ever happen though
                return;
            }
            sendBotMessage("A client script update is available, type: " + type[typeno] + ". Use " + commandsymbol + "updatescripts. Use " + commandsymbol + "changelog " + version + " to see the changes", undefined, script_url); //TODO make sure the script actually is a new version, rather than a previous version
            return;
        }
        if (bool === true) {
            sendBotMessage("No update detected");
        }
    });
}

function nameCheck(string) { //adapted from the PO Source Code
    if (string === undefined) {
        throw "Undefined name";
    }
    if (string.length > 20) {
        throw "Name too long";
    }
    if (string.lengh === 0) {
        throw "Name not long enough";
    }
    if (Utilities.isPunct(string[0]) !== true && Utilities.isAlnum(string[0]) !== true) {
        throw "Name cannot have start with a non-punctuation or non-alphanumeric character";
    }
    if (string[0] === "+") {
        throw "Cannot use \"+\" at start of names";
    }
    var spaced = false;
    var punct = false;
    for (var x = 0; x < string.length; x++) {
        if (string[x] === '\n' || string[x] === '%' || string[x] === '*' || string[x] === '<' || string[x] === ':' || string[x] === '(' || string[x] === ')' || string[x] === ';') {
            throw "Invalid Character";
        }
        if (Utilities.isPunct(string[x])) {
            if (punct === true) {
                //Error: two punctuations are not separated by a letter/number
                throw "two punctuations are not separated by a letter/number";
            }
            punct = true;
            spaced = false;
        }
        else if (string[x] === ' ') {
            if (spaced === true) {
                //Error: two spaces are following
                throw "two spaces are following";
            }
            spaced = true;
        }
        else if (Utilities.isAlnum(string[x])) {
            //we allow another punct & space
            punct = false;
            spaced = false;
        }
    }
    if (string.length === 1 && Utilities.isPunct(string[0])) {
        return nameCheck(fixup(string));
    }
    if (Utilities.isPunct(string[string.length - 1]) !== true && Utilities.isAlnum(string[string.length - 1]) !== true) {
        return nameCheck(fixup(string));
    }
    return string;
}

function fixup(input) {
    if (input.length > 0 && input[input.length - 1] === ' ') {
        return input.substr(0, input.length - 1);
    }
}

function saveToLog(message, channel) { //saves messages to a log file
    if (sys.isSafeScripts()) {
        return;
    }
    var logging = false;
    for (var x in logchannel) {
        if (client.channelName(channel)
            .toLowerCase() === logchannel[x].toLowerCase()) {
            logging = true;
            break;
        }
    }
    if (logging === false) {
        return;
    }
    if (typeof (sys.filesForDirectory('Channel Logs')) === "undefined") { //in case somehow it ends up in a different folder, or the folder gets removed
        sys.makeDir('Channel Logs');
    }
    var time = new Date();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    var d = time.getDate();
    var mo = parseInt(time.getMonth() + 1, 10);
    var y = time.getFullYear();
    var date = d + "-" + mo + "-" + y;
    m = checkTime(m);
    s = checkTime(s);
    var timestamp = h + ":" + m + ":" + s;
    sys.appendToFile("Channel Logs/" + client.channelName(channel) + " " + date + ".txt", "(" + timestamp + ") " + message + "\n");
}

function checkTime(i) { //adds a 0 in front of one digit minutes/seconds
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function say(message, channel) {
    if (channel === undefined) {
        channel = client.currentChannel();
    }
    client.network()
        .sendChanMessage(channel, message);
}

function stripHTML(string) {
    var regex = /(<([^>]+)>)/ig;
    string = string.replace(regex, "");
    return string;
}

function getName(string, type) { //gets the name from rainbow/me messages
    var name = "";
    if (type === "rainbow") {
        string = stripHTML(string);
        var pos = string.indexOf(': ');
        if (pos !== -1) {
            name = string.substring(0, pos);
            if (name[0] === "+") { //auth symbol is + here rather than user defined, since the PO Server Scripts print "+" out automatically for auth
                name = name.substr(1);
            }
        }
    }
    if (type === "me") {
        name = string.substring(string.indexOf('<b>') + 3, string.indexOf('</b>')); //this is assuming it's used on PO Server Scripts, or any scripts that use the same /me system
    }
    return name;
}

function sendBotMessage(message, channel, link) { //sends a mesage with the bot name in front of it
    if (channel === undefined) {
        channel = client.currentChannel();
    }
    message = html_escape(message);
    if (link === "<ping/>") {
        message = message.replace(/&lt;ping\/&gt;/g, link);
    }
    if (message.indexOf("(link)") !== -1 && link !== undefined) {
        message = message.replace(/\(link\)/g, "<a href ='" + link + "'>" + link + "</a>");
    }
    client.printChannelMessage("<font color = '" + html_escape(clientbotcolour) + "'><timestamp/>" + clientbotstyle + html_escape(clientbotname) + ":" + tagend(clientbotstyle) + "</font> " + message, channel, true);
    return;
}

function html_escape(text) { //escapes any characters that won't appear correctly in HTMLmessages
    var m = String(text);
    if (m.length > 0) {
        var amp = "&am" + "p;";
        var lt = "&l" + "t;";
        var gt = "&g" + "t;";
        return m.replace(/&/g, amp)
            .replace(/</g, lt)
            .replace(/>/g, gt);
    }
    else {
        return "";
    }
}

function tagend(string) { //automatically creates an end tag from a html tagsent to it
    var newstring = string.replace(/</g, "</");
    return newstring;
}

function awayFunction() { //makes the user go away if needed
    if (client.ownId() === -1) { //this shouldn't happen due to Network.playerLogin but people have been complaining of crashes so gonna see if this helps
        return;
    }
    if (sys.getVal("idle") === "true") {
        client.goAway(true);
    }
}

function stalkWordCheck(string, playname, bot, channel) { //adds flashes to names/stalkwords
    var ownName = html_escape(client.ownName());
    var newstring = "";
    if (string.toLowerCase()
        .indexOf(ownName.toLowerCase()) !== -1 && playname !== ownName && flash !== false && bot === false && fchannel.indexOf(client.channelName(channel)) === -1) {
        var name = new RegExp("\\b(" + ownName + ")\\b(?![^\\s<]*>)", "i");
        var names = string.match(name);
        newstring = string.replace(name, "<span style='" + hilight + "'>" + names[0] + "</span>");
        if (newstring !== string) {
            string = newstring.replace(newstring, "<i> " + newstring + "</i><ping/>");
        }
    }
    for (var x in stalkwords) {
        var stalk = new RegExp("\\b(" + stalkwords[x] + ")\\b(?![^\\s<]*>)", "i");
        var stalks = string.match(stalk);
        if (string.toLowerCase()
            .search(stalk) !== -1 && playname !== client.ownName() && flash !== false && bot === false && fchannel.indexOf(client.channelName(channel)) === -1) {
            newstring = string.replace(stalk, "<span style='" + hilight + "'>" + stalks[0] + "</span>");
            if (newstring !== string) {
                string = newstring.replace(newstring, "<i> " + newstring + "</i><ping/>");
            }
        }
    }
    return string;
}

function htmllinks(text) { //makes sure links get linked!
    var exp = /(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\(\)\[\]\/%?=~_|!:,.;']*[\-A-Z0-9+&@#\/\(\)\[\]%=~_|'])/ig;
    var found = text.match(exp);
    var newtext;
    var newfound;
    for (var x in found) {
        newfound = found[x].replace(/\//g, sys.md5('/'))
            .replace(/_/g, sys.md5('_'));
        newtext = ("<a href ='" + newfound + "'>" + newfound + "</a>")
            .replace(/&amp;/gi, "&");
        text = text.replace(found[x], newtext);
    }
    return text;
}

function addExtras(text, playname, bot, channel) { //adds stalkwords/links/enriched text etc
    text = htmllinks(text);
    text = enrichedText(text);
    if (channel !== undefined) {
        text = client.channel(channel)
            .addChannelLinks(text);
    }
    text = greenText(text);
    text = stalkWordCheck(text, playname, bot, channel);
    var md5 = new RegExp(sys.md5('/'), "g");
    var md51 = new RegExp(sys.md5('_'), "g");
    text = text.replace(md5, '/')
        .replace(md51, "_");
    return text;
}

function enrichedText(text) { //applies the enriched text, adapted from the PO 1.0.60 source
    if (etext === false) {
        return text;
    }
    var expi = new RegExp("/(\\S+)/(?![^\\s<]*>)", "g");
    text = text.replace(expi, "<i>$1</i>");
    var expii = new RegExp("\\\\(\\S+)\\\\(?![^\\s<]*>)", "g");
    text = text.replace(expii, "<i>$1</i>");
    var expb = new RegExp("\\*(\\S+)\\*(?![^\\s<]*>)", "g");
    text = text.replace(expb, "<b>$1</b>");
    var expu = new RegExp("_(\\S+)_(?![^\\s<]*>)", "g");
    text = text.replace(expu, "<u>$1</u>");
    return text;
}

function greenText(text) { //applies greentext
    if (text.substr(0, 4) === "&gt;" && tgreentext === "true") {
        text = "<font color = '" + greentext + "'>" + text + "</font>";
    }
    else {
        text = "<font color = '" + fontcolour + "'>" + text;
    }
    return text;
}

function isSafeScripts() { //checks if safe scripts is on and if it is it sends a message
    if (sys.isSafeScripts()) {
        sendBotMessage("You have safescripts on, you will not be able to update your scripts through the internet, though it should help against any harmful scripts, to turn it off, untick the box in the Script Window");
        return true;
    }
    return false;
}

function sendMessage(message, channel) { //sends a message to the user
    if (channel === undefined) {
        channel = client.currentChannel();
    }
    client.printChannelMessage(message, channel, false);
    return;
}

function ignoreCheck(name) { //checks if ignored, this is used since it's possible to bypass the autoignore function by logging in via an alt then switching names
    for (var i in ignore) {
        if (name.toLowerCase() === ignore[i].toLowerCase()) {
            client.ignore(client.id(name), true);
        }
    }
    if (client.isIgnored(client.id(name))) {
        return true;
    }
    return false;
}

function sendHtmlMessage(message, channel) { //sends a html message to the user
    if (channel === undefined) {
        channel = client.currentChannel();
    }
    client.printChannelMessage(message, channel, true);
    return;
}

function handleSystemCommand(string) {
    //TODO make the repoFolder change upon use of "cd"
    if (repoFolder === undefined) {
        return;
    }
    sys.system('cd ' + repoFolder + ' & ' + string + ' > ' + repoFolder + '/output.txt');
    var output = sys.getFileContent(repoFolder + '/output.txt')
        .split('\n');
    for (var x in output) {
        if (output[x].length > 0) {
            sendMessage(output[x]);
        }
    }
}

function commandHandler(command, commandData, channel) {
    if (command === "commandlist" || command === "commandslist") { //handles all the commands
        sys.stopEvent();
        sendMessage("*** Client Commands ***");
        sendMessage(commandsymbol + "etext on/off: Allows you to turn Enriched text on/off");
        sendMessage(commandsymbol + "greentext on/off: Allows you to turn greentext on/off");
        sendMessage(commandsymbol + "greentextcolo(u)r colour: Allows you to change your greentext colour");
        sendMessage(commandsymbol + "idle on/off: Allows you to turn auto-idle on/off");
        sendMessage(commandsymbol + "goto channel: Allows you to switch to that channel (joins if you're not in that channel)");
        sendMessage(commandsymbol + "reconnect: Allows you to reconnect to the server (Does not work if kicked/IP changes)");
        sendMessage(commandsymbol + "pm name: Allows you to start a PM with a user");
        sendMessage(commandsymbol + "changename: Allows you to change your name");
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
        sendMessage("");
        sendBotMessage('If you ever forget your command symbol, type reset symbol to revert it back to "~"');
        return;
    }
    if (command === "fontcommands") {
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
    }
    if (command === "etext") {
        sys.stopEvent();
        if (commandData === "on") {
            etext = true;
            Utilities.saveSettings();
            sendBotMessage("You turned Enriched text on!");
            return;
        }
        if (commandData === "off") {
            etext = false;
            Utilities.saveSettings();
            sendBotMessage("You turned Enriched text off!");
            return;
        }
        sendBotMessage("Please use on/off");
    }
    if (command === "greentext") {
        sys.stopEvent();
        if (commandData === "on") {
            tgreentext = true;
            Utilities.saveSettings();
            sendBotMessage("You turned greentext on!");
            return;
        }
        if (commandData === "off") {
            tgreentext = false;
            Utilities.saveSettings();
            sendBotMessage("You turned greentext off!");
            return;
        }
        sendBotMessage("Please use on/off");
    }
    if (command === "idle") {
        sys.stopEvent();
        if (commandData === "on") {
            client.goAway(true);
            sys.saveVal('idle', true);
            sendBotMessage("You turned auto-idling on!");
            return;
        }
        if (commandData === "off") {
            client.goAway(false);
            sys.saveVal('idle', false);
            sendBotMessage("You turned auto-idling off!");
            return;
        }
        sendBotMessage("Please use on/off");
    }
    if (command === "checkversion") {
        sys.stopEvent();
        if (isSafeScripts()) {
            return;
        }
        sendBotMessage("Checking script version please wait. (Current Version: " + Script_Version + ")");
        checkScriptVersion(true);
        return;
    }
    if (command === "updatealert") {
        sys.stopEvent();
        if (isSafeScripts()) {
            return;
        }
        if (commandData === "on") {
            checkversion = true;
            Utilities.saveSettings();
            sendBotMessage("You now get alerted about new versions");
            checkScriptVersion();
            return;
        }
        if (commandData === "off") {
            checkversion = false;
            Utilities.saveSettings();
            sendBotMessage("You no longer get alerted about new versions");
            return;
        }
        sendBotMessage("Please use on/off");
    }
    if (command === "goto") {
        sys.stopEvent();
        var channela = commandData.toLowerCase();
        var channels = client.channelNames();
        for (var x in channels) {
            if (channela === channels[x].toLowerCase()) {
                channela = channels[x];
                if (!client.hasChannel(client.channelId(channela))) {
                    client.join(channela);
                    return;
                }
                client.activateChannel(channela);
                return;
            }
        }
        sendBotMessage("That is not a channel!");
    }
    if (command === "reconnect") {
        sys.stopEvent();
        client.reconnect();
        return;
    }
    if (command === "pm") {
        sys.stopEvent();
        var id = client.id(commandData);
        if (id === client.ownId()) {
            return;
        }
        client.startPM(id);
        return;
    }
    if (command === "stalkwords") {
        sys.stopEvent();
        sendBotMessage("Your stalkwords are: " + stalkwords);
    }
    if (command === "addstalkword") {
        sys.stopEvent();
        var nstalkwords = commandData;
        if (nstalkwords.search(/, /g) !== -1 || nstalkwords.search(/ ,/g) !== -1) {
            nstalkwords = nstalkwords.replace(/, /g, ",")
                .replace(/ ,/g, ",");
        }
        nstalkwords = nstalkwords.split(",");
        stalkwords = Utilities.eliminateDuplicates(nstalkwords.concat(stalkwords));
        Utilities.saveSettings();
        sendBotMessage("You added " + commandData + " to your stalkwords!");
    }
    if (command === "removestalkword") {
        sys.stopEvent();
        commandData = commandData.toLowerCase();
        for (var x in stalkwords) {
            if (stalkwords[x].toLowerCase() === commandData) {
                stalkwords.splice(x, 1);
                Utilities.saveSettings();
                sendBotMessage("You removed " + commandData + " from your stalkwords!");
                return;
            }
        }
        sendBotMessage("" + commandData + " is not a stalkword!");
    }
    if (command === "flash" || command === "flashes") {
        sys.stopEvent();
        commandData = commandData.split(':');
        if (commandData.length < 2 || commandData[1] === "") {
            if (commandData[0] === "on") {
                flash = true;
                Utilities.saveSettings();
                sendBotMessage("You turned flashes on!");
                return;
            }
            else {
                flash = false;
                Utilities.saveSettings();
                sendBotMessage("You turned flashes off!");
                return;
            }
        }
        var nfchannel = commandData[1];
        if (commandData[0] === "off") {
            if (nfchannel.search(/, /g) !== -1 || nfchannel.search(/ ,/g) !== -1) {
                nfchannel = nfchannel.replace(/, /g, ",")
                    .replace(/ ,/g, ",");
            }
            nfchannel = nfchannel.split(",");
            fchannel = Utilities.eliminateDuplicates(nfchannel.concat(fchannel));
            Utilities.saveSettings();
            sendBotMessage("You won't be flashed in " + commandData[1]);
        }
        else {
            commandData[1] = commandData[1].toLowerCase();
            for (var x in fchannel) {
                if (fchannel[x].toLowerCase() === commandData[1]) {
                    fchannel.splice(x, 1);
                    Utilities.saveSettings();
                    sendBotMessage("You will be flashed in " + commandData[1]);
                    return;
                }
            }
        }
    }
    if (command === "friends") {
        sys.stopEvent();
        var check = [];
        for (var x in friends) {
            if (client.id(friends[x]) !== -1) {
                check.push("<a href='po:pm/" + client.id(friends[x]) + "'>" + friends[x] + "</a> <font color='green'>(online)</font>");
                continue;
            }
            check.push(friends[x] + " <font color='red'>(offline)</font>");
        }
        sendHtmlMessage("<font color = '" + html_escape(clientbotcolour) + "'><timestamp/>" + clientbotstyle + html_escape(clientbotname) + ":" + tagend(clientbotstyle) + "</font> Your friends are: " + check);
        return;
    }
    if (command === "addfriend") {
        sys.stopEvent();
        var nfriends = commandData;
        if (nfriends.search(/, /g) !== -1 || nfriends.search(/ ,/g) !== -1) {
            nfriends = nfriends.replace(/, /g, ",")
                .replace(/ ,/g, ",");
        }
        nfriends = nfriends.split(",");
        friends = Utilities.eliminateDuplicates(nfriends.concat(friends));
        Utilities.saveSettings();
        sendBotMessage("You added " + commandData + " to your friends!");
    }
    if (command === "removefriend") {
        sys.stopEvent();
        commandData = commandData.toLowerCase();
        for (var x in friends) {
            if (friends[x].toLowerCase() === commandData) {
                friends.splice(x, 1);
                Utilities.saveSettings();
                sendBotMessage("You removed " + commandData + " from your friends!");
                return;
            }
        }
        sendBotMessage(commandData + " is not a friend!");
    }
    if (command === "friendflash" || command === "friendsflash") {
        sys.stopEvent();
        if (commandData === "on") {
            friendsflash = true;
            Utilities.saveSettings();
            sendBotMessage("You turned friend flashes on!");
            return;
        }
        else {
            friendsflash = false;
            Utilities.saveSettings();
            sendBotMessage("You turned friend flashes off!");
        }
        return;
    }
    if (command === "ignorelist") {
        sys.stopEvent();
        sendBotMessage("Your ignorelist is: " + ignore);
    }
    if (command === "addignore") {
        sys.stopEvent();
        if (commandData === client.ownName()) {
            return;
        }
        var nignore = commandData;
        if (nignore.search(/, /g) !== -1 || nignore.search(/ ,/g) !== -1) {
            nignore = nignore.replace(/, /g, ",")
                .replace(/ ,/g, ",");
        }
        nignore = nignore.split(",");
        ignore = Utilities.eliminateDuplicates(nignore.concat(ignore));
        Utilities.saveSettings();
        if (client.id(commandData) !== -1) {
            client.ignore(client.id(commandData), true);
        }
        sendBotMessage("You added " + commandData + " to your ignorelist!");
    }
    if (command === "removeignore") {
        sys.stopEvent();
        commandData = commandData.toLowerCase();
        for (var x in ignore) {
            if (ignore[x].toLowerCase() === commandData) {
                ignore.splice(x, 1);
                Utilities.saveSettings();
                if (client.id(commandData) !== -1) {
                    client.ignore(client.id(commandData), false);
                }
                sendBotMessage("You removed " + commandData + " from your ignorelist!");
                return;
            }
        }
        sendBotMessage(commandData + " is not on the ignorelist!");
    }
    if (command === "changebotname") {
        sys.stopEvent();
        if (commandData === undefined) {
            return;
        }
        clientbotname = commandData;
        sendBotMessage(clientbotname + " is now your clientbot's name!");
        Utilities.saveSettings();
        return;
    }
    if (command === "changebotstyle") {
        sys.stopEvent();
        if (commandData === undefined) {
            clientbotstyle = "";
            sendBotMessage("You removed your client bot style!");
            Utilities.saveSettings();
            return;
        }
        clientbotstyle = commandData;
        sendBotMessage(clientbotstyle + " is now your clientbot's style!");
        Utilities.saveSettings();
        return;
    }
    if (command === "changebotcolour" || command === "changebotcolor") {
        sys.stopEvent();
        if (commandData === undefined) {
            return;
        }
        clientbotcolour = commandData;
        sendBotMessage(clientbotcolour + " is now your clientbot's colour!");
        Utilities.saveSettings();
        return;
    }
    if (command === "greentextcolor" || command === "greentextcolour") {
        sys.stopEvent();
        if (commandData === undefined || commandData === "") {
            greentext = '#789922';
            sendBotMessage(greentext + " is now your greentext colour!");
            Utilities.saveSettings();
            return;
        }
        greentext = commandData;
        sendBotMessage(greentext + " is now your greentext colour!");
        Utilities.saveSettings();
        return;
    }
    if (command === "resetbot") {
        sys.stopEvent();
        clientbotcolour = "#3DAA68";
        clientbotname = "+ClientBot";
        clientbotstyle = "<b>";
        Utilities.saveSettings();
        sendBotMessage("You reset your bot to default values");
        return;
    }
    if (command === "font") {
        sys.stopEvent();
        if (commandData === undefined) {
            return;
        }
        var type = commandData.split(":");
        if (type.length < 1) {
            sendBotMessage('Usage is ' + commandsymbol + 'font type:modifier');
            return;
        }
        var modifier = type[1];
        var types = ["colour", "color", "style", "type", "size"];
        if (types.indexOf(type[0]) === -1) {
            sendBotMessage('Invalid type, valid types are: colo(u)r, style, type, size');
            return;
        }
        if (type[0] === "colour" || type[0] === "color") {
            if (modifier === undefined || modifier === "") {
                modifier = "#000000";
                fontcolour = modifier;
                Utilities.saveSettings();
                sendBotMessage("You changed your font colour to the default");
                return;
            }
            fontcolour = modifier;
            Utilities.saveSettings();
            sendBotMessage("You changed your font colour to: " + modifier);
            return;
        }
        if (type[0] === "style") {
            if (modifier === undefined || modifier === "") {
                modifier = "";
                fontstyle = modifier;
                Utilities.saveSettings();
                sendBotMessage("You changed your font style to the default");
                return;
            }
            if (modifier.indexOf('</') !== -1) {
                sendBotMessage("End tags are not needed, please only use start ones");
                return;
            }
            fontstyle = modifier;
            Utilities.saveSettings();
            sendBotMessage("You changed your font style to: " + modifier);
            return;
        }
        if (type[0] === "type") {
            if (modifier === undefined || modifier === "") {
                modifier = "";
                fonttype = modifier;
                Utilities.saveSettings();
                sendBotMessage("You changed your font type to the default");
                return;
            }
            fonttype = modifier;
            Utilities.saveSettings();
            sendBotMessage("You changed your font to: " + modifier);
            return;
        }
        if (type[0] === "size") {
            if (modifier === undefined || modifier === "" || isNaN(parseInt(modifier, 10))) {
                modifier = 3;
                fontsize = modifier;
                Utilities.saveSettings();
                sendBotMessage("You changed your font size to the default");
                return;
            }
            fontsize = modifier;
            Utilities.saveSettings();
            sendBotMessage("You changed your font size to: " + modifier);
            return;
        }
    }
    if (command === "changename") {
        sys.stopEvent();
        try {
            commandData = nameCheck(commandData);
        }
        catch (e) {
            sendBotMessage("Invalid Name: " + e);
            return;
        }
        try {
            client.changeName(commandData);
            sendBotMessage("You changed your name to " + commandData);
        }
        catch (e) {
            if (e.toString() === "TypeError: Result of expression 'client.changeName' [undefined] is not a function.") {
                sendBotMessage("You need to update your client to Version 2.0.06 or above to use this command");
            }
        }
        return;
    }
    if (command === "changelog") {
        sys.stopEvent();
        if (isSafeScripts()) {
            return;
        }
        var changelog = sys.synchronousWebCall("https://raw.github.com/gist/3189629/ChangeLog.json");
        if (changelog.length < 1) {
            sendBotMessage("Error retrieving file");
            return;
        }
        changelog = JSON.parse(changelog);
        if (changelog.versions[commandData] === undefined) {
            sendBotMessage("Version does not exist! Use " + commandsymbol + "versions to check versions");
            return;
        }
        var details = changelog.versions[commandData].split('\n');
        sendBotMessage("Details for version: " + commandData);
        for (var x in details) {
            sendBotMessage(details[x]);
        }
        return;
    }
    if (command === "versions") {
        sys.stopEvent();
        var version = [];
        if (isSafeScripts()) {
            return;
        }
        var changelog = sys.synchronousWebCall("https://raw.github.com/gist/3189629/ChangeLog.json");
        if (changelog.length < 1) {
            sendBotMessage("Error retrieving file");
            return;
        }
        changelog = JSON.parse(changelog);
        for (var x in changelog.versions) {
            version.push(" " + x);
        }
        sendBotMessage('Versions of this script are: ' + version);
        return;
    }
    if (command === "updatescripts") {
        sys.stopEvent();
        if (isSafeScripts()) {
            return;
        }
        sendBotMessage("Fetching scripts...");
        var updateURL = script_url + 'scripts.js';
        if (commandData !== undefined && (commandData.substring(0, 7) === 'http://' || commandData.substring(0, 8) === 'https://')) {
            updateURL = commandData;
        }
        var channel_local = channel;
        var changeScript = function (resp) {
            if (resp === "") {
                sendBotMessage("There was an error accessing the script, paste the contents of (link) into your PO folder and restart, or wait for a client update", undefined, "https://github.com/downloads/coyotte508/pokemon-online/ssl.zip");
                return;
            }
            try {
                sys.changeScript(resp, true);
                sys.writeToFile(sys.scriptsFolder + "scripts.js", resp);
            }
            catch (err) {
                sys.changeScript(sys.getFileContent(sys.scriptsFolder + 'scripts.js'));
                sendBotMessage('Updating failed, loaded old scripts!');
            }
        };
        sendBotMessage("Fetching scripts from (link)", channel_local, updateURL);
        sys.webCall(updateURL, changeScript);
        return;
    }
    if (command === "authsymbol" || command === "authsymbols") {
        sys.stopEvent();
        var symbols = commandData.split(":");
        var auth = symbols[0];
        var symbol = symbols[1];
        if (symbols.length > 2 || symbols.length < 1) {
            sendBotMessage("Command usage is: \"" + commandsymbol + "changesymbols number:symbol\"");
            return;
        }
        if (isNaN(parseInt(auth, 10))) {
            sendBotMessage("The first parameter must be a number!");
            return;
        }
        if (auth < 0 || auth > 4) {
            sendBotMessage("Auth must be between 0 and 4");
            return;
        }
        if (symbol === undefined) {
            symbol = "";
        }
        auth_symbol[auth] = symbol;
        Utilities.saveSettings();
        if (symbol === "") {
            sendBotMessage("Auth " + auth + " now has no symbol");
            return;
        }
        sendBotMessage("Auth symbol for auth " + auth + " is " + symbol);
        return;
    }
    if (command === "authstyle") {
        sys.stopEvent();
        var styles = commandData.split(":");
        var auth = styles[0];
        var style = styles[1];
        if (styles.length > 2 || styles.length < 2) {
            sendBotMessage("Command usage is: \"" + commandsymbol + "changestyles number:html\"");
            return;
        }
        if (isNaN(parseInt(auth, 10))) {
            sendBotMessage("The first parameter must be a number!");
            return;
        }
        if (auth < 0 || auth > 4) {
            sendBotMessage("Auth must be between 0 and 4");
            return;
        }
        if (style.indexOf('</') !== -1) {
            sendBotMessage("End tags are not needed, please only use start ones");
            return;
        }
        if (style === undefined) {
            style = "";
        }
        auth_style[auth] = style;
        Utilities.saveSettings();
        if (style === "") {
            sendBotMessage("Auth " + auth + " now has no style");
            return;
        }
        sendBotMessage("Auth style for auth " + auth + " is " + style);
        return;
    }
    if (command === "damagecalc") {
        sys.stopEvent();
        var paras = commandData.split(':');
        if (paras.length !== 5) {
            sendBotMessage("Format is [s]atk:movepower:boosts:[s]def:hp");
            return;
        }
        for (var x in paras) {
            paras[x] = parseFloat(paras[x]);
            if (isNaN(paras[x])) {
                sendBotMessage('Parameters must be all numbers!');
                return;
            }
        }
        if (paras[2] === 0) {
            paras[2] = 1;
        }
        var calc = (84 * paras[0] * paras[1] * paras[2]) / (paras[3] * paras[4]);
        sendBotMessage(paras[1] + "BP move coming from " + paras[0] + "[s]atk with a " + paras[2] + " modifier on " + paras[4] + "HP and " + paras[3] + "[s]def, does approxmiately " + calc + " damage");
        return;
    }
    if (command === "commandsymbol") {
        sys.stopEvent();
        var symbol = commandData;
        if (symbol === undefined) {
            return;
        }
        if (symbol.length !== 1) {
            sendBotMessage("Must be 1 character long");
            return;
        }
        if (symbol === "!" || symbol === "/") {
            sendBotMessage("Warning: This symbol is the same one used for most server scripts, you can still use it for client scripts, but it may interfere with server ones");
        }
        commandsymbol = symbol;
        Utilities.saveSettings();
        sendBotMessage("Command symbol is set to: " + symbol);
        return;
    }
    if (command === "highlight" || command === "flashcolour") {
        sys.stopEvent();
        if (commandData === undefined) {
            hilight = "BACKGROUND-COLOR: #ffcc00";
            Utilities.saveSettings();
            sendBotMessage("Highlight colour set to the default");
            return;
        }
        hilight = "BACKGROUND-COLOR: " + commandData;
        Utilities.saveSettings();
        sendBotMessage("Highlight colour set to: " + hilight);
        return;
    }
    if (command === "logchannels") {
        sys.stopEvent();
        sendBotMessage("You are logging: " + logchannel);
    }
    if (command === "addlogchannel") {
        sys.stopEvent();
        if (isSafeScripts()) {
            return;
        }
        if (typeof (sys.filesForDirectory('Channel Logs')) === "undefined") {
            sys.makeDir('Channel Logs');
            return;
        }
        var nlogchannel = commandData;
        if (nlogchannel.search(/, /g) !== -1 || nlogchannel.search(/ ,/g) !== -1) {
            nlogchannel = nlogchannel.replace(/, /g, ",")
                .replace(/ ,/g, ",");
        }
        nlogchannel = nlogchannel.split(",");
        logchannel = Utilities.eliminateDuplicates(nlogchannel.concat(logchannel));
        Utilities.saveSettings();
        sendBotMessage("You added " + commandData + " to your log channels!");
    }
    if (command === "removelogchannel") {
        sys.stopEvent();
        commandData = commandData.toLowerCase();
        for (var x in logchannel) {
            if (logchannel[x].toLowerCase() === commandData) {
                logchannel.splice(x, 1);
                Utilities.saveSettings();
                sendBotMessage("You removed " + commandData + " from your log channels!");
                return;
            }
        }
        sendBotMessage(commandData + " is not a log channel!");
    }
    if (command === "armessage") {
        sys.stopEvent();
        if (commandData === undefined) {
            sendBotMessage('Your current message is: ' + armessage);
            return;
        }
        armessage = commandData;
        Utilities.saveSettings();
        sendBotMessage('You set your auto-respond message to: ' + armessage);
        return;
    }
    if (command === "artype") {
        sys.stopEvent();
        if (commandData === "command") {
            artype = "command";
            Utilities.saveSettings();
            sendBotMessage('Your auto-respond message will be activated by command');
            return;
        }
        if (commandData === "time") {
            artype = "time";
            Utilities.saveSettings();
            sendBotMessage('Your auto-respond message will be activated by time');
            return;
        }
        sendBotMessage('This is not a valid type!');
        return;
    }
    if (command === "artime") {
        sys.stopEvent();
        var time = commandData.split(':');
        if (time.length !== 2) {
            sendBotMessage('Usage of this command is: ' + commandsymbol + 'artime starthour:endhour');
            return;
        }
        if (isNaN(time[0]) || isNaN(time[1]) || time[0] < 0 || time[0] > 24 || time[1] < 0 || time[1] > 24 || time[0] === "" || time[1] === "") {
            sendBotMessage('Make sure both parameters are numbers and are between 0 and 24');
            return;
        }
        arstart = time[0];
        arend = time[1];
        Utilities.saveSettings();
        sendBotMessage('You auto response message will activate between ' + arstart + ':00 and ' + arend + ':00');
        return;
    }
    if (command === "aron") {
        sys.stopEvent();
        if (artype !== "command") {
            return;
        }
        autoresponse = true;
        Utilities.saveSettings();
        sendBotMessage('You turned your auto response on');
        return;
    }
    if (command === "aroff") {
        sys.stopEvent();
        if (artype !== "command") {
            return;
        }
        autoresponse = false;
        Utilities.saveSettings();
        sendBotMessage('You turned your auto response off');
        return;
    }
    if (command === "eval") {
        sys.stopEvent();
        eval(commandData);
        return;
    }
    if (command === "evalp") {
        sys.stopEvent();
        var bindChannel = channel;
        try {
            var res = eval(commandData);
            sendMessage("Got from eval: " + res, bindChannel);
        }
        catch (err) {
            sendMessage("Error in eval: " + err, bindChannel);
        }
        return;
    }
}

function formatMessage(message, channel) {
    var pos = message.indexOf(': ');
    var chan = channel;
    var bot = false;
    if (pos !== -1) {
        if (client.id(message.substring(0, pos)) === -1 || client.id(message.substring(0, pos)) === undefined) {
            bot = true;
        }
        var playname = message.substring(0, pos);
        if (ignoreCheck(playname)) {
            sys.stopEvent();
            return;
        }
        var id = client.id(playname);
        var playmessage = html_escape(message.substr(pos + 2));
        var colour = client.color(id);
        if (bot === true) {
            colour = clientbotcolour;
        }
        var auth = client.auth(id);
        if (auth > 4 || auth < 0) {
            auth = 4;
        }
        playmessage = addExtras(playmessage, playname, bot, channel);
        var symbol = auth_symbol[auth];
        if (bot === true) {
            symbol = "";
        }
        if (channel === undefined) {
            client.printHtml("<font face ='" + fonttype + "'><font size = " + fontsize + "><font color='" + colour + "'><timestamp/> " + symbol + auth_style[auth] + playname + ": </font>" + tagend(auth_style[auth]) + fontstyle + playmessage + tagend(fontstyle));
        }
        else {
            client.printChannelMessage("<font face ='" + fonttype + "'><font size = " + fontsize + "><font color='" + colour + "'><timestamp/> " + symbol + auth_style[auth] + playname + ": </font>" + tagend(auth_style[auth]) + fontstyle + playmessage + tagend(fontstyle), chan, true);
        }
        sys.stopEvent();
    }
}
if (client.ownId() !== -1) {
    init();
}
client.network()
    .playerLogin.connect(function () { //only call when the user has logged in to prevent any crashes
    awayFunction();
    init();
});
Script_Version = "2.0.00"; //version the script is currently on
poScript = ({
    clientStartUp: function () {
        sendMessage('Script Check: OK'); //use this to send a message on update scripts
    },
    onPlayerReceived: function (id) { //detects when a player is visible to the client (mostly logins, but may also happen upon joining a new channel)
        var flashvar = "";
        if (friendsflash === true) {
            flashvar = "<ping/>";
        }
        for (var x in friends) {
            if (client.name(id)
                .toLowerCase() === friends[x].toLowerCase() && flash === true) {
                sendHtmlMessage("<font color = '" + html_escape(clientbotcolour) + "'><timestamp/>" + clientbotstyle + html_escape(clientbotname) + ":" + tagend(clientbotstyle) + "</font> User <a href='po:pm/" + id + "'>" + client.name(id) + "</a> has logged in" + flashvar + "", client.currentChannel());
            }
        }
        for (var x in ignore) {
            if (client.name(id)
                .toLowerCase() === ignore[x].toLowerCase()) {
                client.ignore(id, true);
            }
        }
    },
    onPlayerJoinChan: function (id, channel) {
        saveToLog(client.name(id) + " joined the channel", channel);
    },
    onPlayerLeaveChan: function (id, channel) {
        saveToLog(client.name(id) + " left the channel", channel);
    },
    beforeNewMessage: function (message, html) {
        if (initCheck !== true) {
            init();
        }
        if (html === true) {
            return;
        }
        formatMessage(message);
    },
    beforeChannelMessage: function (message, channel, html) { //detects a channel specific message
        if (initCheck !== true) {
            init();
        }
        if (message.indexOf('<timestamp/> *** <b>') !== -1) {
            var ignored = getName(message, "me");
            if (ignoreCheck(ignored)) {
                sys.stopEvent();
                return;
            }
            saveToLog(stripHTML(message), channel);
        }
        if (message.indexOf('<timestamp/><b><span style') !== -1) {
            var ignored = getName(message, "rainbow");
            if (ignoreCheck(ignored)) {
                sys.stopEvent();
                return;
            }
            saveToLog(stripHTML(message), channel);
        }
        if (html === true) {
            return;
        }
        saveToLog(message, channel);
        formatMessage(message, channel);
    },
    beforePMReceived: function (id, message) { // called before a PM is received
        if (ignoreCheck(client.name(id))) {
            sys.stopEvent();
            return;
        }
    },
    afterPMReceived: function (id, message) { //called after a PM is received
        if (playerswarn[id] === true) {
            return;
        }
        var time = new Date();
        var h = time.getHours();
        if (artype === "time") {
            if (arstart < arend) {
                if (h >= arstart && h < arend) {
                    client.network()
                        .sendPM(id, armessage);
                    playerswarn[id] = true;
                    return;
                }
            }
            if (h >= arend && h < arstart) {
                client.network()
                    .sendPM(id, armessage);
                playerswarn[id] = true;
                return;
            }
        }
        if (autoresponse === true) {
            client.network()
                .sendPM(id, armessage);
            playerswarn[id] = true;
            return;
        }
        return;
    },
    beforeSendMessage: function (message, channel) { //detects messages sent by the client
        var mess = message.toLowerCase();
        if ((mess.substring(0, 3) === "git" || mess.substring(0, 2) === "cd" || mess.substring(0, 3) === "dir") && typeof sys.system !== "undefined") {
            sys.stopEvent();
            try {
                handleSystemCommand(message);
            }
            catch (e) {
                sendBotMessage('Error with sys.system() ' + e);
            }
            return;
        }
        if (message.toLowerCase() === "reset symbol") {
            sys.stopEvent();
            commandsymbol = "~";
            sendBotMessage('You reset your command symbol to "~"!');
            Utilities.saveSettings();
            return;
        }
        if (message[0] === commandsymbol) {
            var command, commandData;
            var pos = message.indexOf(' ');
            if (pos !== -1) {
                command = message.substring(1, pos)
                    .toLowerCase();
                commandData = message.substr(pos + 1);
            }
            else {
                command = message.substr(1)
                    .toLowerCase();
            }
            try {
                commandHandler(command, commandData, channel);
            }
            catch (e) {
                sendBotMessage('ERROR: ' + e); //TODO: Add proper error checks
            }
        }
    }
});
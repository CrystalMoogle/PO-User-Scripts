/*
 Client Scripts
 Make sure you check ~commandslist for a list of commands
 Safe Scripts are pretty much required to be off
 Currently needs PO Version 2.0.06 to run correctly (Though 2.0.07 is strongly recommended)
 Report bugs here: http://pokemon-online.eu/forums/showthread.php?15079 and read over the thread to check for anything
 Needed files: Utilities.js, Commands.js
 If it doesn't automatically download them, get them from https://github.com/CrystalMoogle/PO-User-Scripts/tree/devel and save them as their appropriate names in a folder called "ClientScripts" in your main PO Folder
 */
//these things below shouldn't be touched unless you know what you're doing~
/*jshint "laxbreak":true,"shadow":true,"undef":true,"evil":true,"trailing":true,"proto":true,"withstmt":true*/
/*global sys,client */
var script_url = "https://raw.github.com/CrystalMoogle/PO-User-Scripts/devel/"; //where the script is stored
var scriptsFolder = "ClientScripts"; //replace with undefined if you don't want a folder
var global = this;
var poScript, Script_Version, initCheck, repoFolder, etext, tgreentext, flash, autoresponse, friendsflash, checkversion, clientbotname, clientbotcolour, clientbotstyle, greentext, fontcolour, fonttype, fontsize, fontstyle, commandsymbol, hilight, armessage, arstart, arend, artype, stalkwords, friends, ignore, logchannel, fchannel, auth_symbol, auth_style, src, Utilities, Commands, autoidle, nochallenge, Plugins, userplugins, weightData, playerswarn;
var neededFiles = ["utilities.js", "commands.js"]; //files needed for the script in an array
var pluginFiles = [];
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};
Utilities = ({
    loadSettings: function loadSettings(json, defaultUsed, silent) {
        cleanFile('memory.json');
        try {
            var settings;
            if (json === undefined) {
                if (sys.getFileContent('memory.json') === "") {
                    sendBotMessage('File not found, loaded from old settings');
                    this.loadFromRegistry();
                }
                settings = JSON.parse(sys.getFileContent('memory.json'));
            }
            else {
                settings = JSON.parse(json);
            }
            etext = settings.etext;
            nochallenge = settings.nochallenge;
            autoidle = settings.autoidle;
            tgreentext = settings.tgreentext;
            flash = settings.flash;
            autoresponse = settings.autoresponse;
            friendsflash = settings.friendsflash;
            checkversion = settings.checkversion;
            clientbotname = settings.clientbotname;
            clientbotcolour = settings.clientbotcolour;
            clientbotstyle = settings.clientbotstyle;
            greentext = settings.greentext;
            fontcolour = settings.fontcolour;
            fonttype = settings.fonttype;
            fontsize = settings.fontsize;
            fontstyle = settings.fontstyle;
            commandsymbol = settings.commandsymbol;
            hilight = settings.hilight;
            armessage = settings.armessage;
            arstart = settings.arstart;
            arend = settings.arend;
            artype = settings.artype;
            userplugins = settings.userplugins;
            stalkwords = settings.stalkwords;
            friends = settings.friends;
            ignore = settings.ignore;
            logchannel = settings.logchannel;
            fchannel = settings.fchannel;
            playerswarn = settings.playerswarn;
            auth_symbol = settings.auth_symbol;
            auth_style = settings.auth_style;
            if (silent === false) {
                sendBotMessage("Settings loaded");
            }
        }
        catch (e) {
            sendBotMessage("Error with your settings: " + e);
            if (defaultUsed !== true) {
                sendBotMessage("Loading default settings");
                this.loadDefaultSettings();
            }
        }
    },

    loadDefaultSettings: function loadDefaultSettings() {
        var json = {
            "etext": false,
            "autoidle": false,
            "nochallenge": false,
            "tgreentext": false,
            "flash": true,
            "autoresponse": false,
            "friendsflash": false,
            "checkversion": false,
            "clientbotname": "+ClientBot",
            "clientbotcolour": "#3DAA68",
            "clientbotstyle": "<b>",
            "greentext": "#789922",
            "fontcolour": "#000000",
            "fonttype": "",
            "fontsize": 3,
            "fontstyle": "",
            "commandsymbol": "~",
            "hilight": "BACKGROUND-COLOR: #ffcc00",
            "armessage": "I am currently unavailable!",
            "arstart": "",
            "arend": "",
            "artype": "command",
            "userplugins": [],
            "stalkwords": [],
            "friends": [],
            "ignore": [],
            "logchannel": [],
            "fchannel": [],
            "playerswarn": [],
            "auth_symbol": {
                "0": "",
                "1": "+",
                "2": "+",
                "3": "+",
                "4": ""
            },
            "auth_style": {
                "0": "<b>",
                "1": "<b><i>",
                "2": "<b><i>",
                "3": "<b><i>",
                "4": "<b>"
            }
        };
        this.loadSettings(JSON.stringify(json), true);
    },

    loadFromRegistry: function loadFromRegistry() { //kinda needed because compatability sucks
        etext = Boolean(sys.getVal('etext'));
        autoidle = Boolean(sys.getVal('idle'));
        nochallenge = false;
        tgreentext = Boolean(sys.getVal('tgreentext'));
        autoresponse = Boolean(sys.getVal('autoresponse'));
        friendsflash = Boolean(sys.getVal('friendsflash'));
        checkversion = Boolean(sys.getVal('checkversion'));
        clientbotname = "+ClientBot";
        if (sys.getVal('flash') === "false") { //making sure flash is on always unless specified to not be
            flash = false;
        }
        else {
            flash = true;
        }
        if (sys.getVal('clientbotname')
            .length > 0) {
            clientbotname = sys.getVal('clientbotname');
        }
        clientbotcolour = "#3DAA68";
        if (sys.getVal('clientbotcolour')
            .length > 0) {
            clientbotcolour = sys.getVal('clientbotcolour');
        }
        clientbotstyle = "<b>";
        if (sys.getVal('clientbotstyle')
            .length > 0) {
            clientbotstyle = sys.getVal('clientbotstyle');
        }
        greentext = '#789922';
        if (sys.getVal('greentext')
            .length > 0) {
            greentext = sys.getVal('greentext');
        }
        fontcolour = "#000000";
        if (sys.getVal('fontcolour')
            .length > 0) {
            fontcolour = sys.getVal('fontcolour');
        }
        fonttype = "";
        if (sys.getVal('fonttype')
            .length > 0) {
            fonttype = sys.getVal('fonttype');
        }
        fontsize = 3;
        if (sys.getVal('fontsize')
            .length > 0) {
            fontsize = sys.getVal('fontsize');
        }
        fontstyle = "";
        if (sys.getVal('fontstyle')
            .length > 0) {
            fontstyle = sys.getVal('fontstyle');
        }
        commandsymbol = "~";
        if (sys.getVal('commandsymbol')
            .length > 0) {
            commandsymbol = sys.getVal('commandsymbol');
        }
        hilight = "BACKGROUND-COLOR: #ffcc00";
        if (sys.getVal('hilight')
            .length > 0) {
            hilight = sys.getVal('hilight');
        }
        armessage = sys.getVal('armessage');
        arstart = sys.getVal('arstart');
        arend = sys.getVal('arend');
        artype = sys.getVal('artype');
        userplugins = [];
        stalkwords = [];
        friends = [];
        ignore = [];
        logchannel = [];
        fchannel = [];
        if (sys.getVal('stalkwords') !== "") {
            var nstalkwords = sys.getVal('stalkwords')
                .split(",");
            stalkwords = nstalkwords.concat(stalkwords);
            stalkwords = this.eliminateDuplicates(stalkwords);
        }
        if (sys.getVal('friends') !== "") {
            var nfriends = sys.getVal('friends')
                .split(",");
            friends = nfriends.concat(friends);
            friends = this.eliminateDuplicates(friends);
        }
        if (sys.getVal('ignore') !== "") {
            var nignore = sys.getVal('ignore')
                .split(",");
            ignore = nignore.concat(ignore);
            ignore = this.eliminateDuplicates(ignore);
        }
        if (sys.getVal('logchannel') !== "") {
            var nlogchannel = sys.getVal('logchannel')
                .split(",");
            logchannel = nlogchannel.concat(logchannel);
            logchannel = this.eliminateDuplicates(logchannel);
        }
        if (sys.getVal('fchannel') !== "") {
            var nfchannel = sys.getVal('fchannel')
                .split(",");
            fchannel = nfchannel.concat(fchannel);
            fchannel = this.eliminateDuplicates(fchannel);
        }
        auth_symbol = [];
        for (var x = 0; x < 5; x++) {
            if (sys.getVal('auth: ' + x)
                .length > 0) {
                auth_symbol[x] = sys.getVal('auth: ' + x);
                continue;
            }
            if (x === 0 || x === 4) {
                auth_symbol[x] = "";
                continue;
            }
            auth_symbol[x] = "+";
        }
        auth_style = [];
        for (var x = 0; x < 5; x++) {
            if (sys.getVal('auths: ' + x)
                .length > 0) {
                auth_style[x] = sys.getVal('auths: ' + x);
                continue;
            }
            if (x === 0 || x === 4) {
                auth_style[x] = "<b>";
                continue;
            }
            auth_style[x] = "<i><b>";
        }
        playerswarn = [];
        this.saveSettings();
    },

    saveSettings: function saveSettings() {
        var settings = {};
        settings.etext = etext;
        settings.autoidle = autoidle;
        settings.nochallenge = nochallenge;
        settings.tgreentext = tgreentext;
        settings.flash = flash;
        settings.autoresponse = autoresponse;
        settings.friendsflash = friendsflash;
        settings.checkversion = checkversion;
        settings.clientbotname = clientbotname;
        settings.clientbotcolour = clientbotcolour;
        settings.clientbotstyle = clientbotstyle;
        settings.greentext = greentext;
        settings.fontcolour = fontcolour;
        settings.fonttype = fonttype;
        settings.fontsize = fontsize;
        settings.fontstyle = fontstyle;
        settings.commandsymbol = commandsymbol;
        settings.hilight = hilight;
        settings.armessage = armessage;
        settings.arstart = arstart;
        settings.arend = arend;
        settings.artype = artype;
        settings.userplugins = userplugins;
        settings.stalkwords = stalkwords;
        settings.friends = friends;
        settings.ignore = ignore;
        settings.logchannel = logchannel;
        settings.fchannel = fchannel;
        settings.playerswarn = playerswarn;
        settings.auth_symbol = auth_symbol;
        settings.auth_style = auth_style;
        sys.writeToFile('memory.json', JSON.stringify(settings));
    },

    eliminateDuplicates: function eliminateDuplicates(arr) { //stolen from http://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/ eliminates any duplicates that are in an array
        var len = arr.length;
        var out = [];
        var obj = {};
        for (var i = 0; i < len; i++) {
            obj[arr[i]] = 0;
        }
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                out.push(i);
            }
        }
        return out;
    },

    isPunct: function isPunct(i) {
        return (this.isGraph(i) && !(this.isAlnum(i)));
    },

    isGraph: function isGraph(i) {
        var myCharCode = i.charCodeAt(0);
        return (myCharCode > 32) && (myCharCode < 127);
    },

    isAlnum: function isAlnum(i) {
        return (this.isDigit(i) || this.isAlpha(i));
    },

    isDigit: function isDigit(i) {
        var myCharCode = i.charCodeAt(0);
        return (myCharCode > 47) && (myCharCode < 58);
    },

    isAlpha: function isAlpha(i) {
        var myCharCode = i.charCodeAt(0);
        return ((myCharCode > 64) && (myCharCode < 91)) || ((myCharCode > 96) && (myCharCode < 123));
    },

    stripHTML: function stripHTML(string) {
        var regex = /(<([^>]+)>)/ig;
        string = string.replace(regex, "");
        return string;
    },

    html_escape: function html_escape(text) { //escapes any characters that won't appear correctly in HTMLmessages
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
    },

    tagend: function tagend(string) { //automatically creates an end tag from a html tagsent to it
        if (string === undefined) {
            return "";
        }
        return string.replace(/</g, "</");
    }
});

Commands = ({
    commandHandler: function commandHandler(command, commandData, channel) {
        if (command === "commandlist" || command === "commandslist") {
            sys.stopEvent();
            sendMessage("*** Client Commands ***");
            sendMessage(commandsymbol + "commandsymbol symbol: Allows you to change the command symbol");
            sendMessage(commandsymbol + "idle on/off: Allows you to turn auto-idle on/off");
            sendMessage(commandsymbol + "flash on/off:channel: Allows you to turn flashes on/off. Channel is an optional parameter to turn flashes off for one channel");
            sendMessage(commandsymbol + "ignorechallenges on/off: Allows you to ignore all challenges without idling");
            sendMessage(commandsymbol + "goto channel: Allows you to switch to that channel (joins if you're not in that channel)");
            sendMessage(commandsymbol + "reconnect: Allows you to reconnect to the server");
            sendMessage(commandsymbol + "pm name: Allows you to start a PM with a user");
            sendMessage(commandsymbol + "changename: Allows you to change your name");
            sendMessage(commandsymbol + "stalkwords: Allows you to view your current stalkwords");
            sendMessage(commandsymbol + "[add/remove]stalkword word: Allows you to add/remove stalkwords");
            sendMessage(commandsymbol + "logchannels: Allows you to view your log channels");
            sendMessage(commandsymbol + "[add/remove]logchannel channel: Allows you to add/remove channels from the channels you log");
            sendMessage(commandsymbol + "pokedex: pokemon:level:gen: Shows you details about a pokemon. Gen/level are optional parameters to view the pokemon in different gens/at different levels");
            sendMessage(commandsymbol + "formatcommands: Shows the formatting comands (e.g. enriched text, auth symbols)");
            sendMessage(commandsymbol + "scriptcommands: Shows commands related to the scripts (e.g. versions, updatescripts)");
            sendMessage(commandsymbol + "socialcommands: Shows commands related to social aspects (e.g. friendslist, ignorelist)");
            sendMessage(commandsymbol + "fontcommands: Shows you the font command details");
            var pluginhelps = getPlugins("help-string");
            for (var module in pluginhelps) {
                if (pluginhelps.hasOwnProperty(module)) {
                    var help = typeof pluginhelps[module] == "string" ? [pluginhelps[module]] : pluginhelps[module];
                    for (var i = 0; i < help.length; ++i) {
                        sendMessage(commandsymbol + help[i]);
                    }
                }
            }
            sendMessage(commandsymbol + "damagecalc [s]atk:move power:modifier:[s]def:HP: Basic damage calculator");
            sendMessage("Explanation: [s]atk is the attacking pokémon's exact stat (not base), move power is the move's base power, modifier is any modifiers that need to be added (e.g. life orb is 1.3), HP/[s]def is the defending pokémon's exact HP/Def stats (not base)");
            sendMessage("Example: " + commandsymbol + "damagecalc 100:100:1.3:100:100 will show you the result of a pokémon with 100 [s]atk, with Life Orb using a 100bp move against a pokémon with 100HP/[s]def");
            sendMessage("");
            sendBotMessage('If you ever forget your command symbol, type "reset symbol" (no quotes) to revert it back to "~"');
            return;
        }
        if (command === "formatcommands") {
            sys.stopEvent();
            sendMessage("*** Formatting Commands ***");
            sendMessage(commandsymbol + "etext on/off: Allows you to turn Enriched text on/off");
            sendMessage(commandsymbol + "greentext on/off: Allows you to turn greentext on/off");
            sendMessage(commandsymbol + "greentextcolo(u)r colour: Allows you to change your greentext colour");
            sendMessage(commandsymbol + "highlight colour: Allows you to change the colour of the highlight when flashed");
            sendMessage(commandsymbol + "changebotcolo(u)r colour: Allows you to change the bot's (client and server) colour");
            sendMessage(commandsymbol + "changebotname name: Allows you to change clientbot's name");
            sendMessage(commandsymbol + "changebotstyle htmltag: Allows you to change the style of the client bot (start tags only)");
            sendMessage(commandsymbol + "resetbot: Allows you to reset the bot to its default values");
            sendMessage(commandsymbol + "authsymbols auth:symbol: Allows you to change authsymbols. If symbol is left blank, then it removes the current auth symbol");
            sendMessage(commandsymbol + "authstyle auth:htmltag: Allows you to change the name style of auth. Make sure to use start tags only. If htmltag is left blank, then it will remove the current style");
            return;
        }
        if (command === "scriptcommands") {
            sys.stopEvent();
            sendMessage("*** Script Commands ***");
            sendMessage(commandsymbol + "updatescripts: Allows you to updatescripts");
            sendMessage(commandsymbol + "versions: Allows you to view the current versions");
            sendMessage(commandsymbol + "changelog version: Allows you to view the changelog");
            sendMessage(commandsymbol + "checkversion: Allows you to check for updates");
            sendMessage(commandsymbol + "updatealert on/off: Allows you to get automatically alerted about new versions");
            return;
        }
        if (command === "socialcommands") {
            sys.stopEvent();
            sendMessage("*** Social Commands ***");
            sendMessage(commandsymbol + "friends: Allows you to view your current friends and their online status");
            sendMessage(commandsymbol + "[add/remove]friend friend: Allows you to add/remove friends");
            sendMessage(commandsymbol + "friendflash on/off: Allows you turn friend flashes on/off");
            sendMessage(commandsymbol + "ignorelist: Allows you to view your autoignore list");
            sendMessage(commandsymbol + "[add/remove]ignore user: Allows you to add/remove people from your ignore list");
            sendMessage(commandsymbol + "armessage: Sets your autoresponse message");
            sendMessage(commandsymbol + "artype [command/time]: Sets how to activate your autoresponse, time does it between certain hours, command activates it by command");
            sendMessage(commandsymbol + "ar[on/off]: Turns your autoresponse on/off if type if command");
            sendMessage(commandsymbol + "artime hour1:hour2: Sets your autoresponse to activate between hour1 and hour2");
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
                autoidle = true;
                Utilities.saveSettings();
                sendBotMessage("You turned auto-idling on!");
                return;
            }
            if (commandData === "off") {
                client.goAway(false);
                autoidle = false;
                Utilities.saveSettings();
                sendBotMessage("You turned auto-idling off!");
                return;
            }
            sendBotMessage("Please use on/off");
        }
        if (command === "ignorechallenges") {
            sys.stopEvent();
            if (commandData === "on") {
                nochallenge = true;
                Utilities.saveSettings();
                sendBotMessage("You are ignoring all challenges");
                return;
            }
            if (commandData === "off") {
                nochallenge = false;
                Utilities.saveSettings();
                sendBotMessage("You are no longer ignoring challenges");
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
            for (var x = 0; x < channels.length; x++) {
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
            for (var x = 0; x < stalkwords.length; x++) {
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
                for (var x = 0; x < fchannel.length; x++) {
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
            for (var x = 0; x < friends.length; x++) {
                if (client.id(friends[x]) !== -1) {
                    check.push("<a href='po:pm/" + client.id(friends[x]) + "'>" + friends[x] + "</a> <font color='green'>(online)</font>");
                    continue;
                }
                check.push(friends[x] + " <font color='red'>(offline)</font>");
            }
            sendHtmlMessage("<font color = '" + Utilities.html_escape(clientbotcolour) + "'><timestamp/>" + clientbotstyle + Utilities.html_escape(clientbotname) + ":" + Utilities.tagend(clientbotstyle) + "</font> Your friends are: " + check);
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
            for (var x = 0; x < friends.length; x++) {
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
            for (var x = 0; x < ignore.length; x++) {
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
            for (var x = 0; x < details.length; x++) {
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
            var updateURL = script_url + 'script.js';
            if (commandData !== undefined && (commandData.substring(0, 7) === 'http://' || commandData.substring(0, 8) === 'https://')) {
                updateURL = commandData;
            }
            var channel_local = channel;
            sendBotMessage("Fetching scripts from (link)", channel_local, updateURL);
            sys.webCall(updateURL, changeScript);
            return;
        }
        if (command === "updateplugin") {
            sys.stopEvent();
            if (pluginFiles.indexOf(commandData) !== -1) {
                updateFile(commandData);
                return;
            }
            sendBotMessage("This is not a valid script plugin");
            return;
        }
        if (command === "addplugin") {
            sys.stopEvent();
            if (neededFiles.indexOf(commandData.split(/\//).pop()) !== -1 || pluginFiles.indexOf(commandData.split(/\//).pop()) !== -1) {
                updateFile(commandData);
                return;
            }
            pluginFiles = pluginFiles.concat(commandData.split(/\//).pop());
            addPlugin(commandData);
            return;
        }
        if (command === "loadsettings") { //TODO Allow user defined files to be loaded in the future from web or file system
            sys.stopEvent();
            Utilities.loadSettings(undefined, undefined, false);
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
            for (var x = 0; x < paras.length; x++) {
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
        if (command === "pokedex") {
            sys.stopEvent();
            var version = sys.version().replace(/\./g, "").length == 4 ? sys.version().replace(/\./g, "") : sys.version().replace(/\./g, "")*10;
            if (version < 2008) {
                sendBotMessage("This command will only work on versions 2.0.08 and higher");
                return;
            }
            if (commandData === undefined) {
                sendBotMessage("Usage is " + commandsymbol + "pokedex pokemon:level:gen (gen/level are optional)");
                return;
            }
            commandData = commandData.split(':');
            if (commandData.length > 3) {
                sendBotMessage("Usage is " + commandsymbol + "pokedex pokemon:level:gen (gen/level are optional)");
                return;
            }
            var pokemon = sys.pokeNum(commandData[0]);
            var gen = parseInt(commandData[2], 10);
            var level = parseInt(commandData[1], 10);
            if (isNaN(gen) || gen === undefined || gen > 5 || gen < 1) {
                gen = 5;
            }
            if (isNaN(level) || level === undefined || level > 100 || level < 1) {
                level = 100;
            }
            pokeDex(pokemon, gen, level);
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
            for (var x = 0; x < logchannel.length; x++) {
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
        }
    }
});
require = function require(module_name) {
    var module = {};
    module.module = module;
    module.exports = {};
    module.source = module_name;
    with(module) {
        var content = sys.getFileContent(scriptsFolder + "/" + module_name);
        if (content) {
            try {
                eval(sys.getFileContent(scriptsFolder + "/" + module_name));
            }
            catch (e) {
                print("Error loading module " + module_name + ": " + e + (e.lineNumber ? " on line: " + e.lineNumber : ""));
            }
        }
    }
    return module.exports;
};

function print(message) {
    sendMessage(message);
}

function cleanFile(filename) {
    sys.appendToFile(filename, "");
}

function updateFile(filename) {
    var url = script_url + "clientscripts/" + filename;
    if (/^https?:\/\//.test(filename)) {
        url = filename;
    }
    filename = filename.split(/\//).pop();
    sys.webCall(url, function (resp) {
        sys.writeToFile(scriptsFolder + "/" + filename, resp);
        loadPlugins();
        sendBotMessage("Plugin " + filename + " updated!");
    });
}

function checkPlugins() {
    for (var x = 0; x < userplugins.length; x++) {
        if (pluginFiles.indexOf(userplugins[x]) === -1) {
            pluginFiles = pluginFiles.concat(userplugins[x]);
        }
    }
    for (var x = 0; x < pluginFiles.length; x++) {
        cleanFile(scriptsFolder + '/' + pluginFiles[x]);
        if (sys.getFileContent(scriptsFolder + '/' + pluginFiles[x]) === "") {
            updateFile(pluginFiles[x]);
        }
    }
    loadPlugins();
}

function addPlugin(filename) {
    var url = script_url + "clientscripts/" + filename;
    if (/^https?:\/\//.test(filename)) {
        url = filename;
    }
    filename = filename.split(/\//).pop();
    sys.webCall(url, function (resp) {
        sys.writeToFile(scriptsFolder + "/" + filename, resp);
        loadPlugins();
        sendBotMessage("Plugin " + filename + " added!");
    });
    userplugins = userplugins.concat(filename);
    Utilities.saveSettings();
}

function loadPlugins() {
    var plugins = [];
    for (var i = 0; i < pluginFiles.length; ++i) {
        var plugin = require(pluginFiles[i]);
        plugin.source = pluginFiles[i];
        plugins.push(plugin);
    }
    Plugins = plugins;
}

function callPlugins(event) {
    var ret = false;
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < Plugins.length; ++i) {
        if (Plugins[i].hasOwnProperty(event)) {
            try {
                if (Plugins[i][event].apply(Plugins[i], args)) {
                    ret = true;
                    break;
                }
            }
            catch (e) {
                sendBotMessage('Plugins-error on {0}: {1}'.format(Plugins[i].source, e));
            }
        }
    }
    return ret;
}

function getPlugins(data) {
    var ret = {};
    for (var i = 0; i < Plugins.length; ++i) {
        if (Plugins[i].hasOwnProperty(data)) {
            ret[Plugins[i].source] = Plugins[i][data];
        }
    }
    return ret;
}

function init() { //defines all the variables that are going to be used in the script, uses default if no saved settings are found
    if (sys.isSafeScripts() !== true) {
        Utilities.loadSettings();
        checkScriptVersion();
    }
    else {
        Utilities.loadFromRegistry();
    }
    checkPlugins();
    playerswarn = [];
    initCheck = true;
}

function checkScriptVersion(bool) { //checks the current script version with the one saved on Github, if the versions do not match, then it gives a warning
    var checkscript, version;
    var regex = /"([^"]*)"/g;
    if (bool === undefined) {
        bool = false;
    }
    if (checkversion === false && bool === false) {
        return;
    }
    sys.webCall(script_url + 'script.js', function (resp) {
        if (resp.length === 0) {
            sendBotMessage("There was an error accessing the script, paste the contents of (link) into your PO folder and restart, or wait for a client update", undefined, "https://github.com/downloads/coyotte508/pokemon-online/ssl.zip");
            return;
        }
        checkscript = resp.split('\n');
        for (var x = 0; x < checkscript.length; x++) {
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
            for (var x = 0; x < nversion.length; x++) {
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
    if (string.length === 0) {
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
    return "";
}

function saveToLog(message, channel) { //saves messages to a log file
    if (sys.isSafeScripts()) {
        return;
    }
    var logging = false;
    for (var x = 0; x < logchannel.length; x++) {
        if (client.channelName(channel).toLowerCase() === logchannel[x].toLowerCase()) {
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
    client.network().sendChanMessage(channel, message);
}

function getName(string, type) { //gets the name from rainbow/me messages
    var name = "";
    if (type === "rainbow") {
        string = Utilities.stripHTML(string);
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
    message = Utilities.html_escape(message);
    if (link === "<ping/>") {
        message = message.replace(/&lt;ping\/&gt;/g, link);
    }
    if (message.indexOf("(link)") !== -1 && link !== undefined) {
        message = message.replace(/\(link\)/g, "<a href ='" + link + "'>" + link + "</a>");
    }
    client.printChannelMessage("<font color = '" + Utilities.html_escape(clientbotcolour) + "'><timestamp/>" + clientbotstyle + Utilities.html_escape(clientbotname) + ":" + Utilities.tagend(clientbotstyle) + "</font> " + message, channel, true);
}

function awayFunction() { //makes the user go away if needed
    if (client.ownId() === -1) { //this shouldn't happen due to Network.playerLogin but people have been complaining of crashes so gonna see if this helps
        return;
    }
    if (autoidle === true) {
        client.goAway(true);
    }
}

function stalkWordCheck(string, playname, bot, channel) { //adds flashes to names/stalkwords
    var ownName = Utilities.html_escape(client.ownName());
    var newstring = "";
    if (string.toLowerCase().indexOf(ownName.toLowerCase()) !== -1 && playname !== ownName && flash !== false && bot === false && fchannel.indexOf(client.channelName(channel)) === -1) {
        var name = new RegExp("\\b(" + ownName + ")\\b(?![^\\s<]*>)", "i");
        var names = string.match(name);
        if (names) {
            newstring = string.replace(name, "<span style='" + hilight + "'>" + names[0] + "</span>");
            if (newstring !== string) {
                string = newstring.replace(newstring, "<i> " + newstring + "</i><ping/>");
            }
        }
    }
    for (var x = 0; x < stalkwords.length; x++) {
        var stalk = new RegExp("\\b(" + stalkwords[x] + ")\\b(?![^\\s<]*>)", "i");
        var stalks = string.match(stalk);
        if (string.toLowerCase().search(stalk) !== -1 && playname !== client.ownName() && flash !== false && bot === false && fchannel.indexOf(client.channelName(channel)) === -1) {
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
        if (found.hasOwnProperty(x)) {
            newfound = found[x].replace(/\//g, sys.md5('/')).replace(/_/g, sys.md5('_'));
            newtext = ("<a href ='" + newfound + "'>" + newfound + "</a>").replace(/&amp;/gi, "&");
            text = text.replace(found[x], newtext);
        }
    }
    return text;
}

function addExtras(text, playname, bot, channel) { //adds stalkwords/links/enriched text etc
    text = htmllinks(text);
    text = enrichedText(text);
    if (client.channel(client.currentChannel())) {
        text = client.channel(client.currentChannel()).addChannelLinks(text);
    }
    text = greenText(text);
    text = stalkWordCheck(text, playname, bot, channel);
    var md5 = new RegExp(sys.md5('/'), "g");
    var md51 = new RegExp(sys.md5('_'), "g");
    text = text.replace(md5, '/').replace(md51, "_");
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
}

function ignoreCheck(name) { //checks if ignored, this is used since it's possible to bypass the autoignore function by logging in via an alt then switching names
    for (var i = 0; i < ignore.length; i++) {
        if (name.toLowerCase() === ignore[i].toLowerCase()) {
            client.ignore(client.id(name), true);
        }
    }
    return client.isIgnored(client.id(name));
}

function sendHtmlMessage(message, channel) { //sends a html message to the user
    if (channel === undefined) {
        channel = client.currentChannel();
    }
    client.printChannelMessage(message, channel, true);
}

/*function handleSystemCommand(string) {
 //TODO make the repoFolder change upon use of "cd"
 if (repoFolder === undefined) {
 return;
 }
 sys.system('cd ' + repoFolder + ' & ' + string + ' > ' + repoFolder + '/output.txt');
 var output = sys.getFileContent(repoFolder + '/output.txt').split('\n');
 for (var x in output) {
 if (output[x].length > 0) {
 sendMessage(output[x]);
 }
 }
 }*/

function formatMessage(message, channel) {
    if (callPlugins("formatMessage", message, channel)) {
        return;
    }
    var pos = message.indexOf(': ');
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
        var playmessage = Utilities.html_escape(message.substr(pos + 2));
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
            client.printHtml("<font face ='" + fonttype + "'><font size = " + fontsize + "><font color='" + colour + "'><timestamp/> " + symbol + auth_style[auth] + playname + ": </font>" + Utilities.tagend(auth_style[auth]) + fontstyle + playmessage + Utilities.tagend(fontstyle));
        }
        else {
            client.printChannelMessage("<font face ='" + fonttype + "'><font size = " + fontsize + "><font color='" + colour + "'><timestamp/> " + symbol + auth_style[auth] + playname + ": </font>" + Utilities.tagend(auth_style[auth]) + fontstyle + playmessage + Utilities.tagend(fontstyle), channel, true);
        }
        sys.stopEvent();
    }
}

function getAbility(pokemon, gen) {
    if (sys.pokemon(pokemon) === "Keldeo-R" || sys.pokemon(pokemon) === "Meloetta-S") {
        pokemon = pokemon % 65536;
    }
    var abilityone = sys.pokeAbility(pokemon, 0, gen);
    var abilitytwo = sys.pokeAbility(pokemon, 1, gen);
    var abilitydw = sys.pokeAbility(pokemon, 2, gen);
    if (pokemon === sys.pokeNum('Thundurus-T')) {
        abilityone = 10;
    }
    if (pokemon === sys.pokeNum('Tornadus-T')) {
        abilityone = 144;
    }
    if (pokemon === sys.pokeNum('Landorus-T')) {
        abilityone = 22;
    }
    if (pokemon === sys.pokeNum('Kyurem-W')) {
        abilityone = 163;
    }
    if (pokemon === sys.pokeNum('Kyurem-B')) {
        abilityone = 164;
    }
    if (abilitytwo === 0 && abilitydw === 0 || abilitytwo === undefined && abilitydw === undefined) {
        return "Ability: " + sys.ability(abilityone);
    }
    if (abilitytwo === 0 && abilitydw !== 0 || abilitytwo === undefined && abilitydw !== undefined) {
        return "Abilities: " + sys.ability(abilityone) + " / " + sys.ability(abilitydw) + " (Dream World)";
    }
    if (abilitytwo !== 0 && abilitydw === 0 || abilitytwo !== undefined && abilitydw === undefined) {
        return "Abilities: " + sys.ability(abilityone) + " / " + sys.ability(abilitytwo);
    }
    return "Abilities: " + sys.ability(abilityone) + " / " + sys.ability(abilitytwo) + " / " + sys.ability(abilitydw) + " (Dream World)";
}

function getMinMax(val, hp, level, gen) {
    if (level === undefined) {
        level = 100;
    }
    if (gen > 2) {
        var min, max;
        val = parseInt(val * 2, 10);
        if (hp !== true) {
            var minmin, maxplus;
            min = Math.floor((val + 31) * level / 100) + 5;
            minmin = parseInt(Math.floor(((val + 31) * level / 100) + 5) * 0.9, 10);
            max = Math.floor((val + 31 + 63) * level / 100 + 5);
            maxplus = parseInt(Math.floor(((val + 31 + 63) * level / 100) + 5) * 1.1, 10);
            return "&nbsp;&nbsp;&nbsp;&nbsp;Min (-): " + minmin + " | Min: " + min + " | Max: " + max + " | Max (+): " + maxplus;
        }
        min = Math.floor((val + 31) * level / 100) + level + 10;
        max = Math.floor((val + 63 + 31) * level / 100) + level + 10;
        return "&nbsp;&nbsp;&nbsp;&nbsp;Min: " + min + " | Max: " + max;
    }
    if (hp !== true) {
        var stat = (15 + val + (Math.sqrt(65535) / 8)) * level / 50 + 5;
        return "&nbsp;&nbsp;&nbsp;&nbsp; Stat: " + Math.floor(stat);
    }
    var stat = (15 + val + (Math.sqrt(65535) / 8) + 50) * level / 50 + 10;
    return "&nbsp;&nbsp;&nbsp;&nbsp; Stat: " + Math.floor(stat);
}

function getWeight(pokemon) {
    if (weightData === undefined) {
        weightData = {};
        var data = sys.getFileContent('db/pokes/weight.txt').split('\n');
        for (var x = 0; x < data.length; x++) {
            var line = data[x].split(" ");
            var pokenum = line[0].split(":");
            pokenum[0] = parseInt(65536 * pokenum[1], 10) + parseInt(pokenum[0], 10);
            weightData[pokenum[0]] = line[1];
        }
    }
    return weightData[pokemon];
}

function getWeightDamage(weight) {
    if (weight <= 10) {
        return 20;
    }
    else if (10.1 <= weight && weight <= 25) {
        return 40;
    }
    else if (25.1 <= weight && weight <= 50) {
        return 60;
    }
    else if (50.1 <= weight && weight <= 100) {
        return 80;
    }
    else if (100.1 <= weight && weight <= 200) {
        return 100;
    }
    return 120;
}

function pokeDex(pokemon, gen, level) {
    if (sys.pokemon(pokemon) === "Missingno") {
        throw "Invalid pokemon";
    }
    if (gen === undefined) {
        gen = 5;
    }
    if (level === undefined) {
        level = 100;
    }
    var data = [];
    var npokemon = pokemon; //so we can refer to the old number when needed
    if (pokemon > 649) {
        npokemon = pokemon % 65536;
    }
    var generations = [0, 151, 252, 386, 493, 649];
    if (npokemon > generations[gen]) {
        throw "Pokemon is not in this gen";
    }
    data.push("");
    data.push("<b>#" + npokemon + " " + sys.pokemon(pokemon) + "</b>");
    data.push('<img src="pokemon:' + pokemon + '&gen=' + gen + '"/>' + (gen === 1 ? "" : '<img src="pokemon:' + pokemon + '&gen=' + gen + '&shiny=true"/>'));
    data.push('<b>Level: ' + level + '</b>');
    var typea = sys.pokeType1(pokemon, gen);
    var typeb = sys.pokeType2(pokemon, gen);
    data.push("<b>Type: " + sys.type(typea) + (typeb !== 17 ? " / " + sys.type(typeb) + "</b>" : "</b>"));
    if (gen > 2) {
        data.push("<b>" + getAbility(pokemon, gen) + "</b>");
    }
    data.push("<b>HP: " + sys.baseStats(pokemon, 0, gen) + "</b>");
    if (pokemon !== sys.pokeNum("Shedinja")) {
        data.push(getMinMax(sys.baseStats(pokemon, 0, gen), true, level, gen));
    }
    else {
        data.push("&nbsp;&nbsp;&nbsp;&nbsp;Min: " + 1 + " | Max: " + 1);
    }
    data.push("<b>Atk: " + sys.baseStats(pokemon, 1, gen) + "</b>");
    data.push(getMinMax(sys.baseStats(pokemon, 1, gen), false, level, gen));
    data.push("<b>Def: " + sys.baseStats(pokemon, 2, gen) + "</b>");
    data.push(getMinMax(sys.baseStats(pokemon, 2, gen), false, level, gen));
    if (gen !== 1) {
        data.push("<b>SpAtk: " + sys.baseStats(pokemon, 3, gen) + "</b>");
        data.push(getMinMax(sys.baseStats(pokemon, 3, gen), false, level, gen));
        data.push("<b>SpDef: " + sys.baseStats(pokemon, 4, gen) + "</b>");
        data.push(getMinMax(sys.baseStats(pokemon, 4, gen), false, level, gen));
    }
    else {
        data.push("<b>Special: " + sys.baseStats(pokemon, 3, gen) + "</b>");
        data.push(getMinMax(sys.baseStats(pokemon, 3, gen), false, level, gen));
    }
    data.push("<b>Speed: " + sys.baseStats(pokemon, 5, gen) + "</b>");
    data.push(getMinMax(sys.baseStats(pokemon, 5, gen), false, level, gen));
    var weight = getWeight(pokemon);
    if (weight === undefined) {
        weight = getWeight(npokemon);
    }
    var weightLbs = weight * 2.20462;
    data.push("<b>Weight: " + weight + "kg / " + weightLbs.toFixed(1) + "lbs</b>");
    data.push("<b>Damage from GK/LK: " + getWeightDamage(weight) + "</b>");
    data.push("");
    for (var x = 0; x < data.length; x++) {
        sendHtmlMessage(data[x]);
    }
}

function changeScript(resp) {
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
}
if (client.ownId() !== -1) {
    init();
}
client.network().playerLogin.connect(function () { //only call when the user has logged in to prevent any crashes
    awayFunction();
    init();
});
Script_Version = "2.0.00"; //version the script is currently on
//noinspection JSUnusedAssignment
poScript = ({
    clientStartUp: function () {
        sendMessage('Script Check: OK'); //use this to send a message on update scripts
    },
    onPlayerReceived: function (id) { //detects when a player is visible to the client (mostly logins, but may also happen upon joining a new channel)
        var flashvar = "";
        if (friendsflash === true) {
            flashvar = "<ping/>";
        }
        for (var x = 0; x < friends.length; x++) {
            if (client.name(id).toLowerCase() === friends[x].toLowerCase() && flash === true) {
                sendHtmlMessage("<font color = '" + Utilities.html_escape(clientbotcolour) + "'><timestamp/>" + clientbotstyle + Utilities.html_escape(clientbotname) + ":" + Utilities.tagend(clientbotstyle) + "</font> User <a href='po:pm/" + id + "'>" + client.name(id) + "</a> has logged in" + flashvar + "", client.currentChannel());
            }
        }
        for (var x = 0; x < ignore.length; x++) {
            if (client.name(id).toLowerCase() === ignore[x].toLowerCase()) {
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
        callPlugins("beforeChannelMessage", message, channel, html);
        if (message.indexOf('<timestamp/> *** <b>') !== -1) {
            var ignored = getName(message, "me");
            if (ignoreCheck(ignored)) {
                sys.stopEvent();
                return;
            }
            saveToLog(Utilities.stripHTML(message), channel);
        }
        if (message.indexOf('<timestamp/><b><span style') !== -1) {
            var ignored = getName(message, "rainbow");
            if (ignoreCheck(ignored)) {
                sys.stopEvent();
                return;
            }
            saveToLog(Utilities.stripHTML(message), channel);
        }
        if (html === true) {
            return;
        }
        saveToLog(message, channel);
        formatMessage(message, channel);
    },
    beforePMReceived: function (id) { // called before a PM is received
        if (ignoreCheck(client.name(id))) {
            sys.stopEvent();
        }
    },
    afterPMReceived: function (id) { //called after a PM is received
        if (playerswarn[id] === true) {
            return;
        }
        var time = new Date();
        var h = time.getHours();
        if (artype === "time") {
            if (arstart < arend) {
                if (h >= arstart && h < arend) {
                    client.network().sendPM(id, armessage);
                    playerswarn[id] = true;
                    return;
                }
            }
            if (h >= arend && h < arstart) {
                client.network().sendPM(id, armessage);
                playerswarn[id] = true;
                return;
            }
        }
        if (autoresponse === true) {
            client.network().sendPM(id, armessage);
            playerswarn[id] = true;
        }
    },
    beforeSendMessage: function (message, channel) { //detects messages sent by the client
        /*var mess = message.toLowerCase();
         if ((mess.substring(0, 3) === "git" || mess.substring(0, 2) === "cd" || mess.substring(0, 3) === "dir") && typeof sys.system !== "undefined") {
         sys.stopEvent();
         try {
         handleSystemCommand(message);
         }
         catch (e) {
         sendBotMessage('Error with sys.system() ' + e);
         }
         return;
         }*/
        callPlugins("beforeSendMessage", message, channel);
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
                command = message.substring(1, pos).toLowerCase();
                commandData = message.substr(pos + 1);
            }
            else {
                command = message.substr(1).toLowerCase();
            }
            try {
                Commands.commandHandler(command, commandData, channel);
            }
            catch (e) {
                sendBotMessage('ERROR: ' + e); //TODO: Add proper error checks
            }
            if (callPlugins("commandHandler", command, commandData, channel)) {
                sys.stopEvent();
            }
        }
    },
    beforeChallengeReceived: function () {
        if (nochallenge === true) {
            sys.stopEvent();
        }
    }

});
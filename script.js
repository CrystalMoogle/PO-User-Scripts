/*  
    Client Scripts
    Make sure you check ~commandslist for a list of commands
    Safe Scripts are pretty much required to be off
    Currently needs PO Version 2.0.06 to run correctly (Though 2.0.07 is strongly recommended)
    Report bugs here: http://pokemon-online.eu/forums/showthread.php?15079 and read over the thread to check for anything
    Needed files: Utilities.js, Commands.js
    If it doesn't automatically download them, get them from https://raw.github.com/CrystalMoogle/PO-User-Scripts/devel/ and save them as their appropriate names in a folder called "ClientScripts" in your main PO Folder
*/
//these things below shouldn't be touched unless you know what you're doing~
/*jshint "laxbreak":true,"shadow":true,"undef":true,"evil":true,"trailing":true,"proto":true,"withstmt":true*/
/*global sys,client, playerswarn:true */
var script_url = "https://raw.github.com/CrystalMoogle/PO-User-Scripts/devel/"; //where the script is stored
var scriptsFolder = "ClientScripts"; //replace with undefined if you don't want a folder
var global = this;
var poScript, Script_Version, initCheck, repoFolder, etext, tgreentext, flash, autoresponse, friendsflash, checkversion, clientbotname, clientbotcolour, clientbotstyle, greentext, fontcolour, fonttype, fontsize, fontstyle, commandsymbol, hilight, armessage, arstart, arend, artype, stalkwords, friends, ignore, logchannel, fchannel, auth_symbol, auth_style, src, globalMessageCheck, globalMessage, Utilities, Commands;
var neededFiles = ["utilities.js", "commands.js"]; //files needed for the script in an array
//easier importing of server scripts
sys.name = client.name, sys.id = client.id, src = client.ownId();
sys.sendAll = function (message, channel) {
    say(message, channel);
};
sys.sendMessage = function (id, message, channel) {
    sendMessage(message, channel);
};
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

if (typeof client !== 'undefined' && client.ownId() !== -1) {
    checkFiles();
}

function print(message) {
    sendMessage(message);
}

function cleanFile(filename) {
    sys.appendToFile(filename, "");
}

function checkFiles() {
    sys.makeDir(scriptsFolder);
    for (var x = 0; x < neededFiles.length; x++) {
        cleanFile(scriptsFolder + '/' + neededFiles[x]);
        if (sys.getFileContent(scriptsFolder + '/' + neededFiles[x]) === "") {
            sys.writeToFile(scriptsFolder + "/" + neededFiles[x], sys.synchronousWebCall(script_url + "clientscripts/" + neededFiles[x]));
        }
    }
    loadFiles();
}

function updateFile(filename) {
    sys.writeToFile(scriptsFolder + "/" + filename, sys.synchronousWebCall(script_url + "clientscripts/" + filename));
    loadFiles();
}

function loadFiles() {
    Utilities = require('utilities.js');
    Commands = require('commands.js');
}

function init() { //defines all the variables that are going to be used in the script, uses default if no saved settings are found
    checkFiles();
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
    sys.webCall(script_url + 'script.js', function (resp) {
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
    return;
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
    var ownName = Utilities.html_escape(client.ownName());
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
            client.printChannelMessage("<font face ='" + fonttype + "'><font size = " + fontsize + "><font color='" + colour + "'><timestamp/> " + symbol + auth_style[auth] + playname + ": </font>" + Utilities.tagend(auth_style[auth]) + fontstyle + playmessage + Utilities.tagend(fontstyle), chan, true);
        }
        sys.stopEvent();
    }
}

function tierCheck(pokemon, gen) { //still needs a lot of work. xml->json is a headache and I give up for the moment :3
    if (gen === undefined) {
        gen = 5;
    }
    var check = [1, 2, 3, 4, 5, "all"];
    if (check.indexOf(gen) !== -1) {
        gen = 5;
    }
    cleanFile(scriptsFolder + '/tiers.json');
    if (sys.getFileContent(scriptsFolder + '/tiers.json') === "") {
        Utilities.tiersCheck(); //will make later just zzz...
    }
    var tiers = JSON.parse(sys.getFileContent(scriptsFolder + '/tiers.json'))
        .category.category; //xml to JSON wasn't the smoothest transition...
    var allowed = [];
    if (gen === 5) {
        for (var x in tiers[7].tier) {
            var pokemons = tiers[7].tier[x]["-pokemons"];
            if (pokemons === undefined) {
                allowed.push(tiers[7].tier[x]["-name"]);
                continue;
            }
            if (pokemons.toLowerCase()
                .indexOf(pokemon.toLowerCase()) === -1 && allowed.indexOf(tiers[7].tier[x]["-banParent"]) !== -1) {
                allowed.push(tiers[7].tier[x]["-name"]);
            }
        }
    }
    return allowed;
}

function getAbility(pokemon) {
    if (sys.pokemon(pokemon) === "Keldeo-R") {
        pokemon = pokemon % 65536;
    }
    var abilityone = sys.pokeAbility(pokemon, 0, 5);
    var abilitytwo = sys.pokeAbility(pokemon, 1, 5);
    var abilitydw = sys.pokeAbility(pokemon, 2, 5);
    if (pokemon === sys.pokeNum('Thundurus-T')) {
        abilityone = 10;
    }
    if (pokemon === sys.pokeNum('Tornadus-T')) {
        abilityone = 144;
    }
    if (pokemon === sys.pokeNum('Thundurus-T')) {
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
    return "Abilities: " + sys.ability(abilityone) + " / " + sys.ability(abilitytwo) + " / " + sys.ability(abilitydw) + " (Dream World)";
}

function getMinMax(val, hp) {
    var min, max;
    val = parseInt(val * 2, 10);
    if (hp !== true) {
        var minmin, maxplus;
        min = parseInt(val + 31, 10);
        minmin = parseInt((val + 31) * 0.9, 10);
        max = parseInt(val + 31 + 64, 10);
        maxplus = parseInt((val + 31 + 64) * 1.1, 10);
        return "&nbsp;&nbsp;&nbsp;&nbsp;Min (-): " + minmin + " | Min: " + min + " | Max: " + max + " | Max (+): " + maxplus;
    }
    min = parseInt(val + 110, 10);
    max = parseInt(val + 110 + 64, 10);
    return "&nbsp;&nbsp;&nbsp;&nbsp;Min: " + min + " | Max: " + max;
}

function pokeDex(pokemon) {
    if (sys.pokemon(pokemon) === "Missingno") {
        return;
    }
    var data = [];
    var npokemon = pokemon; //so we can refer to the old number when needed
    if (pokemon > 649) {
        npokemon = pokemon % 65536;
    }
    data.push("");
    data.push("<b>#" + npokemon + " " + sys.pokemon(pokemon) + "</b>");
    data.push('<img src="pokemon:' + pokemon + '"/>');
    var typea = sys.pokeType1(pokemon, 5);
    var typeb = sys.pokeType2(pokemon, 5);
    data.push("<b>Type: " + sys.type(typea) + (typeb !== 17 ? " / " + sys.type(typeb) + "</b>" : "</b>"));
    data.push("<b>" + getAbility(pokemon) + "</b>");
    data.push("<b>HP: " + sys.baseStats(pokemon, 0, 5) + "</b>");
    data.push(getMinMax(sys.baseStats(pokemon, 0, 5), true));
    data.push("<b>Atk: " + sys.baseStats(pokemon, 1, 5) + "</b>");
    data.push(getMinMax(sys.baseStats(pokemon, 1, 5), false));
    data.push("<b>Def: " + sys.baseStats(pokemon, 2, 5) + "</b>");
    data.push(getMinMax(sys.baseStats(pokemon, 2, 5), false));
    data.push("<b>SpAtk: " + sys.baseStats(pokemon, 3, 5) + "</b>");
    data.push(getMinMax(sys.baseStats(pokemon, 3, 5), false));
    data.push("<b>SpDef: " + sys.baseStats(pokemon, 4, 5) + "</b>");
    data.push(getMinMax(sys.baseStats(pokemon, 4, 5), false));
    data.push("<b>Speed: " + sys.baseStats(pokemon, 5, 5) + "</b>");
    data.push(getMinMax(sys.baseStats(pokemon, 5, 5), false));
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
                sendHtmlMessage("<font color = '" + Utilities.html_escape(clientbotcolour) + "'><timestamp/>" + clientbotstyle + Utilities.html_escape(clientbotname) + ":" + Utilities.tagend(clientbotstyle) + "</font> User <a href='po:pm/" + id + "'>" + client.name(id) + "</a> has logged in" + flashvar + "", client.currentChannel());
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
        sys.saveVal(sys.time(), message);
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
                Commands.commandHandler(command, commandData, channel);
            }
            catch (e) {
                sendBotMessage('ERROR: ' + e); //TODO: Add proper error checks
            }
        }
    },
    beforeChallengeReceived: function (id) {
        sys.stopEvent();
    }

});
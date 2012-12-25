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

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
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
    sys.webCall(url, function(resp) {
        sys.writeToFile(scriptsFolder + "/" + filename,resp);
        loadFiles();
        loadPlugins();
        sendBotMessage("Plugin " + filename + " added!");
    });
    userplugins = userplugins.concat(filename);
    Utilities.saveSettings();
}

function updateFile(filename) {
    var url = script_url + "clientscripts/" + filename;
    if (/^https?:\/\//.test(filename)) {
        url = filename;
    }
    filename = filename.split(/\//).pop();
    sys.webCall(url, function(resp) {
        sys.writeToFile(scriptsFolder + "/" + filename,resp);
        loadFiles();
        loadPlugins();
        sendBotMessage("Plugin " + filename + " updated!");
    });
}

function loadFiles() {
    Utilities = require('utilities.js');
    Commands = require('commands.js');
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
            } catch (e) {
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
    checkFiles();
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
    if (level === undefined){
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
    if (hp !== true){
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
            pokenum[0] = parseInt(65536 * pokenum[1]) + parseInt(pokenum[0]);
            weightData[pokenum[0]] = line[1];
        }
    }
    return weightData[pokemon];
}

function getWeightDamage(weight) {
    if (weight <= 10) {
        return 20;
    } else if (10.1 <= weight && weight <= 25) {
        return 40
    } else if (25.1 <= weight && weight <= 50) {
        return 60
    } else if (50.1 <= weight && weight <= 100) {
        return 80
    } else if (100.1 <= weight && weight <= 200) {
        return 100
    }
    return 120
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
    data.push('<img src="pokemon:' + pokemon + '&gen='+ gen + '"/>' + (gen === 1 ? "" :'<img src="pokemon:' + pokemon + '&gen='+ gen + '&shiny=true"/>'));
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
    } else {
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
    } else {
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
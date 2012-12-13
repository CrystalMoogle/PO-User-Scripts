exports = {
    commandHandler: function commandHandler(command, commandData, channel) {
        if (command === "commandlist" || command === "commandslist") { //handles all the commands
            sys.stopEvent();
            sendMessage("*** Client Commands ***");
            sendMessage(commandsymbol + "etext on/off: Allows you to turn Enriched text on/off");
            sendMessage(commandsymbol + "greentext on/off: Allows you to turn greentext on/off");
            sendMessage(commandsymbol + "greentextcolo(u)r colour: Allows you to change your greentext colour");
            sendMessage(commandsymbol + "idle on/off: Allows you to turn auto-idle on/off");
            sendMessage(commandsymbol + "ignorechallenges on/off: Allows you to ignore all challenges without idling");
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
            sendMessage(commandsymbol + "pokedex:gen: Shows you details about a pokemon. Gen is an optional parameter to view the pokemon in different gens");
            sendMessage(commandsymbol + "damagecalc [s]atk:move power:modifier:[s]def:HP: Basic damage calculator");
            sendMessage("Explanation: [s]atk is the attacking pokémon's exact stat (not base), move power is the move's base power, modifier is any modifiers that need to be added (e.g. life orb is 1.3), HP/[s]def is the defending pokémon's exact HP/Def stats (not base)");
            sendMessage("Example: " + commandsymbol + "damagecalc 100:100:1.3:100:100 will show you the result of a pokémon with 100 [s]atk, with Life Orb using a 100bp move against a pokémon with 100HP/[s]def");
            sendMessage("");
            sendBotMessage('If you ever forget your command symbol, type "reset symbol" (no quotes) to revert it back to "~"');
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
            var updateURL = script_url + 'script.js';
            if (commandData !== undefined && (commandData.substring(0, 7) === 'http://' || commandData.substring(0, 8) === 'https://')) {
                updateURL = commandData;
            }
            var channel_local = channel;
            sendBotMessage("Fetching scripts from (link)", channel_local, updateURL);
            sys.webCall(updateURL, changeScript);
            return;
        }
        if (command === "updatefile") {
            sys.stopEvent();
            if (neededFiles.indexOf(commandData) !== -1) {
                updateFile(commandData);
                return;
            }
            sendBotMessage("This is not a valid script file");
            return;
        }
        if (command === "loadsettings") { //Allow user defined files to be loaded in the future from web or file system
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
        if (command === "pokedex") {
            sys.stopEvent();
            if (commandData === undefined) {
                sendBotMessage("Usage is ~pokedex pokemon:gen (optional)");
                return;
            }
            commandData = commandData.split(':');
            if (commandData.length > 2) {
                sendBotMessage("Usage is ~pokedex pokemon:gen (optional)");
                return;
            }
            var pokemon = sys.pokeNum(commandData[0]);
            var gen = commandData[1];
            if (isNaN(gen) || gen === undefined || gen > 5 || gen < 1) {
                gen = 5;
            }
            var returnval = pokeDex(pokemon, gen);
            if (returnval) {
                sendBotMessage(returnval);
            }
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
};
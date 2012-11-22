/* 
    Utilities script for Client Scripts
    This is a required file for the main script
    Nothing here should be changed unless you know exactly what you're doing
*/
Utilities = {
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
        if (sys.getVal('etext') === "true") {
            etext = true;
        }
        else {
            etext = false;
        }
        if (sys.getVal('tgreentext') === "true") {
            tgreentext = "true";
        }
        else {
            tgreentext = "false";
        }
        if (sys.getVal('flash') === "false") { //making sure flash is on always unless specified to not be
            flash = false;
        }
        else {
            flash = true;
        }
        if (sys.getVal('autoresponse') === true) {
            autoresponse = true;
        }
        else {
            autoresponse = false;
        }
        if (sys.getVal('friendsflash') === "true") {
            friendsflash = true;
        }
        else {
            friendsflash = false;
        }
        if (sys.getVal('checkversion') === "true") {
            checkversion = "true";
        }
        else {
            checkversion = "false";
        }
        if (sys.getVal('logjoins') === "true") {
            logjoins = true;
        }
        else {
            logjoins = false;
        }
        clientbotname = "+ClientBot";
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
    },

    isPunct: function isPunct(i) {
        return (this.isGraph(i) && !(this.isAlnum(i)));
    },

    isGraph: function isGraph(i) {
        var myCharCode = i.charCodeAt(0);
        if ((myCharCode > 32) && (myCharCode < 127)) {
            return true;
        }
        return false;
    },

    isAlnum: function isAlnum(i) {
        return (this.isDigit(i) || this.isAlpha(i));
    },

    isDigit: function isDigit(i) {
        var myCharCode = i.charCodeAt(0);
        if ((myCharCode > 47) && (myCharCode < 58)) {
            return true;
        }
        return false;
    },

    isAlpha: function isAlpha(i) {
        var myCharCode = i.charCodeAt(0);
        if (((myCharCode > 64) && (myCharCode < 91)) || ((myCharCode > 96) && (myCharCode < 123))) {
            return true;
        }
        return false;
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
            return;
        }
        var newstring = string.replace(/</g, "</");
        return newstring;
    }
};
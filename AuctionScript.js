/* Original Script by Shadowfist

 Instructions
 - Paste into client scripts window
 - Type ~init to start the system
 - Type ~start to get signups happening
 - Type ~add [name] for each player you want to add
 - Type addmoney/takemoney to calibrate
 - Type ~loaditems [file] to load the auction items (the file should be seperated on to different lines)
 - Type ~start again to start the first round!
 */
/*jshint "laxbreak":true,"shadow":true,"undef":true,"evil":true,"trailing":true,"proto":true,"withstmt":true*/
/*global sys,client, print */
/* Globals */
var messagessent = 0; // maximum it can send per minute.
var nooveractive = false; //set to true if you cannot go overactive on the server
var userPMs, auctionbot, auctionchan, poScript;
var help = ["*** COMMANDS LIST ***",
    "~help: shows the command list",
    "~test: Send a test message",
    "~data: Gets data",
    "~addmoney [name]:[money]: add money to a player",
    "~takemoney [name]:[money]: take money from a player",
    "~add [name]: add a player to an auction",
    "~remove [name]: remove a player from an auction",
    "~alias [player]:[alias] adds an alias to a player",
    "~start: start a round of auction",
    "~end: end a round of auction",
    "~loaditems: load items",
    "~err: send an error message",
    "~init: reset vars"];

/* Safe scripts need to be disabled to use some cool functions like loading items from files */

// Case insensitive comparison.

function cmp(x1, x2) {
    if (typeof x1 !== typeof x2) {
        return false;
    }
    else if (typeof x1 === "string") {
        if (x1.toLowerCase() === x2.toLowerCase()) {
            return true;
        }
    }
    return x1 === x2;
}

function nonFlashing(name) {
    return name[0] + '​' + name.substr(1);
}

// Returns a name in correct case.
String.prototype.toCorrectCase = function () {
    if (isNaN(this) && client.id(this) !== undefined) {
        return client.name(client.id(this));
    }
    else {
        return this;
    }
};

// Rearranges the elements of an array in a random order. Doesn't change the original array.
Array.prototype.shuffle = function () {
    var oldarray = this;
    var newarray = [];
    while (oldarray.length > 0) {
        var element = oldarray.splice(sys.rand(0, oldarray.length), 1);
        newarray.push(element);
    }
    return newarray;
};

function init() {
    auctionbot = new Auction();
    print("Auction Initiated");
    if (typeof userPMs !== "object") {
        userPMs = [];
    }
}

function printMessage(msg) {
    var channel = client.channelId("Auction House");
    if (channel !== undefined)
        client.printChannelMessage(msg, channel, false);
    else {
        print(msg);
    }
}

function sendAll(msg, chan) {
    if (messagessent < 50) {
        client.network().sendChanMessage(chan, msg);
        if (nooveractive) {
            messagessent += 1;
        }
    }
    else {
        print(msg);
    }
}

function getRealBid(init) {
    return Math.floor(init / auctionbot.interval) * auctionbot.interval;
}

function Auction() {
    auctionchan = client.channelId("Auction House");
    this.resetVars = function () {
        auctionbot.players = {};
        auctionbot.ticks = -1;
        auctionbot.items = [];
        auctionbot.bids = {};
        auctionbot.saleitem = "";
        auctionbot.style = "turn";
        auctionbot.state = "off";
        auctionbot.startmoney = 175000;
        auctionbot.minbid = 3000;
        auctionbot.interval = 100;
        auctionbot.turns = [];
        auctionbot.round = 0;
        auctionbot.issuedMsgs = [];
        printMessage("Reset auction vars!");
    };
    this.startAuction = function () {
        if (auctionbot.hasOwnProperty("state")) {
            if (auctionbot.state !== "off") {
                printMessage("An auction is already in progress!");
                return;
            }
        }
        auctionbot.resetVars();
        auctionbot.state = "standby";
        printMessage("An auction is now ready to start!");
    };
    this.addMoney = function (name, money) {
        if (auctionbot.state === "off") {
            printMessage("No auction is in progress!");
            return;
        }
        var lname = name.toLowerCase();
        if (!auctionbot.players.hasOwnProperty(lname)) {
            printMessage("No such player exists!");
            return;
        }
        if (isNaN(money)) {
            printMessage("Invalid money value!");
            return;
        }
        auctionbot.players[lname].money += money;
        sendAll(name.toCorrectCase() + " now has " + auctionbot.players[lname].money + " gold coins.", auctionchan);
    };
    this.startRound = function () {
        if (auctionbot.state !== "standby") {
            printMessage("A round is already in progress!");
            return;
        }
        if (auctionbot.items.length === 0) {
            sendAll("No more items, auction will end!", auctionchan);
            auctionbot.endAuction();
            return;
        }
        if (auctionbot.style === "default") {
            var sales = auctionbot.items;
            var item = sales.splice(sys.rand(0, sales.length), 1);
            auctionbot.saleitem = item;
            sendAll("Now selling " + item + "!", auctionchan);
            auctionbot.ticks = 30;
            auctionbot.state = "round";
            auctionbot.round += 1;
        }
        else {
            if (auctionbot.round === 0) {
                for (var x in auctionbot.players) {
                    if (auctionbot.players.hasOwnProperty(x)) {
                        auctionbot.turns.push(x);
                    }
                }
                auctionbot.turns = auctionbot.turns.shuffle();
            }
            auctionbot.state = "nominate";
            var toSend = auctionbot.items.map(nonFlashing);
            var turn = auctionbot.turns[auctionbot.round % auctionbot.turns.length].toString().toLowerCase();
            var name = turn.toCorrectCase() + (auctionbot.players[turn].aliases ? "/" + auctionbot.players[turn].aliases : "");
            sendAll("It is " + name + "'s turn to nominate an item from the following: " + toSend, auctionchan);
        }
    };
    this.nominateRound = function (name, nomination) {
        if (auctionbot.state !== "nominate") {
            printMessage("Not in nomination stage!");
            return;
        }
        for (var x in auctionbot.players) {
            if (auctionbot.players.hasOwnProperty(x)) {
                if (auctionbot.players[x].aliases === name) {
                    name = x;
                }
            }
        }

        if (!cmp(auctionbot.turns[auctionbot.round % auctionbot.turns.length].toString(), name)) {
            printMessage("Nomination not accepted!");
            return;
        }
        if (auctionbot.style !== "default") {
            var sales = auctionbot.items;
            var item = false;
            for (var x = 0; x < sales.length; x++) {
                if (cmp(sales[x], nomination)) {
                    item = sales.splice(x, 1);
                    break;
                }
            }
            if (item === false) {
                sendAll("Nomination not found!");
                return;
            }
            auctionbot.saleitem = item;
            sendAll("Now selling " + item + "!", auctionchan);
            auctionbot.ticks = 30;
            auctionbot.state = "round";
            auctionbot.round += 1;
            if (auctionbot.players[name.toLowerCase()].money >= 3000) {
                auctionbot.makebid(name, 3000);
            }
        }
    };
    this.endRound = function () {
        var bidders = auctionbot.bids;
        var winner = [false, 0];
        for (var x in bidders) {
            if (bidders.hasOwnProperty(x)) {
                var bidinfo = [x, bidders[x]];
                if (bidinfo[1] >= auctionbot.minbid && bidinfo[1] > winner[1]) {
                    winner = bidinfo;
                }
            }
        }
        if (winner[0] === false) {
            sendAll("No bids were made this round! Too bad!", auctionchan);
        }
        else {
            sendAll("I sold the " + auctionbot.saleitem + " to " + winner[0].toCorrectCase() + " for " + winner[1] + " gold coins!", auctionchan);
            auctionbot.players[winner[0]].money -= winner[1];
            auctionbot.players[winner[0]].possessions.push(auctionbot.saleitem);
            sendAll(winner[0].toCorrectCase() + " (" + auctionbot.players[winner[0]].money + ") now has: " + auctionbot.players[winner[0]].possessions.join(", "), auctionchan);
        }
        auctionbot.saleitem = "";
        auctionbot.state = "standby";
        auctionbot.bids = {};
        auctionbot.issuedMsgs = [];
        if (auctionbot.style !== "default") {
            this.startRound();
        }
    };
    this.endAuction = function () {
        if (auctionbot.state === "off") {
            printMessage("No auction is in progress!");
            return;
        }
        auctionbot.state = "off";
        sendAll("The auction ended!", auctionchan);
    };
    this.getItemList = function (file) {
        if (auctionbot.state !== "standby") {
            printMessage("An auction is already in progress!");
            return;
        }
        if (sys.isSafeScripts()) {
            printMessage("Safe scripts is on, unable to load from files!");
            return;
        }
        var content = sys.getFileContent(file);
        if (content === undefined) {
            printMessage("Couldn't find anything here!");
            return;
        }
        var items = content.split("\n");
        var itemsadded = 0;
        for (var x = 0; x < items.length; x++) {
            if (items[x].length >= 1) {
                auctionbot.items.push(items[x].trim());
                itemsadded += 1;
            }
        }
        printMessage("Added " + itemsadded + " items to the auction block!");
    };
    this.getData = function () {
        var aplayers = auctionbot.players;
        for (var x in aplayers) {
            if (aplayers.hasOwnProperty(x)) {
                printMessage(x.toCorrectCase() + " : " + "(" + aplayers[x].money + ") - " + aplayers[x].possessions.join(", "));
            }
        }
    };

    this.addAlias = function (name, alias) {
        var aplayers = auctionbot.players;
        if (auctionbot.state !== "standby") {
            printMessage("An auction is already in progress!");
            return;
        }
        if (name === undefined || alias === undefined) {
            printMessage("Names are incorrect");
            return;
        }
        if (aplayers.hasOwnProperty(alias.toLowerCase())) {
            printMessage("They are already in the auction!");
            return;
        }
        if (aplayers[name].aliases === alias) {
            printMessage("This player is already an alias");
            return;
        }
        aplayers[name].aliases = alias.toLowerCase();
        sendAll(alias.toCorrectCase() + " added as an alias to " + name.toCorrectCase(), auctionchan);
    };

    this.addPlayer = function (name) {
        var aplayers = auctionbot.players;
        if (auctionbot.state !== "standby") {
            printMessage("An auction is already in progress!");
            return;
        }
        if (aplayers.hasOwnProperty(name.toLowerCase())) {
            printMessage("They are already in the auction!");
            return;
        }
        aplayers[name.toLowerCase()] = {
            money: auctionbot.startmoney,
            possessions: [],
            aliases: ""
        };
        sendAll(name.toCorrectCase() + " is now in the auction!", auctionchan);
    };
    this.removePlayer = function (name) {
        var aplayers = auctionbot.players;
        if (auctionbot.state !== "standby") {
            printMessage("An auction is already in progress!");
            return;
        }
        if (!aplayers.hasOwnProperty(name.toLowerCase())) {
            printMessage("They are not in the auction!");
            return;
        }
        delete aplayers[name.toLowerCase()];
        sendAll(name + " is no longer in the auction!", auctionchan);
    };
    this.makebid = function (name, bid) {
        if (auctionbot.state !== "round") {
            return;
        }
        for (var x in auctionbot.players) {
            if (auctionbot.players.hasOwnProperty(x)) {
                if (auctionbot.players[x].aliases === name) {
                    name = x;
                }
            }
        }

        var aplayers = auctionbot.players;
        var bids = auctionbot.bids;
        var lname = name.toLowerCase();

        if (!aplayers.hasOwnProperty(lname)) {
            return;
        }
        if (bid < auctionbot.minbid) {
            return;
        }
        if (aplayers[name.toLowerCase()].money < bid) {
            if (auctionbot.issuedMsgs.indexOf(lname) === -1) {
                sendAll(name + " doesn't have enough gold coins!", auctionchan);
                auctionbot.issuedMsgs.push(lname);
            }
            return;
        }
        for (var x in bids) {
            if (bids.hasOwnProperty(x)) {
                if (bids[x] >= bid) {
                    return;
                }
            }
        }
        bids[lname] = bid;
        sendAll(name.toCorrectCase() + " made a bid of " + bid + " gold coins!", auctionchan);
        auctionbot.ticks = 30;
    };
}

function handleCommand(command, data, channel) {
    if (command === "help" || command === "commands") {
        for (var h = 0; h < help.length; h++) {
            client.printChannelMessage(help[h], channel, false);
        }
        return;
    }
    if (command === "data") {
        auctionbot.getData();
        return;
    }
    if (command === "add") {
        auctionbot.addPlayer(data);
        return;
    }
    if (command === "remove") {
        auctionbot.removePlayer(data);
        return;
    }
    if (command === "start") {
        if (auctionbot.state === "off") {
            auctionbot.startAuction();
        }
        else {
            auctionbot.startRound();
        }
        return;
    }
    if (command === "addmoney") {
        var tmp = data.split(":", 2);
        auctionbot.addMoney(tmp[0], parseInt(tmp[1], 10));
        return;
    }
    if (command === "takemoney") {
        var tmp = data.split(":", 2);
        auctionbot.addMoney(tmp[0], 0 - parseInt(tmp[1], 10));
        return;
    }
    if (command === "end") {
        auctionbot.endAuction();
        return;
    }
    if (command === "loaditems") {
        auctionbot.getItemList(data);
        return;
    }
    if (command === "test") {
        client.network().sendChanMessage(channel, "This is a script test");
        return;
    }
    if (command === "alias") {
        var tmp = data.split(":", 2);
        auctionbot.addAlias(tmp[0], tmp[1]);
        return;
    }
    if (command === "eval") {
        try {
            var result = eval(data);
            client.printChannelMessage("±ModBot: Result is: " + result, channel, false);
        }
        catch (err) {
            client.printChannelMessage("±ModBot: Error in eval: " + err, channel, false);
        }
        return;
    }
    if (command === "init") {
        init();
        auctionbot.resetVars();
        client.printChannelMessage("±ModBot: Reset system vars", channel, false);
        return;
    }
    throw ("no valid command");
}

poScript = ({
    clientStartUp: function () {
        init();
    },
    stepEvent: function () {
        if (sys.time() % 60 === 0) {
            messagessent = 0;
        }
        if (typeof auctionbot === "object") {
            if (auctionbot.ticks > 0)
                auctionbot.ticks -= 1;
            if (auctionbot.state === "round" && auctionbot.ticks === 0) {
                auctionbot.endRound();
            }
        }
    },
    beforePMReceived: function (src, message) {
        if (userPMs.indexOf(src) === -1 && messagessent <= 50) {
            client.network().sendPM(src, "This user is unable to respond to regular PMs!");
            userPMs.push(src);
        }
        if (client.auth(src) < 1) {
            sys.stopEvent();
        }
    },
    beforeSendMessage: function (msg, channel) {
        var isCommand = msg.charAt(0) === "~" && msg.length > 1;
        if (isCommand) {
            msg = msg.toLowerCase();
            var pos = msg.indexOf(" ");
            var command, commandData;
            if (pos === -1) {
                command = msg.substring(1);
                commandData = "";
            }
            else {
                command = msg.substring(1, pos);
                commandData = msg.substring(pos + 1);
            }
            try {
                handleCommand(command, commandData, channel);
            }
            catch (err) {
                if (err === "no valid command") {
                    client.printChannelMessage("±Fat Policeman: The command " + command + " doesn't exist! Use ~help to get a list that you can use!", channel, false);
                }
                else {
                    client.printChannelMessage("±Fat Policeman: Error on command '" + command + "': " + err, channel, false);
                }
            }
            sys.stopEvent();
        }
    },
    afterChannelMessage: function (message, channel, html) {
        message = message.toLowerCase();
        var user, msg;
        if (!html) {
            var pos = message.indexOf(': ');
            if (pos !== -1) {
                user = message.substr(0, pos);
                msg = message.substring(pos + 2);

                var userid = client.id(user);
                if (!client.playerExist(userid)) {
                    return;
                }
                var channelname = client.channelName(channel);
                if (channelname !== "Auction House") {
                    return;
                }
                if (msg.indexOf("bid ") === 0) {
                    client.printChannelMessage(user + " --- " + parseInt(msg.substring(4), 10), channel, false);
                    auctionbot.makebid(user, getRealBid(parseInt(msg.substring(4), 10)));
                }
                if (msg.indexOf("nominate ") === 0) {
                    client.printChannelMessage(user + " --- " + msg.substring(9), channel, false);
                    auctionbot.nominateRound(user, msg.substring(9));
                }
            }
        }
    }
});
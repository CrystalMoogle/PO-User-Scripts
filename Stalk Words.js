//script that allows you to add stalk words (words that will ping you when spoken)
//simply add words to the variable listed below
var auth_symbol = {
    "0": "",
    "1": "+",
    "2": "+",
    "3": "+",
    "4": ""
    //change these to what you have set yourself
}
var stalkwords = [] // add stalkwords for you to be pinged format is ["word1","word2"], obviously you can add more than 2
var hilight = "BACKGROUND-COLOR: #ffff00" //change this if you want a different hilight colour when pinged (leave background there unless you want a different style)
var fontcolour = "#000000" //change this for different font colours
var fontstyle = "" //this changes the font type of your text, leave it blank for default
var fontsize = 3 //this changes the font size of your text, 3 is default
poScript = ({
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
    beforeChannelMessage: function (message, chan, html) {
        var pos = message.indexOf(': ');
        if (pos != -1) {
            if (client.id(message.substring(0, pos)) == -1) {
                return;
            }
            var id = client.id(message.substring(0, pos))
            var playname = message.substring(0, pos)
            if (client.auth(id) < 4 && client.auth(id) >= 0) {
                var playmessage = this.html_escape(message.substr(pos + 2))
            } else {
                var playmessage = message.substr(pos + 2)
            }
            var msg = playmessage.split(' ')
            for (x in msg) {
                var msgnew = ""
                if (msg[x].substr(0, 7) == "http://" || msg[x].substr(0, 8) == "https://") {
                    var link = msg[x]
                    msgnew = "<a href = '" + link + "'>" + link + "</a>"
                    playmessage = playmessage.replace(msg[x], msgnew)
                }
            }
            var colour = client.color(id)
            if (colour === "#000000") {
                var clist = ['#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f', '#1b1390', '#028678', '#0324b1'];
                colour = clist[src % clist.length];
            }
            if (playmessage.toLowerCase().indexOf(client.ownName().toLowerCase()) != -1 && playname !== client.ownName()) {
                var name = new RegExp("\\b" + client.ownName() + "\\b", "i")
                newplaymessage = playmessage.replace(name, "<span style='" + hilight + "'>" + client.ownName() + "</span>")
                if (newplaymessage !== playmessage) {
                    playmessage = newplaymessage.replace(newplaymessage, "<i> " + newplaymessage + "</i><ping/>")
                }
            }
            for (x in stalkwords) {
                if (playmessage.toLowerCase().indexOf(stalkwords[x].toLowerCase()) != -1 && playname !== client.ownName()) {
                    var stalk = new RegExp("\\b" + stalkwords[x] + "\\b", "i")
                    newplaymessage = playmessage.replace(stalk, "<span style='" + hilight + "'>" + stalkwords[x] + "</span>")
                    if (newplaymessage !== playmessage) {
                        playmessage = newplaymessage.replace(newplaymessage, "<i> " + newplaymessage + "</i><ping/>")
                    }
                }
            }
            if (client.auth(id) > 0 && client.auth(id) < 4) {
                client.printChannelMessage("<font face ='" + fontstyle + "'><font size = " + fontsize + "><font color='" + colour + "'><timestamp/><b> " + auth_symbol[client.auth(id)] + "<i>" + playname + ": </font></i></b>" + playmessage, chan, true)
                sys.stopEvent()
                return;
            }
            client.printChannelMessage("<font color='" + colour + "'><timestamp/><b>" + playname + ": </font></b>" + playmessage, chan, true)
            sys.stopEvent()
        }
    },
})
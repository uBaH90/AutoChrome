var recording = false;

$( document ).ready(function() {
    console.log("contentscript: document ready");
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // alert("contentscript: onMessage: " + JSON.stringify(request, null, 4));
    switch(request.cmd) {
        case "perform":
            performEvent(request.event);
            break;

        case "record":
            record();
            recording = true;
            break;

        case "stop":
            sendResponse();
            recording = false;
            break;

        case "play":
            play(request.actions);
            break;

        default:
            break;
    }

    return true;
});

function addAction(action) {
  // console.log("Adding action...: " + JSON.stringify(action, null, 4));
  notifyBackground({type: 'newAction', action: action});
}

function play(actions) {
    console.log("play: actions: " + actions);
    for(var i = 0; i < actions.length; i++) {
        var action = actions[i];
        console.log("Action: " + JSON.stringify(action, null, 4));
        $elem = $("#" + action.targetId);
        if (action.target === 'input') {
            $elem.val(action.value);
        }

        $elem.trigger(action.eventType);
    }
}

function record() {
    console.log("record");
    var recorder = new Recorder(window);
    recorder.record(addAction);
}

function notifyBackground(notification) {
    if (!recording) {
        return;
    }
    
    notification.cmd = 'notify';
    chrome.runtime.sendMessage({notification});
}




function evenListener(e) {
    //Check If event is passed
    var evt = e || window.event;
    if (evt) { // If event exists
        // if event's propagation(bubbling) is stopped then DO NOTHING simply return.
        if (evt.isPropagationStopped && evt.isPropagationStopped()) {
            return;
        }
        // Get Event Type (Click or Keyup or focus etc)
        var et = evt.type ? evt.type : evt;
        // Get Events Target (Element from which event is bubbled)
        var trgt = evt.target ? evt.target : window;
        // Timestamp of event you can also use evt.timeStamp if supported
        var time = Math.floor(Date.now() / 1000);
        // Get Where Event Occured ? events X and Y co-ordinate on Page and Scrolltop of document
        var x = 0, y = 0, scrolltop = 0;
        if (evt.pageX) {
            x = evt.pageX;
        }
        if (evt.pageY) {
            y = evt.pageY;
        }
        if (trgt.scrollTop) {
            scrolltop = trgt.scrollTop;
        }
        // Get id and class of element
        // BOTH id and class exists
        if (trgt.className && trgt.id) {
            trgt = "." + trgt.className + "#" + trgt.id;
        }
        // only id exists
        else if (trgt.id) {
            trgt = "#" + trgt.id;
        }
        // only class exists
        else if (trgt.className) {
            trgt = "." + trgt.className;
        }
        // Neither Class nor Id is defined
        if (typeof(trgt) != "String") {
            // If it is html tag display its tag name
            if (trgt.tagName) {
                trgt = trgt.tagName;
            }
            // No class + No Id + Not a Html tag
            else {
                trgt = trgt.toString().toLowerCase();
                trgt = trgt.replace("[object ", "");
                trgt = trgt.replace("]", "");
                trgt = trgt.replace("htmlbodyelement", "BODY");

            }
        }
        // Get extra information about event
        var xtra = "";
        // If keyboard Event? get Key code
        if (evt.keyCode) {
            xtra += " KeyCode: " + evt.keyCode;
        }
        // was Shift key pressed during occcurance of event?
        if (evt.shiftKey) {
            xtra += " ShiftKey ";
        }
        // was alt key pressed during occcurance of event?
        if (evt.altKey) {
            xtra += " altKey ";
        }
        // MetaKey is used on Mac instead of ctrl Key on PC
        if (evt.metaKey) {
            xtra += " metaKey ";
        }
        // was ctrl key pressed on pc during occcurance of event?
        if (evt.ctrlKey) {
            xtra += " ctrlKey ";
        }
        // Get windows dimensions for catching resize event
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            xx = w.innerWidth || e.clientWidth || g.clientWidth,
            yy = w.innerHeight || e.clientHeight || g.clientHeight;
        xtra += " RES:" + xx + "X" + yy;

        // pad output for displaying on console
        et = ("          " + et).slice(-10);
        trgt = ("               " + trgt).slice(-15);
        x = ("               " + x).slice(-15);
        y = ("               " + y).slice(-15);
        scrolltop = ("               " + scrolltop).slice(-15);
        time = ("              " + time).slice(-15);
        // Show output on console
        console.log("\n" + et + "\t" + trgt + "\t" + x + "\t" + y + "\t" + scrolltop + "\t" + time + "\t" + xtra);
    }
}

var recording = false;

document.addEventListener('DOMContentLoaded', () => {
    chrome.browserAction.onClicked.addListener(function (tab) {
        chrome.windows.create({
            url: chrome.runtime.getURL("main.html"),
            type: "popup",
            width: 700,
            height: 1000
        }, function (win) {
            // win represents the Window object from windows API
            // Do something after opening
            var x = document.getElementsByTagName("title")[0];
            alert(x.innerHTML);
        });
    });
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // alert(JSON.stringify(request, null, 4));

    // if (request.cmd === "GetURL")
    // {
    //     var tabURL = "Not set yet";
    //     chrome.tabs.query({active:true}, function(tabs) {
    //         if(tabs.length === 0)
    //         {
    //             sendResponse({});
    //             return;
    //         }
    //         tabURL = tabs[0].url;
    //         alert("Tab-URL: " + tabURL);
    //         sendResponse( {navURL:tabURL} );
    //     });
    //     return true;
    // }
    //
    // if (request.cmd === "play")
    // {
    //     // alert(JSON.stringify(request.events, null, 4));
    //     sendCommand({cmd: "perform", event: request.events[0]});
    //     return true;
    // }

    switch (request.cmd) {
        case 'record':
            recording = true;
            sendCommand(request, sendResponse);
            break;

        case 'stop':
            recording = false;
            sendCommand(request, sendResponse);
            break;

        case 'play':
            sendCommand(request, sendResponse);
            break;

        case 'notify':
            alert("recording: " + recording);
            if (recording) {
                notifyPopup(request);
            }
            break;

        default:
            break;
    }

    return true;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (recording) {
        var url = changeInfo.url;

        if (url != null && url.length > 0) {
            notifyPopup({type: 'urlChanged', url: url})
        }
    }

    console.log('updated from background tabId: ' + tabId + '; changeInfo: ' + JSON.stringify(changeInfo, null, 4));
});

function sendCommand(request, sendResponse) {
    chrome.tabs.query({active: true, lastFocusedWindow: false}, function (tabs) {
        // alert("Background script is sending a message to contentscript tab-url: " + tabs[0].url + "\n" + JSON.stringify(request, null, 4) +"");
        chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
            sendResponse(response);
        });
    });
}

function notifyPopup(notification) {
    chrome.runtime.sendMessage({notification});
}
$(document).ready(function() {
    console.log('popup: document ready');


    $('#btn-init').click(function () {
        sendCommand({cmd: "GetURL"}, function (response) {
            tabURL = response.navURL;
        })
    });

    $('#btn-play').click(function () {
        var events = [];
        events[0] = {id: "login-username", value: "john@example.com", eventType: "input"};
        events[1] = {id: "persistent", value: "", eventType: "click"};
        sendCommand({cmd: "play", events: events}, function (response) {

        })
    });

    $('#btn-record').click(function () {
        sendCommand({cmd: "record"}, function (response) {

        })
    });
});


function sendCommand(cmd, callback) {
    chrome.runtime.sendMessage(cmd, function (response) {
        callback(response);
    });
}
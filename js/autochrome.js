var actions = [];

$(document).ready(function() {
    console.log('popup: document ready');

    $('#btn-test').click(function () {
    });

    setupPlayButton();
    setupRecordButton();
    setupStopButton();
});

// listen to notifications of background script
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse)
{
    console.log(JSON.stringify(request, null, 4));

    switch (request.notification.type) {
        case 'urlChanged':
            setUrl(request.notification.url);
            break;

        case 'newAction':
            addAction(request.notification.action);
            break;

        default:
            break;
    }

    return true;
});

function setupPlayButton() {
  $('#btn-play').click(function () {
      sendCommand({cmd: "play", actions: actions}, function (response) {

      })
  });
}

function setupRecordButton() {
  $('#btn-record').click(function () {
      sendCommand({cmd: "record"}, function (response) {

      });

      $(this).prop("disabled", true);
      $('#btn-stop').prop("disabled", false);
  });
}

function setupStopButton() {
  $('#btn-stop').click(function () {
      sendCommand({cmd: "stop"}, function (response) {
          setupActionsTable();
      });

      $(this).prop("disabled", true);
      $('#btn-record').prop("disabled", false);
  });
}

function setupActionsTable() {
  $("#actions-table > tbody  > tr").each(function (key) {
    $(this).click(function() {
      var action = actions[key];
      $("#command").val(action.eventType);
      $("#target").val(action.target + ":" + action.targetId);
      $("#value").val(action.value);
    });
  });
}

function sendCommand(cmd, callback) {
    chrome.runtime.sendMessage(cmd, function (response) {
        callback(response);
    });
}

function setUrl(url) {
    $('#url').val(url);
}

function addAction(action) {
    if (action != null) {
        $("#actions-table tbody").append("<tr><td>" + action.eventType + "</td><td>" + action.target + ":" + action.targetId + "</td><td>" + action.value + "</td></tr>");
        actions.push(action);
    }
}

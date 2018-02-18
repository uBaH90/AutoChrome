var actions = [];

$(document).ready(function() {
    console.log('popup: document ready');

    $('#btn-test').click(function () {
    });

    setupPlayButton();
    setupRecordButton();
    setupStopButton();
});

function setupPlayButton() {
  $('#btn-play').click(function () {
      sendCommand({cmd: "play", events: events}, function (response) {

      })
  });
}

function setupRecordButton() {
  $('#btn-record').click(function () {
      sendCommand({cmd: "record"}, function (response) {

      })

      $(this).prop("disabled", true);
      $('#btn-stop').prop("disabled", false);
  });
}

function setupStopButton() {
  $('#btn-stop').click(function () {
      sendCommand({cmd: "stop"}, function (response) {
          // alert(JSON.stringify(response, null, 4))
          var $actionsTable =$("#actions-table tbody");
          if (response != null && response.length > 0) {
            for (var i = 0; i < response.length; i++) {
              var action = response[i];
              actions.push(action);
              $actionsTable.append("<tr><td>" + action.eventType + "</td><td>" + action.target + ":" + action.targetId + "</td><td>" + action.value + "</td></tr>");
            };

            setupActionsTable();
          }
      })

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

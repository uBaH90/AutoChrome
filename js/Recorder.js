// Array of events you want to capture
var events = ["mousedown", "click", "mouseup", "focus", "blur", "keyup", "keydown", "keypressed"];

class Recorder {
    constructor(window) {
        this.window = window;
    }

    record(callback) {
        console.log("recording...");

        $(":input").each(function (key, value) {
            // console.log("key: " + key + ", value: " + $(this).attr('id'));
            var id = $(this).attr ('id');
            $(this).blur(function() {
              callback({target: "input", targetId: id, eventType: "blur", value: $(this).val()});
            });
        });
    }
}

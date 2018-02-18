// Array of events you want to capture
var events = ["mousedown", "click", "mouseup", "focus", "blur", "keyup", "keydown", "keypressed"];

class Recorder {
    constructor(window) {
        this.window = window;
    }

    record() {
        alert("recording...");

        // You can also Use mousemove, resize and scroll
        // for (var i = 0; i < events.length; i++) {
        //     // Attach Listener for all events from array
        //     window.addEventListener("" + events[i] + "", function (e) {
        //         console.log("Adding even-listener: " + events[i]);
        //         evenListener(function (e) {
        //             alert(JSON.stringify(e, null, 4))
        //         });
        //     }, false);
        // }
        $(":input").each(function (key, value) {
            console.log("key: " + key + ", value: " + $(this).attr('id'));
        })
    }
}
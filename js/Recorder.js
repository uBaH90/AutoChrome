class Recorder {
    constructor(window) {
        this.window = window;
    }

    record(callback) {
        console.log("recording...");

        $(":input").each(function (key, value) {
            // console.log("key: " + key + ", value: " + $(this).attr('id'));
            var id = $(this).attr('id');

            $(this).focus(function () {
                callback({target: "input", targetId: id, eventType: "focus", value: $(this).val()});
            });

            $(this).blur(function () {
                callback({target: "input", targetId: id, eventType: "blur", value: $(this).val()});
            });
        });
    }
}

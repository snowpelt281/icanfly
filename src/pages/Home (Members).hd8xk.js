// @ts-nocheck

$w.onReady(function () {

    // =====================================
    // FLYING BUTTONS
    // =====================================

    var buttons = ["#button6", "#button7", "#button8"];

    buttons.forEach(function (buttonId) {
        var btn = $w(buttonId);

        if (!btn) {
            console.warn("Button not found:", buttonId);
            return;
        }

        btn.onClick(function () {
            flyButton(btn);
        });
    });

    function flyButton(button) {
        var x = Math.floor(Math.random() * 300);
        var y = Math.floor(Math.random() * 200);

        button.animate(
            {
                x: x,
                y: y
            },
            {
                duration: 1200,
                easing: "easeInOutQuad"
            }
        ).catch(function (err) {
            console.warn("flyButton error:", err);
        });
    }

    // =====================================
    // IMAGE FADE LOOP (Correct Method)
    // =====================================

    var img = $w("#imageX1");

    if (!img) {
        console.warn("imageX1 not found");
        return;
    }

    var fadeDuration = 1000;    // 1 second fade
    var visibleDuration = 8000; // stays visible 8 seconds

    function wait(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    (async function fadeLoop() {

        while (true) {

            // Fade in
            await img.show("fade", { duration: fadeDuration });

            await wait(visibleDuration);

            // Fade out
            await img.hide("fade", { duration: fadeDuration });

            await wait(500); // small buffer before repeating
        }

    })();

});

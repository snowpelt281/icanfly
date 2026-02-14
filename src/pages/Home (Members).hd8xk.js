// @ts-nocheck

$w.onReady(function () {

    // =====================================
    // FLYING BUTTONS
    // =====================================

    var buttons = ["#button6", "#button7", "#button8"];

    buttons.forEach(function (buttonId) {
        var btn = $w(buttonId);

        if (!btn || typeof btn.onClick !== "function") {
            console.warn("Button not found or invalid:", buttonId);
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
            console.warn("flyButton animate error:", err);
        });
    }

    // =====================================
    // IMAGE FADE LOOP
    // =====================================

    (function setupImageFade() {

        var img = $w("#imageX1");

        if (!img) {
            console.warn("imageX1 not found");
            return;
        }

        var fadeDuration = 1000;    // 1 second fade
        var visibleDuration = 8000; // stays visible 8 seconds

        var stopped = false;

        function wait(ms) {
            return new Promise(function (resolve) {
                setTimeout(resolve, ms);
            });
        }

        // Ensure image is visible in layout
        if (typeof img.show === "function") {
            img.show();
        }

        // Set initial opacity to 0 instantly
        img.animate(
            { opacity: 0 },
            { duration: 0 }
        ).catch(function () {});

        // Fade loop
        (async function loopFade() {

            while (!stopped) {

                // FADE IN
                try {
                    await img.animate(
                        { opacity: 1 },
                        {
                            duration: fadeDuration,
                            easing: "easeInOutQuad"
                        }
                    );
                } catch (e) {
                    console.warn("Fade in failed:", e);
                    break;
                }

                await wait(visibleDuration);

                // FADE OUT
                try {
                    await img.animate(
                        { opacity: 0 },
                        {
                            duration: fadeDuration,
                            easing: "easeInOutQuad"
                        }
                    );
                } catch (e) {
                    console.warn("Fade out failed:", e);
                    break;
                }
            }

        })();

        // Stop loop if navigating away
        if (typeof window !== "undefined") {
            var stop = function () {
                stopped = true;
            };
            window.addEventListener("beforeunload", stop);
            window.addEventListener("unload", stop);
        }

    })();

});

// @ts-nocheck

$w.onReady(function () {

    // List of button selectors
    var buttons = ["#button6", "#button7", "#button8"];

    buttons.forEach(function (buttonId) {
        var btn = $w(buttonId);
        if (!btn || typeof btn.onClick !== "function") {
            console.warn("Button not found or has no onClick():", buttonId);
            return;
        }

        btn.onClick(function () {
            flyButton(btn);
        });
    });

    function flyButton(button) {
        var x = Math.floor(Math.random() * 400);
        var y = Math.floor(Math.random() * 300);

        // animate translate
        button.animate(
            {
                transform: {
                    translate: {
                        x: x,
                        y: y
                    }
                }
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
    // IMAGE FADE (opacity-only; background stays)
    // =====================================
    (function setupImageFade() {
        var img = $w("#imageX1");
        if (!img) {
            console.warn("ImageX1 not found on this page");
            return;
        }

        // Timings (total cycle = 2*fadeDuration + visibleDuration = 10s)
        var fadeDuration = 1000;    // ms to fade in or out
        var visibleDuration = 8000; // ms fully visible between fades

        var stopped = false;
        function wait(ms) {
            return new Promise(function (res) { setTimeout(res, ms); });
        }

        // Ensure the element is present in layout and start fully transparent.
        if (typeof img.show === "function") img.show();
        if (typeof img.animate === "function") {
            // set initial opacity 0 instantly
            img.animate({ duration: 0, opacity: 0 }).catch(function () { /* ignore */ });

            // async loop using opacity animation only (no hide/show)
            (async function loopFade() {
                while (!stopped) {
                    try {
                        await img.animate({
                            duration: fadeDuration,
                            easing: "easeInOutQuad",
                            opacity: 1
                        });
                    } catch (e) {
                        // if opacity animation fails, break to fallback below
                        console.warn("opacity animate failed (fade in):", e);
                        break;
                    }

                    await wait(visibleDuration);

                    try {
                        await img.animate({
                            duration: fadeDuration,
                            easing: "easeInOutQuad",
                            opacity: 0
                        });
                    } catch (e) {
                        console.warn("opacity animate failed (fade out):", e);
                        break;
                    }
                    // next loop will fade it back in
                }
            })();
        } else {
            // Fallback: use show("fade") / hide("fade") (still visually smooth but toggles display)
            var fd = Math.max(100, Math.min(2000, fadeDuration));
            (async function fallbackLoop() {
                while (!stopped) {
                    if (typeof img.show === "function") img.show("fade", { duration: fd });
                    await wait(fd + visibleDuration);
                    if (typeof img.hide === "function") img.hide("fade", { duration: fd });
                    await wait(fd); // wait for fade-out to finish before next loop
                }
            })();
        }

        // Cleanup listeners so the loop stops when navigating away
        if (typeof window !== "undefined") {
            var stop = function () { stopped = true; };
            window.addEventListener("beforeunload", stop);
            window.addEventListener("unload", stop);
        }
    })();
});
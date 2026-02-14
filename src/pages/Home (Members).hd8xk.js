// @ts-nocheck

$w.onReady(function () {

    console.log("Page ready");

    // =====================================
    // IMAGE FADE LOOP (DEBUG VERSION)
    // =====================================

    var img = $w("#imageX1");

    if (!img) {
        console.error("❌ imageX1 not found");
        return;
    }

    console.log("✅ imageX1 found");

    var fadeDuration = 1000;     // 1 second fade
    var visibleDuration = 8000;  // 8 seconds visible

    function wait(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    async function fadeLoop() {

        console.log("Starting fade loop");

        while (true) {

            try {

                // Make sure it's not collapsed
                if (img.collapsed) {
                    console.log("Expanding image (was collapsed)");
                    img.expand();
                }

                console.log("➡️ Showing image...");
                await img.show("fade", { duration: fadeDuration });
                console.log("✅ Image shown");

                await wait(visibleDuration);

                console.log("⬅️ Hiding image...");
                await img.hide("fade", { duration: fadeDuration });
                console.log("✅ Image hidden");

                await wait(500);

            } catch (err) {
                console.error("❌ Fade loop error:", err);
                break;
            }
        }
    }

    fadeLoop();

});

// @ts-nocheck

$w.onReady(function () {

    const img = $w("#imageX1");

    if (!img) {
        console.error("Image not found");
        return;
    }

    const fadeDuration = 1000;
    const visibleDuration = 8000;
    const hiddenDuration = 8000; // <-- NEW

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fadeLoop() {

        while (true) {

            try {

                console.log("➡️ Fading IN");
                await img.show("fade", { duration: fadeDuration });
                console.log("✅ Visible");

                await wait(visibleDuration);

                console.log("⬅️ Fading OUT");
                await img.hide("fade", { duration: fadeDuration });
                console.log("✅ Hidden");

                await wait(hiddenDuration); // <-- THIS FIXES IT

            } catch (err) {
                console.error("Fade error:", err);
                break;
            }
        }
    }

    fadeLoop();
});

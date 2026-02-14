// @ts-nocheck

$w.onReady(function () {

    const img = $w("#imageX1");

    const fadeDuration = 1000;
    const visibleDuration = 8000;
    const hiddenDuration = 8000;

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fadeLoop() {
        while (true) {

            await img.show("fade", { duration: fadeDuration });
            await wait(visibleDuration);

            await img.hide("fade", { duration: fadeDuration });
            await wait(hiddenDuration);
        }
    }

    fadeLoop();
});

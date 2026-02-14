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

        var fade

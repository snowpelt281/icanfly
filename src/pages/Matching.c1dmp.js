// Page code: smoothly fade #ImageX1 in and out on a 10s cycle (no hide/show jump)
// Put this in the Page Code for the page that contains ImageX1

/** @type {any} */
const wix = /** @type {any} */ ($w);

$w.onReady(() => {
  const img = wix("#imageX1");
  if (!img) {
    console.warn("ImageX1 not found on this page");
    return;
  }

  // Timings (tweak if you want)
  const fadeDuration = 1000;    // ms to fade in or out
  const visibleDuration = 8000; // ms fully visible between fades
  // total cycle = fadeDuration + visibleDuration + fadeDuration = 10000ms (10s)

  // Ensure the element is visible (not display:none) and start at 0 opacity.
  // We attempt to use animate() to directly set opacity. If animate fails, fallback to show/hide fade.
  const supportsAnimate = typeof img.animate === "function";

  // helper to wait
  const wait = ms => new Promise(res => setTimeout(res, ms));

  // Fade using animate(opacity) when supported
  async function fadeCycleWithAnimate() {
    try {
      // make sure element is visible (so opacity changes are visible)
      if (typeof img.show === "function") img.show();

      // start from fully transparent
      await img.animate({ duration: 0, opacity: 0 }).catch(() => {});

      // Fade in
      await img.animate({
        duration: fadeDuration,
        easing: "easeInOutQuad",
        opacity: 1
      });

      // Stay visible
      await wait(visibleDuration);

      // Fade out
      await img.animate({
        duration: fadeDuration,
        easing: "easeInOutQuad",
        opacity: 0
      });

      // keep at opacity 0 (do NOT hide) so the transition is only opacity-based
    } catch (err) {
      // If anything goes wrong, fallback to show/hide fade approach
      console.warn("animate opacity failed, falling back to show/hide fade:", err);
      return false;
    }
    return true;
  }

  // Fallback that uses Wix show/hide with fade (still visually smooth)
  async function fadeCycleFallback() {
    // show("fade") then hide("fade") with durations that sum to the cycle
    const fd = Math.max(100, Math.min(2000, fadeDuration)); // clamp reasonable duration
    const visible = Math.max(0, visibleDuration);

    if (typeof img.show === "function") img.show("fade", { duration: fd });
    await wait(fd + visible);
    if (typeof img.hide === "function") img.hide("fade", { duration: fd });
    // we used hide here; next cycle show will fade in again
  }

  // Run the cycle in a loop and allow cleanup on unload/navigation
  let stopped = false;
  async function runLoop() {
    // prefer opacity animation; if it fails once, use fallback thereafter
    let useAnimate = supportsAnimate;
    while (!stopped) {
      if (useAnimate) {
        const ok = await fadeCycleWithAnimate();
        if (!ok) useAnimate = false;
      } else {
        await fadeCycleFallback();
      }
      // loop continues immediately because fadeCycle total time equals 10s
    }
  }
  runLoop();

});
<script lang="ts">
  import { onMount } from "svelte";

  let track = $state<HTMLDivElement>();
  let progress = $state(0);
  let enabled = $state(false);
  let onLight = $state(false);
  let dragging = false;

  onMount(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;

    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        progress = max ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
        if (track) {
          const rail = track.getBoundingClientRect();
          const underRail = document.elementsFromPoint(
            rail.left + rail.width / 2,
            rail.top + rail.height / 2,
          ).find((element) => element !== track && !track?.contains(element));
          onLight = !!underRail?.closest(".services-story, .story") ||
            (!!underRail?.closest("#testimonials") && !underRail.closest(".portrait")) ||
            (!!underRail?.closest("#services, #work, #contact") &&
              !underRail.closest(".service-viewer"));
        } else {
          onLight = false;
        }
      });
    }

    function syncAvailability() {
      enabled = finePointer.matches && !reducedMotion.matches;
      document.documentElement.classList.toggle("custom-scroll-active", enabled);
      update();
    }

    syncAvailability();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("services-scene-update", update);
    window.addEventListener("resize", update);
    finePointer.addEventListener("change", syncAvailability);
    reducedMotion.addEventListener("change", syncAvailability);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("custom-scroll-active");
      window.removeEventListener("scroll", update);
      window.removeEventListener("services-scene-update", update);
      window.removeEventListener("resize", update);
      finePointer.removeEventListener("change", syncAvailability);
      reducedMotion.removeEventListener("change", syncAvailability);
    };
  });

  function seek(clientY: number) {
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    window.scrollTo(0, fraction * (document.documentElement.scrollHeight - window.innerHeight));
  }

  function onPointerDown(event: PointerEvent) {
    if (event.button !== 0 || !track) return;
    dragging = true;
    track.setPointerCapture(event.pointerId);
    seek(event.clientY);
  }

  function onPointerMove(event: PointerEvent) {
    if (dragging) seek(event.clientY);
  }

  function onPointerUp(event: PointerEvent) {
    dragging = false;
    if (track?.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
  }

  function onKeyDown(event: KeyboardEvent) {
    const step = window.innerHeight * 0.15;
    let destination: number;
    switch (event.key) {
      case "ArrowUp": destination = window.scrollY - step; break;
      case "ArrowDown": destination = window.scrollY + step; break;
      case "PageUp": destination = window.scrollY - window.innerHeight; break;
      case "PageDown": destination = window.scrollY + window.innerHeight; break;
      case "Home": destination = 0; break;
      case "End": destination = document.documentElement.scrollHeight; break;
      default: return;
    }
    event.preventDefault();
    window.scrollTo(0, destination);
  }
</script>

{#if enabled}
  <div
    bind:this={track}
    class="page-scroller"
    class:on-light={onLight}
    role="slider"
    tabindex="0"
    aria-label="Page scroll position"
    aria-orientation="vertical"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow={Math.round(progress)}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
    onkeydown={onKeyDown}
  >
    <span class="page-scroller-fill" style:height={`${progress}%`}></span>
    <span class="page-scroller-thumb" style:top={`${progress}%`}></span>
  </div>
{/if}

<style>
  .page-scroller {
    position: fixed;
    z-index: 90;
    right: 1.25rem;
    top: 50%;
    width: 18px;
    height: min(44vh, 320px);
    transform: translateY(-50%);
    border-radius: 999px;
    background: rgb(255 255 255 / 32%);
    background-clip: content-box;
    padding: 0 7px;
    cursor: pointer;
    touch-action: none;
  }
  .page-scroller-fill {
    position: absolute;
    top: 0;
    left: 7px;
    width: 4px;
    border-radius: 999px;
    background: rgb(255 255 255 / 75%);
    pointer-events: none;
  }
  .page-scroller-thumb {
    position: absolute;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 18px rgb(255 255 255 / 55%);
    transform: translateY(-50%);
    pointer-events: none;
  }
  .page-scroller:focus-visible {
    outline: 2px solid white;
    outline-offset: 5px;
  }
  .page-scroller.on-light {
    background: rgb(17 17 17 / 22%);
    background-clip: content-box;
  }
  .page-scroller.on-light .page-scroller-fill {
    background: #252525;
  }
  .page-scroller.on-light .page-scroller-thumb {
    background: #111;
    box-shadow: 0 2px 10px rgb(0 0 0 / 25%);
  }
  .page-scroller.on-light:focus-visible {
    outline-color: #111;
  }
</style>
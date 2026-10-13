<script lang="ts">
  import { onMount } from "svelte";

  let cursor: HTMLDivElement;
  let ring: HTMLSpanElement;

  onMount(() => {
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!pointer.matches) return;

    document.documentElement.classList.add("custom-cursor-active");
    const controller = new AbortController();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetX = 0;
    let targetY = 0;
    let ringX = 0;
    let ringY = 0;
    let initialized = false;
    let frame = 0;

    function drawRing() {
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      ring.classList.toggle(
        "on-light",
        !!document.elementFromPoint(ringX, ringY)?.closest("#contact"),
      );
    }

    function follow() {
      if (reducedMotion.matches) {
        ringX = targetX;
        ringY = targetY;
        drawRing();
        frame = 0;
        return;
      }
      // Keep the center responsive while the outer ring catches up more slowly.
      ringX += (targetX - ringX) * 0.09;
      ringY += (targetY - ringY) * 0.09;
      if (Math.abs(targetX - ringX) < 0.1 && Math.abs(targetY - ringY) < 0.1) {
        ringX = targetX;
        ringY = targetY;
        drawRing();
        frame = 0;
        return;
      }
      drawRing();
      frame = requestAnimationFrame(follow);
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add("visible");
      ring.classList.add("visible");
      targetX = event.clientX;
      targetY = event.clientY;
      if (!initialized || reducedMotion.matches) {
        ringX = targetX;
        ringY = targetY;
        initialized = true;
        drawRing();
      } else if (!frame) {
        frame = requestAnimationFrame(follow);
      }
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const overGallery = !!target?.closest(".marquee-window");
      const overLink = !!target?.closest(
        'a, button, [role="button"]:not(.marquee-window)',
      );
      const overText =
        !overGallery &&
        !overLink &&
        !!target?.closest('.intro-content') &&
        !!target?.closest(
          'h1, h2, h3, h4, h5, h6, p, blockquote, li, span, small, strong, em, label',
        );
      const onLight = !!target?.closest('#contact');
      cursor.classList.toggle("over-gallery", overGallery);
      cursor.classList.toggle(
        "is-dragging",
        !!target?.closest(".marquee-window.dragging"),
      );
      cursor.classList.toggle("over-link", overLink);
      cursor.classList.toggle("over-text", overText);
      cursor.classList.toggle("on-light", onLight);
      ring.classList.toggle("inactive", overGallery || overLink);
      ring.classList.toggle("over-text", overText);
    }

    function hide() {
      cursor.classList.remove("visible");
      ring.classList.remove("visible");
      cancelAnimationFrame(frame);
      frame = 0;
      initialized = false;
    }

    window.addEventListener("pointermove", move, { signal: controller.signal });
    document.addEventListener(
      "pointerout",
      (event) => {
        if (!event.relatedTarget) hide();
      },
      { signal: controller.signal },
    );
    window.addEventListener("blur", hide, { signal: controller.signal });

    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  });
</script>

<span bind:this={ring} class="cursor-outline" aria-hidden="true"></span>
<div bind:this={cursor} class="custom-cursor" aria-hidden="true">
  <span class="cursor-dot"></span>
  <span class="cursor-label">DRAG</span>
  <span class="cursor-interact">↗</span>
</div>

<style>
  .cursor-outline {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 199;
    width: 34px;
    height: 34px;
    --cursor-color: #eaff54;
    border: 1px solid var(--cursor-color);
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    transition:
      opacity 180ms ease,
      width 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
      height 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
      border-radius 240ms ease,
      background 240ms ease;
  }
  .cursor-outline:global(.visible:not(.inactive)) {
    opacity: 1;
  }
  .cursor-outline:global(.over-text) {
    width: 54px;
    height: 54px;
    background: color-mix(in srgb, var(--cursor-color) 16%, transparent);
  }
  .cursor-outline:global(.on-light) {
    --cursor-color: #000;
  }
  .custom-cursor {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    pointer-events: none;
    opacity: 0;
    transition: opacity 150ms ease;
    --cursor-color: #eaff54;
    --cursor-ink: #0a0a0a;
  }
  .custom-cursor:global(.visible) {
    opacity: 1;
  }
  .custom-cursor:global(.on-light) {
    --cursor-color: #000;
    --cursor-ink: #fff;
  }
  .cursor-dot {
    position: absolute;
    top: -4px;
    left: -4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--cursor-color);
    transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .cursor-label {
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: var(--cursor-color);
    color: var(--cursor-ink);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    white-space: nowrap;
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
    transition:
      transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity 160ms ease;
  }
  .cursor-interact {
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--cursor-color);
    color: var(--cursor-ink);
    font-size: 1.45rem;
    line-height: 1;
    box-shadow: 0 0 0 0 transparent;
    transform: translate(-50%, -50%) scale(0.25) rotate(-45deg);
    opacity: 0;
    transition:
      transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity 160ms ease,
      box-shadow 280ms ease;
  }
  .custom-cursor:global(.over-gallery) .cursor-dot,
  .custom-cursor:global(.over-link) .cursor-dot {
    transform: scale(0);
  }
  .custom-cursor:global(.over-gallery) .cursor-label {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  .custom-cursor:global(.is-dragging) .cursor-label {
    transform: translate(-50%, -50%) scale(0.92);
  }
  .custom-cursor:global(.over-link:not(.over-gallery)) .cursor-interact {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    opacity: 1;
    box-shadow: 0 0 0 7px color-mix(in srgb, var(--cursor-color) 20%, transparent);
  }
  @media (hover: none), (pointer: coarse) {
    .custom-cursor,
    .cursor-outline {
      display: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .cursor-outline,
    .custom-cursor,
    .cursor-dot,
    .cursor-label,
    .cursor-interact {
      transition: none;
    }
  }
</style>

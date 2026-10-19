<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { performanceProfile } from '#lib/performance.js';

  type Props = { duration?: number; onflight?: () => void; onlanded?: () => void; oncomplete?: () => void };
  let { duration = 2450, onflight, onlanded, oncomplete }: Props = $props();
  let visible = $state(true);
  let flying = $state(false);
  let previousOverflow = "";
  let logo = $state<HTMLImageElement>();
  let landed = false;
  let flightStarted = false;

  function startFlight() {
    if (flightStarted) return;
    flightStarted = true;
    onflight?.();
  }

  function complete() {
    if (landed) return;
    startFlight();
    landed = true;
    onlanded?.();
    visible = false;
  }

  onMount(() => {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let flight: Animation | undefined;
    const timer = window.setTimeout(() => {
      const navbarLogo = document.getElementById("navbar-logo");
      if (reducedMotion || !navbarLogo || !logo) {
        startFlight();
        complete();
        return;
      }

      const start = logo.getBoundingClientRect();
      const end = navbarLogo.getBoundingClientRect();
      startFlight();
      flying = true;
      flight = logo.animate(
        [
          { transform: "translate(0, 0) scale(1)" },
          {
            transform: `translate(${end.left + end.width / 2 - start.left - start.width / 2}px, ${end.top + end.height / 2 - start.top - start.height / 2}px) scale(${end.width / start.width})`,
          },
        ],
        { duration: 700, easing: "cubic-bezier(0.65, 0, 0.25, 1)", fill: "forwards" },
      );
      void flight.finished.then(complete).catch(complete);
    }, reducedMotion ? 150 : Math.max(2450, duration));
    // Never leave the page hidden if the logo animation fails to settle.
    const safetyTimer = window.setTimeout(complete, reducedMotion ? 1000 : Math.max(5000, duration + 2500));

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(safetyTimer);
      flight?.cancel();
      document.body.style.overflow = previousOverflow;
    };
  });

  function finish() {
    document.body.style.overflow = previousOverflow;
    oncomplete?.();
  }
</script>

{#if visible}
  <div
    class="preloader fixed inset-0 z-[100] flex items-center justify-center"
    class:flying
    role="status"
    aria-live="polite"
    aria-label="Loading page"
    out:fade={{ duration: 200 }}
    onoutroend={finish}
  >
    <div class="backdrop" aria-hidden="true"></div>
    <div class="content">
      <p class="analysis" role="status">{$performanceProfile.ready ? `Device Performance Level: ${$performanceProfile.detected.toUpperCase()}` : 'Analyzing Device Performance...'}</p>
      <img
        class="logo"
        bind:this={logo}
        src="/sypher-logo.svg"
        alt=""
        width="300"
        height="300"
      />
    </div>
  </div>
{/if}

<style>
  .preloader {
    color: #f9fafb;
  }
  .backdrop {
    position: absolute;
    inset: 0;
    background: #000;
    transition: opacity 250ms ease;
  }
  .flying .backdrop {
    opacity: 0;
  }
  .content {
    position: relative;
    text-align: center;
  }
  .analysis { position: absolute; top: calc(100% + 24px); left: 50%; transform: translateX(-50%); width: max-content; max-width: 90vw; font-size: 13px; letter-spacing: .04em; }
  .logo {
    display: block;
    margin-inline: auto;
    width: min(300px, 70vw);
    height: auto;
    object-fit: contain;
    background: transparent;
  }
</style>

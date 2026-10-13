<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  type Props = { duration?: number; onflight?: () => void; onlanded?: () => void; oncomplete?: () => void };
  let { duration = 2450, onflight, onlanded, oncomplete }: Props = $props();
  let visible = $state(true);
  let flying = $state(false);
  let previousOverflow = "";
  let logo = $state<HTMLImageElement>();

  function complete() {
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
        onflight?.();
        complete();
        return;
      }

      const start = logo.getBoundingClientRect();
      const end = navbarLogo.getBoundingClientRect();
      onflight?.();
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

    return () => {
      window.clearTimeout(timer);
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
  .logo {
    display: block;
    margin-inline: auto;
    width: min(300px, 70vw);
    height: auto;
    object-fit: contain;
    background: transparent;
  }
</style>

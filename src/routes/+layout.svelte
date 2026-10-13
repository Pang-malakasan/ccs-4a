<script lang="ts">
  import { onMount, setContext } from "svelte";
  import "./layout.css";
  import Preloader from "#lib/components/Preloader.svelte";
  import CustomCursor from "#lib/components/CustomCursor.svelte";
  import PageScroller from "#lib/components/PageScroller.svelte";
  import Navbar from "#lib/components/landing/Navbar.svelte";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
  const intro = $state({ started: false, landed: false, complete: false });
  setContext("landing-intro", intro);

  onMount(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let disposed = false;
    let smoother: import("gsap/ScrollSmoother").ScrollSmoother | undefined;
    let loading = false;

    function scrollToSection(destination: HTMLElement, smooth: boolean) {
      const margin = parseFloat(getComputedStyle(destination).scrollMarginTop) || 0;
      smoother?.scrollTo(destination, smooth, `top ${margin}px`);
    }

    async function syncSmoother() {
      if (reducedMotion.matches || !finePointer.matches) {
        smoother?.kill();
        smoother = undefined;
        return;
      }
      if (smoother || loading) return;

      loading = true;
      try {
        const [{ gsap }, { ScrollTrigger }, { ScrollSmoother }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("gsap/ScrollSmoother"),
        ]);
        if (disposed || reducedMotion.matches || !finePointer.matches) return;
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
        smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1,
          effects: true,
        });
        if (window.location.hash) {
          const destination = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
          if (destination) scrollToSection(destination, false);
        }
      } finally {
        loading = false;
      }
    }

    function onAnchorClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !smoother || !(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>('a[href*="#"]');
      if (!anchor || anchor.origin !== window.location.origin || anchor.pathname !== window.location.pathname || anchor.search !== window.location.search || !anchor.hash) return;
      const destination = document.getElementById(decodeURIComponent(anchor.hash.slice(1)));
      if (!destination) return;
      event.preventDefault();
      history.pushState(null, "", anchor.hash);
      scrollToSection(destination, true);
    }

    function onHistoryNavigation() {
      if (!smoother) return;
      const destination = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (destination) scrollToSection(destination, false);
      else if (!window.location.hash) smoother.scrollTo(0, false);
    }

    void syncSmoother();
    reducedMotion.addEventListener("change", syncSmoother);
    finePointer.addEventListener("change", syncSmoother);
    document.addEventListener("click", onAnchorClick);
    window.addEventListener("popstate", onHistoryNavigation);
    return () => {
      disposed = true;
      reducedMotion.removeEventListener("change", syncSmoother);
      finePointer.removeEventListener("change", syncSmoother);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("popstate", onHistoryNavigation);
      smoother?.kill();
    };
  });
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/sypher-logo-static.svg" />
</svelte:head>

<Preloader
  onflight={() => (intro.started = true)}
  onlanded={() => (intro.landed = true)}
  oncomplete={() => (intro.complete = true)}
/>
<CustomCursor />
<PageScroller />
<Navbar />
<div id="smooth-wrapper">
  <div
    id="smooth-content"
    class="intro-content"
    class:intro-pending={!intro.started}
    inert={!intro.complete}
  >
    {@render children()}
  </div>
</div>

<style>
  .intro-content {
    transition: opacity 350ms ease;
  }
  .intro-pending {
    opacity: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .intro-content {
      transition: none;
    }
  }
</style>

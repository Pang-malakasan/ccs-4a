<script lang="ts">
  import { onMount, setContext, tick } from "svelte";
  import "./layout.css";
  import Preloader from "#lib/components/Preloader.svelte";
  import CustomCursor from "#lib/components/CustomCursor.svelte";
  import PageScroller from "#lib/components/PageScroller.svelte";
  import Navbar from "#lib/components/landing/Navbar.svelte";
  import PerformanceDashboard from "#lib/components/PerformanceDashboard.svelte";
  import { initializePerformance, performanceProfile } from "#lib/performance.js";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
  const intro = $state({ started: false, landed: false, complete: false });
  setContext("landing-intro", intro);

  onMount(() => {
    const stopPerformance = initializePerformance();
    // Keep the page usable if the preloader outro event is missed.
    const introFallback = window.setTimeout(() => {
      intro.started = true;
      intro.landed = true;
      intro.complete = true;
      document.body.style.overflow = "";
    }, 6000);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let disposed = false;
    let smoother: import("gsap/ScrollSmoother").ScrollSmoother | undefined;
    let loading = false;
    let anchorNavigationTimer: ReturnType<typeof setTimeout> | undefined;
    let sectionFrame = 0;
    let initialHashPending = !!window.location.hash;
    const sectionIds = ["top", "about", "services", "work", "testimonials", "contact"];

    function syncSectionHash() {
      sectionFrame = 0;
      if (initialHashPending || document.documentElement.dataset.anchorNavigating) return;
      // Use the visual positions: ScrollSmoother transforms its content, and
      // the Services section contains two independently pinned scenes.
      const marker = window.innerHeight * 0.35;
      let current = "top";
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= marker) current = id;
      }
      if (window.location.hash !== `#${current}`) {
        history.replaceState(history.state, "", `#${current}`);
      }
    }

    function onScroll() {
      if (!sectionFrame) sectionFrame = requestAnimationFrame(syncSectionHash);
    }

    function scrollToSection(destination: HTMLElement, smooth: boolean) {
      // The pinned services viewer must not recapture a jump past its slides.
      document.documentElement.dataset.anchorNavigating = "true";
      clearTimeout(anchorNavigationTimer);
      const margin = parseFloat(getComputedStyle(destination).scrollMarginTop) || 0;
      if (smoother) {
        if (destination.id === "top") smoother.scrollTo(0, smooth);
        else smoother.scrollTo(destination, smooth, `top ${margin}px`);
      } else {
        const top = destination.id === "top"
          ? 0
          : destination.getBoundingClientRect().top + window.scrollY - margin;
        window.scrollTo({ top, behavior: smooth ? "smooth" : "instant" });
      }
      anchorNavigationTimer = setTimeout(() => {
        delete document.documentElement.dataset.anchorNavigating;
        onScroll();
      }, smooth ? 1600 : 500);
    }

    async function syncSmoother() {
      if (reducedMotion.matches || document.documentElement.dataset.quality !== 'high') {
        smoother?.kill();
        smoother = undefined;
        initialHashPending = false;
        onScroll();
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
        if (disposed || reducedMotion.matches || document.documentElement.dataset.quality !== 'high') return;
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
        smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1,
          smoothTouch: 0.1,
          effects: true,
        });
        if (window.location.hash) {
          const destination = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
          if (destination) scrollToSection(destination, false);
        }
      } finally {
        initialHashPending = false;
        onScroll();
        loading = false;
      }
    }

    async function onAnchorClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>('a[href*="#"]');
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self") || anchor.origin !== window.location.origin || anchor.pathname !== window.location.pathname || anchor.search !== window.location.search || !anchor.hash) return;
      const destination = document.getElementById(decodeURIComponent(anchor.hash.slice(1)));
      if (!destination) return;
      event.preventDefault();
      history.pushState(null, "", anchor.hash);
      // Let mobile links close their menu and restore scrolling before the jump.
      await tick();
      if (disposed) return;
      // Jump directly: animating across the pinned Services slides lets their
      // scroll triggers capture the journey before the target is reached.
      scrollToSection(destination, false);
    }

    function onHistoryNavigation() {
      const destination = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (destination) scrollToSection(destination, false);
      else if (!window.location.hash) {
        if (smoother) smoother.scrollTo(0, false);
        else window.scrollTo(0, 0);
      }
    }

    void syncSmoother();
    window.addEventListener('sypher-quality-change', syncSmoother);
    reducedMotion.addEventListener("change", syncSmoother);
    finePointer.addEventListener("change", syncSmoother);
    // Handle section links before the router's bubbling click interception.
    document.addEventListener("click", onAnchorClick, true);
    window.addEventListener("popstate", onHistoryNavigation);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.clearTimeout(introFallback);
      stopPerformance();
      window.removeEventListener('sypher-quality-change', syncSmoother);
      clearTimeout(anchorNavigationTimer);
      cancelAnimationFrame(sectionFrame);
      delete document.documentElement.dataset.anchorNavigating;
      disposed = true;
      reducedMotion.removeEventListener("change", syncSmoother);
      finePointer.removeEventListener("change", syncSmoother);
      document.removeEventListener("click", onAnchorClick, true);
      window.removeEventListener("popstate", onHistoryNavigation);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
{#if $performanceProfile.ready && $performanceProfile.mode === 'high'}
  <CustomCursor />
{/if}
<PerformanceDashboard />
<PageScroller />
<Navbar />
<div id="smooth-wrapper">
  <div
    id="smooth-content"
    class="intro-content"
    class:intro-pending={!intro.started}
    inert={!intro.complete}
  >
    {#if $performanceProfile.ready}
      {#key $performanceProfile.mode}
        {@render children()}
      {/key}
    {:else}
      <p class="device-analysis" role="status">Analyzing Device Performance...</p>
    {/if}
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

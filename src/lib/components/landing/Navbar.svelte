<script lang="ts">
  import { getContext, onMount, tick } from "svelte";

  const intro = getContext<{ landed: boolean; complete: boolean }>(
    "landing-intro",
  ) ?? {
    landed: true,
    complete: true,
  };

  let mobileMenuOpen = $state(false);
  let visible = $state(true);
  let scrolled = $state(false);
  let menuToggle: HTMLButtonElement;
  let mobileNavigation = $state<HTMLElement>();

  async function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    visible = true;
    if (mobileMenuOpen) {
      await tick();
      mobileNavigation?.querySelector<HTMLAnchorElement>("a")?.focus();
    }
  }

  function onMenuKeydown(event: KeyboardEvent) {
    if (!mobileMenuOpen || !mobileNavigation) return;
    if (event.key === "Escape") {
      mobileMenuOpen = false;
      menuToggle.focus();
    } else if (event.key === "Tab") {
      const focusable = [
        menuToggle
          .closest(".navbar-inner")
          ?.querySelector<HTMLAnchorElement>(".brand"),
        menuToggle,
        ...mobileNavigation.querySelectorAll<HTMLAnchorElement>("a"),
      ].filter(
        (element): element is HTMLAnchorElement | HTMLButtonElement =>
          element != null,
      );
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable.at(-1)?.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === focusable.at(-1)
      ) {
        event.preventDefault();
        focusable[0]?.focus();
      }
    }
  }

  $effect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const content = document.getElementById("smooth-content");
    const wasInert = content?.inert;
    document.body.style.overflow = "hidden";
    if (content) content.inert = true;
    return () => {
      document.body.style.overflow = previousOverflow;
      if (content && wasInert !== undefined) content.inert = wasInert;
    };
  });

  onMount(() => {
    let previousY = window.scrollY;
    let frame = 0;

    function update() {
      frame = 0;
      const currentY = window.scrollY;
      scrolled = currentY > 80;
      if (currentY <= 80 || mobileMenuOpen) {
        visible = true;
        previousY = currentY;
      } else if (Math.abs(currentY - previousY) > 3) {
        visible = currentY < previousY;
        previousY = currentY;
      }
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) mobileMenuOpen = false;
      else visible = true;
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", closeOnDesktop);
      cancelAnimationFrame(frame);
    };
  });
  const links = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#work", label: "Our Work" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
  ];
</script>

<svelte:window onkeydown={onMenuKeydown} />

<header
  class="navbar fixed inset-x-0 top-0 z-50 text-white"
  class:logo-landed={intro.landed}
  class:intro-ready={intro.complete}
  class:nav-hidden={!visible && !mobileMenuOpen}
  class:nav-scrolled={scrolled}
  class:menu-open={mobileMenuOpen}
  inert={!intro.complete || (!visible && !mobileMenuOpen)}
  onfocusin={() => (visible = true)}
>
  <div
    class="navbar-inner mx-auto flex w-full max-w-[96rem] items-center justify-between gap-6 px-6 sm:px-10"
  >
    <a
      href="#top"
      class="brand flex shrink-0 items-center"
      aria-label="Sypher Creative Solutions, home"
    >
      <img
        id="navbar-logo"
        src="/sypher-logo-static.svg"
        alt=""
        width="52"
        height="52"
        class="brand-mark"
      />
      <span class="brand-words" aria-hidden="true">
        <span class="brand-name">Sypher {" "} Creative</span>

        <span class="brand-subline">
          <span class="bar"></span>
          <span class="brand-solutions">Solutions</span>
        </span>
      </span>
    </a>

    <nav
      aria-label="Main navigation"
      class="main-nav hidden items-center gap-7 text-lg tracking-wide lg:flex xl:gap-10"
    >
      {#each links as link}
        <a
          href={link.href}
          class="text-white/80 transition-colors hover:text-white focus-visible:text-white"
          >{link.label}</a
        >
      {/each}
    </nav>

    <button
      bind:this={menuToggle}
      type="button"
      class="menu-toggle flex h-11 w-11 items-center justify-center lg:hidden"
      aria-label={mobileMenuOpen
        ? "Close navigation menu"
        : "Open navigation menu"}
      aria-expanded={mobileMenuOpen}
      aria-controls="mobile-navigation"
      onclick={toggleMenu}
    >
      <span aria-hidden="true" class="menu-icon" class:open={mobileMenuOpen}>
        <span></span><span></span>
      </span>
    </button>
  </div>

  {#if mobileMenuOpen}
    <nav
      bind:this={mobileNavigation}
      id="mobile-navigation"
      aria-label="Mobile navigation"
      class="mobile-nav flex flex-col justify-center overflow-y-auto px-6 py-8 sm:px-10 lg:hidden"
    >
      {#each links as link}
        <a
          href={link.href}
          onclick={() => (mobileMenuOpen = false)}
          class="mobile-link border-b border-white/20 py-4 text-[clamp(2rem,8vw,3.5rem)] font-medium leading-tight tracking-[-0.05em] text-white/85 transition-colors hover:text-white focus-visible:text-white"
          >{link.label}</a
        >
      {/each}
    </nav>
  {/if}
</header>

<style>
  .navbar {
    background-color: #000;
    transition:
      transform 260ms ease,
      background-color 260ms ease,
      backdrop-filter 260ms ease;
  }
  .navbar.nav-scrolled:not(.menu-open) {
    background-color: rgb(0 0 0 / 72%);
  }
  .navbar.menu-open {
    height: 100vh;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background-color: rgb(0 0 0 / 78%);
  }
  .navbar.nav-hidden {
    transform: translateY(-100%);
  }
  .navbar-inner {
    flex: none;
    padding-top: 3rem;
    padding-bottom: 1rem;
    transition: padding 260ms ease;
  }
  .brand-mark {
    opacity: 0;
    transition: opacity 220ms ease;
  }
  .brand-words,
  .main-nav a,
  .menu-toggle {
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 420ms ease,
      transform 420ms ease;
  }
  .logo-landed .brand-mark {
    opacity: 1;
  }
  .logo-landed .brand-words {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 120ms;
  }
  .logo-landed .main-nav a,
  .logo-landed .menu-toggle {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 180ms;
  }
  .logo-landed .main-nav a:nth-child(2) {
    transition-delay: 240ms;
  }
  .logo-landed .main-nav a:nth-child(3) {
    transition-delay: 300ms;
  }
  .logo-landed .main-nav a:nth-child(4) {
    transition-delay: 360ms;
  }
  .nav-scrolled .navbar-inner {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  .mobile-nav {
    flex: 1;
    min-height: 0;
    width: 100%;
    max-width: 42rem;
    margin-inline: auto;
  }
  .menu-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    width: 26px;
    height: 26px;
  }
  .menu-icon span {
    display: block;
    width: 100%;
    height: 2px;
    background: currentColor;
    transition: transform 260ms ease;
  }
  .menu-icon.open span:first-child {
    transform: translateY(4px) rotate(45deg);
  }
  .menu-icon.open span:last-child {
    transform: translateY(-4px) rotate(-45deg);
  }
  .brand-mark {
    display: block;
    width: 3.25rem;
    height: 3.25rem;
    flex: none;
  }
  .brand-words {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: max-content;
    margin-left: -0.1rem;
    line-height: 1;
  }
  .brand-name {
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: -0.055em;
    white-space: nowrap;
  }
  .brand-subline {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
  }
  .brand-solutions {
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: -0.03em;
    white-space: nowrap;
  }
  .bar {
    flex: 1;
    height: 2px;
    background-color: white;
  }
  @media (min-width: 640px) {
    .navbar-inner {
      padding-top: 4rem;
      padding-bottom: 1rem;
    }
    .nav-scrolled .navbar-inner {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
    .brand-mark {
      width: 4rem;
      height: 4rem;
    }
    .brand-name {
      font-size: 1.4rem;
    }
    .brand-solutions {
      font-size: 1rem;
    }
  }
  @media (min-width: 1024px) {
    .navbar-inner {
      padding-top: 4.5rem;
    }
    .nav-scrolled .navbar-inner {
      padding-top: 0.75rem;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .navbar,
    .navbar-inner,
    .brand-mark,
    .brand-words,
    .main-nav a,
    .menu-toggle,
    .menu-icon span,
    .mobile-link {
      transition: none !important;
      transform: none;
    }
  }
</style>

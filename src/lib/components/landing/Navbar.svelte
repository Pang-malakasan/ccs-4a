<script lang="ts">
  let mobileMenuOpen = $state(false);
  const links = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#work", label: "Our Work" },
    { href: "#contact", label: "Contact" },
  ];
</script>

<header class="relative z-50 w-full bg-black text-white">
  <div
    class="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 pb-6 pt-20 sm:px-10 sm:pb-8 sm:pt-24 lg:pt-28"
  >
    <a
      href="/"
      class="brand flex shrink-0 items-center"
      aria-label="Sypher Creative Solutions, home"
    >
      <img
        id="navbar-logo"
        src="/sypher-logo-static.svg"
        alt=""
        width="96"
        height="96"
        class="brand-mark"
      />
      <span class="brand-words" aria-hidden="true">
        <span class="brand-name">Sypher {" "} Creative</span>

        <span class="brand-name flex items-center gap-2 ml-3">
          <div class="bar"></div>
          Solutions
        </span>
      </span>
    </a>

    <nav
      aria-label="Main navigation"
      class="hidden items-center gap-7 text-sm tracking-wide lg:flex xl:gap-10"
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
      type="button"
      class="flex h-11 w-11 items-center justify-center lg:hidden"
      aria-label={mobileMenuOpen
        ? "Close navigation menu"
        : "Open navigation menu"}
      aria-expanded={mobileMenuOpen}
      aria-controls="mobile-navigation"
      onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
    >
      <span aria-hidden="true" class="text-2xl leading-none"
        >{mobileMenuOpen ? "×" : "☰"}</span
      >
    </button>
  </div>

  {#if mobileMenuOpen}
    <nav
      id="mobile-navigation"
      aria-label="Mobile navigation"
      class="flex flex-col gap-1 border-t border-white/15 bg-black px-6 py-4 lg:hidden"
    >
      {#each links as link}
        <a
          href={link.href}
          onclick={() => (mobileMenuOpen = false)}
          class="py-3 text-lg text-white/85 hover:text-white">{link.label}</a
        >
      {/each}
    </nav>
  {/if}
</header>

<style>
  .brand-mark {
    display: block;
    width: 4.75rem;
    height: 4.75rem;
    flex: none;
  }
  .brand-words {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-left: -0.1rem;
    line-height: 1;
  }
  .brand-name {
    font-size: 1.35rem;
    font-weight: 500;
    letter-spacing: -0.055em;
  }
  .brand-creative {
    align-self: flex-end;
    margin-block: 0.45rem 0.35rem;
    font-size: 0.55rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgb(255 255 255 / 65%);
  }
  .brand-spark {
    color: white;
  }

  .bar {
    width: 3.5rem; /* Set a specific width instead of 100% */
    height: 2px;
    background-color: white;
    flex-shrink: 0;
  }
  @media (min-width: 640px) {
    .brand-mark {
      width: 6rem;
      height: 6rem;
    }
    .brand-name {
      font-size: 1.75rem;
    }
    .brand-creative {
      font-size: 0.65rem;
    }
  }
</style>

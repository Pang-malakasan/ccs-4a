<script lang="ts">
  import { getContext, onMount } from "svelte";

  const intro = getContext<{ complete: boolean }>("landing-intro") ?? {
    complete: true,
  };
  let spreadComplete = $state(false);
  let dragging = $state(false);
  let dragOffset = $state(0);
  let track: HTMLDivElement;
  let dragStartX = 0;
  let dragStartOffset = 0;

  function wrapOffset(offset: number) {
    const setWidth = track?.getBoundingClientRect().width / 5;
    if (!setWidth) return offset;
    return (
      ((((offset + setWidth / 2) % setWidth) + setWidth) % setWidth) -
      setWidth / 2
    );
  }

  function startDrag(event: PointerEvent) {
    if (
      !intro.complete ||
      !spreadComplete ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;
    dragging = true;
    dragStartX = event.clientX;
    dragStartOffset = dragOffset;
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function moveDrag(event: PointerEvent) {
    if (dragging)
      dragOffset = wrapOffset(dragStartOffset + event.clientX - dragStartX);
  }

  function stopDrag() {
    dragging = false;
  }

  function moveWithKeyboard(event: KeyboardEvent) {
    if (!intro.complete || !spreadComplete) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      dragOffset = wrapOffset(
        dragOffset + (event.key === "ArrowLeft" ? 80 : -80),
      );
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      dragOffset = wrapOffset(dragOffset - 80);
    }
  }

  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spreadComplete = true;
    }
  });
  const cards = [
    {
      video: "https://res.cloudinary.com/lremvhvs/video/upload/v1791960533/coffeebean.mp4",
      brand: "Coffee Bean",
      brandStyle: "coffee-bean",
      slab: "#333845",
      tint: "#5c6b8c",
      accent: "#60a5fa",
    },
    {
      video: "https://res.cloudinary.com/lremvhvs/video/upload/v1791960503/comtex.mp4",
      brand: "KOKO",
      brandStyle: "comtex",
      slab: "#7a5a3a",
      tint: "#c7864e",
      accent: "#f59e0b",
    },
    {
      video: "https://res.cloudinary.com/lremvhvs/video/upload/v1791960497/koko.mp4",
      brand: "KOKO",
      brandStyle: "koko",
      slab: "#384542",
      tint: "#546e67",
      accent: "#34d399",
    },
    {
      video: "https://res.cloudinary.com/lremvhvs/video/upload/v1791960740/payzen.mp4",
      brand: "Pay Zen",
      brandStyle: "pay-zen",
      slab: "#384542",
      tint: "#546e67",
      accent: "#34d399",
    },
    {
      video: "https://res.cloudinary.com/lremvhvs/video/upload/v1791960501/luiemere.mp4",
      brand: "Lumiere",
      brandStyle: "lumiere",
      slab: "#736453",
      tint: "#b59b7d",
      accent: "#fbbf24",
    },
    {
      video: "https://res.cloudinary.com/lremvhvs/video/upload/v1791960507/softbeats.mp4",
      brand: "Softbeats",
      brandStyle: "softbeats",
      slab: "#3f4654",
      tint: "#60728c",
      accent: "#38bdf8",
    },
    {
      video: "https://res.cloudinary.com/lremvhvs/video/upload/v1791960534/ted.mp4",
      brand: "ted",
      brandStyle: "ted",
      slab: "#473d43",
      tint: "#87616e",
      accent: "#fb7185",
    },
  ];
</script>

<section aria-labelledby="hero-title" class="hero bg-black text-white">
  <div
    class="hero-intro mt-12 mx-auto w-full max-w-[96rem] px-6 sm:mt-16 sm:px-10 lg:mt-20"
  >
    <h1 id="hero-title" class="hero-title font-medium text-white/95">
      Sleek. Scalable. Dynamic.<br />
      Digital that delivers.
    </h1>
  </div>

  <div
    class="marquee-window"
    class:dragging
    role="button"
    aria-label="Explore featured gallery. Drag left or right, or use the arrow keys or Enter."
    tabindex="0"
    onpointerdown={startDrag}
    onpointermove={moveDrag}
    onpointerup={stopDrag}
    onpointercancel={stopDrag}
    onkeydown={moveWithKeyboard}
  >
    <div
      bind:this={track}
      class="marquee-track"
      class:waiting={!intro.complete}
      class:spreading={intro.complete && !spreadComplete}
      class:playing={intro.complete && spreadComplete}
      class:dragging
      style:translate={`${dragOffset}px 0`}
    >
      {#each [0, 1, 2, 3, 4] as repeat}
        <div
          class="marquee-set"
          class:featured={repeat === 2}
          aria-hidden="true"
        >
          {#each cards as card, index}
            <div
              class="marquee-card"
              style={`--stack: ${100 - (repeat * cards.length + index)}; --slab-color: ${card.slab}; --card-tint: ${card.tint}; --card-accent: ${card.accent}; --reveal-delay: ${100 + Math.abs(index - 2) * 110}ms;`}
              onanimationend={(event) => {
                if (
                  repeat === 2 &&
                  index === cards.length - 1 &&
                  event.target === event.currentTarget &&
                  event.animationName.includes("card-spread")
                ) {
                  spreadComplete = true;
                }
              }}
            >
              <!-- 3D Backplate -->
              <div class="card-back" aria-hidden="true">
                <div class="card-back-plate">
                  <div class="card-back-glass"></div>
                  <div class="card-back-grid"></div>
                  <div class="card-back-accent"></div>
                  <div class="card-back-badge">
                    <span class="card-back-dot"></span>
                    <span class="card-back-id">0{index + 1}</span>
                  </div>
                </div>
              </div>

              <!-- 3D Front Slab -->
              <div class="card-slab">
                <div class="card-face">
                  <video
                    src={card.video}
                    aria-label={`${card.brand} brand video`}
                    autoplay
                    muted
                    loop
                    playsinline
                    preload={repeat === 2 ? "metadata" : "none"}
                    draggable="false"
                  ></video>
                  <span class="card-glass"></span>
                  <span class={`card-brand card-brand--${card.brandStyle}`}>
                    {#if card.brandStyle === "coffee-bean"}
                      <span class="brand-coffee-icon" aria-hidden="true"></span>
                      <span class="brand-wordmark">Coffee Bean</span>
                    {:else if card.brandStyle === "pay-zen"}
                      <span class="brand-pay-icon" aria-hidden="true"></span>
                      <span class="brand-wordmark">Pay<span>Zen</span></span>
                    {:else if card.brandStyle === "comtex"}
                      <svg
                        class="brand-symbol"
                        viewBox="0 0 48 48"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="24"
                          cy="24"
                          r="18"
                          stroke="currentColor"
                          stroke-width="2.5"
                        />
                        <path
                          d="M12 11c17 5 22 17 23 30M10 31c13-3 21-11 27-21M8 21c9 0 19 6 25 18"
                          stroke="currentColor"
                          stroke-width="2"
                        />
                      </svg>
                      <span class="brand-wordmark">COMTEX</span>
                    {:else if card.brandStyle === "koko"}
                      <svg
                        class="brand-symbol"
                        viewBox="0 0 96 38"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 15 12 12M93 15 84 12M39 14q9-6 18 0"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-linecap="round"
                        />
                        <path
                          d="M12 12q-2 0-2 6v7q0 9 14 9 13 0 16-11l2-8q-13-7-30-3ZM84 12q2 0 2 6v7q0 9-14 9-13 0-16-11l-2-8q13-7 30-3Z"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span class="brand-wordmark">KOKO</span>
                    {:else if card.brandStyle === "softbeats"}
                      <svg
                        class="brand-symbol"
                        viewBox="0 0 48 48"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 27v-5a16 16 0 0 1 32 0v5M8 25h5a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H9a4 4 0 0 1-4-4v-7a4 4 0 0 1 3-4ZM40 25h-5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h4a4 4 0 0 0 4-4v-7a4 4 0 0 0-3-4Z"
                          stroke="currentColor"
                          stroke-width="2.8"
                          stroke-linejoin="round"
                        />
                        <path
                          d="m21 25-2 8 5-4 5 4-2-8"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span class="brand-wordmark">softbeats</span>
                    {:else if card.brandStyle === "lumiere"}
                      <svg
                        class="brand-symbol"
                        viewBox="0 0 48 48"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M24 4c-6 8-10 15-10 22a10 10 0 0 0 20 0c0-7-4-14-10-22Z"
                          stroke="currentColor"
                          stroke-width="1.7"
                        />
                        <path
                          d="M24 17c-2 4-4 7-4 10a4 4 0 0 0 8 0c0-3-2-6-4-10Z"
                          fill="currentColor"
                        />
                        <path
                          d="M10 42h28"
                          stroke="currentColor"
                          stroke-width="1"
                        />
                      </svg>
                      <span class="brand-wordmark">LUMIERE</span>
                    {:else if card.brandStyle === "ted"}
                      <svg
                        class="brand-symbol"
                        viewBox="0 0 48 48"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 31c8 10 23 11 32-1M10 26c9 5 20 3 26-7"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-linecap="round"
                        />
                        <circle cx="12" cy="15" r="4" fill="currentColor" />
                        <circle cx="25" cy="9" r="3" fill="currentColor" />
                        <circle cx="38" cy="12" r="2" fill="currentColor" />
                      </svg>
                      <span class="brand-wordmark">
                        ted
                        <svg
                          class="brand-ted-underline"
                          viewBox="0 0 100 16"
                          preserveAspectRatio="none"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 11C27 4 64 4 97 8"
                            stroke="currentColor"
                            stroke-width="3"
                            stroke-linecap="round"
                          />
                        </svg>
                      </span>
                    {:else}
                      <span class="brand-wordmark">{card.brand}</span>
                    {/if}
                  </span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
  <div
    class="hero-caption mx-auto w-full max-w-[96rem] px-6 pb-8 sm:px-10 sm:pb-10"
  >
    <p
      class="ml-auto max-w-[34rem] text-right text-base leading-relaxed text-white sm:text-lg"
    >
      From strategy to standout digital experiences, we help your marketing
      reach further and your business grow.
    </p>
  </div>
</section>

<style>
  .hero {
    overflow: hidden;
    display: flex;
    flex: 1 0 auto;
    flex-direction: column;
    justify-content: space-between;
  }
  .hero-intro {
    position: relative;
    z-index: 2;
    text-align: left;
    flex-shrink: 0;
    margin-bottom: -1.5rem;
    pointer-events: none;
  }
  .hero-title {
    font-size: clamp(1.8rem, 3.3vw, 3.75rem);
    line-height: 1.18;
    white-space: nowrap;
  }
  .hero-caption {
    position: relative;
    z-index: 2;
    margin-top: -3rem;
    pointer-events: none;
  }
  .hero-caption p {
    text-shadow:
      0 2px 12px #000,
      0 0 24px #000;
  }
  .marquee-window {
    display: flex;
    align-items: center;
    width: 100%;
    height: clamp(24rem, 50svh, 36rem); /* Scaled up window height */
    flex: 1 1 auto;
    min-height: 24rem;
    overflow: hidden;
    background: #000;
    cursor: grab;
    touch-action: pan-y;
    user-select: none;
  }
  .marquee-window:active {
    cursor: grabbing;
  }

  .marquee-track {
    /* Scaled up card dimensions */
    --card-width: clamp(14rem, 22vw, 20rem);
    --half-card-width: clamp(7rem, 11vw, 10rem);
    --card-height: clamp(18rem, 28vw, 26rem);
    --card-gap: clamp(1.5rem, 3vw, 3rem);

    --card-step: calc(var(--card-width) + var(--card-gap));
    --center-shift: calc(
      var(--card-step) + var(--card-step) + var(--half-card-width)
    );
    position: relative;
    left: 50%;
    display: flex;
    align-items: center;
    width: max-content;
    flex: none;
    transform: translateX(calc(-50% + 10% - var(--center-shift)));
    will-change: transform;
  }

  .marquee-track.playing {
    animation: drift 48s linear infinite;
  }
  .marquee-track.dragging {
    animation-play-state: paused;
  }

  .marquee-set {
    display: flex;
    align-items: center;
    flex: none;
  }

  .marquee-track:not(.playing) .marquee-set:not(.featured) {
    opacity: 0;
  }

  .marquee-track.playing .marquee-set:not(.featured) {
    animation: reveal-neighbors 500ms ease-out both;
  }

  .marquee-track.waiting .featured .marquee-card {
    opacity: 0;
  }

  .marquee-track.spreading .featured .marquee-card:nth-child(3) {
    animation: card-arrive 350ms ease-out both;
  }

  .marquee-track.spreading .featured .marquee-card:not(:nth-child(3)) {
    animation: card-spread 550ms cubic-bezier(0.22, 1, 0.36, 1)
      var(--reveal-delay) both;
  }

  .featured .marquee-card:nth-child(1) {
    --spread-from: calc(var(--card-step) + var(--card-step));
  }
  .featured .marquee-card:nth-child(2) {
    --spread-from: var(--card-step);
  }
  .featured .marquee-card:nth-child(4) {
    --spread-from: calc(0px - var(--card-step));
  }
  .featured .marquee-card:nth-child(5) {
    --spread-from: calc(0px - var(--card-step) - var(--card-step));
  }
  .featured .marquee-card:nth-child(6) {
    --spread-from: calc(
      0px - var(--card-step) - var(--card-step) - var(--card-step)
    );
  }

  .marquee-card {
    position: relative;
    flex: 0 0 var(--card-width);
    width: var(--card-width);
    height: var(--card-height);
    margin-right: var(--card-gap);
    z-index: var(--stack);
    transform: skewY(19deg);
    will-change: transform;
    isolation: isolate;
  }

  /* 3D Backplate */
  .card-back {
    position: absolute;
    inset: 0;
    z-index: 1;
    transform: translate(
      11px,
      -10px
    ); /* Slightly increased translation for larger cards */
    border-radius: 2rem;
    pointer-events: none;
    transition: transform 300ms ease;
  }

  .card-back-plate {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: rgba(18, 20, 26, 0.2);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-shadow:
      inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.7),
      inset 1.5px 0 1px 0 rgba(255, 255, 255, 0.35),
      inset 0 -1.5px 1.5px 0 rgba(0, 0, 0, 0.75),
      inset -1.5px 0 1.5px 0 rgba(0, 0, 0, 0.45),
      0 10px 30px -4px color-mix(in srgb, var(--card-tint, #fff) 40%, transparent),
      14px 12px 28px rgba(0, 0, 0, 0.65),
      28px 24px 56px rgba(0, 0, 0, 0.85);
    overflow: hidden;
  }

  .card-back-glass {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      145deg,
      rgba(36, 39, 51, 0.25) 0%,
      rgba(18, 19, 24, 0.45) 100%
    );
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    pointer-events: none;
  }

  .card-back-grid {
    position: absolute;
    inset: 0;
    opacity: 0.18;
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.12) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
    background-size: 14px 14px;
  }

  .card-back-accent {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      125deg,
      rgba(255, 255, 255, 0.3) 0%,
      color-mix(in srgb, var(--card-tint, #fff) 25%, transparent) 25%,
      transparent 55%
    );
    pointer-events: none;
  }

  .card-back-badge {
    position: absolute;
    top: 0.65rem;
    right: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.18rem 0.45rem;
    border-radius: 9999px;
    background: rgba(0, 0, 0, 0.45);
    border: 1px solid
      color-mix(in srgb, var(--card-tint, #fff) 35%, rgba(255, 255, 255, 0.2));
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .card-back-dot {
    width: 5px;
    height: 5px;
    border-radius: 9999px;
    background: var(--card-accent, #60a5fa);
    box-shadow: 0 0 8px var(--card-accent, #60a5fa);
  }

  .card-back-id {
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: color-mix(in srgb, var(--card-tint, #fff) 45%, #ffffff);
  }

  /* 3D Front Slab */
  .card-slab {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    border-radius: 2rem;
    background-color: var(--slab-color, #353744);
    padding-top: 7px;
    padding-right: 4px;
    padding-bottom: 1px;
    padding-left: 1px;
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.55),
      1px -1px 0 0 rgba(255, 255, 255, 0.25),
      2px -2px 0 0 color-mix(in srgb, var(--card-tint, #fff) 25%, rgba(100, 110, 130, 0.2)),
      3px -3px 0 0 color-mix(in srgb, var(--card-tint, #fff) 20%, rgba(50, 60, 80, 0.3)),
      4px -4px 0 0 color-mix(in srgb, var(--card-tint, #fff) 15%, rgba(30, 35, 50, 0.45)),
      5px -5px 0 0 rgba(15, 18, 25, 0.6),
      6px -6px 0 0 rgba(10, 12, 18, 0.75),
      8px -4px 14px rgba(0, 0, 0, 0.35);
    transition: transform 300ms ease;
  }

  .card-face {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: calc(2rem - 3px);
    overflow: hidden;
    background: #111;
  }

  .card-face video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.92) contrast(1.02);
    pointer-events: none;
  }

  .card-brand {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: calc(100% - 1.5rem);
    transform: translate(-50%, -50%);
    color: #fff;
    font-family: "Inter Variable", "Helvetica Neue", Helvetica, Arial,
      sans-serif;
    font-size: clamp(1.1rem, 2vw, 2rem);
    font-weight: 800;
    line-height: 1.05;
    text-align: center;
    text-shadow:
      0 2px 16px #000,
      0 1px 4px #000;
    pointer-events: none;
  }
  .brand-wordmark {
    display: block;
    white-space: nowrap;
    flex: 0 1 auto;
    min-width: 0;
  }
  .brand-symbol {
    display: block;
    flex: none;
    width: 2.5rem;
    height: 2.5rem;
    filter: drop-shadow(0 2px 8px #000);
  }
  .card-brand--coffee-bean {
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1rem, 1.65vw, 1.65rem);
    font-weight: 700;
    letter-spacing: -0.06em;
    text-transform: uppercase;
  }
  .brand-coffee-icon {
    position: relative;
    display: block;
    flex: 0 0 1.15em;
    width: 1.15em;
    height: 1.5em;
    border: 0.16em solid currentColor;
    border-radius: 55% 45% 55% 45%;
    transform: rotate(35deg);
  }
  .brand-coffee-icon::after {
    content: "";
    position: absolute;
    top: -0.13em;
    left: 50%;
    width: 0.18em;
    height: 1.4em;
    border-left: 0.13em solid currentColor;
    border-radius: 50%;
    transform: rotate(16deg);
  }
  .card-brand--comtex {
    font-family: "Arial Narrow", "Helvetica Neue", Arial, sans-serif;
    font-size: clamp(1.2rem, 1.9vw, 1.9rem);
    font-weight: 900;
    font-style: italic;
    letter-spacing: -0.055em;
    text-transform: uppercase;
  }
  .card-brand--koko {
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.45rem, 2.4vw, 2.4rem);
    font-weight: 400;
    letter-spacing: -0.06em;
  }
  .card-brand--koko .brand-symbol {
    width: 2.8rem;
    height: auto;
  }
  .card-brand--pay-zen {
    font-size: clamp(1.35rem, 2.5vw, 2.4rem);
    font-weight: 750;
    letter-spacing: -0.075em;
  }
  .card-brand--pay-zen .brand-wordmark span {
    font-weight: 400;
  }
  .brand-pay-icon {
    display: block;
    flex: 0 0 0.9em;
    width: 0.9em;
    height: 0.9em;
    border: 0.2em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    transform: rotate(-40deg);
  }
  .card-brand--lumiere {
    font-family: "Times New Roman", Times, serif;
    font-size: clamp(1rem, 1.5vw, 1.5rem);
    font-weight: 400;
    letter-spacing: 0.1em;
  }
  .card-brand--softbeats {
    font-family: "Trebuchet MS", "Arial Rounded MT Bold", sans-serif;
    font-size: clamp(1rem, 1.6vw, 1.6rem);
    font-weight: 700;
    letter-spacing: -0.065em;
    text-transform: lowercase;
  }
  .card-brand--ted {
    font-family: "Segoe Script", "Brush Script MT", "URW Chancery L", cursive;
    font-size: clamp(2rem, 3vw, 3rem);
    font-weight: 600;
    font-style: normal;
    letter-spacing: -0.04em;
  }
  .card-brand--ted .brand-wordmark {
    position: relative;
    padding-bottom: 0.15em;
  }
  .brand-ted-underline {
    position: absolute;
    bottom: -0.04em;
    left: 0;
    width: 100%;
    height: 0.25em;
    filter: drop-shadow(0 2px 4px #000);
  }
  .card-brand--ted .brand-symbol {
    width: 2.2rem;
    height: 2.2rem;
  }

  .card-glass {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.38),
        transparent 20%,
        transparent 80%,
        rgba(0, 0, 0, 0.38)
      ),
      linear-gradient(0deg, rgba(0, 0, 0, 0.5), transparent 30%),
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.12),
        transparent 45%,
        rgba(0, 0, 0, 0.15)
      );
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.25),
      inset 0 0 0 1px rgba(0, 0, 0, 0.2);
    pointer-events: none;
  }

  @keyframes drift {
    from {
      transform: translateX(calc(-50% + 10% - var(--center-shift)));
    }
    to {
      transform: translateX(calc(-50% - 10% - var(--center-shift)));
    }
  }

  @keyframes card-arrive {
    from {
      opacity: 0;
      transform: skewY(19deg) scale(0.8);
    }
    to {
      opacity: 1;
      transform: skewY(19deg) scale(1);
    }
  }

  @keyframes card-spread {
    from {
      opacity: 0;
      transform: translateX(var(--spread-from)) skewY(19deg) scale(0.85);
    }
    to {
      opacity: 1;
      transform: translateX(0) skewY(19deg) scale(1);
    }
  }

  @keyframes reveal-neighbors {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 1023px) {
    .marquee-track {
      --card-width: clamp(12rem, 24vw, 16rem);
      --half-card-width: clamp(6rem, 12vw, 8rem);
      --card-height: clamp(16rem, 30vw, 21rem);
      --card-gap: 1.5rem;
    }
  }

  @media (max-width: 767px) {
    .hero-title {
      font-size: clamp(2rem, 6vw, 3rem);
      white-space: normal;
    }
  }

  @media (max-width: 639px) {
    .hero-caption {
      margin-top: -1.5rem;
    }
    .hero-title {
      font-size: clamp(2rem, 8vw, 2.75rem);
    }
    .marquee-window {
      height: clamp(16rem, 40svh, 24rem);
      min-height: 16rem;
    }
    .marquee-track {
      --card-width: 11rem;
      --half-card-width: 5.5rem;
      --card-height: 14.5rem;
      --card-gap: 1rem;
    }
    .marquee-card {
      border-radius: 1.25rem;
    }
    .card-back {
      border-radius: 1.25rem;
      transform: translate(6px, -5px);
    }
    .card-slab {
      border-radius: 1.25rem;
      padding-top: 5px;
      padding-right: 3px;
      box-shadow:
        inset 0 1px 1px rgba(255, 255, 255, 0.45),
        1px -1px 0 0 rgba(32, 34, 42, 0.9),
        2px -2px 0 0 rgba(28, 30, 38, 0.9),
        3px -3px 0 0 rgba(24, 26, 34, 0.9),
        4px -4px 0 0 rgba(20, 22, 30, 0.9),
        6px -3px 10px rgba(0, 0, 0, 0.35);
    }
    .card-face {
      border-radius: calc(1.25rem - 2px);
    }
    .card-brand--coffee-bean {
      font-size: 0.95rem;
    }
    .card-brand--comtex {
      font-size: 1.35rem;
    }
    .card-brand--koko {
      font-size: 1.75rem;
    }
    .card-brand--pay-zen {
      font-size: 1.6rem;
    }
    .card-brand--lumiere {
      font-size: 1rem;
    }
    .card-brand--softbeats {
      font-size: 1.05rem;
    }
    .card-brand--ted {
      font-size: 2rem;
    }
    .brand-symbol {
      width: 1.6rem;
      height: 1.6rem;
    }
    .card-brand--koko .brand-symbol {
      width: 2.3rem;
      height: auto;
    }
    .card-brand--ted .brand-symbol {
      width: 1.7rem;
      height: 1.7rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-track.playing {
      animation: none;
    }
    .marquee-track.playing .marquee-set:not(.featured) {
      animation: none;
    }
    .marquee-track.spreading .featured .marquee-card {
      animation-duration: 1ms;
      animation-delay: 0ms;
    }
  }
</style>

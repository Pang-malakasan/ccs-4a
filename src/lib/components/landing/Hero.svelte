<script lang="ts">
  import { getContext, onMount } from "svelte";

  const intro = getContext<{ complete: boolean }>("landing-intro") ?? {
    complete: true,
  };
  let spreadComplete = $state(false);

  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spreadComplete = true;
    }
  });
  const cards = [
    {
      image: "/hero/sculpture.jpg",
      slab: "#333845",
      tint: "#5c6b8c",
      accent: "#60a5fa",
      alt: "Sculptural monument",
    },
    {
      image: "/hero/warm-interior.jpg",
      slab: "#7a5a3a",
      tint: "#c7864e",
      accent: "#f59e0b",
      alt: "Warm interior architecture",
    },
    {
      image: "/hero/studio.jpg",
      slab: "#384542",
      tint: "#546e67",
      accent: "#34d399",
      alt: "Creative studio space",
    },
    {
      image: "/hero/interior.jpg",
      slab: "#736453",
      tint: "#b59b7d",
      accent: "#fbbf24",
      alt: "Contemporary interior design",
    },
    {
      image: "/hero/architecture.jpg",
      slab: "#3f4654",
      tint: "#60728c",
      accent: "#38bdf8",
      alt: "Modern architectural facade",
    },
  ];
</script>

<section aria-labelledby="hero-title" class="hero bg-black text-white">
  <div class="hero-intro mx-auto w-full max-w-7xl px-6 pt-5 sm:px-10 sm:pt-7">
    <h1
      id="hero-title"
      class="hero-title font-normal leading-[0.98] tracking-[-0.075em]"
    >
      Puede Nang. <span class="text-white/55">Matulog.</span>
    </h1>
  </div>

  <div
    class="marquee-window"
    role="img"
    aria-label="An animated gallery of 3D isometric cards"
  >
    <div
      class="marquee-track"
      class:waiting={!intro.complete}
      class:spreading={intro.complete && !spreadComplete}
      class:playing={intro.complete && spreadComplete}
    >
      {#each [0, 1, 2] as repeat}
        <div
          class="marquee-set"
          class:featured={repeat === 1}
          aria-hidden="true"
        >
          {#each cards as card, index}
            <div
              class="marquee-card"
              style={`--stack: ${100 - (repeat * cards.length + index)}; --slab-color: ${card.slab}; --card-tint: ${card.tint}; --card-accent: ${card.accent}; --reveal-delay: ${350 + Math.abs(index - 2) * 180 + (index > 2 ? 90 : 0)}ms;`}
              onanimationend={(event) => {
                if (
                  repeat === 1 &&
                  index === 4 &&
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
                  <img
                    src={card.image}
                    alt=""
                    class="card-back-img"
                    loading="lazy"
                  />
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
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading={repeat === 1 ? "eager" : "lazy"}
                  />
                  <span class="card-glass"></span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <div class="hero-bottom mx-auto w-full max-w-7xl px-6 pb-6 sm:px-10 sm:pb-8">
    <a
      href="#services"
      class="hero-action inline-flex items-center gap-8 border-b border-white/70 pb-2 text-sm font-medium tracking-wide transition-colors hover:text-white/65 focus-visible:text-white/65"
    >
      Explore what we do <span aria-hidden="true">↗</span>
    </a>
    <p
      class="hero-description text-base leading-relaxed text-white/65 sm:text-lg"
    >
      Sypher Creative Solutions brings thoughtful ideas and creative execution
      together to help your brand move forward.
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
    text-align: left;
  }
  .hero-title {
    font-size: clamp(1.8rem, 3.3vw, 3.75rem);
    white-space: nowrap;
  }
  .hero-bottom {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 2rem;
  }
  .hero-action {
    flex: none;
  }
  .hero-description {
    max-width: 30rem;
    margin: 0;
  }

  .marquee-window {
    display: flex;
    align-items: center;
    width: 100%;
    height: clamp(16rem, 40svh, 26rem);
    flex: 1 1 auto;
    min-height: 16rem;
    overflow: hidden;
    background: #000;
    pointer-events: none;
  }

  .marquee-track {
    --card-width: clamp(10rem, 16vw, 15rem);
    --half-card-width: clamp(5rem, 8vw, 7.5rem);
    --card-height: clamp(13rem, 21vw, 19rem);
    --card-gap: clamp(1rem, 2vw, 2rem);
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
    transform: translateX(calc(-50% + 16.666667% - var(--center-shift)));
    will-change: transform;
  }

  .marquee-track.playing {
    animation: drift 55s linear infinite;
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
    animation: card-spread 900ms cubic-bezier(0.22, 1, 0.36, 1)
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
  /* 3D Backplate */
  .card-back {
    position: absolute;
    inset: 0;
    z-index: 1;
    transform: translate(9px, -8px);
    border-radius: 2rem;
    pointer-events: none;
    transition: transform 300ms ease;
  }

  .card-back-plate {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    /* Translucent glassmorphism base */
    background: rgba(18, 20, 26, 0.2);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    /* 1px metallic perimeter bevel with color-matched highlight */
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-shadow:
      /* Metallic specular bevel reflections */
      inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.7),
      inset 1.5px 0 1px 0 rgba(255, 255, 255, 0.35),
      inset 0 -1.5px 1.5px 0 rgba(0, 0, 0, 0.75),
      inset -1.5px 0 1.5px 0 rgba(0, 0, 0, 0.45),
      /* Ambient glass color glow matching image */ 0 10px 30px -4px color-mix(in
            srgb, var(--card-tint, #fff) 40%, transparent),
      /* Deep 3D drop shadow */ 14px 12px 28px rgba(0, 0, 0, 0.65),
      28px 24px 56px rgba(0, 0, 0, 0.85);
    overflow: hidden;
  }

  /* Clear image reflection so the side and back showcase the actual picture */
  .card-back-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(2px) saturate(125%) brightness(0.95);
    opacity: 0.88;
    transform: scale(1.02);
    pointer-events: none;
  }

  /* Frosted luxury dark graphite glass overlay with smooth translucency */
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
    /* 3D slab thickness: exposed top rim and right rim */
    padding-top: 7px;
    padding-right: 4px;
    padding-bottom: 1px;
    padding-left: 1px;
    /* 3D extrusion slices bridging the front slab to the backplate with glass specular transitions */
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

  .card-face img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.92) contrast(1.02);
  }

  .card-glass {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    /* Subtle realistic ambient sheen and perimeter highlight */
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.12) 0%,
      transparent 45%,
      rgba(0, 0, 0, 0.15) 100%
    );
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.25),
      inset 0 0 0 1px rgba(0, 0, 0, 0.2);
    pointer-events: none;
  }

  @keyframes drift {
    from {
      transform: translateX(calc(-50% + 16.666667% - var(--center-shift)));
    }
    to {
      transform: translateX(calc(-50% - 16.666667% - var(--center-shift)));
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
      --card-width: clamp(9rem, 18vw, 12rem);
      --half-card-width: clamp(4.5rem, 9vw, 6rem);
      --card-height: clamp(12rem, 23vw, 16rem);
      --card-gap: 1rem;
    }
    .hero-description {
      max-width: 24rem;
    }
  }

  @media (max-width: 767px) {
    .hero-title {
      font-size: clamp(2rem, 6vw, 3rem);
      white-space: normal;
    }
    .hero-bottom {
      align-items: start;
      flex-direction: column-reverse;
      gap: 1.25rem;
    }
    .hero-description {
      align-self: flex-end;
      text-align: right;
    }
  }

  @media (max-width: 639px) {
    .hero-title {
      font-size: clamp(2rem, 8vw, 2.75rem);
    }
    .hero-description {
      max-width: 22rem;
    }
    .marquee-window {
      height: clamp(11rem, 32svh, 20rem);
      min-height: 11rem;
    }
    .marquee-track {
      --card-width: 8rem;
      --half-card-width: 4rem;
      --card-height: 10.5rem;
      --card-gap: 0.75rem;
    }
    .marquee-card {
      border-radius: 1.25rem;
    }
    .card-back {
      border-radius: 1.25rem;
      transform: translate(5px, -4px);
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

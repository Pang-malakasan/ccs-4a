<script lang="ts">
  import { onMount, tick } from "svelte";
  import ServicesStory from "./ServicesStory.svelte";
  type Service = {
    number: string;
    title: string;
    description: string;
    offerings: string[];
    theme: string;
    image: string;
  };
  let { services }: { services: Service[] } = $props();
  let viewer: HTMLDivElement;
  let currentIndex = $state(0);
  let animated = $state(false);
  let introducing = $state(true);
  let outroStarted = $state(false);
  let storyShowing = $state(false);
  const introDuration = 1.6;
  function createStars() {
    // Seeded randomness avoids visible rows while keeping SSR and hydration
    // identical. Each property receives an independent pseudorandom sample.
    let seed = 73129;
    const random = () => {
      seed = (seed * 48271) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    return Array.from({ length: 180 }, () => ({
      x: random() * 100,
      y: random() * 100,
      size: 0.7 + Math.pow(random(), 3) * 2.3,
      opacity: 0.3 + random() * 0.7,
    }));
  }
  const stars = createStars();

  onMount(() => {
    if (document.documentElement.dataset.quality !== 'high') return;
    let disposed = false;
    let cleanup = () => {};
    async function setup() {
      const [{ gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        if (!services.length) return;
        animated = true;
        // Pin measurements need the full-screen layout synchronously.
        viewer.classList.add("animated");
        const panels = Array.from(
          viewer.querySelectorAll<HTMLElement>(".service-slide"),
        );
        // Eager loading below starts requests before the pinned sequence arrives.
        // Decode opportunistically; a failed image must not block navigation.
        viewer
          .querySelectorAll<HTMLImageElement>(".slide-image")
          .forEach((image) => {
            void image.decode().catch(() => {});
          });
        const context = gsap.context(() => {
          const intro = viewer.querySelector<HTMLElement>(".services-intro")!;
          const space = viewer.querySelector<HTMLElement>(".service-space")!;
          const lines = intro.querySelectorAll(".intro-line > span");
          const outroPaths = Array.from(
            viewer.querySelectorAll<SVGPathElement>(".services-outro path"),
          );
          const outroStart = introDuration + services.length - 0.35;
          const revealStart = outroStart + 1.65;
          const bridge = viewer.querySelector<HTMLElement>(".services-bridge")!;
          const storyStart = revealStart + 1.55;
          const story = viewer.querySelector<HTMLElement>(".services-story")!;
          const storyTrack = story.querySelector<HTMLElement>(".story-track")!;
          const storyTransitions = Math.max(1, storyTrack.children.length - 1);
          const storyHeading =
            story.querySelector<HTMLElement>(".story-heading")!;
          const caption = story.querySelector<HTMLElement>(".story-caption")!;
          const revealPoints = outroPaths.map(() =>
            Array<number>(10).fill(100),
          );
          // Fixed delays keep the wave stable across refreshes and reverse scrolling.
          const pointDelays = [
            0.12, 0.04, 0.19, 0.27, 0.16, 0.02, 0.09, 0.23, 0.3, 0.18,
          ];
          const renderOutro = () => {
            outroPaths.forEach((path, index) => {
              const points = revealPoints[index];
              let d = `M 0 0 V ${points[0]} C`;
              for (let j = 0; j < points.length - 1; j++) {
                const x = ((j + 1) / (points.length - 1)) * 100;
                const controlX = x - 50 / (points.length - 1);
                d += ` ${controlX} ${points[j]} ${controlX} ${points[j + 1]} ${x} ${points[j + 1]}`;
              }
              path.setAttribute("d", `${d} V 0 H 0 Z`);
            });
          };
          gsap.set(story, { autoAlpha: 0 });
          gsap.set(bridge, { autoAlpha: 0 });
          const messageLetters = viewer.querySelectorAll<HTMLElement>(".flyby-letter");
          gsap.set(messageLetters, { autoAlpha: 0, y: 12 });
          gsap.set(".bridge-spaceship", {
            x: () => -window.innerWidth * 0.5 - 240,
            y: 0,
            scale: 1,
            rotation: -3,
            transformOrigin: "50% 50%",
          });
          gsap.set(".services-outro", { autoAlpha: 0 });
          gsap.set(space, { autoAlpha: 0 });
          gsap.set(panels, {
            xPercent: -50,
            yPercent: -50,
            x: (i: number) => (i % 2 ? 1 : -1) * window.innerWidth * 0.14,
            z: (i: number) => -i * 1400,
            autoAlpha: 1,
            zIndex: (i: number) => services.length - i,
            force3D: true,
          });
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: viewer,
              start: "top top",
              end: () =>
                `+=${window.innerHeight * (services.length * 1.7 + 4.8) + (window.innerWidth >= 1024 ? window.innerWidth : window.innerHeight) * 1.65 * storyTransitions}`,
              pin: true,
              scrub: 1.2,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          // Follow rendered animation time, not the scroll target: scrub can
          // still be catching up after a fast scroll or a resize refresh.
          timeline.eventCallback("onUpdate", () => {
            const time = timeline.time();
            introducing = time < introDuration;
            outroStarted = time >= outroStart;
            storyShowing = time >= revealStart;
            window.dispatchEvent(new Event("services-scene-update"));
            renderOutro();
            currentIndex = Math.max(
              0,
              Math.min(services.length - 1, Math.floor(time - introDuration)),
            );
          });
          // Move through a shared perspective space without intercepting wheel or touch.
          timeline
            .fromTo(
              lines,
              { yPercent: 110, rotate: 3 },
              {
                yPercent: 0,
                rotate: 0,
                stagger: 0.16,
                duration: 0.55,
                ease: "power3.out",
              },
              0,
            )
            .fromTo(
              ".intro-kicker, .intro-note",
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 },
              0.15,
            )
            .fromTo(
              intro,
              { scale: 1, autoAlpha: 1 },
              { scale: 0.86, autoAlpha: 0, duration: 0.4, ease: "power2.in" },
              1.1,
            )
            .fromTo(
              space,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.001, immediateRender: false },
              introDuration,
            );
          panels.forEach((panel, i) => {
            // Stop before the 1000px perspective plane to avoid singular scales
            // and inverted image layers. Exit sideways while remaining opaque.
            timeline.fromTo(
              panel,
              {
                z: -i * 1400,
                visibility: "visible",
              },
              {
                z: 820,
                visibility: "visible",
                duration: i + 0.82 / 1.4,
                ease: "none",
                immediateRender: false,
              },
              introDuration,
            );
            timeline.fromTo(
              panel,
              {
                x: () => (i % 2 ? 1 : -1) * window.innerWidth * 0.14,
              },
              {
                x: () => (i % 2 ? 1 : -1) * window.innerWidth * 1.4,
                duration: 0.45,
                ease: "sine.in",
                immediateRender: false,
              },
              introDuration + i + 0.82 / 1.4 - 0.45,
            );
            // The card is now outside the viewport, so hiding cannot flash.
            timeline.set(
              panel,
              { visibility: "hidden" },
              introDuration + i + 0.82 / 1.4,
            );
          });
          // One continuous flyby, fully outside the viewport at both ends.
          timeline.to(
            bridge,
            {
              autoAlpha: 1,
              duration: 0.25,
              ease: "power2.out",
            },
            outroStart - 0.3,
          );
          timeline.to(
            ".bridge-spaceship",
            {
              x: () => window.innerWidth * 0.5 + 240,
              duration: 1.35,
              ease: "none",
            },
            outroStart - 0.3,
          );
          timeline.to(
            ".bridge-spaceship",
            {
              y: -14,
              rotation: 3,
              duration: 0.675,
              repeat: 1,
              yoyo: true,
              ease: "sine.inOut",
            },
            outroStart - 0.3,
          );
          // Independent weaving paths follow the ship instead of fixed horizontal lanes.
          viewer
            .querySelectorAll<HTMLElement>(".flyby-projectile")
            .forEach((bolt, index) => {
              const launch = outroStart - 0.3 + 0.24 + index * 0.075;
              const direction = index % 2 ? 1 : -1;
              const amplitude = () =>
                Math.min(56, window.innerHeight * 0.065) * (0.65 + index * 0.1);
              gsap.set(bolt, {
                autoAlpha: 0,
                x: -window.innerWidth * 0.5 - 240,
                y: 0,
                rotation: 0,
                transformOrigin: "100% 50%",
              });
              timeline.set(bolt, { autoAlpha: 1 }, launch);
              timeline.fromTo(
                bolt,
                {
                  x: () => -window.innerWidth * 0.5 - 240,
                },
                {
                  x: () => window.innerWidth * 0.5 + 240,
                  duration: 1.35,
                  ease: "none",
                  immediateRender: false,
                },
                launch,
              );
              // Four eased arcs make the bolts cross and separate continuously.
              // Function values stay responsive when ScrollTrigger refreshes.
              [1, -0.8, 0.6, 0].forEach((bend, segment) => {
                timeline.to(
                  bolt,
                  {
                    y: () => direction * amplitude() * bend,
                    rotation: direction * [9, -12, 10, -5][segment],
                    duration: 1.35 / 4,
                    ease: "sine.inOut",
                  },
                  launch + segment * (1.35 / 4),
                );
              });
              timeline.set(bolt, { autoAlpha: 0 }, launch + 1.35);
            });
          timeline.to(
            ".spaceship-engine",
            {
              opacity: 0.35,
              duration: 0.15,
              repeat: 7,
              yoyo: true,
              ease: "sine.inOut",
            },
            outroStart - 0.3,
          );
          // Reveal the large message letter by letter in the ship's wake.
          messageLetters.forEach((letter) => {
            const bounds = letter.getBoundingClientRect();
            const crossing = (bounds.left + bounds.width / 2 + 240) / (window.innerWidth + 480);
            timeline.to(letter, {
              autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out",
              delay: Math.max(0, Math.min(1, crossing)) * 1.35 + 0.04,
            }, outroStart - 0.3);
          });
          timeline.to(
            ".viewer-header",
            {
              autoAlpha: 0,
              duration: 0.25,
            },
            outroStart - 0.3,
          );
          timeline.to(
            bridge,
            {
              autoAlpha: 0,
              duration: 0.3,
              ease: "power2.inOut",
            },
            revealStart - 0.3,
          );
          // Go directly from the editorial beat to the curtain lifting off the story.
          // Reveal the full black curtain and swap scenes on the same frame.
          timeline.set(".services-outro", { autoAlpha: 1 }, revealStart);
          timeline.set(story, { autoAlpha: 1 }, revealStart);
          timeline.set(
            ".viewer-header, .space-background, .service-space",
            {
              autoAlpha: 0,
            },
            revealStart,
          );
          revealPoints.forEach((points, pathIndex) => {
            points.forEach((_, pointIndex) => {
              timeline.to(
                points,
                {
                  [pointIndex]: 0,
                  duration: 1.15,
                  ease: "power2.inOut",
                },
                revealStart +
                  (1 - pathIndex) * 0.18 +
                  pointDelays[pointIndex] * 0.65,
              );
            });
          });
          timeline.fromTo(
            storyHeading.querySelectorAll(".story-kicker, .story-statement"),
            { y: 36, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.85,
              stagger: 0.16,
              ease: "sine.out",
            },
            revealStart + 0.8,
          );
          timeline.to(
            storyTrack,
            {
              x: () => -(storyTrack.scrollWidth - story.clientWidth),
              duration: 1.8 * storyTransitions,
              ease: "none",
            },
            storyStart + 0.25,
          );
          timeline.fromTo(
            caption,
            { x: 90, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.65,
              ease: "power2.out",
            },
            storyStart + 0.45 + 1.8 * (storyTransitions - 1),
          );
          timeline.to({}, { duration: 0.35 });
          renderOutro();

        }, viewer);
        return () => {
          context.revert();
          animated = false;
          introducing = true;
          outroStarted = false;
          storyShowing = false;
          currentIndex = 0;
          viewer.querySelectorAll(".services-outro path").forEach((path) => {
            path.setAttribute("d", "M 0 100 H 100 V 100 H 0 Z");
          });
        };
      });
      cleanup = () => media.revert();
      await tick();
      if (disposed) return;
      ScrollTrigger.refresh();
    }
    void setup();
    return () => {
      disposed = true;
      cleanup();
    };
  });
</script>

<div
  class="service-viewer"
  class:animated
  class:introducing
  bind:this={viewer}
  role="region"
  aria-label="Explore our services"
>
  <div class="space-background" aria-hidden="true">
    {#each stars as star}
      <span
        class="star"
        style:left={`${star.x}%`}
        style:top={`${star.y}%`}
        style:width={`${star.size}px`}
        style:height={`${star.size}px`}
        style:opacity={star.opacity}
      ></span>
    {/each}
  </div>
  <div class="viewer-header" inert={outroStarted}>
    <span>Our services</span>
  </div>
  <div class="services-intro" aria-hidden={animated && !introducing}>
    <h2 id="services-title">
      <span class="intro-line"><span>A universe of</span></span>
      <span class="intro-line"><span>possibilities.</span></span>
    </h2>
  </div>
  <div class="service-space">
    {#each services as service, index}
      <article
        class="service-slide"
        aria-hidden={animated &&
          (introducing || outroStarted || index !== currentIndex)}
        inert={animated &&
          (introducing || outroStarted || index !== currentIndex)}
      >
        <img
          class="slide-image"
          src={service.image}
          alt=""
          loading="eager"
          decoding="async"
          width="1600"
          height="1000"
        />
        <div class="slide-shade"></div>
        <div class="slide-copy">
          <h3>{service.title}</h3>
          <p>{service.description}</p>
        </div>
      </article>
    {/each}
  </div>
  <div class="services-bridge" aria-hidden="true">
    <p class="flyby-message">
      {#each Array.from("Keep exploring.") as letter}
        <span class="flyby-letter">{letter === " " ? "\u00a0" : letter}</span>
      {/each}
    </p>
    <div class="flyby-projectiles">
      {#each [-12, 8, -4, 15, -9, 5] as offset}
        <span class="flyby-projectile" style:margin-top={`${offset}px`}></span>
      {/each}
    </div>
    <svg
      class="bridge-spaceship"
      viewBox="0 0 360 180"
      fill="none"
      focusable="false"
    >
      <defs>
        <linearGradient id="services-ufo-metal" x1="0" y1="0" x2="0.15" y2="1">
          <stop stop-color="#eef1f3" />
          <stop offset="0.28" stop-color="#828a91" />
          <stop offset="0.55" stop-color="#24292f" />
          <stop offset="0.72" stop-color="#a9b1b7" />
          <stop offset="1" stop-color="#15191d" />
        </linearGradient>
        <radialGradient id="services-ufo-glass" cx="35%" cy="20%" r="85%">
          <stop stop-color="#bfcdd3" />
          <stop offset="0.3" stop-color="#4e606a" />
          <stop offset="0.75" stop-color="#151d25" />
          <stop offset="1" stop-color="#080c10" />
        </radialGradient>
        <radialGradient id="services-ufo-glow">
          <stop stop-color="#e4f2ff" stop-opacity="0.45" />
          <stop offset="1" stop-color="#b8dcff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        class="spaceship-engine"
        cx="57"
        cy="106"
        rx="40"
        ry="14"
        fill="url(#services-ufo-glow)"
      />
      <ellipse
        cx="180"
        cy="128"
        rx="130"
        ry="35"
        fill="url(#services-ufo-glow)"
      />
      <path
        d="M123 89C126 29 231 28 240 89Z"
        fill="url(#services-ufo-glass)"
        stroke="#8a959c"
        stroke-width="0.7"
      />
      <path
        d="M136 70C148 49 177 45 195 48"
        stroke="#fff"
        stroke-opacity="0.45"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M32 103Q75 83 126 79Q181 69 235 80Q289 85 328 103L308 117Q180 154 52 117Z"
        fill="url(#services-ufo-metal)"
        stroke="#7c858d"
        stroke-width="0.7"
      />
      <ellipse
        cx="180"
        cy="103"
        rx="148"
        ry="19"
        fill="url(#services-ufo-metal)"
      />
      <path
        d="M34 104Q180 135 326 104"
        stroke="#e6edf2"
        stroke-opacity="0.75"
        stroke-width="1.2"
      />
      <path d="M72 119Q180 142 288 119" stroke="#050709" stroke-width="5" />
      <path
        d="M105 125Q180 141 255 125"
        stroke="#b7dcf2"
        stroke-opacity="0.65"
        stroke-width="2"
      />
      <path
        d="M86 88L102 100M133 81L141 98M180 78V97M227 82L219 98M276 90L258 101"
        stroke="#10151a"
        stroke-opacity="0.45"
        stroke-width="0.8"
      />
      <g fill="#e8f4ff">
        <ellipse cx="77" cy="110" rx="3" ry="1.3" />
        <ellipse cx="119" cy="116" rx="3" ry="1.3" />
        <ellipse cx="180" cy="119" rx="3" ry="1.3" />
        <ellipse cx="241" cy="116" rx="3" ry="1.3" />
        <ellipse cx="283" cy="110" rx="3" ry="1.3" />
      </g>
    </svg>
  </div>
  <div
    class="services-story"
    aria-hidden={animated && !storyShowing}
    inert={animated && !storyShowing}
  >
    <ServicesStory integrated />
  </div>
  <svg
    class="services-outro"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <path fill="#0e100f" d="M 0 100 H 100 V 100 H 0 Z" />
    <path fill="#000" d="M 0 100 H 100 V 100 H 0 Z" />
  </svg>
</div>

<style>
  .service-viewer {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background: #000;
    color: #fff;
    padding: 110px 6vw 80px;
  }
  .space-background {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: #000;
  }
  .services-outro {
    display: none;
    position: absolute;
    inset: -1px;
    z-index: 10;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    pointer-events: none;
  }
  .animated .services-outro {
    display: block;
  }
  .animated .services-story {
    position: absolute;
    inset: 0;
    z-index: 6;
  }
  .services-bridge {
    display: none;
    position: absolute;
    inset: 0;
    z-index: 11;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: clamp(22px, 4vh, 44px);
    padding: 40px 24px;
    text-align: center;
  }
  .animated .services-bridge {
    display: flex;
  }
  .bridge-spaceship {
    width: clamp(220px, 26vw, 380px);
    height: auto;
    overflow: visible;
  }
  .flyby-projectiles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .flyby-projectile {
    position: absolute;
    left: 50%;
    top: calc(50% + clamp(9px, 1vw, 15px));
    width: clamp(36px, 5vw, 72px);
    height: 3px;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, #91b6ca 65%, #fff);
    box-shadow: 6px 0 10px #c6e6ff80;
    visibility: hidden;
    opacity: 0;
  }
  .flyby-projectile::after {
    content: "";
    position: absolute;
    right: 0;
    top: -1px;
    width: 8px;
    height: 5px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 8px #d4eeff;
  }
  .services-bridge .flyby-message {
    position: absolute;
    top: calc(50% + clamp(42px, 5vw, 65px));
    left: 0;
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0 24px;
    color: #e5e9ed;
    font-size: clamp(1.65rem, 7.2vw, 8rem);
    font-weight: 450;
    letter-spacing: -0.055em;
    line-height: 1.1;
    text-align: center;
    white-space: nowrap;
  }
  .flyby-letter {
    display: inline-block;
    visibility: hidden;
    opacity: 0;
  }
  .services-intro {
    position: relative;
    text-align: center;
    padding: 60px 0 100px;
  }
  .intro-kicker {
    margin: 0 auto 30px;
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    color: #aaa;
  }
  h2 {
    margin: 0;
    font-size: clamp(2.5rem, 7vw, 7.5rem);
    font-weight: 450;
    line-height: 1.08;
    letter-spacing: -0.065em;
  }
  .intro-line {
    display: block;
    overflow: hidden;
    padding: 0.04em 0;
  }
  .intro-line > span {
    display: block;
    transform-origin: left center;
  }
  .intro-accent {
    color: #8f8f8f;
  }
  .intro-note {
    margin: 30px auto 0;
    color: #999;
    font-size: clamp(0.75rem, 1.1vw, 1rem);
    line-height: 1.8;
  }
  .animated .services-intro {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 90px 6vw;
    pointer-events: none;
  }
  .star {
    position: absolute;
    border-radius: 50%;
    background: white;
    box-shadow: 0 0 7px 1px #ffffff70;
  }
  .viewer-header {
    position: absolute;
    z-index: 5;
    left: 5%;
    right: 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    font-size: 0.65rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .viewer-header {
    top: max(36px, env(safe-area-inset-top));
  }
  .viewer-header a {
    color: inherit;
    text-decoration: none;
  }
  .viewer-header a:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }
  .service-space {
    display: grid;
    gap: 40px;
  }
  .service-slide {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    width: min(100%, 900px);
    min-height: 400px;
    margin: 0 auto;
    border: 1px solid #ffffff80;
    border-radius: 4px;
    background: #000;
    box-shadow: 0 22px 70px #000;
    backface-visibility: hidden;
  }
  .slide-image,
  .slide-shade {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .slide-image {
    object-fit: cover;
    object-position: center;
    backface-visibility: hidden;
  }
  .slide-shade {
    background: linear-gradient(180deg, #0001, #0008 40%, #000e);
  }
  .slide-copy {
    position: relative;
    padding: clamp(24px, 3.5vw, 50px);
    padding-top: clamp(90px, 12vh, 160px);
  }
  h3 {
    margin: 16px 0;
    max-width: 15ch;
    font-size: clamp(2rem, 4.1vw, 4.7rem);
    font-weight: 450;
    line-height: 1.02;
    letter-spacing: -0.055em;
  }
  p {
    max-width: 47ch;
    margin: 0;
    font-size: clamp(0.85rem, 1vw, 1.05rem);
    line-height: 1.5;
    color: #ffffffe0;
  }
  .animated {
    height: 100svh;
    height: 100dvh;
    padding: 0;
  }
  .animated .service-space {
    position: absolute;
    inset: 0;
    display: block;
    perspective: 1000px;
    perspective-origin: 50% 50%;
  }
  /* Keep scene phases exclusive, including while GSAP refreshes inline styles. */
  .animated.introducing .service-space {
    visibility: hidden !important;
  }
  .animated.introducing .service-slide {
    visibility: hidden !important;
  }
  .animated:not(.introducing) .services-intro {
    visibility: hidden !important;
  }
  .animated .service-slide {
    position: absolute;
    left: 50%;
    top: 50%;
    width: min(62vw, 900px);
    height: min(68svh, 640px);
    min-height: 0;
    margin: 0;
    will-change: transform;
  }
  a:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 5px;
  }
  @media (max-width: 640px) {
    .viewer-header {
      font-size: 0.55rem;
      letter-spacing: 0.08em;
    }
    .animated .service-slide {
      width: 85vw;
    }
    .slide-copy {
      padding: 85px 22px 24px;
    }
    h3 {
      font-size: clamp(2rem, 8vw, 3rem);
    }
    p {
      font-size: 0.8rem;
    }
  }
  @media (max-height: 550px) and (prefers-reduced-motion: no-preference) {
    .animated .service-slide {
      width: min(64vw, 680px);
    }
    .slide-copy {
      padding: 30px 24px 20px;
    }
    h3 {
      font-size: 2rem;
      margin: 10px 0;
    }
  }
</style>

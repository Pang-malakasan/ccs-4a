<script lang="ts">
  import { onMount } from "svelte";

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
  let reducedMotion = $state(false);
  let scrollToSlide: (index: number) => void = () => {};

  onMount(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = motion.matches;
    let disposed = false;
    let cleanup = () => {};

    async function setup() {
      if (motion.matches) return;
      const [
        { gsap },
        { ScrollTrigger },
        { SplitText },
        { ScrollSmoother },
        { Observer },
      ] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
        import("gsap/ScrollSmoother"),
        import("gsap/Observer"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger, SplitText, Observer);

      const panels = Array.from(
        viewer.querySelectorAll<HTMLElement>(".service-slide"),
      );
      const outer = panels.map(
        (panel) => panel.querySelector<HTMLElement>(".outer")!,
      );
      const inner = panels.map(
        (panel) => panel.querySelector<HTMLElement>(".inner")!,
      );
      const backgrounds = panels.map(
        (panel) => panel.querySelector<HTMLElement>(".slide-bg")!,
      );
      const splits = panels.map(
        (panel) =>
          new SplitText(panel.querySelector<HTMLElement>(".slide-title")!, {
            type: "chars,words,lines",
            linesClass: "clip-text",
          }),
      );

      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1, zIndex: 1 });
      gsap.set(outer, { yPercent: 100 });
      gsap.set(inner, { yPercent: -100 });
      gsap.set([outer[0], inner[0]], { yPercent: 0 });

      let navigating = false;
      let navigationTimer: ReturnType<typeof setTimeout> | undefined;
      const observer = Observer.create({
        type: "wheel,touch",
        wheelSpeed: -1,
        tolerance: 12,
        preventDefault: true,
        ignoreCheck: (event) =>
          event.target instanceof Element &&
          !!event.target.closest("a, button"),
        onUp: () => move(1),
        onDown: () => move(-1),
      });
      observer.disable();

      function move(direction: number) {
        if (navigating) return;
        const next = currentIndex + direction;
        if (next < 0 || next >= services.length) {
          scrollToSlide(next);
          return;
        }
        navigating = true;
        currentIndex = next;
        scrollToSlide(next);
        clearTimeout(navigationTimer);
        navigationTimer = setTimeout(() => {
          navigating = false;
        }, 1050);
      }

      // Pin the actual full-screen viewer. An animation-only scroll track can
      // scroll away inside ScrollSmoother even while its timeline keeps running.
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: viewer,
          start: "top top",
          end: () => `+=${window.innerHeight * services.length * 1.2}`,
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 0,
          onEnter: (self) => {
            currentIndex = 0;
            observer.enable();
            // A single large wheel gesture must not carry the page into later slides.
            const smoother = ScrollSmoother.get();
            if (smoother) smoother.scrollTo(self.start + 2, false);
            else window.scrollTo(0, self.start + 2);
          },
          onEnterBack: (self) => {
            currentIndex = services.length - 1;
            observer.enable();
            const smoother = ScrollSmoother.get();
            if (smoother) smoother.scrollTo(self.end - 2, false);
            else window.scrollTo(0, self.end - 2);
          },
          onLeave: () => observer.disable(),
          onLeaveBack: () => observer.disable(),
          onUpdate: (self) => {
            if (navigating) return;
            const positions = [
              0,
              ...Array.from(
                { length: services.length - 1 },
                (_, i) =>
                  (timeline.labels[`slide-${i + 1}`] ?? 0) /
                  timeline.duration(),
              ),
            ];
            currentIndex = positions.reduce(
              (closest, position, index) =>
                Math.abs(self.progress - position) <
                Math.abs(self.progress - positions[closest])
                  ? index
                  : closest,
              0,
            );
          },
        },
      });

      timeline.to({}, { duration: 0.5 });

      panels.slice(1).forEach((panel, offset) => {
        const index = offset + 1;
        const previous = panels[index - 1];
        timeline
          .set(panel, { autoAlpha: 1, zIndex: index + 1 })
          .fromTo(
            [outer[index], inner[index]],
            { yPercent: (i: number) => (i ? -100 : 100) },
            { yPercent: 0, duration: 0.85, ease: "power1.inOut" },
            "<",
          )
          .fromTo(
            backgrounds[index],
            { yPercent: 15 },
            { yPercent: 0, duration: 0.85, ease: "power1.inOut" },
            "<",
          )
          .to(
            backgrounds[index - 1],
            { yPercent: -15, duration: 0.85, ease: "power1.inOut" },
            "<",
          )
          .fromTo(
            splits[index].chars,
            { autoAlpha: 0, yPercent: 150 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.7,
              ease: "power2.out",
              stagger: { each: 0.008, from: "random" },
            },
            "<0.15",
          )
          .set(previous, { autoAlpha: 0 })
          .addLabel(`slide-${index}`)
          .to({}, { duration: 0.5 });
      });

      scrollToSlide = (index) => {
        const trigger = timeline.scrollTrigger;
        if (!trigger) return;
        if (index < 0 || index >= services.length) observer.disable();
        else currentIndex = index;
        const progress =
          index <= 0
            ? 0
            : index >= services.length
              ? 1
              : (timeline.labels[`slide-${index}`] ?? 0) / timeline.duration();
        const destination =
          trigger.start +
          (trigger.end - trigger.start) * progress +
          (index < 0 ? -2 : 2);
        const smoother = ScrollSmoother.get();
        if (smoother) smoother.scrollTo(destination, true);
        else window.scrollTo({ top: destination, behavior: "smooth" });
      };

      cleanup = () => {
        clearTimeout(navigationTimer);
        observer.kill();
        timeline.scrollTrigger?.kill();
        timeline.kill();
        splits.forEach((split) => split.revert());
        gsap.set([...panels, ...outer, ...inner, ...backgrounds], {
          clearProps: "all",
        });
        scrollToSlide = () => {};
      };
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
  bind:this={viewer}
  role="region"
  aria-label="Explore our services"
>
  <div class="viewer-header">
    <span>What we do</span>
    <a href="#work">Skip to end ↗</a>
  </div>

  {#each services as service, index}
    <article
      class="service-slide"
      class:first={index === 0}
      aria-hidden={!reducedMotion && index !== currentIndex}
      inert={!reducedMotion && index !== currentIndex}
    >
      <div class="outer">
        <div class="inner">
          <div
            class="slide-bg"
            style:background-image={`linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.22) 45%, rgba(0,0,0,.78)), url("${service.image}")`}
          >
            <div class="slide-copy">
              <h3 class="slide-title">{service.title}</h3>
              <p class="description">{service.description}</p>
              <ul aria-label={`${service.title} offerings`}>
                {#each service.offerings as offering}<li>
                    {offering}
                  </li>{/each}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  {/each}
  <div class="viewer-navigation">
    <span aria-live="polite"
      >{String(currentIndex + 1).padStart(2, "0")} / {String(
        services.length,
      ).padStart(2, "0")}</span
    >
  </div>
</div>

<style>
  .service-viewer {
    position: relative;
    width: 100%;
    height: 100svh;
    height: 100dvh;
    min-height: 0;
    overflow: hidden;
    background: #111;
    color: white;
  }
  .service-slide {
    position: absolute;
    inset: 0;
    visibility: hidden;
  }
  .service-slide.first {
    visibility: visible;
  }
  .outer,
  .inner {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .slide-bg {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #262238;
    background-size: cover;
    background-position: center;
  }
  .slide-copy {
    width: min(90%, 1200px);
    text-align: center;
    padding: 95px 0 85px;
  }
  .viewer-header {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .viewer-navigation {
    position: absolute;
    z-index: 5;
    bottom: max(24px, env(safe-area-inset-bottom));
    left: 5%;
    right: 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.16em;
  }
  .viewer-buttons {
    display: flex;
    gap: 12px;
  }
  .viewer-buttons button {
    width: 42px;
    height: 42px;
    border: 1px solid white;
    border-radius: 50%;
    background: #0006;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
  }
  .viewer-buttons button:focus-visible {
    outline: 2px solid white;
    outline-offset: 3px;
  }
  .slide-title {
    margin: 22px auto 18px;
    max-width: 1100px;
    font-size: clamp(3.3rem, 7.5vw, 9rem);
    font-weight: 500;
    line-height: 1.04;
    letter-spacing: -0.065em;
  }
  .slide-title :global(.clip-text) {
    overflow: hidden;
  }
  .description {
    margin: 0 auto;
    max-width: 46ch;
    font-size: clamp(1rem, 1.5vw, 1.35rem);
    line-height: 1.5;
    letter-spacing: normal;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 9px;
    max-width: 900px;
    margin: 32px auto 0;
    padding: 0;
    list-style: none;
  }
  li {
    padding: 9px 14px;
    border: 1px solid #ffffff8c;
    border-radius: 100px;
    font-size: 0.75rem;
    letter-spacing: 0.03em;
    background: #0004;
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
  }
  .viewer-header {
    top: 36px;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }
  @media (max-width: 640px) {
    .slide-copy {
      max-height: calc(100dvh - 155px - env(safe-area-inset-bottom));
      overflow: hidden;
      padding: 0 0 12px;
    }
    .slide-copy {
      width: 88%;
    }
    .slide-title {
      font-size: clamp(2.25rem, 10vw, 4.6rem);
    }
    .description {
      font-size: 1rem;
    }
    ul {
      margin-top: 24px;
      gap: 6px;
    }
    li {
      padding: 6px 9px;
      font-size: 0.65rem;
    }
    .viewer-header {
      top: max(24px, env(safe-area-inset-top));
    }
    .viewer-header {
      font-size: 0.6rem;
      letter-spacing: 0.07em;
    }
  }
  @media (max-width: 640px) and (max-height: 650px) {
    .slide-title {
      font-size: clamp(2rem, 8.5vw, 3.5rem);
      margin: 12px auto;
    }
    .description {
      font-size: 0.88rem;
      line-height: 1.35;
    }
    ul {
      margin-top: 16px;
      gap: 5px;
    }
    li {
      padding: 5px 7px;
      font-size: 0.6rem;
    }
    .viewer-navigation {
      bottom: max(12px, env(safe-area-inset-bottom));
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .service-viewer {
      height: auto;
      min-height: 0;
      touch-action: auto;
    }
    .service-slide,
    .service-slide.first {
      position: relative;
      height: 80svh;
      min-height: 500px;
      visibility: visible;
    }
    .viewer-header {
      display: none;
    }
    .viewer-navigation {
      display: none;
    }
  }
</style>

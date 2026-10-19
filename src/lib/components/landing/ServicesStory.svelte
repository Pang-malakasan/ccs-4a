<script lang="ts">
  import { onMount } from "svelte";
  import { adaptiveVideo } from '#lib/performance.js';
  let { integrated = false }: { integrated?: boolean } = $props();

  let story: HTMLDivElement;
  let storyTrack: HTMLDivElement;

  onMount(() => {
    if (document.documentElement.dataset.quality !== 'high') return;
    // The card viewer owns the shared pin and timeline in integrated mode.
    if (integrated) return;
    let disposed = false;
    let revert = () => {};

    async function setup() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const caption = story.querySelector<HTMLElement>(".story-caption");
        if (!caption) return;

        const context = gsap.context(() => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: story,
              start: "top top",
              end: () =>
                `+=${(window.innerWidth >= 1024 ? window.innerWidth : window.innerHeight) * 1.65 * (storyTrack.children.length - 1)}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              // The service-card pin comes before this story in document order.
              refreshPriority: -1,
            },
          });

          timeline
            .to({}, { duration: 0.5 })
            .to(storyTrack, {
              x: () => -(storyTrack.scrollWidth - story.clientWidth),
              duration: 1.3 * (storyTrack.children.length - 1),
              ease: "none",
            })
            .fromTo(
              caption,
              { x: 90, autoAlpha: 0 },
              {
                x: 0,
                autoAlpha: 1,
                duration: 0.5,
                ease: "power2.out",
              },
              0.5 + 1.3 + 0.15,
            )
            .to({}, { duration: 0.4 });
        }, story);

        return () => context.revert();
      });
      revert = () => media.revert();
      ScrollTrigger.refresh();
    }

    void setup();
    return () => {
      disposed = true;
      revert();
    };
  });
</script>

<div
  class="story"
  class:integrated
  bind:this={story}
  role="region"
  aria-label="Creative solutions in motion"
>
  <div class="story-track" bind:this={storyTrack}>
    <div class="story-panel story-panel-intro">
      <video
        class="story-flowers"
        use:adaptiveVideo={"https://ik.imagekit.io/flzo1bmh5/tr:orig-true/bougainvillea-flowers_03.webm"} poster="/services/flowers-03.webp"
        autoplay
        muted
        loop
        playsinline
        preload="none"
        aria-hidden="true"
      ></video>
      <div class="story-heading">
        <p class="story-kicker">The possibilities</p>
        <p class="story-statement">
          Ideas take shape<br />when we move <em>together.</em>
        </p>
      </div>
      <div class="story-intro-film">
        <video
          use:adaptiveVideo={"https://ik.imagekit.io/flzo1bmh5/tr:orig-true/bougainvillea-flowers_02.webm"} poster="/services/flowers-02.webp"
          autoplay
          muted
          loop
          playsinline
          preload="none"
          aria-hidden="true"
        ></video>
      </div>
    </div>
    <div class="story-panel story-panel-image">
      <div class="story-sypher-photo">
        <img
          class="story-sypher-image"
          src="/services/sypher.jpg"
          alt="Sypher Creative Solutions visual"
          width="1792"
          height="2400"
          decoding="async"
        />
      </div>
      <h2 class="story-sypher-title">Sypher</h2>
      <div class="story-sypher-copy">
        <h3>Where ideas find<br />their own perspective.</h3>
        <p>
          Strategy, design, and technology come together to shape thoughtful
          brands and digital experiences. At Sypher, we bring a fresh
          perspective to every idea—and make room for what comes next.
        </p>
      </div>
    </div>
    <div class="story-panel story-panel-film">
      <video
        class="story-film-flowers"
        use:adaptiveVideo={"https://ik.imagekit.io/flzo1bmh5/tr:orig-true/bougainvillea-flowers_03.webm"} poster="/services/flowers-03.webp"
        autoplay
        muted
        loop
        playsinline
        preload="none"
        aria-hidden="true"
      ></video>
      <div class="story-caption">
        <h2>We always make <br />room for what’s<br /><em>next.</em></h2>
      </div>
    </div>
  </div>
</div>

<style>
  .story {
    position: relative;
    width: 100%;
    height: 100svh;
    min-height: 700px;
    overflow: hidden;
    background: #fff;
    color: #111;
  }
  .story-track {
    display: flex;
    width: 265%;
    height: 100%;
  }
  .story-panel {
    position: relative;
    flex: 0 0 calc(100% / 2.65);
    width: calc(100% / 2.65);
    height: 100%;
    overflow: hidden;
  }
  .story-panel-image {
    flex-basis: calc(65% / 2.65);
    width: calc(65% / 2.65);
  }
  .story-panel-image {
    isolation: isolate;
    background: #fff;
    color: #142039;
  }
  .story-sypher-photo {
    position: absolute;
    left: 14%;
    top: 50%;
    transform: translateY(-50%);
    width: min(43%, 46svh);
    aspect-ratio: 1792 / 2400;
    background: #111;
  }
  .story-sypher-photo::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgb(0 0 0 / 38%), rgb(0 0 0 / 12%) 75%);
    pointer-events: none;
  }
  .story-sypher-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .story-sypher-title {
    position: absolute;
    z-index: 1;
    left: 5%;
    top: 34%;
    margin: 0;
    color: #fff;
    font-family: inherit;
    font-size: clamp(4rem, 11vw, 12rem);
    font-weight: 450;
    line-height: 1;
    letter-spacing: -0.075em;
    text-shadow:
      0 3px 16px rgb(0 0 0 / 45%),
      0 1px 3px rgb(0 0 0 / 30%);
  }
  .story-sypher-copy {
    position: absolute;
    z-index: 2;
    left: min(60%, calc(14% + 46svh + 24px));
    bottom: 16%;
    width: 36%;
    max-width: 400px;
  }
  .story-sypher-copy h3 {
    margin: 0 0 18px;
    font-family: inherit;
    font-size: clamp(1.4rem, 2.5vw, 2.8rem);
    font-weight: 450;
    line-height: 1.08;
    letter-spacing: -0.055em;
  }
  .story-sypher-copy p {
    margin: 0;
    font-size: clamp(0.8rem, 1vw, 1rem);
    line-height: 1.6;
    color: #142039b3;
  }
  .story-panel-intro {
    display: flex;
    align-items: center;
    padding: 100px 6vw;
  }
  .story-flowers {
    position: absolute;
    top: 0;
    left: 0;
    width: min(42vw, 650px);
    height: 62%;
    object-fit: cover;
    object-position: top right;
    mix-blend-mode: multiply;
    pointer-events: none;
  }
  .story-heading {
    position: relative;
    z-index: 1;
    width: min(72%, 1100px);
    margin: 9svh 0 0 20%;
  }
  .story-kicker {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    margin: 0 0 30px;
  }
  .story-statement {
    margin: 0;
    font-size: clamp(3.5rem, 6.6vw, 7.5rem);
    font-weight: 450;
    line-height: 1.04;
    letter-spacing: -0.07em;
  }
  em {
    font-family: Georgia, serif;
    font-weight: 400;
  }
  .story-panel-film {
    display: flex;
    justify-content: center;
    background: #fff;
  }
  .story-film-flowers {
    position: absolute;
    top: 0;
    right: 0;
    width: min(42vw, 650px);
    height: 62%;
    object-fit: cover;
    object-position: top right;
    mix-blend-mode: multiply;
    pointer-events: none;
    transform: scaleX(-1);
  }
  .story-intro-film {
    position: absolute;
    right: -5vw;
    bottom: 0;
    width: min(75vw, 800px);
    height: 65%;
    transform: rotate(90deg) scaleY(-1);
    pointer-events: none;
    z-index: 0;
  }
  .story-intro-film video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: bottom right;
    filter: brightness(1.17) contrast(1.08);
    mix-blend-mode: multiply;
    -webkit-mask-image: radial-gradient(
      ellipse 78% 76% at center,
      #000 58%,
      transparent 100%
    );
    mask-image: radial-gradient(
      ellipse 78% 76% at center,
      #000 58%,
      transparent 100%
    );
  }
  .story-caption {
    position: relative;
    z-index: 1;
    align-self: flex-start;
    width: min(90%, 1150px);
    margin-top: clamp(140px, 28vh, 280px);
    text-align: center;
  }
  .story-caption h2 {
    margin-top: 26px;
    font-size: clamp(3.5rem, 6.6vw, 7.5rem);
    font-weight: 450;
    line-height: 1.04;
    letter-spacing: -0.07em;
  }
  @media (max-width: 1023px) and (prefers-reduced-motion: no-preference) {
    .story {
      height: 100svh;
      min-height: 0;
    }
    .story-panel {
      height: 100%;
    }
  }
  @media (max-width: 1023px) {
    .story-flowers,
    .story-film-flowers {
      width: 55%;
      height: 50%;
    }
    .story-intro-film {
      width: 55%;
      height: 34%;
      right: 0;
      bottom: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .story {
      display: grid;
      height: auto;
      min-height: 0;
      overflow: visible;
    }
    .story-track {
      display: contents;
    }
    .story-panel {
      grid-column: 1;
      min-height: 75svh;
      width: 100%;
    }
    .story-panel-intro {
      overflow: visible;
      grid-row: 1;
    }
    .story-panel-film {
      grid-row: 3;
      min-height: 80svh;
    }
    .story-panel-image {
      grid-row: 2;
      height: 100svh;
    }
  }
  @media (max-width: 639px) {
    .story-sypher-photo {
      left: 20%;
      top: 10%;
      transform: none;
      width: min(66%, 34svh);
    }
    .story-sypher-title {
      left: 6%;
      top: 28%;
      font-size: clamp(3.5rem, 20vw, 7rem);
    }
    .story-sypher-copy {
      left: auto;
      right: 7%;
      bottom: 10%;
      width: 84%;
      max-width: 360px;
    }
    .story-sypher-copy h3 {
      font-size: clamp(1.5rem, 6vw, 2.2rem);
      margin-bottom: 12px;
    }
    .story-sypher-copy p {
      font-size: 0.8rem;
      line-height: 1.5;
    }
    .story-panel-intro {
      min-height: 80svh;
      padding: 130px 20px 80px;
    }
    .story-flowers {
      width: 75%;
      height: 38%;
    }
    .story-heading {
      width: 90%;
      margin: 7svh 0 0 10%;
    }
    .story-statement {
      font-size: clamp(3rem, 12vw, 5rem);
    }
    .story-panel-film {
      min-height: 85svh;
      padding: 0 20px;
    }
    .story-film-flowers {
      width: 75%;
      height: 38%;
    }
    .story-intro-film {
      width: 65%;
      height: 30%;
      right: 0;
      bottom: 0;
    }
    .story-caption {
      width: 100%;
      margin-top: 46svh;
    }
    .story-caption h2 {
      margin-top: 18px;
      font-size: clamp(2.7rem, 10vw, 5rem);
    }
  }
  @media (max-width: 639px) and (max-height: 650px) {
    .story-caption {
      margin-top: 38svh;
    }
  }
  @media (prefers-reduced-motion: no-preference) {
    .story.integrated {
      height: 100%;
      min-height: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .story-panel-image {
      width: 100%;
    }
  }
  @media (min-width: 640px) and (prefers-reduced-motion: no-preference) {
    .story-track {
      width: 235%;
    }
    .story-panel {
      flex-basis: calc(100% / 2.35);
      width: calc(100% / 2.35);
    }
    .story-panel-image {
      flex-basis: calc(65% / 2.35);
      width: calc(65% / 2.35);
    }
    .story-panel-film {
      flex-basis: calc(70% / 2.35);
      width: calc(70% / 2.35);
      justify-content: flex-start;
    }
    .story-caption {
      position: absolute;
      left: 24px;
      bottom: 8%;
      width: calc(100% - 48px);
      margin: 0;
      text-align: left;
    }
    .story-caption h2 {
      margin: 0;
      font-size: min(clamp(2.5rem, 5.6vw, 6.75rem), 11svh);
      line-height: 1.04;
    }
    .story-film-flowers {
      top: 0;
      right: 0;
      width: 54%;
      height: 62%;
      object-fit: cover;
      object-position: top right;
    }
  }
  @media (max-width: 639px) and (prefers-reduced-motion: no-preference) {
    .story-track {
      width: 280%;
    }
    .story-panel {
      flex-basis: calc(100% / 2.8);
      width: calc(100% / 2.8);
    }
    .story-panel-image {
      flex-basis: calc(80% / 2.8);
      width: calc(80% / 2.8);
    }
  }
</style>

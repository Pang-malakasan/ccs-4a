<script lang="ts">
  import { onMount } from "svelte";
  import ServiceSlides from "./ServiceSlides.svelte";
  let story: HTMLDivElement;
  let storyTrack: HTMLDivElement;

  const services = [
    {
      number: "01",
      title: "Web Design & Development",
      description:
        "Digital experiences built to make a lasting first impression and turn visitors into customers.",
      offerings: [
        "Corporate websites",
        "eCommerce",
        "UI/UX design",
        "Landing pages",
        "Maintenance & hosting",
      ],
      theme: "web",
      image:
        "https://res.cloudinary.com/lremvhvs/image/upload/v1791996544/developers.jpg",
    },
    {
      number: "02",
      title: "Digital Marketing",
      description:
        "Get found, build momentum, and make every interaction count.",
      offerings: [
        "SEO",
        "PPC advertising",
        "Social media",
        "Content & copywriting",
        "Email marketing",
      ],
      theme: "marketing",
      image:
        "https://res.cloudinary.com/lremvhvs/image/upload/v1791996544/marketing.jpg",
    },
    {
      number: "03",
      title: "Branding & Strategy",
      description:
        "A distinctive point of view that stays with people across every touchpoint.",
      offerings: ["Brand identity", "Strategy & positioning", "Rebranding"],
      theme: "branding",
      image:
        "https://res.cloudinary.com/lremvhvs/image/upload/v1791996542/branding.jpg",
    },
    {
      number: "04",
      title: "Multimedia & Creative",
      description: "Visual stories that are impossible to scroll past.",
      offerings: [
        "Video production",
        "Photography",
        "Motion graphics & animation",
      ],
      theme: "creative",
      image:
        "https://res.cloudinary.com/lremvhvs/image/upload/v1791996543/multimedia.jpg",
    },
  ];

  onMount(() => {
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

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: story,
            start: "top top",
            end: () =>
              `+=${window.innerWidth >= 1024 ? window.innerWidth * 1.65 : window.innerHeight * 1.65}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
        });

        timeline
          .to({}, { duration: 0.5 })
          .to(storyTrack, {
            x: () => -(storyTrack.scrollWidth - story.clientWidth),
            duration: 1.3,
            ease: "none",
          })

          .fromTo(
            caption,
            { x: 90, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" },
            "<0.15",
          )
          .to({}, { duration: 0.4 });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          gsap.set([storyTrack, caption], { clearProps: "all" });
        };
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

<section
  id="services"
  aria-labelledby="services-title"
  class="services-section scroll-mt-8"
>
  <div
    class="story"
    bind:this={story}
    aria-label="Creative solutions in motion"
  >
    <div class="story-track" bind:this={storyTrack}>
      <div class="story-panel story-panel-intro">
        <video
          class="story-flowers"
          src="https://ik.imagekit.io/flzo1bmh5/tr:orig-true/bougainvillea-flowers_03.webm"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
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
            src="https://ik.imagekit.io/flzo1bmh5/tr:orig-true/bougainvillea-flowers_02.webm"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            aria-hidden="true"
          ></video>
        </div>
      </div>
      <div class="story-panel story-panel-film">
        <video
          class="story-film-flowers"
          src="https://ik.imagekit.io/flzo1bmh5/tr:orig-true/bougainvillea-flowers_03.webm"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          aria-hidden="true"
        ></video>
        <div class="story-caption">
          <h2 id="services-title">
            We always make <br />
            room for what’s<br />
            <em>next.</em>
          </h2>
        </div>
      </div>
    </div>
  </div>
  <ServiceSlides {services} />
</section>

<style>
  .services-section {
    background: #111;
    color: #111;
  }

  .story {
    position: relative;
    width: 100%;
    height: 100svh;
    min-height: 700px;
    overflow: hidden;
    background: #ffffff;
    color: #19253a;
  }
  .story-track {
    display: flex;
    width: 200%;
    height: 100%;
  }
  .story-panel {
    position: relative;
    flex: 0 0 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    overflow: hidden;
  }
  .story-flowers {
    position: absolute;
    top: 0;
    left: 0;
    width: min(42vw, 650px);
    height: 62%;
    object-fit: cover;
    object-position: top left;
    mix-blend-mode: multiply;
  }
  .story-heading {
    position: relative;
    z-index: 1;
    width: min(80%, 1050px);
    margin: 6vh 0 0 12%;
    text-align: center;
  }
  .story-kicker {
    font-size: 0.72rem;
    font-weight: 650;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }
  .story-statement {
    margin-top: 24px;
    font-size: clamp(3.5rem, 7.5vw, 8.5rem);
    font-weight: 400;
    line-height: 0.98;
    letter-spacing: -0.075em;
  }
  .story-statement em {
    font-family: Georgia, serif;
    font-weight: 400;
  }
  .story-panel-film {
    isolation: isolate;
    background: #ffff;
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
    /* The source has a solid backdrop: feather its rectangular frame after rotation. */
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
      overflow: hidden;
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
    }
    .story-panel-intro {
      overflow: visible;
      grid-row: 1;
    }
    .story-panel-film {
      grid-row: 2;
      min-height: 80svh;
    }
  }
  @media (max-width: 639px) {
    .story-panel-intro {
      min-height: 80svh;
      padding: 130px 20px 80px;
    }
    .story-flowers {
      width: 75%;
      height: 38%;
    }
    .story-heading {
      width: 100%;
      margin: 0;
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
</style>

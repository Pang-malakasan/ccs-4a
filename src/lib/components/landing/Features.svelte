<script lang="ts">
  import { onMount } from "svelte";

  let gallery: HTMLDivElement;
  let galleryWrap: HTMLDivElement;

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
      image: "/services/developers.jpg",
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
      image: "/services/marketing.jpg",
    },
    {
      number: "03",
      title: "Branding & Strategy",
      description:
        "A distinctive point of view that stays with people across every touchpoint.",
      offerings: ["Brand identity", "Strategy & positioning", "Rebranding"],
      theme: "branding",
      image: "/services/branding.jpg",
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
      image: "/services/multimedia.jpg",
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
      media.add(
        "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
        () => {
          const items = Array.from(
            gallery.querySelectorAll<HTMLElement>(".service-card"),
          );
          const overlays = items.map((item) => {
            const overlay = item.cloneNode(true) as HTMLElement;
            overlay.classList.add("service-overlay");
            overlay.setAttribute("aria-hidden", "true");
            galleryWrap.appendChild(overlay);
            return overlay;
          });

          let timeline: ReturnType<typeof gsap.timeline> | undefined;
          let resizeTimer: ReturnType<typeof setTimeout>;
          let viewportSize = `${window.innerWidth}:${window.innerHeight}`;

          function clearAnimation() {
            timeline?.scrollTrigger?.kill();
            timeline?.kill();
            gsap.set(overlays, { clearProps: "all" });
            overlays.forEach((overlay) => {
              const copy = overlay.querySelector<HTMLElement>(".card-content");
              if (copy) gsap.set(copy, { clearProps: "all" });
              const details =
                overlay.querySelector<HTMLElement>(".card-details");
              if (details) gsap.set(details, { clearProps: "all" });
            });
          }

          function createAnimation() {
            clearAnimation();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const positions = items.map((item) => ({
              x: gallery.offsetLeft + item.offsetLeft,
              y: gallery.offsetTop + item.offsetTop,
              scaleX: item.offsetWidth / viewportWidth,
              scaleY: item.offsetHeight / viewportHeight,
            }));

            overlays.forEach((overlay, index) => {
              gsap.set(overlay, {
                left: 0,
                top: 0,
                width: viewportWidth,
                height: viewportHeight,
                transformOrigin: "top left",
                force3D: true,
                ...positions[index],
                autoAlpha: 0,
              });
              const copy = overlay.querySelector<HTMLElement>(".card-content");
              if (copy) gsap.set(copy, { autoAlpha: 0 });
              const details =
                overlay.querySelector<HTMLElement>(".card-details");
              if (details) gsap.set(details, { autoAlpha: 0, y: 24 });
            });

            // Single scrubbed timeline — scrub: 1.5 gives a smooth, inertia-like
            // feel so the animation "plays itself" after a scroll gesture instead
            // of feeling tied frame-by-frame to the scroll position.
            timeline = gsap.timeline({
              scrollTrigger: {
                trigger: galleryWrap,
                start: "top top",
                end: () => `+=${window.innerHeight * items.length * 1.2}`,
                pin: true,
                scrub: 1.5,
                anticipatePin: 1,
              },
            });

            items.forEach((_item, index) => {
              const overlay = overlays[index];
              const copy = overlay.querySelector<HTMLElement>(".card-content");
              const details =
                overlay.querySelector<HTMLElement>(".card-details");

              timeline!
                // Expand from bento position to fullscreen
                .to(overlay, { autoAlpha: 1, duration: 0.06 })
                .to(
                  overlay,
                  {
                    x: 0,
                    y: 0,
                    scaleX: 1,
                    scaleY: 1,
                    borderRadius: 0,
                    duration: 0.8,
                    ease: "power3.out",
                  },
                  "<",
                )
                // Reveal content
                .to(copy, { autoAlpha: 1, duration: 0.25 }, "-=0.3")
                .to(
                  details,
                  { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
                  "-=0.1",
                )
                // Hold fully open so the user can read
                .to({}, { duration: 0.45 })
                // Collapse back
                .to(details, {
                  autoAlpha: 0,
                  y: -16,
                  duration: 0.2,
                  ease: "power2.in",
                })
                .to(copy, { autoAlpha: 0, duration: 0.18 }, "<0.05")
                .to(overlay, {
                  ...positions[index],
                  borderRadius: 20,
                  duration: 0.7,
                  ease: "power3.inOut",
                })
                .to(overlay, { autoAlpha: 0, duration: 0.06 }, "<0.6");
            });
          }

          function onResize() {
            const nextSize = `${window.innerWidth}:${window.innerHeight}`;
            if (nextSize === viewportSize) return;
            viewportSize = nextSize;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
              createAnimation();
              ScrollTrigger.refresh();
            }, 200);
          }

          createAnimation();
          window.addEventListener("resize", onResize);
          return () => {
            window.removeEventListener("resize", onResize);
            clearTimeout(resizeTimer);
            clearAnimation();
            overlays.forEach((overlay) => overlay.remove());
          };
        },
      );
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
  <div class="services-intro">
    <div class="intro-inner">
      <p class="intro-kicker">What we build</p>
      <h2 id="services-title">If you can describe it,<br />we can build it.</h2>
    </div>
  </div>
  <div class="gallery-wrap" bind:this={galleryWrap}>
    <div class="services-gallery" bind:this={gallery}>
      <div class="gallery-item services-center">
        <img
          src="/services/service.jpg"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div class="center-copy">
          <span class="kicker">Sypher / Creative solutions</span>
          <div class="center-message">
            <p class="center-title">Services</p>
            <p class="center-description">
              One creative partner. Every angle covered.
            </p>
          </div>
          <span class="center-index">01 / 04 — Explore what we do</span>
        </div>
      </div>

      {#each services as service}
        <article class="gallery-item service-card {service.theme}">
          <img
            src={service.image}
            alt="{service.title} background"
            loading="lazy"
            decoding="async"
            class="card-bg"
          />
          <div class="card-content">
            <div class="card-top">
              <span>SY / {service.number}</span><span aria-hidden="true"
                >↗</span
              >
            </div>
            <div class="card-bottom">
              <h3>{service.title}</h3>
              <div class="card-details">
                <p>{service.description}</p>
                <ul aria-label="{service.title} offerings">
                  {#each service.offerings as offering}<li>
                      {offering}
                    </li>{/each}
                </ul>
              </div>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .services-section {
    background: #ffffff;
    color: #111;
  }
  .services-intro {
    padding: clamp(80px, 10vw, 160px) 24px 32px;
  }
  .intro-inner {
    max-width: 1440px;
    margin: 0 auto;
  }
  .intro-kicker {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .services-intro h2 {
    margin-top: 28px;
    font-size: clamp(2.75rem, 7vw, 7rem);
    font-weight: 450;
    line-height: 1.04;
    letter-spacing: -0.07em;
  }
  .gallery-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100svh;
    padding: 24px;
    background: #ffffff;
  }
  .gallery-wrap :global(.service-overlay) {
    position: absolute;
    z-index: 5;
    margin: 0;
    pointer-events: auto;
    visibility: hidden;
  }
  .gallery-wrap :global(.service-overlay .card-content) {
    padding: clamp(32px, 6vw, 100px);
  }
  .gallery-wrap :global(.service-overlay .card-bottom h3) {
    font-size: clamp(3rem, 7vw, 8rem);
    max-width: 14ch;
  }
  .gallery-wrap :global(.service-overlay .card-bottom p) {
    font-size: clamp(1rem, 1.6vw, 1.4rem);
  }
  .gallery-wrap :global(.service-overlay .card-bottom li) {
    font-size: clamp(0.75rem, 1vw, 1rem);
    padding: 8px 12px;
  }
  .gallery-wrap :global(.service-overlay.creative .card-bottom) {
    max-width: 80%;
  }
  .services-gallery {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    grid-template-rows: repeat(3, minmax(0, 1fr));
    align-content: center;
    justify-content: center;
    gap: 12px;
    width: min(100%, 1440px);
    height: min(820px, calc(100svh - 48px));
    min-height: 650px;
    overflow: hidden;
    position: relative;
    flex: none;
  }
  .services-gallery .kicker,
  .services-gallery .center-index,
  .services-gallery .center-description,
  .services-gallery .card-top,
  .services-gallery .card-details {
    display: none;
  }
  .services-gallery .center-copy {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .services-gallery .card-content {
    justify-content: flex-end;
  }
  .gallery-item {
    color: #fff;
    position: relative;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    isolation: isolate;
  }
  /* Shared overlay pseudo-element for all cards */
  .gallery-item::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }
  .services-center {
    grid-area: 2 / 2;
    background: #272333;
  }
  .services-center img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  .services-center:hover img {
    transform: scale(1.04);
  }
  .services-center::after {
    background: linear-gradient(
      180deg,
      rgba(12, 12, 18, 0.5),
      rgba(12, 12, 18, 0.13) 35%,
      rgba(12, 12, 18, 0.82)
    );
  }
  .center-copy,
  .card-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: clamp(18px, 2.7vw, 34px);
  }
  .kicker,
  .center-index,
  .card-top {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .center-title {
    font-size: clamp(2.7rem, 5vw, 5rem);
    line-height: 1;
    letter-spacing: -0.075em;
  }
  .center-description {
    margin-top: 9px;
    max-width: 26ch;
    font-size: 0.85rem;
    line-height: 1.45;
  }
  .center-index {
    color: #dfd9e8;
  }
  .card-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
    transition: transform 0.6s ease;
  }
  .gallery-item:hover .card-bg {
    transform: scale(1.04);
  }
  .web {
    grid-area: 1 / 1 / 3 / 2;
    background: #192630;
  }
  .web::after {
    background: linear-gradient(
      180deg,
      rgba(25, 42, 55, 0.55) 0%,
      rgba(25, 42, 55, 0.1) 40%,
      rgba(25, 42, 55, 0.88) 100%
    );
  }
  .marketing {
    grid-area: 1 / 2;
    background: #241c34;
  }
  .marketing::after {
    background: linear-gradient(
      180deg,
      rgba(36, 28, 52, 0.55) 0%,
      rgba(36, 28, 52, 0.1) 40%,
      rgba(36, 28, 52, 0.9) 100%
    );
  }
  .branding {
    grid-area: 1 / 3 / 3 / 4;
    background: #382328;
  }
  .branding::after {
    background: linear-gradient(
      180deg,
      rgba(56, 35, 40, 0.55) 0%,
      rgba(56, 35, 40, 0.1) 40%,
      rgba(56, 35, 40, 0.88) 100%
    );
  }
  .creative {
    grid-area: 3 / 1 / 4 / 4;
    background: #262238;
  }
  .creative::after {
    background: linear-gradient(
      90deg,
      rgba(38, 34, 56, 0.9) 0%,
      rgba(38, 34, 56, 0.55) 35%,
      rgba(38, 34, 56, 0.25) 100%
    );
  }
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: start;
  }
  .card-top span:last-child {
    font-size: 1.25rem;
    line-height: 0.7;
  }
  .card-bottom h3 {
    font-size: clamp(1.35rem, 2vw, 2rem);
    line-height: 1.15;
    letter-spacing: -0.05em;
    font-weight: 450;
  }
  .card-bottom p {
    max-width: 38ch;
    margin-top: 8px;
    color: #e1dce7;
    font-size: 0.8rem;
    line-height: 1.45;
  }
  .card-bottom ul {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 12px;
    padding: 0;
    list-style: none;
  }
  .card-bottom li {
    padding: 5px 8px;
    border: 1px solid rgba(255, 255, 255, 0.34);
    border-radius: 99px;
    font-size: 0.63rem;
    line-height: 1.2;
  }
  .creative .card-bottom {
    max-width: 60%;
  }
  @media (max-width: 1023px), (max-height: 699px) {
    .gallery-wrap {
      min-height: 0;
      padding: 48px 24px;
    }
    .services-gallery {
      width: 100%;
      height: auto;
      min-height: 0;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-template-rows: auto;
      overflow: visible;
    }
    .services-gallery .center-description,
    .services-gallery .card-details {
      display: block;
    }
    .services-center {
      grid-area: 1 / 1 / 2 / -1;
      min-height: 300px;
    }
    .web,
    .marketing,
    .branding,
    .creative {
      grid-area: auto;
    }
    .service-card {
      min-height: 380px;
    }
    .creative .card-bottom {
      max-width: none;
    }
  }
  @media (max-width: 639px) {
    .services-intro {
      padding: 80px 16px 24px;
    }
    .gallery-wrap {
      padding: 36px 16px;
    }
    .services-gallery {
      grid-template-columns: 1fr;
    }
    .services-center {
      grid-area: auto;
      min-height: 310px;
    }
    .service-card {
      min-height: 350px;
    }
    .creative .card-bottom {
      max-width: 85%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .services-gallery .center-description,
    .services-gallery .card-details {
      display: block;
    }
  }
</style>

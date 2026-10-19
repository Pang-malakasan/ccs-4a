<script lang="ts">
  import { onMount } from "svelte";
  import Hero from "#lib/components/landing/Hero.svelte";
  import About from "#lib/components/landing/About.svelte";
  import Services from "#lib/components/landing/Services.svelte";
  import Work from "#lib/components/landing/Work.svelte";
  import Testimonials from "#lib/components/landing/Testimonials.svelte";
  import Footer from "#lib/components/landing/Footer.svelte";
  import ContactDialog from "#lib/components/landing/ContactDialog.svelte";

  let contactBuilding: HTMLImageElement;
  let messageDialog: ContactDialog;

  onMount(() => {
    if (document.documentElement.dataset.quality !== 'high') return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let animation: ReturnType<typeof import("gsap").gsap.fromTo> | undefined;

    async function setupParallax() {
      animation?.revert();
      animation = undefined;
      if (reducedMotion.matches) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || reducedMotion.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      animation = gsap.fromTo(
        contactBuilding,
        { y: -110 },
        {
          y: 110,
          ease: "none",
          scrollTrigger: {
            trigger: contactBuilding.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }

    void setupParallax();
    reducedMotion.addEventListener("change", setupParallax);
    return () => {
      disposed = true;
      reducedMotion.removeEventListener("change", setupParallax);
      animation?.revert();
    };
  });
</script>

<svelte:head>
  <title>Sypher Creative Solutions | Creative ideas, bold impact</title>
  <meta
    name="description"
    content="Sypher Creative Solutions is an independent creative studio bringing thoughtful ideas and creative execution together."
  />
</svelte:head>

<div
  id="top"
  class="bg-black text-white antialiased selection:bg-white selection:text-black"
>
  <div class="flex min-h-screen min-h-[100svh] flex-col">
    <div
      class="h-[7.25rem] shrink-0 sm:h-[9rem] lg:h-[9.5rem]"
      aria-hidden="true"
    ></div>
    <main id="main-content" class="flex flex-1 flex-col">
      <Hero />
    </main>
  </div>

  <About />

  <Services />

  <Work />
  <Testimonials />

  <section
    id="contact"
    aria-labelledby="contact-title"
    class="contact-section scroll-mt-8"
  >
    <div class="contact-inner">
      <h2 id="contact-title" class="contact-title">Get In Touch With Us</h2>
    </div>

    <div class="contact-visual">
      <div class="contact-clouds" aria-hidden="true">
        <div class="cloud-row cloud-row-one"></div>
        <div class="cloud-row cloud-row-two"></div>
        <div class="cloud-row cloud-row-three"></div>
      </div>
      <div class="contact-building" aria-hidden="true">
        <img
          bind:this={contactBuilding}
          src="/contact-building.webp"
          alt=""
          width="1920"
          height="1440"
          loading="lazy"
        />
      </div>
      <div class="contact-details-panel">
        <div class="contact-booking">
          <button
            class="book-call"
            type="button"
            aria-haspopup="dialog"
            onclick={() => messageDialog.open()}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 5h18v14H3zM3 5l9 8 9-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Send a message
          </button>
        </div>
      <div class="contact-inner contact-details">
        <div class="contact-detail">
          <span class="detail-label">Write us</span>
          <a class="detail-value" href="mailto:syphecreative@solutions.com">syphecreative@solutions.com</a>
        </div>
        <div class="contact-detail">
          <span class="detail-label">Our studio</span>
          <span class="detail-value">Pandan, Bogo City<br />Cebu, Philippines</span>
        </div>
        <div class="contact-detail contact-talk">
          <span class="detail-label">Talk to us</span>
          <span class="detail-value">Let's connect soon</span>
        </div>
      </div>
      </div>
    </div>
  </section>

  <Footer />
</div>

<ContactDialog bind:this={messageDialog} />

<style>
  .contact-section {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background: #fff;
    color: #142039;
    padding-top: clamp(65px, 7vw, 110px);
  }

  .contact-clouds {
    position: absolute;
    z-index: 1;
    inset: -65px 0 auto;
    height: clamp(270px, 28vw, 420px);
    overflow: hidden;
    pointer-events: none;
    background: transparent;
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 65%, transparent);
    mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 65%, transparent);
  }

  .contact-building {
    position: absolute;
    z-index: -1;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000 18%);
    mask-image: linear-gradient(to bottom, transparent, #000 18%);
  }

  .contact-building img {
    position: absolute;
    inset: -110px 0 auto;
    display: block;
    width: 100%;
    height: calc(100% + 220px);
    object-fit: cover;
    object-position: center center;
  }

  .cloud-row {
    --cloud-start: 0px;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("/contact-clouds.avif") repeat-x var(--cloud-start) center /
      var(--cloud-width) auto;
    animation: clouds-drift var(--cloud-duration) linear infinite;
  }

  .cloud-row-one {
    --cloud-width: 900px;
    --cloud-duration: 28s;
    top: -16%;
    opacity: 0.95;
  }

  .cloud-row-two {
    --cloud-width: 760px;
    --cloud-duration: 21s;
    --cloud-start: -180px;
    top: -2%;
    opacity: 0.75;
  }

  .cloud-row-three {
    --cloud-width: 1080px;
    --cloud-duration: 36s;
    --cloud-start: -330px;
    top: 10%;
    opacity: 0.6;
  }

  @keyframes clouds-drift {
    to {
      background-position-x: calc(var(--cloud-start) - var(--cloud-width));
    }
  }

  .contact-inner {
    position: relative;
    max-width: 1500px;
    margin: 0 auto;
    padding: 0 clamp(24px, 5vw, 88px);
  }

  .contact-title {
    margin: 0;
    text-align: center;
    font-family: inherit;
    font-size: clamp(1.5rem, 7vw, 8rem);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.065em;
    white-space: nowrap;
  }

  .contact-booking {
    display: flex;
    justify-content: flex-end;
    width: min(100%, 1500px);
    margin-inline: auto;
    padding-inline: clamp(24px, 5vw, 88px);
    margin-bottom: 28px;
    text-align: center;
  }

  .book-call {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 128px;
    height: 128px;
    min-width: 128px;
    min-height: 128px;
    flex: 0 0 128px;
    box-sizing: border-box;
    transform: translate(-112px, -48px);
    aspect-ratio: 1;
    padding: 20px;
    border: 1px solid currentColor;
    border-radius: 50%;
    background: transparent;
    color: #fff;
    font: inherit;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .book-call:hover { background: rgb(255 255 255 / 14%); }
  .book-call svg { width: 16px; height: 16px; flex: 0 0 16px; }
  .book-call:focus-visible { outline: 2px solid #fff; outline-offset: 5px; }

  .contact-details-panel {
    position: absolute;
    inset: auto 0 0;
    z-index: 3;
    background: transparent;
    color: #fff;
    padding: clamp(40px, 5vw, 72px) 0;
    text-shadow: 0 1px 3px rgb(0 0 0 / 85%), 0 2px 8px rgb(0 0 0 / 55%);
  }

  .contact-details {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
    margin-top: 0;
  }

  .contact-detail {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: center;
    text-transform: uppercase;
  }

  .contact-detail:first-child {
    text-align: left;
  }
  .contact-talk {
    text-align: right;
  }

  .detail-label {
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.16em;
  }

  .detail-value {
    font-size: clamp(11px, 1vw, 13px);
    font-weight: 700;
    line-height: 1.5;
    letter-spacing: 0.09em;
  }

  .contact-visual {
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: clamp(800px, 95vw, 1400px);
    margin-top: 45px;
  }

  .contact-visual::after {
    content: "";
    position: absolute;
    z-index: 2;
    inset: auto 0 0;
    height: 60%;
    background: linear-gradient(to bottom, transparent, rgb(0 0 0 / 45%) 55%, rgb(0 0 0 / 78%));
    pointer-events: none;
  }

  @media (max-width: 700px) {
    .contact-section {
      padding-top: 70px;
    }
    .contact-clouds {
      top: -45px;
      height: 280px;
    }
    .contact-building img {
      object-position: 48% center;
    }
    .cloud-row-one {
      --cloud-width: 700px;
    }
    .cloud-row-two {
      --cloud-width: 570px;
    }
    .cloud-row-three {
      --cloud-width: 800px;
    }
    .contact-title {
      font-size: clamp(1.5rem, 7vw, 3rem);
    }
    .contact-details {
      grid-template-columns: 1fr;
      gap: 30px;
      margin-top: 0;
    }
    .contact-booking {
      position: absolute;
      right: 0;
      bottom: calc(100% + 20px);
      width: auto;
      margin-bottom: 0;
    }
    .book-call { transform: none; }
    .contact-detail:first-child,
    .contact-talk {
      text-align: center;
    }
    .contact-visual {
      min-height: 940px;
      margin-top: 45px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cloud-row {
      animation: none;
    }
    .contact-building img {
      transform: none !important;
    }
  }
</style>

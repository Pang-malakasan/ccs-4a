<script lang="ts">
  import BrandLogo, { type BrandStyle } from "./BrandLogo.svelte";
  // Portfolio mockups: names, roles and quotations are illustrative, not real endorsements.
  const testimonials = [
    {
      brand: "Coffee Bean",
      style: "coffee-bean",
      image: "/testimonials/coffee.jpg",
      name: "Daniel Reed",
      role: "Founder, Coffee Bean",
      quote:
        "They understood the feeling we wanted to create. Every detail makes ordering a coffee feel more personal and effortless.",
    },
    {
      brand: "COMTEX",
      style: "comtex",
      image: "/testimonials/comtex-new.jpg",
      name: "Sofia Martinez",
      role: "Creative Director, COMTEX",
      quote:
        "The team translated our energy into a storefront that feels bold and unmistakably us. Our products finally have the presence they deserve.",
    },
    {
      brand: "KOKO",
      style: "koko",
      image: "/testimonials/koko-new.jpg",
      name: "Alex Chen",
      role: "Founder, KOKO",
      quote:
        "What stood out was how well they listened. The result feels considered and expressive, and makes exploring our frames genuinely enjoyable.",
    },
    {
      brand: "Pay Zen",
      style: "pay-zen",
      image: "/testimonials/payzen-centered.jpg",
      name: "Maya Park",
      role: "Product Lead, Pay Zen",
      quote:
        "They made a complex payment journey feel wonderfully simple. Every step gives people the confidence to keep moving.",
    },
    {
      brand: "Lumiere",
      style: "lumiere",
      image: "/testimonials/lumiere-new.jpg",
      name: "Isabelle Laurent",
      role: "Founder, Lumiere",
      quote:
        "They captured the atmosphere behind our fragrances beautifully. It feels like stepping into our world, not simply browsing a collection.",
    },
    {
      brand: "Softbeats",
      style: "softbeats",
      image: "/testimonials/softbeats.jpg",
      name: "Noah Silva",
      role: "Creative Lead, Softbeats",
      quote:
        "It feels exactly like the music we love: personal, warm, and easy to get lost in. That sense of connection is in every detail.",
    },
    {
      brand: "ted",
      style: "ted",
      image:
        "https://www.meme-arsenal.com/memes/338f445d1fa3a62c2bb857561c4b2793.jpg",
      name: "Jhonny Sins",
      role: "CEO, ted",
      quote:
        "I have no idea who these people are, but they did a good job on my website.",
    },
  ] as const;

  let active = $state(1);
</script>

<section
  id="testimonials"
  aria-labelledby="testimonials-title"
  class="testimonials"
>
  <div class="shell">
    <h2 id="testimonials-title">The work speaks.<br />So do they.</h2>
    <div class="cards" aria-label="Choose a testimonial">
      {#each testimonials as testimonial, index (testimonial.brand)}
        <button
          type="button"
          class="card"
          class:active={active === index}
          aria-label={`Show ${testimonial.brand} sample testimonial`}
          aria-pressed={active === index}
          onclick={() => (active = index)}
        >
          <span class="portrait"
            ><img src={testimonial.image} alt="" loading="lazy" /></span
          >
          <span class="portrait-icon" aria-hidden="true">
            <BrandLogo
              brand={testimonial.brand}
              style={testimonial.style as BrandStyle}
              iconOnly
            />
          </span>
          <span class="quote-panel" aria-hidden={active !== index}>
            <span class="quote">“{testimonial.quote}”</span>
            <span class="attribution"
              ><strong>{testimonial.name}</strong><span>{testimonial.role}</span
              ><span class="brand-signature"
                ><BrandLogo
                  brand={testimonial.brand}
                  style={testimonial.style as BrandStyle}
                /></span
              ></span
            >
          </span>
        </button>
      {/each}
    </div>
  </div>
</section>

<style>
  .testimonials {
    background-color: #eaff54;
    color: #000;
    padding: clamp(80px, 10vw, 145px) clamp(20px, 3vw, 56px);
    scroll-margin-top: 2rem;
  }
  .shell {
    max-width: 1600px;
    margin: 0 auto;
  }
  h2 {
    font-size: clamp(46px, 6vw, 88px);
    font-weight: 400;
    line-height: 1.02;
    letter-spacing: -0.075em;
    margin: 0 0 48px;
  }
  .cards {
    display: flex;
    gap: 12px;
    height: clamp(470px, 46vw, 620px);
  }
  .card {
    position: relative;
    display: block;
    flex: 1 1 0;
    min-width: 0;
    border: 0;
    padding: 0;
    overflow: hidden;
    border-radius: 16px;
    color: #111;
    background: #fff;
    text-align: left;
    transition: flex-grow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .card.active {
    flex-grow: 8.5;
  }
  .card:focus-visible {
    outline: 3px solid #000;
    outline-offset: 4px;
  }
  .portrait {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .portrait img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 27%;
    transition: transform 0.6s ease;
  }
  .card:not(.active):hover img {
    transform: scale(1.06);
  }
  .card:not(.active) .portrait:after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, #0003, #0006);
    pointer-events: none;
  }
  .card.active .portrait {
    width: 32%;
  }
  .card.active .portrait:after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 75%, #fff);
    pointer-events: none;
  }
  .portrait-icon {
    position: absolute;
    z-index: 1;
    bottom: 16px;
    left: 50%;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    color: #fff;
    font-size: 23px;
    filter: drop-shadow(0 1px 2px #0009);
    transform: translateX(-50%);
    pointer-events: none;
  }
  .card.active .portrait-icon {
    display: none;
  }
  .quote-panel {
    position: absolute;
    inset: 0 0 0 32%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 24px;
    padding: clamp(24px, 3vw, 48px);
    visibility: hidden;
    opacity: 0;
    transition:
      opacity 0.25s ease,
      visibility 0.25s;
  }
  .card.active .quote-panel {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.25s;
  }
  .quote {
    display: block;
    font-size: clamp(19px, 1.9vw, 30px);
    line-height: 1.26;
    letter-spacing: -0.045em;
  }
  .attribution {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 13px;
  }
  .attribution strong {
    font-size: 16px;
    font-weight: 600;
  }
  .attribution > span {
    color: #555;
  }
  .brand-signature {
    display: block;
    color: #111 !important;
    font-size: 16px;
    margin-top: 14px;
  }
  .sample-note {
    color: #252b0b;
    font-size: 11px;
    line-height: 1.5;
    margin: 18px 0 0;
  }
  @media (max-width: 900px) {
    .cards {
      gap: 6px;
    }
    .card.active {
      flex-grow: 7;
    }
    .card.active .portrait {
      width: 32%;
    }
    .quote-panel {
      left: 32%;
      padding: 24px;
    }
    .quote {
      font-size: clamp(17px, 2.3vw, 23px);
    }
  }
  @media (max-width: 640px) {
    .testimonials {
      padding: 80px 20px;
    }
    h2 {
      margin-bottom: 32px;
    }
    .cards {
      flex-direction: column;
      height: 850px;
      gap: 8px;
    }
    .card {
      border-radius: 12px;
    }
    .card.active {
      flex-grow: 5;
    }
    .card.active .portrait {
      width: 100%;
      height: 42%;
    }
    .card.active .portrait:after {
      background: linear-gradient(180deg, transparent 75%, #fff);
    }
    .card.active .portrait img {
      object-position: center 30%;
    }
    .portrait-icon {
      bottom: 10px;
      left: auto;
      right: 12px;
      width: 32px;
      height: 32px;
      font-size: 18px;
      transform: none;
    }
    .quote-panel {
      inset: 42% 0 0;
      padding: 18px 22px 20px;
      gap: 12px;
    }
    .quote {
      font-size: clamp(16px, 4vw, 20px);
    }
    .attribution {
      font-size: 11px;
    }
    .attribution strong {
      font-size: 14px;
    }
    .brand-signature {
      font-size: 14px;
      margin-top: 7px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .card,
    .portrait img,
    .quote-panel {
      transition: none !important;
    }
  }
</style>

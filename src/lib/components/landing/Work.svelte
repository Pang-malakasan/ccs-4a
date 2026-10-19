<script lang="ts">
  import WorkPreview from "./WorkPreview.svelte";
  import BrandLogo, { type BrandStyle } from "./BrandLogo.svelte";

  const projects = [
    {
      name: "Coffee Bean",
      kind: "coffee",
      description:
        "A cozy mobile ordering experience and a menu made for your daily coffee ritual.",
      background: "#ded1f7",
    },
    {
      name: "COMTEX",
      kind: "comtex",
      description:
        "A bold sportswear storefront for performance gear and the next big drop.",
      background: "#baf3df",
    },
    {
      name: "KOKO",
      kind: "koko",
      description:
        "An eyewear product experience featuring the Zoom frame, details, and price.",
      background: "#e7e7bb",
    },
    {
      name: "Pay Zen",
      kind: "payzen",
      description:
        "A friendly payment experience with an ATM, QR scan, and instant receipt.",
      background: "#a5dafa",
    },
    {
      name: "Lumiere",
      kind: "lumiere",
      description:
        "A refined perfume atelier for fragrance collections and signature scents.",
      background: "#e2f9b3",
    },
    {
      name: "Softbeats",
      kind: "softbeats",
      description:
        "A mellow music playlist with tracks to explore and a player you can actually play.",
      background: "#ffe490",
    },
  ] as const;

</script>

<section
  id="work"
  aria-labelledby="work-title"
  class="scroll-mt-8 bg-white px-6 py-20 text-black sm:px-10 lg:py-32"
>
  <div class="mx-auto max-w-7xl pt-8">
    <div
      class="mb-12 md:mb-16"
    >
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-black/55">
          Our work
        </p>
        <h2
          id="work-title"
          class="work-title mt-6 font-normal tracking-[-0.06em]"
        >
          Built around your next big idea.
        </h2>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
      {#each projects as project (project.kind)}
        <article class="work-card" style:background-color={project.background}>
          <div class="card-intro">
            <h3 class="brand-name">
              <BrandLogo
                brand={project.name}
                style={(project.kind === "coffee"
                  ? "coffee-bean"
                  : project.kind === "payzen"
                    ? "pay-zen"
                    : project.kind) as BrandStyle}
              />
            </h3>
            <p class="card-description">{project.description}</p>
          </div>
          <WorkPreview kind={project.kind} />
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .work-title {
    max-width: 19ch;
    font-size: clamp(2.75rem, 6.8vw, 6.5rem);
    line-height: 1.06;
    text-wrap: balance;
  }
  .work-card {
    min-width: 0;
    min-height: 800px;
    border-radius: 22px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .card-intro {
    padding: 60px 11% 0;
    min-height: 340px;
  }
  .brand-name {
    display: flex;
    align-items: center;
    gap: 13px;
    font-size: clamp(24px, 3vw, 38px);
    font-weight: 700;
    letter-spacing: -0.055em;
    line-height: 1;
  }
  .card-description {
    margin-top: 54px;
    max-width: 430px;
    font-size: clamp(15px, 1.3vw, 18px);
    line-height: 1.5;
    color: #28282d;
  }
  @media (min-width: 640px) {
    .work-card {
      min-height: 850px;
    }
  }
  @media (max-width: 900px) {
    .card-intro {
      padding: 38px 8% 0;
      min-height: 270px;
    }
    .card-description {
      margin-top: 30px;
    }
  }
  @media (max-width: 639px) {
    .work-card {
      min-height: 730px;
    }
    .card-intro {
      min-height: 260px;
    }
  }
</style>

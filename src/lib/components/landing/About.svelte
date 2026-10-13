<script lang="ts">
  import { onMount } from "svelte";

  const paragraphs = [
    "In 2021, Sypher began with a conversation about a neighborhood business that made something wonderful but struggled to show it online. Its owners had poured years into their work. Their photos, website, and messaging simply had not kept pace with what they had built. We started helping them find a clearer way to tell that story, and the idea for a creative studio grew from there.",
    "One project led to another. We met founders who needed a stronger identity, small teams ready to reach new customers, and creators who could bring those ideas to life. As the work grew, so did our team. We brought marketing minds and digital creators together so clients could move from an early conversation to a finished campaign, brand, or online experience with people who understood the whole picture.",
    "Today we still begin by listening to the people behind each business. We learn what they have built, who they hope to reach, and where they want to go next. Then we turn those details into work that feels true to them and useful to the people they serve. That is the kind of work we want Sypher to be known for. Creative ideas, bold impact.",
  ];

  let section: HTMLElement;

  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanup = () => {};

    async function animate() {
      await document.fonts.ready;
      const [{ gsap }, { SplitText }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/SplitText"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;

      gsap.registerPlugin(SplitText, ScrollTrigger);
      const splits = Array.from(
        section.querySelectorAll<HTMLElement>(".about-animate"),
        (element) =>
          SplitText.create(element, { type: "words", aria: "hidden" }),
      );
      const tweens = splits.map((split) =>
        gsap.from(split.words, {
          opacity: 0,
          y: 12,
          duration: 1,
          ease: "none",
          stagger: 0.025,
          scrollTrigger: {
            trigger: split.elements[0],
            start: "top 85%",
            end: "bottom 35%",
            scrub: 0.6,
          },
        }),
      );
      ScrollTrigger.refresh();
      cleanup = () => {
        tweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        splits.forEach((split) => split.revert());
      };
    }

    void animate();
    return () => {
      disposed = true;
      cleanup();
    };
  });
</script>

<section
  bind:this={section}
  id="about"
  aria-labelledby="about-title"
  class="scroll-mt-8 px-6 py-24 sm:px-10 lg:py-36"
>
  <div class="mx-auto justify-center max-w-7xl">
    <div class="mt-10 space-y-12 sm:mt-14 sm:space-y-16">
      {#each paragraphs as paragraph}
        <div class="max-w-4xl">
          <p
            class="about-animate text-[clamp(1.5rem,3vw,2.75rem)] font-normal leading-[1.25] tracking-[-0.035em] text-white"
            aria-hidden="true"
          >
            {paragraph}
          </p>
          <p class="sr-only">{paragraph}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

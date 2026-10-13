<script lang="ts">
  import Navbar from '#lib/components/landing/Navbar.svelte';
  import Hero from '#lib/components/landing/Hero.svelte';
  import Features from '#lib/components/landing/Features.svelte';
  import Footer from '#lib/components/landing/Footer.svelte';
</script>

<svelte:head>
  <title>Sypher Creative Solutions | Creative ideas, bold impact</title>
  <meta name="description" content="Sypher Creative Solutions is an independent creative studio bringing thoughtful ideas and creative execution together." />
</svelte:head>

<div class="bg-black text-white antialiased selection:bg-white selection:text-black" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <div class="flex min-h-screen min-h-[100svh] flex-col">
    <Navbar />
    <main id="main-content" class="flex flex-1 flex-col">
      <Hero />
    </main>
  </div>

  <section id="about" aria-labelledby="about-title" class="scroll-mt-8 px-6 py-20 sm:px-10 lg:py-32">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
      <p class="text-xs uppercase tracking-[0.28em] text-white/55">About Sypher</p>
      <h2 id="about-title" class="text-3xl font-normal leading-tight tracking-[-0.05em] sm:text-5xl">We believe meaningful creative work starts with a different point of view.</h2>
    </div>
  </section>

  <Features />

  <section id="work" aria-labelledby="work-title" class="scroll-mt-8 px-6 py-20 sm:px-10 lg:py-32">
    <div class="mx-auto max-w-7xl border-t border-white/20 pt-8">
      <p class="text-xs uppercase tracking-[0.28em] text-white/55">Our work</p>
      <h2 id="work-title" class="mt-6 max-w-3xl text-4xl font-normal leading-tight tracking-[-0.06em] sm:text-6xl">Built around your next big idea.</h2>
      <p class="mt-6 max-w-xl leading-relaxed text-white/60">Every project is a chance to find a new perspective. Explore how we approach strategy, identity, and digital in the section above.</p>
    </div>
  </section>

  <section id="contact" aria-labelledby="contact-title" class="scroll-mt-8 bg-white px-6 py-20 text-black sm:px-10 lg:py-32">
    <div class="mx-auto max-w-7xl">
      <p class="text-xs uppercase tracking-[0.28em] text-black/55">Let's connect</p>
      <h2 id="contact-title" class="mt-6 max-w-4xl text-5xl font-normal leading-[1.05] tracking-[-0.07em] sm:text-7xl">Something on your mind? Let's make it matter.</h2>
      <p class="mt-8 max-w-xl text-lg text-black/60">We'd love to hear about your ideas. Contact details are coming soon.</p>
    </div>
  </section>

  <Footer />
</div>
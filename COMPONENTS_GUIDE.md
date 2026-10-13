# SvelteKit Component Architecture & Landing Page Guide

This guide explains the folder structure, component anatomy, Svelte 5 Runes syntax, and best practices for building modern landing and promotional pages.

---

## 1. Recommended Folder Structure

In SvelteKit, reusable code and components live inside `src/lib/`. The modern standard is to separate **atomic UI primitives** (buttons, cards, badges) from **landing page sections** (hero, features, footer).

```text
d:\ccs-4a/
├── src/
│   ├── lib/
│   │   ├── assets/                 # SVGs, logos, images
│   │   ├── components/
│   │   │   ├── ui/                 # Reusable atomic UI building blocks
│   │   │   │   ├── Button.svelte   # Buttons with variants (primary, outline, ghost)
│   │   │   │   ├── Card.svelte     # Reusable card container
│   │   │   │   └── Badge.svelte    # Pill badges / status chips
│   │   │   │
│   │   │   └── landing/            # Landing & Promotional Page Sections
│   │   │       ├── Navbar.svelte   # Sticky header with mobile drawer
│   │   │       ├── Hero.svelte     # Headline, subtitle, primary CTAs, metrics
│   │   │       ├── Features.svelte # Grid of features with icons & tags
│   │   │       ├── Testimonials.svelte # User reviews & social proof (optional)
│   │   │       ├── Pricing.svelte  # Pricing tiers & feature comparisons (optional)
│   │   │       ├── Faq.svelte      # Accordion questions & answers (optional)
│   │   │       ├── Cta.svelte      # Final conversion banner (optional)
│   │   │       └── Footer.svelte   # Copyright, navigation links, socials
│   │   │
│   │   └── index.ts                # Optional barrel file for exports
│   │
│   ├── routes/
│   │   ├── +layout.svelte          # Root layout (imports layout.css, global fonts)
│   │   ├── layout.css              # Global stylesheet with `@import "tailwindcss";`
│   │   └── +page.svelte            # The actual landing page assembling the components
│   │
│   ├── app.d.ts                    # Global TypeScript definitions
│   └── app.html                    # HTML shell (favicon, viewport, head scripts)
│
├── package.json                    # Project configuration with `#lib` subpath alias
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite + Tailwind plugin config
```

### Why this structure?
- **`#lib/components/ui/`**: Keeps low-level, generic components decoupled from any specific marketing content.
- **`#lib/components/landing/`**: Groups promotional sections together, making each section easy to edit, reorder, or A/B test.
- **`src/routes/+page.svelte`**: Stays slim and readable because it only imports and composes high-level sections.

---

## 2. Modern Svelte 5 Component Anatomy (Runes)

Svelte 5 uses **Runes** for reactivity and props instead of the older `export let` and `let` syntax.

### Component Template Skeleton

A typical `.svelte` file has three sections:

```svelte
<script lang="ts">
  // 1. Logic, state, and props
</script>

<!-- 2. HTML Markup and Svelte template blocks -->

<style>
  /* 3. Optional scoped CSS (Tailwind classes can be used directly in markup) */
</style>
```

---

## 3. Key Svelte 5 Runes Cheat Sheet

### A. Accepting Props (`$props()`)
Instead of `export let title = 'Default'`, use `$props()`:

```svelte
<script lang="ts">
  interface Props {
    title: string;
    description?: string;
    highlight?: boolean;
  }

  let { 
    title, 
    description = 'Default description', 
    highlight = false 
  }: Props = $props();
</script>

<div class={highlight ? 'border-orange-500' : 'border-slate-800'}>
  <h3>{title}</h3>
  <p>{description}</p>
</div>
```

### B. Reactive State (`$state()`)
Use `$state()` for values that change over time (e.g. mobile menu toggles):

```svelte
<script lang="ts">
  let isOpen = $state(false);

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<button onclick={toggle}>
  {isOpen ? 'Close' : 'Open'}
</button>

{#if isOpen}
  <div class="menu">Menu contents...</div>
{/if}
```

### C. Slots & Snippets (`{@render children()}`)
In Svelte 5, `<slot />` is replaced by typed snippets:

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
</script>

<button class="px-6 py-3 rounded-full bg-orange-500 text-white">
  {#if children}
    {@render children()}
  {/if}
</button>
```

### D. Events
In Svelte 5, use standard HTML attribute event listeners:
- Old: `<button on:click={handleClick}>`
- **Svelte 5**: `<button onclick={handleClick}>`

---

## 4. Components Already Created in Your Project

We have built a starter kit for your promotional page:

### 1. `Navbar.svelte` (`src/lib/components/landing/Navbar.svelte`)
- Sticky blurred header (`backdrop-blur-md`).
- Responsive desktop navigation and hamburger toggle for mobile devices.
- Uses `$state(false)` to control mobile menu collapse.

### 2. `Hero.svelte` (`src/lib/components/landing/Hero.svelte`)
- High-impact headline with gradient typography.
- Pill badge for announcements or technology tags.
- Dual call-to-action buttons (Primary and Secondary).
- Social proof and metrics grid.

### 3. `Features.svelte` (`src/lib/components/landing/Features.svelte`)
- Configurable array of feature cards (`{#each features as feature}`).
- Hover animations and card elevation with Tailwind CSS.

### 4. `Footer.svelte` (`src/lib/components/landing/Footer.svelte`)
- Clean branding, copyright year, and social/policy links.

### 5. `Button.svelte` (`src/lib/components/ui/Button.svelte`)
- Multi-variant (`primary`, `secondary`, `outline`, `ghost`).
- Can render as either a button or an `<a>` anchor link.
- Accepts children via Svelte 5 snippets.

---

## 5. How to Assemble the Landing Page

Your root page [src/routes/+page.svelte](file:///d:/ccs-4a/src/routes/+page.svelte) composes the sections:

```svelte
<script lang="ts">
  // Modern SvelteKit standard import using `#lib`
  import Navbar from '#lib/components/landing/Navbar.svelte';
  import Hero from '#lib/components/landing/Hero.svelte';
  import Features from '#lib/components/landing/Features.svelte';
  import Footer from '#lib/components/landing/Footer.svelte';
</script>

<svelte:head>
  <title>Your Product - High Converting Landing Page</title>
  <meta name="description" content="Discover our new platform." />
</svelte:head>

<div class="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
  <Navbar brandName="YourBrand" />

  <main>
    <Hero
      headline="Build promotional pages with"
      highlightText="instant speed"
      ctaPrimaryText="Get Started"
      ctaSecondaryText="Learn More"
    />

    <Features />
  </main>

  <Footer brandName="YourBrand" />
</div>
```

---

## 6. How to Add a New Section (e.g. `Pricing.svelte`)

When you want to add a new section:

1. **Create the file**:
   `src/lib/components/landing/Pricing.svelte`

2. **Add the component code**:
   ```svelte
   <script lang="ts">
     interface Plan {
       name: string;
       price: string;
       features: string[];
       popular?: boolean;
     }

     let plans: Plan[] = [
       {
         name: 'Starter',
         price: '$0',
         features: ['1 Project', 'Community Support', 'Basic Analytics']
       },
       {
         name: 'Pro',
         price: '$29',
         features: ['Unlimited Projects', 'Priority Support', 'Advanced Analytics'],
         popular: true
       }
     ];
   </script>

   <section id="pricing" class="py-24 bg-slate-900/50">
     <div class="max-w-7xl mx-auto px-6 text-center">
       <h2 class="text-3xl font-bold text-white">Simple, Transparent Pricing</h2>
       <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
         {#each plans as plan}
           <div class="p-8 rounded-2xl border {plan.popular ? 'border-orange-500 bg-slate-900 shadow-xl shadow-orange-500/10' : 'border-white/10 bg-slate-950'}">
             <h3 class="text-xl font-semibold text-white">{plan.name}</h3>
             <p class="mt-4 text-4xl font-extrabold text-white">{plan.price}<span class="text-sm font-normal text-slate-400">/mo</span></p>
             <ul class="mt-6 space-y-3 text-sm text-slate-300">
               {#each plan.features as feat}
                 <li>✓ {feat}</li>
               {/each}
             </ul>
             <button class="mt-8 w-full py-3 rounded-full font-semibold transition {plan.popular ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-slate-800 text-slate-100 hover:bg-slate-700'}">
               Get Started
             </button>
           </div>
         {/each}
       </div>
     </div>
   </section>
   ```

3. **Import and insert into `src/routes/+page.svelte`**:
   ```svelte
   <script lang="ts">
     import Pricing from '#lib/components/landing/Pricing.svelte';
   </script>

   <!-- Place it where you want inside <main> -->
   <Pricing />
   ```

---

## 7. Import Path Note (`#lib` vs `$lib`)

In modern SvelteKit, the Node subpath import pattern `#lib` is configured in `package.json`:

```json
"imports": {
  "#lib": "./src/lib/index.js",
  "#lib/*": "./src/lib/*"
}
```

Always use `#lib/components/...` to import your components from anywhere in your project!

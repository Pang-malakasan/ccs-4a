<script lang="ts">
  import { setContext } from "svelte";
  import "./layout.css";
  import Preloader from "#lib/components/Preloader.svelte";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
  const intro = $state({ complete: false });
  setContext("landing-intro", intro);
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/sypher-logo-static.svg" />
</svelte:head>

<Preloader oncomplete={() => (intro.complete = true)} />
<div
  class="intro-content"
  class:intro-pending={!intro.complete}
  inert={!intro.complete}
>
  {@render children()}
</div>

<style>
  .intro-content {
    transition: opacity 650ms ease;
  }
  .intro-pending {
    opacity: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .intro-content {
      transition: none;
    }
  }
</style>

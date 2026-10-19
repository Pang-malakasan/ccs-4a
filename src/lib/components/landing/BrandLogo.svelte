<script lang="ts">
  export type BrandStyle =
    | "coffee-bean"
    | "comtex"
    | "koko"
    | "pay-zen"
    | "lumiere"
    | "softbeats"
    | "ted";
  let {
    brand,
    style,
    iconOnly = false,
  }: { brand: string; style: BrandStyle; iconOnly?: boolean } = $props();
</script>

<span
  class="brand"
  class:coffee={style === "coffee-bean"}
  class:comtex={style === "comtex"}
  class:koko={style === "koko"}
  class:payzen={style === "pay-zen"}
  class:lumiere={style === "lumiere"}
  class:softbeats={style === "softbeats"}
  class:ted={style === "ted"}
>
  {#if style === "coffee-bean"}
    <span class="coffee-icon" aria-hidden="true"></span>{#if !iconOnly}<span
        >Coffee Bean</span
      >{/if}
  {:else if style === "pay-zen"}
    <span class="pay-icon" aria-hidden="true"></span>{#if !iconOnly}<span
        >Pay<span class="zen">Zen</span></span
      >{/if}
  {:else if style === "comtex"}
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"
      ><circle
        cx="24"
        cy="24"
        r="18"
        stroke="currentColor"
        stroke-width="2.5"
      /><path
        d="M12 11c17 5 22 17 23 30M10 31c13-3 21-11 27-21M8 21c9 0 19 6 25 18"
        stroke="currentColor"
        stroke-width="2"
      /></svg
    >{#if !iconOnly}<span>COMTEX</span>{/if}
  {:else if style === "koko"}
    <svg viewBox="0 0 96 38" fill="none" aria-hidden="true"
      ><path
        d="M3 15 12 12M93 15 84 12M39 14q9-6 18 0"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      /><path
        d="M12 12q-2 0-2 6v7q0 9 14 9 13 0 16-11l2-8q-13-7-30-3ZM84 12q2 0 2 6v7q0 9-14 9-13 0-16-11l-2-8q13-7 30-3Z"
        stroke="currentColor"
        stroke-width="3"
        stroke-linejoin="round"
      /></svg
    >{#if !iconOnly}<span>KOKO</span>{/if}
  {:else if style === "softbeats"}
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"
      ><path
        d="M8 27v-5a16 16 0 0 1 32 0v5M8 25h5a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H9a4 4 0 0 1-4-4v-7a4 4 0 0 1 3-4ZM40 25h-5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h4a4 4 0 0 0 4-4v-7a4 4 0 0 0-3-4Z"
        stroke="currentColor"
        stroke-width="2.8"
        stroke-linejoin="round"
      /><path
        d="m21 25-2 8 5-4 5 4-2-8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      /></svg
    >{#if !iconOnly}<span>softbeats</span>{/if}
  {:else if style === "lumiere"}
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"
      ><path
        d="M24 4c-6 8-10 15-10 22a10 10 0 0 0 20 0c0-7-4-14-10-22Z"
        stroke="currentColor"
        stroke-width="1.7"
      /><path
        d="M24 17c-2 4-4 7-4 10a4 4 0 0 0 8 0c0-3-2-6-4-10Z"
        fill="currentColor"
      /><path d="M10 42h28" stroke="currentColor" stroke-width="1" /></svg
    >{#if !iconOnly}<span>LUMIERE</span>{/if}
  {:else if style === "ted"}
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"
      ><path
        d="M8 31c8 10 23 11 32-1M10 26c9 5 20 3 26-7"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      /><circle cx="12" cy="15" r="4" fill="currentColor" /><circle
        cx="25"
        cy="9"
        r="3"
        fill="currentColor"
      /><circle cx="38" cy="12" r="2" fill="currentColor" /></svg
    >{#if !iconOnly}<span>ted</span>{/if}
  {:else}<span>{brand}</span>{/if}
</span>

<style>
  .brand {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.32em;
    white-space: nowrap;
    line-height: 1;
    font-family: "Inter Variable", Arial, sans-serif;
    font-weight: 800;
  }
  svg {
    display: block;
    flex: none;
    width: 1.35em;
    height: 1.35em;
  }
  .coffee {
    font-family: Georgia, "Times New Roman", serif;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: -0.06em;
  }
  .coffee-icon {
    position: relative;
    flex: 0 0 1.15em;
    width: 1.15em;
    height: 1.5em;
    border: 0.16em solid currentColor;
    border-radius: 55% 45% 55% 45%;
    transform: rotate(35deg);
    margin-right: 0.12em;
  }
  .coffee-icon:after {
    content: "";
    position: absolute;
    top: -0.13em;
    left: 50%;
    width: 0.18em;
    height: 1.4em;
    border-left: 0.13em solid currentColor;
    border-radius: 50%;
    transform: rotate(16deg);
  }
  .comtex {
    font-family: "Arial Narrow", "Helvetica Neue", Arial, sans-serif;
    font-weight: 900;
    font-style: italic;
    letter-spacing: -0.055em;
  }
  .koko {
    font-family: Georgia, "Times New Roman", serif;
    font-weight: 400;
    letter-spacing: -0.06em;
  }
  .koko svg {
    width: 1.6em;
    height: auto;
  }
  .payzen {
    font-weight: 750;
    letter-spacing: -0.075em;
  }
  .zen {
    font-weight: 400;
  }
  .pay-icon {
    display: block;
    flex: 0 0 0.9em;
    width: 0.9em;
    height: 0.9em;
    border: 0.2em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    transform: rotate(-40deg);
  }
  .lumiere {
    font-family: "Times New Roman", Times, serif;
    font-weight: 400;
    letter-spacing: 0.1em;
  }
  .softbeats {
    font-family: "Trebuchet MS", "Arial Rounded MT Bold", sans-serif;
    font-weight: 700;
    letter-spacing: -0.065em;
    text-transform: lowercase;
  }
  .ted {
    font-family: "Segoe Script", "Brush Script MT", cursive;
    font-weight: 600;
  }
</style>

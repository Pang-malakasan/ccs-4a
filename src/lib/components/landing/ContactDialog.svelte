<script lang="ts">
  import { onMount } from "svelte";

  let dialog: HTMLDialogElement;
  let sheet: HTMLDivElement;
  let busy = $state(false);
  let closing = $state(false);
  let status = $state("");
  let sent = $state(false);
  let disposed = false;
  let motion: Animation | undefined;
  let opener: HTMLElement | null = null;
  let savedScroll = 0;
  let smoother: ReturnType<typeof import("gsap/ScrollSmoother").ScrollSmoother.get>;
  let wasPaused = false;

  function animateSheet(exit = false) {
    motion?.cancel();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || document.documentElement.dataset.quality !== "high") {
      motion = undefined;
      return Promise.resolve();
    }
    motion = sheet.animate(exit ? [
      { transform: "translateY(0) rotate(0deg)", opacity: 1 },
      { transform: "translate(8vw, 110vh) rotate(9deg)", opacity: 0 },
    ] : [
      { transform: "translate(-7vw, -110vh) rotate(-10deg)", opacity: 0 },
      { transform: "translateY(12px) rotate(1deg)", opacity: 1, offset: 0.8 },
      { transform: "translateY(0) rotate(0deg)", opacity: 1 },
    ], { duration: exit ? 550 : 950, easing: "cubic-bezier(.22,.8,.24,1)", fill: "both" });
    return motion.finished.catch(() => {});
  }

  export async function open() {
    if (dialog.open) return;
    const high = document.documentElement.dataset.quality === "high";
    const ScrollSmoother = high ? (await import("gsap/ScrollSmoother")).ScrollSmoother : undefined;
    if (disposed || dialog.open) return;
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    smoother = document.documentElement.dataset.quality === "high" ? ScrollSmoother?.get() : undefined;
    savedScroll = smoother ? smoother.scrollTop() : window.scrollY;
    wasPaused = smoother?.paused() ?? false;
    smoother?.paused(true);
    closing = false;
    dialog.showModal();
    dialog.focus({ preventScroll: true });
    window.scrollTo({ top: savedScroll, behavior: "instant" });
    void animateSheet();
  }

  async function close() {
    if (closing || busy) return;
    closing = true;
    await animateSheet(true);
    if (disposed) return;
    dialog.close();
    closing = false;
    opener?.focus({ preventScroll: true });
    window.scrollTo({ top: savedScroll, behavior: "instant" });
    smoother?.paused(wasPaused);
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (busy || sent) return;
    const form = event.currentTarget as HTMLFormElement;
    busy = true;
    status = "";
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Your message could not be sent. Please try again.");
      sent = true;
      status = "Thank you. Your message has been sent—we’ll be in touch.";
      form.reset();
    } catch (error) {
      status = error instanceof Error && error.name !== "TimeoutError"
        ? error.message : "The request timed out. Please try again or email us directly.";
    } finally {
      busy = false;
    }
  }

  onMount(() => {
    // Keep the modal outside ScrollSmoother's transformed content and focus handling.
    document.body.appendChild(dialog);
    return () => {
      disposed = true;
      motion?.cancel();
      if (dialog.open) smoother?.paused(wasPaused);
      dialog.remove();
    };
  });
</script>

<dialog bind:this={dialog} tabindex="-1" autofocus aria-labelledby="message-title" oncancel={(event) => { event.preventDefault(); void close(); }} onclick={(event) => { if (event.target === dialog) void close(); }}>
  <div class="message-sheet" bind:this={sheet}>
    <button class="message-close" type="button" aria-label="Close message form" disabled={busy || closing} onclick={close}>×</button>
    <header>
      <h2 id="message-title">Send a message.</h2>
    </header>
    <div class="message-note">
      <p>Have something in mind?<br />Let’s make it happen.</p>
      <a href="mailto:syphecreative@solutions.com">syphecreative@solutions.com</a>
    </div>
    <form onsubmit={submit}>
      <fieldset disabled={busy || sent}>
        <label for="contact-name">Name <span>*</span></label>
        <input id="contact-name" name="name" autocomplete="name" required maxlength="100" />
        <label for="contact-email">Email <span>*</span></label>
        <input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="254" />
        <label for="contact-phone">Phone <span>(optional)</span></label>
        <input id="contact-phone" name="phone" type="tel" autocomplete="tel" maxlength="40" />
        <label for="contact-message">Message <span>*</span></label>
        <textarea id="contact-message" name="message" rows="4" required minlength="10" maxlength="5000"></textarea>
        <div class="honey" aria-hidden="true"><label for="contact-website">Leave this empty</label><input id="contact-website" name="website" tabindex="-1" autocomplete="off" /></div>
      </fieldset>
      <div class="form-bottom">
        <p>We’ll use your details only to respond to your enquiry.</p>
        <button class="submit" type="submit" disabled={busy || sent}>{busy ? "Sending…" : sent ? "Sent ✓" : "Send message ↗"}</button>
      </div>
      <p class="form-status" role="status" aria-live="polite">{status}</p>
    </form>
  </div>
</dialog>

<style>
  dialog { position: fixed; inset: 0; box-sizing: border-box; width: 100%; height: 100%; height: 100dvh; max-width: none; max-height: none; margin: 0; padding: clamp(8px, 1vw, 18px); border: 0; background: transparent; overflow-x: hidden; overflow-y: auto; color: #142039; }
  dialog::backdrop { background: rgb(0 0 0 / 65%); backdrop-filter: blur(6px); }
  dialog, dialog * { cursor: auto !important; }
  button, a { cursor: pointer !important; }
  dialog[open] { display: flex; align-items: safe center; justify-content: center; }
  .message-sheet { position: relative; box-sizing: border-box; display: flex; flex-direction: column; gap: 22px; width: min(100%, 560px); flex-shrink: 0; margin: auto; padding: 42px 44px 26px; background: #b8ced7; box-shadow: 0 20px 100px #0006; transform-origin: 50% 0; }
  header { padding: 8px 20px 16px 0; }
  h2 { margin: 0; font-family: "Edwardian Script ITC", "Bickham Script Pro", "Snell Roundhand", "Segoe Script", "Brush Script MT", cursive; font-weight: 400; font-style: italic; font-size: clamp(2.5rem, 6vw, 3.8rem); line-height: 1.2; letter-spacing: -.055em; }
  h2 { transform: rotate(-7deg); transform-origin: left center; }
  .message-close { position: absolute; right: 16px; top: 16px; width: 34px; height: 34px; border: 1px solid currentColor; border-radius: 50%; background: transparent; font-size: 22px; }
  .message-note { order: 3; font-size: 11px; line-height: 1.6; border-top: 1px solid #14203925; padding-top: 14px; }
  .message-note p { font-weight: 600; text-transform: uppercase; }
  .message-note a { color: inherit; text-underline-offset: 4px; overflow-wrap: anywhere; }
  form { width: 100%; }
  fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
  label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .07em; }
  label span { opacity: .6; }
  input, textarea { display: block; box-sizing: border-box; width: 100%; border: 0; border-bottom: 1px solid #14203940; border-radius: 0; outline: none; box-shadow: none; background: transparent; color: #142039; padding: 8px 0; margin: 0 0 14px; font: inherit; transition: border-color 180ms ease; }
  input:focus, textarea:focus { outline: none; box-shadow: none; border-bottom-color: #142039; }
  textarea { resize: vertical; min-height: 80px; }
  .form-bottom { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-top: 20px; }
  .form-bottom p { max-width: 23ch; font-size: 11px; line-height: 1.6; }
  .submit { flex-shrink: 0; border: 1px solid currentColor; border-radius: 40px; background: transparent; padding: 15px 24px; color: inherit; font-size: 11px; text-transform: uppercase; }
  .submit:hover { background: #142039; color: #fff; }
  button:disabled { opacity: .55; cursor: wait !important; }
  :is(button, a):focus-visible { outline: 2px solid #142039; outline-offset: 5px; }
  .form-status { margin: 12px 0 0; font-size: 13px; line-height: 1.5; }
  .form-status:empty { margin: 0; }
  .honey { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  @media (max-width: 640px) {
    dialog { padding: 8px; padding-top: max(8px, env(safe-area-inset-top)); padding-bottom: max(8px, env(safe-area-inset-bottom)); }
    .message-sheet { padding: 48px 24px 24px; gap: 18px; }
    h2 { font-size: clamp(2.25rem, 10vw, 3.2rem); }
    input, textarea { font-size: 16px; }
    .form-bottom { flex-wrap: wrap; gap: 12px; }
    .form-bottom p { flex: 1 1 140px; margin: 0; }
    .submit { min-height: 44px; padding: 14px 16px; }
    .message-close { width: 44px; height: 44px; }
  }
  @media (max-width: 360px) {
    .message-sheet { padding-inline: 16px; }
    .form-bottom { flex-direction: column; align-items: stretch; }
    .form-bottom p { flex: none; max-width: none; }
  }
</style>
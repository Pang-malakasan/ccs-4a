<script lang="ts">
  import { onMount } from 'svelte';
  import { performanceProfile, selectQuality, reanalyzePerformance, type Preference } from '#lib/performance.js';
  let dialog: HTMLDialogElement;
  let opener: HTMLButtonElement;
  let opened = $state(false);
  let analyzing = $state(false);
  let timer: ReturnType<typeof setTimeout>;
  const options: { value: Preference; name: string; detail: string }[] = [
    { value: 'auto', name: 'Adaptive', detail: 'Automatically tuned for your device' },
    { value: 'high', name: 'High', detail: 'Full motion, effects and video' },
    { value: 'medium', name: 'Medium', detail: 'Balanced visuals and performance' },
    { value: 'basic', name: 'Basic / Low', detail: 'Lightweight, fast and focused' },
  ];
  const descriptions = { high: 'Full animations, interactive effects and visible video backgrounds enabled.', medium: 'Optimized transitions, native scrolling and static video fallbacks enabled.', basic: 'Visual effects reduced for speed and usability. All content remains available.' };
  function show() { if (!dialog.open) { opened = true; dialog.showModal(); } }
  function close() { dialog.close(); opened = false; opener?.focus({ preventScroll: true }); }
  function analyze() { analyzing = true; clearTimeout(timer); timer = setTimeout(() => { reanalyzePerformance(); analyzing = false; }, 250); }
  onMount(() => { document.body.appendChild(dialog); return () => { clearTimeout(timer); dialog.remove(); }; });
</script>

<button bind:this={opener} class="graphics-launcher" type="button" onclick={show} aria-haspopup="dialog" aria-expanded={opened} aria-controls="graphics-dialog">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 17h16M8 4v6M16 14v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
  <span>Graphics<small>{$performanceProfile.preference === 'auto' ? 'Adaptive' : $performanceProfile.mode}</small></span><i aria-hidden="true"></i>
</button>
<div class="announcement" role="status" aria-live="polite">{$performanceProfile.ready ? `Device Performance Level: ${$performanceProfile.detected.toUpperCase()}. ${descriptions[$performanceProfile.mode]}` : 'Analyzing Device Performance...'}</div>
<dialog bind:this={dialog} id="graphics-dialog" aria-labelledby="graphics-title" oncancel={(event) => { event.preventDefault(); close(); }}>
  <header><span class="eyebrow">SYPHER / EXPERIENCE LAB</span><button class="close" type="button" onclick={close} aria-label="Close graphics settings">×</button><h2 id="graphics-title">Your device.<br /><em>Your experience.</em></h2><p>A considered balance of visual detail and effortless performance.</p></header>
  <section class="analysis-card" aria-label="Device analysis">
    <div class="analysis-top"><i aria-hidden="true"></i><span role="status">{analyzing || !$performanceProfile.ready ? 'Analyzing Device Performance...' : 'Device analysis complete'}</span><span class="chip">LOCAL</span></div>
    <div class="analysis-result"><strong>{$performanceProfile.detected.toUpperCase()}</strong><span>detected capability<br /><b>{$performanceProfile.score} / 4</b> signal score</span></div>
    <div class="score-track" aria-hidden="true"><span style:width={`${$performanceProfile.score * 25}%`}></span></div>
    <button class="reanalyze" type="button" disabled={analyzing} onclick={analyze}>{analyzing ? 'Reading browser signals...' : 'Re-analyze device ↗'}</button>
  </section>
  <fieldset><legend>Graphics quality <span>CHOOSE YOUR MODE</span></legend><div class="mode-grid">{#each options as option}<label class="mode" class:selected={$performanceProfile.preference === option.value}><input type="radio" name="graphics-quality" value={option.value} checked={$performanceProfile.preference === option.value} onchange={() => selectQuality(option.value)} /><span class="mode-icon" aria-hidden="true">{option.value === 'auto' ? 'A' : option.value[0].toUpperCase()}</span><strong>{option.name}</strong><small>{option.detail}</small></label>{/each}</div></fieldset>
  <p class="mode-status"><span class="chip">{$performanceProfile.mode.toUpperCase()} ACTIVE</span>{descriptions[$performanceProfile.mode]}</p>
  {#if $performanceProfile.signals?.reducedMotion}<p class="accessibility-note">Reduced motion is enabled. Basic mode takes priority over every graphics selection.</p>{/if}
  <details open><summary>Device diagnostics <span>BROWSER SIGNALS</span></summary><dl>
    <div><dt>CPU threads</dt><dd>{$performanceProfile.signals?.threads ?? 'Unavailable'}</dd></div>
    <div><dt>Device memory (approx.)</dt><dd>{$performanceProfile.signals?.memory ? `${$performanceProfile.signals.memory} GB` : 'Unavailable'}</dd></div>
    <div><dt>Screen / CSS pixels</dt><dd>{$performanceProfile.signals?.width ?? '—'} × {$performanceProfile.signals?.height ?? '—'}</dd></div>
    <div><dt>Touch-oriented pointer</dt><dd>{$performanceProfile.signals?.touch ? 'Yes' : 'No'}</dd></div>
    <div><dt>Selected preference</dt><dd>{$performanceProfile.preference.toUpperCase()}</dd></div>
    <div><dt>Reduced motion</dt><dd>{$performanceProfile.signals?.reducedMotion ? 'On' : 'Off'}</dd></div>
    <div><dt>Data saver</dt><dd>{$performanceProfile.signals?.saveData ? 'On' : 'Off / unavailable'}</dd></div>
  </dl></details>
  <footer>Browser estimates, not a hardware benchmark. No device data is sent to a server. Your preference is saved in this browser when storage is available. Switching quality restarts visual scenes.</footer>
</dialog>

<style>
  .graphics-launcher { position: fixed; right: max(24px, env(safe-area-inset-right)); bottom: max(24px, env(safe-area-inset-bottom)); z-index: 70; display: flex; align-items: center; gap: 12px; padding: 12px 18px; border: 1px solid #ffffff40; border-radius: 16px; color: #fff; background: #171b20; box-shadow: 0 6px 24px #0003; font: inherit; font-size: 12px; cursor: pointer; }
  .graphics-launcher svg { width: 24px; height: 24px; } .graphics-launcher span { text-align: left; } .graphics-launcher small { display: block; color: #bbd7cf; font-size: 10px; text-transform: uppercase; letter-spacing: .1em; margin-top: 3px; } i { display: inline-block; width: 6px; height: 6px; background: #b6df9a; border-radius: 50%; flex-shrink: 0; }
  dialog { position: fixed; inset: 0 0 0 auto; margin: 0; width: min(460px, 100%); max-width: 100%; height: 100dvh; max-height: 100dvh; box-sizing: border-box; overflow-y: auto; overscroll-behavior: contain; padding: 32px 28px max(28px, env(safe-area-inset-bottom)); border: 0; border-left: 1px solid #ffffff20; background: #141819; color: #f4f4ee; box-shadow: -20px 0 90px #0005; }
  dialog[open] { animation: enter .32s cubic-bezier(.22,1,.36,1); } @keyframes enter { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  dialog::backdrop { background: #0008; } dialog, dialog * { cursor: auto !important; } button, label, input, summary { cursor: pointer !important; } button { font: inherit; } button:focus-visible, summary:focus-visible { outline: 2px solid #c5dfac; outline-offset: 4px; }
  header { position: relative; padding-top: 8px; } .eyebrow { font-size: 9px; letter-spacing: .2em; color: #afbab4; } .close { position: absolute; right: 0; top: -8px; width: 44px; height: 44px; border: 1px solid #ffffff25; border-radius: 50%; background: transparent; color: inherit; font-size: 26px; }
  h2 { font-size: clamp(30px, 7vw, 38px); letter-spacing: -.06em; line-height: 1.12; font-weight: 450; margin: 26px 0 12px; } h2 em { font-family: Georgia, serif; font-weight: 400; color: #c5dfac; }
  header p, .mode-status, footer { font-size: 12px; line-height: 1.7; color: #aeb7b1; }
  .analysis-card { border: 1px solid #c5dfac35; border-radius: 16px; padding: 18px; background: linear-gradient(120deg, #c5dfac12, transparent); margin: 26px 0; } .analysis-top { display: flex; gap: 8px; align-items: center; font-size: 10px; color: #c4cec7; } .chip { display: inline-block; font-size: 8px; letter-spacing: .1em; padding: 4px 7px; border: 1px solid #c5dfac40; border-radius: 4px; color: #c5dfac; } .analysis-top .chip { margin-left: auto; }
  .analysis-result { display: flex; align-items: center; justify-content: space-between; margin: 18px 0; gap: 16px; } .analysis-result strong { font-size: 30px; font-weight: 450; letter-spacing: -.04em; } .analysis-result span { color: #aeb7b1; font-size: 10px; text-align: right; line-height: 1.7; } .analysis-result b { color: #eee; }
  .score-track { height: 4px; border-radius: 4px; background: #ffffff12; overflow: hidden; } .score-track span { display: block; height: 100%; background: #c5dfac; transition: width .25s ease; } .reanalyze { min-height: 44px; border: 0; padding: 12px 0 0; background: transparent; color: #c5dfac; font-size: 10px; } .reanalyze:disabled { opacity: .6; }
  fieldset { border: 0; padding: 0; margin: 0; min-width: 0; } legend, summary { width: 100%; font-size: 12px; margin-bottom: 14px; } legend span, summary span { float: right; color: #a6b1a9; font-size: 8px; letter-spacing: .08em; margin-top: 3px; }
  .mode-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; } .mode { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; min-height: 118px; border: 1px solid #ffffff20; border-radius: 12px; padding: 14px; background: #ffffff03; } .mode.selected { border-color: #c5dfac; background: #c5dfac0d; } .mode:focus-within { outline: 2px solid #c5dfac; outline-offset: 3px; } .mode input { position: absolute; right: 14px; top: 16px; accent-color: #c5dfac; width: 16px; height: 16px; } .mode-icon { width: 25px; height: 25px; display: grid; place-items: center; background: #ffffff0a; border-radius: 6px; font-size: 10px; color: #c5dfac; } .mode strong { font-size: 13px; font-weight: 500; } .mode small { font-size: 10px; line-height: 1.5; color: #aeb7b1; }
  .mode-status { margin: 16px 0 24px; } .mode-status .chip { margin-right: 8px; } .accessibility-note { border-left: 2px solid #c5dfac; padding-left: 12px; font-size: 12px; line-height: 1.6; }
  details { border-top: 1px solid #ffffff18; padding-top: 20px; } summary { min-height: 30px; } dl { font-size: 11px; margin: 0; } dl div { display: flex; justify-content: space-between; gap: 16px; padding: 11px 0; border-bottom: 1px solid #ffffff0c; } dt { color: #aeb7b1; } dd { margin: 0; text-align: right; } footer { font-size: 10px; margin-top: 24px; }
  .announcement { position: fixed; width: 1px; height: 1px; clip-path: inset(50%); overflow: hidden; }
  @media (max-width: 480px) { dialog { padding: 24px 20px; } .graphics-launcher { right: 16px; bottom: max(16px, env(safe-area-inset-bottom)); padding: 10px 14px; } }
</style>

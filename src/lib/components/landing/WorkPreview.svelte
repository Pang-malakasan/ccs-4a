<script lang="ts">
  import { onDestroy } from "svelte";
  import BrandLogo from "./BrandLogo.svelte";

  type Brand =
    | "coffee"
    | "comtex"
    | "koko"
    | "payzen"
    | "lumiere"
    | "softbeats";
  let { kind }: { kind: Brand } = $props();

  const drinks = [
    {
      name: "Honey oat latte",
      detail: "Double espresso · oat milk",
      price: "$6.50",
    },
    {
      name: "Iced vanilla latte",
      detail: "Espresso · vanilla · milk",
      price: "$5.75",
    },
    {
      name: "Maple cold brew",
      detail: "Slow steeped · maple foam",
      price: "$5.25",
    },
  ];
  const tracks = [
    {
      title: "After the rain",
      artist: "Hana Sol",
      time: "3:42",
      cover: "/work/music-two.jpg",
      notes: [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23],
    },
    {
      title: "Blue hour",
      artist: "Low Tide",
      time: "4:08",
      cover: "/work/music.jpg",
      notes: [220, 261.63, 329.63, 261.63, 196, 246.94, 293.66, 246.94],
    },
    {
      title: "Somewhere else",
      artist: "Mira June",
      time: "2:56",
      cover: "/work/music-three.jpg",
      notes: [293.66, 349.23, 440, 349.23, 261.63, 329.63, 392, 329.63],
    },
  ];
  let selected = $state(0);
  let playing = $state(false);
  let demoActive = $state(false);
  let demoStep = $state(false);
  let scenePhase = $state(0);
  let audio: AudioContext | undefined;
  let timer: ReturnType<typeof setInterval> | undefined;
  let noteIndex = 0;
  // The audio is a generated demo loop; no third-party tracks are bundled with the portfolio.
  function note() {
    if (!audio) return;
    const now = audio.currentTime;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value =
      tracks[selected].notes[noteIndex++ % tracks[selected].notes.length];
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.38);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = undefined;
    playing = false;
  }
  async function toggle() {
    if (playing) {
      stop();
      return;
    }
    audio ??= new AudioContext();
    await audio.resume();
    noteIndex = 0;
    playing = true;
    note();
    timer = setInterval(note, 420);
  }
  function select(index: number) {
    selected = index;
    noteIndex = 0;
    if (playing) note();
  }
  function observePreview(node: HTMLElement) {
    // Low graphics uses the initial composition, without scene-cycling timers.
    if (document.documentElement.dataset.quality === "basic") {
      demoActive = false;
      demoStep = false;
      scenePhase = 0;
      return;
    }
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      demoStep = true;
      return;
    }
    let sceneTimer: ReturnType<typeof setInterval> | undefined;
    let visible = false;
    function stopScene() {
      if (sceneTimer) clearInterval(sceneTimer);
      sceneTimer = undefined;
      demoActive = false;
      demoStep = false;
      scenePhase = 0;
      if (kind === "softbeats" && !playing) select(0);
    }
    function startScene() {
      if (!visible || document.hidden || sceneTimer) return;
      demoActive = true;
      demoStep = false;
      scenePhase = 0;
      if (kind === "softbeats" && !playing) select(0);
      // Repeats the product change only while this preview is visible.
      sceneTimer = setInterval(
        () => {
          if (kind === "koko" || kind === "lumiere" || kind === "comtex" || kind === "payzen") {
            scenePhase = (scenePhase + 1) % 4;
            demoStep = scenePhase >= 2;
          } else {
            demoStep = !demoStep;
          }
          if (kind === "softbeats" && !playing) select(demoStep ? 1 : 0);
        },
        kind === "koko" || kind === "lumiere" || kind === "comtex" || kind === "payzen" ? 1750 : 2400,
      );
    }
    function syncVisibility() {
      if (document.hidden) stopScene();
      else startScene();
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) startScene();
        else stopScene();
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", syncVisibility);
    return {
      destroy() {
        observer.disconnect();
        document.removeEventListener("visibilitychange", syncVisibility);
        stopScene();
      },
    };
  }
  onDestroy(() => {
    stop();
    void audio?.close();
  });
</script>

<div
  class="preview {kind}"
  class:demo-active={demoActive}
  class:demo-step={demoStep}
  class:scene-detail={scenePhase === 1}
  class:scene-bag={scenePhase === 2}
  class:scene-finish={scenePhase === 3}
  use:observePreview
  aria-label={`${kind} design concept`}
>
  {#if kind === "coffee"}
    <div class="coffee-app">
      <div class="coffee-intro">
        <div class="coffee-heading">
          <small>COFFEE BEAN / ORDER ONLINE</small>
          <h4>Your coffee,<br />your moment.</h4>
          <p>
            Good mornings start here. Explore the menu and find your next
            favorite.
          </p>
        </div>
        <div class="coffee-photo">
          <img
            src="/work/coffee.jpg"
            alt="Freshly poured coffee in a ceramic cup"
            loading="lazy"
          />
        </div>
      </div>
      <div class="coffee-phone">
        <div class="phone-status">9:41 <span>●●● ▰</span></div>
        <div class="phone-top">
          <BrandLogo brand="Coffee Bean" style="coffee-bean" /><span
            >⌕ &nbsp; ☰</span
          >
        </div>
        <small>GOOD MORNING, ALEX</small>
        <h5>What can we make<br />for you today?</h5>
        <div class="phone-feature">
          <img
            src="/work/coffee-menu.jpg"
            alt="Coffee served in a cup"
            loading="lazy"
          />
          <div>
            <small>THE DAILY FAVORITE</small><strong>Honey oat latte</strong
            ><span>From $6.50 &nbsp; ↗</span>
          </div>
        </div>
        <div class="phone-tabs">
          <span>All</span><span>Hot coffee</span><span>Iced</span>
        </div>
        <div class="coffee-selection">
          Added to your order <strong>Honey oat latte · $6.50</strong>
        </div>
        <div class="phone-row">
          <img src="/work/coffee.jpg" alt="" loading="lazy" /><span
            >Iced vanilla latte<small>Espresso · vanilla</small></span
          ><b>$5.75</b>
        </div>
        <div class="phone-row">
          <img src="/work/coffee-menu.jpg" alt="" loading="lazy" /><span
            >Maple cold brew<small>Slow steeped</small></span
          ><b>$5.25</b>
        </div>
      </div>
      <div class="coffee-list">
        <div class="list-head"><span>MADE FOR YOUR DAY</span></div>
        {#each drinks as drink}<div class="drink">
            <span
              ><strong>{drink.name}</strong><small>{drink.detail}</small></span
            ><b>{drink.price}</b>
          </div>{/each}<span class="menu-more">FULL MENU ↗</span>
      </div>
    </div>
  {:else if kind === "comtex"}
    <div class="store comtex-store">
      <div class="store-nav">
        <BrandLogo brand="COMTEX" style="comtex" /><span
          >SHOP &nbsp; COLLECTIONS &nbsp; ABOUT</span
        ><span>⌕ &nbsp; BAG (0)</span>
      </div>
      <div class="sports-hero">
        <img
          src={demoStep ? "/work/sportswear.jpg" : "/work/sports.jpg"}
          alt={demoStep
            ? "Sportswear from the training collection"
            : "Performance running shoe"}
          loading="lazy"
        />
        <div class="sports-overlay">
          <small
            >{demoStep ? "TRAINING / NEW ARRIVALS" : "NEW SEASON / 2026"}</small
          >
          <h4>
            {demoStep ? "MADE FOR" : "THE PACE"}<br />{demoStep
              ? "THE MOMENT."
              : "IS YOURS."}
          </h4>
          <span
            >{demoStep
              ? "Collection selected ✓"
              : "Explore the collection ↗"}</span
          >
        </div>
      </div>
      <div class="catalog-title">
        <div>
          <small>{demoStep ? "SHOP THE COLLECTION" : "THE LATEST DROP"}</small>
          <h5>{demoStep ? "Find your next move." : "Made to move."}</h5>
        </div>
        <span>{demoStep ? "2 STYLES" : "VIEW ALL ↗"}</span>
      </div>
      <div class="catalog">
        <div class="catalog-item">
          <img
            src="/work/sports.jpg"
            alt="Red performance running shoe"
            loading="lazy"
          />
          <div>
            <span
              ><strong>Pace Runner</strong><small>Running / Footwear</small
              ></span
            ><b>$128</b>
          </div>
        </div>
        <div class="catalog-item">
          <img
            src="/work/sportswear.jpg"
            alt="Sportswear collection"
            loading="lazy"
          />
          <div>
            <span
              ><strong>Motion Collection</strong><small
                >Training / Apparel</small
              ></span
            ><b>From $96</b>
          </div>
        </div>
      </div>
      <div class="comtex-quick-view" aria-hidden={scenePhase < 2}>
        <div class="quick-image">
          <img src="/work/sports.jpg" alt="" loading="lazy" />
        </div>
        <div class="quick-details">
          <small>COMTEX / RUNNING</small><strong>Pace Runner</strong><span
            >Built for every new mile.</span
          >
          <div class="quick-sizes">
            <b>SELECT SIZE</b><span>8</span><span>9</span><span
              class="selected-size">10</span
            ><span>11</span>
          </div>
          <div class="quick-add">
            {scenePhase === 3 ? "✓ ADDED TO YOUR BAG" : "ADD TO BAG — $128"}
          </div>
        </div>
      </div>
    </div>
  {:else if kind === "koko"}
    <div class="store koko-store">
      <div class="store-nav">
        <BrandLogo brand="KOKO" style="koko" /><span
          >OPTICAL &nbsp; SUNGLASSES &nbsp; OUR STORY</span
        ><span>⌕ &nbsp; BAG ({demoStep ? 1 : 0})</span>
      </div>
      <div class="koko-main">
        <div class="frame-image" class:champagne={demoStep}>
          <img
            src="/work/eyewear.jpg"
            alt="Close-up photograph of eyewear frames"
            loading="lazy"
          /><span>NEW / THE EVERYDAY EDIT</span>
          <div class="koko-zoom" aria-hidden="true">
            <img src="/work/eyewear.jpg" alt="" loading="lazy" /><span
              >ZOOM / CLOSER LOOK</span
            >
          </div>
          <div class="koko-gallery-count">
            {scenePhase === 0 ? "01" : "02"} / 02 &nbsp; ← &nbsp; →
          </div>
        </div>
        <div class="frame-detail">
          <small>HOME / OPTICAL / ZOOM</small>
          <div class="frame-title">
            <h4>Zoom</h4>
            <span>$149</span>
          </div>
          <p>
            Considered for every day. A balanced, modern frame with a
            lightweight feel and an effortlessly versatile shape.
          </p>
          <div class="frame-colors">
            <small>COLOR: {demoStep ? "CHAMPAGNE" : "TORTOISE"}</small>
            <div>
              <span></span><span class:chosen={demoStep}></span><span></span>
            </div>
          </div>
          <div class="frame-size">
            <span>Size</span><strong>Medium — 49 / 20 / 145 &nbsp;⌄</strong>
          </div>
          <span class="add-bag"
            >{demoStep ? "✓ ADDED TO BAG — $149" : "ADD TO BAG — $149"}</span
          >
          <div class="frame-extra">
            Complimentary shipping &nbsp; · &nbsp; Easy 30-day returns
          </div>
        </div>
      </div>
      <div class="koko-bottom">
        <span>DETAILS THAT MAKE THE DIFFERENCE</span><span
          >EXPLORE THE COLLECTION ↗</span
        >
      </div>
      <div class="koko-modal-backdrop" aria-hidden="true"></div>
      <div class="koko-bag-drawer" aria-hidden={scenePhase < 2}>
        <div class="koko-modal-header">
          <span>YOUR BAG</span><span class="koko-close" aria-hidden="true"
            >×</span
          >
        </div>
        <div class="koko-modal-success">
          <span>✓</span><strong>Looking good.</strong><small
            >Your new frames are in the bag.</small
          >
        </div>
        <div class="koko-bag-product">
          <img src="/work/eyewear.jpg" alt="" loading="lazy" /><span
            ><b>Zoom Optical</b><small>Champagne · Medium</small><small
              >Qty 1</small
            ></span
          ><strong>$149</strong>
        </div>
        <div class="koko-modal-spacer"></div>
        <div class="koko-modal-total">
          <span>Subtotal</span><strong>$149</strong>
        </div>
        <small class="koko-shipping"
          >Complimentary shipping & easy returns</small
        >
        <div class="koko-bag-footer">VIEW YOUR BAG <span>↗</span></div>
        <div class="koko-continue">CONTINUE SHOPPING</div>
      </div>
    </div>
  {:else if kind === "payzen"}
    <div class="pay-app">
      <div class="pay-header">
        <BrandLogo brand="Pay Zen" style="pay-zen" /><span
          >Overview &nbsp; Cards &nbsp; Activity</span
        ><span class="user-avatar">AZ</span>
      </div>
      <div class="pay-body">
        <div class="pay-greeting">
          <small>MONDAY, OCTOBER 12</small>
          <h4>Good morning, Alex.</h4>
          <p>Here's what's happening with your money.</p>
        </div>
        <div class="pay-balance">
          <div>
            <small>AVAILABLE BALANCE</small><strong>$12,480.50</strong><span
              >Account ending in 4829 &nbsp; ↗</span
            >
          </div>
          <div class="payment-card">
            <span>payzen.</span><span
              >•••• &nbsp; •••• &nbsp; •••• &nbsp; 4829</span
            ><small>ALEX MORGAN &nbsp; &nbsp; VISA</small>
          </div>
        </div>
        <div class="pay-actions">
          <div><span>↗</span>Send money</div>
          <div><span>↓</span>Withdraw</div>
          <div><span>▦</span>Scan to pay</div>
          <div><span>＋</span>Add money</div>
        </div>
        <div class="pay-lower">
          <div class="transactions">
            <div class="pay-section-title">
              <strong>Recent activity</strong><span>See all ↗</span>
            </div>
            <div class="transaction">
              <span class="merchant">CB</span><span
                ><strong>Coffee Bean</strong><small>Today · 9:41 AM</small
                ></span
              ><b>−$42.50</b>
            </div>
            <div class="transaction">
              <span class="merchant muted">UR</span><span
                ><strong>Urban Ride</strong><small>Yesterday · 6:24 PM</small
                ></span
              ><b>−$18.00</b>
            </div>
          </div>
          <div class="pay-qr">
            <div class="pay-section-title">
              <strong>Pay with QR</strong><span>↗</span>
            </div>
            <div class="qr-art"><div></div></div>
            <small
              >{demoStep
                ? "QR ready · Point a camera to scan"
                : "Scan at participating locations"}</small
            >
          </div>
        </div>
        <div class="pay-scan-overlay" aria-hidden="true">
          <div class="scan-heading"><span class="scan-brand">◉ &nbsp; payzen.</span><span class="scan-close">×</span></div>
          <div class="scan-intro"><small>QUICK PAYMENT</small><strong>Scan to pay</strong><span>Point your camera at a merchant code</span></div>
          <div class="scan-window">
            <div class="scan-pattern" aria-hidden="true"></div>
            <span class="scan-corner top-left"></span><span class="scan-corner top-right"></span><span class="scan-corner bottom-left"></span><span class="scan-corner bottom-right"></span>
            <span class="scan-line"></span>
          </div>
          <div class="scan-status"><span class="scan-status-dot"></span>{scenePhase === 1 ? "Finding a code…" : "Code found · Coffee Bean"}</div>
          <div class="scan-footer"><span>⌁ &nbsp; Secure scan</span><span>Enter code instead ↗</span></div>
        </div>
        <div class="pay-confirmation" aria-hidden="true">
          <span class="confirm-check">✓</span><strong>Payment sent</strong
          ><small>$42.50 to Coffee Bean</small><span
            >RECEIPT READY &nbsp; ↗</span
          >
        </div>
        <div class="receipt" class:receipt-visible={demoStep}>
          <div><span>PAYMENT RECEIPT</span><strong>✓</strong></div>
          <small>Payment successful</small>
          <h5>$42.50</h5>
          <div class="receipt-line">Paid to <b>Coffee Bean</b></div>
          <div class="receipt-line">Date <b>Today, 9:41 AM</b></div>
          <div class="receipt-line">Status <b>Completed</b></div>
        </div>
      </div>
    </div>
  {:else if kind === "lumiere"}
    <div class="store perfume-store">
      <div class="store-nav perfume-nav">
        <span>FRAGRANCES &nbsp; THE MAISON</span><BrandLogo
          brand="Lumiere"
          style="lumiere"
        /><span>SEARCH &nbsp; BAG ({demoStep ? 2 : 1})</span>
      </div>
      <div class="lumiere-shop">
        <div class="lumiere-product">
          <div class="lumiere-image">
            <img
              src="/work/perfume.jpg"
              alt="Luxury perfume bottles photographed in warm light"
              loading="lazy"
            /><span>THE SIGNATURE COLLECTION &nbsp; / &nbsp; 01</span>
            <div class="scent-notes">
              <small>THE SCENT STORY</small><strong
                >Bergamot <i>·</i> Amber <i>·</i> Soft musk</strong
              ><span>A fragrance that lingers, beautifully.</span>
            </div>
          </div>
          <div class="lumiere-description">
            <div>
              <small>EAU DE PARFUM · 50 ML</small>
              <h4>Solstice No. 01</h4>
              <p>
                A warm, unforgettable blend of bergamot, amber and soft musk.
              </p>
            </div>
            <strong>$120</strong>
          </div>
        </div>
        <div class="shopping-bag">
          <div class="bag-heading">
            <span
              >YOUR BAG <small>({demoStep ? "2 ITEMS" : "1 ITEM"})</small></span
            ><span aria-hidden="true">×</span>
          </div>
          <p class="bag-note">A little something beautiful is on its way.</p>
          <div class="bag-item">
            <img
              src="/work/perfume.jpg"
              alt="Solstice Eau de Parfum"
              loading="lazy"
            />
            <div>
              <small>LUMIERE / SIGNATURE SCENT</small><strong
                >Solstice No. 01</strong
              ><span>Eau de Parfum · 50 ml</span>
              <div class="bag-quantity">
                <span>− &nbsp; 1 &nbsp; +</span><b>$120.00</b>
              </div>
            </div>
          </div>
          <div class="bag-added">
            <div class="sample-icon">✧</div>
            <span
              ><strong>Discovery sample</strong><small
                >A little extra, on us.</small
              ></span
            ><b>FREE</b>
          </div>
          <div class="gift-note">
            <span>✧</span>
            <div>
              <strong>Gift-ready presentation</strong><small
                >Wrapped with care, just for you.</small
              >
            </div>
            <b>INCLUDED</b>
          </div>
          <div class="bag-delivery">
            <span>✧</span><span
              >Complimentary shipping<br /><small
                >On every order, with love.</small
              ></span
            >
          </div>
          <div class="bag-summary">
            <div><span>Subtotal</span><strong>$120.00</strong></div>
            <small>Shipping calculated at checkout.</small><span
              class="bag-checkout">CONTINUE TO CHECKOUT <span>↗</span></span
            >
            <p>SECURE CHECKOUT &nbsp; · &nbsp; THOUGHTFULLY PACKAGED</p>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="music-app">
      <aside>
        <BrandLogo brand="softbeats" style="softbeats" /><small
          >YOUR MUSIC</small
        ><span class="chosen">⌂ &nbsp; Home</span><span>⌕ &nbsp; Search</span
        ><span>▤ &nbsp; Your library</span><small>YOUR PLAYLISTS</small><span
          >Slow mornings</span
        ><span>After hours</span><span>Good energy</span>
      </aside>
      <div class="music-content">
        <div class="music-nav">
          <span>‹ &nbsp; ›</span><span>⌕ &nbsp; Search for a feeling</span><span
            >◉ &nbsp; Your profile</span
          >
        </div>
        <div class="playlist-hero">
          {#key selected}<img
              src={tracks[selected].cover}
              alt={`Artwork for ${tracks[selected].title}`}
              loading="lazy"
            />{/key}
          <div>
            <small>{playing ? "NOW PLAYING" : "SELECTED FROM SOFT HOURS"}</small
            >
            <h4>{tracks[selected].title}</h4>
            <p>
              {tracks[selected].artist} · A little space to slow down and tune in.
            </p>
            <small
              >softbeats &nbsp; · &nbsp; Soft hours &nbsp; · &nbsp; {tracks[
                selected
              ].time}</small
            >
          </div>
        </div>
        <div class="playlist-actions">
          <button
            onclick={toggle}
            aria-label={playing ? "Pause music" : "Play music"}
            >{playing ? "Ⅱ" : "▶"}</button
          ><span>♡ &nbsp; ···</span><span class="now-playing"
            >{tracks[selected].title} selected</span
          >
        </div>
        <div class="tracks">
          <div class="track-header">
            <span># &nbsp; TITLE</span><span>⌚</span>
          </div>
          {#each tracks as track, index}<button
              class:active={selected === index}
              onclick={() => select(index)}
              aria-label={`Select ${track.title} by ${track.artist}`}
              ><span
                >{selected === index && playing ? "♫" : `0${index + 1}`}</span
              ><img src={track.cover} alt="" loading="lazy" /><span
                class="track-name"
                ><strong>{track.title}</strong><small>{track.artist}</small
                ></span
              ><span class="track-time">{track.time}</span></button
            >{/each}
        </div>
      </div>
      <div class="player">
        <div class="player-song">
          <img src={tracks[selected].cover} alt="" loading="lazy" /><span
            ><strong>{tracks[selected].title}</strong><small
              >{tracks[selected].artist}</small
            ></span
          >
        </div>
        <div class="player-controls">
          <div>
            <button
              onclick={() =>
                select((selected + tracks.length - 1) % tracks.length)}
              aria-label="Previous track">⏮</button
            ><button
              class="main-play"
              onclick={toggle}
              aria-label={playing ? "Pause music" : "Play music"}
              >{playing ? "Ⅱ" : "▶"}</button
            ><button
              onclick={() => select((selected + 1) % tracks.length)}
              aria-label="Next track">⏭</button
            >
          </div>
          <div class="progress"><span class:playing></span></div>
        </div>
        <span class="volume">◖)) &nbsp; ━━━</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .preview {
    position: relative;
    flex: 1;
    min-height: 510px;
    overflow: hidden;
    font-family: "Inter Variable", Arial, sans-serif;
    font-size: 11px;
  }
  .preview * {
    box-sizing: border-box;
  }
  .preview h4,
  .preview h5,
  .preview p {
    margin: 0;
  }
  .preview small {
    font-size: 9px;
    letter-spacing: 0.08em;
  }
  .preview img {
    display: block;
    object-fit: cover;
  }
  .coffee-app,
  .store,
  .pay-app,
  .music-app {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .coffee-app {
    background: #f9f7f3;
    color: #2c2926;
  }
  .coffee-intro {
    height: 248px;
    display: grid;
    grid-template-columns: 50% 50%;
  }
  .coffee-heading {
    padding: 32px 8% 20px 12%;
  }
  .coffee-heading small {
    color: #987d66;
  }
  .coffee-heading h4 {
    font:
      normal clamp(29px, 3.1vw, 45px) / 1.08 Georgia,
      serif;
    letter-spacing: -0.055em;
    margin: 16px 0 12px;
  }
  .coffee-heading p {
    max-width: 200px;
    line-height: 1.55;
    color: #746c64;
  }
  .coffee-photo {
    overflow: hidden;
  }
  .coffee-photo img {
    width: 100%;
    height: 100%;
  }
  .coffee-phone {
    position: absolute;
    top: 132px;
    right: 8%;
    width: 190px;
    height: 367px;
    padding: 8px 12px;
    border: 5px solid #272727;
    border-radius: 27px;
    background: #fff;
    box-shadow: 7px 17px 28px #34271c48;
    overflow: hidden;
  }
  .phone-status {
    font-size: 8px;
    font-weight: bold;
  }
  .phone-status span {
    float: right;
  }
  .phone-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 17px 0 20px;
  }
  .phone-top :global(.brand) {
    font-size: 12px;
  }
  .coffee-phone > small {
    color: #9c7960;
    font-size: 7px;
  }
  .coffee-phone h5 {
    font:
      20px/1.1 Georgia,
      serif;
    margin: 6px 0 13px;
  }
  .phone-feature {
    height: 110px;
    position: relative;
    overflow: hidden;
    border-radius: 5px;
    color: white;
  }
  .phone-feature img {
    width: 100%;
    height: 100%;
    filter: brightness(0.55);
  }
  .phone-feature > div {
    position: absolute;
    inset: auto 10px 9px;
  }
  .phone-feature small,
  .phone-feature strong,
  .phone-feature span {
    display: block;
  }
  .phone-feature small {
    font-size: 6px;
  }
  .phone-feature strong {
    font:
      16px Georgia,
      serif;
    margin: 3px 0;
  }
  .phone-feature span {
    font-size: 7px;
  }
  .phone-tabs {
    display: flex;
    gap: 5px;
    margin: 12px 0;
  }
  .phone-tabs span {
    font-size: 7px;
    padding: 5px;
    border-radius: 20px;
    background: #f4f1eb;
  }
  .phone-tabs span:first-child {
    background: #322c27;
    color: white;
  }
  .phone-row {
    display: flex;
    align-items: center;
    gap: 6px;
    border-top: 1px solid #eee;
    padding: 5px 0;
    font-size: 7px;
  }
  .phone-row img {
    width: 25px;
    height: 25px;
    border-radius: 3px;
  }
  .phone-row span {
    flex: 1;
  }
  .phone-row small {
    display: block;
    font-size: 6px;
    color: #888;
  }
  .phone-row b {
    font-size: 7px;
  }
  .coffee-list {
    padding: 18px 47% 0 6%;
  }
  .list-head {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 8px;
    letter-spacing: 0.06em;
    padding-bottom: 8px;
    border-bottom: 1px solid #ded8d0;
  }
  .drink {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 11px 0;
    border-bottom: 1px solid #e6e0d9;
  }
  .drink strong,
  .drink small {
    display: block;
  }
  .drink strong {
    font-size: 10px;
  }
  .drink small {
    margin-top: 3px;
    color: #8b8177;
    font-size: 8px;
    letter-spacing: 0;
  }
  .drink b {
    font-size: 10px;
    white-space: nowrap;
  }
  .store-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    height: 52px;
    padding: 0 5%;
    background: white;
    font-size: 9px;
    white-space: nowrap;
  }
  .store-nav :global(.brand) {
    font-size: 21px;
  }
  .comtex-store {
    background: #fff;
    color: #202020;
  }
  .sports-hero {
    height: 255px;
    position: relative;
    background: #901e20;
  }
  .sports-hero > img {
    width: 100%;
    height: 100%;
    object-position: 55% 50%;
    filter: brightness(0.72);
  }
  .sports-overlay {
    position: absolute;
    left: 7%;
    top: 14%;
    color: white;
  }
  .sports-overlay h4 {
    font-size: clamp(35px, 4vw, 54px);
    line-height: 0.95;
    letter-spacing: -0.07em;
    font-weight: 800;
    margin: 17px 0 25px;
  }
  .sports-overlay > span {
    padding: 11px 15px;
    background: white;
    color: #222;
    font-size: 9px;
    font-weight: 700;
  }
  .catalog-title {
    display: flex;
    justify-content: space-between;
    align-items: end;
    padding: 20px 5% 12px;
  }
  .catalog-title h5 {
    font-size: 21px;
    letter-spacing: -0.04em;
    margin-top: 5px;
  }
  .catalog-title > span {
    font-size: 9px;
  }
  .catalog {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 13px;
    padding: 0 5%;
  }
  .catalog-item > img {
    width: 100%;
    height: 106px;
    background: #f1f1f1;
  }
  .catalog-item > div {
    display: flex;
    justify-content: space-between;
    gap: 5px;
    padding-top: 8px;
  }
  .catalog-item strong,
  .catalog-item small {
    display: block;
  }
  .catalog-item strong,
  .catalog-item b {
    font-size: 10px;
  }
  .catalog-item small {
    font-size: 8px;
    color: #777;
    margin-top: 3px;
  }
  .koko-store {
    background: #f6f5f2;
    color: #272727;
  }
  .koko-main {
    display: grid;
    grid-template-columns: 54% 46%;
    height: 419px;
  }
  .frame-image {
    position: relative;
    background: #e6e3dd;
  }
  .frame-image img {
    width: 100%;
    height: 100%;
    object-position: center;
  }
  .frame-image > span {
    position: absolute;
    left: 18px;
    bottom: 18px;
    background: white;
    padding: 8px 10px;
    font-size: 8px;
    letter-spacing: 0.08em;
  }
  .frame-detail {
    padding: 25px 9%;
    background: #fff;
  }
  .frame-detail > small {
    color: #8b8b8b;
    font-size: 8px;
  }
  .frame-title {
    display: flex;
    justify-content: space-between;
    align-items: end;
    border-bottom: 1px solid #ddd;
    padding: 13px 0;
    margin-bottom: 15px;
  }
  .frame-title h4 {
    font:
      normal clamp(34px, 4vw, 52px) Georgia,
      serif;
  }
  .frame-title span {
    font-size: 17px;
  }
  .frame-detail p {
    font-size: 10px;
    line-height: 1.65;
    color: #626262;
  }
  .frame-colors {
    margin: 20px 0;
  }
  .frame-colors > div {
    display: flex;
    gap: 7px;
    margin-top: 9px;
  }
  .frame-colors span {
    display: block;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: #604b3b;
    border: 2px solid white;
    outline: 1px solid #8a8a8a;
  }
  .frame-colors span:nth-child(2) {
    background: #c3ab8b;
    outline: 0;
  }
  .frame-colors span:nth-child(3) {
    background: #2b2b2b;
    outline: 0;
  }
  .frame-size {
    display: flex;
    justify-content: space-between;
    gap: 5px;
    font-size: 9px;
    border: 1px solid #ddd;
    padding: 11px 8px;
  }
  .frame-size strong {
    font-weight: 500;
  }
  .add-bag {
    display: block;
    background: #222;
    color: white;
    font-size: 9px;
    text-align: center;
    padding: 13px;
    margin: 12px 0;
  }
  .frame-extra {
    font-size: 8px;
    color: #888;
    text-align: center;
  }
  .koko-bottom {
    display: flex;
    justify-content: space-between;
    padding: 14px 5%;
    font-size: 8px;
    letter-spacing: 0.06em;
  }
  .pay-app {
    background: #f7f9fc;
    color: #182d4c;
  }
  .pay-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 55px;
    background: white;
    padding: 0 5%;
    border-bottom: 1px solid #e8edf3;
    font-size: 10px;
  }
  .pay-header :global(.brand) {
    font-size: 19px;
  }
  .user-avatar {
    width: 25px;
    height: 25px;
    background: #e4ebf5;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 9px;
  }
  .pay-body {
    padding: 22px 5%;
    position: relative;
  }
  .pay-greeting h4 {
    font-size: 23px;
    letter-spacing: -0.04em;
    margin: 4px 0;
  }
  .pay-greeting p {
    color: #758399;
    font-size: 10px;
  }
  .pay-balance {
    margin-top: 17px;
    height: 135px;
    border-radius: 8px;
    background: #fff;
    border: 1px solid #e9edf3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px;
  }
  .pay-balance > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  .pay-balance strong {
    font-size: 27px;
    letter-spacing: -0.06em;
  }
  .pay-balance > div:first-child > span {
    font-size: 9px;
    color: #6c7e99;
  }
  .payment-card {
    background: linear-gradient(125deg, #173b65, #286098);
    color: white;
    height: 112px;
    width: 173px;
    border-radius: 8px;
    padding: 13px;
    box-shadow: 5px 8px 15px #173b6530;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .payment-card span:first-child {
    font-size: 13px;
    font-weight: bold;
  }
  .payment-card span:nth-child(2) {
    font-size: 11px;
    letter-spacing: 0.1em;
  }
  .payment-card small {
    font-size: 7px;
  }
  .pay-actions {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    margin: 13px 0;
  }
  .pay-actions > div {
    padding: 8px 5px;
    background: white;
    border: 1px solid #e9edf3;
    border-radius: 5px;
    font-size: 9px;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
  .pay-actions span {
    width: 23px;
    height: 23px;
    background: #edf4fb;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 13px;
  }
  .pay-lower {
    display: grid;
    grid-template-columns: 1.4fr 0.8fr;
    gap: 10px;
  }
  .transactions,
  .pay-qr {
    background: white;
    border: 1px solid #e9edf3;
    border-radius: 6px;
    padding: 12px;
  }
  .pay-section-title {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    margin-bottom: 10px;
  }
  .pay-section-title span {
    color: #3774a9;
    font-size: 8px;
  }
  .transaction {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border-top: 1px solid #f0f1f4;
  }
  .merchant {
    width: 23px;
    height: 23px;
    display: grid;
    place-items: center;
    background: #ded2c1;
    border-radius: 5px;
    font-size: 8px;
  }
  .merchant.muted {
    background: #dae7ef;
  }
  .transaction > span:nth-child(2) {
    flex: 1;
  }
  .transaction strong,
  .transaction small {
    display: block;
  }
  .transaction strong,
  .transaction b {
    font-size: 9px;
  }
  .transaction small {
    font-size: 7px;
    color: #8992a0;
  }
  .pay-qr {
    text-align: center;
  }
  .qr-art {
    background: white;
    border: 1px solid #d9e1e9;
    padding: 5px;
    width: 52px;
    height: 52px;
    margin: 3px auto;
  }
  .qr-art div {
    height: 100%;
    background: repeating-conic-gradient(#172e4b 0 25%, white 0 50%) 0 0/8px 8px;
  }
  .pay-qr > small {
    font-size: 7px;
    letter-spacing: 0;
    color: #748498;
  }
  .receipt {
    position: absolute;
    top: 298px;
    right: 12%;
    width: 163px;
    background: white;
    box-shadow: 4px 9px 24px #213d5b35;
    padding: 13px;
    z-index: 2;
    transform: rotate(5deg);
    font-size: 8px;
  }
  .receipt > div:first-child {
    display: flex;
    justify-content: space-between;
    font-size: 8px;
    font-weight: 700;
  }
  .receipt > div:first-child strong {
    color: #28a87a;
  }
  .receipt > small {
    display: block;
    font-size: 8px;
    color: #818b98;
    margin-top: 12px;
  }
  .receipt h5 {
    font-size: 24px;
    margin: 3px 0 10px;
  }
  .receipt-line {
    display: flex;
    justify-content: space-between;
    border-top: 1px dashed #d7e0e7;
    padding: 6px 0;
  }
  .music-app {
    background: #151719;
    color: #f5f5f5;
    display: flex;
    padding-bottom: 63px;
  }
  .music-app aside {
    width: 26%;
    background: #0f1011;
    padding: 20px 13px;
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .music-app aside :global(.brand) {
    font-size: 18px;
    margin-bottom: 18px;
  }
  .music-app aside small {
    color: #898c90;
    font-size: 8px;
  }
  .music-app aside span {
    font-size: 10px;
    white-space: nowrap;
    color: #b8b9ba;
  }
  .music-app aside .chosen {
    color: #fff;
    font-weight: bold;
  }
  .music-content {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }
  .music-nav {
    height: 39px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5%;
    color: #bbb;
    font-size: 9px;
  }
  .playlist-hero {
    display: flex;
    align-items: end;
    gap: 17px;
    padding: 22px 5%;
    background: linear-gradient(180deg, #5e5960, #2e2d31);
  }
  .playlist-hero img {
    width: 37%;
    aspect-ratio: 1;
    box-shadow: 5px 10px 17px #0007;
  }
  .playlist-hero h4 {
    font-size: clamp(15px, 2vw, 25px);
    letter-spacing: -0.07em;
    margin: 8px 0;
    white-space: nowrap;
  }
  .playlist-hero > div { min-width:0; flex:1; }
  .playlist-hero p {
    font-size: 10px;
    line-height: 1.5;
    color: #ddd;
    margin-bottom: 10px;
  }
  .playlist-hero small {
    font-size: 8px;
  }
  .playlist-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 10px 5%;
  }
  .playlist-actions button {
    background: #81bd88;
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
  }
  .playlist-actions span {
    color: #b8b8b8;
    font-size: 17px;
  }
  .tracks {
    padding: 0 5%;
  }
  .track-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #555;
    color: #aaa;
    font-size: 8px;
    padding: 7px;
  }
  .tracks button {
    width: 100%;
    display: flex;
    align-items: center;
    text-align: left;
    background: none;
    border: 0;
    color: white;
    gap: 9px;
    padding: 5px 7px;
    cursor: pointer;
  }
  .tracks button:hover,
  .tracks button.active {
    background: #ffffff16;
  }
  .tracks button > span:first-child,
  .track-time {
    color: #aaa;
    font-size: 9px;
  }
  .tracks button img {
    width: 30px;
    height: 30px;
  }
  .track-name {
    flex: 1;
  }
  .track-name strong,
  .track-name small,
  .player-song strong,
  .player-song small {
    display: block;
  }
  .track-name strong,
  .player-song strong {
    font-size: 10px;
  }
  .track-name small,
  .player-song small {
    font-size: 8px;
    color: #aaa;
    letter-spacing: 0;
    margin-top: 3px;
  }
  .player {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 63px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 4%;
    background: #232426;
    border-top: 1px solid #363636;
    gap: 10px;
  }
  .player-song {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 115px;
  }
  .player-song img {
    width: 35px;
    height: 35px;
  }
  .player-controls {
    width: 42%;
    text-align: center;
  }
  .player-controls > div:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .player-controls button {
    border: 0;
    background: none;
    color: #ddd;
    cursor: pointer;
    font-size: 13px;
  }
  .player-controls .main-play {
    background: white;
    color: #111;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    font-size: 11px;
  }
  .progress {
    height: 3px;
    margin-top: 6px;
    border-radius: 4px;
    background: #666;
  }
  .progress span {
    display: block;
    height: 100%;
    width: 32%;
    background: #fff;
  }
  .progress span.playing {
    animation: progress 12s linear infinite;
  }
  .volume {
    color: #aaa;
    font-size: 10px;
  }
  @keyframes progress {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  /* The menu lives beside the overlaid phone, not underneath it. */
  .coffee-list {
    width: calc(100% - 245px);
    padding: 18px 0 0 6%;
  }
  .coffee-list .list-head {
    gap: 12px;
  }
  .coffee-list .list-head span:last-child {
    flex: none;
    white-space: nowrap;
  }
  .coffee-list .drink {
    min-width: 0;
  }
  .coffee-list .drink > span {
    min-width: 0;
  }
  .coffee-list .drink strong,
  .coffee-list .drink small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .coffee-list .menu-more {
    display: inline-block;
    margin-top: 11px;
    font-size: 9px;
    font-weight: 650;
    letter-spacing: 0.09em;
    white-space: nowrap;
    border-bottom: 1px solid currentColor;
    padding-bottom: 3px;
  }

  /* Lumiere: editorial product photography alongside a real shopping-bag layout. */
  .perfume-store {
    background: #f7f5f0;
  }
  .perfume-nav {
    background: #f7f5f0;
    border-bottom: 1px solid #e8e3db;
  }
  .lumiere-shop {
    display: grid;
    grid-template-columns: minmax(0, 52%) minmax(0, 48%);
    height: calc(100% - 52px);
    min-height: 458px;
  }
  .lumiere-product {
    min-width: 0;
    padding: 18px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .lumiere-image {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background: #b7a999;
  }
  .lumiere-image img {
    width: 100%;
    height: 100%;
    object-position: center 57%;
  }
  .lumiere-image > span {
    position: absolute;
    bottom: 12px;
    left: 12px;
    padding: 8px 10px;
    background: #f7f5f0;
    font-size: 7px;
    letter-spacing: 0.11em;
  }
  .lumiere-description {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 8px;
  }
  .lumiere-description small {
    font-size: 8px;
    color: #796f65;
  }
  .lumiere-description h4 {
    font:
      normal 24px/1.1 Georgia,
      serif;
    letter-spacing: -0.04em;
    margin: 5px 0 7px;
  }
  .lumiere-description p {
    max-width: 205px;
    font-size: 9px;
    line-height: 1.5;
    color: #7d7770;
  }
  .lumiere-description > strong {
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    margin-top: 17px;
  }
  .shopping-bag {
    min-width: 0;
    background: #fff;
    padding: 23px 7% 18px;
    display: flex;
    flex-direction: column;
    box-shadow: -8px 0 25px #27211b09;
  }
  .bag-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 650;
    letter-spacing: 0.1em;
    border-bottom: 1px solid #e7e3dc;
    padding-bottom: 15px;
  }
  .bag-heading small {
    color: #928b82;
    font-size: 8px;
    font-weight: 400;
  }
  .bag-heading > span:last-child {
    font-size: 21px;
    line-height: 1;
    font-weight: 300;
  }
  .bag-note {
    font:
      italic 15px Georgia,
      serif;
    color: #867a70;
    padding: 15px 0 20px;
  }
  .bag-item {
    display: flex;
    gap: 10px;
    padding-bottom: 17px;
    border-bottom: 1px solid #e7e3dc;
  }
  .bag-item img {
    width: 66px;
    height: 90px;
    flex: none;
    object-position: center;
    background: #d3c5b5;
  }
  .bag-item > div {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .bag-item small {
    font-size: 7px;
    color: #9b9087;
  }
  .bag-item strong {
    font:
      normal 15px Georgia,
      serif;
  }
  .bag-item > div > span {
    font-size: 8px;
    color: #888078;
  }
  .bag-quantity {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    font-size: 9px;
  }
  .bag-quantity > span {
    border: 1px solid #e2ddd6;
    padding: 5px 8px;
    white-space: nowrap;
  }
  .bag-quantity b {
    font-weight: 550;
  }
  .bag-delivery {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 15px 0;
    font-size: 9px;
    border-bottom: 1px solid #e7e3dc;
  }
  .bag-delivery > span:first-child {
    font-size: 22px;
    color: #8b785f;
  }
  .bag-delivery small {
    display: block;
    color: #958c83;
    font-size: 8px;
    margin-top: 4px;
    letter-spacing: 0;
  }
  .bag-summary {
    margin-top: auto;
    padding-top: 18px;
  }
  .bag-summary > div {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
  .bag-summary > small {
    display: block;
    margin-top: 6px;
    color: #938c84;
    font-size: 8px;
    letter-spacing: 0;
  }
  .bag-checkout {
    display: flex;
    justify-content: space-between;
    background: #252922;
    color: #fff;
    padding: 13px 12px;
    font-size: 8px;
    letter-spacing: 0.08em;
    margin-top: 16px;
  }
  .bag-summary > p {
    text-align: center;
    color: #9a9289;
    font-size: 7px;
    letter-spacing: 0.07em;
    margin-top: 9px;
  }
  @media (max-width: 900px) {
    .store-nav > span:nth-child(2),
    .pay-header > span:nth-child(2),
    .music-app aside {
      display: none;
    }
    .perfume-nav > span:nth-child(2) {
      display: inline-flex;
    }
    .music-content {
      width: 100%;
    }
    .receipt {
      right: 8%;
    }
    .lumiere-product {
      padding: 13px;
    }
    .shopping-bag {
      padding: 18px 6% 13px;
    }
  }
  @media (max-width: 639px) {
    .preview {
      min-height: 470px;
    }
    .coffee-intro {
      height: 215px;
    }
    .coffee-heading {
      padding: 22px 6%;
    }
    .coffee-heading h4 {
      font-size: 30px;
    }
    .coffee-phone {
      right: 3%;
      top: 126px;
      transform: scale(0.82);
      transform-origin: top right;
    }
    .coffee-list {
      padding: 13px 44% 0 5%;
    }
    .drink {
      padding: 8px 0;
    }
    .sports-hero {
      height: 240px;
    }
    .sports-overlay h4 {
      font-size: 37px;
    }
    .catalog-item > img {
      height: 88px;
    }
    .koko-main {
      height: 400px;
      grid-template-columns: 50% 50%;
    }
    .frame-detail {
      padding: 18px 7%;
    }
    .frame-title h4 {
      font-size: 34px;
    }
    .frame-detail p {
      font-size: 9px;
    }
    .frame-colors {
      margin: 12px 0;
    }
    .frame-size {
      font-size: 8px;
    }
    .koko-bottom {
      font-size: 7px;
    }
    .pay-body {
      padding: 15px 4%;
    }
    .pay-balance {
      padding: 10px;
    }
    .pay-balance strong {
      font-size: 21px;
    }
    .payment-card {
      width: 135px;
      height: 92px;
      padding: 10px;
    }
    .pay-actions > div {
      font-size: 8px;
      padding: 5px 2px;
      gap: 3px;
    }
    .receipt {
      top: 278px;
      right: 5%;
      transform: rotate(5deg) scale(0.8);
      transform-origin: top right;
    }
    .perfume-hero {
      height: 315px;
    }
    .perfume-message h4 {
      font-size: 37px;
    }
    .perfume-product h5 {
      font-size: 18px;
    }
    .playlist-hero {
      padding: 20px 4%;
    }
    .playlist-hero h4 {
      font-size: clamp(15px, 3.3vw, 21px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .progress span.playing {
      animation: none;
    }
  }
  @media (max-width: 639px) {
    .coffee-list {
      width: calc(100% - 165px);
      padding: 13px 0 0 5%;
    }
    .coffee-phone {
      --phone-scale: 0.82;
    }
    .coffee-list .list-head {
      flex-wrap: wrap;
      gap: 4px 8px;
    }
    .coffee-list .menu-more {
      margin-top: 7px;
      font-size: 8px;
    }
    .lumiere-shop {
      grid-template-columns: minmax(0, 45%) minmax(0, 55%);
      min-height: 418px;
    }
    .lumiere-product {
      padding: 10px;
      gap: 8px;
    }
    .lumiere-description {
      display: block;
    }
    .lumiere-description h4 {
      font-size: 18px;
    }
    .lumiere-description p {
      font-size: 8px;
    }
    .lumiere-description > strong {
      display: block;
      margin-top: 6px;
      font-size: 12px;
    }
    .shopping-bag {
      padding: 12px 6% 10px;
    }
    .bag-heading {
      padding-bottom: 9px;
      font-size: 10px;
    }
    .bag-note {
      font-size: 12px;
      padding: 10px 0;
    }
    .bag-item {
      gap: 7px;
      padding-bottom: 10px;
    }
    .bag-item img {
      width: 45px;
      height: 69px;
    }
    .bag-item strong {
      font-size: 12px;
    }
    .bag-item small,
    .bag-item > div > span {
      font-size: 7px;
    }
    .bag-quantity {
      font-size: 8px;
    }
    .bag-quantity > span {
      padding: 3px 5px;
    }
    .bag-delivery {
      padding: 9px 0;
      font-size: 8px;
    }
    .bag-summary {
      padding-top: 9px;
    }
    .bag-checkout {
      margin-top: 10px;
      padding: 10px 7px;
      font-size: 7px;
    }
  }
  /* Editorial entrances lead into actual preview state changes. */
  @media (prefers-reduced-motion: no-preference) {
    .coffee.demo-active .coffee-phone {
      animation: coffee-arrive 850ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .coffee.demo-active .coffee-list .drink {
      animation: coffee-row 520ms ease-out both;
    }
    .coffee.demo-active .coffee-list .drink:nth-of-type(3) {
      animation-delay: 100ms;
    }
    .coffee.demo-active .coffee-list .drink:nth-of-type(4) {
      animation-delay: 200ms;
    }
    .comtex.demo-active .sports-hero img {
      animation: sport-zoom 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .comtex.demo-active .sports-overlay {
      animation: sport-copy 720ms ease-out 180ms both;
    }
    .koko.demo-active .frame-image > img {
      animation: koko-focus 1.25s ease-out both;
    }
    .koko.demo-active .frame-detail {
      animation: koko-detail 700ms ease-out 180ms both;
    }
    .payzen.demo-active .payment-card {
      animation: pay-card 850ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .lumiere.demo-active .shopping-bag {
      animation: lumiere-bag 820ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .lumiere.demo-active .bag-item {
      animation: lumiere-item 650ms ease-out 330ms both;
    }
    .softbeats.demo-active .playlist-hero img {
      animation: music-cover 850ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    .softbeats.demo-active .tracks button {
      animation: music-row 450ms ease-out both;
    }
    .softbeats.demo-active .tracks button:nth-of-type(2) {
      animation-delay: 110ms;
    }
    .softbeats.demo-active .tracks button:nth-of-type(3) {
      animation-delay: 220ms;
    }
  }
  @keyframes coffee-arrive {
    from {
      opacity: 0;
      transform: translateY(45px) rotate(5deg) scale(var(--phone-scale, 1));
    }
    to {
      opacity: 1;
      transform: translateY(0) rotate(0) scale(var(--phone-scale, 1));
    }
  }
  @keyframes coffee-row {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes sport-zoom {
    from {
      transform: scale(1.16);
      filter: brightness(0.55);
    }
    to {
      transform: scale(1);
      filter: brightness(0.72);
    }
  }
  @keyframes sport-copy {
    from {
      opacity: 0;
      transform: translateX(-25px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes koko-focus {
    from {
      opacity: 0.45;
      filter: blur(8px);
      transform: scale(1.06);
    }
    to {
      opacity: 1;
      filter: blur(0);
      transform: scale(1);
    }
  }
  @keyframes koko-detail {
    from {
      opacity: 0;
      transform: translateX(18px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes pay-card {
    from {
      opacity: 0;
      transform: translateY(32px) rotate(-7deg);
    }
    to {
      opacity: 1;
      transform: translateY(0) rotate(0);
    }
  }
  @keyframes lumiere-bag {
    from {
      opacity: 0;
      transform: translateX(36px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes lumiere-item {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes music-cover {
    from {
      opacity: 0;
      transform: scale(0.82) rotate(-8deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(0);
    }
  }
  @keyframes music-row {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .coffee-selection {
    position: absolute;
    inset: 90px 12px auto;
    z-index: 4;
    padding: 13px 10px;
    border-radius: 6px;
    background: #2f4a39;
    color: white;
    box-shadow: 0 9px 20px #17271e44;
    font-size: 9px;
    opacity: 0;
    transform: translateY(-12px);
    pointer-events: none;
    transition:
      opacity 0.45s ease,
      transform 0.45s ease;
  }
  .coffee-selection strong {
    display: block;
    margin-top: 4px;
    font-size: 10px;
  }
  .coffee.demo-step .coffee-selection {
    opacity: 1;
    transform: translateY(0);
  }
  .comtex .sports-hero img {
    transition: filter 0.6s ease;
  }
  .comtex.demo-step .sports-hero img {
    filter: brightness(0.48);
  }
  .comtex.demo-step .sports-overlay > span {
    background: #dce95d;
  }
  .koko .frame-image > img {
    transition: filter 0.7s ease;
  }
  .koko .frame-image.champagne > img {
    filter: sepia(0.38) brightness(1.12) saturate(0.7);
  }
  .frame-colors span.chosen {
    outline: 2px solid #2c2c2c;
    outline-offset: 2px;
  }
  .koko.demo-step .add-bag {
    background: #456548;
  }
  .payzen .receipt {
    opacity: 0;
    transform: translateY(20px) rotate(7deg);
    transition:
      opacity 0.6s ease,
      transform 0.6s ease;
    pointer-events: none;
  }
  .payzen .receipt.receipt-visible {
    opacity: 1;
    transform: translateY(0) rotate(5deg);
  }
  .payzen.demo-step .pay-qr {
    border-color: #85b9a1;
    box-shadow: 0 0 0 3px #63a58324;
  }
  .bag-added {
    display: flex;
    align-items: center;
    gap: 7px;
    max-height: 0;
    padding: 0;
    opacity: 0;
    overflow: hidden;
    border-bottom: 1px solid transparent;
    transition:
      max-height 0.55s ease,
      padding 0.55s ease,
      opacity 0.55s ease;
  }
  .bag-added .sample-icon {
    flex: none;
    width: 31px;
    height: 31px;
    display: grid;
    place-items: center;
    background: #e8e3d9;
    color: #655a4a;
    font-size: 17px;
  }
  .bag-added > span {
    flex: 1;
    min-width: 0;
  }
  .bag-added strong,
  .bag-added small {
    display: block;
  }
  .bag-added strong {
    font:
      normal 11px Georgia,
      serif;
  }
  .bag-added small {
    font-size: 7px;
    color: #898076;
    margin-top: 3px;
  }
  .bag-added > b {
    font-size: 7px;
    color: #536c55;
  }
  .lumiere.demo-step .bag-added {
    max-height: 55px;
    padding: 9px 0;
    opacity: 1;
    border-bottom-color: #e7e3dc;
  }
  .gift-note {
    display: flex;
    align-items: center;
    gap: 7px;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    padding: 0;
    border-bottom: 1px solid transparent;
    transition:
      max-height 0.5s ease,
      padding 0.5s ease,
      opacity 0.5s ease;
  }
  .gift-note > span {
    flex: none;
    display: grid;
    place-items: center;
    width: 31px;
    height: 31px;
    background: #e4e9d9;
    font-size: 17px;
  }
  .gift-note > div {
    flex: 1;
    min-width: 0;
  }
  .gift-note strong,
  .gift-note small {
    display: block;
  }
  .gift-note strong {
    font:
      normal 10px Georgia,
      serif;
  }
  .gift-note small {
    font-size: 7px;
    color: #898076;
    margin-top: 3px;
  }
  .gift-note > b {
    font-size: 7px;
    color: #536c55;
  }
  .lumiere.scene-finish .gift-note {
    max-height: 55px;
    padding: 9px 0;
    opacity: 1;
    border-bottom-color: #e7e3dc;
  }
  .scent-notes {
    position: absolute;
    inset: auto 11px 12px;
    padding: 12px;
    color: #362e2a;
    background: #f7f5f0f2;
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }
  .scent-notes small,
  .scent-notes strong,
  .scent-notes span {
    display: block;
  }
  .scent-notes small {
    color: #85746a;
    font-size: 7px;
  }
  .scent-notes strong {
    margin: 8px 0 5px;
    font:
      normal 14px Georgia,
      serif;
  }
  .scent-notes i {
    color: #aa896d;
    font-style: normal;
  }
  .scent-notes span {
    font-size: 8px;
    color: #786d63;
  }
  .lumiere.scene-detail .scent-notes {
    opacity: 1;
    transform: translateY(0);
  }
  .lumiere.scene-detail .lumiere-image > span {
    opacity: 0;
  }
  .lumiere .lumiere-image > span {
    transition: opacity 0.4s ease;
  }
  .koko-zoom {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0;
    transform: scale(1.07);
    transition:
      opacity 0.65s ease,
      transform 0.65s ease;
    pointer-events: none;
  }
  .koko-zoom img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transform: scale(1.65);
  }
  .koko-zoom span {
    position: absolute;
    left: 12px;
    bottom: 13px;
    background: white;
    padding: 8px;
    font-size: 7px;
    letter-spacing: 0.08em;
  }
  .koko.scene-detail .koko-zoom {
    opacity: 1;
    transform: scale(1);
  }
  .koko.scene-detail .frame-image > span {
    opacity: 0;
  }
  .koko .frame-image > span {
    transition: opacity 0.4s ease;
  }
  .koko-gallery-count {
    position: absolute;
    right: 12px;
    top: 12px;
    padding: 7px;
    background: #fff;
    font-size: 8px;
  }
  .koko-modal-backdrop {
    position: absolute;
    z-index: 4;
    inset: 52px 0 0;
    background: #17221b88;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.55s ease;
  }
  .koko.scene-bag .koko-modal-backdrop,
  .koko.scene-finish .koko-modal-backdrop {
    opacity: 1;
  }
  .koko-bag-drawer {
    position: absolute;
    z-index: 5;
    inset: 72px 7% 18px auto;
    width: min(310px, 80%);
    padding: 20px;
    background: #fff;
    box-shadow: 0 20px 45px #1117;
    display: flex;
    flex-direction: column;
    opacity: 0;
    pointer-events: none;
    transform: translateY(24px) scale(0.95);
    transition:
      transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity 0.4s ease;
  }
  .koko.scene-bag .koko-bag-drawer,
  .koko.scene-finish .koko-bag-drawer {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  .koko-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 13px;
    border-bottom: 1px solid #e6e1db;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.13em;
  }
  .koko-close {
    font-size: 21px;
    font-weight: 300;
    line-height: 1;
  }
  .koko-modal-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 5px;
    padding: 18px 0 14px;
  }
  .koko-modal-success > span {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #e5f0e8;
    color: #376743;
    font-size: 16px;
  }
  .koko-modal-success strong {
    font:
      normal 23px Georgia,
      serif;
  }
  .koko-modal-success small {
    color: #6e756c;
    font-size: 8px;
    letter-spacing: 0;
  }
  .koko-bag-product {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
    border-top: 1px solid #e6e1db;
    border-bottom: 1px solid #e6e1db;
  }
  .koko-bag-product img {
    width: 54px;
    height: 57px;
    object-fit: cover;
    flex: none;
  }
  .koko-bag-product span {
    flex: 1;
    min-width: 0;
  }
  .koko-bag-product b,
  .koko-bag-product small {
    display: block;
  }
  .koko-bag-product b,
  .koko-bag-product strong {
    font-size: 10px;
  }
  .koko-bag-product small {
    font-size: 8px;
    color: #777;
    margin-top: 4px;
  }
  .koko-modal-spacer {
    flex: 1;
    min-height: 8px;
  }
  .koko-modal-total {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
  }
  .koko-shipping {
    display: block;
    font-size: 8px;
    color: #777;
    margin-top: 6px;
    letter-spacing: 0;
  }
  .koko-bag-footer {
    display: flex;
    justify-content: space-between;
    background: #262f28;
    color: white;
    padding: 12px;
    margin-top: 17px;
    font-size: 9px;
  }
  .koko.scene-finish .koko-bag-footer {
    background: #52745b;
  }
  .koko-continue {
    text-align: center;
    padding-top: 12px;
    font-size: 8px;
    letter-spacing: 0.07em;
    text-decoration: underline;
  }
  @media (max-width: 639px) {
    .koko-bag-drawer {
      inset: 64px 4% 10px auto;
      width: 78%;
      padding: 12px;
    }
    .koko-modal-success {
      padding: 10px 0;
    }
    .koko-modal-success strong {
      font-size: 18px;
    }
    .koko-bag-product {
      gap: 7px;
      padding: 8px 0;
    }
    .koko-bag-product img {
      width: 42px;
      height: 46px;
    }
    .koko-bag-footer {
      margin-top: 9px;
      padding: 9px;
    }
  }
  .now-playing {
    margin-left: auto;
    color: #99d5a0;
    font-size: 8px;
    letter-spacing: 0.07em;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .softbeats.demo-step .now-playing {
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    .coffee-selection,
    .comtex .sports-hero img,
    .koko .frame-image img,
    .payzen .receipt,
    .bag-added,
    .gift-note,
    .scent-notes,
    .koko-zoom,
    .koko-bag-drawer,
    .now-playing {
      transition: none;
    }
  }
  .comtex-quick-view {
    position: absolute;
    z-index: 3;
    inset: 110px 8% 22px;
    background: #fff;
    display: grid;
    grid-template-columns: 46% 54%;
    box-shadow: 0 22px 50px #17171755;
    opacity: 0;
    pointer-events: none;
    transform: translateY(28px) scale(0.95);
    transition:
      opacity 0.5s ease,
      transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .comtex.scene-bag .comtex-quick-view,
  .comtex.scene-finish .comtex-quick-view {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  .quick-image {
    min-width: 0;
    overflow: hidden;
    background: #c7322c;
  }
  .quick-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .quick-details {
    display: flex;
    flex-direction: column;
    padding: 17px 8%;
    gap: 10px;
    min-width: 0;
  }
  .quick-details > small {
    font-size: 8px;
    color: #6f6f6f;
  }
  .quick-details > strong {
    font-size: clamp(16px, 2vw, 26px);
    letter-spacing: -0.05em;
  }
  .quick-details > span {
    font-size: 9px;
    color: #666;
  }
  .quick-sizes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
    margin-top: auto;
  }
  .quick-sizes b {
    flex-basis: 100%;
    font-size: 8px;
    margin-bottom: 3px;
  }
  .quick-sizes span {
    display: grid;
    place-items: center;
    width: 25px;
    height: 25px;
    border: 1px solid #ddd;
    font-size: 9px;
  }
  .quick-sizes .selected-size {
    background: #242424;
    color: #fff;
    border-color: #242424;
  }
  .quick-add {
    background: #222;
    color: white;
    padding: 12px 8px;
    font-size: 9px;
    text-align: center;
    white-space: nowrap;
    transition: background 0.4s ease;
  }
  .comtex.scene-finish .quick-add {
    background: #436449;
  }
  .pay-scan-overlay { position:absolute; z-index:3; top:68px; right:5%; width:44%; height:365px; padding:14px; display:flex; flex-direction:column; background:#fbfcff; color:#17324d; border:1px solid #d8e4ef; border-radius:16px; box-shadow:0 20px 40px #153d6240; opacity:0; pointer-events:none; transform:translateY(18px) scale(.96); transition:opacity .5s ease,transform .5s ease; }
  .payzen.scene-detail .pay-scan-overlay,.payzen.scene-bag .pay-scan-overlay { opacity:1; transform:translateY(0) scale(1); }
  .scan-heading { display:flex; justify-content:space-between; align-items:center; font-size:11px; font-weight:800; }
  .scan-close { display:grid; place-items:center; width:23px; height:23px; border-radius:50%; background:#eef3f8; font-size:16px; font-weight:400; }
  .scan-intro { text-align:center; padding:12px 0 9px; }
  .scan-intro small,.scan-intro strong,.scan-intro span { display:block; }
  .scan-intro small { font-size:7px; color:#6085a3; }
  .scan-intro strong { font-size:19px; letter-spacing:-.05em; margin:4px 0; }
  .scan-intro span { font-size:8px; color:#77899a; }
  .scan-window { position:relative; width:min(150px,100%); aspect-ratio:1; flex:none; margin:6px auto; padding:18px; background:#f0f6fb; border-radius:12px; overflow:hidden; }
  .scan-pattern { width:100%; height:100%; background:repeating-conic-gradient(#214768 0 25%,white 0 50%) 0 0/12px 12px; border:8px solid white; border-radius:5px; opacity:.72; }
  .scan-corner { position:absolute; width:18px; height:18px; border-color:#2d90bc; border-style:solid; }
  .scan-corner.top-left { top:7px; left:7px; border-width:3px 0 0 3px; border-radius:5px 0 0 0; }
  .scan-corner.top-right { top:7px; right:7px; border-width:3px 3px 0 0; border-radius:0 5px 0 0; }
  .scan-corner.bottom-left { bottom:7px; left:7px; border-width:0 0 3px 3px; border-radius:0 0 0 5px; }
  .scan-corner.bottom-right { bottom:7px; right:7px; border-width:0 3px 3px 0; border-radius:0 0 5px 0; }
  .scan-line { position:absolute; left:12px; right:12px; top:16px; height:2px; background:#34bb9c; box-shadow:0 0 11px #34bb9c; }
  .payzen.scene-detail .scan-line,.payzen.scene-bag .scan-line { animation:scan-sweep 1.7s ease-in-out infinite alternate; }
  .scan-status { display:flex; align-items:center; justify-content:center; gap:6px; margin:5px auto; padding:7px 9px; border-radius:30px; background:#e8f5f1; color:#326a5a; font-size:8px; white-space:nowrap; }
  .scan-status-dot { width:5px; height:5px; flex:none; background:#38b794; border-radius:50%; }
  .scan-footer { display:flex; justify-content:space-between; align-items:center; gap:5px; margin-top:auto; padding-top:9px; border-top:1px solid #e4edf3; font-size:7px; color:#70849a; }  .pay-confirmation {
    position: absolute;
    z-index: 5;
    top: 96px;
    right: 8%;
    width: 36%;
    min-height: 230px;
    padding: 22px 12px;
    background: white;
    box-shadow: 0 16px 35px #193a6250;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 12px;
    opacity: 0;
    pointer-events: none;
    transform: scale(0.88);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
    text-align: center;
  }
  .payzen.scene-finish .pay-confirmation {
    opacity: 1;
    transform: scale(1);
  }
  .confirm-check {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e2f2e9;
    color: #26774d;
    font-size: 22px;
  }
  .pay-confirmation strong {
    font-size: 18px;
    letter-spacing: -0.04em;
  }
  .pay-confirmation small {
    font-size: 9px;
    color: #65758a;
  }
  .pay-confirmation > span:last-child {
    margin-top: auto;
    padding: 10px;
    width: 100%;
    color: #fff;
    background: #153d62;
    font-size: 8px;
  }
  .payzen .receipt.receipt-visible {
    opacity: 0;
  }
  .payzen.scene-finish .receipt.receipt-visible {
    opacity: 1;
  }
  @keyframes scan-sweep {
    from {
      top: 18px;
    }
    to {
      top: calc(100% - 20px);
    }
  }
  @media (max-width: 639px) {
    .comtex-quick-view {
      inset: 110px 5% 18px;
    }
    .quick-details {
      padding: 12px 7%;
      gap: 7px;
    }
    .quick-sizes span {
      width: 21px;
      height: 21px;
    }
    .quick-add {
      font-size: 7px;
      padding: 9px 4px;
    }
    .pay-scan-overlay {
      width: 52%;
      right: 3%;
      top: 62px;
      height: 335px;
      padding: 10px 8px;
    }
    .scan-window {
      width: min(124px,100%);
      margin: 5px auto;
      padding: 12px;
    }
    .scan-intro { padding:9px 0 6px; }
    .scan-intro strong { font-size:16px; }
    .scan-intro span { font-size:7px; }
    .scan-status { font-size:7px; padding:6px; }
    .pay-confirmation {
      right: 4%;
      width: 45%;
      min-height: 200px;
      padding: 15px 8px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .comtex-quick-view,
    .pay-scan-overlay,
    .pay-confirmation {
      transition: none;
    }
    .scan-line {
      animation: none !important;
    }
  }
</style>

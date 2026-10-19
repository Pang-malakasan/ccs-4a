<script lang="ts">
  const links = [
    [
      { href: "#top", label: "Home" },
      { href: "#about", label: "About" },
      { href: "#services", label: "Services" },
    ],
    [
      { href: "#work", label: "Our Work" },
      { href: "#testimonials", label: "Testimonials" },
      { href: "#contact", label: "Contact" },
    ],
  ];
</script>

<footer class="footer">
  <div class="footer-inner">
    <div class="footer-main">
      <a class="brand" href="#top" aria-label="Sypher Creative Solutions, back to top">
        <img src="/sypher-logo-static.svg" alt="" width="72" height="72" />
        <span class="brand-words">
          <span class="brand-name">Sypher Creative</span>
          <span class="brand-subline"><span class="bar"></span>Solutions</span>
        </span>
      </a>

      <div class="footer-content">
        <p class="statement">
          Creative ideas, bold impact. We listen closely, think boldly, and make
          work that feels true to the people behind it.
        </p>
        <nav class="footer-nav" aria-label="Footer navigation">
          {#each links as column}
            <ul>
              {#each column as link}
                <li><a href={link.href}>{link.label}</a></li>
              {/each}
            </ul>
          {/each}
        </nav>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© {new Date().getFullYear()} Sypher Creative Solutions. All rights reserved.</span>
      <span>Pandan, Bogo City, Cebu</span>
      <a class="back-to-top" href="#top" aria-label="Back to top">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M16 27V5m0 0L6 15M16 5l10 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: #000;
    color: #fff;
    padding: clamp(72px, 7vw, 112px) clamp(24px, 6.8vw, 122px) 40px;
  }
  .footer-inner {
    max-width: 1600px;
    min-height: 560px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .footer-main {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    gap: clamp(48px, 8vw, 160px);
  }
  .brand {
    display: inline-flex;
    align-items: center;
    justify-self: start;
    align-self: start;
    gap: 10px;
    color: #fff;
    text-decoration: none;
  }
  .brand img {
    display: block;
    width: clamp(54px, 5vw, 76px);
    height: auto;
  }
  .brand-words {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
    white-space: nowrap;
  }
  .brand-name {
    font-size: clamp(21px, 2.25vw, 36px);
    letter-spacing: -0.065em;
  }
  .brand-subline {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: clamp(15px, 1.45vw, 23px);
    letter-spacing: -0.04em;
  }
  .bar {
    width: 45%;
    height: 2px;
    background: currentColor;
  }
  .footer-content { min-width: 0; }
  .statement {
    max-width: 580px;
    margin: 0;
    color: #eaff54;
    font-size: clamp(25px, 2vw, 34px);
    font-weight: 400;
    line-height: 1.12;
    letter-spacing: -0.055em;
  }
  .footer-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
    margin-top: clamp(72px, 8vw, 124px);
  }
  .footer-nav ul {
    display: flex;
    flex-direction: column;
    gap: 23px;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .footer-nav a {
    color: #a7a7a7;
    font-size: 15px;
    text-decoration: none;
    transition: color 200ms ease;
  }
  .footer-nav a:hover,
  .footer-nav a:focus-visible { color: #eaff54; }
  .footer-bottom {
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 24px;
    padding-top: 54px;
    padding-right: 90px;
    border-top: 1px solid #343434;
    color: #a7a7a7;
    font-size: 13px;
    line-height: 1.5;
  }
  .back-to-top {
    position: absolute;
    top: 12px;
    right: 0;
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #eaff54;
    color: #000;
    transition: transform 200ms ease, background-color 200ms ease;
  }
  .back-to-top:hover {
    transform: translateY(-4px);
    background: #f1ff89;
  }
  .back-to-top svg { width: 30px; height: 30px; }
  .brand:focus-visible,
  .footer-nav a:focus-visible,
  .back-to-top:focus-visible {
    outline: 2px solid #eaff54;
    outline-offset: 5px;
  }
  @media (max-width: 900px) {
    .footer-inner { min-height: 520px; }
    .footer-main { grid-template-columns: 1fr 1fr; gap: 32px; }
    .footer-nav { gap: 18px; }
  }
  @media (max-width: 700px) {
    .footer { padding: 72px 24px 32px; }
    .footer-inner { min-height: 0; }
    .footer-main { grid-template-columns: 1fr; gap: 64px; }
    .statement { max-width: 480px; font-size: clamp(27px, 7vw, 36px); }
    .footer-nav { margin-top: 52px; }
    .footer-bottom {
      flex-direction: column;
      gap: 8px;
      margin-top: 100px;
      padding-top: 40px;
      padding-right: 76px;
    }
    .back-to-top { width: 56px; height: 56px; top: 16px; }
    .back-to-top svg { width: 25px; height: 25px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .footer-nav a,
    .back-to-top { transition: none; }
  }
</style>
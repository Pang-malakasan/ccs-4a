# Adaptive Web Experience System

## Problem and proposed solution
Sypher's animated corporate website can impose unnecessary rendering, video decoding,
and scrolling costs on less capable devices. A client-side capability classifier now
selects an experience tier, with a persistent manual override and an accessible
right-side Graphics drawer. No hardware model detection or remote telemetry is used.

## Classification methodology
- CPU threads: 8+ = 2 points; 4–7 = 1 point; fewer = 0.
- Approximate device memory: 8+ GB = 2 points; 4–7 GB = 1; fewer = 0.
- Missing CPU or memory signals receive a neutral 1 point each.
- Score 3–4 = High; score 2 = Medium; score 0–1 = Basic.
- Reported CPU <= 2, memory <= 2 GB, or data saver caps Auto at Basic.
- OS reduced-motion always forces effective Basic, even with a manual High choice.
- Screen resolution and coarse-pointer status are displayed, not scored: a small
  screen is not evidence of slow hardware. Reported memory is approximate device
  capacity, not free/available RAM. Unsupported values show Unavailable.

This heuristic is not a benchmark and cannot guarantee frame rate. Modern phones
can legitimately classify as High. No FPS or GPU measurements are claimed.

## Adaptation
| Feature | High | Medium | Basic / Low |
| --- | --- | --- | --- |
| Services | Pinned GSAP story | Normal document flow | Normal document flow |
| Decorative video | Load near viewport, pause when hidden | Posters only | Posters only |
| About split text / contact parallax | Enabled | Disabled | Disabled |
| Scroll smoothing | Desktop + short touch smoothing | Native | Native |
| Cursor effect | Fine-pointer devices | Native | Native |
| Continuous CSS motion | Enabled | Hero marquee enabled; cloud motion stopped | Minimal CSS motion |
| Our Work preview cycling | Enabled | Enabled | Disabled; static initial composition |
| Content and navigation | Available | Available | Available |

Graphics selections use localStorage when available. Browser preference/network
changes and re-analysis update the classification. Scene content remounts when
the effective tier changes to clean up GSAP contexts; current form/interactive
state can reset, and scroll position may shift. The settings drawer stays open.
The native dialog provides keyboard focus containment and Escape dismissal.

Implementation: `src/lib/performance.ts` exports classification, effective-mode,
selection, initialization, re-analysis, and adaptive-video functions. This is the
custom client-side API; it is not an added HTTP endpoint. Existing contact email
endpoint configuration remains separate.

## Validation and testing procedures
Run `node --test tests/performance.test.mjs`, `npm run build`, `npm run check`,
and `git diff --check`. Tests cover high/mid/low, unknown signals, data saver,
reduced motion, manual override, and capable touch devices.

Physical-device acceptance checklist (not yet performed):
1. High-end computer: record threads/memory/score, verify High under normal settings.
2. Office/older laptop: record the signals; verify Medium or Basic as appropriate.
3. Phone or tablet: record signals rather than forcing an assumed tier; test all
   overrides, portrait/landscape, touch navigation, contact form, and drawer scrolling.
4. For each device, capture browser/version, viewport, effective mode, network video
   requests, loading time and a browser performance trace. Verify lighter modes
   make no decorative video source requests (posters still load).
5. Enable reduced motion, switch High, and verify Basic remains effective.
6. Reload to verify preference persistence; test unavailable/blocked storage too.
7. Check keyboard focus, Escape, close-button focus restoration and section links.

Do not submit simulated classification tests as three physical-device results.

## Challenges, limitations and recommendations
Hardware signals vary by browser and may be withheld for privacy. Posters depend
on external image services; large source images still require future optimization.
The current implementation reduces rendering and video work, but does not promise
lower JS bundle size. Initial analysis uses synchronous signals, not an artificial
benchmark. The Re-analyze status is painted before reading signals again.

There is a pre-existing `esrap` Context type-checking dependency error and unused
CSS warnings. Resolve dependency compatibility separately before a clean submission.
Use real-device traces to refine thresholds and consider runtime FPS monitoring,
responsive image assets, and state-preserving scene reconfiguration in future work.

## Conclusion
The site now supports automatic and user-selected visual complexity rather than
equating mobile screens with weak hardware. Accessibility remains the highest
priority. The remaining acceptance requirement is measured testing on three real
devices and documenting those observations honestly.
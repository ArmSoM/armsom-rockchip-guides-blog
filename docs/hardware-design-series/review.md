# Hardware design series review — 2026-11-09

Scope: 10 thematic guides in zh/en/ru/de; nine new topics, one CM5 expansion. This is NOT an exhaustive translation of the 242/276/241/146-page source manuals. The accepted editorial plan focuses on engineering questions and ArmSoM product selection. No original PDF was altered. No PDF downloads were added for this batch.

## Source handling
Source filenames, selected sections, language, figure page and exact local paths are in manifest.json. Source-0 RK3576 V1.1 Chinese 242 pages / English 265; source-1 RK3588 V1.3 Chinese 276 / English 304. Page numbers are not interchangeable. Chinese text is the basis for thematic guidance; paired English diagram pages are independently selected. Source-4 RK3308 V1.1 has 16 pages in each language. RK3588S V1.2, RK3506 V1.0, S/S2 note V1.0 and RK3576 manufacturing V1.0 have no matched English figures in this batch; the original Chinese illustration is explicitly identified in EN/RU/DE. Original technical identifiers, units, image labels and watermarks are retained. Cards are original localized editorial SVG illustrations, not vendor reference designs.

## Specific boundaries and unresolved source issues
- RK3576 source overview and chip block diagram differ in multimedia descriptions; no multimedia peak specification was derived for these guides. Application example figures are explicitly vendor reference designs, not ArmSoM interface guarantees.
- RK3506 guide is in the B folder and includes G-family figures. CM1/Forge1 use J. No B/G voltage, package, temperature or DDR limit is attributed to J. The figure caption explicitly names RK3506G.
- S/S2 AN37/AN38 GND-to-clock change and port renaming retained. The source does not supply patch filename/BSP commit or detailed camera concurrency limits. CM7s is not represented as an S2 module.
- RK3308 GF/SMIC typical voltage, drive levels, PMIC suffix and USB_EXTR differences retained. 912MHz/816MHz apply only to the specific merged-rail topology, not all chips or P2 Pro.
- RK3576 process §2.2 has both 168-hour and six-hour statements, plus MSL1 table text <=300℃/85%RH. All are flagged; no guessed correction or actionable 300℃ storage instruction. Reflow and stencil values are RK3576 chip references, not whole-module assembly instructions.
- Existing CM5 text, code and original metadata preserved, with dated expansion and unchanged URL/translation_key.
- All engineering checklists are editorial recommendations. No measurements, certifications, hardware tests or universal board compatibility are claimed.

## Publishing
Local preview only. No git commit/push, Search Console, DNS or production changes authorized for this batch.

## Validation completed — 2026-11-09
- Jekyll production build completed successfully (final run: 270.124 seconds).
- All 40 language pages: HTTP 200; correct self canonical and reciprocal zh/en/ru/de plus x-default; each URL occurs once in sitemap and is present in search data; source images and internal series links resolve.
- All 40 pages contain rendered editable tables. Existing CM5 body and code remain intact. Original 10 source PDFs match their inventory SHA256 hashes.
- 22 official product/documentation URLs return HTTP 200. Forge1 uses /armsom-forge1.
- Native library pagination is complete through the required page count; added pages 42–45 for all four languages reuse existing templates.
- Browser checks: EN/RU/DE/中文 switches reach the same theme; Chinese TOC jump updates the hash and aria-current; mobile 390px viewport has no page overflow, collapsible TOC works and tables use overflow:auto; source images load; library search finds the new RK3576 guide.
- No noindex detected in page metadata or local HTTP headers; robots.txt remains unchanged. No production response headers or search-engine indexing outcomes were claimed.
- Preview: http://127.0.0.1:4038/zh/articles/rk3576-hardware-bringup/ . Node serves only local loopback; Python preview on 4037 was unresponsive.
- No commit, push or publication performed. Hardware validation and unresolved source issues above remain outside this editorial delivery.

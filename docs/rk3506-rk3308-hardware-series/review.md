# RK3506 / RK3308 hardware series review

Status: topic-article drafts for local review, not complete page-by-page translations. No hardware validation. No commit/push.

Sources: RK3506 V1.0 146 pages; RK3308 V1.0 59 pages. RK3506B/G files are identical; counted once. RK3308 compatibility V1.1 is represented by the existing article, which remains intact and gains a series link.

All new topic bodies have Chinese, English, Russian and German versions. Chinese original screenshots are shared by all languages because no matching English main-guide PDF was found. Screenshots preserve full context; no generated diagrams are represented as official circuit schematics.

Corrections and unresolved source issues:
- RK3506 PDF3 explicitly covers G2 and B/J; existing introductory article receives a clarification. Earlier B/G-only wording has been replaced in all four existing HMI versions.
- RK3506 PDF42, printed27: G2 combined-supply prose and table2-11 disagree about AVDD_1V8/AVCC_1V8 memberships; not guessed.
- RK3506 USB ESD capacitance: circuit chapter ≤3pF; PCB ≤0.4pF; both disclosed.
- RK3506 SAI sample-width prose 16–32bit versus list8–32bit; mode confirmation required.
- RK3506 SPI2APB appears in boot table, but download software described as not yet developed in this guide; retain OTG0.
- RK3506 PDF118–119, tables 3-5/3-6 and introductory text say RK3562B/G VCC_DDR, while figures 3-65/3-66 say RK3506B/G. Both original labels and numerical limits are preserved; the two rows must not be presented as confirmed RK3506 limits.
- RK3506 PDF51, table 2-12: peak-power values do not equal the listed voltage times listed peak current. Preserved without inventing a calculation basis or silently correcting numbers.
- RK3506 power-layout prose uses 40mil for some nearby GND vias; figure captions 3-44/3-58 use 50mil. Both recorded for template confirmation.
- RK3506 I2C table 2-42 omits n=2; prose and table 2-43 list controllers 0/1/2. Disclosed rather than silently normalized.
- RK3506 DDR PinMap retains unusual literal package coordinates such as 1N13 and 1M9; visual source inspection confirms these are printed in the original, not just text extraction. Verify against official package PinOut before manufacturing.
- RK3308 original USB_RBIAS133Ω must not be imposed on SMIC S/C15 NC.
- RK3308 RMII table MAC_TXD[2:0]/RXD[2:0] requires PinOut/TRM confirmation.
- Both MSL tables show suspect ≤300°C for MSL1. Do not use this as a storage setting. RK3308 rebake applies to source thickness≥1.6mm; RK3506 applies≤1.4mm. Do not transfer tables between packages.

Coverage: topic prose covers minimum-system/clock/reset/boot, power and variant boundaries, DDR/storage, audio, displays/USB, Ethernet and industrial buses, thermal/ESD/assembly/storage considerations. Added editable four-language tables: complete table 2-4 RK3506 DDR PHY PinMap (50 rows); all seven PDN target-impedance groups (21 numerical frequency-band limits); three power-copper width/DCR rows; three RK3506 peak-current rows; six RK3308 peak-current rows with measurement conditions; ten DSMC master-signal rows; five low-speed-bus summaries. These seven appended tables contain 84 data rows per language. Earlier tables cover RK3506 DDR routing (10 rows), RK3308 microphone/loopback allocation (8 rows), and the two device-specific rebake tables (3 rows each). Signal names, numerical data and source inconsistencies are retained across languages.

Still not a complete technical transcription: it does NOT reproduce all SoC function-ID/PinMux rows, every power-on/off table, all artwork, complete reflow tables or every original technical paragraph. Full source-to-body coverage remains a separate pending item; no claim of complete page-by-page translation is made. Existing source PDFs are unchanged.

Checks performed on staged files: all manifest paths exist; all local Markdown image references resolve in staging or the existing repository; all 50 DDR PinMap rows match the extracted source text; the 7 new tables exist in all four languages. Six representative source-page images were visually inspected for complete-page rendering. This is a sample, not a complete visual audit of all 60 images.

Pending coordinator checks: product URL availability, full source-to-body coverage audit, remaining figure visual review, build, runtime responsive/TOC behavior, canonical/hreflang/search/sitemap and browser preview. Do not report these as passed based on file generation alone.

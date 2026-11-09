# RK3588 hardware design series — review record

2026-11-09. Thirty thematic engineering articles in ZH/EN/RU/DE, including expansion of two existing URLs and a new four-language series hub. Existing bodies are preserved. This is a topic-based engineering series, not a verbatim translation of the complete manual.

Sources: RK3588 Hardware Design Guide CN/EN V1.3 dated 2023-02-13, 276/304 physical PDF pages. Full text extracted for review. Source PDFs unchanged; SHA256 recorded. Chinese articles use Chinese reference-page images; English, Russian and German use corresponding English reference pages. Images supplement editable prose and parameter tables. Figure 2-175 is on CN physical page 155, not 156. Figure 3-41 and 3-42 share a Chinese page but have separate English pages.

## Source qualifications
- 100 cycles at 24MHz is about 4.167 microseconds; the source's 4 microseconds is approximate, not a replacement reset limit.
- MIPI 0.75V versus 0.9V supply naming requires reference schematic and silicon revision confirmation.
- eDP section heading and prose differ (1.4 / 1.3); do not infer final negotiated feature support.
- SARADC key-spacing example and conversion assumptions are not sufficiently explained; preserve the source example without presenting it as a universal rule.
- I2C PMUIO wording differs from domain naming elsewhere; check actual pinout.
- The MSL level-1 300°C table entry is suspect and is not presented as actionable processing advice. MSL3 baking conditions are package-specific.
- DDR length constraints and delay constraints belong to different PCB examples. Mil and ps are not interchangeable.
- Power figures, thermal resistance and PCB stackups are reference conditions, not ArmSoM measurements. USB/PCIe/SATA PHY sharing prevents adding interface counts as simultaneous availability.
- No hardware validation performed. No universal BSP/kernel version or module connector exposure asserted.

AIM7, Sige7 and LM7 product/documentation links are included. Module carrier designs must use module-level interface definitions. Build, SEO, link, image, pagination, browser and deployment results are recorded separately after execution.

- CN figure 3-131 is duplicated: PDF234 PDN and PDF236 fanout. DDR routing uses the fanout on CN236/EN262, plus LPDDR5 Table 3-13 on CN234/EN260. EN260 does not contain the additional CN VDD2L PDN plot.

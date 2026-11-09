# RK3576 hardware series: topics 11–30

2026-11-09. 19 new topics and one expansion of the existing high-speed interface URL, in ZH/EN/RU/DE. Existing article body preserved. Established series hub extended to 30 topics. These are thematic engineering articles, not a verbatim translation of the entire design guide.

Both supplied V1.1 manuals reviewed. CN original figures serve Chinese; corresponding English original figures serve EN/RU/DE. Chapter 3 figure numbering differs substantially: matching uses subject and physical page, not identical numbers. Screenshots supplement editable prose and tables; original PDFs are unchanged. No hardware tests were performed.

## Discrepancies and limits
- CIF: VCCIO4 in the interface section, VCCIO6 in camera notes (CN PDF98/100, EN105/107). Both retained, unresolved pending PinOut/current reference schematic.
- eDP AC coupling: schematic 100nF vs PCB 220nF±20% (CN106–107/222, EN schematic/244). Explicit in all four versions; no guessed BOM correction.
- FSPI1_M0 CSN: table 2.2kΩ vs prose 2.2kΩ/4.7kΩ. Context retained.
- DCPHY AVDD rate thresholds do not define equality explicitly; no invented boundary rule.
- Chapter 3 has renumbered figures and stale cross-references; English ePad figure caption is 3-48 despite prose referring to 3-46.
- Generic TX/RX placement wording is ambiguous; interface-specific driver direction controls the recommendation.
- MSL table contains an apparent 300°C entry for level 1; it is not reproduced as actionable handling advice. MSL3 conditions are scoped to the source.
- Source PHY/clock maximum rates, simulations and interface counts are not ArmSoM measurements or guarantees of CM5/Sige5 connector exposure. No universal BSP/kernel version asserted.
- CM5 and Sige5 official product/documentation links included in every topic. Module carriers must use module-level interface definitions.

## Checks
Build, page metadata, source preservation, assets, search, sitemap, language links, pagination and browser checks are recorded after execution. Publication is authorized by the current user request.

# 107 PCIe developer guide — editorial record

Source RK-KF-YF-141 V6.29.0, Chinese 93 pages and English 104 pages. Technical body begins at Chinese page 9 and English page 11. Original PDFs were opened read-only. Four-language article drafts, original bitmap figures and this record are saved locally. No commit or push.

ZH uses Chinese source text and figures; EN uses English; RU/DE translate the English technical text and use English figures. Do not equate EVB examples with ArmSoM hardware validation. Board/SoC, PHY routing, clock/power/reset timing, SDK/BSP, kernel and peripheral compatibility need actual product verification.

Extraction repairs: English wrapped section headings rejoined. Adjacent cross-page code blocks joined. False one-row tables created by inline shaded property names removed; complete missing prose restored from source pages at s2r-perst-inactive-ms, compliance mode, debugfs prerequisite and BAR readback errors. Chinese page 69 IO-BAR prose restored where inline error updating was misdetected as a table. Table path soft-wrap hyphens repaired; editable data tables retained.

Source ambiguities retained, not corrected by guessing: RK3588 resource table MSI 63353 versus other rows 65535; resource rows label some single-lane controllers Gen3 although other prose discusses PCIe 2.0; fe16000.pcie versus fe160000.pcie; bus-range 0x30–0x60 described as 0x30 buses; memcpy/memset guidance names memset_fromio/memset_toio; duplicated step numbering in AER instructions; status = <okay> prose; prsnt effective-level wording. Confirm source/BSP before use.

## Source QA completed

- Reviewed the complete 93-page Chinese and 104-page English visual contact sets. All technical diagrams, schematics, lane reversal, M.2 connector and board timing figures have corresponding assets: 12 Chinese and 12 English files. No additional standalone vector diagram was found outside these captured figures. Original images remain alongside editable transcriptions of the power-supply and reference-clock parameter tables.
- Restored the technical chip/kernel version table from page 2 in every language, including the explicit RK3399 exclusion. Audience/revision sections remain removed.
- Chinese §12.8 (p.46), MSI allocation capacity, is absent from the English edition. Added a clearly marked Chinese-source supplement to EN/RU/DE without silently replacing their existing section numbers. The Chinese and English §9/§10 order is reversed (fault injection versus AER); retained each source order.
- Rejoined reviewed soft wraps in C strings, bootargs, patch headers, paths, shell commands, comments and log lines, while retaining actual C/DTS indentation and source constants. All four languages contain 94 merged code blocks. EN/RU/DE code is byte-for-byte identical. Removing whitespace from each source's extracted code and its article code produces identical character sequences; no non-whitespace code token has been silently changed.
- Fixed translation substitutions that had affected `No Snoop`, `Non-Posted`, and diagnostic labels `LCRC Error` / `ECRC Error`. Descriptive table cells are localized; protocol identifiers remain intact.
- Removed three duplicate English continuation fragments after the s2r reset, compliance-mode and debugfs extraction repairs.
- Full aligned bilingual code differences are recorded in [CODE-SOURCE-DIFFERENCES.md](CODE-SOURCE-DIFFERENCES.md). These include source comments and wording, not only executable differences. Chinese DTS examples contain full-width `}；` where English has `};`; Chinese diagnostic text includes `F1ags`/`I/0` where English has `Flags`/`I/O`. These source discrepancies are preserved and must not be treated as verified executable syntax. Patch snippets may be partial and are not standalone compilable programs.

Local source QA does not constitute hardware validation or website acceptance. The parent process performs the Jekyll build, HTML/SEO checks and final integration. Browser acceptance is deferred at the user's request; no browser pass is claimed here.

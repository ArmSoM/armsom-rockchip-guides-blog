# Rockchip clock guide - editorial notes

## Sources and pairing

- Chinese: `Rockchip_Developer_Guide_Clock_CN.pdf`, 24 pages.
- English: `Rockchip_Developer_Guide_Clock_EN.pdf`, 24 pages.
- Both identify V1.2.0, dated 2024-08-02. The English and Chinese technical chapter structure is aligned.

## Processing record

- All technical chapters were reviewed: clock-tree concepts, PLL/bus/gating, initialization, IDs/types, driver APIs, debugging, PLL table/formula and specific-clock constraints.
- Source diagrams were mechanically extracted to `assets/`. Chinese page images are linked only from Chinese; English page images are linked from English and Russian.
- Cover legal text, contacts, intended audience and revision history were intentionally omitted. Original PDFs remain unchanged.

## Verification limits and follow-up

- The guide is a Rockchip platform source, not evidence of a measurement on an ArmSoM board.
- Exact CRU/PMUCRU addresses, clock IDs, debugfs nodes, pinmux and parent topology must be verified against the target SoC TRM and released ArmSoM BSP.
- The source names the generic API path as `drivers/clk/clk-xxx.x`; this looks like a source-document extension typo and is retained in article prose as a source path family rather than silently corrected as a file path.

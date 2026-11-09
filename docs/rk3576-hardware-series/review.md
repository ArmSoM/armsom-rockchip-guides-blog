# RK3576 Hardware Design Guide V1.1 — first ten topics

Date: 2026-11-09. Eight new technical topics, two expanded existing URLs, one navigation hub; each in ZH/EN/RU/DE. No original article body, command or image is removed. This is a thematic engineering series, not a complete translation of the 242/265-page guide.

CN/EN sources: RK3576_Hardware_Design_Guide_V1.1_20240528_CN.pdf (242 pages), _EN.pdf (265 pages). Technical sections checked: 2.1.1–2.1.7, 2.2.1–2.2.4, 2.3.4, 3.5.3. Numbering/pagination differ; asset manifest records physical PDF pages. CN uses CN originals, EN/RU/DE share EN originals. Reference-page screenshots supplement editable explanations and parameter tables; they are not substitutes for article text.

## Source discrepancies retained
- NPOR: at least 100 periods at 24MHz vs rounded 4us; 100/24MHz=4.167us. Do not claim exact 4us meets 100 periods.
- PMIC: Figure 2-49 BUCK1–4 inductors 0.22uH versus prose 0.24uH. Both retained; selection unresolved, consult current BOM/vendor.
- DDR PCB introduction: CN 4266bps vs EN 4266Mbps. Unit discrepancy explicitly recorded, no guaranteed product speed inferred.
- PHY VDDQ vs DRAM VDDQ are separate rails, particularly LPDDR4 0.61V PHY / 1.1V DRAM; not treated as a typo.

## Verification boundary
No hardware measurements or tests performed. Specific ArmSoM SDK/BSP/kernel, pin exposure and standby behavior require board-level confirmation. Source reference values are not ArmSoM tests. 16GB is SoC addressing capability, not a universal product SKU. Module input supply is not internal SoC rails. Vendor peak workloads are separate, not summed as concurrent board power.

## Remaining series
Other storage, multimedia, industrial IO and reliability topics remain later work; this batch does not claim all ~30 proposed subjects are complete. No automatic recurring publication schedule is created.

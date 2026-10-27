# Editorial audit — Rockchip RK3588 EVB7 (222)

## Sources and scope

V1.0 Chinese source: 2023-06-20, 44 pages. V1.0 English source: 2023-06-29, 43 pages. The Chinese cover marks draft and the English cover release; this edition does not upgrade their status or claim current hardware support. Product version `RK_EVB7_RK3588_LP4XD200P232SD8_V11_20230428`, glossary, and all four technical chapters are retained. Legal, audience, revision and contents-only pages are excluded. Chinese is the comparison baseline. Russian/German cover all natural prose, headings, figure captions and table labels; electrical identifiers and source model numbers are preserved.

No firmware was flashed, command run on hardware, board wired or hardware validation performed. The added warning requires backups and firmware/board-version checks; the source ban on display/extension-board hot-plugging, ESD precautions and correct power handling remain explicit.

## Restoration and tables

Removed recurring English page headers without removing continuation text. Joined the standby paragraph and MIPI rate sentences split across pages. Restored the Chinese page 16 shutdown sentence, visually verified at the bottom of the page: hold the power key for 6 seconds. Checked all technical lines ending between y=780 and y=788; this was the only missing technical line in that strip.

Seven editable tables are present per language: product version, 34-entry glossary, 22-entry functional interface table, 11-entry I2C device table, two 80-pin signal tables (40 paired rows each), and the 24-pin IMX415 expansion table. Repeated page headers and artificial empty columns are removed; split function-table and pin-table rows are merged in order. All 184 connector pin assignments are preserved, with no inferred changes to signals, NC, voltage labels or undefined `TBD` values. Both language sources have identical signal values; table 3-1 differs only in CDPHY versus DPHY column labels.

All 45 technical image parts per source are retained (90 published assets total), including original chip/system/power diagrams, PCB photographs, installation/debug screenshots and mechanical connector drawings. The page 13 system diagram is a single crop of the complete original, replacing its otherwise fragmented extraction. The mechanical drawing's embedded dimension and option callouts remain in the original engineering illustration; they are not guessed from partial raster labels. These source illustrations include English and Chinese interface labels; Russian/German use the English originals and do not claim localized artwork. Contact sheets and full pin-table pages were visually inspected.

## Source conflicts and documented corrections

- Chinese 1.3.2 and both 3.8 sections describe one SATA port; English 1.3.2 and both functional tables say two. Original values are retained and the conflict is disclosed in all four introductions; verify actual board revision before designing an expansion.
- Chinese display resolution is `1920*1080`, English is `1080*1920`; both describe a 5.5-inch vertical MIPI screen. Values are preserved, not silently normalized.
- Chinese-only MIPI DCPHY overview (two 4-lane DPHY or two 3-Trio CPHY inputs) and the 2.4 board/mating connector models `61082-081402LF`/`61083-081402LF` are explicitly added to English/Russian/German. Chinese has an additional 4.1 heading; English omits it but includes the same safety content.
- English captions 3-10, 3-11 and 3-14 incorrectly say UART, VGA and RS484. Corrected to SATA, DP and RS485 against the Chinese source and actual illustrations. English `Aggreko` housing is corrected to acrylic based on Chinese. English standby wording is clarified as exiting standby using Power, not launching it.
- Source function summary calls the USB3.0 standard-A interface HOST, while table/3.16 call it OTG. AP6398 in the overview versus AP6398S in 3.10, and two SMA connectors versus one supplied antenna, remain source details rather than silently harmonized specifications.
- Source `TPYEC`, `HMI IN`, `DriverAssitant_v5.1.1`, electrical signal identifiers and tool filenames are retained where literal. `800W` denotes the Chinese source's eight-million-pixel shorthand, not watts; translations describe the camera as 8 megapixels where applicable.
- English's power-side TYPE_C instruction in ADB debugging is retained as an English-specific detail. Flashing and terminal screenshots retain their source logs and UI labels; they are examples, not evidence of tests performed for this publication.

Final QA checks source SHA256 hashes, technical page coverage, all 298 translation-catalog entries, every source figure and image hash, table row/pin completeness, source identifiers, four chapter boundaries and exact generator equality. Whole-site rendering is validated separately by the parent publication workflow.

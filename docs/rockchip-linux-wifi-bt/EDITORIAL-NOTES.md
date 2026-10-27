# Wi-Fi/BT editorial record

Source: Rockchip Linux Wi-Fi/BT Developer Guide V7.0.1, 2024-04-16. Chinese 71 pages, English 77 pages. Chinese is the technical baseline. All technical material in chapters 1–10 is retained in four editable Markdown articles under `208-rockchip-linux-wifi-bt`. Chapter 11 is solely FTP contact/login information and is excluded along with cover disclaimers, contact information, audience material, revision history and duplicated contents pages.

## Source hashes

- CN: `74ef87d927eb8555349cc0facf06779e8b05efc278fb88ea046633a7f504802b`
- EN: `e35974076b9cfe55f4530fdc3dcacc10c96a058d9e5a051259194d38250a74fa`

Technical coverage: CN pages 6–70 and EN pages 7–77, plus the preface SoC/kernel matrix. Chinese 104 and English 107 numbered technical headings remain. The English wrapped titles are joined. CN 141 / EN 142 source code fragments are preserved, including scripts, DTS, patches, compilation settings and logs. Original source-language code comments remain unchanged; prose and editable table labels are localized.

## Tables and figures

Each language contains four editable tables: the preface SoC/kernel matrix, external LPO requirements, the six-metric RF example, and the combined 802.11b/g antenna report. The last two are visually transcribed from the source screenshots and retain their original numeric values and empty measurement cells. Eight original technical figures are retained per language; Chinese uses CN originals and EN/RU/DE use EN originals. The English PDF's RF/network-stack/BT illustrations themselves contain Chinese text; using the English original does not imply every image label is English. Existing source masking in the Bluetooth scan screenshot is preserved and not reconstructed.

The RF report's original units contain inconsistencies: spectrum mask is labelled GHz, modulation accuracy has a dB band heading but percentage results, sensitivity is labelled dB, and the maximum input limit is printed as `» -10dBm`. The editable table preserves these source values, not a corrected RF specification. The antenna image says `11MBps` / `54MBps`; these source spellings also remain. Blank cells are not fabricated results. No RF measurements were made for this publication.

## Source discrepancies and cautions

1. English adds heading 2.2.4.1 above the RK3588/PCIE20 correspondence already present in Chinese. Under Chinese 4.8.1, Wi-Fi/BT and antenna are unnumbered items; English promotes them to 4.8.2 and 4.8.3. Chinese 4.8.2 testing methods therefore correspond to English 4.8.4 and its children. Each language retains its source numbering; no material is lost by the mismatch.
2. Source references such as 7.1.1 for SDIO diagnosis, 7.2 for BT troubleshooting and 8.1 for porting appear stale relative to the current chapters. They are retained as source references, with an introductory warning to locate sections by title. Source `Synopsys` is retained rather than silently substituting a company name for Chinese 新思.
3. The SDIO GPIO comment repeats `GPIO_ACTIVE_LOW` for both “Active HIGH” and “Active LOW”. The prose has `reset gopios`, `io_domian`, `udhcpcd`, and conflicting `Bcm44338a1.hcd` / `bcm43438a1.hcd` spellings. These are not treated as validated executable configuration.
4. The IRQ-affinity example writes `5` into `smp_affinity_list` while its comment says CPU core 2. The brcm_patchram example wraps long options and the Makefile snippets are source fragments. Verify against the actual SDK before executing; this edition does not silently repair hardware semantics.
5. English abbreviates chip families in its preface matrix (for example RK356X), while Chinese lists RK3566/RK3568 explicitly for Linux 5.10. The published matrix follows the explicit Chinese baseline. Later 6.1 configuration guidance remains in the technical body; it is not inferred into the preface validation list.
6. SoftAP examples are unencrypted by default; RF/country-code/power and flash-vendor operations are historical development instructions, not certification or production-security approval. Firmware paths, versions, identifiers and source reports are retained. No driver compilation, board testing or command execution was performed.

## Verification

Workspace `work/verify208.py` validates hashes, every technical page, all retained chapters, code-fragment equality, four tables, eight local figure references, raw boundaries and translation mappings. `work/batch-193-222/208/FINAL-QA.json` records the results. There are 315 frozen catalog mappings, including two excluded contact entries and obsolete wrapped-title entries retained for auditability. Site build and navigation checks are handled by the coordinating task.

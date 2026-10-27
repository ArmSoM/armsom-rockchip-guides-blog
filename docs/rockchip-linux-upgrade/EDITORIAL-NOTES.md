# 202 · Rockchip Linux updateEngine Upgrade

## Sources and retained content

- `cn/Linux/Recovery/Rockchip_Developer_Guide_Linux_Upgrade_CN.pdf`, 21 pages; `en/Linux/Recovery/Rockchip_Developer_Guide_Linux_Upgrade_EN.pdf`, 25 pages. Both RK-KF-YF-348 V1.2.0, 2023-03-06. Source SHA-256 values retained in batch inventory; English `ca15a98d0581673f4df69f6197c7121efa1b968b94a15f0291ec78473243bf02`.
- Both technical bodies start page 4. All eight chapters, all source subsections, eight full tables and all code retained. Chinese source has 40 numbered headings, English 39 because SD creation is a separate Chinese 5.1; English includes that content in the chapter introduction.
- Platform table retained as RK3308/Linux 4.4, RV1126/RV1109/Linux 4.19. Chinese baseline, with real Russian/German prose/table translation. Cover/legal/contact/audience/revision history omitted. ArmSoM applicability is a reference, not fabricated hardware testing.

## Source reconciliation

- New differential image must be OTA rather than a full download image: stricter Chinese requirement explicitly incorporated. English uniquely names EXT3 and UBI in unsupported differential cases; these are recorded in Chinese. No differential A/B, encrypted or writable filesystem support is invented.
- Preserved all eight table datasets: implementations, Recovery partitions, A/B partitions, AvbABSlotData, AvbABData, boot-mode comparison, partition bitmask and misc offsets. Transposed the very wide bitmask table into 17 bit/partition rows without changing numbers. Russian/German tables preserve data types, field names and numeric values.
- PDF vector differential diagram was missing from embedded-image inventory; recovered original CN page 8 and EN page 9 at 3x render. Four text fragments belonging to each diagram were replaced by the complete figure plus a localized explanation. Three figures per article: differential flow, A/B boot flow and SD tool.
- English A/B figure adds successful slot_b state absent from the Chinese figure; Chinese prose adds its successful_boot=1, tries_remaining=0, last_boot=1 meaning. Both original figures remain. Chinese SD tool screenshot is v1.53 and English v1.56; source-specific figures retained.
- Source inconsistencies explicitly flagged in every language: non-dual uboot prose versus uboot_a/b tables; OEM no-backup English detail; package-file contents beyond boot/rootfs prose; --version/--vsersion_url versus --version_url; S99bootcontrol/S99_bootcontrol; missing English .mk; misc 2K/4K slot-switching conflict; unsigned char crc32; successful_boot/retry contradictory labels; headless defaults; Log casing; truncated first patch-tree filename.
- English custom-partition array omits closing `};` in the PDF itself. Original excerpt preserved and Chinese closing line added as a separate clearly labeled code block. All source commands/comments/logs remain unchanged; no private HTTP endpoint visited or firmware/device command executed. Warnings cover destructive flash/SD/wipe behavior and avoid universal power-loss/fallback promises.

## Verification, 2026-10-26

- Visually inspected all 46 source pages on contact sheets and all six final assets individually. Corrected a first CN vector crop that omitted the diagram's left inputs; final crop includes both old/new input images, unpacking, diff branches and output.
- Chinese: 36 original code blocks. English/Russian/German: 34 original code blocks plus one explicit closing-line restoration = 35. Source-block byte sequence preserved; page-region comparisons all pass after whitespace/NFKC normalization, zero mismatches.
- Four-language checks: eight chapters, 40/39 source headings, eight tables, three valid images per article. Detailed generated record: workspace `work/batch-193-222/202/article-qa.json`.
- No browser rendering, hardware verification, commit or push performed.

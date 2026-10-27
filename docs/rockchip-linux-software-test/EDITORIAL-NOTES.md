# 200 · Rockchip Linux Software Test

## Sources and scope

- Chinese: `cn/Linux/Profile/Rockchip_User_Guide_Linux_Software_Test_CN.pdf`, 20 pages; SHA-256 `f937bacf14d560c750544f5ed93b76874620f7d1f50fe22b7bca7c5fd0201ca0`.
- English: `en/Linux/Profile/Rockchip_User_Guide_Linux_Software_Test_EN.pdf`, 14 pages; SHA-256 `92c5ed4878b55dadc429f0380ad766e5ca87ae14eae2965c6a1c2be113542b53`.
- Both RK-SM-YF-352, V2.0.2, 2024-05-16. Chinese technical baseline; all five technical chapters retained. Cover/legal/contact/audience/revision history omitted. Planned chapter 5 remains explicitly planned, not invented implementation.
- Source content starts Chinese page 5 / English page 4. Sections 1.1–1.2, 2.1–2.4, 3.1–3.4, 4.1–4.3 including all nine 4.2.5 tests and 5.1–5.2 are retained. English-only file search 1.1.9 is included in Chinese as a separately marked addition.

## Translation and reconstruction

- Russian/German prose and headings are fully translated; raw code comments, script menus, diagnostic output and identifiers remain source material. Chinese scenario paragraphs initially classified as code were moved to prose and translated. English page 14 clips both scenario sequences; Chinese page 20 supplies the complete content, with explicit notes in every language.
- Reconstructed the fdisk example as readable fixed-width output, preserving all eight partitions, offsets, sizes and UUID. Its surrounding explanatory text is localized separately. Reconstructed all ten stressapptest options as a localized table; false defaults are corrected from the Chinese mistranslation “wrong.”
- Preserved source command bytes and annotated defects rather than silently rewriting examples: /tmp/isp.yuv versus /tmp/cif.yuv; typographic dashes in arecord/free; misleading audio-format examples; missing spaces in English xrandr/aplay commands; DP-1 versus actual DSI-1; CPU menu numbering contradiction; DDR paragraph mislabeled CPU; CPU Hz/KHz mismatch; rockchip-test versus rockchip_test directory spelling.
- Prominent warning covers destructive raw-partition dd writes, flash erasure, recovery wipe all and broad killall bash. No commands, credentials, flashing or device tests were executed. No ArmSoM hardware compatibility or validation is claimed.

## Verification, 2026-10-26

- Visually inspected source contact sheets covering all 34 pages and all four exported technical figures individually. Both languages supply SD firmware-tool and PulseAudio screenshots; English PDFs themselves contain Chinese UI screenshots, retained as original evidence. Chinese articles use Chinese assets; English/Russian/German use English assets.
- Chinese retains 52 genuine source code blocks, plus reconstructed fdisk and English-only find = 54. English/Russian/German retain all 54 English code blocks plus fdisk = 55 each. All original code regions matched extracted page text after whitespace/NFKC normalization; no mismatches. Scenario prose is deliberately excluded from code parity.
- Verified five chapters, nine detailed test subsections, ten parameter rows and two valid local images in each article. Four-language code comparison passed. Full generated results: workspace `work/batch-193-222/200/article-qa.json`.
- No browser/site rendering or physical-device test was performed. No commit or push.

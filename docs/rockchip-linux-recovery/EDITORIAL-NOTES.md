# 201 · Rockchip Linux Recovery

## Sources

- `cn/Linux/Recovery/Rockchip_Developer_Guide_Linux_Recovery_CN.pdf`: 21 pages, SHA-256 `cfeed0a8ae707baf6e5f651ee16b2c5dd52cb50e5e1f6d5e284fb5fd34a5c358`.
- `en/Linux/Recovery/Rockchip_Developer_Guide_Linux_Recovery_EN.pdf`: 23 pages. Exact hash retained in batch inventory.
- Both RK-KF-YF-353 V1.2.1, 2021-07-30. Original platform table retained in each article: RK3308/RK3226/RK3399/RK3288/RK3326/PX30, Linux 4.4. Not a claim of testing on ArmSoM.
- Chinese technical baseline. Technical content begins Chinese page 4 and English page 5; cover, legal/contact/audience and revision-history matter removed. All four chapters and five FAQ subsections included, not summarized.

## Reconciliation

- Chinese explicitly explains the internal recovery → rkupdate call and common blank-misc/wipe_all-misc choices; added to other languages. English adds explicit headless RK3399/RK3288 applicability and splits final SD startup steps; retained. No significant separate English-only technical chapter.
- Both sources contradict themselves about default UI: section 2.2 says headless; FAQ says UI on except RK3308. Each article explains actual configuration must decide.
- Other tracked defects: missing make in English rebuild prose; mkimage.sh versus mkfirmware.sh; broken English final build-command spacing; reocvery.c typo; fstab defaults0 concatenation; English Esac; Log/log; diagram mis/wip_all. Raw source code retained, corrections contextualized rather than silently changing examples.
- Chinese says comment out wipe_all branch, English says remove it. Screenshot uses erase_volume(userdata) and resize_volume(oem), not identical formatting actions. This distinction and data-loss consequences appear in every language. No device command executed.
- misc structure figure values expanded in prose: 1088 total bytes, 32/32/768/256 fields, RK3308 offset 16384. UART examples retain UART2 0xff550000 / UART1 0xff540000, loader UART ID/IOMUX and kernel rockchip,serial-id coupling.

## Verification, 2026-10-26

- All 44 source pages inspected on contact sheets; all 13 English technical crops inspected individually, including the OTA flow, misc layout/hex data, UI build flags, wipe_all branch and UART examples. Chinese counterparts checked against source sheets. 26 assets retained, 13 referenced per language. Chinese uses CN figures; English/Russian/German use EN figures, even where the English original itself contains Chinese UI or annotation.
- Four articles each contain 27 numbered source headings, four chapters, all five FAQ sections and exactly 37 source code blocks. Code blocks match their respective source-unit sequence byte-for-byte; all source-region checks passed after whitespace/NFKC normalization, zero mismatches. Russian/German prose/headings/captions are translated; code comments, literal menus, identifiers, logs and original screenshot content remain source material.
- All local image links and dimensions passed. Generated detailed results: workspace `work/batch-193-222/201/article-qa.json`. No site/browser rendering or hardware/flash testing performed; no commit/push.

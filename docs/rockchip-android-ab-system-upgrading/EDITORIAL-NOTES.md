# Android A/B upgrading editorial audit

The technical applicability table on source page 2 is also retained as an editable table: RK3326/RK3399/RK356x/RK3588, kernels 4.19 and 5.10. It states historical source scope.

Chinese RK-SM-YF-208 V1.2.0, 2023-10-29, 12 pages. Complete six chapters from technical pages 4–12 in ZH/EN/RU/DE. Historical Android >=12 applicability and Android 12/13/>=14/virtual-A/B recommendations retained, not represented as current compatibility guarantees. No English source or English original figures. Eight independent Chinese-source original figures retained in every edition; no whole-page surrogate screenshots.

All prose and original code retained, including seven formerly prose-classified configuration/partition blocks restored to code. Original BoardConfig patch contexts and line wraps remain, not claimed ready-to-apply. Editable transcriptions accompany both fstab screenshots, U-Boot diff, 13 visible RKDevTool address rows, and all visible status/progress log lines. Incomplete/clipped screenshot paths and ambiguous hashes are not invented; original figures are authoritative. Example screenshots are historical source sessions, not tests performed for this publication.

Disclosed source conflicts: Android12/13 example points to rk3399_Android11; installcelan spelling; generated update_loader.zip versus pushed update.zip; typographic dashes in make options; exernal_sd spelling and differences between prose partition list and fstab image. Miniloader update is explicitly discouraged in the source; production recovery, backup, partition/firmware matching and authorized-device warnings added in every language. The adb echo quoting is retained as visible in the source, not executed.

All twelve pages and all eight individual original images visually reviewed. Source hash unchanged, all text/code units retained after whitespace normalization, page-bottom lines checked, article/image counts and file links verified. No build, flash, OTA or hardware test performed. Machine audit: work/batch-231-250/246/FINAL-QA.json in the authoring workspace.

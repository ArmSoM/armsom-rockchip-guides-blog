# 203 · Rockchip Linux Secure Boot

## Sources and coverage

- RK-KF-YF-379: `cn/Linux/Security/Rockchip_Developer_Guide_Linux_Secure_Boot_CN.pdf`, V4.1.1, 2025-04-16, 44 pages, SHA-256 `e94b318f163098352a4af403791c5850b3970ee8699da025f79373e60b062a10`; `en/Linux/Security/Rockchip_Developer_Guide_Linux_Secure_Boot_EN.pdf`, V4.0.0, 2024-01-11, 40 pages, SHA-256 `6960a3eb906e29107a490d6c24f369fdb04a7eaf86bff2eaf5342fa3bd2bebc8`.
- Both technical bodies start page 6. Chinese preserves all nine chapters. English/Russian/German preserve the entire seven-chapter English body and explicitly append the newer Chinese technical additions and replacement configuration. This is not a claim that English V4.0.0 already contains the newer sections.
- Seven-row updated platform table retained in every language. All primary text/headings are present; Russian/German prose and tables are translated, not English placeholders. Identifiers, code comments, original log text and figures remain source material. Cover/legal/contact/audience/revision history removed; code-internal copyright/licensing and commit identity retained.

## New Chinese content and differences

- Key types/storage/provisioning table; FIT rkbin setting and expanded OPTEE/OTP/key-ladder configuration; RV1126B public-key revocation procedure; AVB Security-partition warning; filesystem-support comparison and UBIFS/UBI_SQUASHFS restrictions; Security partition minimum 1M and half-partition backup; tee_user_app build-error diagnosis and errexit patch; TEE strength and SDK references; third-party rootfs handling; user-partition encryption/verity; RK3506 TRUST/reserved-memory setup; RV IPC constraints; expanded references.
- Updated code includes RSA `$(pwd)/keys/` output, `security-createkeys`, Kernel loop/crypto userspace options and pre-6.1 CRYPTOLOOP qualification, ramdisk TEE variants, rootfs mount patch, Debian image handling and user partition examples. Original English code remains labeled by source version; 21 Chinese source code blocks are added to each non-Chinese article.
- English storage table's RK3288 entry is historical, not invented new-platform support. Its forced-Security-erasure failure claim is explicitly reconciled with Chinese reinitialization/data-loss and possible AVB lock-reset warning. Security is not represented as equivalent to authenticated RPMB.
- Chinese page 21 incorrectly became a duplicated two-cell table during extraction; the original is one Generate AVB Keys command block, restored once. Genuine technical tables: Chinese storage/key/comparison plus platform; non-Chinese old comparison/storage plus newer key/comparison/platform.
- Chinese inline-style extraction reordered some identifiers and prose. Restored logical placement in FIT arguments, individual-signing patch, AVB metadata/keys, fastboot buffer, partition and locking explanations; original code unchanged.

## Source defects and safety boundaries

- Explicitly marked AVB IMAG/IMAGE mismatch, `get_from_parameter` placeholder, recovery `--partition_name boot`, duplicated script name, duplicate `security_system.img/security_system.img`, relative build.sh after changing directory, user-verification vroot/userdata mismatch, and PDF-wrapped commands. Never executed source commands.
- Public root-hash terminology distinguished from secret encryption keys. AES-CBC example lacks authentication, so the source's anti-tamper wording is not elevated into a cryptographic-integrity guarantee. RSA diagram's historical Encryption/Decryption labels are not treated as a signature/padding specification.
- Key-table EFUSE and SPL labels do not override chip-specific physical programming layouts or PC-only eFuse requirement. OTP/eFuse irreversibility, permanent locking, production-secret replacement, historical pip/pycrypto commands and platform-specific TEE requirements are called out in all languages.
- ArmSoM use is a platform reference, not fabricated board validation; source circuit diagrams are not electrical sign-off.

## Verification · 2026-10-26

- Inspected all 84 source pages using six contact sheets; examined the eleven English technical crops individually, with corresponding Chinese figures checked against their source pages. All 22 original assets are retained: signing/boot chains, AVB key flow, mapper system, hash tree, key migration, ramdisk flow, OTP/eFuse circuits, burn tool and security menu.
- Chinese: 69 extracted code blocks plus one restored AVB block = 70. English/Russian/German: 53 original blocks plus 21 newer Chinese blocks = 74 each. Exact article code sequence equals its source-unit sequence; all primary source page-region comparisons pass after whitespace/NFKC normalization, zero mismatches.
- Automated checks verify every primary prose/heading unit, every selected translated supplement, chapter coverage, 4/5 genuine tables and 11 valid figure links per language. Detailed generated evidence: workspace `work/batch-193-222/203/article-qa.json`.
- No browser rendering, firmware flashing, OTP/eFuse programming, hardware validation, commit or push performed.

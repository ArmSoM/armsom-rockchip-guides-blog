# Debian editorial record

Source: Rockchip Developer Guide Debian, V1.8.0, 2024-09-20. Chinese 67 pages; English 72 pages. The Chinese source is the structural baseline. All 11 chapters and 139 numbered headings are retained in Chinese, English, Russian and German. Technical body coverage is CN 7–67 / EN 6–72, plus the preface platform/validated-SoC table from page 2. Four articles use the translation key `205-rockchip-debian`.

## Source identities

- CN: `Rockchip_Developer_Guide_Debian_CN.pdf`, SHA-256 `9cc9d3d989510976be5dbb84da4c9f2df33a217c413eb58922823709861544f8`.
- EN: `Rockchip_Developer_Guide_Debian_EN.pdf`, SHA-256 `c7d71952a12a5f979b1edc29a2bbfa527bd6d1f277ac1169719d1b5eaedde20d`.

## Retention and scope

Each article contains six editable tables (including the preface SoC matrix), the original libdrm architecture figure, commands, patch listings, directory trees, configuration fragments, logs, C test and all FAQ subsections. Chinese uses the Chinese original image; the other languages use the English original. The source hyperlinks are retained in an appendix; unusable `af://` authoring anchors are not published. Copyright/disclaimer/contact matter, audience descriptions, revision history and duplicated PDF contents pages are removed; chapter 10's technical open-source licence reference is retained.

All 489 catalog entries have Russian/German mappings. Superseded catalog strings remain frozen for auditability and are not rendered. Technical identifiers, command output, source comments and literal configuration values are not translated. Source page/unit comments provide traceability without displaying PDF pagination as article prose.

## Source discrepancies and repairs

1. English pp. 58–60 put FAQ headings 9.3, 9.4, 9.5 and its four subheadings inside malformed Markdown code boxes. English p. 64 similarly embeds 9.14–9.17, and p. 70 embeds 9.26–9.28. These are source-PDF errors verified against the Chinese hierarchy, not omitted content. Heading and prose boundaries are restored. Later English headings are renumbered to match Chinese. English 0.19/0.20 and final 1/2 become 9.29/9.30 and 10/11.
2. The English mirror-source diff lost line continuation backslashes and line breaks; SSH command lost its username; XDG_SESSION_TYPE commands and parted output were flattened; rc.local shell comments became C comments and the shebang disappeared; Buildroot and apt download examples lost placeholders. These damaged English examples are restored from the corresponding Chinese code. No SDK commands were executed to claim validation.
3. The English DRI2 C example is divided across pages and mixed with the prose “Compile and test”. These boundaries are separated without changing the code. The source `@ -2,6 +2,9 @` hunk spelling in the split-screen example is retained as supplied, not represented as a validated patch.
4. Version support and roadmap tables retain historical source values: Debian 10 is labelled under maintenance and Debian 12 in development despite the document's 2024-09-20 date. The two source tables also give different granularity for Stretch EOL (2022-06 versus 2022-07-01). These values are not silently updated or presented as current lifecycle advice.
5. English “binary auto-insertion” in the JPEG parser description refers to `parsebin` autoplugging, supported by the source patch `0012-gstjpegparse-Allow-parsebin-to-use-it-for-autopluggi.patch`; Russian/German name parsebin explicitly.
6. Source spellings `vvp8enc`, `-no-sandbox` versus `--no-sandbox`, varying Padding coordinate orders, old paths and package versions are preserved rather than harmonized without SDK evidence. The body reproduces the source's root-without-password and linaro credentials; the introduction explicitly limits these to the historical development environment and warns against using them unchanged in production.
7. Inline Chromium version and RKAIQ diagnostic examples are additionally formatted as code for readability. All original prose remains available in its target language. Shell examples, including destructive/reboot/install operations, are documentation only.

## Verification

Source hashes, page coverage, all 139 numbered headings, all six table shapes, all source code fragments, local images, raw boundaries and complete translation mappings are checked by `work/verify205.py`; details are in the workspace `work/batch-193-222/205/FINAL-QA.json`. This is document QA, not hardware, SDK compilation or runtime validation. Site-wide build and navigation validation are performed separately by the coordinating task.

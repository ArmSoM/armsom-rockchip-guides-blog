# RKADK V2.3.2 source and editorial record

The supplied Chinese and English editions are both dated 2025-08-04. Chinese is the technical baseline. The article contains the 14 technical chapters, declarations, type definitions, parameter/member/return tables, INI examples, and all 11 example-program sections. The introductory SoC/kernel table is retained. Cover disclaimers, contact details, intended-audience and revision-history material are excluded.

## Sources

| Edition | Pages | SHA-256 |
| --- | --- | --- |
| Chinese | 211 | `17f6ede57417e7e6581d3196baf48d49bbce7b9284d6b2ed733480d879e1227b` |
| English | 214 | `3b1a9322bf6a145b5891527d422339a4747e6ecf15444b614c7092f775a62b82` |

Both editions start their technical body on PDF page 12. Their platform matrix lists RV1126/RV1109 with Linux 4.19; RV1106/RV1103 and RV1103B with Linux 5.10; RK3576 and RV1126B with Linux 6.10. The INI sample's internal version is preserved independently of the document version.

## Edition differences and source defects

- Chinese chapter 3 has Overview 3.1, API Reference 3.2 and Data Types 3.3. English leaves the overview unnumbered and uses 3.1 and 3.2 for API/types. The corresponding numbering is retained rather than falsely matching equal section numbers.
- Chinese 3.3.6 is headed `RKADK_MUXER_MANUAL_SPLIT_ATTR_S`; English 3.2.6 is headed `RKADK_REC_MANUAL_SPLIT_ATTR_S`. The structure definition itself ends with `MUXER_MANUAL_SPLIT_ATTR_S`. The following manual-split enumeration ends with `RKADK_MUXER_MANUAL_SPLIT_ATTR_S`, despite being introduced as a type enumeration. These are source inconsistencies; actual SDK headers are needed to resolve them.
- English PDF page 17 visibly joins `RKADK_STREAM_TYPE_EenStrmType` in the declaration of `RKADK_RECORD_Single_Stop`. It is preserved and explicitly flagged in all four introductions.
- Chinese wrapped declarations on PDF pages 49 and 147 separate `RKADK_MUXER_THUMB_INFO_S` / `stThumbInfo` and `RKADK_SORT_TYPE` / `sort` across lines. Their spaces are restored from source line boundaries. This is extraction repair, not an API change.
- Source spellings such as `RKADK_MUXER_Disbale`, `librokadk.so`, `RGBA9888`, the duplicated player platform `RV1103/RV1103`, and the RTMP subsection heading `RKADK_RTSP_VideoReset` are retained. Do not interpret these as independently validated SDK identifiers or support claims.
- Original code, commands, declarations, INI values and code comments remain source material. Russian and German prose, table descriptions, labels and chapter headings are translated; code identifiers are not translated.

## Figures and reconstruction

The AOV diagram is the only embedded technical illustration in the extracted body. The Chinese article uses the Chinese-source crop; English, Russian and German use the English-source crop. Figures are cropped directly from the original PDF render, retaining labels and linework. Code and tables are editable Markdown, not page screenshots.

API labels are separated from descriptions and declarations. Cross-page tables retain all rows and receive a repeated header when necessary; cross-page adjacent code fragments are joined. Small-font fourth-level API headings in chapter 8 are restored as Markdown headings. Source page line boundaries are used to avoid joining independent identifiers.

Visual review covered the English body contact sheets and enlarged pages containing the API-spacing discrepancies, manual-split typedefs, and continued type definitions; selected Chinese declaration pages were checked at full-page size. This is not a claim of character-by-character visual proofreading of all 425 pages. Automated checks separately cover source hashes, all technical-page units, chapters, tables, code and localization coverage.

No board commands, builds of SDK examples, or hardware tests were executed. ArmSoM applicability must be checked against the specific board, SoC, SDK/BSP, kernel and peripherals.

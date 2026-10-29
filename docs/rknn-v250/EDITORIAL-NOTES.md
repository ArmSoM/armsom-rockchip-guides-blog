# RKNN V2.5.0 editorial record — 2026-10-29

Current delivery: the remaining seven PDF topics have been split into 87 article parts / 348 ZH-EN-RU-DE pages. File review and independent spot checks are complete. Final Jekyll build, all 384 series-language HTTP/SEO checks and representative mobile/desktop browser checks passed; see LOCAL-PREVIEW-QA.json and DELIVERY-REPORT.md. No commit, push or deployment.

Detailed source coverage and corrections: root-three-topics-proofreading.md (RV1106, SDK QuickStart, Lite2), api-reference/EDITORIAL-NOTES.md (Toolkit and Runtime APIs), operators-proofreading.md (supported operators), and the SDK-guide proofreading record. Original PDFs remain unchanged. Platform and source-code uncertainties remain explicit; no ArmSoM hardware test is claimed.

The entries below are historical progress notes and do not describe the current completion count. STATUS.json is the current catalogue.

---

# RKNN local document series — work in progress

Input directory: `D:/ArmSoM/chatgpt-ai-work/github/rknn-toolkit2/doc`.

The inventory contains 16 PDFs (1,505 pages) and 3 Markdown files covering 10 topics. PDF filenames identify V2.5.0. Markdown files have no independent version number. Original source files have not been changed. Source hashes are recorded in SOURCE-INVENTORY.json.

## Completed local article text

- `rknn-toolkit2-wsl`: full Chinese and English source content; Russian and German translated from English. Original commands and placeholders retained. No source figures exist.
- `rknn-server-proxy`: source chapters 1–4, environment, deployment and mini-runtime.
- `rknn-server-logging`: source chapter 5, platform-specific logging and reset instructions.
- `rknn-server-troubleshooting`: source chapter 6, all six FAQ cases.

The proxy series has Chinese, English, Russian and German versions. There is no English source for this Markdown document: all translations derive from the supplied Chinese source. It has no source figures. The three parts preserve all 45 fenced code blocks in their original order in each language. Series links connect the three actual pages in the same language; the website's existing top language switch remains the only language switch.

## Corrections and unresolved source issues

1. Proxy source chapter 1 says librknnrt.so is not applicable to non-RV1103/RV1106/RV1103B platforms. This contradicts the later deployment instructions. The Chinese wording is preserved and explained in every language; it was not silently reversed.
2. Proxy FAQ 4 uses `/usr/bin/rknn_server`, while section 4.3 uses `/oem/usr/bin/rknn_server`. Both source paths remain; users must check the actual SDK installation.
3. Corrected the mini-runtime section's heading level (4.4 under chapter 4).
4. Repaired a malformed opening fence containing `adb shell "killall rknn_server"`. The same command already exists in the body of the block; the command body is unchanged.
5. WSL's last fenced block contains numbered explanatory labels. They are retained, and the article explains that these lines are not shell commands.
6. The source claims WSL2/Ubuntu 22.04 was verified. This is attributed to the source, not ArmSoM testing. Package availability and adbkit executable availability still need validation on the actual host.
7. Root remounting, Runtime/adbd replacement, restarting services/devices, and `setenforce 0` remain original examples, not ArmSoM production recommendations.

## Remaining PDF work

All 16 PDFs have page text and visual contact sheets. Structured extraction includes text, code candidates, tables and cropped source figures. The operator manuals use unnumbered headings; their extraction entry was explicitly corrected to Chinese page 22 and English page 23, excluding their TOCs and revision histories. Extraction is not proof of complete proofreading or translation.

Seven PDF topics still require chapter-based splitting, layout correction, complete four-language translation and figure QA; RK2118 is now completed as documented below. In particular, numbered bold steps must not be mistaken for top-level chapters, and wrapped commands, captions and headings must be rejoined against the source. The seven pending PDF topics have not been presented as completed blog translations. Existing V2.3.2 articles remain untouched apart from the separately prepared homepage product associations.

No commit, push or deployment is authorized by this preview task. The user's confirmation is required before publication.


## RK2118 hardware article progress

`rknn-v250-rk2118-hardware` now covers source chapters 1–2 (PDF pages 4–7) in all four languages. This is only part 1 of the RK2118 guide, not completion of the full PDF. Chinese preserves all 35 extracted units; English/Russian/German cover all 32 English units. The Chinese table and connection-step detail are retained in Chinese. English-based translations record the Chinese-only flashing-port wording explicitly. Five Chinese and five English source figures were extracted independently, visually inspected as a contact sheet, and copied without changing the source PDFs. Russian/German use the English figures. No ArmSoM board association is asserted for RK2118.

The proxy Android-path table needed a blank line after its heading for Kramdown to render it correctly. This is corrected outside fenced code in all article files and the split source backups. Code contents remain unchanged.


## Local verification

The full Jekyll build succeeded. Twenty current pages passed HTTP 200, search-index inclusion, exactly one sitemap entry per URL, self-referencing HTTPS canonical, and corresponding language-link checks. All five figures per RK2118 page resolve in the built site. Browser inspection verified the collapsible TOC and jump to section 2.3. A final formatting correction converts the three image-group labels into explicit numbered bold labels so isolated Markdown lists cannot restart at 1. Full mobile and wide-screen checks for the entire planned PDF series remain pending, along with the unfinished PDF translations.


## RK2118 chapters 3–7 completed (2026-10-29)

Four further parts (host environment, RT-Thread/DSP firmware, model/demo, Docker/FAQ/references) now preserve every remaining source unit in all four languages. The source-unit ledger covers CN units 35–195 and EN units 32–195 without gaps; it includes merged page-wrapped paragraphs and headings. Russian and German translate every prose unit from the English source and preserve its corrected code blocks. The five parts link mutually in each language. Together they cover all seven technical chapters of both 17-page PDFs; frontmatter and revision history are excluded as requested. All five source figures remain in part 1; no technical figures occur in chapters 3–7.

Repairs are recorded in rk2118-extraction-repairs.json. Joined PDF-wrapped Miniforge URLs, wheel filenames, repo init arguments and English comment continuations. Rejoined headings and cross-page prose. Restored the space between ./mkimage.sh and board/evb1_v20/package-file in Chinese extraction. Original command options, register/address examples, data sizes and log values are unchanged. Source pages EN 9/10/11/14/17 and CN 11/12 were rendered for command/firmware proofreading.

Section 5.3 incorrectly refers to 3.1 for downloading RT-Thread; the actual instructions are 3.3.1. The Docker mount is /rt-thread but its following cd uses a relative rt-thread/... path. Both issues are explicitly noted in every language rather than silently altering the original examples. The original installation commands are unpinned and may install a different version; no package or hardware test was performed. Source performance logs are identified as source measurements, not ArmSoM tests.

Remaining source PDF topics: RV1103/RV1106 quickstart, general SDK quickstart, SDK development guide, Toolkit Python API, Toolkit Lite Python API, Runtime C API, and supported operators/constraints. These seven topics remain incomplete.


Final local verification on 2026-10-29: Jekyll build succeeded after list-format corrections. All 36 current language pages pass HTTP, search, sitemap, canonical, language correspondence and series-link checks. Browser verified Chinese-to-German switching and the German model-conversion TOC jump. Full narrow-mobile and wide-screen visual verification of the unfinished seven PDF topics remains pending. No commit or remote write was performed.

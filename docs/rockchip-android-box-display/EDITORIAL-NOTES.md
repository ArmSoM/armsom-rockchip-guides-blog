# Source and editorial review

RK-SM-YF-504 V1.0.1, Chinese only, 12 PDF pages. Technical product scope from page 3 and full body pages 5–12 retained in four languages. Six independent original technical images retained; no English-source figures exist. All pages visually reviewed.

Resolution table continuation, disp_info and drm_display_mode page continuations, all enums/flags/structures and final FAQ are preserved. PDF-wrapped enum comments and BoardConfig assignment joined. CLI options from help screenshot are transcribed as well as retaining the original. Overscan CLI order differs from struct order. The layout diagram's lut_data size label is retained with an ABI-verification caveat, rather than silently resolving the discrepancy against the source struct.

The -R 2 example resets both user and backup data; destructive effect explicitly explained but commands not executed. Historical SDK scope is not ArmSoM testing or support verification. Cover dates/legal/contact/audience and revision table removed. No site build, commit or push.

## Final integration corrections

The preceding build status describes the source-authoring stage. Batch build/HTTP evidence is recorded in ../batch-251-260/DELIVERY.md. Subsection headings now follow their numeric depth and the duplicate body title was removed. The prose command `logcat | grep BP` is escaped for HTML so its pipe cannot create a spurious Markdown table; `<resolution>` and `<path>` are rendered as literal inline code. Fenced code is unchanged. Final article hashes are in the batch SOURCE-FINAL-QA.json.

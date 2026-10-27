# Source and editorial audit — 211

The Chinese and English RK-YH-YF-801 V1.1.8 originals dated 2025-10-24 contain 41 and 44 pages. Chinese is the baseline; English-only technical details are retained. Russian and German translate the complete technical prose, headings and editable form fields, while commands, logs and identifiers retain their source spelling. No account application, command execution, download or hardware validation was performed.

## Scope and security

Technical chapters 1, 2, 3 and 5 retain their numbering. Cover/legal, audience and revision pages, and chapter 4's pure contact/complaint information are excluded. Approved original screenshots and six vector-flowchart crops are preserved; two contact-only screenshots are excluded and contact footers on two technical screenshots are cropped. Remaining account data was already blurred or belongs to empty forms in the source. Chinese originals serve Chinese; English originals serve English, Russian and German. The latter still contain Chinese/bilingual interface labels; they are not represented as localized screenshots.

The instructions distinguish public keys from private keys and credentials. The source backup command archives the entire `.ssh` directory, not just public keys. Added warnings cover protecting that backup, independently verifying host fingerprints, passwordless keys, `StrictHostKeyChecking no`, deleting repositories, overwriting and `--force-sync`. The source's risky commands are historical examples, not commands executed during publication.

## Tables and extraction repairs

The gray SDK matrix is an editable 143-row table, reconstructed from each source, rather than an image or code block. Merged chip cells are filled down and repeated source rows remain repeated. Recommendation stars and SDK names are source records, not a claim of current support. The four bilingual differences are annotation wording: IPC/CVR punctuation, RK628 third-party designation and two XMM entries marked no further updates. These annotations are translated, identifiers preserved.

The source's duplicate RK3576M Android 14 car entry, PX3SE identifier ending in `/td>`, and RK3562 group containing an RK3528 identifier are retained rather than guessed corrections. The SDK request form remains editable. Flowchart label extraction is replaced by the original vector crops, not a speculative reconstructed process. Floating `id_rsa` and `sync` tokens are restored to their sentences, PDF line-break splits in domains/paths joined, and the matrix introduction's lettered points separated.

## Bilingual differences and source defects

- English says three authorization files but lists two; the Chinese count of two is used.
- English 1.2.2 incorrectly names base packages; the Chinese direct-server-synchronization title is used.
- Linux tool directory follows Chinese `tools`, not English `Tools`.
- English adds RK1808 to ToyBrick support; it is retained in every language.
- Chinese 5.1's key-management guidance is added to English and its translations instead of losing it to the English duplicate authorization text.
- English's public-key mail illustration actually depicts Redmine activation; the corresponding original is retained and its mismatch disclosed.
- Release-note screenshot commands are horizontally truncated in the source; their missing tails are not invented and the screenshot is not presented as executable code.
- Literal code preserves English `ssh-keygen`'s Markdown email link, en-dash `–p` options, `•` in gitconfig and the filename `id_ras_backup.tag.gz`. These are flagged in each article rather than silently fixed. Source domain spelling defects remain source evidence, not verified destinations.

The publication audit checks input hashes, source-page coverage, all translated catalog entries, every code fragment, both editable tables, image existence and approved-image hashes. Website rendering is checked separately by the parent publication workflow.

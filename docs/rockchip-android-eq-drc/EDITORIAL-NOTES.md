# Editorial audit — Android EQ/DRC (232)

Chinese-only RK-KF-YF-774 V1.1.0, 2024-06-19, eight pages. All three chapters and 19 headings are preserved, including dynamic/Stream HAL binding, registration/binding diagnostics, binary filenames, directory search priority, app APIs, presets and the complete PC tuning workflow. The historical all-chip/all-kernel applicability statement is retained. Legal/contact, audience, revision and duplicate contents are excluded.

There are no source bitmap figures or technical tables. All 19 code fragments are editable; the page 6/7 Java example is joined into one block, yielding 18 blocks. UUID and two wrapped Java comments are restored without changing their characters. All eight pages were visually reviewed. Source comments, logs, API names and filenames remain literal; 48 natural-language entries have complete English/Russian/German translations. No English original illustrations are claimed.

The source says “two commands” but lists three, including `adb shell setenforce 0`; all three remain, with a warning to restrict use to authorized userdebug devices, preserve parameter backups and restore SELinux enforcement after testing. Source variable-name differences `equalizer`/`mEqualizer`, `channnel`, binary preset filenames and preset IDs are retained. No commands or audio/hardware tests were performed.

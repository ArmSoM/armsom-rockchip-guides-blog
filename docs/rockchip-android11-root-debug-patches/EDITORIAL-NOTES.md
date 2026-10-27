# Android 11 root patch editorial audit

Source android11_root.pdf, three pages, no language suffix. Actual instructions are Chinese. No stated document version/date, English source, images or tables. All four original steps and five patch excerpts retained as editable text with five separate source paths. Every extracted source line is checked after whitespace normalization, including the line at page 2 bottom 798.7 and continuation on page 3.

All three pages visually reviewed. Original patch context remains incomplete and PDF line wraps retained, including the truncated su.cpp function context and commoncap.c final fragment. This publication is source documentation, not a validated directly applicable patch or complete root implementation. Source PDF hash unchanged; patches/builds/hardware tests were not executed.

All languages explicitly describe security degradation: SELinux enforcement disabled, su caller restriction removed, su mode 06755, Zygote bounding-set reduction skipped, kernel capability permission/argument checks commented. Restricted to owned/authorized isolated userdebug laboratory devices; not production/networked/sensitive-data devices. Restore original security policy and image after experiments. Machine-readable audit: work/batch-231-250/236/FINAL-QA.json in the authoring workspace.

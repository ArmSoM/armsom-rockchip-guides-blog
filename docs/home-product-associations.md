# Homepage product associations — 2026-10-28

Source: https://docs.armsom.org/ and the product documentation linked from that catalog. CM3 and AIM3 use RK3568; CM7S and Sige7S use RK3588S; CM1 and Forge1 use RK3506J. Sige6 is Allwinner A733 and is deliberately not linked to Rockchip-only guides.

The existing board section contains 18 boards/modules/platforms and links to 9 carriers/accessories. Six cards are initially visible; remaining cards and accessories use native expandable sections. No new navigation entry or product landing page was added. All four languages share the product inventory.

`reference_products` is an editorial association to a platform reference, separate from the pre-existing `products` field. It does not certify a hardware test, exposed connector, SDK image or feature. Homepage counts and library search combine both fields without duplicates; article body and existing product assertions remain unchanged. The homepage and library explain the association scope in all four languages.

Initial reference selection (article numbers):

- RK3588 / RK3588S / RK3576: 089–096, 129, 130, 145, 195. Shared software/NPU/media references; check actual SDK, driver and SoC support. No RK3588 PCIe/interface equivalence is asserted for RK3588S.
- RK3568: 089–095, 129, 130, 145, 152, 167, 195. No RKLLM association.
- RK3506J: 151, 192. Suspend and LVGL platform references; OpenGL sections do not imply GPU support on RK3506J.
- RK3308: 023, 149, 178, 181. Audio and suspend references.
- RK3528: 089, 195. Media-framework references, not a guarantee of every codec or pipeline.
- Allwinner A733: official documentation only.

Carriers and accessories link directly to their official documentation. They are not treated as independent SoCs or given inherited compatibility claims. CM7S-IO links to the CM7S documentation which presents the kit.

The featured/editor's-picks block was removed from all homepages. Task shortcuts, projects, topic categories, latest articles and learning paths remain available.

No original PDFs, article bodies, verification files, robots directives or canonical/hreflang rules were changed. This change is prepared for local review; it has not been committed or deployed.

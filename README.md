# ArmSoM Rockchip Guides

Practical Linux, edge AI, and embedded development guides for **ArmSoM single-board computers and system-on-modules**, with a focus on Rockchip RK3576, RK3588, and related platforms. Find a starting point for board bring-up, Device Tree configuration, camera and display pipelines, driver debugging, and product integration.

面向 ArmSoM 开发板与核心板的瑞芯微 Rockchip 技术指南，涵盖 Linux、边缘 AI、设备树、硬件接口及驱动调试。可通过博客按主题搜索，也可直接阅读本仓库中的 Markdown 源文。

[Read the blog](https://blog.armsom.org/) · [中文文章目录](https://blog.armsom.org/zh/library/) · [ArmSoM documentation](https://docs.armsom.org/) · [Explore ArmSoM hardware](https://www.armsom.org/)

## Find a guide for your task

The [article library](https://blog.armsom.org/library/) supports search, topic and product filters. The [learning paths](https://blog.armsom.org/learning-paths/) connect guides into practical development sequences.

The links below open editable English sources in this repository. Corresponding translations are in the language collections listed below.

| What are you working on? | Start here |
| --- | --- |
| Choose a platform or migrate a design | [RK3576 vs. RK3588](_articles/002-rk3576-vs-rk3588-edge-linux.md) · [Migration scorecard](_articles/021-migration-scorecard-armsom.md) |
| Bring up a board and recover a failed boot | [First boot and serial recovery](_articles/003-first-boot-serial-recovery.md) · [Boot media and eMMC flashing](_articles/010-boot-media-emmc-flashing.md) |
| Configure peripherals and clocks | [Device Tree, GPIO, I2C and SPI](_articles/004-device-tree-overlays-gpio-i2c-spi.md) · [Clock framework](_articles/033-rockchip-clock-framework.md) · [CAN FD](_articles/032-rockchip-can-fd.md) |
| Build a camera, video or edge AI pipeline | [V4L2 and GStreamer](_articles/005-v4l2-gstreamer-camera-pipeline.md) · [RKNN deployment](_articles/006-rknn-edge-deployment.md) · [Hardware video](_articles/008-rockchip-hardware-video-pipelines.md) |
| Configure displays and bridge chips | [DRM/KMS](_articles/007-drm-kms-multi-display.md) · [HDMI](_articles/047-rockchip-hdmi.md) · [MIPI DSI2](_articles/050-rockchip-mipi-dsi2.md) · [RK628](_articles/053-rockchip-rk628-porting.md) |
| Debug audio, memory or low-level software | [Linux audio](_articles/023-rockchip-audio.md) · [DDR](_articles/037-rockchip-ddr.md) · [OpenOCD](_articles/038-rockchip-openocd.md) · [AMP](_articles/022-rockchip-amp.md) |
| Prepare a prototype for production | [CM5 carrier design](_articles/019-cm5-carrier-production.md) · [OTA updates](_articles/015-ota-buildroot-debian-armsom.md) · [Thermal observability](_articles/011-thermal-performance-observability.md) |

For a detailed CM5/CM5-IO Device Tree walkthrough, see the standalone [English](docs/rk3576-linux-device-tree-gpio-i2c-rk3x/README.md) or [中文](docs/rk3576-linux-device-tree-gpio-i2c-rk3x/README.zh-CN.md) documentation.

## Read in your language

| Language | Website | Article library | Markdown sources |
| --- | --- | --- | --- |
| English | [Home](https://blog.armsom.org/) | [Browse](https://blog.armsom.org/library/) | [`_articles/`](_articles/) |
| 简体中文 | [首页](https://blog.armsom.org/zh/) | [文章目录](https://blog.armsom.org/zh/library/) | [`_articles_zh/`](_articles_zh/) |
| Русский | [Главная](https://blog.armsom.org/ru/) | [Каталог](https://blog.armsom.org/ru/library/) | [`_articles_ru/`](_articles_ru/) |
| Deutsch | [Startseite](https://blog.armsom.org/de/) | [Artikelbibliothek](https://blog.armsom.org/de/library/) | [`_articles_de/`](_articles_de/) |

English, Chinese, and Russian cover the current article collection. German is available for a subset of articles. Shared `translation_key` values connect corresponding pages; the header links to an article's translation when it exists. Repository content may appear ahead of the published site while releases roll out.

## What you will find

- Task-oriented tutorials with commands, configuration examples, diagrams, and troubleshooting steps.
- Detailed Rockchip technical references with editable text, code and tables, plus independently stored source figures.
- Source and editorial notes for document versions, extraction corrections, technical uncertainties, and board adaptation requirements.
- A multilingual Jekyll website with article search, learning paths, related articles, and responsive tables of contents.

Check each article's stated SoC, board, SDK/BSP, and kernel scope against your hardware. Source-document examples and measurements are identified separately from ArmSoM hardware validation; board-level support should be confirmed in the [ArmSoM documentation](https://docs.armsom.org/).

## Preview locally

Install Ruby and Bundler first. Dependencies are declared in the [Gemfile](Gemfile), which uses `github-pages` to match the site's Jekyll environment and includes WEBrick for local serving.

```sh
git clone https://github.com/ArmSoM/armsom-rockchip-guides-blog.git
cd armsom-rockchip-guides-blog
bundle install
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

If you already have a checkout, run the last two commands from its root directory. Keep the server running, then open:

- English: <http://127.0.0.1:4000/>
- 中文: <http://127.0.0.1:4000/zh/>
- Русский: <http://127.0.0.1:4000/ru/>
- Deutsch: <http://127.0.0.1:4000/de/>

To generate the static website without starting a server:

```sh
bundle exec jekyll build
```

Output goes to `_site/`, which is ignored by Git. On Windows, make sure Ruby and Bundler are available in your terminal; the Gemfile already includes Windows timezone data. Workstation-specific Bundler settings, installed dependencies, and `Gemfile.lock` are also ignored by this repository.

## Repository layout

```text
_articles/          English articles
_articles_zh/       Chinese articles
_articles_ru/       Russian articles
_articles_de/       German articles
docs/              Standalone guides, original figures and editorial notes
assets/            Editable SVG diagrams, styles and browser scripts
_data/             Localized interface labels and learning paths
_includes/         Shared template fragments
_layouts/          Article, homepage and library layouts
zh/ ru/ de/        Localized homepage, library and learning-path entry pages
_config.yml        Jekyll collections, routes and production URL
search-index.json  Search-index template
sitemap.xml        Sitemap template
```

Technical figures are not all shared SVGs. PDF-based articles store language-specific images under their topic directory in `docs/`; each article and its editorial notes explain the image source and any fallback used when English originals are unavailable.

## Contribute or correct a guide

For a technical correction, identify the article, affected section, board/SoC, and SDK or kernel version. Include the original source or a minimal reproduction when available. Report issues through [GitHub Issues](https://github.com/ArmSoM/armsom-rockchip-guides-blog/issues).

When adding or translating content:

1. Follow a nearby article's front matter and collection structure. Keep matching filenames and the same `translation_key` across translations, with the correct `lang`, localized title and description, and an existing topic category.
2. Preserve commands, addresses, register values, API identifiers, and code semantics. Record source-version differences and unresolved contradictions in the topic's editorial notes.
3. Keep technical figures as independent assets, with localized captions and alt text. Preserve source attribution and any license notices within code.
4. Reuse the header language switcher, article table of contents, search index, and sitemap templates. Keep formal URLs on `https://blog.armsom.org` and do not invent modification dates.
5. Build and preview the affected language pages. Check navigation, search, images, tables, code blocks, mobile layout, canonical URLs, and language alternates before requesting publication.

The production domain is set by [CNAME](CNAME) and [`_config.yml`](_config.yml), with an empty `baseurl`. Keep the Google verification file and existing crawler configuration intact when editing the site.

## ArmSoM resources

- [ArmSoM website](https://www.armsom.org/) — boards, compute modules, and product information.
- [ArmSoM documentation](https://docs.armsom.org/) — product manuals, setup guides, and hardware references.
- [ArmSoM on GitHub](https://github.com/ArmSoM) — related open-source projects and repositories.

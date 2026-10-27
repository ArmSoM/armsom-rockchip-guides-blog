# 校对记录：rockchip-android14-car-sdk

本记录保留逐篇源校对证据；最终构建及HTTP验收见 ../batch-231-250/DELIVERY.md。未进行硬件验证，未提交或发布。

## 源校对详细记录

```json
{
  "number": 243,
  "status": "complete",
  "sources": {
    "cn": {
      "path": "D:\\ArmSoM\\chatgpt-ai-work\\github\\android\\Rockchip_Developer_Guide_Android14_Car_SDK_CN.pdf",
      "pages": 20,
      "sha256": "335ddc48bbc9bb5742a87e6ad946f9613750f8243f4900319673313da8a3c08e"
    }
  },
  "languages": [
    {
      "language": "en",
      "file": "_articles/243-rockchip-android14-car-sdk.md",
      "bytes": 29068,
      "codeBlocks": 36,
      "figures": 4
    },
    {
      "language": "zh",
      "file": "_articles_zh/243-rockchip-android14-car-sdk.md",
      "bytes": 26690,
      "codeBlocks": 36,
      "figures": 4
    },
    {
      "language": "ru",
      "file": "_articles_ru/243-rockchip-android14-car-sdk.md",
      "bytes": 33505,
      "codeBlocks": 36,
      "figures": 4
    },
    {
      "language": "de",
      "file": "_articles_de/243-rockchip-android14-car-sdk.md",
      "bytes": 28157,
      "codeBlocks": 36,
      "figures": 4
    }
  ],
  "sourceCoverage": {
    "pages": "4–20 technical body; introductory product/version facts retained",
    "chapters": [
      "1.1",
      "1.2",
      "2.1",
      "2.2",
      "2.3",
      "3.1",
      "3.2",
      "3.3",
      "3.4",
      "3.5",
      "3.6",
      "3.7"
    ],
    "codeBlocks": 36,
    "figures": 4
  },
  "review": {
    "prose": "All technical paragraphs authored in English, Chinese, Russian and German; constants and source code shared without translation.",
    "figures": "Four independent technical crops inspected: RK3588M hardware, RK3576M hardware, AAOS architecture, EVS architecture. No full-page figure replacement.",
    "code": "Source command/config/diff spans retained; known PDF token and command wrapping rejoined. Source inconsistencies deliberately disclosed.",
    "sourceDifferences": [
      "Only Chinese source provided. English text within original drawings is not an English-document source.",
      "Product table Kernel6.10 versus kernel-6.1 commands.",
      "Second hardware description labels RK3588M but drawing/model is RK3576M.",
      "MAX96749 prose-only mention; driver list differs.",
      "Historical android-11.config, rk3588_s/rk3588m_u diff paths and DsiplayMode spelling retained."
    ],
    "excluded": "Cover legal/contact/audience and revision-history table; technical version facts retained.",
    "limitations": "Documentary Rockchip EVB examples, not ArmSoM hardware tests. No commands executed on hardware; no site build or network/link validation."
  },
  "figureManifest": [
    {
      "id": "hardware-rk3588m",
      "page": 5,
      "source": "cn",
      "actualDocumentLanguage": "Chinese",
      "figureLabels": "Original labels, including English technical labels",
      "file": "hardware-rk3588m.png",
      "pixel_bbox": [
        115,
        144,
        779,
        606
      ]
    },
    {
      "id": "hardware-rk3576m",
      "page": 5,
      "source": "cn",
      "actualDocumentLanguage": "Chinese",
      "figureLabels": "Original labels, including English technical labels",
      "file": "hardware-rk3576m.png",
      "pixel_bbox": [
        115,
        752,
        779,
        1219
      ]
    },
    {
      "id": "aaos",
      "page": 9,
      "source": "cn",
      "actualDocumentLanguage": "Chinese",
      "figureLabels": "Original labels, including English technical labels",
      "file": "aaos.png",
      "pixel_bbox": [
        115,
        202,
        779,
        445
      ]
    },
    {
      "id": "evs",
      "page": 11,
      "source": "cn",
      "actualDocumentLanguage": "Chinese",
      "figureLabels": "Original labels, including English technical labels",
      "file": "evs.png",
      "pixel_bbox": [
        144,
        432,
        750,
        975
      ]
    }
  ]
}
```

## 最终整合补充

- 来源段的封面日期已移除；代码与日志的日期未改。
- 文章归入现有 Android 分类；四语元数据已本地化。
- 最终文章哈希以批次 PROGRESS.json 为准，源校对时的字节数不作为最终文件哈希。

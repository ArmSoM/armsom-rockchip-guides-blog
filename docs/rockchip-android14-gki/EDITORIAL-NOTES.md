# 校对记录：rockchip-android14-gki

本记录保留逐篇源校对证据；最终构建及HTTP验收见 ../batch-231-250/DELIVERY.md。未进行硬件验证，未提交或发布。

## 源校对详细记录

```json
{
  "number": 244,
  "status": "complete",
  "sources": {
    "cn": {
      "path": "D:\\ArmSoM\\chatgpt-ai-work\\github\\android\\Rockchip_Developer_Guide_Android14_GKI_CN.pdf",
      "pages": 21,
      "sha256": "69748eae06db57e7125cceb9e4559071ba302bfd840364696aec36d77f43be26"
    },
    "en": {
      "path": "D:\\ArmSoM\\chatgpt-ai-work\\github\\android\\Rockchip_Developer_Guide_Android14_GKI_EN.pdf",
      "pages": 21,
      "sha256": "48e108ae05cd67f45c3aaeda52d4c0f9b7bcee074ae1ebe514793facbf101bf7"
    }
  },
  "languages": [
    {
      "language": "en",
      "file": "_articles/244-rockchip-android14-gki.md",
      "bytes": 26046,
      "codeBlocks": 27,
      "figures": 6
    },
    {
      "language": "zh",
      "file": "_articles_zh/244-rockchip-android14-gki.md",
      "bytes": 23812,
      "codeBlocks": 27,
      "figures": 6
    },
    {
      "language": "ru",
      "file": "_articles_ru/244-rockchip-android14-gki.md",
      "bytes": 30434,
      "codeBlocks": 27,
      "figures": 6
    },
    {
      "language": "de",
      "file": "_articles_de/244-rockchip-android14-gki.md",
      "bytes": 24885,
      "codeBlocks": 27,
      "figures": 6
    }
  ],
  "coverage": {
    "cnTechnicalPages": "4–21",
    "enTechnicalPages": "5–21",
    "chapters": "Chinese1–12 including all subsections; English differences explicitly integrated",
    "codeBlocks": 27,
    "tables": 7,
    "figures": 6
  },
  "review": {
    "figures": "Six corresponding CN/EN figure pairs independently cropped and visually compared. Chinese article uses CN pages4,8,9,9,19,19; English/Russian/German use EN pages5,9,10,10,19,19. Original screenshots in EN PDF still contain Chinese UI, accurately recorded. No entire PDF pages used as figures.",
    "tables": "All technical comparisons, nine-chip adaptation rows, five path mappings, three load stages, 3x9 AOSP boot matrix, two header versions and four GPU-config mappings retained.",
    "differences": [
      "Both V1.1.1 2024-12-13 but IDs775/778 differ.",
      "English kernel-source table duplicates driver table; Chinese distinct content used.",
      "English pahole1.25+ versus Chinese1.25 and English9 exact1.25 disclosed.",
      "Chinese Exec format error log, pahole resolution and fallback download retained; English omitted.",
      "English ABI cross-reference targets absent section; disclosed.",
      "English extra chapter9 shifts later numbering."
    ],
    "sourceDefects": [
      "Historical Android12/13 logs in Android14 guide.",
      "Mixed rk3568/rk3588 U-Boot patch, rk3588_t/rk3562_ugo paths, RK3562/RK3568 build/pack examples.",
      "fasle retained in source diff.",
      "Both source Mali logs have corrupted/truncated lr/sp line; not invented.",
      "new_vendor_boot.img/vendor_boot.img source path conflicts with generated single-file output; explicitly not ready to run."
    ],
    "excluded": "Cover legal/contact/audience/revision-history tables only; technical version and changed behaviour retained.",
    "limits": "No hardware commands, site build, live certification verification or download validation.",
    "pageBottoms": "Original PDF full-page lines with bottom>798 audited against page text and authored content; all technical tail lines and cross-page logs retained. See work/batch-231-250/244/page-bottom-audit.json."
  },
  "figures": [
    {
      "id": "architecture",
      "page": 4,
      "source": "cn",
      "actualDocumentLanguage": "Chinese",
      "figureLabels": "Original source labels, including English UI",
      "file": "architecture.png",
      "pixel_bbox": [
        115,
        383,
        779,
        791
      ],
      "variants": {
        "en": {
          "page": 5,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "architecture-en.png",
          "pixel_bbox": [
            115,
            428,
            779,
            836
          ],
          "usedBy": [
            "en",
            "ru",
            "de"
          ]
        }
      }
    },
    {
      "id": "flash-complete",
      "page": 8,
      "source": "cn",
      "actualDocumentLanguage": "Chinese",
      "figureLabels": "Original source labels, including English UI",
      "file": "flash-complete.png",
      "pixel_bbox": [
        115,
        613,
        779,
        924
      ],
      "variants": {
        "en": {
          "page": 9,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "flash-complete-en.png",
          "pixel_bbox": [
            115,
            748,
            779,
            1059
          ],
          "usedBy": [
            "en",
            "ru",
            "de"
          ]
        }
      }
    },
    {
      "id": "flash-import",
      "page": 9,
      "source": "cn",
      "actualDocumentLanguage": "Chinese",
      "figureLabels": "Original source labels, including English UI",
      "file": "flash-import.png",
      "pixel_bbox": [
        115,
        66,
        779,
        378
      ],
      "variants": {
        "en": {
          "page": 10,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "flash-import-en.png",
          "pixel_bbox": [
            149,
            43,
            779,
            340
          ],
          "usedBy": [
            "en",
            "ru",
            "de"
          ]
        }
      }
    },
    {
      "id": "flash-parts",
      "page": 9,
      "source": "cn",
      "actualDocumentLanguage": "Chinese",
      "figureLabels": "Original source labels, including English UI",
      "file": "flash-parts.png",
      "pixel_bbox": [
        115,
        735,
        779,
        1048
      ],
      "variants": {
        "en": {
          "page": 10,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "flash-parts-en.png",
          "pixel_bbox": [
            115,
            726,
            779,
            1039
          ],
          "usedBy": [
            "en",
            "ru",
            "de"
          ]
        }
      }
    },
    {
      "id": "aosp-boot",
      "page": 19,
      "source": "cn",
      "actualDocumentLanguage": "Chinese",
      "figureLabels": "Original source labels, including English UI",
      "file": "aosp-boot.png",
      "pixel_bbox": [
        115,
        66,
        779,
        408
      ],
      "variants": {
        "en": {
          "page": 19,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "aosp-boot-en.png",
          "pixel_bbox": [
            115,
            43,
            779,
            385
          ],
          "usedBy": [
            "en",
            "ru",
            "de"
          ]
        }
      }
    },
    {
      "id": "aosp-modules",
      "page": 19,
      "source": "cn",
      "actualDocumentLanguage": "Chinese",
      "figureLabels": "Original source labels, including English UI",
      "file": "aosp-modules.png",
      "pixel_bbox": [
        115,
        546,
        779,
        887
      ],
      "variants": {
        "en": {
          "page": 19,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "aosp-modules-en.png",
          "pixel_bbox": [
            115,
            559,
            779,
            898
          ],
          "usedBy": [
            "en",
            "ru",
            "de"
          ]
        }
      }
    }
  ]
}
```

## 最终整合补充

- 来源段的封面日期已移除；代码与日志的日期未改。
- 文章归入现有 Android 分类；四语元数据已本地化。
- 最终文章哈希以批次 PROGRESS.json 为准，源校对时的字节数不作为最终文件哈希。

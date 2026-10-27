# 校对记录：rockchip-android-automotive

本记录保留逐篇源校对证据；最终构建及HTTP验收见 ../batch-231-250/DELIVERY.md。未进行硬件验证，未提交或发布。

## 源校对详细记录

```json
{
  "number": 247,
  "status": "complete",
  "sources": {
    "cn": {
      "path": "D:\\ArmSoM\\chatgpt-ai-work\\github\\android\\Rockchip_Developer_Guide_Android_Automotive_CN.pdf",
      "pages": 21,
      "sha256": "dcb096c6dc98fd138c964985a12c21b509527809b900979d2792ef8779928ca1"
    }
  },
  "languages": [
    {
      "language": "en",
      "file": "_articles/247-rockchip-android-automotive.md",
      "bytes": 32707,
      "codeBlocks": 28,
      "figures": 1
    },
    {
      "language": "zh",
      "file": "_articles_zh/247-rockchip-android-automotive.md",
      "bytes": 29535,
      "codeBlocks": 28,
      "figures": 1
    },
    {
      "language": "ru",
      "file": "_articles_ru/247-rockchip-android-automotive.md",
      "bytes": 34916,
      "codeBlocks": 28,
      "figures": 1
    },
    {
      "language": "de",
      "file": "_articles_de/247-rockchip-android-automotive.md",
      "bytes": 29339,
      "codeBlocks": 28,
      "figures": 1
    }
  ],
  "sourceCoverage": {
    "pages": "4–21 technical body plus technical introductory version/product facts",
    "chapters": [
      "1",
      "2.1–2.13",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "codeBlocks": 28,
    "tables": 5,
    "figures": 1,
    "vehicleDummyNodes": 15
  },
  "review": {
    "prose": "All technical explanations authored in English,Chinese,Russian,German; code/constants and complete source patch excerpts retained. Related prose reorganized, with all source technical topics covered.",
    "figures": "Single architecture figure independently cropped from CN page4 and visually inspected. English lettering belongs to the CN original; no English PDF supplied. Linked external power diagram remains a source link, not falsely attributed embedded art.",
    "pageBottom": "Full PDF page-bottom audit checked independently of filtered extraction units. Technical bottom lines on pages5,7,15,17,18 preserved; page8 application-level heading is represented by the following API explanation. Cross-page occupant XML,backlight XML,gesture XML and VHAL patches rejoined.",
    "code": "Known PDF line wrapping normalized for XML tokens,diff headers and hunk context. Source flaws explicitly disclosed, not silently treated as valid production configuration.",
    "sourceIssues": [
      "seatSide rgith typo",
      "edp2lvds_backligh1 missing t",
      "birghtessValue source spelling",
      "Hash comments in input XML are source annotations, not valid XML comments",
      "CarPowerManster API class typo",
      "ClusterHomeActivit missing y",
      "PRODUCT_PACKAGES comment within continuation requires make review",
      "UX driving text says display enabled ambiguously; not a safety permission",
      "Slash-separated fan values are alternatives,not literal sysfs values"
    ],
    "excluded": "Cover date,legal/audience text and revision table removed; V1.1.0 and technical display update retained.",
    "limitations": "Rockchip SDK examples, not ArmSoM/vehicle tests. No hardware commands,network verification,site build,commit or push."
  },
  "figureManifest": [
    {
      "id": "aaos-architecture",
      "page": 4,
      "source": "cn",
      "actualDocumentLanguage": "Chinese",
      "figureLabels": "English labels in the Chinese source PDF; no English PDF supplied",
      "file": "aaos-architecture.png",
      "pixel_bbox": [
        113,
        331,
        782,
        575
      ]
    }
  ]
}
```

## 最终整合补充

- 来源段的封面日期已移除；代码与日志的日期未改。
- 文章归入现有 Android 分类；四语元数据已本地化。
- 最终文章哈希以批次 PROGRESS.json 为准，源校对时的字节数不作为最终文件哈希。

# 校对记录：rockchip-android14-sdk

本记录保留逐篇源校对证据；最终构建及HTTP验收见 ../batch-231-250/DELIVERY.md。未进行硬件验证，未提交或发布。

## 源校对详细记录

```json
{
  "number": 245,
  "status": "complete",
  "sources": {
    "cn": {
      "path": "D:\\ArmSoM\\chatgpt-ai-work\\github\\android\\Rockchip_Developer_Guide_Android14_SDK_CN.pdf",
      "pages": 58,
      "sha256": "6935536dd9078a27144c578af946234da4048322259b45509818c5b3e15c3fd1"
    },
    "en": {
      "path": "D:\\ArmSoM\\chatgpt-ai-work\\github\\android\\Rockchip_Developer_Guide_Android14_SDK_EN.pdf",
      "pages": 63,
      "sha256": "48cf7854b0d7ab56c9cc4d97caebff9fe72e5104502d849c2b45f31849ab2c82"
    }
  },
  "languages": [
    {
      "language": "en",
      "file": "_articles/245-rockchip-android14-sdk.md",
      "bytes": 84085,
      "codeBlocks": 72,
      "figures": 14
    },
    {
      "language": "zh",
      "file": "_articles_zh/245-rockchip-android14-sdk.md",
      "bytes": 76662,
      "codeBlocks": 72,
      "figures": 14
    },
    {
      "language": "ru",
      "file": "_articles_ru/245-rockchip-android14-sdk.md",
      "bytes": 92597,
      "codeBlocks": 72,
      "figures": 14
    },
    {
      "language": "de",
      "file": "_articles_de/245-rockchip-android14-sdk.md",
      "bytes": 77656,
      "codeBlocks": 72,
      "figures": 14
    }
  ],
  "coverage": {
    "technicalBody": "CN4–58, EN5–63; both full texts read; cover/legal/audience/revision table excluded, technical version changes retained",
    "blocks": 205,
    "codeBlocks": 72,
    "tables": [
      {
        "heading": "Chip|Support|SDK release",
        "rows": 10
      },
      {
        "heading": "Target|Chip|Hardware/configuration|Build purpose",
        "rows": 22
      },
      {
        "heading": "Option|Meaning",
        "rows": 11
      },
      {
        "heading": "Chip|Type|Reference|Lunch target|Full build|Kernel|U-Boot",
        "rows": 12
      },
      {
        "heading": "File|Meaning",
        "rows": 15
      },
      {
        "heading": "SoC|PMIC|Type|Model|DTS",
        "rows": 20
      },
      {
        "heading": "Tool/purpose|Source package/location",
        "rows": 11
      },
      {
        "heading": "Operation|Syntax/example|Meaning",
        "rows": 9
      },
      {
        "heading": "Metric|Meaning",
        "rows": 4
      },
      {
        "heading": "Option|Meaning",
        "rows": 8
      },
      {
        "heading": "Type|Source chip list",
        "rows": 2
      },
      {
        "heading": "Feature|Reference",
        "rows": 4
      },
      {
        "heading": "Package|SHA256",
        "rows": 3
      }
    ],
    "figures": 14,
    "allAppendices": true
  },
  "review": {
    "figures": "14 CN/EN corresponding pairs independently cropped and visually inspected; Chinese uses CN, English/Russian/German use EN original. English PDF screenshots retain original Chinese UI. All image source page mappings and crop boxes in figures.json. No whole-page substitute.",
    "pageBottoms": "Original PDF full-page lines below798pt audited independently; page-*.json.text retained these lines. Technical commands, DTS nodes, tree filenames and cross-page diff continuations included.",
    "language": "All prose, parameter descriptions, table cells and warnings authored in four languages. Code/constants, file identifiers and original screenshot labels remain unchanged.",
    "tree": "Complete RKDocs technical filename tree retained; normalized CN and EN trees compared equal,16297 characters before joining wrapped filenames.",
    "differences": [
      "RK3326 RKR2 table versus RKR3 release statement",
      "EN mirror @android_t and android_r.conf versus CN @android_u/android_u.conf",
      "Lunch GO/user/userdebug description differences preserved",
      "EN-only RK3588/RK3588S build-summary rows included",
      "GKI paragraph chip scope CN3 versus EN1",
      "super.img CN includes product/system_ext omitted EN",
      "Single-PMIC RK3588 DTS CN evb7-v11 versus EN evb4-lp7-v10",
      "EN OTP extra literal RK3568S preserved as unverified discrepancy",
      "CN appendix adds libssl-dev/liblz4-tool/python-dev",
      "RKR1/RKR6 synchronization example conflict"
    ],
    "sourceDefects": [
      "Historical Android10/11 branches and Android13 target paths retained with warnings",
      "mkiamge.sh and kernel/kernel-6.1 path mismatch",
      "resgid=1065i source typo",
      "Java if (0 && ...) source patch is invalid, explicitly not runnable",
      "Malformed Antutu XML and duplicate row retained as documentary snippet",
      "Logcat source description inverted filtering; command retained and actual semantics clarified",
      "Historical Ubuntu14.04/JDK8 appendix not represented as current Android14 requirements"
    ],
    "limits": "No hardware testing, website build, download/link validation, external requests, commit or push. Destructive/debug/security examples flagged and not executed."
  },
  "figures": [
    {
      "id": "flash-tool",
      "page": 16,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "flash-tool.png",
      "pixel_bbox": [
        115,
        43,
        779,
        359
      ],
      "variants": {
        "en": {
          "page": 18,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "flash-tool-en.png",
          "pixel_bbox": [
            115,
            43,
            779,
            359
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
      "id": "fastbootd",
      "page": 18,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "fastbootd.png",
      "pixel_bbox": [
        115,
        193,
        779,
        702
      ],
      "variants": {
        "en": {
          "page": 20,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "fastbootd-en.png",
          "pixel_bbox": [
            115,
            243,
            779,
            753
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
      "id": "redmine-account",
      "page": 23,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "redmine-account.png",
      "pixel_bbox": [
        115,
        738,
        779,
        1001
      ],
      "variants": {
        "en": {
          "page": 26,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "redmine-account-en.png",
          "pixel_bbox": [
            115,
            511,
            779,
            775
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
      "id": "redmine-notifications",
      "page": 24,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "redmine-notifications.png",
      "pixel_bbox": [
        115,
        43,
        779,
        337
      ],
      "variants": {
        "en": {
          "page": 26,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "redmine-notifications-en.png",
          "pixel_bbox": [
            115,
            841,
            779,
            1135
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
      "id": "redmine-project",
      "page": 24,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "redmine-project.png",
      "pixel_bbox": [
        115,
        392,
        779,
        684
      ],
      "variants": {
        "en": {
          "page": 27,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "redmine-project-en.png",
          "pixel_bbox": [
            115,
            88,
            779,
            381
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
      "id": "devicetest-start",
      "page": 33,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "devicetest-start.png",
      "pixel_bbox": [
        115,
        208,
        779,
        695
      ],
      "variants": {
        "en": {
          "page": 36,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "devicetest-start-en.png",
          "pixel_bbox": [
            115,
            111,
            779,
            597
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
      "id": "windows-tool",
      "page": 34,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "windows-tool.png",
      "pixel_bbox": [
        115,
        88,
        779,
        404
      ],
      "variants": {
        "en": {
          "page": 37,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "windows-tool-en.png",
          "pixel_bbox": [
            115,
            43,
            779,
            359
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
      "id": "lz4-error",
      "page": 51,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "lz4-error.png",
      "pixel_bbox": [
        115,
        602,
        779,
        995
      ],
      "variants": {
        "en": {
          "page": 56,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "lz4-error-en.png",
          "pixel_bbox": [
            115,
            66,
            779,
            458
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
      "id": "keygen",
      "page": 55,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "keygen.png",
      "pixel_bbox": [
        115,
        312,
        779,
        784
      ],
      "variants": {
        "en": {
          "page": 60,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "keygen-en.png",
          "pixel_bbox": [
            115,
            88,
            779,
            561
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
      "id": "public-key",
      "page": 55,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "public-key.png",
      "pixel_bbox": [
        115,
        805,
        650,
        883
      ],
      "variants": {
        "en": {
          "page": 60,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "public-key-en.png",
          "pixel_bbox": [
            115,
            582,
            650,
            660
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
      "id": "wrong-key",
      "page": 56,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "wrong-key.png",
      "pixel_bbox": [
        115,
        418,
        779,
        567
      ],
      "variants": {
        "en": {
          "page": 61,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "wrong-key-en.png",
          "pixel_bbox": [
            115,
            156,
            779,
            305
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
      "id": "clone-success",
      "page": 56,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "clone-success.png",
      "pixel_bbox": [
        115,
        611,
        779,
        795
      ],
      "variants": {
        "en": {
          "page": 61,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "clone-success-en.png",
          "pixel_bbox": [
            115,
            349,
            779,
            533
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
      "id": "ssh-manual",
      "page": 57,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "ssh-manual.png",
      "pixel_bbox": [
        115,
        43,
        779,
        516
      ],
      "variants": {
        "en": {
          "page": 62,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "ssh-manual-en.png",
          "pixel_bbox": [
            115,
            43,
            779,
            516
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
      "id": "ssh-config",
      "page": 57,
      "source": "cn",
      "actualDocumentLanguage": "Chinese, with English terminal/UI text",
      "file": "ssh-config.png",
      "pixel_bbox": [
        115,
        697,
        779,
        1169
      ],
      "variants": {
        "en": {
          "page": 62,
          "source": "en",
          "actualDocumentLanguage": "English; original screenshot may retain Chinese UI labels",
          "file": "ssh-config-en.png",
          "pixel_bbox": [
            115,
            697,
            779,
            1169
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

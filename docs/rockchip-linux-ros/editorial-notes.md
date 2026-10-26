# 174 校对记录

## 来源

- CN: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Linux\ApplicationNote\Rockchip_Instruction_Linux_ROS_CN.pdf`；6页；V1.0.2；SHA256 `307c02b2cd28d07f9114d77133380d6212524b4839ed36aa2a2066e66c4c9579`。
- EN: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Linux\ApplicationNote\Rockchip_Instruction_Linux_ROS_EN.pdf`；6页；V1.0.2；SHA256 `f97f6f8b28e1802d47013f0f8ad7e5440bb9cfadab24c4a4eef3e450764cccb5`。

原PDF未修改；移除封面日期/密级、免责声明/商标版权声明、联系信息、读者对象和修订表。保留技术前言、适用范围、源码署名。四语复用已有集合和统一translation_key；ZH中文图，EN/RU/DE英文图。

## 逐章覆盖

技术前言p2；章1–3 p4–5简介、配置编译、完整beginner_tutorials集成；章4–5 p6烧写与完整运行输出。

## 处理及原稿疑点

EN p5多余@@diff前缀未带入公共代码，以CN代码为准并注明；rootfs.squashfs与rootfs.img/Rootfs.img名称差异；Config.in缩进原稿本身不足，不能视为可直接应用补丁。

代码按中文原稿共同基线保留原注释；修复明确的PDF软换行和跨页续行，未执行示例。英文正文按英文原稿逐节对齐；不因页数不同删减章节。长表格保持Markdown可编辑。

## 静态统计

```json
[
  {
    "collection": "_articles_zh",
    "code_blocks": 8,
    "images": 0,
    "tables": 0,
    "bytes": 5470
  },
  {
    "collection": "_articles",
    "code_blocks": 8,
    "images": 0,
    "tables": 0,
    "bytes": 6062
  },
  {
    "collection": "_articles_ru",
    "code_blocks": 8,
    "images": 0,
    "tables": 0,
    "bytes": 7165
  },
  {
    "collection": "_articles_de",
    "code_blocks": 8,
    "images": 0,
    "tables": 0,
    "bytes": 5779
  }
]
```

## 验收边界

所有列出的图片路径存在。尚需主线程统一构建和浏览器SEO验收；本记录不声称已上线/收录。未执行硬件测试、烧写、服务切换、commit、push或发布。所有适配均为平台参考，需实际板卡/BSP验证。


## 最终源稿复核

- 四语代码逐块比对一致，代码块数：8；英俄德代码外中文扫描无漏译。
- 原稿技术前言和末章保留；源图独立提取，未使用整页图替代正文。

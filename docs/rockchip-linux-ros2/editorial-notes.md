# 175 校对记录

## 来源

- CN: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Linux\ApplicationNote\Rockchip_Instruction_Linux_ROS2_CN.pdf`；18页；V1.1.1；SHA256 `105e0b9c62ae9710bce9d9b95131b5e6b78e44d82cb19bf378fffa49bd3ce667`。
- EN: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Linux\ApplicationNote\Rockchip_Instruction_Linux_ROS2_EN.pdf`；19页；V1.1.1；SHA256 `d456638c4a9cd4715b21ef98282b971024f691377257cf9519868f9d6a821ed0`。

原PDF未修改；移除封面日期/密级、免责声明/商标版权声明、联系信息、读者对象和修订表。保留技术前言、适用范围、源码署名。四语复用已有集合和统一translation_key；ZH中文图，EN/RU/DE英文图。

## 逐章覆盖

技术前言p2逐段四语保留；章1–2 p4–5版本矩阵、依赖、文件树；章3–4 p5–8 Buildroot依赖与Docker准备；章5 p8–9完整构建与TRY_RUN；章6 p9–10打包运行；章7 p10–18全部十项故障与错误日志/补丁；章8–9 p18待完善与参考链接。英文分页至19。

## 处理及原稿疑点

两条docker cp都为sources但后续需scripts；build_ros2.sh/build-ros2.sh、pybind11_verdor与mimix拼写不一致，保留提示。_FORTIFY_SOURCE移除可降低防护。原稿修订日期与顺序矛盾不作为文章lastmod；不猜改。

代码按中文原稿共同基线保留原注释；修复明确的PDF软换行和跨页续行，未执行示例。英文正文按英文原稿逐节对齐；不因页数不同删减章节。长表格保持Markdown可编辑。

## 静态统计

```json
[
  {
    "collection": "_articles_zh",
    "code_blocks": 39,
    "images": 0,
    "tables": 3,
    "bytes": 28677
  },
  {
    "collection": "_articles",
    "code_blocks": 39,
    "images": 0,
    "tables": 3,
    "bytes": 31411
  },
  {
    "collection": "_articles_ru",
    "code_blocks": 39,
    "images": 0,
    "tables": 3,
    "bytes": 34835
  },
  {
    "collection": "_articles_de",
    "code_blocks": 39,
    "images": 0,
    "tables": 3,
    "bytes": 29750
  }
]
```

## 验收边界

所有列出的图片路径存在。尚需主线程统一构建和浏览器SEO验收；本记录不声称已上线/收录。未执行硬件测试、烧写、服务切换、commit、push或发布。所有适配均为平台参考，需实际板卡/BSP验证。


## 最终源稿复核

- 四语代码逐块比对一致，代码块数：39；英俄德代码外中文扫描无漏译。
- 原稿技术前言和末章保留；源图独立提取，未使用整页图替代正文。

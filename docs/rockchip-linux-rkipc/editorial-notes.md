# 173 校对记录

## 来源

- CN: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Linux\ApplicationNote\Rockchip_Developer_Guide_Linux_RKIPC_CN.pdf`；57页；V1.7.5；SHA256 `a59093ba12dda014b9024e6b377634d7d2ccd8fa600a86c691920f0d8811c6ed`。
- EN: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Linux\ApplicationNote\Rockchip_Developer_Guide_Linux_RKIPC_EN.pdf`；59页；V1.7.5；SHA256 `c192d24b61930486ac13e12d6f0df3dc33f8b6ff46ccd02e60eef93574a1b150`。

原PDF未修改；移除封面日期/密级、免责声明/商标版权声明、联系信息、读者对象和修订表。保留技术前言、适用范围、源码署名。四语复用已有集合和统一translation_key；ZH中文图，EN/RU/DE英文图。

## 逐章覆盖

技术前言p2；章节1–2 p7–23整体架构与20产品数据流；章3–4 p23–24代码结构/原则；章5 p24–31完整hue跨层代码；章6 p31–45全模块API；章7 p46–57全部ini参数，含最后display。

## 处理及原稿疑点

产品依赖库rkmedia/rockit列疑似对调；rk_event_ri_set_position_y描述写x；frame_rate/_in输入输出待核；MAX_SCENARIO_NUM=2示例场景2保留原算式；CN audo_gain_enabled与EN auto_gain_enabled不同，代码共同按CN。deivce_name/is_presistent_text/muliti原标识保留；Base64不能当安全加密，云密钥为公开原稿示例不用于生产。

代码按中文原稿共同基线保留原注释；修复明确的PDF软换行和跨页续行，未执行示例。英文正文按英文原稿逐节对齐；不因页数不同删减章节。长表格保持Markdown可编辑。

## 静态统计

```json
[
  {
    "collection": "_articles_zh",
    "code_blocks": 26,
    "images": 21,
    "tables": 22,
    "bytes": 60363
  },
  {
    "collection": "_articles",
    "code_blocks": 26,
    "images": 21,
    "tables": 22,
    "bytes": 63117
  },
  {
    "collection": "_articles_ru",
    "code_blocks": 26,
    "images": 21,
    "tables": 22,
    "bytes": 75433
  },
  {
    "collection": "_articles_de",
    "code_blocks": 26,
    "images": 21,
    "tables": 22,
    "bytes": 63613
  }
]
```

## 验收边界

所有列出的图片路径存在。尚需主线程统一构建和浏览器SEO验收；本记录不声称已上线/收录。未执行硬件测试、烧写、服务切换、commit、push或发布。所有适配均为平台参考，需实际板卡/BSP验证。


## 最终源稿复核

- 四语代码逐块比对一致，代码块数：26；英俄德代码外中文扫描无漏译。
- 原稿技术前言和末章保留；源图独立提取，未使用整页图替代正文。
- 20个产品矢量流程图单独裁取（CN/EN各20张，3倍渲染），加整体框架图，每语21图；矢量中的所有标签在图内完整保留，抽取出的乱序标签不重复作正文。22表全部可编辑。
- ini跨行JSON/字符串已按原稿合并，保留编号0/1/2分片；四语26代码块。英俄德追加完整ini参数注释本地化说明。
- AVS param_source中文0 CALIB/1 LUT/2 XML-to-LUT，与英文0 LUT/1 CALIB冲突，四语明确标注；代码共用CN值。sock_read(fd,value,sizeof(value))指针大小疑点保留并警示。

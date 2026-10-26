# 177 校对记录

## 来源

- CN: `D:\ArmSoM\chatgpt-ai-work\github\docs\cn\Linux\ApplicationNote\Rockchip_Use_Guide_Linux_EtherCAT_IgH_CN.pdf`；23页；V1.0.3；SHA256 `97b2331abe9969a8cb41f3321cbdc53635f8464fa0d33d6675a0590314c5187f`。
- EN: `D:\ArmSoM\chatgpt-ai-work\github\docs\en\Linux\ApplicationNote\Rockchip_Use_Guide_Linux_EtherCAT_IgH_EN.pdf`；23页；V1.0.3；SHA256 `052ed494bd7258a7166da6fa0c5811c1b9edb1bfc8c823cca5cd7d25ec2eafbe`。

原PDF未修改；移除封面日期/密级、免责声明/商标版权声明、联系信息、读者对象和修订表。保留技术前言、适用范围、源码署名。四语复用已有集合和统一translation_key；ZH中文图，EN/RU/DE英文图。

## 逐章覆盖

技术平台表p2；章1–2 p4–7概述/架构/驱动/硬件；章3 p8–13全平台RT内核与用户态/驱动编译；章4–5 p13–16命令与完整PDO/伺服开发；章6 p16–20TSN完整补丁；章7 p20–23性能函数、时间戳补丁及最终性能表。

## 处理及原稿疑点

alias -p 0 0注释却改为1；模块cp到/userdata但insmod路径含ethercat_out；最后stmmac while补丁缺循环体/结束符，未猜补；[]必选/<>可选为原稿约定；PreemptRT硬实时表述不是具体板卡保证。原厂性能数据不得写成ArmSoM实测。

代码按中文原稿共同基线保留原注释；修复明确的PDF软换行和跨页续行，未执行示例。英文正文按英文原稿逐节对齐；不因页数不同删减章节。长表格保持Markdown可编辑。

## 静态统计

```json
[
  {
    "collection": "_articles_zh",
    "code_blocks": 18,
    "images": 3,
    "tables": 5,
    "bytes": 29911
  },
  {
    "collection": "_articles",
    "code_blocks": 18,
    "images": 3,
    "tables": 5,
    "bytes": 32932
  },
  {
    "collection": "_articles_ru",
    "code_blocks": 18,
    "images": 3,
    "tables": 5,
    "bytes": 34504
  },
  {
    "collection": "_articles_de",
    "code_blocks": 18,
    "images": 3,
    "tables": 5,
    "bytes": 28617
  }
]
```

## 验收边界

所有列出的图片路径存在。尚需主线程统一构建和浏览器SEO验收；本记录不声称已上线/收录。未执行硬件测试、烧写、服务切换、commit、push或发布。所有适配均为平台参考，需实际板卡/BSP验证。


## 最终源稿复核

- 四语代码逐块比对一致，代码块数：18；英俄德代码外中文扫描无漏译。
- 原稿技术前言和末章保留；源图独立提取，未使用整页图替代正文。

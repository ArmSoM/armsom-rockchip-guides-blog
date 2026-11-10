# RK3568 硬件系列校对记录

本批：10 个工程专题 + 系列索引，四语共 44 个页面。仅本地草稿，未提交、未发布。

## 来源与版本

中文 Hardware Design Guide V1.1（2021-06-08），199 页；英文 High Speed PCB Design Guide V1.0.0（2021-04-12），45 页。二者是不同主题文件，不作为同一篇中英文版本混用。中文主指南原图四语共用；英文 PCB 原图明确标为英文来源。原始 PDF 未修改。

## 完成范围

建立最小系统、电源/IO、DDR、存储、USB/SATA/PCIe、以太网、显示摄像头、音频控制、PCB、热ESD与存储专题，正文四语对应。抽取了全部 244 页原始文本到工作区（不作为正式文章收录），已核读本文引用章节；图页截图保持完整，不以截图代替正文。DDR PHY映射85行、电源峰值36行恢复为可编辑表格。DTS 配置保持相同标识符与供电引用，按实际供电条件解释。

## 尚未完成的全文覆盖

这些是专题工程文章，不是两份PDF逐行完整翻译。已恢复全部85行DDR PHY映射表与36行电源峰值表；已补充DDR3/DDR4与ECC分段约束对照及英文拓扑图；尚未重建全部独立原表、全部外设引脚表、完整音频接线范例及全部原稿图。若以用户最初“完整提取所有技术正文、表格、图”为验收标准，本系列仍需继续补充，不能标为全文转写已完成。网页构建、真实浏览器目录/手机布局及正式SEO检查由主任务统一执行。

## 原稿疑点与处理

- p21：100个24MHz周期约4.17µs，但原稿写至少4µs；保留周期要求并显式说明换算，不向下取整。
- p28：DDR3/DDR3L ECC未用字节文字把DQSU同时写成接电源和地，重复网名；要求结合图2–12和颗粒手册核对，不生成错误接线指令。
- p25：串口波特率原写1500000M，未作为可直接执行配置；要求核对loader/U-Boot。
- p53/p66：LOGIC BUCK ≥2A与≥1.5A；通用负载跳变纹波±3%与分立±5%；LOGIC总去耦>90µF与>99µF。四语都注明，不擅自统一。
- p134：CAN2.0B和1Mbps/8Mbps未划分模式；不宣称经典CAN 8Mbps或已验证CAN FD。
- EN p15/p16：Max inter-pair skew <6inches与总长同值，保留原措辞并注明不能作为精确等长目标。
- EN p19：SDIO/SDMMC速度门槛为50Mbps，未擅自改为50MHz。
- CN p190：热阻表标题抽取不全，经原图目视确认θJA/θJB/θJC分别为15.925/10.813/0.487°C/W，已恢复可编辑正文。
- CN p198：MSL1行≤300°C疑似原文错误，不作为存储建议；RK3568实际MSL3为≤30°C/60%RH 168h。

## 适用性

没有确认与RK3568对应的ArmSoM板卡，本批为平台参考，仅链接ArmSoM官网和文档。不杜撰产品型号、不将其他SoC板卡当作RK3568载板、不宣称ArmSoM实测。


## Product verification update — 2026-11-10
Official product pages and documentation verified: Sige3 uses RK3568B2 (https://www.armsom.org/sige3 ; https://docs.armsom.org/armsom-sige3); Sige1 uses RK3528 (https://www.armsom.org/sige1 ; https://docs.armsom.org/armsom-sige1). Relevant four-language pages now link to these products and carry product metadata. This supersedes earlier notes that no board was established. No RK3528A product association, board-level schematic equivalence or new hardware-test result is inferred.

---
title: "Rockchip固件升级失败分析：Boot Code、IDB、NAND与EMMC"
description: "Rockchip固件升级失败分析：Boot Code、IDB、NAND与EMMC — V1.2"
excerpt: "Rockchip固件升级失败分析：Boot Code、IDB、NAND与EMMC"
translation_key: "253-rockchip-firmware-upgrade-failure-analysis"
slug: "253-rockchip-firmware-upgrade-failure-analysis"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "firmware", "NAND", "EMMC"]
---

{% raw %}

# Rockchip固件升级失败分析：Boot Code、IDB、NAND与EMMC

ArmSoM平台参考：本文完整整理原厂《RK固件升级失败原因分析》1.2。唯一来源为25页中文PDF，无独立英文稿；英俄德从中文完整翻译，四语共用45张原图。全部工具日志、二进制比较、PCB和波形证据以原始截图保留，未将低清字符猜写成日志；可辨识批处理代码及末页功耗表另转录为文本。原稿涉及多个旧SoC和工具版本，不是ArmSoM板卡实测结论；须核对实际硬件、BSP、存储器datasheet与启动链。

## 使用边界与原稿待核对项

- 故障归因是原厂排查经验，不是由某一条报错唯一确定硬件坏件。先保留日志并核对固件和供电，再按证据检查；返修/换芯应由具备条件的人员进行。
- “修复”、擦除IDB、重刷及misc写入会破坏数据或启动状态；先备份，核对精确目标和分区大小。secure boot设备应使用匹配签名固件，不应以关闭验证绕过问题。
- pin38接VCC、10K上拉、EXT CSD179/167/162等只适用于匹配器件/平台。原稿RTS_n、DATO、RK3329及“欲烧录”等写法保留或就地注明，不能据拼写猜测引脚或SoC。
- FLASH ID表是历史常见值，不覆盖全部现代器件；D3行末的顿号没有对应第二值，不补造ID。00/FF等仅按原稿诊断语境解释，不能替代电气测试。
- 第25页是独立图片形式的功耗表，已保留并逐行转录：Ta=25°C、3.3V、VCC2.7V–3.6V及60mV峰峰纹波均保留。正文100-300mA/100-700uA与该单型号表不是同一保证范围。
- 原稿第17页的第三张批处理截图右侧本来被截断；完整参数可由前一图及明确的-RK29→-RK30修改关系恢复，文中同时保留原图。图内日期/时间属于日志上下文保留，封面日期/联系/修订表不保留。未执行任何烧写、擦除、改寄存器或硬件操作。

## 1. 概述

工厂和工程师经常会遇到固件升级失败的问题,为了方便查找问题,本文档整理了一些常见的问题和分析建议。由于工具一直在更新,本文档的描述的信息可能和工具提示的信息不会完全一样,不过同一种类型的问题,提示信息应该是相似的。

## 2. 常见问题及分析

### 2.1. Boot Code下载失败

量产工具提示：

![原稿截图或图表，PDF第2页，第1图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p002-figure-01.png)

开发工具提示:

![原稿截图或图表，PDF第2页，第2图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p002-figure-02.png)

量产工具log目录下log文件提示:

![原稿截图或图表，PDF第3页，第3图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p003-figure-01.png)

开发工具log目录下log文件提示:

![原稿截图或图表，PDF第3页，第4图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p003-figure-02.png)

出现这种问题可能的原因:

1. USB信号不好

2. 主控虚焊或者电源问题

3. DDR相关问题

4. 供电不足

5. 启用secure boot的机器使用了非签名固件。

排查办法：

1. 使用DDR测试工具测试DDR是否有焊接问题。

2. 使用质量好的短的USB2.0的USB线,并连接在PC机后面的USB口进行固件升级。

3. 检查USB线路上是否接的ESD器件,参数是不是不对。

4. 检查USB供电是否正常:电压和纹波。

5. USB走线是否和其他走线邻层平行。

6. 检查主控和usb相关部分的电阻和电容的参数是否正常。

7. 使用接外电源或者电池供电。

8. 启用secure boot的机器,需要升级对应签名的固件。

### 2.2. 下载Boot Code成功后测试设备失败

量厂工具提示:

![原稿截图或图表，PDF第4页，第5图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p004-figure-01.png)

开发工具提示:

![原稿截图或图表，PDF第4页，第6图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p004-figure-02.png)

量产工具log目录下log文件提示:

![原稿截图或图表，PDF第5页，第7图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p005-figure-01.png)

开发工具log目录下log文件提示:

![原稿截图或图表，PDF第5页，第8图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p005-figure-02.png)

出现这种问题可能的原因:

1. DDR颗粒问题或者DDR布板走线问题(概率比较大)。

2. USB信号不好。

3. U-Boot打包miniloader时使用了错误usbplug。

排查办法：

1. 使用DDR测试工具测试DDR是否有焊接问题。

2. 分析PCB DDR走线部分,是否有不符合布板规范的走线。

3. 更换DDR颗粒

4. USB部分参考 “2.1.Boot Code下载失败”处理办法。

5. 接串口分析打印信息,确定CPU运行到DDR还是usbplug

### 2.3. 准备IDB NAND FLASH 或者EMMC 焊接问题

量产工具提示准备IDB失败:

![原稿截图或图表，PDF第6页，第9图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p006-figure-01.png)

量产工具log目录下log文件提示:

![原稿截图或图表，PDF第6页，第10图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p006-figure-02.png)

开发工具提示写入ID_BLOCK失败:

![原稿截图或图表，PDF第7页，第11图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p007-figure-01.png)

开发工具log目录下log文件提示没有找到NAND FLASH,写入ID_BLOCK失败:

出现这种问题可能的原因:

1. NAND FLASH / EMMC没有焊好

2. 不支持的NAND FLASH

3. PCB板有问题

4. FLASH VCCQ供电不对

5. AP端FLASH SEL选择不对

6. EMMC的CMD和D0缺少上拉电阻。

排查办法：

1. 重新焊接NAND FLASH或EMMC,排查PCB板。

2. 检查电路原理图和NAND FLASH的datasheet,确认NAND FLASH pin38是接对了 (Toshiba、Sandisk和Samsung的大部分flash都需要接vcc,其他flash没有要求)。

3. 不支持的NAND FLASH：通过厂商支持渠道取得适用的驱动补丁，查阅补丁中的NAND支持列表，确认实际器件是否受支持。

4. 如果有串口,可以接串口来帮助分析焊接问题下面是正常的机器打印的串口信息,里面有打印FLASH ID.使用EMMC的机器,正常不会打印FLASH ID。

![原稿截图或图表，PDF第8页，第12图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p008-figure-01.png)

FLASH ID第一个byte 为厂家信息:

| ID | 厂家 |
| --- | --- |
| 2C | Micron |
| AD | Hynix |
| 45 | Sandisk |
| 89 | Intel |
| EC | Samsung |
| 98 | Toshiba |
| 00 | 没有接NAND FLASH |
| FF | 没有接NAND FLASH |
| 其他值 | NAND FLASH没有焊好或不支持的NAND FLASH。 |

Flash ID第二个byte 为容量信息,下表为常用容量的ID:

| ID | 容量 |
| --- | --- |
| 75 | 32MB |
| 76 | 64MB |
| 78、79、F1、D1 | 128MB |
| DA、71 | 256MB |
| DC | 512MB |
| D3、 | 1GB |
| D5、48 | 2GB |
| D7、68 | 4GB |
| D9、88、DE、3A、64 | 8GB |
| 3C、A8、84 | 16GB |
| 其他值 | NAND FLASH没有焊好或不支持的NAND FLASH。 |

下面列几种分析例子:

1. 打印信息如下,那么就是NAND FLASH没有焊好或者EMMC没有焊好。

![原稿截图或图表，PDF第9页，第13图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p009-figure-01.png)

2. 打印信息如下,只贴了两片NAND FLASH,但是系统却认到4片NAND FLASH,这种情况是是NAND FLASHCS没有焊好。

![原稿截图或图表，PDF第10页，第14图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p010-figure-01.png)

3. 打印信息如下,贴了两片NAND FLASH,系统也可以认到两片NANDFLASH的ID,但是ID是错误的,根据前面的表格,第一个字节是2c,是美光的NAND FLASH,第二个字节是8C,是错误的,正确的应该是88,可以确定是NAND FLASH没有焊好。

![原稿截图或图表，PDF第10页，第15图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p010-figure-02.png)

### 2.4. 写入IDB失败

量产工具提示写入ID_BLOCK失败：

![原稿截图或图表，PDF第11页，第16图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p011-figure-01.png)

开发工具提示写入ID_BLOCK失败:

![原稿截图或图表，PDF第11页，第17图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p011-figure-02.png)

开发工具log目录下log提示比较出错:

![原稿截图或图表，PDF第12页，第18图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p012-figure-01.png)

量产工具log目录下log提示:

![原稿截图或图表，PDF第12页，第19图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p012-figure-02.png)

并且LOG目录中有几个bin文件:

![原稿截图或图表，PDF第12页，第20图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p012-figure-03.png)

用文件内容比较工具比较文件名前缀相同,后缀为“flash”和”file”的两个文件,例如比较:

![原稿截图或图表，PDF第13页，第21图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p013-figure-01.png)

下面这种情况,只有一个bits或者几个bits差异的,是DDR问题,参考“2.2.下载BootCode成功后测试设备失败”的处理方法。

![原稿截图或图表，PDF第13页，第22图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p013-figure-02.png)

下面这种情况,有非常多的bits不同,一般是NANDFLASH有问题,可以多升级几次固件看是否可以解决. 如果NAND FLASH电源纹波太大或者没有使用滤波电容,可能也会出现这个问题。电源正常的情况下多次升级不能解决的,需要更换NAND FLASH解决。

![原稿截图或图表，PDF第13页，第23图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p013-figure-03.png)

### 2.5. 下载固件失败

量产工具提示下载固件失败：

![原稿截图或图表，PDF第14页，第24图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p014-figure-01.png)

量产工具log目录下log提示WriteLBA failed,出错代码 (-3):

![原稿截图或图表，PDF第14页，第25图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p014-figure-02.png)

量产工具log目录下log提示ReadLBA failed,出错代码 (-4):

![原稿截图或图表，PDF第14页，第26图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p014-figure-03.png)

这两种情况,都是USB通讯中断了,参考“2.1.Boot Code下载失败”处理办法。

量产工具log目录下log提示RKA_File_Check failed:

![原稿截图或图表，PDF第15页，第27图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p015-figure-01.png)

这种情况下log目下还会生成两个,一个是固件要写到flash的数据,一个是flash里面读出来错误 数据:

![原稿截图或图表，PDF第15页，第28图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p015-figure-02.png)

用文件内容比较工具比较这两个文件:下面这种情况,只有一个bits或者几个bits差异的,是DDR问题,参考“2.2.下载BootCode成功后测试设备失败”的处理方法。

![原稿截图或图表，PDF第16页，第29图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-01.png)

![原稿截图或图表，PDF第16页，第30图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-02.png)

大量bit不同通常指向NAND问题。原稿建议尝试量产工具“修复”模式，或先用开发工具“擦除IDB”再刷写。两种操作可能清除数据及启动元数据，必须先备份并确认目标。下面保留原按钮图。

![原稿截图或图表，PDF第16页，第31图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-03.png)

完成所选修复/擦除及必要检查后，再重新升级固件。

如果NAND FLASH电源纹波太大或者没有使用滤波电容,可能也会出现这个问题。如果电源正常并重新升级不能解决问题,需要更换NAND FLASH解决问题。

![原稿截图或图表，PDF第16页，第32图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p016-figure-04.png)

开发工具的提示及log信息和量产工具的log类似,可以参考量产工具的情况处理。

### 2.6. 校验芯片失败

量产工具下载时提示芯片校验失败，通常是所选固件与SoC不匹配；开发阶段也可能是固件打包参数错。原稿称开发工具不校验芯片信息，错误固件可能导致不开机或回到升级模式，应改刷正确固件。

![原稿截图或图表，PDF第17页，第33图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p017-figure-01.png)

上图的固件是rk30的,打包时参数配置错误,配置成RK29了。解决办法:打开文件mkupdate.bat,修改

![原稿截图或图表，PDF第17页，第34图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p017-figure-02.png)

```bat
Afptool -pack ./ Image\update.img
RKImageMaker.exe -RK29 RK30xxLoader(L)_V1.20.bin Image\update.img update.img -os_type:androidos
rem update.img is new format, Image\update.img is old format, so delete older format
del Image\update.img
pause
```

针对本RK30示例，将RKImageMaker.exe的芯片参数改为`-RK30`。

![原稿截图或图表，PDF第17页，第35图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p017-figure-03.png)

```bat
Afptool -pack ./ Image\update.img
RKImageMaker.exe -RK30 RK30xxLoader(L)_V1.20.bin Image\update.img update.img -os_type:androidos
rem update.img is new format, Image\update.img is old format, so delete older format
del Image\update.img
pause
```

更多详细的配置信息参考固件生成工具目录下的文档。

## 3. 其他问题

### 3.1. 升级固件完自动重启后还在升级模式

情况一、 用开发工具升级固件后,不开机,连接USB在在升级模式,串口信息提示如下:

![原稿截图或图表，PDF第18页，第36图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p018-figure-01.png)

串口图中的可辨识关键状态（节选；完整日志仍见原图）：

```text
unsigned!
SecureBootEn = 0
Boot ver: 2012-11-13#1.20
Error: Invaid tag(0x00000000)!
Load failed!
Begin recover...
GetRemapTbl flag = 1
Error: Invaid tag(0x00000000) in backup!
Start RockUsb...
2900305 UsbConnected
```

这种情况,都是升级固件时,升级了misc.img,没有升级recovery.img引起的。

![原稿截图或图表，PDF第19页，第37图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p019-figure-01.png)

解决办法:重新升级recovery.img或者往misc分区写入一个大于32KB的其他文件清除misc分区中的命令。情况二、RK3329、RK3368等平台,没有烧录trust.img的话也会出现升级后不能启动。解决办法:升级对应的trust.img

### 3.2. EMMC设备上电无法开机

原稿主要涉及RK3188、PX3、PX2、RK3066、RK3168；常见于更新loader或贴装预烧录存储器后。排查方法：

1. 先查硬件原理图和版图。CMD,DATA0‐DATA7都要上拉,上拉电阻建议10K。检查上拉电阻是否虚焊。PCB版图上EMMC信号线不能通过连接NC脚走线。

2. 用示波器测上电时序。CMD最好与EMMC VCCQ一起上电；若CMD晚于VCCQ，部分EMMC无法引导。

![原稿截图或图表，PDF第20页，第38图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p020-figure-01.png)

3. 用示波器测量CMD 、CLK线上是否有毛刺。如果有毛刺,部分EMMC 将无法引导开机。如下图所示。目前发现在RK3066 + TI的PMU会有此毛刺。解决方法是改变上电时序。

![原稿截图或图表，PDF第20页，第39图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p020-figure-02.png)

4. 用示波器测量CMD 、CLK、DATA线上过冲是否严重,可考虑接串联电阻匹配。下图中CLK 振铃较大可能引起逻辑错误。

![原稿截图或图表，PDF第21页，第40图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p021-figure-01.png)

5. 测量VCC纹波，必要时考虑合适滤波电容。

6. 采用预烧录方式时，检查EXT CSD是否配置错误。

原稿EXT CSD配置：179=0x08，从boot1启动且不使用ACK；167=0x1F；162=0x01，使能reset pin；其他保持默认。这些仅为对应平台示例，不是通用烧写指令，某些配置可能不可逆。

如果是RK312X、RK3228、RK3366、RK3288、RK3399等比较新的主控出现升级固件后机器开机还停留在MASKROM升级模式,那么问题一般都是EMMC D0-D7有个别数据线没有接对。

### 3.3. EMMC设备复位后无法开机

原稿要求SoC的EMMC_PWEN连接EMMC的“RTS_n”脚。该名称疑有拼写问题，必须核对实际原理图及datasheet，不能据此标签直接改线。

- 采用预烧录固件时，RK3188、PX3、PX2、RK3066、RK3168应核对EXTCSD 162配置为0x01。原稿“欲烧录”按上下文整理，实际配置须结合器件确认。

### 3.4. EMMC开机至LOADER耗时很长

原稿将原因归为BOOTROM进入NAND探测模式，耗时约几秒。排查方法：

1. 先查硬件原理图和版图。CMD, DATA0-DATA7都要上拉,上拉电阻建议10K。检查上拉电阻是否虚焊。PCB版图上EMMC信号线不能通过连接NC脚走线。下图是某客户通过NC脚链接到EMMC的DATA6,导致开机慢的PCB图。

![原稿截图或图表，PDF第22页，第41图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p022-figure-01.png)

(2)用示波器测量DATO-DATA7。在上电过程中DATA线的上升时间必须小于2us。如下图所示。图2是图1红色椭圆处波形展开,图2中DATA线的上升时间需小于2us。图1

![原稿截图或图表，PDF第23页，第42图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p023-figure-01.png)

图2

![原稿截图或图表，PDF第23页，第43图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p023-figure-02.png)

### 3.5. Android运行中EMMC读写报错

可能原因：

1. VCC 或者VCCQ供电不足,运行时出现电源塌陷

2. 走线不合理，干扰严重。

解决方法：

1. 检查EMMC电源是否受到外部干扰，例如开启WIFI；原稿建议EMMC独立供电。
2. 用示波器测量Bus timing是否符合要求。下图为DDR模式下CLK下降沿采样Holdtime不足、可能导致逻辑错误的案例。

![原稿截图或图表，PDF第24页，第44图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p024-figure-01.png)

### 3.6. EMMC功耗

原稿给出读写电流100-300mA、待机100-700uA。影响因素有速度模式、EMMC频率和容量、接口电压、温度、厂商工艺及上拉电阻。下图仅是某个未明确型号的EMMC典型参考，不是所有器件的保证限值。

![原稿截图或图表，PDF第25页，第45图](/docs/rockchip-firmware-upgrade-failure-analysis/assets/cn-p025-figure-01.png)

Ta=25°C @3.3V

| 模式 | 最大值/典型值 | 单位 |
| --- | --- | --- |
| 自动睡眠 | 350 | uA |
| 睡眠（CMD5） | 200最大；130典型 | uA |
| 读：默认速度 | 100 | mA |
| 读：高速 | 200 | mA |
| 写：默认速度 | 100 | mA |
| 写：高速 | 200 | mA |

VCC:2.7V–3.6V; 纹波最大60mV峰峰值。

[Rockchip](https://www.rock-chips.com/) · [ArmSoM](https://docs.armsom.org/)

{% endraw %}

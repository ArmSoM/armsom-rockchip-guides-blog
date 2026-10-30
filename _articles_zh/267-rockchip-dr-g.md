---
title: "Rockchip Dr.G：显示诊断、频率与 RGA/GPU/VOP 测试"
description: "Rockchip Dr.G：显示诊断、频率与 RGA/GPU/VOP 测试"
excerpt: "Rockchip Dr.G：显示诊断、频率与 RGA/GPU/VOP 测试"
translation_key: "267-rockchip-dr-g"
slug: "267-rockchip-dr-g"
lang: "zh"
date: "2026-10-30"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["ArmSoM", "Rockchip", "Android"]
---

{% raw %}

本文按 Dr.G V1.5 双语原稿整理，适用于原文列出的 Rockchip Android 7.1/8.1/9.0、kernel 4.4 平台。ArmSoM 板卡及较新 BSP 不在本次实测范围；请核对 SoC、内核、32 位运行库、工具及驱动后使用。原稿所有运行结果均为厂商示例，并非 ArmSoM 实测。双语 PDF 共用一套终端截图，四语保留原图；未提供另一套英文图片。原文命令及描述冲突在相关位置列明，不能据此猜改。参考 [ArmSoM 文档](https://docs.armsom.org/)。

## 1 主要功能说明

Dr.G 将日常显示问题调试中的脚本和应用整合为自动诊断工具：系统信息收集与 log 抓取、系统频率查询/设置、总线优先级查询/设置、RGA/GPU/VOP 自动测试及 LOG 自动检测。阅读本说明后也可自行排查部分问题。收集 log 和系统状态可减少客户与开发人员解决问题前的交互及代码同步工作。

## 2 平台依赖

### 2.1 适用平台

主要支持 kernel 4.4。原稿平台与 Android 版本如下，帮助命令为：

| SoC | Android |
|---|---|
| RK3368 | 7.1, 8.1, 9.0 |
| RK3288 | 7.1, 8.1, 9.0 |
| RK3399 | 7.1, 8.1, 9.0 |
| RK3328 | 8.1, 9.0 |
| RK3126C | 8.1, 9.0 |
| RK3326 | 8.1, 9.0 |

```sh
dr-g -h
```

![帮助命令（原稿 PDF 6）](/docs/rockchip-dr-g/images/bilingual-p006-1.png)

帮助命令（原稿 PDF 6）

### 2.2 Android 平台依赖

为兼容多平台，Dr.G 编译为 32 位 binary，建议放在 `/system/bin`。若提示 `librga.so not found` 等依赖库缺失，将 `/vendor/lib/` 对应 `.so` 拷贝到 `/system/lib/`；原稿的 push 脚本已自动完成此操作。

![librga 依赖错误（原稿 PDF 6）](/docs/rockchip-dr-g/images/bilingual-p006-2.png)

librga 依赖错误（原稿 PDF 6）

### 2.3 可执行程序压缩包

| Archive | Android |
|---|---|
| `dr-g-release_for_Android_7.1_v1.5.tar.gz` | 7.1 |
| `dr-g-release_for_Android_8.1_v1.5.tar.gz` | 8.1 |
| `dr-g-release_for_Android_9.0_v1.5.tar.gz` | 9.0 |

解压相应包，确保 ADB 连通且 `adb root`、`adb remount`、`adb shell` 可用，执行 `only_push_dr-g.bat` 安装至目标板，然后在板上排查。

![安装脚本（原稿 PDF 7）](/docs/rockchip-dr-g/images/bilingual-p007-1.png)

安装脚本（原稿 PDF 7）

## 3 使用说明

### 3.1 系统信息收集与日志抓取

#### 3.1.1 命令说明

```sh
dr-g -dump-info
```

收集 `manifest.xml`、`commit_id.xml`、`build.prop`、`anr_trace`、`logcat`、`dmesg`、io 优先级配置、CPU/GPU/DDR 当前频率电压及最大频率、`vop_clk_summary`、当前 fence 状态、`dumpsys SurfaceFlinger` 和 `ps` 当前进程。输出 `/data/dr-g-file/dumpInfo.tar`。

![系统信息抓取示例（原稿 PDF 8）](/docs/rockchip-dr-g/images/bilingual-p008-1.png)

系统信息抓取示例（原稿 PDF 8）

#### 3.1.2 脚本说明

双击 `push_and_pull_dr-g.bat` 一键收集，在当前路径生成按时间命名的目录保存 `dumpInfo.tar`。只安装以使用其他功能，运行 `only_push_dr-g.bat`；只拉取归档，运行 `only_pull_dr-g.bat`。

![一键抓取（原稿 PDF 9）](/docs/rockchip-dr-g/images/bilingual-p009-1.png)

一键抓取（原稿 PDF 9）

### 3.2 系统频率查询和设置

#### 3.2.1 最大性能模式

```sh
dr-g -sys-set perf
```

将 CPU、GPU、DDR 设为最高频率并关闭温控，回显设置后的频率，用于应用性能调试。原文明确会关闭温控，须在受控调试环境中核对散热条件。

![最高频率（原稿 PDF 9）](/docs/rockchip-dr-g/images/bilingual-p009-2.png)

最高频率（原稿 PDF 9）

#### 3.2.2 当前频率

```sh
dr-g -sys-set info
```

打印当前 CPU/GPU/DDR 频率与温控状态，用于应用性能调试。

![频率查询（原稿 PDF 10）](/docs/rockchip-dr-g/images/bilingual-p010-1.png)

频率查询（原稿 PDF 10）

#### 3.2.3 设置 GPU 频率档

```sh
dr-g -sys-set gpu low
dr-g -sys-set gpu mid
dr-g -sys-set gpu high
```

用于分析 GPU 瓶颈。上述命令将 CPU、DDR 设为最高频率，把 GPU 设为频率表低、中、高档，比较三档下的应用表现。

![GPU 低频（原稿 PDF 11）](/docs/rockchip-dr-g/images/bilingual-p011-1.png)

GPU 低频（原稿 PDF 11）

![GPU 中频（原稿 PDF 11）](/docs/rockchip-dr-g/images/bilingual-p011-2.png)

GPU 中频（原稿 PDF 11）

![GPU 高频（原稿 PDF 11）](/docs/rockchip-dr-g/images/bilingual-p011-3.png)

GPU 高频（原稿 PDF 11）

#### 3.2.4 设置 CPU 频率档

```sh
dr-g -sys-set cpu low
dr-g -sys-set cpu mid
dr-g -sys-set cpu high
```

用于分析 CPU 瓶颈。上述命令将 GPU、DDR 设为最高频率，把 CPU 设为频率表低、中、高档，比较三档下的应用表现。

![CPU 低频（原稿 PDF 12）](/docs/rockchip-dr-g/images/bilingual-p012-1.png)

CPU 低频（原稿 PDF 12）

![CPU 中频（原稿 PDF 12）](/docs/rockchip-dr-g/images/bilingual-p012-2.png)

CPU 中频（原稿 PDF 12）

![CPU 高频（原稿 PDF 12）](/docs/rockchip-dr-g/images/bilingual-p012-3.png)

CPU 高频（原稿 PDF 12）

#### 3.2.5 设置 DDR 频率档

```sh
dr-g -sys-set ddr low
dr-g -sys-set ddr mid
dr-g -sys-set ddr high
```

用于分析 DDR 瓶颈。上述命令将 CPU、GPU 设为最高频率，把 DDR 设为频率表低、中、高档，比较三档下的应用表现。

![DDR 低频（原稿 PDF 13）](/docs/rockchip-dr-g/images/bilingual-p013-1.png)

DDR 低频（原稿 PDF 13）

![DDR 中频（原稿 PDF 13）](/docs/rockchip-dr-g/images/bilingual-p013-2.png)

DDR 中频（原稿 PDF 13）

![DDR 高频（原稿 PDF 14）](/docs/rockchip-dr-g/images/bilingual-p014-1.png)

DDR 高频（原稿 PDF 14）

#### 3.2.6 恢复调频

```sh
dr-g -sys-set reset
```

恢复 CPU、DDR、GPU 系统调频模式及温控。

![恢复调频（原稿 PDF 14）](/docs/rockchip-dr-g/images/bilingual-p014-2.png)

恢复调频（原稿 PDF 14）

### 3.3 总线优先级

#### 3.3.1 查询

```sh
dr-g -io-qos get
```

输出总线优先级及带编号的 name 表，可按编号设置。

![io 优先级（原稿 PDF 15）](/docs/rockchip-dr-g/images/bilingual-p015-1.png)

io 优先级（原稿 PDF 15）

#### 3.3.2 设置

按提示表查找对应项，`pri_num` 为 `0~3`，成功提示 `io_qos set SUCCESS !!!`。

```sh
dr-g -io-qos set
dr-g -io-qos set 4 1
dr-g -io-qos set 1 2
dr-g -io-qos set 0 1
```

例子分别说明编号 `[4]` 设 1、`[1]` 设 2。第三例命令 `set 0 1` 与原稿中英文注释“编号 [0] 设为 0”矛盾，二者保留，执行前以实际工具帮助核对。

![设置 io 优先级（原稿 PDF 16）](/docs/rockchip-dr-g/images/bilingual-p016-1.png)

设置 io 优先级（原稿 PDF 16）

### 3.4 RGA 自动测试

#### 3.4.1 信息

```sh
dr-g -rga info
```

打印 RGA 版本、硬件支持的格式、缩放倍数、最大输入/输出分辨率。

![RGA 信息（原稿 PDF 16）](/docs/rockchip-dr-g/images/bilingual-p016-2.png)

RGA 信息（原稿 PDF 16）

#### 3.4.2 自检

```sh
dr-g -rga test
```

按支持格式测试转换、缩放、旋转和合成，将结果 CRC 与预存 CRC 比较。不一致时，原稿据此判断系统 RGA 存在问题。

![RGA 自检（原稿 PDF 17）](/docs/rockchip-dr-g/images/bilingual-p017-1.png)

RGA 自检（原稿 PDF 17）

#### 3.4.3 效率

```sh
dr-g -rga perf
```

根据 DDR 频率和 RGA aclk 算出 720p、1080p、4k 数据的理论耗时，与实测耗时比较判断是否符合预期。

![RGA 效率（原稿 PDF 17）](/docs/rockchip-dr-g/images/bilingual-p017-2.png)

RGA 效率（原稿 PDF 17）

#### 3.4.4 Demo

通过参数执行 RGA 功能，源数据及目标数据在 data 目录。`-rga demo` 后的参数串必须连续，不可插入空格。

```sh
dr-g -rga demo
dr-g -rga demo sw1280sh720sf0dw1280dh720df0rt2sx0sy0dx0dy0
```

![RGA 源数据（原稿 PDF 18）](/docs/rockchip-dr-g/images/bilingual-p018-1.png)

RGA 源数据（原稿 PDF 18）

![RGA 目标数据（原稿 PDF 18）](/docs/rockchip-dr-g/images/bilingual-p018-2.png)

RGA 目标数据（原稿 PDF 18）

参数表（原稿 `alpah` 拼写及 blit 值 105/405 保留，不猜测进制）：

| alpah | blit | Formula |
|---|---|---|
| bd1 | 105 | `src + dst*(1-alpha)` |
| bd2 | 405 | `src*alpha + dst*(1-alpha)` |

| Parameter | Rotation |
|---|---|
| rt1 | rotate 90 |
| rt2 | rotate180 |
| rt3 | rotate270 |
| rt4 | mirrorH |
| rt5 | mirrorV |

| Parameter | Format |
|---|---|
| sf0 | RGBA8888 |
| sf1 | RGBX8888 |
| sf2 | BGRA8888 |
| sf3 | RGB888 |
| sf4 | RGB565 |
| sf5 | NV12 |
| sf6 | NV21 |
| sf7 | YV12 |
| sf8 | YV21 |
| sf9 | NV16 |
| sf10 | NV61 |
| sf11 | YV16 |
| sf12 | YV61 |

示例将 `/data/in0w1280-h720-rgba8888.bin` 旋转 180°，写入 `/data/out0w1280-h720-rgba8888.bin`，可拉取 raw 数据用工具查看。原稿截图路径显示 `out0w1280-h720-rgba8888.bin`，不将它当成新参数。

![RGA 输出日志（原稿 PDF 19）](/docs/rockchip-dr-g/images/bilingual-p019-1.png)

RGA 输出日志（原稿 PDF 19）

![RGA 旋转结果（原稿 PDF 20）](/docs/rockchip-dr-g/images/bilingual-p020-1.png)

RGA 旋转结果（原稿 PDF 20）

### 3.5 GPU 自动测试

#### 3.5.1 最大负载

```sh
dr-g -gpu max-load
dr-g -gpu max-load 100
dr-g -gpu max-load-bg
```

可在命令后加秒数，如 100 表示运行 100 秒，负载接近 100%，用于老化或系统负载测试。`max-load-bg` 在后台运行，不改变前端画面，其余同 `max-load`。原稿排版在若干行将 `max-load` 拆成 `max -load`；依据同页连续示例恢复连字符，不改变参数。

![GPU 最大负载（原稿 PDF 20）](/docs/rockchip-dr-g/images/bilingual-p020-2.png)

GPU 最大负载（原稿 PDF 20）

#### 3.5.2 最高帧率

```sh
dr-g -gpu max-fps
```

shell 打印当前系统 GPU 应用最高帧率，原稿说明其等于屏刷新率，若与 60fps 相差较大应检查屏刷新率配置。这是该原稿测试条件，不应把所有屏幕固定为 60Hz。

![GPU 最高帧率（原稿 PDF 21）](/docs/rockchip-dr-g/images/bilingual-p021-1.png)

GPU 最高帧率（原稿 PDF 21）

#### 3.5.3 性能

```sh
dr-g -sys-set perf
dr-g -gpu perf
```

测试前 CPU/DDR/GPU 定最高频。输出本次耗时及该平台参考耗时；原稿将超过参考值 10% 视为 GPU 未充分发挥性能。

![GPU 性能（原稿 PDF 21）](/docs/rockchip-dr-g/images/bilingual-p021-2.png)

GPU 性能（原稿 PDF 21）

#### 3.5.4 GLES 版本支持

```sh
dr-g -gpu gles11
```

![GLES 1.1（原稿 PDF 22）](/docs/rockchip-dr-g/images/bilingual-p022-1.png)

GLES 1.1（原稿 PDF 22）

```sh
dr-g -gpu gles20
```

![GLES 2.0（原稿 PDF 22）](/docs/rockchip-dr-g/images/bilingual-p022-2.png)

GLES 2.0（原稿 PDF 22）

```sh
dr-g -gpu gles30
```

![GLES 3.0（原稿 PDF 22）](/docs/rockchip-dr-g/images/bilingual-p022-3.png)

GLES 3.0（原稿 PDF 22）

运行后 shell 打印 EGL 信息，分别验证 GLES 1.1、2.0、3.0。原文 gles11 段落写“GLES1.0 运行成功”，与标题及命令 1.1 不一致；保留为原文疑点，需以实际输出核对。

#### 3.5.5 OpenCL

```sh
dr-g -cl
```

原稿 `dr-g –cl` 使用排版长横，按终端截图恢复 ASCII `-cl`。提示 `OpenCL test OK !` 表示该平台通过原稿 OpenCL 支持测试。

![OpenCL 测试（原稿 PDF 23）](/docs/rockchip-dr-g/images/bilingual-p023-1.png)

OpenCL 测试（原稿 PDF 23）

#### 3.5.6 Vulkan

```sh
dr-g -vk info
```

打印 Vulkan 版本、支持的扩展和功能。

![Vulkan 信息（原稿 PDF 23）](/docs/rockchip-dr-g/images/bilingual-p023-2.png)

Vulkan 信息（原稿 PDF 23）

```sh
dr-g -vk test
```

绘制简单三角形；屏幕出现三角形且命令行输出 `vulkan test ok`，表示原稿测试的 Vulkan 驱动环境正常。

![Vulkan 测试结果（原稿 PDF 23）](/docs/rockchip-dr-g/images/bilingual-p023-3.png)

Vulkan 测试结果（原稿 PDF 23）

### 3.6 VOP 自动测试

#### 3.6.1 最大 DDR 负载

```sh
dr-g -vop -c chip-type
```

配置 VOP 并增加 DDR 负载，检查预设 DDR 条件下能否正确输出图像。`chip-type` 可选 `rk3399`、`rk3326`、`rk3368`、`rk3328`、`rk3288`、`rk3128`、`rk3188`。此参数列表不同于 §2.1 支持平台表，不推断扩展支持范围。

![VOP 最大负载（原稿 PDF 24）](/docs/rockchip-dr-g/images/bilingual-p024-1.png)

VOP 最大负载（原稿 PDF 24）

#### 3.6.2 VOP demo

用命令参数配置指定 `win_id` 输出图像，便于调屏。格式与示例：

```sh
dr-g -vop -w <win_id>@<crtc_id>:<src_left>,<src_top>,<src_w>,<src_h>:<dst_left>,<dst_top>,<dst_w>,<dst_h>[#zpos][@<format>]
dr-g -vop -w 0@0:0,0,1536,2048:0,0,1536,2048#1@AR24 -f 1536x2048@AR24
```

![VOP 源数据（原稿 PDF 25）](/docs/rockchip-dr-g/images/bilingual-p025-1.png)

VOP 源数据（原稿 PDF 25）

![VOP 目标数据（原稿 PDF 25）](/docs/rockchip-dr-g/images/bilingual-p025-2.png)

VOP 目标数据（原稿 PDF 25）

### 3.7 LOG 自动检测

#### 3.7.1 当前日志分析

```sh
dr-g -log-ans
```

将当前 logcat 日志与预设报错规则匹配，发现匹配时报警并给出修改建议。先整理错误规则，后续便可由工具打印相应行定位，减少人工从复杂日志搜索的工作。

![日志分析结果（原稿 PDF 26）](/docs/rockchip-dr-g/images/bilingual-p026-1.png)

日志分析结果（原稿 PDF 26）

#### 3.7.2 XML 规则

`log_id` 为规则日志 ID；`match_str` 为匹配字符串；`advice` 为建议。

![XML 规则原图（原稿 PDF 26）](/docs/rockchip-dr-g/images/bilingual-p026-2.png)

XML 规则原图（原稿 PDF 26）

```sh
<collection instructions="This is the rule of log analysis">
<rule>
  <log_id>1</log_id>
  <match_str>Kernel module may not have been loaded</match_str>
  <advice>此报错是由于kernel以module的形式加载mali驱动，且加载失败了，/dev/mali0节点并未被生成。建议：检查/system/lib/module下是否有该模块的.ko文件。或采用build_in的方式编译该驱动。</advice>
</rule>
<rule>
  <log_id>2</log_id>
  <match_str>Runtime and build version of gralloc private structure does not match for handle</match_str>
  <advice>Gralloc版本与预期版本对不上。建议：请同步SDK对应匹配的Gralloc版本。</advice>
</rule>
<rule>
  <log_id>3</log_id>
  <match_str>Failed to set damage region on surface</match_str>
  <advice>此报错多发生在安卓8.1系统，是hwui框架代码，在abandon之后，无返回直接报fatal导致的。可以参考redmine:189373</advice>
</rule>
<rule>
  <log_id>4</log_id>
  <match_str>beginning of crash</match_str>
  <advice>发现有Android Crash信息，可以搜索关键字：beginning of crash定位，查看堆栈</advice>
</rule>
</collection>
```

原图XML转为可复制文本，原中文advice字段保留。四条建议分别为：检查Mali模块或改为内建；同步SDK匹配的Gralloc；Android8.1 hwui abandon后fatal参考redmine:189373；搜索beginning of crash查看堆栈。

{% endraw %}

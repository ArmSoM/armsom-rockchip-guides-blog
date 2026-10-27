---
title: "Rockchip PCBA 测试工具开发指南"
description: "Rockchip PCBA 测试工具开发指南"
excerpt: "Rockchip PCBA 测试工具开发指南"
translation_key: "252-rockchip-pcba-test-tool"
slug: "252-rockchip-pcba-test-tool"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "PCBA"]
---

{% raw %}

# Rockchip PCBA 测试工具开发指南

依据 RK-KF-YF-264 V1.3 双语原稿，完整保留概述、测试项、配置、参数与测试扩展、接口、旋转和编译运行说明。技术版本说明包含 Android 5.0 后自动识别蓝牙及 V1.3 支持 Android 10.0。适用性属于原稿历史范围，需核对目标 BSP；未测试硬件。中英文采用原稿对应语段，俄德完整翻译；原稿无技术图片或技术表格，不制造配图。封面日期、声明、联系方式、读者和修订记录移除。

校对：正文跨页已接续，接口注释解释转为正文并逐语翻译，示例内中文短注释已对应翻译。原稿疑点保留：UST HOST/USB HOST、test_cong.cfg/test_config.cfg、Expample、Boardconfig.mk 大小写、program“未使用”与后续 case1/case2 配置冲突；音频项位于自动测试段但 category=1。原 module_args 使用弯引号，error/n、...... 和未实现条件为原示例，不当作可直接编译程序。中文“啸叫”比英文 noise 更具体，俄德按反馈啸叫译。格式化会清除数据，先确认目标介质并备份；音频测试注意音量和录音隐私。本次未运行测试、格式化或编译。

<!-- source:bilingual p2 unit:0 -->

## 概述

<!-- source:bilingual p2 unit:1 -->

PCBA 测试工具用于帮助在量产的过程中快速地甄别产品功能的好坏，提高生产效率。目前包括屏幕（LCD）、无线（wifi）、蓝牙（bluetooth）、DDR/EMMC存储、SD卡（sdcard）、UST HOST、按键（KEY），喇叭耳机（Codec）测试项目。

<!-- source:bilingual p2 unit:2 -->

这些测试项目包括自动测试项和手动测试项，无线网络、DDR/EMMC、以太网为自动测试项，按键、SD卡、USB HOST、Codec为手动测试项目。

<!-- source:bilingual p2 unit:3 -->

工具通过配置文件test_config.cfg对测试项进行配置，并可根据需求增加新测试项，具体的配置说明请参考本文“配置说明”。

<!-- source:bilingual p3 unit:4 -->

## 测试项说明

<!-- source:bilingual p3 unit:5 -->

测试项分为自动测试项 和 手动测试项。

<!-- source:bilingual p3 unit:6 -->

自动测试项由系统自动进行测试并判断测试结果，如：网络、存储等；手动测试项需要由人工配合完成或者配合判断测试结果，如：录音，按键，U盘，SD卡等。

<!-- source:bilingual p3 unit:7 -->

测试项分别有 “红”，“黄” 两种颜色表示不同的测试状态。

<!-- source:bilingual p3 unit:8 -->

黄色：未测试项或者正在测试的项, 通过后会显示[PASS].

<!-- source:bilingual p3 unit:9 -->

红色：测试未通过项

<!-- source:bilingual p3 unit:10 -->

### 自动测试项

<!-- source:bilingual p3 unit:11 -->

#### DDR/EMMC 容量检测

<!-- source:bilingual p3 unit:12 -->

DDR/EMMC容量检测为自动测试项，自动显示当前设备DDR容量和EMMC容量大小，显示单位为GB，常见DDR容量为1GB、2GB、4GB等，常见EMMC容量为2GB、4GB、8GB、16GB、32GB、64GB、128GB等。测试结果示例如下： “系统存储：[通过] { DDR：2GB，EMMC：16GB }”

<!-- source:bilingual p3 unit:13 -->

#### 无线网络（Wi-Fi 测试）

<!-- source:bilingual p3 unit:14 -->

Wi-Fi为自动测试项，会自动扫描周边的AP，并显示信号最强的那个AP名字及信号强度。信号强度根据AP强度显示0到4格。测试结果如下： 网络：[通过] { “AP WIFI” 信号强度 4 格 }

<!-- source:bilingual p3 unit:15 -->

#### 以太网测试

<!-- source:bilingual p3 unit:16 -->

有两种测试方式，默认以ping的方式测试以太网的通信功能，发5个包收5个包，0包丢失。本机网址和ping的目标网址在external/rk-pcba-test/res/test_cong.cfg中修改。

<!-- source:bilingual p3 unit:17 -->

另一种测试方法，是以检测网卡是否启动来判断，网卡启动时会有一个inet6的网址，如:“inet6addr: fe80::c8eb:eaff:fe6d:730d/64 Scope:Link”。

<!-- source:bilingual p3 unit:18 -->

检测到有inet6网址，则认为以太网是正常的。（这种方式不能确定网络的通信是否正常）。如需使用此方式测试以太网须修改external/rk-pcba-test/lan_test.c，将c文件中的“use_ping = 1;”注释掉即可。

<!-- source:bilingual p4 unit:19 -->

#### 耳机喇叭（codec）测试

<!-- source:bilingual p4 unit:20 -->

Codec测试有两种模式：边录边放、先放后录。先放后录模式，测试效率相对低，使用喇叭时不会有啸叫，可在使用喇叭时选择此模式。边录边放模式，测试效率高，使用喇叭时会有啸叫，可在使用耳机时选择此模式。测试后的录音音量根据实际输入变化，范围从0-100%：“录音音量：[25%]”（模式配置见本文配置说明）。

<!-- source:bilingual p4 unit:21 -->

#### 蓝牙测试

<!-- source:bilingual p4 unit:22 -->

蓝牙测试为自动测试项，开启检测后系统自动进行检测，根据检测结果显示成功或失败。

<!-- source:bilingual p4 unit:23 -->

蓝牙测试默认使用的端口是/dev/ttyS0,如果实际使用的端口不是ttyS0,需要修改配置文件:hardware/broadcom/libbt/conf/rockchip/rksdk/bt_vendor.conf,将bt_vendor.conf中的UartPort修改成实际使用的端口。

<!-- source:bilingual p4 unit:24 -->

### 手动测试项

<!-- source:bilingual p4 unit:25 -->

#### SD 卡测试

<!-- source:bilingual p4 unit:26 -->

插入SD卡，系统会进行自动检测，检测后屏幕显示SD卡是否通过，如通过，则会显示SD卡容量信息。

<!-- source:bilingual p4 unit:27 -->

SD card必须为FAT32格式，不支持其他格式！整个卡只能包含一个分区。如果不符合要求，请通过格式化来格式成标准格式。

<!-- source:bilingual p4 unit:28 -->

#### USB HOST 测试

<!-- source:bilingual p4 unit:29 -->

USB HOST常用U盘进行测试，插入U盘后会自动检测，检测结束后显示是否通过，并显示U盘容量信息。

<!-- source:bilingual p4 unit:30 -->

与SD卡类似，U盘必须为FAT32格式，不支持其他格式！整个卡只能包含一个分区。如果不符合要求，请通过格式化来格式成标准格式。

<!-- source:bilingual p5 unit:31 -->

## 配置文件说明

<!-- source:bilingual p5 unit:32 -->

PCBA所有的测试项目通过配置脚本test_config.cfg来配置，位于”AndroidSDK”/bootable/recovery/pcba_core/res/test_config.cfg，用户可以根据项目的硬件配置来配置test_config.cfg文件，决定要对哪些模块进行测试，以及给自己的测试程序传递相关的参数。

<!-- source:bilingual p5 unit:33 -->

该脚本使用ini文件格式，由段、键和值三者组成，通常一个段表示一个模块配置。目前要求该配置文件使用UTF-8编码，其他编译格式可能会导致未知错误。

<!-- source:bilingual p5 unit:34 -->

### 1.3.1 配置文件模板

<!-- source:bilingual p5 unit:35 -->

```text
[example]
display_name= "Example"
activated = 1
program = "example.sh"
category = 0
[example]
```

<!-- source:bilingual p5 unit:36 -->

#### [example] / Example

<!-- source:bilingual p5 unit:37 -->

Expample表示一个配置模块的名称，如果是cfg文件中自带的模块名称，则不能改动，否则会导致某个测试项不被测试系统启动。

<!-- source:bilingual p5 unit:38 -->

#### display_name

<!-- source:bilingual p5 unit:39 -->

display_name表示该测试模块在屏幕上显示的名称，可以根据自己的需要修改，该名称最长为64字节，如果为空，则测试程序不会运行。

<!-- source:bilingual p5 unit:40 -->

#### activated

<!-- source:bilingual p5 unit:41 -->

activated表示是否测试该模块，0：不测试该模块，1：测试该模块。

<!-- source:bilingual p5 unit:42 -->

#### program

<!-- source:bilingual p5 unit:43 -->

该键值目前没用到，可以不用配置。

<!-- source:bilingual p5 unit:44 -->

#### category

<!-- source:bilingual p5 unit:45 -->

category 表示测试方式，0：自动测试，1：手动测试。

<!-- source:bilingual p5 unit:46 -->

#### 示例

<!-- source:bilingual p6 unit:47 -->

```text
[Key] //按键测试 key test
display_name= "Key"
activated = 1 //测试该项目 test this item
program = "keytester"
category = 1 //手动测试 manual test
```

<!-- source:bilingual p6 unit:48 -->

### 部分测试项配置说明

<!-- source:bilingual p6 unit:49 -->

#### 音频测试

<!-- source:bilingual p6 unit:50 -->

```text
[Codec]
display_name= "Codec"
activated = 1 //测试该项目 test this item
program = "case1" //case1, case2
category = 1 //手动测试 manual test
run_type = 1
delay = 5
volume = 40
```

<!-- source:bilingual p6 unit:51 -->

##### Case1

<!-- source:bilingual p6 unit:52 -->

先放后录模式，测试效率相对低，使用喇叭时不会有啸叫，可在使用喇叭时选择此模式。

<!-- source:bilingual p6 unit:53 -->

##### Case2

<!-- source:bilingual p6 unit:54 -->

边录边放模式，测试效率高，使用喇叭时会有啸叫，可在使用耳机时选择此模式。

<!-- source:bilingual p6 unit:55 -->

#### 蓝牙测试

<!-- source:bilingual p6 unit:56 -->

```text
[bluetooth]
display_name= "bluetooth"
activated = 1
program =
category =
run_type = 1
chip_type = "" ; rk903, mt6622, rda587x, rda5990,rtk8723as
```

<!-- source:bilingual p6 unit:57 -->

chip_type 为选择相应的BT芯片型号，默认为空，也就是不测试BT，Android 5.0后不需要选择，系统会自动识别。

<!-- source:bilingual p6 unit:58 -->

#### 传感器测试

<!-- source:bilingual p6 unit:59 -->

```text
[allsensor]
display_name= "allsensor"
activated = 0
program = ""
category = 0
run_type = 1
sensor_type = 39
```

<!-- source:bilingual p7 unit:60 -->

sensor_type 会选择相应的传感器种类。1：GSENSOR，2：GYROSCOPE，4： COMPASS，8：LSENSOR，16：PSENSOR，32：GSENSOR_CALIBRATE。如果需要测试多种传感器，只需把传感器种类对应的数值相加即可。默认的sensor_type是39，即GSENSOR_CALIBRATE(32)+COMPASS(4)+GYROSCOPE(2)+GSENSOR(1)。

<!-- source:bilingual p7 unit:61 -->

#### Camera 测试

<!-- source:bilingual p7 unit:62 -->

```text
[camera]
display_name = "camera"
activated = 1
category = 0
program = ""
number = 2
```

<!-- source:bilingual p7 unit:63 -->

number表示测试的camera个数，最大支持测试2个camera.

<!-- source:bilingual p7 unit:64 -->

如需自行添加测试模组，请参考文档《RK_PCBA_Camera移植说明v1.0.doc》。

<!-- source:bilingual p7 unit:65 -->

## 配置脚本参数扩展

<!-- source:bilingual p7 unit:66 -->

test_config.cfg配置脚本中各测试项的参数可以进一步扩展，如果某个模块需要通过配置脚本传递相关参数，可进行如下扩展：

<!-- source:bilingual p7 unit:67 -->

```text
[example]
display_name= "Example"
activated = 1
program = "example.sh"
module_args = “xxx”
```

<!-- source:bilingual p7 unit:68 -->

在具体的测试程序中，可以通过script_fetch api获得设置的相关参数值：

<!-- source:bilingual p7 unit:69 -->

```text
int script_fetch(char *main_name, char *sub_name, int value[], int count);
```

<!-- source:bilingual p7 unit:70 -->

main_name：测试模块的名称，在test_config.cfg文件中测试项，示例中的“example”

<!-- source:bilingual p7 unit:71 -->

sub_name:键值，比如activated、display_name、module_args等等。

<!-- source:bilingual p7 unit:72 -->

### 取值示例

<!-- source:bilingual p8 unit:73 -->

```text
if(script_fetch("example", "module_args", (int *)des, 8) == 0)
{
printf("module_args value is: %s\n",des);
}
```

<!-- source:bilingual p8 unit:74 -->

## 测试项扩展

<!-- source:bilingual p8 unit:75 -->

该PCBA程序允许用户扩展自己的测试样例，如果因为项目需要，用到了该测试程序中目前还未支持到的模块，可以自己添加测试程序，然后集成到测试框架中。

<!-- source:bilingual p8 unit:76 -->

集成方法如下：

<!-- source:bilingual p8 unit:77 -->

（1）先写好自己的测试程序和头文件。测试程序要封装成void * xxxx_test(void *argv,display_callback *hook)格式的接口。

<!-- source:bilingual p8 unit:78 -->

（2）确定该测试项为手动测试项或者是自动测试项，并在test_config.cfg里面加入想要的配置。

<!-- source:bilingual p8 unit:79 -->

（3）rkfactory_test.cpp中注册自己的测试代码。

<!-- source:bilingual p8 unit:80 -->

```text
/* new_test.h */
#ifndef _NEW_TEST_H_
#define _NEW_TEST_H_
#include "display_callback.h"
void *new_test(void *argv, display_callback *hook);
#endif
/* new_test.cpp */
void *new_test(void *argv, display_callback *hook) {
struct testcase_info *tc_info = (struct testcase_info *)argv;
char msg[50];
snprintf(msg, sizeof(msg), "%s:[%s..]", "New Test", PCBA_TESTING);
hook->handle_refresh_screen(tc_info->y, msg);
if (/* pass or fail */) {
hook->handle_refresh_screen_hl(tc_info->y, msg, highlight);
}
}
/* rkfactory_test.cpp */
#include "new_test.h"
int start_test_pthread(struct testcase_info *tc_info) {
......
if (!strcmp(tc_info->base_info->name, "new")) {
init_title_lines_for_testcase(tc_info->base_info->name, tc_info);
std::thread *temp = new std::thread(&new_test, tc_info, get_display_hook());
if (!temp) {
printf("create %s test thread error/n", tc_info->base_info->name);
}
}
......
}
```

<!-- source:bilingual p9 unit:81 -->

### 接口说明

<!-- source:bilingual p9 unit:82 -->

msg_index：显示词条的索引，通常传入创建时当前的位置，即消息数组的位置。msg：显示词条的内容，std::string 类型，内容自行填写。

<!-- source:bilingual p9 unit:83 -->

```text
handle_refresh_screen(int msg_index, string msg);
```

<!-- source:bilingual p9 unit:84 -->

highlight：显示词条是否高亮，默认高亮为红色，通常在测试 fail 时传入 true。

<!-- source:bilingual p9 unit:85 -->

```text
handle_refresh_screen_hl(int msg_index, string msg, boolean highlight);
```

<!-- source:bilingual p9 unit:86 -->

其中new_test为模块中的测试函数。

<!-- source:bilingual p9 unit:87 -->

## 屏幕旋转配置

<!-- source:bilingual p9 unit:88 -->

PCBA测试支持屏幕旋转功能，根据需求旋转0°、90°、180°、270°以支持不同摆放的横/竖屏显示，其中0°、180°用于支持竖屏，90°、270°用于支持横屏，默认为0°。

<!-- source:bilingual p9 unit:89 -->

旋转屏幕的配置在device/rockchip/common/Boardconfig.mk中

<!-- source:bilingual p9 unit:90 -->

```text
#rotate screen to 0, 90, 180, 270
#0: ROTATION_NONE ORIENTATION_0 : 0
#90: ROTATION_RIGHT ORIENTATION_90 : 90
#180: ROTATION_DOWN ORIENTATION_180: 180
#270: ROTATION_LEFT ORIENTATION_270: 270
# For Recovery Rotation
TARGET_RECOVERY_DEFAULT_ROTATION ?= ROTATION_NONE
```

<!-- source:bilingual p9 unit:91 -->

## 固件编译配置打包

<!-- source:bilingual p9 unit:92 -->

PCBA测试程序位于”Android SDK”/bootable/recovery/pcba_core目录下，编译会静态链接到recovery中。pcba_core/res下的相关文件在编译的时候会被自动拷贝到recovery的pcba目录下。

<!-- source:bilingual p9 unit:93 -->

PCBA程序运行于Recovery系统中，具体测试流程为：开机进入Recovery，启动PCBA测试程序进行各项功能测试。

{% endraw %}

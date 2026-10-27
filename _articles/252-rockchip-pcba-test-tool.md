---
title: "Rockchip PCBA Test Tool Developer Guide"
description: "Rockchip PCBA Test Tool Developer Guide"
excerpt: "Rockchip PCBA Test Tool Developer Guide"
translation_key: "252-rockchip-pcba-test-tool"
slug: "252-rockchip-pcba-test-tool"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "android"
products: []
tags: ["Rockchip", "ArmSoM", "Android", "PCBA"]
---

{% raw %}

# Rockchip PCBA Test Tool Developer Guide

Complete technical edition of bilingual RK-KF-YF-264 V1.3: overview, tests, configuration, parameter/test extensions, interfaces, rotation and build/runtime instructions. Technical version context retains Bluetooth auto-detection after Android 5.0 and V1.3 support for Android 10.0. This is historical source scope; verify the target BSP. No hardware testing was performed. Chinese/English follow their respective source passages; Russian/German are complete translations. No technical images or tables exist in the source; none are invented. Cover dates, disclaimers, contact details, audience and revision history are removed.

Audit: page continuations joined; interface explanations moved from comments into fully translated prose; short Chinese code comments localized. Source issues retained: UST HOST/USB HOST, test_cong.cfg/test_config.cfg, Expample, Boardconfig.mk casing, the unused-program statement versus case1/case2 configuration, and codec placement under automatic tests despite category=1. Curly module_args quotes, error/n, ...... and unimplemented conditions belong to the source example, not a directly compilable program. Chinese describes acoustic feedback more specifically than English “noise”; Russian/German retain that specificity. Formatting erases data: verify media and back up. Protect recording privacy and hearing during audio tests. No test, formatting or build was executed.

<!-- source:bilingual p2 unit:0 -->

## Overview

<!-- source:bilingual p2 unit:1 -->

PCBA test tool is used to help quickly identify product features failures during production to improve the production efficiency. Current test items include panel (LCD), wireless (Wi-Fi), Bluetooth, DDR/eMMC memory, SD card, USB HOST, KEY, speaker earphone (Codec).

<!-- source:bilingual p2 unit:2 -->

These test items include automatic test items and manual test items. Wireless network, DDR/eMMC, Ethernet are automatic test items, while key, SD card, USB Host, Codec are manual test items.

<!-- source:bilingual p2 unit:3 -->

The tool configures the test items through the configuration file test_config.cfg, and can add new test items according to the requirement. For the detailed configuration, please refer to “configuration instruction” in this document.

<!-- source:bilingual p3 unit:4 -->

## Test item introduction

<!-- source:bilingual p3 unit:5 -->

Test items are divided into automatic test item and manual test item.

<!-- source:bilingual p3 unit:6 -->

The system automatically tests and judges the test result for the automatic test items, such as network, memory and so on. While it requires people to help to test or judge the test result for the manual test items, such as audio recording, KEY, U disk, SD card and so on.

<!-- source:bilingual p3 unit:7 -->

There are two colors “red” and “yellow” to separately display the different test status for the test items.

<!-- source:bilingual p3 unit:8 -->

Yellow: the item waiting for test or under testing, it will display [PASS] after testing successfully.

<!-- source:bilingual p3 unit:9 -->

Red: test failed

<!-- source:bilingual p3 unit:10 -->

### Automatic test items

<!-- source:bilingual p3 unit:11 -->

#### DDR/EMMC capacity detection

<!-- source:bilingual p3 unit:12 -->

DDR/EMMC capability detection is the automatic test item, which will automatically display DDR and EMMC size of current device with the unit GB. Generally DDR capability is 1GB, 2GB, 4GB, etc., while EMMC capability is 2GB, 4GB, 8GB, 16GB, 32GB, 64GB, 128GB, etc. Here is the example of the test result: “system memory: [PASS] { DDR：2GB，EMMC：16GB }”

<!-- source:bilingual p3 unit:13 -->

#### Wireless network (Wi-Fi test)

<!-- source:bilingual p3 unit:14 -->

Wi-Fi is the automatic test item. It will automatically scan the surrounding AP and display the name and the signal strength of the AP which has the strongest signal. The signal strength displays from 0 to 4 bars based on the AP strength. The test result is: `network: [PASS] { “AP WIFI” Signal strength 4 bars }”

<!-- source:bilingual p3 unit:15 -->

#### Ethernet test

<!-- source:bilingual p3 unit:16 -->

There are two test methods. The default is to test Ethernet communication function by ping. Send 5 packages, receive 5 packages, 0 package is lost. The local website and the target ping website are modified in external/rk-pcba-test/res/test_cong.cfg.

<!-- source:bilingual p3 unit:17 -->

The other test method is to judge by detecting whether the network card is enabled or not. There will be an inet6 website if the network card is enabled, such as “inet6 addr: fe80::c8eb:eaff:fe6d:730d/64 Scope:Link”.

<!-- source:bilingual p3 unit:18 -->

If inet6 website is detected, it is considered the Ethernet is normal. (this method cannot confirm whether the network communication is normal or not). If need to use this method to test Ethernet, you need to modify external/rk-pcba-test/lan_test.c. Just comment out “use_ping = 1;” in the c file.

<!-- source:bilingual p4 unit:19 -->

#### Earphone/speaker (codec) test

<!-- source:bilingual p4 unit:20 -->

Codec test has two modes: playing while recording, playing before recording. The test efficiency of playing before recording mode is relatively low, and there is no noise when using speaker. You can select this mode when using speaker. The test efficiency of playing while recording mode is high, but there is noise when using speaker. You can select this mode when using earphone. The recording volume after testing changes according to the actual input, with range from 0 to 100%: “recording volume: [25%]” (mode configuration refers to the configuration instruction in this document).

<!-- source:bilingual p4 unit:21 -->

#### Bluetooth test

<!-- source:bilingual p4 unit:22 -->

The Bluetooth test is the automatic test item. When the detection is enabled, the system will automatically detect and display PASS or FAIL according to the test result.

<!-- source:bilingual p4 unit:23 -->

The Bluetooth test uses the port /dev/ttyS0 by default. If the actually used port is not ttyS0, need to modify the configuration file: hardware/broadcom/libbt/conf/rockchip/rksdk/bt_vendor.conf, changing UartPort in bt_vendor.conf to the actually used port.

<!-- source:bilingual p4 unit:24 -->

### Manual test items

<!-- source:bilingual p4 unit:25 -->

#### SD card test

<!-- source:bilingual p4 unit:26 -->

After SD card is inserted, the system will execute automatic detection. After detection the screen will display whether SD card is passed or not. If passed, it will display the capacity information of SD card.

<!-- source:bilingual p4 unit:27 -->

SD card must be FAT32 format. Other format is not supported! The whole card can only have one partition. If the card doesn’t meet the requirement, please format it to the standard format by formatting.

<!-- source:bilingual p4 unit:28 -->

#### USB HOST test

<!-- source:bilingual p4 unit:29 -->

USB HOST usually uses U disk to test. After inserting U disk, it will automatically detect. After detection it will display whether pass or not, and display the capacity information of U disk.

<!-- source:bilingual p4 unit:30 -->

Similar as SD card, U disk must be FAT32 format. Other format is not supported! The whole card can only have one partition. If it doesn’t meet the requirement, please format it to the standard format by formatting.

<!-- source:bilingual p5 unit:31 -->

## Configuration file instruction

<!-- source:bilingual p5 unit:32 -->

PCBA all test items are configured through the configuration script test_config.cfg, which is in”Android SDK”/bootable/recovery/pcba_core/res/test_config.cfg. Users can configure test_config.cfg file according to the project hardware configuration, determine which modules to test and transfer relative parameters for the test program.

<!-- source:bilingual p5 unit:33 -->

The script uses ini file format, which consists of segment, key and value. Generally a segment represents a module configuration. Currently the configuration file is required to use UTF-8 encoding, and other compiling format may cause unknown error.

<!-- source:bilingual p5 unit:34 -->

### 1.3.1 Configuration file example

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

Example represents a configuration module name. If it is the module name in the cfg file, it cannot be changed, otherwise it will cause some test item not to be started by test system.

<!-- source:bilingual p5 unit:38 -->

#### display_name

<!-- source:bilingual p5 unit:39 -->

display_name represents the name of the test module displayed on the screen. It can be changed according to your requirement. The name can be up to 64 bytes, and if it is null, the test program will not run.

<!-- source:bilingual p5 unit:40 -->

#### activated

<!-- source:bilingual p5 unit:41 -->

Activated represents whether to test this module or not, 0: not to test this module, 1: test this module.

<!-- source:bilingual p5 unit:42 -->

#### program

<!-- source:bilingual p5 unit:43 -->

Currently it is not used. No need to configure.

<!-- source:bilingual p5 unit:44 -->

#### category

<!-- source:bilingual p5 unit:45 -->

Category represents test method, 0: automatic test, 1: manual test.

<!-- source:bilingual p5 unit:46 -->

#### Example

<!-- source:bilingual p6 unit:47 -->

```text
[Key] // key test
display_name= "Key"
activated = 1 // test this item
program = "keytester"
category = 1 // manual test
```

<!-- source:bilingual p6 unit:48 -->

### Configuration of specific test items

<!-- source:bilingual p6 unit:49 -->

#### Audio test

<!-- source:bilingual p6 unit:50 -->

```text
[Codec]
display_name= "Codec"
activated = 1 // test this item
program = "case1" //case1, case2
category = 1 // manual test
run_type = 1
delay = 5
volume = 40
```

<!-- source:bilingual p6 unit:51 -->

##### Case1

<!-- source:bilingual p6 unit:52 -->

Playing before recording mode, the test efficiency is relatively low, there is no noise when using speaker, you can select this mode when using speaker.

<!-- source:bilingual p6 unit:53 -->

##### Case2

<!-- source:bilingual p6 unit:54 -->

Recording while playing mode, the test efficiency is high, there is noise when using speaker, you can select this mode when using earphone.

<!-- source:bilingual p6 unit:55 -->

#### Bluetooth test

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

chip_type is to select the corresponding BT chipset type. It is null by default, that is, not to test BT. There is no need to select after Android5.0, and the system will automatically identify it.

<!-- source:bilingual p6 unit:58 -->

#### Sensor test

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

sensor_type is the selected sensor type. 1: GSENSOR,2: GYROSCOPE, 4: COMPASS, 8: LSENSOR, 16: PSENSOR, 32: GSENSOR_CALIBRATE. If need to test multiple sensors, only need to calculate the sum of the values corresponding to the sensor types. The default value of sensor_type is 39, that is, GSENSOR_CALIBRATE(32)+COMPASS(4)+GYROSCOPE(2)+GSENSOR(1).

<!-- source:bilingual p7 unit:61 -->

#### Camera test

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

Number represents the quantity of the camera to be tested. It supports 2 cameras at most.

<!-- source:bilingual p7 unit:64 -->

If need to add test module by yourself, please refer to the document 《RK_PCBA_Camera移植说明 v1.0.doc》.

<!-- source:bilingual p7 unit:65 -->

## Configuration script parameter extension

<!-- source:bilingual p7 unit:66 -->

The test item parameters in the configuration script test_config.cfg can be extended further. If some module needs to transfer relative parameter through configuration script, you can do the extension as follows:

<!-- source:bilingual p7 unit:67 -->

```text
[example]
display_name= "Example"
activated = 1
program = "example.sh"
module_args = “xxx”
```

<!-- source:bilingual p7 unit:68 -->

In the specific test program, you can obtain the relative set parameter values through script_fetch api:

<!-- source:bilingual p7 unit:69 -->

```text
int script_fetch(char *main_name, char *sub_name, int value[], int count);
```

<!-- source:bilingual p7 unit:70 -->

main_name: the name of the test module, test item in the file of test_config.cfg, “example” in the example

<!-- source:bilingual p7 unit:71 -->

sub_name: key value, such as activated, display_name, module_args and so on.

<!-- source:bilingual p7 unit:72 -->

### Example of fetching a value

<!-- source:bilingual p8 unit:73 -->

```text
if(script_fetch("example", "module_args", (int *)des, 8) == 0)
{
printf("module_args value is: %s\n",des);
}
```

<!-- source:bilingual p8 unit:74 -->

## Test item extension

<!-- source:bilingual p8 unit:75 -->

This PCBA program allows users to extend their own test example. If need to use the module currently unsupported due to the project requirement, you can add the test program by yourself and then integrate into the test framework.

<!-- source:bilingual p8 unit:76 -->

The integration method is as follows:

<!-- source:bilingual p8 unit:77 -->

Prepare your own test program and header file first. The test program should be packaged as the interface with void * xxxx_test(void *argv, display_callback *hook) format.

<!-- source:bilingual p8 unit:78 -->

Confirm this test item is manual test item or automatic test item, and add the needed configuration in test_config.cfg.

<!-- source:bilingual p8 unit:79 -->

Register your own test code in rkfactory_test.cpp.

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

### Interface introduction

<!-- source:bilingual p9 unit:82 -->

msg_index: the index of the displayed message; normally pass its position at creation, corresponding to its location in the message array. msg: the message to display, supplied as std::string.

<!-- source:bilingual p9 unit:83 -->

```text
handle_refresh_screen(int msg_index, string msg);
```

<!-- source:bilingual p9 unit:84 -->

highlight: whether to highlight the message; the default highlight is red. Normally pass true when the test fails.

<!-- source:bilingual p9 unit:85 -->

```text
handle_refresh_screen_hl(int msg_index, string msg, boolean highlight);
```

<!-- source:bilingual p9 unit:86 -->

new_test is the test function of the module.

<!-- source:bilingual p9 unit:87 -->

## Panel rotation configuration

<!-- source:bilingual p9 unit:88 -->

PCBA test supports panel rotation function. Rotate 0°, 90°, 180° or 270° based on the requirement to support different landscape/portrait display. 0°, and 180° are used to support portrait, while 90° and 270° are used to support landscape. The default is 0°.

<!-- source:bilingual p9 unit:89 -->

The configuration of panel rotation is in device/rockchip/common/Boardconfig.mk

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

## Image build configuration and packaging

<!-- source:bilingual p9 unit:92 -->

PCBA test program is in the directory of ”Android SDK”/bootable/recovery/pcba_core. Compiling will static linked pcba_core into recovery. Relative files in pcba_core/res will be automatically copied to pcba directory of recovery during compiling.

<!-- source:bilingual p9 unit:93 -->

PCBA program is run in Recovery system. The detailed test process is: enter Recovery after power up, start PCBA test program to do the function tests.

{% endraw %}

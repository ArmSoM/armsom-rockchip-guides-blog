---
title: "Rockchip Linux 软件与系统测试指南"
description: "Rockchip Linux 软件与系统测试指南 — V2.0.2"
excerpt: "Rockchip Linux 软件与系统测试指南"
translation_key: "200-rockchip-linux-software-test"
slug: "200-rockchip-linux-software-test"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, Test, Buildroot]
---

{% raw %}

# Rockchip Linux 软件与系统测试指南

依据 RK-SM-YF-352 V2.0.2（2024-05-16）中英文原稿，中文为技术基线。本文保留全部五章、命令、测试参数和截图。仅作为 ArmSoM 平台参考，须核对具体板卡、SoC、SDK/BSP 和外设；没有执行任何设备测试。特别注意：原稿 dd 写入直接覆盖分区，SD 制作/升级涉及擦除 flash，恢复测试菜单包含 wipe all；备份数据并确认目标，切勿在有用数据的设备上直接复制运行。killall bash 会结束其他 Bash 进程。

## 1. 功能测试

### 1.1 Buildroot

#### 1.1.1 录像

录像:

```text
rkisp_demo --device=/dev/video1 --output=/tmp/isp.yuv --
iqfile=/etc/iqfiles/OV5695.xml
```

播放录像:将/tmp/cif.yuv下的文件pull到电脑端: adb pull /tmp/cif.yuv /tmp/cif.yuv ,通过 YUV 工具播放。

#### 1.1.2 录音

arecord -c 通道 -r 采样频率 –f 采样位数 –d 录音时⻓ /录音存放路径/录音文件名通道 ch_tbl="2 4 6 8"采样频率 fs_tbl="8000 11025 16000 22050 32000 44100 48000 64000 88200 96000 176400 192000"采样位数 bits_tbl="S16_LE S24_LE S32_LE"封装格式 wmv、wav、mp3 等例:限时录音-录音10秒自动退出并保存:

```text
arecord -c 2 -r 44100 -f S16_LE –d 10 /tmp/record.wav
```

不限时录音-ctrl+c退出即可保存:

```text
arecord -c 2 -r 44100 -f S16_LE /tmp/record.wav
```

播放录音文件:

```text
aplay /tmp/record.wav
```

#### 1.1.3 Wi-Fi 连接

方法一:wifi_start.sh脚本如果sdk集成了wifi_start.sh脚本,可以直接在脚本后面跟 ssid和password

```text
wifi_start.sh WiFi-AP password
```

方法二:修改配置文件

```text
$ vi /data/cfg/wpa_supplicant.conf
ctrl_interface=/var/run/wpa_supplicant  #默认不建议修改!
ap_scan=1
update_config=1
#这个配置使wpa_cli命令配置的热点保存到conf⽂件⾥⾯（wpa_cli save_config）

#加密Wi-Fi
network={
    ssid="WiFi-AP"   # Wi-Fi名字
    psk="password"   # Wi-Fi密码
    key_mgmt=WPA-PSK # 认证⽅法
}

#不加密Wi-Fi:
network={
    ssid="WiFi-AP"   # Wi-Fi名字
    key_mgmt=NONE    # 认证⽅法
}

#让wpa_supplicant进程重新读取上述配置：
wpa_cli -i wlan0 -p /var/run/wpa_supplicant reconfigure
#发起连接：
wpa_cli -i wlan0 -p /var/run/wpa_supplicant reconnect
```

方法三:wpa_cli工具

```text
#加密Wi-Fi：
wpa_cli -i wlan0 -p /var/run/wpa_supplicant remove_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant ap_scan 1
wpa_cli -i wlan0 -p /var/run/wpa_supplicant add_network
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 ssid "WiFi-AP"
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 key_mgmt WPA-PSK
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 psk '"password"'
wpa_cli -i wlan0 -p /var/run/wpa_supplicant select_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant save_config #保存上述配置到conf⽂件

#不加密Wi-Fi:
wpa_cli -i wlan0 -p /var/run/wpa_supplicant remove_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant ap_scan 1
wpa_cli -i wlan0 -p /var/run/wpa_supplicant add_network
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 ssid "WiFi-AP"
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 key_mgmt NONE
wpa_cli -i wlan0 -p /var/run/wpa_supplicant select_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant save_config
```

查看连接状态:

```text
wpa_cli -i wlan0 -p /var/run/wpa_supplicant status
```

详情可以查看 Rockchip_Developer_Guide_Linux_WIFI_BT_CN.pdf

#### 1.1.4 音频播放

```text
aplay /media/usb0/musicdemo.wmv
```

#### 1.1.5 系统时间

```text
date                               #查看系统时间
date --set='2018-12-24 15:17:42'   #设置系统时间
hwclock --show                     #查看硬件时间
hwclock --systohc                  #硬件时间同步显⽰系统时间
```

#### 1.1.6 RTC 时钟

查看当前状态下或重启后时间是否有变化。

```text
cat /sys/class/rtc/rtc0/time
```

#### 1.1.7 视频播放

单窗口视频播放:

```text
gst-play-1.0 /oem/SampleVideo_1280x720_5mb.mp4
```

多窗口视频播放:

```text
sh /rockchip-test/video/test_gst_multivideo.sh
```

#### 1.1.8 SD 卡升级、启动

SD 卡插入 PC 端,在 PC 端执行SD_Firmware_Tool.exe,选择固件升级/SD启动,选择固件-update.img,开始创建。将 SDK 进入maskrom擦除flash后,断电。插入制作好的 SD 卡,将 SDK 上电开机,会自动烧写固件。

![Rockchip Linux 软件与系统测试指南 — cn 8](/docs/rockchip-linux-software-test/assets/cn-p008-figure-01.png)

#### 1.1.9 查看内存

```text
cat /proc/meminfo 或 free –h
```

#### 1.1.10 查看磁盘空间使用情况

```text
df -h
```

### 1.2 Debian

#### 1.2.1 终端位置

开始-&gt; System Tools -&gt; LXTerminal

#### 1.2.2 Wi-Fi 连接

在串口输入如下命令:

```text
nmcli r wifi on  #第1步：开启Wi-Fi
nmcli dev wifi   #第2步：扫描附近AP
#第3步：连接AP
nmcli dev wifi connect "DIR-803" password "839919060" ifname wlan0
nmcli r wifi off #第4步：关闭Wi-Fi
```

#### 1.2.3 双屏异显

使用 xrandr 来确定有几个显示设备,比如下面检测到系统当前连接着 HDMI-1 和 DSI-1 两个设备:

```text
root@linaro-alip:/# xrandr
Screen 0: minimum 320 x 200, current 1920 x 1920, maximum 16384 x 16384
HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)
0mm x 0mm
   1920x1080     60.00 +  60.00*   50.00    30.00    24.00
   1920x1080i    60.00    50.00    50.00
   1280x1024     60.02
   1280x720      60.00    50.00    50.00
   720x576       50.00    50.00
   720x576i      50.00
   720x480       59.94    59.94
   720x480i      59.94
HDMI-2 disconnected (normal left inverted right x axis y axis)
DSI-1 connected 1080x1920+0+0 (normal left inverted right x axis y axis) 0mm x
0mm
   1080x1920     59.90*+
DP-1 disconnected (normal left inverted right x axis y axis)
DP-2 disconnected (normal left inverted right x axis y axis)
```

xrandr 来设置两个屏幕的关系:

```text
su linaro-c "DISPLAY=:0 xrandr--output HDMI-1--above DSI-1"
```

其中 --above 可以代换成 right-of, left-of, below, same-as, preferred, off 等。更多详情可查阅 Rockchip_Developer_Guide_Linux_Graphics_CN.pdf

#### 1.2.4 双屏异声

方法一:打开左下⻆的 Sound&amp;Video -&gt; PulseAudio Volume Control -&gt; Playback

![Rockchip Linux 软件与系统测试指南 — cn 10](/docs/rockchip-linux-software-test/assets/cn-p010-figure-01.png)

方法二:使用 aplay 来确认声卡和选择声卡播放:

```text
root@linaro-alip:/# aplay -l
**** List of PLAYBACK Hardware Devices ****
card 0: rockchipdp0 [rockchip,dp0], device 0: rockchip,dp0 spdif-hifi-0
[rockchip,dp0 spdif-hifi-0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 1: rockchipes8388 [rockchip-es8388], device 0: dailink-multicodecs ES8323.7-
0011-0 [dailink-multicodecs ES8323.7-0011-0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 2: rockchiphdmi0 [rockchip-hdmi0], device 0: rockchip-hdmi0 i2s-hifi-0
[rockchip-hdmi0 i2s-hifi-0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0

dp0: aplay-Dplughw:0,0/dev/urandom
es8388: aplay-Dplughw:1,0/dev/urandom
hdmi0: aplay-Dplughw:2,0/dev/urandom
```

方法三:打开一个音乐歌曲从主屏拖到副屏,然后在主屏中同样方式选择一个声卡来播放,完成双屏异声功能。更多详情可查阅 Rockchip_Developer_Guide_Linux_Graphics_CN.pdf

#### 1.2.5 显示屏旋转

旋转 normal/left/right:

```text
vi /etc/X11/xorg.conf.d/20-modesetting.conf
```

把normal改为left/right/,reboot后生效。

## 2. 性能测试

### 2.1 磁盘读写测试

先用 fdisk -l 查看节点。原稿以最后的 mmcblk0p8（14.6G）为可读写 userdata 分区，作为 eMMC 性能测试目标；这不证明任意板卡的最后分区均可写，以下写测试会覆盖数据。

```text
root@linaro-alip:~# fdisk -l
Disk /dev/mmcblk0: 29.1 GiB, 31268536320 bytes, 61071360 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 1124E418-9008-41F8-9E3D-8D872216C8A1
Device           Start      End  Sectors  Size Type
/dev/mmcblk0p1    16384    24575     8192    4M unknown
/dev/mmcblk0p2    24576    32767     8192    4M unknown
/dev/mmcblk0p3    32768   163839   131072   64M unknown
/dev/mmcblk0p4   163840   425983   262144  128M unknown
/dev/mmcblk0p5   425984   491519    65536   32M unknown
/dev/mmcblk0p6   491520 29851647 29360128   14G unknown
/dev/mmcblk0p7 29851648 30113791   262144  128M unknown
/dev/mmcblk0p8 30507008 61071295 30564288 14.6G unknown
```

#### 2.1.1 eMMC读写

写:

```text
dd if=/dev/zero of=/dev/mmcblk0p8 bs=1M count=2000 oflag=direct,nonblock
```

读:

```text
dd if=/dev/mmcblk0p8 of=/dev/null bs=1M count=2000 iflag=direct,nonblock
```

#### 2.1.2 U盘读写

写:

```text
dd if=/dev/zero of=/dev/sda1 bs=1M count=2000 oflag=direct,nonblock
```

读:

```text
dd if=/dev/sda1 of=/dev/null bs=1M count=2000 iflag=direct,nonblock
```

### 2.2 设置性能模式

```text
echo performance | tee $(find /sys/ -name *governor)
```

### 2.3 查看CPU DDR频率

```text
cat /sys/kernel/debug/clk/clk_summary |grep -E "cpu|arm|ddr"
```

### 2.4 glmark2 跑分

显示屏幕跑分:

```text
sh /rockchip-test/gpu/test_fullscreen_glmark2.sh
```

屏幕不显示跑分:

```text
sh /rockchip-test/gpu/test_offscreen_glmark2.sh
```

## 3. 硬件稳定性测试

### 3.1 IO-DOMAINS

要求所有GPIO电源域的硬件供电电压与软件配置相匹配,所以请在量产前再次重新审核项目电压和电源域配置的正确性,特别是Wi-Fi,FLASH,以太网这几路IO电源的配置。否则会产生以下不良:软件配置为1.8V,硬件供电3.3V,会使得低耐压电路暴露在高压环境下,⻓期工作会损坏电路软件配置为3.3V,硬件供电1.8V,电路工作会异常配置检查的方法可参考对应芯片平台下的文档,如RK3568可参考:Rockchip_RK356X_Introduction_IO_Power_Domains_Configuration_CN.pdf

### 3.2 电源

建议项目硬件的电源设计使用我们的参考设计,如果电源方案和我们的参考设计有改动,或者器件选型不一样,特别是当采用分立电源而不是搭载我们匹配的PMIC电源方案时,需要对涉及芯片启动的各路核心电源如:VDD_LOGIC,VDD_ARM,VCC_PMU,VCC_DDR供电等进行必要的测试,包括冷启动、重启时的上电时序,电压、高负载下电源的纹波等。

### 3.3 信号

项目硬件图纸在完成设计后,建议通过redmine系统提交我们的工程师帮忙review,特别是DDR部分需要严格按照我们的模板完成设计。同时DDR、EMMC、FLASH颗粒的选型需要在我们的AVL中,AVL列表可以通过redmine获取。

### 3.4 高低温

除了常温下的稳定性测试,建议客戶在实际产品工作温度的高、低温环境下完成CPU压力,DDR压力,reboot压力以及冷启动的测试,保证产品在高低温工作环境下的稳定性。

## 4. 软件稳定性测试

本章节主要介绍rockchip test包使用的基础工具,以及如何使用rockchip test包完成产品的软件稳定性测试。

### 4.1 基础工具

#### 4.1.1 stressapptest

##### 4.1.1.1 概述

stressapptest 是Stressful Application Test的简称。stressapptest会生产线程来拷⻉和直接对磁盘进行读取和写入。目标则是尽可能的加大系统内存负载,以便更加有效地进行测试。并且让来自处理器和I/O到内存的数据尽量随机化,以创造出模拟现实的环境来测试现在的硬件设备是否稳定,Google就在使用它,现在是Apache 2.0许可。stressapptest 有以下几种用途:压力测试硬件检查和调试内存接口测试:参考后面章节的内容。磁盘测试。

##### 4.1.1.2 使用

典型的执行命令:

```text
stressapptest -s 20 -M 256 -m 8 -W    # Test 256MB, running 8 "warm copy"
threads. Exit after 20 seconds.
stressapptest --help                  # list the available arguments.
```

常用参数:

| 参数 | 含义 / 默认值 |
|---|---|
| `-M mbytes` | 测试 RAM 的 MB 数；自动检测全部可用内存 |
| `-s seconds` | 运行秒数；20 |
| `-m threads` | 内存复制线程数；自动检测 CPU 数 |
| `-W` | 更高 CPU 压力的复制；false（关闭） |
| `-n ipaddr` | 连接 ipaddr 的网络线程；无 |
| `--listen` | 监听并响应网络线程；0 |
| `-f filename` | 以 filename 为临时文件的磁盘线程；无 |
| `-F` | 不逐事务校验，使用 libc memcpy；false（关闭） |
| `-l logfile` | 日志输出文件；无 |
| `-v level` | 详细程度 0–20；默认 8 |

#### 4.1.2 memtester

##### 4.1.2.1 概述

一款在用戶空间下,用于测试内存正确性的实用工具,适用于大多数平台。可以在32位或64位的类Unix操作系统编译和运行(当然也包括Unices和MacOs)。这款工具主要面向嵌入式开发人员,从4.1.0版本开始,memtester可以指定起始物理内存地址进行测试。

##### 4.1.2.2 使用

```text
memtester [-p physaddrbase [-d device]] <mem>[B|K|M|G] [loops]
```

loop中具体的测试项:

```text
Stuck Address
Random Value
Compare XOR
Compare SUB
Compare MUL
Compare DIV
Compare OR
Compare AND
Sequential Increment
Solid Bits
Block Sequential
Checkerboard
Bit Spread
Bit Flip
Walking Ones
Walking Zeroes
8-bit Writes
16-bit Writes
```

### 4.2 Rockchip test

Rockchip test压力测试的日志输出路径为 /userdata/rockchip-test,所以测试前请保证该目录具有可读写的权限完整的串口log有助于更好的分析和定位问题。所以测试时产品需要接出串口,且串口上位机开启保存所有log的功能

#### 4.2.1 配置开启

在buildtoot中使能rockchip-test包需要开启如下配置:

```text
#  - stress test on cpu and memory
BR2_PACKAGE_STRESSAPPTEST=y
#  - memtest used to testing the memory subsystem for faults
BR2_PACKAGE_MEMTESTER=y
#  - audio, reboot, bluetooth, ddr, dvfs, flash, suspend/resume, wifi
BR2_PACKAGE_ROCKCHIP_TEST=y
```

#### 4.2.2 测试列表

目前已支持的压力测试列表如下:

```text
# bash /rockchip-test/rockchip_test.sh
"******************************************************"
"***                                                ***"
"***          *****************************         ***"
"***          *    ROCKCHIPS TEST TOOLS   *         ***"
"***          *  V2.0 updated on 20220928 *         ***"
"***          *****************************         ***"
"***                                                ***"
"*****************************************************"

"*****************************************************"
"ddr test:              1 (ddr stress test)"
"cpu test:              2 (cpu stress test)"
"gpu test:              3 (gpu stress test)"
"npu test:              4 (npu stress test)"
"suspend_resume test:   5 (suspend resume)"
"reboot test:           6 (auto reboot test)"
"power lost test:       7 (power lost test)"
"flash stress test:     8 (flash stress test)"
"recovery test:         9 (recovery wipe all test)"
"audio test:           10 (audio test)"
"camera test:          11 (camera test)"
"video test:           12 (video test)"
"bluetooth test:       13 (bluetooth on off test)"
"wifi test:            14 (wifi on off test)"
"chromium test:        15 (chromium with video test)"
"*****************************************************"
```

#### 4.2.3 测试规模

我们建议每个测试项目部署 10台 * 24小时 以上,可以根据项目对于稳定性要求的程度进行适当调整。

#### 4.2.4 测试方法

下面以DDR压力测试中的 memtester 为例,介绍一下各单元测试的方法。单元测试支持从rockchip_test 脚本执行,也可以直接执行对应的脚本。

##### 4.2.4.1 rockchip_test

```text
bash rockchip-test/rockchip_test.sh
```

输入压力测试列表内 ddr test 对应的序号 1

```text
"*****************************************************"
"***                                               ***"
"***            DDR TEST                           ***"
"***                                               ***"
"*****************************************************"
"*****************************************************"
"memtester:                                      1"
"stressapptest:                                  2"
"stressapptest + memtester:                      3"
"ddr auto scaling:                               4"
"stressapptest + memtester + ddr auto scaling:   5"
"*****************************************************"
```

再输入测试项目 memtester 对应的序号 1,即可开始测试。

##### 4.2.4.2 直接执行

```text
bash /rockchip-test/ddr/memtester_test.sh
```

#### 4.2.5 测试详请

##### 4.2.5.1 DDR测试

DDR压力测试支持以下五种测试场景:

```text
"memtester:                                      1"
"stressapptest:                                  2"
"stressapptest + memtester:                      3"
"ddr auto scaling:                               4"
"stressapptest + memtester + ddr auto scaling:   5"
```

产品不支持变频,可以选择 3,即使用stressapptest + memtester的场景进行测试产品支持变频,可以选择 5 ,即使用stressapptest + memtester + ddr自动变频的场景进行测试CPU压力测试由入口脚本 ddr_test.sh 和以下3个脚本组成。

```text
/rockchip-test/ddr/ddr_freq_scaling.sh
/rockchip-test/ddr/memtester_test.sh
/rockchip-test/ddr/stressapptest_test.sh
```

###### 4.2.5.1.1 ddr_freq_scaling

DDR 变频脚本：无参数时自动变频。

```text
bash /rockchip-test/ddr/ddr_freq_scaling.sh
cnt: 0, ddr freq: success change to 528000000 Hz
..
cnt:100, ddr freq: success change to 324000000 Hz
```

脚本带频率点的参数,且频率点在支持频率中,会变频到对应的频率点

```text
bash /rockchip-test/ddr/ddr_freq_scaling.sh 528000000
ddr freq: success change to 528000000 Hz
```

脚本带频率点的参数,但频率点不在支持频率中,会打印支持的频率点,以及当前频率

```text
bash /rockchip-test/ddr/ddr_freq_scaling.sh 1
ddr freq: 1 is not in available frequencies: 324000000 528000000
ddr freq: now 528000000 Hz
```

关闭测试

```text
killall bash
```

###### 4.2.5.1.2 stressapptest_test

默认使用系统可用内存的一半，24 小时后自动停止。关闭测试：

```text
killall stressapptest
```

###### 4.2.5.1.3 memtester_test

默认使用系统可用内存的一半。关闭测试：

```text
killall memtester
```

注:memtester 出错不会自动停止测试,需要观测程序运行过程的打印

##### 4.2.5.2 CPU测试

CPU压力测试支持以下三种测试场景:

```text
"stressapptest test:                               1"
"cpu auto scaling:                                 2"
"stressapptest + cpu auto scaling:                 3"
```

产品不支持变频,可以选择 2,即使用stressapptest的场景进行测试产品支持变频,可以选择 3 ,即使用stressapptest + cpu自动变频的场景进行测试CPU压力测试由入口脚本 cpu_test.sh 和 cpu_freq_scaling.sh 组成。

###### 4.2.5.2.1 cpu_freq_scaling

无参数时自动变频。

```text
bash /rockchip-test/cpu/cpu_freq_scaling.sh
cnt: 0, cpu freq policy:0 success change to 816000 KHz
...
cnt: 100, cpu freq policy:0 success change to 1104000 KHz
```

脚本带频率点的参数,且频率点在支持频率中,会变频到对应的频率点

```text
bash /rockchip-test/cpu/cpu_freq_scaling.sh 1104000
cpu freq policy:0 success change to 1104000 KHz
```

脚本带频率点的参数,但频率点不在支持频率中,会打印支持的频率点,以及当前频率

```text
bash /rockchip-test/cpu/cpu_freq_scaling.sh 1
cpu freq: 1 is not in available frequencies: 600000 816000 1008000 1104000
1416000
cpu freq: now 1104000 Hz
```

关闭测试

```text
killall bash
```

##### 4.2.5.3 Flash测试

在 $test_dir/src_test_data 生成7个5MB以内的随机源数据,拷⻉到$test_dir/des_test_data 的五个子目录下,并对比md5值,循环200次

##### 4.2.5.4 待机唤醒测试

使能自动待机唤醒需要系统存在RTC,且正常工作默认会执行执行待机唤醒10000次后退出,每次待机唤醒的时间是3-6秒之间的随机数

##### 4.2.5.5 reboot测试

默认重启10000次后停止测试,每次启动后8秒自动关机提前关闭测试

```text
echo off > /userdata/rockchip_test/reboot_cnt
```

如果系统使能CONFIG_PSTORE_RAM,脚本会在每次启动后检查上次关机过程中的log是否存在奔溃等异常,异常则会自动停止该测试

##### 4.2.5.6 GPU测试

GPU压力测试是基于 glmark-es2 的,选择的 test_stress_glmark2.sh 脚本,主要是以 run-forever 参数来执行 glmark-es2glmark-es2 is a benchmark for OpenGLES 2.0. It only uses the subset of the OpenGL 2.0API that is compatible with OpenGL ES 2.0

##### 4.2.5.7 Camera测试

Camera压力测试可以通过以下两种方法进行:

1. camera_stresstest_rkisp_demo.sh需保证buildtoot已使能如下配置:

```text
BR2_PACKAGE_CAMERA_ENGINE_RKAIQ_RKISP_DEMO=y
```

使用rkisp_demo无需通过 media-ctl 配置isp相关的pipeline,这种方法不会对usb camera进行压力测试该测试流程是循环抓取 ISP CIF 接口的camera数据各100帧,但不校验文件大小

2. camera_stresstest_v4l2.sh需保证buildtoot已使能如下配置:

```text
BR2_PACKAGE_LIBV4L_UTILS=y
```

使用 v4l2-ctl 可能需要通过 media-ctl 配置isp相关的pipeline,这种方法会对usb camera进行压力测试该测试流程是以640x480的分辨率循环抓取 USB ISP CIF 接口的camera数据各5帧,并校验文件大小根据实际应用场景选择以上任一方法即可

##### 4.2.5.8 Video测试

Video压力测试是循环播放 /mnt/udisk/videos 或 /userdata/videos 目录下的视频文件测试前把待测试的视频文件放在上述任意目录下,优先查找的是 /userdata/videos 目录,如果上述两个目录都不存在会提示并退出该测试

##### 4.2.5.9 Wi-Fi Bt测试

Wi-Fi Bt的测试为自动开关测试

### 4.3 用戶场景测试

除了上述针对系统功能的单元测试,我们还可以根据实际产品功能去模拟这种真实场景进行压力测试,作为对系统稳定性测试的一种补充。比如针对词典笔的产品形态,典型的用戶使用场景:

开机 → 扫描识别 → 播放翻译结果 → 放置直到进入二级待机 → 唤醒后再次使用；其间可能随机开关 Wi-Fi、BT。

我们可以使用上面基础脚本中的命令,去构建出这种真实场景:

开机 → 循环（v4l2 采图 → aplay 播放 → pm-suspend → RTC 唤醒）；在唤醒时段随机开关 Wi-Fi、BT。

## 5. TO DO

### 5.1 增加常⻅问题分析方法

### 5.2 添加npu,recovery,audio,浏览器,掉电测试说明

## 来源差异、原稿问题与执行边界

- 两份原稿均为 V2.0.2；中文 20 页、英文 14 页。英文独有 1.1.9 文件搜索（下方原命令），因此后续内存与磁盘小节编号相差 1。英文将 df -h 误称为内存使用，中文明确为磁盘空间。
- 英文末页 4.3 两个场景流程排版越界，逐页文本缺失；本文以中文第 20 页完整流程补齐，按正文翻译而非代码处理。第 5 章是原稿待办，不表示 NPU、recovery、audio、浏览器或掉电测试说明已提供。
- 录像命令输出 /tmp/isp.yuv，后文却读取 /tmp/cif.yuv；执行前统一实际文件名。arecord 命令的 –d、free 的 –h 使用印刷短横，应改 ASCII -d、-h；“or”不是 shell 操作符。wmv/mp3 封装及 aplay 播放 musicdemo.wmv 是源示例，不构成格式支持保证，应核对工具能力。
- 中文显示设备说明和实际 xrandr 输出是 HDMI-1、DSI-1，英文说明误写 DP-1。英文 xrandr 命令缺空格，aplay-Dplughw 也缺空格，不能直接复制。中文对应示例为 su linaro -c "DISPLAY=:0 xrandr --output HDMI-1 --above DSI-1"，以及 aplay -Dplughw:0,0 /dev/urandom（对应卡号换 1 或 2）。--preferred/--off 与相对位置选项语义不同，不是所有列举项都可机械替换。
- DDR 段正文误称 CPU 压力测试。CPU 菜单实际编号 1=stressapptest、2=cpu auto scaling、3=组合，但两种正文均建议无变频时选 2，存在矛盾；请以实际脚本菜单核对，不按文字盲选。CPU 示例通常为 KHz，而错误参数输出最后写 Hz；DDR 示例为 Hz，不能混用单位。
- stressapptest 的 -W、-F 默认 false，中文源将 false 误译为“错误的”，参数表已明确为关闭。测试日志目录 /userdata/rockchip-test 与停止重启的 /userdata/rockchip_test/reboot_cnt 下划线不同，按实际脚本核对。原码注释、诊断输出、SSID/口令均为来源示例，未执行或使用。

### 英文独有文件搜索

```text
find ./ -name ***
```

其中 *** 是原稿占位样例，实际匹配模式应按 shell 引号规则处理。

{% endraw %}

---
title: "Rockchip Rockit Runtime 运行库开发指南"
description: "Rockchip Rockit Runtime 运行库开发指南 - V2.28.0: RRT, VALLOC, VLOG, VSYS, VENC, IVS, VRGN, VRGA"
excerpt: "Rockchip Rockit Runtime 运行库开发指南"
translation_key: "194-rockchip-rockit-runtime"
slug: "194-rockchip-rockit-runtime"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Linux, Rockit, VENC]
---

{% raw %}

# Rockchip Rockit Runtime 运行库开发指南

本文以所提供的 Rockchip 中英文 V2.28.0（2025-04-27）文档为依据，保留第 3-13 章技术内容，按中文技术内容补足英文遗漏，并注明差异。作为 ArmSoM 平台参考，使用前须逐项核对实际开发板、SoC、SDK/BSP、内核与外设；不代表所有 ArmSoM 板卡均支持。本页未执行命令或进行硬件验证。

| 芯片 | 内核版本 |
| --- | --- |
| RV1106/RV1103 | Linux 5.10 |
| RV1103B/RV1106B | Linux 5.10 |
| RK3308 | Linux 6.1 |
| RK3506 | Linux 6.1 / rt-thread 4.1 |
| RV1126B | Linux 6.1 |

## 3. 框架

为了更好的移植rockit, 在内核中新开发一套runtime library, 下文简称RRT, 内核中的RRT框图如下:

![Rockchip Rockit Runtime 运行库开发指南 - RRT](/docs/rockchip-rockit-runtime/assets/cn-p004-figure-01.png)



```text
.
├── isp.ko   ---- isp模块，对应/dev/mpi/rkisp-vir0节点
├── valloc.ko  --- buffer管理器，对应/dev/mpi/valloc节点
├── venc.ko    --- 编码器模块，对应/dev/mpi/venc
├── vmpi.ko    --- 媒体框架， 对应 /dev/mpi/vmpi
├── vpss.ko    --- vpss模块，对应 /dev/mpi/vpss
├── vrga.ko    --- rga模块，对应 /dev/mpi/vrga
├── vrgn.ko    --- rgn模块，对应 /dev/mpi/vrgn
├── vsys.ko    --- 系统模块，对应 /dev/mpi/vsys
└── vvi.ko     --- vi模块， 对应 /dev/mpi/vvi
```



在使用rockit 接口之前,需要加载上述ko,加载方式如下(注:上述所有ko, 已合并成一个ko):



```text
insmod rockit.ko
```



使用以下命令检查是否加载成功:



```text
# lsmod
Module                  Size  Used by    Tainted: G
rknpu                  21535  1
rockit                 90530 14
mpp_vcodec            350020  4 rockit
rga3                   76968  3 rockit
sc4336                  8940  2
phy_rockchip_csi2_dphy     7657  0
phy_rockchip_csi2_dphy_hw     7644  0
video_rkisp           138585  3 rockit,[permanent]
video_rkcif           107889  4
rk_dvbm                 5813  2 mpp_vcodec,video_rkisp
```



加载成功后,即可运行依赖rockit.so相关程序。

### 3.1 KO支持的参数

#### 3.1.1 mcu_fw_path

MCU卷绕固件路径,默认空,不加载mcu固件:



```text
insmod rockit.ko mcu_fw_path=/oem/usr/ko/hpmcu_wrap.bin
```



#### 3.1.2 mcu_fw_addr

MCU 卷绕固件的地址,默认为0xff6ff000(RV1106), 0X210f6000(RV1103B):



```text
insmod rockit.ko mcu_fw_addr=0xff6ff000
```



#### 3.1.3 isp_max_h

isp 前级输入的高度,如果VICAP配置裁剪功能,应配置裁剪后的宽度,如果次参数配置错误,cat /dev/mpi/vlog 会有提示正确的值。

```text
mpi_log_err("isp input height config err, config h= %d, real h = %d", isp_max_h, isp_h);
```





```text
insmod rockit.ko isp_max_h=1920
```



#### 3.1.4 isp_max_w

保留。

#### 3.1.5 en_mcu

是否使能MCU驱动,默认开启(RV1106)/关闭(RV1103B),关闭后不加载MCU驱动:



```text
insmod rockit.ko en_mcu=0
```



#### 3.1.6 rk_dma_heap_base

RK_MPI_SYS_RelasePhyMemory释放的MMZ的首地址, 需要4K对⻬, 并且大于MMZ的起始地址,MMZ起始地址计算方式: 总物理内存 - MMZ大小



```text
insmod rockit.ko rk_dma_heap_base=0x40000
```



#### 3.1.7 rk_dma_heap_size

RK_MPI_SYS_RelasePhyMemory释放的MMZ的大小,需要小于等于MMZ的大小。



```text
insmod rockit.ko rk_dma_heap_size=0x40000
```



## 4. 跨平台移植

RRT新增OSAL,并基于OSAL改写,不仅可以运行在Linux内核态,也可运行在Linux用戶态,RTOS上,目前RV1103B/RV1126B中存在2个RRT,一个运行在用戶态,另一个运行在内核态。LINUX用戶态和RTOS上查看 /dev/mpi/xxx 相关节点需要在原有的命令前加上dumpsys。

```text
dumpsys cat /dev/mpi/valloc
dumpsys cat /dev/mpi/vsys
dumpsys cat /dev/mpi/vlog
dumpsys cat /dev/mpi/vrgn
```



## 5. 跨平台通信

在一个SOC上可能运行多个RRT,为了减少模块开发者的沟通成本, RRT实现了跨平台互通,即通过 VALLOC模块实现跨平台BUFFER引用计数的管理,通过VSYS模块实现跨平台绑定和 BUFFER的传递,因此跨平台通信有一个前提条件: 各平台的RRT可以通过物理内存共享BUFFER。下表为各SOC支持的RRT,以及每个RRT包含的模块。

| SOC | RRT(Linux内核态) | RRT(Linux 用戶态) | RRT(rt-thread) |
| --- | --- | --- | --- |
| RV1106/RV1103 | VI / VPSS / VENC / AVS /<br>VRGN / VALLOC / VSYS | 不支持 | 不支持 |
| RV1103B/RV1106B | VI / VPSS / VENC / AVS /<br>VRGN / VALLOC / VSYS | VDEC / VO / VRGN / AI / AO / AENC<br>/ ADEC / AMIX / AF / TDE / VALLOC<br>/ VSYS / TDE | 不支持 |
| RK3308 | 不支持 | VALLOC / VSYS / VRGN / VDEC / AI<br>/ AO / ADEC / AENC / AMIX / AF /<br>VO | 不支持 |
| RK3506 | 不支持 | VALLOC / VSYS / VRGN / VDEC / AI<br>/ AO / ADEC / AENC / AMIX / AF /<br>VO / TDE | VALLOC / VSYS / VRGN / VDEC<br>/ AI / AO / ADEC / AENC / AMIX<br>/ AF / VO / TDE |
| RV1126B | VI / VPSS / VENC / AVS /<br>VRGN / VALLC / VSYS /<br>GDC / IVS | VI / VALLOC / VSYS / VRGN / VDEC<br>/ AI / AO / ADEC / AENC / AMIX /<br>AF / VO / TDE | 不支持 |

## 6. VALLOC

媒体框架的内存分配器,负责分配,管理媒体框架所需要的内存,使用以下命令可以查看当前内存状态。

```text
cat /dev/mpi/valloc
```



| 项目 | 说明 | 备注 |
| --- | --- | --- |
| module | 模块信息 | 模块名 |
| version | 版本信息 | 仓库名:commit:版本号 |
| build | 编译信息 | 编译者-编译日期 |
| mpi buf list | buf 列表分界线 | 以下是BUF相关信息 |
| buf_id | 本平台唯一ID | 用来识别MPI BUF,相当于HANDLE,会显示2个ID, 括号中ID为跨平台唯一ID |
| pool | buf pool ID | mpi buf 隶属那个buf pool , -1 表示无pool |
| ref | mpi buf使用计数 | 使用之前 +1, 使用之后-1,为0,没pool, mpi buf 将被释放 |
| dma | dma buf使用计数 | 使用之前 +1, 使用之后-1,为0,dma_buf 将被释放 |
| use | 非本RRT加的引用计数 | ref - use == 0 表示本RRT未使用此BUF。 |
| basefd | dma buf 基础fd | linux 内核态的RRT,basefd = -1 |
| status | buf 当前状态 | bit0: 1-表示对象已注册,0-资源被释放<br>bit1: 1-表示对象可访问,0-不可访问<br>bit2: 1-表示对象被删除,0-未删除<br>bit3: 1-表示对象不允许删除,0-允许删除<br>bit4: 1-表示私有对象,0-公共对象<br>bit5: 1-表示被删除时保留ID, 0-不保留<br>bit6: 1-表示支持被监视,0-不可监视<br>bit7-9: 保留<br>bit10: 1-表示BUFFER已经被删除<br>bit11-31: 保留 |
| size | buf 大小 | 单位BYTE, 为0表示此路为卷绕模式 |
| handle | buf 句柄 | RV1106 是物理地址 |
| vaddr | 虚拟地址 | RTOS虚拟地址和物理地址相同 |
| paddr | 物理地址 | IC总线上外设地址 |
| memtype | 内存池类型 | cma: 连续空间<br>system: 非连续的空间<br>memfd: Linux用戶态多进程共享空间 |
| create | buf 创建者 | 记录BUFFER分布,“deleted” 代表该BUFFER创建者被删除 |
| user | buf 使用者 | 所有轮转BUFFER,会被记录当前使用者,<br>轮转BUFFER,会有POOL |
| total | 总内存 | 单位BYTE |
| mpi pool list | buf pool 列表分界线 | 以下是POOL相关信息 |
| poid | 全局唯一ID | pool_id = poid 说明此BUFFER,隶属于这个POOL |
| nkid | 自定义ID | 如果此POOL是用戶态导入,此ID为用戶态POOL ID |
| total | 总BUFFER个数 |  |
| free | 剩余BUFFER个数 | 当前可用BUFFER |
| min | 最小剩余 | 为-1,表示存在丢帧 |

| 项目 | 说明 | 备注 |
| --- | --- | --- |
| size | pool 中BUFFER SIZE | 所有的BUFFER大小必须大于这个值 |
| reflevel | POOL空闲BUF REFCNT水线 | 当MPI BUF REFCNT小于等于此值时为空闲BUF |
| status | pool 当前状态 | bit0: 1-表示对象已注册,0-资源被释放<br>bit1: 1-表示对象可访问,0-不可访问<br>bit2: 1-表示对象被删除,0-未删除<br>bit3: 1-表示对象不允许删除,0-允许删除<br>bit4: 1-表示私有对象,0-公共对象<br>bit5: 1-表示被删除时保留ID, 0-不保留<br>bit6: 1-表示支持被监视,0-不可监视<br>bit7-31: 保留 |
| create | pool 创建者 |  |
| user | pool 使用者 |  |

## 7. VLOG

媒体框架的LOG管理器。

### 7.1 查看内核LOG



```text
cat /dev/mpi/vlog
```



### 7.2 设置模块LOG输出等级的方式

命令同时修改 rockit so 和 ko 的模块日志级别。module 可选 all cmpi mb sys vdec venc rgn vpss vgs tde avs wbc vo vi ai ao aenc adec。level 可选 0,1,2,3,4,5,6；2 为 ERR（红色），3 为 WRN（黄色），4 为 INF（绿色）。

```text
echo module=level > /tmp/rt_log_level
```



### 7.3 设置 SO LOG输出路径和大小



```text
echo rt_log_path=/tmp/rockit.log > /tmp/rt_log_level

echo rt_log_size=1024000 > /tmp/rt_log_level
```



### 7.4 清除LOG



```text
echo 0 > /dev/mpi/vlog
```



## 8. VSYS

媒体绑定关系管理器,可以通过如下命令查看当前绑定关系和帧率相关信息:

```text
cat /dev/mpi/vsys
```



| 项目 | 说明 | 备注 |
| --- | --- | --- |
| module | 模块信息 | 模块名 |
| version | 版本信息 | 仓库名:commit:版本号 |
| build | 编译信息 | 编译者-编译日期 |
| mpi node list | node 列表分界线 | 以下是node相关信息 |
| id | 全局唯一ID | 用来识别MPI node,相当于HANDLE |
| name | 创建NODE的设备名 | 多个NODE可能同一个名字 |
| handle | NODE句柄 | node 结构体内存指针 |
| nid | rockit 自定义ID | 自定义ID, 方便ROCKIT管理NODE |
| uid | 数据流树节点ID | 此ID用来查询MPI BUF使用者数组,可以确定当BUF当前归宿 |
| ref | 使用计数 | 使用之前 +1, 使用之后-1,为0, 释放 |
| infa_cnt | 接收帧计数 | node 接收帧总数 |
| lcnt | 接收丢帧计数 | 因处理不过来,或者处理失败,<br>引起的丢帧,帧率控制不在此范围 |
| frate | 接收帧率 | 以S为单位进行统计,不支持设置 |
| fbase | 接收丢帧比例 | 接收fbase帧,取首帧,其余全丢 |
| wcnt | 接收端用戶队列实际帧数 | 用戶通过depth 设置用戶队列大小,<br>用戶获取后未释放的帧也算在内 |
| depth | 接收端用戶队列深度 | 不能超过前级BUF队列的总大小,<br>否则概率卡住前级 |
| timeout | 接收端获取用戶队列数据超时时间 | 单位ms |
| onfa_cnt | 发送帧计数 | node 发送帧总数 |
| lcnt | 发送丢帧计数 | 因处理不过来,或者处理失败,<br>引起的丢帧,帧率控制不在此范围 |
| frate | 发送帧率 | 以S为单位进行统计,不支持设置 |
| fbase | 发送丢帧比例 | 发送fbase帧,发首帧,其余全丢 |
| wcnt | 发送端用戶队列实际帧数 | 用戶通过depth 设置用戶队列大小,<br>用戶获取后未释放的帧也算在内 |
| depth | 发送端用戶队列深度 | 不能超过前级BUF队列的总大小,<br>否则概率卡住前级 |
| timeout | 发送端获取用戶队列数据超时时间 | 单位ms |
| itime | 接收1帧耗时 | 单位us |
| otime | 发送1帧耗时 | 单位us |

| 项目 | 说明 | 备注 |
| --- | --- | --- |
| state | node 当前状态 | bit0: 1-表示对象已注册,0-资源被释放<br>bit1: 1-表示对象可访问,0-不可访问<br>bit2: 1-表示对象被删除,0-未删除<br>bit3: 1-表示对象不允许删除,0-允许删除<br>bit4: 1-表示私有对象,0-公共对象<br>bit5: 1-表示被删除时保留ID, 0-不保留<br>bit6: 1-表示支持被监视,0-不可监视<br>bit7-9: 保留<br>bit10: 1-删除中....<br>bit11: 1-刷新BUF中....<br>bit12: 1-工作中...<br>bit13: 1-前级有绑定...<br>bit14: 1-绑定前级自动工作...<br>bit15-31: 保留 |
| next node | 后级NODE ID | 支持1个NODE 绑定多个NODE |
| mpi node frame control | node 帧率控制表 | 以下是NODE帧率控制相关信息 |
| id | 全局唯一ID | 用来识别MPI node,相当于HANDLE |
| name | 创建NODE的设备名 | 多个NODE可能同一个名字 |
| table | 丢帧表 | 大小为帧率，n 表示留 n 帧，0 表示丢。英文原稿写 0 保留、1 丢弃，存在冲突，须核对 SDK。 |
| mpi dev list | ROCKIT设备列表 | 以下是设备信息 |
| id | 设备ID | 全局唯一标识 |
| name | 设备名称 | 方便区分设备 |
| handle | 设备句柄 | 设备结构体内存地址 |
| ref | 引用计数 | 打开句柄引用计数加1 |
| node | 设备上NODE | 以ID形式列出所有的NODE |

## 9. VENC

编码参数,可以通过以下命令:

```text
cat /proc/vcodec/enc/venc_info
```


### `venc thread status`

| 参数 | 描述 |
| --- | --- |
| last_runing (EN: last_running) | 线程最近一次被唤醒的时刻 |
| run_cnt | 线程运行的次数 |
| que_cnt | 线程触发次数 |

### `venc chn running status`

| 参数 | 描述 |
| --- | --- |
| ID | 编码通道号 |
| runing (EN: running) | 通道是否在工作 |
| combo_run | 通道jpeg合并编码是否工作 |
| cfg_gap | 通道配置寄存器耗时(ms) |
| strm_cnt | 通道中缓存码流个数 |
| strm_out | 通道中送给应用码流个数 |
| gap_time | 通道前后两次启动编码的间隔(ms) |
| cb_gap_time | JPEG合并编码两个编码时间间隔 |
| last_cb_start | 最近一次JPEG合并编码启动时刻 |
| last_cb_end | 最近一次JPEG合并编码结束时刻 |
| queue_size | 通道buffer队列大小 |
| pkt_total_cnt | 通道中packet的总数 |
| pkt_user_get | 通道中应用已获取的packet数量 |
| pkt_user_put | 通道中应用已释放的packet数量 |
| seq_user_get | 应用当前获取码流的seq |
| seq_user_put | 应用当前释放码流的seq |
| seq_encoded | 通道当前已完成编码的seq |
| seq_encoding | 通道当前正在编码的seq |

### `venc chn attr 1`

| 参数 | 描述 |
| --- | --- |
| ID | 编码通道号 |
| Width | 编码通道宽度 |
| Height | 编码通道高度 |
| Type | 编码通道类型 |
| ByFrame | 按帧获取码流标识<br>n:按包获取(当前不支持)<br>y:按帧获取 |
| Sequence | 序列号<br>按帧获取时为帧序列号,按包获取时为包序列号 |
| GOPMode | GOP模式 |
| Prio | 通道优先级的值 |
| MaxWidth | 编码通道最大宽度 |
| MaxHeight | 编码通道最大高度 |
| Online | 卷绕使能开关 |
| RefShare | 重构/参考buffer是否共享 |

### `venc chn attr 2`

| 参数 | 描述 |
| --- | --- |
| ID | 编码通道号 |
| Vestr | 是否启动编码 |
| SrcFr | VENC帧率控制的源帧率,即输入帧率 |
| TarFr | VENC帧率控制的目标帧率 |
| Timeref | VENC启动时间 |
| PixFmt | 编码当前帧的格式 |
| RealFps | VENC真实帧率 |
| Rotation | VENC是否开启旋转 |
| Mirror | VENC是否开启镜像 |

### `ring buf status`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号 |
| w_pos | 码流buf的写位置 |
| r_pos | 码流buf的读位置 |
| used_len | 码流buf用掉的空间 |
| total_len | 码流buf总空间大小 |
| min_size | 单帧分配要求最小 free 空间 |
| l_w_pos | 最近一次更新写位置 |
| l_r_pos | 最近一次更新读位置 |
| max_use_len | 码流buf最大被使用的空间 |

### `hw status`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号 |
| hw_run | 当前通道正在运行 |
| enc_status | enc所处状态:<br>0:ENC_STATUS_CFG_IN,<br>1:ENC_STATUS_CFG_DONE,<br>2:ENC_STATUS_START_IN,<br>3:ENC_STATUS_START_DONE,<br>4:ENC_STATUS_RUN_TASK_IN,<br>5:ENC_STATUS_RUN_TASK_DONE,<br>6:ENC_STATUS_INT_IN,<br>7:ENC_STATUS_INT_DONE,<br>8:ENC_STATUS_SLICE_INFO_IN,<br>9:ENC_STATUS_SLICE_INFO_DONE |
| pkt_fail_cnt | enc请求packet pool失败次数 |
| ring_fail_cnt | stream buf分配失败次数 |
| cfg_fail_cnt | 生成硬件配置信息失败次数 |
| start_fail_cnt | 启动硬件编码失败的次数 |
| pkt_full_cnt | 因为PACKET超过100个引起的丢帧次数。 |

### `hw param`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号 |
| qp_dlt_row_i | I帧的行级qp调整最大幅度值 |
| qp_dlt_row | P帧的行级qp调整最大幅度值 |
| qbias_en | bias调整开关 |
| qbias_i | I块的bias值 |
| qbias_p | P块的bias值 |
| flt_str_i | I帧的滤波强度 |
| flt_str_p | P帧的滤波强度 |
| thrd_i | I帧的块级madi阈值表格 |
| thrd_p | P帧的块级madi阈值表格 |
| step_i | I帧根据thrd_i进行的aq查表所用的表格 |
| step_p | P帧根据thrd_p进行的aq查表所用的表格 |
| qbias_arr | bias配置 |
| aq_rnge_arr | aq约束范围的配置 |

### `fine tuning param`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号参数 |
| scene_mode | 场景模式 |
| md_swth_en | 动静切换开关 |
| deblur_str | 去拖尾的强度 |
| atr_str | 去振铃强度 |
| atl_str | 去条纹强度 |
| lambda_idx | P帧的lambda下标 |
| lambda_i_idx | I帧的lambda下标 |
| atf_str | 去闪烁的功能 |
| static_frm_num | 判断块静止的帧数阈值 |
| madp16_th | 块静止的madp⻔限 |
| skip16_wgt | skip16的倾向性增强效果 |
| skip32_wgt | skip32的倾向性增强效果 |
| lgt_chg_lvl | 针对光线变化场景的调优参数等级 |

### `venc roi attr`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号参数 |
| roi | ROI索引 |
| x | 水平方向起始坐标 |
| y | 垂直方向起始坐标 |
| w | ROI宽度 |
| h | ROI高度 |
| quality | ROI宏块的QP值 |
| intra | ROI宏块是否强制设置为intra |
| abs_qp | 绝对值QP使能开关 |

### `hw session infos`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号 |
| device | 设备名称 |
| hw_running | 硬件是否正在运行 |
| online | 卷绕使能开关 |
| wrap_ovfl | 卷绕溢出次数 |
| bs_ovfl | 码流buffer溢出次数 |
| wrap_src_mis | 卷绕源不匹配次数 |
| enc_err_cnt | 编码器异常次数 |
| enc_err_irq | 编码器异常中断状态寄存器值 |
| enc_err_st | 编码器异常状态寄存器值 |

### `bitstream buffer addr`

| 参数 | 描述 |
| --- | --- |
| top | 码流buffer栈顶 |
| bot | 码流buffer栈底 |
| wr | 码流buffer写地址 |
| rd | 码流buffer读地址 |

### `h264e chn attr`

| 参数 | 描述 |
| --- | --- |
| ID | 编码通道号 |
| Width | 宽度,以像素为单位 |
| Height | 高度,以像素为单位 |
| Profile | 编码通道profile<br>Base: baseline<br>Mp:main profile<br>Hp:high profile |

### `Syntax INFO1`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号 |
| Slcsplten | 是否使用slice划分 |
| SplitMode | slice划分模式<br>1:按字节划分<br>2:按宏块划分 |
| Slcsize | slice的大小,当split_mode不同时,slice_size表示不同的意义 |
| IntraRefresh | 是否使能P帧刷I宏块 |
| RefreshMode | 刷I宏块的模式<br>row:按行刷<br>column:按列刷 |
| RefreshNum | 每帧刷I宏块的行数或者列数 |

### `Syntax INFO2`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号 |
| Profile | 编码通道profile类型<br>Base:Baseline<br>MP:Main profile<br>HP:High profile |
| Cabac | 熵编码模式,cavlc或cabac |
| Trans8 | 使用的变换模式<br>默认只使能trans4x4模式<br>Y:使能trans8x8模式 |
| ScalingMode | 缩放列表模式 |
| Poc | 语法元素pic_order_cnt_type的值 |
| Alpha | 语法元素slice_alpha_c0_offset_div2的值 |
| Beta | 语法元素slice_beta_offset_div2的值 |

### `h265e chn attr`

| 参数 | 描述 |
| --- | --- |
| ID | 编码通道号 |
| Width | 宽度,以像素为单位 |
| Height | 高度,以像素为单位 |
| Profile | 编码通道profile<br>main: main profile |

### `Syntax INFO1`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号 |
| Slcsplten | 是否使用slice划分 |
| SplitMode | slice划分模式<br>1:按字节划分<br>2:按宏块划分 |
| Slcsize | slice的大小,当split_mode不同时,slice_size表示不同的意义 |
| IntraRefresh | 是否使能P帧刷I宏块 |
| RefreshMode | 刷I宏块的模式<br>row:按行刷<br>column:按列刷 |
| RefreshNum | 每帧刷I宏块的行数或者列数 |

### `Syntax INFO2`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号 |
| Dblken | 语法元素slice_deblocking_filter_disabled_flag的取反值 |
| Tc | 语法元素slice_tc_offset_div2的值 |
| Beta | 语法元素slice_beta_offset_div2的值 |
| Saoluma | 语法元素slice_sao_luma_flag的值 |
| Saochroma | 语法元素slice_sao_chroma_flag的值 |
| IntraSmoothing | 语法元素strong_intra_smoothing_enabled_flag的值 |
| ScalingMode | 缩放列表模式 |
| TmvpEn | TMVP使能开关 |

### `Trans Info`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号 |
| CbQpoffset | 语法元素pps_cb_qp_offset的值 |
| CrQpoffset | 语法元素pps_cr_qp_offset的值 |

### `jpege chn attr`

| 参数 | 描述 |
| --- | --- |
| ID | 通道号 |
| width | 图像宽度。单位:像素 |
| height | 图像高度。单位:像素 |
| quant | 通道量化qp |
| qfactor | 通道采用的qfactor |
| qfmax | 通道采用的qfactor的最大值 |
| qfmin | 通道采用的qfactor的最小值 |

### `RC base param1`

| 参数 | 描述 |
| --- | --- |
| ChnId | 编码通道号 |
| Gop | 编码Gop(Group of pictures) |
| StatTm | 码率统计时间,单位秒 |
| ViFr | VI发送图像帧率 |
| TrgFr | 编码目标帧率 |
| RcMode | 码率控制模式(cbr/fixqp/vbr/avbr/smart) |
| Br(kbps) | 码率,单位kbps |
| IQp | I帧Qp, FixQp有效 |
| PQp | P帧Qp, FixQp有效 |

### `RC base param2`

| 参数 | 描述 |
| --- | --- |
| ChnId | 编码通道号 |
| MinQp | P帧最小qp |
| MaxQp | p帧最大qp |
| MinIQp | I帧最小qp |
| MaxIQp | I帧最大qp |
| EnableIdr | IDR使能开关<br>Y:使能<br>N:关闭 |

### `RC run comm param1`

| 参数 | 描述 |
| --- | --- |
| ChnId | 编码通道号 |
| bLost | 当瞬时码率超出设定的阈值时是否丢帧 |
| LostThr | 丢帧阈值 |
| LostFrmstr | 丢帧的数量统计 |
| EncGap | 编码帧的间隔 |

### `RC run comm param2`

| 参数 | 描述 |
| --- | --- |
| ChnId | 编码通道号 |
| SprFrmMod | 超大帧处理模式 |
| SprIFrm | I帧超大帧阈值 |
| SprPFrm | P帧超大帧阈值 |
| RCPriority | 码率控制优先级<br>bitrate:目标码率优先<br>framebits:超大帧阈值优先 |

### `RC gop mode attr`

| 参数 | 描述 |
| --- | --- |
| ChnId | 编码通道号 |
| GopMode | gop_mode的类型 |
| IpQpDelta | IP帧Qp Delta值。SmartP模式下显示Bg帧和P帧的Qp Delta值。<br>取值范围:[-10, 30] |
| BgInterval | Special P帧的间隔<br>取值范围:小于等于Gop |
| ViQpDelta | Vitual I帧和P帧的Qp Delta值<br>取值范围:[-10,30] |

### `RC run vbr common param`

| 参数 | 描述 |
| --- | --- |
| ChnId | 编码通道号 |
| ChgPs | VBR开始调整Qp时的码率相对于最大码率的比例。<br>该值通过bitrate/max_bitrate*100计算获取 |
| MinIprop | 最小IP帧码率的比值。取值范围:[1,100]。<br>默认值:1 |
| MaxIprop | 最大IP帧码率的比值。取值范围:[MinIprop, 100]。<br>默认值:100 |
| MaxQp | P帧的最大QP。取值范围:[0, 51]。<br>默认值:51 |
| MinQp | P帧的最小QP。取值范围:[0, MaxQp]。<br>默认值:24 |
| MaxIQp | I帧的最大QP。取值范围:[0, 51]。<br>默认值:51 |
| MinIQp | I帧的最小QP。取值范围:[0, MaxIQp]。<br>默认值:24 |
| FrmMaxQp | 帧级的P帧最大QP |
| FrmMinQp | 帧级的P帧最小QP |
| FrmMaxIQp | 帧级的I帧最大QP |
| FrmMinIQp | 帧级的I帧最小QP |
| MaxReEncTimes | 每帧重编码次数。0表示不进行重编码。取值范围:[0, 3]<br>默认值:1 |

### `RC run cbr param`

| 参数 | 描述 |
| --- | --- |
| ChnId | 编码通道号 |
| MinIprop | 最小IP帧比例。取值范围:[1, 100] |
| MaxIprop | 最大IP帧比例。取值范围:[MinIprop, 100] |
| MaxQp | P帧最大QP,用于钳位质量。取值范围:[0, 51] |
| MinQp | P帧最小QP,用于钳位码率波动。取值范围:[0, MaxQp] |
| MaxIQp | I帧的最大QP。用于控制I帧的最小bits数。取值范围:[0, 51] |
| MinIQp | I帧的最小QP。用于控制I帧的最大bits数。取值范围:[0, MaxIQp] |
| FrmMaxQp | 帧级的P帧最大QP |
| FrmMinQp | 帧级的P帧最小QP |
| FrmMaxIQp | 帧级的I帧最大QP |
| FrmMinIQp | 帧级的I帧最小QP |
| MaxReEncTimes | 每帧重编码次数。0表示不进行重编码。取值范围:[0, 3] |

### `RC run avbr param`

| 参数 | 描述 |
| --- | --- |
| ChnId | 编码通道号 |
| MaxStillQP | 最大静止QP |
| MotionSensi | 运动灵敏度 |
| MinPercent | 最小静止百分比 |

### `RC HierarchicalQp INFO`

| 参数 | 描述 |
| --- | --- |
| ChnId | 编码通道号 |
| bEnable | 分层qp是否使能 |
| FrameNum[0] | qp为第1层的帧个数 |
| FrameNum[1] | qp为第2层的帧个数 |
| FrameNum[2] | qp为第3层的帧个数 |
| FrameNum[3] | qp为第4层的帧个数 |
| QpDelta[0] | 第1层的帧的QpDelta |
| QpDelta[1] | 第2层的帧的QpDelta |
| QpDelta[2] | 第3层的帧的QpDelta |
| QpDelta[3] | 第4层的帧的QpDelta |

RC debreath_effect info

| 参数 | 描述 |
| --- | --- |
| ChnId | 编码通道号 |
| bEnable | 去除呼吸效应是否使能 |
| Strength0 | 去除呼吸效应强度0 |
| DeBrthEfctCnt | 去除呼吸效应图像处理的次数 |

RC run CBR/VBR info1

| 参数 | 描述 |
| --- | --- |
| ChnId | 编码通道号 |
| InsBr(kbps) | 瞬时码率,单位kbps |
| InsFr | 瞬时帧率 |
| WatL | 码率水线 |
| CfgBt(kb) | 前帧的目标大小,单位kb |
| RealBt(kb) | 上一帧码流的实际大小,单位kb |
| IPRatio | I帧和P帧平均大小的比例 |
| StartQp | 起始Qp |
| MinQp | 最小Qp |
| MaxQp | 最大Qp |

### `mpp_packet pool`

| 参数 | 描述 |
| --- | --- |
| unused_cnt | packet空闲个数 |
| used_cnt | packet被占用个数 |
| total_cnt | 目前总packet个数 |
| max_cnt | packet最大个数 |

### `mpp_buffer pool`

| 参数 | 描述 |
| --- | --- |
| unused_cnt | buffer空闲个数 |
| used_cnt | buffer被占用个数 |
| total_cnt | 目前总buffer个数 |
| max_cnt | buffer最大个数 |

### `mpp_frame pool`

| 参数 | 描述 |
| --- | --- |
| unused_cnt | frame空闲个数 |
| used_cnt | frame被占用个数 |
| total_cnt | 目前总frame个数 |
| max_cnt | frame最大个数 |

## 10. venc_info 和 rockit api 映射关系

venc_info 是内核打印的编码器配置参数,目前只有RV1103B/RV1106B、RV1103/RV1106支持。本章节主要对重点配置进行梳理,侧重主观效果、客观压缩率相关配置。

| venc_info | rockit api | rockit api 成员 | 备注 |
| --- | --- | --- | --- |
| qbias_en<br>qbias_i<br>qbias_p | RK_MPI_VENC_SetH264Qbias<br>RK_MPI_VENC_SetH265Qbias | bEnable<br>u32QbiasI<br>u32QbiasP | RV1103/RV1106有效,<br>RV1103B/RV1106B无效 |
| qbias_en<br>qbias_arr[18] | RK_MPI_VENC_SetH264Qbias2<br>RK_MPI_VENC_SetH265Qbias2 | bEnable<br>u32Qbias2[18] | RV1103/RV1106无效,<br>RV1103B/RV1106B的升<br>级版本 |
| StartQp<br>MaxQp<br>MinQp<br>MaxIQp<br>MinIQp<br>IpQpDelta<br>MaxReEncTimes<br>FrmMaxQp<br>FrmMinQp<br>FrmMaxIQp<br>FrmMinIQp<br>md_switch_qp | RK_MPI_VENC_SetRcParam | s32FirstFrameStartQp<br>u32MaxQp<br>u32MinQp<br>u32MaxIQp<br>u32MinIQp<br>s32DeltIpQp<br>s32MaxReEncodeTimes<br>u32FrmMaxQp<br>u32FrmMinQp<br>u32FrmMaxIQp<br>u32FrmMinIQp<br>u32MotionStaticSwitchFrmQp | 初始QP、块级QP、行级<br>QP配置、帧级QP,重编<br>次数 |
| thrd_i[16]<br>thrd_p[16]<br>step_i[16]<br>step_p[16]<br>qp_dlt_row_i<br>qp_dlt_row | RK_MPI_VENC_SetRcParam2 | u32ThrdI[16]<br>u32ThrdP[16]<br>s32AqStepI[16]<br>s32AqStepP[16]<br>u32RowQpDelta<br>u32RowIQpDelta | AQ参数,行级qp调整 |
| aq_rnge_arr[10] | RK_MPI_VENC_SetRcParam3 | u32AqRange[10] | RV1103/RV1106无效,<br>RV1103B/RV1106B的升<br>级版本 |
| scene_mode | RK_MPI_VENC_SetSceneMode | enSceneMode | 场景模式 |
| flt_str_i<br>flt_str_p | RK_MPI_VENC_SetFilter | u32StrengthI<br>u32StrengthP | 滤波强度 |
| md_swth_en | RK_MPI_VENC_EnableMotionStaticSwitch | bEnable | 静态场景极低码率使能 |
| deblur_str | RK_MPI_VENC_SetMotionDeblurStrength | u32Strength | 去拖尾 |
| atr_str | RK_MPI_VENC_SetAntiRing | u32AntiRing | 抗振铃效应 |
| atl_str | RK_MPI_VENC_SetAntiLine | u32AntiLine | 去除条纹效应 |
| atf_str | RK_MPI_VENC_SetAntiFlick | u32AntiFlick | 消除噪声抖动/蠕动 |
| lambda_i_idx<br>lambda_idx | RK_MPI_VENC_SetLambda | u32LambdaI<br>u32Lambda | lambda配置 |
| static_frm_num<br>madp16_th<br>skip16_wgt<br>skip32_wgt | RK_MPI_VENC_SetStaticWeight | u32FrmNum<br>u32Madp16Th<br>u32Skip16Weight<br>u32Skip32Weight | 静态场景skip倾向 |
| lgt_chg_lvl | RK_MPI_VENC_SetLightChange | u32Level | RV1103/RV1106无效,<br>RV1103B/RV1106B有效 |

| venc_info | rockit api | rockit api 成员 | 备注 |
| --- | --- | --- | --- |
| DblkEn<br>alpha<br>beta | RK_MPI_VENC_SetH264Dblk | disable_deblocking_filter_idc<br>slice_alpha_c0_offset_div2<br>slice_beta_offset_div2 | H.264的去块滤波 |
| DblkEn<br>Tc<br>Beta | RK_MPI_VENC_SetH265Dblk | slice_deblocking_filter_disabled_flag<br>slice_tc_offset_div2<br>slice_beta_offset_div2 | H.265的去块滤波 |
| Saoluma<br>Saochroma | RK_MPI_VENC_SetH265Sao | slice_sao_luma_flag<br>slice_sao_chroma_flag | H.265的SAO参数 |
| IntraSmoothing | RK_MPI_VENC_SetH265PredUnit | strong_intra_smoothing_enabled_flag | H.265帧内强滤波 |
| TmvpEn | RK_MPI_VENC_EnableTmvp | bEnable | H.265的TMVP开关 |
| StatTm<br>GopMode<br>Gop | RK_MPI_VENC_SetChnAttr | u32StatTime<br>enGopMode<br>u32Gop | 码控统计时间,GOP模<br>式,GOP⻓度 |
| ScalingMode<br>CbQpOffset<br>CrQpOffset | RK_MPI_VENC_SetH265Trans | bScalingListEnabled<br>cb_qp_offset<br>cr_qp_offset | H.265量化参数 |
| trans8<br>ScalingMode<br>CbQpOffset<br>CrQpOffset | RK_MPI_VENC_SetH264Trans | u32TransMode<br>bScalingListValid<br>chroma_qp_index_offset | H.264的CbQpOffset和<br>CrQpOffset复用<br>chroma_qp_index_offset |
| RcMode<br>MinBr(kbps)<br>MaxBr(kbps) | RK_MPI_VENC_SetChnAttr<br>RK_MPI_VENC_EnableSvc | enRcMode<br>u32MinBitRate<br>u32MaxBitRate | enRcMode设为VBR,设<br>置u32MinBitRate和<br>u32MaxBitRate,使能<br>SVC,才会切入smart |
| bEnable<br>Strength0 | RK_MPI_VENC_SetDeBreathEffect | bEnable<br>s32Strength0 | 去呼吸效应参数 |
| cu_dqp | RK_MPI_VENC_SetH265CuDqp | u32CuDqp | H.265的<br>diff_cu_qp_delta_depth<br>相关 |

## 11. IVS

智能视频监控参数,可以通过以下命令:

```text
cat /proc/vcodec/ivs/ivs_info
```


### `ivs channel attr`

| 参数 | 描述 |
| --- | --- |
| ID | 智能视频监控通道号 |
| width | 通道宽度 |
| height | 通道高度 |
| smear_en | smear使能开关 |
| weightp_en | weightp使能开关 |
| max_width | 通道最大宽度 |
| max_height | 通道最大高度 |
| md_en | 运动侦测使能开关 |
| od_en | 遮挡侦测使能开关 |

### `ivs common cfg`

| 参数 | 描述 |
| --- | --- |
| ID | 智能视频监控通道号 |
| fmt | 图像格式类型 |
| frm_acc_intval | 帧累积间隔 |
| frm_acc_gop | 帧累积的图像组计数 |

### `ivs md cfg`

| 参数 | 描述 |
| --- | --- |
| ID | 智能视频监控通道号 |
| switch_sad | 运动侦测的SAD计算模式选择<br>0: 均值补偿前的SAD<br>1: 均值补偿的SAD<br>2: 均值补偿前后的两个SAD值里的最小值<br>3: 均值补偿前后的两个SAD值里的最大值 |
| thres_sad | 4x4块级运动的SAD阈值 |
| thres_move | 8x8块运动侦测阈值 |
| night_mode | 夜间模式使能开关 |
| filter_sw | ⻜絮滤波器使能开关 |
| thres_dust_mv | 当前8x8块的周围8个8x8块是⻜絮块的个数阈值 |
| thres_dust_blk | 当前8x8块内部的4个4x4块是⻜絮块的个数阈值 |
| thres_dust_chng | 当前8x8块与前帧对应位置的块亮度均值差异阈值 |

### `ivs od cfg`

| 参数 | 描述 |
| --- | --- |
| ID | 智能视频监控通道号 |
| thres_complex | 在遮挡侦测中的复阈值 |
| thres_complex_cnt | 在遮挡侦测中的复阈值计数 |
| thres_sad | SAD阈值 |

## 12. VRGN

媒体框架的RGN管理器,使用以下命令可以查看当前RGN的相关信息:

```text
cat /dev/mpi/vrgn
```



| 项目 | 说明 | 备注 |
| --- | --- | --- |
| module | 模块信息 | 模块名 |
| version | 版本信息 | 仓库名:commit:版本号 |
| build | 编译信息 | 编译者-编译日期 |
| rgn list | rgn 列表分界线 | 以下是RGN相关信息 |
| handle | rgn 句柄 | 用来识别RGN |
| type | rgn 类型 | 用来识别RGN类型,OVERLAY、COVER、MOSAIC |
| width | rgn 区域宽度大小 |  |
| heigth (EN: height) | rgn 区域高度大小 |  |
| format | rgn 区域格式 | OVERLAY、COVER类型有效,<br>"-1" 表示输入类型不支持 |
| buf_id | rgn 当前使用buf | OVERLAY类型有效,其他类型为 "-1" |
| refcnt | mpi buf使用计数 |  |
| channel_num | rgn attach 数量 | RGN ATTACH 通道(模块)的数量 |
| node_rgn list | node_rgn 列表分界线 | 以下是NODE_RGN相关信息 |
| id | 全局唯一ID | 用来识别MPI node |
| name | 创建NODE的设备名 | 多个NODE可能同一个名字 |
| h | rgn 句柄 | 用来识别RGN,相当于HANDLE |
| x | rgn 区域x坐标 | RGN 起始位置的x偏移量 |
| y | rgn 区域y坐标 | RGN 起始位置的y偏移量 |
| h x y | rgn 区域位置信息 | h x y为一组,用来识别RGN位置信息；英文原稿另注明共 8 组。 |

## 13. VRGA

rockit 种的RGA驱动管理器,使用以下命令可以查看当前RGA NODE状态

```text
cat /dev/mpi/vrga
```



| 项目 | 说明 | 备注 |
| --- | --- | --- |
| id | 全局唯一ID | 用来识别MPI node,相当于HANDLE |
| name | 创建NODE的设备名 | 多个NODE可能同一个名字 |
| ctx | rga node 控制句柄 | 虚拟地址,可以和LOG对比,确认那个NODE出问题 |
| nid | rockit 自定义ID | 自定义ID, 方便ROCKIT管理NODE |
| ref | 使用计数 | 使用之前 +1, 使用之后-1,为0, 释放 |
| bypass | bypass 标记 | 1 表示RGA node 不做任何处理,直接透传 |
| csnt | CROP 参数设置计数 | CROP参数队列 进队位置 |
| cgnt | CROP参数获取计数 | CROP参数队列 出队位置 |
| ssnt | SCALL 参数设置计数 | SCALL参数队列 进队位置 |
| sgnt | SCALL参数获取计数 | SCALL参数队列 出队位置 |
| type | RGA任务类型 | 0:通用, 1: OSD |
| swidth | 输出宽度 | 输出图像的实际宽度 |
| sheight | 输出高度 | 输出图像的实际高度 |
| svwidth | 输出内存宽度 | 输出图像所占用的内存宽度,用于内存对⻬。 |
| svheight | 输出内存高度 | 输出图像所占用的内存高度,用于内存对⻬。 |
| sfmt | 输出图像格式 | 详⻅:rk_comm_video.h |
| cenalbe | 裁剪是能标记 | 1:表示对输入源进行裁剪 |
| coordinate | 裁剪参数为百分比 | 1: 表示百分比。 0:绝对坐标。 |
| cxpos | 裁剪区域x坐标 | coordinate = 1: 表示百分比。 coordinate = 0:绝对坐标。 |
| cypos | 裁剪区域y坐标 | coordinate = 1: 表示百分比。 coordinate = 0:绝对坐标。 |
| cwidth | 裁剪区域宽 | coordinate = 1: 表示百分比。 coordinate = 0:绝对宽度。 |
| cheight | 裁剪区域高 | coordinate = 1: 表示百分比。 coordinate = 0:绝对高度。 |
| job | 当前NODE下job | 以ID的形式列出当前NODE下未处理完的JOB |

## 原稿差异与核对事项

- 两种原稿均标 V2.28.0、2025-04-27；中文多出 `memtype`、`nkid`，已纳入四语正文，不能仅由页数判断内容新旧。
- VSYS 的 `table`：中文为“大小为帧率，n 表示留 n 帧，0 表示丢”；英文为“大小为帧率，0 保留、1 丢弃”。正文采用中文基线并保留此冲突，实际行为须核对 SDK。
- `isp_max_h` 定义为输入高度，裁剪说明却写“宽度”；两份文档都如此。应以 SDK 实现和原稿诊断提示核对，不静默改为高度。
- RV1126B 内核模块列表原样写 `VALLC`；`cenalbe`、`SCALL`、`RK_MPI_SYS_RelasePhyMemory` 也保留原稿拼写。中文 `last_runing`、`runing`、`heigth` 在英文分别为 `last_running`、`running`、`height`，这些差异已在对应字段注明。
- 两份 API 映射表均把 `qp_dlt_row_i` 对应到 `u32RowQpDelta`、`qp_dlt_row` 对应到 `u32RowIQpDelta`；与名称所暗示的 I/P 含义可能不一致，未擅自交换。
- 中文为 `mpp_packet pool` 与 `mpp_buffer pool` 两张表；英文连续两表都写 `mpp_buffer pool`。本页采用中文标题，并完整保留 packet、buffer、frame 三张表。
- 英文 VRGN 的 `h x y` 额外说明“共 8 组”，已补入中文。英文 `wcnt` 写 frame rate，中文为实际帧数；以中文为基线。`min_size` 中文为单帧分配所需最小空闲空间，英文写 latest；采用中文含义并记录差异。
- 编码器描述中的英文 Warp 按中文“卷绕”理解为 wrapping；标识不改。中文还明确 ROI 的 QP 和 intra 针对宏块、SAD 是均值补偿前后的比较、静态场景极低码率使能、去拖尾及噪声抖动/蠕动，均同步到其他语言。

{% endraw %}

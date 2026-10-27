---
title: "Rockchip Rockit Runtime Library Developer Guide"
description: "Rockchip Rockit Runtime Library Developer Guide - V2.28.0: RRT, VALLOC, VLOG, VSYS, VENC, IVS, VRGN, VRGA"
excerpt: "Rockchip Rockit Runtime Library Developer Guide"
translation_key: "194-rockchip-rockit-runtime"
slug: "194-rockchip-rockit-runtime"
lang: "en"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Linux, Rockit, VENC]
---

{% raw %}

# Rockchip Rockit Runtime Library Developer Guide

Based on the supplied Rockchip Chinese and English V2.28.0 documents (2025-04-27), retaining technical chapters 3-13. Chinese technical content supplies additions missing from English, with discrepancies identified. This is an ArmSoM platform reference: check the actual board, SoC, SDK/BSP, kernel and peripherals individually. It does not establish support for every ArmSoM board. No commands or hardware tests were executed.

| Chipset | Kernel version |
| --- | --- |
| RV1106/RV1103 | Linux 5.10 |
| RV1103B/RV1106B | Linux 5.10 |
| RK3308 | Linux 6.1 |
| RK3506 | Linux 6.1 / rt-thread 4.1 |
| RV1126B | Linux 6.1 |

## 3. Framework

In order to facilitate Rockit porting, a new runtime libraries has been developed in the kernel. Hereinafter referred to as RRT. The block diagram of RRT in the kernel is as follows:

![Rockchip Rockit Runtime Library Developer Guide - RRT](/docs/rockchip-rockit-runtime/assets/en-p004-figure-01.png)



```text
.
├── isp.ko   ---- isp module, corresponding to the /dev/mpi/rkisp-vir0 node
├── valloc.ko  --- buffer manager, corresponding to the /dev/mpi/valloc node
├── venc.ko    --- Encoder module, corresponding to the /dev/mpi/venc
├── vmpi.ko    --- media framework, corresponding to the /dev/mpi/vmpi
├── vpss.ko    --- vpss module, corresponding to the /dev/mpi/vpss
├── vrga.ko    --- rga module, corresponding to the /dev/mpi/vrga
├── vrgn.ko    --- rgn module, corresponding to the /dev/mpi/vrgn
├── vsys.ko    --- system module, corresponding to the /dev/mpi/vsys
└── vvi.ko     --- vi module, corresponding to the /dev/mpi/vvi
```



Before using rockit interface, the above ko need to be loaded, and the loading way is as follows (note: all the above ko have been merged into one ko):



```text
insmod rockit.ko
```



Use the following command to check whether the loading is successful



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



After loading successfully, you can run related programs that depend on rockit.so.

### 3.1 Parameters Supported by KO

#### 3.1.1 mcu_fw_path

The path of MCU wrapping firmware, it is empty by default, does not load MCU firmware.



```text
insmod rockit.ko mcu_fw_path=/oem/usr/ko/hpmcu_wrap.bin
```



#### 3.1.2 mcu_fw_addr

The address of the MCU wrapping firmware, it is 0xff6ff000(rv1106)/0x210f6000(rv1103b) by default.



```text
insmod rockit.ko mcu_fw_addr=0xff6ff000
```



#### 3.1.3 isp_max_h

It is the height of the ISP front-end input. If VICAP has configured the cropping function, it should be configured the width after cropping. If the secondary parameter is configured incorrectly, cat /dev/mpi/vlog will prompt for the correct value.

```text
mpi_log_err("isp input height config err, config h= %d, real h = %d", isp_max_h, isp_h);
```





```text
insmod rockit.ko isp_max_h=1920
```



#### 3.1.4 isp_max_w

Reserved

#### 3.1.5 en_mcu

Whether to enable the MCU driver. It is enabled(rv1106)/disabled(rv1103b) by default. The MCU driver will not be loaded after it is disabled.



```text
insmod rockit.ko en_mcu=0
```



#### 3.1.6 rk_dma_heap_base

The first address of the MMZ released by RK_MPI_SYS_RelasePhyMemory needs to be 4K aligned and larger than the starting address of MMZ. The calculation method of the MMZ starting address is: total physical memory - MMZ size.



```text
insmod rockit.ko rk_dma_heap_base=0x40000
```



#### 3.1.7 rk_dma_heap_size

The size of the MMZ released by RK_MPI_SYS_RelasePhyMemory needs to be less than or equal to the size of the MMZ.



```text
insmod rockit.ko rk_dma_heap_size=0x40000
```



## 4. Cross-platform Porting

The RRT has been enhanced with the addition of OSAL (Operating System Abstraction Layer) and rewritten based on OSAL, enabling it to run not only in the Linux kernel mode but also in the Linux user mode and on RTOS (Real-Time Operating Systems). Currently, there are two instances of the RRT in RV1103B/RV1126B, one running in user mode and the other in kernel mode. To view /dev/mpi/xxx related nodes on LINUX user mode and RTOS, the command dumpsys needs to be prefixed to the original command.

```text
dumpsys cat /dev/mpi/valloc
dumpsys cat /dev/mpi/vsys
dumpsys cat /dev/mpi/vlog
dumpsys cat /dev/mpi/vrgn
```



## 5. Cross - platform Communication

Multiple RRTs may run on a single SOC. To reduce the communication cost for module developers, RRT has achieved cross - platform interoperability. Specifically, the VALLOC module is used to manage the reference count of cross - platform BUFFERs, and the VSYS module is used to implement cross - platform binding and the transfer of BUFFERs. Therefore, there is a prerequisite for cross - platform communication: the RRTs on each platform can share BUFFERs through physical memory. The following table shows the RRTs supported by each SOC and the modules included in each RRT.

| SOC | RRT (Linux Kernel<br>Mode) | RRT (Linux User Mode) | RRT (rt - thread) |
| --- | --- | --- | --- |
| RV1106/RV1103 | VI / VPSS / VENC / AVS /<br>VRGN / VALLOC / VSYS | Not supported | Not supported |
| RV1103B/RV1106B | VI / VPSS / VENC / AVS /<br>VRGN / VALLOC / VSYS | VDEC / VO / VRGN / AI / AO /<br>AENC / ADEC / AMIX / AF / TDE /<br>VALLOC / VSYS / TDE | Not supported |
| RK3308 | Not supported | VALLOC / VSYS / VRGN / VDEC / AI<br>/ AO / ADEC / AENC / AMIX / AF /<br>VO | Not supported |
| RK3506 | Not supported | VALLOC / VSYS / VRGN / VDEC / AI<br>/ AO / ADEC / AENC / AMIX / AF /<br>VO / TDE | VALLOC / VSYS / VRGN / VDEC /<br>AI / AO / ADEC / AENC / AMIX /<br>AF / VO / TDE |
| RV1126B | VI / VPSS / VENC / AVS /<br>VRGN / VALLC / VSYS /<br>GDC / IVS | VI / VALLOC / VSYS / VRGN / VDEC<br>/ AI / AO / ADEC / AENC / AMIX /<br>AF / VO / TDE | Not supported |

## 6. VALLOC

The memory allocator of the media framework, which is responsible for allocating and managing the memory required by the media framework. You can use the following command to check the current memory status:



```text
cat /dev/mpi/valloc
```



Detailed Information:

| Item | Description | Remarks |
| --- | --- | --- |
| module | Module information | Module name |
| version | Version information | Repository name: commit: version number |
| build | Build information | Compiler and Compilation date |
| mpi buf<br>list | Buffer list separator | The following information is related to BUF |
| buf_id | Unique ID of this platform | Used to identify MPI BUF, equivalent to HANDLE. It will display two IDs, with<br>the ID in parentheses being the cross-platform unique ID |
| pool | Buffer pool ID | The buf pool to which the mpi buf belongs, -1 means no pool |
| ref | MPI buf usage count | +1 before use, -1 after use; if the count is 0 and there is no pool, mpi buf is released (Chinese wording; English says 0 means no pool) |
| dma | DMA buf usage count | +1 before use, -1 after use, 0 means dma_buf will be released |
| use | Reference count added by<br>non - this RRT | When ref - use == 0, it indicates that this RRT does not use this BUF. |
| basefd | Basic fd of the dma buf | For RRT in the Linux kernel mode, basefd = -1 |
| status | Current status of the buf | bit0: 1 - indicates that the object has been registered, 0 - the resource has<br>been released<br>bit1: 1 - indicates that the object is accessible, 0 - inaccessible<br>bit2: 1 - indicates that the object has been deleted, 0 - not deleted<br>bit3: 1 - indicates that the object is not allowed to be deleted, 0 - allowed to<br>be deleted<br>bit4: 1 - indicates a private object, 0 - a public object<br>bit5: 1 - indicates that the ID is retained when the object is deleted, 0 - not<br>retained<br>bit6: 1 - indicates that the object can be monitored, 0 - cannot be monitored<br>bit7-9: Reserved<br>bit10: 1 - indicates that the BUFFER has been deleted<br>bit11-31: Reserved |
| size | Buffer size | Unit: BYTE, 0 means it is in wrapping mode |
| handle | Buffer handle | For RV1106, it is the physical address |
| vaddr | Vitrual Adress | RTOS Virtual Address (Same as Physical Address) |
| paddr | Physical Adress | Peripheral address on the IC bus |
| memtype | Memory pool type | cma: contiguous memory; system: noncontiguous memory; memfd: shared memory between Linux user processes |
| create | Buffer creator | Records the distribution of BUFFER, "deleted" means that the creator of this<br>BUFFER has been deleted. |
| user | Buffer user | For all rotating BUFFERs, the current user will be recorded. and there will be<br>POOLs in the rotating BUFFERs |
| total | Total memory | Unit: BYTE |
| mpi pool<br>list | Buffer pool list separator | The following information is related to POOL |
| poid | Global unique ID | pool_id = poid means that this BUFFER belongs to this POOL |
| nkid | Custom ID | If this POOL was imported from user mode, this ID is the user-mode POOL ID |
| total | Total number of BUFFERS |  |

| Item | Description | Remarks |
| --- | --- | --- |
| free | Remaining number of<br>BUFFERS | Currently available BUFFERs |
| min | Minimum remaining | -1 indicates frame loss |
| size | BUFFER SIZE in the pool | All BUFFER sizes must be larger than this value |
| reflevel | POOL Idle BUF REFCNT<br>Watermark | MPI BUF is considered idle when its REFCNT is less than or equal to this<br>value |
| status | Current pool status | bit0: 1-Indicates the object is registered, 0-Resource is released<br>bit1: 1-Indicates the object is accessible, 0-Inaccessible<br>bit2: 1-Indicates the object is deleted, 0-Not deleted<br>bit3: 1-Indicates the object is not allowed to be deleted, 0-Deletion allowed<br>bit4: 1-Indicates a private object, 0-Public object<br>bit5: 1-Indicates the ID is retained upon deletion, 0-Not retained<br>bit6: 1-Indicates support for monitoring, 0-Not monitorable<br>bit7-31: Reserved |
| create | Pool creator |  |
| user | Pool user |  |

## 7. VLOG

LOG manager of media framework.

### 7.1 Kernel LOG



```text
cat /dev/mpi/vlog
```



### 7.2 How to Set the LOG Output Level of the Module

The command `echo module=level > /tmp/rt_log_level` is used to change the LOG output level of the module, and this command affects rockit so and ko at the same time. module = all cmpi mb sys vdec venc rgn vpss vgs tde avs wbc vo vi ai ao aenc adec level=0,1,2,3,4,5,6; 2 is ERR (red), 3 WRN (yellow), 4 INF (green).

```text
echo module=level > /tmp/rt_log_level
```



### 7.3 Set the Output Path and Size of SO LOG



```text
echo rt_log_path=/tmp/rockit.log > /tmp/rt_log_level

echo rt_log_size=1024000 > /tmp/rt_log_level
```



### 7.4 Clear LOG



```text
echo 0 > /dev/mpi/vlog
```



## 8. VSYS

The manager for media relationship binding, you can check the current binding relationship and frame rate information through the following command:

```text
cat /dev/mpi/vsys
```



| Project | Description | Remarks |
| --- | --- | --- |
| module | module information | module name |
| version | version information | warehouse name: commit: version number |
| build | Compilation information | Compiler-Compilation date |
| mpi node list | node list dividing line | The following is node related information |
| id | Globally unique ID | Used to identify MPI node, equivalent to HANDLE |
| name | The name of the device used to<br>create the NODE | Multiple NODEs may have the same name |
| handle | NODE Handle | Memory pointer to the node structure |
| nid | rockit custom ID | Custom ID to facilitate ROCKIT management NODE |
| uid | Data Flow Tree Node ID | This ID is used to query the MPI BUF user array, enabling the<br>determination of the current owner of the BUF. |
| ref | Usage count | +1 before use, -1 after use, 0, release |
| infa_cnt | Count of Received frame | Total number of received frames of node |
| lcnt | Count of Received frame loss | Frame loss caused by inability to process or processing failure,<br>frame rate control is not within this range |
| frate | Received frame rate | Statistics in S, setting is not supported |
| fbase | Received frame loss ratio | Receive fbase frame, take the first frame, and lose the rest |
| wcnt | Actual number of frames in the receiving user queue | User sets the user queue size through depth, and the frames<br>that are not released after the user obtains them are also<br>counted |
| depth | The depth of user queue on the<br>receiving end | Cannot exceed the total size of the front-end BUF queue,<br>otherwise the front-end may be stuck |
| timeout | Timeout period on the receiving<br>end to obtain user queue data | Unit: ms |
| onfa_cnt | Count of sent frame | Total number of sent frames of node |
| lcnt | Count of sent frame loss | Frame loss caused by inability to process or processing failure,<br>frame rate control is not within this range |
| frate | Sent frame rate | Statistics in s, setting is not supported |
| fbase | Sent frame loss ratio | Send fbase frames, send the first frame, and lose the rest |
| wcnt | Actual number of frames in the sending user queue | User sets the user queue size through depth, and the frames<br>that are not released after the user obtains them are also<br>included |
| depth | The depth of user queue on the<br>sending end | Cannot exceed the total size of the front-end BUF queue,<br>otherwise the front-end may be stuck |
| timeout | Timeout period of the sending<br>end to obtain user queue data | Unit: ms |
| itime | Time taken to receive 1 frame | Unit: us |

| Project | Description | Remarks |
| --- | --- | --- |
| otime | Time taken to send 1 frame | Unit: us |
| state | Current node status | bit0: 1-Indicates the object is registered, 0-Resource is released<br>bit1: 1-Indicates the object is accessible, 0-Inaccessible<br>bit2: 1-Indicates the object is deleted, 0-Not deleted<br>bit3: 1-Indicates the object is not allowed to be deleted, 0-<br>Deletion allowed<br>bit4: 1-Indicates a private object, 0-Public object<br>bit5: 1-Indicates the ID is retained upon deletion, 0-Not<br>retained<br>bit6: 1-Indicates support for monitoring, 0-Not monitorable<br>bit7-9: Reserved<br>bit10: 1-In deletion process...<br>bit11: 1-Refreshing BUF...<br>bit12: 1-In operation...<br>bit13: 1-Has a binding with a preceding stage...<br>bit14: 1-Automatically operates upon binding with a preceding<br>stage...<br>bit15-31: Reserved |
| next node | Next NODE ID | Supports 1 NODE binding multiple NODEs |
| mpi node<br>frame control | Frame rate control table of the<br>node | The following is information related to NODE frame rate control |
| id | Globally unique ID | Used to identify MPI node, equivalent to HANDLE |
| name | The name of the device used to<br>create the NODE | Multiple NODEs may have the same name |
| table | Fame loss table | Size equals frame rate; n retains n frames, 0 drops frames (Chinese source). English instead says 0 retains, 1 drops; verify the SDK. |
| mpi dev list | ROCKIT Device List | Below are the device information |
| id | Device ID | Globally unique identifier |
| name | Device Name | Used for easy differentiation of devices |
| handle | Device Handle | Memory address of the device structure |
| ref | Reference Count | Incremented by 1 for each open handle reference |
| node | NODE on Device | Lists all NODEs on the device by their IDs |

## 9. VENC

Encoding parameters, can be obtained by the following command:

```text
cat /proc/vcodec/enc/venc_info
```


### `venc thread status`

| Parameter | Description |
| --- | --- |
| last_runing (EN: last_running) | The time when the thread most recent wake-up |
| run_cnt | Number of times the thread has run |
| que_cnt | Number of times the thread has been triggered |

### `venc chn running status`

| Parameter | Description |
| --- | --- |
| ID | Encoding channel ID |
| runing (EN: running) | Whether the channel is active |
| combo_run | Whether JPEG combined encoding in a channel is active |
| cfg_gap | Time consumption of registers of a channel configuration(in ms) |
| strm_cnt | Number of cached streams in a channel |
| strm_out | Number of streams sent to the application in a channel |
| gap_time | Interval between the last two encoding start times of a channel (in ms) |
| cb_gap_time | Time interval between two JPEG combined encoding operations |
| last_cb_start | The most recent start time of the JPEG combined encoding. |
| last_cb_end | The most recent end time of the JPEG combined encoding. |
| queue_size | Buffer queue size in the channel |
| pkt_total_cnt | The total number of packets in a channel |
| pkt_user_get | Number of packets acquired by the application in the channel |
| pkt_user_put | Number of packets released by the application in the channel |
| seq_user_get | Seq of the current stream acquired by the application |
| seq_user_put | Seq of the current stream released by the application |
| seq_encoded | Seq of the current encoded content in the channel |
| seq_encoding | Seq of the content currently being encoded in the channel |

### `venc chn attr 1`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| Width | The width of encoding channel |
| Height | The height of encoding channel |
| Type | The type of encoding channel type |
| ByFrame | Get stream ID by frame<br>n: get by package(currently not supported)<br>y: get by frame |
| Sequence | Sequence ID<br>It is the frame sequence ID when it is acquired by frame, and it is the package sequence ID when it is<br>acquired by package |
| GOPMode | GOP mode |
| Prio | The value of the channel priority |
| MaxWidth | The max width of encoding channel |
| MaxHeight | The max height of encoding channel |
| Online | Wrapping enable switch |
| RefShare | Whether the reconstruction/reference is shared |

### `venc chn attr 2`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| Vestr | Whether to enable encoding |
| SrcFr | The source frame rate of VENC frame rate control, that is, the input frame rate |
| TarFr | Target frame rate of VENC frame rate control |
| Timeref | VENC start time |
| PixFmt | The format of encoding the current frame |
| RealFps | VENC real frame rate |
| Rotation | Whether VENC enables rotation |
| Mirror | Whether VENC enables mirroring |

### `ring buf status`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| w_pos | Write position of code stream buf |
| r_pos | Read position of code stream buf |
| used_len | Space used by stream buf |
| total_len | The total space size of code stream buf |
| min_size | Minimum free space required for allocating one frame (Chinese source; English says latest) |
| l_w_pos | Last updated write position |
| l_r_pos | Last updated read position |
| max_use_len | The maximum space used by code stream buf |

### `hw status`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| hw_run | The current channel is running |
| enc_status | enc status:<br>0: ENC_STATUS_CFG_IN,<br>1: ENC_STATUS_CFG_DONE,<br>2: ENC_STATUS_START_IN,<br>3: ENC_STATUS_START_DONE,<br>4: ENC_STATUS_RUN_TASK_IN,<br>5: ENC_STATUS_RUN_TASK_DONE,<br>6: ENC_STATUS_INT_IN,<br>7: ENC_STATUS_INT_DONE,<br>8: ENC_STATUS_SLICE_INFO_IN,<br>9: ENC_STATUS_SLICE_INFO_DONE |
| pkt_fail_cnt | Times of enc request packet pool failures |
| ring_fail_cnt | Times of stream buf allocation failures |
| cfg_fail_cnt | Times of generating hardware configuration information failures |
| start_fail_cnt | Times of enabling hardware encoding failures |
| pkt_full_cnt | The number of frame drops caused by PACKET exceeding 100. |

### `hw param`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| qp_dlt_row_i | The maximum amplitude value of row-level QP adjustment for I-frames |
| qp_dlt_row | The maximum amplitude value of row-level QP adjustment for P-frames |
| qbias_en | Bias adjustment switch |
| qbias_i | Bias value of I block |
| qbias_p | Bias value of P block |
| flt_str_i | Filter strength of I-frames |
| flt_str_p | Filter strength of P-frames |
| thrd_i | Block-level madi threshold table for I-frames |
| thrd_p | Block-level madi threshold table for P-frames |
| step_i | Table used for AQ lookup based on thrd_i for I-frames |
| step_p | Table used for AQ lookup based on thrd_p for P-frames |
| qbias_arr | Bias configuration |
| aq_rnge_arr | Configuration of AQ constraint range |

### `fine tunning param`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| scene_mode | Scene mode |
| md_swth_en | Motion static switch |
| deblur_str | Strength of deblur |
| atr_str | Strength of anti-ring |
| atl_str | Strength of anti-line |
| lambda_idx | Lambda index for P-frames |
| lambda_i_idx | Lambda index for I-frames |
| atf_str | Strength of anti-flicker |
| static_frm_num | Threshold value of frames to determine block stillness |
| madp16_th | Threshold of madp16 for block stillness |
| skip16_wgt | Enhancement effect of skip16 bias |
| skip32_wgt | Enhancement effect of skip32 bias |
| lgt_chg_lvl | Optimization parameter level for scenes with lighting changes |

### `venc roi attr`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| roi | Index of ROI |
| x | Starting coordinate in the horizontal direction |
| y | Starting coordinate in the vertical direction |
| w | Width of ROI |
| h | Height of ROI |
| quality | QP value of ROI macroblocks |
| intra | Whether ROI macroblocks are forced to intra coding |
| abs_qp | Absolute QP enable switch |

### `hw session infos`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| device | Device name |
| hw_running | Hardware running status |
| online | Wrapping enable switch |
| wrap_ovfl | Wrapping overflow count |
| bs_ovfl | Stream buffer overflow count |
| wrap_src_mis | Wrapping source mismatch count |
| enc_err_cnt | Encoder error count |
| enc_err_irq | Interrupt register value when the encoder error |
| enc_err_st | Status register value when the encoder error |

### `bitstream buffer addr`

| Parameters | Description |
| --- | --- |
| top | Top of the stream buffer stack |
| bot | Bottom of the stream buffer stack |
| wr | Write address of the stream buffer |
| rd | Read address of the stream buffer |

### `h264e chn attr`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| Width | Width in pixels |
| Height | Height in pixels |
| Profile | The profile of encoding channel<br>Base: baseline<br>Mp:main profile<br>Hp:high profile |

### `Syntax INFO1`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| Slcsplten | Whether to use slice split |
| SplitMode | slice split mode<br>1: split by byte<br>2: split by macroblock |
| Slcsize | The size of the slice, when the split_mode is different, the meanings of slice_size is different |
| IntraRefresh | Whether to enable P frame to refresh I macroblocks |
| RefreshMode | The mode of refreshing I macroblocks<br>row: Refresh by row<br>column: Refresh by column |
| RefreshNum | Refresh the number of rows or columns of I macroblocks in each frame |

### `Syntax INFO2`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| Profile | The profile type of encoding channel<br>Base: Baseline<br>MP: Main profile<br>HP: High profile |
| Cabac | Entropy encoding mode, cavlc or cabac |
| Trans8 | Transformation mode used<br>Only trans4x4 mode is enabled by default<br>Y: enable trans8x8 mode |
| ScalingMode | Scaling list mode |
| Poc | The value of the syntax element pic_order_cnt_type |
| Alpha | The value of the syntax element slice_alpha_c0_offset_div2 |
| Beta | The value of the syntax element slice_beta_offset_div2 |

### `h265e chn attr`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| Width | Width in pixels |
| Height | Height in pixels |
| Profile | The profile of encoding channel<br>main: main profile |

### `Syntax INFO1`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| Slcsplten | Whether to use slice split |
| SplitMode | slice split mode<br>1: split by byte<br>2: split by macroblock |
| Slcsize | The size of the slice, when the split_mode is different, the meanings of slice_size is different |
| IntraRefresh | Whether to enable P frame to refresh I macroblocks |
| RefreshMode | The mode of refreshing I macroblocks<br>row: refresh by row<br>column: refresh by column |
| RefreshNum | Refresh the number of rows or columns of I macroblocks in each frame |

### `Syntax INFO2`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| Dblken | Negated value of syntax element slice_deblocking_filter_disabled_flag |
| Tc | The value of syntax element slice_tc_offset_div2 |
| Beta | The value of the syntax element slice_beta_offset_div2 |
| Saoluma | The value of the syntax element slice_sao_luma_flag |
| Saochroma | The value of the syntax element slice_sao_chroma_flag |
| IntraSmoothing | The value of the syntax element strong_intra_smoothing_enabled_flag |
| ScalingMode | Scaling list mode |
| TmvpEn | TMVP enable switch |

### `Trans Info`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| CbQpoffset | The value of syntax element pps_cb_qp_offset |
| CrQpoffset | The value of syntax element pps_cr_qp_offset |

### `jpege chn attr`

| Parameters | Description |
| --- | --- |
| ID | Encoding channel ID |
| width | Image width in Pixel |
| height | Image height in Pixel |
| quant | Channel quantization qp |
| qfactor | The qfactor used by channel |
| qfmax | The maximum value of qfactor used by channel |
| qfmin | The minimum value of qfactor used by channel |

### `RC base param1`

| Parameter | Description |
| --- | --- |
| ChnId | Encoding channel ID |
| Gop | Encoding Group of Pictures (GOP) |
| StatTm | Rate control statistical time in seconds |
| ViFr | VI (Video Input) frame rate |
| TrgFr | Encoding target frame rate |
| RcMode | Rate control mode (cbr/fixqp/vbr/avbr/smart) |
| Br(kbps) | Bitrate in kbps |
| IQp | QP of I-frames, valid in FixQp mode |
| PQp | QP of P-frames, valid in FixQp mode |

### `RC base param2`

| Parameter | Description |
| --- | --- |
| ChnId | Encoding channel ID |
| MinQp | Minimum QP for P-frames |
| MaxQp | Maximum QP for P-frames |
| MinIQp | Minimum QP for I-frames |
| MaxIQp | Maximum QP for I-frames |
| EnableIdr | IDR enable switch<br>Y: Enabled<br>N: Disabled |

### `RC run comm param1`

| Parameter | Description |
| --- | --- |
| ChnId | Encoding channel ID |
| bLost | Whether to drop frames when the instantaneous bitrate exceeds the set threshold |
| LostThr | The threshold of frame dropping |
| LostFrmstr | Statistics of the number of frame dropping |
| EncGap | Gap between encoding frames |

### `RC run comm param2`

| Parameter | Description |
| --- | --- |
| ChnId | Encoding channel ID |
| SprFrmMod | Super-sized frame processing mode |
| SprIFrm | Threshold of super-sized I-frames |
| SprPFrm | Threshold of super-sized P-frames |
| RCPriority | Rate control priority<br>bitrate: Target bitrate priority<br>framebits: Super-sized frame threshold priority |

### `RC gop mode attr`

| Parameter | Description |
| --- | --- |
| ChnId | Encoding channel ID |
| GopMode | Type of gop_mode |
| IpQpDelta | The Qp Delta value of IP frame. For SmartP mode, it displays the Qp Delta value of Bg frames and P-<br>frames.<br>Range: [-10, 30] |
| BgInterval | Interval of special P-frames<br>Range: Less than or equal to Gop |
| ViQpDelta | The Qp Delta value of virtual I-frames and P-frames<br>Range: [-10, 30] |

### `RC run vbr common param`

| Parameter | Description |
| --- | --- |
| ChnId | Encoding channel ID |
| ChgPs | The ratio of the bitrate at the start of VBR QP adjustment to the maximum bitrate.<br>This value is calculated by bitrate/max_bitrate * 100 |
| MinIprop | The minimum ratio of IP frame bitrate. Range: [1,100].<br>Default value: 1 |
| MaxIprop | The maximum ratio of IP frame bitrate. Range: [MinIprop, 100].<br>Default value: 100 |
| MaxQp | The maximum QP value of P frames. Range: [0, 51].<br>Default value: 51 |
| MinQp | The minimum QP value of P frames. Range: [0, MaxQp].<br>Default value: 24 |
| MaxIQp | The maximum QP value of I frames. Range: [0, 51].<br>Default value: 51 |
| MinIQp | The minimum QP value of I frames. Range: [0, MaxIQp].<br>Default value: 24 |
| FrmMaxQp | Maximum QP for P-frames at the frame level |
| FrmMinQp | Minimum QP for P-frames at the frame level |
| FrmMaxIQp | Maximum QP for I-frames at the frame level |
| FrmMinIQp | Minimum QP for I-frames at the frame level |
| MaxReEncTimes | Number of re-encoding times per frame. 0 means no re-encoding. Range: [0, 3]<br>Default value: 1 |

### `RC run cbr param`

| Parameter | Description |
| --- | --- |
| ChnId | Encoding channel ID |
| MinIprop | The minimum ratio of IP frames. Range: [1, 100] |
| MaxIprop | The maximum ratio of IP frames. Range: [MinIprop, 100] |
| MaxQp | The maximum QP of P-frames, used to clamp quality. Range: [0, 51] |
| MinQp | The minimum QP of P-frames, used to clamp the fluctuation of bitrate. Range: [0, MaxQp] |
| MaxIQp | The maximum QP of I-frames, used to control the minimum number of bits for I-frames. Range: [0,<br>51] |
| MinIQp | The minimum QP of I-frames, used to control the maximum number of bits for I-frames. Range: [0,<br>MaxIQp] |
| FrmMaxQp | Maximum QP for P-frames at the frame level |
| FrmMinQp | Minimum QP for P-frames at the frame level |
| FrmMaxIQp | Maximum QP for I-frames at the frame level |
| FrmMinIQp | Minimum QP for I-frames at the frame level |
| MaxReEncTimes | Number of re-encoding times per frame. 0 means no re-encoding. Range: [0, 3] |

### `RC run avbr param`

| Parameter | Description |
| --- | --- |
| ChnId | Encoding channel ID |
| MaxStillQP | Maximum still QP |
| MotionSensi | Motion sensitivity |
| MinPercent | Minimum still percentage |

### `RC HierarchicalQp INFO`

| Parameter | Description |
| --- | --- |
| ChnId | Encoding channel ID |
| bEnable | Whether layered QP is enabled |
| FrameNum[0] | Number of frames of QP in layer 1 |
| FrameNum[1] | Number of frames of QP in layer 2 |
| FrameNum[2] | Number of frames of QP in layer 3 |
| FrameNum[3] | Number of frames of QP in layer 4 |
| QpDelta[0] | QpDelta of frames in layer 1 |
| QpDelta[1] | QpDelta of frames in layer 2 |
| QpDelta[2] | QpDelta of frames in layer 3 |
| QpDelta[3] | QpDelta of frames in layer 4 |

RC debreath_effect info

| Parameter | Description |
| --- | --- |
| ChnId | Encoding channel ID |
| bEnable | Whether to enable breath removal |
| Strength0 | Breath removal strength 0 |
| DeBrthEfctCnt | Times of breath removal which is applied to the image |

RC run CBR/VBR info1

| Parameter | Description |
| --- | --- |
| ChnId | Encoding channel ID |
| InsBr(kbps) | Instantaneous bitrate in kbps |
| InsFr | Instantaneous frame rate |
| WatL | Bitrate threshold |
| CfgBt(kb) | Target size of the previous frame in kb |
| RealBt(kb) | Actual size of the previous frame in kb |
| IPRatio | The ratio between Average size of I-frames and P-frames |
| StartQp | Starting QP |
| MinQp | Minimum QP |
| MaxQp | Maximum QP |

### `mpp_packet pool`

| Parameter | Description |
| --- | --- |
| unused_cnt | Number of unused packets |
| used_cnt | Number of packets in use |
| total_cnt | Total number of packets |
| max_cnt | Maximum number of packets |

### `mpp_buffer pool`

| Parameter | Description |
| --- | --- |
| unused_cnt | Number of unused buffer |
| used_cnt | Number of buffer in use |
| total_cnt | Total number of buffer |
| max_cnt | Maximum number of buffer |

### `mpp_frame pool`

| Parameter | Description |
| --- | --- |
| unused_cnt | Number of unused frames |
| used_cnt | Number of frames in use |
| total_cnt | Total number of frames |
| max_cnt | Maximum number of frames |

## 10. Mapping relationship between venc_info and rockit API

venc_info is the encoder configuration parameters printed by the kernel. currently only RV1103B/RV1106B and RV1103/RV1106 are supported.This chapter primarily focuses on key configurations, emphasizing subjective effects and objective compression- related settings.

| venc_info | rockit api | rockit api member | note |
| --- | --- | --- | --- |
| qbias_en<br>qbias_i<br>qbias_p | RK_MPI_VENC_SetH264Qbias<br>RK_MPI_VENC_SetH265Qbias | bEnable<br>u32QbiasI<br>u32QbiasP | RV1103/RV1106<br>supported,<br>RV1103B/RV1106B not<br>supported |
| qbias_en<br>qbias_arr[18] | RK_MPI_VENC_SetH264Qbias2<br>RK_MPI_VENC_SetH265Qbias2 | bEnable<br>u32Qbias2[18] | RV1103/RV1106 not<br>supported,<br>RV1103B/RV1106B<br>upgrade version |
| StartQp<br>MaxQp<br>MinQp<br>MaxIQp<br>MinIQp<br>IpQpDelta<br>MaxReEncTimes<br>FrmMaxQp<br>FrmMinQp<br>FrmMaxIQp<br>FrmMinIQp<br>md_switch_qp | RK_MPI_VENC_SetRcParam | s32FirstFrameStartQp<br>u32MaxQp<br>u32MinQp<br>u32MaxIQp<br>u32MinIQp<br>s32DeltIpQp<br>s32MaxReEncodeTimes<br>u32FrmMaxQp<br>u32FrmMinQp<br>u32FrmMaxIQp<br>u32FrmMinIQp<br>u32MotionStaticSwitchFrmQp | Inial QP,Block-level<br>QP,Line-level QP<br>configuration,Frame-<br>level QP, Number of re-<br>encode |
| thrd_i[16]<br>thrd_p[16]<br>step_i[16]<br>step_p[16]<br>qp_dlt_row_i<br>qp_dlt_row | RK_MPI_VENC_SetRcParam2 | u32ThrdI[16]<br>u32ThrdP[16]<br>s32AqStepI[16]<br>s32AqStepP[16]<br>u32RowQpDelta<br>u32RowIQpDelta | AQ parameter, Line-level<br>QP adjustment |
| aq_rnge_arr[10] | RK_MPI_VENC_SetRcParam3 | u32AqRange[10] | RV1103/RV1106 not<br>supported,<br>RV1103B/RV1106B<br>upgrade version |
| scene_mode | RK_MPI_VENC_SetSceneMode | enSceneMode | Scene mode |
| flt_str_i<br>flt_str_p | RK_MPI_VENC_SetFilter | u32StrengthI<br>u32StrengthP | Filter strength |
| md_swth_en | RK_MPI_VENC_EnableMotionStaticSwitch | bEnable | Enable very-low-bitrate static-scene operation (motion/static switch) |
| deblur_str | RK_MPI_VENC_SetMotionDeblurStrength | u32Strength | Remove trailing / motion blur |
| atr_str | RK_MPI_VENC_SetAntiRing | u32AntiRing | Strength of anti-ring |
| atl_str | RK_MPI_VENC_SetAntiLine | u32AntiLine | Strength of anti-line |
| atf_str | RK_MPI_VENC_SetAntiFlick | u32AntiFlick | Remove noise jitter/crawling (anti-flicker) |
| lambda_i_idx<br>lambda_idx | RK_MPI_VENC_SetLambda | u32LambdaI<br>u32Lambda | Lambda configuration |
| static_frm_num<br>madp16_th<br>skip16_wgt<br>skip32_wgt | RK_MPI_VENC_SetStaticWeight | u32FrmNum<br>u32Madp16Th<br>u32Skip16Weight<br>u32Skip32Weight | Static scene skip<br>tendency |

| venc_info | rockit api | rockit api member | note |
| --- | --- | --- | --- |
| lgt_chg_lvl | RK_MPI_VENC_SetLightChange | u32Level | RV1103/RV1106 not<br>supported,<br>RV1103B/RV1106B<br>supported |
| DblkEn<br>alpha<br>beta | RK_MPI_VENC_SetH264Dblk | disable_deblocking_filter_idc<br>slice_alpha_c0_offset_div2<br>slice_beta_offset_div2 | H.264 deblocking filter |
| DblkEn<br>Tc<br>Beta | RK_MPI_VENC_SetH265Dblk | slice_deblocking_filter_disabled_flag<br>slice_tc_offset_div2<br>slice_beta_offset_div2 | H.265 deblocking filter |
| Saoluma<br>Saochroma | RK_MPI_VENC_SetH265Sao | slice_sao_luma_flag<br>slice_sao_chroma_flag | H.265 SAO parameters |
| IntraSmoothing | RK_MPI_VENC_SetH265PredUnit | strong_intra_smoothing_enabled_flag | H.265 intra-frame<br>strong filtering |
| TmvpEn | RK_MPI_VENC_EnableTmvp | bEnable | H.265 TMVP switch |
| StatTm<br>GopMode<br>Gop | RK_MPI_VENC_SetChnAttr | u32StatTime<br>enGopMode<br>u32Gop | Rate control statistical<br>time, GOP mode, GOP<br>length |
| ScalingMode<br>CbQpOffset<br>CrQpOffset | RK_MPI_VENC_SetH265Trans | bScalingListEnabled<br>cb_qp_offset<br>cr_qp_offset | H.265 quantization<br>parameters |
| trans8<br>ScalingMode<br>CbQpOffset<br>CrQpOffset | RK_MPI_VENC_SetH264Trans | u32TransMode<br>bScalingListValid<br>chroma_qp_index_offset | H.264's CbQpOffset and<br>CrQpOffset reuse<br>chroma_qp_index_offset |
| RcMode<br>MinBr(kbps)<br>MaxBr(kbps) | RK_MPI_VENC_SetChnAttr<br>RK_MPI_VENC_EnableSvc | enRcMode<br>u32MinBitRate<br>u32MaxBitRate | Set enRcMode to VBR,<br>configure<br>u32MinBitRate and<br>u32MaxBitRate, enable<br>SVC to trigger smart<br>mode |
| bEnable<br>Strength0 | RK_MPI_VENC_SetDeBreathEffect | bEnable<br>s32Strength0 | debreath parameters |
| cu_dqp | RK_MPI_VENC_SetH265CuDqp | u32CuDqp | H.265<br>diff_cu_qp_delta_depth |

## 11. IVS

Intelligent video surveillance parameters can be accessed via the following command:

```text
cat /proc/vcodec/ivs/ivs_info
```


### `ivs channel attr`

| Parameter | Description |
| --- | --- |
| ID | Intelligent video surveillance channel ID |
| width | Channel width |
| height | Channel height |
| smear_en | smear enable switch |
| weightp_en | weightp enbale switch |
| max_width | Maximum channel width |
| max_height | Maximum channel height |
| md_en | Motion detection enable switch |
| od_en | Occlusion detection enable switch |

### `ivs common cfg`

| Parameter | Description |
| --- | --- |
| ID | Intelligent video surveillance channel ID |
| fmt | Image format type |
| frm_acc_intval | Frame accumulation interval |
| frm_acc_gop | Frame accumulation GOP |

### `ivs md cfg`

| Parameter | Description |
| --- | --- |
| ID | Intelligent video surveillance channel ID |
| switch_sad | Motion-detection SAD mode: 0 - SAD before mean compensation; 1 - mean-compensated SAD; 2 - minimum of the two; 3 - maximum of the two |
| thres_sad | 4x4 block-level motion SAD threshold |
| thres_move | 8x8 block motion judge threshold |
| night_mode | Night mode enable switch |
| filter_sw | Flying catkin filter enable switch |
| thres_dust_mv | The number threshold of flying catkins blocks around the current 8x8 block of the eight surrounding<br>8x8 blocks |
| thres_dust_blk | The number threshold of flying catkins blocks within the current 8x8 block consisting of four 4x4<br>blocks |
| thres_dust_chng | Threshold for the luminance mean difference between the current 8x8 block and the corresponding<br>block at the previous frame position |

### `ivs od cfg`

| Parameter | Description |
| --- | --- |
| ID | Intelligent video surveillance channel ID |
| thres_complex | Complex threshold in occlusion detection |
| thres_complex_cnt | Complex threshold count in occlusion detection |
| thres_sad | SAD threshold |

## 12. VRGN

The RGN manager of the media framework. Use the following command to see the current RGN information:

```text
cat /dev/mpi/vrgn
```



| Item | Description | Remarks |
| --- | --- | --- |
| module | Module information | Module name |
| version | Version information | Repository name: commit: version number |
| build | Build information | Compiler - compilation date |
| rgn list | RGN list separator | The following is the RGN-related information |
| handle | RGN handle | Used to identify RGN |
| type | RGN type | Used to identify RGN type: OVERLAY, COVER, MOSAIC |
| width | RGN area width |  |
| heigth (EN: height) | RGN area height |  |
| format | RGN area format | OVERLAY and COVER types are valid, "-1" indicates that the input type<br>is not supported |
| buf_id | Currently used buffer ID for<br>RGN | Valid for OVERLAY type, "-1" for other types |
| refcnt | MPI buffer usage count |  |
| channel_num | Number of RGN attaches | Number of RGN ATTACH channels (modules) |
| node_rgn list | node_rgn list delimiter | The following is the NODE_RGN-related information |
| id | Unique ID for the node | Used to identify MPI node |
| name | Device name for creating the<br>node | Multiple nodes may be with the same name |
| h | RGN handle | Used to identify the RGN, similar to HANDLE |
| x | RGN area x coordinate | X offset of the starting position of RGN |
| y | RGN area y coordinate | Y offset of the starting position of RGN |
| h x y | RGN area position<br>information | Group of h, x, and y values that identify the RGN position. It is 8<br>groups in total. |

## 13. VRGA

The RGA driver manager in Rockit. You can use the following command to check the current status of the RGA NODE:

```text
cat /dev/mpi/vrga
```



| Item | Description | Remarks |
| --- | --- | --- |
| id | Globally unique ID | Used to identify the MPI node, equivalent to the HANDLE |
| name | Device name for creating the<br>NODE | Multiple NODEs may have the same name |
| ctx | Control handle of the rga<br>node | Virtual address. It can be compared with the LOG to confirm which NODE<br>has a problem |
| nid | Custom ID in Rockit | Custom ID, which facilitates Rockit to manage the NODE |
| ref | Usage count | Add 1 before use, subtract 1 after use. When it is 0, release it |
| bypass | Bypass flag | 1 indicates that the RGA node does not perform any processing and<br>directly passes through the data |
| csnt | Count of CROP parameter<br>settings | The position of entering the queue of CROP parameter queue |
| cgnt | Count of obtaining CROP<br>parameters | The position of exiting the queue of CROP parameter queue |
| ssnt | Count of SCALL parameter<br>settings | The position of entering the queue of SCALL parameter queue |
| sgnt | Count of obtaining SCALL<br>parameters | The position of exiting the queue of SCALL parameter queue |
| type | Type of RGA task | 0: General, 1: OSD |
| swidth | Output width | The actual width of the output image |
| sheight | Output height | The actual height of the output image |
| svwidth | Output memory width | The memory width occupied by the output image, used for memory<br>alignment. |
| svheight | Output memory height | The memory height occupied by the output image, used for memory<br>alignment. |
| sfmt | Output image format | See in detail: rk_comm_video.h |
| cenalbe | Cropping enable flag | 1: Indicates that cropping is performed on the input source |
| coordinate | Cropping parameters as a<br>percentage | 1: Indicates a percentage. 0: Absolute coordinates. |
| cxpos | X coordinate of the cropping<br>area | When coordinate = 1: Indicates a percentage. When coordinate = 0:<br>Absolute coordinates. |
| cypos | Y coordinate of the cropping<br>area | When coordinate = 1: Indicates a percentage. When coordinate = 0:<br>Absolute coordinates. |
| cwidth | Width of the cropping area | When coordinate = 1: Indicates a percentage. When coordinate = 0:<br>Absolute width. |
| cheight | Height of the cropping area | When coordinate = 1: Indicates a percentage. When coordinate = 0:<br>Absolute height. |
| job | Jobs under the current NODE | Lists the unprocessed jobs under the current NODE in the form of IDs |

## Source discrepancies and verification notes

- Both sources state V2.28.0 and 2025-04-27. Chinese adds `memtype` and `nkid`; both fields are included in every language. Page count alone does not establish freshness.
- VSYS `table`: Chinese says the size is the frame rate, n retains n frames and 0 drops frames. English says 0 retains and 1 drops. The body uses the Chinese baseline; this contradiction must be checked against the SDK.
- `isp_max_h` is defined as input height, but both sources say “width after cropping”. Check the SDK implementation and the original diagnostic rather than silently changing the dimension.
- The RV1126B kernel module list spells `VALLC`; `cenalbe`, `SCALL` and `RK_MPI_SYS_RelasePhyMemory` also retain source spellings. Chinese `last_runing`, `runing` and `heigth` correspond to English `last_running`, `running` and `height`; both spellings are shown at the relevant fields.
- Both API tables map `qp_dlt_row_i` to `u32RowQpDelta` and `qp_dlt_row` to `u32RowIQpDelta`. Their apparent I/P meaning may be inconsistent; the mappings have not been swapped.
- Chinese has separate `mpp_packet pool` and `mpp_buffer pool` tables; English calls both `mpp_buffer pool`. Chinese captions are used here; packet, buffer and frame tables are all retained.
- English adds “8 groups in total” for VRGN `h x y`; this is retained in every language. English calls `wcnt` a frame rate while Chinese specifies a frame count; Chinese is used. For `min_size`, Chinese specifies minimum free space for allocating one frame while English says latest; the Chinese meaning is used.
- English Warp is interpreted as wrapping according to Chinese; identifiers remain unchanged. The Chinese details on ROI macroblocks, mean-compensated SAD, very-low-bitrate static-scene operation, trailing removal and noise jitter/crawling are also retained.

{% endraw %}

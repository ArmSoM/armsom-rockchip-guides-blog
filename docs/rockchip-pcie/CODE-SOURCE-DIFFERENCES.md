# PCIe V6.29.0 中英文代码差异记录

本记录逐块比较校正软换行后的原稿代码；不把中文代码强行覆盖到英文。中文与英文各 94 个合并后代码块。EN/RU/DE 的全部代码逐字一致。四语代码相对各自原稿仅改变空白；去除全部空白后字符序列完全相同（脚本断言通过）。

中文 §9 为故障注入，§10 为 AER；英文顺序相反。以下先将此两组按英文顺序对齐；差异包含注释语言、说明文字、空白和原稿示例差别，不等同于技术错误。

## 对齐块 2

```diff
--- 中文原稿
+++ 英文原稿
@@ -10,5 +10,6 @@
         vin-supply = <&vcc12v_dcin>;
     };
-}；
+};
+
 &combphy0_ps {
     status = "okay";
@@ -47,5 +48,4 @@
     status = "okay";
 };
-
 &pcie3x2 {
     reset-gpios = <&gpio4 RK_PB0 GPIO_ACTIVE_HIGH>;
```

## 对齐块 3

```diff
--- 中文原稿
+++ 英文原稿
@@ -10,5 +10,5 @@
         vin-supply = <&vcc12v_dcin>;
     };
-}；
+};
 
 &combphy0_ps {
```

## 对齐块 4

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,3 +1,3 @@
-# 开启PCIe IOMMU
+# Enable PCIe IOMMU
 --- a/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
 +++ b/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
@@ -16,5 +16,5 @@
 };
 
-# 需要开启IOMMU的控制器按需引⽤iommu-map, 请注意数值匹配msi-map
+# Controllers requiring IOMMU should reference iommu-map as needed, ensuring numerical matching with msi-map
 --- a/arch/arm64/boot/dts/rockchip/rk3588.dtsi
 +++ b/arch/arm64/boot/dts/rockchip/rk3588.dtsi
```

## 对齐块 7

```diff
--- 中文原稿
+++ 英文原稿
@@ -6,6 +6,6 @@
 +     enable-active-high;
 +    /*
-+     * wifi_reg_on 是在vbat、vddio稳定后才使能，在reset-gpios前拉⾼，所以
-+     * 放到PCIe的电源节点中才满⾜模块时序，引⽤wifi_poweren_gpio。
++     * wifi_reg_on is enabled after vbat and vddio are stable, pulled high before reset-gpios, so
++     * it is placed in the PCIe power node to meet the module timing, referring to wifi_poweren_gpio.
 +     */
 +     pinctrl-0 = <&wifi_poweren_gpio>;
@@ -20,5 +20,5 @@
         pinctrl-0 = <&wifi_host_wake_irq>;
         WIFI,host_wake_irq = <&gpio0 RK_PA0 GPIO_ACTIVE_HIGH>;
-+       /* 注意：这⾥也需要配置wifi_reg_on管脚，给WiFi驱动来控制 */
++       /* Note: The wifi_reg_on pin also needs to be configured here for the WiFi driver to control */
 +       WIFI,poweren_gpio = <&gpio0 RK_PC7 GPIO_ACTIVE_HIGH>;
         status = "okay";
@@ -26,9 +26,9 @@
 +
 +&sata0 {
-+    status = "disabled" /* sata0与pcie2x1l2复⽤了combphy0_ps, 需确保禁⽤ */
++    status = "disabled" /* sata0 and pcie2x1l2 share combphy0_ps, ensure it is disabled */
 +}
 +
 +&combphy0_ps {
-+    status = "okay"; /* 确保phy开启 */
++    status = "okay"; /* Ensure phy is enabled */
 +};
 +
@@ -36,5 +36,5 @@
 +    reset-gpios = <&gpio3 RK_PD1 GPIO_ACTIVE_HIGH>;
 +    rockchip,skip-scan-in-resume;
-+    rockchip,perst-inactive-ms = <500>; /* 参考Wi-Fi模组⼿册，查询所需#PERST复位时间 */
++    rockchip,perst-inactive-ms = <500>; /* Refer to the Wi-Fi module manual for the required #PERST reset time */
 +    vpcie3v3-supply = <&vcc3v3_pcie20_wifi>;
 +    status = "okay";
@@ -44,5 +44,5 @@
      wireless-wlan {
          wifi_poweren_gpio: wifi-poweren-gpio {
-+            //PCIE REG ON： 务必配置成上拉
++            //PCIE REG ON: Be sure to configure it as pull-up
 +            rockchip,pins = <0 RK_PC7 RK_FUNC_GPIO &pcfg_pull_up>;
          };
```

## 对齐块 10

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,4 +1,4 @@
 commit 4de1a0c19e0f9804ba22e7f5e544fea317913957
-Author: Shawn Lin <shawn.lin@rock-chips.com>
+Author: Shawn Lin <shawn.lin@rockchip.com>
 Date:   Tue Mar 12 16:38:46 2024 +0800
 
```

## 对齐块 20

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,3 +1,3 @@
-#以RK3588-EVB Linux平台为例， 添加pcie_pme=nomsi
+#Use RK3588-EVB Linux for example,  add pcie_pme=nomsi
 --- a/arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi
 +++ b/arch/arm64/boot/dts/rockchip/rk3588-linux.dtsi
```

## 对齐块 21

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,5 +1,5 @@
-#系统中查看cmdline是否配置了pcie_pme=nomsi
+# check the cmdline for sure we set pcie_pme=nomsi
 cat /proc/cmdline
-#系统中查看aer中断申请
+# check the irq
 root@debian:/userdata# cat /proc/interrupts | grep aerdrv
  60:      0      0      0      0      0      0     0     0     INTx   0 Edge      PCIe PME, aerdrv, PCIe bwctrl
```

## 对齐块 22

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,3 +1,3 @@
-使⽤lspci获取所需测试的PCIe设备地址，以01：00.0 这个⽹卡为例
+# Use lspci to obtain the PCIe device address. Example with network card 01:00.0:
 00:00.0 PCI bridge: Rockchip Electronics Co., Ltd Device 3576 (rev 01)
 01:00.0 Network controller: Broadcom Inc. and subsidiaries Device 449d (rev 02)
```

## 对齐块 23

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,11 +1,11 @@
-#脚本名以aer.txt为例，内容如下：
+# Example script name: aer.txt, content:
 
 AER
-BUS 1 DEV 0 FN 0        //BUS DEV FN分别对应待测设备的BDF
-COR_STATUS BAD_TLP      //测试可恢复错误， 类型bad TLP
+BUS 1 DEV 0 FN 0        // BUS, DEV, FN correspond to the BDF of the DUT (Device Under Test)
+COR_STATUS BAD_TLP      // Test correctable error: bad TLP
 HEADER_LOG 0 1 2 3
 
 AER
-BUS 1 DEV 0 FN 0        //BUS DEV FN分别对应待测设备的BDF
-UNCOR_STATUS COMP_ABORT //测试不可恢复错误，类型completion abort
+BUS 1 DEV 0 FN 0        // BUS, DEV, FN correspond to the BDF of the DUT
+UNCOR_STATUS COMP_ABORT // Test uncorrectable error: completion abort
 HEADER_LOG 4 5 6 7
```

## 对齐块 25

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,3 +1,3 @@
-(1) 需要包含以下提交
+(1) The following commit needs to be included
 commit fe835d5fd3329ba629f8c4290c818ef4b8f9895d
 Author: Shawn Lin <shawn.lin@rock-chips.com>
@@ -7,25 +7,26 @@
     Change-Id: Ib214cc1be565bf16bafb6a847215572f35c43753
 
-(2) 需要开启本⽂档中”内核 稳定性统计信息“章节所述功能，并进⼊对应控制器的⽬录
+(2) The functionality described in the "Kernel Stability Statistical Information" section of this document needs to be enabled, and the corresponding controller directory needs to be entered
 
 (3) echo "einj_number enable_or_disable error_type error_number" > fault_injection
     |-------------------|----------------------------------------------------------|
-    | 数值               |         含义                                             |
+    | Value             |         Meaning                                            |
     |-------------------|----------------------------------------------------------|
-    |einj_number:       |错误注⼊的组号，仅⽀持0到6，其他数值⽆效                         |
+    |einj_number:       |Error injection group number, only supports 0 to 6, other values are invalid                         |
     |-------------------|----------------------------------------------------------|
-    |enable_or_disable: |开启错误注⼊还是关闭错误注⼊，0表⽰关闭，1表⽰开启，其他数值⽆效      |
+    |enable_or_disable: |Enable or disable error injection, 0 means disable, 1 means enable, other values are invalid      |
     |-------------------|----------------------------------------------------------|
-    |error_type:        |错误注⼊类型选择，根据附录所述选择einj_number所⽰组号所对应的错误类型|
+    |error_type:        |Error injection type selection, choose the error type corresponding to the einj_number group number as described in the appendix|
     |-------------------|----------------------------------------------------------|
-    |error_number:      |错误注⼊数量，仅⽀持0到255，其他数值⽆效                         |
+    |error_number:      |Error injection quantity, only supports 0 to 255, other values are invalid                         |
     |-------------------|----------------------------------------------------------|
-    例如echo "2 1 2 128" > fault_injection ,代表开启einj2，注⼊128个NAK DLLP包
-(4) 启动PCIe链路传输，例如NVMe: dd if=/dev/nvme0n1 of=/dev/null bs=1M count=5000
+    For example, echo "2 1 2 128" > fault_injection, represents enabling einj2 and injecting 128 NAK DLLP packets
 
-(5) 查看错误是否发⽣：cat err_event
+(4) Start the PCIe link transmission, for example, NVMe: dd if=/dev/nvme0n1 of=/dev/null bs=1M count=5000
+
+(5) Check if the error occurs: cat err_event
     Rx Recovery Request: 0x1f
     ...
     Tx Nak DLLP: 0x80
 
-(6) 分析双端软硬件，查看是否发⽣预期外的软硬件异常
+(6) Analyze the dual-end software and hardware to see if there are any unexpected software or hardware exceptions
```

## 对齐块 26

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,7 +1,6 @@
-(1)需包含以下五个提交：
+(1) The following five commits must be included:
 commit 0270f32f207f5682a729c17e977eb87bba83823e
 Author: Shuai Xue <xueshuai@linux.alibaba.com>
 Date:   Fri Dec 8 10:56:50 2023 +0800
-
     UPSTREAM: PCI: Move pci_clear_and_set_dword() helper to PCI header
     Change-Id: I35125190a4dd8ba25e6ec14b4712750605c22285
@@ -35,4 +34,4 @@
     Change-Id: Ia27ee055aa3e63deeb7fd646411c3542b7019288
 
-(2)内核需要开启CONFIG_PERF_EVENTS配置
-(3)系统需要集成perf⼯具；若⽆，可以去本⽂档附录所述开发资源获取地址内下载。
+(2) The kernel must enable the CONFIG_PERF_EVENTS configuration.
+(3) The system must integrate the perf tool; if not available, it can be downloaded from the development resource access address mentioned in the appendix of this document.
```

## 对齐块 27

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,52 +1,52 @@
-(1) 列出所有DWC PCIe PMU⽀持的配置
+(1) List all configurations supported by DWC PCIe PMU
 root@rk3576-buildroot:/# /userdata/perf list | grep dwc_rootport
-  dwc_rootport_0/CFG_RCVRY/                          [Kernel PMU event] #链路rcvry时间占⽐
-  dwc_rootport_0/L0/                                 [Kernel PMU event] #链路处于L0占⽐
-  dwc_rootport_0/L1/                                 [Kernel PMU event] #链路处于L1占⽐
-  dwc_rootport_0/L1_1/                               [Kernel PMU event] #链路处于L1.1占⽐
-  dwc_rootport_0/L1_2/                               [Kernel PMU event] #链路处于L1.2占⽐
-  dwc_rootport_0/L1_AUX/                             [Kernel PMU event] #RK不⽀持状态
-  dwc_rootport_0/RX_L0S/                             [Kernel PMU event] #RX处于L0s占⽐
-  dwc_rootport_0/Rx_CCIX_TLP_Data_Payload/           [Kernel PMU event] #RK不⽀持CCI数据统计
-  dwc_rootport_0/Rx_PCIe_TLP_Data_Payload/           [Kernel PMU event] #RX TLP数据量
-  dwc_rootport_0/TX_L0S/                             [Kernel PMU event] #TX处于L0s占⽐
-  dwc_rootport_0/TX_RX_L0S/                          [Kernel PMU event] #TX/RX都处于L0s占⽐
-  dwc_rootport_0/Tx_CCIX_TLP_Data_Payload/           [Kernel PMU event] #RK不⽀持CCI数据统计
-  dwc_rootport_0/Tx_PCIe_TLP_Data_Payload/           [Kernel PMU event] #TX TLP数据量
-  dwc_rootport_0/one_cycle/                          [Kernel PMU event] #RK不⽀持
-  dwc_rootport_0/rx_ack_dllp,lane=?/                 [Kernel PMU event] #RX回复的DLLP数
-  dwc_rootport_0/rx_atomic,lane=?/                   [Kernel PMU event] #RK不⽀持
-  dwc_rootport_0/rx_ccix_tlp,lane=?/                 [Kernel PMU event] #RK不⽀持
-  dwc_rootport_0/rx_completion_with_data,lane=?/     [Kernel PMU event] #RX cplt包带数据
-  dwc_rootport_0/rx_completion_without_data,lane=?/  [Kernel PMU event] #RX cplt包不带数据
-  dwc_rootport_0/rx_duplicate_tl,lane=?/             [Kernel PMU event] #RX/TL dup错误数
-  dwc_rootport_0/rx_io_read,lane=?/                  [Kernel PMU event] #RX上ior包数
-  dwc_rootport_0/rx_io_write,lane=?/                 [Kernel PMU event] #RX上iow包数
-  dwc_rootport_0/rx_memory_read,lane=?/              [Kernel PMU event] #RX上memr包数
-  dwc_rootport_0/rx_memory_write,lane=?/             [Kernel PMU event] #RX上memw包数
-  dwc_rootport_0/rx_message_tlp,lane=?/              [Kernel PMU event] #RX上收到的msg数
-  dwc_rootport_0/rx_nulified_tlp,lane=?/             [Kernel PMU event] #RX上因错丢弃的TLP数
-  dwc_rootport_0/rx_tlp_with_prefix,lane=?/          [Kernel PMU event] #RX上带前缀的TLP数
-  dwc_rootport_0/rx_update_fc_dllp,lane=?/           [Kernel PMU event] #RX上收到的流控包数
-  dwc_rootport_0/tx_ack_dllp,lane=?/                 [Kernel PMU event] #TX回复的DLLP数
-  dwc_rootport_0/tx_atomic,lane=?/                   [Kernel PMU event] #RK不⽀持
-  dwc_rootport_0/tx_ccix_tlp,lane=?/                 [Kernel PMU event] #RK不⽀持
-  dwc_rootport_0/tx_completion_with_data,lane=?/     [Kernel PMU event] #TX cplt包带数据
-  dwc_rootport_0/tx_completion_without_data,lane=?/  [Kernel PMU event] #TX cplt包不带数据
-  dwc_rootport_0/tx_configuration_read,lane=?/       [Kernel PMU event] #TX cfg-r包数
-  dwc_rootport_0/tx_configuration_write,lane=?/      [Kernel PMU event] #TX cfg-w包数
-  dwc_rootport_0/tx_io_read,lane=?/                  [Kernel PMU event] #TX上ior包数
-  dwc_rootport_0/tx_io_write,lane=?/                 [Kernel PMU event] #TX上iow包数
-  dwc_rootport_0/tx_memory_read,lane=?/              [Kernel PMU event] #TX上memr包数
-  dwc_rootport_0/tx_memory_write,lane=?/             [Kernel PMU event] #TX上memw包数
-  dwc_rootport_0/tx_message_tlp,lane=?/              [Kernel PMU event] #TX上收到的msg数
-  dwc_rootport_0/tx_nulified_tlp,lane=?/             [Kernel PMU event] #TX上因错丢弃的TLP数
-  dwc_rootport_0/tx_tlp_with_prefix,lane=?/          [Kernel PMU event] #TX发出的带前缀TLP数
-  dwc_rootport_0/tx_update_fc_dllp,lane=?/           [Kernel PMU event] #TX三发出的流控包数
+  dwc_rootport_0/CFG_RCVRY/                          [Kernel PMU event] #Percentage of time link is in rcvry state
+  dwc_rootport_0/L0/                                 [Kernel PMU event] #Percentage of time link is in L0 state
+  dwc_rootport_0/L1/                                 [Kernel PMU event] #Percentage of time link is in L1 state
+  dwc_rootport_0/L1_1/                               [Kernel PMU event] #Percentage of time link is in L1.1 state
+  dwc_rootport_0/L1_2/                               [Kernel PMU event] #Percentage of time link is in L1.2 state
+  dwc_rootport_0/L1_AUX/                             [Kernel PMU event] #Status not supported by RK
+  dwc_rootport_0/RX_L0S/                             [Kernel PMU event] #Percentage of time RX is in L0s state
+  dwc_rootport_0/Rx_CCIX_TLP_Data_Payload/           [Kernel PMU event] #RK does not support CCIX data statistics
+  dwc_rootport_0/Rx_PCIe_TLP_Data_Payload/           [Kernel PMU event] #RX TLP data volume
+  dwc_rootport_0/TX_L0S/                             [Kernel PMU event] #Percentage of time TX is in L0s state
+  dwc_rootport_0/TX_RX_L0S/                          [Kernel PMU event] #Percentage of time both TX and RX are in L0s state
+  dwc_rootport_0/Tx_CCIX_TLP_Data_Payload/           [Kernel PMU event] #RK does not support CCIX data statistics
+  dwc_rootport_0/Tx_PCIe_TLP_Data_Payload/           [Kernel PMU event] #TX TLP data volume
+  dwc_rootport_0/one_cycle/                          [Kernel PMU event] #Not supported by RK
+  dwc_rootport_0/rx_ack_dllp,lane=?/                 [Kernel PMU event] #Number of DLLPs acknowledged by RX
+  dwc_rootport_0/rx_atomic,lane=?/                   [Kernel PMU event] #Not supported by RK
+  dwc_rootport_0/rx_ccix_tlp,lane=?/                 [Kernel PMU event] #Not supported by RK
+  dwc_rootport_0/rx_completion_with_data,lane=?/     [Kernel PMU event] #RX completion packets with data
+  dwc_rootport_0/rx_completion_without_data,lane=?/  [Kernel PMU event] #RX completion packets without data
+  dwc_rootport_0/rx_duplicate_tl,lane=?/             [Kernel PMU event] #Number of RX/TL dup errors
+  dwc_rootport_0/rx_io_read,lane=?/                  [Kernel PMU event] #Number of ior packets on RX
+  dwc_rootport_0/rx_io_write,lane=?/                 [Kernel PMU event] #Number of iow packets on RX
+  dwc_rootport_0/rx_memory_read,lane=?/              [Kernel PMU event] #Number of memr packets on RX
+  dwc_rootport_0/rx_memory_write,lane=?/             [Kernel PMU event] #Number of memw packets on RX
+  dwc_rootport_0/rx_message_tlp,lane=?/              [Kernel PMU event] #Number of messages received on RX
+  dwc_rootport_0/rx_nulified_tlp,lane=?/             [Kernel PMU event] #Number of TLPs discarded due to errors on RX
+  dwc_rootport_0/rx_tlp_with_prefix,lane=?/          [Kernel PMU event] #Number of TLPs with prefix on RX
+  dwc_rootport_0/rx_update_fc_dllp,lane=?/           [Kernel PMU event] #Number of flow control packets received on RX
+  dwc_rootport_0/tx_ack_dllp,lane=?/                 [Kernel PMU event] #Number of DLLPs acknowledged by TX
+  dwc_rootport_0/tx_atomic,lane=?/                   [Kernel PMU event] #Not supported by RK
+  dwc_rootport_0/tx_ccix_tlp,lane=?/                 [Kernel PMU event] #Not supported by RK
+  dwc_rootport_0/tx_completion_with_data,lane=?/     [Kernel PMU event] #TX completion packets with data
+  dwc_rootport_0/tx_completion_without_data,lane=?/  [Kernel PMU event] #TX completion packets without data
+  dwc_rootport_0/tx_configuration_read,lane=?/       [Kernel PMU event] #Number of cfg-r packets on TX
+  dwc_rootport_0/tx_configuration_write,lane=?/      [Kernel PMU event] #Number of cfg-w packets on TX
+  dwc_rootport_0/tx_io_read,lane=?/                  [Kernel PMU event] #Number of ior packets on TX
+  dwc_rootport_0/tx_io_write,lane=?/                 [Kernel PMU event] #Number of iow packets on TX
+  dwc_rootport_0/tx_memory_read,lane=?/              [Kernel PMU event] #Number of memr packets on TX
+  dwc_rootport_0/tx_memory_write,lane=?/             [Kernel PMU event] #Number of memw packets on TX
+  dwc_rootport_0/tx_message_tlp,lane=?/              [Kernel PMU event] #Number of messages received on TX
+  dwc_rootport_0/tx_nulified_tlp,lane=?/             [Kernel PMU event] #Number of TLPs discarded due to errors on TX
+  dwc_rootport_0/tx_tlp_with_prefix,lane=?/          [Kernel PMU event] #Number of TLPs with prefix sent by TX
+  dwc_rootport_0/tx_update_fc_dllp,lane=?/           [Kernel PMU event] #Number of flow control packets sent by TX
 
-(2) 启动某项perf功能, 以基于时间的统计RX TLP为例
+(2) Start a perf feature, using time-based statistics for RX TLP as an example
  /userdata/perf stat -a -e dwc_rootport_0/Rx_PCIe_TLP_Data_Payload/
 
-(3) 启动传输
+(3) Initiate transmission
 root@rk3576-buildroot:/# dd if=/dev/nvme0n1 of=/dev/null bs=1M count=5000
 dd if=/dev/nvme0n1 of=/dev/null bs=1M count=5000
@@ -55,14 +55,14 @@
 5242880000 bytes (5.2 GB, 4.9 GiB) copied, 14.9016 s, 352 MB/s
 
-(4) 查看统计
+(4) View statistics
 Performance counter stats for 'system wide':
 5221423060      dwc_rootport_0/Rx_PCIe_TLP_Data_Payload/     (50.01%)
 28.298528222 seconds time elapsed
 
-(5) 同理可以测试TX TLP的数据量，则平均的RX/TX带宽计算
-PCIe RX Bandwidth = Rx_PCIe_TLP_Data_Payload / 统计时⻓
-PCIe TX Bandwidth = Tx_PCIe_TLP_Data_Payload / 统计时⻓
+(5) Similarly, test the data volume of TX TLP, and calculate the average RX/TX bandwidth
+PCIe RX Bandwidth = Rx_PCIe_TLP_Data_Payload / duration
+PCIe TX Bandwidth = Tx_PCIe_TLP_Data_Payload / duration
 
-(6) Lane事件的统计
-因为每个Lane都拥有相同的事件，为了避免产⽣⼤量冗余信息，建议指定Lane ID，例如：
+(6) Statistics for Lane events
+Since each Lane has the same events, to avoid generating a large amount of redundant information, it is recommended to specify the Lane ID, for example:
  /userdata/perf stat -a -e dwc_rootport_0/rx_memory_read,lane=1/
```

## 对齐块 29

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,6 +1,6 @@
-bus-range = <起始地址   结束地址>
+bus-range = <start address   end address>
 
-msi-map = < bus-range中的起始地址 << 8
+msi-map = < start address in bus-range << 8
             &its
-            bus-range中的起始地址 << 8
-            bus-range中分配的总线总数 << 8>
+            start address in bus-range << 8
+            total number of buses allocated in bus-range << 8>
```

## 对齐块 33

```diff
--- 中文原稿
+++ 英文原稿
@@ -2,5 +2,5 @@
 0002:21 :00.0 Non-Volatile memory controller: Intel Corporation SSD Pro 7600p/ 760p/E 6100p Series (rev 03) (prog-if 02 [NVM Express] )
     Subsystem: Intel Corporation SSD Pro 7600p/ 760p/E 6100p Series
-    Flags: bus master, fast devsel, latency 0，IRQ 114
+    Flags: bus master, fast devsel, latency 0, IRQ 114
     Memory at 380900000 (64-bit, non-prefetchable) [size=16K]
     Capabilities: [40] Power Management version 3
```

## 对齐块 34

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,3 +1,3 @@
 ranges = <0x00000800 0x0 0x80000000 0x3 0x80000000 0x0 0x800000
-          0x81000000 0x0 0x80800000 0x3 0x80800000 0x0 0x100000  IO空间
-          0x83000000 0x0 0x80900000 0x3 0x80900000 0x0 0x3f700000>; Memory空间
+          0x81000000 0x0 0x80800000 0x3 0x80800000 0x0 0x100000  IO space
+          0x83000000 0x0 0x80900000 0x3 0x80900000 0x0 0x3f700000>; Memory space
```

## 对齐块 35

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,3 +1,3 @@
-(1) 找出下游所需更换或者重扫描设备，⽬前我们以BDF为01:00.0的这个设备为例
+(1) Identify the downstream device that needs to be replaced or rescanned. Currently, we take the device with BDF 01:00.0 as an example.
 console:/ # /data/lspci -k
 00:00.0 Class 0604: Device 1d87:3566 (rev 01)
@@ -5,5 +5,5 @@
 01:00.0 Class 0c03: Device 1912:0014 (rev 03)
 
-(2) 对设备进⾏remove操作，可看到对应设备节点以及它所运⾏的pcie driver被反初始化
+(2) Perform the remove operation on the device, and you can see the corresponding device node and the PCIe driver it runs are uninitialized.
 console:/ # echo 1 > /sys/bus/pci/devices/0000\:01\:00.0/remove
 [   30.624938] xhci_hcd 0000:01:00.0: remove, state 4
@@ -16,10 +16,10 @@
 [   32.055920] vcc3v3_lcd1_n: disabling
 
-(3) 可再次查看，确定设备已经⽆法扫描到了
+(3) Check again to confirm that the device is no longer detected.
 console:/ # /data/lspci -k
 00:00.0 Class 0604: Device 1d87:3566 (rev 01)
         Kernel driver in use: pcieport
 
-(4) 发起总线重扫描，可任选如下两条指令之⼀，执⾏后新设备恢复识别
+(4) Initiate a bus rescan. You can choose either of the following two commands. After execution, the new device will be recognized.
 console:/ #  echo 1 > /sys/bus/pci/devices/0000\:00\:00.0/rescan
 console:/ #  echo 1 > /sys/bus/pci/rescan
```

## 对齐块 37

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,4 +1,4 @@
-# 加载驱动后msix配置后状态，从设备端执⾏以下两条命令可以看到MSI-Xtable
-io -4 0xfe280270 0x10001      # 测试时开启 Dbi writeable
+# After loading the driver, the msix configuration status can be viewed from the device side by executing the following two commands to see the MSI-X table
+io -4 0xfe280270 0x10001      # Enable Dbi writeable during testing
 io -4 -l 0x100 0xf6300000
 io -4 0xfe280270 0x10000
@@ -21,10 +21,10 @@
 f63000f0:  00000000 00000000 00000000 00000001
 
-# 由于当前业务没有提供 MSI-X 接⼝⽰例，可通过以下⽅式触发 MSI-X
-# 设置设备 outbound，默认RK EP outbound 配置 CPU addr 为 0xf0000000，测试时未改动，或者通过内核接⼝完成 Bar outbound 配置
-io -4 0xf6300014 0xfee00000    # 指向前⾯的 io -4 -l 0x100 0xf5300000 输出地址
+# Since the current business does not provide an MSI-X interface example, MSI-X can be triggered in the following way
+# Set device outbound, the default RK EP outbound configuration CPU addr is 0xf0000000, unchanged during testing, or Bar outbound configuration can be completed through the kernel interface
+io -4 0xf6300014 0xfee00000    # Points to the output address of the previous io -4 -l 0x100 0xf5300000
 io -4 0xf6300018 0x0
 
-# 触发 MSI-X
+# Trigger MSI-X
 io -4 0xf0002004 0x24
 io -4 0xf0008004 0x24
```

## 对齐块 38

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,4 +1,4 @@
-# 加载驱动后 msix 配置后状态，从设备端执⾏以下两条命令可以看到 MSI-X table
-io -4 0xfe150270 0x10001       # 测试时开启 Dbi writeable
+# After loading the driver, the msix configuration status can be viewed from the device side by executing the following two commands to see the MSI-X table
+io -4 0xfe150270 0x10001       # Enable Dbi writeable during testing
 io -4 -l 0x100 0xf5300000
 io -4 0xfe150270 0x10000
@@ -20,10 +20,11 @@
 f53000e0:  00000000 00000000 00000000 00000001
 f53000f0:  00000000 00000000 00000000 00000001
-# 由于当前业务没有提供 MSI-X 接⼝⽰例，可通过以下⽅式触发 MSI-X
-# 设置设备 outbound，默认RK EP outbound 配置 CPU addr 为 0xf0000000，测试时未改动，或者通过内核接⼝完成 Bar outbound 配置
-io -4 0xf5300014 0xfee00000    # 指向前⾯的 io -4 -l 0x100 0xf5300000 输出地址
+
+# Since the current business does not provide an MSI-X interface example, MSI-X can be triggered in the following way
+# Set device outbound, the default RK EP outbound configuration CPU addr is 0xf0000000, unchanged during testing, or Bar outbound configuration can be completed through the kernel interface
+io -4 0xf5300014 0xfee00000    # Points to the output address of the previous io -4 -l 0x100 0xf5300000
 io -4 0xf5300018 0x0
 
-# 触发 MSI-X
+# Trigger MSI-X
 io -4 0xf0002004 0x24
 io -4 0xf0008004 0x24
```

## 对齐块 40

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,3 +1,3 @@
-[   11.646077] pci 0000:01:00.0: reg 0x10: [mem 0x00000000-0x00ffffff 64bit]   # Dev总共需求26MB 32bits-np，最终会对⻬需求32MB空间
+[   11.646077] pci 0000:01:00.0: reg 0x10: [mem 0x00000000-0x00ffffff 64bit]   # Dev requires a total of 26MB 32bits-np, and will eventually align to a requirement of 32MB space
 [   11.646113] pci 0000:01:00.0: reg 0x18: [mem 0x00000000-0x007fffff 64bit]
 [   11.646150] pci 0000:01:00.0: reg 0x20: [mem 0x00000000-0x001fffff 64bit]
```

## 对齐块 45

```diff
--- 中文原稿
+++ 英文原稿
@@ -33,5 +33,5 @@
 +                ranges = <0x00000800 0x0 0xdfe00000 0x0 0xf0000000 0x0 0x100000
 +                          0x81000000 0x0 0xdff00000 0x0 0xf0100000 0x0 0x100000
-+                          0x82000000 0x0 0xe0000000 0x9 0x00000000 0x0 0x20000000 // 扩展⾄512MB
++                          0x82000000 0x0 0xe0000000 0x9 0x00000000 0x0 0x20000000 // Extended to 512MB
 +                          0xc3000000 0x9 0x20000000 0x9 0x20000000 0x0 0x20000000>;
                 reg = <0x0 0xfe150000 0x0 0x10000>,
```

## 对齐块 46

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,4 +1,4 @@
-pcie_bus_tune_off  #关闭mps调整，使⽤设备⾃⾝默认值
-pcie_bus_safe      #开启mps调整，设置所有设备都⽀持的最⼤mps值
-pcie_bus_perf      #开启mps调整，根据parent bus及⾃⾝capability设置为最⼤mps
-pcie_bus_peer2peer #开启mps调整，设置所有设备为mps为128B
+pcie_bus_tune_off  # Disable MPS adjustment, use the device's default value
+pcie_bus_safe      # Enable MPS adjustment, set the maximum MPS value supported by all devices
+pcie_bus_perf      # Enable MPS adjustment, set the maximum MPS based on the parent bus and its own capability
+pcie_bus_peer2peer # Enable MPS adjustment, set all devices to have an MPS of 128B
```

## 对齐块 47

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,13 +1,13 @@
-如果RK3588接了三个⽹卡，想按下⾯顺序固定：
+If RK3588 is connected to three network cards and wants to fix the order as follows:
 pcie2x1l0: pcie@fe170000 => eth1
 pcie2x1l2: pcie@fe190000 => eth2
 pcie2x1l1: pcie@fe180000 => eth3
 
-查询dtsi可知：
-pcie2x1l0节点：bus-range = <0x20 0x2f> -> ⽹卡分配的bus number为0x21 -> eth1
-pcie2x1l2节点：bus-range = <0x40 0x4f> -> ⽹卡分配的bus number为0x41 -> eth2
-pcie2x1l1节点：bus-range = <0x30 0x3f> -> ⽹卡分配的bus number为0x31 -> eth3
+By querying dtsi, it is known that:
+pcie2x1l0 node: bus-range = <0x20 0x2f> -> The bus number allocated to the network card is 0x21 -> eth1
+pcie2x1l2 node: bus-range = <0x40 0x4f> -> The bus number allocated to the network card is 0x41 -> eth2
+pcie2x1l1 node: bus-range = <0x30 0x3f> -> The bus number allocated to the network card is 0x31 -> eth3
 
-修改对应的function驱动，在register_netdev函数被调⽤前修改注册到⽹络⼦系统的名字。
+Modify the corresponding function driver to change the name registered to the network subsystem before the register_netdev function is called.
 --- a/drivers/net/ethernet/realtek/r8168/r8168_n.c
 +++ b/drivers/net/ethernet/realtek/r8168/r8168_n.c
@@ -38,8 +38,8 @@
          rtl8168_get_mac_address(dev);
 -
-+        pci_bus_nr_2_id(pdev, dev); // 修改位置⼀定要在register_netdev()之前
++        pci_bus_nr_2_id(pdev, dev); // The modification must be before register_netdev()
          tp->fw_name = rtl_chip_fw_infos[tp->mcfg].fw_name;
 
-同理NVMe存储器可参考类似修改
+Similarly, NVMe storage can be modified in a similar way.
 --- a/drivers/nvme/host/core.c
 +++ b/drivers/nvme/host/core.c
```

## 对齐块 49

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,3 +1,3 @@
-# 1.查询dtsi中PCIe控制器节点所引⽤的power-domains节点
+# 1. Query the power-domains node referenced by the PCIe controller node in the dtsi
 pcie0: pcie@2a200000 {
     ...
@@ -6,5 +6,5 @@
 };
 
-# 2.将这个power-domain节点配置成常开，并修改休眠状态下的电源控制
+# 2. Configure this power-domain node to always be on, and modify the power control in the sleep state
 --- a/arch/arm64/boot/dts/rockchip/rk3576.dtsi
 +++ b/arch/arm64/boot/dts/rockchip/rk3576.dtsi
```

## 对齐块 52

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,3 +1,3 @@
-PCIe Link Fail的log如下⼀直重复”PCIe Linking...“，LTSSM状态机可能不同
+PCIe Link Fail logs are repeatedly showing "PCIe Linking..." and the LTSSM state machine may differ
 
 rk-pcie 3c0000000.pcie: PCIe Linking... LTSSM is 0x0
@@ -5,5 +5,5 @@
 rk-pcie 3c0000000.pcie: PCIe Linking... LTSSM is 0x0
 
-或者出现"PCIe Link up"的打印， 但LTSSM状态机的bit16与bit17不等于0x3, bit0到bit8数值不⼤于0x11
+Alternatively, there may be a "PCIe Link up" printout, but the LTSSM state machine's bit16 and bit17 are not equal to 0x3, and the values from bit0 to bit8 are not greater than 0x11
 [    3.108325] rk-pcie fe150000.pcie: Looking up vpcie3v3-supply from device tree
 [    3.126926] rk-pcie fe150000.pcie: missing legacy IRQ resource
@@ -20,4 +20,4 @@
 [    3.387304] rk-pcie fe150000.pcie: PCIe Link up, LTSSM is 0x0
 
-真正如果link成功，应该可以看到类似log, 出现"PCIe Link up"的打印，且LTSSM状态机的bit16与bit17等于0x3,bit0到bit8数值⼤等于0x11
+If the link is truly successful, logs similar to the following should be visible, with "PCIe Link up" printout and LTSSM state machine's bit16 and bit17 equal to 0x3, and values from bit0 to bit8 greater than or equal to 0x11
 [    2.410536] rk-pcie 3c0000000.pcie: PCIe Link up, LTSSM is 0x130011
```

## 对齐块 59

```diff
--- 中文原稿
+++ 英文原稿
@@ -21,6 +21,6 @@
 0000: 02:04.0 Non-VGA unclassified device: Advantech Co. Ltd Device 1730
 Subsystem: Advantech Co. Ltd Device 1730
-F1ags: medium devsel， IRQ 255
-I/0 ports at[<unassigned> _disabled] [size=256]
+Flags: medium devsel, IRQ 255
+I/O ports at[<unassigned> _disabled] [size=256]
 Memory at <unassigned> (32-bit, non-prefetchabie) [disabled] [size=128]
 Memory at <unassigned> (32-bit, non-prefetchable) [disabled] [size=256]
```

## 对齐块 66

```diff
--- 中文原稿
+++ 英文原稿
@@ -15,5 +15,5 @@
 +#define ANY 0xff
 +
-+/* 请在sbl表中填写实际要过滤的设备bdf，以上述log为例，过滤的是bus12的2/3/a/b四个端⼝*/
++/* Please fill in the actual devices to be filtered in the sbl table, taking the above log as an example, filtering ports 2/3/a/b of bus12 */
 +static struct scan_blacklist_devfn sbl[] = {
 +       {12, 0x2, ANY},
```

## 对齐块 73

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,3 +1,3 @@
-类型1：
+Type 1:
 [    2.379768] rk-pcie 3c0000000.pcie: PCIe Link up, LTSSM is 0x30011
 [    2.380155] rk-pcie 3c0000000.pcie: PCI host bridge to bus 0000:00
@@ -10,5 +10,5 @@
 [    2.394983] pci 0000:01:00.0: [Firmware Bug] reg 0x10: invalid BAR (can't size)
 
-类型2：
+Type 2:
 [    2.548219] pci 0000:01:00.0: [10ec:b723] type 00 class 0x028000
 [    2.548389] pci 0000:01:00.0: reg 0x10: initial BAR value 0x00000000 invalid
```

## 对齐块 76

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,10 +1,10 @@
-/* 若在⽤⼾态使⽤，需要添加如下barrier的实现 */
+/* If used in user space, the following implementation of barrier is required */
 # define barrier() __asm__ __volatile__("": : :"memory")
 
 *((u32 *)((void *)addr + 0x0)) = 0x11111111;
-/* 代码点 1 */
+/* Code Point 1 */
 *((u32 *)((void *)addr + 0x4)) = 0x44444444;
-/* 代码点 2 */
+/* Code Point 2 */
 *((u32 *)((void *)addr + 0x8)) = 0x88888888;
-/* 代码点 3 */
+/* Code Point 3 */
 *((u32 *)((void *)addr + 0xc)) = 0xcccccccc;
```

## 对齐块 78

```diff
--- 中文原稿
+++ 英文原稿
@@ -10,5 +10,5 @@
 +   if ((pdev->vendor == 0x184e) ||
 +       (pdev->vendor == PCI_VENDOR_ID_VIA && pdev->device == 0x3483)) {
-+       /* 以VL805为例，其他芯⽚请填写正确的⼚商ID和设备ID */
++       /* Taking VL805 as an example, other chips should fill in the correct vendor ID and device ID */
 +       dev_warn(&pdev->dev, "bypass xhci quirk for VL805\n");
         return;
```

## 对齐块 82

```diff
--- 中文原稿
+++ 英文原稿
@@ -5,5 +5,5 @@
                 gpio = <&gpio0 RK_PD4 GPIO_ACTIVE_HIGH>;
                 startup-delay-us = <5000>;
-+               off-on-delay-us = <500000>; //硬件给出的最⼤时⻓t
++               off-on-delay-us = <500000>; //The maximum duration t provided by hardware
                 vin-supply = <&dc_12v>;
         };
```

## 对齐块 89

```diff
--- 中文原稿
+++ 英文原稿
@@ -34,5 +34,5 @@
 [   10.178268]  inet_ioctl+0x1b8/0x1e8
 
-lspci -vvv的输出结果:
+Output of lspci -vvv:
 0003:31:00.0 Class 0108: Device 8086:f1a5 (rev ff) (prog-if ff)
         !!! Unknown header type 7f
```

## 对齐块 92

```diff
--- 中文原稿
+++ 英文原稿
@@ -1,4 +1,4 @@
-(1) 将CONFIG_DEFAULT_HUNG_TASK_TIMEOUT配置⼀个稍⼤秒数，例如120，以规避block-mq的阻塞检测
-(2) 调整NVMe协议栈关于admin queue和io queue的软件超时时间
+(1) Set the CONFIG_DEFAULT_HUNG_TASK_TIMEOUT to a slightly larger number of seconds, for example, 120, to avoid the block-mq blockage detection
+(2) Adjust the software timeout times for the admin queue and io queue in the NVMe protocol stack
 --- a/drivers/nvme/host/core.c
 +++ b/drivers/nvme/host/core.c
```


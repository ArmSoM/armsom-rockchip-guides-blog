---
title: "Rockchip HDMI-CEC Complete Guide: Android HAL, Linux cec-ctl, Message Flows and Debugging"
description: "Rockchip HDMI-CEC Complete Guide: Android HAL, Linux cec-ctl, Message Flows and Debugging"
translation_key: "048-rockchip-hdmi-cec"
slug: "048-rockchip-hdmi-cec"
lang: "en"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["HDMI-CEC", "Rockchip", "Android", "HAL", "Linux", "cec-ctl"]
keywords: "ArmSoM Rockchip HDMI CEC Android HAL Linux cec-ctl"
excerpt: "Rockchip HDMI-CEC Complete Guide: Android HAL, Linux cec-ctl, Message Flows and Debugging"
---

{% raw %}

# Rockchip HDMI-CEC Complete Guide: Android HAL, Linux cec-ctl, Message Flows and Debugging

This is a Rockchip HDMI-CEC platform reference based on the Chinese V1.1.0 PDF (39 pages); no English original was supplied. English and Russian fully translate the technical body, and all three languages use Chinese-source figures with localized alt text. The source covers Android 5.x and later, Linux kernel 4.4/4.19 and RK322X/RK3328/RK3368/RK3399/RK3288. This does not establish support on all current BSPs or ArmSoM boards. Verify the actual SoC, HDMI CEC wiring, HAL, CEC driver, Android services and standby firmware. No ArmSoM hardware or TV compatibility tests were performed; logs and procedures are source examples.

[Editorial notes](/docs/rockchip-hdmi-cec/EDITORIAL-NOTES.md) · [ArmSoM documentation](https://docs.armsom.org/) · [Rockchip](https://www.rock-chips.com/)

## 1. CEC introduction

### 1.1 What CEC means

CEC stands for Consumer Electronics Control. It provides advanced control of home audiovisual equipment connected by HDMI, allowing users to control the interconnected devices with one remote.

![Technical figure from the Chinese source, p. 4](/docs/rockchip-hdmi-cec/assets/cn-p4-1.png)

As illustrated, either the TV remote or the set-top-box remote can control both the TV and the box.

### 1.2 CEC protocol overview

CEC assumes all audiovisual sources connect directly or indirectly to a root display. HDMI connections form a top-down tree: the display is the root, switching devices are branches and sources are leaves. Every device needs exactly one physical address so CEC can address and control it. Software assigns physical addresses throughout the CEC network using EDID.

![Technical figure from the Chinese source, p. 4](/docs/rockchip-hdmi-cec/assets/cn-p4-2.png)

Every device on the CEC bus must bind a logical address identifying its type. Each logical address can belong to only one device, except address 15. Most devices use one logical address; a few can use up to two.

![Technical figure from the Chinese source, p. 5](/docs/rockchip-hdmi-cec/assets/cn-p5-1.png)

| Address | Device |
| --- | --- |
| 0 | TV |
| 1 | Recording Device 1 |
| 2 | Recording Device 2 |
| 3 | Tuner 1 |
| 4 | Playback Device 1 |
| 5 | Audio System |
| 6 | Tuner 2 |
| 7 | Tuner 3 |
| 8 | Playback Device 2 |
| 9 | Recording Device 3 |
| 10 | Tuner 4 |
| 11 | Playback Device 3 |
| 12 | Reserved |
| 13 | Reserved |
| 14 | Specific Use |
| 15 | Unregistered (initiator) / Broadcast (destination) |

Logical-address allocation is shown below. A POLL MSG with identical SRC and DST addresses checks whether another device already occupies that address.

![Technical figure from the Chinese source, p. 6](/docs/rockchip-hdmi-cec/assets/cn-p6-1.png)

CEC devices communicate by sending CEC messages.

![Technical figure from the Chinese source, p. 6](/docs/rockchip-hdmi-cec/assets/cn-p6-2.png)

A CEC message contains one or more blocks. Each block has 8 Header/Data bits, an EOM bit and an ACK bit. EOM=1 marks the final block, with no further data. The sender sets ACK to 1; a receiver that successfully receives the message sets it to 0 as acknowledgement.

![Technical figure from the Chinese source, p. 6](/docs/rockchip-hdmi-cec/assets/cn-p6-3.png)

The Header Block is the first block. Its upper four information bits contain the sender's logical address and the lower four the destination address. A Data Block contains an opcode or parameters in its information bits.

## 2. CEC implementation

### 2.1 Android CEC framework

#### 2.1.1 Framework overview

Many manufacturers implement HDMI-CEC, making cross-vendor operation possible. However, implementation and feature differences prevent complete compatibility; two products advertised as CEC-capable are not necessarily interoperable. With Android TIF (TV Input Framework), HDMI-CEC enables communication between connected devices while minimizing compatibility problems. Android introduced HdmiControlService for this purpose. As part of the Android ecosystem, it aims to provide all vendors with a standard HDMI-CEC implementation and reduce incompatibility. Previously, vendors developed their own implementation or used third-party solutions. The source describes HdmiControlService as an Android service tested with widely used HDMI-CEC devices, informed by compatibility research and suggestions from experienced industry partners. It balances the standard with modifications needed by products already in users' homes; these are source statements, not compatibility tests performed for this article.

##### 2.1.1.1 HdmiControlService

HdmiControlService works with TIF, audio services, power management and other system components to implement CEC. The diagram shows the transition from a custom CEC controller to a simpler HDMI-CEC hardware abstraction layer and details the HDMI control service. Key components follow:

HdmiControlManager provides APIs to authorized applications. System services such as TV Input Manager and audio services can use this class directly.

Source path:

```text
frameworks/base/core/java/android/hardware/hdmi
```

The service is designed to support multiple logical-device types.

Source path:

```text
frameworks/base/services/core/java/com/android/server/hdmi
```

HDMI-CEC accesses hardware through a HAL, abstracting device differences in protocol and signaling. Vendors can implement their own HAL using the existing interface definition.

![Technical figure from the Chinese source, p. 8](/docs/rockchip-hdmi-cec/assets/cn-p8-1.png)

![Technical figure from the Chinese source, p. 8](/docs/rockchip-hdmi-cec/assets/cn-p8-2.png)

##### 2.1.1.2 HDMI-CEC HAL

For the CEC service to operate, implement the HDMI-CEC HAL according to Android's definition. It abstracts hardware differences and exposes raw operations such as allocation, reading and writing through APIs. Device manufacturers must support these APIs. TX/RX/events:

send_message

register_event_callback

Information:

get_physical_address

get_version

get_vendor_id

get_port_info

Logical addresses:

add_logical_address

clear_logical_address

State:

is_connected; set_option

set_audio_return_channel

Excerpt from the HDMI-CEC HAL API definition:

```text
#ifndef ANDROID_INCLUDE_HARDWARE_HDMI_CEC_H
#define ANDROID_INCLUDE_HARDWARE_HDMI_CEC_H


...

/*
 * HDMI-CEC HAL interface definition.
 */
typedef struct hdmi_cec_device {
   /**
   * Common methods of the HDMI-CEC device. This *must* be the first member of
   * hdmi_cec_device as users of this structure will cast a hw_device_t to
hdmi_cec_device
   * pointer in contexts where it's known the hw_device_t references a
hdmi_cec_device.

   */
   struct hw_device_t common;

   /*
   * (*add_logical_address) passes the logical address that will be used
   * in this system.
   *
   * HAL may use it to configure the hardware so that the CEC commands
addressed
   * the given logical address can be filtered in. This method can be called
   * as many times as necessary in order to support multiple logical devices.
   * addr should be in the range of valid logical addresses for the call
   * to succeed.

   *
   * Returns 0 on success or -errno on error.
   */
   int (*add_logical_address)(const struct hdmi_cec_device* dev,
cec_logical_address_t addr);

   /*
   * (*clear_logical_address) tells HAL to reset all the logical addresses.
   *
   * It is used when the system doesn't need to process CEC command any more,
   * hence to tell HAL to stop receiving commands from the CEC bus, and change
    * the state back to the beginning.
    */
   void (*clear_logical_address)(const struct hdmi_cec_device* dev);


   /*
    * (*get_physical_address) returns the CEC physical address. The
    * address is written to addr.
    *
    * The physical address depends on the topology of the network formed
    * by connected HDMI devices. It is therefore likely to change if the cable
    * is plugged off and on again. It is advised to call get_physical_address
    * to get the updated address when hot plug event takes place.
    *
    * Returns 0 on success or -errno on error.
    */

   int (*get_physical_address)(const struct hdmi_cec_device* dev, uint16_t*
addr);

   /*
    * (*send_message) transmits HDMI-CEC message to other HDMI device.
    *
    * The method should be designed to return in a certain amount of time not
    * hanging forever, which can happen if CEC signal line is pulled low for
    * some reason. HAL implementation should take the situation into account
    * so as not to wait forever for the message to get sent out.
    *
    * It should try retransmission at least once as specified in the standard.
    *

    * Returns error code. See HDMI_RESULT_SUCCESS, HDMI_RESULT_NACK, and
    * HDMI_RESULT_BUSY.
    */
   int (*send_message)(const struct hdmi_cec_device* dev, const cec_message_t*);

   /*
    * (*register_event_callback) registers a callback that HDMI-CEC HAL
    * can later use for incoming CEC messages or internal HDMI events.
    * When calling from C++, use the argument arg to pass the calling object.
    * It will be passed back when the callback is invoked so that the context
    * can be retrieved.
    */

   void (*register_event_callback)(const struct hdmi_cec_device* dev,
         event_callback_t callback, void* arg);

   /*
    * (*get_version) returns the CEC version supported by underlying hardware.
    */
   void (*get_version)(const struct hdmi_cec_device* dev, int* version);

   /*
    * (*get_vendor_id) returns the identifier of the vendor. It is
    * the 24-bit unique company ID obtained from the IEEE Registration
    * Authority Committee (RAC).
    */

   void (*get_vendor_id)(const struct hdmi_cec_device* dev, uint32_t*
vendor_id);
   /*
   * (*get_port_info) returns the hdmi port information of underlying hardware.
   * info is the list of HDMI port information, and 'total' is the number of

   * HDMI ports in the system.
   */
   void (*get_port_info)(const struct hdmi_cec_device* dev,
         struct hdmi_port_info* list[], int* total);

   /*
   * (*set_option) passes flags controlling the way HDMI-CEC service works down
   * to HAL implementation. Those flags will be used in case the feature needs
   * update in HAL itself, firmware or microcontroller.
   */
   void (*set_option)(const struct hdmi_cec_device* dev, int flag, int value);


   /*
   * (*set_audio_return_channel) configures ARC circuit in the hardware logic
   * to start or stop the feature. Flag can be either 1 to start the feature
   * or 0 to stop it.
   *
   * Returns 0 on success or -errno on error.
   */
   void (*set_audio_return_channel)(const struct hdmi_cec_device* dev, int
flag);

   /*
   * (*is_connected) returns the connection status of the specified port.
   * Returns HDMI_CONNECTED if a device is connected, otherwise

HDMI_NOT_CONNECTED.
   * The HAL should watch for +5V power signal to determine the status.
   */
   int (*is_connected)(const struct hdmi_cec_device* dev, int port);

   /* Reserved for future use to maximum 16 functions. Must be NULL. */
   void* reserved[16 - 11];
} hdmi_cec_device_t;

#endif /* ANDROID_INCLUDE_HARDWARE_HDMI_CEC_H */
```

Through these APIs, the CEC service uses hardware resources to transmit/receive HDMI-CEC commands, configure settings and optionally communicate with a low-level microprocessor responsible for CEC control while Android is in standby.

#### 2.1.2 Related source paths

CEC-related code paths and their functions:

| Path | Description |
| --- | --- |
| kernel/drivers/media/cec/cec-adap.c | Core CEC driver: binds physical/logical addresses and manages CEC events and message TX/RX. |
| kernel/drivers/media/cec/cec-api.c | Provides IOCTL calls to userspace. |
| kernel/drivers/media/cec/cec-core.c | Registers CEC devices. |
| kernel/drivers/media/cec/cec-notifier.c | Notifies the CEC driver of physical-address changes. |
| kernel/drivers/media/cec/cec-edid.c | EDID helpers, primarily extracting the physical address. |
| kernel/drivers/gpu/drm/bridge/synopsys/dw-hdmi-cec.c | DW-HDMI CEC driver, primarily operating DW-HDMI CEC registers. |

Android source paths:

| Path | Description |
| --- | --- |
| hardware/rockchip/hdmicec/hdmi_cec.cpp | Implements the standard CEC HAL interface. |
| hardware/rockchip/hdmicec/hdmicec_event.cpp | A thread monitors kernel CEC messages/events and reports them upward. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiControlService.java | Service for sending and processing HDMI control messages and CEC commands. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecController.java | Manages CEC commands and operations. Converts user commands to CEC for HAL; parses incoming messages and dispatches them to modules. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevice.java | Models a logical CEC device, initializes it and invokes device-specific handlers for received messages. |
| frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java | Abstracts a PLAYBACK device and exposes its interfaces. |

### 2.2 Linux HDMI CEC applications

On Linux, cec-ctl from v4l-utils controls CEC devices from the command line.

#### 2.2.1 Installing v4l-utils

On Debian, install v4l-utils with:

```text
sudo apt-get install v4l-utils
```

On Buildroot, enable these build options:

```text
BR2_PACKAGE_LIBV4L=y
BR2_PACKAGE_LIBV4L_UTILS=y
```

#### 2.2.2 Commands

Playback command:

```text
[root@rk3288:/]#cec-ctl --playback -o Rockchip -V 0xaabbcc -M -T
```

Partial output:

```text
CEC_ADAP_G_CAPS returned 0 (Success)
CEC_ADAP_G_PHYS_ADDR returned 0 (Success)

CEC_ADAP_S_LOG_ADDRS returned 0 (Success)
CEC_ADAP_S_LOG_ADDRS returned 0 (Success)
CEC_ADAP_G_LOG_ADDRS returned 0 (Success)
Driver Info:
Driver Name : dwhdmi-rockchip
Adapter Name : dw_hdmi
Capabilities : 0x0000000e
Logical Addresses
Transmit
Passthrough
Driver version : 4.4.167
Available Logical Addresses: 4
Physical Address : 1.0.0.0

Logical Address Mask : 0x0010
CEC Version : 2.0
Vendor ID : 0xaabbcc
Logical Address : 4 (Playback Device 1)
Primary Device Type : Playback
Logical Address Type : Playback
All Device Types : Playback
RC TV Profile : None
Device Features : None
Monitor All mode is not supported, falling back to regular monitoring
CEC_S_MODE returned 0 (Success)
CEC_DQEVENT returned 0 (Success)
```

CEC initialization exchanges basic information such as vendor ID, OSD name and CEC version:

```text
Received from TV to Playback Device 1 (0 to 4): CEC_MSG_GIVE_DEVICE_VENDOR_ID
(0x8c)
CEC_RECEIVE returned 0 (Success)

Transmitted by Playback Device 1 to all (4 to 15): CEC_MSG_DEVICE_VENDOR_ID
(0x87):
vendor-id: 11189196 (0x00aabbcc)
CEC_RECEIVE returned 0 (Success)

Received from TV to Playback Device 1 (0 to 4): CEC_MSG_GIVE_OSD_NAME (0x46)
CEC_RECEIVE returned 0 (Success)
Transmitted by Playback Device 1 to TV (4 to 0): CEC_MSG_SET_OSD_NAME (0x47):
name: Rockchip
CEC_RECEIVE returned 0 (Success)
```

When the TV enters standby, it sends a standby message to the SoC:

```text
Received from TV to all (0 to 15): CEC_MSG_STANDBY (0x36)
CEC_RECEIVE returned 0 (Success)
```

When the TV switches input sources, it sends these messages:

```text
Received from TV to all (0 to 15): CEC_MSG_SET_STREAM_PATH (0x86):
phys-addr: 2.0.0.0

CEC_RECEIVE returned 0 (Success)
Received from TV to all (0 to 15): CEC_MSG_ROUTING_CHANGE (0x80):
orig-phys-addr: 0.0.0.0
new-phys-addr: 2.0.0.0
CEC_RECEIVE returned 0 (Success)
```

One-touch-play command:

```text
[root@rk3288:/]# cec-ctl --help-one-touch-play
One Touch Play Feature:

--active-source=phys-addr=<val> Send ACTIVE_SOURCE message (0x82)
--image-view-on Send IMAGE_VIEW_ON message (0x04)
--text-view-on Send TEXT_VIEW_ON message (0x0d)
```

Wake the TV:

```text
[root@rk3288:/]#cec-ctl --image-view-on -to 0
```

Standby command:

```text
[root@rk3288:/]# cec-ctl --standby --to 0
```

See cec-ctl --help for more userspace commands.

Notes

The source implementation does not yet support suspending/waking the SoC through TV standby/wakeup.

For suspend, follow the Playback example in §2.2.2: after receiving CEC_MSG_STANDBY, invoke echo mem > /sys/power/state to suspend the SoC synchronously. Wakeup involves trust, cec-clk and HDMI PHY handling during standby and is not well supported in the source implementation.

Not every HDMI device supports CEC. First verify CEC support and support for the specific command on the TV or HDMI display.

### 2.3 CEC software flows

#### 2.3.1 CEC initialization

##### 2.3.1.1 CEC driver registration

![Technical figure from the Chinese source, p. 15](/docs/rockchip-hdmi-cec/assets/cn-p15-1.png)

The diagram above shows CEC driver registration.

dw_hdmi_cec_probe:

Initializes the CEC driver and connects the abstract system device to actual CEC hardware. It also initializes CEC registers and registers the message TX/RX interrupt (cec->irq).

cec_allocate_adapter:

(1) Creates and configures the adapter.

Adapter structure:

```text
struct cec_adapter {
      struct module *owner;

      char name[32];
      struct cec_devnode devnode;
      struct mutex lock;
      struct rc_dev *rc;
      struct list_head transmit_queue;
      unsigned int transmit_queue_sz;

      struct list_head wait_queue;
      struct cec_data *transmitting;

      struct task_struct *kthread_config;
      struct completion config_completion;

      struct task_struct *kthread;
      wait_queue_head_t kthread_waitq;
      wait_queue_head_t waitq;

      const struct cec_adap_ops *ops;
      void *priv;

      u32 capabilities;
      u8 available_log_addrs;
     u32 monitor_all_cnt;
      u32 monitor_pin_cnt;
      u32 follower_cnt;
      struct cec_fh *cec_follower;
      struct cec_fh *cec_initiator;
      bool passthrough;
      struct cec_log_addrs log_addrs;

      u32 tx_timeouts;

#ifdef CONFIG_CEC_NOTIFIER

      struct cec_notifier *notifier;
#endif
#ifdef CONFIG_CEC_PIN
      struct cec_pin *pin;
#endif

      struct dentry *cec_dir;
      struct dentry *status_file;

      u16 phys_addrs[15];
      u32 sequence;


      char input_name[32];
      char input_phys[32];
      char input_drv[32];
};
```

Important structure members are described below:

| Name | Description |
| --- | --- |
| transmit_queue | Pending CEC transmit queue. |
| transmit_queue_sz | Pending-transmit queue length. |
| wait_queue | Stores messages waiting for replies when reply waiting is requested; unused in this version. |
| transmitting | CEC message currently being transmitted. |
| kthread_config | Thread performing CEC initialization configuration. |
| config_completion | Completion object used to wait for CEC initialization (the source calls it a semaphore). |
| kthread | Descriptor for cec_thread_func, managing the CEC transmit queue. |
| kthread_waitq | Wait queue for cec_thread_func. |
| ops | Adapter callbacks; see kernel/drivers/gpu/drm/bridge/synopsys/dw-hdmi-cec.c. |
| capabilities | Configured adapter capabilities. |
| available_log_addrs | Maximum number of allocatable logical addresses. |
| phys_addr | Current physical address. |
| is_configuring | Initialization configuration is in progress. |
| is_configured | Initialization configuration is complete. |
| follower_cnt | Follower count; 1 in the source solution. |
| cec_follower | Current cec_follower; fh in this version. |
| cec_initiator | Current cec_initiator; fh in this version. |
| passthrough | Whether the current cec_follower uses passthrough. |
| log_addrs | One or more currently allocated logical addresses. |
| tx_timeouts | CEC transmit timeout count; normally rare. |
| notifier | CEC notifier. |
| phys_addrs | Physical addresses for the multiple-logical-address case. |
| sequence | Adapter transmit sequence number, used to trace messages waiting for replies. |

(2) Runs cec_thread_func to manage the CEC message transmission queue.

(3) Configures adapter capabilities, described below:

| Name | Description |
| --- | --- |
| CEC_CAP_PHYS_ADDR | Userspace must set the physical address. |
| CEC_CAP_LOG_ADDRS | Userspace must set logical addresses. |
| CEC_CAP_TRANSMIT | Allows userspace to transmit CEC messages. |
| CEC_CAP_PASSTHROUGH | Driver forwards received messages directly to userspace without handling them. |
| CEC_CAP_RC | Supports remote-control driver control of CEC. |
| CEC_CAP_MONITOR_ALL | Receives all CEC messages, including those addressed to others, normally for debugging. |
| CEC_CAP_NEEDS_HPD | Enables CEC only while HDMI HPD is high. |
| CEC_CAP_MONITOR_PIN | Monitors changes on the CEC pin. |

cec_register_adapter:

(1) Registers the CEC device node.

(2) Registers CEC debug nodes.

cec_register_cec_notifier:

Registers a CEC notifier and binds it to the adapter.

##### 2.3.1.2 CEC initialization settings

CEC requires correct initialization: enable the relevant switches, bind and save the logical address, and complete driver configuration. FRAMEWORK, JNI and HAL flows are shown below:

![Technical figure from the Chinese source, p. 19](/docs/rockchip-hdmi-cec/assets/cn-p19-1.png)

Important stages:

initializeCec:

initializeCec is the principal initialization stage. It runs at boot, after resume and when CEC is enabled in Settings. It initializes local devices, allocates logical addresses and enables CEC switches. In the source Android implementation only TV and PLAYBACK devices are supported; Rockchip primarily uses PLAYBACK.

initializeLocalDevices:

(1) Creates and initializes the CEC local device, HdmiCecLocalDevicePlayback. (2) localDevice.init calls getPreferredAddress to read persist.sys.hdmi.addr.playback. A previously allocated address is tried first; otherwise allocation starts at the device type's first address, 0x4 for PLAYBACK. (3) localDevices.add adds the initialized device to the localDevices list.

hdmi_cec_set_option:

Initialization calls the HAL to enable these CEC options:

| Name | Description |
| --- | --- |
| HDMI_OPTION_WAKEUP | When false, Image View On/Text View On and other wakeup messages do not wake the system. This switch has no practical effect in the source version because CEC system wakeup is not implemented. |
| HDMI_OPTION_ENABLE_CEC | Master CEC switch. When false, HAL neither sends nor receives CEC messages. Controlled by the CEC master switch in Settings. |
| HDMI_OPTION_SYSTEM_CEC_CONTROL | Set false on suspend and true on resume. False means Android stops handling reported CEC messages and low-level software takes over. It currently has no practical effect; future CEC wakeup support may use it. |

allocateLogicalAddress:

Primarily allocates the logical address.

(1) Calls HAL hdmi_cec_send_message to send POLL messages. If all attempts receive NACK, that address is selected. The attempt count is HdmiConfig.ADDRESS_ALLOCATION_RETRY.

(2) Calls HAL hdmi_cec_add_logical_address to pass the selected address to the driver.

(3) After allocation, onAddressAllocated sends several CEC messages, including ReportPhysicalAddress.

This creates a flow mismatch. CEC logical-address allocation requires POLL messages: NACK means the address is unoccupied and may be selected.

Android FRAMEWORK calls HAL hdmi_cec_send_message to send several POLL messages directly. If none is acknowledged, it selects the address and only then passes it to the driver. The kernel CEC driver instead requires initialization/configuration first, completes allocation through IOCTL CEC_ADAP_S_PHYS_ADDR as described by the source, and reports the address upward. Before that it forbids direct send_message POLL transmission. The source's later detailed flow uses CEC_ADAP_S_LOG_ADDRS; this distinction is retained for verification.

The HAL adapts these different flows. When FRAMEWORK requests a POLL through hdmi_cec_send_message, HAL queries the kernel address with CEC_ADAP_G_LOG_ADDRS. If no address is assigned (CEC_LOG_ADDR_INVALID), it allocates one through CEC_ADAP_S_LOG_ADDRS. If the kernel's address matches the requested POLL address, HAL returns NACK; otherwise it returns success. FRAMEWORK then polls the next address until its selection matches the kernel's.

Kernel CEC initialization flow:

![Technical figure from the Chinese source, p. 21](/docs/rockchip-hdmi-cec/assets/cn-p21-1.png)

HAL invokes cec_adap_s_log_addrs through IOCTL CEC_ADAP_S_LOG_ADDRS.

cec_claim_log_addrs starts cec_config_thread_func and waits for completion with wait_for_completion(&adap->config_completion).

```text
static void cec_claim_log_addrs(struct cec_adapter *adap, bool block)
{

   if (WARN_ON(adap->is_configuring || adap->is_configured))
      return;
   init_completion(&adap->config_completion);

   /* Ready to kick off the thread */

   adap->is_configuring = true;
   adap->kthread_config = kthread_run(cec_config_thread_func, adap,
                 "ceccfg-%s", adap->name);
   if (IS_ERR(adap->kthread_config)) {
      adap->kthread_config = NULL;
   } else if (block) {
      mutex_unlock(&adap->lock);
      wait_for_completion(&adap->config_completion);
      mutex_lock(&adap->lock);
   }
}
```

cec_config_thread_func queues and transmits POLL through cec_transmit_msg_fh. If no acknowledgement is received, it allocates that address.

The adap->ops->adap_log_addr callback invokes dw_hdmi_cec_log_addr to write the assigned address into CEC registers.

Initialization is now complete (adap->is_configured=true). cec_post_state_event reports the driver-state change upward.

cec_msg_report_physical_addr creates a report physical addr message, queues it and transmits it.

complete(&adap->config_completion) wakes the thread waiting for configuration.

#### 2.3.2 Transmitting CEC messages

Upper-layer transmission is straightforward: call sendCecCommand, as shown.

![Technical figure from the Chinese source, p. 22](/docs/rockchip-hdmi-cec/assets/cn-p22-1.png)

For the HdmiCecMessage parameter of sendCecCommand, see:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecMessageBuilder.java
```

Kernel flow:

![Technical figure from the Chinese source, p. 23](/docs/rockchip-hdmi-cec/assets/cn-p23-1.png)

HAL finally invokes the driver's cec_transmit through IOCTL CEC_TRANSMIT.

```text
static long cec_transmit(struct cec_adapter *adap, struct cec_fh *fh,
         bool block, struct cec_msg __user *parg)
{

   struct cec_msg msg = {};
   long err = 0;

   if (!(adap->capabilities & CEC_CAP_TRANSMIT))
      return -ENOTTY;
   if (copy_from_user(&msg, parg, sizeof(msg)))
      return -EFAULT;

   /* A CDC-Only device can only send CDC messages */
   if ((adap->log_addrs.flags & CEC_LOG_ADDRS_FL_CDC_ONLY) &&
      (msg.len == 1 || msg.msg[1] != CEC_MSG_CDC_MESSAGE))
      return -EINVAL;


   mutex_lock(&adap->lock);
   if (adap->log_addrs.num_log_addrs == 0)
      err = -EPERM;
   else if (adap->is_configuring)
      err = -ENONET;
   else if (!adap->is_configured &&
      (adap->needs_hpd || msg.msg[0] != 0xf0))
      err = -ENONET;
   else if (cec_is_busy(adap, fh))
      err = -EBUSY;
   else
      err = cec_transmit_msg_fh(adap, &msg, fh, block);
   mutex_unlock(&adap->lock);
   if (err)

      return err;
   if (copy_to_user(parg, &msg, sizeof(msg)))
      return -EFAULT;
   return 0;
}
```

A series of checks first determines whether the driver can send a message. cec_transmit_msg_fh then adds it to the pending-transmit queue. Message structure:

```text
struct cec_msg {
      __u64 tx_ts;

      __u64 rx_ts;
      __u32 len;
      __u32 timeout;
      __u32 sequence;
      __u32 flags;
      __u8 msg[CEC_MAX_MSG_SIZE];
      __u8 reply;
      __u8 rx_status;
      __u8 tx_status;
      __u8 tx_arb_lost_cnt;
      __u8 tx_nack_cnt;
      __u8 tx_low_drive_cnt;
      __u8 tx_error_cnt;

};
```

Structure fields:

| Name | Description |
| --- | --- |
| tx_ts | Nanosecond timestamp set after transmission completes. |
| rx_ts | Nanosecond timestamp set after reception completes. |
| len | Message length. |
| sequence | Framework-assigned transmit sequence number, used to trace replies to earlier messages. |
| msg | Stores the CEC message payload. |
| reply | TX only: nonzero requests waiting for a reply, e.g. give device power status expects report power status. The source implementation always sets 0 and does not wait for replies inside the driver. |
| rx_status | Receive status set after completion: CEC_RX_STATUS_OK, CEC_RX_STATUS_TIMEOUT, CEC_RX_STATUS_FEATURE_ABORT. |
| tx_status | Transmit status set after completion: CEC_TX_STATUS_OK, CEC_TX_STATUS_ARB_LOST, CEC_TX_STATUS_NACK, CEC_TX_STATUS_LOW_DRIVE, CEC_TX_STATUS_ERROR, CEC_TX_STATUS_MAX_RETRIES. |
| tx_arb_lost_cnt | Arbitration Lost error count after transmission. |
| tx_nack_cnt | Not Acknowledged error count after transmission. |
| tx_low_drive_cnt | Low Drive Detected error count after transmission. |
| tx_error_cnt | Error count after transmission. |

cec_thread_func manages the transmission queue. When no message is being transmitted, it waits for new messages.

```text
wait_event_interruptible(adap->kthread_waitq,
  kthread_should_stop ||
  (!adap->transmitting &&

   !list_empty(&adap->transmit_queue)));
```

After cec_transmit_msg_fh queues a message, it wakes cec_thread_func if no transmission is active. Otherwise the message waits in the queue until the current transmission completes.

```text
if (fh)
   list_add_tail(&data->xfer_list, &fh->xfer_list);
list_add_tail(&data->list, &adap->transmit_queue);
adap->transmit_queue_sz++;
if (!adap->transmitting)

   wake_up_interruptible(&adap->kthread_waitq);

/* All done if we don't need to block waiting for completion */
if (!block)
   return 0;

/*
* If we don't get a completion before this time something is really
* wrong and we time out.
*/
timeout = CEC_XFER_TIMEOUT_MS;
/* Add the requested timeout if we have to wait for a reply as well */

if (msg->timeout)
   timeout += msg->timeout;

/*
* Release the lock and wait, retake the lock afterwards.
*/
mutex_unlock(&adap->lock);
res = wait_for_completion_killable_timeout(&data->c,
                msecs_to_jiffies(timeout));
mutex_lock(&adap->lock);

if (data->completed) {
   /* The transmit completed (possibly with an error) */

   *msg = data->msg;
   kfree(data);
   return 0;
}
```

The adap->ops->adap_transmit callback calls dw_hdmi_cec_transmit to program CEC registers and start transmission.

When transmission ends, a CEC interrupt occurs. dw_hdmi_cec_hardirq reads registers and records success or the error type in tx_status.

cec_transmit_done_ts collects errors and retries according to attempts if necessary. With no error, cec_data_completed finishes the transmission and wakes cec_thread_func for the next message.

#### 2.3.3 Receiving CEC messages

![Technical figure from the Chinese source, p. 27](/docs/rockchip-hdmi-cec/assets/cn-p27-1.png)

An incoming CEC message triggers an interrupt. dw_hdmi_cec_hardirq reads CEC RX DATA registers to obtain it.

cec_received_msg_ts checks whether the received message is usable.

Unless passthrough mode is enabled, cec_receive_notify automatically replies according to CEC. The source implementation always uses passthrough, so it queues the received message with cec_queue_msg_fh and wakes poll_wait to notify userspace.

```text
 */
static void cec_queue_msg_fh(struct cec_fh *fh, const struct cec_msg *msg)

{
   static const struct cec_event ev_lost_msgs = {
      .event = CEC_EVENT_LOST_MSGS,
      .lost_msgs.lost_msgs = 1,
   };
   struct cec_msg_entry *entry;

   mutex_lock(&fh->lock);
   entry = kmalloc(sizeof(*entry), GFP_KERNEL);
   if (entry) {
      entry->msg = *msg;
      /* Add new msg at the end of the queue */
      list_add_tail(&entry->list, &fh->msgs);


      if (fh->queued_msgs < CEC_MAX_MSG_RX_QUEUE_SZ) {
         /* All is fine if there is enough room */
         fh->queued_msgs++;
         mutex_unlock(&fh->lock);
         wake_up_interruptible(&fh->wait);
         return;
      }
      /*
      * if the message queue is full, then drop the oldest one and

      * send a lost message event.
      */
      entry = list_first_entry(&fh->msgs, struct cec_msg_entry, list);
      list_del(&entry->list);
      kfree(entry);
   }
   mutex_unlock(&fh->lock);

   /*
   * We lost a message, either because kmalloc failed or the queue
   * was full.
   */

   cec_queue_event_fh(fh, &ev_lost_msgs, ktime_get_ns);
}
```

When HAL's event-monitoring thread uevent_loop receives the message event, it fetches queued messages through IOCTL CEC_RECEIVE.

![Technical figure from the Chinese source, p. 28](/docs/rockchip-hdmi-cec/assets/cn-p28-1.png)

FRAMEWORK passes received messages upward through the layers; onMessage finally dispatches each opcode to its corresponding handler, as illustrated.

#### 2.3.4 CEC event handling

The driver reports state changes through these event types:

| Name | Description |
| --- | --- |
| CEC_EVENT_STATE_CHANGE | Adapter state changed, e.g. configured to unconfigured. |
| CEC_EVENT_LOST_MSGS | Messages lost because the receive queue was not read in time. |
| CEC_EVENT_PIN_CEC_LOW | CEC pin becomes low; unused in the source version. |
| CEC_EVENT_PIN_CEC_HIGH | CEC pin becomes high; unused in the source version. |
| CEC_EVENT_PIN_HPD_LOW | Source says HPD becomes high, normally HDMI plug-in. This conflicts with the LOW event name; retained pending verification. |
| CEC_EVENT_PIN_HPD_HIGH | Source says HPD becomes low, normally HDMI unplug. This conflicts with the HIGH event name; retained pending verification. |

HDMI hotplug example:

![Technical figure from the Chinese source, p. 29](/docs/rockchip-hdmi-cec/assets/cn-p29-1.png)

HDMI plug/unplug triggers an HDMI interrupt, which calls cec_queue_pin_hpd_event to create an HPD CEC event.

cec_queue_event_fh queues the event and wakes poll_wait to report it.

HAL invokes cec_dqevent through IOCTL CEC_DQEVENT to fetch the event and complete notification.

![Technical figure from the Chinese source, p. 30](/docs/rockchip-hdmi-cec/assets/cn-p30-1.png)

HAL handles different event types separately; HPD continues upward.

onHotplug performs final handling. For plug-in it calls allocateLogicalAddress to reallocate the logical address, following essentially §2.3.1.2 (the source incorrectly refers to §2.2.1.2).

### 2.4 Interfaces for adding CEC features

Android's original code already supports many CEC features. Use the following interfaces to add unsupported features:

Initiating a CEC message:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiControlService.java
```

```text
   /**
   * Transmit a CEC command to CEC bus.
   *

   * @param command CEC command to send out
   * @param callback interface used to the result of send command
   */
   @ServiceThreadOnly
   void sendCecCommand(HdmiCecMessage command, @Nullable SendMessageCallback
callback) {
      assertRunOnServiceThread;
      if (mMessageValidator.isValid(command) == HdmiCecMessageValidator.OK) {
         mCecController.sendCommand(command, callback);
      } else {
         HdmiLogger.error("Invalid message type:" + command);
         if (callback != null) {

           callback.onSendCompleted(SendMessageResult.FAIL);
         }
      }
   }

   @ServiceThreadOnly
   void sendCecCommand(HdmiCecMessage command) {
      assertRunOnServiceThread;
      sendCecCommand(command, null);
}
```

Create the HdmiCecMessage command parameter through the corresponding interface at:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecMessageBuilder.java
```

```text
  @Override
   @ServiceThreadOnly
   protected void onStandby(boolean initiatedByCec, int standbyAction) {

      assertRunOnServiceThread;
      if (!mService.isControlEnabled || initiatedByCec || !mAutoTvOff) {
         return;
      }
      switch (standbyAction) {
         case HdmiControlService.STANDBY_SCREEN_OFF:
           Slog.e(TAG, "send standby eee");
           /* cec cts specification requires that standby message must be
broadcast */
           mService.sendCecCommand(
                 HdmiCecMessageBuilder.buildStandby(mAddress,
Constants.ADDR_BROADCAST));
           break;

         case HdmiControlService.STANDBY_SHUTDOWN:
           // ACTION_SHUTDOWN is taken as a signal to power off all the
devices.
           mService.sendCecCommand(
                 HdmiCecMessageBuilder.buildStandby(mAddress,
Constants.ADDR_BROADCAST));
           break;
      }
}
```

To have the box put the TV into standby, CEC requires a standby message. The example calls sendCecCommand with a message created by HdmiCecMessageBuilder.buildStandby.

Adding CEC message handling:

The system already receives and reports messages. If it lacks a handler for an incoming message, add one. Received messages reach onMessage, where message.getOpcode obtains the opcode and handlexxxxx functions handle corresponding messages.

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevice.java
```

```text
@ServiceThreadOnly
 protected final boolean onMessage(HdmiCecMessage message) {
    assertRunOnServiceThread;

    if (dispatchMessageToAction(message)) {
   return true;
}
switch (message.getOpcode) {

   case Constants.MESSAGE_ACTIVE_SOURCE:
      return handleActiveSource(message);
   case Constants.MESSAGE_INACTIVE_SOURCE:
      return handleInactiveSource(message);
   case Constants.MESSAGE_REQUEST_ACTIVE_SOURCE:
      return handleRequestActiveSource(message);
   case Constants.MESSAGE_GET_MENU_LANGUAGE:
      return handleGetMenuLanguage(message);
   case Constants.MESSAGE_SET_MENU_LANGUAGE:
      return handleSetMenuLanguage(message);
   case Constants.MESSAGE_GIVE_PHYSICAL_ADDRESS:
      return handleGivePhysicalAddress;

   case Constants.MESSAGE_GIVE_OSD_NAME:
      return handleGiveOsdName(message);
   case Constants.MESSAGE_GIVE_DEVICE_VENDOR_ID:
      return handleGiveDeviceVendorId;
   case Constants.MESSAGE_GET_CEC_VERSION:
      return handleGetCecVersion(message);
   case Constants.MESSAGE_REPORT_PHYSICAL_ADDRESS:
      return handleReportPhysicalAddress(message);
   case Constants.MESSAGE_ROUTING_CHANGE:
      return handleRoutingChange(message);
   case Constants.MESSAGE_ROUTING_INFORMATION:
      return handleRoutingInformation(message);
   case Constants.MESSAGE_INITIATE_ARC:

      return handleInitiateArc(message);
   case Constants.MESSAGE_TERMINATE_ARC:
      return handleTerminateArc(message);
   case Constants.MESSAGE_SET_SYSTEM_AUDIO_MODE:
      return handleSetSystemAudioMode(message);
   case Constants.MESSAGE_SYSTEM_AUDIO_MODE_STATUS:
      return handleSystemAudioModeStatus(message);
   case Constants.MESSAGE_REPORT_AUDIO_STATUS:
      return handleReportAudioStatus(message);
   case Constants.MESSAGE_STANDBY:
      return handleStandby(message);
   case Constants.MESSAGE_TEXT_VIEW_ON:

      return handleTextViewOn(message);
   case Constants.MESSAGE_IMAGE_VIEW_ON:
      return handleImageViewOn(message);
   case Constants.MESSAGE_USER_CONTROL_PRESSED:
      return handleUserControlPressed(message);
   case Constants.MESSAGE_USER_CONTROL_RELEASED:
      return handleUserControlReleased;
   case Constants.MESSAGE_SET_STREAM_PATH:
      return handleSetStreamPath(message);
   case Constants.MESSAGE_GIVE_DEVICE_POWER_STATUS:
      return handleGiveDevicePowerStatus(message);
   case Constants.MESSAGE_MENU_REQUEST:
      return handleMenuRequest(message);

   case Constants.MESSAGE_MENU_STATUS:
      return handleMenuStatus(message);
   case Constants.MESSAGE_VENDOR_COMMAND:
        return handleVendorCommand(message);
      case Constants.MESSAGE_VENDOR_COMMAND_WITH_ID:
        return handleVendorCommandWithId(message);

      case Constants.MESSAGE_SET_OSD_NAME:
        return handleSetOsdName(message);
      case Constants.MESSAGE_RECORD_TV_SCREEN:
        return handleRecordTvScreen(message);
      case Constants.MESSAGE_TIMER_CLEARED_STATUS:
        return handleTimerClearedStatus(message);
      case Constants.MESSAGE_REPORT_POWER_STATUS:
        return handleReportPowerStatus(message);
      case Constants.MESSAGE_TIMER_STATUS:
        return handleTimerStatus(message);
      case Constants.MESSAGE_RECORD_STATUS:
        return handleRecordStatus(message);

      default:
        return false;
   }
}
```

Therefore, add the corresponding handler to the switch to support a new CEC message.

## 3. Common debugging methods

When CEC does not work correctly, debug in this order:

Run the debug script to capture debug-node state and logs.

Use node state to verify correct initialization and normal operation.

Inspect kernel logs to confirm successful CEC transmission/reception.

Inspect Android logs to verify correct feature handling.

### 3.1 Debug script

CEC debug script:

```text
#!/system/bin/sh

log ************start cec debug script**************

echo 2 > sys/module/cec/parameters/debug

if [ -f "/data/cec_status.txt" ]
then
rm /data/cec_status.log
fi

if [ -f "/data/cec_log.txt" ]
then
rm /data/cec_log.txt
fi
cat /sys/kernel/debug/cec/cec0/status >> /data/cec_status.txt
cat /sys/kernel/debug/dw-hdmi/ctrl >> /data/cec_status.txt


logcat -b all -f /data/cec_log.txt
```

Usage:

Push cec_debug.sh into /system/bin.

Run ./system/bin/cec_debug.sh before reproducing the failure; the source's relative path is retained.

The log marker ****start cec debug script****** identifies when the script starts.

Perform the operations that reproduce the failure.

CEC debug-node state is saved to /data/cec_status.txt.

Synchronized kernel and logcat output is saved to /data/cec_log.txt.

#### 3.1.1 Understanding logs

The script captures debug-node states and logs. Node details are in §3.1.2. Focus on these three log categories:

Messages containing cec-dw_hdmi are kernel logs:

```text
04-11 11:44:50.969 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 44
```

Capture them manually with:

```text
dmesg | grep cec-dw_hdmi
```

Messages containing hdmicec are HAL logs:

```text
04-11 12:39:59.015 281 281 I hdmicec : hdmi_cec_set_option: system_control:
value: 0
```

Capture them manually with:

```text
logcat | grep hdmicec
```

Messages containing Hdmi are framework logs:

```text
04-11 11:44:50.565 391 494 W HdmiCecController: Failed to send <Give Device
Power Status> src: 4, dst: 0 with errorCode=-1
```

Capture them manually with:

```text
logcat | grep Hdmi
```

See §3.2 for log-analysis examples.

#### 3.1.2 CEC debug nodes

CEC status debug-node path:

```text
/sys/kernel/debug/cec/cec0/status
```

Reading it with cat produces:

![Technical figure from the Chinese source, p. 35](/docs/rockchip-hdmi-cec/assets/cn-p35-1.png)

```text
configured: 0
configuring: 0
phys_addr: f.f.f.f
number of LAs: 1
LA mask: 0x0000
has CEC follower (in passthrough mode)
pending transmits: 0
```

Parameter descriptions:

| Name | Description |
| --- | --- |
| configured | 1: correctly configured. 0: not correctly configured. |
| configuring | 1: configuration in progress. 0: not started or completed. |
| phys_addr | Physical address read from TV EDID. f.f.f.f means uninitialized CEC or failure to obtain an address. |
| LA mask | Logical-address mask: 0x0000 before initialization. The shift giving 0x1 identifies the address; e.g. 0x0010 >> 4 = 0x1 means logical address 0x4. |
| has CEC follower (in passthrough mode) | The CEC driver does not handle messages directly. |
| pending transmits | Number of CEC messages awaiting transmission. |

HDMI controller register node:

```text
/d/dw-hdmi/ctrl
```

cat on this node displays HDMI controller registers. Inspect the CEC-related registers and consult the HDMI controller datasheet for definitions.

#### 3.1.3 Enabling CEC kernel logs

```text
echo 2 > /sys/module/cec/parameters/debug
```

Enable CEC message TX/RX logs.

```text
echo 1 > /sys/module/cec/parameters/debug
```

Enable other CEC logs.

### 3.2 Troubleshooting common failures

#### 3.2.1 All CEC functions fail

Perform these checks even when only some CEC functions fail.

Verify that the CEC switch under Settings/Input is enabled.

Look for hdmi_cec_device_open open error! in logs and run ls -l /dev/cec0.

```text
130|rk3328_box:/ # ls -l /dev/cec0

crw-rw---- 1 system system 250, 0 2016-01-21 08:50 /dev/cec0
```

Verify that cec0 permissions are at least those shown. If insufficient, check for the following change:

```text
diff --git a/ueventd.rockchip.rc b/ueventd.rockchip.rc
index a7d1356..9eb824d 100755

--- a/ueventd.rockchip.rc
+++ b/ueventd.rockchip.rc
@@ -96,6 +96,7 @@

 #for hdmi cec
 /dev/cec 0666 system system
+/dev/cec0 0660 system system
 #sofia
 /dev/dcc 0666 system system
 /dev/pmem_gfx 0666 system system
```

Check /sys/kernel/debug/cec/cec0/status for normal state (§3.1.2; the source refers to §3.1.1 and splits the word status). Typical failures follow:

(1) phys_addr=f.f.f.f: verify EDID reading and TV CEC support. (2) LA mask=0x0000: logical-address allocation failed. First look for:

```text
04-11 08:56:51.764 296 296 E hdmicec : can't make kernel addr done
```

If present, verify correct EDID reading. Otherwise look for:

```text
04-11 08:56:51.764 296 296 D hdmicec : kernel logic addr:ff, preferred logic
addr:04
04-11 08:56:51.764 296 296 I hdmicec : kernel logaddr is not existing

04-11 08:56:51.764 296 296 D hdmicec : set_kernel_logical_address, logic
addr:04
```

logic addr need not be 04 but must be one of 04, 08 or 0b. If this log is absent, trace the code at:

```text
Hardware/rockchip/hdmicec/hdmi_cec.cpp
```

Once the above log is present, check for:

```text
04-11 08:35:37.297 0 0 I cec-dw_hdmi: new physical address 3.0.0.0
04-11 08:35:37.297 0 0 I cec-dw_hdmi: physical address: 3.0.0.0, claim 1

logical addresses
```

If absent, trace cec_adap_s_log_addrs at:

```text
Kernel/drivers/media/cec/cec-api.c
```

Then check these logs. 44 in the first line is the POLL address; it may also be 88 or bb, and logs for all three can occur. Check the number of CEC devices connected to the TV against the addresses; see the HDMI specification's CEC chapter for the full process. Inspect status in the second line. If the address is confirmed free but status is not 04 (NACK), analyze HDMI controller registers together with the CEC waveform.

```text
04-11 08:35:37.297 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 44
04-11 08:35:37.326 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 04
```

#### 3.2.2 TV enters standby but the box stays awake

Android disables CEC-triggered box standby by default. Set persist.sys.hdmi.keep_awake to false, or change its default to false as follows:

```text
diff --git
--- a/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java

+++ b/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java
@@ -210,7 +210,7 @@
   private ActiveWakeLock getWakeLock {
      assertRunOnServiceThread;
      if (mWakeLock == null) {
-        if (SystemProperties.getBoolean(Constants.PROPERTY_KEEP_AWAKE,
true)) {
+        if (SystemProperties.getBoolean(Constants.PROPERTY_KEEP_AWAKE,
false)) {
            mWakeLock = new SystemWakeLock;
         } else {
            // Create a dummy lock object that doesn't do anything about
wake lock,
```

Check the captured logs to see whether the box received standby (0x36):

```text
[ 3465.670484] cec-dw_hdmi: cec_received_msg_ts: 0f 36
[ 3465.670617] cec-dw_hdmi: cec_receive_notify: 0f 36
01-21 09:47:47.675 0 0 I cec-dw_hdmi: cec_received_msg_ts: 0f 36

04-11 09:16:32.963 299 342 D hdmicec : poll revent:41
01-21 09:47:47.675 0 0 I cec-dw_hdmi: cec_receive_notify: 0f 36
04-11 09:16:32.963 299 342 D hdmicec : poll receive msg
04-11 09:16:32.963 299 342 D hdmicec : poll receive msg[0]:0f
04-11 09:16:32.963 299 342 D hdmicec : poll receive msg[1]:36
```

If not, use an oscilloscope on the CEC bus to verify that the TV actually transmitted standby.

#### 3.2.3 Box enters standby but the TV stays awake

If this happens immediately after turning on the TV, wait 15 seconds and try again. Some TVs ignore standby messages briefly after power-on.

Check these logs to verify the standby flow:

```text
04-11 08:37:13.823 394 394 V HdmiControlService: On standby-action cleared:4
04-11 08:37:13.823 394 394 V HdmiControlService: onStandbyCompleted

04-11 08:37:13.927 296 296 I hdmicec : send msg LEN:2,opcode:36,addr:4f
```

If absent or only the first two lines appear, trace the code at:

```text
frameworks/base/services/core/java/com/android/server/hdmi/HdmiControlService.java
```

Next check these logs to confirm successful standby-message transmission:

```text
04-11 08:37:13.928 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 4f 36
04-11 08:37:13.991 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 01
```

If absent, verify that hdmi_cec_send_message at the following path is called correctly and successfully invokes IOCTL CEC_TRANSMIT:

```text
Hardware/rockchip/hdmicec/hdmi_cec.cpp
```

If both logs appear but cec_transmit_done_ts status is not 01, a CEC bus error occurred during transmission. Analyze HDMI controller registers and CEC signals together.

#### 3.2.4 Box wakes but the TV does not

Verify normal box resume and check CEC initialization as in §3.2.1.

Check whether the CEC wakeup message was sent successfully:

```text
04-11 09:27:37.540 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 40 0d
04-11 09:27:37.593 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 01
04-11 09:27:37.594 0 0 I cec-dw_hdmi: cec_transmit_msg_fh: 4f 82 30 00

04-11 09:27:37.707 0 0 I cec-dw_hdmi: cec_transmit_done_ts: status 01
```

If both logs appear but transmission fails (status is not 01), analyze HDMI controller registers and CEC signals. If absent, trace the ActiveSource and TextViewOn transmission flow starting at onAddressAllocated in:

```text
Frameworks/base/services/core/java/com/android/server/hdmi/HdmiCecLocalDevicePlayback.java
```

#### 3.2.5 TV remote cannot control the box UI

TV brands and models differ substantially, so there is no universal fix. The following experience-based suggestions may not apply to every TV.

Check for a dedicated CEC input source. Some Samsung TVs require switching to the Anynet input for this function.

After the TV reaches a stable running state, send ActiveSource, for example through the system onetouchplay interface:

```text
Frameworks/base/services/core/java/com/android/server/hdmi/OneTouchPlayAction.java
```

## 4. References

HDMISpecification1_4b.pdf

RockchipAndroid5.x_HDMI_CEC_软件说明.doc (source filename)

[HDMI-CEC control service (Android documentation)](https://source.android.google.cn/devices/tv/hdmi-cec)

{% endraw %}

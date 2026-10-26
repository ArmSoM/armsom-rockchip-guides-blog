---

title: "Rockchip Linux 4.4 Camera Troubleshooting"

description: "Rockchip Linux 4.4 Camera Troubleshooting · V1.0.1"

excerpt: "Rockchip Linux 4.4 Camera Troubleshooting"

translation_key: 185-rockchip-linux44-camera-troubleshooting

slug: 185-rockchip-linux44-camera-troubleshooting

lang: en

date: "2026-10-24"

category: camera

tags: [ArmSoM, Rockchip, Camera, ISP, Linux]

---



{% raw %}



Platform reference: vendor V1.0.1, RK3xxx; Linux 4.4+. Camera drivers, sensor integration, capture and debugging are covered in the complete technical chapters below. Specific ArmSoM board/BSP/SDK/kernel combinations are unverified: check schematics, interfaces, power/clocks, drivers and IQ files. Examples and measurements are vendor material, not ArmSoM tests; no hardware commands were executed. ZH uses Chinese original figures; EN/RU/DE use English originals.



[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)



<!-- en PDF p.5; unit 0 -->

## 1. Whether the Sensor is Lighted up

<!-- en PDF p.5; unit 1 -->

### 1.1 Sensor ID Cannot be Recognized, I2C Communication

<!-- en PDF p.5; unit 2 -->

Fails

<!-- en PDF p.5; unit 3 -->

If sensor ID is not recognized, it has nothing to do with RKISP or RKCIF, but the sensor power-on sequence does not meet the requirements. Please check the following items in orders:

<!-- en PDF p.5; unit 4 -->

1. Is the 7-bits i2c slave id of the sensor correct? Is it written as 8-bits by mistake?

<!-- en PDF p.5; unit 5 -->

2. Whether the 24M mclk has output and whether the voltage amplitude is correct?

<!-- en PDF p.5; unit 6 -->

3. Whether the power-on sequence of the sensor meets the requirements, including avdd, dovdd, dvdd, power down, reset, etc.

<!-- en PDF p.5; unit 7 -->

#### 1.1.1 What is 7-bits Address

<!-- en PDF p.5; unit 8 -->

The least significant bit (LSB) of the 8bits represents R/W, and the higher 7bits is i2c slave id we needed.

<!-- en PDF p.5; unit 9 -->

#### 1.1.2 The 24M mclk and vdd Power Supply Cannot be Detected After

<!-- en PDF p.5; unit 10 -->

Power on

<!-- en PDF p.5; unit 11 -->

In the implementation of sensor driver, mclk and power are generally turned on only when needed, so mclk and power are turned off by default after booting. When debugging, you can comment out the implementation of the power_off() function in driver, so that it will not be powered off and is convenient for measurement.

<!-- en PDF p.5; unit 12 -->

#### 1.1.3 The 24M mclk Still Cannot be Detected

<!-- en PDF p.5; unit 13 -->

When using an oscilloscope, check whether the bandwidth of the oscilloscope is sufficient. A bandwidth of at least 48M is recommended.

<!-- en PDF p.5; unit 14 -->

1. When sensor does not open mclk correctly, please refer to the operation of mclk in drivers/media/i2c/ov5695.c .

<!-- en PDF p.5; unit 15 -->

2. When the gpio is occupied by other modules, there will be some tips in kernel log. You can also use io command to check whether the pin-ctrl register setting is correct.

<!-- en PDF p.6; unit 16 -->

#### 1.1.4 There is a mclk, But the Voltage Amplitude is Wrong and Different

<!-- en PDF p.6; unit 17 -->

from Actual Power Domain

<!-- en PDF p.6; unit 18 -->

This is due to a misconfiguration of io-domains. Generally, the voltage of io-domains is 1.8v or

<!-- en PDF p.6; unit 19 -->

3.3v, depending on your schematic design. Check the schematic diagram and modify io-domains accordingly, such as:

<!-- en PDF p.6; unit 20 -->

```text
&io_domains {
    status = "okay";

    vccio1-supply = <&vcc1v8_soc>;
    vccio2-supply = <&vccio_sd>;
    vccio3-supply = <&vcc1v8_dvp>;
    vccio4-supply = <&vcc_3v0>;
    vccio5-supply = <&vcc_3v0>;
};
```

<!-- en PDF p.6; unit 21 -->

In the above example, the io port of vccio3 is powered by vcc1v8_dvp, and its power domain is

<!-- en PDF p.6; unit 22 -->

1.8v, so the detected mclk should also be 1.8v. During the boot process, io_domains may be initialized later than sensor. When sensor id reading fails, try to retry several times, as follows:

<!-- en PDF p.6; unit 23 -->

```text
diff --git a/drivers/media/i2c/ov7251.c b/drivers/media/i2c/ov7251.c
index e0c608f..7842812 100644
--- a/drivers/media/i2c/ov7251.c
+++ b/drivers/media/i2c/ov7251.c
@@ -961,7 +961,8 @@ static int ov7251_check_sensor_id(struct ov7251 *ov7251,
                              OV7251_REG_VALUE_16BIT, &id);
        if (id != CHIP_ID) {
                dev_err(dev, "Unexpected sensor id(%06x), ret(%d)\n", id, ret);
-               return -ENODEV;
+               return -EPROBE_DEFER;
        }
```

<!-- en PDF p.6; unit 24 -->

If io_domains has not been initialized when sensor is initialized, then io_domains will use the default value. If the default value is different from the actual hardware power domain, the voltage of mclk will not meet expectations. Returning -EPROBE_DEFER at this time will let sensor try probe again in the later boot process.

<!-- en PDF p.6; unit 25 -->

#### 1.1.5 Check Whether the Power-on Sequence of Sensor Meets the

<!-- en PDF p.6; unit 26 -->

Requirements

<!-- en PDF p.6; unit 27 -->

The datasheet of a sensor generally describes the power-on sequence and interval requirements of each power supply in details. Please check if it meets the requirements by an oscilloscope. There is no time sequence requirement for power supply vdd of some sensors, such as ov5695, which may use regulator_bulk to manage the power supply in its driver; but some sensors have sequential requirements, such as ov2685.c, which uses multiple regulators to control separately in driver. such as avdd_regulator , dovdd_regulator . Please choose accordingly.

<!-- en PDF p.7; unit 28 -->

### 1.2 What are the Default Values of exp_def , hts_def , and

<!-- en PDF p.7; unit 29 -->

vts_def in Sensor Driver

<!-- en PDF p.7; unit 30 -->

If you have the contact information of the sensor vendor, please contact them to get. Otherwise, please find the corresponding register from the datasheet and find the value configured during initialization from the register list. Take ov2685.c as an example:

<!-- en PDF p.7; unit 31 -->

```text
#define OV2685_REG_VTS                  0x380e

...

        {0x380e, 0x05},
        {0x380f, 0x0e},

...

                .vts_def = 0x050e,
```

<!-- en PDF p.7; unit 32 -->

The 0x380e and 0x380f are vts corresponding registers. The value configured during initialization is 0x050e, then vts_def is 0x050e. The exp and hts use default values and can be found directly from the datasheet. If you don't like application to adjust exposure and frame rate, exp, hts, vts are not needed . Generally, a sensor in RAW format requires these three parameters.

<!-- en PDF p.7; unit 33 -->

### 1.3 What Should be link_freq and pixel_rate Values

<!-- en PDF p.7; unit 34 -->

The link_freq refers to the actual frequency of MIPI clk. Note that it is not 24M mclk, but MIPI dn/dp clk. Check from the vendor first, or find whether the datasheet has relevant parameters. Generally, the actual value of link_freq will not be less than the calculation result of the following formula with unit is (Hz)

<!-- en PDF p.7; unit 35 -->

```text
width * height * fps * bits_per_pixel / lanes / 2
```

<!-- en PDF p.7; unit 36 -->

If you really don’t know the actual value of link_freq , you can measure by an oscilloscope. The pixel_rate refers to the number of pixels transmitted per second. After link_freq is determined, the following formula can be used to calculate:

<!-- en PDF p.7; unit 37 -->

```text
link_freq * 2 * lanes / bits_per_pixel
```

<!-- en PDF p.7; unit 38 -->

### 1.4 How to Make Sure a Sensor is Lighted Up

<!-- en PDF p.7; unit 39 -->

Firstly, the sensor id can be recognized, that is, there should be no abnormalities in the reading and writing of i2c. At this time, the detailed information of the sensor such as the name and resolution should be able to checked by media-ctl -p -d /dev/media0 .

<!-- en PDF p.8; unit 40 -->

Secondly, when upper layer captures pictures, MIPI must be able to output data without reporting MIPI/ISP errors, and application layer can receive frames.

<!-- en PDF p.8; unit 41 -->

### 1.5 Sensor AVL List

<!-- en PDF p.8; unit 42 -->

RGB sensor AVL is located at https://redmine.rockchip.com.cn/projects/rockchip_camera_module_ support_list/camera. The detailed information of sensor modules are shown in the support list. If it is other non-RGB sensor, such as YUV sensor, you can directly find the drivers/media/i2c/ directory of the kernel source code. The drivers have all been tuned by Rockchip.

<!-- en PDF p.8; unit 43 -->

## 2. MIPI/ISP Abnormal

<!-- en PDF p.8; unit 44 -->

In the early stage of sensor tunning, the following problems maybe frequently encountered:

<!-- en PDF p.8; unit 45 -->

1. No frame data is received, and no error is reported by ISP/MIPI

<!-- en PDF p.8; unit 46 -->

2. Keep printing MIPI errors log

<!-- en PDF p.8; unit 47 -->

3. ISP reports PIC_SIZE_ERROR

<!-- en PDF p.8; unit 48 -->

4. MIPI errors occasionally

<!-- en PDF p.8; unit 49 -->

5. MIPI keeps reporting errors until it crashes

<!-- en PDF p.8; unit 50 -->

### 2.1 What Parameters Need to be Set in MIPI

<!-- en PDF p.8; unit 51 -->

There are 4 parameters need to been set in MIPI communication between sensor and ISP, please confirm the correctness of the 4 MIPI parameters.

<!-- en PDF p.8; unit 52 -->

1. Resolution of sensor output

<!-- en PDF p.8; unit 53 -->

2. The image format output from sensor is YUV or RGB RAW, 8-bits, 10-bits, or 12-bits

<!-- en PDF p.8; unit 54 -->

3. The ink_freq output from sensor's MIPI

<!-- en PDF p.8; unit 55 -->

4. If there are several MIPI lanes in sensor, please make sure they are configured correctly in dts

<!-- en PDF p.8; unit 56 -->

### 2.2 No Frame Data is Received, and No Error is Reported

<!-- en PDF p.8; unit 57 -->

from ISP/MIPI

<!-- en PDF p.8; unit 58 -->

1. Confirm whether there are any errors about MIPI in kernel log. For example, check if there are any errors by dmesg \| grep MIPI .

<!-- en PDF p.8; unit 59 -->

2. Confirm whether there is a sensor's i2c read and write failure in kernel log. If sensor fails to configure registers, the sensor may not be initialized correctly and enable output.

<!-- en PDF p.8; unit 60 -->

3. Measure whether there is information output from clk and data lines of MIPI. If not, it is recommended to analyze sensor initialization and hardware.

<!-- en PDF p.9; unit 61 -->

4. There is MIPI signal output in measure, but no error is reported and no data can be received: Please check according to the Section 2.1 What Parameters Need to be Set in MIPI again Please confirm that there is no error in I2C communication, and the sensor register initialization list have all been written to the sensor In sensor driver, the last to enable MIPI output is s_stream() . Please make sure that before this function, especially s_power() , there is no MIPI signal output. The reason is MIPI controller is not actually ready to receive data before s_stream() . If data is output before s_stream() , it may cause the loss of MIPI protocol header SOT signal. Switch the clock lane on camera sensor side from continue mode to no continues.

<!-- en PDF p.9; unit 62 -->

### 2.3 MIPI Error

<!-- en PDF p.9; unit 63 -->

#### 2.3.1 The Detailed MIPI Error Message Table

<!-- en PDF p.9; unit 64 -->

For RK3288/RK3399/RK3368, the error message table is as follows:

<!-- en PDF p.9; unit 65 -->

| Error bit<br>(Bit) | Abbreviation | Description |
| --- | --- | --- |
| 25 | ADD_DATA_OVFLW | additional data fifo overflow occurred |
| 24 | FRAME_END | A frame is received normally, not an error |
| 23 | ERR_CS | checksum error |
| 22 | ERR_ECC1 | 1-bit ecc error |
| 21 | ERR_ECC2 | 2-bit ecc error |
| 20 | ERR_PROTOCOL | packet start detected within current packet |
| 19:16 | ERR_CONTROL | PPI interface control error occured, one bit per<br>lane |
| 15:12 | ERR_EOT_SYNC | MIPI EOT(End Of Transmission) sync, one bit per<br>lane |
| 11:8 | ERR_SOT_SYNC | MIPI SOT(Start Of Transmission) sync, one bit per<br>lane |
| 7:4 | ERR_SOT | MIPI SOT(Start Of Transmission), one bit per lane |
| 3:0 | SYNC_FIFO_OVFLW | synchronization fifo overflow occurred, one bit<br>per lane |

<!-- en PDF p.9; unit 66 -->

For RK3326/PX30/RK1808, the three error message tables are as follows:

<!-- en PDF p.10; unit 67 -->

| ERR1 Error Bit<br>(Bit) | Abbreviation | Description |
| --- | --- | --- |
| 28 | ERR_ECC | ECC ERROR |
| 27:24 | ERR_CRC | CRC ERROR |
| 23:20 | ERR_FRAME_DATA | Frame transmission is complete, but at least one<br>CRC error is included |
| 19:16 | ERR_F_SEQ | Frame Number is not continuous will not meet<br>expectations |
| 15:12 | ERR_F_BNDRY | Frame start and Frame end do not match |
| 11:8 | ERR_SOT_SYNC | MIPI PHY SOT(Start Of Transmission) sync error |
| 7:4 | ERR_EOT_SYNC | MIPI PHY EOT(End Of Transmission) sync error |

<!-- en PDF p.10; unit 68 -->

| ERR2 Error Bit(Bit) | Abbreviation | Description |
| --- | --- | --- |
| 19:16 | ERR_CONTROL |  |
| 15:12 | ERR_ID |  |
| 11:8 | ERR_ECC_CORRECTED |  |
| 7:4 | ERR_SOTHS | PHY SOTHS error |
| 3:0 | ERR_ESC | PHY ESC error |

<!-- en PDF p.10; unit 69 -->

Please read the following chapters for analysis of frequently encountered problems.

<!-- en PDF p.10; unit 70 -->

#### 2.3.2 How to Deal with SOT/SOT_SYNC Errors

<!-- en PDF p.10; unit 71 -->

The SOT signal needs to comply with MIPI_D-PHY_Specification. If you need in-depth analysis, please search pdf documents directly from Internet, and it is suggested to focus on the following items:

<!-- en PDF p.10; unit 72 -->

1. High-Speed Data Transmission

<!-- en PDF p.10; unit 73 -->

2. Start-of-Transmission Sequence

<!-- en PDF p.10; unit 74 -->

3. HS Data Transmission Burst

<!-- en PDF p.10; unit 75 -->

4. High-Speed Clock Transmission

<!-- en PDF p.10; unit 76 -->

5. Global Operation Timing Parameters But generally speaking, if the sensor has tuned on other platforms, there will be little possibility of not complying with MIPI protocol. It is recommended to customers that:

<!-- en PDF p.10; unit 77 -->

1. Please first confirm to sensor vendor whether the sensor has actually successfully transmit data on MIPI interface

<!-- en PDF p.10; unit 78 -->

2. Reconfirm whether link_freq is correct. Because the Ths-settle in SOT sequence needs to be configured correctly at MIPI receiving side, link_freq is so important.

<!-- en PDF p.11; unit 79 -->

3. If multiple lanes are used, see if the sensor vendor can modify it to 1 lane for transmission.

<!-- en PDF p.11; unit 80 -->

#### 2.3.3 How to Deal with CRC/CheckSum(CS), ECC/ECC1/ECC2 Errors

<!-- en PDF p.11; unit 81 -->

When ECC error and CS check error occurred, it means that data was incomplete during transmission. It is suggested that:

<!-- en PDF p.11; unit 82 -->

1. Check hardware signals firstly

<!-- en PDF p.11; unit 83 -->

2. If multiple lanes are used, check if the sensor vendor can modify it to 1 lane for transmission. Because multiple lanes are not synchronized well, ECC errors may also occur.

<!-- en PDF p.11; unit 84 -->

#### 2.3.4 How to Deal with ERR_PROTOCOL/ERR_F_BNDRY Errors

<!-- en PDF p.11; unit 85 -->

This error indicates that the expected EOT/SOT was not received. And SOT and EOT should appear in pairs. It is recommended to check the waveform.

<!-- en PDF p.11; unit 86 -->

#### 2.3.5 Receive Frames Normally, but MIPI Errors Appear Occasionally

<!-- en PDF p.11; unit 87 -->

If it is a MIPI error, please refer to the above error description. It is recommended to analyze the signal related errors from hardware. In particular, if MIPI error occurs only at the beginning of capturing images, it is possible that there is MIPI signal output during sensor power-on but it does not conform to the protocol, so the error is reported. In this case, you can try to modify as follows:

<!-- en PDF p.11; unit 88 -->

1. Put the initialization of the complete sensor register into s_power() . Because MIPI receiver has not yet started receiving data at this time, all data will be ignored.

<!-- en PDF p.11; unit 89 -->

2. At the end of the s_power() function, turning off the output of sensor, in other words, to call stop_stream()

<!-- en PDF p.11; unit 90 -->

3. In start_stream() and stop_stream() , output of MIPI is turned on or off only.

<!-- en PDF p.11; unit 91 -->

#### 2.3.6 Report Many MIPI Errors or Even Crashes

<!-- en PDF p.11; unit 92 -->

It may be a worse situation mentioned in section 2.3.5 Receive Frames Normally, but MIPI Errors Appear Occasionally. The reason for this is that MIPI signal does not meet the requirement, and some errors at MIPI receiving side are voltage interruptions, which leads to an interruption storm and eventually crashes. You can try to check whether it will take effect according to section 2.3.5 Receive Frames Normally, but MIPI Errors Appear Occasionally.

<!-- en PDF p.12; unit 93 -->

#### 2.3.7 How to Deal with ISP PIC_SIZE_ERROR

<!-- en PDF p.12; unit 94 -->

Picture size error is an ISP level error, which indicates that the expected number of rows and columns have not been received. So check resolution size from all levels. If the previous level (that is MIPI) reported an error, the MIPI error should be resolved first. Please check the following items:

<!-- en PDF p.12; unit 95 -->

1. Is DDR frequency too small? This error can also occur when DDR frequency is too low and the response speed is insufficient. Try to fix DDR frequency to the highest frequency to see if it will go wrong: echo performance &gt; /sys/class/devfreq/dmc/governor

<!-- en PDF p.12; unit 96 -->

2. In the whole ISP link, is there a case that the resolution of the latter stage is greater than that of the previous stage. You can use media-ctl -p -d /dev/media0 to check the topology.The resolution should satisfy Sensor == MIPI_DPHY &gt;= isp_sd input &gt;= isp_sd output. If you haven't modified it manually, it should meet this condition by default.

<!-- en PDF p.12; unit 97 -->

3. Is the output resolution of sensor correct? Try to force the resolution to be smaller in the driver code. For example, the default resolution in ov7251.c is 640x480:

<!-- en PDF p.12; unit 98 -->

```text
static const struct ov7251_mode supported_modes[] = {
        {
                .width = 640,
                .height = 480,
```

<!-- en PDF p.12; unit 99 -->

Change the width and height to be smaller, such as 320x240, the register configuration does not need to be changed, in order to confirm whether the configuration size of the sensor will exceed the actual output size.

<!-- en PDF p.12; unit 100 -->

```text
static const struct ov7251_mode supported_modes[] = {
        {
                .width = 320,
                .height = 240,
```

<!-- en PDF p.12; unit 101 -->

## 3. About Capturing Images

<!-- en PDF p.12; unit 102 -->

This chapter will going to introduce common problems related to capturing images.

<!-- en PDF p.12; unit 103 -->

### 3.1 Ways to Capture Pictures

<!-- en PDF p.12; unit 104 -->

RKISP and RKCIF drivers support v4l2 interface, you can use the following ways to capture images:

<!-- en PDF p.12; unit 105 -->

1. Use the v4l2-ctl tool in the v4l-utils package to capture images. In the tuning process, it is firstly recommended to use this tool to check whether pictures can successfully output.The v4l2-ctl capture pictures and saved them as a file, but it cannot parse images and display them. If you need parse, mplayer can be used in Ubuntu/Debian, and 7yuv, etc. can

<!-- en PDF p.13; unit 106 -->

be used in Windows.For detailed instructions of v4l2-ctl and mplayer tools, please refer to "Rockchip_Developer_Guide_Linux_Camera_CN.pdf".The v4l2-ctl also comes with detailed v4l2-ctl --help document.

<!-- en PDF p.13; unit 107 -->

2. The Linux SDK provided by RK contains qcamera application app.Open the camera app on the desktop directly, select the video device and preview.The app is a demo based on Qt, for reference only. In customer projects, it is recommended to develop apps by yourselves.

<!-- en PDF p.13; unit 108 -->

3. Use v4l2src plugin of gstreamer to get images from /dev/video devices and display them on the screen. The Linux SDK provided by RK will contain some scripts under the directory /rockchip_test/camera/, please refer to it first. Note: RK has provided multiple versions of gstreamer isp plugin, such as rkisp, rkv4l2src, which are no longer supported. Please use the v4l2src plugin that comes with gstreamer directly. There are two main reasons: 3A no longer needs to be adjusted in rkisp or rkv4l2src. Please refer to Chapter 4 About 3A for details v4l2 interface driven by rkisp is more standardized

<!-- en PDF p.13; unit 109 -->

4. Open source tools such as vlc are used in Debian system After installing vlc through apt, you can use the following command to display the camera image on the screen:

<!-- en PDF p.13; unit 110 -->

```text
vlc v4l2:///dev/video1:width=640:height=480
```

<!-- en PDF p.13; unit 111 -->

Note that the permission of the video user group or root super user permission is required.

<!-- en PDF p.13; unit 112 -->

### 3.2 The Color of the Captured Image is Wrong, and the

<!-- en PDF p.13; unit 113 -->

Brightness is Obviously Darker or Lighter

<!-- en PDF p.13; unit 114 -->

According to types of sensors:

<!-- en PDF p.13; unit 115 -->

1. If sensor is output of RAW RGB, such as RGGB, BGGR, etc. It needs 3A to run normally. Please refer to Chapter 4 About 3A. When 3A is running normally, please check again whether the format used when parsing/displaying images is correct and whether the uv component is reversed.

<!-- en PDF p.13; unit 116 -->

2. If sensor is yuv output, or RGB such as RGB565, RGB888, at this time ISP is in bypass state, If the color is wrong, please confirm whether the output format of sensor is misconfigured and whether the uv component is reversed. When you confirmed that they are correct, it is recommended to contact the sensor vendor If the brightness is obviously wrong, please contact the sensor vendor

<!-- en PDF p.14; unit 117 -->

### 3.3 What is ISP Topology and How to Use media-ctl

<!-- en PDF p.14; unit 118 -->

Command

<!-- en PDF p.14; unit 119 -->

RKISP or RKCIF can be connected to multiple sensors, time-sharing multiplexing; at the same time, RKISP also has a multi-level cutting function. Therefore, each node is connected by topology, and the parameters can be configured separately through media-ctl. About the use of media-ctl, there is a more complete description in the "Rockchip_Developer_Guide_Linux_Camera_CN.pdf" document.

<!-- en PDF p.14; unit 120 -->

#### 3.3.1 How does One ISP Connect to Multiple Sensors

<!-- en PDF p.14; unit 121 -->

Multiple sensors can be connected, but only time-sharing multiplexing. By configuring dts, after linking multiple sensors to MIPI DPHY, the sensors can be switched through media-ctl.

<!-- en PDF p.14; unit 122 -->

### 3.4 Whether Captured RAW Images are Exactly the Same as

<!-- en PDF p.14; unit 123 -->

the Original Images

<!-- en PDF p.14; unit 124 -->

When ISP capture sensor RAW images (such as RGGB, BGGR) in the bypass mode, 8bit alignment is required, and if it is less than 8bit, the low bit will be filled with 0, that is If they are 8bit, 16bit original images, images captured by the application are the original, and not filled If they are 10bit, 12bit original images, the low bit of each pixel will be filled with 0 to 16bit Only the video device corresponding to MP can output RAW images, SP cannot support RAW image output.

<!-- en PDF p.14; unit 125 -->

### 3.5 How does ISP Output two Channels (MP, SP)

<!-- en PDF p.14; unit 126 -->

Simultaneously

<!-- en PDF p.14; unit 127 -->

RKISP has two outputs: SP and MP, that is, an image from sensor, SP and MP can cut and change format of the image separately, and output at the same time. For the detailed video processing capabilities of SP and MP, please refer to "Rockchip_Developer_Guide_Linux_Camera_CN.pdf". Only when SP and MP both output RGB or YUV, they can output at the same time. If MP outputs RAW images, then there will be no output from SP

<!-- en PDF p.14; unit 128 -->

### 3.6 Does ISP Have Amplify Function

<!-- en PDF p.14; unit 129 -->

This function is supported on the hardware, but it is not recommended to use it. And it is also turned off by default in the driver.

<!-- en PDF p.15; unit 130 -->

### 3.7 Does ISP Have Rotation Function

<!-- en PDF p.15; unit 131 -->

No. If you need the rotation function, it is recommended to: If it is flip, mirror, first check if the sensor has this function, if so, use it directly. This is the most efficient If there is no sensor flip, mirror, RGA module is consideration, its code and demo are located in the external/linux-rga/ directory, and related documents are located in the docs/ directory

<!-- en PDF p.15; unit 132 -->

### 3.8 How to Capture a Gray Image

<!-- en PDF p.15; unit 133 -->

As long as ISP can output YUV or sensor output is Y8 gray image, application can always use V4L2_PIX_FMT_GREY (FourCC for GREY) format to capture images directly.

<!-- en PDF p.15; unit 134 -->

### 3.9 Which Formats are Supported by RGB Images

<!-- en PDF p.15; unit 135 -->

First of all, only SP can support RGB output, the format are: V4L2_PIX_FMT_XBGR32, V4L2_PIX_FMT_RGB565. The XBGR32 (corresponding FourCC is XR24) contains four components of R, G, B, and X, and X component is always 0. Does not support RGB888, that is, 24bit format output.

<!-- en PDF p.15; unit 136 -->

### 3.10 How to Quickly Preview a Board Without Screen

<!-- en PDF p.15; unit 137 -->

The external/uvc_app/ directory in the SDK provides the function of simulating the board into an uvc camera. Please refer to the introduction file and code in the directory. After the board is connected to a PC, an usb camera can be recognized and images can be previewed.

<!-- en PDF p.15; unit 138 -->

### 3.11 How to Distinguish SP and MP

<!-- en PDF p.15; unit 139 -->

The media-ctl -p -d /dev/media0 (if there are multiple media devices, /dev/media1, /dev/media2 can be tried, too) can be used to see topology, and list part of the output as follows:

<!-- en PDF p.15; unit 140 -->

```text
# media-ctl -p -d /dev/media0
...
- entity 2: rkisp1_mainpath (1 pad, 1 link)              //Means the entity is
MP(MainPath)
            type Node subtype V4L flags 0
            device node name /dev/video1                 //The corresponding
device node is/dev/video1
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]

- entity 3: rkisp1_selfpath (1 pad, 1 link)              //Means the entity is
SP(SelfPath)
            type Node subtype V4L flags 0
```

<!-- en PDF p.16; unit 141 -->

```text
            device node name /dev/video2                 //The corresponding
device node is/dev/video2
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]
...
```

<!-- en PDF p.16; unit 142 -->

In a few cases, if there is no media-ctl command, you can search through /sys/ node, such as:

<!-- en PDF p.16; unit 143 -->

```text
# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:stream_cif
/sys/class/video4linux/video1/name:rkisp1_mainpath       # Corresponding MP
node/dev/video1
/sys/class/video4linux/video2/name:rkisp1_selfpath       # Corresponding SP
Node/dev/video2
/sys/class/video4linux/video3/name:rkisp1_rawpath
/sys/class/video4linux/video4/name:rkisp1_dmapath
/sys/class/video4linux/video5/name:rkisp1-statistics
/sys/class/video4linux/video6/name:rkisp1-input-params
```

<!-- en PDF p.16; unit 144 -->

## 4. About 3A

<!-- en PDF p.16; unit 145 -->

If a sensor needs 3A tunning, like RAW BAYER RGB format of RGGB, BGGR ,etc. format output from sensor, then RKISP is required to provide image processing. Depending on the version of camera_engine_rkisp, 3A processing methods are different. It is recommended to upgrade camera_engine_rkisp to the latest version as much as possible. Please first confirm whether the module is in the support list For those already in the support list, there will be a corresponding xml file in the external/camera_engine_rkisp/iqfiles/ directory Otherwise, please apply a module tuning application by business

<!-- en PDF p.16; unit 146 -->

### 4.1 How to Confirm the Version of camera_engine_rkisp

<!-- en PDF p.16; unit 147 -->

1. Check from the source code

<!-- en PDF p.16; unit 148 -->

```text
  # grep CONFIG_CAM_ENGINE_LIB_VERSION interface/rkisp_dev_manager.h
  define CONFIG_CAM_ENGINE_LIB_VERSION "v2.2.0"           # The output v2.2.0 is
the version number of librkisp.so
```

<!-- en PDF p.16; unit 149 -->

2. Check from running log

<!-- en PDF p.16; unit 150 -->

```text
  # persist_camera_engine_log=0x4000 rkisp_3A_server --mmedia=/dev/media1 | grep
"CAM ENGINE LIB VERSION"
        CAM ENGINE LIB VERSION IS v2.2.0                # The output v2.2.0 is
the version number of librkisp.so
```

<!-- en PDF p.17; unit 151 -->

If the version number is lower than v2.2.0, please consider upgrading to v2.2.0 or a newer version

<!-- en PDF p.17; unit 152 -->

#### 4.1.1 How to Confirm the Version Number of rkisp Kernel Driver

<!-- en PDF p.17; unit 153 -->

Required by camera_engine_rkisp

<!-- en PDF p.17; unit 154 -->

The camera_engine_rkisp has requirements for kernel driver version, so you need to ensure that the rkisp driver is latest enough.

<!-- en PDF p.17; unit 155 -->

1. Check ISP driver version from the kernel source code

<!-- en PDF p.17; unit 156 -->

```text
  # grep RKISP1_DRIVER_VERSION drivers/media/platform/rockchip/isp1/version.h
  define RKISP1_DRIVER_VERSION KERNEL_VERSION(0, 1, 0x5) # The output v0.1.5 is
the version number of the rkisp driver
```

<!-- en PDF p.17; unit 157 -->

2. Check ISP driver version from the kernel log

<!-- en PDF p.17; unit 158 -->

```text
# dmesg  | grep "rkisp1 driver version"
[    0.867864] rkisp1 ff4a0000.rkisp1: rkisp1 driver version: v00.01.05
```

<!-- en PDF p.17; unit 159 -->

### 4.2 How to Upgrade camera_engine_rkisp

<!-- en PDF p.17; unit 160 -->

There are three parts:

<!-- en PDF p.17; unit 161 -->

1. The body of camera_engine_rkisp It is located in the external/camera_engine_rkisp directory of the SDK, it can be updated directly through git or repo tools. You can only update the directory without affecting the directories in other SDKs.

<!-- en PDF p.17; unit 162 -->

2. Kernel is upgraded according to needs of camera_engine_rkisp By checking git log in the external/camera_engine_rkisp directory, you can find the version number of the kernel rkisp driver. For example:

<!-- en PDF p.17; unit 163 -->

```text
# git log
commit e456a50a5524792d64dac384604d4136a697deac
Author: ZhongYichong <zyc@rock-chips.com>
Date:   Mon Jul 1 11:26:32 2019 +0800

    librkisp: v2.2.0

    (BY ZSQ: UPDATE v2.2.0 iq version: from v1.4.0 to v1.5.0)

    3A lib version:
      af:  v0.2.17
      awb: v0.0.e
      aec: v0.0.e
    iq version: v1.5.0
    iq magic version code: 706729
```

<!-- en PDF p.18; unit 164 -->

```text
matched rkisp1 driver version:
  v0.1.5                 # The needed kernel driver version is v0.1.5

Change-Id: I3d2adb949dadec259b9ba587a3e3b2770a1c155d
Signed-off-by: ZhongYichong <zyc@rock-chips.com>
Signed-off-by: Shunqian Zheng <zhengsq@rock-chips.com>
```

<!-- en PDF p.18; unit 165 -->

3. The compilation script of camera_engine_rkisp in buildroot It is located in the directory of buildroot/package/rockchip/camera_engine_rkisp. If it is not convenient to update the whole buildroot, you can update this directory alone.

<!-- en PDF p.18; unit 166 -->

### 4.3 How to Confirm Whether 3A is Working Properly

<!-- en PDF p.18; unit 167 -->

After confirming that camera_engine_rkisp is already v2.2.0 or later version. By capturing an image, check whether the color and exposure of the image are normal. At the same time, by checking whether there is rkisp_3A_server process in the background, as follows:

<!-- en PDF p.18; unit 168 -->

```text
# ps -ef | grep rkisp_3A_server
  706 root      9176 S    /usr/bin/rkisp_3A_server --mmedia=/dev/media1
  746 root      2408 S    grep rkisp_3A_server
# pidof rkisp_3A_server
706
```

<!-- en PDF p.18; unit 169 -->

You can see that the process number 706 is rkisp_3A_server.

<!-- en PDF p.18; unit 170 -->

#### 4.3.1 Did not Found the rkisp_3A_server Process

<!-- en PDF p.18; unit 171 -->

1. First confirm whether the /usr/bin/rkisp_3A_server executable file exists, if not, please check the camera_engine_rkisp version and build it.

<!-- en PDF p.18; unit 172 -->

2. Check whether there are rkisp_3A related errors in /var/log/syslog. If so, see what the detailed error is and whether the xml corresponding to the sensor module is not found or does not match.

<!-- en PDF p.18; unit 173 -->

3. Execute rkisp_3A_server --mmedia=/dev/media0 in a shell (if there are multiple /dev/media devices, select the one corresponding to /dev/video), and capture pictures from another shell, To get the error message corresponding to rkisp_3A_server

<!-- en PDF p.18; unit 174 -->

#### 4.3.2 How to Start rkisp_3A_server

<!-- en PDF p.18; unit 175 -->

In the Linux SDK, rkisp_3A_server is started by the script /etc/init.d/S40rkisp_3A and executed in the background. If the /etc/init.d/S40rkisp_3A file is not found, check the version of camera_engine_rkisp and the buildroot package compilation script.

<!-- en PDF p.19; unit 176 -->

#### 4.3.3 How to Make Sure the Name and Path of Sensor IQ Configuration

<!-- en PDF p.19; unit 177 -->

File (xml)

<!-- en PDF p.19; unit 178 -->

The sensor iq file consists of three parts,

<!-- en PDF p.19; unit 179 -->

1. Sensor Type, such as ov5695, imx327

<!-- en PDF p.19; unit 180 -->

2. Module Name, is defined in dts, for example, rk3326/px30 rk evb board, the name is "TongJu": rockchip,camera-module-name = "TongJu";

<!-- en PDF p.19; unit 181 -->

3. Module Lens Name, defined in dts, such as the following "CHT842-MD": rockchip,camera-module-lens-name = "CHT842-MD"; The iq file name in the above example is: ov5695_TongJu_CHT842-MD.xml, which is stored in the /etc/iqfiles/ directory. Note the case-sensitive.

<!-- en PDF p.19; unit 182 -->

### 4.4 How to Manually Expose

<!-- en PDF p.19; unit 183 -->

In the case of manual exposure, the rkisp_3A_server process must exit first. Then you can refer to the source code of rkisp_demo.cpp program or librkisp_api.so.

<!-- en PDF p.19; unit 184 -->

### 4.5 How to Open librkisp Log

<!-- en PDF p.19; unit 185 -->

By setting the environment variable persist_camera_engine_log, the corresponding bits are list as follows:

<!-- en PDF p.19; unit 186 -->

```text
bits:    23-20   19-16 15-12  11-8  7-4   3-0
module: [xcore]  [ISP] [AF]   [AWB] [AEC] [NO]

0: error
1: warning
2: info
3: verbose
4: debug
```

<!-- en PDF p.19; unit 187 -->

For example, open the debug log of ISP and AWB:

<!-- en PDF p.19; unit 188 -->

```text
# /etc/init.d/S40rkisp_3A stop
# export persist_camera_engine_log=0x040400
# /usr/bin/rkisp_3A_server --mmedia=/dev/media0
```

<!-- en PDF p.20; unit 189 -->

![Source technical figure · EN PDF p.20](/docs/rockchip-linux44-camera-troubleshooting/assets/en-p020-vector-01.png)

## 5. Application Development

<!-- en PDF p.20; unit 190 -->

### 5.1 C Language Reference Demo

<!-- en PDF p.20; unit 191 -->

1. The Linux SDKs provided by RK include rkisp_demo tool and source code rkisp_demo is a simple tool that can be used to capture images. Like v4l2-ctl tool, rkisp_demo can't display images either. It mainly provides source code for reference. The source code is located in the external/camera_engine_rkisp/apps directory. If your code is out of date, please refer to the source code is located in the external/camera_engine_rkisp/tests directory.

<!-- en PDF p.20; unit 192 -->

2. The Linux SDKs provided by RK include rkisp_api.so dynamic link library and source code, you can modify base on it or directly use C language to develop programs The source code is located in the external/camera_engine_rkisp/apps directory. If your code is out of date and cannot find the directory, please update.

<!-- en PDF p.20; unit 193 -->

### 5.2 What is DMA Buffer and What are the Benefits

<!-- en PDF p.20; unit 194 -->

DMA buffer is a part of memory allocated by driver. This buffer can be shared among multiple kernel modules to reduce memory copy. Especially for image processing, it can optimize performance and reduce DDR load. For example, the camera image needs to be encoded by mpp:

<!-- en PDF p.20; unit 195 -->

RKISP DMA buffer shared MPP coding

<!-- en PDF p.20; unit 196 -->

RKISP can receive DMA buffer from other modules (such as MPP, RGA), and can also allocate memory and export DMA buffer to other modules. For details, please refer to the source code of librkisp_api.so library.

## Source code differences

The main text follows its language source; RU/DE follow EN. Different code fragments from the other source are preserved below, including comment/layout differences. These are independent examples, not a combined executable script; source parameters were not silently overwritten.

**CN PDF p.13 · 108**

```text
# media-ctl -p -d /dev/media0
...
- entity 2: rkisp1_mainpath (1 pad, 1 link)              //表⽰该entity是
MP(MainPath)
            type Node subtype V4L flags 0
            device node name /dev/video1                 //对应的设备节点
是/dev/video1
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]

- entity 3: rkisp1_selfpath (1 pad, 1 link)              //表⽰该entity是
SP(SelfPath)
            type Node subtype V4L flags 0
            device node name /dev/video2                 //对应的设备节点
是/dev/video2
        pad0: Sink
                <- "rkisp1-isp-subdev":2 [ENABLED]
```

**CN PDF p.14 · 109**

```text
...
```

**CN PDF p.14 · 111**

```text
# grep '' /sys/class/video4linux/video*/name
/sys/class/video4linux/video0/name:stream_cif
/sys/class/video4linux/video1/name:rkisp1_mainpath       # MP节点对应/dev/video1
/sys/class/video4linux/video2/name:rkisp1_selfpath       # SP节点对应/dev/video2
/sys/class/video4linux/video3/name:rkisp1_rawpath
/sys/class/video4linux/video4/name:rkisp1_dmapath
/sys/class/video4linux/video5/name:rkisp1-statistics
/sys/class/video4linux/video6/name:rkisp1-input-params
```

**CN PDF p.14 · 116**

```text
  # grep CONFIG_CAM_ENGINE_LIB_VERSION interface/rkisp_dev_manager.h
  define CONFIG_CAM_ENGINE_LIB_VERSION "v2.2.0"           # 输出的v2.2.0是
librkisp.so的版本号
```

**CN PDF p.14 · 118**

```text
  # persist_camera_engine_log=0x4000 rkisp_3A_server --mmedia=/dev/media1 | grep
"CAM ENGINE LIB VERSION"
        CAM ENGINE LIB VERSION IS v2.2.0                # 输出的v2.2.0是librkisp.so
的版本号
```

**CN PDF p.15 · 122**

```text
  # grep RKISP1_DRIVER_VERSION drivers/media/platform/rockchip/isp1/version.h
  define RKISP1_DRIVER_VERSION KERNEL_VERSION(0, 1, 0x5) # 输出的v0.1.5是rkisp驱动的
版本号
```

**CN PDF p.15 · 129**

```text
# git log
commit e456a50a5524792d64dac384604d4136a697deac
Author: ZhongYichong <zyc@rock-chips.com>
Date:   Mon Jul 1 11:26:32 2019 +0800

    librkisp: v2.2.0

    (BY ZSQ: UPDATE v2.2.0 iq version: from v1.4.0 to v1.5.0)

    3A lib version:
      af:  v0.2.17
      awb: v0.0.e
      aec: v0.0.e
    iq version: v1.5.0
    iq magic version code: 706729

    matched rkisp1 driver version:
      v0.1.5                 # 所需要的kernel驱动版本为v0.1.5

    Change-Id: I3d2adb949dadec259b9ba587a3e3b2770a1c155d
    Signed-off-by: ZhongYichong <zyc@rock-chips.com>
    Signed-off-by: Shunqian Zheng <zhengsq@rock-chips.com>
```

{% endraw %}

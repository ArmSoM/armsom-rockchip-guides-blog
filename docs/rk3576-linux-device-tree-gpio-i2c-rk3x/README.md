# RK3576 Linux Device Tree in Practice: DTS Fundamentals, GPIO and I2C Configuration, and Rockchip i2c-rk3x Driver Debugging

English | [简体中文](README.zh-CN.md)

Target platform: ArmSoM-CM5 / CM5-IO (RK3576)

This guide uses ArmSoM-CM5 and CM5-IO to explain Linux Device Tree, the I2C3 M0 overlay, pinmux, I2C timing, and troubleshooting for the Rockchip `i2c-rk3x` driver. Examples taken from official documentation are distinguished from steps that have not been tested on hardware.

## 1. Why RK3576 needs Device Tree

Device Tree separates hardware descriptions from Linux driver code. It describes controllers such as I2C, SPI, UART, and GPIO, along with pin multiplexing, clocks, interrupts, and device connections. ArmSoM-CM5 is based on RK3576 and provides expansion interfaces for embedded development. Even when pins are physically available, the corresponding controller and pinmux configuration must be enabled.

## 2. DTS, DTSI, DTB, and DTBO

![RK3576 Linux device tree and overlay architecture](assets/device-tree-overlay-architecture.png)

*Figure 1: Device Tree and overlay relationships. This original ArmSoM illustration is conceptual, not a boot sequence diagram.*

DTSI files describe the SoC or hardware shared by multiple platforms. A board-specific DTS includes these files and overrides settings. DTC compiles the source into a DTB. A DTBO can be applied to the base Device Tree when the boot flow supports overlays. Loading methods vary between firmware images.

```bash
cat /proc/device-tree/model
tr "\0" "\n" < /proc/device-tree/compatible
sudo apt install device-tree-compiler
sudo dtc -I fs -O dts -o rk3576-running.dts /proc/device-tree
```

## 3. CM5-IO I2C3 connections and GPIO pinmux

According to the [ArmSoM I2C documentation](https://docs.armsom.org/interface-usage/i2c), the CM5-IO 40-pin connector exposes I2C3_SDA_M0 on physical pin 3 and I2C3_SCL_M0 on physical pin 5. I2C7 M1 uses pins 19/23, and I2C4 M3 uses pins 27/29. The documentation also lists pins 89/88 for I2C6; these must not be interpreted as pin numbers on the 40-pin header. Verify which connector they belong to before publishing. The CM5-IO pin assignments must not be assumed to apply to Sige5.

![I2C SDA SCL bus connection diagram](assets/i2c-sda-scl-bus.png)

*Figure 2: Conceptual SDA/SCL connections for multiple I2C devices. This is an original illustration, not a CM5-IO schematic; a real circuit requires pull-up resistors.*

In I2C3_M0, M0 identifies a pin-multiplexing option, not a Linux bus number. Check the SDA/SCL pinmux, pull-up resistors, I/O voltage, and bus usage before connecting devices.

```bash
sudo apt install gpiod i2c-tools
gpiodetect
gpioinfo
i2cdetect -l
ls /sys/kernel/debug/pinctrl/
```

## 4. Enable I2C3 M0 with the official overlay

The ArmSoM I2C documentation lists `rk3576-armsom-i2c3-m0-overlay.dtbo`. First check that your image contains this file and determine which boot configuration the bootloader actually reads. The documentation gives differing paths for `uEnv.txt`; do not create a new configuration file without verifying the active path.

```bash
ls /boot/dtb/overlay/ | grep rk3576
ls -l /boot/uEnv.txt /boot/uEnv/uEnv.txt /boot/extlinux/extlinux.conf 2>/dev/null
```

If the firmware uses the documented `dtoverlay` syntax, add the following example line to the active configuration file after verifying the path:

```ini
dtoverlay=/dtb/overlay/rk3576-armsom-i2c3-m0-overlay.dtbo
```

Save the file, run `sync`, and reboot. Then identify the actual Linux bus with `i2cdetect -l` before scanning it when needed.

```bash
sync
sudo reboot
i2cdetect -l
ls /dev/i2c-*
sudo i2cdetect -y 3
```

> **Note:** `-y 3` scans `/dev/i2c-3`; it does not mean “the first I2C bus.” Scanning can interfere with devices already in use. Address `0x68` appears only in the official example output and is not a universal test result.

## 5. I2C timing at 100 kHz and 400 kHz

Device Tree properties used by the Rockchip `i2c-rk3x` driver include `clock-frequency`, `i2c-scl-rising-time-ns`, and `i2c-scl-falling-time-ns`. The values below come from an example in the official documentation; they are not measurements taken on CM5-IO.

```dts
&i2c3 {
    status = "okay";
    clock-frequency = <400000>;
    i2c-scl-rising-time-ns = <265>;
    i2c-scl-falling-time-ns = <11>;
};
```

For 400 kHz communication, confirm that the device supports Fast-mode and measure SCL rise and fall times with an oscilloscope. Bus capacitance, pull-up resistor values, and voltage mismatches can cause unstable communication.

## 6. Add an external sensor to I2C3

The following teaching example connects a TMP102-compatible temperature sensor. It does not indicate that an ArmSoM board includes this sensor onboard.

```dts
&i2c3 {
    status = "okay";
    #address-cells = <1>;
    #size-cells = <0>;

    temperature-sensor@48 {
        compatible = "ti,tmp102";
        reg = <0x48>;
    };
};
```

After compiling and deploying the configuration, use `ls /sys/bus/i2c/devices/` and `dmesg` to check driver binding. If an address is shown as `UU`, it usually means that a kernel driver has claimed the device.

## 7. Software I2C with GPIO

When a hardware controller is unavailable, consider `i2c-gpio`. Use bindings supported by your kernel, an actual GPIO controller, and the correct pin numbers. Software I2C is affected by scheduling and timing; hardware I2C is generally the preferred choice.

```dts
i2c-gpio-example {
    compatible = "i2c-gpio";
    sda-gpios = <&gpioX SDA_PIN 0>; /* placeholder */
    scl-gpios = <&gpioX SCL_PIN 0>; /* placeholder */
    i2c-gpio,delay-us = <5>;
    #address-cells = <1>;
    #size-cells = <0>;
};
```

The GPIO controller and pin identifiers in this example are placeholders and must be replaced for your hardware.

## 8. Troubleshoot i2c-rk3x

![Rockchip RK3576 I2C debugging workflow](assets/rk3576-i2c-debugging-workflow.png)

*Figure 3: A debugging path from Device Tree configuration to bus waveforms. Original workflow illustration.*

| Symptom | What to check |
| --- | --- |
| `ENXIO (-6)` | Often associated with NACK: check the address, power supply, reset timing, and ACK waveform. |
| `timeout, ipd: 0x00, state: 1` | Check pinmux, pull-up voltage, whether SDA/SCL are held low, and the controller clock. |
| `timeout, ipd: 0x10, state: 1` | Check interrupt status and `/proc/interrupts` in the context of your kernel version. The log alone does not establish a CPU problem. |
| `timeout, ipd: 0x80, state: 1` | Check for SCL being held low, a stalled peripheral, and abnormal bus waveforms. Isolate peripherals if needed. |

```bash
dmesg | grep -Ei "i2c|rk3x"
cat /proc/interrupts
sudo cat /sys/kernel/debug/pinctrl/*/pinmux-pins
```

## 9. Compile, deploy, and recover Device Tree changes

```bash
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- dtbs -j$(nproc)
```

Use kernel sources and configuration compatible with your running image. Confirm the DTB/DTBO paths loaded by the bootloader. Back up the original files and retain a serial-console recovery method before making changes. Avoid changing several peripherals at once.

## 10. Conclusion

For RK3576 Device Tree development, follow this sequence: verify the schematic, check the DTS/overlay, verify pinmux, identify the Linux bus, and inspect waveforms and logs. The official ArmSoM overlay is a useful starting point. Modify the board-specific DTS when deeper customization is required.

## References

- [ArmSoM I2C Usage](https://docs.armsom.org/interface-usage/i2c)
- [ArmSoM-CM5](https://docs.armsom.org/armsom-cm5)
- [Linux Device Tree usage model](https://docs.kernel.org/devicetree/usage-model.html)

## Image notes

This page reuses the original English diagrams, shared by both language versions. The source draft identifies these diagrams as original artwork available for ArmSoM publication. Confirm permission separately for any additional product photographs.


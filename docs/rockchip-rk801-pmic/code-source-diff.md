# RK801 中文/英文源代码差异

以下差异来自两份同版本原稿，非本地替换。所有10块去注释和空白后相同，未发现参数差异。RU/DE使用EN代码。

## Block 1

```diff
--- CN
+++ EN
@@ -1,27 +1,27 @@
 // BUCK1
 static const struct linear_range rk801_buck1_voltage_ranges[] = {
-   REGULATOR_LINEAR_RANGE(500000,   0, 80, 12500), /* 0.5v - 1.5v, 步进12.5mV */
-   REGULATOR_LINEAR_RANGE(1800000, 81, 82, 400000),/* 1.8v - 2.2v */
-   REGULATOR_LINEAR_RANGE(3300000, 83, 83, 0), /* 3.3v */
-   REGULATOR_LINEAR_RANGE(5000000, 84, 84, 0), /* 5.0v */
-   REGULATOR_LINEAR_RANGE(5250000, 85, 85, 0), /* 5.25v */
+   REGULATOR_LINEAR_RANGE(500000,   0, 80, 12500), /* 0.5V - 1.5V, step 12.5mV */
+   REGULATOR_LINEAR_RANGE(1800000, 81, 82, 400000),/* 1.8V - 2.2V */
+   REGULATOR_LINEAR_RANGE(3300000, 83, 83, 0), /* 3.3V */
+   REGULATOR_LINEAR_RANGE(5000000, 84, 84, 0), /* 5.0V */
+   REGULATOR_LINEAR_RANGE(5250000, 85, 85, 0), /* 5.25V */
 };
 
 // BUCK2
 static const struct linear_range rk801_buck2_voltage_ranges[] = {
-   REGULATOR_LINEAR_RANGE(800000,  0, 2, 50000),   /* 0.8v - 0.9v */
-   REGULATOR_LINEAR_RANGE(1800000, 3, 4, 400000),  /* 1.8v - 2.2v */
-   REGULATOR_LINEAR_RANGE(3300000, 5, 5, 0),   /* 3.3v */
-   REGULATOR_LINEAR_RANGE(5000000, 6, 6, 0),   /* 5.0v */
-   REGULATOR_LINEAR_RANGE(5250000, 7, 7, 0),   /* 5.25v */
+   REGULATOR_LINEAR_RANGE(800000,  0, 2, 50000),   /* 0.8V - 0.9V */
+   REGULATOR_LINEAR_RANGE(1800000, 3, 4, 400000),  /* 1.8V - 2.2V */
+   REGULATOR_LINEAR_RANGE(3300000, 5, 5, 0),   /* 3.3V */
+   REGULATOR_LINEAR_RANGE(5000000, 6, 6, 0),   /* 5.0V */
+   REGULATOR_LINEAR_RANGE(5250000, 7, 7, 0),   /* 5.25V */
 };
 
 // BUCK4
 static const struct linear_range rk801_buck4_voltage_ranges[] = {
-   REGULATOR_LINEAR_RANGE(500000,   0, 80, 12500), /* 0.5v - 1.5v */
-   REGULATOR_LINEAR_RANGE(1800000, 81, 82, 400000),/* 1.8v - 2.2v */
-   REGULATOR_LINEAR_RANGE(2500000, 83, 83, 0), /* 2.5v */
-   REGULATOR_LINEAR_RANGE(2800000, 84, 84, 0), /* 2.8v */
-   REGULATOR_LINEAR_RANGE(3000000, 85, 85, 0), /* 3.0v */
-   REGULATOR_LINEAR_RANGE(3300000, 86, 86, 0), /* 3.3v */
+   REGULATOR_LINEAR_RANGE(500000,   0, 80, 12500), /* 0.5V - 1.5V */
+   REGULATOR_LINEAR_RANGE(1800000, 81, 82, 400000),/* 1.8V - 2.2V */
+   REGULATOR_LINEAR_RANGE(2500000, 83, 83, 0), /* 2.5V */
+   REGULATOR_LINEAR_RANGE(2800000, 84, 84, 0), /* 2.8V */
+   REGULATOR_LINEAR_RANGE(3000000, 85, 85, 0), /* 3.0V */
+   REGULATOR_LINEAR_RANGE(3300000, 86, 86, 0), /* 3.3V */
 };
```

## Block 6

```diff
--- CN
+++ EN
@@ -3,33 +3,33 @@
     ......
 
     rk801: rk801@27 {
-        // 不可修改。
+        // Cannot be modified.
         compatible = "rockchip,rk801";
         status = "okay";
         reg = <0x27>;
 
-        // PMIC_INT 引脚配置。此处是GPIO0_C2、低电平有效。
+        // PMIC_INT pin configuration. Here is GPIO0_C2, active low.
         interrupt-parent = <&gpio0>;
         interrupts = <RK_PC2 IRQ_TYPE_LEVEL_LOW>;
 
-        // PWRCTRL 引脚配置。此处是GPIO0_C1、⾼电平有效。
+        // PWRCTRL pin configuration. Here is GPIO0_C1, active high.
         pwrctrl-gpios = <&gpio0 RK_PC1 GPIO_ACTIVE_HIGH>;
 
-        // Pinctrl 配置。
+        // Pinctrl configuration.
         pinctrl-names = "default", "pmic-reset";
-        // 初始化pmic_int脚状态。
+        // Initialize pmic_int pin state.
         pinctrl-0 = <&pmic_int>;
-        // 设置reboot时pwrctrl的状态。这样配置后，pmic会跟随SoC⼀起复位⾃⼰的各路电压。
+        // Set the state of pwrctrl when rebooting. After this configuration, PMIC will reset its various voltages together with the SoC.
         pinctrl-1 = <&soc_pwrctrl_reset>;
 
-        // 不可修改。声明RK801具备管理系统下电的功能。
+        // Cannot be modified. Declare that RK801 has the function of managing system power-down.
         rockchip,system-power-controller;
 
-        // 不可修改。声明PMIC_INT作为唤醒源。
+        // Cannot be modified. Declare PMIC_INT as a wake-up source.
         wakeup-source;
 
-        // 各路regulator的输⼊源。
-        // vcc1~7分别对应：BUCK1/2/3/4, LDO1/2, SWTICH。
+        // Input sources for each regulator.
+        // vcc1~7 correspond to: BUCK1/2/3/4, LDO1/2, SWITCH.
         vcc1-supply = <&vcc12v_dc>;
         vcc2-supply = <&vcc12v_dc>;
         vcc3-supply = <&vcc5v0_sys>;
@@ -37,7 +37,6 @@
         vcc5-supply = <&vcc3v3_sys>;
         vcc6-supply = <&vcc3v3_sys>;
         vcc7-supply = <&vcc3v3_sys>;
-
         regulators {
             vcc3v3_sys: DCDC_REG1 {
                 regulator-name = "vcc3v3_sys";
@@ -89,7 +88,6 @@
                     regulator-off-in-suspend;
                 };
             };
-
             vdd0v9_sys: LDO_REG1 {
                 regulator-name = "vdd0v9_sys";
                 regulator-min-microvolt = <900000>;
@@ -130,13 +128,13 @@
     ......
 
     pmic {
-        // pmic_int设置常态为⾼电平，即低电平有效。
+        // pmic_int is set to normally high level, that is, active low.
         pmic_int: pmic-int {
             rockchip,pins = <0 RK_PC2 RK_FUNC_GPIO &pcfg_pull_up>;
         };
 
-        // 系统复位时pwrctrl引脚应该保持的电平状态，必须跟SoC上电默认状态相反。
-        // ⽐如：默认上电是down, 则配置为output hight；反之则为output low。
+        // The level state that the pwrctrl pin should maintain during system reset, must be opposite to the SoC's default power-on state.
+        // For example: if the default power-on is down, configure as output high; otherwise, configure as output low.
         soc_pwrctrl_reset: soc-pwrctrl-reset {
             rockchip,pins = <0 RK_PC1 RK_FUNC_GPIO &pcfg_output_high>;
         };
```

## Block 8

```diff
--- CN
+++ EN
@@ -1,7 +1,7 @@
 struct regulator *rdev_logic;
 
-rdev_logic = regulator_get(NULL, "vdd_logic");          // 获取vdd_logic
-regulator_enable(rdev_logic);                           // 使能vdd_logic
-regulator_set_voltage(rdev_logic, 1100000, 1100000);    // 设置电压1.1v
-regulator_disable(rdev_logic);                          // 关闭vdd_logic
-regulator_put(rdev_logic);                              // 释放vdd_logic
+rdev_logic = regulator_get(NULL, "vdd_logic");          // Get vdd_logic
+regulator_enable(rdev_logic);                           // Enable vdd_logic
+regulator_set_voltage(rdev_logic, 1100000, 1100000);    // Set voltage 1.1v
+regulator_disable(rdev_logic);                          // Disable vdd_logic
+regulator_put(rdev_logic);                              // Release vdd_logic
```

## Block 9

```diff
--- CN
+++ EN
@@ -1,4 +1,4 @@
-# 读寄存器
+# Read register
 echo r [addr]  > /sys/rk8xx/rk8xx_dbg
-# 写寄存器
+# Write register
 echo w [addr] [value] > /sys/rk8xx/rk8xx_dbg
```

## Block 10

```diff
--- CN
+++ EN
@@ -1,2 +1,2 @@
-echo r 0x2f > /sys/rk8xx/rk8xx_dbg          # 读取0x2f寄存器的值
-echo w 0x2f 0x9c > /sys/rk8xx/rk8xx_dbg     # 设置0x2f寄存器的值为0x9c
+echo r 0x2f > /sys/rk8xx/rk8xx_dbg          # Read the value of register 0x2f
+echo w 0x2f 0x9c > /sys/rk8xx/rk8xx_dbg     # Set the value of register 0x2f to 0x9c
```


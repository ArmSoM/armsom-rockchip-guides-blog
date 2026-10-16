---
title: "Rockchip MIPI DSI Panel Compatibility: Dynamic Detection, Device-Tree Switching and Full Patch"
description: "Complete reference for alternative MIPI DSI panels: U-Boot panel identification, DTS configuration, full source patch and FDT debugging."
translation_key: "051-rockchip-mipi-panel-compatibility"
slug: "051-rockchip-mipi-panel-compatibility"
lang: "en"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: ["MIPI DSI", "U-Boot", "Device Tree", "RK3576", "RK3588"]
keywords: "ArmSoM Rockchip MIPI DSI U-Boot panel ID RK3576 RK3588"
excerpt: "Complete reference for alternative MIPI DSI panels: U-Boot panel identification, DTS configuration, full source patch and FDT debugging."
---

{% raw %}
# Rockchip MIPI DSI Panel Compatibility: Dynamic Detection, Device-Tree Switching and Full Patch

## ArmSoM applicability

This is a Rockchip platform reference, not an ArmSoM hardware test report. The source lists RK3288, RK3399, RK3326/PX30, RK356x, RK3588 and RK3576 with the next-dev U-Boot branch; it specifies no common kernel version. Before adapting an ArmSoM board, verify its MIPI interface, Lane0 readback capability, panel power/reset/backlight, U-Boot branch and boot-logo support. No hardware validation was performed; support is not guaranteed on every ArmSoM board.

The source is the Chinese V1.1.0 PDF, 24 pages. Technical content occupies pages 4–22; pages 23–24 are blank. No English PDF was supplied: English and Russian translate the complete Chinese body, and all versions retain the Chinese original figure. The V1.1.0 technical change fixes abnormal LPDT communication after reading the panel ID. Patch authorship inside code is retained.

[Editorial notes](/docs/rockchip-mipi-panel-compatibility/EDITORIAL-NOTES.md) · [ArmSoM docs](https://docs.armsom.org/)

> Source discrepancy: the patch sets an unmatched node status to `"disa"` in two places, whereas the flowchart and FDT example use `"disabled"`. The original is retained for verification; do not apply it unchecked. The patch has not been compiled, applied or hardware-tested.

## Source product versions

| SoC | U-Boot |
| --- | --- |
| RK3288 | next-dev |
| RK3399 | next-dev |
| RK3326/PX30 | next-dev |
| RK356x | next-dev |
| RK3588 | next-dev |
| RK3576 | next-dev |

## 1. Introduction

This guide helps developers and users configure and enable compatibility with multiple alternative-supplier MIPI displays on Rockchip SoC platforms with a MIPI DSI interface. These are backup displays supplied by different vendors for the same project. Through driver adaptation and device-tree configuration, the same mainboard hardware and firmware can dynamically detect, select and display on these alternative panels.

## 2. Core functionality

### 2.1 Multi-panel compatibility mechanism

#### 2.1.1 Dynamic panel detection

Use the bidirectional transfer capability of MIPI DSI Lane0 to read the connected panel's ID and automatically match a predefined panel description in the device tree.

![Reading the panel ID through bidirectional MIPI DSI Lane0 (Chinese original, PDF page 4)](/docs/rockchip-mipi-panel-compatibility/assets/cn-p4-X187.jpg)

#### 2.1.2 Device-tree fixup

Before enabling the display path during U-Boot, read the connected panel ID. According to the match, dynamically change device-tree node "status" and activate only the matching panel configuration, including its initialization sequence and resolution information.

### 2.2 Device-tree configuration

#### 2.2.1 Defining multiple panel nodes

In DTS, describe every alternative panel's power-up controls, supply enable, RST, backlight, MIPI DSI operating mode, lane count, whether DSC is enabled, DPHY or CPHY, panel initialization sequence, and display resolution.

```text
&dsi0 {
   status = "okay";


   dsi0_panel0: panel0@0 {
      status = "okay";
      compatible = "simple-panel-dsi";
      reg = <0>;

      dsi,flags = <(MIPI_DSI_MODE_LPM | MIPI_DSI_MODE_EOT_PACKET)>;
      dsi,format = <MIPI_DSI_FMT_RGB888>;
      dsi,lanes = <4>;

      slice-width = <720>;
      slice-height = <65>;
      version-major = <1>;

      version-minor = <1>;
      compressed-data;

      id-reg = <0xdb>;
      id = [10];

      panel-init-sequence = [
         /* panel0 init sequence */
      ];

      panel-exit-sequence = [
         /* panel0 exit sequence */

      ];

      disp0_timings0: display-timings {
         native-mode = <&dsi_timing0>;
         dsi_timing0: timing0 {
           clock-frequency = <280000000>;
           hactive = <1440>;
           vactive = <3120>;
           hfront-porch = <16>;
           hsync-len = <8>;
           hback-porch = <8>;
           vfront-porch = <4>;
           vsync-len = <16>;

           vback-porch = <8>;
           hsync-active = <0>;
           vsync-active = <0>;
           de-active = <0>;
         pixelclk-active = <0>;
      };
   };


   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@0 {
         reg = <0>;
         panel0_in_dsi0: endpoint {
            remote-endpoint = <&dsi0_out_panel>;
         };
      };
   };

};

dsi0_panel1: panel1@0 {
   status = "okay";
   compatible = "simple-panel-dsi";
   reg = <0>;

   dsi,flags = <(MIPI_DSI_MODE_VIDEO | MIPI_DSI_MODE_VIDEO_BURST |
      MIPI_DSI_MODE_LPM | MIPI_DSI_MODE_EOT_PACKET)>;
   dsi,format = <MIPI_DSI_FMT_RGB888>;
   dsi,lanes = <2>;

   id-reg = <0xdb>;

   id = [72];

   panel-init-sequence = [
      /* panel1 init sequence */
   ];

   panel-exit-sequence = [
      /* panel1 exit sequence */
   ];

   disp0_timings1: display-timings {
      native-mode = <&dsi_timing1>;

      dsi_timing1: timing0 {
         clock-frequency = <110000000>;
         hactive = <1080>;
         vactive = <1920>;
         hfront-porch = <15>;
         hsync-len = <2>;
         hback-porch = <30>;
         vfront-porch = <15>;
         vsync-len = <2>;
         vback-porch = <15>;
         hsync-active = <0>;
         vsync-active = <0>;
         de-active = <0>;
           pixelclk-active = <1>;
         };
      };


      ports {
         #address-cells = <1>;
         #size-cells = <0>;

         port@0 {
           reg = <0>;
           panel1_in_dsi0: endpoint {
              remote-endpoint = <&dsi0_out_panel>;
           };
         };
      };

   };

   /* more panel */

   ports {
      #address-cells = <1>;
      #size-cells = <0>;

      port@1 {
         reg = <1>;
         dsi0_out_panel: endpoint {
           remote-endpoint = <&panel0_in_dsi0>;
         };

      };
   };

};
```

#### 2.2.2 Panel ID configuration

First confirm with each panel supplier the command for reading the panel ID and the expected ID. Test on the actual panel that the ID can be read successfully as expected, and then describe the ID parameters in DTS.

| Property | Purpose | Example |
| --- | --- | --- |
| `id-reg` | Panel ID register address | `<0xdb>` (register 0xdb; addresses usually differ between panels) |
| `id` | Expected ID, as a hexadecimal byte array | `[10]` (length may also vary by panel) |

### 2.3 Driver and device-tree interaction

#### 2.3.1 Panel detection and switching flow

```text
Start
  |
  v
[Load driver]
  |
  v
[Traverse all panel nodes under the DSI controller and save their information]
  |
  v
[Pre-initialization (pre_prepare)]
  |-- [Initialize MIPI DSI]
  v
[ID matching]
  |-- [Send panel-read-id-sequence, if defined]
  |-- [Read id-reg using DCS]
  |-- [Compare with id in the device tree]
  |-- [Record the matched panel index]
  v
[Dynamic device-tree fixup (fixup_dts)]
  |-- [Activate the matched panel remote-endpoint]
  |-- [Disable unmatched panel nodes: fdt_setprop_string(..., "status", "disabled")]
  v
[Display initialization]
  |-- [Initialize using the matched panel timing and command sequence]
  v
End
```

Multi-panel compatibility reads the panel ID in U-Boot and traverses every panel node below the &dsi node. It therefore adds some boot-time overhead, mainly the panel power-up timing delays. It also depends on U-Boot boot-logo support.

#### 2.3.2 Complete patch

```diff
From ace0a1101133a65dd535043437747916c3f331dc Mon Sep 17 00:00:00 2001
From: Zhibin Huang <zhibin.huang@rock-chips.com>

Date: Sat, 23 Mar 2024 21:39:32 +0800
Subject: [PATCH] video/drm: support multi mipi screen
Type: Function
Redmine ID: N/A

Associated modifications: N/A
Test: N/A

Signed-off-by: Zhibin Huang <zhibin.huang@rock-chips.com>
Change-Id: I4abe3e8bf6a4b226bc400054fa1c0ba523aafd93
---

diff --git a/drivers/video/drm/dw_mipi_dsi.c b/drivers/video/drm/dw_mipi_dsi.c
index 2ebe826..6e13b24 100644
--- a/drivers/video/drm/dw_mipi_dsi.c
+++ b/drivers/video/drm/dw_mipi_dsi.c
@@ -18,6 +18,7 @@

 #include <syscon.h>
 #include <asm/arch-rockchip/clock.h>
 #include <linux/iopoll.h>
+#include <fdt_support.h>

 #include "rockchip_display.h"
 #include "rockchip_crtc.h"
@@ -1259,6 +1260,46 @@
      dw_mipi_dsi_pre_enable(dsi->slave);
 }

+static void dw_mipi_dsi_connector_pre_prepare(struct rockchip_connector *conn,
+                  struct display_state *state)

+{
+  struct connector_state *conn_state = &state->conn_state;
+  struct dw_mipi_dsi *dsi = dev_get_priv(conn->dev);
+  unsigned long lane_rate = 1000000000UL;
+
+  memcpy(&dsi->mode, &conn_state->mode, sizeof(struct drm_display_mode));
+  if (dsi->slave)
+     memcpy(&dsi->slave->mode, &dsi->mode,
+          sizeof(struct drm_display_mode));
+
+  if (dsi->dphy.phy)
+     dw_mipi_dsi_set_hs_clk(dsi, lane_rate);

+  else
+     dw_mipi_dsi_set_pll(dsi, lane_rate);
+
+  if (dsi->slave && dsi->slave->dphy.phy)
+     dw_mipi_dsi_set_hs_clk(dsi->slave, lane_rate);
+
+  printf("final DSI-Link bandwidth: %u Mbps x %d\n",
+       dsi->lane_mbps, dsi->slave ? dsi->lanes * 2 : dsi->lanes);
+
+  dw_mipi_dsi_init(dsi);
+  dw_mipi_dsi_dpi_config(dsi, &dsi->mode);
+  dw_mipi_dsi_packet_handler_config(dsi);
+  dw_mipi_dsi_video_mode_config(dsi);
+  dw_mipi_dsi_command_mode_config(dsi);
+  dsi_update_bits(dsi, DSI_MODE_CFG, CMD_VIDEO_MODE, COMMAND_MODE);
+

+  dw_mipi_dsi_dphy_timing_config(dsi);
+  dw_mipi_dsi_dphy_interface_config(dsi);
+
+  dw_mipi_dsi_clear_err(dsi);
+
+  mipi_dphy_init(dsi);
+  mipi_dphy_power_on(dsi);
+  dsi_write(dsi, DSI_PWR_UP, POWERUP);
+}
+
 static int dw_mipi_dsi_connector_prepare(struct rockchip_connector *conn,
                struct display_state *state)

 {
@@ -1320,12 +1361,50 @@
   return 0;
 }

+static void dw_mipi_dsi_connector_fixup_dts(struct rockchip_connector *conn,
+                 struct display_state *state)
+{
+  struct panel_state *panel_state = &state->panel_state;
+  struct rockchip_panel *panel = panel_state->panel;
+  ofnode *rockchip_panel_node = &panel->dev->node;
+  const struct device_node *conn_node;
+  char conn_endpoint_path[128], panel_endpoint_path[128];

+  const char *conn_path, *panel_path;
+  void *blob = (void*)gd->fdt_blob;
+  ofnode node;
+  u32 phandle = 0;
+  int offset;
+
+  conn_node = ofnode_to_np(conn->dev->node);
+  conn_path = conn_node->full_name;
+  strcpy(conn_endpoint_path, conn_path);
+  strcat(conn_endpoint_path, "/ports/port@1/endpoint");
+
+  panel_path = rockchip_panel_node->np->full_name;

+  strcpy(panel_endpoint_path, panel_path);
+  strcat(panel_endpoint_path, "/ports/port@0/endpoint");
+  phandle = fdt_get_phandle(blob, fdt_path_offset(blob, panel_endpoint_path));
+  do_fixup_by_path_u32(blob, (const char*)conn_endpoint_path,
+            "remote-endpoint", phandle, 1);
+
+  ofnode_for_each_subnode(node, conn->dev->node) {
+     if (strstr(node.np->name, "panel") &&
+        ofnode_valid(node) && ofnode_is_available(node) &&
+        strcmp(node.np->full_name, panel_path)) {
+        offset = fdt_path_offset(blob, node.np->full_name);
+        fdt_setprop_string(blob, offset, "status", "disa");
+     }
+  }
+}
+

 static const struct rockchip_connector_funcs dw_mipi_dsi_connector_funcs = {
   .init = dw_mipi_dsi_connector_init,
   .prepare = dw_mipi_dsi_connector_prepare,
   .unprepare = dw_mipi_dsi_connector_unprepare,
   .enable = dw_mipi_dsi_connector_enable,
   .disable = dw_mipi_dsi_connector_disable,
+  .pre_prepare = dw_mipi_dsi_connector_pre_prepare,
+  .fixup_dts = dw_mipi_dsi_connector_fixup_dts,
 };

 static int dw_mipi_dsi_probe(struct udevice *dev)
diff --git a/drivers/video/drm/dw_mipi_dsi2.c b/drivers/video/drm/dw_mipi_dsi2.c

index ecd086d7d62..b62fafae370 100644
--- a/drivers/video/drm/dw_mipi_dsi2.c
+++ b/drivers/video/drm/dw_mipi_dsi2.c
@@ -555,6 +555,8 @@ static void dw_mipi_dsi2_ipi_color_coding_cfg(struct dw_mipi_dsi2 *dsi2)

   if (dsi2->dsc_enable)
      grf_field_write(dsi2, IPI_FORMAT, IPI_FORMAT_DSC);
+  else
+     grf_field_write(dsi2, IPI_FORMAT, IPI_FORMAT_RGB);
 }

 static void dw_mipi_dsi2_ipi_set(struct dw_mipi_dsi2 *dsi2)
@@ -719,11 +721,13 @@ static void dw_mipi_dsi2_disable(struct dw_mipi_dsi2 *dsi2)

      dw_mipi_dsi2_disable(dsi2->slave);
 }

+static void dw_mipi_dsi2_host_softrst(struct dw_mipi_dsi2 *dsi2);
 static void dw_mipi_dsi2_post_disable(struct dw_mipi_dsi2 *dsi2)
 {
   if (!dsi2->prepared)
      return;

+  dw_mipi_dsi2_host_softrst(dsi2);
   dsi_write(dsi2, DSI2_PWR_UP, RESET);


   if (dsi2->dcphy.phy)
@@ -853,6 +857,9 @@ static int dw_mipi_dsi2_connector_init(struct rockchip_connector *conn,
struct d
   if (!(dsi2->mode_flags & MIPI_DSI_MODE_VIDEO)) {
      conn_state->output_flags |= ROCKCHIP_OUTPUT_MIPI_DS_MODE;
      conn_state->hold_mode = dsi2->disable_hold_mode ? false : true;
+  } else {
+     conn_state->output_flags &= ~ROCKCHIP_OUTPUT_MIPI_DS_MODE;
+     conn_state->hold_mode = false;
   }

   if (dsi2->dual_channel) {
@@ -912,6 +919,8 @@ static int dw_mipi_dsi2_connector_init(struct rockchip_connector *conn,
struct d
      cstate->dsc_sink_cap.target_bits_per_pixel_x16 = 8 << 4;

      cstate->dsc_sink_cap.native_420 = 0;
      memcpy(&cstate->pps, dsi2->pps, sizeof(struct drm_dsc_picture_parameter_set));
+  } else {
+     cstate->dsc_enable = 0;
   }

   return 0;
@@ -1185,6 +1194,31 @@ static void dw_mipi_dsi2_get_mipi_pixel_clk(struct dw_mipi_dsi2
*dsi2,
      dsi2->slave->mipi_pixel_rate = dsi2->mipi_pixel_rate;
}


+static void dw_mipi_dsi2_connector_pre_prepare(struct rockchip_connector *conn,
+                  struct display_state *state)
+{
+  struct dw_mipi_dsi2 *dsi2 = dev_get_priv(conn->dev);
+  struct connector_state *conn_state = &state->conn_state;
+  unsigned long lane_rate = 1000000000UL;
+
+  memcpy(&dsi2->mode, &conn_state->mode, sizeof(struct drm_display_mode));
+  if (dsi2->slave)
+     memcpy(&dsi2->slave->mode, &dsi2->mode,
+          sizeof(struct drm_display_mode));
+
+  if (dsi2->dcphy.phy)

+     dw_mipi_dsi2_set_hs_clk(dsi2, lane_rate);
+
+  if (dsi2->slave && dsi2->slave->dcphy.phy)
+     dw_mipi_dsi2_set_hs_clk(dsi2->slave, lane_rate);
+
+  printf("final DSI-Link bandwidth: %u %s x %d\n",
+       dsi2->lane_hs_rate, dsi2->c_option ? "Ksps" : "Kbps",
+       dsi2->slave ? dsi2->lanes * 2 : dsi2->lanes);
+
+  dw_mipi_dsi2_pre_enable(dsi2);
+}
+

static int dw_mipi_dsi2_connector_prepare(struct rockchip_connector *conn,
                struct display_state *state)
{
@@ -1281,6 +1315,42 @@ static int dw_mipi_dsi2_connector_mode_valid(struct
rockchip_connector *conn,
   return MODE_OK;
 }

+static void dw_mipi_dsi2_connector_fixup_dts(struct rockchip_connector *conn,
+                 struct display_state *state)
+{
+  struct panel_state *panel_state = &state->panel_state;
+  struct rockchip_panel *panel = panel_state->panel;
+  ofnode *rockchip_panel_node = &panel->dev->node;
+  const struct device_node *conn_node;
+  char conn_endpoint_path[128], panel_endpoint_path[128];

+  const char *conn_path, *panel_path;
+  void *blob = (void*)gd->fdt_blob;
+  ofnode node;
+  u32 phandle = 0;
+  int offset;
+
+  conn_node = ofnode_to_np(conn->dev->node);
+  conn_path = conn_node->full_name;
+  strcpy(conn_endpoint_path, conn_path);
+  strcat(conn_endpoint_path, "/ports/port@1/endpoint");
+
+  panel_path = rockchip_panel_node->np->full_name;

+  strcpy(panel_endpoint_path, panel_path);
+  strcat(panel_endpoint_path, "/ports/port@0/endpoint");
+  phandle = fdt_get_phandle(blob, fdt_path_offset(blob, panel_endpoint_path));
+  do_fixup_by_path_u32(blob, (const char*)conn_endpoint_path,
+            "remote-endpoint", phandle, 1);
+
+  ofnode_for_each_subnode(node, conn->dev->node) {
+     if (strstr(node.np->name, "panel") &&
+        ofnode_valid(node) && ofnode_is_available(node) &&
+        strcmp(node.np->full_name, panel_path)) {
+        offset = fdt_path_offset(blob, node.np->full_name);
+        fdt_setprop_string(blob, offset, "status", "disa");
+     }

+  }
+}
+
static const struct rockchip_connector_funcs dw_mipi_dsi2_connector_funcs = {
   .pre_init = dw_mipi_dsi2_connector_pre_init,
   .init = dw_mipi_dsi2_connector_init,
@@ -1289,6 +1359,8 @@ static const struct rockchip_connector_funcs
dw_mipi_dsi2_connector_funcs = {
   .enable = dw_mipi_dsi2_connector_enable,
   .disable = dw_mipi_dsi2_connector_disable,
   .mode_valid = dw_mipi_dsi2_connector_mode_valid,
+  .pre_prepare = dw_mipi_dsi2_connector_pre_prepare,

+  .fixup_dts = dw_mipi_dsi2_connector_fixup_dts,
 };

static int dw_mipi_dsi2_probe(struct udevice *dev)
diff --git a/drivers/video/drm/rockchip_connector.h b/drivers/video/drm/rockchip_connector.h
index 8c2ff75..e098b7f 100644
--- a/drivers/video/drm/rockchip_connector.h
+++ b/drivers/video/drm/rockchip_connector.h
@@ -183,6 +183,12 @@
    */
   int (*get_edid)(struct rockchip_connector *connector, struct display_state *state);
   /*
+   * for reading panel id,configure mipi host and phy simply
+   * so that reading and writing command can send succeessfully.
+   */
+  void (*pre_prepare)(struct rockchip_connector *connector, struct display_state *state);

+  void (*fixup_dts)(struct rockchip_connector *connector, struct display_state *state);
+  /*
    * call before crtc enable.
    */
   int (*prepare)(struct rockchip_connector *connector, struct display_state *state);
diff --git a/drivers/video/drm/rockchip_display.c b/drivers/video/drm/rockchip_display.c
index ae99b4d..1042f41 100644
--- a/drivers/video/drm/rockchip_display.c
+++ b/drivers/video/drm/rockchip_display.c
@@ -762,6 +762,15 @@
   if (!ret && !state->force_output)
      goto deinit;


+  if (conn->panel) {
+     rockchip_panel_pre_prepare(conn->panel);
+     if (state->enabled_at_spl == false) {
+        ret = rockchip_connector_init(state);
+        if (ret)
+           goto deinit;
+     }
+  }
+
   ret = 0;
   if (state->enabled_at_spl == true) {
 #ifdef CONFIG_SPL_BUILD

@@ -1736,12 +1745,17 @@
   int ret = 0;

   *panel = NULL;
-  panel_ofnode = dev_read_subnode(dev, "panel");
-  if (ofnode_valid(panel_ofnode) && ofnode_is_available(panel_ofnode)) {
-     ret = uclass_get_device_by_ofnode(UCLASS_PANEL, panel_ofnode,
-                  &panel_dev);
-     if (!ret)
-        goto found;
+  ofnode_for_each_subnode(panel_ofnode, dev->node) {
+     if (!strstr(panel_ofnode.np->name, "panel"))

+        continue;
+     if (ofnode_valid(panel_ofnode) &&
+        ofnode_is_available(panel_ofnode)) {
+        ret = uclass_get_device_by_ofnode(UCLASS_PANEL,
+                     panel_ofnode,
+                     &panel_dev);
+        if (!ret)
+           goto found;
+     }
   }

   ep_node = rockchip_of_graph_get_remote_node(dev->node, PORT_DIR_OUT, 0);
diff --git a/drivers/video/drm/rockchip_panel.c b/drivers/video/drm/rockchip_panel.c
index 9ddb4d8..f4b91c5 100644
--- a/drivers/video/drm/rockchip_panel.c
+++ b/drivers/video/drm/rockchip_panel.c

@@ -15,16 +15,20 @@
 #include <spi.h>
 #include <asm/gpio.h>
 #include <dm/device.h>
+#include <dm/device-internal.h>
 #include <dm/read.h>
 #include <dm/uclass.h>
 #include <dm/uclass-id.h>
 #include <linux/media-bus-format.h>
 #include <power/regulator.h>
+#include <dm/of_access.h>
+#include <fdt_support.h>


 #include "rockchip_display.h"
 #include "rockchip_crtc.h"
 #include "rockchip_connector.h"
 #include "rockchip_panel.h"
+#include "rockchip_phy.h"

 struct rockchip_cmd_header {
   u8 data_type;
@@ -42,6 +46,11 @@
   int cmd_cnt;
 };


+struct dsi_panel_id {
+  u8 *buf;
+  int len;
+};
+
 struct rockchip_panel_plat {
   bool power_invert;
   u32 bus_format;
@@ -58,6 +67,10 @@

   struct rockchip_panel_cmds *on_cmds;
   struct rockchip_panel_cmds *off_cmds;

+  struct rockchip_panel_cmds *read_id_cmds;
+
+  unsigned int id_reg;
+  struct dsi_panel_id *id;
 };

 struct rockchip_panel_priv {
@@ -411,7 +424,205 @@
   priv->enabled = false;
 }

+static int panel_simple_dsi_match_id(struct rockchip_panel *panel)
+{
+  struct rockchip_panel_plat *plat = dev_get_platdata(panel->dev);
+  struct rockchip_panel_priv *priv = dev_get_priv(panel->dev);
+  struct mipi_dsi_device *dsi = dev_get_parent_platdata(panel->dev);

+  int cmd_len = plat->id->len;
+  int read_count = 1, match_count;
+  int ret = -EINVAL;
+  u8 *panel_id;
+
+  panel_id = malloc(sizeof(char) * cmd_len);
+
+  if (priv->power_supply)
+     regulator_set_enable(priv->power_supply, !plat->power_invert);
+
+  if (dm_gpio_is_valid(&priv->enable_gpio))
+     dm_gpio_set_value(&priv->enable_gpio, 1);

+
+  if (plat->delay.prepare)
+     mdelay(plat->delay.prepare);
+
+  if (dm_gpio_is_valid(&priv->reset_gpio))
+     dm_gpio_set_value(&priv->reset_gpio, 1);
+
+  if (plat->delay.reset)
+     mdelay(plat->delay.reset);
+
+  if (dm_gpio_is_valid(&priv->reset_gpio))
+     dm_gpio_set_value(&priv->reset_gpio, 0);
+

+  if (plat->delay.init)
+     mdelay(plat->delay.init);
+
+  if (plat->read_id_cmds) {
+     rockchip_panel_send_dsi_cmds(dsi, plat->read_id_cmds);
+     free(plat->read_id_cmds);
+     plat->read_id_cmds = NULL;
+  }
+
+  if (cmd_len > 1)
+     mipi_dsi_set_maximum_return_packet_size(dsi, cmd_len);
+

+  for (int i = 0; i < read_count; i++) {
+
+     printf("panel id, reg: 0x%02x, val: ", plat->id_reg);
+     for (int j = 0; j < cmd_len; j++)
+        printf("%02x", plat->id->buf[j]);
+     printf("\n");
+     ret = mipi_dsi_dcs_read(dsi, plat->id_reg, panel_id, cmd_len);
+     if (ret > 0) {
+        printf("read panel id, reg: 0x%02x, val: ", plat->id_reg);
+        match_count = 0;
+        for (int j = 0; j < cmd_len; j++) {
+           printf("%02x", panel_id[j]);
+           if (panel_id[j] == plat->id->buf[j])
+              match_count++;
+        }
+        printf("\n");

+        if (match_count == cmd_len) {
+           ret = 0;
+           break;
+        }
+        ret = -EINVAL;
+     } else {
+        printf("read panel timeout or no response\n");
+        ret = -ETIMEDOUT;
+     }
+  }
+
+  if (dm_gpio_is_valid(&priv->reset_gpio))

+     dm_gpio_set_value(&priv->reset_gpio, 1);
+
+  if (dm_gpio_is_valid(&priv->enable_gpio))
+     dm_gpio_set_value(&priv->enable_gpio, 0);
+
+  if (priv->power_supply)
+     regulator_set_enable(priv->power_supply, plat->power_invert);
+
+  if (plat->delay.unprepare)
+     mdelay(plat->delay.unprepare);
+
+  return ret;
+}

+
+static int panel_simple_dsi_match(struct display_state *state, int panel_num)
+{
+  struct connector_state *conn_state = &state->conn_state;
+  struct panel_state *panel_state = &state->panel_state;
+  struct rockchip_connector *conn = conn_state->connector;
+  const struct rockchip_connector_funcs *conn_funcs = conn->funcs;
+  struct rockchip_panel *panel;
+  ofnode panel_ofnode;
+  struct udevice *panel_dev;
+  int ret;
+

+  if (conn_funcs->pre_init) {
+     ret = conn_funcs->pre_init(conn, state);
+     if (ret) {
+        printf("failed to pre_init connector\n");
+        goto deinit;
+     }
+  }
+
+  if (conn_funcs->init) {
+     ret = conn_funcs->init(conn, state);
+     if (ret) {
+        printf("failed to init connector\n");
+        goto deinit;
+     }
+  }
+

+  if (conn->phy)
+     rockchip_phy_init(conn->phy);
+
+  if (conn_funcs->pre_prepare)
+     conn_funcs->pre_prepare(conn, state);
+
+  ofnode_for_each_subnode(panel_ofnode, conn->dev->node) {
+     if (!strstr(panel_ofnode.np->name, "panel"))
+        continue;
+     if (ofnode_valid(panel_ofnode) &&
+        ofnode_is_available(panel_ofnode)) {
+        ret = uclass_get_device_by_ofnode(UCLASS_PANEL,

+                     panel_ofnode,
+                     &panel_dev);
+        if (ret) {
+           printf("this sub node is not a panel node\n");
+           continue;
+        }
+     } else {
+        continue;
+     }
+
+     panel = (struct rockchip_panel *)dev_get_driver_data(panel_dev);
+     if (!panel) {
+        printf("can not found panel\n");

+        ret = -ENODEV;
+        break;
+     }
+
+     panel_state->panel = panel;
+     conn->panel = panel;
+     panel->state = state;
+
+     printf("try to match %s\n", panel_ofnode.np->full_name);
+     ret = panel_simple_dsi_match_id(panel);
+     if (!ret)
+        break;

+
+     if (panel_num > 1) {
+        device_remove(panel_dev, DM_REMOVE_NORMAL);
+        panel_num--;
+     }
+  }
+
+  if (conn_funcs->disable)
+     conn_funcs->disable(conn, state);
+
+  if (conn_funcs->unprepare)
+     conn_funcs->unprepare(conn, state);
+
+  if (conn_funcs->fixup_dts)
+     conn_funcs->fixup_dts(conn, state);
+

+deinit:
+  if (conn_funcs->deinit)
+     conn_funcs->deinit(conn, state);
+
+  return ret;
+}
+
+static void panel_simple_pre_prepare(struct rockchip_panel *panel)
+{
+  struct display_state *state = panel->state;
+  struct connector_state *conn_state = &state->conn_state;
+  struct rockchip_connector *conn = conn_state->connector;

+  char *conn_name = (char *)conn->dev->node.np->full_name;
+  ofnode panel_ofnode;
+  int panel_num = 0;
+
+  conn_state->bus_format = panel->bus_format;
+
+  ofnode_for_each_subnode(panel_ofnode, conn->dev->node) {
+     if (strstr(panel_ofnode.np->name, "panel") &&
+        ofnode_valid(panel_ofnode) &&
+        ofnode_is_available(panel_ofnode))
+        panel_num++;
+  }
+

+  if (panel_num > 1 && strstr(conn_name, "dsi")) {
+     if (panel_simple_dsi_match(state, panel_num))
+        printf("fail to match valid panel\n");
+     else
+        printf("success to match valid panel\n");
+  }
+}
+
 static const struct rockchip_panel_funcs rockchip_panel_funcs = {
+  .pre_prepare = panel_simple_pre_prepare,
   .prepare = panel_simple_prepare,
   .unprepare = panel_simple_unprepare,

   .enable = panel_simple_enable,
@@ -436,6 +647,17 @@

   plat->bus_format = dev_read_u32_default(dev, "bus-format",
                  MEDIA_BUS_FMT_RBG888_1X24);
+  plat->id_reg = dev_read_u32_default(dev, "id-reg", 0);
+  data = dev_read_prop(dev, "id", &len);
+
+  if (data) {
+     plat->id = malloc(sizeof(*plat->id));
+     if (!plat->id)
+        return -ENOMEM;
+     plat->id->buf = malloc(sizeof(char) * len);
+     memcpy(plat->id->buf, data, len);
+     plat->id->len = len;
+  }

   plat->bpc = dev_read_u32_default(dev, "bpc", 8);

   data = dev_read_prop(dev, "panel-init-sequence", &len);
@@ -451,6 +673,19 @@
      }
   }

+  data = dev_read_prop(dev, "panel-read-id-sequence", &len);
+  if (data) {
+     plat->read_id_cmds = calloc(1, sizeof(*plat->read_id_cmds));
+     if (!plat->read_id_cmds)
+        return -ENOMEM;

+
+     ret = rockchip_panel_parse_cmds(data, len, plat->read_id_cmds);
+     if (ret) {
+        printf("failed to parse panel read id sequence\n");
+        goto free_read_id_cmds;
+     }
+  }
+
   data = dev_read_prop(dev, "panel-exit-sequence", &len);
   if (data) {
      plat->off_cmds = calloc(1, sizeof(*plat->off_cmds));
@@ -470,6 +705,8 @@


 free_cmds:
   free(plat->off_cmds);
+free_read_id_cmds:
+  free(plat->read_id_cmds);
 free_on_cmds:
   free(plat->on_cmds);
   return ret;
@@ -574,6 +811,19 @@
   return 0;
 }

+static int panel_simple_remove(struct udevice *dev) {

+  struct rockchip_panel_priv *priv = dev_get_priv(dev);
+
+  printf("remove %s\n", dev->node.np->full_name);
+
+  if (dm_gpio_is_valid(&priv->enable_gpio))
+     dm_gpio_free(dev, &priv->enable_gpio);
+  if (dm_gpio_is_valid(&priv->reset_gpio))
+     dm_gpio_free(dev, &priv->reset_gpio);
+
+  return 0;
+}
+
 static const struct udevice_id rockchip_panel_ids[] = {
   { .compatible = "simple-panel", },
   { .compatible = "simple-panel-dsi", },
@@ -587,6 +837,7 @@

   .of_match = rockchip_panel_ids,
   .ofdata_to_platdata = rockchip_panel_ofdata_to_platdata,
   .probe = rockchip_panel_probe,
+  .remove = panel_simple_remove,
   .priv_auto_alloc_size = sizeof(struct rockchip_panel_priv),
   .platdata_auto_alloc_size = sizeof(struct rockchip_panel_plat),
 };
diff --git a/drivers/video/drm/rockchip_panel.h b/drivers/video/drm/rockchip_panel.h
index 5e49fe3..b503e84 100644
--- a/drivers/video/drm/rockchip_panel.h
+++ b/drivers/video/drm/rockchip_panel.h
@@ -12,10 +12,12 @@

 struct rockchip_conn;

 struct rockchip_panel_funcs {
+  void (*pre_prepare)(struct rockchip_panel *panel);
   void (*prepare)(struct rockchip_panel *panel);
   void (*unprepare)(struct rockchip_panel *panel);
   void (*enable)(struct rockchip_panel *panel);
   void (*disable)(struct rockchip_panel *panel);
+  void (*init)(struct rockchip_panel *panel);
   int (*get_mode)(struct rockchip_panel *panel,
         struct drm_display_mode *mode);
 };
@@ -48,6 +50,15 @@

      state->conn_state.bpc = panel->bpc;
 }

+static inline void rockchip_panel_pre_prepare(struct rockchip_panel *panel)
+{
+  if (!panel)
+     return;
+
+  if (panel->funcs && panel->funcs->pre_prepare)
+     panel->funcs->pre_prepare(panel);
+}
+

 static inline void rockchip_panel_prepare(struct rockchip_panel *panel)
 {
   if (!panel)
```

## 3. Debugging

### 3.1 Key log analysis

Use the following messages to investigate why reading the panel ID failed:

```text
# ID匹配成功日志
read panel id, reg: 0xDA, val: 09 # 读取到的ID值

success to match valid panel # 驱动确认匹配

# 异常场景
fail to read panel id       # 通信失败
ID mismatch: expect 08 got 09 # ID不匹配
```

The comments identify successful ID matching, the ID value read, driver confirmation, communication failure, and an ID mismatch (expected 08, received 09).

### 3.2 FDT debugging

```text
adb pull /sys/firmware/fdt ./fdt

# Decompile the DTB in the kernel source root

./scripts/dtc/dtc -I dtb -O dts -o fdt.dts ./fdt
```

Inspect fdt.dts to verify that node status values are as expected, for example:

```text
panel0@0 { status = "okay"; ... };
panel1@0 { status = "disabled"; ... };
```

{% endraw %}


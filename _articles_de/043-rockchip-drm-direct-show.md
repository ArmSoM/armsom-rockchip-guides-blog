---
title: "Rockchip DRM Direct Show: Kernel-Anzeige-APIs und Kernel-Logo"
description: "Vollständige Referenz zu Rockchip DRM Direct Show mit Kernel-Anzeige-APIs, Pufferfeldern, automatisierten Tests und Kernel-Logo-Konfiguration."
translation_key: "043-rockchip-drm-direct-show"
slug: "043-rockchip-drm-direct-show"
lang: "de"
date: "2026-10-16"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["DRM", "Direct Show", "Kernel Logo", "RK356X", "RK3588"]
keywords: "ArmSoM Rockchip DRM Direct Show kernel logo RK356X RK3588"
excerpt: "Vollständige Referenz zu Rockchip DRM Direct Show mit Kernel-Anzeige-APIs, Pufferfeldern, automatisierten Tests und Kernel-Logo-Konfiguration."
---

{% raw %}
# Rockchip DRM Direct Show: Kernel-Anzeige-APIs und Kernel-Logo

## Anwendbarkeit auf ArmSoM

Dies ist eine Plattformreferenz des Herstellers, kein Testbericht zu ArmSoM-Hardware. Die Quelle behandelt RK356X/RK3588 mit dem entsprechenden Rockchip-BSP und Linux-Kernel 5.10 oder neuer. Prüfen Sie SoC, SDK-Zweig, DRM-Direct-Show-APIs, Bildschirmausgabe und Plane-Namen der Zielplatine. Ein hinreichend neuer Kernel allein bedeutet weder Unterstützung in beliebigen Mainline-Kerneln noch auf jedem ArmSoM-Board. Es erfolgte keine Hardwareprüfung.

Quelle: das chinesische *Rockchip DRM Direct Show Developer Guide*, V1.0.0, 8 Seiten. Es wurde kein englisches PDF bereitgestellt. Der gesamte technische Inhalt wurde aus dem Chinesischen ins Englische und Russische übersetzt; die deutsche Fassung übersetzt den geprüften englischen Inhalt vollständig. Alle Fassungen verwenden die Originalabbildung des chinesischen PDFs. Nichttechnische Deckblattangaben, Zielgruppe und Revisionshistorie wurden entfernt. [Redaktionelle Hinweise](/docs/rockchip-drm-direct-show/EDITORIAL-NOTES.md). Prüfen Sie die Board-Anpassung anhand der [offiziellen ArmSoM-Dokumentation](https://docs.armsom.org/).

## Vorwort und Produktversion

Diese Anleitung beschreibt die Schnittstellen zur Bildübergabe im Kernel-Space, die das Rockchip-DRM-Anzeigetreiber-Framework bereitstellt. Typische Anwendungen sind schnelle Bildanzeige, Kernel-Logo und automatisierte Tests.

| Chip | Kernel-Version |
| --- | --- |
| RK356X/RK3588 | Linux-Kernel 5.10 oder neuer |

## 1. Direct-Show-APIs und Verwendung

### 1.1 API-Beschreibungen

#### 1.1.1 DRM-Gerät abrufen

```c
struct drm_device *rockchip_drm_get_dev(void);
```

Ruft das DRM-Gerät ab. Dieses wird für die anschließende Pufferzuweisung und -freigabe, das Abrufen von crtc und plane sowie die Bildübergabe benötigt.

#### 1.1.2 Speicher zuweisen

```c
int rockchip_drm_direct_show_alloc_buffer(struct drm_device *drm,
                                         struct rockchip_drm_direct_show_buffer *buffer)
```

Eingabefelder von buffer:

| Variable | Beschreibung |
| --- | --- |
| width | Pufferbreite in Pixeln |
| height | Pufferhöhe in Pixeln |
| pixel_format | Pufferformat; siehe Definitionen in `include/uapi/drm/drm_fourcc.h` |
| flag | Legt den Puffertyp fest. Der Standardwert 0 wählt verteilten, nicht zusammenhängenden Speicher; `ROCKCHIP_BO_CONTIG` wählt zusammenhängenden Speicher |

Ausgabefelder von buffer:

| Variable | Beschreibung |
| --- | --- |
| bpp | Aus `buffer->pixel_format` abgeleitete Anzahl der Bits je Pixel |
| pitch[3] | Virtuelle Pufferbreite, abgeleitet aus `buffer->width`, `buffer->pixel_format` und Ausrichtungsregeln |
| vir_addr[3] | Virtuelle Kernel-Space-Adresse des zugewiesenen Puffers |
| phy_addr[3] | Physische Adresse des zugewiesenen Puffers |
| rk_gem_obj | Abstraktion, mit der der rockchip-drm-gem-Treiber diesen Puffer verwaltet |
| fb | Abstraktion dieses Puffers für die Anzeige über eine drm-Plane |
| dmabuf_fd | Aus dem Puffer exportierter dmabuf_fd, den andere Module verwenden können |

Für `buffer->pitch[3]`, `buffer->vir_addr[3]` und `buffer->phy_addr[3]` dient `buffer->pitch[3]` als Beispiel: RGB verwendet standardmäßig `buffer->pitch[0]`; NV12 hat 2 Ebenen und verwendet `buffer->pitch[0]` sowie `buffer->pitch[1]`; ein Format mit 3 Ebenen verwendet `buffer->pitch[0]`, `buffer->pitch[1]` und `buffer->pitch[2]`.

#### 1.1.3 crtc abrufen

```c
struct drm_crtc *rockchip_drm_direct_show_get_crtc(struct drm_device *drm)
```

Ruft den aktuell verwendeten crtc ab.

#### 1.1.4 plane abrufen

```c
struct drm_plane *rockchip_drm_direct_show_get_plane(struct drm_device *drm,
                                                  char *name)
```

Ruft die dem Namen entsprechende Plane für die Anzeige ab. Beispiel zum Abrufen von Esmart0-win0:

```c
plane = rockchip_drm_direct_show_get_plane(drm_dev, "Esmart0-win0")
```

#### 1.1.5 Zur Anzeige übergeben

```c
int rockchip_drm_direct_show_commit(struct drm_device *drm,
                                    struct rockchip_drm_direct_show_commit_info *commit_info)
```

| Variable von commit_info | Beschreibung |
| --- | --- |
| crtc | Legt den crtc fest, an den übergeben wird |
| plane | Legt die zu übergebende Plane fest |
| buffer | Zur Anzeige übergebener Puffer |
| top_zpos | false: Standardkonfiguration verwenden; true: ganz oben platzieren |
| src_x/src_y/src_w/src_h | Versatz und Größe des angezeigten Pufferbereichs; siehe folgende Abbildung |
| dst_x/dst_y/dst_w/dst_h | Position und Größe der aktuellen Plane auf dem Bildschirm; siehe folgende Abbildung |

![Originalabbildung des chinesischen PDFs: Quellbereich des Framebuffers sowie Versatz und Abmessungen auf dem Zielbildschirm](/docs/rockchip-drm-direct-show/assets/cn-p6-X55.png)

#### 1.1.6 Plane deaktivieren

```c
int rockchip_drm_direct_show_disable_plane(struct drm_device *drm,
                                         struct drm_plane *plane)
```

Wenn die aktuelle Plane nicht mehr angezeigt werden soll, deaktiviert diese Schnittstelle ihre Anzeige.

#### 1.1.7 Speicher freigeben

```c
void rockchip_drm_direct_show_free_buffer(struct drm_device *drm,
                                        struct rockchip_drm_direct_show_buffer *buffer)
```

Geben Sie nach dem Deaktivieren der Plane mit dieser Schnittstelle deren Pufferspeicher frei, sofern der Puffer nicht mehr benötigt wird.

### 1.2 Verwendungsablauf

Rockchip DRM Direct Show ist standardmäßig deaktiviert. Aktivieren Sie es bei Bedarf in `rockchip_defconfig`:

```diff
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index b1c92060c6f9..2e3091f8631f 100644
--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -588,6 +588,8 @@ CONFIG_DRM_IGNORE_IOTCL_PERMIT=y
 CONFIG_DRM_DP_AUX_CHARDEV=y
 CONFIG_DRM_LOAD_EDID_FIRMWARE=y
 CONFIG_DRM_ROCKCHIP=y
+CONFIG_ROCKCHIP_DRM_DIRECT_SHOW=y
```

Der grundlegende Ablauf umfasst diese 7 Schritte:

1. drm-Gerät abrufen.
2. Puffer mit dem benötigten Format und den erforderlichen Abmessungen zuweisen.
3. Gewünschtes Bild in den zugewiesenen Puffer zeichnen.
4. crtc und plane abrufen.
5. Zur Anzeige übergeben.
6. Plane deaktivieren, sobald keine Anzeige mehr erforderlich ist.
7. Speicher freigeben.

## 2. Automatisierter Testfall

Ein automatisiertes Rockchip-DRM-Testprogramm ist mithilfe von Rockchip DRM Direct Show umgesetzt. Entwickler können es als Referenz oder als automatisiertes Testprogramm für den Rockchip-DRM-Treiber nutzen. Die Funktion ist standardmäßig deaktiviert; aktivieren Sie sie in `rockchip_defconfig`:

```diff
diff --git a/arch/arm64/configs/rockchip_defconfig b/arch/arm64/configs/rockchip_defconfig
index b1c92060c6f9..2e3091f8631f 100644
--- a/arch/arm64/configs/rockchip_defconfig
+++ b/arch/arm64/configs/rockchip_defconfig
@@ -588,6 +588,8 @@ CONFIG_DRM_IGNORE_IOTCL_PERMIT=y
 CONFIG_DRM_DP_AUX_CHARDEV=y
 CONFIG_DRM_LOAD_EDID_FIRMWARE=y
 CONFIG_DRM_ROCKCHIP=y
 CONFIG_ROCKCHIP_DRM_DIRECT_SHOW=y
+CONFIG_ROCKCHIP_DRM_SELF_TEST=y
```

## 3. Kernel-Logo anzeigen

Manche Produkte verwenden nicht das offizielle U-Boot von Rockchip oder können aus anderen Gründen kein U-Boot-Logo anzeigen, benötigen aber dennoch ein Kernel-Logo. Passen Sie dafür das automatisierte Direct-Show-Testprogramm an:

```diff
diff --git a/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c b/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c
index 74c395441e96..355632125914 100644
--- a/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c
+++ b/drivers/gpu/drm/rockchip/rockchip_drm_self_test.c
@@ -20,7 +20,7 @@
 #include "kernel_logo_img.h"
 
-#define USE_BUFFER_NUM 2
+#define USE_BUFFER_NUM 1
 #define BUFFER_WIDTH 652
 #define BUFFER_HEIGHT 268
 #define BUFFER_FORMAT DRM_FORMAT_RGB565 /* DRM_FORMAT_RGB565/DRM_FORMAT_XRGB8888/DRM_FORMAT_NV12 */
@@ -159,7 +159,7 @@ static void rockchip_drm_self_test_commit(struct work_struct *work)
             goto free_buffer;
        }
 
-#if 1 /* for self test pattern */
+#if 0 /* for self test pattern */
        /* commit to display */
        do {
             u32 i = 0;
```

Hier speichert `kernel_logo_img.h` die Daten, die durch Umwandlung einer BMP-Datei mit bmp2hex oder einem ähnlichen Werkzeug entstehen. Passen Sie die Makros `BUFFER_WIDTH`, `BUFFER_HEIGHT` und `BUFFER_FORMAT` an das tatsächliche Bild an.

Falls kein geeignetes bmp2hex-Werkzeug verfügbar ist, suchen Sie am [in der Quelle angegebenen Rockchip-Redmine-Dokumenteintrag](https://redmine.rock-chips.com/documents/97) nach bmp2hex. Ein Kontozugang kann erforderlich sein.

> Redaktioneller Hinweis: Die Diff-Blöcke sind Auszüge aus der Quelle. Ihre ursprünglichen Hunk-Zeilenanzahlen und Kontexte bleiben erhalten; eine Anwendung als vollständige Patches ist nicht garantiert. API-Beispiele behalten vorhandene beziehungsweise fehlende Semikolons der Quelle bei. Prüfen Sie das passende BSP; siehe Redaktionsprotokoll.

{% endraw %}

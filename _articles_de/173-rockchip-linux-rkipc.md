---
title: "Rockchip RKIPC: Produktdatenflüsse, Entwicklung, vollständige APIs und ini-Parameter"
description: "Rockchip RKIPC: Produktdatenflüsse, Entwicklung, vollständige APIs und ini-Parameter — V1.7.5"
excerpt: "Rockchip RKIPC: Produktdatenflüsse, Entwicklung, vollständige APIs und ini-Parameter"
translation_key: "173-rockchip-linux-rkipc"
slug: "173-rockchip-linux-rkipc"
lang: "de"
date: "2026-10-24"
category: "linux"
author: "ArmSoM Editorial · Rockchip source documentation"
products: []
tags: [ArmSoM, Rockchip, RKIPC, Linux, ISP]
---

{% raw %}

# Rockchip RKIPC: Produktdatenflüsse, Entwicklung, vollständige APIs und ini-Parameter

Plattformreferenz CN/EN V1.7.5, RK-KF-YF-937: RKIPC-Anwendungsentwicklung. Quellenumfang: RV1126/RV1109 Linux4.19; RK3588 Linux5.10/6.1; RV1103/RV1106/RV1103B Linux5.10; RK3576/RV1126B Linux6.1. SoC, BSP, Kamera/ISP und Medienbibliotheken des konkreten ArmSoM-Boards prüfen; keine Hardwareprüfung oder allgemeine Unterstützungszusage. ZH verwendet CN-Bilder, EN/RU/DE EN-Bilder.

Quellenzweifel: Abhängigkeiten der rkmedia/rockit-Produkte möglicherweise vertauscht; rk_event_ri_set_position_y ist als X beschrieben; Ein-/Ausgangsbeschreibungen von frame_rate/frame_rate_in prüfen; MAX_SCENARIO_NUM=2 verwendet dennoch Szenario2, Originalrechnung beibehalten. CN audo_gain_enabled unterscheidet sich von EN auto_gain_enabled; Code folgt CN bis zur BSP-Prüfung. deivce_name/is_presistent_text/muliti unverändert. password=YWRtaW4= ist Base64, keine sichere Verschlüsselung. Cloud-Schlüssel sind nur Quellenbeispiele; Produktionszugänge ersetzen und schützen. Reset, Upgrade und Medienänderungen können Dienste unterbrechen; nicht ausgeführt.

[ArmSoM Docs](https://docs.armsom.org/)

## 1. Gesamtarchitektur

![Gesamtarchitektur der Quelle](/docs/rockchip-linux-rkipc/assets/en-p007-figure-01.png)

## 2. Produkttypen

| Quellverzeichnis | Externe Bibliotheken | Funktion |
| --- | --- | --- |
| rv1103_ipc | rockit、rkaiq | IPC für RV1103/RV1103B: Web- und RTSP/RTMP-Vorschau, dynamische Parameter; Wrap standardmäßig aktiviert. |
| rv1106_ipc | rockit、rkaiq | IPC für RV1106/RV1103B: Web- und RTSP/RTMP-Vorschau, dynamische Parameter; Wrap deaktiviert. |
| rv1106_battery_ipc_client | rockit、rkaiq | Batterieprodukt für RV1103/RV1106: Web- und RTSP/RTMP-Vorschau, dynamische Parameter; Client des Zweiprozess-Schnellstarts. |
| rv1106_battery_ipc_tuya | rockit、rkaiq | Batterieprodukt für RV1103/RV1106: Vorschau in der Tuya-Cloud-Mobil-App, Schlafen und Aufwecken. |
| rv1106_dual_ipc | rockit、rkaiq | Zweikamera-Stitching für RV1103/RV1106/RV1103B: Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |
| rv1106_aiisp | rockit、rkaiq | IPC für RV1103/RV1106/RV1103B mit AIISP: Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |
| rk3588_ipc | rockit、rkaiq | RK3588: Einzelkamera-IPC, Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |
| rk3588_muliti_ipc | rockit、rkaiq | RK3588: Mehrkamera-IPC, Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |
| rv1126_ipc_rkmedia | rockit、rkaiq | IPC für RV1126/RV1109 mit rkmedia: Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |
| rv1126_ipc_rockit | easymedia、rkaiq | IPC für RV1126/RV1109 mit rockit: Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |
| rv1126_battery_ipc | rockit、rkaiq | Batterieprodukt für RV1126/RV1109: Vorschau in der Tuya-Cloud-Mobil-App, Schlafen und Aufwecken. |
| rv1126_dual_ipc | rockit、rkaiq | Zweikamera-Stitching für RV1126/RV1109: Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |
| rv1126_snapshot | easymedia、rkaiq | Aufnahmeprodukt für RV1126/RV1109: Offline-Frames, lokale Fotos/Videoaufzeichnung und Bildschirmanzeige. |
| rv1126_aiisp | rockit、rkaiq | IPC für RV1126/RV1109 mit aiisp: Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |
| rk3576_ipc | rockit、rkaiq | RK3576: Einzelkamera-IPC, Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |
| rk3576_muliti_ipc | rockit、rkaiq | RK3576: Mehrkamera-IPC, Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |

| Quellverzeichnis | Externe Bibliotheken | Funktion |
| --- | --- | --- |
| rk3576_dv | rockit、rkaiq | Action-DV für RK3576: lokale Fotos/Videoaufzeichnung, Dekodierung/Wiedergabe und Bildschirmanzeige. |
| rv1126b_ipc | rockit、rkaiq | RV1126B: Einzelkamera-IPC, Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |
| rv1126b_dual_ipc | rockit、rkaiq | RV1126B: Zweikamera-IPC, Web- und RTSP/RTMP-Vorschau, dynamische Parameter. |
| rv1126b_dv | rockit、rkaiq | Action-DV für RV1126B: lokale Fotos/Videoaufzeichnung, Dekodierung/Wiedergabe und Bildschirmanzeige. |

### 2.1 RV1103 IPC

![2.1 RV1103 IPC — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-1.png)

### 2.2 RV1106 IPC

![2.2 RV1106 IPC — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-2.png)

### 2.3 RV1106 Battery IPC Client

![2.3 RV1106 Battery IPC Client — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-3.png)

### 2.4 RV1106 Battery IPC Tuya

![2.4 RV1106 Battery IPC Tuya — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-4.png)

### 2.5 RV1106 Dual-IPC

![2.5 RV1106 Dual-IPC — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-5.png)

### 2.6 RV1106 AIISP

![2.6 RV1106 AIISP — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-6.png)

### 2.7 RK3588 IPC

![2.7 RK3588 IPC — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-7.png)

### 2.8 RK3588 Multi-IPC

![2.8 RK3588 Multi-IPC — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-8.png)

### 2.9 RV1126 IPC Rkmedia

![2.9 RV1126 IPC Rkmedia — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-9.png)

### 2.10 RV1126 IPC Rockit

![2.10 RV1126 IPC Rockit — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-10.png)

### 2.11 RV1126 Battery IPC

![2.11 RV1126 Battery IPC — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-11.png)

### 2.12 RV1126 Dual-IPC

![2.12 RV1126 Dual-IPC — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-12.png)

### 2.13 RV1126 Snapshot

![2.13 RV1126 Snapshot — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-13.png)

### 2.14 RV1126 AIISP

![2.14 RV1126 AIISP — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-14.png)

### 2.15 RK3576 IPC

![2.15 RK3576 IPC — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-15.png)

### 2.16 RK3576 Multi-IPC

![2.16 RK3576 Multi-IPC — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-16.png)

### 2.17 RK3576 DV

![2.17 RK3576 DV — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-17.png)

### 2.18 RV1126B IPC

![2.18 RV1126B IPC — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-18.png)

FEC ist standardmäßig ausgeschaltet. Bei isp.0.enhancement:distortion_correction=FEC wird ein anderer Datenfluss verwendet.

### 2.19 RV1126B Dual-IPC

![2.19 RV1126B Dual-IPC — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-19.png)

### 2.20 RV1126B DV

![2.20 RV1126B DV — Quellen-Datenfluss](/docs/rockchip-linux-rkipc/assets/en-flow-2-20.png)

## 3. Codestruktur

```text
├── CMakeLists.txt
├── common # 通⽤模块
│   ├── audio # ⾳频处理模块
│   ├── common.h # ⼀些通⽤函数功能
│   ├── event # 事件处理模块
│   ├── isp # 图像处理模块
│   ├── log.h # ⽇志管理
│   ├── network # ⽹络模块
│   ├── osd # OSD模块
│   │   ├── image.bmp # logo图⽚
│   │   └── SourceHanSansEN.ttf # 字体库
│   ├── param # 参数管理模块
│   ├── region_clip # 区域裁剪模块
│   ├── rockiva # 周界算法模块，⼈脸⼈形识别
│   ├── roi # 感兴趣区域模块
│   ├── rtmp # rtmp推流模块
│   ├── rtsp # rtsp推流模块
│   ├── socket_server # socket服务端
│   ├── storage # 存储模块
│   └── system # 系统管理模块
│   └── tuya_ipc # 涂鸦IPC模块
├── format.sh # 格式化脚本
├── lib # 存放32/64位版本，不同⼯具链的预编译库
│   ├── aarch64-rockchip1031-linux-gnu
│   └── arm-rockchip830-linux-gnueabihf
│   └── arm-rockchip830-linux-uclibcgnueabihf
├── LICENSE # 版权声明
└── src
    ├── rk3576_ipc
    ├── rk3576_multi_ipc
    ├── rk3588_ipc
    │   ├── CMakeLists.txt
    │   ├── main.c
    │   ├── rkipc.ini # 参数⽂件
    │   ├── RkLunch.sh # 初始化脚本
    │   ├── RkLunch-stop.sh # 反初始化脚本
    │   └── video # 视频业务逻辑
    │       ├── video.c
    │       └── video.h
    ├── rk3588_multi_ipc
    ├── rv1103_ipc
    ├── rv1106_aiisp_ipc
    ├── rv1106_battery_ipc_client
    ├── rv1106_battery_ipc_tuya
    ├── rv1106_dual_ipc
    ├── rv1106_ipc
    ├── rv1106_v4l2_drm
    ├── rv1106_wakeup_ipc
    ├── rv1126_aiisp_ipc
    ├── rv1126_battery_ipc
    ├── rv1126_dual_ipc
    ├── rv1126_ipc_rkmedia
    ├── rv1126_ipc_rockit
    └── rv1126_snapshot
```

## 4. Entwicklungsgrundsätze

0. Implementierung ausschließlich in C.

1. Modularität: main möglichst einfach halten und nur init/deinit der Module aufrufen. Jedes Modul verwaltet seine Funktionen selbst; Unterschiede werden durch registrierte Callbacks umgesetzt.

2. Parameter mit iniparser ohne komplexe Kapselung verwalten. Jedes Modul bestimmt selbst, welche Parameter wann aus ini gelesen oder geschrieben werden.

3. Für Protokollierung einheitlich common/log.h verwenden.

4. Gemeinsam nutzbaren Code möglichst unter common ablegen. Verhindern Plattformunterschiede oder Geschäftslogik die gemeinsame Nutzung, eine Kopie in jedem src-Verzeichnis halten und Plattform-Makroabfragen vermeiden.

5. Bevorzugt aus Quellen kompilieren, danach statische Bibliotheken nutzen und erst zuletzt dynamische Bibliotheken wählen.

## 5. Neue Parameter entwickeln

Web-Frontend → Web-Backend → rkipc → zugrunde liegendes Modul → Parameter speichern.

Beispiel hue: Das Frontend ist weitgehend bereits implementiert und muss nicht geändert werden. Das Backend empfängt in app/ipcweb-backend/src/image_api.cpp JSON wie "iHue":50 und ruft die gekapselte Funktion in app/ipcweb-backend/src/socket_client auf, um rkipc fernzusteuern. Auch app/rkipc/src/server benötigt die entsprechende Funktion zum Anwenden und Speichern. Neue Funktionen möglichst paarweise als get/set ergänzen. rkipc kapselt hauptsächlich externe Aufrufe und Einstellungen bei der Initialisierung. Beispiel:

### 5.1 hue-Feld zur ini-Datei hinzufügen

```text
[isp.0.adjustment]
hue = 50
```

### 5.2 set/get-Funktionen zum isp-Modul hinzufügen

```text
diff --git a/src/isp/isp.c b/src/isp/isp.c
index e59fdd3..7877ae9 100644
--- a/src/isp/isp.c
+++ b/src/isp/isp.c
@@ -165,6 +165,22 @@ int rk_isp_set_sharpness(int cam_id, int value) {
   return ret;
 }

+int rk_isp_get_hue(int cam_id, int *value) {
+  RK_ISP_CHECK_CAMERA_ID(cam_id);
+  int ret = rk_aiq_uapi_getHue(g_aiq_ctx[cam_id], value);
+  *value = (int)(*value / 2.55);
+
+  return ret;
+}
+
+int rk_isp_set_hue(int cam_id, int value) {
+  RK_ISP_CHECK_CAMERA_ID(cam_id);
+  int ret = rk_aiq_uapi_setHue(g_aiq_ctx[cam_id], (int)(value * 2.55)); // value[0,255]
+  rk_param_set_int("isp.0.adjustment:hue", value);
+
+  return ret;
+}
+
 // exposure
 // night_to_day
 // blc
@@ -180,6 +196,7 @@ int rk_isp_set_from_ini(int cam_id) {
   rk_isp_set_brightness(cam_id, iniparser_getint(g_ini_d_, "isp.0.adjustment:brightness", 50));
   rk_isp_set_saturation(cam_id, iniparser_getint(g_ini_d_, "isp.0.adjustment:saturation", 50));
   rk_isp_set_sharpness(cam_id, iniparser_getint(g_ini_d_, "isp.0.adjustment:sharpness", 50));
+  rk_isp_set_hue(cam_id, iniparser_getint(g_ini_d_, "isp.0.adjustment:hue", 50));
   LOG_INFO("end\n");

   return ret;
diff --git a/src/isp/isp.h b/src/isp/isp.h
index e77c9fc..0d3835a 100644
--- a/src/isp/isp.h
+++ b/src/isp/isp.h
@@ -9,4 +9,6 @@ int rk_isp_get_saturation(int cam_id, int *value);
 int rk_isp_set_saturation(int cam_id, int value);
 int rk_isp_get_sharpness(int cam_id, int *value);
 int rk_isp_set_sharpness(int cam_id, int value);
+int rk_isp_get_hue(int cam_id, int *value);
+int rk_isp_set_hue(int cam_id, int value);
 // exposure
```

### 5.3 Socket-Funktionen im server-Modul kapseln

```text
diff --git a/src/server/server.c b/src/server/server.c
index 6613b90..52692c9 100644
--- a/src/server/server.c
+++ b/src/server/server.c
@@ -236,6 +236,40 @@ int ser_rk_isp_set_sharpness(int fd) {
   return 0;
 }

+int ser_rk_isp_get_hue(int fd) {
+  int err = 0;
+  int cam_id;
+  int value;
+
+  if (sock_read(fd, &cam_id, sizeof(cam_id)) == SOCKERR_CLOSED)
+    return -1;
+  err = rk_isp_get_hue(cam_id, &value);
+  LOG_DEBUG("value is %d\n", value);
+  if (sock_write(fd, &value, sizeof(value)) == SOCKERR_CLOSED)
+    return -1;
+  if (sock_write(fd, &err, sizeof(int)) == SOCKERR_CLOSED)
+    return -1;
+
+  return 0;
+}
+
+int ser_rk_isp_set_hue(int fd) {
+  int err = 0;
+  int cam_id;
+  int value;
+
+  if (sock_read(fd, &cam_id, sizeof(cam_id)) == SOCKERR_CLOSED)
+    return -1;
+  if (sock_read(fd, &value, sizeof(value)) == SOCKERR_CLOSED)
+    return -1;
+  LOG_DEBUG("value is %d\n", value);
+  err = rk_isp_set_hue(cam_id, value);
+  if (sock_write(fd, &err, sizeof(int)) == SOCKERR_CLOSED)
+    return -1;
+
+  return 0;
+}
+
 static const struct FunMap map[] = {
     {(char *)"rk_isp_set", &ser_rk_isp_set},
     {(char *)"rk_video_set", &ser_rk_video_set},
@@ -247,7 +281,9 @@ static const struct FunMap map[] = {
     {(char *)"rk_isp_get_saturation", &ser_rk_isp_get_saturation},
     {(char *)"rk_isp_set_saturation", &ser_rk_isp_set_saturation},
     {(char *)"rk_isp_get_sharpness", &ser_rk_isp_get_sharpness},
-    {(char *)"rk_isp_set_sharpness", &ser_rk_isp_set_sharpness}
+    {(char *)"rk_isp_set_sharpness", &ser_rk_isp_set_sharpness},
+    {(char *)"rk_isp_get_hue", &ser_rk_isp_get_hue},
+    {(char *)"rk_isp_set_hue", &ser_rk_isp_set_hue}
 };

 static void *rec_thread(void *arg) {
```

### 5.4 Verarbeitung im Web-Backend ergänzen

ipcweb-backend prüft hauptsächlich die vom Web-Frontend übergebenen Daten und führt Get/Set aus. Änderungen:

```text
diff --git a/src/image_api.cpp b/src/image_api.cpp
index 475e17d..edac2de 100644
--- a/src/image_api.cpp
+++ b/src/image_api.cpp
@@ -20,15 +20,17 @@ nlohmann::json image_specific_resource_get(std::string string) {
       nlohmann::json::object(); /* one of all the same resources */
   minilog_debug("%s: string is %s\n", __func__, string.c_str());
   if (!string.compare(PATH_IMAGE_ADJUSTMENT)) {
-    int brightness, contrast, saturation, sharpness;
+    int brightness, contrast, saturation, sharpness, hue;
     rk_isp_get_brightness(0, &brightness);
     rk_isp_get_contrast(0, &contrast);
     rk_isp_get_saturation(0, &saturation);
     rk_isp_get_sharpness(0, &sharpness);
+    rk_isp_get_hue(0, &hue);
     specific_resource.emplace("iBrightness", brightness);
     specific_resource.emplace("iContrast", contrast);
     specific_resource.emplace("iSaturation", saturation);
     specific_resource.emplace("iSharpness", sharpness);
+    specific_resource.emplace("iHue", hue);
   } else if (!string.compare(PATH_IMAGE_EXPOSURE)) {

   } else if (!string.compare(PATH_IMAGE_NIGHT_TO_DAY)) {
@@ -84,6 +86,10 @@ void image_specific_resource_set(std::string string, nlohmann::json data) {
       value = atoi(data.at("iSharpness").dump().c_str());
       rk_isp_set_sharpness(0, value);
     }
+    if (data.dump().find("iHue") != data.dump().npos) {
+      value = atoi(data.at("iHue").dump().c_str());
+      rk_isp_set_hue(0, value);
+    }
   } else if (!string.compare(PATH_IMAGE_EXPOSURE)) {

   } else if (!string.compare(PATH_IMAGE_NIGHT_TO_DAY)) {
diff --git a/src/socket_client/client.cpp b/src/socket_client/client.cpp
index 448e847..7f84b4f 100644
--- a/src/socket_client/client.cpp
+++ b/src/socket_client/client.cpp
@@ -182,4 +182,36 @@ int rk_isp_set_sharpness(int cam_id, int value) {
   cli_end(fd);

   return ret;
 }
+
+int rk_isp_get_hue(int cam_id, int *value) {
+  int fd;
+  int ret = 0;
+
+  fd = cli_begin((char *)__func__);
+  /* Transmission parameters */
+  sock_write(fd, &cam_id, sizeof(cam_id));
+  sock_read(fd, value, sizeof(value));
+
+  sock_read(fd, &ret, sizeof(ret));
+  /* End transmission parameters */
+  cli_end(fd);
+
+  return ret;
+}
+
+int rk_isp_set_hue(int cam_id, int value) {
+  int fd;
+  int ret = 0;
+
+  fd = cli_begin((char *)__func__);
+  /* Transmission parameters */
+  sock_write(fd, &cam_id, sizeof(cam_id));
+  sock_write(fd, &value, sizeof(value));
+
+  sock_read(fd, &ret, sizeof(ret));
+  /* End transmission parameters */
+  cli_end(fd);
+
+  return ret;
+}
diff --git a/src/socket_client/client.h b/src/socket_client/client.h
index 11fdd1c..0c09913 100644
--- a/src/socket_client/client.h
+++ b/src/socket_client/client.h
@@ -8,4 +8,6 @@ int rk_isp_set_brightness(int cam_id, int value);
 int rk_isp_get_saturation(int cam_id, int *value);
 int rk_isp_set_saturation(int cam_id, int value);
 int rk_isp_get_sharpness(int cam_id, int *value);
 int rk_isp_set_sharpness(int cam_id, int value);
+int rk_isp_get_hue(int cam_id, int *value);
+int rk_isp_set_hue(int cam_id, int value);
\ No newline at end of file
```

### 5.5 Verarbeitung im Web-Frontend ergänzen

HTML- und TS-Dateien des Frontends ändern und Optionslayout sowie get/set ergänzen. Siehe HTML und TS unter app/ipcweb-ng/src/app/config/shared/isp; die wesentlichen Teile folgen.

```text
<form class="form" [formGroup]="imageForm">
      <div id=ispGrp role="tablist">
        <div class="card" *ngFor="let cardTitle of cardList">
          <div id="ispGrp1Header" class="card-header" (click)="onSelectCard(cardTitle)">
            <label>{{ groupNameDict[cardTitle] | translate }}</label>
          </div>
          <div class="card-body card-block form-group" [id]="cardTitle"
[formGroupName]="groupNameDict[cardTitle]">
            <ng-container *ngIf="capDict[cardTitle][layoutKey]">
              <ng-container *ngFor="let layoutItem of capDict[cardTitle][layoutKey]
[cardTitle]">
                <div class="form-row my-1" *ngIf="checkType(capDict[cardTitle]
[pageLayoutKey][layoutItem], 'range')">
                  <label class="col-3">{{ transferControlName(layoutItem) | translate }}
</label>
                  <input class="col-6 custom-range" [formControlName]="layoutItem"
type="range" (ngModelChange)="onRangeChange($event, cardTitle, layoutItem)"
(mouseup)="onSubmitPart(cardTitle, layoutItem, 'range')" [min]="getRange(capDict[cardTitle]
[pageLayoutKey][layoutItem], 'min')" [max]="getRange(capDict[cardTitle][pageLayoutKey]
[layoutItem], 'max')" [step]="getRange(capDict[cardTitle][pageLayoutKey][layoutItem],
'step')">
                  <input class="col-2 form-control" [formControlName]="layoutItem"
type="number" (ngModelChange)="onRangeChange($event, cardTitle, layoutItem)"
(blur)="onSubmitPart(cardTitle, layoutItem, 'number')" [id]="layoutItem">
                  <label class="alarm-tip pat1"
*ngIf="imageForm.get(groupNameDict[cardTitle]).get(layoutItem).errors?.min ||
imageForm.get(groupNameDict[cardTitle]).get(layoutItem).errors?.max ||
imageForm.get(groupNameDict[cardTitle]).get(layoutItem).errors?.isNumberJudge">{{'ranges' |
translate}}({{getRange(capDict[cardTitle][pageLayoutKey][layoutItem], 'min')}}~
{{getRange(capDict[cardTitle][pageLayoutKey][layoutItem], 'max')}})</label>
                </div>
                <div class="form-row my-1" *ngIf="checkType(capDict[cardTitle]
[pageLayoutKey][layoutItem], 'options') && isItemEnable(layoutItem)">
                  <label class="col-3 form-group-text mt-1">{{
transferControlName(layoutItem) | translate }}</label>
                  <select class="custom-select col-md-8" [formControlName]="layoutItem"
(ngModelChange)="updateDynamicCap(cardTitle, layoutItem, $event)" [id]="layoutItem">
                    <option *ngFor="let opItem of htmlOptionFilter(layoutItem,
capDict[cardTitle][pageLayoutKey][layoutItem]['options'])" [value]="opItem">{{
htmlOptionTransfer(layoutItem, opItem) | translate }}</option>
                  </select>
                </div>
                <div class="form-row my-1" *ngIf="checkType(capDict[cardTitle]
[pageLayoutKey][layoutItem], 'input') && capDict[cardTitle][pageLayoutKey][layoutItem]
['input']==='time'">
                  <label class="col-3">{{ transferControlName(layoutItem) | translate }}
</label>
                  <input type="time" step=1 [formControlName]="layoutItem"
(blur)="onSubmitPart(cardTitle, layoutItem, 'time')" [id]="layoutItem">
                </div>
              </ng-container>
            </ng-container>
          </div>
        </div>
      </div>
    </form>
```

```text
imageForm = this.fb.group({
    id: [''],
    imageAdjustment: this.fb.group({
      iBrightness: [''],
      iContrast: [''],
      iSaturation: [''],
      iSharpness: [''],
      iHue: ['']
    })
});

get imageAdjustment(): FormGroup {
    return this.imageForm.get('imageAdjustment') as FormGroup;
}

submitOne(groupName: string, isReboot: boolean = false, isAppRestart = false) {
    if (!this.isInit || this.lock.checkLock('submitOne')) {
      return;
    }
    this.lock.lock('submitOne');
    this.pfs.formatInt(this.imageForm.value[groupName]);
    const path = this.group2path[groupName];
    this.cfgService.setImageInterfacePart(this.imageForm.value[groupName], path,
this.imageForm.value['id']).subscribe(
      res => {
        this.resError.analyseRes(res, 'saveFail');
        this.setAlarmTip(res, groupName);
        this.imageForm.get(groupName).patchValue(res);
        if (isReboot) {
          this.tips.setCTPara('restart');
        } else if (isAppRestart) {
          this.tips.setRbTip('appRestart');
        } else {
          this.tips.showSaveSuccess();
        }
        this.lock.unlock('submitOne');
      },
      err => {
        if (isReboot) {
          this.tips.setCTPara('close');
        }
        this.tips.showSaveFail();
        this.lock.unlock('submitOne');
      }
    );
  }
```

## 6. Modul-APIs

### 6.1 Netzwerkmodul

| Funktionsname | Funktion |
| --- | --- |
| rk_network_init | Netzwerk-Modul initialisieren |
| rk_network_deinit | Netzwerk-Modul deinitialisieren |
| rk_network_ipv4_set | IPv4 einstellen |
| rk_network_ipv4_get | IPv4-Konfiguration abrufen |
| rk_network_dns_get | DNS der kabelgebundenen Schnittstelle abrufen |
| rk_network_dns_set | DNS der kabelgebundenen Schnittstelle einstellen |
| rk_network_get_mac | Geräte-MAC-Adresse abrufen |
| rk_network_set_mac | Geräte-MAC-Adresse einstellen |

| Funktionsname | Funktion |
| --- | --- |
| rk_network_nicspeed_get | Netzwerkschnittstellengeschwindigkeit abrufen |
| rk_network_nicspeed_set | Netzwerkschnittstellengeschwindigkeit einstellen |
| rk_network_nicspeed_support_get | unterstützte Schnittstellengeschwindigkeiten abrufen |
| rk_ethernet_power_set | Ethernet ein-/ausschalten |
| rk_nic_state_get | Aktuellen Schnittstellenstatus abrufen |
| rk_wifi_power_get | aktuellen WLAN-Status abrufen |
| rk_wifi_power_set | WLAN ein-/ausschalten |
| rk_wifi_scan_wifi | WLAN sofort scannen |
| rk_wifi_get_list | WLAN-Liste abrufen |
| rk_wifi_connect_with_ssid | WLAN verbinden |
| rk_wifi_forget_with_ssid | WLAN löschen |

### 6.2 Muxer-Modul

| Funktionsname | Funktion |
| --- | --- |
| rkmuxer_init | Muxer-Modul initialisieren |
| rkmuxer_deinit | Muxer-Modul deinitialisieren |
| rkmuxer_write_video_frame | Videoframe schreiben |
| rkmuxer_write_audio_frame | Audioframe schreiben |

### 6.3 Speichermodul

| Funktionsname | Funktion |
| --- | --- |
| rk_storage_init | Speicher-Modul initialisieren |
| rk_storage_deinit | Speicher-Modul deinitialisieren |
| rk_storage_write_video_frame | Videoframe schreiben |
| rk_storage_write_audio_frame | Audioframe schreiben |
| rk_storage_record_start | Aufzeichnung starten |
| rk_storage_record_stop | Aufzeichnung stoppen |
| rk_storage_record_status_get | Aufzeichnungsstatus abrufen |

### 6.4 OSD-Modul

rkmedia und rockit implementieren OSD unterschiedlich. Um die OSD-Geschäftslogik zu abstrahieren und vom video-Modul zu entkoppeln, werden Callbacks registriert. Durch Registrierung der Funktionen können unterschiedliche Implementierungen dieselbe übergeordnete Logik nutzen.

| Funktionsname | Funktion |
| --- | --- |
| rk_osd_cover_create_callback_register | Callback für Maskenerstellung registrieren |
| rk_osd_cover_destroy_callback_register | Callback für Maskenentfernung registrieren |
| rk_osd_bmp_create_callback_register | Callback für BMP-Erstellung registrieren |
| rk_osd_bmp_destroy_callback_register | Callback für BMP-Entfernung registrieren |
| rk_osd_bmp_change_callback_register | Callback für BMP-Änderung registrieren |
| rk_osd_init | OSD-Modul initialisieren |
| rk_osd_deinit | OSD-Modul deinitialisieren |
| rk_osd_restart | OSD-Modul neu starten |
| fill_image | Bild füllen |
| fill_text | Textbild erzeugen und füllen |
| generate_date_time | Zeitstempel als Breitzeichen erzeugen |
| rk_osd_get_font_size | Schriftgröße abrufen |
| rk_osd_set_font_size | Schriftgröße einstellen |
| rk_osd_get_font_color | Schriftfarbe abrufen |
| rk_osd_set_font_color | Schriftfarbe einstellen |
| rk_osd_get_font_path | Schriftdateipfad abrufen |
| rk_osd_set_font_path | Schriftdateipfad einstellen |
| rk_osd_get_enabled | Aktivierungsstatus abrufen |
| rk_osd_set_enabled | Aktivierungsstatus einstellen |
| rk_osd_get_position_x | X-Koordinate abrufen |
| rk_osd_set_position_x | X-Koordinate einstellen |
| rk_osd_get_position_y | Y-Koordinate abrufen |
| rk_osd_set_position_y | Y-Koordinate einstellen |
| rk_osd_get_height | Höhe abrufen |
| rk_osd_set_height | Höhe einstellen |
| rk_osd_get_width | Breite abrufen |
| rk_osd_set_width | Breite einstellen |
| rk_osd_get_display_text | Anzeigetext abrufen |

| Funktionsname | Funktion |
| --- | --- |
| rk_osd_set_display_text | Anzeigetext einstellen |
| rk_osd_get_image_path | Bilddateipfad abrufen |
| rk_osd_set_image_path | Bilddateipfad einstellen |

### 6.5 Systemmodul

Die ursprüngliche ini-Datei ist standardmäßig /usr/share/rkipc.ini. Findet das Startskript unter /userdata keine rkipc.ini, wird sie dorthin kopiert. Beim Werksreset wird /usr/share/rkipc.ini als /userdata/rkipc.ini kopiert.

| Funktionsname | Funktion |
| --- | --- |
| rk_system_init | System-Modul initialisieren |
| rk_system_deinit | System-Modul deinitialisieren |
| rk_system_reboot | Neu starten |
| rk_system_factory_reset | Werkseinstellungen wiederherstellen |
| rk_system_export_log | Protokoll exportieren |
| rk_system_export_db | Konfiguration exportieren |
| rk_system_import_db | Konfiguration importieren |
| rk_system_upgrade | System aktualisieren |
| rk_system_get_user_num | Benutzerzahl abrufen |
| rk_system_set_user_num | Benutzerzahl einstellen |
| rk_system_get_user_level | Benutzerrechte abrufen |
| rk_system_set_user_level | Benutzerrechte einstellen |
| rk_system_get_user_name | Benutzernamen abrufen |
| rk_system_set_user_name | Benutzernamen einstellen |
| rk_system_get_password | Passwort (laut Quelle verschlüsselt) abrufen |
| rk_system_set_password | Passwort (laut Quelle verschlüsselt) einstellen |
| rk_system_add_user | Benutzer hinzufügen |
| rk_system_del_user | Benutzer löschen |

### 6.6 Ereignismodul

Derzeit nur rv1126_ipc_rkmedia unterstützt.

| Funktionsname | Funktion |
| --- | --- |
| rk_event_init | Ereignis-Modul initialisieren |
| rk_event_deinit | Ereignis-Modul deinitialisieren |
| rk_event_ri_get_enabled | Aktivierungsstatus der Bereichseinbruchserkennung abrufen |
| rk_event_ri_set_enabled | Aktivierungsstatus der Bereichseinbruchserkennung einstellen |
| rk_event_ri_get_position_x | X-Koordinate der Einbruchserkennung abrufen |
| rk_event_ri_set_position_x | X-Koordinate der Einbruchserkennung einstellen |
| rk_event_ri_get_position_y | Y-Koordinate der Einbruchserkennung abrufen |
| rk_event_ri_set_position_y | X-Koordinate der Einbruchserkennung einstellen |
| rk_event_ri_get_width | Breite der Einbruchserkennung abrufen |
| rk_event_ri_set_width | Breite der Einbruchserkennung einstellen |
| rk_event_ri_get_height | Höhe der Einbruchserkennung abrufen |
| rk_event_ri_set_height | Höhe der Einbruchserkennung einstellen |
| rk_event_ri_get_proportion | Anteil der Einbruchserkennung abrufen |
| rk_event_ri_set_proportion | Anteil der Einbruchserkennung einstellen |
| rk_event_ri_get_sensitivity_level | Empfindlichkeit der Einbruchserkennung abrufen |
| rk_event_ri_set_sensitivity_level | Empfindlichkeit der Einbruchserkennung einstellen |
| rk_event_ri_get_time_threshold | Zeitschwelle der Einbruchserkennung abrufen |
| rk_event_ri_set_time_threshold | Zeitschwelle der Einbruchserkennung einstellen |

### 6.7 RTMP-Streaming-Modul

| Funktionsname | Funktion |
| --- | --- |
| rk_rtmp_init | RTMP-Modul initialisieren |
| rk_rtmp_deinit | RTMP-Modul deinitialisieren |
| rk_rtmp_write_video_frame | Videoframe schreiben |
| rk_rtmp_write_audio_frame | Audioframe schreiben |

### 6.8 RTSP-Streaming-Modul

| Funktionsname | Funktion |
| --- | --- |
| create_rtsp_demo | Handle erzeugen |
| rtsp_new_session | Sitzung anhand der URL erzeugen |
| rtsp_set_video | Videostreamformat einstellen |
| rtsp_set_audio | Audiostreamformat einstellen |
| rtsp_sync_video_ts | Videozeitstempel synchronisieren |
| rtsp_sync_audio_ts | Audiozeitstempel synchronisieren |
| rtsp_del_session | Sitzung löschen |
| rtsp_del_demo | Handle löschen |
| rtsp_tx_video | Videoframe senden |
| rtsp_tx_audio | Audioframe senden |
| rtsp_do_event | Operation ausführen |

### 6.9 ISP-Modul

| Funktionsname | Funktion |
| --- | --- |
| rk_isp_init | einzelne Kamera initialisieren |
| rk_isp_deinit | einzelne Kamera deinitialisieren |
| rk_isp_group_init | mehrere Kameras initialisieren |
| rk_isp_group_deinit | mehrere Kameras deinitialisieren |
| rk_isp_set_frame_rate | Bildrate einstellen |
| rk_isp_get_contrast | Kontrast abrufen |
| rk_isp_set_contrast | Kontrast einstellen |
| rk_isp_get_brightness | Helligkeit abrufen |
| rk_isp_set_brightness | Helligkeit einstellen |
| rk_isp_get_saturation | Sättigung abrufen |
| rk_isp_set_saturation | Sättigung einstellen |
| rk_isp_get_sharpness | Schärfe abrufen |
| rk_isp_set_sharpness | Schärfe einstellen |
| rk_isp_get_hue | Farbton abrufen |
| rk_isp_set_hue | Farbton einstellen |
| rk_isp_get_exposure_mode | Belichtungsmodus abrufen |
| rk_isp_set_exposure_mode | Belichtungsmodus einstellen |
| rk_isp_get_gain_mode | Verstärkungsmodus abrufen |
| rk_isp_set_gain_mode | Verstärkungsmodus einstellen |
| rk_isp_get_exposure_time | Belichtungszeit abrufen |
| rk_isp_set_exposure_time | Belichtungszeit einstellen |
| rk_isp_get_exposure_gain | Verstärkung abrufen |
| rk_isp_set_exposure_gain | Verstärkung einstellen |
| rk_isp_get_hdr | HDR-Modus abrufen |
| rk_isp_set_hdr | HDR-Modus einstellen |
| rk_isp_get_blc_region | Gegenlichtmodus abrufen |

| Funktionsname | Funktion |
| --- | --- |
| rk_isp_set_blc_region | Gegenlichtmodus einstellen |
| rk_isp_get_hlc | Spitzlichtunterdrückungsmodus abrufen |
| rk_isp_set_hlc | Spitzlichtunterdrückungsmodus einstellen |
| rk_isp_get_hdr_level | HDR-Stufe abrufen |
| rk_isp_set_hdr_level | HDR-Stufe einstellen |
| rk_isp_get_blc_strength | Gegenlichtkompensationsstärke abrufen |
| rk_isp_set_blc_strength | Gegenlichtkompensationsstärke einstellen |
| rk_isp_get_hlc_level | Spitzlichtunterdrückungsstufe abrufen |
| rk_isp_set_hlc_level | Spitzlichtunterdrückungsstufe einstellen |
| rk_isp_get_dark_boost_level | Dunkelbereichsverstärkung abrufen |
| rk_isp_set_dark_boost_level | Dunkelbereichsverstärkung einstellen |
| rk_isp_get_white_blance_style | Weißabgleichmodus abrufen |
| rk_isp_set_white_blance_style | Weißabgleichmodus einstellen |
| rk_isp_get_white_blance_red | R-Verstärkung des Weißabgleichs abrufen |
| rk_isp_set_white_blance_red | R-Verstärkung des Weißabgleichs einstellen |
| rk_isp_get_white_blance_green | G-Verstärkung des Weißabgleichs abrufen |
| rk_isp_set_white_blance_green | G-Verstärkung des Weißabgleichs einstellen |
| rk_isp_get_white_blance_blue | B-Verstärkung des Weißabgleichs abrufen |
| rk_isp_set_white_blance_blue | B-Verstärkung des Weißabgleichs einstellen |
| rk_isp_get_noise_reduce_mode | Rauschunterdrückungsmodus abrufen |
| rk_isp_set_noise_reduce_mode | Rauschunterdrückungsmodus einstellen |
| rk_isp_get_dehaze | Entnebelungsmodus abrufen |
| rk_isp_set_dehaze | Entnebelungsmodus einstellen |
| rk_isp_get_gray_scale_mode | Grauwertbereich abrufen |
| rk_isp_set_gray_scale_mode | Grauwertbereich einstellen |
| rk_isp_get_distortion_correction | Verzeichnungskorrekturmodus abrufen |
| rk_isp_set_distortion_correction | Verzeichnungskorrekturmodus einstellen |
| rk_isp_get_spatial_denoise_level | räumliche Rauschunterdrückungsstufe abrufen |

| Funktionsname | Funktion |
| --- | --- |
| rk_isp_set_spatial_denoise_level | räumliche Rauschunterdrückungsstufe einstellen |
| rk_isp_get_temporal_denoise_level | zeitliche Rauschunterdrückungsstufe abrufen |
| rk_isp_set_temporal_denoise_level | zeitliche Rauschunterdrückungsstufe einstellen |
| rk_isp_get_dehaze_level | Entnebelungsstufe abrufen |
| rk_isp_set_dehaze_level | Entnebelungsstufe einstellen |
| rk_isp_get_ldch_level | LDCH-Stufe abrufen |
| rk_isp_set_ldch_level | LDCH-Stufe einstellen |
| rk_isp_get_power_line_frequency_mode | Videostandard abrufen |
| rk_isp_set_power_line_frequency_mode | Videostandard einstellen |
| rk_isp_get_image_flip | Spiegelung abrufen |
| rk_isp_set_image_flip | Spiegelung einstellen |
| rk_isp_get_af_mode | Autofokusmodus abrufen |
| rk_isp_set_af_mode | Autofokusmodus einstellen |
| rk_isp_get_zoom_level | Zoomstufe abrufen |
| rk_isp_set_zoom_level | Zoomstufe einstellen |
| rk_isp_af_zoom_in | Vergrößern |
| rk_isp_af_zoom_out | Verkleinern |
| rk_isp_af_focus_in | Fokussieren |
| rk_isp_af_focus_out | Defokussieren |

### 6.10 Audiomodul

| Funktionsname | Funktion |
| --- | --- |
| rkipc_audio_init | Audio-Modul initialisieren |
| rkipc_audio_deinit | Audio-Modul deinitialisieren |
| rk_audio_restart | Audiomodul neu starten |
| rk_audio_get_bit_rate | Bitrate abrufen |
| rk_audio_set_bit_rate | Bitrate einstellen |
| rk_audio_get_sample_rate | Abtastrate abrufen |
| rk_audio_set_sample_rate | Abtastrate einstellen |
| rk_audio_get_volume | Lautstärke abrufen |
| rk_audio_set_volume | Lautstärke einstellen |
| rk_audio_get_enable_vqe | Aktivierungsstatus des Audio-3A-Algorithmus abrufen |
| rk_audio_set_enable_vqe | Aktivierungsstatus des Audio-3A-Algorithmus einstellen |
| rk_audio_get_encode_type | Kodierungstyp abrufen |
| rk_audio_set_encode_type | Kodierungstyp einstellen |

### 6.11 Videomodul

| Funktionsname | Funktion |
| --- | --- |
| rk_video_init | Video-Modul initialisieren |
| rk_video_deinit | Video-Modul deinitialisieren |
| rk_video_restart | Videomodul neu starten |
| rk_video_get_gop | I-Frame-Abstand abrufen |
| rk_video_set_gop | I-Frame-Abstand einstellen |
| rk_video_get_max_rate | maximale Bitrate abrufen |
| rk_video_set_max_rate | maximale Bitrate einstellen |
| rk_video_get_RC_mode | Bitratensteuerungstyp abrufen |
| rk_video_set_RC_mode | Bitratensteuerungstyp einstellen |
| rk_video_get_output_data_type | Kodierungstyp abrufen |
| rk_video_set_output_data_type | Kodierungstyp einstellen |
| rk_video_get_rc_quality | Bitratensteuerungsqualität abrufen |
| rk_video_set_rc_quality | Bitratensteuerungsqualität einstellen |
| rk_video_get_smart | Status intelligenter Kodierung abrufen |
| rk_video_set_smart | Status intelligenter Kodierung einstellen |
| rk_video_get_gop_mode | GOP-Modus abrufen |
| rk_video_set_gop_mode | GOP-Modus einstellen |
| rk_video_get_stream_type | Streamnamen abrufen |
| rk_video_set_stream_type | Streamnamen einstellen |
| rk_video_get_h264_profile | H.264-Profil abrufen |
| rk_video_set_h264_profile | H.264-Profil einstellen |
| rk_video_get_resolution | Auflösung abrufen |
| rk_video_set_resolution | Auflösung einstellen |
| rk_video_get_frame_rate | Eingangsbildrate abrufen |
| rk_video_set_frame_rate | Eingangsbildrate einstellen |
| rk_video_get_frame_rate_in | Ausgangsbildrate abrufen |

| Funktionsname | Funktion |
| --- | --- |
| rk_video_set_frame_rate_in | Ausgangsbildrate einstellen |
| rk_video_get_rotation | Drehwinkel abrufen |
| rk_video_set_rotation | Drehwinkel einstellen |
| rk_video_get_smartp_viridrlen | virtuelle I-Frame-Länge von smartP abrufen |
| rk_video_set_smartp_viridrlen | virtuelle I-Frame-Länge von smartP einstellen |

#### 6.11.1 IVS-Modul

| Funktionsname | Funktion |
| --- | --- |
| rk_video_get_md_switch | Aktivierungsstatus der Bewegungserkennung abrufen |
| rk_video_set_md_switch | Aktivierungsstatus der Bewegungserkennung einstellen |
| rk_video_get_md_sensebility | Bewegungserkennungsempfindlichkeit abrufen |
| rk_video_set_md_sensebility | Bewegungserkennungsempfindlichkeit einstellen |
| rk_video_get_od_switch | Aktivierungsstatus der Privatsphärenmaskierung abrufen |
| rk_video_set_od_switch | Aktivierungsstatus der Privatsphärenmaskierung einstellen |

#### 6.11.2 JPEG-Modul

| Funktionsname | Funktion |
| --- | --- |
| rk_video_get_enable_cycle_snapshot | Aktivierungsstatus zeitgesteuerter Aufnahmen abrufen |
| rk_video_set_enable_cycle_snapshot | Aktivierungsstatus zeitgesteuerter Aufnahmen einstellen |
| rk_video_get_image_quality | Bildqualität abrufen |
| rk_video_set_image_quality | Bildqualität einstellen |
| rk_video_get_snapshot_interval_ms | Aufnahmeintervall abrufen |
| rk_video_set_snapshot_interval_ms | Aufnahmeintervall einstellen |
| rk_video_get_jpeg_resolution | JPEG-Auflösung abrufen |
| rk_video_set_jpeg_resolution | JPEG-Auflösung einstellen |
| rk_take_photo | Einmal aufnehmen |

### 6.12 Parameterverwaltung

| Funktionsname | Funktion |
| --- | --- |
| rk_param_get_int | Ganzzahlparameter abrufen |
| rk_param_set_int | Ganzzahlparameter einstellen |
| rk_param_get_string | Zeichenkettenparameter abrufen |
| rk_param_set_string | Zeichenkettenparameter einstellen |
| rk_param_save | Aktuelle Parameter als Datei speichern |
| rk_param_init | Aus angegebener ini-Datei initialisieren |
| rk_param_deinit | Deinitialisieren |
| rk_param_reload | ini ohne Speichern aktueller Parameter neu laden |

### 6.13 Wiedergabe- und Anzeigemodul

| Funktionsname | Funktion |
| --- | --- |
| rk_player_create | Wiedergabemodul erzeugen |
| rk_player_destroy | Wiedergabemodul zerstören |
| rk_player_play | Wiedergabe starten |
| rk_player_pause | Wiedergabe pausieren |
| rk_player_stop | Wiedergabe beenden |
| rk_player_set_file | Wiedergabedatei einstellen |
| rk_player_get_photo | JPEG-Bild dekodieren |
| rk_player_release_photo | Ressourcen der Bilddekodierung freigeben |
| rk_player_video_seek | Videowiedergabeposition einstellen |
| rk_player_get_video_duration | Gesamtdauer des Videos abrufen |
| rk_player_get_video_position | aktuelle Videoposition abrufen |
| rk_player_audio_seek | Audiowiedergabeposition einstellen |
| rk_player_get_audio_duration | Gesamtdauer des Audios abrufen |
| rk_player_get_audio_position | aktuelle Audioposition abrufen |

### 6.14 UVC-Modul

Wichtiges Skript: common\uvc\rkipc_usb_config.sh. Standardmäßig läuft ein UVC-Kanal mit nur einer Auflösung und einem Format. Für mehrere Kanäle und Formate folgende Bedingungen im Skript selbst erweitern.

```text
#uvc config init
uvc_device_config uvc.gs1 "UVC RGB" $FORMAT $WIDTH $HEIGHT
if [ $UVC_MULTI = ONE ];then
   uvc_device_config uvc.gs2 "RK UVC" "H.264" "1920" "1080"
elif [ $UVC_MULTI = TWO ];then
   uvc_device_config uvc.gs2 "RK UVC 1" "H.264" "1920" "1080"
   uvc_device_config uvc.gs3 "RK UVC 2" "H.264" "1920" "1080"
fi
```

Wesentlicher Code:

```text
uint32_t flags = UVC_CONTROL_LOOP_ONCE;
int open_uvc(int width, int height, int fcc, int fps) {
    LOG_INFO("open uvc %dx%d %d %d\n", width, height, fcc, fps);
    return 0;
}

void close_uvc(void) { LOG_INFO("close_uvc"); }

// init
system("/etc/init.d/S50usbdevice stop"); // stop old usb device
sleep(2); // wait old usb change
system("rkipc_usb_config.sh -f H.264 -w 1920 -h 1080");
sleep(1);
uvc_formats_init(output_data_type, width, height);
register_uvc_open_camera(open_uvc);
register_uvc_close_camera(close_uvc);
uvc_control_run(flags);

// send frame, in video.c
while (g_video_run_) {
    ret = RK_MPI_VENC_GetStream(VIDEO_PIPE_0, &stFrame, 2500);
    if (ret == RK_SUCCESS) {
        void *data = RK_MPI_MB_Handle2VirAddr(stFrame.pstPack->pMbBlk);
        uvc_read_camera_buffer(data, -1, stFrame.pstPack->u32Len, NULL, 0);
        RK_MPI_VENC_ReleaseStream(VIDEO_PIPE_0, &stFrame);
    }
}
uvc_read_camera_buffer(data, -1, stFrame.pstPack->u32Len, NULL, 0);

// deinit
uvc_control_join(flags);
uvc_formats_deinit();
```

## 7. ini-Parameter

Achtung: Die Definitionen unterscheiden sich je nach Produkttyp. Manche Parameter sind spezifisch, andere können unterschiedliche Bedeutungen haben. Dieser Abschnitt dient nur als Referenz; maßgeblich sind die Kommentare in der tatsächlichen ini-Datei.

### 7.1 Audiomodul

```text
[audio.0]
enable = 1 ; 是否使能⾳频功能
card_name = hw:0,0 ; 声卡名称
encode_type = G711A ; 编码类型
format = S16 ; 格式
sample_rate = 8000 ; 采样率
channels = 1 ; 声道数
frame_size = 1152 ; 采样⼤⼩
bit_rate = 16000 ; ⽐特率
input = mic_in ; 输⼊类型，⽬前仅⽀持mic_in
volume = 50 ; 输⼊⾳量
enable_aed = 0 ; 是否使能声⾳检测
enable_bcd = 0 ; 是否使能哭声检测
enable_vqe = 1 ; 是否使能⾳频3A算法
vqe_cfg = /oem/usr/share/vqefiles/config_aivqe.json ; ⾳频3A算法配置⽂件路径
```

### 7.2 Videomodul

video.source steuert Datenflüsse und Modulfunktionen sowie Funktionen für sämtliche Streams, etwa Rotation. video.x enthält die detaillierten Modulparameter abhängig vom Anwendungsszenario.

```text
[video.source]
enable_aiq = 1 ; 是否使能aiq功能
enable_vo = 0 ; 是否使能屏幕显⽰功能
vo_dev_id = 3 ; VO设备ID，0代表hdmi, 3代表mipi，不同平台可能有差异
enable_jpeg = 1 ; 是否使能jpeg拍照功能
enable_venc_0 = 1 ; 是否开启第⼀路码流
enable_venc_1 = 1 ; 是否开启第⼆路码流
enable_venc_2 = 0 ; 是否开启第三路码流
enable_npu = 1 ; 是否使能npu算法
npu_fps = 10 ; npu算法输⼊帧率
enable_wrap = 1 ; 是否使能卷绕功能
buffer_line = 720 ; 卷绕的⾏数，默认为⾼度⼀半，半帧卷绕
enable_rtsp = 1 ; 是否使能rtsp预览
enable_rtmp = 1 ; 是否使能rtmp预览
rotation = 0 ; 旋转⻆度，可选值为0、90、180、270

[video.0]
buffer_size = 1843200 ; 输出buffer⼤⼩，建议值为 w * h / 2
buffer_count = 4 ; 输出buffer个数
enable_refer_buffer_share = 1 ； 是否开启参考帧和重构帧共享
stream_type = mainStream ; 码流名称，供web判断使⽤
video_type = compositeStream ; 码流类型，供web判断使⽤
max_width = 2560 ; 主码流的最⼤宽度，⽤于预先按最⼤分辨率申请buffer
max_height = 1440 ; 主码流的最⼤⾼度，⽤于预先按最⼤分辨率申请buffer
width = 2560
height = 1440
rc_mode = VBR ; 码率控制类型
rc_quality = highest ; 码率控制质量
src_frame_rate_den = 1 ; 输⼊帧率分⺟
src_frame_rate_num = 25 ; 输⼊帧率分⼦
dst_frame_rate_den = 1 ; 输出帧率分⺟
dst_frame_rate_num = 25 ; 输出帧率分⼦
mid_rate = 2048 ; 中间码率，详细请参考rockit⽂档说明
max_rate = 3072 ; 最⼤码率，详细请参考rockit⽂档说明
min_rate = 200 ; 最⼩码率，详细请参考rockit⽂档说明
output_data_type = H.265 ; 视频编码类型
smart = open ; 是否开启智能编码，注意不是smartp
h264_profile = high ; h264的profile
gop = 50 ; I帧间隔
smartp_viridrlen = 25 ; smartP的虚拟I帧⻓度
gop_mode = normalP ; gop模式
stream_smooth = 50 ; 码流平滑度，⽬前未使⽤
; 以下为编码⾼级参数，请按需添加，具体说明请查阅rockit和mpp⽂档
enable_motion_deblur = 1
motion_deblur_strength = 0
enable_motion_static_switch = 0
frame_min_i_qp = 25
frame_min_qp = 26
frame_max_i_qp = 45
frame_max_qp = 48
enable_debreath_effect = 0
debreath_effect_strength = 16
scalinglist = 1
thrd_i = 0,0,0,0,3,3,5,5,8,8,8,15,15,20,25,25
thrd_p = 0,0,0,0,3,3,5,5,8,8,8,15,15,20,25,25
aq_step_i = -8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,7,8,9
aq_step_p = -8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,7,8,9
qbias_enable = 1
qbias_i = 171
qbias_p = 85
flt_str_i = 2
flt_str_p = 2
cu_dqp = 1
anti_ring = 3
anti_line = 3
lambda = 4
lambda_i = 7
atf_str = 2
tmvp_en = 0
static_frm_num = 5
madp16_th = 15
skip16_wgt = 6
skip32_wgt = 6
qbias_arr = 3,6,13,144,144,144,144,3,6,13,144,144,171,144,85,85,85,85
aq_rnge_arr = 8,8,12,12,12,8,8,12,12,12
lgt_chg_lvl = 0

[video.1]
input_buffer_count = 1 ; 输⼊buffer个数，RV1106⽐较特殊，卷绕模式下，⼦码流⽀持单个buffer
```

#### 7.2.1 IVS-Modul

```text
[ivs]
smear = 0 ; 详细请参考rockit⽂档说明
weightp = 0 ; 详细请参考rockit⽂档说明
md = 1 ; 移动侦测
od = 1 ; 遮挡检测
md_sensibility = 3 ; 移动侦测灵敏度，可选值: 1 2 3
```

#### 7.2.2 JPEG-Modul

```text
[video.jpeg]
width = 1920 ; jpeg的宽度，卷绕模式下⽆效
height = 1080 ; jpeg的⾼度，卷绕模式下⽆效
jpeg_buffer_size = 1048576 ; 1024KB
jpeg_qfactor = 70 ; jpeg图像质量
enable_cycle_snapshot = 0 ; 使能定时抓拍
snapshot_interval_ms = 1000 ; 定时抓拍间隔，单位为毫秒
```

### 7.3 ISP-Modul

In isp.0 bezeichnet 0 die Szenarionummer: scenario_id = cam_id * MAX_SCENARIO_NUM + current_scenario_id. Quellenbeispiel für MAX_SCENARIO_NUM=2: Szenario 2 von Kamera 0 ergibt 0*2+2=2; Szenario 1 von Kamera 2 ergibt 2*2+1=5. init_from_ini dient vor allem dem IQ-Debugging: Bei 0 werden ini-Parameter nicht zur Initialisierung gelesen, sondern die Parameter der IQ-Datei gelten.

```text
[isp]
scenario = normal ; normal or custom1
init_from_ini = 1 ; 是否使⽤ini参数覆盖IQ参数进⾏初始化
normal_scene = day ; 对应IQ⽂件中第⼀个场景的sub_scene字段
custom1_scene = night ; 对应IQ⽂件中第⼆个场景的sub_scene字段
ircut_open_gpio = 71 ; gpio2 RK_PA7 (N=X*32+Y*8+Z; X:gpioX, Y:0/1/2/...(RK_PA/B/C/...)Z:RK_PYZ)
ircut_close_gpio = 70 ; gpio2 RK_PA6

; isp.0
[isp.0.adjustment]
contrast    = 50 ; 对⽐度
brightness  = 50 ; 亮度
saturation  = 50 ; 饱和度
sharpness  = 50 ; 锐度
fps = 25 ; 帧率
hue = 50 ; ⾊调

[isp.0.exposure]
iris_type = auto
exposure_mode = auto ; 曝光模式
gain_mode = auto ; 曝光增益模式
auto_iris_level = 5
auto_exposure_enabled = 1
audo_gain_enabled = 1
exposure_time = 1/6 ; 曝光时间
exposure_gain = 1 ; 曝光增益

[isp.0.night_to_day]
night_to_day = day ; ⽇夜模式
night_to_day_filter_level = 5 ; ⽇夜转换灵敏度，暂未使⽤
night_to_day_filter_time = 5 ; ⽇夜转换过滤时间，暂未使⽤
dawn_time = 07:00:00 ; ⽇出时间，暂未使⽤
dusk_time = 18:00:00 ; ⽇落时间，暂未使⽤
ircut_filter_action = day ; ircut触发状态，暂未使⽤
over_exposure_suppress = open ; 防补光过曝，暂未使⽤
over_exposure_suppress_type = auto ; 防补光过曝模式，暂未使⽤
fill_light_mode = IR ; 补光灯类型，红外IR或LED
brightness_adjustment_mode = auto ; 亮度调节模式，暂未使⽤
light_brightness = 1 ; 补光灯亮度
distance_level = 1 ; 距离等级，暂未使⽤

[isp.0.blc]
blc_region = close ; 背光补偿
blc_strength = 1 ; 背光补偿强度
wdr = close ; 宽动态模式，暂未使⽤
wdr_level = 0 ; 宽动态强度，暂未使⽤
hdr = close ; ⾼动态模式
hdr_level = 50 ; ⾼动态强度
hlc = close ; 强光抑制
hlc_level = 0 ; 强光抑制强度
dark_boost_level = 1 ; 暗区增强级别
position_x = 0 ; 背光补偿区域x坐标
position_y = 0 ; 背光补偿区域y坐标
blc_region_width = 120 ; 背光补偿区域宽度
blc_region_high = 92 ; 背光补偿区域⾼度

[isp.0.white_blance]
white_blance_style = autoWhiteBalance ; ⽩平衡类型
white_blance_red = 50 ; ⽩平衡红⾊分量
white_blance_green = 50 ; ⽩平衡绿⾊分量
white_blance_blue = 50 ; ⽩平衡蓝⾊分量
[isp.0.enhancement]
noise_reduce_mode = close ; 降噪模式
denoise_level = 50 ; 降噪等级
spatial_denoise_level = 50 ; 空域降噪等级
temporal_denoise_level = 50 ; 时域降噪等级
dehaze = close ; 去雾模式
dehaze_level = 0 ; 去雾等级
dis = close ; 电⼦防抖，暂未使⽤
gray_scale_mode = [0-255] ; 灰度范围
image_rotation = close ; 图像旋转⻆，暂未使⽤
distortion_correction = close ; 畸变矫正
ldch_level = 0 ; 横向镜头畸变校正

[isp.0.video_adjustment]
image_flip = close ; 镜像功能
scene_mode = indoor ; 场景模式,室内或室外
power_line_frequency_mode = PAL(50HZ) ; 视频制式

[isp.0.auto_focus]
af_mode = semi-auto ; ⾃动对焦模式
zoom_level = 0 ; 放⼤/缩⼩级别
focus_level = 0 ; 聚焦/失焦级别
```

### 7.4 Speichermodul

```text
[storage]
mount_path = /userdata ; 存储路径
free_size_del_min = 500 ; 剩余空间⼩于此值，则开始⾃动删除⽂件，单位为MB
free_size_del_max = 1000 ; 剩余空间⼤于此值，则停⽌⾃动删除⽂件，单位为MB
num_limit_enable = 1; 是否通过⽂件数量来限制，优先级⾼于剩余空间的限制

[storage.0]
enable = 0 ; 是否使能对应码流录像
folder_name = video0 ; ⽂件夹名称
file_format = mp4 ; ⽂件格式，例如mp4,flv,ts
file_duration = 60 ; ⽂件时⻓，单位为秒
video_quota = 30 ; 视频配额，暂未使⽤
file_max_num = 300 ; 最⼤⽂件数量
```

### 7.5 Geräteinformationen

Speichert Geräteinformationen, die weitgehend unverändert bleiben.

```text
[system.device_info]
deivce_name = RK IP Camera
telecontrol_id = 88
model = RK-003
serial_number = RK-003-A
firmware_version = V0.2.6 build 202108
encoder_version = V1.0 build 202108
web_version = V2.12.2 build 202108
plugin_version = V1.0.0.0
channels_number = 1
hard_disks_number = 1
alarm_inputs_number = 0
alarm_outputs_number = 0
firmware_version_info = CP-3-B
manufacturer = Rockchip
hardware_id = c3d9b8674f4b94f6
user_num = 1
```

### 7.6 Fähigkeiten

Diese Fähigkeiten werden vom Web-Frontend verwendet. Zum Ändern von Optionen und Wertebereichen manuell nach JSON umwandeln, ergänzen, wieder aufteilen und in ini eintragen. Die Aufteilung ist wegen der standardmäßigen ini-Zeilenlängenbegrenzung auf 1024 erforderlich.

```text
[capability.video]
0 = {"disabled":[{"name":"sStreamType","options":{"subStream":{"sSmart":"close"},"thirdStream":{"sSmart":"close"}},"type":"disabled/limit"},{"name":"sSmart","options":{"open":{"iGOP":null,"iStreamSmooth":null,"sH264Profile":null,"sRCMode":null,"sRCQuality":null,"sSVC":null}},"type":"disabled"},{"name":"sRCMode","options":{"CBR":{"sRCQuality":null}},"type":"disabled"},{"name":"sOutputDataType","options":{"H.265":{"sH264Profile":null}},"type":"disabled"},{"name":"unspport","options":{"iStreamSmooth":null,"sVideoType":null},"type":"disabled"}],"dynamic":{"sSmart":{"open":{"iMinRate":{"dynamicRange":{"max":"iMaxRate","maxRate":1,"min":"iMaxRate","minRate":0.125},"type":"dynamicRange"}}},"sStreamType":{"mainStream":{"iMaxRate":{"options":
[256,512,1024,2048,3072,4096,6144],"type":"options"},"sResolution":{"options":
["2560*1440","1920*1080","1280*720"],"type":"options"}},"subStream":{"iMaxRate"
1 = :{"options":[128,256,512],"type":"options"},"sResolution":{"options":
["704*576","640*480","352*288","320*240"],"type":"options"}},"thirdStream":{"iMaxRate":{"options":[256,512],"type":"options"},"sResolution":{"options":
["416*416"],"type":"options"}}}},"layout":{"encoder":
["sStreamType","sVideoType","sResolution","sRCMode","sRCQuality","sFrameRate","sOutputDataType","sSmart","sH264Profile","sSVC","iMaxRate","iMinRate","iGOP","iStreamSmooth"]},"static":{"iGOP":{"range":{"max":400,"min":1},"type":"range"},"iStreamSmooth":{"range":{"max":100,"min":1,"step":1},"type":"range"},"sFrameRate":{"dynamicRange":{"max":"sFrameRateIn","maxRate":1},"options":
["1/2","1","2","4","6","8","10","12","14","16","18","20","25","30"],"type":"options/dynamicRange"},"sH264Profile":{"options":
["high","main","baseline"],"type":"options"},"sOutputDataType":{"options"
2 = :["H.264","H.265"],"type":"options"},"sRCMode":{"options":
["CBR","VBR"],"type":"options"},"sRCQuality":{"options":
["lowest","lower","low","medium","high","higher","highest"],"type":"options"},"sSVC":{"options":["open","close"],"type":"options"},"sSmart":{"options":
["open","close"],"type":"options"},"sStreamType":{"options":
["mainStream","subStream","thirdStream"],"type":"options"},"sVideoType":{"options":
["videoStream","compositeStream"],"type":"options"}}}
[capability.image_adjustment]
0 = {"layout":{"image_adjustment":
["iBrightness","iContrast","iSaturation","iSharpness","iHue"]},"static":{"iBrightness":{"range":{"max":100,"min":0,"step":1},"type":"range"},"iContrast":{"range":{"max":100,"min":0,"step":1},"type":"range"},"iHue":{"range":{"max":100,"min":0,"step":1},"type":"range"},"iSaturation":{"range":{"max":100,"min":0,"step":1},"type":"range"},"iSharpness":{"range":{"max":100,"min":0,"step":1},"type":"range"}}}

[capability.image_blc]
0 = {"disabled":[{"name":"sHLC","options":{"open":{"sBLCRegion":null}},"type":"disabled"},{"name":"sBLCRegion","options":{"open":{"iDarkBoostLevel":null,"iHLCLevel":null,"sHLC":null}},"type":"disabled"}],"dynamic":{"sBLCRegion":{"open":{"iBLCStrength":{"range":{"max":100,"min":0,"step":1},"type":"range"}}},"sHDR":{"HDR2":{"iHDRLevel":{"range":{"max":100,"min":1,"step":1},"type":"range"}},"close":{"sBLCRegion":{"options":
["close","open"],"type":"options"},"sHLC":{"options"
1 = :["close","open"],"type":"options"}}},"sHLC":{"open":{"iDarkBoostLevel":{"range":{"max":100,"min":0,"step":1},"type":"range"},"iHLCLevel":{"range":{"max":100,"min":0,"step":1},"type":"range"}}},"sWDR":{"open":{"iWDRLevel":{"range":{"max":100,"min":0,"step":1},"type":"range"}}}},"layout":{"image_blc":
["sHDR","iHDRLevel","sBLCRegion","iBLCStrength","sHLC","iHLCLevel"]},"static":{"sHDR":{"options":["close","HDR2"],"type":"options"}}}

[capability.image_enhancement]
0 = {"dynamic":{"sDehaze":{"open":{"iDehazeLevel":{"range":{"max":10,"min":0,"step":1},"type":"range"}}},"sDistortionCorrection":{"FEC":{"iFecLevel":{"range":{"max":100,"min":0,"step":1},"type":"range"}},"LDCH":{"iLdchLevel":{"range":{"max":100,"min":0,"step":1},"type":"range"}}},"sNoiseReduceMode":{"2dnr":{"iSpatialDenoiseLevel":{"range":{"max":100,"min":0,"step":1},"type":"range"}},"3dnr":{"iTemporalDenoiseLevel":{"range":{"max":100,"min":0,"step":1},"type":"range"}},"mixnr":{"iSpatialDenoiseLevel":{"range":{"max":100,"min":0,"step":1},"type":"range"},"iTemporalDenoiseLevel":{"range":{"max":100,"min":0,"step":1},"type":"range"}}}},"layout"
1 = :{"image_enhancement":
["sNoiseReduceMode","iSpatialDenoiseLevel","iTemporalDenoiseLevel","sDehaze","iDehazeLevel","sGrayScaleMode","sDistortionCorrection","iLdchLevel","iFecLevel","iImageRotation"]},"static":{"iImageRotation":{"options":[0,90,270],"type":"options"},"sDIS":{"options":
["open","close"],"type":"options"},"sDehaze":{"options":
["open","close","auto"],"type":"options"},"sDistortionCorrection":{"options":
["LDCH","close"],"type":"options"},"sFEC":{"options":
["open","close"],"type":"options"},"sGrayScaleMode":{"options":["[0-255]","[16-235]"],"type":"options"},"sNoiseReduceMode":{"options":
["close","2dnr","3dnr","mixnr"],"type":"options"}}}

[capability.image_exposure]
0 = {"dynamic":{"sExposureMode":{"auto":{"iAutoIrisLevel":{"range":{"max":100,"min":0,"step":1},"type":"range"}},"manual":{"sExposureTime":{"options":
["1","1/3","1/6","1/12","1/25","1/50","1/100","1/150","1/200","1/250","1/500","1/750","1/1000","1/2000","1/4000","1/10000","1/100000"],"type":"options"},"sGainMode":{"options":
["auto","manual"],"type":"options"}}},"sGainMode":{"manual":{"iExposureGain":{"range":{"max":100,"min":1,"step":1},"type":"range"}}}},"layout":{"image_exposure":
["sExposureMode","sExposureTime","sGainMode","iExposureGain"]},"static":{"sExposureMode":{"options":["auto","manual"],"type":"options"}}}

[capability.image_night_to_day]
0 = {"disabled":[{"name":"sNightToDay","options":{"day":{"iLightBrightness":null,"sFillLightMode":null},"night":{"iDarkBoostLevel":null,"iHDRLevel":null,"iHLCLevel":null,"sHDR":null,"sHLC":"close"}},"type":"disabled"}],"dynamic":{"sNightToDay":{"auto":{"iNightToDayFilterLevel":{"options":
[0,1,2,3,4,5,6,7],"type":"options"},"iNightToDayFilterTime":{"range":{"max":10,"min":3,"step":1},"type":"range"}},"schedule":{"sDawnTime":{"input":"time","type":"input"},"sDuskTime":{"input":"time","type":"input"}}},"sOverexposeSuppress":{"open"
1 = :{"sOverexposeSuppressType":{"options":
["auto","manual"],"type":"options"}}},"sOverexposeSuppressType":{"manual":{"iDistanceLevel":{"range":{"max":100,"min":0,"step":1},"type":"range"}}}},"layout":{"image_night_to_day":
["sNightToDay","iNightToDayFilterLevel","iNightToDayFilterTime","sDawnTime","sDuskTime","sFillLightMode","iLightBrightness"]},"static":{"iLightBrightness":{"range":{"max":100,"min":0,"step":10},"type":"range"},"sNightToDay":{"options":
["day","night"],"type":"options"},"sFillLightMode":{"type":"options","options":["IR"]}}}

[capability.image_video_adjustment]
0 = {"layout":{"image_video_adjustment":["sPowerLineFrequencyMode","sImageFlip"]},"static":{"sImageFlip":{"options":
["close","flip","mirror","centrosymmetric"],"type":"options"},"sPowerLineFrequencyMode":{"options":["PAL(50HZ)","NTSC(60HZ)"],"type":"options"},"sSceneMode":{"options":
["indoor","outdoor"],"type":"options"}}}

[capability.image_white_blance]
0 = {"dynamic":{"sWhiteBlanceStyle":{"manualWhiteBalance":{"iWhiteBalanceBlue":{"range":{"max":100,"min":0,"step":1},"type":"range"},"iWhiteBalanceGreen":{"range":{"max":100,"min":0,"step":1},"type":"range"},"iWhiteBalanceRed":{"range":{"max":100,"min":0,"step":1},"type":"range"}}}},"layout":{"image_white_blance":
["sWhiteBlanceStyle","iWhiteBalanceRed","iWhiteBalanceGreen","iWhiteBalanceBlue"]},"static":{"sWhiteBlanceStyle":{"options":
["manualWhiteBalance","autoWhiteBalance","lockingWhiteBalance","fluorescentLamp","incandescent","warmLight","naturalLight"],"type":"options"}}}
```

### 7.7 Benutzermodul

```text
[user.0]
user_name = admin ; ⽤⼾名
password = YWRtaW4= ; 加密后的⽤⼾密码
user_level = 1 ; ⽤⼾等级，administrator=0 operator=1 user=2
```

### 7.8 OSD-Modul

```text
[osd.common]
enable_osd = 1 ; 是否使能osd模块
is_presistent_text = 1
attribute = transparent/not-flashing ; 是否透明和闪烁，暂未使⽤
font_size = 32 ; 字体⼤⼩
font_color_mode = customize ; 字体颜⾊模式
font_color = fff799 ; 字体颜⾊
alignment = customize ; 对⻬模式
boundary = 0 ; 对⻬边界
font_path = /oem/usr/share/SourceHanSansEN.ttf ; 字库路径
normalized_screen_width = 704 ; web前端归⼀化宽度
normalized_screen_height = 480 ; web前端归⼀化⾼度

[osd.0]
type = channelName ; OSD区域类型为通道名称
enabled = 0 ; 是否使能此OSD区域
position_x = 1104 ; OSD区域x坐标
position_y = 640 ; OSD区域y坐标
display_text = Camera 01 ; 显⽰⽂本内容

[osd.1]
type = dateTime ; OSD区域类型为时间戳
enabled = 1
position_x = 16
position_y = 16
date_style = CHR-YYYY-MM-DD ; ⽇期格式
time_style = 24hour ; 24/12⼩时制
display_week_enabled = 0 ; 是否显⽰星期

[osd.2]
type = character ; OSD区域类型为⾃定义⽂本
enabled = 0
position_x = 0
position_y = 0
display_text = null

[osd.3]
type = character
enabled = 0
position_x = 0
position_y = 0
display_text = null

[osd.4]
type = privacyMask ; OSD区域类型为隐私遮盖
enabled = 0
position_x = 0
position_y = 0
width = 0
height = 0
[osd.5]
type = privacyMask
enabled = 0
position_x = 0
position_y = 0
width = 0
height = 0

[osd.6]
type = image ; OSD区域类型为图⽚
enabled = 0
position_x = 16
position_y = 640
image_path = /usr/share/image.bmp ; 图⽚路径
```

### 7.9 Ereignismodul

Derzeit nur rv1126_ipc_rkmedia unterstützt.

```text
[event.regional_invasion]
enabled = 1 ; 是否使能区域⼊侵
position_x = 0
position_y = 0
width = 700
height = 560
proportion = 1 ; 区域占⽐阈值，1~100
sensitivity_level = 90 ; 灵敏度，1~100
time_threshold = 1 ; 时间阈值，单位为秒
```

### 7.10 ROI-Modul

```text
[roi.0]
stream_type = mainStream ; 码流类型
id = 1 ; 区域id
enabled = 0
name = test ; 区域⾃定义名称
position_x = 0
position_y = 0
width = 0
height = 0
quality_level = 3 ; ROI提升等级
```

### 7.11 Bereichszuschnitt

```text
[region_clip.1]
enabled = 0
position_x = 0
position_y = 0
width = 640
height = 480
```

### 7.12 Tuya-Cloud-Plattform

```text
[tuya]
enable = 0 ; 是否使能涂鸦云平台功能
use_ini_key = 0 ; 是否使⽤ini内的设备三元组
product_key = 4wrrx6gmxh1czhcv
uuid = tuya943c2c4f36a4217c
auth_key = WZUXGSw3Mf0D8C1699rD0Tqi4JUO1M3B
```

### 7.13 AVS-Stitching

Achtung: Derzeit RK3588-spezifisch; einige Optionen stimmen mit [video.source] des Videomoduls überein.

```text
[avs]
format = 1 ; 是否为压缩格式，0 is nv12, 1 is fbc
sensor_num = 6 ; 摄像头个数
source_width = 2560 ; 每个摄像头宽度
source_height = 1520 ; 每个摄像头⾼度
; avs 2:5088*1520 4:5440*2700 6:8192*2700
avs_width = 8192 ; 拼接后宽度
avs_height = 2700 ; 拼接后⾼度
avs_mode = 0 ; avs拼接模式，0为融合拼接, 1为垂直⾮融合拼接, 2为⽔平⾮融合拼接, 3为⽥字形⾮融合拼接
sync = 1 ; avs同步模式，要求所有帧序列号同步
param_source = 0 ; 参数来源, 0 is CALIB, 1 is LUT, 2 is xml to lut
calib_file_path = /oem/usr/share/avs_calib/calib_file.pto ; pto⽂件路径
mesh_alpha_path = /oem/usr/share/avs_calib/ ; ⽣成的mesh表存放路径
middle_lut_path = /oem/usr/share/middle_lut/ ; middle_lut⽂件路径
projection_mode = 0 ; 0为等距柱⾯投影, 1为直线投影, 2为柱⾯投影, 3为⽴⽅体投影
center_x = 4096 ; 投影中⼼在输出图中的位置。⼀般设置为输出图像的中⼼点，表⽰投影中⼼和输出图像中⼼点重合。
center_y = 1800
fov_x = 36000 ; 拼接输出区域的视场⻆
fov_y = 8500
ori_rotation_roll = 0 ; 拼接输出起始旋转⻆度属性
ori_rotation_pitch = 0
ori_rotation_yaw = 0
rotation_roll = 0 ; 拼接输出旋转属性
rotation_pitch = 0
rotation_yaw = 0
enable_jpeg = 0
enable_venc_0 = 1
enable_venc_1 = 1
enable_venc_2 = 1
enable_vo = 0
vo_dev_id = 3 ; 0 is hdmi, 3 is mipi
enable_npu = 1
```

### 7.14 Netzwerkmodul

```text
[network.ntp]
enable = 1 ; 是否使能⽹络时间同步
refresh_time_s = 60 ; ntp刷新时间，单位秒
ntp_server = 119.28.183.184 ; ntp服务器地址
```

### 7.15 Wiedergabe und Anzeige

```text
[display]
dev_id = 1 ; 显⽰设备id
layer_id = 5 ; 显⽰图层id
width = 240 ; 显⽰设备宽
height = 320 ; 显⽰设备⾼
fps = 30 ; 显⽰帧率
intf_type = LCD ; 显⽰设备类型
play_chn_id = 1 ; 播放通道id
play_chn_priority = 2 ; 播放通道的优先级，⾼优先级的通道会覆盖低优先级通道
```

## Lokalisierte Erläuterungen der ursprünglichen ini-Kommentare

### audio.0

enable aktiviert Audio; card_name bezeichnet die Soundkarte, encode_type die Kodierung, format das Sampleformat, sample_rate die Abtastrate, channels die Kanalzahl, frame_size die Samplegröße und bit_rate die Bitrate. input unterstützt nur mic_in. volume ist die Eingangslautstärke; enable_aed erkennt Schall, enable_bcd Weinen, enable_vqe aktiviert Audio-3A und vqe_cfg dessen Konfigurationsdatei.

### video.source

enable_aiq aktiviert AIQ, enable_vo die Anzeige. vo_dev_id: 0 HDMI, 3 MIPI, plattformabhängig. enable_jpeg aktiviert Aufnahmen; enable_venc_0/1/2 den ersten/zweiten/dritten Stream. enable_npu aktiviert NPU, npu_fps bestimmt dessen Eingangsbildrate. enable_wrap aktiviert Wrap; buffer_line ist die Zeilenzahl, standardmäßig halbe Höhe/halber Frame. enable_rtsp/rtmp aktiviert Vorschau; rotation erlaubt 0/90/180/270.

### video.0 / video.1

buffer_size ist die Ausgangspuffergröße (empfohlen w*h/2), buffer_count die Anzahl. enable_refer_buffer_share teilt Referenz-/Rekonstruktionsframes. stream_type/video_type kennzeichnen Streamname/-typ für das Web. max_width/max_height dimensionieren den Hauptstreampuffer; width/height sind die Abmessungen. rc_mode/rc_quality steuern Bitrate/Qualität; src_frame_rate_den/num sind Nenner/Zähler der Eingangsbildrate, dst_frame_rate_den/num der Ausgangsbildrate. mid/max/min_rate: siehe Rockit. output_data_type ist die Kodierung; smart bedeutet intelligentes Kodieren, nicht smartp; h264_profile ist das H.264-Profil. gop ist I-Frame-Abstand, smartp_viridrlen die virtuelle I-Frame-Länge, gop_mode der GOP-Modus. stream_smooth wird noch nicht genutzt. Weitere Kodierungsparameter nach Bedarf ergänzen, siehe Rockit/MPP. video.1 input_buffer_count ist RV1106-spezifisch und unterstützt einen Puffer im Wrap-Modus.

### ivs / video.jpeg

smear/weightp: siehe Rockit. md erkennt Bewegung, od Verdeckung; md_sensibility erlaubt 1/2/3. JPEG-width/height wirken nicht im Wrap-Modus; jpeg_buffer_size=1048576 ist als 1024KB bezeichnet. jpeg_qfactor ist Qualität, enable_cycle_snapshot periodische Aufnahme und snapshot_interval_ms deren Intervall in Millisekunden.

### isp

scenario: normal/custom1. init_from_ini überschreibt die IQ-Initialisierung mit ini-Werten. normal_scene/custom1_scene entsprechen sub_scene der ersten/zweiten IQ-Szene. IR-cut-GPIO-Nummer: N=X*32+Y*8+Z; X=gpioX, Y=0/1/2/... für RK_PA/B/C/..., Z=RK_PYZ. Öffnen: GPIO71=gpio2 RK_PA7; Schließen: GPIO70=gpio2 RK_PA6.

### isp.0.adjustment / exposure

contrast, brightness, saturation, sharpness, fps und hue bedeuten Kontrast, Helligkeit, Sättigung, Schärfe, Bildrate und Farbton. exposure_mode/gain_mode sind Belichtungs-/Verstärkungsmodus; exposure_time/exposure_gain Belichtungszeit/-verstärkung.

### isp.0.night_to_day

night_to_day wählt Tag-/Nachtmodus. Noch ungenutzt: night_to_day_filter_level (Empfindlichkeit), night_to_day_filter_time (Filterzeit), dawn_time/dusk_time (Morgen-/Abendzeit), ircut_filter_action (Auslösestatus), over_exposure_suppress (Überbelichtungsunterdrückung), over_exposure_suppress_type (Modus), brightness_adjustment_mode und distance_level. fill_light_mode: IR-Infrarot oder LED; light_brightness ist die Aufhelllichthelligkeit.

### isp.0.blc / white_blance

blc_region/blc_strength steuern Gegenlichtkompensation/-stärke. wdr/wdr_level sind WDR-Modus/-Stärke, noch ungenutzt; hdr/hdr_level HDR-Modus/-Stärke. hlc/hlc_level unterdrücken Spitzlichter; dark_boost_level verstärkt dunkle Bereiche. position_x/y und blc_region_width/high definieren Bereichskoordinaten/-abmessungen. white_blance_style wählt den Weißabgleich; white_blance_red/green/blue sind R/G/B-Komponenten.

### isp.0.enhancement / video_adjustment / auto_focus

noise_reduce_mode/denoise_level wählen Rauschunterdrückung/-stufe; spatial/temporal_denoise_level deren räumliche/zeitliche Stufen. dehaze/dehaze_level entnebeln. dis (digitale Stabilisierung) und image_rotation sind ungenutzt. gray_scale_mode ist Grauwertbereich, distortion_correction Verzeichnungskorrektur, ldch_level seitliche Verzeichnungskorrektur. image_flip spiegelt/dreht; scene_mode ist indoor/outdoor; power_line_frequency_mode setzt den Netzfrequenz-Videomodus. af_mode ist Autofokusmodus, zoom_level Zoomstufe und focus_level Fokusstufe.

### storage / storage.0

mount_path ist der Speicherort. Unter free_size_del_min beginnt automatisches Löschen, über free_size_del_max endet es (MB). num_limit_enable begrenzt die Dateizahl vorrangig vor freiem Speicher. storage.0 enable aktiviert Streamaufzeichnung; folder_name Verzeichnis; file_format mp4/flv/ts; file_duration Sekunden; video_quota ungenutzt; file_max_num maximale Dateizahl.

### user.0 / osd

user_name/password sind Benutzername/Passwort; user_level: Administrator0/Operator1/Benutzer2. enable_osd aktiviert OSD. attribute (Transparenz/Blinken) ist ungenutzt. font_size, font_color_mode, font_color, alignment, boundary und font_path steuern Schriftgröße, Farbmodus, Farbe, Ausrichtung, Grenze und Schriftdatei. normalized_screen_width/height sind webnormalisierte Maße. osd.N type: channelName, dateTime, character, privacyMask oder image. enabled aktiviert die Region; position_x/y ihre Lage; display_text ihren Text. date_style Datumsformat, time_style 24/12h, display_week_enabled Wochentag; image_path Bildpfad.

### event.regional_invasion / roi.0 / tuya

enabled aktiviert Einbruchereignisse; proportion ist Flächenschwelle1–100, sensitivity_level Empfindlichkeit1–100, time_threshold Sekunden. ROI stream_type kennzeichnet Stream, id Region, name eigenen Namen und quality_level Qualitätsverbesserung. Tuya-enable aktiviert die Cloud; use_ini_key verwendet das Geräte-Zugangsdaten-Triplett aus ini.

### avs

format:0 nv12/1 fbc; sensor_num Kamerazahl, source_width/height Kameramaße, avs_width/height Stitching-Maße. avs_mode:0 überblendet,1 vertikal nicht überblendet,2 horizontal nicht überblendet,3 2×2 nicht überblendet. sync verlangt synchronisierte Frame-Sequenznummern. CN param_source:0 CALIB/1 LUT/2 XML-to-LUT; EN dagegen0 LUT/1 CALIB—ungeklärter Quellenwiderspruch. calib_file_path PTO, mesh_alpha_path erzeugte Meshes, middle_lut_path Zwischen-LUT. projection_mode:0 äquidistant zylindrisch/1 geradlinig/2 zylindrisch/3 kubisch. center_x/y sind das Projektionszentrum im Ausgangsbild, meist dessen Mitte. fov_x/y Sichtfeld; ori_rotation_* Anfangsdrehung, rotation_* Ausgangsdrehung.

### network.ntp / display

NTP-enable aktiviert Netzzeitsynchronisierung, refresh_time_s Sekunden, ntp_server Serveradresse. display dev_id/layer_id Gerät/Ebene, width/height Abmessungen, fps Bildrate, intf_type Gerätetyp, play_chn_id Wiedergabekanal; höherer play_chn_priority überlagert einen Kanal niedrigerer Priorität.

Zusätzlicher Quellcodezweifel: rk_isp_get_hue(int cam_id, int *value) verwendet sock_read(fd, value, sizeof(value)) mit Zeigergröße. Nicht auf sizeof(*value) geändert; Protokoll und Zielarchitektur prüfen. Baumkommentare kennzeichnen gemeinsame Audio-/Ereignis-/ISP-/Log-/Netzwerk-/OSD-/Parameter-/RTMP-/RTSP-/Socket-/Speicher-/System-/Tuya-Module, Hilfsfunktionen, Schriften, Erkennungsalgorithmen, Toolchain-Varianten und Lizenzen. rkipc.ini enthält Parameter, RkLunch.sh initialisiert, RkLunch-stop.sh deinitialisiert, video enthält Videogeschäftslogik.

{% endraw %}

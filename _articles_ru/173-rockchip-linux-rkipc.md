---
title: "Rockchip RKIPC: потоки продуктов, разработка, полный API и параметры ini"
description: "Rockchip RKIPC: потоки продуктов, разработка, полный API и параметры ini — V1.7.5"
excerpt: "Rockchip RKIPC: потоки продуктов, разработка, полный API и параметры ini"
translation_key: "173-rockchip-linux-rkipc"
slug: "173-rockchip-linux-rkipc"
lang: "ru"
date: "2026-10-24"
category: "linux"
author: "ArmSoM Editorial · Rockchip source documentation"
products: []
tags: [ArmSoM, Rockchip, RKIPC, Linux, ISP]
---

{% raw %}

# Rockchip RKIPC: потоки продуктов, разработка, полный API и параметры ini

Платформенная справка CN/EN V1.7.5, RK-KF-YF-937: разработка приложений RKIPC. Область источника: RV1126/RV1109 Linux4.19; RK3588 Linux5.10/6.1; RV1103/RV1106/RV1103B Linux5.10; RK3576/RV1126B Linux6.1. Проверяйте SoC, BSP, камеру/ISP и медиабиблиотеки конкретной ArmSoM; аппаратных испытаний нет, все платы не обещаны. ZH использует CN-рисунки; EN/RU/DE — EN.

Сомнения: зависимости rkmedia/rockit в таблице продуктов, возможно, переставлены; описание rk_event_ri_set_position_y указывает X; направления frame_rate/frame_rate_in требуют проверки; при MAX_SCENARIO_NUM=2 пример использует сценарий2, сохранён исходный расчёт. CN audo_gain_enabled отличается от EN auto_gain_enabled; весь код следует CN до проверки BSP. Идентификаторы deivce_name/is_presistent_text/muliti сохранены. password=YWRtaW4= — Base64, не безопасное шифрование. Облачные ключи — лишь примеры; рабочие данные заменить и защитить. Сброс, обновление и медианастройки могут прервать службу; не выполнялись.

[ArmSoM Docs](https://docs.armsom.org/)

## 1. Общая архитектура

![Общая архитектура источника](/docs/rockchip-linux-rkipc/assets/en-p007-figure-01.png)

## 2. Типы продуктов

| Каталог исходников | Внешние зависимости | Функция |
| --- | --- | --- |
| rv1103_ipc | rockit、rkaiq | IPC RV1103/RV1103B: веб- и RTSP/RTMP-просмотр, динамические параметры; wrap включён по умолчанию. |
| rv1106_ipc | rockit、rkaiq | IPC RV1106/RV1103B: веб- и RTSP/RTMP-просмотр, динамические параметры; wrap выключен. |
| rv1106_battery_ipc_client | rockit、rkaiq | Аккумуляторный продукт RV1103/RV1106: веб- и RTSP/RTMP-просмотр, динамические параметры; клиент двухпроцессной быстрой загрузки. |
| rv1106_battery_ipc_tuya | rockit、rkaiq | Аккумуляторный продукт RV1103/RV1106: просмотр в мобильном приложении Tuya Cloud, сон и пробуждение. |
| rv1106_dual_ipc | rockit、rkaiq | Двухкамерная сшивка RV1103/RV1106/RV1103B: веб- и RTSP/RTMP-просмотр, динамические параметры. |
| rv1106_aiisp | rockit、rkaiq | IPC RV1103/RV1106/RV1103B с AIISP: веб- и RTSP/RTMP-просмотр, динамические параметры. |
| rk3588_ipc | rockit、rkaiq | RK3588: однокамерный IPC, веб- и RTSP/RTMP-просмотр, динамические параметры. |
| rk3588_muliti_ipc | rockit、rkaiq | RK3588: многокамерный IPC, веб- и RTSP/RTMP-просмотр, динамические параметры. |
| rv1126_ipc_rkmedia | rockit、rkaiq | IPC RV1126/RV1109 с rkmedia: веб- и RTSP/RTMP-просмотр, динамические параметры. |
| rv1126_ipc_rockit | easymedia、rkaiq | IPC RV1126/RV1109 с rockit: веб- и RTSP/RTMP-просмотр, динамические параметры. |
| rv1126_battery_ipc | rockit、rkaiq | Аккумуляторный продукт RV1126/RV1109: просмотр в мобильном приложении Tuya Cloud, сон и пробуждение. |
| rv1126_dual_ipc | rockit、rkaiq | Двухкамерная сшивка RV1126/RV1109: веб- и RTSP/RTMP-просмотр, динамические параметры. |
| rv1126_snapshot | easymedia、rkaiq | Съёмочный продукт RV1126/RV1109: офлайн-кадры, локальные фото/видеозапись, вывод на экран. |
| rv1126_aiisp | rockit、rkaiq | IPC RV1126/RV1109 с aiisp: веб- и RTSP/RTMP-просмотр, динамические параметры. |
| rk3576_ipc | rockit、rkaiq | RK3576: однокамерный IPC, веб- и RTSP/RTMP-просмотр, динамические параметры. |
| rk3576_muliti_ipc | rockit、rkaiq | RK3576: многокамерный IPC, веб- и RTSP/RTMP-просмотр, динамические параметры. |

| Каталог исходников | Внешние зависимости | Функция |
| --- | --- | --- |
| rk3576_dv | rockit、rkaiq | Экшен-DV RK3576: локальные фото/видеозапись, декодирование и воспроизведение, вывод на экран. |
| rv1126b_ipc | rockit、rkaiq | RV1126B: однокамерный IPC, веб- и RTSP/RTMP-просмотр, динамические параметры. |
| rv1126b_dual_ipc | rockit、rkaiq | RV1126B: двухкамерный IPC, веб- и RTSP/RTMP-просмотр, динамические параметры. |
| rv1126b_dv | rockit、rkaiq | Экшен-DV RV1126B: локальные фото/видеозапись, декодирование и воспроизведение, вывод на экран. |

### 2.1 RV1103 IPC

![2.1 RV1103 IPC — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-1.png)

### 2.2 RV1106 IPC

![2.2 RV1106 IPC — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-2.png)

### 2.3 RV1106 Battery IPC Client

![2.3 RV1106 Battery IPC Client — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-3.png)

### 2.4 RV1106 Battery IPC Tuya

![2.4 RV1106 Battery IPC Tuya — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-4.png)

### 2.5 RV1106 Dual-IPC

![2.5 RV1106 Dual-IPC — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-5.png)

### 2.6 RV1106 AIISP

![2.6 RV1106 AIISP — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-6.png)

### 2.7 RK3588 IPC

![2.7 RK3588 IPC — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-7.png)

### 2.8 RK3588 Multi-IPC

![2.8 RK3588 Multi-IPC — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-8.png)

### 2.9 RV1126 IPC Rkmedia

![2.9 RV1126 IPC Rkmedia — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-9.png)

### 2.10 RV1126 IPC Rockit

![2.10 RV1126 IPC Rockit — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-10.png)

### 2.11 RV1126 Battery IPC

![2.11 RV1126 Battery IPC — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-11.png)

### 2.12 RV1126 Dual-IPC

![2.12 RV1126 Dual-IPC — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-12.png)

### 2.13 RV1126 Snapshot

![2.13 RV1126 Snapshot — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-13.png)

### 2.14 RV1126 AIISP

![2.14 RV1126 AIISP — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-14.png)

### 2.15 RK3576 IPC

![2.15 RK3576 IPC — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-15.png)

### 2.16 RK3576 Multi-IPC

![2.16 RK3576 Multi-IPC — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-16.png)

### 2.17 RK3576 DV

![2.17 RK3576 DV — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-17.png)

### 2.18 RV1126B IPC

![2.18 RV1126B IPC — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-18.png)

FEC по умолчанию выключен. При isp.0.enhancement:distortion_correction=FEC используется другой поток данных.

### 2.19 RV1126B Dual-IPC

![2.19 RV1126B Dual-IPC — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-19.png)

### 2.20 RV1126B DV

![2.20 RV1126B DV — Поток данных источника](/docs/rockchip-linux-rkipc/assets/en-flow-2-20.png)

## 3. Структура кода

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

## 4. Принципы разработки

0. Реализация на чистом C.

1. Модульность: main должен быть максимально простым и вызывать только init/deinit модулей. Каждый модуль самостоятельно управляет функциями; различия реализуются регистрацией обратных вызовов.

2. Для параметров используйте iniparser без сложных оболочек. Модуль сам определяет, какие параметры и когда читать или записывать в ini.

3. Для журналирования единообразно используйте common/log.h.

4. Общий код по возможности помещайте в common. Если платформенные различия или бизнес-логика препятствуют совместному использованию, храните отдельную копию в каждом src, избегая условных платформенных макросов.

5. Предпочтение отдаётся сборке из исходников, затем статическим библиотекам и лишь затем динамическим.

## 5. Разработка новых параметров

Веб-интерфейс → сервер веб-интерфейса → rkipc → низкоуровневый модуль → сохранение параметров.

Пример оттенка hue: интерфейс в основном уже реализован и не требует изменений. В app/ipcweb-backend/src/image_api.cpp сервер получает JSON вида "iHue":50, затем вызывает обёртку из app/ipcweb-backend/src/socket_client для удалённого обращения к rkipc. В app/rkipc/src/server также нужна соответствующая функция, применяющая и сохраняющая настройку. Новые функции рекомендуется добавлять парами get/set. rkipc главным образом предоставляет функции внешним вызовам и применяет настройки при инициализации. Пример ниже.

### 5.1 Добавить поле hue в ini

```text
[isp.0.adjustment]
hue = 50
```

### 5.2 Добавить функции set/get в модуль isp

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

### 5.3 Обернуть socket-функции в модуле server

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

### 5.4 Добавить обработку в веб-сервер

ipcweb-backend в основном проверяет данные от веб-интерфейса и выполняет Get/Set. Изменения:

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

### 5.5 Добавить обработку в веб-интерфейс

Измените HTML- и TS-файлы интерфейса, добавив разметку опций и get/set. См. HTML и TS в app/ipcweb-ng/src/app/config/shared/isp; основные фрагменты ниже.

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

## 6. API модулей

### 6.1 Сетевой модуль

| Имя функции | Функция |
| --- | --- |
| rk_network_init | Инициализировать модуль сети |
| rk_network_deinit | Деинициализировать модуль сети |
| rk_network_ipv4_set | Задать IPv4 |
| rk_network_ipv4_get | Получить конфигурацию IPv4 |
| rk_network_dns_get | Получить DNS проводного интерфейса |
| rk_network_dns_set | Задать DNS проводного интерфейса |
| rk_network_get_mac | Получить MAC-адрес устройства |
| rk_network_set_mac | Задать MAC-адрес устройства |

| Имя функции | Функция |
| --- | --- |
| rk_network_nicspeed_get | Получить скорость сетевого интерфейса |
| rk_network_nicspeed_set | Задать скорость сетевого интерфейса |
| rk_network_nicspeed_support_get | Получить поддерживаемые скорости интерфейса |
| rk_ethernet_power_set | Включить/выключить Ethernet |
| rk_nic_state_get | Получить текущее состояние интерфейса |
| rk_wifi_power_get | Получить текущее состояние Wi-Fi |
| rk_wifi_power_set | Включить/выключить Wi-Fi |
| rk_wifi_scan_wifi | Немедленно сканировать Wi-Fi |
| rk_wifi_get_list | Получить список Wi-Fi |
| rk_wifi_connect_with_ssid | Подключиться к Wi-Fi |
| rk_wifi_forget_with_ssid | Удалить Wi-Fi |

### 6.2 Модуль мультиплексирования

| Имя функции | Функция |
| --- | --- |
| rkmuxer_init | Инициализировать модуль мультиплексирования |
| rkmuxer_deinit | Деинициализировать модуль мультиплексирования |
| rkmuxer_write_video_frame | Записать видеокадр |
| rkmuxer_write_audio_frame | Записать аудиокадр |

### 6.3 Модуль хранения

| Имя функции | Функция |
| --- | --- |
| rk_storage_init | Инициализировать модуль хранения |
| rk_storage_deinit | Деинициализировать модуль хранения |
| rk_storage_write_video_frame | Записать видеокадр |
| rk_storage_write_audio_frame | Записать аудиокадр |
| rk_storage_record_start | Начать запись |
| rk_storage_record_stop | Остановить запись |
| rk_storage_record_status_get | Получить состояние записи |

### 6.4 Модуль OSD

Библиотеки rkmedia и rockit реализуют OSD по-разному. Для абстрагирования бизнес-логики OSD и отделения её от video используется регистрация обратных вызовов. Регистрация функций позволяет менять реализацию, сохраняя одинаковую верхнеуровневую логику.

| Имя функции | Функция |
| --- | --- |
| rk_osd_cover_create_callback_register | Зарегистрировать callback создания маски |
| rk_osd_cover_destroy_callback_register | Зарегистрировать callback удаления маски |
| rk_osd_bmp_create_callback_register | Зарегистрировать callback создания BMP |
| rk_osd_bmp_destroy_callback_register | Зарегистрировать callback удаления BMP |
| rk_osd_bmp_change_callback_register | Зарегистрировать callback изменения BMP |
| rk_osd_init | Инициализировать модуль OSD |
| rk_osd_deinit | Деинициализировать модуль OSD |
| rk_osd_restart | Перезапустить OSD |
| fill_image | Заполнить изображение |
| fill_text | Создать текстовое изображение и заполнить |
| generate_date_time | Создать метку времени в широких символах |
| rk_osd_get_font_size | Получить размер шрифта |
| rk_osd_set_font_size | Задать размер шрифта |
| rk_osd_get_font_color | Получить цвет шрифта |
| rk_osd_set_font_color | Задать цвет шрифта |
| rk_osd_get_font_path | Получить путь файла шрифта |
| rk_osd_set_font_path | Задать путь файла шрифта |
| rk_osd_get_enabled | Получить состояние включения |
| rk_osd_set_enabled | Задать состояние включения |
| rk_osd_get_position_x | Получить координату X |
| rk_osd_set_position_x | Задать координату X |
| rk_osd_get_position_y | Получить координату Y |
| rk_osd_set_position_y | Задать координату Y |
| rk_osd_get_height | Получить высоту |
| rk_osd_set_height | Задать высоту |
| rk_osd_get_width | Получить ширину |
| rk_osd_set_width | Задать ширину |
| rk_osd_get_display_text | Получить отображаемый текст |

| Имя функции | Функция |
| --- | --- |
| rk_osd_set_display_text | Задать отображаемый текст |
| rk_osd_get_image_path | Получить путь файла изображения |
| rk_osd_set_image_path | Задать путь файла изображения |

### 6.5 Системный модуль

Исходный ini по умолчанию — /usr/share/rkipc.ini. Если стартовый сценарий не находит rkipc.ini в /userdata, он копирует его туда. При восстановлении заводских настроек /usr/share/rkipc.ini копируется в /userdata/rkipc.ini.

| Имя функции | Функция |
| --- | --- |
| rk_system_init | Инициализировать модуль системы |
| rk_system_deinit | Деинициализировать модуль системы |
| rk_system_reboot | Перезагрузить |
| rk_system_factory_reset | Восстановить заводские настройки |
| rk_system_export_log | Экспортировать журнал |
| rk_system_export_db | Экспортировать конфигурацию |
| rk_system_import_db | Импортировать конфигурацию |
| rk_system_upgrade | Обновить систему |
| rk_system_get_user_num | Получить число пользователей |
| rk_system_set_user_num | Задать число пользователей |
| rk_system_get_user_level | Получить права пользователя |
| rk_system_set_user_level | Задать права пользователя |
| rk_system_get_user_name | Получить имя пользователя |
| rk_system_set_user_name | Задать имя пользователя |
| rk_system_get_password | Получить пароль (зашифрованный по описанию источника) |
| rk_system_set_password | Задать пароль (зашифрованный по описанию источника) |
| rk_system_add_user | Добавить пользователя |
| rk_system_del_user | Удалить пользователя |

### 6.6 Модуль событий

Пока поддерживается только rv1126_ipc_rkmedia.

| Имя функции | Функция |
| --- | --- |
| rk_event_init | Инициализировать модуль событий |
| rk_event_deinit | Деинициализировать модуль событий |
| rk_event_ri_get_enabled | Получить состояние обнаружения вторжения в область |
| rk_event_ri_set_enabled | Задать состояние обнаружения вторжения в область |
| rk_event_ri_get_position_x | Получить координату X области вторжения |
| rk_event_ri_set_position_x | Задать координату X области вторжения |
| rk_event_ri_get_position_y | Получить координату Y области вторжения |
| rk_event_ri_set_position_y | Задать координату X области вторжения |
| rk_event_ri_get_width | Получить ширину области вторжения |
| rk_event_ri_set_width | Задать ширину области вторжения |
| rk_event_ri_get_height | Получить высоту области вторжения |
| rk_event_ri_set_height | Задать высоту области вторжения |
| rk_event_ri_get_proportion | Получить долю области вторжения |
| rk_event_ri_set_proportion | Задать долю области вторжения |
| rk_event_ri_get_sensitivity_level | Получить чувствительность области вторжения |
| rk_event_ri_set_sensitivity_level | Задать чувствительность области вторжения |
| rk_event_ri_get_time_threshold | Получить порог времени области вторжения |
| rk_event_ri_set_time_threshold | Задать порог времени области вторжения |

### 6.7 Модуль передачи RTMP

| Имя функции | Функция |
| --- | --- |
| rk_rtmp_init | Инициализировать модуль RTMP |
| rk_rtmp_deinit | Деинициализировать модуль RTMP |
| rk_rtmp_write_video_frame | Записать видеокадр |
| rk_rtmp_write_audio_frame | Записать аудиокадр |

### 6.8 Модуль передачи RTSP

| Имя функции | Функция |
| --- | --- |
| create_rtsp_demo | Создать дескриптор |
| rtsp_new_session | Создать сессию по URL |
| rtsp_set_video | Задать формат видеопотока |
| rtsp_set_audio | Задать формат аудиопотока |
| rtsp_sync_video_ts | Синхронизировать видеометки времени |
| rtsp_sync_audio_ts | Синхронизировать аудиометки времени |
| rtsp_del_session | Удалить сессию |
| rtsp_del_demo | Удалить дескриптор |
| rtsp_tx_video | Передать видеокадр |
| rtsp_tx_audio | Передать аудиокадр |
| rtsp_do_event | Выполнить операцию |

### 6.9 Модуль ISP

| Имя функции | Функция |
| --- | --- |
| rk_isp_init | Инициализировать одну камеру |
| rk_isp_deinit | Деинициализировать одну камеру |
| rk_isp_group_init | Инициализировать несколько камер |
| rk_isp_group_deinit | Деинициализировать несколько камер |
| rk_isp_set_frame_rate | Задать частоту кадров |
| rk_isp_get_contrast | Получить контраст |
| rk_isp_set_contrast | Задать контраст |
| rk_isp_get_brightness | Получить яркость |
| rk_isp_set_brightness | Задать яркость |
| rk_isp_get_saturation | Получить насыщенность |
| rk_isp_set_saturation | Задать насыщенность |
| rk_isp_get_sharpness | Получить резкость |
| rk_isp_set_sharpness | Задать резкость |
| rk_isp_get_hue | Получить оттенок |
| rk_isp_set_hue | Задать оттенок |
| rk_isp_get_exposure_mode | Получить режим экспозиции |
| rk_isp_set_exposure_mode | Задать режим экспозиции |
| rk_isp_get_gain_mode | Получить режим усиления |
| rk_isp_set_gain_mode | Задать режим усиления |
| rk_isp_get_exposure_time | Получить время экспозиции |
| rk_isp_set_exposure_time | Задать время экспозиции |
| rk_isp_get_exposure_gain | Получить усиление |
| rk_isp_set_exposure_gain | Задать усиление |
| rk_isp_get_hdr | Получить режим HDR |
| rk_isp_set_hdr | Задать режим HDR |
| rk_isp_get_blc_region | Получить режим компенсации контрового света |

| Имя функции | Функция |
| --- | --- |
| rk_isp_set_blc_region | Задать режим компенсации контрового света |
| rk_isp_get_hlc | Получить режим подавления яркого света |
| rk_isp_set_hlc | Задать режим подавления яркого света |
| rk_isp_get_hdr_level | Получить уровень HDR |
| rk_isp_set_hdr_level | Задать уровень HDR |
| rk_isp_get_blc_strength | Получить силу компенсации контрового света |
| rk_isp_set_blc_strength | Задать силу компенсации контрового света |
| rk_isp_get_hlc_level | Получить уровень подавления яркого света |
| rk_isp_set_hlc_level | Задать уровень подавления яркого света |
| rk_isp_get_dark_boost_level | Получить уровень усиления тёмных областей |
| rk_isp_set_dark_boost_level | Задать уровень усиления тёмных областей |
| rk_isp_get_white_blance_style | Получить режим баланса белого |
| rk_isp_set_white_blance_style | Задать режим баланса белого |
| rk_isp_get_white_blance_red | Получить усиление R баланса белого |
| rk_isp_set_white_blance_red | Задать усиление R баланса белого |
| rk_isp_get_white_blance_green | Получить усиление G баланса белого |
| rk_isp_set_white_blance_green | Задать усиление G баланса белого |
| rk_isp_get_white_blance_blue | Получить усиление B баланса белого |
| rk_isp_set_white_blance_blue | Задать усиление B баланса белого |
| rk_isp_get_noise_reduce_mode | Получить режим шумоподавления |
| rk_isp_set_noise_reduce_mode | Задать режим шумоподавления |
| rk_isp_get_dehaze | Получить режим удаления тумана |
| rk_isp_set_dehaze | Задать режим удаления тумана |
| rk_isp_get_gray_scale_mode | Получить диапазон серого |
| rk_isp_set_gray_scale_mode | Задать диапазон серого |
| rk_isp_get_distortion_correction | Получить режим коррекции искажений |
| rk_isp_set_distortion_correction | Задать режим коррекции искажений |
| rk_isp_get_spatial_denoise_level | Получить уровень пространственного шумоподавления |

| Имя функции | Функция |
| --- | --- |
| rk_isp_set_spatial_denoise_level | Задать уровень пространственного шумоподавления |
| rk_isp_get_temporal_denoise_level | Получить уровень временного шумоподавления |
| rk_isp_set_temporal_denoise_level | Задать уровень временного шумоподавления |
| rk_isp_get_dehaze_level | Получить уровень удаления тумана |
| rk_isp_set_dehaze_level | Задать уровень удаления тумана |
| rk_isp_get_ldch_level | Получить уровень LDCH |
| rk_isp_set_ldch_level | Задать уровень LDCH |
| rk_isp_get_power_line_frequency_mode | Получить видеостандарт |
| rk_isp_set_power_line_frequency_mode | Задать видеостандарт |
| rk_isp_get_image_flip | Получить зеркальное отражение |
| rk_isp_set_image_flip | Задать зеркальное отражение |
| rk_isp_get_af_mode | Получить режим автофокуса |
| rk_isp_set_af_mode | Задать режим автофокуса |
| rk_isp_get_zoom_level | Получить уровень масштабирования |
| rk_isp_set_zoom_level | Задать уровень масштабирования |
| rk_isp_af_zoom_in | Увеличить |
| rk_isp_af_zoom_out | Уменьшить |
| rk_isp_af_focus_in | Фокусировать |
| rk_isp_af_focus_out | Расфокусировать |

### 6.10 Аудиомодуль

| Имя функции | Функция |
| --- | --- |
| rkipc_audio_init | Инициализировать модуль аудио |
| rkipc_audio_deinit | Деинициализировать модуль аудио |
| rk_audio_restart | Перезапустить аудиомодуль |
| rk_audio_get_bit_rate | Получить битрейт |
| rk_audio_set_bit_rate | Задать битрейт |
| rk_audio_get_sample_rate | Получить частоту дискретизации |
| rk_audio_set_sample_rate | Задать частоту дискретизации |
| rk_audio_get_volume | Получить громкость |
| rk_audio_set_volume | Задать громкость |
| rk_audio_get_enable_vqe | Получить состояние включения аудиоалгоритма 3A |
| rk_audio_set_enable_vqe | Задать состояние включения аудиоалгоритма 3A |
| rk_audio_get_encode_type | Получить тип кодирования |
| rk_audio_set_encode_type | Задать тип кодирования |

### 6.11 Видеомодуль

| Имя функции | Функция |
| --- | --- |
| rk_video_init | Инициализировать модуль видео |
| rk_video_deinit | Деинициализировать модуль видео |
| rk_video_restart | Перезапустить видеомодуль |
| rk_video_get_gop | Получить интервал I-кадров |
| rk_video_set_gop | Задать интервал I-кадров |
| rk_video_get_max_rate | Получить максимальный битрейт |
| rk_video_set_max_rate | Задать максимальный битрейт |
| rk_video_get_RC_mode | Получить тип управления битрейтом |
| rk_video_set_RC_mode | Задать тип управления битрейтом |
| rk_video_get_output_data_type | Получить тип кодирования |
| rk_video_set_output_data_type | Задать тип кодирования |
| rk_video_get_rc_quality | Получить качество управления битрейтом |
| rk_video_set_rc_quality | Задать качество управления битрейтом |
| rk_video_get_smart | Получить состояние интеллектуального кодирования |
| rk_video_set_smart | Задать состояние интеллектуального кодирования |
| rk_video_get_gop_mode | Получить режим GOP |
| rk_video_set_gop_mode | Задать режим GOP |
| rk_video_get_stream_type | Получить имя потока |
| rk_video_set_stream_type | Задать имя потока |
| rk_video_get_h264_profile | Получить профиль H.264 |
| rk_video_set_h264_profile | Задать профиль H.264 |
| rk_video_get_resolution | Получить разрешение |
| rk_video_set_resolution | Задать разрешение |
| rk_video_get_frame_rate | Получить входную частоту кадров |
| rk_video_set_frame_rate | Задать входную частоту кадров |
| rk_video_get_frame_rate_in | Получить выходную частоту кадров |

| Имя функции | Функция |
| --- | --- |
| rk_video_set_frame_rate_in | Задать выходную частоту кадров |
| rk_video_get_rotation | Получить угол поворота |
| rk_video_set_rotation | Задать угол поворота |
| rk_video_get_smartp_viridrlen | Получить длину виртуального I-кадра smartP |
| rk_video_set_smartp_viridrlen | Задать длину виртуального I-кадра smartP |

#### 6.11.1 Модуль IVS

| Имя функции | Функция |
| --- | --- |
| rk_video_get_md_switch | Получить состояние обнаружения движения |
| rk_video_set_md_switch | Задать состояние обнаружения движения |
| rk_video_get_md_sensebility | Получить чувствительность обнаружения движения |
| rk_video_set_md_sensebility | Задать чувствительность обнаружения движения |
| rk_video_get_od_switch | Получить состояние маскирования приватности |
| rk_video_set_od_switch | Задать состояние маскирования приватности |

#### 6.11.2 Модуль JPEG

| Имя функции | Функция |
| --- | --- |
| rk_video_get_enable_cycle_snapshot | Получить состояние периодических снимков |
| rk_video_set_enable_cycle_snapshot | Задать состояние периодических снимков |
| rk_video_get_image_quality | Получить качество изображения |
| rk_video_set_image_quality | Задать качество изображения |
| rk_video_get_snapshot_interval_ms | Получить интервал снимков |
| rk_video_set_snapshot_interval_ms | Задать интервал снимков |
| rk_video_get_jpeg_resolution | Получить разрешение JPEG |
| rk_video_set_jpeg_resolution | Задать разрешение JPEG |
| rk_take_photo | Сделать один снимок |

### 6.12 Управление параметрами

| Имя функции | Функция |
| --- | --- |
| rk_param_get_int | Получить целочисленный параметр |
| rk_param_set_int | Задать целочисленный параметр |
| rk_param_get_string | Получить строковый параметр |
| rk_param_set_string | Задать строковый параметр |
| rk_param_save | Сохранить текущие параметры в файл |
| rk_param_init | Инициализировать из указанного ini |
| rk_param_deinit | Деинициализировать |
| rk_param_reload | Перезагрузить ini без сохранения текущих параметров |

### 6.13 Модуль воспроизведения и отображения

| Имя функции | Функция |
| --- | --- |
| rk_player_create | Создать модуль воспроизведения |
| rk_player_destroy | Удалить модуль воспроизведения |
| rk_player_play | Начать воспроизведение |
| rk_player_pause | Приостановить воспроизведение |
| rk_player_stop | Завершить воспроизведение |
| rk_player_set_file | Задать файл воспроизведения |
| rk_player_get_photo | Декодировать изображение JPEG |
| rk_player_release_photo | Освободить ресурсы декодирования изображения |
| rk_player_video_seek | Задать позицию видеовоспроизведения |
| rk_player_get_video_duration | Получить полную длительность видео |
| rk_player_get_video_position | Получить текущую позицию видео |
| rk_player_audio_seek | Задать позицию аудиовоспроизведения |
| rk_player_get_audio_duration | Получить полную длительность аудио |
| rk_player_get_audio_position | Получить текущую позицию аудио |

### 6.14 Модуль UVC

Основной сценарий: common\uvc\rkipc_usb_config.sh. По умолчанию работает один канал UVC с одним разрешением и форматом. Для нескольких каналов и форматов самостоятельно расширьте следующие условия сценария.

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

Основной код:

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

## 7. Параметры ini

Внимание: определения зависят от продукта. Некоторые параметры уникальны, значения других могут иметь разный смысл. Этот раздел — справочный; приоритет имеют комментарии фактического ini.

### 7.1 Аудиомодуль

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

### 7.2 Видеомодуль

video.source управляет включением потоков данных и функций модулей, а также функциями, действующими на все потоки, например поворотом. video.x задаёт подробные параметры модулей в зависимости от сценария применения.

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

#### 7.2.1 Модуль IVS

```text
[ivs]
smear = 0 ; 详细请参考rockit⽂档说明
weightp = 0 ; 详细请参考rockit⽂档说明
md = 1 ; 移动侦测
od = 1 ; 遮挡检测
md_sensibility = 3 ; 移动侦测灵敏度，可选值: 1 2 3
```

#### 7.2.2 Модуль JPEG

```text
[video.jpeg]
width = 1920 ; jpeg的宽度，卷绕模式下⽆效
height = 1080 ; jpeg的⾼度，卷绕模式下⽆效
jpeg_buffer_size = 1048576 ; 1024KB
jpeg_qfactor = 70 ; jpeg图像质量
enable_cycle_snapshot = 0 ; 使能定时抓拍
snapshot_interval_ms = 1000 ; 定时抓拍间隔，单位为毫秒
```

### 7.3 Модуль ISP

В isp.0 число 0 обозначает номер сценария: scenario_id = cam_id * MAX_SCENARIO_NUM + current_scenario_id. Пример источника при MAX_SCENARIO_NUM=2: сценарий 2 камеры 0 даёт 0*2+2=2; сценарий 1 камеры 2 — 2*2+1=5. init_from_ini главным образом используется при настройке IQ: при 0 параметры ini не загружаются для инициализации, действуют параметры файла IQ.

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

### 7.4 Модуль хранения

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

### 7.5 Сведения об устройстве

Хранит сведения об устройстве, которые обычно не меняются.

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

### 7.6 Набор возможностей

Набор возможностей предназначен для веб-интерфейса. Чтобы изменить варианты и диапазоны параметров страницы, вручную преобразуйте его в JSON, внесите изменения, затем снова разделите и запишите в ini. Разделение требуется из-за стандартного ограничения длины строки ini в 1024.

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

### 7.7 Пользовательский модуль

```text
[user.0]
user_name = admin ; ⽤⼾名
password = YWRtaW4= ; 加密后的⽤⼾密码
user_level = 1 ; ⽤⼾等级，administrator=0 operator=1 user=2
```

### 7.8 Модуль OSD

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

### 7.9 Модуль событий

Пока поддерживается только rv1126_ipc_rkmedia.

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

### 7.10 Модуль ROI

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

### 7.11 Обрезка области

```text
[region_clip.1]
enabled = 0
position_x = 0
position_y = 0
width = 640
height = 480
```

### 7.12 Облачная платформа Tuya

```text
[tuya]
enable = 0 ; 是否使能涂鸦云平台功能
use_ini_key = 0 ; 是否使⽤ini内的设备三元组
product_key = 4wrrx6gmxh1czhcv
uuid = tuya943c2c4f36a4217c
auth_key = WZUXGSw3Mf0D8C1699rD0Tqi4JUO1M3B
```

### 7.13 Сшивка AVS

Внимание: пока только для RK3588; часть опций совпадает с [video.source] видеомодуля.

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

### 7.14 Сетевой модуль

```text
[network.ntp]
enable = 1 ; 是否使能⽹络时间同步
refresh_time_s = 60 ; ntp刷新时间，单位秒
ntp_server = 119.28.183.184 ; ntp服务器地址
```

### 7.15 Воспроизведение и отображение

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

## Локализованные пояснения исходных комментариев ini

### audio.0

enable включает аудио; card_name — имя звуковой карты, encode_type — кодирование, format — формат отсчёта, sample_rate — частота дискретизации, channels — число каналов, frame_size — размер выборки, bit_rate — битрейт. input поддерживает только mic_in. volume — входная громкость; enable_aed обнаруживает звук, enable_bcd — плач, enable_vqe включает аудио 3A, vqe_cfg задаёт файл конфигурации.

### video.source

enable_aiq включает AIQ, enable_vo — дисплей. vo_dev_id: 0 HDMI, 3 MIPI, зависит от платформы. enable_jpeg включает снимки, enable_venc_0/1/2 — первый/второй/третий поток. enable_npu включает NPU, npu_fps задаёт входную частоту. enable_wrap включает wrap; buffer_line — число строк, по умолчанию половина высоты/кадра. enable_rtsp/rtmp включают просмотр; rotation — 0/90/180/270.

### video.0 / video.1

buffer_size — выходной буфер (рекомендуется w*h/2), buffer_count — количество. enable_refer_buffer_share разделяет опорные и восстановленные кадры. stream_type/video_type задают имя/тип потока для веб-интерфейса. max_width/max_height используются для буфера основного потока, width/height — размеры. rc_mode/rc_quality — управление битрейтом/качество; src_frame_rate_den/num — знаменатель/числитель входной частоты, dst_frame_rate_den/num — выходной. mid/max/min_rate см. Rockit. output_data_type — кодирование; smart — интеллектуальное кодирование, не smartp; h264_profile — профиль H.264. gop — интервал I-кадров; smartp_viridrlen — длина виртуального I-кадра; gop_mode — режим GOP. stream_smooth пока не используется. Дополнительные параметры кодирования ниже добавляются при необходимости, см. Rockit/MPP. video.1 input_buffer_count специфичен для RV1106: один буфер поддерживается в wrap.

### ivs / video.jpeg

smear/weightp см. Rockit. md — движение, od — перекрытие; md_sensibility принимает 1/2/3. JPEG width/height не действуют в wrap; jpeg_buffer_size=1048576 обозначен как 1024KB. jpeg_qfactor — качество, enable_cycle_snapshot — периодические снимки, snapshot_interval_ms — интервал в мс.

### isp

scenario: normal/custom1. init_from_ini заменяет параметры инициализации IQ значениями ini. normal_scene/custom1_scene соответствуют sub_scene первой/второй сцены IQ. Номер GPIO IR-cut: N=X*32+Y*8+Z; X=gpioX, Y=0/1/2/... для RK_PA/B/C/..., Z=RK_PYZ. Открытие GPIO71=gpio2 RK_PA7, закрытие GPIO70=gpio2 RK_PA6.

### isp.0.adjustment / exposure

contrast, brightness, saturation, sharpness, fps, hue — контраст, яркость, насыщенность, резкость, частота кадров, оттенок. exposure_mode/gain_mode — режим экспозиции/усиления; exposure_time/exposure_gain — время/усиление экспозиции.

### isp.0.night_to_day

night_to_day выбирает день/ночь. Пока не используются: night_to_day_filter_level (чувствительность), night_to_day_filter_time (время фильтра), dawn_time/dusk_time (рассвет/закат), ircut_filter_action (состояние срабатывания), over_exposure_suppress (подавление пересвета), over_exposure_suppress_type (режим), brightness_adjustment_mode и distance_level. fill_light_mode: IR инфракрасный либо LED; light_brightness — яркость подсветки.

### isp.0.blc / white_blance

blc_region/blc_strength — компенсация контрового света/сила. wdr/wdr_level — широкий динамический диапазон/сила, пока не используются; hdr/hdr_level — HDR/сила. hlc/hlc_level подавляют яркий свет; dark_boost_level усиливает тёмные области. position_x/y и blc_region_width/high — координаты и размеры области. white_blance_style — баланс белого; white_blance_red/green/blue — компоненты R/G/B.

### isp.0.enhancement / video_adjustment / auto_focus

noise_reduce_mode/denoise_level — шумоподавление/уровень; spatial/temporal_denoise_level — пространственный/временной уровни. dehaze/dehaze_level удаляют туман. dis (цифровая стабилизация) и image_rotation пока не используются. gray_scale_mode — диапазон серого; distortion_correction — коррекция искажений; ldch_level — боковых искажений. image_flip отражает/переворачивает; scene_mode — помещение/улица; power_line_frequency_mode — видеорежим частоты сети. af_mode — автофокус, zoom_level — масштаб, focus_level — фокус.

### storage / storage.0

mount_path — путь хранения. Ниже free_size_del_min начинается автоудаление, выше free_size_del_max прекращается (МБ). num_limit_enable ограничивает число файлов с приоритетом над свободным местом. storage.0 enable — запись потока; folder_name — каталог; file_format — mp4/flv/ts; file_duration — секунды; video_quota не используется; file_max_num — максимум файлов.

### user.0 / osd

user_name/password — имя/пароль; user_level: администратор0/оператор1/пользователь2. enable_osd включает OSD. attribute (прозрачность/мигание) не используется. font_size, font_color_mode, font_color, alignment, boundary, font_path задают размер, режим цвета, цвет, выравнивание, границу и файл шрифта. normalized_screen_width/height — нормализованные веб-размеры. osd.N type: channelName, dateTime, character, privacyMask, image. enabled включает область; position_x/y — положение; display_text — текст. date_style — дата, time_style — 24/12ч, display_week_enabled — день недели; image_path — изображение.

### event.regional_invasion / roi.0 / tuya

enabled включает вторжение; proportion — порог доли1–100, sensitivity_level — чувствительность1–100, time_threshold — секунды. ROI stream_type задаёт поток, id — область, name — произвольное имя, quality_level — улучшение качества. Tuya enable включает облако; use_ini_key берёт тройку идентификационных данных устройства из ini.

### avs

format:0 nv12/1 fbc; sensor_num — число камер, source_width/height — размеры камеры, avs_width/height — сшитого кадра. avs_mode:0 смешивание,1 вертикальная без смешивания,2 горизонтальная без смешивания,3 2×2 без смешивания. sync требует синхронных номеров кадров. CN param_source:0 CALIB/1 LUT/2 XML-to-LUT; EN:0 LUT/1 CALIB — неразрешённое противоречие. calib_file_path — PTO, mesh_alpha_path — созданные сетки, middle_lut_path — промежуточный LUT. projection_mode:0 эквидистантная цилиндрическая/1 прямолинейная/2 цилиндрическая/3 кубическая. center_x/y — центр проекции в выходном изображении, обычно центр кадра. fov_x/y — поле зрения; ori_rotation_* — начальный поворот; rotation_* — выходной.

### network.ntp / display

NTP enable включает сетевую синхронизацию времени, refresh_time_s — секунды, ntp_server — сервер. display dev_id/layer_id — устройство/слой, width/height — размеры, fps — частота, intf_type — тип устройства, play_chn_id — канал воспроизведения; больший play_chn_priority перекрывает канал меньшего приоритета.

Дополнительное сомнение кода: rk_isp_get_hue(int cam_id, int *value) вызывает sock_read(fd, value, sizeof(value)), используя размер указателя. Не заменено на sizeof(*value): проверьте протокол и архитектуру. Комментарии дерева обозначают общие модули аудио/событий/ISP/журналов/сети/OSD/параметров/RTMP/RTSP/socket/хранения/системы/Tuya, вспомогательные функции, шрифты, алгоритмы распознавания, варианты toolchain и лицензии. rkipc.ini — параметры, RkLunch.sh — инициализация, RkLunch-stop.sh — деинициализация, video — видеологика.

{% endraw %}

---
title: "RK2118 NPU, часть 3: RT-Thread и прошивка DSP"
description: "RK2118 NPU, часть 3: RT-Thread и прошивка DSP · RKNN2 V2.5.0"
excerpt: "RK2118 NPU, часть 3: RT-Thread и прошивка DSP"
translation_key: "rknn-v250-rk2118-firmware"
slug: "rknn-v250-rk2118-firmware"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RK2118", "RKNN", "Toolkit2", "RT-Thread"]
---

Справочный материал для RK_EVB1_RK2118G_V20 (RK2118) и соответствующего RT-Thread SDK. Плата ArmSoM с подтверждённой совместимостью не установлена; не переносите эти инструкции напрямую на другой SoC. Проверенный BSP или ядро Linux не указаны, испытания на ArmSoM не проводились.

Источник: локальные китайский и английский RKNN2 RK2118 QuickStart V2.5.0; нумерация разделов сохранена. Китайский следует своему оригиналу, остальные языки — английскому. Исправлены переносы PDF внутри имён файлов, URL, комментариев и команд. Раздел 5.3 ссылается на 3.1 для загрузки RT-Thread, но нужные шаги находятся в 3.3.1. Docker монтирует /rt-thread, а последующая команда использует относительный путь rt-thread/...; проверьте рабочий каталог контейнера. Расхождение не исправлено скрытно. Журналы, 45ms и примеры вывода взяты из источника, а не из испытаний ArmSoM. Команды с latest или без фиксации версии не гарантируют V2.5.0; сверяйтесь с фактическим SDK.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<!-- rk2118-series:start -->

**Серия RK2118 для начинающих · 3/5**

[RK2118 NPU, часть 1: плата, подключение и последовательная консоль](/ru/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU, часть 2: среда ПК и установка Toolkit2](/ru/articles/rknn-v250-rk2118-host-environment/)

**RK2118 NPU, часть 3: RT-Thread и прошивка DSP**

[RK2118 NPU, часть 4: преобразование модели, USB-входы и результаты инференса](/ru/articles/rknn-v250-rk2118-model-demo/)

[RK2118 NPU, часть 5: Docker, частые вопросы и документация](/ru/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

### 3.3 Подготовка RK2118 SDK

Пример NPU входит в RK2118 SDK, поэтому сначала необходимо подготовить исходный код SDK.

#### 3.3.1 Загрузка проекта

- Загрузите инструмент repo. Если он уже установлен, пропустите этот шаг.

```text
git clone ssh://git@www.rockchip.com.cn/repo/rk/tools/repo -b stable
export PATH=/path/to/repo:$PATH
```

- Загрузка репозитория:

```text
mkdir rt-thread
cd rt-thread
repo init --repo-url ssh://git@www.rockchip.com.cn/repo/rk/tools/repo -u ssh://git@www.rockchip.com.cn/rtos/rt-thread/rk/platform/release/manifests -b master -m rk2118.xml
.repo/repo/repo sync
```

Примечание: доступ к этому проекту требует разрешения; для его получения обратитесь в Rockchip.

#### 3.3.2 Подготовка среды сборки

Настройте среду разработки по документу Rockchip_Developer_Guide_RK2118_CN.pdf в каталоге rt-thread/Rockchips-docs/manuals/rk2118.

#### 3.3.3 Сборка прошивки RK2118

##### 3.3.3.1 Включение поддержки RKNPU

Для сборки прошивки и включения RKNPU см. главу 4 «CPU Firmware Compilation» документа Rockchip_Developer_Guide_RK2118_CN.pdf. Вернитесь в корень проекта rt-thread и выполните:

```text
cd bsp/rockchip/rk2118
cp board/evb1_v20/defconfig_npu_demo .config
scons --menuconfig
```

Убедитесь, что включены следующие параметры:

```text
RT-Thread Components --->
  [*] DFS: device virtual file system --->
       [*] Using posix-like functions, open/read/write/close
       [*] Using working directory
       (4) The maximal number of mounted file system
       (4) The maximal number of file system type
       (16) The maximal number of opened files
       [*] Using mount table for file system
       [*] Enable elm-chan fatfs
RT-Thread board config --->
  [*] using DRAM, only available for RK2118B or RK2118G
  [*] Enable hifi4 driver
  HIFI4 Project --->
    [*] HIFI4 Projects
    (X) npu Demo
  rknn dsp communication config --->
    [*] Enable rknn dsp demo communication for rk2118
RT-Thread rockchip RK2118 drivers --->
  Enable RKNPU Driver --->
    [*] Enable RKNPU Driver
    (X) RKNPU Driver in DSP
```

Примечания:

- board/evb1_v20/defconfig_npu_demo уже содержит все перечисленные параметры, поэтому ручная настройка обычно не требуется. scons --menuconfig следует использовать только для временной проверки или экспериментов.

- Для размещения драйвера NPU выберите «RKNPU Driver in DSP» (RT_USING_RKNPU_DSP_DRIVER). В этом SDK демонстрационный пример запускает прошивку RKNN на HIFI4 DSP0 (components/hifi4/samples/rk2118/npu_demo), а CPU0 взаимодействует с DSP через rknn_demo_server. Вариант «RKNPU Driver in RTT», при котором CPU обращается к NPU напрямую, с этим примером несовместим.

- После выбора «npu Demo» компоненты связи RKNN DSP выбираются автоматически, а файл размещения памяти DSP components/hifi4/samples/rk2118/npu_demo/mem_layout.h фиксируется автоматически. Ручная настройка не нужна.

- При каждом запуске build.sh файл .config перезаписывается соответствующим defconfig. Для постоянных изменений редактируйте непосредственно board/evb1_v20/defconfig_npu_demo.

- Команда сборки и упаковки прошивки этой платы: ./build.sh board/evb1_v20/package-file npu_demo

Она создаёт Image/update.img с разделами прошивок dsp0, dsp1 и dsp2 для npu_demo.

##### 3.3.3.2 Сборка и упаковка прошивки

```text
cd bsp/rockchip/rk2118
./build.sh board/evb1_v20/package-file npu_demo
```

Эта команда одновременно выполняет сборку и упаковку:

1. Перезаписывает .config файлом board/evb1_v20/defconfig_npu_demo и собирает прошивки CPU0/CPU1.

2. Вызывает mkimage.sh, чтобы включить dsp0.bin, dsp1.bin и dsp2.bin из components/hifi4/rtt/dsp_fw/npu_demo/ в образ как разделы прошивки DSP (Type=0x400).

3. Создаёт итоговый образ Image/update.img.

Примечания:

- Если изменён только код CPU, можно пересобрать его командой scons -j32, затем упаковать образ командой ./mkimage.sh board/evb1_v20/package-file npu_demo.

- Если изменён проект DSP, например components/hifi4/samples/rk2118/npu_demo/npu_demo_dsp0, сначала пересоберите проект Xtensa, чтобы заново получить dsp0.bin в rtt/dsp_fw/npu_demo/, и только затем выполняйте упаковку. Иначе образ будет содержать прежнюю прошивку DSP.

- Путь к разделам прошивки DSP автоматически обновляется вторым аргументом mkimage.sh (npu_demo). Не изменяйте package-file вручную.

##### 3.3.3.3 Запись прошивки

Запишите прошивку на плату по разделу 4.1.3.4 «Firmware Burning» документа Rockchip_Developer_Guide_RK2118_CN.pdf. Для записи update.img также можно использовать инструмент обновления из SDK:

```text
upgrade_tool uf Image/update.img
```

{% endraw %}

---
title: "RKNN2 SDK V2.5.0 · SRAM NPU RK3588/RK3576"
description: "RKNN2 SDK V2.5.0 · SRAM NPU RK3588/RK3576 · Полная серия руководства разработчика"
excerpt: "SRAM NPU RK3588/RK3576"
translation_key: "rknn-v250-sdk-guide-sram"
slug: "rknn-v250-sdk-guide-sram"
lang: "ru"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

Справочник платформы по руководству Rockchip RKNN2 SDK V2.5.0. Рассматриваются только перечисленные в исходном документе SoC, Linux/Android Runtime и Toolkit. Возможности действуют при указанных в каждом разделе условиях для чипа, SDK, драйвера и ядра и не означают поддержку всех плат ArmSoM. Перед развёртыванием проверьте BSP, драйвер NPU, Runtime и версию модели конкретной платы. Проверка на оборудовании ArmSoM не проводилась; журналы, показатели и примеры взяты из оригинала.

Источники и вычитка: китайская версия следует китайскому V2.5.0 (182 страницы), английская, русская и немецкая — английскому V2.5.0 (208 страниц). Различия оригиналов сохранены; сведения старой версии не выдаются за новые. Китайские рисунки взяты из китайского PDF, остальные — из английского, включая отдельно извлечённые векторные схемы. Номера разделов и формул сохранены. Некоторые ссылки используют старую нумерацию; примеры динамической формы содержат «1224+140=264», утверждения о TP_NORM противоречат друг другу, а init()/rknn.val_perf() отличаются от последующих описаний API. Эти сомнения сохранены: перед выполнением проверьте реальные заголовки и справочник V2.5.0. Код и параметры сохранены, разрывы PDF и продолжения таблиц восстановлены.

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 15/22**

[1. Программный стек и основные понятия](/ru/articles/rknn-v250-sdk-guide-overview/)

[2. Среда разработки, версии и подключение платы](/ru/articles/rknn-v250-sdk-guide-environment/)

[3. Процесс разработки и выбор интерфейса](/ru/articles/rknn-v250-sdk-guide-workflow/)

[4. Преобразование моделей и редактирование ONNX](/ru/articles/rknn-v250-sdk-guide-conversion/)

[5. Квантование, гибридное квантование и QAT](/ru/articles/rknn-v250-sdk-guide-quantization/)

[6. Инференс, оценка точности, производительности и памяти](/ru/articles/rknn-v250-sdk-guide-evaluation/)

[7. Жизненный цикл Runtime, размещение данных и память](/ru/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. Нулевое копирование и ограничения входов/выходов](/ru/articles/rknn-v250-sdk-guide-zero-copy/)

[9. Развёртывание через C API и генерация кода](/ru/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Развёртывание Python через Toolkit Lite2](/ru/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul API и размещение матриц](/ru/articles/rknn-v250-sdk-guide-matmul/)

[12. Многоядерная настройка NPU и производительность](/ru/articles/rknn-v250-sdk-guide-multicore/)

[13. Модели с динамической формой и развёртывание](/ru/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Многопакетный инференс](/ru/articles/rknn-v250-sdk-guide-multi-batch/)

**SRAM NPU RK3588/RK3576**

[16. Согласованность кэша и разреженный инференс](/ru/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Пользовательские операторы: Python и C API](/ru/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Развёртывание зашифрованных моделей](/ru/articles/rknn-v250-sdk-guide-encryption/)

[19. Диагностика точности](/ru/articles/rknn-v250-sdk-guide-accuracy/)

[20. Анализ производительности и оптимизация сети](/ru/articles/rknn-v250-sdk-guide-performance/)

[21. Анализ, совместное использование и повторное использование памяти](/ru/articles/rknn-v250-sdk-guide-memory/)

[22. Вопросы, обработка ошибок и справочные ресурсы](/ru/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.1.5 SRAM NPU RK3588/RK3576

RK3588 содержит 1MB SRAM, из которых 956KB доступны IP-блокам SoC и могут быть выделены RKNPU.

RK3576 содержит 512KB SRAM, из которых 480KB доступны IP-блокам SoC и могут быть выделены RKNPU.

SRAM снижает нагрузку RKNPU на пропускную способность DDR, но может влиять на время инференса.

#### 4.1.5.1 Требования к среде RKNPU

##### 4.1.5.1.1 Требования к ядру

Версия драйвера RKNPU &gt;=0.8.0

В конфигурации ядра включите CONFIG_ROCKCHIP_RKNPU_SRAM=y.

Путь конфигурации Android:

```text
<path-to-your-kernel>/arch/arm64/configs/rockchip_defconfig
```

Путь конфигурации Linux:

```text
<path-to-your-kernel>/arch/arm64/configs/rockchip_linux_defconfig
```

В соответствующем DTS ядра выделите системную SRAM для RKNPU.

Выделите необходимый объем: максимум 956KB на RK3588 и 480KB на RK3576. Размер должен быть выровнен на 4K.

Примечание: SRAM по умолчанию может быть выделена другим IP-блокам, например кодеку. Области разных блоков не должны перекрываться, иначе одновременное чтение и запись повредят данные.

Пример выделения RKNPU 956KB на RK3588 и 480KB на RK3576:

RK3588:

```text
syssram: sram@ff001000 {
  compatible = "mmio-sram";
  reg = <0x0 0xff001000 0x0 0xef000>;

  #address-cells = <1>;
  #size-cells = <1>;
  ranges = <0x0 0x0 0xff001000 0xef000>;
  /* Allocate RKNPU SRAM /
  / start address and size should be 4k algin */
  rknpu_sram: rknpu_sram@0 {
    reg = <0x0 0xef000>; // 956KB
  };
};
```

Подключите выделенную SRAM к узлу RKNPU, изменив dtsi:

```text
<path-to-your-kernel>/arch/arm64/boot/dts/rockchip/rk3588s.dtsi
rknpu: npu@fdab0000 {
  compatible = "rockchip,rk3588-rknpu";
  /* ... /
  / Add reference RKNPU sram */
  rockchip,sram = <&rknpu_sram>;
  status = "disabled";
};
```

RK3576:

```text
sram: sram@3ff88000 {
  compatible = "mmio-sram";
  reg = <0x0 0x3ff88000 0x0 0x78000>;

  #address-cells = <1>;
  #size-cells = <1>;
  ranges = <0x0 0x0 0x3ff88000 0x78000>;
  /* Allocate RKNPU SRAM /
  / start address and size should be 4k algin */
  rknpu_sram: rknpu-sram@0 {
      reg = <0x0 0x78000>; // 480KB
  };
};
```

Подключите выделенную SRAM к узлу RKNPU, изменив dtsi:

```text
<path-to-your-kernel>/arch/arm64/boot/dts/rockchip/rk3576.dtsi
rknpu: npu@27700000 {
  compatible = "rockchip,rk3576-rknpu";
  /* ... /
  / Add reference RKNPU sram */
  rockchip,sram = <&rknpu_sram>;
  status = "disabled";
};
```

##### 4.1.5.1.2 Требования к версии RKNN SDK

Версия RKNPU Runtime (librknnrt.so) &gt;=1.6.0

#### 4.1.5.2 Использование

Задайте RKNN_FLAG_ENABLE_SRAM в flags вызова rknn_init(), чтобы включить SRAM для контекста.

Например:

```text
ret = rknn_init(&ctx, rknn_model, size, RKNN_FLAG_ENABLE_SRAM, NULL);
```

При RKNN_FLAG_ENABLE_SRAM из доступной системной SRAM выделяется максимально возможный объем для Internal Tensor модели.

Примечание:

Если участок SRAM занят одним контекстом rknn, другие контексты не могут повторно использовать его. RKNN_FLAG_SHARE_SRAM в rknn_api.h еще не реализован.

Если контекст не занимает всю SRAM, остаток доступен другим контекстам rknn.

#### 4.1.5.3 Отладка

##### 4.1.5.3.1 Проверка включения SRAM

Проверьте включение SRAM в загрузочном журнале ядра: он содержит диапазон адресов и размер SRAM для RKNPU, например:

```text
rk3588_s:/ # dmesg | grep rknpu -i
RKNPU fdab0000.npu: RKNPU: sram region: [0x00000000ff001000, 0x00000000ff0f0000), sram size: 0xef000
```

##### 4.1.5.3.2 Запрос использования SRAM

Использование SRAM можно запросить через узлы.

Битовая карта неиспользованной SRAM; каждая точка соответствует 4K:

```text
rk3588_s:/ # cat /sys/kernel/debug/rknpu/mm
SRAM bitmap: "*" - used, "." - free (1bit = 4KB)
[000] [................................]
[001] [................................]
[002] [................................]
[003] [................................]
[004] [................................]
[005] [................................]
[006] [................................]
[007] [...............]
SRAM total size: 978944, used: 0, free: 978944
# Unit is Byte
```

Битовая карта после использования 512KB SRAM:

```text
rk3588_s:/ # cat /sys/kernel/debug/rknpu/mm
SRAM bitmap: "*" - used, "." - free (1bit = 4KB)
[000] [********************************]
[001] [********************************]
[002] [********************************]
[003] [********************************]
[004] [................................]
[005] [................................]
[006] [................................]
[007] [...............]
SRAM total size: 978944, used: 524288, free: 454656
# Unit is Byte
```

##### 4.1.5.3.3 Запрос размера SRAM через RKNN API

Запросите размер SRAM через RKNN_QUERY_MEM_SIZE интерфейса rknn_query().

```text
typedef struct _rknn_mem_size {
  uint32_t total_weight_size;
  uint32_t total_internal_size;
  uint64_t total_dma_allocated_size;
  uint32_t total_sram_size;
  uint32_t free_sram_size;
  uint32_t reserved[10];
} rknn_mem_size;
```

total_sram_size — общий объем SRAM, выделенный системой для RKNPU, в байтах.

free_sram_size — оставшийся доступный объем SRAM для RKNPU, в байтах.

##### 4.1.5.3.4 Запрос занятой моделью SRAM

До запуска приложения RKNN на устройстве задайте следующую переменную среды для вывода прогнозируемого использования SRAM:

```text
export RKNN_LOG_LEVEL=3
```

Послойное использование SRAM, выделенной для Internal, показано в журнале:

```text
---------------------------------------------------------------------------
Total allocated Internal SRAM Size: 524288, Addr: [0xff3e0000, 0xff460000)
---------------------------------------------------------------------------
---------------------------------------------------------------------+---------
-------------------------+-----------
ID User Tensor DataType OrigShape NativeShape |
[Start End) Size | SramHit
---------------------------------------------------------------------+---------
-------------------------+-----------
1 ConvRelu input0 INT8 (1,3,224,224) (1,1,224,224,3) |
0xff3b0000 0xff3d4c00 0x00024c00 | \
2 ConvRelu output2 INT8 (1,32,112,112) (1,2,112,112,16) |
0xff404c00 0xff466c00 0x00062000 | 0x0005b400
3 ConvRelu output4 INT8 (1,32,112,112) (1,4,112,112,16) |
0xff466c00 0xff52ac00 0x000c4000 | 0x00000000
4 ConvRelu output6 INT8 (1,64,112,112) (1,4,112,112,16) |
0xff52ac00*0xff5eec00 0x000c4000 | 0x00000000
5 ConvRelu output8 INT8 (1,64,56,56) (1,4,56,56,16) |
0xff3e0000 0xff411000 0x00031000 | 0x00031000
6 ConvRelu output10 INT8 (1,128,56,56) (1,8,56,56,16) |
0xff411000 0xff473000 0x00062000 | 0x0004f000
7 ConvRelu output12 INT8 (1,128,56,56) (1,8,56,56,16) |
0xff473000 0xff4d5000 0x00062000 | 0x00000000
8 ConvRelu output14 INT8 (1,128,56,56) (1,8,56,56,16) |
0xff3e0000 0xff442000 0x00062000 | 0x00062000
9 ConvRelu output16 INT8 (1,128,28,28) (1,8,28,28,16) |
0xff442000 0xff45a800 0x00018800 | 0x00018800
10 ConvRelu output18 INT8 (1,256,28,28) (1,16,28,28,16) |
0xff3e0000 0xff411000 0x00031000 | 0x00031000
11 ConvRelu output20 INT8 (1,256,28,28) (1,16,28,28,16) |
0xff411000 0xff442000 0x00031000 | 0x00031000
12 ConvRelu output22 INT8 (1,256,28,28) (1,16,28,28,16) |
0xff3e0000 0xff411000 0x00031000 | 0x00031000
13 ConvRelu output24 INT8 (1,256,14,14) (1,16,14,14,16) |
0xff411000 0xff41d400 0x0000c400 | 0x0000c400
14 ConvRelu output26 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
15 ConvRelu output28 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
16 ConvRelu output30 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
17 ConvRelu output32 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
18 ConvRelu output34 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
19 ConvRelu output36 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
20 ConvRelu output38 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
21 ConvRelu output40 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
22 ConvRelu output42 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
23 ConvRelu output44 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3f8800 0xff411000 0x00018800 | 0x00018800
24 ConvRelu output46 INT8 (1,512,14,14) (1,32,14,14,16) |
0xff3e0000 0xff3f8800 0x00018800 | 0x00018800
25 ConvRelu output48 INT8 (1,512,7,7) (1,33,7,7,16) |
0xff3f8800 0xff3ff000 0x00006800 | 0x00006800
26 ConvRelu output50 INT8 (1,1024,7,7) (1,67,7,7,16) |
0xff3e0000 0xff3ed000 0x0000d000 | 0x0000d000
27 ConvRelu output52 INT8 (1,1024,7,7) (1,67,7,7,16) |
0xff3ed000 0xff3fa000 0x0000d000 | 0x0000d000
28 AveragePool output54 INT8 (1,1024,7,7) (1,67,7,7,16) |
0xff3e0000 0xff3ed000 0x0000d000 | 0x0000d000
29 Conv output55 INT8 (1,1024,1,1) (1,64,1,1,16) |
0xff3ed000 0xff3ed400 0x00000400 | 0x00000400
30 Softmax output56 INT8 (1,1000,1,1) (1,64,1,1,16) |
0xff3e0000 0xff3e0400 0x00000400 | 0x00000400
31 OutputOperator output57 FLOAT (1,1000,1,1) (1,1000,1,1) |
0xff3ae000 0xff3aefa0 0x00000fa0 | \
---------------------------------------------------------------------+---------
-------------------------+-----------
----------------------------------------
Total Weight Memory Size: 4260864
Total Internal Memory Size: 2157568
Predict Internal Memory RW Amount: 11068320
Predict Weight Memory RW Amount: 4260832
Predict SRAM Hit RW Amount: 6688768
----------------------------------------
```

SRAM Hit в таблице — объем SRAM тензора текущего слоя, то есть объем чтения/записи DDR, который экономится относительно режима без SRAM.

Predict SRAM Hit RW Amount — прогноз чтения и записи SRAM всей модели, показывающий экономию чтения/записи DDR на кадр относительно режима без SRAM.

Примечание: в Linux журнал направляется в терминал, в Android — в logcat.

{% endraw %}

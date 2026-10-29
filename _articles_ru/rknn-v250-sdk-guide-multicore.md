---
title: "RKNN2 SDK V2.5.0 · Многоядерная настройка NPU и производительность"
description: "RKNN2 SDK V2.5.0 · Многоядерная настройка NPU и производительность · Полная серия руководства разработчика"
excerpt: "Многоядерная настройка NPU и производительность"
translation_key: "rknn-v250-sdk-guide-multicore"
slug: "rknn-v250-sdk-guide-multicore"
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

**RKNN2 SDK V2.5.0 · 12/22**

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

**Многоядерная настройка NPU и производительность**

[13. Модели с динамической формой и развёртывание](/ru/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Многопакетный инференс](/ru/articles/rknn-v250-sdk-guide-multi-batch/)

[15. SRAM NPU RK3588/RK3576](/ru/articles/rknn-v250-sdk-guide-sram/)

[16. Согласованность кэша и разреженный инференс](/ru/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Пользовательские операторы: Python и C API](/ru/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Развёртывание зашифрованных моделей](/ru/articles/rknn-v250-sdk-guide-encryption/)

[19. Диагностика точности](/ru/articles/rknn-v250-sdk-guide-accuracy/)

[20. Анализ производительности и оптимизация сети](/ru/articles/rknn-v250-sdk-guide-performance/)

[21. Анализ, совместное использование и повторное использование памяти](/ru/articles/rknn-v250-sdk-guide-memory/)

[22. Вопросы, обработка ошибок и справочные ресурсы](/ru/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.1.2 Настройка многоядерной NPU

RK3588 повышает вычислительную мощность за счёт трёхъядерной NPU, RK3576 — двухъядерной. Раздел подробно описывает настройку многоядерной NPU для повышения эффективности инференса.

Примечание: многоядерный режим подходит сетям с большим объёмом вычислений на слой. Для малых сетей выигрыш ограничен; переключение между одно- и многоядерным режимом с участием CPU может даже снизить производительность.

#### 4.1.2.1 Настройка многоядерного выполнения

В Python ядро NPU задаётся параметром core_mask в init_runtime() RKNN-Toolkit2 или RKNN-Toolkit Lite2. Описание параметра:

Таблица 4-6. Параметр core_mask интерфейса init_runtime

| Параметр | Описание |
| --- | --- |
| core_mask | Параметр задаёт ядро NPU для модели: NPU_CORE_AUTO: автопланирование: один свободный NPU core. NPU_CORE_0: NPU Core0. NPU_CORE_1: NPU Core1. NPU_CORE_2: NPU Core2. NPU_CORE_0_1: NPU Core0 и Core1 одновременно. NPU_CORE_0_1_2: NPU Core0, Core1 и Core2 одновременно. NPU_CORE_ALL: число ядер автоматически по платформе. По умолчанию NPU_CORE_AUTO. В RKNN-Toolkit Lite2 добавьте префикс RKNNLite, например RKNNLite.NPU_CORE_AUTO; в RKNN-Toolkit2 — RKNN, например RKNN.NPU_CORE_AUTO. |

Пример задания ядра через RKNN-Toolkit2:

```text
## Python
......
# Init runtime environment
print('--> Init runtime environment')
ret = rknn.init_runtime(target='rk3588', core_mask=RKNN.NPU_CORE_0)
if ret != 0:
    print('Init runtime environment failed!')
    exit(ret)
```

Пример задания ядра через RKNN-Toolkit Lite2:

```text
## Python
......
# Init runtime environment
print('--> Init runtime environment')
ret = rknn_lite.init_runtime(core_mask=RKNNLite.NPU_CORE_0)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
print('done')
```

В C/C++ ядро для модели задаётся rknn_set_core_mask(). Описание core_mask:

Таблица 4-7. Параметр core_mask интерфейса rknn_set_core_mask

| Параметр | Описание |
| --- | --- |
| core_mask | Параметр задаёт ядро NPU для модели: RKNN_NPU_CORE_AUTO: автопланирование: один свободный NPU core. RKNN_NPU_CORE_0: NPU Core0. RKNN_NPU_CORE_1: NPU Core1. RKNN_NPU_CORE_2: NPU Core2. RKNN_NPU_CORE_0_1: NPU Core0 и Core1 одновременно. RKNN_NPU_CORE_0_1_2: NPU Core0, Core1 и Core2 одновременно. RKNN_NPU_CORE_ALL: число ядер автоматически по платформе. |

Пример настройки ядра через C/C++ API:

```text
// C++
// rknn_context ctx;
rknn_core_mask core_mask = RKNN_NPU_CORE_0;
int ret = rknn_set_core_mask(ctx, core_mask);
```

#### 4.1.2.2 Проверка многоядерного выполнения

Раздел подробно описывает эффект многоядерного выполнения модели RKNN.

При инференсе через RKNN-Toolkit2, подключённый к плате, задайте perf_debug=True в rknn.init_runtime(), затем вызовите rknn.eval_perf() для вывода сведений по каждому слою. Пример:

```text
#Python
# Init runtime environment
ret = rknn.init_runtime(target='rk3588', device_id='29d5dd97766a5c27',
perf_debug=True)
if ret != 0:
    print('Init runtime environment failed!')
    exit(ret)

# Eval performance
rknn.eval_perf()
```

При инференсе непосредственно на плате до запуска приложения задайте RKNN_LOG_LEVEL не менее 4 для вывода сведений каждого слоя. Настройка:

```text
# Python
# When using the Python interface provided by RKNN-Toolkit Lite2, simply set verbose to True when creating the RKNNLite object
rknnlite = RKNNLite(verbose=True)

# When using the C/C++ interface, the following environment variable must be set before running the binary program
export RKNN_LOG_LEVEL=4
```

Для lenet после этих настроек выводится журнал примерно следующего вида. Для удобства удалены поля InputShape, OutputShape, DDR Cycles, NPU Cycles, Total Cycles, Time(us), MacUsage(%), Task Number, Lut Number, RW(kb), FullName.

```text
ID OpType DataType Target WorkLoad(0/1/2)-ImproveTherical
1 InputOperator UINT8 CPU 100.0%/0.0%/0.0% - Up:0.0%
2 Conv UINT8 NPU 50.0%/50.0%/0.0% - Up:50.0%
3 MaxPool INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
4 Conv INT8 NPU 50.0%/50.0%/0.0% - Up:50.0%
5 MaxPool INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
6 ConvRelu INT8 NPU 48.1%/51.9%/0.0% - Up:48.1%
7 Conv INT8 NPU 100.0%/0.0%/0.0% - Up:0.0%
8 Softmax INT8 CPU 0.0%/0.0%/0.0% - Up:0.0%
9 OutputOperator FLOAT16 CPU 0.0%/0.0%/0.0% - Up:0.0%
Total Operator Elapsed Time(us): 591
Total Memory RW Amount(MB): 0
```

Столбец WorkLoad(0/1/2)-ImproveTherical выводится только на многоядерных NPU и показывает распределение задач слоя между ядрами и теоретический выигрыш. Например, "50.0%/50.0%/0.0% - Up:50.0%" означает по 50% вычислений на Core0 и Core1 и теоретический прирост 50% против одного ядра. Если прироста нет, например "100.0%/0.0%/0.0% - Up:0.0%", возможны причины:

Нагрузка слоя меньше гранулярности распределения задач по ядрам, поэтому слой выполняется на одном ядре;

Для этого оператора разделение по ядрам ещё не реализовано в драйвере NPU и планируется в последующих версиях. Сейчас его поддерживают Conv, DepthwiseConvolution, Add, Concat, Relu, Clip, Relu6, ThresholdedRelu, PRelu, LeakyRelu.

#### 4.1.2.3 Улучшение многоядерной производительности

Для повышения производительности попробуйте:

Установить максимальные частоты CPU/DDR/NPU.

Привязать приложение к большому ядру CPU.

Привязать прерывание NPU к тому же большому ядру CPU.

Команды фиксации частоты различаются между прошивками; см. 5.2.1.1.

Для последних двух пунктов пример привязки к CPU4 приведен в скрипте:

```text
interrupts=$(cat /proc/interrupts | grep npu)
interrupts_array=($interrupts)

irq1=$(echo ${interrupts_array[0]} | awk -F ':' '{print $1}')
irq2=$(echo ${interrupts_array[14]} | awk -F ':' '{print $1}')
irq3=$(echo ${interrupts_array[28]} | awk -F ':' '{print $1}')

for irq in $irq1 $irq2 $irq3; do
 echo 4 > /proc/irq/$irq/smp_affinity_list
done

taskset 10 ./rknn_benchmark lenet.rknn "" 10 3 # The taskset mask value corresponding to CPU4 is 0x10
```

Скрипт выполняет следующие действия:

Выполняет `cat /proc/interrupts | grep npu` и извлекает три номера прерываний, удаляя двоеточия.

Циклом задает smp_affinity_list каждого прерывания в 4 — идентификатор CPU4.

Выполняет `taskset 10 ./rknn_benchmark lenet.rknn "" 10 3`. Параметр taskset для CPU4 равен 10. Описание taskset: https://man7.org/linux/man-pages/man1/taskset.1.html.

После этого прерывание NPU и rknn_benchmark выполняются на CPU4, устраняя расходы переключения ядер при обработке прерывания NPU.

{% endraw %}

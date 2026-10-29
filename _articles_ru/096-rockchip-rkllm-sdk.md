---
title: "Полное руководство RKLLM SDK 1.2.3: преобразование моделей, NPU и серверное развёртывание"
description: "Полное руководство RKLLM SDK 1.2.3: преобразование моделей, NPU и серверное развёртывание — RK3576, RK3588, RK3562, RV1126B; SDK 1.2.3."
translation_key: "096-rockchip-rkllm-sdk"
slug: "096-rockchip-rkllm-sdk"
lang: "ru"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
reference_products: ["Sige7", "Sige7S", "Sige5", "CM7S", "CM5", "AIM7", "AIM5", "LM7", "W3"]
products: []
tags: ["ArmSoM", "Rockchip", "RKLLM", "RK3588", "RK3576", "NPU"]
excerpt: "Полное руководство RKLLM SDK 1.2.3: преобразование моделей, NPU и серверное развёртывание — RK3576, RK3588, RK3562, RV1126B; SDK 1.2.3."
---

{% raw %}

# Полное руководство RKLLM SDK 1.2.3: преобразование моделей, NPU и серверное развёртывание

Полный технический текст основан на RKLLM SDK 1.2.3. Китайская статья следует китайскому PDF, английская — английскому; русский и немецкий тексты полностью переведены с английского. Китайская версия использует китайские оригинальные иллюстрации, остальные — английские. Оба PDF имеют версию 1.2.3, но различаются оформлением примеров, комментариями и отдельными описаниями; скрытого смешения нет. В оригинале перечислены RK3576, RK3588, RK3562 и RV1126B, проверка RKNPU 0.9.8, Linux 5.10.209/6.1.84, GCC 10.2 и Android NDK. Это только справочник по адаптации платформ ArmSoM: конкретная плата, SDK/BSP, ядро и модель не проверены. Аппаратных испытаний и измерений не проводилось. Слово «последний» относится к контексту версии оригинала, а не к текущему выпуску.

> Предупреждение о примерах оригинала: отступы Python, полноширинная скобка, смешанные константы JSON/Python, типы интерфейсов и перекрёстные ссылки содержат нерешённые вопросы; см. редакторские замечания. Работоспособность примеров не гарантируется. verify=False отключает проверку сертификатов, trust_remote_code=True разрешает внешний код, chmod 777 расширяет права. Замена драйвера, прошивка ядра, прослушивание 0.0.0.0 и публичная ссылка share=True требуют отдельной оценки. Исходные журналы показывают Runtime 1.0.2b9 / driver 0.9.7, отличающиеся от требований текста; это не измерения ArmSoM.

[ArmSoM Docs](https://docs.armsom.org/) · [RKLLM](https://github.com/airockchip/rknn-llm) · [EDITORIAL-NOTES](/docs/rockchip-rkllm-sdk/EDITORIAL-NOTES.md)

<!-- PDF p.7; extraction unit 0 -->

## 1 Введение в RKLLM

<!-- PDF p.7; extraction unit 1 -->

### 1.1 Инструментарий RKLLM

<!-- PDF p.7; extraction unit 2 -->

#### 1.1.1 Введение в RKLLM-Toolkit

<!-- PDF p.7; extraction unit 3 -->

RKLLM-Toolkit — комплект для квантования и преобразования больших языковых моделей на ПК. Через предоставляемый Python-интерфейс доступны следующие функции:

<!-- PDF p.7; extraction unit 4 -->

1) Преобразование моделей: LLM в формате Hugging Face или GGUF преобразуются в RKLLM. Поддерживаемые модели: LLaMA, Qwen, Qwen2, Qwen3, Qwen2-VL, Qwen3-VL, Phi-2, Phi-3, ChatGLM3, Gemma, Gemma2, Gemma3, Gemma3n, InternLM2, TeleChat2, MiniCPM-S, MiniCPM, MiniCPM3, MiniCPM4, DeepSeekOCR, InternVL3. Полученные модели RKLLM загружаются и используются на платформах Rockchip NPU.

<!-- PDF p.7; extraction unit 5 -->

2) Квантование: преобразование моделей с плавающей точкой в модели с фиксированной точкой. Поддерживаются:

a. w4a16;

b. групповое w4a16 (размеры групп 32, 64, 128);

c. w8a8;

d. групповое w8a8 (размеры групп 128, 256, 512).

<!-- PDF p.7; extraction unit 6 -->

#### 1.1.2 Введение в RKLLM Runtime

<!-- PDF p.7; extraction unit 7 -->

RKLLM Runtime загружает модели, полученные преобразованием в RKLLM-Toolkit, и выполняет инференс через Rockchip NPU. Во время инференса пользователь может задавать параметры, способы генерации текста и получать результаты через заранее определённые функции обратного вызова.

<!-- PDF p.8; extraction unit 8 -->

### 1.2 Процесс разработки RKLLM

<!-- PDF p.8; extraction unit 9 -->

Разработка RKLLM состоит главным образом из двух этапов: преобразование модели на ПК и развёртывание с выполнением на плате:

<!-- PDF p.8; extraction unit 10 -->

1) Преобразование модели на ПК. LLM в формате Hugging Face преобразуется в RKLLM для эффективного выполнения на Rockchip NPU. Этапы:

a. Получение модели:

- открытая LLM в формате Hugging Face;
- самостоятельно обученная модель, сохранённая структура которой соответствует моделям платформы Hugging Face;
- модель GGUF, пока только типов q4_0 и fp16.

b. Загрузка Hugging Face через rkllm.load_huggingface(), GGUF через rkllm.load_gguf().

c. Настройка квантования: rkllm.build() строит модель RKLLM с возможностью квантования для аппаратного развёртывания. При построении выбираются уровень оптимизации и тип квантования.

d. Экспорт через rkllm.export_rkllm() в файл .rkllm для последующего развёртывания.

<!-- PDF p.8; extraction unit 11 -->

2) Развёртывание и выполнение на плате. На этом этапе модель фактически развёртывается и выполняется. Обычно выполняются следующие шаги:

a. Инициализация: загрузить модель RKLLM на Rockchip NPU, настроить параметры желаемого способа генерации текста и заранее определить функции обратного вызова для получения результатов в реальном времени.

b. Инференс: передать входные данные в модель и

<!-- PDF p.9; extraction unit 12 -->

выполнить инференс. Результаты непрерывно поступают через заданные функции обратного вызова.

c. Освобождение: после завершения инференса освободить ресурсы модели, чтобы другие задачи могли использовать вычислительные ресурсы NPU.

Эти два этапа составляют полный процесс разработки RKLLM и обеспечивают преобразование, отладку и эффективное развёртывание LLM на Rockchip NPU.

<!-- PDF p.9; extraction unit 13 -->

### 1.3 Поддерживаемые аппаратные платформы

<!-- PDF p.9; extraction unit 14 -->

Основные аппаратные платформы данного документа: RK3576, RK3588, RK3562, RV1126B.

<!-- PDF p.10; extraction unit 15 -->

## 2 Подготовка среды разработки

<!-- PDF p.10; extraction unit 16 -->

Архив инструментария RKLLM содержит установочный whl-пакет RKLLM-Toolkit, файлы библиотеки RKLLM Runtime и примеры кода. Структура каталогов приведена ниже:

<!-- PDF p.10; extraction unit 17 -->

```text
doc
└──Rockchip_RKLLM_SDK_CN.pdf   # RKLLM SDK Documentation(Chinese)
└──Rockchip_RKLLM_SDK_EN.pdf   # RKLLM SDK Documentation(English)

examples
├──multimodal_model_demo    # Multimodal Inference Example
├──rkllm_api_demo           # Board-side Inference Example
└──rkllm_server_demo        # RKLLM-Server Deployment Example

rkllm-runtime
│   └── Android
│        └── librkllm_api
│             └──arm64-v8a
│                  └── librkllmrt.so  # 64位 Runtime库
│             └──armeabi-v7a
│                  └── librkllmrt.so   # 32 位Runtime库
│             └──include
│                  └── rkllm.h
│   └── Linux
│        └── librkllm_api
│             └──aarch64
│                  └── librkllmrt.so  # 64位Runtime库
│             └──armhf
│                  └── librkllmrt.so  # 32位Runtime库
│             └──include
│                  └── rkllm.h

rkllm-toolkit
│   └── packages
│        └──rkllm_toolkit-x.x.x-cp3xx-cp3xx-linux_x86_64.whl
│   └── examples

rknpu-driver
└──rknpu_driver_x.x.x_xxxxxxx.tar.bz2

scripts
├──fix_freq_rk3576.sh   # Fixed-frequency Script for RK3576
└──fix_freq_rk3588.sh   # Fixed-frequency Script for RK3588
└──fix_freq_rk3562.sh   # Fixed-frequency Script for RK3562
└──fix_freq_rv1126b.sh  # Fixed-frequency Script for RV1126B
```

<!-- PDF p.10; extraction unit 18 -->

В этой главе описана установка RKLLM-Toolkit и RKLLM Runtime. Использование подробно рассматривается в главе 3.

<!-- PDF p.11; extraction unit 19 -->

### 2.1 Установка RKLLM-Toolkit

<!-- PDF p.11; extraction unit 20 -->

В этом разделе показана установка RKLLM-Toolkit командой pip install. Следуйте подробным инструкциям ниже для установки инструментария.

<!-- PDF p.11; extraction unit 21 -->

#### 2.1.1 Установка через Pip

<!-- PDF p.11; extraction unit 22 -->

##### 2.1.1.1 Установка Miniforge3

<!-- PDF p.11; extraction unit 23 -->

Для управления несколькими версиями сред Python рекомендуется miniforge3. Проверьте, установлен ли miniforge3, и версию conda. Если он уже установлен, этот раздел можно пропустить.

<!-- PDF p.11; extraction unit 24 -->

```text
conda -V
# If "conda: command not found" is displayed, it indicates that conda is not installed.
# For example, version information could be displayed as conda 23.9.0
```

<!-- PDF p.11; extraction unit 25 -->

Загрузите установочный пакет miniforge3.

<!-- PDF p.11; extraction unit 26 -->

```text
wget -c https://mirrors.bfsu.edu.cn/github-release/conda-forge/miniforge/LatestRelease/Miniforge3-Linux-x86_64.sh
```

<!-- PDF p.11; extraction unit 27 -->

Установите miniforge3.

<!-- PDF p.11; extraction unit 28 -->

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

<!-- PDF p.11; extraction unit 29 -->

##### 2.1.1.2 Создание среды Conda RKLLM-Toolkit

<!-- PDF p.11; extraction unit 30 -->

Активируйте базовую среду Conda.

<!-- PDF p.11; extraction unit 31 -->

```text
source ~/miniforge3/bin/activate # directory of miniforge3
# (base) xxx@xxx-pc:~$
```

<!-- PDF p.11; extraction unit 32 -->

Создайте среду Conda RKLLM-Toolkit с Python 3.8 (рекомендуется).

<!-- PDF p.11; extraction unit 33 -->

```text
conda create -n RKLLM-Toolkit python=3.8
```

<!-- PDF p.11; extraction unit 34 -->

Активируйте среду Conda RKLLM-Toolkit.

<!-- PDF p.11; extraction unit 35 -->

```text
conda activate RKLLM-Toolkit
# (RKLLM-Toolkit) xxx@xxx-pc:~$
```

<!-- PDF p.11; extraction unit 36 -->

##### 2.1.1.3 Установка RKLLM-Toolkit

<!-- PDF p.11; extraction unit 37 -->

В среде Conda RKLLM-Toolkit установите предоставленный

<!-- PDF p.12; extraction unit 38 -->

whl-пакет инструментария напрямую через pip. Установщик автоматически загрузит необходимые зависимости RKLLM-Toolkit.

<!-- PDF p.12; extraction unit 39 -->

```text
pip3 install rkllm_toolkit-x.x.x-cp3xx-cp3xx-linux_x86_64.whl
```

<!-- PDF p.12; extraction unit 40 -->

Если следующая команда выполняется без ошибок, установка успешна.

<!-- PDF p.12; extraction unit 41 -->

```text
python
from rkllm.api import RKLLM
```

<!-- PDF p.12; extraction unit 42 -->

### 2.2 Использование RKLLM Runtime

<!-- PDF p.12; extraction unit 43 -->

В предоставленном инструментарии RKLLM Runtime включает следующие компоненты:

<!-- PDF p.12; extraction unit 44 -->

1) librkllmrt.so: библиотека RKLLM Runtime.

<!-- PDF p.12; extraction unit 45 -->

2) include/rkllm.h: заголовочный файл librkllmrt.so с описаниями структур и функций. При разработке кода инференса необходимо правильно подключить заголовок и библиотеку для успешной компиляции. Для выполнения нужно перенести библиотеку на плату и указать её расположение следующей переменной окружения:

<!-- PDF p.12; extraction unit 46 -->

```text
export LD_LIBRARY_PATH=/path/to/your/lib
```

<!-- PDF p.12; extraction unit 47 -->

### 2.3 Требования к компиляции RKLLM Runtime

<!-- PDF p.12; extraction unit 48 -->

При использовании RKLLM Runtime учитывайте версию gcc. Рекомендуется кросс-компилятор gcc-arm-10.2-2020.11-x86_64-aarch64-none-linux-gnu. Кросс-компиляторы часто обратно совместимы, но не совместимы вперёд, поэтому не используйте версии ниже 10.2. Для компиляции исполняемых файлов Android рекомендуется Android NDK по ссылке загрузки кросс-компилятора Android NDK; рекомендуемая версия r21e. Конкретные способы компиляции также приведены в скриптах каталога

<!-- PDF p.13; extraction unit 49 -->

examples/rkllm_api_demo/deploy.

<!-- PDF p.13; extraction unit 50 -->

### 2.4 Обновление ядра

<!-- PDF p.13; extraction unit 51 -->

Для предоставленного RKLLM требуется более новая версия драйвера NPU. Перед инференсом с RKLLM Runtime убедитесь, что версия NPU на плате — v0.9.8. Команда проверки:

<!-- PDF p.13; extraction unit 52 -->

```text
# Execute the following command to query the NPU kernel version.
cat /sys/kernel/debug/rknpu/version

# Confirm that the command output is as follows:
# RKNPU driver: v0.9.8
```

<!-- PDF p.13; extraction unit 53 -->

Если версия драйвера NPU ниже v0.9.8, загрузите обновлённую официальную прошивку. При неофициальной прошивке требуется обновление ядра. Пакет RKNPU поддерживает kernel-5.10 и kernel-6.1. Для kernel-5.10 рекомендуется соответствующая версия ветки develop-5.10 репозитория GitHub rockchip-linux/kernel, в частности 5.10.209. Для kernel-6.1 рекомендуется, например, 6.1.84. Версию можно проверить в Makefile корня ядра. Порядок обновления:

<!-- PDF p.13; extraction unit 54 -->

1) Загрузите rknpu_driver_0.9.8_20241009.tar.bz2.

<!-- PDF p.13; extraction unit 55 -->

2) Распакуйте архив и замените драйвер RKNPU в текущем коде ядра (kernel/drivers/rknpu).

<!-- PDF p.13; extraction unit 56 -->

3) Перекомпилируйте ядро.

<!-- PDF p.13; extraction unit 57 -->

4) Прошейте устройство новым ядром. Если при компиляции возникает ошибка, показанная на рисунке 2-1:

<!-- PDF p.13; extraction unit 58 -->

![Техническая иллюстрация оригинала RKLLM — PDF p.13](/docs/rockchip-rkllm-sdk/assets/en-p013-figure-02.png)

Копируемая расшифровка исходного журнала (не измерение ArmSoM; скрытая учётная запись не восстановлена):

```text
drivers/rknpu/rknpu_gem.c: In function 'rknpu_gem_mmap_pages':
drivers/rknpu/rknpu_gem.c:891:2: error: implicit declaration of function 'vm_flags_set' [-Werror=implicit-function-declaration]
  891 |  vm_flags_set(vma, VM_MIXEDMAP);
      |  ^~~~~~~~~~~~
drivers/rknpu/rknpu_gem.c: In function 'rknpu_gem_mmap_buffer':
drivers/rknpu/rknpu_gem.c:988:2: error: implicit declaration of function 'vm_flags_clear' [-Werror=implicit-function-declaration]
  988 |  vm_flags_clear(vma, VM_PFNMAP);
      |  ^~~~~~~~~~~~~~
cc1: all warnings being treated as errors
make[2]: *** [scripts/Makefile.build:273: drivers/rknpu/rknpu_gem.o] Error 1
make[1]: *** [scripts/Makefile.build:516: drivers/rknpu] Error 2
make[1]: *** Waiting for unfinished jobs....
  AR      drivers/iio/built-in.a
make: *** [Makefile:1929: drivers] Error 2
MAKE KERNEL IMAGE FAILED.
```

<!-- PDF p.14; extraction unit 59 -->

Рисунок 2-1. Пример ошибки компиляции ядра. В этом случае в kernel/include/linux/mm.h следует добавить следующий код из оригинала:

<!-- PDF p.14; extraction unit 60 -->

```text
static inline void vm_flags_set(struct vm_area_struct *vma,
                          vm_flags_t flags){
      vma->vm_flags |= flags;
}

static inline void vm_flags_clear(struct vm_area_struct *vma,
                            vm_flags_t flags){
      vma->vm_flags &= ~flags;
}
```

<!-- PDF p.15; extraction unit 61 -->

## 3 Руководство по использованию RKLLM

<!-- PDF p.15; extraction unit 62 -->

### 3.1 Преобразование модели

<!-- PDF p.15; extraction unit 63 -->

RKLLM-Toolkit предоставляет преобразование и квантование моделей. LLM в формате Hugging Face или GGUF преобразуются в RKLLM для развёртывания и выполнения на Rockchip NPU. В этом разделе подробно описана реализация преобразования моделей в RKLLM-Toolkit.

<!-- PDF p.15; extraction unit 64 -->

#### 3.1.1 Инициализация RKLLM

<!-- PDF p.15; extraction unit 65 -->

Сначала необходимо инициализировать объект RKLLM. В примере для этого используется конструктор RKLLM().

<!-- PDF p.15; extraction unit 66 -->

#### 3.1.2 Загрузка моделей

<!-- PDF p.15; extraction unit 67 -->

После инициализации вызовите rkllm.load_huggingface() с путём к модели. RKLLM-Toolkit загрузит большую языковую модель в формате Hugging Face или GGUF по соответствующему пути для дальнейшего преобразования и квантования. Определение функции:

<!-- PDF p.16; extraction unit 68 -->

Таблица 3-1. Спецификация интерфейса load_huggingface

<!-- PDF p.16; extraction unit 69 -->

| Функция | load_huggingface |
| --- | --- |
| Описание | Загрузка открытых LLM в формате Hugging Face. |
| Параметры | model: путь к файлам LLM для загрузки, дальнейшего преобразования и квантования.<br>model_lora: путь к весам LoRA; при преобразовании model должен указывать соответствующую базовую модель.<br>device: устройство преобразования, cuda или cpu.<br>dtype: тип весов float32, float16 или bfloat16. float16/bfloat16 уменьшают расход памяти, но могут влиять на точность квантования.<br>custom_config: пользовательский конфигурационный файл; см. раздел преобразования пользовательской модели.<br>load_weight: загружать ли веса; при False реальные веса не загружаются. |
| Возвращаемое значение | 0: модель загружена;<br>-1: ошибка загрузки. |

<!-- PDF p.16; extraction unit 70 -->

Пример кода:

<!-- PDF p.16; extraction unit 71 -->

```text
ret = rkllm.load_huggingface(
   model = './huggingface_model_dir',
   model_lora = './huggingface_lora_model_dir')
if ret != 0:
   print('Load model failed!')
```

<!-- PDF p.17; extraction unit 72 -->

Таблица 3-2. Спецификация интерфейса load_gguf

<!-- PDF p.17; extraction unit 73 -->

| Функция | load_gguf |
| --- | --- |
| Описание | Загрузка открытых LLM в GGUF, поддерживаются q4_0 и fp16. Через этот интерфейс можно также загрузить GGUF-модели LoRA и преобразовать их в RKLLM. |
| Параметры | model: путь к файлам LLM для загрузки, дальнейшего преобразования и квантования. |
| Возвращаемое значение | 0: модель загружена;<br>-1: ошибка загрузки. |

<!-- PDF p.17; extraction unit 74 -->

Пример кода:

<!-- PDF p.17; extraction unit 75 -->

```text
ret = rkllm.load_gguf(model = './model-Q4_0.gguf')
if ret != 0:
   print('Load model failed!')
```

<!-- PDF p.17; extraction unit 76 -->

#### 3.1.3 Построение модели RKLLM

<!-- PDF p.17; extraction unit 77 -->

После загрузки исходной модели через rkllm.load_huggingface() постройте RKLLM-модель функцией rkllm.build(). При преобразовании можно включить квантование для уменьшения размера модели и ускорения инференса на Rockchip NPU. Определение rkllm.build():

<!-- PDF p.18; extraction unit 78 -->

Таблица 3-3. Спецификация интерфейса build

<!-- PDF p.18; extraction unit 79 -->

| Функция | build |
| --- | --- |
| Описание | Построение модели RKLLM и настройка квантования при преобразовании. |
| Параметры | do_quantization: выполнять ли квантование; рекомендуется True.<br>optimization_level: оптимизация точности квантования, значения {0, 1}: 0 отключает, 1 включает. Оптимизация точности может снижать производительность инференса.<br>quantized_dtype: тип квантования. Поддерживаются "w4a16", "w4a16_g32", "w4a16_g64", "w4a16_g128", "w8a8", "w8a8_g128", "w8a8_g256", "w8a8_g512". "w4a16" — 4-битные веса без квантования активаций; "w4a16_g64" — групповое 4-битное квантование весов с group size=64, без квантования активаций. "w8a8" — 8-битные веса и активации; "w8a8_g128" — их групповое 8-битное квантование с group size=128. RK3576 и RV1126B поддерживают пять типов: "w4a16", "w4a16_g32", "w4a16_g64", "w4a16_g128", "w8a8". RK3588 поддерживает четыре: "w8a8", "w8a8_g128", "w8a8_g256", "w8a8_g512". RK3562 поддерживает "w8a8”, "w4a16_g32", "w4a16_g64", "w4a16_g128", "w4a8_g32". Для GGUF q4_0 соответствует "w4a16_g32". Примечание: размер группы должен делить выходную размерность линейного слоя, иначе квантование завершится ошибкой!<br>quantized_algorithm: алгоритм оптимизации точности квантования; варианты<br>"normal", "grq" или "gdq". "normal" доступен для всех типов; "gdq" и "grq" — только для "w4a16" и группового "w4a16". Они требуют высокой вычислительной мощности и GPU-ускорения. grq быстрее gdq и потребляет меньше памяти; для 4-битного квантования предпочтителен grq. LoRA-модули могут повышать точность. Если другая LoRA не импортирована, допустимы алгоритмы "normal_r[164]" или "gdq_r[1~64]", например "normal_r8", "grq_r8", "gdq_r8". Экспортируются квантованная модель и LoRA, и Runtime загружает обе для инференса.<br>num_npu_core: число ядер NPU для инференса. RK3576: [1, 2]; RK3562: [1]; RK3588: [1, 2, 3]; RV1126B: [1].<br>extra_qparams: gdq/grq создают кэш квантованных весов *.qparams; путь к нему можно передать для повторного экспорта модели.<br>dataset: набор калибровки квантования в JSON. input — вопрос с подсказкой, target — ответ; несколько записей хранятся словарями в списке.<br>hybrid_rate: доля смешанного квантования (∈[0,1)). При "w4a16"/"w8a8" по этой доле подмешиваются "w4a16_g"/"w8a8_g" для повышения точности; при групповом "w4a16_g"/"w8a8_g" подмешиваются "w4a16"/"w8a8" для ускорения инференса. При hybrid_rate=0 смешивание не выполняется.<br>target_platform: аппаратная платформа выполнения; варианты<br>"RK3576”, "RK3588”, "RK3562", "RV1126B".<br>max_context: максимальная длина контекста, до 16,384, с выравниванием по 32. |
| Возвращаемое значение | 0: преобразование и квантование успешны;<br>-1: ошибка преобразования. |

<!-- PDF p.20; extraction unit 82 -->

Пример кода:

<!-- PDF p.20; extraction unit 83 -->

```text
ret = rkllm.build(
       do_quantization=True,
       optimization_level=1,
       quantized_dtype='w8a8',
       quantized_algorithm="normal",
       num_npu_core=3,
       extra_qparams=None,
       dataset="quant_data.json",
       hybrid_rate=0,
       target_platform='rk3588')
```

<!-- PDF p.20; extraction unit 84 -->

#### 3.1.4 Экспорт модели

<!-- PDF p.20; extraction unit 85 -->

После построения модели RKLLM через rkllm.build() пользователь может сохранить модель RKNN в файл .rkllm для последующего развёртывания, вызвав rkllm.export_rkllm(). Определение параметров:

<!-- PDF p.20; extraction unit 86 -->

Таблица 3-4. Спецификация интерфейса export_rkllm

<!-- PDF p.20; extraction unit 87 -->

| Функция | export_rkllm |
| --- | --- |
| Описание | Сохранение преобразованной и квантованной модели RKLLM для последующего инференса. |
| Параметры | export_path: путь сохранения экспортируемой модели RKLLM. LoRA-модели автоматически сохраняются с суффиксом _lora в имени файла RKLLM. |
| Возвращаемое значение | 0: экспорт и сохранение успешны;<br>-1: ошибка экспорта. |

<!-- PDF p.20; extraction unit 88 -->

Пример кода:

<!-- PDF p.20; extraction unit 89 -->

```text
ret = rkllm.export_rkllm(export_path = './model.rkllm'）
if ret != 0:
   print('Export model failed!')
```

<!-- PDF p.21; extraction unit 90 -->

#### 3.1.5 Преобразование модели GPTQ

<!-- PDF p.21; extraction unit 91 -->

Помимо алгоритмов квантования, предоставленных инструментарием, можно сначала преобразовать модель с плавающей точкой в 4-битную/8-битную модель открытым инструментом AutoGPTQ, а затем преобразовать её в RKLLM. При квантовании через AutoGPTQ необходимо настроить следующие параметры:

<!-- PDF p.21; extraction unit 92 -->

```text
bits=4
sym=true
group_size=32/64/128
desc_act=false
bits=8
sym=true
group_size=128/256/512
desc_act=false
```

<!-- PDF p.21; extraction unit 93 -->

Пример преобразования GPTQ-модели формата HuggingFace в RKLLM:

<!-- PDF p.21; extraction unit 94 -->

```text
modelpath = '/path/to/Model-Instruct-GPTQ-Int4'
llm = RKLLM()
ret = llm.load_huggingface(model=modelpath, model_lora = None,
device='cuda')
if ret != 0:
   print('Load model failed!')
   exit(ret)
# Build model
dataset = None
qparams = None
target_platform = "RK3576"
optimization_level = 1
quantized_dtype = "w4a16_g32" #w4a16_g64 or w4a16_g128
quantized_algorithm = "normal"
num_npu_core = 2
ret = llm.build(do_quantization=True,
optimization_level=optimization_level, quantized_dtype=quantized_dtype,
             quantized_algorithm=quantized_algorithm,
target_platform=target_platform, num_npu_core=num_npu_core,
extra_qparams=qparams, dataset=dataset)
if ret != 0:
   print('Build model failed!')
   exit(ret)
# Export rkllm model
ret = llm.export_rkllm(f"./{os.path.basename(modelpath)}_{quantized_dtype}_{target_platform}.rkllm")
if ret != 0:
   print('Export model failed!')
   exit(ret)
```

<!-- PDF p.22; extraction unit 95 -->

#### 3.1.6 Преобразование пользовательской модели

<!-- PDF p.22; extraction unit 96 -->

Если пользователь изменил структуру или имя модели и итоговая архитектура соответствует приведённой ниже, модель можно преобразовать с помощью пользовательской функции.

<!-- PDF p.22; extraction unit 97 -->

```text
           TOKEN_EMBD
             ↓
        embd_scale(optional)
             ↓
         ┌─ x
         │  ↓
         │  ATTN_NORM
         │  ↓
         │  attn
         │  ↓
         │  ATTN_POST_NORM(optional)
         │  ↓
         │  hidden_state_scale(optional)
         │  ↓
         │  cross attn(optional)
         │  ↓
   ┌─   └► +
   │
   │        ↓
   │     FFN_NORM
   │        ↓
   │        MLP
   │        ↓
   │   FFN_POST_NORM(optional)
   │        ↓
   │   hidden_state_scale(optional)
   │        ↓
   └───►   +

             ...
             ↓
         OUTPUT_NORM
             ↓
        lm_head_scale(optional)
             ↓
           OUTPUT
```

<!-- PDF p.22; extraction unit 98 -->

Для модели Qwen соответствующие имена переменных из modeling_qwen.py нужно внести в пользовательский конфигурационный файл следующим образом.

<!-- PDF p.23; extraction unit 99 -->

```text
{
   "BLOCKNAME": "QWenBlock",
   "TOKEN_EMBD": "wte",
   "ATTN_NORM": "ln_1",
   "ATTN_Q_NORM": "",
   "ATTN_K_NORM": "",
   "CROSS_ATTN_NORM": "",
   "CROSS_ATTN_Q": "",
   "ATTN_Q": "",
   "ATTN_K": "",
   "ATTN_V": "",
   "ATTN_QKV": "attn.c_attn",
   "ATTN_KV": "",
   "KV_CONTINUOUS": "true",
   "ATTN_OUT": "attn.c_proj",
   "CROSS_ATTN_OUT": "",
   "ATTN_POST_NORM": "",
   "FFN_NORM": "ln_2",
   "FFN_UP": "mlp.w1",
   "FFN_GATE": "mlp.w2",
   "ACT_TYPE": "silu",
   "FFN_DOWN": "mlp.c_proj",
   "FFN_POST_NORM": "",
   "OUTPUT_NORM": "ln_f",
   "OUTPUT": "lm_head"
}
```

<!-- PDF p.23; extraction unit 100 -->

Допустимые ACT_TYPE: ["silu", "gelu", "relu", "fatrelu", "squarerelu", "swiglu"]. ATTN_NORM и FFN_NORM поддерживают только RMSNorm.

<!-- PDF p.23; extraction unit 101 -->

При использовании ATTN_QKV или ATTN_KV проверьте, можно ли разделить веса на непрерывные K&#124;V. Если они непрерывны, задайте KV_CONTINUOUS=true. Например, веса c_attn модели Qwen хранятся непрерывно и последовательно делятся по размеру на Q, K и V. В модели InternLM2 веса wqkv, напротив, хранятся непрерывными не целиком: Q, K и V чередуются по head_dim.

<!-- PDF p.23; extraction unit 102 -->

Определение modeling_qwen.py для Qwen 1.8B:

<!-- PDF p.24; extraction unit 103 -->

```text
class QWenLMHeadModel(QWenPreTrainedModel):
     def __init__(self, config):
       super().__init__(config)
         self.transformer = QWenModel(config)
         self.lm_head = nn.Linear(config.hidden_size,
config.vocab_size, bias=False)
class QWenModel(QWenPreTrainedModel):
   _keys_to_ignore_on_load_missing = ["attn.masked_bias"]

   def __init__(self, config):
       super().__init__(config)
       self.wte = nn.Embedding(self.vocab_size, self.embed_dim)
       self.ln_f = RMSNorm(
          self.embed_dim,
          eps=config.layer_norm_epsilon,
       )
class QWenBlock(nn.Module):
   def __init__(self, config):
       super().__init__()
       hidden_size = config.hidden_size
       self.bf16 = config.bf16

       self.ln_1 = RMSNorm(
          hidden_size,
          eps=config.layer_norm_epsilon,
       )
       self.attn = QWenAttention(config)
       self.ln_2 = RMSNorm(
          hidden_size,
          eps=config.layer_norm_epsilon,
       )
       self.mlp = QWenMLP(config)
class QWenAttention(nn.Module):
   def __init__(self, config):
       super().__init__()

       self.c_attn = nn.Linear(config.hidden_size, 3 *
self.projection_size)

       self.c_proj = nn.Linear(
          config.hidden_size, self.projection_size, bias=not
config.no_bias
       )

class QWenMLP(nn.Module):
   def __init__(self, config):
       super().__init__()
       self.w1 = nn.Linear(
          config.hidden_size, config.intermediate_size // 2, bias=not
config.no_bias
       )
       self.w2 = nn.Linear(
          config.hidden_size, config.intermediate_size // 2, bias=not
config.no_bias
       )
       ff_dim_in = config.intermediate_size // 2
       self.c_proj = nn.Linear(ff_dim_in, config.hidden_size, bias=not
config.no_bias)
```

<!-- PDF p.25; extraction unit 104 -->

Для преобразования пользовательских моделей, в том числе с cross-attention, предоставлена эталонная структура модели Hugging Face. Пользовательский конфигурационный файл:

<!-- PDF p.25; extraction unit 105 -->

```text
{
   "BLOCKNAME": "CustomDecoderLayer",
   "TOKEN_EMBD": "embed_tokens",
   "ATTN_NORM": "input_layernorm",
   "ATTN_Q_NORM": "",
   "ATTN_K_NORM": "",
   "CROSS_ATTN_NORM": "cross_layernorm",
   "CROSS_ATTN_Q": "cross_attn.cross_q_proj",
   "ATTN_Q": "",
   "ATTN_K": "",
   "ATTN_V": "",
   "ATTN_QKV": "self_attn.qkv_proj",
   "ATTN_KV": "",
   "KV_CONTINUOUS": "true",
   "ATTN_OUT": "self_attn.o_proj",
   "CROSS_ATTN_OUT": "cross_attn.cross_o_proj",
   "ATTN_POST_NORM": "",
   "FFN_NORM": "post_attention_layernorm",
   "FFN_UP": "mlp.up_proj",
   "FFN_GATE": "mlp.gate_proj",
   "ACT_TYPE": "silu",
   "FFN_DOWN": "mlp.down_proj",
   "FFN_POST_NORM": "",
   "OUTPUT_NORM": "norm",
   "OUTPUT": "lm_head"
}
```

<!-- PDF p.25; extraction unit 106 -->

#### 3.1.7 Обновление модели старой версии

<!-- PDF p.25; extraction unit 107 -->

Версия 1.0.2 значительно отличается от 1.1 и более новых версий. Функция rkllm.update_rkllm() обновляет модель 1.0.2 до новой версии без этапов загрузки и построения, описанных выше: достаточно вызвать этот интерфейс напрямую. После обновления параметры, например тип квантования модели, не меняются. Описание функции и параметров:

<!-- PDF p.26; extraction unit 108 -->

Таблица 3-5. Спецификация интерфейса update_rkllm

<!-- PDF p.26; extraction unit 109 -->

| Функция | update_rkllm |
| --- | --- |
| Описание | Обновление модели 1.0.2 до новой версии. |
| Параметры | model: путь к модели RKLLM версии 1.0.2. |
| Возвращаемое значение | 0: обновление успешно;<br>-1: обновление не удалось. |

<!-- PDF p.26; extraction unit 110 -->

Пример кода:

<!-- PDF p.26; extraction unit 111 -->

```text
ret = llm.update_rkllm(model = "./model_1.0.2version.rkllm")
if ret != 0:
   print('Load model failed!')
   exit(ret)
```

<!-- PDF p.26; extraction unit 112 -->

#### 3.1.8 Оценка точности симуляции

<!-- PDF p.26; extraction unit 113 -->

После построения модели через rkllm.build() можно оценить точность симуляции на ПК функцией rkllm.get_logits(). Определения параметров:

<!-- PDF p.26; extraction unit 114 -->

Таблица 3-6. Спецификация интерфейса get_logits

<!-- PDF p.26; extraction unit 115 -->

| Функция | get_logits |
| --- | --- |
| Описание | Оценка точности симуляции на ПК. |
| Параметры | inputs: формат входа симуляции совпадает с инференсом Hugging Face, например {"input_ids": "", "top_k": 1, ...}. |
| Возвращаемое значение | Значения logits, полученные моделью. |

<!-- PDF p.26; extraction unit 116 -->

Пример использования этой функции для проверки PPL (perplexity) на наборе Wikitext:

<!-- PDF p.27; extraction unit 117 -->

```text
def eval_wikitext(llm):
   seqlen = 512
   tokenizer = AutoTokenizer.from_pretrained(
       modelpath,
       trust_remote_code=True
       )
   #Dataset download link:
   #https://huggingface.co/datasets/Salesforce/wikitext/tree/main/wikitext-2-raw-v1
   testenc = load_dataset("parquet", data_files='./wikitext/wikitext-2-raw-1/test-00000-of-00001.parquet', split='train')
   testenc = tokenizer(
       "\n\n".join(testenc['text']),
       return_tensors="pt").input_ids
   nsamples = testenc.numel() // seqlen
   nlls = []
   for i in tqdm(range(nsamples), desc="eval_wikitext: "):
       batch = testenc[:, (i * seqlen): ((i + 1) * seqlen)]
       inputs = {"input_ids": batch}
       lm_logits = llm.get_logits(inputs)
       if lm_logits is None:
          print("get logits failed!")
          return
       shift_logits = lm_logits[:, :-1, :]
       shift_labels = batch[:, 1:].to(lm_logits.device)
       loss_fct = nn.CrossEntropyLoss().to(lm_logits.device)
       loss = loss_fct(shift_logits.view(-1, shift_logits.size(-1)),
shift_labels.view(-1))
       neg_log_likelihood = loss.float() * seqlen
       nlls.append(neg_log_likelihood)
   ppl = torch.exp(torch.stack(nlls).sum() / (nsamples * seqlen))
   print(f'wikitext-2-raw-1-test ppl: {round(ppl.item(), 2)}')
```

<!-- PDF p.27; extraction unit 118 -->

#### 3.1.9 Симуляция инференса модели

<!-- PDF p.27; extraction unit 119 -->

После построения модели через rkllm.build() можно выполнить симуляцию инференса на ПК функцией rkllm.chat_model(). Определения параметров:

<!-- PDF p.27; extraction unit 120 -->

Таблица 3-7. Спецификация интерфейса chat_model

<!-- PDF p.27; extraction unit 121 -->

| Функция | chat_model |
| --- | --- |
| Описание | Симуляция инференса модели на ПК. |
| Параметры | messages: входной текст с соответствующими подсказками.<br>args: параметры инференса, например параметр выборки top_k. |
| Возвращаемое значение | Значения logits, полученные моделью. |

<!-- PDF p.28; extraction unit 122 -->

Пример кода:

<!-- PDF p.28; extraction unit 123 -->

```text
args ={
   "max_length":128,
   "top_k":1,
   "temperature":0.8,
   "do_sample":True,
   "repetition_penalty":1.1
   }

mesg = "Human: How’s the weather today?\nAssistant:"
print(llm.chat_model(mesg, args))
```

<!-- PDF p.28; extraction unit 124 -->

Описанные операции охватывают все этапы преобразования и квантования модели в RKLLM-Toolkit. В зависимости от требований и сценария применения можно выбирать разные настройки и методы квантования для дальнейшего развёртывания.

<!-- PDF p.28; extraction unit 125 -->

### 3.2 Реализация инференса на плате

<!-- PDF p.28; extraction unit 126 -->

В этой главе описаны общие API. На их основе можно написать C++-код инференса RKLLM на плате и получить результаты. Порядок:

1. Определить callback().
2. Определить структуру параметров RKLLMParam.
3. Инициализировать модель через rkllm_init().
4. Выполнить инференс через rkllm_run().
5. Обработать результаты реального времени, возвращённые callback().
6. Уничтожить модель и освободить ресурсы через rkllm_destroy().

Ниже подробно объясняются каждый этап и задействованные функции.

<!-- PDF p.29; extraction unit 127 -->

#### 3.2.1 Определение функции обратного вызова

<!-- PDF p.29; extraction unit 128 -->

Функция обратного вызова принимает выходные данные RKLLM в реальном времени. Она привязывается при инициализации и вызывается в ходе инференса, возвращая каждый раз только один токен. Пример вывода результатов в терминал в реальном времени:

<!-- PDF p.29; extraction unit 129 -->

```text
int callback(RKLLMResult* result, void* userdata, LLMCallState state)
{
   if(state == LLM_RUN_NORMAL){
       printf("%s", result->text);
   }
   if (state == LLM_RUN_FINISH) {
       printf("finish\n");
   } else if (state == LLM_RUN_ERROR){
       printf("\run error\n");
   }
   return 0;
}
```

<!-- PDF p.29; extraction unit 130 -->

1) LLMCallState — флаг состояния. Определение:

<!-- PDF p.29; extraction unit 131 -->

Таблица 3-8. Описание структуры/состояний LLMCallState

<!-- PDF p.29; extraction unit 132 -->

| Определение | LLMCallState |
| --- | --- |
| Описание | Текущее состояние RKLLM. |
| Значения перечисления | LLM_RUN_NORMAL: модель выполняет инференс;<br>LLM_RUN_FINISH: инференс завершён;<br>LLM_RUN_WAITING: текущий декодированный символ не образует полный UTF-8 и должен объединяться со следующим результатом декодирования;<br>LLM_RUN_ERROR: ошибка инференса. |

<!-- PDF p.29; extraction unit 133 -->

При разработке callback можно задать разные действия постобработки для разных состояний LLMCallState.

<!-- PDF p.29; extraction unit 134 -->

2) RKLLMResult — структура возвращаемого результата. Определение:

<!-- PDF p.30; extraction unit 135 -->

Таблица 3-9. Описание структуры/состояний RKLLMResult

<!-- PDF p.30; extraction unit 136 -->

| Определение | RKLLMResult |
| --- | --- |
| Описание | Возвращение результата текущего инференса. |
| Поля структуры | const char* text: текст, сгенерированный текущим инференсом;<br>int32_t token_id: token_id текущего инференса;<br>RKLLMResultLogits logits: данные logits текущего инференса, возвращаются только при RKLLMInferMode=RKLLM_INFER_GET_LOGITS;<br>RKLLMPerfStat perf: статистика производительности в конце инференса, возвращается только в состоянии RKLLM_RUN_FINISH. |

<!-- PDF p.30; extraction unit 137 -->

3) RKLLMResultLogits — структура возвращаемого результата. Определение:

<!-- PDF p.30; extraction unit 138 -->

Таблица 3-9. Описание структуры/состояний RKLLMResultLogitsStructure

<!-- PDF p.30; extraction unit 139 -->

| Определение | RKLLMResultLogits |
| --- | --- |
| Описание | Возвращение logits текущего инференса. |
| Поля структуры | const float* logits: logits текущего инференса;<br>int vocab_size: token_id текущего инференса (формулировка оригинала);<br>int num_tokens: число возвращённых токенов; размер logits вычисляется по vocab_size и num_tokens. |

<!-- PDF p.30; extraction unit 140 -->

При разработке callback можно задать разные действия постобработки в зависимости от значений RKLLMResult.

<!-- PDF p.30; extraction unit 141 -->

#### 3.2.2 Определение RKLLMParam

<!-- PDF p.30; extraction unit 142 -->

Структура RKLLMParam описывает подробные параметры RKLLM. Определение:

<!-- PDF p.31; extraction unit 143 -->

Таблица 3-10. Описание структуры/состояний RKLLMParam

<!-- PDF p.31; extraction unit 144 -->

| Определение | RKLLMParam |
| --- | --- |
| Описание | Подробные параметры модели RKLLM. |
| Поля структуры | const char* model_path: путь к файлу модели RKLLM;<br>int32_t num_npu_core: число ядер NPU при инференсе; RK3576 — [1, 2], RK3588 — [1, 3];<br>bool use_gpu: использовать ли GPU для ускорения Prefill; по умолчанию false;<br>int32_t max_context_len: максимальная длина контекста при инференсе;<br>int32_t max_new_tokens: максимальное число генерируемых токенов;<br>int32_t top_k: выбор следующего токена только из top-k наиболее вероятных. Это уменьшает риск маловероятного или бессмысленного текста. Большое значение (например 100) учитывает больше вариантов и разнообразит текст; малое (например 10) ограничивает выбор наиболее вероятными и делает текст консервативнее. По умолчанию 40;<br>float top_p: nucleus sampling выбирает следующий токен из группы с суммарной вероятностью не менее p. Метод балансирует разнообразие и качество, учитывая вероятности и число выбираемых токенов. Большое p (например 0.95) разнообразит текст; малое (например 0.5) делает его более сфокусированным и консервативным. По умолчанию 0.9;<br>float temperature: регулирует случайность через распределение вероятностей выходных токенов. Высокая температура (например 1.5) делает текст случайнее и креативнее: при выборе следующего токена учитывается больше маловероятных вариантов,<br>что даёт более разнообразные и неожиданные результаты. Низкая температура (например 0.5) делает вывод сфокусированнее: модель чаще выбирает высоковероятные токены, результат становится последовательнее и предсказуемее. При temperature=0 всегда выбирается самый вероятный следующий токен, поэтому вывод каждый раз одинаков. Для баланса случайности и детерминированности — без чрезмерной однообразности или хаотичности — по умолчанию 0.8;<br>float repeat_penalty: контролирует повторение последовательностей токенов и предотвращает повторяющийся или монотонный текст. Большое значение (например 1.5) сильнее штрафует повторы, малое (например 0.9) мягче. По умолчанию 1.1;<br>float frequency_penalty: штраф за повторение слов/фраз, уменьшающий вероятность частых и увеличивающий вероятность редких. Может разнообразить текст, но также ухудшить понятность или соответствие ожиданиям. Диапазон [-2.0, 2.0], по умолчанию 0;<br>int32_t mirostat: алгоритм удержания качества текста в ожидаемом диапазоне. Балансирует связность и разнообразие, избегая чрезмерных повторов (boredom trap) и несвязности (confusion trap). Значения {0, 1, 2}: 0 выключает, 1 включает mirostat, 2 — mirostat 2.0;<br>float mirostat_tau: целевая энтропия mirostat, представляющая ожидаемую perplexity текста. Её настройка балансирует связность и разнообразие: малое значение делает текст концентрированнее и связнее, большое —<br>разнообразнее, но, возможно, менее связным. По умолчанию 5.0;<br>float mirostat_eta: скорость обучения mirostat, влияющая на реакцию на обратную связь о тексте. Низкая замедляет настройку, высокая делает алгоритм чувствительнее. По умолчанию 0.1;<br>bool skip_special_token: пропускать ли специальные токены без вывода, например &lt;EOS&gt;;<br>bool is_async: использовать ли асинхронный режим;<br>const char img_start*: начальный маркер кодирования изображения мультимодального входа; требуется в мультимодальном режиме;<br>const char img_end*: конечный маркер кодирования изображения; требуется в мультимодальном режиме;<br>const char img_content*: маркер содержимого изображения; требуется в мультимодальном режиме;<br>n_keep: число начальных элементов кэша, сохраняемых при очистке KV cache. В многошаговом диалоге n_keep не должен быть меньше длины system_prompt;<br>RKLLMExtendParam extend_param: специальные параметры управления инференсом. |

<!-- PDF p.34; extraction unit 147 -->

Таблица 3-11. Описание структуры/состояний RKLLMExtendParam

<!-- PDF p.34; extraction unit 148 -->

| Определение | RKLLMExtendParam |
| --- | --- |
| Описание | Специальные параметры управления инференсом. |
| Поля структуры | int32_t base_domain_id: домен, с которого начинается инициализация RKLLM; по умолчанию 0.<br>int8_t embed_flash: хранить словарь модели во flash для экономии памяти; 0 выключает, 1 включает.<br>int8_t enabled_cpus_num: число CPU для инференса. RK3588/3576: 1-8; RK3562: 1-4; по умолчанию 4.<br>uint32_t enabled_cpus_mask: двоичная маска выбора конкретных ядер CPU. В rkllm.h заранее определены макросы номеров CPU; пример формата CPU4 &#124; CPU5 &#124; CPU6 &#124; CPU7.<br>uint8_t n_batch: степень параллелизма инференса, по умолчанию 1.<br>int8_t use_cross_attn: включать ли cross-attention. |

<!-- PDF p.34; extraction unit 149 -->

В реальном коде RKLLMParam следует инициализировать функцией rkllm_createDefaultParam(), затем задать параметры модели по требованиям. Пример:

<!-- PDF p.34; extraction unit 150 -->

```text
RKLLMParam param = rkllm_createDefaultParam();
param.model_path = "model.rkllm";
param.top_k = 1;
param.max_new_tokens = 256;
param.max_context_len = 512;
```

<!-- PDF p.34; extraction unit 151 -->

#### 3.2.3 Определение входной структуры

<!-- PDF p.34; extraction unit 152 -->

Структура RKLLMInput поддерживает четыре типа входных данных: текст, изображение с текстом, идентификаторы токенов и закодированные векторы. Определение:

<!-- PDF p.35; extraction unit 153 -->

Таблица 3-12. Описание структуры/состояний RKLLMInput

<!-- PDF p.35; extraction unit 154 -->

| Определение | RKLLMInput |
| --- | --- |
| Описание | Приём входных данных разных форм. |
| Поля структуры | RKLLMInputType input_type: режим входа;<br>const char* role: тип входа, варианты ["user", "tool"];<br>bool enable_thinking: включать ли режим thinking Qwen3;<br>union: хранение разных типов входа:<br>const char prompt_input*: текстовая подсказка на естественном языке;<br>RKLLMEmbedInput embed_input: вектор embedding, представляющий обработанные признаки;<br>RKLLMTokenInput token_input: последовательность идентификаторов после токенизации;<br>RKLLMMultiModalInput multimodal_input: мультимодальные данные, например изображения с текстом. |

<!-- PDF p.35; extraction unit 155 -->

Таблица 3-13. Описание структуры/состояний RKLLMInputType

<!-- PDF p.35; extraction unit 156 -->

| Определение | RKLLMInputType |
| --- | --- |
| Описание | Тип входных данных. |
| Значения перечисления | RKLLM_INPUT_PROMPT: обычный текст;<br>RKLLM_INPUT_TOKEN: идентификаторы токенов;<br>RKLLM_INPUT_EMBED: закодированные векторы;<br>RKLLM_INPUT_MULTIMODAL: изображения с текстом. |

<!-- PDF p.36; extraction unit 157 -->

Обычный текст можно передавать напрямую через input_data. Для идентификаторов токенов, закодированных векторов или изображений с текстом RKLLMInput используется вместе с RKLLMTokenInput, RKLLMEmbedInput и RKLLMMultiModalInput. Подробности:

<!-- PDF p.36; extraction unit 158 -->

1) RKLLMTokenInput — входная структура идентификаторов токенов. Определение:

<!-- PDF p.36; extraction unit 159 -->

Таблица 3-14. Описание структуры/состояний RKLLMTokenInput

<!-- PDF p.36; extraction unit 160 -->

| Определение | RKLLMTokenInput |
| --- | --- |
| Описание | Приём данных token_id. |
| Поля структуры | int32_t input_ids*: указатель памяти входных идентификаторов токенов.<br>size_t n_tokens: число входных токенов. |

<!-- PDF p.36; extraction unit 161 -->

2) RKLLMEmbedInput — входная структура закодированных векторов. Определение:

<!-- PDF p.36; extraction unit 162 -->

Таблица 3-15. Описание структуры/состояний RKLLMEmbedInput

<!-- PDF p.36; extraction unit 163 -->

| Определение | RKLLMEmbedInput |
| --- | --- |
| Описание | Приём данных embedding. |
| Поля структуры | float embed*: указатель памяти входных embedding токенов.<br>size_t n_tokens: число входных токенов. |

<!-- PDF p.36; extraction unit 164 -->

3) RKLLMMultiModalInput — входная структура изображений с текстом. Определение:

<!-- PDF p.37; extraction unit 165 -->

Таблица 3-16. Описание структуры/состояний RKLLMMultiModalInput

<!-- PDF p.37; extraction unit 166 -->

| Определение | RKLLMMultiModalInput |
| --- | --- |
| Описание | Приём изображений и текста. |
| Поля структуры | char prompt*: указатель памяти входного текста.<br>float image_embed*: указатель памяти embedding входных изображений.<br>size_t n_image_tokens: число токенов embedding изображений.<br>size_t n_image: число входных изображений; поддерживаются несколько последовательных кадров.<br>size_t image_width: ширина изображения, используемая при вычислении embedding и параметров mrope.<br>size_t image_height: высота изображения, используемая при вычислении embedding и параметров mrope. |

<!-- PDF p.37; extraction unit 167 -->

RKLLM поддерживает разные режимы инференса через RKLLMInferParam. Во время инференса можно совместно использовать заранее загруженные модели LoRA либо сохранить Prompt Cache для ускорения последующих вызовов. Определение:

<!-- PDF p.38; extraction unit 168 -->

Таблица 3-17. Описание структуры/состояний RKLLMInferParam

<!-- PDF p.38; extraction unit 169 -->

| Определение | RKLLMInferParam |
| --- | --- |
| Описание | Различные режимы инференса. |
| Поля структуры | RKLLMInferMode mode: режим инференса; RKLLM_INFER_GENERATE — обычный режим, RKLLM_INFER_GET_LOGITS — режим с дополнительным получением logits.<br>RKLLMLoraParam lora_params*: настройки LoRA при инференсе, позволяющие выбрать нужную модель из нескольких загруженных; NULL, если LoRA не требуется.<br>RKLLMPromptCacheParam prompt_cache_params*: параметры Prompt Cache при инференсе; NULL, если генерация Prompt Cache не требуется.<br>keep_history: сохранять ли исторический контекст; для многошагового диалога задайте 1. |

<!-- PDF p.38; extraction unit 170 -->

Таблица 3-18. Описание структуры/состояний RKLLMLoraParam

<!-- PDF p.38; extraction unit 171 -->

| Определение | RKLLMLoraParam |
| --- | --- |
| Описание | Параметры использования LoRA при инференсе. |
| Поля структуры | const char lora_adapter_name*: имя LoRA, используемой при инференсе. |

<!-- PDF p.38; extraction unit 172 -->

Таблица 3-19. Описание структуры/состояний RKLLMPromptCacheParam

<!-- PDF p.38; extraction unit 173 -->

| Определение | RKLLMPromptCacheParam |
| --- | --- |
| Описание | Параметры использования Prompt Cache при инференсе. |
| Поля структуры | int save_prompt_cache: сохранять ли Prompt Cache при инференсе; 1 — да, 0 — нет.<br>const char prompt_cache_path*: путь сохранения Prompt Cache; если не задан, "./prompt_cache.bin”. |

<!-- PDF p.39; extraction unit 174 -->

Пример инференса с RKLLMPromptCacheParam:

<!-- PDF p.39; extraction unit 175 -->

```text
// Initialize and Set Prompt Cache Parameters(if needed)
RKLLMPromptCacheParam prompt_cache_params;
// Enable saving Prompt Cache
prompt_cache_params.save_prompt_cache = true;
// Specify cache file path
prompt_cache_params.prompt_cache_path = "./prompt_cache.bin";
rkllm_infer_params.prompt_cache_params = &prompt_cache_params;
```

<!-- PDF p.39; extraction unit 176 -->

#### 3.2.4 Инициализация модели

<!-- PDF p.39; extraction unit 177 -->

Перед инициализацией заранее определите дескриптор LLMHandle. Он используется при инициализации, инференсе и освобождении ресурсов модели; один и тот же объект LLMHandle должен применяться во всех трёх процессах, иначе корректное выполнение инференса не обеспечивается. Перед инференсом завершите инициализацию модели функцией rkllm_init(). Определение:

<!-- PDF p.39; extraction unit 178 -->

Таблица 3-20. Спецификация интерфейса rkllm_init

<!-- PDF p.39; extraction unit 179 -->

| Функция | rkllm_init |
| --- | --- |
| Описание | Инициализация параметров модели и настроек инференса RKLLM. |
| Параметры | LLMHandle* handle: регистрация модели в дескрипторе для последующих вызовов инференса и освобождения;<br>RKLLMParam* param: определённая для модели структура параметров;<br>LLMResultCallback callback: callback для приёма и обработки результатов модели в реальном времени. |
| Возвращаемое значение | 0: нормальная инициализация;<br>-1: ошибка инициализации. |

<!-- PDF p.39; extraction unit 180 -->

Пример кода:

<!-- PDF p.39; extraction unit 181 -->

```text
LLMHandle llmHandle = nullptr;
rkllm_init(&llmHandle, &param, callback);
```

<!-- PDF p.40; extraction unit 182 -->

#### 3.2.5 Инференс модели

<!-- PDF p.40; extraction unit 183 -->

После инициализации модели выполните инференс через rkllm_run(). Результаты реального времени обрабатываются callback, определённым при инициализации. Определение rkllm_run():

<!-- PDF p.40; extraction unit 184 -->

Таблица 3-21. Спецификация интерфейса rkllm_run

<!-- PDF p.40; extraction unit 185 -->

| Функция | rkllm_run |
| --- | --- |
| Описание | Выполнение инференса инициализированной моделью RKLLM. |
| Параметры | LLMHandle handle: дескриптор, зарегистрированный при инициализации.<br>RKLLMInput rkllm_input*: входные данные; см. определение входной структуры в §3.2.3.<br>RKLLMInferParam rkllm_infer_params*: параметры инференса; см. §3.2.3.<br>void* userdata: указатель пользовательской функции, обычно NULL по умолчанию. |
| Возвращаемое значение | 0: инференс выполняется нормально;<br>-1: ошибка вызова инференса. |

<!-- PDF p.40; extraction unit 186 -->

#### 3.2.6 Прерывание инференса модели

<!-- PDF p.40; extraction unit 187 -->

Во время инференса вызов rkllm_abort() прерывает его выполнение. Определение:

<!-- PDF p.40; extraction unit 188 -->

Таблица 3-22. Спецификация интерфейса rkllm_abort

<!-- PDF p.40; extraction unit 189 -->

| Функция | rkllm_ abort |
| --- | --- |
| Описание | Прерывание инференса RKLLM. |
| Параметры | LLMHandle handle: дескриптор, зарегистрированный при инициализации. |
| Возвращаемое значение | 0: прерывание успешно;<br>-1: не удалось прервать модель. |

<!-- PDF p.41; extraction unit 190 -->

#### 3.2.7 Освобождение модели

<!-- PDF p.41; extraction unit 191 -->

После завершения всех вызовов инференса вызовите rkllm_destroy(), чтобы уничтожить модель RKLLM и освободить выделенные вычислительные ресурсы CPU, GPU и NPU для других процессов или моделей. Определение:

<!-- PDF p.41; extraction unit 192 -->

Таблица 3-23. Спецификация интерфейса rkllm_destroy

<!-- PDF p.41; extraction unit 193 -->

| Функция | rkllm_ destroy |
| --- | --- |
| Описание | Уничтожение RKLLM-модели и освобождение всех вычислительных ресурсов. |
| Параметры | LLMHandle handle: дескриптор, зарегистрированный при инициализации. |
| Возвращаемое значение | 0: модель успешно уничтожена и освобождена;<br>-1: ошибка освобождения. |

<!-- PDF p.41; extraction unit 194 -->

Пример кода:

<!-- PDF p.41; extraction unit 195 -->

```text
// llmHandle is the the target handle registered
rkllm_destroy(llmHandle);
```

<!-- PDF p.41; extraction unit 196 -->

#### 3.2.8 Загрузка модели LoRA

<!-- PDF p.41; extraction unit 197 -->

RKLLM поддерживает совместную работу моделей LoRA с базовой моделью во время инференса. До вызова rkllm_run можно загрузить LoRA через rkllm_load_lora. Допускается несколько моделей LoRA; каждый вызов rkllm_load_lora загружает одну модель. Определение:

<!-- PDF p.41; extraction unit 198 -->

Таблица 3-24. Спецификация интерфейса rkllm_load_lora

<!-- PDF p.41; extraction unit 199 -->

| Функция | rkllm_load_lora |
| --- | --- |
| Описание | Загрузка модели LoRA для базовой модели. |
| Параметры | LLMHandle handle: дескриптор, зарегистрированный при инициализации; см. §3.2.4.<br>RKLLMLoraAdapter lora_adapter*: параметры загрузки LoRA. |
| Возвращаемое значение | 0: LoRA-модель загружена;<br>-1: ошибка загрузки. |

<!-- PDF p.42; extraction unit 200 -->

Таблица 3-25. Описание структуры/состояний RKLLMLoraAdapter

<!-- PDF p.42; extraction unit 201 -->

| Определение | RKLLMLoraAdapter |
| --- | --- |
| Описание | Параметры загрузки модели LoRA. |
| Поля структуры | const char* lora_adapter_path: путь к загружаемой LoRA.<br>const char* lora_adapter_name: пользовательское имя LoRA для её выбора при инференсе.<br>float scale: степень изменения параметров базовой модели моделью LoRA при инференсе. |

<!-- PDF p.42; extraction unit 202 -->

Пример загрузки LoRA:

<!-- PDF p.42; extraction unit 203 -->

```text
RKLLMLoraAdapter lora_adapter;
memset(&lora_adapter, 0, sizeof(RKLLMLoraAdapter));
lora_adapter.lora_adapter_path = "lora.rkllm";
lora_adapter.lora_adapter_name = "lora_name";
lora_adapter.scale = 1.0;
ret = rkllm_load_lora(llmHandle, &lora_adapter);
if (ret != 0) {
   printf("\nload lora failed\n");
}
```

<!-- PDF p.42; extraction unit 204 -->

#### 3.2.9 Загрузка Prompt Cache

<!-- PDF p.42; extraction unit 205 -->

Во время инференса этап Prefill обычно требует много вычислений и времени, особенно при длинном Prompt. RKLLM позволяет загружать Prompt Cache из файлов, повторно используя кэш и сокращая Prefill. Перед вызовом rkllm_run правильно настройте prompt_cache_params, чтобы после инференса модель создала соответствующий файл Prompt Cache. При первом выполнении система автоматически создаёт такой файл с промежуточными результатами Prefill, пригодными для последующих задач. В следующих вызовах ранее созданный файл загружается через rkllm_load_prompt_cache. Определения функций:

<!-- PDF p.43; extraction unit 206 -->

Таблица 3-26. Спецификация интерфейса rkllm_load_prompt_cache

<!-- PDF p.43; extraction unit 207 -->

| Функция | rkllm_load_prompt_cache |
| --- | --- |
| Описание | Загрузка файла Prompt Cache. |
| Параметры | LLMHandle handle: дескриптор, зарегистрированный при инициализации; см. §3.2.4.<br>const char* prompt_cache_path: путь к загружаемому Prompt Cache. |
| Возвращаемое значение | 0: файл Prompt Cache загружен;<br>-1: ошибка загрузки. |

<!-- PDF p.43; extraction unit 208 -->

Таблица 3-27. Спецификация интерфейса rkllm_release_prompt_cache

<!-- PDF p.43; extraction unit 209 -->

| Функция | rkllm_release_prompt_cache |
| --- | --- |
| Описание | Освобождение Prompt Cache. |
| Параметры | LLMHandle handle: дескриптор, зарегистрированный при инициализации; см. §3.2.4. |
| Возвращаемое значение | 0: модель Prompt Cache освобождена;<br>-1: ошибка освобождения модели. |

<!-- PDF p.43; extraction unit 210 -->

Примечание: RKLLM определяет совпадающую с prompt_cache начальную часть входа. При фиксированном формате PROMPT_PREFIX + text + PROMPT_POSTFIX можно создать Prompt Cache только для PROMPT_PREFIX и после загрузки повторно использовать его результат. RKLLM поддерживает несколько файлов Prompt Cache: при необходимости загружайте соответствующий файл. При переключении на другой Prompt Cache или отказе от текущего явно вызовите rkllm_release_prompt_cache для освобождения.

<!-- PDF p.44; extraction unit 211 -->

Пример загрузки Prompt Cache:

<!-- PDF p.44; extraction unit 212 -->

```text
// Initialize and set the Prompt Cache parameters, then call the run interface to generate the Prompt Cache file.

RKLLMPromptCacheParam prompt_cache_params;
// Whether to save the prompt cache
prompt_cache_params.save_prompt_cache = true;
// If you need to save the prompt cache, specify the absolute path of the cache file.
prompt_cache_params.prompt_cache_path = "/data/prompt_cache.bin";
rkllm_infer_params.prompt_cache_params = &prompt_cache_params;
rkllm_infer_params.mode = RKLLM_INFER_GENERATE;
rkllm_input.input_type = RKLLM_INPUT_PROMPT;
rkllm_input.prompt_input = (char *)prompt.c_str();
rkllm_run(llmHandle, &rkllm_input, &rkllm_infer_params, NULL);
// Load the prompt cache file to reduce prefill time.
rkllm_load_prompt_cache(llmHandle, "./prompt_cache.bin");
if (ret != 0) {
   printf("\nload Prompt Cache failed\n");
}
rkllm_run(llmHandle, &rkllm_input, &rkllm_infer_params, NULL);
```

<!-- PDF p.44; extraction unit 213 -->

#### 3.2.10 Управление KV Cache

<!-- PDF p.44; extraction unit 214 -->

RKLLM позволяет вручную очищать KV cache как для одношагового, так и многошагового диалога. При keep_system_prompt=1 системная подсказка, если она есть, сохраняется; иначе очищается весь кэш. Определение:

<!-- PDF p.45; extraction unit 215 -->

Таблица 3-28. Спецификация интерфейса rkllm_clear_kv_cache

<!-- PDF p.45; extraction unit 216 -->

| Функция | rkllm_clear_kv_cache |
| --- | --- |
| Описание | Очистка KV cache. |
| Параметры | LLMHandle handle: дескриптор, зарегистрированный при инициализации; см. §3.2.4.<br>keep_system_prompt: сохранять ли system prompt (1 сохранить, 0 удалить).<br>start_pos: начальный ID удаляемого KV cache, включительно; если не используется, вручную задайте nullptr.<br>end_pos: конечный ID, не включается; если не используется, вручную задайте nullptr.<br>Примечание: удаление KV cache по заданным позициям поддерживается только при приостановке инференса в одношаговом режиме. При заданном диапазоне [start_pos, end_pos) keep_system_prompt игнорируется и удаляется кэш этого диапазона. |
| Возвращаемое значение | 0: KV cache очищен;<br>-1: ошибка очистки. |

<!-- PDF p.45; extraction unit 217 -->

#### 3.2.11 Настройка шаблона диалога

<!-- PDF p.45; extraction unit 218 -->

Перед обработкой входного текста RKLLM автоматически разбирает и применяет шаблон из поля chat_template файла tokenizer_config.json модели HuggingFace. Для пользовательской настройки шаблон можно сбросить функцией ниже. system_prompt задаёт системную подсказку и поведение модели, prompt_prefix добавляется перед пользовательским вводом, prompt_postfix — после него. После сброса шаблона enable_thinking больше не действует: эту настройку нужно реализовать в своём Prompt. Определение:

<!-- PDF p.46; extraction unit 219 -->

Таблица 3-29. Спецификация интерфейса rkllm_set_chat_template

<!-- PDF p.46; extraction unit 220 -->

| Функция | rkllm_set_chat_template |
| --- | --- |
| Описание | Настройка шаблона Prompt. |
| Параметры | LLMHandle handle: дескриптор, зарегистрированный при инициализации; см. §3.2.4.<br>system_prompt: системная подсказка, направляющая поведение модели.<br>prompt_prefix: префикс перед вводом пользователя.<br>prompt_postfix: суффикс после ввода пользователя. |
| Возвращаемое значение | 0: шаблон диалога настроен;<br>-1: ошибка настройки шаблона. |

<!-- PDF p.46; extraction unit 221 -->

#### 3.2.12 Настройка Function Calling

<!-- PDF p.46; extraction unit 222 -->

RKLLM поддерживает структурированное взаимодействие модели с внешними системами через Function Calling. Это расширяет возможности LLM, в том числе дополнение знаний и точное получение данных. В этом режиме приложение передаёт определения функций модели; на основе запроса пользователя модель определяет необходимость вызова и выдаёт запрос в заданном формате. Приложение вызывает нужную функцию, возвращает результат, после чего модель продолжает диалог с учётом результата. Функция настройки Function Calling:

<!-- PDF p.47; extraction unit 223 -->

Таблица 3-30. Спецификация интерфейса rkllm_set_chat_template

<!-- PDF p.47; extraction unit 224 -->

| Функция | rkllm_set_function_tools |
| --- | --- |
| Описание | Настройка Function Calling, включая системную подсказку, определения инструментов и идентификатор ответа инструмента. |
| Параметры | LLMHandle handle: дескриптор, зарегистрированный при инициализации; см. §3.2.4.<br>system_prompt: системная подсказка для поведения модели.<br>tools: строка определений функций в JSON, описывающая доступные функции, их имена, назначение и форматы параметров.<br>tool_response_str: метка результатов вызовов инструментальных функций, отличающая их от обычного содержимого диалога. |
| Возвращаемое значение | 0: настройка успешна;<br>-1: ошибка настройки. |

<!-- PDF p.47; extraction unit 225 -->

Пример: сначала настройте инструменты.

```text
std::string system_prompt = "You are Qwen, created by Alibaba Cloud. You are a helpful assistant.\n\nCurrent Date: 2024-09-30";
std::string tools = R"([
   {
       "type": "function",
       "function": {
          "name": "get_current_temperature",
          "description": "Get current temperature at a location.",
          "parameters": {
             "type": "object",
             "properties": {
                 "location": {
                    "type": "string",
                    "description": "The location to get the temperature for, in the format \"City, State, Country\"."
                 },
                 "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "The unit to return the temperature in. Defaults to \"celsius\"."
                 }
             },
             "required": ["location"]
          }
       }
   },
   {
       "type": "function",
       "function": {
          "name": "get_temperature_date",
          "description": "Get temperature at a location and date.",
          "parameters": {
             "type": "object",
             "properties": {
                 "location": {
                    "type": "string",
                    "description": "The location to get the temperature for, in the format \"City, State, Country\"."
                 },
                 "date": {
                    "type": "string",
                    "description": "The date to get the temperature for, in the format \"Year-Month-Day\"."
                 },
                 "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "The unit to return the temperature in. Defaults to \"celsius\"."
                 }
             },
             "required": ["location", "date"]
          }
       }
   }
])";

rkllm_set_function_tools(llmHandle, system_prompt.c_str(),
tools.c_str(), "tool_response");
```

<!-- PDF p.48; extraction unit 227 -->

Затем свяжите эту настройку с rkllm_run для реализации цепочки вызовов функций:

<!-- PDF p.49; extraction unit 228 -->

```text
// User's question
RKLLMInferParam rkllm_infer_params;
memset(&rkllm_infer_params, 0, sizeof(RKLLMInferParam));
rkllm_infer_params.mode = RKLLM_INFER_GENERATE;
rkllm_infer_params.keep_history = 0;

RKLLMInput rkllm_input;
rkllm_input.input_type = RKLLM_INPUT_PROMPT;
rkllm_input.enable_thinking = false;

rkllm_input.role = "user";
rkllm_input.prompt_input = "What's the temperature in San Francisco now? How about tomorrow?";

rkllm_run(llmHandle, &rkllm_input, &rkllm_infer_params, NULL);

// the first call to rkllm_run will return the name of the tool function that needs to be called;

<tool_call>
{"name": "get_current_temperature", "arguments": {"location": "San Francisco"}}
</tool_call>
<tool_call>
{"name": "get_temperature_date", "arguments": {"location": "San Francisco", "date": "2024-10-01"}}
</tool_call>

// return the tool call result to llm, and the role must be set to "tool"

rkllm_input.role = "tool";
rkllm_input.prompt_input = R"([
   {
       "temperature": 26.1,
       "location": "San Francisco",
       "unit": "celsius"
   },
   {
       "temperature": 25.9,
       "location": "San Francisco",
       "date": "2024-09-30",
       "unit": "celsius"
   }
])";

rkllm_run(llmHandle, &rkllm_input, &rkllm_infer_params, NULL);

// final result
"The current temperature in San Francisco is 26.1°C. Tomorrow, the temperature is expected to be 25.9°C."
```

<!-- PDF p.50; extraction unit 229 -->

#### 3.2.13 Настройка перекрёстного внимания

<!-- PDF p.50; extraction unit 230 -->

RKLLM поддерживает cross-attention: созданные энкодером K/V cache, маску и позиционную информацию можно передать декодеру следующей функцией. Cross-attention поддерживается только при инференсе пользовательских моделей; преобразование модели описано в §3.1.6.

<!-- PDF p.50; extraction unit 231 -->

Таблица 3-31. Спецификация интерфейса rkllm_set_cross_attn_params

<!-- PDF p.50; extraction unit 232 -->

| Функция | rkllm_set_cross_attn_params |
| --- | --- |
| Описание | Настройка параметров cross-attention. |
| Параметры | LLMHandle handle: дескриптор, зарегистрированный при инициализации; см. §3.2.4.<br>RKLLMCrossAttnParam* cross_attn_params: параметры cross-attention. |
| Возвращаемое значение | 0: настройка успешна;<br>-1: ошибка настройки. |

<!-- PDF p.50; extraction unit 233 -->

Таблица 3-32. Описание структуры/состояний RKLLMCrossAttnParam

<!-- PDF p.50; extraction unit 234 -->

| Функция | RKLLMCrossAttnParam |
| --- | --- |
| Описание | Параметры cross-attention. |
| Поля структуры | - float* encoder_k_cache: указатель выходного кэша ключей энкодера<br>- float* encoder_v_cache: указатель выходного кэша значений энкодера<br>- float* encoder mask: маска внимания энкодера<br>- int32_t* encoder_pos: позиционная информация входных токенов энкодера<br>- int* num_tokens: число входных токенов энкодера |

<!-- PDF p.51; extraction unit 235 -->

#### 3.2.14 Параллельный инференс нескольких пакетов

<!-- PDF p.51; extraction unit 236 -->

RKLLM поддерживает одновременный инференс нескольких пакетов; рекомендуется не более 8. Ниже приведён пример для двух пакетов:

<!-- PDF p.51; extraction unit 237 -->

- При инициализации модели param.extend_param.n_batch должен быть равен 2.
- При многопакетном инференсе RKLLMInput и RKLLMResult в callback — массивы размером n_batch.
- Результаты всех пакетов возвращаются синхронно в callback. Отрицательный идентификатор токена пакета означает завершение его инференса. Общее выполнение заканчивается только после завершения всех пакетов.
- При обработке текста в callback перед присваиванием проверяйте указатель на null.

<!-- PDF p.52; extraction unit 238 -->

```text
#include <string.h>
#include <unistd.h>
#include <string>
#include "rkllm.h"
#include <fstream>
#include <iostream>
#include <csignal>
#include <vector>

using namespace std;
LLMHandle llmHandle = nullptr;

std::string output_texts[10];

int callback(RKLLMResult *result, void *userdata, LLMCallState state)
{
   if (state == RKLLM_RUN_FINISH)
   {
       printf("\nrkllm run finish\n");
   } else if (state == RKLLM_RUN_ERROR) {
       printf("\nrkllm run error\n");
   } else if (state == RKLLM_RUN_NORMAL) {
       RKLLMResult batch1 = result[0];
       RKLLMResult batch2 = result[1];
       if (batch1.text) {
          output_texts[0] += batch1.text;
          printf("batch 0 %s\n", output_texts[0].c_str());
       }
       if (batch2.text) {
          output_texts[1] += batch2.text;;
          printf("batch 1 %s\n", output_texts[1].c_str());
       }
   }
   return 0;
}

int main(int argc, char **argv)
{
   if (argc < 4) {
       std::cerr << "Usage: " << argv[0] << " model_path max_new_tokens max_context_len\n";
       return 1;
   }

   RKLLMParam param = rkllm_createDefaultParam();
   param.model_path = argv[1];
   param.top_k = 1;
   param.top_p = 0.95;
   param.temperature = 0.8;
   param.repeat_penalty = 1.1;
   param.frequency_penalty = 0.0;
   param.presence_penalty = 0.0;
   param.max_new_tokens = std::atoi(argv[2]);
   param.max_context_len = std::atoi(argv[3]);
   param.skip_special_token = true;
   param.extend_param.base_domain_id = 0;
   param.extend_param.embed_flash = 1;
   param.extend_param.n_batch = 2;
   int ret = rkllm_init(&llmHandle, &param, callback);
   if (ret == 0){
       printf("rkllm init success\n");
   } else {
       printf("rkllm init failed\n");
       exit_handler(-1);
   }

   RKLLMInput rkllm_input[2];
   memset(&rkllm_input, 0, sizeof(RKLLMInput)*2);
   RKLLMInferParam rkllm_infer_params;
   memset(&rkllm_infer_params, 0, sizeof(RKLLMInferParam));
   output_texts[0].clear();
   output_texts[1].clear();

   rkllm_infer_params.mode = RKLLM_INFER_GENERATE;
   rkllm_infer_params.keep_history = 0;

   rkllm_input[0].input_type = RKLLM_INPUT_PROMPT;
   rkllm_input[0].role = "user";
   rkllm_input[0].enable_thinking = false;
   rkllm_input[0].prompt_input = "上联: 江边惯看千帆过";

   rkllm_input[1].input_type = RKLLM_INPUT_PROMPT;
   rkllm_input[1].role = "user";
   rkllm_input[1].enable_thinking = false;
   rkllm_input[1].prompt_input = "以咏梅为题目，帮我写一首古诗，要求包含梅花、白雪等元素。";

   printf("robot: ");
   rkllm_run(llmHandle, &rkllm_input[0], &rkllm_infer_params, NULL);

   rkllm_destroy(llmHandle);
   return 0;
}
```

<!-- PDF p.53; extraction unit 240 -->

#### 3.2.15 Приостановка инференса модели

<!-- PDF p.53; extraction unit 241 -->

RKLLM позволяет приостановить одношаговый инференс, вернув 1 из callback. KV cache при этом не очищается: можно изменить входные данные и снова вызвать rkllm_run для продолжения.

<!-- PDF p.53; extraction unit 242 -->

#### 3.2.16 Обратный вызов с данными производительности модели

<!-- PDF p.53; extraction unit 243 -->

По завершении одного инференса RKLLM может вернуть данные производительности: общее время Prefill и декодирования, число токенов и расход памяти. Структура возвращаемых данных:

<!-- PDF p.54; extraction unit 244 -->

Таблица 3-33. Описание структуры/состояний RKLLMPerStat

<!-- PDF p.54; extraction unit 245 -->

| Определение | RKLLMPerfStat |
| --- | --- |
| Описание | Возвращение данных производительности инференса модели. |
| Поля структуры | - float prefill_time_ms: суммарное время Prefill, миллисекунды<br>- int prefill_tokens: общее число токенов Prefill<br>- float generate_time_ms: суммарное время генерации, миллисекунды<br>- int generate_tokens: общее число токенов генерации<br>- float memory_usage_mb: расход памяти при инференсе, измеренный через VmHWM, мегабайты |

<!-- PDF p.54; extraction unit 246 -->

### 3.3 Пример инференса на плате

<!-- PDF p.54; extraction unit 247 -->

Каталог examples/rkllm_api_demo содержит C++-проект инференса на плате, обновляемый вместе с этим документом. Скрипты компиляции упрощают сборку проекта и выполнение RKLLM на плате.

<!-- PDF p.54; extraction unit 248 -->

#### 3.3.1 Полный код примера проекта

<!-- PDF p.54; extraction unit 249 -->

Полный пример C++ находится в example/rkllm_api_demo/deploy/src инструментария. llm_demo.cpp показывает весь процесс инференса LLM: инициализацию, выполнение, обработку вывода через callback и освобождение ресурсов. Используйте соответствующий код как основу пользовательских функций.

<!-- PDF p.54; extraction unit 250 -->

#### 3.3.2 Использование примера проекта

<!-- PDF p.54; extraction unit 251 -->

В examples/rkllm_api_demo/deploy находятся примеры вызова инференса и скрипты build-android.sh, build-linux.sh. Ниже описано использование примера на основе компиляции

<!-- PDF p.55; extraction unit 252 -->

исполняемых файлов Linux скриптом build-linux.sh. Сначала подготовьте кросс-компилятор: по §2.3 рекомендуется версия 10.2 или выше. Перед компиляцией самостоятельно замените путь к кросс-компилятору в build-linux.sh:

<!-- PDF p.55; extraction unit 253 -->

```text
# Set the path of the cross-compiler GCC_COMPILER_PATH=~/gcc-arm-10.2-2020.11-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu
```

<!-- PDF p.55; extraction unit 254 -->

Затем запустите компиляцию через build-linux.sh. Полученная программа llm_demo устанавливается в install/demo_linux_aarch64/llm_demo. После этого перенесите исполняемый файл, каталог библиотек и предварительно преобразованную и квантованную через RKLLM-Toolkit модель на плату.

<!-- PDF p.55; extraction unit 255 -->

```text
adb push install/demo_Linux_aarch64  /data
adb push /PC/path/to/your/rkllm/model /data/demo_Linux_aarch64
```

<!-- PDF p.55; extraction unit 256 -->

После этих шагов войдите в терминал платы через adb, перейдите в /data/demo_linux_aarch64 и вызовите инференс следующей командой:

<!-- PDF p.55; extraction unit 257 -->

```text
adb shell
cd /data/demo_linux_aarch64
export LD_LIBRARY_PATH=./lib
./llm_demo /path/to/your/rkllm/model 1024 2048
```

<!-- PDF p.55; extraction unit 258 -->

Эти операции открывают интерфейс примера инференса, где можно взаимодействовать с моделью на плате и получать результаты RKLLM в реальном времени.

<!-- PDF p.55; extraction unit 259 -->

#### 3.3.3 Контроль производительности инференса и просмотр журналов

<!-- PDF p.55; extraction unit 260 -->

Для просмотра производительности или журналов RKLLM во время инференса на плате используются следующие команды:

<!-- PDF p.55; extraction unit 261 -->

```text
# View only TTFT, TPS, and memory usage data
export RKLLM_LOG_LEVEL=1
# In addition to performance data, also prints cache length and more details
export RKLLM_LOG_LEVEL=2
```

<!-- PDF p.56; extraction unit 262 -->

![Техническая иллюстрация оригинала RKLLM — PDF p.56](/docs/rockchip-rkllm-sdk/assets/en-p056-figure-02.png)

Копируемая расшифровка исходного журнала (не измерение ArmSoM; скрытая учётная запись не восстановлена):

```text
Model initialization: 834.82 ms
Stage       Total Time (ms)  Tokens  Time per Token (ms)  Tokens per Second
Prefill     306.31           13      23.56                42.44
Generate    1918.31          9       213.15               4.69
Peak Memory Usage (GB): 0.52
```

<!-- PDF p.56; extraction unit 263 -->

Рисунок 3-1. Журнал производительности RKLLM на аппаратной платформе

<!-- PDF p.56; extraction unit 264 -->

### 3.4 Реализация сервера на плате

<!-- PDF p.56; extraction unit 265 -->

После преобразования модели через RKLLM-Toolkit можно развернуть сервер на плате Linux и предоставить сетевые интерфейсы пользователям локальной сети. Другие пользователи получают доступ к RKLLM по заданному адресу для простого и эффективного взаимодействия. В этом разделе описаны две реализации сервера.

<!-- PDF p.56; extraction unit 266 -->

1) RLM-Server-Flask на Flask: клиент и сервер взаимодействуют через API с HTTP-запросами. Пример RKLLM-Server-Flask включает обычный диалог и одношаговый диалог с Function Calling.

<!-- PDF p.56; extraction unit 267 -->

2) RKLLM-Server-Gradio на Gradio: пример позволяет быстро создать веб-сервер с визуальным взаимодействием и показывает Gradio API для дальнейшей разработки. Оба варианта находятся в examples/rkllm_server_demo. Каталог содержит код реализаций, скрипты развёртывания одной командой и примеры API-вызовов. Выберите нужный пример для изучения и расширения. Структура каталогов:

<!-- PDF p.57; extraction unit 268 -->

```text
examples/rkllm_server_demo
├──rkllm_server          # Board-side Deployment Required Files
│   └── lib                    # RKLLM Runtime
│   └── flask_server.py            # RKLLM-Server-Flask Example
│   └── gradio_server.py           # RKLLM-Server-Gradio Example
├──build_rkllm_server_flask.sh # One-click Deployment Script -Flask
├──build_rkllm_server_gradio.sh# One-click Deployment Script -Gradio
├──chat_api_flask.py           # API Interface Example -Flask
├──chat_api_gradio.py          # API Interface Example -Gradio
└──Readme.md
```

<!-- PDF p.57; extraction unit 269 -->

#### 3.4.1 Пример развёртывания RKLLM-Server-Flask

<!-- PDF p.57; extraction unit 270 -->

В примере RKLLM-Server-Flask сервер создаётся на Flask. Клиент использует структуру запрос–ответ для API-доступа, передавая серверу определённые структуры данных. Основное содержимое:

<!-- PDF p.57; extraction unit 271 -->

```text
{
   "model": "No models available",
   "messages": [
     {"role": "system",
       "content": "You are a helpful assistant."
     },
     {
       "role": "user",
       "content": "Hello!"
     }
   ],
   "stream": false,
   "enable_thinking": False,
   "tools": None

}
```

<!-- PDF p.57; extraction unit 272 -->

Поля "model" и "stream" задают вызываемую модель и включение потоковой передачи инференса; "content" внутри "messages" содержит пользовательский ввод. "enable_thinking" задаёт глубокое рассуждение при ответе и настраивается с учётом поддержки моделью. "tools" описывает пользовательскую функцию для Function Calling (правила определения см. §3.4.1.3.2). Этот параметр также зависит от поддержки Function Calling моделью; если функция не поддерживается или не используется, задайте "None".

<!-- PDF p.58; extraction unit 273 -->

Структура возвращаемых сервером данных зависит от выбора потокового режима. При непотоковом инференсе возвращаются следующие данные:

<!-- PDF p.58; extraction unit 274 -->

```text
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-3.5-turbo-0125",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
   "index": 0,
   "message": {
     "role": "assistant",
     "content": "\n\nHello there, how may I assist you today?",},
   "logprobs": null,
   "finish_reason": "stop"
  }],
  "usage": {
   "prompt_tokens": 9,
   "completion_tokens": 12,
   "total_tokens": 21
  }
}
```

<!-- PDF p.58; extraction unit 275 -->

В непотоковом режиме главное содержимое — "messages" в "choices": это результат инференса модели. В потоковом режиме сервер возвращает объект Response с результатами модели в разные моменты выполнения. Содержимое данных каждого момента:

<!-- PDF p.58; extraction unit 276 -->

```text
{
"id": "chatcmpl-123",
  "object": "chat.completion.chunk",
  "created": 1677652288,
  "model": "gpt-3.5-turbo-0125",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
   "index": 0,
   "delta": {
     "role": "assistant",
     "content": "\n\nHello there, how may I assist you today?",},
   "logprobs": null,
   "finish_reason": "stop"
  }]
}
```

<!-- PDF p.58; extraction unit 277 -->

В потоковых данных отслеживайте раздел "delta" внутри "choices". Пустое значение "finish_reason" (None) означает, что модель ещё выполняет инференс и не завершила генерацию. Только когда "finish_reason"

<!-- PDF p.59; extraction unit 278 -->

возвращает "stop", потоковый инференс считается завершённым. В коде развёртывания RKLLM-Server-Flask и примерах API одинаково определена структура передаваемых данных, что обеспечивает универсальность сервера. Далее отдельно рассматриваются скрипт развёртывания одной командой, важные настройки серверной реализации и клиентские API-скрипты.

<!-- PDF p.59; extraction unit 279 -->

##### 3.4.1.1 Сервер: скрипт развёртывания RKLLM-Server-Flask одной командой

<!-- PDF p.59; extraction unit 280 -->

Скрипт build_rkllm_server_flask.sh в rkllm_server_demo позволяет быстро развернуть RKLLM-Server-Flask на Linux-плате. Перед его использованием учтите следующее:

<!-- PDF p.59; extraction unit 281 -->

1) Подключите плату к сети Ethernet-кабелем. В adb shell вызовите ifconfig и определите её IP-адрес. RKLLM-Server-Flask использует этот адрес для сервера в локальной сети и доступа клиентов.

<!-- PDF p.59; extraction unit 282 -->

2) Заранее успешно преобразуйте RKLLM-модель и перенесите её на Linux-плату. Скрипт build_rkllm_server_flask.sh запускается непосредственно на ПК, а не на плате, и быстро развёртывает сервер на плате. Использование:

<!-- PDF p.59; extraction unit 283 -->

```text
./build_rkllm_server_flask.sh
   --workshop [RKLLM-Server Working Path]
   --model_path [Absolute Path of Converted RKLLM Model on Board] --platform [Target Platform: RK3588/RK3576/RK3562/RV1126B]
   [--lora_model_path [LoRA Model Path]]
   [--prompt_cache_path [Prompt Cache File Path]]
```

<!-- PDF p.59; extraction unit 284 -->

Параметр workshop задаёт рабочий каталог RKLLM-Server-Flask на плате; model_path — абсолютный путь преобразованной RKLLM-Toolkit модели, которую сервер читает из этого

<!-- PDF p.60; extraction unit 285 -->

пути при выполнении. platform — текущая платформа: RK3588, RK3576, RK3562 или RV1126B. Необязательные lora_model_path и prompt_cache_path задают пути для загрузки LoRA или использования Prompt. Простой пример запуска build_rkllm_server_flask.sh:

<!-- PDF p.60; extraction unit 286 -->

```text
./build_rkllm_server_flask.sh
   --workshop /path/to/workshop
   --model_path /path/to/model.rkllm
   --platform rk3588
```

<!-- PDF p.60; extraction unit 287 -->

После запуска команды скрипт выполнит следующие шаги:

<!-- PDF p.60; extraction unit 288 -->

1) Проверит среду Linux на плате.

<!-- PDF p.60; extraction unit 289 -->

2) Автоматически установит Flask, если библиотека ещё не установлена.

<!-- PDF p.60; extraction unit 290 -->

3) Передаст необходимые файлы rkllm_server_demo/rkllm_server на плату.

<!-- PDF p.60; extraction unit 291 -->

4) Найдёт RKLLM-модель в заданном рабочем каталоге RKLLM-Server-Flask. Сообщение "RKLLM Model has been initialized successfully!" в терминале означает успешный запуск примера RKLLM-Server-Flask.

<!-- PDF p.60; extraction unit 292 -->

![Техническая иллюстрация оригинала RKLLM — PDF p.60](/docs/rockchip-rkllm-sdk/assets/en-p060-figure-02.png)

Копируемая расшифровка исходного журнала (не измерение ArmSoM; скрытая учётная запись не восстановлена):

```text
=========init....===========
rkllm-runtime version: 1.0.2b9, rknpu driver version: 0.9.7, platform: RK3588
load prompt cache from '/data/cw/prompt_cache.bin'
loaded a prompt cache with prompt size of 27 tokens
RKLLM Model has been initialized successfully!
===========================
 * Serving Flask app 'flask_server'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8080
 * Running on http://172.16.10.79:8080
Press CTRL+C to quit
```

<!-- PDF p.60; extraction unit 293 -->

Рисунок 3-2. Успешный запуск RKLLM-Server-Flask в терминале. По коду build_rkllm_server_flask.sh можно изучить процесс развёртывания и гибко адаптировать собственный сервер. Важно: на шаге 3 скрипт автоматически синхронизирует текущую RKLLM Runtime в rkllm_server/lib/librkllmrt.so. Поэтому flask_server.py во время работы вызывает текущую librkllmrt.so.

<!-- PDF p.61; extraction unit 294 -->

##### 3.4.1.2 Сервер: реализация примера RKLLM-Server-Flask

<!-- PDF p.61; extraction unit 295 -->

Ниже описана реализация примера RKLLM-Server-Flask, чтобы упростить понимание и дальнейшую разработку. Сервер реализован в основном библиотекой Flask; Python ctypes напрямую вызывает библиотеку RKLLM Runtime для инференса. В rkllm_server/flask_server.py для обращения к librkllmrt.so через ctypes необходимо заранее определить Python-структуры по заголовку rkllm.h соответствующей библиотеки. Получив структуру данных пользователя, Flask вызывает функции инференса RKLLM. Основные шаги реализации flask_server.py:

<!-- PDF p.61; extraction unit 296 -->

![Техническая иллюстрация оригинала RKLLM — PDF p.61](/docs/rockchip-rkllm-sdk/assets/en-p061-figure-02.png)

<!-- PDF p.61; extraction unit 297 -->

Рисунок 3-3. Процесс реализации развёртывания RKLLM-Server-Flask

<!-- PDF p.61; extraction unit 298 -->

1) Загрузка RKLLM Runtime: задайте путь к динамической библиотеке и загрузите librkllmrt.so через ctypes для разбора RKLLM Runtime.

<!-- PDF p.61; extraction unit 299 -->

2) Внешняя реализация Runtime: в Python через ctypes определите реализации из заголовков RKLLM Runtime, включая структуры данных, callback, инициализацию, инференс, освобождение и функции загрузки LoRA/Prompt Cache.

<!-- PDF p.61; extraction unit 300 -->

3) Инкапсуляция полного класса: на основе типов Runtime и функциональных

<!-- PDF p.62; extraction unit 301 -->

интерфейсов шага 2) создайте полный класс, объединяющий инициализацию RKLLM, инференс, освобождение и другие операции для удобства дальнейших вызовов.

<!-- PDF p.62; extraction unit 302 -->

4) Настройка RKLLM-Server-Flask: используйте класс шага 3 для построения Flask-сервера. При запуске загрузите модель по параметрам пользователя; определите формат и разбор входа, потоковый/непотоковый инференс, формат результата и callback, а также освобождение RKLLM. Реализации этих модулей образуют основной код rkllm_server/flask_server.py и завершают развёртывание примера. Для разных пользовательских моделей можно менять определения инициализации RKLLM. Этот пример также служит основой собственных серверов.

<!-- PDF p.62; extraction unit 303 -->

##### 3.4.1.3 Клиент: пример доступа через API

<!-- PDF p.62; extraction unit 304 -->

Файл rkllm_server_demo/chat_api_flask.py содержит обычный диалог (основной код main_demo1) и одношаговый диалог с Function Calling (основной код main_demo2).

<!-- PDF p.62; extraction unit 305 -->

###### 3.4.1.3.1 Пример 1 — обычный диалог

<!-- PDF p.62; extraction unit 306 -->

Это обычный вопросно-ответный диалог. Подробный порядок работы:

<!-- PDF p.62; extraction unit 307 -->

1) Задайте сетевой адрес RKLLM-Server-Flask по IP Linux-платы, порту Flask и имени вызываемой функции.

<!-- PDF p.62; extraction unit 308 -->

```text
server_url = 'http://172.16.10.xx:8080/rkllm_chat'
```

<!-- PDF p.62; extraction unit 309 -->

2) Выберите режим API: непотоковая или потоковая передача; по умолчанию непотоковая.

<!-- PDF p.63; extraction unit 310 -->

```text
main_demo1(is_streaming=True)
```

<!-- PDF p.63; extraction unit 311 -->

3) Создайте объект сеанса requests.Session() для настройки связи API с сервером. Пользователи могут менять его по требованиям разработки.

<!-- PDF p.63; extraction unit 312 -->

```text
session = requests.Session()
session.keep_alive = False  # Close the connection pool
adapter = requests.adapters.HTTPAdapter(max_retries=5)
session.mount('https://', adapter)
session.mount('http://', adapter)
```

<!-- PDF p.63; extraction unit 313 -->

4) Определите структуру данных, отправляемых через API. Доступ к RKLLM-Server-Flask инкапсулируется в этой структуре.

<!-- PDF p.63; extraction unit 314 -->

```text
# Prepare the data to be sent
# model: the model defined by the user when setting up RKLLM-Server, which has no effect here
# messages: the questions input by the user; supports adding multiple questions to messages
# stream: whether to enable streaming dialogue, same as the OpenAI interface
# enable_thinking: whether to enable deep thinking
# tools: user's description of custom functions
data = {
   "model": 'your_model_deploy_with_RKLLM_Server',
   "messages": [{"role": "user", "content": user_message}],
   "stream": is_streaming,
   "enable_thinking": False,
   "tools": None
}
```

<!-- PDF p.63; extraction unit 315 -->

5) Отправьте запрос серверу RKLLM-Server-Flask и получите ответ.

<!-- PDF p.63; extraction unit 316 -->

```text
responses = session.post(server_url, json=data, headers=headers,
stream=is_streaming, verify=False)
```

<!-- PDF p.63; extraction unit 317 -->

6) Определите способ разбора структуры ответа.

<!-- PDF p.64; extraction unit 318 -->

```text
# Parse the response
# Non-streaming transmission
if not is_streaming:
       if responses.status_code == 200:
       print("Q:", data["messages"][-1]["content"])
       print("A:", json.loads(responses.text)["choices"][-1]["message"]["content"])
   else:
       print("Error:", responses.text)

# Streaming transmission
else:
   if responses.status_code == 200:
       print("Q:", data["messages"][-1]["content"])
       print("A:", end="")
       for line in responses.iter_lines():
if line:
             line = json.loads(line.decode('utf-8'))
             if line["choices"][-1]["finish_reason"] != "stop":
                 print(line["choices"][-1]["delta"]["content"], end="")

                 sys.stdout.flush()
   else:
       print('Error:', responses.text)
```

<!-- PDF p.64; extraction unit 319 -->

Шаги 1–6 показывают API-доступ к RKLLM-Server-Flask и могут служить основой пользовательских функций. Обязательно проверьте адрес сервера: IP, порт и имя интерфейса входа. При особых требованиях к обмену согласованно измените структуры данных клиента и сервера для реализации нужных функций.

<!-- PDF p.64; extraction unit 320 -->

###### 3.4.1.3.2 Пример 2 — одношаговый диалог с Function Calling

<!-- PDF p.64; extraction unit 321 -->

LLM не знает информации, отсутствовавшей в обучающих данных, включая события после обучения. Кроме того, вероятностное обучение может быть недостаточно точным для задач со строгими правилами, например математических вычислений. Function Calling позволяет автоматически запрашивать заранее определённые функции по запросу пользователя и получать более точную актуальную информацию. Здесь используется пример погоды: пользователь спрашивает текущую температуру и температуру завтра в Сан-Франциско. Обычно модель не может ответить на такой запрос реального времени, но у

<!-- PDF p.65; extraction unit 322 -->

пользователя есть две функции: получение текущей температуры города и температуры на заданную дату. Модель должна воспользоваться обеими для точного ответа.

1) Задайте адрес RKLLM-Server-Flask по IP Linux-платы, порту Flask и имени вызываемой функции.

<!-- PDF p.65; extraction unit 323 -->

```text
server_url = 'http://172.16.10.166:8080/rkllm_chat'
```

<!-- PDF p.65; extraction unit 324 -->

2) Выберите режим API: непотоковая или потоковая передача; по умолчанию непотоковая.

<!-- PDF p.65; extraction unit 325 -->

```text
main_demo2(is_streaming=True)
```

<!-- PDF p.65; extraction unit 326 -->

3) Создайте объект сеанса requests.Session() для настройки связи API с сервером. Пользователи могут менять его по требованиям разработки.

<!-- PDF p.65; extraction unit 327 -->

```text
session = requests.Session()
session.keep_alive = False
adapter = requests.adapters.HTTPAdapter(max_retries=5)
session.mount('https://', adapter)
session.mount('http://', adapter)
```

<!-- PDF p.65; extraction unit 328 -->

4) Определите функции для LLM: get_current_temperature возвращает текущую температуру заданного города, get_temperature_date — температуру заданного города на заданную дату.

<!-- PDF p.66; extraction unit 329 -->

```text
def get_current_temperature(location: str, unit: str = "celsius"):
       """
       Get current temperature at a location.

       Args:
          location: The location to get the temperature for, in the
format "City, State, Country".
          unit: The unit to return the temperature in. Defaults to
"celsius". (choices: ["celsius", "fahrenheit"])

       Returns:
          the temperature, the location, and the unit in a dict
       """
       return {
          "temperature": 26.1,
          "location": location,
          "unit": unit,
       }

def get_temperature_date(location: str, date: str, unit: str =
"celsius"):
       """
       Get temperature at a location and date.

       Args:
          location: The location to get the temperature for, in the
format "City, State, Country".
          date: The date to get the temperature for, in the format
"Year-Month-Day".
          unit: The unit to return the temperature in. Defaults to
"celsius". (choices: ["celsius", "fahrenheit"])

       Returns:
          the temperature, the location, the date and the unit in a
dict
       """
       return {
          "temperature": 25.9,
          "location": location,
          "date": date,
          "unit": unit}
```

<!-- PDF p.66; extraction unit 330 -->

5) Определите описание пользовательской функции. В примере TOOLS содержит описания двух функций. Каждое описание — JSON-объект с двумя полями:

- type: строка типа инструмента; пока допустимо только "function";
- function: объект с подробным описанием функции и тремя полями: name — строка имени функции, description — строка назначения, parameters — JSON Schema (https://json-schema.org/learn/getting-started-step-by-step) для

<!-- PDF p.67; extraction unit 331 -->

описания принимаемых параметров. Построение JSON Schema описано по ссылке; обратите внимание на type, required и enum.

<!-- PDF p.68; extraction unit 332 -->

```text
TOOLS = [
       {
          "type": "function",
          "function": {
             "name": "get_current_temperature",
             "description": "Get current temperature at a location.",
             "parameters": {
                 "type": "object",
                 "properties": {
                    "location": {
                       "type": "string",
                       "description": 'The location to get the temperature for, in the format "City, State, Country".',
                    },
                    "unit": {
                       "type": "string",
                       "enum": ["celsius", "fahrenheit"],
                       "description": 'The unit to return the temperature in. Defaults to "celsius".',
                    },
                 },
                 "required": ["location"],
             },
          },
       },
       {
          "type": "function",
          "function": {
             "name": "get_temperature_date",
             "description": "Get temperature at a location and date.",
             "parameters": {
                 "type": "object",
                 "properties": {
                    "location": {
                       "type": "string",
                       "description": 'The location to get the temperature for, in the format "City, State, Country".',
                    },
                    "date": {
                       "type": "string",
                       "description": 'The date to get the temperature for, in the format "Year-Month-Day".',
                    },
                    "unit": {
                       "type": "string",
                       "enum": ["celsius", "fahrenheit"],
                       "description": 'The unit to return the temperature in. Defaults to "celsius".',
                    },
                 },
                 "required": ["location", "date"],
             },
          },
       },
   ]
```

<!-- PDF p.68; extraction unit 333 -->

6) Определите структуру отправляемых данных API. Доступ пользователя

<!-- PDF p.69; extraction unit 334 -->

к RKLLM-Server-Flask включается в эту структуру; начните первый вызов LLM.

<!-- PDF p.69; extraction unit 335 -->

```text
# Prepare the data to be sent
# model: The model defined by the user when setting up RKLLM-Server, which has no effect here
# messages: Questions entered by the user; this example only supports one question, i.e., a single round of dialogue
# stream: Whether to enable streaming dialogue
# enable_thinking: Whether to enable deep thinking
# tools: User description of custom functions

messages = [
   {"role": "system", "content": "You are Qwen, created by Alibaba Cloud. You are a helpful assistant.\n\nCurrent Date: 2024-09-30"},
   {"role": "user",  "content": "What's the temperature in San Francisco now? How about tomorrow?"},
   ]

data = {
       "model": 'your_model_deploy_with_RKLLM_Server',
       "messages": messages,
       "stream": False,
       "enable_thinking": False,
       "tools": TOOLS
   }

# Send a POST request
responses = session.post(server_url, json=data, headers=headers,
stream=False, verify=False)
```

<!-- PDF p.69; extraction unit 336 -->

Первый вызов LLM возвращает параметры пользовательской функции:

<!-- PDF p.69; extraction unit 337 -->

```text
server_answer = json.loads(responses.text)["choices"][-1]["message"]["content"]
matches = re.findall(r"<tool_call>\s*(\{.*?\})\s*</tool_call>",
''.join(server_answer), re.DOTALL)
print("server_answer:", server_answer, '\n')

'''
The following is the output of print("server_answer:", server_answer,
'\n')

server_answer: <tool_call>
{"name": "get_current_temperature", "arguments": {"location": "San Francisco"}}
</tool_call>
<tool_call>
{"name": "get_temperature_date", "arguments": {"location": "San Francisco", "date": "2024-10-01"}}
</tool_call>
'''
```

<!-- PDF p.69; extraction unit 338 -->

7) Разберите ответ LLM, сформируйте вход для второго вызова и вызовите LLM повторно.

<!-- PDF p.70; extraction unit 339 -->

```text
result = [json.loads(match) for match in matches]
for function_call in result:
   messages.append({'role': 'assistant', 'content': '',
'function_call':function_call})

tool_calls = [{'function': result[i]} for i in range(len(result))]
function_call = []
for tool_call in tool_calls:
   if fn_call := tool_call.get("function"):
       fn_name: str = fn_call["name"]
       fn_args: dict = fn_call["arguments"]
       fn_res: str = json.dumps(get_function_by_name(fn_name)(**fn_args))
       messages.append({'role': 'tool', 'name': fn_name,
'content':fn_res})

print("messages:", messages, '\n')

'''
The following is the output of print("messages:", messages, '\n')

messages: [{'role': 'system', 'content': 'You are Qwen, created by
Alibaba Cloud. You are a helpful assistant.\n\nCurrent Date: 2024-09-30'}, {'role': 'user', 'content': "What's the temperature in San Francisco now? How about tomorrow?"}, {'role': 'assistant', 'content':
'', 'function_call': {'name': 'get_current_temperature', 'arguments':
{'location': 'San Francisco'}}}, {'role': 'assistant', 'content': '',
'function_call': {'name': 'get_temperature_date', 'arguments':
{'location': 'San Francisco', 'date': '2024-10-01'}}}, {'role': 'tool',
'name': 'get_current_temperature', 'content': '{"temperature": 26.1,
"location": "San Francisco", "unit": "celsius"}'}, {'role': 'tool',
'name': 'get_temperature_date', 'content': '{"temperature": 25.9,
"location": "San Francisco", "date": "2024-10-01", "unit":
"celsius"}'}]
'''

data = {
"model": 'your_model_deploy_with_RKLLM_Server',
"messages": messages,
"stream": is_streaming,
"enable_thinking": False,
"tools": TOOLS
}

# Send a POST request
responses = session.post(server_url, json=data, headers=headers,
stream=is_streaming, verify=False)
```

<!-- PDF p.70; extraction unit 340 -->

8) Разберите структуру ответа второго вызова, чтобы получить окончательный ответ о текущей и завтрашней температуре в Сан-Франциско.

<!-- PDF p.71; extraction unit 341 -->

```text
if not is_streaming:
       # Parse the response
       if responses.status_code == 200:
          print("A:", json.loads(responses.text)["choices"][-1]["message"]["content"])
       else:
          print("Error:", responses.text)
else:
   if responses.status_code == 200:
       print("A:", end="")
       for line in responses.iter_lines():
       if line:
          line = json.loads(line.decode('utf-8'))
          if line["choices"][-1]["finish_reason"] != "stop":
             print(line["choices"][-1]["delta"]["content"], end="")
             sys.stdout.flush()
   else:
       print('Error:', responses.text)

'''
The following is the output of print()

A:The current temperature in San Francisco is 26.1°C. Tomorrow, the temperature is expected to be 25.9°C.
'''
```

<!-- PDF p.71; extraction unit 342 -->

Шаги 1–8 — пример Function Calling с RKLLM-Server-Flask как бэкендом. По нему можно создавать пользовательские функции. Убедитесь, что выбранная LLM поддерживает Function Calling. У моделей с ограниченными возможностями, например Qwen3-0.6B, функция может не сработать: модель после первого вызова может неточно вернуть параметры пользовательских функций.

<!-- PDF p.71; extraction unit 343 -->

#### 3.4.2 Пример развёртывания RKLLM-Server-Gradio

<!-- PDF p.71; extraction unit 344 -->

Gradio — простая Python-библиотека для быстрого построения интерактивных интерфейсов машинного обучения. Здесь показано быстрое развёртывание RKLLM-Server-Gradio на Linux-устройстве и прямой доступ к модели для инференса в локальной сети. На рисунке ниже — веб-интерфейс после успешного развёртывания.

<!-- PDF p.72; extraction unit 345 -->

![Техническая иллюстрация оригинала RKLLM — PDF p.72](/docs/rockchip-rkllm-sdk/assets/en-p072-figure-02.png)

<!-- PDF p.72; extraction unit 346 -->

Рисунок 3-4. Внешняя страница доступа к примеру RKLLM-Server. Каталог rkllm_server_demo содержит код RKLLM-Server-Gradio, показанного на рисунке 3-3. Для быстрого развёртывания можно напрямую использовать build_rkllm_server_gradio.sh. После успешного запуска инференс RKLLM доступен через веб-интерфейс или API.

<!-- PDF p.72; extraction unit 347 -->

##### 3.4.2.1 Сервер: реализация примера RKLLM-Server-Gradio

<!-- PDF p.72; extraction unit 348 -->

Скрипт build_rkllm_server_gradio.sh предназначен для быстрого развёртывания RKLLM-Server-Gradio на Linux-плате. Как и для RKLLM-Server-Flask, перед его использованием учтите следующее:

<!-- PDF p.72; extraction unit 349 -->

1) Подключите плату к сети Ethernet-кабелем. В adb shell командой ifconfig определите IP-адрес. RKLLM-Server-Gradio использует этот адрес для сервера локальной сети и клиентских подключений.

<!-- PDF p.72; extraction unit 350 -->

2) До запуска скрипта успешно преобразуйте модель RKLLM и передайте её на Linux-плату.

<!-- PDF p.73; extraction unit 351 -->

Использование build_rkllm_server_gradio.sh аналогично build_rkllm_server_flask.sh:

<!-- PDF p.73; extraction unit 352 -->

```text
./build_rkllm_server_gradio.sh
   --workshop [RKLLM-Server Working Path]
   --model_path [Absolute Path of Converted RKLLM Model on Board] --platform [Target Platform: RK3588/RK3576/RK3562/RV1126B]
   [--lora_model_path [LoRA Model Path]]
   [--prompt_cache_path [Prompt Cache File Path]]
```

<!-- PDF p.73; extraction unit 353 -->

workshop задаёт рабочий каталог RKLLM-Server-Gradio на устройстве; model_path — абсолютный путь преобразованной RKLLM-Toolkit модели, читаемой сервером во время работы; platform — тип платформы, например RK3588, RK3576, RK3562 или RV1126B. Необязательные lora_model_path и prompt_cache_path задают файлы LoRA и Prompt. Для быстрого развёртывания вызовите build_rkllm_server_gradio.sh следующей командой на ПК, не на плате:

<!-- PDF p.73; extraction unit 354 -->

```text
./build_rkllm_server_gradio.sh
   --workshop /user/data
   --model_path /user/data/model.rkllm
   --platform rk3588
```

<!-- PDF p.73; extraction unit 355 -->

После запуска команды скрипт выполнит следующие шаги:

<!-- PDF p.73; extraction unit 356 -->

1) Проверит среду Linux на плате.

<!-- PDF p.73; extraction unit 357 -->

2) Автоматически установит Gradio, если библиотека ещё не установлена.

<!-- PDF p.73; extraction unit 358 -->

3) Передаст необходимые файлы rkllm_server_demo/rkllm_server на плату.

<!-- PDF p.73; extraction unit 359 -->

4) Найдёт модель RKLLM в заданном рабочем каталоге RKLLM-Server-Gradio. Сообщение "RKLLM Model has been initialized successfully!" в терминале означает успешный запуск примера.

<!-- PDF p.74; extraction unit 360 -->

![Техническая иллюстрация оригинала RKLLM — PDF p.74](/docs/rockchip-rkllm-sdk/assets/en-p074-figure-02.png)

Копируемая расшифровка исходного журнала (не измерение ArmSoM; скрытая учётная запись не восстановлена):

```text
warnings.warn(
=========init....===========
rkllm-runtime version: 1.0.2b9, rknpu driver version: 0.9.7, platform: RK3588
load prompt cache from '/data/cw/prompt_cache.bin'
loaded a prompt cache with prompt size of 27 tokens
RKLLM Model has been initialized successfully!
===========================
Running on local URL:  http://0.0.0.0:8080
To create a public link, set `share=True` in `launch()`.
```

<!-- PDF p.74; extraction unit 361 -->

Рисунок 3-5. Успешный запуск RKLLM-Server-Gradio в терминале. По коду build_rkllm_server_gradio.sh можно изучить развёртывание и гибко создавать собственные серверы. Важно: на шаге 3 скрипт автоматически синхронизирует текущую RKLLM Runtime в rkllm_server/lib/librkllmrt.so. Поэтому gradio_server.py при работе ссылается на эту librkllmrt.so; это нужно учитывать при настройке сервера.

<!-- PDF p.74; extraction unit 362 -->

##### 3.4.2.2 Сервер: реализация примера RKLLM-Server-Gradio

<!-- PDF p.74; extraction unit 363 -->

Реализация RKLLM-Server-Gradio аналогична RKLLM-Server-Flask: ctypes напрямую вызывает библиотеку RKLLM Runtime для инференса модели. Конкретный процесс показан на рисунке ниже:

<!-- PDF p.74; extraction unit 364 -->

![Техническая иллюстрация оригинала RKLLM — PDF p.74](/docs/rockchip-rkllm-sdk/assets/en-p074-figure-03.png)

<!-- PDF p.74; extraction unit 365 -->

Рисунок 3-6. Процесс реализации развёртывания RKLLM-Server-Flask (так в английском оригинале). Отличие состоит в использовании gradio для сервера и связи с клиентом через простой веб-сервис. Интерфейс Gradio в RKLLM-Server-Gradio требует следующей обработки:

<!-- PDF p.75; extraction unit 366 -->

1) Библиотека Gradio полностью реализует передачу входных и выходных данных, поэтому сложную серверную обработку ввода-вывода через Flask определять не нужно.

2) Gradio использует разные управляющие элементы. Для интерфейса вызывайте компоненты Gradio и задавайте условия срабатывания каждого элемента, логику вызова функций и поток данных между компонентами.

Основной код rkllm_server/gradio_server.py показывает реализацию. Изменение инициализации RKLLM позволяет использовать разные модели. Пример RKLLM-Server-Gradio также служит основой собственного развёртывания сервера.

<!-- PDF p.75; extraction unit 367 -->

##### 3.4.2.3 Клиент: использование RKLLM-Server-Gradio

<!-- PDF p.75; extraction unit 368 -->

После успешного развёртывания RKLLM-Server-Gradio на Linux-плате доступны два способа: интерфейс и API.

<!-- PDF p.75; extraction unit 369 -->

1) Интерфейс: после успешного запуска скриптом откройте браузер на любом ПК локальной сети и перейдите к board_IP:8080, например 172.16.10.178:8080 (рисунок 3-2 оригинала). Так можно быстро взаимодействовать с моделью. Gradio автоматически поддерживает Markdown, HTML и другие синтаксисы, адаптируя вывод, включая код и Markdown-текст. При создании RKLLM-Server запускается очередь: запросы нескольких пользователей обрабатываются и возвращаются по порядку поступления. Пока текущий запрос пользователя выполняется (диалог выделен), сервер не принимает следующий ввод этого пользователя.

<!-- PDF p.75; extraction unit 370 -->

2) API: в rkllm_server_demo предоставлен chat_api_gradio.py. После установки gradio_client на ПК (pip install gradio_client) доступ к RKLLM-Server возможен только через API, без графического интерфейса, как показано на

<!-- PDF p.76; extraction unit 371 -->

следующем рисунке. Перед использованием chat_api_gradio.py замените IP-адрес в коде текущим IP платы, как в следующем примере.

<!-- PDF p.76; extraction unit 372 -->

```text
from gradio_client import Client
client = Client("http://172.16.10.xx:8080/")
```

<!-- PDF p.76; extraction unit 373 -->

![Техническая иллюстрация оригинала RKLLM — PDF p.76](/docs/rockchip-rkllm-sdk/assets/en-p076-figure-02.png)

Копируемая расшифровка исходного журнала (не измерение ArmSoM; скрытая учётная запись не восстановлена):

```text
(base) [原图已模糊 / blurred in original]/rkllm/rkllm-runtime/examples/rkllm_server_demo$ python chat_api.py
===========================
在终端中输入您的问题，即可与 RKLLM 模型进行对话....
===========================
请输入您的问题: 请给出福州的介绍
Loaded as API: http://172.16.10.102:8080/ ✓
Q: 请给出福州的介绍
A: 福州，福建省省会，位于中国东南沿海的大陆架上，东临太平洋，西隔台湾海峡与台湾岛相望；北濒东海，南界巴士海峡与菲律宾群岛相对。全市总面积13247平方千米，其中市区面积6580平方千米。福州市气候温暖湿润，四季分明，是著名的“鱼米之乡”。福州是中国东南沿海重要的港口城市和风景名胜区，拥有众多的历史文化遗产和自然景观。
请输入您的问题:
```

<!-- PDF p.76; extraction unit 374 -->

Рисунок 3-7. Вызов RKLLM-Server-Gradio через API в терминале. Выберите подходящий способ: для интерактивных сервисов локальной сети рекомендуется интерфейс; для настройки поведения доступа — API и дальнейшая разработка. Важно: RKLLM-Server-Gradio не определяет структуры отправки и получения данных по образцу OpenAI-API, поэтому эта реализация несовместима с интерфейсом OpenAI-API. Для расширения изучите реализацию chat_api_gradio.py. Если нужна совместимость с OpenAI-API, используйте реализацию RKLLM-Server-Flask.

<!-- PDF p.77; extraction unit 375 -->

## 4 Связанные материалы

<!-- PDF p.77; extraction unit 376 -->

RKLLM: https://github.com/airockchip/rknn-llm

RKNN: https://github.com/airockchip/rknn-toolkit2

## Указатель ссылок оригинала

[developer.arm.com: 10-2-2020-11](https://developer.arm.com/downloads/-/gnu-a/10-2-2020-11)

[github.com: AutoGPTQ](https://github.com/AutoGPTQ/AutoGPTQ)

[github.com: rknn-llm](https://github.com/airockchip/rknn-llm)

[github.com: rknpu-driver](https://github.com/airockchip/rknn-llm/tree/main/rknpu-driver)

[github.com: rknn-toolkit2](https://github.com/airockchip/rknn-toolkit2)

[github.com: Unsupported-Downloads](https://github.com/android/ndk/wiki/Unsupported-Downloads)

[github.com: develop-5.10](https://github.com/rockchip-linux/kernel/tree/develop-5.10)

{% endraw %}

---
title: "RKNN2 SDK V2.5.0 · Развёртывание зашифрованных моделей"
description: "RKNN2 SDK V2.5.0 · Развёртывание зашифрованных моделей · Полная серия руководства разработчика"
excerpt: "Развёртывание зашифрованных моделей"
translation_key: "rknn-v250-sdk-guide-encryption"
slug: "rknn-v250-sdk-guide-encryption"
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

**RKNN2 SDK V2.5.0 · 18/22**

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

[15. SRAM NPU RK3588/RK3576](/ru/articles/rknn-v250-sdk-guide-sram/)

[16. Согласованность кэша и разреженный инференс](/ru/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Пользовательские операторы: Python и C API](/ru/articles/rknn-v250-sdk-guide-custom-operators/)

**Развёртывание зашифрованных моделей**

[19. Диагностика точности](/ru/articles/rknn-v250-sdk-guide-accuracy/)

[20. Анализ производительности и оптимизация сети](/ru/articles/rknn-v250-sdk-guide-performance/)

[21. Анализ, совместное использование и повторное использование памяти](/ru/articles/rknn-v250-sdk-guide-memory/)

[22. Вопросы, обработка ошибок и справочные ресурсы](/ru/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.2.2 Развёртывание зашифрованных моделей

RKNN SDK поддерживает автономное шифрование моделей и расшифрование во время выполнения.

Шифрование — лишь часть защиты модели и не устраняет полностью риск взлома. По возможности исключайте прямой доступ третьих лиц к моделям и усиливайте защиту на уровне системы.

Примечание: прежняя схема rknn.export_encrypted_rknn_model()/crypt_level совместима, но больше не рекомендуется. Используйте гибридную схему этого раздела.

Используется архитектура гибридного шифрования:

AES-256-CTR: симметричное шифрование тела модели, быстрое и с произвольным доступом при расшифровании; поддерживается только 256bit.

RSA-OAEP: асимметричная защита ключа AES для безопасного распространения ключей.

Система ключей:

| Key | Тип | Owner | Purpose |
| --- | --- | --- | --- |
| Ключ пользователя | Симметричный ключ AES-256 | Создаёт пользователь | Шифрование/расшифрование тела модели |
| Пара ключей RK | Асимметричная пара RSA-2048 | Предустановлена RK | Открытый ключ шифрует ключ пользователя; встроенный закрытый ключ расшифровывает его. |

Формат зашифрованного файла:

| Offset | Length | Content |
| --- | --- | --- |
| 0 – 63 | 64 байта | Незашифрованный заголовок RKNN; признак шифрования RKCE записан по смещению 24–47. |
| 64+ | body | Тело модели, зашифрованное AES-256-CTR |

Файл конверта ключа user_key_iv.enc: заголовок RKKE (16 байт) + RSA-OAEP(AES key ‖ AES IV).

#### 4.2.2.1 ШИФРОВАНИЕ НА ПК/СЕРВЕРЕ

Сценарий преобразования, примеры и открытый ключ RK находятся в rknpu2/examples/rknn_encrypt_demo проекта rknpu2.

Зашифруйте преобразованную .rknn-модель через rknn_model_encrypt.py:

```text
python3 rknn_model_encrypt.py --model model.rknn \
                                --rk-pubkey rk_public_key.pem \
                                [--output-dir ./encrypted] \
                                [--aes-bits 256]
```

Выходные файлы:

| File | Описание |
| --- | --- |
| model.rknn | Зашифрованная модель: открытый заголовок RKNN + признак RKCE + шифротекст AES-CTR |
| model_key.bin | Конверт ключа RSA-OAEP с заголовком RKKE, развёртывается вместе с моделью. |

Открытый ключ rk_public_key.pem предоставляет Rockchip. Ключ пользователя, зашифрованный этим ключом, может расшифровать только встроенный в чип закрытый RSA-ключ.

#### 4.2.2.2 ЗАГРУЗКА ЗАШИФРОВАННЫХ МОДЕЛЕЙ НА ПЛАТЕ

Во время выполнения конверт ключа передаётся через rknn_init_extend.user_key; rknn_init() расшифровывает внутри. Далее инференс совпадает с незашифрованной моделью. Загрузка возможна из файла (size=0) или буфера памяти.

```text
#include "rknn_api.h"

/* 1. Load the key envelope into memory */
size_t key_env_size = 0;
void* key_env = load_file("model_key.bin", &key_env_size);
if (!key_env) {
    printf("load key envelope failed!\n");
    return -1;
}

/* 2. Pass the key envelope via rknn_init_extend.user_key */
rknn_init_extend init_ext;
rknn_decrypt_key_mem key_mem;
memset(&init_ext, 0, sizeof(rknn_init_extend));
key_mem.key_data = key_env;
key_mem.key_size = (uint32_t)key_env_size;
init_ext.user_key = &key_mem;

/* 3. rknn_init decrypts internally; subsequent usage is the same as a plaintext
model */
rknn_context ctx = 0;
int ret = rknn_init(&ctx, (void*)"model.rknn", 0, 0, &init_ext);
if (ret < 0) {
    if (ret == RKNN_ERR_KEY_INVALID)
        printf("key envelope invalid / RSA unwrap failed\n");
    else if (ret == RKNN_ERR_DECRYPT_FAILED)
        printf("AES-CTR model body decryption failed\n");
    else if (ret == RKNN_ERR_SOC_BIND_FAILED)
        printf("current SoC is not in the bound platform list\n");
    memset(key_env, 0, key_env_size);
    free(key_env);
    return -1;
}

/* 4. The user-side key memory can be released after rknn_init returns */
memset(key_env, 0, key_env_size);
free(key_env);

/* 5. Proceed with the normal inference flow: rknn_query / rknn_inputs_set /
rknn_run / ... */
```

rknn_decrypt_key_mem и буфер key_data принадлежат вызывающему. Runtime копирует конверт внутри rknn_init(), поэтому после возврата его можно освободить. Перед освобождением рекомендуется обнулить память ключа через memset, уменьшая риск утечки.

Поддерживаемые платформы: RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B/RV1106/RV1103B

#### 4.2.2.3 СОВМЕСТИМОСТЬ ЗАШИФРОВАННЫХ МОДЕЛЕЙ С ВНЕШНИМ ВЫДЕЛЕНИЕМ И ПОВТОРНЫМ ИСПОЛЬЗОВАНИЕМ ПАМЯТИ

При инициализации зашифрованная модель совместима только с повторным использованием Internal-памяти, выделенной снаружи. Инициализируйте с RKNN_FLAG_INTERNAL_ALLOC_OUTSIDE и задайте память через rknn_set_internal_mem(). Несколько моделей могут повторно использовать один блок Internal. Подробности в 5.3.3 «Internal Memory Reuse».

Зашифрованные модели несовместимы со следующими функциями:

Общие веса: RKNN_FLAG_SHARE_WEIGHT_MEM при инициализации не поддерживается.

Внешняя память весов: rknn_set_weight_mem() не поддерживается.

Повторное использование контекста: rknn_dup_context() не поддерживается.

{% endraw %}

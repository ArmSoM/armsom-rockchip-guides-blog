---
title: "Разработка собственной 3A для Rockchip ISP30: API и статистика AE, AWB, AF"
description: "Полный материал RK3588 Linux 5.10: регистрация собственной 3A, вызовы и структуры AE/AWB, статистика и фильтры AF, примеры исходника."
translation_key: "077-rockchip-isp30-3a"
slug: "077-rockchip-isp30-3a"
lang: "ru"
date: "2026-10-19"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "ISP30", "RK3588", "3A", "AE", "AWB", "AF"]
keywords: "ArmSoM Rockchip ISP30 RK3588 3A AE AWB AF"
excerpt: "Полный материал RK3588 Linux 5.10: регистрация собственной 3A, вызовы и структуры AE/AWB, статистика и фильтры AF, примеры исходника."
---

{% raw %}

# Разработка собственной 3A для Rockchip ISP30: API и статистика AE, AWB, AF

Статья полностью сохраняет техническую часть (стр.5–46 PDF) английского исходника V1.1.0 объёмом 46 страниц и предоставляет полный китайский и русский перевод. Соответствующий китайский PDF не предоставлен. Все три статьи используют 14 оригинальных рисунков английского PDF, включая имеющиеся китайские подписи. Код, комментарии, API, параметры, значения регистров и константы примеров сохранены; подписи и текст локализованы.

Ниже приведены область применимости и поддержка ОС по исходнику, а не утверждения о совместимости всех современных версий. Это справочник по платформе для ArmSoM: проверьте плату, RK3588, Sensor/VCM, ISP30, SDK/BSP, AIQ и версию ядра. Аппаратная проверка ArmSoM не проводилась. Описание совместной работы библиотек RK и собственных библиотек не следует переносить на непроверенные версии. Экспозиция, усиление, фокусировка и моторы могут изменять съёмку и состояние аппаратуры; код, настройки устройств и движение моторов не выполнялись.

**Неоднозначности исходника:** сохранены и отмечены повторяющиеся описания/заголовки, смешение имён `uapi`/`uapi2`, ссылка на ISP32, две повреждённые формулировки таблицы и противоречивые параметры окон. Код является примером исходника и не гарантирует компилируемость. См. редакционные записи.

| SoC | Ядро |
|---|---|
| RK3588 | Linux 5.10 |

| SoC | BuildRoot | Debian | Yocto | Android |
|---|---|---|---|---|
| RK3588 | Y | N | N | Y |

Неоднозначности исходника и адаптации:
[EDITORIAL-NOTES](/docs/rockchip-isp30-3a/EDITORIAL-NOTES.md). [ArmSoM](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.5, block 0 -->

## 1 Обзор

<!-- Source EN PDF p.5, block 1 -->

Документ описывает реализацию библиотек 3A и помогает пользователям создавать собственные библиотеки алгоритмов 3A.

<!-- Source EN PDF p.5, block 2 -->

Библиотека алгоритмов 3A зависит от AIQ, уже содержащего библиотеку 3A RK, включённую по умолчанию. При необходимости пользователь может реализовать собственную библиотеку 3A по этому руководству.

<!-- Source EN PDF p.5, block 3 -->

### 1.1 Принцип проектирования

<!-- Source EN PDF p.5, block 4 -->

Основная схема показана ниже:

<!-- Source EN PDF p.5, block 5 -->

![Технический рисунок английского исходника, PDF p.5](/docs/rockchip-isp30-3a/assets/en-p05-figure1.png)

*Технический рисунок английского исходника, PDF p.5.*

<!-- Source EN PDF p.5, block 6 -->

Библиотека 3A подключается к библиотеке ISP посредством регистрации. Библиотека 3A RK уже зарегистрирована неявно; явная регистрация пользователем не требуется.

<!-- Source EN PDF p.5, block 7 -->

После регистрации библиотеки 3A библиотека ISP получает статистику 3A от драйвера, вызывает интерфейс библиотеки 3A для вычисления новых параметров, затем передаёт их драйверу.

<!-- Source EN PDF p.5, block 8 -->

### 1.2 Организация файлов

<!-- Source EN PDF p.5, block 9 -->

Организация файлов показана ниже:

<!-- Source EN PDF p.6, block 10 -->

![Технический рисунок английского исходника, PDF p.6](/docs/rockchip-isp30-3a/assets/en-p06-figure1.png)

*Технический рисунок английского исходника, PDF p.6.*

<!-- Source EN PDF p.6, block 11 -->

Прошивка ISP разделена на прикладной уровень librkaiq.so и уровень драйверов: драйвер ISP и драйверы периферии Sensor, VCM и Flashlight.

<!-- Source EN PDF p.6, block 12 -->

librkaiq.so содержит библиотеки алгоритмов 3A, HDR и другие. Они существуют как статические библиотеки и в итоге связываются в librkaiq.so. Кроме библиотек 3A librkaiq_ae/awb/af.a, исходники которых не предоставляются, исходный код остальных базовых библиотек открыт.

<!-- Source EN PDF p.6, block 13 -->

Для всех поддерживаемых платформой модулей допускаются пользовательские алгоритмы. Однако обычно, кроме требующей настройки библиотеки 3A, остальные базовые библиотеки можно оставить стандартными, предоставленными RK.

<!-- Source EN PDF p.6, block 14 -->

### 1.3 Режимы разработки

<!-- Source EN PDF p.6, block 15 -->

Поддерживаются следующие три режима разработки:

<!-- Source EN PDF p.6, block 16 -->

Для 3A используется библиотека RK. В этом случае доступны API библиотеки 3A RK: rk_aiq_user_api2_ae.h, rk_aiq_user_api2_af.h и rk_aiq_user_api2_awb.h.

<!-- Source EN PDF p.6, block 17 -->

Часть 3A использует библиотеку RK, другая часть — пользовательскую. Например, AE использует собственную библиотеку, а AWB — библиотеку RK.

<!-- Source EN PDF p.6, block 18 -->

Пользовательская библиотека 3A и библиотека RK используются одновременно. Например, при совместной работе AE сначала выполняется библиотека RK AE, затем пользовательская AE; её результаты заменяют результаты RK AE. Это упрощает разработку: пользовательской библиотеке не требуется выдавать все результаты, необходимые AIQ, часть может предоставлять библиотека RK AE.

<!-- Source EN PDF p.7, block 19 -->

### 1.4 Программные процессы

<!-- Source EN PDF p.7, block 20 -->

#### 1.4.1 Основной процесс

<!-- Source EN PDF p.7, block 21 -->

Алгоритм 3A RK неявно зарегистрирован внутри AIQ и не требует явной регистрации пользователем. Ниже приведён псевдокод регистрации собственного алгоритма 3A на примере AE:

<!-- Source EN PDF p.7, block 22 -->

```text
// Initialize the usage scenario, not required, defaults to normal, day, which is used to select scene parameters in the JSON IQ file
if (work_mode == RK_AIQ_WORKING_MODE_NORMAL)
        ret = rk_aiq_uapi2_sysctl_preInit_scene(sns_entity_name, "normal",
"day");
  else
        ret = rk_aiq_uapi2_sysctl_preInit_scene(sns_entity_name, "hdr", "day");
// Depending on whether the usage pattern is surround view or single camera, initialize Group Ctx or AIQ ctx
   if (!group_mode)
        ctx->aiq_ctx = rk_aiq_uapi2_sysctl_init(sns_entity_name, ctx->iqpath,
NULL, NULL);
  else {
       rk_aiq_camgroup_instance_cfg_t camgroup_cfg;
       memset(&camgroup_cfg, 0, sizeof(camgroup_cfg));
       camgroup_cfg.sns_num = 1;
       camgroup_cfg.sns_num++;
       camgroup_cfg.sns_ent_nm_array[0] = sns_entity_name;
       camgroup_cfg.sns_ent_nm_array[1] = sns_entity_name2;
       camgroup_cfg.config_file_dir = ctx->iqpath;
       camgroup_cfg.overlap_map_file = "srcOverlapMap.bin";
       ctx->camgroup_ctx = rk_aiq_uapi2_camgroup_create(&camgroup_cfg);
  }
// If you need to register a custom AE algorithm, register a custom AE callback
  rk_aiq_customeAe_cbs_t cbs = {
                           .pfn_ae_init = custom_ae_init,
                           .pfn_ae_run = custom_ae_run,
                           .pfn_ae_ctrl = custom_ae_ctrl,
                           .pfn_ae_exit = custom_ae_exit,
                       };
  rk_aiq_uapi2_customAE_register((const rk_aiq_sys_ctx_t*)(ctx->camgroup_ctx),
&cbs);
// If you need to run a third-party AE algorithm, enable the custom AE algorithm. Third-party AE library registration interface, single camera and surround view shared.
//In the current AIQ version, both the default RK algorithm and the third-party algorithm will run, and if necessary, you can call rk_aiq_uapi2_sysctl_enableAxlib to force off RK AE.
  rk_aiq_uapi2_customAE_enable((const rk_aiq_sys_ctx_t*)(ctx->camgroup_ctx),
true);
// Prepare the ISP pipeline and configure initialization parameters such as ISP and Sensor
// If necessary, you can call the module API before prepare to modify the module initialization parameters, otherwise the initialization parameters are specified by the IQ file, or are specified by hard code in AIQ, or the chip reset value
 if (!group_mode) {
      rk_aiq_uapi2_sysctl_prepare(ctx->aiq_ctx, ctx->width, ctx->height,
work_mode);
      rk_aiq_uapi2_sysctl_start(ctx->aiq_ctx );
 } else {
      rk_aiq_uapi2_camgroup_prepare(ctx->camgroup_ctx, work_mode);
      ret = rk_aiq_uapi2_camgroup_start(ctx->camgroup_ctx);
 }
// Turn on the VI data flow and note that no AIQ library interfaces are called in this section.
start_capturing(ctx);
......
// AIQ internal thread loop work: obtain 3A statistics from the driver, call each algorithm library to calculate new ISP parameters, sensor parameters, etc., and issue new parameters to ISP drivers and sensor drivers.
// This procedure calls the API to set parameters for each algorithm module
......
// Stop the data flow first on exit
stop_capturing(ctx);
// Stop AIQ ctx or Group ctx
 if (!group_mode)
       rk_aiq_uapi2_sysctl_stop(ctx->aiq_ctx, false);
else
       rk_aiq_uapi2_camgroup_stop(ctx->camgroup_ctx);
// Anti-register third-party AEs
 rk_aiq_uapi2_customAE_unRegister(ctx->aiq_ctx);
// Deinitialize AIQ ctx or Group ctx
 if (!group_mode)
        rk_aiq_uapi2_sysctl_deinit(ctx->aiq_ctx);
else
       rk_aiq_uapi2_camgroup_destroy(ctx->camgroup_ctx);
```

<!-- Source EN PDF p.8, block 24 -->

#### 1.4.2 Внутренний процесс работы

<!-- Source EN PDF p.8, block 25 -->

Внутренняя работа AIQ показана ниже:

<!-- Source EN PDF p.9, block 26 -->

![Технический рисунок английского исходника, PDF p.9](/docs/rockchip-isp30-3a/assets/en-p09-figure1.png)

*Технический рисунок английского исходника, PDF p.9.*

<!-- Source EN PDF p.9, block 27 -->

Поток получения статистики: непрерывно получает статистику 3A от драйвера ISP и передаёт её потоку вычислений 3A.

<!-- Source EN PDF p.9, block 28 -->

Поток вычислений 3A: после получения статистики вызывает алгоритмы модулей (включая обратные вызовы сторонних алгоритмов), вычисляет новые параметры и передаёт их потоку настройки параметров ISP и потоку SOF.

<!-- Source EN PDF p.9, block 30 -->

Поток настройки параметров ISP: получив новый запрос настройки, в подходящий момент передаёт его драйверу ISP.

<!-- Source EN PDF p.9, block 31 -->

Поток SOF: обработчик события начала кадра Sensor; принимает новый запрос экспозиции, извлекает новые параметры экспозиции из очереди и передаёт их драйверу Sensor.

<!-- Source EN PDF p.10, block 32 -->

## 2 Руководство разработчика

<!-- Source EN PDF p.10, block 33 -->

### 2.1 Регистрация алгоритма AE

<!-- Source EN PDF p.10, block 34 -->

Процесс подключения AE включает регистрацию через rk_aiq_uapi_customAE_register, включение через rk_aiq_uapi_customAE_enable и отмену регистрации через rk_aiq_uapi_customAE_unRegister (имена сохранены из этого абзаца; прототипы далее используют uapi2).

<!-- Source EN PDF p.10, block 35 -->

#### 2.1.1 rk_aiq_uapi2_customAE_register

<!-- Source EN PDF p.10, block 36 -->

【Описание】Регистрация библиотеки алгоритма AE.

<!-- Source EN PDF p.10, block 37 -->

【Синтаксис】

<!-- Source EN PDF p.10, block 38 -->

```text
XCamReturn
rk_aiq_uapi2_customAE_register(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_customeAe_cbs_t* cbs)
```

<!-- Source EN PDF p.10, block 39 -->

【Параметры】

<!-- Source EN PDF p.10, block 40 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ для одиночной камеры и кругового обзора | Вход |
| cbs | Указатель обратного вызова |  |

<!-- Source EN PDF p.10, block 41 -->

【Возвращаемое значение】

<!-- Source EN PDF p.10, block 42 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успех |
| Не 0 | Ошибка, см. таблицу кодов ошибок |

<!-- Source EN PDF p.11, block 43 -->

#### 2.1.2 rk_aiq_uapi2_customAE_enable

<!-- Source EN PDF p.11, block 44 -->

【Описание】Регистрация библиотеки алгоритма AE.

<!-- Source EN PDF p.11, block 45 -->

【Синтаксис】

<!-- Source EN PDF p.11, block 46 -->

```text
XCamReturn
rk_aiq_uapi2_customAE_enable(const rk_aiq_sys_ctx_t* ctx, bool enable);
```

<!-- Source EN PDF p.11, block 47 -->

【Параметры】

<!-- Source EN PDF p.11, block 48 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ для одиночной камеры и кругового обзора | Вход |
| enable | Бит включения алгоритма AE | Вход |

<!-- Source EN PDF p.11, block 49 -->

【Возвращаемое значение】

<!-- Source EN PDF p.11, block 50 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успех |
| Не 0 | Ошибка, см. таблицу кодов ошибок |

<!-- Source EN PDF p.11, block 51 -->

#### 2.1.3 rk_aiq_uapi2_customAE_unRegister

<!-- Source EN PDF p.11, block 52 -->

【Описание】Регистрация библиотеки алгоритма AE.

<!-- Source EN PDF p.11, block 53 -->

【Синтаксис】

<!-- Source EN PDF p.11, block 54 -->

```text
XCamReturn
rk_aiq_uapi2_customAE_unRegister(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.11, block 55 -->

【Параметры】

<!-- Source EN PDF p.11, block 56 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ для одиночной камеры и кругового обзора | Вход |

<!-- Source EN PDF p.11, block 57 -->

【Возвращаемое значение】

<!-- Source EN PDF p.12, block 58 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успех |
| Не 0 | Ошибка, см. таблицу кодов ошибок |

<!-- Source EN PDF p.12, block 59 -->

#### 2.1.4 Обратные вызовы и типы данных

<!-- Source EN PDF p.12, block 60 -->

В собственной библиотеке AE пользователь должен реализовать следующие обратные вызовы:

<!-- Source EN PDF p.12, block 61 -->

```text
rk_aiq_customeAe_cbs_t cbs = {
.pfn_ae_init = custom_ae_init,
.pfn_ae_run = custom_ae_run,
.pfn_ae_ctrl = custom_ae_ctrl,
.pfn_ae_exit = custom_ae_exit,
};
```

<!-- Source EN PDF p.12, block 62 -->

| Имя поля | Описание |
|---|---|
| pfn_ae_init | Указатель обратного вызова инициализации AE |
| pfn_ae_run | Указатель обратного вызова выполнения AE |
| pfn_ae_ctrl | Указатель обратного вызова управления внутренним состоянием AE (параметр временно недействителен) |
| pfn_ae_exit | Указатель обратного вызова завершения AE |

<!-- Source EN PDF p.12, block 63 -->

##### 2.1.4.1 custom_ae_init

<!-- Source EN PDF p.12, block 64 -->

【Описание】Инициализация библиотеки алгоритма AE.

<!-- Source EN PDF p.12, block 65 -->

【Синтаксис】

<!-- Source EN PDF p.12, block 66 -->

```text
int32_t custom_ae_init(void* ctx);
```

<!-- Source EN PDF p.12, block 67 -->

【Параметры】

<!-- Source EN PDF p.12, block 68 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ для одиночной камеры и кругового обзора | Вход |

<!-- Source EN PDF p.12, block 69 -->

【Возвращаемое значение】

<!-- Source EN PDF p.13, block 70 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успех |
| Не 0 | Ошибка, см. таблицу кодов ошибок |

<!-- Source EN PDF p.13, block 71 -->

##### 2.1.4.2 custom_ae_run

<!-- Source EN PDF p.13, block 72 -->

【Описание】Выполнение алгоритма AE для расчёта времени экспозиции и усиления Sensor, цифрового усиления ISP и обновления параметров конфигурации аппаратуры.

<!-- Source EN PDF p.13, block 73 -->

【Синтаксис】

<!-- Source EN PDF p.13, block 74 -->

```text
int32_t custom_ae_run(void* ctx, const rk_aiq_customAe_stats_t* pstAeInfo,
                      rk_aiq_customeAe_results_t* pstAeResult);
```

<!-- Source EN PDF p.13, block 75 -->

【Параметры】

<!-- Source EN PDF p.13, block 76 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ для одиночной камеры и кругового обзора | Вход |
| pstAeInfo | Указатель входных данных: аппаратная статистика AE и синхронизированные сведения об экспозиции; вход |  |
| pstAeResult | Указатель выходного результата алгоритма: параметры экспозиции Sensor и обновлённая аппаратная конфигурация | Выход |

<!-- Source EN PDF p.13, block 77 -->

【Возвращаемое значение】

<!-- Source EN PDF p.13, block 78 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успех |
| Не 0 | Ошибка, см. таблицу кодов ошибок |

<!-- Source EN PDF p.13, block 79 -->

##### 2.1.4.3 custom_ae_ctrl

<!-- Source EN PDF p.13, block 80 -->

【Описание】Изменение внутреннего состояния библиотеки алгоритма; временно недоступно.

<!-- Source EN PDF p.13, block 81 -->

【Синтаксис】

<!-- Source EN PDF p.13, block 82 -->

```text
int32_t custom_ae_ctrl(void* ctx, uint32_t u32Cmd, void *pValue);
```

<!-- Source EN PDF p.13, block 83 -->

【Параметры】

<!-- Source EN PDF p.14, block 84 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ для одиночной камеры и кругового обзора | Вход |

<!-- Source EN PDF p.14, block 85 -->

【Возвращаемое значение】

<!-- Source EN PDF p.14, block 86 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успех |
| Не 0 | Ошибка, см. таблицу кодов ошибок |

<!-- Source EN PDF p.14, block 87 -->

##### 2.1.4.4 custom_ae_exit

<!-- Source EN PDF p.14, block 88 -->

【Описание】Отмена регистрации библиотеки алгоритма AE.

<!-- Source EN PDF p.14, block 89 -->

【Синтаксис】

<!-- Source EN PDF p.14, block 90 -->

```text
int32_t custom_ae_exit(void* ctx)；
```

<!-- Source EN PDF p.14, block 91 -->

【Параметры】

<!-- Source EN PDF p.14, block 92 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ для одиночной камеры и кругового обзора | Вход |

<!-- Source EN PDF p.14, block 93 -->

【Возвращаемое значение】

<!-- Source EN PDF p.14, block 94 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успех |
| Не 0 | Ошибка, см. таблицу кодов ошибок |

<!-- Source EN PDF p.14, block 95 -->

#### 2.1.5 Входные данные

<!-- Source EN PDF p.14, block 96 -->

【Описание】

<!-- Source EN PDF p.14, block 97 -->

Входные данные стороннего AE включают статистику яркости изображения и соответствующие параметры экспозиции; поддерживаются одиночная камера и круговой обзор. 【Определение】

<!-- Source EN PDF p.15, block 98 -->

```text
#define RK_AIQ_MAX_HDR_FRAME (3)
typedef struct rk_aiq_customAe_stats_s
{
    //hw stats
    Aec_Stat_Res_t rawae_stat[RK_AIQ_MAX_HDR_FRAME]; // before awb gain
    Aec_Stat_Res_t extra; // after awb gain, lsc, TMO
    //exposure
    RkAiqExpParamComb_t linear_exp;
    RkAiqExpParamComb_t hdr_exp[RK_AIQ_MAX_HDR_FRAME];
    struct rk_aiq_customAe_stats_s* next; // for surround view(multiple cams)
} rk_aiq_customAe_stats_t;
```

<!-- Source EN PDF p.15, block 99 -->

【Поля】

<!-- Source EN PDF p.15, block 100 -->

| Имя поля | Описание |
|---|---|
| rawae_stat[RK_AIQ_MAX_HDR_FRAME] | Аппаратная статистика до обработки RAW, максимум для 3 кадров. При линейной экспозиции действует только rawae_stat[0]; в HDR rawae_stat[0-2] соответствуют короткому, среднему и длинному кадрам. |
| extra | Аппаратная статистика после обработки RAW; в HDR соответствует объединённому кадру. |
| linear_exp | Параметры линейной экспозиции, синхронизированные с аппаратной статистикой. |
| hdr_exp[RK_AIQ_MAX_HDR_FRAME] | Параметры экспозиции HDR, синхронизированные с аппаратной статистикой; 0~2 соответствуют короткому, среднему и длинному кадрам. |
| next | Действует только для многокамерного кругового обзора; указывает на входные данные следующей камеры. Состав входных полей у камер одинаков. |

<!-- Source EN PDF p.15, block 101 -->

【Описание】

<!-- Source EN PDF p.15, block 102 -->

Входные параметры делятся на аппаратную статистику изображения и соответствующие изображению параметры экспозиции.

<!-- Source EN PDF p.15, block 103 -->

Входные параметры совместимы с одиночной камерой и многокамерным круговым обзором; данные нескольких камер доступны через указатель next.

<!-- Source EN PDF p.15, block 104 -->

Тип аппаратной статистики изображения — Aec_Stat_Res_t, тип информации об экспозиции — RkAiqExpParamComb_t. Подробности приведены в Rockchip_Development_Guide_ISP30.

<!-- Source EN PDF p.15, block 105 -->

RK_AIQ_MAX_HDR_FRAME означает поддержку RK максимум 3 кадров HDR.

<!-- Source EN PDF p.16, block 106 -->

#### 2.1.6 Выходные результаты алгоритма

<!-- Source EN PDF p.16, block 107 -->

【Описание】

<!-- Source EN PDF p.16, block 108 -->

Выход стороннего AE включает параметры экспозиции, аппаратные параметры и другие данные; поддерживаются одиночная камера и круговой обзор.

<!-- Source EN PDF p.16, block 109 -->

【Определение】

<!-- Source EN PDF p.16, block 110 -->

```text
#define RK_AIQ_MAX_HDR_FRAME (3)
typedef struct rk_aiq_i2c_data_s {
    bool bValid;
    unsigned int nNumRegs;
    unsigned int* pRegAddr;
    unsigned int* pRegValue;
    unsigned int* pDelayFrames;
} rk_aiq_i2c_data_t;
typedef struct rk_aiq_customeAe_results_singel_s
{
    //exposure result (including:reg value & real value)
    RkAiqExpParamComb_t linear_exp;
    RkAiqExpParamComb_t hdr_exp[RK_AIQ_MAX_HDR_FRAME];
    rk_aiq_i2c_data_t exp_i2c_params;
    //hw result
    struct window meas_win;
    unsigned char meas_weight[15 * 15];
    struct rk_aiq_customeAe_results_singel_s* next; // for surround view(multiple
cams)
} rk_aiq_customeAe_results_single_t;
typedef struct rk_aiq_customeAe_results_s
{
    //exposure result (including:reg value & real value)
    RkAiqExpParamComb_t linear_exp;
    RkAiqExpParamComb_t hdr_exp[RK_AIQ_MAX_HDR_FRAME];
    rk_aiq_i2c_data_t exp_i2c_params;
    //hw result
    struct window meas_win;
    unsigned char meas_weight[15 * 15];
    RkAiqIrisParamComb_t Iris;
    uint32_t frame_length_lines;
    bool is_longfrm_mode;
    struct rk_aiq_customeAe_results_singel_s* next; // for surround view(multiple
cams)
} rk_aiq_customeAe_results_t;
```

<!-- Source EN PDF p.16, block 111 -->

【Поля】

<!-- Source EN PDF p.17, block 112 -->

| Имя поля | Вложенные поля | Описание |
|---|---|---|
| linear_exp | exp_real_params<br>exp_sensor_params | Параметры линейной экспозиции: фактические значения exp_real_params и регистровые значения формата RK exp_sensor_params. |
| hdr_exp[RK_AIQ_MAX_HDR_FRAME] | exp_real_params<br>exp_sensor_params | Параметры HDR: фактические значения exp_real_params и регистровые значения RK exp_sensor_params. 0~2 соответствуют короткому, среднему и длинному кадрам; для HDR2 действуют 0 и 1, для HDR3 — 0–2. |
| exp_i2c_params | bValid nNumRegs<br>pRegAddr<br>pRegValue<br>pDelayFrames | При bValid=true значения регистров I2C задаются через exp_i2c_params; при false используются регистровые параметры формата RK из linear_exp или hdr_exp. |
| frame_length_lines |  | Значение VTS сенсора, связанное с настройкой частоты кадров. |
| is_longfrm_mode |  | Бит режима длинного кадра: true — включён, false — выключен; действует только в HDR. |
| Iris | PIris DCIris | Параметры диафрагмы, включая P-Iris и DC-Iris. |
| meas_win | h_offs<br>v_offs<br>h_size<br>v_size | Область окна аппаратной статистики. h/v_offs — горизонтальное/вертикальное смещение левого верхнего угла окна относительно светочувствительной области; h/v_size — горизонтальный/вертикальный размер окна. |
| meas_weight |  | Веса аппаратной статистики: 15X15 параметров, диапазон 0~32. |
| next |  | Вне кругового обзора указатель должен быть пустым. Если всем камерам нужен одинаковый результат, он также пуст: задаётся только rk_aiq_customeAe_results_t, используемый всеми камерами. Для разных результатов выделите память для next и добавьте результат следующей камеры. |

<!-- Source EN PDF p.18, block 114 -->

【Предостережения】

<!-- Source EN PDF p.18, block 115 -->

Выходные результаты совместимы с одиночной камерой и многокамерным круговым обзором. Для кругового обзора поддерживаются как единый, так и отдельные результаты алгоритма.

<!-- Source EN PDF p.18, block 116 -->

meas_win задаёт область окна аппаратной статистики AE; статистика яркости блоков и гистограмма рассчитываются по этой области. Для многокадровой экспозиции HDR окно по умолчанию одинаково для всех кадров.

<!-- Source EN PDF p.18, block 117 -->

meas_weight — веса для взвешенной гистограммы; обычно они совпадают с программными весами при вычислении взвешенного среднего яркости блоков.

<!-- Source EN PDF p.18, block 118 -->

При настройке экспозиции задаются фактическое значение и соответствующее значение регистра. Для других алгоритмов фактические значения включают время экспозиции (секунды), усиление (множитель) и состояние DCG (0:LCG, 1:HCG). Регистровые значения взаимодействуют с Sensor и поддерживают форматы RK и сторонних разработчиков.

<!-- Source EN PDF p.18, block 119 -->

Регистровые значения экспозиции формата RK пользователь не задаёт: они преобразуются внутри из фактической экспозиции; bValid в exp_i2c_params должен быть false. Для стороннего формата пользователь задаёт значения регистров и адреса, а bValid должен быть true.

<!-- Source EN PDF p.18, block 120 -->

Если всем камерам кругового обзора требуются одинаковые экспозиция и аппаратные настройки, задаётся только rk_aiq_customeAe_results_t, а next пуст. Для разных настроек результаты задаются последовательно, с выделением памяти и указателем next на результат следующей камеры. rk_aiq_customeAe_results_t и rk_aiq_customeAe_results_single_t различаются: первый содержит дополнительные общие параметры результатов, по умолчанию одинаковые для всех камер.

<!-- Source EN PDF p.19, block 121 -->

Тип аппаратной статистики — Aec_Stat_Res_t, тип экспозиции RK — RkAiqExpParamComb_t, тип параметров диафрагмы RK — RkAiqIrisParamComb_t. Подробнее см. Rockchip_Development_Guide_ISP30.

<!-- Source EN PDF p.19, block 122 -->

### 2.2 Регистрация алгоритма AWB

<!-- Source EN PDF p.19, block 123 -->

Алгоритм RK AWB предоставляет функцию rk_aiq_uapi_customAWB_register. Пользователь вызывает её для регистрации собственного AWB в ISP, аналогично регистрации AE, затем включает его через rk_aiq_uapi_customAWB_enable.

<!-- Source EN PDF p.19, block 124 -->

Для успешного переноса рекомендуется ознакомиться со следующим:

<!-- Source EN PDF p.19, block 125 -->

(1) Следующие материалы Rockchip_Color_Optimization_Guide:

<!-- Source EN PDF p.19, block 126 -->

(a) Раздел «2 AWB/2.1 Описание функции» и схема AWB.

<!-- Source EN PDF p.19, block 127 -->

(b) Схема обнаружения белых точек AWB в разделе «2 AWB/2.2 Ключевые параметры/аппаратное обнаружение белых точек».

<!-- Source EN PDF p.19, block 128 -->

(2) Раздел «Статистика/Типы данных/rk_aiq_isp_awb_stats2_v3x_t» документа Rockchip_Development_Guide_ISP30.

<!-- Source EN PDF p.19, block 129 -->

#### 2.2.1 API

<!-- Source EN PDF p.19, block 130 -->

##### 2.2.1.1 rk_aiq_uapi_customAWB_register

<!-- Source EN PDF p.19, block 131 -->

【Описание】Регистрация собственного алгоритма AWB.

<!-- Source EN PDF p.19, block 132 -->

【Синтаксис】

<!-- Source EN PDF p.19, block 133 -->

```text
XCamReturn
rk_aiq_uapi_customAWB_register(const rk_aiq_sys_ctx_t* ctx,
rk_aiq_customeAwb_cbs_t* cbs);
```

<!-- Source EN PDF p.19, block 134 -->

【Параметры】

<!-- Source EN PDF p.19, block 135 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| cbs | Обратные вызовы собственного AWB, регистрируемые в ISP; см. rk_aiq_customeAwb_cbs_t ниже; вход. |  |

<!-- Source EN PDF p.19, block 136 -->

【Возвращаемое значение】

<!-- Source EN PDF p.20, block 137 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успех |
| Не 0 | Ошибка, см. таблицу кодов ошибок |

<!-- Source EN PDF p.20, block 138 -->

【Примечание】

<!-- Source EN PDF p.20, block 139 -->

Сначала необходимо вызвать rk_aiq_uapi_sysctl_init для инициализации указателя контекста AIQ ctx.

<!-- Source EN PDF p.20, block 140 -->

【Требования】

<!-- Source EN PDF p.20, block 141 -->

Заголовочный файл: rk_aiq_user_api_custom_awb.h

<!-- Source EN PDF p.20, block 142 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.20, block 143 -->

##### 2.2.1.2 rk_aiq_uapi_customAWB_enable

<!-- Source EN PDF p.20, block 144 -->

【Описание】Включение собственного алгоритма AWB.

<!-- Source EN PDF p.20, block 145 -->

【Синтаксис】

<!-- Source EN PDF p.20, block 146 -->

```text
XCamReturn
rk_aiq_uapi_customAWB_enable(const rk_aiq_sys_ctx_t* ctx, bool enable);
```

<!-- Source EN PDF p.20, block 147 -->

【Параметры】

<!-- Source EN PDF p.20, block 148 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |
| enable | Включение собственного AWB; значения true / false; по умолчанию false. | Вход |

<!-- Source EN PDF p.20, block 149 -->

【Возвращаемое значение】

<!-- Source EN PDF p.20, block 150 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успех |
| Не 0 | Ошибка, см. таблицу кодов ошибок |

<!-- Source EN PDF p.20, block 151 -->

【Примечание】

<!-- Source EN PDF p.20, block 152 -->

Вызывается после завершения регистрации собственного AWB через rk_aiq_uapi_customAWB_register.

<!-- Source EN PDF p.20, block 153 -->

【Требования】

<!-- Source EN PDF p.20, block 154 -->

Заголовочный файл: rk_aiq_user_api_custom_awb.h

<!-- Source EN PDF p.20, block 155 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.21, block 156 -->

##### 2.2.1.3 rk_aiq_uapi_customAWB_unRegister

<!-- Source EN PDF p.21, block 157 -->

【Описание】Отмена регистрации собственного алгоритма AWB.

<!-- Source EN PDF p.21, block 158 -->

【Синтаксис】

<!-- Source EN PDF p.21, block 159 -->

```text
XCamReturn
rk_aiq_uapi_customAWB_unRegister(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.21, block 160 -->

【Параметры】

<!-- Source EN PDF p.21, block 161 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| ctx | Указатель контекста AIQ | Вход |

<!-- Source EN PDF p.21, block 162 -->

【Возвращаемое значение】

<!-- Source EN PDF p.21, block 163 -->

| Возвращаемое значение | Описание |
|---|---|
| 0 | Успех |
| Не 0 | Ошибка, см. таблицу кодов ошибок |

<!-- Source EN PDF p.21, block 164 -->

【Примечание】

<!-- Source EN PDF p.21, block 165 -->

Вызывается после завершения регистрации собственного AWB через rk_aiq_uapi_customAWB_register.

<!-- Source EN PDF p.21, block 166 -->

【Требования】

<!-- Source EN PDF p.21, block 167 -->

Заголовочный файл: rk_aiq_user_api_custom_awb.h

<!-- Source EN PDF p.21, block 168 -->

Библиотека: librkaiq.so

<!-- Source EN PDF p.21, block 169 -->

#### 2.2.2 Типы данных

<!-- Source EN PDF p.21, block 170 -->

##### 2.2.2.1 Обратные вызовы, регистрируемые в библиотеке ISP

<!-- Source EN PDF p.21, block 171 -->

###### 2.2.2.1.1 rk_aiq_customeAwb_cbs_t

<!-- Source EN PDF p.21, block 172 -->

【Описание】Определяет обратные вызовы собственного AWB, регистрируемые в библиотеке ISP.

<!-- Source EN PDF p.21, block 173 -->

【Определение】

<!-- Source EN PDF p.22, block 174 -->

```text
typedef struct rk_aiq_customeAwb_cbs_s
{
    int32_t (*pfn_awb_init)(void* ctx);
    int32_t (*pfn_awb_run)(void* ctx, const rk_aiq_customAwb_stats_t* pstAwbInfo,
rk_aiq_customeAwb_results_t* pstAwbResult);
    int32_t (*pfn_awb_run)(void* ctx, uint32_t u32Cmd, void *pValue);
    int32_t (*pfn_awb_exit)(void* ctx);
} rk_aiq_customeAwb_cbs_t;
```

<!-- Source EN PDF p.22, block 175 -->

【Поля】

<!-- Source EN PDF p.22, block 176 -->

| Имя поля | Описание |
|---|---|
| pfn_awb_init | Инициализация; первый вызов выполняется из AwbDemoPrepare. |
| pfn_awb_ctrl | Обратный вызов управления внутренним состоянием собственного AWB; пока не поддерживается. |
| pfn_awb_run | Обратный вызов собственного AWB; см. rk_aiq_customAwb_stats_t и rk_aiq_customeAwb_results_t ниже. По исходнику pstAwbResult==nullptr означает инициализацию для настройки pstAwbResult; иначе результат вычисляется по pstAwbInfo. При одинаковых настройках камер кругового обзора используется эта схема; при разных задаются pstAwbResult->next (камера 1), pstAwbResult->next->next (камера 2) и далее. pstAwbResult соответствует камере 0. |
| pfn_awb_exit | Освобождение выделенной памяти и других ресурсов; вызывается из AwbDemoDestroyCtx. |

<!-- Source EN PDF p.22, block 177 -->

【Примечание】

<!-- Source EN PDF p.22, block 178 -->

Пользователь должен реализовать указанные обратные вызовы в собственной библиотеке AWB.

<!-- Source EN PDF p.22, block 179 -->

Для реализации pfn_awb_run можно использовать псевдокод функции custom_awb_run в third_party_awb_algo.cpp.

<!-- Source EN PDF p.22, block 180 -->

##### 2.2.2.2 Статистика

<!-- Source EN PDF p.22, block 181 -->

###### 2.2.2.2.1 rk_aiq_customAwb_stats_t

<!-- Source EN PDF p.22, block 182 -->

【Описание】Определяет аппаратную статистику баланса белого, получаемую собственным AWB.

<!-- Source EN PDF p.22, block 183 -->

【Определение】

<!-- Source EN PDF p.23, block 184 -->

```text
typedef struct rk_aiq_customAwb_stats_s
{
    rk_aiq_awb_stat_wp_res_light_v201_t light[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    int WpNo2[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    rk_aiq_awb_stat_blk_res_v201_t blockResult[RK_AIQ_AWB_GRID_NUM_TOTAL];
    rk_aiq_awb_stat_wp_res_light_v201_t multiwindowLightResult[4];
    rk_aiq_awb_stat_wp_res_v201_t
excWpRangeResult[RK_AIQ_AWB_STAT_WP_RANGE_NUM_V201];
    unsigned int WpNoHist[RK_AIQ_AWB_WP_HIST_BIN_NUM];
    struct rk_aiq_customAwb_stats_s* next;
} rk_aiq_customAwb_stats_t;
```

<!-- Source EN PDF p.23, block 185 -->

【Поля】

<!-- Source EN PDF p.23, block 186 -->

| Имя поля | Описание |
|---|---|
| light | Статистика белых точек разных источников в главном окне; максимум RK_AIQ_AWB_MAX_WHITEREGIONS_NUM источников. |
| WpNo2 | Число белых точек пересечения XY и UV для разных источников в главном окне, без дробных разрядов. |
| blockResult | Накопленные значения RGB каждого блока; изображение равномерно разделено на 15x15 (RK_AIQ_AWB_GRID_NUM_TOTAL) блоков. |
| multiwindowLightResult | Статистика белых точек разных источников в подокнах: записываются первые 4 источника, все можно учитывать с временным мультиплексированием; максимум 4 подокна. |
| excWpRangeResult | Статистика точек в excludeWpRange: учитываются только первые 4 области, максимум 4. |
| WpNoHist | Число белых точек в каждом bin гистограммы, без дробных разрядов. Выбор области XY определяется xyRangeTypeForWpHist; повторяющееся описание типов рамок в исходнике не уточняется предположениями. |
| next | Действует только для многокамерного кругового обзора; указывает на аппаратную статистику баланса белого следующей камеры. |

<!-- Source EN PDF p.23, block 187 -->

【Примечание】

<!-- Source EN PDF p.23, block 188 -->

Подробности полей см. в определении структуры rk_aiq_isp_awb_stats2_v3x_t раздела «Статистика/Типы данных» документа Rockchip_Development_Guide_ISP30.

<!-- Source EN PDF p.24, block 189 -->

##### 2.2.2.3 Результаты вычислений

<!-- Source EN PDF p.24, block 190 -->

###### 2.2.2.3.1 rk_aiq_customeAwb_results_t

<!-- Source EN PDF p.24, block 191 -->

【Описание】Определяет параметры конфигурации и результаты вычисления собственного AWB.

<!-- Source EN PDF p.24, block 192 -->

【Определение】

<!-- Source EN PDF p.24, block 193 -->

```text
typedef struct rk_aiq_customeAwb_results_s
{
    bool IsConverged; true: converged; false: not converged
    rk_aiq_wb_gain_t awb_gain_algo;
    float awb_smooth_factor;
    rk_aiq_customAwb_hw_cfg_t awbHwConfig;
    rk_aiq_customeAwb_single_results_t *next;//defalut vaue is nullptr,which means all cameras with the same cfg;
} rk_aiq_customeAwb_results_t;
```

<!-- Source EN PDF p.24, block 194 -->

【Поля】

<!-- Source EN PDF p.25, block 195 -->

| Имя поля | Описание |
|---|---|
| IsConverged | Сходимость текущего AWBgain: true — достигнута, false — нет; по умолчанию false; настройка обязательна. |
| awb_gain_algo | Усиление каналов R, GR, GB, B, рассчитанное собственным AWB; по умолчанию {1.0, 1.0, 1.0, 1.0}, без коррекции баланса белого; настройка обязательна. |
| awb_smooth_factor | Межкадровый коэффициент сглаживания для CCM и LSC: большее значение уменьшает вес текущего кадра; диапазон [0,1], по умолчанию 0.5; можно не задавать. |
| awbHwConfig | Аппаратные настройки собственного AWB: большинство параметров и параметры модуля нужно задать корректно; остальные имеют значения по умолчанию и могут не обновляться. См. rk_aiq_customAwb_hw_cfg_t ниже. |
| next | Вне кругового обзора не требуется. При одинаковых результатах указатель пуст, все камеры используют rk_aiq_customeAwb_results_t. Для разных полей rk_aiq_customeAwb_single_results_t выделите память для next и добавьте результат следующей камеры; соответствующие поля заменят значения rk_aiq_customeAwb_results_t. Определение типа приведено ниже. |

<!-- Source EN PDF p.25, block 196 -->

###### 2.2.2.3.2 rk_aiq_customeAwb_single_results_t

<!-- Source EN PDF p.25, block 197 -->

【Описание】Определяет настройки и результаты собственного AWB для каждой камеры кругового обзора; вне режима кругового обзора не требуется.

<!-- Source EN PDF p.25, block 198 -->

【Определение】

<!-- Source EN PDF p.25, block 199 -->

```text
typedef struct rk_aiq_customeAwb_single_results_s
{
    rk_aiq_wb_gain_t awb_gain_algo;//for each camera
    rk_aiq_customAwb_single_hw_cfg_t awbHwConfig;//for each camera
    struct rk_aiq_customeAwb_single_results_s *next;
} rk_aiq_customeAwb_single_results_t;
```

<!-- Source EN PDF p.25, block 200 -->

【Поля】

<!-- Source EN PDF p.26, block 201 -->

| Имя поля | Описание |
|---|---|
| awb_gain_algo | Как awb_gain_algo в rk_aiq_customeAwb_results_s. |
| awbHwConfig | Как одноимённое поле структуры awbHwConfig в rk_aiq_customeAwb_results_s. |
| next | В исходнике указано «Useless» и дана ссылка на смысл поля next (написано anext) в rk_aiq_customeAwb_results_s; формулировка неоднозначна. |

<!-- Source EN PDF p.26, block 202 -->

###### 2.2.2.3.3 rk_aiq_wb_gain_t

<!-- Source EN PDF p.26, block 203 -->

Определение rk_aiq_wb_gain_t см. в разделе «AWB/API уровня функций/Типы данных» документа Rockchip_Development_Guide_ISP32 (исходник ссылается именно на ISP32).

<!-- Source EN PDF p.26, block 204 -->

###### 2.2.2.3.4 rk_aiq_customAwb_hw_cfg_t

<!-- Source EN PDF p.26, block 205 -->

【Описание】Определяет аппаратную конфигурацию собственного AWB: главное и дополнительные окна, выбор кадра статистики и другие настройки.

<!-- Source EN PDF p.26, block 206 -->

【Определение】

<!-- Source EN PDF p.26, block 207 -->

```text
typedef struct rk_aiq_customAwb_hw_cfg_s {
    bool awbEnable;
    bool lscBypEnable;
    uint8_t frameChoose;
    unsigned short windowSet[4];
    unsigned char lightNum;
    unsigned short maxR;
    unsigned short minR;
    unsigned short maxG;
    unsigned short minG;
    unsigned short maxB;
    unsigned short minB;
    unsigned short maxY;
    unsigned short minY;
    bool uvDetectionEnable;
    rk_aiq_awb_uv_range_para_t uvRange_param[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    bool xyDetectionEnable;
    rk_aiq_rgb2xy_para_t rgb2xy_param;
    rk_aiq_awb_xy_range_para_t xyRange_param[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
    bool threeDyuvEnable;
    unsigned short threeDyuvIllu[RK_AIQ_AWB_YUV_LS_PARA_NUM];
    short icrgb2RYuv_matrix[12];
    rk_aiq_awb_rt3dyuv_range_para_t
ic3Dyuv2Range_param[RK_AIQ_AWB_YUV_LS_PARA_NUM];
    bool multiwindow_en;
    unsigned short multiwindow[RK_AIQ_AWB_MULTIWINDOW_NUM_V201][4];
} rk_aiq_customAwb_hw_cfg_t;
```

<!-- Source EN PDF p.26, block 208 -->

【Поля】

<!-- Source EN PDF p.27, block 209 -->

| Имя поля | Описание |
|---|---|
| awbEnable | Включение статистики AWB: true — включена, false — выключена; по умолчанию true. |
| lscBypEnable | Обход LSC для статистики AWB: true — без LSC, false — через LSC; по умолчанию false. |
| frameChoose | Входной кадр аппаратной статистики AWB: {0,1,2} — короткий, средний, длинный. По умолчанию 0 в линейном режиме и 1 в широком динамическом диапазоне. |
| windowSet | Главное окно AWB: windowSet=[h_offset,v_offset,h_size,v_size], h — горизонталь, v — вертикаль; диапазон [0x0, 0xfff]; h_size* v_size должно быть меньше 5120*2880. По умолчанию {0, 0, RawWidth, RawHeight}, полное окно; без изменения окна настройка не нужна. |
| lightNum | Число учитываемых источников: [0, 7], по умолчанию 7. Задаётся по числу источников калибровки, выдаваемому инструментом. |
| maxR | При статистике белых точек RGB верхняя граница канала R; диапазон [0x0, 0xff], по умолчанию 230. |
| minR | При статистике белых точек RGB нижняя граница канала R; диапазон [0x0, 0xff], по умолчанию 3. |
| maxG | При статистике белых точек RGB верхняя граница канала G; диапазон [0x0, 0xff], по умолчанию 230. |
| minG | При статистике белых точек RGB нижняя граница канала G; диапазон [0x0, 0xff], по умолчанию 3. |
| maxB | При статистике белых точек RGB верхняя граница канала B; диапазон [0x0, 0xff], по умолчанию 230. |
| minB | При статистике белых точек RGB нижняя граница канала B; диапазон [0x0, 0xff], по умолчанию 3. |
| maxY | При статистике белых точек RGB верхняя граница канала Y; диапазон [0x0, 0xff], по умолчанию 230. |
| minY | При статистике белых точек RGB нижняя граница канала Y; диапазон [0x0, 0xff], по умолчанию 3. |
| uvDetectionEnable | Обнаружение белых точек UV: при true белыми считаются точки внутри области, при false — все точки; по умолчанию true. |
| uvRange_param | Границы четырёхугольной области UV, максимум 7 источников. Зависят от модуля и должны быть корректны при uvDetectionEnable=ture (исходное написание). Параметры до перевода в фиксированную точку выдаёт инструмент калибровки; см. rk_aiq_awb_uv_range_para_t. |
| xyDetectionEnable | Обнаружение белых точек XY: при true белыми считаются точки внутри области, при false — все точки; по умолчанию true. |
| rgb2xy_param | Параметры преобразования RGB в XY зависят от модуля; при xyDetectionEnable=true должны быть корректны. Инструмент калибровки выдаёт параметры до фиксированной точки; см. rk_aiq_rgb2xy_para_t. |
| xyRange_param | Границы четырёхугольной области XY, максимум 7 источников. Зависят от модуля и должны быть корректны при xyDetectionEnable=true. Параметры до фиксированной точки выдаёт инструмент калибровки; см. rk_aiq_awb_xy_range_para_t. |
| threeDyuvEnable | Включение обнаружения белых точек YUV: true — включено, false — выключено; по умолчанию true. |
| threeDyuvIllu | Диапазон [0, 7]; 7 отключает обнаружение YUV (все точки белые), остальные числа включают соответствующий источник; по умолчанию {7, 7, 7, 7}. |
| icrgb2RYuv_matrix | Матрица поворота RGB в YUV зависит от модуля. Условие исходника «threeDyuvEnable and turethreeDyuvIllu is not 7» требует проверки по API. Диапазон последнего столбца [-2^12,2^12-1], остальных — [-2^9,2^9-1]; параметры до фиксированной точки выдаёт инструмент калибровки. |
| ic3Dyuv2Range_param | Ограничения белых точек YUV зависят от модуля; условие исходника такое же, как выше. Параметры до фиксированной точки выдаёт инструмент калибровки; см. rk_aiq_awb_rt3dyuv_range_para_t. |
| multiwindow_en | Включение многооконной статистики AWB: true — включена, false — выключена; по умолчанию false. |
| multiwindow | Многооконная настройка AWB, максимум 4 окна; multiwindow[i]=[h_offset,v_offset,h_size,v_size], h — горизонталь, v — вертикаль; диапазон [0x0, 0xfff]. |
| excludeWpRange | В UV или XY можно задать максимум 7 областей белых/небелых точек; первые 4 могут быть дополнительными областями белых точек. Зависят от модуля; см. rk_aiq_awb_exc_range_v201_t. |
| wpDiffWeiEnable | Включение весовой коррекции яркости белых точек: true — включена, false — выключена; по умолчанию false. |
| wpDiffwei_y | Интервалы гистограммы яркости белых точек имеют 9 границ, диапазон [0x0, 0xff]; расстояния между соседними wpDiffwei_y должны быть степенями 2. |
| wpDiffwei_w | Веса точек wpDiffwei_y: [0, 31], 5 дробных разрядов, по умолчанию 31. |
| xyRangeTypeForWpHist | Выбор средней или большой области гистограммы белых точек: RK_AIQ_AWB_XY_TYPE_NORMAL_V201 — средняя, RK_AIQ_AWB_XY_TYPE_BIG_V201 — большая; по умолчанию RK_AIQ_AWB_XY_TYPE_NORMAL_V201. |
| blkWeightEn | Включение весов блоков: исходник пишет «rue enabled», false — выключено; по умолчанию false. Ошибка написания отмечена. |
| blkWeight | Вес блока: [0,63], 6 дробных разрядов. |
| blkMeasureMode | Выбор всех точек блока либо только белых: RK_AIQ_AWB_BLK_STAT_MODE_ALL_V201 — все, RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201 — белые; по умолчанию RK_AIQ_AWB_BLK_STAT_MODE_ALL_V201. |
| xyRangeTypeForBlkStatistics | Действует только при blkMeasureMode=RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201. Выбирает белые точки средней или большой области: RK_AIQ_AWB_XY_TYPE_NORMAL_V201 либо RK_AIQ_AWB_XY_TYPE_BIG_V201; по умолчанию RK_AIQ_AWB_XY_TYPE_NORMAL_V201. |
| illIdxForBlkStatistics | Выбор источника белых точек, действующий только при blkMeasureMode=RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201. Значения: {RK_AIQ_AWB_BLK_STAT_REALWP_ILL0, RK_AIQ_AWB_BLK_STAT_REALWP_ILL1, RK_AIQ_AWB_BLK_STAT_REALWP_ILL2, RK_AIQ_AWB_BLK_STAT_REALWP_ILL3, RK_AIQ_AWB_BLK_STAT_REALWP_ILL4, RK_AIQ_AWB_BLK_STAT_REALWP_ILL5, RK_AIQ_AWB_BLK_STAT_REALWP_ILL6, RK_AIQ_AWB_BLK_STAT_REALWP_ALL}. |

<!-- Source EN PDF p.29, block 212 -->

【Примечание】

<!-- Source EN PDF p.29, block 213 -->

В исходнике указано, что параметры, отмеченные чёрным, могут использовать значения по умолчанию; эта формулировка сохранена, проверяйте также описание каждого параметра.

<!-- Source EN PDF p.29, block 214 -->

Для более глубокого понимания параметров см. следующие материалы Rockchip_Color_Optimization_Guide:

<!-- Source EN PDF p.29, block 215 -->

(a) Раздел «2 AWB/2.1 Описание функции» и схема AWB.

<!-- Source EN PDF p.29, block 216 -->

(b) Схема обнаружения белых точек AWB в разделе «2 AWB/2.2 Ключевые параметры/аппаратное обнаружение белых точек».

<!-- Source EN PDF p.29, block 217 -->

###### 2.2.2.3.5 rk_aiq_customAwb_hw_cfg_t

<!-- Source EN PDF p.29, block 218 -->

【Описание】Определяет отдельные аппаратные настройки каждой камеры кругового обзора; вне этого режима не требуется. Заголовок исходника повторяет имя предыдущей структуры; определение кода сохранено.

<!-- Source EN PDF p.29, block 219 -->

【Определение】

<!-- Source EN PDF p.29, block 220 -->

```text
typedef struct rk_aiq_customAwb_single_hw_cfg_t {
    unsigned short windowSet[4];
    bool multiwindow_en;
    unsigned short multiwindow[RK_AIQ_AWB_MULTIWINDOW_NUM_V201][4];
    bool blkWeightEnable;
    unsigned char blkWeight[RK_AIQ_AWB_GRID_NUM_TOTAL];
} rk_aiq_customAwb_single_hw_cfg_t;
```

<!-- Source EN PDF p.29, block 221 -->

【Поля】

<!-- Source EN PDF p.29, block 222 -->

| Имя поля | Описание |
|---|---|
| windowSet | Как windowSet в rk_aiq_customAwb_hw_cfg_t. |
| multiwindow_en | Как multiwindow_en в rk_aiq_customAwb_hw_cfg_t. |
| multiwindow | Как multiwindow в rk_aiq_customAwb_hw_cfg_t. |
| blkWeightEnable | В исходнике: «Tongke_Ike_Kustomab_Hall_Cob_T-Bulkwertnabul meaning». Надёжно восстановить смысл нельзя; требуется проверка. |
| blkWeight | В исходнике: «Tongke_Ike_Coustomab_Hall_Cove_Tur in Burkwaite meaning». Надёжно восстановить смысл нельзя; требуется проверка. |

<!-- Source EN PDF p.30, block 223 -->

###### 2.2.2.3.6 rk_aiq_awb_uv_range_para_t

<!-- Source EN PDF p.30, block 224 -->

【Описание】Определяет границы четырёхугольной области белых точек в UV для собственного AWB.

<!-- Source EN PDF p.30, block 225 -->

![Технический рисунок английского исходника, PDF p.30](/docs/rockchip-isp30-3a/assets/en-p30-figure1.png)

*Технический рисунок английского исходника, PDF p.30.*

<!-- Source EN PDF p.30, block 226 -->

【Определение】

<!-- Source EN PDF p.30, block 227 -->

```text
typedef struct rk_aiq_awb_uv_range_para_s {
    unsigned short pu_region[5];
    unsigned short pv_region[5];
    int slope_inv[4];
} rk_aiq_awb_uv_range_para_t;
```

<!-- Source EN PDF p.30, block 228 -->

【Поля】

<!-- Source EN PDF p.30, block 229 -->

| Имя поля | Описание |
|---|---|
| pu_region | Координаты U замкнутой области UV, например [u0,u1,u2,u3,u0]; диапазон [0x0, 0x1ff], 1 дробный разряд. |
| pv_region | Координаты V замкнутой области UV, например [v0,v1,v2,v3,v0]; диапазон [0x0, 0x1ff], 1 дробный разряд. |
| slope_inv | Обратные наклоны четырёх сторон области UV, до 10 дробных разрядов. |

<!-- Source EN PDF p.30, block 230 -->

【Примечание】

<!-- Source EN PDF p.30, block 231 -->

Параметры получаются инструментом калибровки и переводятся в фиксированную точку либо преобразуются согласно разделу «AWB/Обнаружение белых точек UV» документа Rockchip_Color_Optimization_Guide_ISP30.

<!-- Source EN PDF p.30, block 232 -->

Параметры зависят от модуля; при uvDetectionEnable=ture (написание исходника) они должны быть заданы корректно.

<!-- Source EN PDF p.30, block 233 -->

###### 2.2.2.3.7 rk_aiq_rgb2xy_para_t

<!-- Source EN PDF p.30, block 234 -->

【Описание】Определяет параметры преобразования RGB в XY для собственного AWB.

<!-- Source EN PDF p.30, block 235 -->

【Определение】

<!-- Source EN PDF p.31, block 236 -->

```text
typedef struct rk_aiq_rgb2xy_para_s {
    unsigned short pseudoLuminanceWeight[3];
    short rotationMat[9];
} rk_aiq_rgb2xy_para_t;
```

<!-- Source EN PDF p.31, block 237 -->

【Поля】

<!-- Source EN PDF p.31, block 238 -->

| Имя поля | Описание |
|---|---|
| pseudoLuminanceWeight | Параметр преобразования RGB в XY: [0, 2^12-1], 12 дробных разрядов. |
| rotationMat | Параметр преобразования RGB в XY: [-2^14, 2^14-1], 12 дробных разрядов. |

<!-- Source EN PDF p.31, block 239 -->

【Примечание】

<!-- Source EN PDF p.31, block 240 -->

Параметры получаются инструментом калибровки и переводятся в фиксированную точку согласно разделу «AWB/RGB2XY» документа Rockchip_Color_Optimization_Guide_ISP30.

<!-- Source EN PDF p.31, block 241 -->

Параметры зависят от модуля; при xyDetectionEnable=ture (написание исходника) они должны быть заданы корректно.

<!-- Source EN PDF p.31, block 242 -->

###### 2.2.2.3.8 rk_aiq_awb_xy_range_para_t

<!-- Source EN PDF p.31, block 243 -->

【Описание】Определяет границы четырёхугольной области белых точек в XY для собственного AWB.

<!-- Source EN PDF p.31, block 244 -->

![Технический рисунок английского исходника, PDF p.31](/docs/rockchip-isp30-3a/assets/en-p31-figure1.png)

*Технический рисунок английского исходника, PDF p.31.*

<!-- Source EN PDF p.31, block 245 -->

【Определение】

<!-- Source EN PDF p.31, block 246 -->

```text
typedef struct rk_aiq_awb_xy_range_para_s {
    int NorrangeX[2];
    int NorrangeY[2];
    int SperangeX[2];
    int SperangeY[2];
    int SmalrangeX[2];
    int SmalrangeY[2];
} rk_aiq_awb_xy_range_para_t;
```

<!-- Source EN PDF p.31, block 247 -->

【Поля】

<!-- Source EN PDF p.32, block 248 -->

| Имя поля | Описание |
|---|---|
| NorrangeX | Горизонтальные границы области XY [x0,x1], диапазон [-2^13, 2^13-1], 10 дробных разрядов. |
| NorrangeY | Вертикальные границы области XY [y0,y1], диапазон [-2^13, 2^13-1], 10 дробных разрядов. |
| SperangeX | Горизонтальные границы области XY [x0,x1], диапазон [-2^13, 2^13-1], 10 дробных разрядов. |
| SperangeY | Вертикальные границы области XY [y0,y1], диапазон [-2^13, 2^13-1], 10 дробных разрядов. |
| SmalrangeX | Горизонтальные границы малой области XY [x0,x1]; текущая версия не поддерживает; диапазон [-2^13, 2^13-1], 10 дробных разрядов. |
| SmalrangeY | Вертикальные границы малой области XY [y0,y1]; текущая версия не поддерживает; диапазон [-2^13, 2^13-1], 10 дробных разрядов. |

<!-- Source EN PDF p.32, block 249 -->

【Примечания】

<!-- Source EN PDF p.32, block 250 -->

Параметры получаются инструментом калибровки и переводятся в фиксированную точку согласно разделу «AWB/Обнаружение белых точек XY» документа Rockchip_Color_Optimization_Guide_ISP30.

<!-- Source EN PDF p.32, block 251 -->

Параметры зависят от модуля; при xyDetectionEnable=ture (написание исходника) они должны быть заданы корректно.

<!-- Source EN PDF p.32, block 252 -->

###### 2.2.2.3.9 rk_aiq_awb_rt3dyuv_range_para_t

<!-- Source EN PDF p.32, block 253 -->

【Описание】Определяет ограничения белых точек в YUV для собственного AWB.

<!-- Source EN PDF p.32, block 254 -->

【Определение】

<!-- Source EN PDF p.32, block 255 -->

```text
typedef struct rk_aiq_awb_rt3dyuv_range_para_s {
    unsigned char thcurve_u[6];
    unsigned short thcure_th[6];
    unsigned short lineP1[3];
    short vP1P2[3];
    unsigned char disP1P2;
} rk_aiq_awb_rt3dyuv_range_para_t;
```

<!-- Source EN PDF p.32, block 256 -->

【Поля】

<!-- Source EN PDF p.33, block 257 -->

| Имя поля | Описание |
|---|---|
| thcurve_u | Компонента u ломаной u-th; диапазон [0x0, 0xff]; разность соседних u должна быть степенью 2. |
| thcure_th | Компонента th ломаной u-th; диапазон [0x0, 0xfff], 4 дробных разряда; ломаная должна монотонно возрастать. |
| lineP1 | Координаты p1 в YUV для вычисления теоретической белой точки (y',u0,v0); диапазон каждой компоненты [0x0, 0xfff], 4 дробных разряда. |
| vP1P2 | Вектор от p1 к p2 в YUV для вычисления теоретической белой точки (y',u0,v0); диапазон каждой компоненты [-2^12, 2^12-1], 4 дробных разряда. |
| disP1P2 | Евклидово расстояние p1–p2 равно 2^disP1P2; диапазон [0,5]. |

<!-- Source EN PDF p.33, block 258 -->

【Примечания】

<!-- Source EN PDF p.33, block 259 -->

![Технический рисунок английского исходника, PDF p.33](/docs/rockchip-isp30-3a/assets/en-p33-figure1.png)

*Технический рисунок английского исходника, PDF p.33.*

<!-- Source EN PDF p.33, block 260 -->

Параметры получаются инструментом калибровки и переводятся в фиксированную точку либо преобразуются согласно разделу «AWB/Обнаружение белых точек YUV» документа Rockchip_Color_Optimization_Guide_ISP30.

<!-- Source EN PDF p.33, block 261 -->

Параметры зависят от модуля; при threeDyuvEnable=ture (написание исходника) и threeDyuvIllu, отличном от 7, они должны быть заданы корректно.

<!-- Source EN PDF p.33, block 262 -->

###### 2.2.2.3.10 rk_aiq_awb_exc_range_v201_t

<!-- Source EN PDF p.33, block 263 -->

【Описание】Определяет границы исключаемых/дополнительных областей белых точек в UV или XY для собственного AWB.

<!-- Source EN PDF p.33, block 264 -->

【Определение】

<!-- Source EN PDF p.34, block 265 -->

```text
typedef struct rk_aiq_awb_exc_range_v201_s {
    rk_aiq_awb_exc_range_domain_t domain;
    bool excludeEnable[RK_AIQ_AWB_XY_TYPE_MAX_V201];
    bool measureEnable;
    int xu[2];
    int yv[2];
} rk_aiq_awb_exc_range_v201_t;
```

<!-- Source EN PDF p.34, block 266 -->

【Поля】

<!-- Source EN PDF p.34, block 267 -->

| Имя поля | Описание |
|---|---|
| rk_aiq_awb_exc_range_domain_t | Выбор UV или XY для исключаемых/дополнительных областей белых точек: RK_AIQ_AWB_EXC_RANGE_DOMAIN_UV и RK_AIQ_AWB_EXC_RANGE_DOMAIN_XY соответственно. |
| excludeEnable | Включение исключаемой области: true — включена, false — выключена; по умолчанию true. |
| measureEnable | Учитывать ли сумму каналов RGain и BGain в исключаемой/дополнительной области: true — да, false — нет; по умолчанию false. |
| xu | Горизонтальные границы исключаемой/дополнительной области UV или XY: xu={x0,x1}; диапазон -2^13, 2^13-1. |
| yv | Вертикальные границы исключаемой/дополнительной области UV или XY: yv={y0,y1}; диапазон -2^13, 2^13-1. |

<!-- Source EN PDF p.34, block 268 -->

【Примечания】

<!-- Source EN PDF p.34, block 269 -->

Можно настроить максимум 7 окон, но measureEnable=true допустимо только для первых 4.

<!-- Source EN PDF p.34, block 270 -->

### 2.3 Разработка собственного AF

<!-- Source EN PDF p.34, block 271 -->

Если библиотека RK AF не используется, пользователь может разработать AF по статистике 3A для управления увеличением, фокусировкой и другими функциями.

<!-- Source EN PDF p.34, block 272 -->

При реализации AF:

<!-- Source EN PDF p.34, block 273 -->

1\. Сначала вызовите rk_aiq_user_api2_af_SetAttrib для настройки статистики AF.

<!-- Source EN PDF p.34, block 274 -->

2\. Получите статистику 3A через rk_aiq_uapi_sysctl_get3AStatsBlk. Это блокирующий API, возвращающий управление сразу после появления новых данных.

<!-- Source EN PDF p.35, block 275 -->

3\. Собственный AF выполняет расчёты по статистике 3A и управляет движением моторов увеличения и фокусировки.

<!-- Source EN PDF p.35, block 276 -->

4\. В конце вызовите rk_aiq_uapi_sysctl_release3AStatsRef для освобождения полученной статистики 3A.

<!-- Source EN PDF p.35, block 277 -->

Общий процесс показан на схеме ниже.

<!-- Source EN PDF p.35, block 278 -->

![Технический рисунок английского исходника, PDF p.35](/docs/rockchip-isp30-3a/assets/en-p35-figure1.png)

*Технический рисунок английского исходника, PDF p.35.*

<!-- Source EN PDF p.35, block 279 -->

#### 2.3.1 Модуль статистики AF

<!-- Source EN PDF p.35, block 280 -->

![Технический рисунок английского исходника, PDF p.35](/docs/rockchip-isp30-3a/assets/en-p35-figure2.png)

*Технический рисунок английского исходника, PDF p.35.*

<!-- Source EN PDF p.35, block 281 -->

При HDR-входе Sensor модуль AF может использовать изображение короткой, средней или длинной экспозиции HDR либо данные объединённого HDR-изображения для статистики.

<!-- Source EN PDF p.35, block 282 -->

При обычном входе Sensor модуль AF может использовать входное изображение Sensor либо изображение после debayer для статистики.

<!-- Source EN PDF p.35, block 283 -->

Поддерживаются два окна: главное A и независимое B.

<!-- Source EN PDF p.35, block 284 -->

Главное окно A содержит 15\*15 подокон и четыре настраиваемых фильтра V1/V2/H1/H2; выдаются четыре группы FV, значения яркости и статистика светлых участков.

<!-- Source EN PDF p.35, block 285 -->

Независимое окно B вычисляет FV фиксированным оператором и выдаёт одно значение FV, яркость и статистику светлых участков.

<!-- Source EN PDF p.36, block 286 -->

#### 2.3.2 Настройка окон статистики AF

<!-- Source EN PDF p.36, block 287 -->

Главное окно A и независимое B имеют прямоугольную форму; задаются координаты левого верхнего угла, ширина и высота.

<!-- Source EN PDF p.36, block 288 -->

![Технический рисунок английского исходника, PDF p.36](/docs/rockchip-isp30-3a/assets/en-p36-figure1.png)

*Технический рисунок английского исходника, PDF p.36.*

<!-- Source EN PDF p.36, block 289 -->

#### 2.3.3 Gamma

<!-- Source EN PDF p.36, block 290 -->

Gamma преобразует входной RAW Sensor в представление естественной яркости, воспринимаемой глазом. Координата x: от 0 до 1023; сегменты: 16 16 16 16 32 32 32 32 64 64 64 128 128 128 128 128. Диапазон y: от 0 до 1023.

<!-- Source EN PDF p.36, block 291 -->

![Технический рисунок английского исходника, PDF p.36](/docs/rockchip-isp30-3a/assets/en-p36-figure2.png)

*Технический рисунок английского исходника, PDF p.36.*

<!-- Source EN PDF p.36, block 292 -->

#### 2.3.4 Фильтры фокусировки

<!-- Source EN PDF p.36, block 293 -->

Главное окно A предоставляет четыре настраиваемых фильтра V1/V2/H1/H2; независимое B использует фиксированные операторы.

<!-- Source EN PDF p.37, block 294 -->

Полосы частот V1/V2/H1/H2 можно настраивать; значения регистров генерируются инструментом проектирования фильтров.

<!-- Source EN PDF p.37, block 295 -->

![Технический рисунок английского исходника, PDF p.37](/docs/rockchip-isp30-3a/assets/en-p37-figure1.png)

*Технический рисунок английского исходника, PDF p.37.*

<!-- Source EN PDF p.37, block 296 -->

#### 2.3.5 Яркость/светлые участки

<!-- Source EN PDF p.37, block 297 -->

Главное окно A предоставляет статистику яркости и счётчик светлых участков.

<!-- Source EN PDF p.37, block 298 -->

FV чувствительно к источнику света. При расфокусировке расширение ореола усиливает низкочастотную составляющую: изображение становится нерезким, но FV увеличивается.

<!-- Source EN PDF p.37, block 299 -->

Обычно используется счётчик светлых участков: при расфокусировке ореол расширяется и число светлых точек возрастает; при резком изображении оно минимально.

<!-- Source EN PDF p.37, block 300 -->

#### 2.3.6 Усиление в зависимости от яркости (LDG)

<!-- Source EN PDF p.37, block 301 -->

Влияние источника света также можно уменьшить функцией LDG: она ослабляет FV по яркости пикселя, снижая вклад слишком светлых и слишком тёмных точек.

<!-- Source EN PDF p.38, block 302 -->

![Технический рисунок английского исходника, PDF p.38](/docs/rockchip-isp30-3a/assets/en-p38-figure1.png)

*Технический рисунок английского исходника, PDF p.38.*

<!-- Source EN PDF p.38, block 303 -->

При яркости в [ldg_xl, ldg_xh] выходное усиление равно 1, FV не ослабляется.

<!-- Source EN PDF p.38, block 304 -->

При яркости в [0, ldg_xl] усиление уменьшается с наклоном ldg_kl, но не ниже ldg_yl.

<!-- Source EN PDF p.38, block 305 -->

`gain = 256 - ldg_kl*(ldg_xl - x)/256; gain = max(gain, ldg_yl);`

<!-- Source EN PDF p.38, block 306 -->

При яркости в [ldg_xh, 255] усиление уменьшается с наклоном ldg_kh, но не ниже ldg_yh.

<!-- Source EN PDF p.38, block 307 -->

`gain = 256 - ldg_kh*(x-ldg_xh)/256; gain = max(gain, ldg_yh);`

<!-- Source EN PDF p.38, block 308 -->

Горизонтальные H1/H2 используют общую кривую LDG; вертикальные V1/V2 — другую общую кривую.

<!-- Source EN PDF p.38, block 309 -->

#### 2.3.7 Порог FV

<!-- Source EN PDF p.38, block 310 -->

При вычислении FV значения ниже порога FV не учитываются в итоговом выходе, что уменьшает влияние шума.

<!-- Source EN PDF p.39, block 311 -->

![Технический рисунок английского исходника, PDF p.39](/docs/rockchip-isp30-3a/assets/en-p39-figure1.png)

*Технический рисунок английского исходника, PDF p.39.*

<!-- Source EN PDF p.39, block 312 -->

Порог FV применяется к результату фильтрации после обработки LDG.

<!-- Source EN PDF p.39, block 313 -->

#### 2.3.8 Расчёт FV

<!-- Source EN PDF p.39, block 314 -->

FV поддерживает режим абсолютного значения и квадратный режим. Возведение FV в квадрат увеличивает относительный вклад резких областей.

<!-- Source EN PDF p.39, block 315 -->

Для предотвращения переполнения итогового FV задаются четыре правых сдвига v1/v2/h1/h2 главного окна и два сдвига fv/luma независимого окна.

<!-- Source EN PDF p.39, block 316 -->

#### 2.3.9 Выход FV

<!-- Source EN PDF p.39, block 317 -->

Главное окно A выдаёт данные FV v1/v2/h1/h2 для 1515 и luma/highlight для 1515 (так напечатано в исходнике; предыдущий текст и рисунок показывают сетку 15×15).

<!-- Source EN PDF p.39, block 319 -->

Распределение выхода главного окна A по изображению показано ниже.

<!-- Source EN PDF p.39, block 320 -->

Выход независимого окна B содержит одно значение FV, одно значение яркости и статистику светлых участков.

<!-- Source EN PDF p.40, block 321 -->

![Технический рисунок английского исходника, PDF p.40](/docs/rockchip-isp30-3a/assets/en-p40-figure1.png)

*Технический рисунок английского исходника, PDF p.40.*

Редактируемая расшифровка сетки FV:

|  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 2 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 3 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 4 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 5 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 6 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 7 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 8 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 9 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 10 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 11 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 12 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 13 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 14 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |
| 15 | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv | Fv |

<!-- Source EN PDF p.40, block 322 -->

#### 2.3.10 Расчёт итогового FV

<!-- Source EN PDF p.40, block 323 -->

H1 и V1 можно настроить на низкочастотную полосу для грубого поиска, H2 и V2 — на высокочастотную для точного.

<!-- Source EN PDF p.40, block 324 -->

Выходы горизонтального фильтра H и вертикального V можно объединять с заданными весами.

<!-- Source EN PDF p.40, block 325 -->

`FV = FvH * weight + FvV * (1-weight)`

<!-- Source EN PDF p.40, block 326 -->

Значения FV отдельных блоков также можно взвешивать по необходимости.

<!-- Source EN PDF p.40, block 327 -->

#### 2.3.11 Настройка статистики AF

<!-- Source EN PDF p.40, block 328 -->

Для настройки используется rk_aiq_user_api2_af_SetAttrib.

<!-- Source EN PDF p.40, block 329 -->

```text
XCamReturn
rk_aiq_user_api2_af_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_af_attrib_t
attr);
```

<!-- Source EN PDF p.40, block 330 -->

| Имя параметра | Описание | Вход/выход |
|---|---|---|
| sys_ctx | Указатель контекста AIQ | Вход |
| attr | Атрибуты параметров фокусировки | Вход |

<!-- Source EN PDF p.40, block 331 -->

Определение rk_aiq_af_algo_meas_v30_t в параметре rk_aiq_af_attrib_t приведено ниже:

<!-- Source EN PDF p.40, block 332 -->

```text
typedef struct {
    unsigned char af_en;
    unsigned char rawaf_sel;
    unsigned char gamma_en;
    unsigned char gaus_en;
    unsigned char v1_fir_sel;
    unsigned char hiir_en;
    unsigned char viir_en;
unsigned char v1_fv_outmode; // 0 square, 1 absolute
unsigned char v2_fv_outmode; // 0 square, 1 absolute
unsigned char h1_fv_outmode; // 0 square, 1 absolute
unsigned char h2_fv_outmode; // 0 square, 1 absolute
unsigned char ldg_en;
unsigned char accu_8bit_mode; // fix to 1
unsigned char ae_mode;
unsigned char y_mode; // fix to 0
unsigned char line_en[RKAIQ_RAWAF_LINE_NUM];
unsigned char line_num[RKAIQ_RAWAF_LINE_NUM];
unsigned char window_num;
unsigned short wina_h_offs;
unsigned short wina_v_offs;
unsigned short wina_h_size;
unsigned short wina_v_size;
unsigned short winb_h_offs;
unsigned short winb_v_offs;
unsigned short winb_h_size;
unsigned short winb_v_size;
unsigned short gamma_y[RKAIQ_RAWAF_GAMMA_NUM];
// [old version param]
unsigned short thres;
unsigned char shift_sum_a;
unsigned char shift_sum_b;
unsigned char shift_y_a;
unsigned char shift_y_b;
/**********[Vertical IIR (v1 & v2)]************/
short v1_iir_coe[9];
short v1_fir_coe[3];
short v2_iir_coe[3];
short v2_fir_coe[3];
/**********[Horizontal IIR (h1 & h2)]************/
short h1_iir1_coe[6];
short h2_iir1_coe[6];
short h1_iir2_coe[6];
short h2_iir2_coe[6];
/**********[Focus value statistic param]**********/
// level depended gain
// input8 lumi, output8bit gain
unsigned char h_ldg_lumth[2]; //luminance thresh
unsigned char h_ldg_gain[2]; //gain for [minLum,maxLum]
unsigned short h_ldg_gslp[2]; //[slope_low,-slope_high]
unsigned char v_ldg_lumth[2];
unsigned char v_ldg_gain[2];
unsigned short v_ldg_gslp[2];
// coring
unsigned short v_fv_thresh;
unsigned short h_fv_thresh;
    // left shift, more needed if outmode=square
    unsigned char v1_fv_shift; //only for sel1
    unsigned char v2_fv_shift;
    unsigned char h1_fv_shift;
    unsigned char h2_fv_shift;
    /**********[High light]**********/
    unsigned short highlit_thresh;
} rk_aiq_af_algo_meas_v30_t;
```

<!-- Source EN PDF p.43, block 336 -->

| Имя поля | Описание |
|---|---|
| af_en | Включение статистики AF: 0 — выключена, 1 — включена. |
| rawaf_sel | Входной канал статистики AF: 0–3, соответствующие длинному/среднему/короткому/объединённому кадрам HDR. Обычно выбирается средний кадр; вне HDR задаётся 0, в HDR — 1. Порядок каналов сохранён из исходника. |
| gamma_en | Включение Gamma: 0 — выключена, 1 — включена. |
| gaus_en | Необходимо фиксированное значение 1. |
| v1_fir_sel | Необходимо фиксированное значение 1. |
| hiir_en | Включение H1/H2: 0 — выключены, 1 — включены. |
| viir_en | Включение V1/V2: 0 — выключены, 1 — включены. При gamma_en=1 значение viir_en должно быть 1. |
| v1_fv_outmode | Режим выхода FV канала V1: 0 — квадрат, 1 — абсолютное значение. |
| v2_fv_outmode | Режим выхода FV канала V2: 0 — квадрат, 1 — абсолютное значение. |
| h1_fv_outmode | Режим выхода FV канала H1: 0 — квадрат, 1 — абсолютное значение. |
| h2_fv_outmode | Режим выхода FV канала H2: 0 — квадрат, 1 — абсолютное значение. |
| ldg_en | Включение LDG: 0 — выключено, 1 — включено. |
| accu_8bit_mode | Необходимо фиксированное значение 1. |
| ae_mode | При ae_mode=1 RAWAF включает статистику средней яркости 15x15, используя логику RAWAE_BIG. |
| y_mode | Необходимо фиксированное значение 0. |
| line_en | Пока не действует. |
| line_num | Пока не действует. |
| window_num | Число действующих окон: при window_num=1 действует главное WinA; при window_num=2 — WinA и независимое WinB. |
| wina_h_offs | Горизонтальная координата первого пикселя левого верхнего угла WinA, не меньше 2. |
| wina_v_offs | Вертикальная координата первого пикселя левого верхнего угла WinA, не меньше 1. |
| wina_h_size | Ширина WinA должна быть меньше ширины изображения -2-wina_h_offs и кратна 15. |
| wina_v_size | Исходник называет это «шириной» WinA, меньшей «ширины» изображения -2-wina_v_offs и кратной 15. Имя поля обозначает вертикальный размер; противоречие требует проверки. |
| winb_h_offs | Горизонтальная координата первого пикселя левого верхнего угла WinB, не меньше 2. |
| winb_v_offs | Вертикальная координата первого пикселя левого верхнего угла WinB, не меньше 1. |
| winb_h_size | Ширина WinB должна быть меньше ширины изображения -2-wina_h_offs (в исходнике указано wina; на winb не заменено). |
| winb_v_size | Высота WinB должна быть меньше высоты изображения -2-wina_v_offs (ссылка на wina сохранена). |
| gamma_y | Значения y таблицы Gamma: 0–1023. Координата x от 0 до 1023, сегменты: 16 16 16 16 32 32 32 32 64 64 64 128 128 128 128 128. |
| thres | Если рассчитанное FV ниже порога, оно обнуляется для уменьшения шума; диапазон 0–0xFFFF. |
| shift_sum_a | Сейчас недоступно; можно фиксировать на 0. |
| shift_sum_b | Число бит правого сдвига FV окна WinB для предотвращения переполнения; диапазон 0–7. Опечатка «shit bit» передана как сдвиг. |
| shift_y_a | Сейчас недоступно; можно фиксировать на 0. |
| shift_y_b | Число бит правого сдвига luma окна WinB для предотвращения переполнения; диапазон 0–7. |
| v1_iir_coe[9] | Коэффициенты 3X3 IIR канала V1, задаваемые по выходу инструмента генерации коэффициентов фильтров AF. |
| v1_fir_coe[3] | Коэффициенты 1x3 FIR канала V1, задаваемые по выходу инструмента генерации коэффициентов фильтров AF. |
| v2_iir_coe[3] | Коэффициенты 1x3 IIR канала V2, задаваемые по выходу инструмента генерации коэффициентов фильтров AF. |
| v2_fir_coe[3] | Коэффициенты 1x3 FIR канала V2, задаваемые по выходу инструмента генерации коэффициентов фильтров AF. |
| h1_iir1_coe[6] | Коэффициенты 1X6 IIR1 канала H1, задаваемые по выходу инструмента генерации коэффициентов фильтров AF. |
| h2_iir1_coe[6] | Коэффициенты 1X6 IIR1 канала H2, задаваемые по выходу инструмента генерации коэффициентов фильтров AF. |
| h1_iir2_coe[6] | Коэффициенты 1X6 IIR2 канала H1, задаваемые по выходу инструмента генерации коэффициентов фильтров AF. |
| h2_iir2_coe[6] | Коэффициенты 1X6 IIR2 канала H2, задаваемые по выходу инструмента генерации коэффициентов фильтров AF. |
| h_ldg_lumth[2] | Коэффициент порога яркости LDG каналов H1/H2; 0 — тёмная область слева, 1 — светлая справа; диапазон 0~255. |
| h_ldg_gain[2] | Коэффициент минимального усиления LDG каналов H1/H2; 0 — тёмная область слева, 1 — светлая справа; диапазон 0~255. |
| h_ldg_gslp[2] | Коэффициент наклона LDG каналов H1/H2; 0 — тёмная область слева, 1 — светлая справа; диапазон 0~65535. |
| v_ldg_lumth[2] | Коэффициент порога яркости LDG каналов V1/V2; 0 — тёмная область слева, 1 — светлая справа; диапазон 0~255. |
| v_ldg_gain[2] | Коэффициент минимального усиления LDG каналов V1/V2; 0 — тёмная область слева, 1 — светлая справа; диапазон 0~255. |
| v_ldg_gslp[2] | Коэффициент минимального усиления LDG каналов V1/V2; 0 — тёмная область слева, 1 — светлая справа; диапазон 0~255. |
| v_fv_thresh | Порог статистики AF каналов V1/V2; FV ниже порога обнуляется для уменьшения шума; диапазон 0–0x0FFF. |
| h_fv_thresh | Порог статистики AF каналов H1/H2; FV ниже порога обнуляется для уменьшения шума; диапазон 0–0x0FFF. |
| v1_fv_shift | Число бит правого сдвига FV канала V1 для предотвращения переполнения; диапазон 0–7. |
| v2_fv_shift | Число бит правого сдвига FV канала V2 для предотвращения переполнения; диапазон 0–7. |
| h1_fv_shift | Число бит правого сдвига FV канала H1 для предотвращения переполнения; диапазон 0–7. |
| h2_fv_shift | Число бит правого сдвига FV канала H2 для предотвращения переполнения; диапазон 0–7. |
| highlit_thresh | Порог светлых точек: пиксели выше него учитываются как светлые; накапливается только их число в каждой области. Диапазон 0–0x0FFF. |

<!-- Source EN PDF p.45, block 339 -->

#### 2.3.12 Получение статистики AF

<!-- Source EN PDF p.45, block 340 -->

Подробности см. в разделе «Статистика» документа Rockchip_Development_Guide_ISP30.

<!-- Source EN PDF p.45, block 341 -->

`rk_aiq_uapi_sysctl_get3AStatsBlk () / rk_aiq_uapi_sysctl_release3AStatsRef()`

<!-- Source EN PDF p.46, block 342 -->

Структура результатов статистики AF — rk_aiq_af_algo_stat_v30_t.

<!-- Source EN PDF p.46, block 343 -->

#### 2.3.13 Использование инструмента проектирования фильтров

<!-- Source EN PDF p.46, block 344 -->

См. документацию Filter Design Tool.

<!-- Source EN PDF p.46, block 345 -->

### 2.4 Примеры кода

<!-- Source EN PDF p.46, block 346 -->

Для реализации собственного 3A можно использовать следующие примеры:

<!-- Source EN PDF p.46, block 347 -->

Каталог: корень AIQ/rkisp_demo/demo/

<!-- Source EN PDF p.46, block 348 -->

`|-------ae_algo_demo`: пример алгоритма AE.

<!-- Source EN PDF p.46, block 349 -->

`|-------awb_algo_demo`: пример алгоритма AWB.

<!-- Source EN PDF p.46, block 350 -->

`|-------af_algo_demo`: пример алгоритма AF.

{% endraw %}

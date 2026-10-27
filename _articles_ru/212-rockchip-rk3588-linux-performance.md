---
title: "Rockchip RK3588: отчёт о производительности Linux"
description: "Rockchip RK3588: отчёт о производительности Linux — V1.0.0; RK3588 EVB1"
excerpt: "Rockchip RK3588: отчёт о производительности Linux"
translation_key: "212-rockchip-rk3588-linux-performance"
slug: "212-rockchip-rk3588-linux-performance"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, RK3588, Linux, Benchmark]
---

{% raw %}

# Rockchip RK3588: отчёт о производительности Linux

Платформенная справка ArmSoM с полным техническим содержанием оригинала Rockchip V1.0.0 (RK-CS-YF-922). Исходная тестовая платформа — RK3588-EVB1-LP4-V10 с конфигурацией `BoardConfig-rk3588-evb1-lp4-v10.mk`, а не плата ArmSoM. Все результаты ниже — исторические измерения исходника, не тесты ArmSoM и не гарантия для других плат. Отдельно сверяйте плату, SDK/BSP, ядро, охлаждение, питание и память. Версии ядра и SDK в оригинале не указаны; аппаратная проверка не выполнялась.

Оригинал приводит базовые результаты RK3588 в общих инструментах производительности Linux для проверки характеристик чипа, анализа проблем и оценки ожидаемых показателей. Используются SPEC 2006, Unixbench, Glmark2 и Stream. Предоставлен только оригинал из китайского каталога, без парного английского PDF. Английский, русский и немецкий тексты полностью переведены по нему. Технических рисунков нет; все таблицы данных редактируемые.

## 1. Конфигурация тестовой среды

### 1.1 Аппаратная среда

| Параметр | Описание |
| --- | --- |
| Motherboard | RK3588-EVB1-LP4-V10 |
| CPU | RK3588; 4xA76-Based@2.4GHz; 4xA55@1.8GHz |
| GPU | RK3588; 4 core Mali-G610 1000MHz |
| RAM | 8G LPDDR4X 2112MHz 16bit*4Channel |
| ROM | eMMC HS400 32GB |
| OS | debian11 |

### 1.2 Программная среда

Для измерений переключите CPU и GPU в режим производительности. Ниже команды оригинала; перенос пути перенаправления GPU восстановлен в одну команду. Перед применением проверьте узлы своего BSP: эти пути могут отсутствовать на других платах.

```sh
echo performance > /sys/devices/system/cpu/cpufreq/policy0/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy4/scaling_governor
echo performance > /sys/devices/system/cpu/cpufreq/policy6/scaling_governor

echo performance > /sys/devices/platform/fb000000.gpu/devfreq/fb000000.gpu/governor
```

После переключения прочитайте текущие частоты CPU и GPU:

```sh
cat /sys/devices/system/cpu/cpufreq/policy0/cpuinfo_cur_freq
cat /sys/devices/system/cpu/cpufreq/policy4/cpuinfo_cur_freq
cat /sys/devices/system/cpu/cpufreq/policy6/cpuinfo_cur_freq

cat /sys/devices/platform/fb000000.gpu/devfreq/fb000000.gpu/cur_freq
```

## 2. Тестовые пакеты

### 2.1 SPEC 2006

Измеряет целочисленную производительность CPU и операции с плавающей точкой. Версия: SPEC 2006 V1.01. Ниже результаты оригинала.

| Тест | Результат |
| --- | --- |
| Одно ядро целочисленный base | 25.5 |
| Одно ядро плавающая точка base | 29.9 |
| Несколько ядер (8) целочисленный base | 86.9 |
| Несколько ядер (8) плавающая точка base | 84.6 |

### 2.2 Unixbench

Проверяет системные вызовы, чтение/запись, процессы, графику, 2D, 3D, каналы, вычисления, библиотеку C и другие системные показатели. Версия в оригинале записана как `Unixbenc V5.1.3` (без h); написание сохранено для прослеживаемости.

| Тест | Результат |
| --- | --- |
| Одно ядро | 1273.7 |
| Несколько ядер (8) | 3662.2 |

### 2.3 Glmark2

Измеряет производительность GPU в OpenGL 2.0 и ES 2.0. Версия: glmark2 2021.02.

#### X11

| Тест | Результат |
| --- | --- |
| `glmark2-es2 --off-screen` | 3639 |
| `glmark2-es2` | 1376 |
| `glmark2-es2 --fullscreen` | 622 |

#### Wayland

| Тест | Результат |
| --- | --- |
| `glmark2-es2-wayland --off-screen` | 3680 |
| `glmark2-es2-wayland` | 2670 |
| `glmark2-es2-wayland --fullscreen` | 1258 |

### 2.4 Stream

Измеряет операции памяти Copy, Scale, Add и Triad. Версия: `stream1.0 V5.10`; обозначение сохранено из оригинала.

| Тест | Один поток (MB/s) | Несколько потоков (MB/s) |
| --- | --- | --- |
| Copy | 17912.8 | 20481.3 |
| Scale | 17982.8 | 20473.4 |
| Add | 17079.8 | 18205.1 |
| Triad | 17021.3 | 18126.3 |

## Примечания об адаптации и источнике

В оригинале нет полных параметров запуска SPEC, условий охлаждения и параметров компиляции Stream; для воспроизведения всех тестов данных недостаточно. Версии и результаты сохранены как исторические сведения.

[ArmSoM Docs](https://docs.armsom.org/)

{% endraw %}

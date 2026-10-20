---
title: "Rockchip Linux DMA-BUF: утечки памяти, IOVA и пиковое потребление"
description: "Все макросы отладки DMA-BUF RK3588 Linux 5.10, procfs и исходные примеры памяти видеопроигрывания."
translation_key: "084-rockchip-linux-dmabuf"
slug: "084-rockchip-linux-dmabuf"
lang: "ru"
date: "2026-10-20"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: ["ArmSoM", "Rockchip", "DMA-BUF"]
keywords: "ArmSoM Rockchip Linux linux dmabuf"
excerpt: "Все макросы отладки DMA-BUF RK3588 Linux 5.10, procfs и исходные примеры памяти видеопроигрывания."
---

{% raw %}

# Rockchip Linux DMA-BUF: утечки памяти, IOVA и пиковое потребление

## Применимость к ArmSoM и источник

Справочный материал для адаптации ArmSoM, переведённый с китайского V1.0.0. Область исходника: RK3588, Linux 5.10. Английский PDF отсутствует; английская, русская и немецкая версии полностью переведены с китайского. Немецкая использует те же изображения, что английская статья. Конкретные платы ArmSoM, SDK/BSP и сочетания драйверов не подтверждены и аппаратно не проверены. Сверьте SoC, карту памяти платы, SDK/BSP, конфигурацию ядра и реализацию драйвера. Код, адреса, журналы и числа — примеры исходника, а не результаты тестов ArmSoM.

[Редакционные примечания](/docs/rockchip-linux-dmabuf/EDITORIAL-NOTES.md) · [ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux)

Исходник описывает диагностику утечек DMA-BUF, ошибок потока данных и отображения памяти. Технических рисунков нет; вымышленные не добавлены.

| SoC исходника | Ядро исходника |
| --- | --- |
| RK3588 | Linux 5.10 |

<!-- Source CN PDF p.4, unit 0 -->

## 1. Введение

<!-- Source CN PDF p.4, unit 1 -->

DMABUF — структура буфера для общей памяти мультимедийных устройств. Дескриптор fd DMABUF позволяет разделять память между процессами: zero-copy повышает производительность, асинхронный доступ уменьшает связанность модулей.

<!-- Source CN PDF p.4, unit 2 -->

## 2. Изменения Linux для отладки DMABUF

<!-- Source CN PDF p.4, unit 3 -->

### 2.1 DMABUF_DEBUG

<!-- Source CN PDF p.4, unit 4 -->

Исходный BSP поддерживает DMABUF debug начиная с Linux-5.10. Измените `arch/arm64/configs/rockchip_defconfig`:

<!-- Source CN PDF p.4, unit 5 -->

```text
CONFIG_DMABUF_DEBUG=y
```

<!-- Source CN PDF p.4, unit 6 -->

После включения макроса каждому DMABUF назначается имя по умолчанию pid+taskname длиной 16 символов. Пример:

<!-- Source CN PDF p.4, unit 7 -->

```text
416-allocator@4.
```

<!-- Source CN PDF p.4, unit 8 -->

### 2.2 DMABUF_PROCFS

<!-- Source CN PDF p.4, unit 9 -->

Исходный BSP поддерживает DMABUF procfs начиная с Linux-5.10. Измените `arch/arm64/configs/rockchip_defconfig`:

<!-- Source CN PDF p.4, unit 10 -->

```text
CONFIG_RK_DMABUF_PROCFS=y
```

<!-- Source CN PDF p.4, unit 11 -->

Включение создаёт узел `rk_dmabuf` в `/proc/` со следующими узлами отладки. Комментарии блока сохранены из китайского исходника:

<!-- Source CN PDF p.4, unit 12 -->

```text
dev # 显示所有DMABUF已经attach的device
sgt # 显示所有DMABUF的ScatterListTable，显示其IOVA
size # 显示所有DMABUF的total size
peak # 显示所有DMABUF的total size的峰值
```

Узлы: dev — присоединённые устройства; sgt — ScatterListTable и IOVA; size — общий размер; peak — его максимум.

<!-- Source CN PDF p.4, unit 13 -->

### 2.3 DMABUF_DEBUG_ADVANCED

<!-- Source CN PDF p.4, unit 14 -->

Подфункция DMABUF procfs получает физические адреса памяти DMABUF. Измените `arch/arm64/configs/rockchip_defconfig`:

<!-- Source CN PDF p.4, unit 15 -->

```text
CONFIG_DMABUF_DEBUG_ADVANCED=y
```

<!-- Source CN PDF p.5, unit 16 -->

После включения все DMABUF проходят attach/map через fake device для получения sgt. Это помогает `/proc/rk_dmabuf_sgt` показывать все IOVA. Путь сохранён дословно; сверьте его с работающим BSP.

<!-- Source CN PDF p.5, unit 17 -->

## 3. Вопросы и ответы

<!-- Source CN PDF p.5, unit 18 -->

### 3.1 Утечка DMABUF при воспроизведении видео на RK3588?

<!-- Source CN PDF p.5, unit 19 -->

Включите отладочные макросы и проверьте память при входе на главный экран:

<!-- Source CN PDF p.5, unit 20 -->

```text
console:/ # cat /proc/rk_dmabuf/size
Total: 65552 KiB
```

<!-- Source CN PDF p.5, unit 21 -->

Воспроизведите видео, завершите просмотр, удалите историю и вернитесь на главный экран:

<!-- Source CN PDF p.5, unit 22 -->

```text
console:/ # cat /proc/rk_dmabuf/size
Total: 83948 KiB
```

<!-- Source CN PDF p.5, unit 23 -->

### 3.2 Пиковое потребление DMABUF при воспроизведении видео на RK3588?

<!-- Source CN PDF p.5, unit 24 -->

Через узел отладки mpp проверьте суммарную память DMABUF воспроизведения:

<!-- Source CN PDF p.5, unit 25 -->

```text
console:/ # cat /proc/mpp_service/sessions-summary
fdc38100.rkvdec-core Total: 699760 KiB
```

<!-- Source CN PDF p.5, unit 26 -->

Проверьте пиковую память через узел отладки DMABUF:

<!-- Source CN PDF p.5, unit 27 -->

```text
console:/ # cat /proc/rk_dmabuf/peak
Peak: 1544 MiB
```

<!-- Source CN PDF p.5, unit 28 -->

Сбросьте пик в ноль и повторите наблюдение:

<!-- Source CN PDF p.5, unit 29 -->

```text
console:/ # echo 0 > /proc/rk_dmabuf/peak
```

{% endraw %}

---
title: "Прокси RKNN: подготовка, развёртывание и mini-runtime"
description: "Прокси RKNN: подготовка, развёртывание и mini-runtime"
excerpt: "Прокси RKNN: подготовка, развёртывание и mini-runtime"
translation_key: "rknn-server-proxy"
slug: "rknn-server-proxy"
lang: "ru"
date: "2026-10-28"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: ["CM7S", "Sige7S", "Sige7", "AIM7", "LM7", "W3", "Sige5", "CM5", "AIM5", "Sige3", "CM3", "AIM3"]
tags: ["Rockchip", "RKNN", "Toolkit2", "Linux"]
---

Справочный материал для оценки на ArmSoM CM7S/Sige7S (RK3588S), Sige7/AIM7/LM7/W3 (RK3588), Sige5/CM5/AIM5 (RK3576) и соответствующих платформах RK3568. Необходимо согласовать ОС платы, драйвер NPU, SDK, Runtime и Toolkit2. Конкретная комбинация BSP/ядра и работа на оборудовании ArmSoM не проверялись. Утверждения о проверке относятся только к среде исходного документа.

Источник — локальный китайский rknn_server_proxy.md; английского оригинала и иллюстраций нет. Английский, русский и немецкий тексты переведены полностью. Раздел 1 противоречит разделу 4 по применимости librknnrt.so. В вопросе 4 указан /usr/bin, а в 4.3 — /oem/usr/bin; проверьте фактический путь. Исправлены уровень заголовка 4.4 и разметка блока сброса каталога dump, команды не изменены. Замена Runtime/adbd, остановка служб, перезагрузка и отключение принудительного применения SELinux требуют проверки в изолированной среде разработки; это не рекомендации для эксплуатации.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip source](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/CN/rknn_server_proxy.md)


<div class="series-navigation" aria-label="Серия об отладке платы" markdown="1">

Серия об отладке платы · 1/3

**Прокси RKNN: подготовка, развёртывание и mini-runtime**

[Отладка RKNN: включение, проверка и сброс журналов](/ru/articles/rknn-server-logging/)

[Диагностика RKNN: подключение, память, хранилище и права](/ru/articles/rknn-server-troubleshooting/)

</div>

{% raw %}

## 1. Введение в отладку с подключённой платой
Для отладки через RKNN Toolkit2 обычно требуется обновить rknn_server и librknnrt.so/librknnmrt.so на плате и вручную запустить rknn_server.
Фоновая служба rknn_server получает протокол от ПК по USB, вызывает соответствующие интерфейсы runtime на плате и возвращает результаты ПК.

- librknnrt.so: библиотека RKNPU Runtime для платы. В китайском источнике буквально написано «не подходит для платформ, отличных от RV1103/RV1106/RV1103B»; это противоречит последующим инструкциям развёртывания. Противоречие сохранено для сверки с фактическим SDK.
- librknnmrt.so: библиотека RKNPU Runtime специально для RV1103/RV1106/RV1103B/RV1126B.

После загрузки проверьте через ps, запущен ли rknn_server. Если запущен, ручной запуск не нужен; иначе запустите его вручную.

## 2. Требования к среде
### 2.1 Аппаратные платформы
Источник охватывает RV1103, RV1103B, RV1106, RV1126B, RK3562 и семейства RK3566, RK3568, RK3576 и RK3588.

### 2.2 Программное обеспечение
- Для моделей RKNN с динамической формой входа нужны rknn_server и RKNPU Runtime >=1.5.0.
- Для моделей размером более 2GB нужен rknn_server >=2.0.0b0.
- На платформах с малым объёмом памяти, например RV1103/RV1106/RV1103B, рекомендуется rknn_server >=2.1.0.

## 3. Расположение rknn_server
rknn_server находится в runtime. Выбирайте версию под ОС и чип платы.
### 3.1 Android

| Система | Путь |
| --- | --- |
| 32-bit Android | runtime/Android/rknn_server/arm/rknn_server |
| 64-bit Android | runtime/Android/rknn_server/arm64/rknn_server |

### 3.2 Linux

| Чип | Система | Путь |
| --- | --- | --- |
| RV1103/RV1106/RV1103B | 32-bit Linux | runtime/Linux/rknn_server/armhf-uclibc/usr/bin/rknn_server |
| Другие чипы | 32-bit Linux | runtime/Linux/rknn_server/armhf/usr/bin/rknn_server |
| Другие чипы | 64-bit Linux | runtime/Linux/rknn_server/aarch64/usr/bin/rknn_server |

## 4. Запуск
### 4.1 Android
В корневом каталоге проекта rknpu2 выполните следующие команды на ПК.
1. Перемонтируйте системный раздел с разрешением записи.

```
adb root && adb remount
```

2. Обновите программу прокси.

```
// 64-bit Android系统
adb push runtime/Android/rknn_server/arm64/rknn_server /vendor/bin/
// 32-bit Android系统
adb push runtime/Android/rknn_server/arm/rknn_server /vendor/bin/
```

3. Обновите библиотеку RKNPU runtime.

```
// 64-bit Android系统
adb push runtime/Android/librknn_api/arm64-v8a/librknnrt.so /vendor/lib64
// 32-bit Android系统
adb push runtime/Android/librknn_api/armeabi-v7a/librknnrt.so /vendor/lib
```

4. Измените права исполняемого файла прокси.

```
adb shell chmod +x /vendor/bin/rknn_server
```

5. Запустите службу прокси.

```
adb shell "killall rknn_server"
adb shell "nohup /vendor/bin/rknn_server >/dev/null"&
```

6. Проверьте успешный запуск службы прокси.

```
adb shell ps -ef|grep rknn_server
```

Проверьте наличие идентификатора процесса `rknn_server`: он указывает на успешный запуск. Иначе войдите в оболочку платы через `adb shell` и запустите службу вручную следующими командами.

```
nohup /vendor/bin/rknn_server > /dev/null&
```

### 4.2 Linux, кроме RV1103/RV1106/RV1103B
1. Обновите программу прокси.

```
// 64-bit Linux系统
adb push runtime/Linux/rknn_server/aarch64/usr/bin/rknn_server /usr/bin/
// 32-bit Linux系统
adb push runtime/Linux/rknn_server/armhf/usr/bin/rknn_server /usr/bin/
```

2. Обновите библиотеку RKNPU runtime.

```
// 64-bit Linux系统
adb push runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib
// 32-bit Linux系统
adb push runtime/Linux/librknn_api/armhf/librknnrt.so /usr/lib
```

3. Измените права исполняемого файла прокси.

```
adb shell chmod +x /usr/bin/rknn_server
```

4. Запустите службу прокси.

```
adb shell "killall rknn_server"
adb shell "nohup /usr/bin/rknn_server >/dev/null"&
```

5. Проверьте успешный запуск службы прокси.

```
adb shell ps -ef|grep rknn_server
```

Проверьте наличие идентификатора процесса `rknn_server`: он указывает на успешный запуск. Иначе войдите в оболочку платы через `adb shell` и запустите службу вручную следующими командами.

```
nohup /usr/bin/rknn_server > /dev/null&
```

### 4.3 Linux на RV1103/RV1106/RV1103B
Эти платформы используют librknnmrt.so и rknn_server из armhf-uclibc.
1. Обновите программу прокси.

```
adb push runtime/Linux/rknn_server/armhf-uclibc/usr/bin/rknn_server /oem/usr/bin
```

2. Обновите библиотеку RKNPU runtime.

```
adb push runtime/Linux/librknn_api/armhf-uclibc/librknnmrt.so /oem/usr/lib
```

3. Измените права исполняемого файла прокси.

```
adb shell chmod +x /oem/usr/bin/rknn_server
```

4. Запустите службу прокси.

```
adb shell "killall rknn_server"
adb shell "nohup /oem/usr/bin/rknn_server >/dev/null"&
```

5. Проверьте успешный запуск службы прокси.

```
adb shell ps |grep rknn_server
```

Проверьте наличие идентификатора процесса `rknn_server`: он указывает на успешный запуск. Иначе войдите в оболочку платы через `adb shell` и запустите службу вручную следующими командами.

```
nohup /oem/usr/bin/rknn_server > /dev/null&
```

### 4.4 Использование mini-runtime
Источник также предусматривает mini-runtime для RV1126B. Для его применения на RV1126B включите mini-rknn в rknn-toolkit2 при преобразовании модели:

```python
rknn.config(target_platform=_target_platform, mini_rknn=True)
```

Скопируйте librknnmrt.so на плату:

```shell
// 64-bit Linux系统
adb push runtime/Linux/librknn_api/aarch64/librknnmrt.so /oem/usr/lib
// 32-bit Linux系统
adb push runtime/Linux/librknn_api/armhf/librknnmrt.so /oem/usr/lib
```

Скопируйте и запустите соответствующий rknn_server, как описано выше, для отладки платы. При ошибке соединения обновите adbd; см. раздел частых вопросов.

{% endraw %}

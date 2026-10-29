---
title: "Отладка RKNN: включение, проверка и сброс журналов"
description: "Отладка RKNN: включение, проверка и сброс журналов"
excerpt: "Отладка RKNN: включение, проверка и сброс журналов"
translation_key: "rknn-server-logging"
slug: "rknn-server-logging"
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

Серия об отладке платы · 2/3

[Прокси RKNN: подготовка, развёртывание и mini-runtime](/ru/articles/rknn-server-proxy/)

**Отладка RKNN: включение, проверка и сброс журналов**

[Диагностика RKNN: подключение, память, хранилище и права](/ru/articles/rknn-server-troubleshooting/)

</div>

{% raw %}

## 5. Подробные журналы rknn_server
Подробное журналирование по умолчанию отключено. При ошибках соединения включите его для диагностики, следуя процедуре своей платформы.
### 5.1 Android
1. Настройте подробный журнал и запустите прокси:

```
adb logcat -c
adb shell "killall rknn_server"
adb shell "setprop persist.vendor.rknn.server.log.level 5 && nohup /vendor/bin/rknn_server >/dev/null"&
```

2. Проверьте успешный запуск службы прокси.

```
adb shell ps -ef|grep rknn_server
```

3. Запустите программу инференса Python на ПК.
4. Просмотрите журнал выполнения.

```
adb logcat
```

5. Подробный журнал замедляет инференс. Восстановите уровень по умолчанию:

```sh
adb shell "killall rknn_server"
adb shell "setprop persist.vendor.rknn.server.log.level 0 && nohup /vendor/bin/rknn_server >/dev/null"&
```

### 5.2 Linux (кроме RV1103/RV1106/RV1103B)
1. Создайте каталог для подробных журналов прокси.

```
adb shell mkdir -p /userdata
```

2. Задайте окружение для подробного журнала и запустите прокси.

```
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=5 && nohup /usr/bin/rknn_server >/userdata/server.log"&
```

3. Проверьте успешный запуск службы прокси.

```
adb shell ps -ef|grep rknn_server
```

Проверьте наличие идентификатора процесса `rknn_server`: он указывает на успешный запуск. Иначе войдите в оболочку платы через `adb shell` и запустите службу вручную следующими командами.

```
export RKNN_SERVER_LOGLEVEL=5
nohup /usr/bin/rknn_server >/userdata/server.log&
exit
```

4. Запустите программу инференса Python на ПК.
5. Просмотрите журнал.

```
adb shell cat /userdata/server.log
```

6. Подробный журнал замедляет инференс. Восстановите уровень по умолчанию:

```sh
   adb shell "killall rknn_server"
   adb shell "export RKNN_SERVER_LOGLEVEL=0 && nohup /usr/bin/rknn_server >/userdata/server.log"&
```

### 5.3 Linux (RV1103/RV1106/RV1103B)
1. Создайте каталог для подробных журналов прокси.

```
adb shell mkdir -p /userdata
```

2. Задайте окружение для подробного журнала и запустите прокси.

```
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=5 && nohup  /oem/usr/bin/rknn_server >/userdata/server.log"&
```

3. Проверьте успешный запуск службы прокси.

```
adb shell ps|grep rknn_server
```

Проверьте наличие идентификатора процесса `rknn_server`: он указывает на успешный запуск. Иначе войдите в оболочку платы через `adb shell` и запустите службу вручную следующими командами.

```
export RKNN_SERVER_LOGLEVEL=5
nohup /oem/usr/bin/rknn_server >/userdata/server.log&
exit
```

4. Запустите программу инференса Python на ПК.
5. Просмотрите журнал.

```
adb shell cat /userdata/server.log
```

6. Подробный журнал замедляет инференс. Восстановите уровень по умолчанию:

```sh
adb shell "killall rknn_server"
adb shell "export RKNN_SERVER_LOGLEVEL=0 && nohup  /oem/usr/bin/rknn_server >/userdata/server.log"&
```

{% endraw %}

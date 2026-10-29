---
title: "Диагностика RKNN: подключение, память, хранилище и права"
description: "Диагностика RKNN: подключение, память, хранилище и права"
excerpt: "Диагностика RKNN: подключение, память, хранилище и права"
translation_key: "rknn-server-troubleshooting"
slug: "rknn-server-troubleshooting"
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

Серия об отладке платы · 3/3

[Прокси RKNN: подготовка, развёртывание и mini-runtime](/ru/articles/rknn-server-proxy/)

[Отладка RKNN: включение, проверка и сброс журналов](/ru/articles/rknn-server-logging/)

**Диагностика RKNN: подключение, память, хранилище и права**

</div>

{% raw %}

## 6. Частые вопросы
### Проблема 1
В Debian rknn_server уже работает в фоне, но при инференсе на плате остаётся ошибка:

```
D NPUTransfer: ERROR: socket read fd = 4, n = -1: Connection reset by peer
D NPUTransfer: Transfer client closed, fd = 4
E RKNNAPI: rknn_init,  server connect fail!  ret = -9(ERROR_PIPE)!
E build_graph: The rknn_server on the concected device is abnormal, please start the rknn_server on the device according to:
               https://github.com/airockchip/rknn-toolkit2/blob/master/doc/rknn_server_proxy.md
```

**Решение из источника:** обычно adbd в прошивке Debian не прослушивает порт 5037. Проверьте на плате:

```
netstat -n -t -u -a
```

Если порт 5037 отсутствует, загрузите и обновите adbd следующими командами и перезагрузите плату. Иначе пропустите эти шаги.

```
wget -O adbd.zip https://ftzr.zbox.filez.com/v2/delivery/data/7f0ac30dfa474892841fcb2cd29ad924/adbd.zip
unzip adbd.zip
adb push adbd/linux-aarch64/adbd /usr/bin/adbd
```

Через оболочку устройства добавьте право исполнения adbd:

```sh
adb shell "chmod +x /usr/bin/adbd"
adb reboot
```

После перезагрузки запустите rknn_server по инструкции и повторите инференс на плате.
### Проблема 2
На RV1103/RV1106/RV1103B возникает `E RKNN: failed to allocate fd, ret: -1, errno: 12` или OOM.
**Решение:** выполните RkLunch-stop.sh на устройстве, остановите другие приложения, занимающие память, и обновите rknn_server до >=2.1.0 перед повторным инференсом.
### Проблема 3
Интерфейс Python init_runtime на RV1103/RV1106/RV1103B не выдаёт время выполнения отдельных слоёв.
Причина: эти платформы **не поддерживают** perf_debug=True.
### Проблема 4
На RV1103/RV1106/RV1103B accuracy_analysis завершается ошибкой: модель слишком велика для свободного хранилища платы.
**Решение:** проверьте хранилище командой df -h на устройстве. Пример вывода:

```sh
Filesystem                Size      Used Available Use% Mounted on
ubi0:rootfs              17.0M     14.1M      2.9M  83% /
devtmpfs                 27.4M         0     27.4M   0% /dev
tmpfs                    27.5M         0     27.5M   0% /dev/shm
tmpfs                    27.5M      8.0K     27.5M   0% /tmp
tmpfs                    27.5M     84.0K     27.4M   0% /run
/dev/ubi5_0              20.6M     14.5M      6.1M  70% /oem
/dev/ubi6_0              52.8M     24.5M     28.2M  46% /userdata

```

В примере больше всего свободного места в /userdata/. Используйте его для промежуточных файлов анализа точности и перезапустите rknn_server. Выполните на ПК:

```
adb shell "killall rknn_server"
adb shell "export RKNN_DUMP_DIR=/userdata/dumps && nohup /usr/bin/rknn_server >/dev/null"&
```

На RV1103/RV1106/RV1103B промежуточные результаты по умолчанию сохраняются в /tmp/dumps. Для восстановления этого пути выполните:

```
adb shell "killall rknn_server"
adb shell "unset RKNN_DUMP_DIR && nohup /usr/bin/rknn_server >/dev/null"&
```

Если хранилища устройства недостаточно и прошивка RV1103/RV1106/RV1103B поддерживает NFS, перед анализом точности смонтируйте каталог dump через NFS. Для сервера 192.168.1.1 и каталога /data0/nfs_shared выполните на устройстве команды монтирования в /userdata/dumps:

```
# 以241为例
mkdir -p /userdata/dumps
mount -t nfs -o nolock 192.168.1.1:/data0/nfs_shared /userdata/dumps
```

### Проблема 5
Обновление библиотеки Runtime через adb не действует.
**Решение:** после обновления библиотеки перезапустите rknn_server; изменение вступит в силу при следующем инференсе на плате. На RV1103/RV1106/RV1103B librknnmrt.so должна находиться в /oem/usr/lib. Если одноимённая библиотека есть в /usr/lib/, источник предписывает удалить /usr/lib/librknnmrt.so и перезапустить rknn_server.
### Проблема 6
При запуске службы прокси в Android возникает проблема прав доступа.
**Решение из источника:** команда `adb shell setenforce 0` отключает принудительное применение SELinux.

{% endraw %}

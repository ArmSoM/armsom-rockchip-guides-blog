---
title: "RKNN-Toolkit2 в WSL: установка, подключение платы и устранение ошибок"
description: "Полная инструкция: WSL, подключение по Ethernet/USB, adbkit и ошибка libGL.so.1 с исходными командами."
excerpt: "Полная инструкция: WSL, подключение по Ethernet/USB, adbkit и ошибка libGL.so.1 с исходными командами."
translation_key: "rknn-toolkit2-wsl"
slug: "rknn-toolkit2-wsl"
lang: "ru"
date: "2026-10-28"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: ["CM7S", "Sige7S", "Sige7", "AIM7", "LM7", "W3", "Sige5", "CM5", "AIM5", "Sige3", "CM3", "AIM3"]
tags: ["Rockchip", "RKNN", "Toolkit2", "Linux"]
---

Справочный материал для оценки на ArmSoM CM7S/Sige7S (RK3588S), Sige7/AIM7/LM7/W3 (RK3588), Sige5/CM5/AIM5 (RK3576) и соответствующих платформах RK3568. Необходимо согласовать ОС платы, драйвер NPU, SDK, Runtime и Toolkit2. Конкретная комбинация BSP/ядра и работа на оборудовании ArmSoM не проверялись. Утверждения о проверке относятся только к среде исходного документа.

Источник: китайский и английский Markdown о WSL из локального репозитория, без отдельного номера версии и иллюстраций. Команды и заполнители сохранены; русский и немецкий переводы основаны на английском тексте. Строки «1.» и «2.» в последнем блоке — подписи шагов источника, а не команды. Проверьте доступность команды adbkit после установки и пакета libgl1-mesa-glx в своей системе.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

{% raw %}

# RKNN-Toolkit2 в WSL

## 1. Установка WSL на компьютере Windows
Инструкция по установке WSL: https://learn.microsoft.com/en-us/windows/wsl/install

## 2. Использование RKNN-Toolkit2 в WSL
1. Установите среду RKNN-Toolkit2 в WSL по руководству [Rockchip_RKNPU_Quick_Start](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/).
2. Выполняйте преобразование, квантование моделей и другие операции в WSL по руководству [Rockchip_RKNPU_User_Guide](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/).

## 3. Отладка с подключённой платой через RKNN-Toolkit2 в WSL
### 3.1 Установка adb в терминале WSL

```
sudo apt update
sudo apt install adb
```

### 3.2 Подключение устройства в WSL
Устройство можно подключить по Ethernet или USB.
#### 3.2.1 Подключение по Ethernet

```
# 1. Connect the device using Ethernet cable.

# 2. In WSL, use adb connect to connect to the device.
adb connect <IP address:port>
```

`IP address` — IP-адрес платы.
#### 3.2.2 Подключение по USB

```
# 1. Connect the device to Windows via USB.

# 2. Use the adbkit tool in Windows to convert USB to TCP.
npm install --save adbkit
adbkit usb-device-to-tcp <device_id> -p <port>

# Note: Configure WSL to access Windows network.

# 3. In WSL, use adb connect to connect to the device.
adb connect <IP address:port>
```

- Значение `device_id` можно получить командой `adb devices` в Windows; инструмент adb должен быть установлен в Windows.
- `IP address` — IP-адрес компьютера Windows.

### 3.3 Отладка платы с RKNN-Toolkit2
Для выполнения инференса на плате, анализа точности и других операций из WSL следуйте руководству [Rockchip_RKNPU_User_Guide](https://github.com/airockchip/rknn-toolkit2/blob/master/doc/).

## Примечания
1. В исходном документе рекомендуется WSL2 с Ubuntu 22.04: эта конфигурация была проверена авторами источника. Другие версии теоретически возможны, но не проверены.
2. Если при использовании RKNN-Toolkit2 возникает ошибка `ImportError: libGL.so.1: cannot open shared object file: No such file or directory`, источник предлагает установить библиотеку и задать переменную окружения следующими командами:

```
1. Install the required library:
sudo apt update
sudo apt install libgl1-mesa-glx

2. Set the environment variable:
echo 'export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/mesa' >> ~/.bashrc
source ~/.bashrc
```

{% endraw %}

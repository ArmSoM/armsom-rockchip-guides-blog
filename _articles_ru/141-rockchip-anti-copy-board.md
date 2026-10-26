---
title: "Rockchip: защита от копирования плат трёх уровней"
description: "Rockchip: защита от копирования плат трёх уровней — V1.2.0."
translation_key: "141-rockchip-anti-copy-board"
slug: "141-rockchip-anti-copy-board"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "production"
products: []
tags: [ArmSoM, Rockchip, OTP, TEE, Security]
excerpt: "Rockchip: защита от копирования плат трёх уровней — V1.2.0."
---

{% raw %}

Полное техническое содержание китайского и английского оригиналов V1.2.0 (по17 страниц). Для ArmSoM необходимо проверить OTP/TEE конкретного SoC и совместимость U-Boot, rk_tee_user, SDK/BSP. Единая версия ядра не указана; поддержка всех плат не заявляется. Платформы перечислены по решениям. Аппаратная проверка ArmSoM не выполнялась; команды и вывод — примеры производителя.

> Запись OTP и блокировка ключей могут быть необратимыми; ошибки могут нарушить загрузку или восстановление данных. Публикация не разрешает исполнение. Сначала проверяйте на тестовых платах и подготовьте управление ключами, восстановление и производство. Команды записи, блокировки и настройки безопасности не выполнялись. В §4.4 ошибочно назван средний уровень внутри главы высокого уровня; это отмечено. Скриншоты инструментов английского PDF также содержат китайские подписи UI.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip U-Boot](https://github.com/rockchip-linux/u-boot)

## 1 Обзор

Чипы Rockchip предоставляют защиту от копирования плат для защиты прошивок, частных данных и основного кода заказчика. Она препятствует несанкционированному копированию и использованию прошивок/данных и связанным коммерческим потерям. Описаны три решения: начального, среднего и высокого уровня. Можно выбрать любое из них.

## 2 Решение начального уровня

### 2.1 Принцип

При производстве Rockchip записывает уникальный CPUID каждого чипа в OTP. Прочитайте CPUID и зашифруйте симметричным Key, получив ENC-CPUID для хранения в vendor storage. После загрузки прочитайте ENC-CPUID, расшифруйте в DEC-CPUID и сравните с CPUID. Несовпадение означает несанкционированное устройство, которое перезапускается для защиты от копирования.

![Рисунок 1: схема/снимок инструмента, английский оригинал, с. 4](/docs/rockchip-anti-copy-board/assets/en-p004-figure-01.png)

*Рисунок 1: схема/снимок инструмента, английский оригинал, с. 4*

Безопасность зависит от защиты Key. Не встраивайте открытый ключевой материал непосредственно в код; источник рекомендует предварительную обфускацию, усложняющую извлечение при дизассемблировании. ENC-CPUID хранится в vendor storage: стирание flash очищает раздел, поэтому затем ENC-CPUID необходимо записать заново.

### 2.2 Поддерживаемые платформы

Согласно источнику, решение поддерживается платформами с OTP в чипе. Проверьте /sys/bus/nvmem/devices/rockchip-otp0/nvmem: наличие узла — указанный в источнике критерий поддержки.

### 2.3 Порядок применения

Шаги решения начального уровня:

1. Создайте собственный симметричный Key, прочитайте CPUID из OTP и зашифруйте его AES с Key, получив ENC-CPUID.

2. Запишите ENC-CPUID в vendor storage. Обфусцируйте Key для повышения защиты и встройте его в код приложения.

3. При запуске приложение читает ENC-CPUID из vendor storage, расшифровывает с Key в DEC-CPUID и читает CPUID.

4. Сравните DEC-CPUID и CPUID. По результату продолжите работу либо немедленно перезапустите устройство.

### 2.4 Полная блок-схема

Полная блок-схема решения начального уровня:

![Рисунок 2: схема/снимок инструмента, английский оригинал, с. 6](/docs/rockchip-anti-copy-board/assets/en-p006-figure-01.png)

*Рисунок 2: схема/снимок инструмента, английский оригинал, с. 6*

### 2.5 Пример

1. Запишите ENC-CPUID через BoardProofTool. Удерживайте recovery при включении для входа в Loader. Создайте low.bin, откройте в hex-редакторе и внесите 32-байтный ключ. В BoardProofTool.exe выберите ключ (密钥), укажите low.bin и нажмите выполнение (执行).

![Рисунок 3: схема/снимок инструмента, английский оригинал, с. 7](/docs/rockchip-anti-copy-board/assets/en-p007-figure-01.png)

*Рисунок 3: схема/снимок инструмента, английский оригинал, с. 7*

BoardProofTool вызывает rkusb_do_read_otp в U-Boot для чтения CPUID, автоматически шифрует его ключом в ENC-CPUID и записывает через vendor_storage_write U-Boot.

2. Запишите ENC-CPUID из userspace через rk_anti_copy_board. Исходники: rk_tee_user/v2/host/rk_anti_copy_board. Команды сборки Android:

```text
cd /home1/xxxx/rk_android_13
source build/envsetup.sh
lunch rk3568_t-userdebug
cd /home1/xxxx/rk_android_13/external/rk_tee_user/v2
./build.sh ta
mm

//copy to device
adb push Y:\rk_android_13\out\target\product\rk3568_t\vendor\bin\rk_anti_copy_board /vendor/bin
```

Команды сборки Linux:

```text
cd /home1/xxxx/rk_px30_linux/external/security/rk_tee_user/v2
rm -rf out/
./build.sh 6432

//copy to device
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\rk_anti_copy_board\rk_anti_copy_board /usr/bin
```

Тестовая команда:

```text
root@RK3588:/# rk_anti_copy_board low_gen
generate enc_cpuid success!
```

3. Проверьте авторизацию устройства из userspace через rk_anti_copy_board. Тестовая команда:

```text
root@RK3588:/# rk_anti_copy_board low_verify
verify success!
```

## 3 Решение среднего уровня

### 3.1 Принцип

В OTP зарезервировано место для частных данных защиты. Создайте DATA и MAC и выберите функцию func так, чтобы MAC = func(DATA). Запишите DATA в OTP, а MAC встройте в код доверенного приложения TA. После загрузки TA читает DATA из OTP и проверяет заданную связь DATA и MAC. При несовпадении устройство считается неавторизованным и перезапускается.

![Рисунок 4: схема/снимок инструмента, английский оригинал, с. 8](/docs/rockchip-anti-copy-board/assets/en-p008-figure-01.png)

*Рисунок 4: схема/снимок инструмента, английский оригинал, с. 8*

Безопасность зависит от защиты DATA. Ядро не может прочитать их; доступ есть только у TA. Следуйте главе подписи TA в Rockchip_Developer_Guide_TEE_SDK_CN.md и подписывайте TA собственным ключом, чтобы неавторизованные TA не раскрыли DATA.

### 3.2 Поддерживаемые платформы

RV1109, RV1126, RK3566, RK3568, RK3588, RK3528, RK3562, RV1106, RK3576, RV1103B, RK3506, RV1126B

### 3.3 Порядок применения

Шаги решения среднего уровня:

1. Создайте частные DATA, выберите func и вычислите MAC = func(DATA).

2. Запишите DATA в OTP, разработайте TA и встройте MAC в её код.

3. Приложение вызывает TA. TA читает DATA из OTP, проверяет соответствие MAC и возвращает результат.

4. По результату приложение продолжает работу либо немедленно перезапускает устройство.

### 3.4 Полная блок-схема

Полная блок-схема решения среднего уровня:

![Рисунок 5: схема/снимок инструмента, английский оригинал, с. 10](/docs/rockchip-anti-copy-board/assets/en-p010-figure-01.png)

*Рисунок 5: схема/снимок инструмента, английский оригинал, с. 10*

### 3.5 Пример

1. Запишите DATA в OTP через BoardProofTool. Удерживайте recovery при включении для входа в Loader. Создайте mid.bin в hex-редакторе с 16 байтами частных данных защиты. В BoardProofTool.exe выберите файл данных (数据), затем выполнение (执行). OTP программируется однократно: эти данные можно записать только один раз на устройство.

![Рисунок 6: схема/снимок инструмента, английский оригинал, с. 11](/docs/rockchip-anti-copy-board/assets/en-p011-figure-01.png)

*Рисунок 6: схема/снимок инструмента, английский оригинал, с. 11*

2. Запишите DATA в OTP из userspace через rk_anti_copy_board. Исходники: rk_tee_user/v2/host/rk_anti_copy_board. Команды сборки Android:

```text
cd /home1/xxxx/rk_android_13
source build/envsetup.sh
lunch rk3568_t-userdebug
cd /home1/xxxx/rk_android_13/external/rk_tee_user/v2
./build.sh ta
mm

//copy to device
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\libteec.so /vendor/lib64
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\tee-supplicant /vendor/bin
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\rk_anti_copy_board\3d4fc699-2065-7bb9-33c7-b6529b43c91a.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\out\target\product\rk3568_t\vendor\bin\rk_anti_copy_board /vendor/bin
```

Команды сборки Linux:

```text
cd /home1/xxxx/rk_px30_linux/external/security/rk_tee_user/v2
rm -rf out/
./build.sh 6432

//copy to device
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\libteec.so.1 /lib64
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\tee-supplicant /usr/bin
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\rk_anti_copy_board\3d4fc699-2065-7bb9-33c7-b6529b43c91a.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\rk_anti_copy_board\rk_anti_copy_board /usr/bin
```

Тестовая команда:

```text
root@RK3588:/# rk_anti_copy_board mid_gen
save data into OTP success!
```

3. Проверьте авторизацию устройства из userspace через rk_anti_copy_board. Тестовая команда:

```text
root@RK3588:/# tee-supplicant &
root@RK3588:/# rk_anti_copy_board mid_verify
I/TA: Hello!
I/TA: verify success!
I/TA: Goodbye!
```

## 4 Решение высокого уровня

### 4.1 Принцип

В OTP зарезервировано место для частных ключей заказчика; см. OEM Cipher Key в Rockchip_Developer_Guide_OTP_CN.md. Решение использует OEM Cipher Key, записанный на производстве. Для предотвращения раскрытия система предоставляет запись, но не чтение ключа. Некоторые платформы поддерживают блокировку Hardware Read: после неё CPU не читает ключ. Выберите открытые data и зашифруйте OEM Cipher Key алгоритмом AES в enc-data. Храните enc-data в заданном месте flash либо в коде, а открытые data — в приложении. После загрузки расшифруйте enc-data в dec-data и сравните с data. Изменение data/enc-data либо копирование прошивки на неавторизованный чип приводит к несовпадению; устройство считается неавторизованным и перезапускается.

![Рисунок 7: схема/снимок инструмента, английский оригинал, с. 13](/docs/rockchip-anti-copy-board/assets/en-p013-figure-01.png)

*Рисунок 7: схема/снимок инструмента, английский оригинал, с. 13*

Преимущество: после блокировки OEM Cipher Key CPU не может его читать, что повышает конфиденциальность, целостность и устойчивость к изменению.

### 4.2 Поддерживаемые платформы

RV1109, RV1126, RK3566, RK3568, RK3588, RK3528, RK3562, RV1106, RK3576, RV1103B, RK3506, RV1126B. Блокировка ключа поддерживается на RK3588, RK3528, RK3562, RK3576, RK3506, RV1126B.

### 4.3 Порядок применения

Шаги решения высокого уровня:

1. Создайте частный OEM Cipher Key, запишите в OTP и заблокируйте.

2. Задайте открытые data в коде приложения.

3. В приложении зашифруйте data ключом OEM Cipher Key в enc-data и сохраните в заданном месте flash либо встройте в код.

![Рисунок 8: схема/снимок инструмента, английский оригинал, с. 14](/docs/rockchip-anti-copy-board/assets/en-p014-figure-01.png)

*Рисунок 8: схема/снимок инструмента, английский оригинал, с. 14*

4. После загрузки приложение расшифровывает enc-data из flash ключом OEM Cipher Key в dec-data и сравнивает с data в своём коде. По результату продолжает работу либо немедленно перезапускается.

![Рисунок 9: схема/снимок инструмента, английский оригинал, с. 14](/docs/rockchip-anti-copy-board/assets/en-p014-figure-02.png)

*Рисунок 9: схема/снимок инструмента, английский оригинал, с. 14*

### 4.4 Полная блок-схема

Полная блок-схема решения среднего уровня (формулировка источника в главе высокого уровня):

![Рисунок 10: схема/снимок инструмента, английский оригинал, с. 15](/docs/rockchip-anti-copy-board/assets/en-p015-figure-01.png)

*Рисунок 10: схема/снимок инструмента, английский оригинал, с. 15*

### 4.5 Пример

1. Запишите OEM Cipher Key через BoardProofTool. Удерживайте recovery при включении для Loader. Создайте high.bin в hex-редакторе с 16-байтным ключом (также поддерживаются 24 или 32 байта). В BoardProofTool.exe выберите Key Index и high.bin через поле ключа (密钥), затем выполнение (执行). OTP программируется однократно: для одного Key Index частный ключ можно записать лишь один раз на устройство.

![Рисунок 11: схема/снимок инструмента, английский оригинал, с. 16](/docs/rockchip-anti-copy-board/assets/en-p016-figure-01.png)

*Рисунок 11: схема/снимок инструмента, английский оригинал, с. 16*

2. Запишите OEM Cipher Key из userspace через rk_anti_copy_board. Исходники: rk_tee_user/v2/host/rk_anti_copy_board. Сборка соответствует начальному решению и здесь не повторяется. Тестовая команда:

```text
root@RK3588:/# rk_anti_copy_board high_gen
```

3. Проверьте авторизацию устройства из userspace через rk_anti_copy_board. Тестовая команда:

```text
root@RK3588:/# rk_anti_copy_board high_verify
```

### 4.6 Расширение решения

Использование OEM Cipher Key можно расширить: например, хранить важные данные зашифрованными и после загрузки расшифровывать по необходимости. Основной код также можно зашифровать и расшифровывать перед выполнением.

## 5 Расширенная безопасность

Сочетайте защиту от копирования со следующими технологиями для дальнейшего снижения риска и повышения безопасности.

- Secure Boot: проверка прошивки при запуске, подтверждение её неизменности и предотвращение запуска неавторизованных программ. Процесс и шаги см. в документации Secure Boot.
- Шифрование прошивки: шифровать перед записью и расшифровывать только при загрузке, предотвращая доступ к открытому содержимому flash и анализ дизассемблированием.

{% endraw %}

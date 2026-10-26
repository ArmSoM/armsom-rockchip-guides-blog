---
title: "Rockchip TEE SDK: TrustZone, CA/TA и защищённое хранение"
description: "Rockchip TEE SDK: TrustZone, CA/TA и защищённое хранение — V1.16.1."
translation_key: "143-rockchip-tee-sdk"
slug: "143-rockchip-tee-sdk"
lang: "ru"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "production"
products: []
tags: [ArmSoM, Rockchip, TEE, TrustZone, OTP]
excerpt: "Rockchip TEE SDK: TrustZone, CA/TA и защищённое хранение — V1.16.1."
---

{% raw %}

Полное техническое содержание китайского/английского оригиналов V1.16.1 (64/69 страниц). Для ArmSoM проверьте соответствие SoC, SDK/BSP, OP-TEE V1/V2, U-Boot, ядра и библиотек; поддержка всех плат не заявляется. Требования оригинала к Android, драйверам и прошивкам сохранены. Проверка на аппаратуре ArmSoM не выполнялась; измерения, команды и вывод — примеры производителя.

> Запись OTP, изменение ключей, жизненного цикла и уровня безопасности могут быть необратимыми либо нарушить загрузку/доступ к данным. Проверьте чип и ПО, затем тестируйте на выделенных устройствах. Команды записи, блокировки, ключей или настройки безопасности не выполнялись. Обзор Android и угроз отражает контекст документа, не текущее состояние всех Android-устройств.

> Расхождения оригиналов: (1) salt_len в rk_rsa_sign: китайский текст, с.50 — «если отсутствует», английский, с.55 — «если равен0»; затем оба задают длину дайджеста. Условия неравнозначны; сохранены оба, поведение следует проверить в реализации SDK. (2) Пример подписи: китайский RK3588/Android12, английский общий arm64/OP-TEE V2/Android12. Сохранена конкретная китайская платформа без расширения применимости. (3) Китайский раздел отката называет открытым текстом лишь TA в REE FS; английский также упоминает Secure Storage как открытый текст. Следуем китайскому варианту, не объявляя безопасное хранилище незашифрованным. (4) В тексте trusted key написано key_ctl, пакет установки keyutils, вызовы keyctl; различия сохранены. (5) В таблице crypto_aes исходное AED отмечено как написание оригинала, API не переименовано.

[ArmSoM Docs](https://docs.armsom.org/) · [OP-TEE](https://optee.readthedocs.io/) · [GlobalPlatform](https://globalplatform.org/)

## 1 Порядок чтения

Ниже приведён порядок чтения документа и использования TEE — руководство для разработчика.

1. Изучите основы TEE: архитектуру аппаратного/программного обеспечения TrustZone и базовые сведения TEE.

2. Определите и настройте функции. Версия OPTEE — раздел о платформах. Уровень безопасности — раздел о выборе уровней. Ключ подписи TA — раздел подписи TA. Дополнительная защита TA — размещение TA в защищённом хранилище, шифрование TA, защита REE FS TA от отката. Защищённое хранилище и производительность — соответствующий раздел. OTP — раздел OTP.

3. Подготовьте TEE. Файловая система защищённого хранилища — разделы о хранилище и Parameter.txt. Включение прошивки — раздел прошивки TEE. TEE в U-Boot — раздел драйвера TEE U-Boot. TEE в ядре — раздел драйвера TEE Linux.

4. Проверьте CA/TA. Окружение и каталоги проекта — библиотеки TEE, настройка окружения, Android и Linux. Ознакомление с демо RK и сборка — описание CA/TA demo, Android и Linux. Установка библиотек и демо, затем проверка — разделы Android/Linux.

5. Разрабатывайте CA/TA. Методы отладки TA приведены в соответствующем разделе. Используйте демо и TA API: описание демо CA/TA и раздел TA API.

## 2 Введение в TrustZone

### 2.1 Что такое TrustZone

ARM TrustZone — общесистемный подход к безопасности высокопроизводительных платформ для защищённых платежей, управления цифровыми правами (DRM), корпоративных и веб-сервисов. Он тесно интегрирован с CortexTM-A и распространяется по системе через AMBA-AXI и специализированные IP-блоки TrustZone. Поэтому можно защищать память, криптоблоки, клавиатуры и экраны от программных атак. Устройства, созданные по рекомендациям TrustZone Ready Program, предоставляют платформу для полноценной доверенной среды исполнения (TEE), приложений и сервисов безопасности. Смартфоны и планшеты стали открытыми программными платформами, загружающими крупные приложения из Интернета. OEM проверяют качество приложений, но не могут проверить все функции; злоумышленники постоянно создают новое вредоносное ПО. Одновременно растёт роль важных мобильных услуг: оплаты и просмотра новых фильмов на ограниченное время, дистанционной оплаты счетов и управления банковскими счетами. Новые бизнес-модели делают телефоны целью вредоносного ПО, троянов и руткитов. Сочетание расширенной защиты ARM TrustZone и устойчивых к вмешательству элементов SecurCoreTM позволяет создавать устройства с функциональной открытой средой и сильной защитой. Доверенные приложения на SoC с TrustZone работают в TEE отдельно от основной ОС, защищаясь от программных/вредоносных атак. Переключение в защищённый режим даёт аппаратную изоляцию. Доверенные приложения обычно изолируются друг от друга: например, приложения разных платёжных компаний сосуществуют на одном устройстве. Поддержка TrustZone — базовая возможность всех процессоров Cortex-A, введённая расширениями безопасности архитектуры ARM. Они обеспечивают единообразную модель программирования между поставщиками, платформами и приложениями, а также реально аппаратно поддерживаемую защищённую среду.

### 2.2 Аппаратная и программная архитектура TrustZone

#### 2.2.1 Аппаратная архитектура

Аппаратная архитектура TrustZone предоставляет каркас защиты от множества конкретных угроз, а не неизменное готовое решение. Разработчик SoC выбирает компоненты для функций безопасной среды. Главная цель — программируемая среда, защищающая конфиденциальность и целостность активов от определённых атак. Такая платформа позволяет строить широкий набор решений, которые традиционным способом потребовали бы значительных времени и усилий.

![Рисунок 1: английский оригинал, с. 11](/docs/rockchip-tee-sdk/assets/en-p011-figure-01.png)

*Рисунок 1: английский оригинал, с. 11*

Безопасность обеспечивается разделением всех аппаратных и программных ресурсов SoC на защищённый мир для безопасной подсистемы и обычный мир для всего остального. Аппаратная логика AMBA3 AXITM с TrustZone не допускает доступ компонентов обычного мира к защищённым ресурсам, формируя строгую границу. Чувствительные ресурсы в защищённом мире и надёжное исполнение на защищённом ядре отражают многие атаки, включая сложные случаи ввода пароля с клавиатуры/экрана. Аппаратная изоляция периферии сокращает число подсистем для оценки безопасности и стоимость сертификации. Второй аспект — расширения некоторых ARM-ядер: одно физическое ядро безопасно и эффективно исполняет код обоих миров с разделением времени. Отдельное защищённое ядро не требуется, экономятся площадь и энергия; высокопроизводительное безопасное ПО работает рядом с обычной средой. Контекст виртуальных процессоров переключается через новый режим монитора. Вход из обычного мира строго контролируется и воспринимается монитором как исключение. Его вызывает инструкция Secure Monitor Call (SMC) либо подмножество аппаратных исключений. IRQ, FIQ, external data abort и external prefetch abort можно настроить на вход в монитор. Реализация монитора зависит от системы, обычно сохраняет состояние текущего мира, восстанавливает целевой мир и возвращается из исключения для продолжения работы. Последний аспект — инфраструктура отладки с учётом безопасности: доступ к отладке защищённого мира контролируется без ухудшения наблюдаемости обычного мира.

#### 2.2.2 Программная архитектура

![Рисунок 2: английский оригинал, с. 12](/docs/rockchip-tee-sdk/assets/en-p012-figure-01.png)

*Рисунок 2: английский оригинал, с. 12*

Защищённый мир требует ПО, использующего находящиеся там чувствительные активы. Архитектуры варьируются от специальной защищённой ОС до синхронной библиотеки кода; между ними много вариантов. Отдельное защищённое ядро сложно, но позволяет моделировать конкурентное исполнение независимых приложений, загружать новые приложения во время работы и выполнять задачи независимо от обычного мира. Это похоже на AMP с двумя физическими ядрами: в каждом виртуальном процессоре своя ОС, аппаратные прерывания позволяют вытеснить другой мир и получить процессорное время. Тесная интеграция через протокол связи, связывающий защищённые задачи с запрашивающими их потоками обычного мира, даёт многие преимущества SMP. Например, безопасное приложение наследует приоритет поддерживаемой обычной задачи, обеспечивая некоторую мягкую реакцию реального времени для медиаприложений. Расширения безопасности открыты в архитектуре ARM, поэтому разработчик может создать собственную среду защищённого мира.

#### 2.2.3 TrustZone и TEE

Платежи, интернет-банкинг, защита контента и корпоративная аутентификация улучшают целостность, функции и удобство, используя три возможности TrustZone:

1. Защищённая среда исполнения ПО против вредоносных атак из богатой ОС.

2. Заведомо надёжный аппаратный корень доверия для проверки целостности данных и приложений обычного мира без компрометации безопасной среды.

3. Доступ по необходимости к защищённой периферии: памяти, клавиатуре/сенсорному экрану и даже дисплею. TrustZone вместе с открытыми API предоставляет TEE. Для её возможностей и согласованности нужны доверенные приложения. Обычно части приложения работают в обоих мирах, например критичное хранение и обработка — в защищённом. Изоляция от других доверенных приложений позволяет нескольким доверенным сервисам сосуществовать.

Стандартизация TEE API под управлением GlobalPlatform позволяет поставщикам услуг, операторам и OEM выводить совместимые доверенные приложения и сервисы на рынок. Для проверки устройства/пользователя TrustZone не требует отдельного защитного оборудования: аппаратный корень доверия находится в основном чипсете. В TEE запускаются только доверенные приложения, защищённые от хакеров, вирусов и вредоносного ПО. Аппаратная изоляция отделяет TEE от программных векторов атак и распространяется до физической периферии ввода/вывода, включая клавиатуру и сенсорный экран. Это позволяет предлагать больше и лучшие услуги, более быстрый и простой доступ в любом месте и времени. В исходном описании говорится, что на большинстве Android-устройств загрузчик не проверяет подлинность ядра. Пользователь может установить взломанное ядро для root-доступа ко всем файлам, приложениям и ресурсам. Повреждение такого ядра вызывает отказ в обслуживании, вредоносный код угрожает корпоративным данным. Secure Boot препятствует загрузке неавторизованных загрузчиков и ядер. Образы ОС и компонентов, криптографически подписанные доверенным известным центром, считаются разрешёнными. Компоненты безопасной загрузки образуют первую линию защиты от вредоносных атак.

## 3 Среда TEE

### 3.1 Платформы

SDK Android 7.1 и выше для Rockchip по умолчанию поддерживают TEE; более ранние версии — нет. Linux SDK по умолчанию не включает TEE, но его можно настроить вручную по следующим разделам. Rockchip использует OP-TEE, API соответствует GlobalPlatform. Есть две версии: OP-TEE V1 и V2.

1. OP-TEE V1: RK312x, RK322x, RK3288, RK3328, RK322xh, RK3368, RK3399, RK3399Pro.

2. OP-TEE V2: RK3326/PX30, RK3358, RK3308, RK1808, RV1109/RV1126, RK3566/RK3568, RK3588, RK3528, RK3562, RV1106 и последующие платформы. Прошивка, библиотеки и TA-файлы различаются, поэтому компоненты выбирают по платформе. Платформы вне списка V1 считаются V2.

### 3.2 Parameter.txt

OP-TEE поддерживает несколько файловых систем защищённого хранения (см. соответствующий раздел). Для хранения в разделе security он должен быть определён в parameter.txt, где заданы позиции и размеры образов/разделов. Добавьте 0x00002000@0x000xxxxx(security): 0x00002000 означает размер 4M, 0x000xxxxx — начальный адрес. Изменяйте согласно реальному parameter.txt; обычно раздел уже определён.

### 3.3 Прошивка TEE

Прошивка TEE также называется TEE binary или Secure OS, на 64-битных платформах — BL32. Исходники Secure OS по умолчанию закрыты. Двоичные файлы находятся в u-boot/tools/rk_tools/bin или rkbin/bin.

1. На ARMv7 инструмент u-boot/tools/loaderimage упаковывает TEE binary в trust.img. Имена файлов:

```text
<platform>_tee_[ta]_<version>.bin
such as: rkbin/bin/rk35/rk3506_tee_v1.26.bin
such as: rkbin/bin/rk35/rk3506_tee_ta_v1.00.bin
```

Имя с ta означает поддержку User TA, без ta — отсутствие поддержки. При сборке U-Boot по умолчанию использует TOS.ini, либо файл, заданный CONFIG_TRUST_INI. Например, RK3506TOS.ini указывает на прошивку без ta, поэтому RK3506 по умолчанию не запускает User TA. Для этого задайте CONFIG_TRUST_INI="RK3506TOS_TA.ini", указывающий на вариант с ta. Быстрый запуск RK3506 запускает TEE, но не U-Boot, поэтому U-Boot не исключает защищённую память автоматически. Для прошивки с ta дополнительно задайте следующую конфигурацию в reserved_memory DTS ядра, чтобы исключить память TEE.

```text
trust@1 {
    reg = <0x3c00000 0x140000>;
};
```

На других платформах U-Boot автоматически исключает защищённую память TEE; дополнительная настройка DTS ядра не требуется.

2. На ARMv8 u-boot/tools/trust_merger упаковывает BL31/BL32 и другие файлы в trust.img. Имена TEE binary:

```text
<platform>_bl32_<version>.bin
such as: rkbin/bin/rk35/rk3588_bl32_v1.18.bin
```

3. Если в rkbin/RKTRUST/.ini в [BL32_OPTION] указано SEC=0, измените на SEC=1; иначе trust.img не содержит SecureOS и сервисы TEE не работают.

4. RK3566/RK3568, RK3588, RK3528, RK3562, RV1106 и последующие платформы упаковывают TEE в uboot.img и не создают trust.img. Следующий тип вывода показывает, что прошивка TEE платформы OPTEE V1 запущена.

```text
INF [0x0] TEE-CORE:init_primary_helper:337: Initializing (1.1.0-278-gef70f120a #9 Fri Sep 17
09:39:24 UTC 2021 aarch64)
INF [0x0] TEE-CORE:init_primary_helper:338: Release version: 1.2
INF [0x0] TEE-CORE:init_teecore:83: teecore inits done
INFO:    BL31: Preparing for EL3 exit to normal world
INFO:    Entry point address = 0x200000
INFO:    SPSR = 0x3c9
```

Следующий тип вывода показывает запуск TEE платформы OPTEE V2.

```text
I/TC: OP-TEE version: 3.13.0-897-g5813e173a
I/TC: OP-TEE memory: TEEOS 0x200000 TA 0xc00000 SHM 0x200000
I/TC: Primary CPU initializing
I/TC: Primary CPU switching to normal world boot
INFO:    BL31: Preparing for EL3 exit to normal world
INFO:    Entry point address = 0x200000
INFO:    SPSR = 0x3c9
```

### 3.4 Драйвер TEE в U-Boot

Некоторые безопасные операции требуются уже в U-Boot: например, для чтения данных нужна помощь OP-TEE. U-Boot реализует OP-TEE Client для связи с OP-TEE. Драйвер находится в lib/optee_client, API соответствует GP.

#### 3.4.1 Определения макросов

CONFIG_OPTEE_CLIENT — общий переключатель вызовов OP-TEE из U-Boot. CONFIG_OPTEE_V1 — для платформ OP-TEE V1. CONFIG_OPTEE_V2 — для платформ OP-TEE V2. Без CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION U-Boot выбирает защищённое хранилище по оборудованию: eMMC использует RPMB, NAND — раздел security. При включении макроса всегда используется security, не RPMB. Настройка действует только в U-Boot, не в ядре/userspace. RPMB безопаснее и стабильнее security, но менее удобен: при замене eMMC с другого устройства либо замене SoC для security достаточно стереть flash инструментом прошивки и перепрошить; RPMB этим инструментом не очищается, нужна специальная прошивка для очистки перед повторной записью. Выбирайте между удобством и безопасностью. Некоторые платформы включают макрос по умолчанию; при повышенных требованиях его можно удалить.

#### 3.4.2 Общая память

Обмен U-Boot/OP-TEE требует общей памяти, выделяемой TEEC_AllocateSharedMemory(). Размер зависит от платформы; рекомендуется не более 1M. Большие данные передавайте частями. После использования освобождайте память TEEC_ReleaseSharedMemory().

#### 3.4.3 Проверка защищённого хранилища

##### 3.4.3.1 Порядок проверки

Следующий тест циклически проверяет чтение/запись защищённого хранилища. Он автоматически определяет оборудование: eMMC проверяет RPMB и security, NAND — только security. Для eMMC убедитесь, что U-Boot включает CONFIG_SUPPORT_EMMC_RPMB.

1. Войдите в последовательную консоль U-Boot: подключите UART устройства к ПК, удерживайте ctrl+c на ПК и запустите устройство. Обнаружив ctrl+c при старте, оно остановится в U-Boot.

2. Запустите тест следующей командой.

```text
=> mmc testsecurestorage
```

##### 3.4.3.2 Диагностика распространённых ошибок

```text
"TEEC: Could not find device"
```

Устройство eMMC или NAND не найдено: проверьте драйвер U-Boot и аппаратные повреждения.

```text
"TEEC: Could not find security partition"
```

При использовании security зашифрованные данные хранятся в этом разделе. Проверьте его определение в parameter.txt.

```text
"TEEC: verify [%d] fail, cleanning ...."
```

Возникает при первом использовании security либо незаконном изменении его данных; раздел security будет полностью очищен.

```text
"TEEC: Not enough space available in secure storage !"
```

Недостаточно места: проверьте размер данных, число файлов и наличие большого количества ранее сохранённых, но не удалённых данных.

```text
INF [0x0] TEE-CORE:storage_read_obj:201: Warning! head data not find!
ERR [0x0] TEE-CORE:storage_read_obj:210: cpu or emmc was replaced!
```

При загрузке U-Boot сохраняет критичные данные через TEE в security либо RPMB в зашифрованном виде; ключ привязан к CPU. Замена CPU мешает расшифрованию и загрузке U-Boot. Замена eMMC ранее использованным чипом со старыми данными security/RPMB также вызывает сбой. Требуется очистка старых данных: для security форматируют eMMC; для RPMB нужно запросить специальную прошивку у техподдержки.

```text
“optee check api revision fail”
```

Версии U-Boot и TEE несовместимы, U-Boot новее TEE. Два варианта решения:

1. Верните U-Boot к cf13b78438 (tag: android-10.0-mid-rkr9) rockchip: spl: add rollback index check with otp.

2. Отмените следующие коммиты: 396e3049bd rochchip: board: only map op-tee share memory as dcache enabled; 7a349fdcbd lib: optee_client: add optee initialize flag; 74eb602743 lib: optee_client: update to new optee msg for optee v1 platform; 102dfafc4a rochchip: board: map op-tee memory as dcache enabled. Обычно выпущенные версии SDK согласованы.

```text
"optee api revision mismatch with u-boot/kernel, panic"
```

Если сообщение появляется при старте U-Boot, U-Boot старее TEE и несовместим. Обновите U-Boot до 396e3049bd (tag: android-10.0-mid-rkr11, tag: android-10.0-mid-rkr10) rochchip: board: only map op-tee share memory as dcache enabled или новее.

При выводе во время старта Android обновите android/vendor/rockchip/common до 8bc7bf97 (tag: android-10.0-mid-rkr10) vpu: librockit: add Rockit MetadataRetriever или новее.

При выводе во время старта Linux обновите linux/external/security/bin до f59085c optee_v1: lib: arm&amp;arm64: update binary and library или новее. Выпущенные SDK обычно согласованы.

#### 3.4.4 User TA в U-Boot

Этот раздел описывает запуск собственных TA разработчика на стадии U-Boot.

1. Проверьте наличие коммита функции; если его нет, обновите U-Boot.

```text
436fc6d8486 lib: optee_clientApi: support load user ta for optee v1
4d4c5043204 lib: optee_clientApi: add user ta test demo
b122ee17db0 lib: optee_clientApi: support load user ta
deb4d4879d5 lib: optee_clientApi: support pack TA to image
```

2. Скопируйте TA в u-boot/lib/optee_clientApi/userta. Каталог допускает несколько TA; по умолчанию содержит тестовую rktest TA.

3. Следующей командой упакуйте TA в userta.img.

```text
cd lib/optee_clientApi
./tabinary_to_img.py --tadir ./userta --out ./userta/userta.img
```

4. Добавьте в parameter.txt раздел userta размером больше userta.img.

5. Запишите parameter.txt и userta.img инструментом прошивки.

6. U-Boot вызывает trusty_oem_user_ta_transfer и trusty_oem_user_ta_storage для проверки rktest TA. Используйте эти функции как образец вызова собственных TA.

### 3.5 Драйвер TEE ядра Linux

Драйверы TEE Linux находятся в security/optee_linuxdriver/ и drivers/tee/.

#### 3.5.1 OP-TEE V1

Драйвер платформ OP-TEE V1 находится в security/optee_linuxdriver/ и обычно включён. Для включения добавьте следующие параметры config:

```text
CONFIG_TEE_SUPPORT=y
```

Драйвер Linux OP-TEE V1 постепенно выводится из использования; платформы V1 переходят на драйвер V2. Если версия в имени TEE binary в rkbin/bin &gt;= v2.00, также включите драйвер V2. Android10 и выше и Linux, выпущенные после августа 2020, по умолчанию используют драйвер ядра V2.

#### 3.5.2 OP-TEE V2

Драйвер OP-TEE V2 находится в drivers/tee/. Убедитесь, что DTSI платформы содержит следующий узел:

```text
firmware {
    optee: optee {
        compatible = "linaro,optee-tz";
        method = "smc";
        #status = "disabled";
    };
};
```

Узел обычно присутствует, но некоторые платформы задают status = "disabled"; и отключают драйвер. Для включения удалите эту строку. Добавьте два параметра config:

```text
CONFIG_TEE=y
CONFIG_OPTEE=y
```

#### 3.5.3 Проверка включения драйвера

/dev/opteearmtz00 означает включённый драйвер ядра OP-TEE V1; /dev/tee0 и /dev/teepriv0 — включённый драйвер V2.

### 3.6 Включение trusted key

trusted key — механизм защищённого управления ключами ядра Linux. Он использует доверенную среду (TPM либо TEE), чтобы содержимое ключа не раскрывалось в обычной памяти/userspace.

#### 3.6.1 trusted key в ядре

Добавьте два параметра config:

```text
CONFIG_TRUSTED_KEYS=y
CONFIG_TRUSTED_KEYS_TEE=y
```

#### 3.6.2 trusted key в optee_os

1. Требуется поддержка в BL32. Поддерживаемые платформы и версии BL32:

| Платформа чипа | Версия |
| --- | --- |
| RK3588 | >= rk3588_bl32_v1.21.bin |

2. При включённом TEE-бэкенде trusted_key появится следующий вывод:

```text
root@linaro-alip:/# dmesg | grep trusted
[    1.814593] Initialise system trusted keyrings
[    2.456306] Key type trusted registered
```

#### 3.6.3 Использование

Например, в Ubuntu сначала установите инструмент key_ctl:

```text
sudo apt-get install keyutils
```

Для проверки добавления ключа используйте следующую команду:

```text
root@linaro-alip:/# keyctl add trusted test_key "new 32" @u
1028348999
root@linaro-alip:/#
root@linaro-alip:/# keyctl list @u
1 key in keyring:
1028348999: --alswrv     0     0 trusted: test_key
root@linaro-alip:/#
root@linaro-alip:/# keyctl unlink 1028348999 @u
root@linaro-alip:/#
```

### 3.7 Библиотеки TEE

Компоненты TEE Android находятся в vendor/rockchip/common/security либо hardware/rockchip/optee дерева Android. Имеются V1/V2; выбирайте файлы по платформе:

1. lib: 32-/64-битные tee-supplicant, libteec.so и библиотеки keymaster/gatekeeper.

2. ta: собранные TA keymaster/gatekeeper и другие. Компоненты Linux TEE находятся в external/security/bin дерева Linux; также выбирайте V1/V2 по платформе:

1. lib: 32-/64-битные tee-supplicant, libteec.so и другие CA-библиотеки.

2. ta: собранные TA-файлы.

## 4 Разработка и проверка CA/TA

### 4.1 Настройка окружения

1. Ошибка сборки No module named Crypto.Signature означает отсутствие криптобиблиотеки Python на ПК разработчика. Выполните:

```text
pip uninstall Crypto
pip uninstall pycrypto
pip install pycrypto
```

2. При ModuleNotFoundError: No module named 'Cryptodome' установите пакет Python на хосте: pip3 install [--user] pycryptodomex

### 4.2 Демо CA/TA

RK предоставляет CA/TA demo как образец разработки и для проверки TEE. Исходники: external/rk_tee_user в Android либо external/security/rk_tee_user в Linux. Есть rktest и xtest; xtest поддерживается только репозиторием external/rk_tee_user/v2 Android и представляет открытые тесты OPTEE с достаточно полным покрытием. Для проверки среды и образца разработки обычно достаточно rktest; его функции описаны далее.

CA демо называется rktest, TA — 1db57234-dacd-462d-9bb1ae79de44e2a5.ta либо 1db57234-dacd-462d-9bb1-ae79de44e2a5.ta. Функция выбирается аргументом CA. Имя CA, пробел и произвольный символ выводят доступные аргументы. Реализованные тесты приведены в таблице. Они охватывают лишь распространённые функции, не все возможности OPTEE.

| Параметр | Функция | Примечание |
| --- | --- | --- |
| transfer_data | Передача параметров между CA и TA |  |
| storage | Тест защищённого хранения | Перед тестом должны существовать узлы ядра: `/dev/block/by-name/security` для раздела security; для rpmb нужны `/dev/block/mmcblk%u`, `/dev/block/mmcblk%urpmb`, `/sys/class/mmc_host/mmc%u/mmc%u:0001/cid`, где %u — 0, 1 или 2. Если узла нет, создайте ссылку на соответствующий узел. |
| storage_speed | Производительность защищённого хранения |  |
| property | Получение property |  |
| crypto_sha | Тест SHA |  |
| crypto_aes | Тест AED (так в источнике) |  |
| crypto_rsa | RSA: шифрование/расшифрование, подпись/проверка |  |
| secstor_ta | Встраивание TA в защищённый storage | Сначала прочитайте раздел о встраивании TA в защищённый storage и разберитесь в принципе функции. |
| otp_read | Чтение OEM_S_OTP | Тесты OTP по умолчанию скрыты; для включения задайте определение в /host/rk_test/main.c. Свойства OTP описаны в разделе «OTP». |
| otp_write | Запись OEM_S_OTP |  |
| otp_size | Общий размер OEM_S_OTP |  |
| otp_ns_read | Чтение OEM_NS_OTP |  |
| otp_ns_write | Запись OEM_NS_OTP |  |
| trng | Получение данных trng |  |
| socket | Socket-связь между CA и TA |  |

Пример запуска теста:

```text
# rktest transfer_data
# rktest [command]
```

Успешный CA выводит PASS, неуспешный — Fail.

### 4.3 Android

#### 4.3.1 Каталоги

Среда разработки CA/TA находится в external/rk_tee_user дерева Android:

1. Android.mk: инструменты сборки и собираемые CA-файлы.

2. host: исходники CA.

3. ta: исходники TA.

4. export*: окружение, необходимое для сборки TA.

#### 4.3.2 Сборка и разработка

Если external/rk_tee_user содержит только v1/ и v2/, master уже объединён в develop-next и будет упразднён. Точка объединения master: 492f1cbf testapp: support new OP-TEE MSG. Начните сборку командами ниже.

```text
#OP-TEE V1平台进⼊v1⽬录
cd external/rk_tee_user/v1
#OP-TEE V2平台进⼊v2⽬录
cd external/rk_tee_user/v2
rm -rf out/
./build.sh ta
mm
```

Если v1/ и v2/ отсутствуют, external/rk_tee_user ещё использует две ветви: для OP-TEE V1 переключитесь на master, для V2 на develop-next. Затем выполните:

```text
cd external/rk_tee_user/
rm -rf out/
./build.sh ta (git log包含“Android.mk: remove build ta from android”则执⾏，否则不执⾏)
mm
```

Сборка создаёт CA (Client Application, normal world) и TA (Trust Application, secure world). CA — обычный исполняемый файл в out Android. TA имеет имя UUID и расширение .ta; находится в соответствующей папке rk_tee_user/ta, rk_tee_user/out/ta, rk_tee_user/v1/out/ta либо rk_tee_user/v2/out/ta.

#### 4.3.3 Проверка среды TEE

1. Подключитесь к устройству через adb shell.

2. Установите библиотеки TEE, CA и TA. Android 7: libteec.so в /system/lib либо /system/lib64; tee-supplicant и CA в /system/bin; создайте /system/lib/optee_armtz для TA. Android 8 и выше: libteec.so в /vendor/lib либо /vendor/lib64; tee-supplicant и CA в /vendor/bin; создайте /vendor/lib/optee_armtz для TA. Если tee-supplicant стартует автоматически, он и libteec.so уже установлены, повторный push не нужен. Различайте V1/V2 и 32-/64-битные варианты. После push проверьте права исполнения tee-supplicant и CA.

3. Если tee-supplicant не стартует автоматически, запустите его вручную в фоне с root:

```text
# tee-supplicant &
```

tee_supp_rk_fs_init: unsupported означает, что parameter.txt не определяет security; см. раздел parameter.txt. Если используется только RPMB или REE-файловая система, сообщение можно игнорировать.

4. Запустите CA для вызова TA и проверки TEE. Встроенный rktest проверяет основные функции:

```text
# rktest [command]
```

5. Если команды rktest проходят, среда TEE исправна и можно разрабатывать. При ошибке сначала проверьте драйвер/компоненты; возможна несовместимость rk_tee_user и TEE OS. Типичные соответствия OP-TEE V1: TEE binary в rkbin/bin с version &gt;= v2.00 соответствует 492f1cbf testapp: support new OP-TEE MSG; version &lt; v2.00 соответствует e8d7215d Android.mk: support build in android R либо 466515ec add tools for user to resign TA. Для OP-TEE V2:

Вывод TEE "OP-TEE version: 3.13.0" соответствует a566557 - v2: update to keep up with v3.13.0 of optee_test.

Вывод TEE "OP-TEE version: 3.6.0" соответствует 1aa969e2 Android.mk: support build in android R.

Вывод TEE "OP-TEE version: 3.3.0" соответствует aa0a0c00 Android.mk: remove build ta from android.

Вывод при старте TEE Android "OP-TEE version: 2.5.0" соответствует 1ec9913a add tools for user to resign TA.

#### 4.3.4 Step By Step

Пример: arm64 с OP-TEE V2 на Android12.

```text
//编译CA TA
cd /home1/xxxx/rk_android_12
source build/envsetup.sh
lunch rk3568_s-userdebug
cd /home1/xxxx/rk_android_12/external/rk_tee_user/v2
./build.sh ta
mm

//推送TEE库⽂件和CA TA到设备
adb root && adb remount
adb push Y:\rk_android_12\hardware\rockchip\optee\v2\arm64\libteec.so /vendor/lib64
adb push Y:\rk_android_12\hardware\rockchip\optee\v2\arm64\tee-supplicant /vendor/bin
adb push Y:\rk_android_12\out\target\product\rk3568_s\vendor\bin\rktest /vendor/bin
adb push Y:\rk_android_12\external\rk_tee_user\v2\out\ta\rk_test\1db57234-dacd-462d-9bb1-ae79de44e2a5.ta /vendor/lib/optee_armtz

//运⾏CA TA
# tee-supplicant &  //若tee-supplicant已经运⾏，可以忽略本步骤，安卓平台⼀般默认已经有运⾏
# rktest transfer_data
```

#### 4.3.5 Разработка CA/TA

Используйте CA/TA как образец. UUID в Makefile и заголовках замените новым, созданным uuidgen. user_ta_header_defines.h в include каждой TA задаёт кучу 32KB (TA_DATA_SIZE) и стек 2KB (TA_STACK_SIZE). Лучше не менять; при необходимости увеличьте, но куча не более 1MB, стек не более 64KB.

```text
#define TA_STACK_SIZE               (2 * 1024)
#define TA_DATA_SIZE                (32 * 1024)
```

### 4.4 Linux

#### 4.4.1 Каталоги

Среда CA/TA: external/security/rk_tee_user в дереве Linux.

1. build.sh: скрипт сборки; инструкции в его комментариях.

2. Makefile: инструменты и собираемые CA-файлы.

3. host: исходники CA и соответствующий Makefile.

4. ta: исходники TA.

5. export*: окружение сборки TA.

#### 4.4.2 Сборка и разработка

Если external/security/rk_tee_user содержит только v1/ и v2/, master объединён в develop-next и будет упразднён. Точка объединения master: 492f1cbf testapp: support new OP-TEE MSG. Выполните следующие команды.

```text
#OP-TEE V1平台进⼊v1⽬录
cd external/security/rk_tee_user/v1
#OP-TEE V2平台进⼊v2⽬录
cd external/security/rk_tee_user/v2
rm -rf out/
./build.sh 3232 （32位平台执⾏，CA 32bits，TA 32bits）
./build.sh 6432 （64位平台执⾏，CA 64bits，TA 32bits）
```

Без каталогов v1/ и v2/ ещё действуют две ветви external/security/rk_tee_user: master для V1, develop-next для V2. Переключитесь и выполните:

```text
cd external/security/rk_tee_user/
rm -rf out/
./build.sh 3232 （32位平台执⾏，CA 32bits，TA 32bits）
./build.sh 6432 （64位平台执⾏，CA 64bits，TA 32bits）
```

Сборка создаёт CA в normal world и TA в secure world. CA — обычный исполняемый файл в соответствующем каталоге rk_tee_user/out, rk_tee_user/v1/out либо rk_tee_user/v2/out. TA — UUID.ta в соответствующей папке rk_tee_user/out/ta, rk_tee_user/v1/out/ta либо rk_tee_user/v2/out/ta.

#### 4.4.3 Проверка среды TEE

1. Войдите через adb shell.

2. Установите библиотеки, CA и TA: libteec.so* и другие библиотеки в /lib или /lib64; tee-supplicant и CA в /usr/bin; создайте /lib/optee_armtz для TA. При автозапуске tee-supplicant он и libteec.so уже есть, повторный push не нужен. Различайте V1/V2 и 32/64 бит. После push проверьте права исполнения tee-supplicant и CA.

3. Остальные шаги совпадают с разделом Android выше.

#### 4.4.4 Step By Step

Пример: arm64 с OP-TEE V2 на Linux.

```text
//编译CA TA
cd /home1/xxxx/rk_px30_linux/external/security/rk_tee_user/v2
rm -rf out/
./build.sh 6432

//设备上创建optee_armtz⽬录，⽤于存放TA⽂件
# mkdir -p /lib/optee_armtz

//推送TEE库⽂件和CA TA到设备
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\libteec.so /lib64
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\libteec.so.1 /lib64
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\tee-supplicant /usr/bin
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\rk_test\rktest /usr/bin
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\rk_test\1db57234-dacd-462d-9bb1-ae79de44e2a5.ta /lib/optee_armtz

//添加可执⾏权限
# chmod +x /usr/bin/tee-supplicant
# chmod +x /usr/bin/rktest

//运⾏CA TA
# tee-supplicant &  //若tee-supplicant已经运⾏，可以忽略本步骤
# rktest transfer_data
```

#### 4.4.5 Разработка CA/TA

Используйте CA/TA как образец. UUID в Makefile и заголовках замените новым, созданным uuidgen. user_ta_header_defines.h в include каждой TA задаёт кучу 32KB (TA_DATA_SIZE) и стек 2KB (TA_STACK_SIZE). Лучше не менять; при необходимости увеличьте, но куча не более 1MB, стек не более 64KB.

```text
#define TA_STACK_SIZE               (2 * 1024)
#define TA_DATA_SIZE                (32 * 1024)
```

### 4.5 rk_tee_service

#### 4.5.1 Функции

rk_tee_service — сервис распространённых функций безопасности на основе TEE с простыми интерфейсами. По сути это CA/TA-приложение; сначала убедитесь в исправности TEE по разделу проверки среды.

Разработчик напрямую вызывает rk_tee_service для шифрования/расшифрования чувствительных данных в TA. TEE выводит ключ из уникального аппаратного HUK, поэтому ключи устройств различаются и данные устройства A не расшифруются на B, предотвращая кражу данных. Из-за размера общей памяти рекомендуется не более 1M за вызов; большие данные разбивайте на части. Поддерживается OP-TEE V2, V1 пока нет.

#### 4.5.2 Компоненты

Поддерживаются Linux и Android12 и выше.

| Компонент | Каталог Android | Каталог Linux |
| --- | --- | --- |
| librk_tee_service.so | hardware/rockchip/optee/v2/arm<br>hardware/rockchip/optee/v2/arm64 | external/security/bin/optee_v2/lib/arm<br>external/security/bin/optee_v2/lib/arm64 |
| rk_tee_service.h | hardware/rockchip/optee/v2/include | external/security/bin/optee_v2/include |
| 4367fd45-4469-42a6-925d-3857b952704a.ta | hardware/rockchip/optee/v2/ta | external/security/bin/optee_v2/ta |

Приложения userspace напрямую вызывают librk_tee_service.so; параметры описаны в rk_tee_service.h. Поместите 4367fd45-4469-42a6-925d-3857b952704a.ta в /lib/optee_armtz для Linux либо /vendor/lib/optee_armtz для Android.

#### 4.5.3 Пример демо

```text
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "rk_tee_service.h"

int main(int argc, char *argv[])
{
    unsigned char plain[256];
    unsigned int plain_len;
    unsigned char cipher[256];
    unsigned int cipher_len;
    int res;

    memset((void *)plain, 0xab, sizeof(plain));
    cipher_len = 256;
    res = rk_encrypt_data(plain, sizeof(plain), cipher, &cipher_len);
    printf("res=0x%x cipher_len=%d\n", res, cipher_len);

    memset((void *)plain, 0, sizeof(plain));
    plain_len = 256;
    res = rk_decrypt_data(cipher, cipher_len, plain, &plain_len);
    printf("res=0x%x plain_len=%d\n", res, plain_len);

    return 0;
}
```

### 4.6 Проверка xtest

xtest — открытый тестовый код OPTEE с достаточно полным набором проверок. Для тестирования xtest можно следовать этому разделу. Ниже приведён пример для платформы arm64 с OP-TEE V2 под Android 13.

```text
//编译CA TA
cd /home1/xxxx/rk_android_13
source build/envsetup.sh
lunch rk3568_t-userdebug
cd /home1/xxxx/rk_android_13/external/rk_tee_user/v2
./build.sh ta
mm

//设备上创建plugins⽬录
# mkdir -p /vendor/lib64/tee-supplicant/plugins/

//推送TEE库⽂件和CA TA到设备
adb root && adb remount
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\libteec.so /vendor/lib64
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\tee-supplicant /vendor/bin
adb push Y:\rk_android_13\out\target\product\rk3568_t\vendor\bin\xtest /vendor/bin
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\crypt\cb3e5ba0-adf1-11e0-998b-0002a5d5c51b.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\concurrent\e13010e0-2ae1-11e5-896a-0002a5d5c51b.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\create_fail_test\c3f6e2c0-3548-11e1-b86c-0800200c9a66.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\rpc_test\d17f73a0-36ef-11e1-984a-0002a5d5c51b.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\sims\e6a33ed4-562b-463a-bb7e-ff5e15a493c8.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\concurrent_large\5ce0c432-0ab0-40e5-a056-782ca0e6aba2.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\miss\528938ce-fc59-11e8-8eb2-f2801f1b9fd1.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\socket\873bcd08-c2c3-11e6-a937-d0bf9c45c61c.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\sims_keepalive\a4c04d50-f180-11e8-8eb2-f2801f1b9fd1.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\os_test\5b9e0e40-2636-11e1-ad9e-0002a5d5c51b.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\os_test_lib\ffd2bded-ab7d-4988-95ee-e4962fff7154.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\os_test_lib_dl\b3091a65-9751-4784-abf7-0298a7cc35ba.ta /vendor/lib/optee_armtz
//测试安全存储，security空间有限会导致测试失败，删除parameter.txt中security分区，
//uboot不要定义CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION，默认使⽤安卓⽂件系统可以测试通过
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\storage\b689f2a7-8adf-477a-9f99-32e90c0ad0a2.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\storage2\731e279e-aafb-4575-a771-38caa6f0cca6.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\storage_benchmark\f157cda0-550c-11e5-a6fa-0002a5d5c51b.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\external\rk_tee_user\v2\out\ta\supp_plugin\380231ac-fb99-47ad-a689-9e017eb6e78a.ta /vendor/lib/optee_armtz
adb push Y:\rk_android_13\out\target\product\rk3568_t\vendor\lib64\tee-supplicant\plugins\f07bfc66-958c-4a15-99c0-260e4e7375dd.plugin.so /vendor/lib64/tee-supplicant/plugins/
adb push Y:\rk_android_13\hardware\rockchip\optee\v2\arm64\libckteec.so /vendor/lib64
adb push Y:\rk_android_13\external\rk_tee_user\v2\export-ta_arm32\ta\fd02c9da-306c-48c7-a49c-bbd827ae86ee.ta /vendor/lib/optee_armtz

//运⾏xtest
# tee-supplicant &  //若tee-supplicant已经运⾏，可以忽略本步骤，安卓平台⼀般默认已经有运⾏
# xtest
```

Ниже приведён пример для платформы arm64 с OP-TEE V2 под Linux.

```text
//编译CA TA
cd /home1/xxxx/rk_px30_linux/external/security/rk_tee_user/v2
rm -rf out/
./build.sh 6432

//设备上创建optee_armtz⽬录，⽤于存放TA⽂件
# mkdir -p /lib/optee_armtz
//设备上创建plugins⽬录
# mkdir -p /usr/lib/tee-supplicant/plugins/

//推送TEE库⽂件和CA TA到设备
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\libteec.so /lib64
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\libteec.so.1 /lib64
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\tee-supplicant /usr/bin
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\xtest\xtest /usr/bin
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\crypt\cb3e5ba0-adf1-11e0-998b-0002a5d5c51b.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\concurrent\e13010e0-2ae1-11e5-896a-0002a5d5c51b.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\create_fail_test\c3f6e2c0-3548-11e1-b86c-0800200c9a66.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\rpc_test\d17f73a0-36ef-11e1-984a-0002a5d5c51b.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\sims\e6a33ed4-562b-463a-bb7e-ff5e15a493c8.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\concurrent_large\5ce0c432-0ab0-40e5-a056-782ca0e6aba2.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\miss\528938ce-fc59-11e8-8eb2-f2801f1b9fd1.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\socket\873bcd08-c2c3-11e6-a937-d0bf9c45c61c.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\sims_keepalive\a4c04d50-f180-11e8-8eb2-f2801f1b9fd1.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\os_test\5b9e0e40-2636-11e1-ad9e-0002a5d5c51b.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\os_test_lib\ffd2bded-ab7d-4988-95ee-e4962fff7154.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\os_test_lib_dl\b3091a65-9751-4784-abf7-0298a7cc35ba.ta /lib/optee_armtz
//测试安全存储，security空间有限会导致测试失败，删除parameter.txt中security分区，
//uboot不要定义CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION，默认使⽤安卓⽂件系统可以测试通过
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\storage\b689f2a7-8adf-477a-9f99-32e90c0ad0a2.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\storage2\731e279e-aafb-4575-a771-38caa6f0cca6.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\storage_benchmark\f157cda0-550c-11e5-a6fa-0002a5d5c51b.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\ta\supp_plugin\380231ac-fb99-47ad-a689-9e017eb6e78a.ta /lib/optee_armtz
adb push Y:\rk_px30_linux\external\security\rk_tee_user\v2\out\supp_plugin\f07bfc66-958c-4a15-99c0-260e4e7375dd.plugin /usr/lib/tee-supplicant/plugins/
adb push Y:\rk_px30_linux\external\security\bin\optee_v2\lib\arm64\libckteec.so.0 /lib64
adb push  Y:\rk_px30_linux\external\security\rk_tee_user\v2\export-ta_arm32\ta\fd02c9da-306c-48c7-a49c-bbd827ae86ee.ta /lib/optee_armtz

//添加可执⾏权限
# chmod +x /usr/bin/tee-supplicant
# chmod +x /usr/bin/xtest

//运⾏CA TA
# tee-supplicant &  //若tee-supplicant已经运⾏，可以忽略本步骤
# xtest
```

## 5 Подпись TA

### 5.1 Принцип

При сборке TA сценарий автоматически подписывает приложение ключом из каталога `export-user_ta/keys` или `export-ta_arm32/keys` проекта rk_tee_user. Это ключ RSA длиной 2048 бит в формате PEM; результатом является файл TA формата `.ta`. В TEE binary хранится открытый ключ RSA. При загрузке TA TEE OS проверяет его подлинность этим ключом; приложение может выполняться только после успешной проверки. Таким образом обеспечивается выполнение только допустимых TA.

### 5.2 Замена открытого ключа

Чтобы TA разработчика A не могла выполняться на плате разработчика B, рекомендуется заменить открытый ключ. Для замены открытого ключа в TEE binary используются инструменты из каталога `tools/` проекта rk_tee_user. Замена под Linux:

```text
./change_puk  --teebin  <TEE binary>
```

Эта команда автоматически создаёт ключ RSA длиной 2048 бит `oemkey.pem` в текущем каталоге и заменяет исходный открытый ключ в TEE binary открытым ключом из этого файла.

```text
./change_puk  --teebin  <TEE binary> --key oemkey.pem
```

Для замены исходного открытого ключа в TEE binary можно использовать открытый ключ из указанного разработчиком ключа; длина должна составлять 2048 бит. Под Windows откройте `Windows_change_puk.exe` и нажмите «生成oemkey.pem», чтобы создать и сохранить ключ. Выберите созданный ключ и TEE binary, затем нажмите «修改公钥». Поскольку программа использует стороннюю библиотеку `BouncyCastle.Crypto.dll`, этот файл должен находиться в одном каталоге с `Windows_change_puk.exe`. После замены ключа замените TEE binary со старым ключом в каталоге `rkbin/` новым TEE binary, пересоберите U-Boot и прошейте полученный `trust.img`. На некоторых платформах trust включён в `uboot.img`, поэтому отдельного `trust.img` нет; в этом случае прошивается `uboot.img`.

Переименуйте созданный либо выбранный ключ в oem_privkey.pem, замените ключ в rk_tee_user/export-user_ta/keys либо export-ta_arm32/keys и пересоберите CA/TA. TA загрузится TEE binary с новым открытым ключом; TA без правильной подписи отклоняются.

### 5.3 Подпись TA пошагово

В этом примере используется RK3588 с Android 12.

```text
cd /home1/xxxx/rk_android_12/external/rk_tee_user/v2/tools/change_puk_tool-release/change_puk_linux

chmod +x change_puk

./change_puk --teebin /home1/xxxx/rk_android_12/rkbin/bin/rk35/rk3588_bl32_v1.17.bin

cp oem_privkey.pem /home1/xxxx/rk_android_12/external/rk_tee_user/v2/export-ta_arm32/keys/

cp oem_privkey.pem /home1/xxxx/rk_android_12/external/rk_tee_user/v2/export-ta_arm64/keys/

//重新编译烧写uboot固件，重新编译CA TA应⽤
```

## 6 Встраивание TA в защищённое хранилище

Обычно после разработки файл TA хранится в открытом виде в незащищённой файловой системе. Некоторые OEM с повышенными требованиями к безопасности не хотят раскрывать TA в таком виде. Для этого OP-TEE V2 поддерживает размещение TA в защищённом хранилище; OP-TEE V1 пока этого не поддерживает.

### 6.1 Принцип

CA читает файл TA из незащищённой файловой системы и передаёт данные OP-TEE OS. Система сначала проверяет подлинность TA. Если проверка успешна, она создаёт случайный ключ шифрования TA, шифрует данные и сохраняет зашифрованную TA вместе с ключом в защищённом хранилище: в разделе security, если он определён, иначе в файловой системе Android или Linux. Ключ защищённого хранилища выводится из уникального аппаратного ключа и различается для каждого устройства. Затем разработчик должен самостоятельно удалить файл TA из незащищённой файловой системы, чтобы не раскрывать открытые данные. После этого CA может вызывать TA обычным образом. При вызове OP-TEE OS ищет TA в защищённом хранилище по переданному uuid. Если она найдена, система расшифровывает, загружает и запускает её; иначе ищет соответствующую TA в незащищённой файловой системе.

### 6.2 Пример реализации

Ниже приведён код CA. Разработчик может сначала прочитать файл TA, затем передать его данные в OP-TEE OS через функцию `install_ta`.

```text
static void install_ta(void *buf, size_t blen)
{
    TEEC_Result res = TEEC_ERROR_GENERIC;
    uint32_t err_origin = 0;
    TEEC_UUID uuid = PTA_SECSTOR_TA_MGMT_UUID;
    TEEC_Operation op;
    TEEC_Context ctx = { };
    TEEC_Session sess = { };
    int i = 0;

    res = TEEC_InitializeContext(NULL, &ctx);
    if (res != TEEC_SUCCESS) {
        printf("TEEC_InitializeContext failed with code 0x%x\n", res);
        goto exit;
    }

    res = TEEC_OpenSession(&ctx, &sess, &uuid,
                   TEEC_LOGIN_PUBLIC, NULL, NULL, &err_origin);
    if (res != TEEC_SUCCESS) {
        printf("TEEC_Opensession failed with code 0x%x origin 0x%x\n",
               res, err_origin);
        goto exit;
    }

    memset(&op, 0, sizeof(op));
    op.paramTypes = TEEC_PARAM_TYPES(TEEC_MEMREF_TEMP_INPUT, TEEC_NONE,
                     TEEC_NONE, TEEC_NONE);
    op.params[0].tmpref.buffer = buf;
    op.params[0].tmpref.size = blen;

    res = TEEC_InvokeCommand(&sess, PTA_SECSTOR_TA_MGMT_BOOTSTRAP, &op,
                 &err_origin);
    if (res != TEEC_SUCCESS) {
        printf("TEEC_InvokeCommand failed with code 0x%x origin 0x%x\n",
               res, err_origin);
        goto exit;
    }
    printf("Installing TAs done\n");

exit:
    TEEC_CloseSession(&sess);
    TEEC_FinalizeContext(&ctx);

    return;
}
```

## 7 Шифрование TA

Предыдущий раздел о размещении TA в защищённом хранилище описывает один из способов не раскрывать TA в открытом виде. Однако он занимает место в защищённом хранилище; при повреждении его данных встроенная TA недоступна. Кроме того, ключ шифрования создаётся случайно, а не задаётся разработчиком. В этом разделе описан другой способ шифрования TA, поддерживаемый OP-TEE V2, но пока не OP-TEE V1.

### 7.1 Метод шифрования TA

Если имеется исходный код TA, включите макрос `CFG_ENCRYPT_TA` в `export-ta_arm32/mk/link.mk` и задайте собственный ключ шифрования в `TA_ENC_KEY`. После включения макроса сценарий сборки автоматически подписывает и шифрует TA. Если имеется только двоичный файл TA без исходного кода, его можно зашифровать инструментом из каталога `tools/` проекта rk_tee_user. Команда шифрования TA в открытом виде:

```text
python3 ta_encrypt_tool.py --key oem_privkey.pem --in 1db57234-dacd-462d-9bb1-ae79de44e2a5.ta --enc_key 'b64d239b1f3c7d3b06506229cd8ff7c8af2bb4db2168621ac62c84948468c4f4'
```

Команда повторного шифрования уже зашифрованной TA:

```text
python3 ta_encrypt_tool.py --key oem_privkey.pem --in 1db57234-dacd-462d-9bb1-ae79de44e2a5.ta --ori_enc_key 'b64d239b1f3c7d3b06506229cd8ff7c8af2bb4db2168621ac62c84948468c4f4' --enc_key 'c74d239b1f3c7d3b06506229cd8ff7c8af2bb4db2168621ac62c84948468c4f4'
```

Параметры инструмента: `--key` указывает файл собственного асимметричного ключа для подписи TA. `--in` указывает файл TA. `--enc_key` задаёт собственный симметричный ключ шифрования TA. `--ori_enc_key` задаёт исходный симметричный ключ, которым TA была зашифрована.

### 7.2 Программирование TA encryption key

Для записи TA encryption key используется `RKDevInfoWriteTool` версии не ниже 1.2.8 из каталога RKTools проекта SDK. Сначала создайте файл ключа, откройте его в шестнадцатеричном редакторе и внесите собственный 32-байтовый ключ. В RKDevInfoWriteTool отметьте «TA encryption key», выберите созданный файл и убедитесь, что устройство находится в режиме LOADER. Нажмите «写入» для записи. Ключ записывается в OTP устройства: после записи содержимое OTP изменить нельзя, поэтому ключ на одном устройстве можно записать только один раз. Во избежание утечки инструмент не поддерживает чтение TA encryption key.

![Рисунок 3: английский оригинал, с. 37](/docs/rockchip-tee-sdk/assets/en-p037-figure-01.png)

*Рисунок 3: английский оригинал, с. 37*

### 7.3 Расшифрование и запуск TA

Зашифрованная TA используется точно так же, как TA в открытом виде. При загрузке OP-TEE OS автоматически определяет шифрование, считывает TA encryption key из OTP, расшифровывает и запускает TA. Весь процесс выполняется автоматически.

### 7.4 Soft TA encryption key

Если дополнительная операция записи TA encryption key в OTP нежелательна, можно использовать Soft TA encryption key — симметричный ключ, встроенный в TEE binary. Если ключ записан в OTP, OP-TEE OS отдаёт ему приоритет при расшифровке и запуске TA; этот вариант обеспечивает более высокую безопасность.

Если TA encryption key в OTP не записан, OP-TEE OS расшифровывает и запускает TA с помощью Soft TA encryption key; уровень безопасности ниже. Разработчик должен заменить Soft TA encryption key в TEE binary инструментом из `tools/` проекта rk_tee_user. Команда замены ключа по умолчанию:

```text
./change_ta_enc_key --teebin <TEE binary> --takey 'b64d239b1f3c7d3b06506229cd8ff7c8af2bb4db2168621ac62c84948468c4f4'
```

Параметры инструмента: `--teebin` — путь к прошивке TEE binary. `--takey` — собственный 32-байтовый ключ разработчика; он должен совпадать с ключом шифрования TA.

## 8 Защита REE FS TA от отката

Как описано в разделе о размещении TA в защищённом хранилище, OP-TEE V2 допускает хранение TA как в открытом виде в незащищённой файловой системе REE FS, так и в Secure Storage. Для TA в открытом виде в REE FS OP-TEE V2 поддерживает защиту от отката, предотвращающую понижение версии TA из незащищённой среды REE.

### 8.1 Использование защиты от отката

Защита TA от отката в REE FS включена постоянно. Разработчик использует её, задавая версию TA через `CFG_TA_VERSION` в Makefile. Если `CFG_TA_VERSION` не определён, система считает версию равной 0 и разрешает выполнение TA с одинаковым номером версии. Если в Makefile задано текущее значение `CFG_TA_VERSION` больше 0, как в примере ниже, последующее понижение версии этой TA запрещено.

```text
# unsigned integer format
CFG_TA_VERSION=1
```

## 9 Выбираемые уровни безопасности

### 9.1 Область применения

Схема предназначена для RK3588, RK3528, RK3562 и последующих новых платформ.

### 9.2 Предостережения

Перед использованием схемы учтите следующее. До первой записи прошивки настройте `CONFIG_OPTEE_SECURITY_LEVEL` в U-Boot в соответствии с требованиями. Чип допускает только однократную настройку; впоследствии изменить её нельзя. По умолчанию SDK использует level0. Если на отладочную плату уже записывалась прошивка level0, после записи level1 или level2 она может не загрузиться. Поэтому после изменения `CONFIG_OPTEE_SECURITY_LEVEL` рекомендуется испытывать новую плату. При использовании «схемы высокой безопасности 1» сначала запишите OEM HUK инструментом RKDevInfoWriteTool версии V1.3.5 или новее.

### 9.3 Описание схемы

Разработчик может настроить уровень безопасности OPTEE. Разные уровни обеспечивают разную степень защиты eMMC и защищённого хранилища.

| Схема безопасности | Описание | CONFIG_OPTEE_SECURITY_LEVEL (U-Boot) |
| --- | --- | --- |
| Сильная схема 2 | Сильная привязка контроллера к данным eMMC/защищённого хранения. При замене контроллера нужно также заменить eMMC и стереть остальные данные защищённого хранения. | 2 |
| Сильная схема 1 | Слабая привязка контроллера к eMMC/защищённому хранению. Ключи защиты выводятся из OEM HUK разработчика. После замены контроллера прежние eMMC и данные можно использовать, если загрузить тот же OEM HUK. | 1 |
| Слабая схема | Данные eMMC/защищённого хранения не привязаны к контроллеру. После его замены прежние eMMC и прочие данные можно использовать дальше. | 0 или не задано |

Различия уровней обусловлены ключами eMMC и защищённого хранилища. HUK (Hardware Unique Key) служит для вывода RPMB Key, Secure Storage Key и других ключей; его вариант зависит от уровня безопасности, как показано ниже. Hard HUK выводится из Device Root Key и уникален для устройства. Device Root Key записывается в защищённую OTP при изготовлении чипа. OEM HUK задаётся разработчиком и записывается им в защищённую OTP. Soft HUK задаётся Rockchip, одинаков для всех чипов и встроен в прошивку. RPMB Key защищает хранение в разделе RPMB чипа eMMC. Secure Storage Key защищает безопасное хранилище. Other Key обозначает ключи для других целей в OP-TEE.

```text
强安全⽅案2

                                  /------> RPMB Key
Device Root Key ---> Hard HUK ------> Secure Storage Key
                                  \------> Other Key
强安全⽅案1

Device Root Key ---> Hard HUK ------> Other Key

                      /------> RPMB Key
OEM HUK --------------
                      \------> Secure Storage Key

弱安全⽅案

Device Root Key ---> Hard HUK ------> Other Key

                      /------> RPMB Key
Soft HUK --------------
                      \------> Secure Storage Key
```

## 10 Отладка TA

### 10.1 Платформы OP-TEE V1

При исключении в TA выводится следующая информация.

```text
user TA data-abort at address 0x2a

 esr 0x92000021  ttbr0 0x400000852fc00   ttbr1 0x00000000   cidr 0x0

 cpu #4          cpsr 0x20000130

#32位平台打印r0-r12, sp, lr, pc(402000a0)
#64位平台打印x0-x30, sp_el0, elr(00000000402000a0)

Status of TA 8cccf200-2450-11e4-abe20002a5d5c52c (0x85109b0) (active)
- load addr : 0x40200000    ctx-idr: 4
- code area : 0x9200000 2097152
- stack: 0x9400000 stack:2048
TEEC_InvokeCommand failed with code 0xffff3024 origin 0x3
```

В сообщении об исключении `pc` или `elr` — адрес возникновения ошибки, а `load addr` — виртуальный адрес загрузки TA. Поэтому `elr - load addr = 0x402000a0 - 0x40200000 = 0xa0` задаёт смещение ошибочной инструкции внутри TA. Рядом с файлом TA находится `uuid.dmp` — дизассемблированный код TA со смещениями функций. Найдите в нём `a0`: строка `a0: 681b ldr r3, [r3, #0]` соответствует смещению исключения, а `testapp_ta.c:97` указывает строку 97 файла testapp_ta.c.

```text
/home/xxx/android/vendor/optee_test/ta/testapp/testapp_ta.c:97
      98:   6823        ldr r3, [r4, #0]
      9a:   2202        movs    r2, #2
      9c:   2161        movs    r1, #97 ; 0x61
9e:   4820        ldr r0, [pc, #128]  ; (120 <TA_InvokeCommandEntryPoint+0xa0>)
a0:   681b        ldr r3, [r3, #0]
a2:   4478        add r0, pc
a4:   3033        adds    r0, #51 ; 0x33
a6:   9301        str r3, [sp, #4]
a8:   4b1e        ldr r3, [pc, #120]  ; (124 <TA_InvokeCommandEntryPoint+0xa4>)
aa:   447b        add r3, pc
ac:   9300        str r3, [sp, #0]
ae:   2301        movs    r3, #1
b0:   f002 fbc0   bl  2834 <trace_printf>
```

### 10.2 Платформы OP-TEE V2

При исключении в TA выводится следующая информация.

```text
E/TC:? 0 User mode data-abort at address 0x2a (translation fault)
E/TC:? 0  esr 0x92000005  ttbr0 0x20000084a7020   ttbr1 0x00000000   cidr 0x0
E/TC:? 0  cpu #1          cpsr 0x20000130

#32位平台打印r0-r12, sp, lr, pc(c00870a4)
#64位平台打印x0-x30, sp_el0, elr(00000000c00870a4)

E/LD:  region  0: va 0xc0004000 pa 0x08600000 size 0x002000 flags rw-s (ldelf)
E/LD:  region  1: va 0xc0006000 pa 0x08602000 size 0x008000 flags r-xs (ldelf)
E/LD:  region  2: va 0xc000e000 pa 0x0860a000 size 0x001000 flags rw-s (ldelf)
E/LD:  region  3: va 0xc000f000 pa 0x0860b000 size 0x004000 flags rw-s (ldelf)
E/LD:  region  4: va 0xc0013000 pa 0x0860f000 size 0x001000 flags r--s
E/LD:  region  5: va 0xc0014000 pa 0x08625000 size 0x001000 flags rw-s (stack)
E/LD:  region  6: va 0xc0015000 pa 0x09201000 size 0x002000 flags rw-- (param)
E/LD:  region  7: va 0xc0087000 pa 0x00001000 size 0x009000 flags r-xs [0]
E/LD:  region  8: va 0xc0090000 pa 0x0000a000 size 0x00c000 flags rw-s [0]
E/LD:   [0] 8cccf200-2450-11e4-abe2-0002a5d5c52c @ 0xc0087000
E/LD:  Call stack:
E/LD:   0xc00870a4
E/LD:   0xc0088b21
E/LD:   0xc008d507
E/LD:   0xc008716c
```

В сообщении об исключении `pc` или `elr` — адрес ошибки. `region 0`–`region 8` задают адреса сегментов TA в памяти. Здесь адрес `0xc00870a4` принадлежит `region 7`, поэтому `elr - region 7 : va = 0xc00870a4 - 0xc0087000 = 0xa4` — смещение ошибочной инструкции в TA. Рядом с TA находится файл дизассемблирования `uuid.dmp` со смещениями функций. Найдите `a4`: строка `a4: 681b ldr r3, [r3, #0]` соответствует смещению исключения, а `testapp_ta.c:101` указывает строку 101 файла testapp_ta.c.

```text
/home/xxx/rk_px30_linux/external/optee_test/ta/testapp/testapp_ta.c:101
      9c:   6823        ldr r3, [r4, #0]
      9e:   2202        movs    r2, #2
      a0:   4d28        ldr r5, [pc, #160]  ; (144 <TA_InvokeCommandEntryPoint+0xc4>)
a2:   4e29        ldr r6, [pc, #164]  ; (148 <TA_InvokeCommandEntryPoint+0xc8>)
a4:   681b        ldr r3, [r3, #0]
a6:   447d        add r5, pc
a8:   447e        add r6, pc
aa:   3533        adds    r5, #51 ; 0x33
ac:   4628        mov r0, r5
ae:   9600        str r6, [sp, #0]
b0:   9301        str r3, [sp, #4]
b2:   2301        movs    r3, #1
b4:   f000 f912   bl  2dc <trace_printf>
```

### 10.3 Просмотр стека вызовов

Если при отладке нужен не только адрес исключения, но и полный стек вызовов, платформа OP-TEE V2 предоставляет сценарий `export-ta_arm32/scripts/symbolize.py`. В OP-TEE V1 эта возможность пока отсутствует. Сначала настройте в сценарии путь к компилятору в соответствии с локальной установкой.

```text
#32位TA执⾏
export PATH=/home1/hisping/rk_px30_linux/prebuilts/gcc/linux-x86/arm/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf/bin:$PATH
export CROSS_COMPILE=arm-linux-gnueabihf-

#64位TA执⾏
export PATH=/home1/hisping/rk_px30_linux/prebuilts/gcc/linux-x86/aarch64/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin:$PATH
export CROSS_COMPILE=aarch64-linux-gnu-
```

Затем запустите сценарий; параметр `-d` указывает каталог собранной TA.

```text
./export-ta_arm32/scripts/symbolize.py -d out/ta/testapp/
```

На третьем шаге сценарий ожидает сообщения об исключении. Скопируйте и вставьте их; результат показан ниже. Поле `Call stack` содержит стек вызовов функций.

```text
I/TA: Hello Test App!
E/TC:? 0
E/TC:? 0 User mode data-abort at address 0x2a (translation fault)
E/TC:? 0  esr 0x92000005  ttbr0 0x20000084a7020   ttbr1 0x00000000   cidr 0x0
E/TC:? 0  cpu #1          cpsr 0x20000130
E/TC:? 0  x0  00000000000069ee x1  0000000000000062
E/TC:? 0  x2  0000000000000002 x3  000000000000002a
E/TC:? 0  x4  00000000c0014f30 x5  00000000c0014f40
E/TC:? 0  x6  00000000c0074080 x7  00000000c0074308
E/TC:? 0  x8  00000000c00742e8 x9  00000000c0014f30
E/TC:? 0  x10 0000000000000065 x11 00000000c007f2d8
E/TC:? 0  x12 0000000000000773 x13 00000000c0014f00
E/TC:? 0  x14 00000000c006cb0d x15 0000000000000000
E/TC:? 0  x16 0000000000000000 x17 0000000000000000
E/TC:? 0  x18 0000000000000000 x19 0000000000000000
E/TC:? 0  x20 0000000000000000 x21 0000000000000000
E/TC:? 0  x22 0000000000000000 x23 0000000000000000
E/TC:? 0  x24 0000000000000000 x25 0000000000000000
E/TC:? 0  x26 0000000000000000 x27 0000000000000000
E/TC:? 0  x28 0000000000000000 x29 0000000000000000
E/TC:? 0  x30 0000000000000000 elr 00000000c006b0a4
E/TC:? 0  sp_el0 00000000c0014f80
E/LD:  Status of TA 8cccf200-2450-11e4-abe2-0002a5d5c52c
E/LD:   arch: arm
E/LD:  region  0: va 0xc0004000 pa 0x08600000 size 0x002000 flags rw-s (ldelf)
E/LD:  region  1: va 0xc0006000 pa 0x08602000 size 0x008000 flags r-xs (ldelf)
E/LD:  region  2: va 0xc000e000 pa 0x0860a000 size 0x001000 flags rw-s (ldelf)
E/LD:  region  3: va 0xc000f000 pa 0x0860b000 size 0x004000 flags rw-s (ldelf)
E/LD:  region  4: va 0xc0013000 pa 0x0860f000 size 0x001000 flags r--s
E/LD:  region  5: va 0xc0014000 pa 0x08625000 size 0x001000 flags rw-s (stack)
E/LD:  region  6: va 0xc0015000 pa 0x09201000 size 0x002000 flags rw-- (param)
E/LD:  region  7: va 0xc006b000 pa 0x00001000 size 0x009000 flags r-xs [0] .ta_head .text
.rodata .ARM.extab .ARM.exidx .dynsym .dynstr .hash
E/LD:  region  8: va 0xc0074000 pa 0x0000a000 size 0x00c000 flags rw-s [0] .dynamic .got
.rel.got .data .bss .rel.dyn
E/LD:   [0] 8cccf200-2450-11e4-abe2-0002a5d5c52c @ 0xc006b000 (out/ta/testapp/8cccf200-2450-
11e4-abe2-0002a5d5c52c.elf)
E/LD:  Call stack:
E/LD:   0xc006b0a4 TA_InvokeCommandEntryPoint at ta/testapp/testapp_ta.c:98
E/LD:   0xc006cb0d entry_invoke_command at
/home/zhangzj/secure/optee_3.6.0/optee_os/lib/libutee/arch/arm/user_ta_entry.c:357
E/LD:   0xc00714f3 __ta_entry_c at export-ta_arm32/src/user_ta_header.c:48
E/LD:   0xc006b158 __ta_entry at export-ta_arm32/src/ta_entry_a32.S:20
```

## 11 Память

### 11.1 OP-TEE V1

| Платформа | TEE_RAM | TA_RAM | SHMEM |
| --- | --- | --- | --- |
| RK312x | 1M | 12M | 1M |
| RK322x | 1M | 12M | 2M |
| RK3288 | 1M | 12M | 2M |
| RK3368 | 2M | 24M | 4M |
| RK3328/RK322xH | 2M | 24M | 4M |
| RK3399/RK3399Pro | 2M | 24M | 4M |

Примечание: Secure OS выполняется в TEE_RAM, TA — в TA_RAM; SHMEM является общей памятью.

### 11.2 OP-TEE V2

| Платформа | TEE_RAM | TA_RAM | SHMEM |
| --- | --- | --- | --- |
| RK3326/PX30 | 2M | 4M | 2M |
| RK3358 | 2M | 4M | 2M |
| RK3308 | 2M | 1M | 1M |
| RK1808 | 2M | 1M | 1M |
| RV1109/RV1126 | 760K | 1M | 512K |
| RK3566/RK3568 | 2M | 12M | 2M |
| RK3588 | 2M | 12M | 2M |
| RK3528 | 2M | 4M | 2M |
| RK3562 | 2M | 4M | 2M |
| RV1106 | 1M | 1M | 512K |

Примечание: Secure OS выполняется в TEE_RAM, TA — в TA_RAM; SHMEM является общей памятью. OPTEE OS поддерживает вывод размера защищённой памяти. Соответствующие сведения можно найти в журнале загрузки, как показано ниже.

```text
I/TC: OP-TEE memory: TEEOS 0x200000 TA 0xc00000 SHM 0x200000
I/TC: Primary CPU initializing
I/TC: Primary CPU switching to normal world boot
```

Если размер в журнале загрузки отличается от приведённого выше списка, ориентируйтесь на журнал.

## 12 Защищённое хранилище

### 12.1 Разделы

1. Защищённое хранилище — одна из важных функций OPTEE OS. Обычно оно хранит важные пользовательские данные, зашифрованные OPTEE OS, в разделе security, RPMB или файловой системе Android/Linux. Предусмотрены три варианта. Первый: при `storageID = TEE_STORAGE_PRIVATE_RPMB` в коде TA используется eMMC RPMB; его размер зависит от модели eMMC, часто это 4M. Второй: если в parameter.txt определён раздел security и в TA задано `storageID = TEE_STORAGE_PRIVATE_REE`, данные хранятся в security; доступный объём сейчас составляет 512k. Третий: если раздел security в parameter.txt не определён и в TA задано `storageID = TEE_STORAGE_PRIVATE_REE`, используется описанное далее хранение в файловой системе.

В третьем варианте данные хранятся в `/metadata/tee`, `/data/vendor/tee` или `/data/tee` файловой системы Android/Linux. Убедитесь, что tee-supplicant имеет доступ к каталогу. Общий объём не ограничивается. Недостаток: устройство должно использовать eMMC, а U-Boot не должен определять `CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION`; тогда защищённые данные этапа U-Boot по умолчанию хранятся в eMMC RPMB.

2. Защищённое хранилище в U-Boot описано в разделе «Драйвер TEE в U-Boot».

3. Не допускайте отключения питания во время записи в защищённое хранилище. В исходной документации сообщается о проведённых испытаниях защиты от потери питания, но целостность файловой системы не гарантируется. Поэтому рекомендуется сократить число записей важных данных и обеспечить стабильные условия при операциях с защищёнными данными. Теоретически RPMB лучше защищён от потери питания, чем security и файловая система Android/Linux.

### 12.2 Измерение производительности

Тест из исходной документации: OPTEE V1 на RK3399 Linux, фиксированная частота CPU 1200000, фиксированная частота DDR 200000000.

| Область хранения | Размер данных | Создание файла | Запись | Чтение | Удаление файла |
| --- | --- | --- | --- | --- | --- |
| Файловая система Linux | 30K | 16ms | 67ms | 61ms | 19ms |
| Файловая система Linux | 4K | 17ms | 23ms | 13ms | 7ms |
| Файловая система Linux | 1K | 18ms | 16ms | 7ms | 6ms |
| Файловая система Linux | 32 | 23ms | 16ms | 7ms | 7ms |
| Раздел security | 30K | 97ms | 181ms | 54ms | 277ms |
| Раздел security | 4K | 101ms | 74ms | 14ms | 101ms |
| Раздел security | 1K | 104ms | 56ms | 7ms | 64ms |
| Раздел security | 32 | 103ms | 55ms | 7ms | 73ms |
| Раздел rpmb | 30K | 20ms | 233ms | 10ms | 7ms |
| Раздел rpmb | 4K | 20ms | 36ms | 3ms | 6ms |
| Раздел rpmb | 1K | 22ms | 14ms | 2ms | 6ms |
| Раздел rpmb | 32 | 27ms | 8ms | 2ms | 6ms |

Тест из исходной документации: OPTEE V2 на RK356x Linux, фиксированная частота CPU 1416000, фиксированная частота DDR 324000000.

| Область хранения | Размер данных | Создание файла | Запись | Чтение | Удаление файла |
| --- | --- | --- | --- | --- | --- |
| Файловая система Linux | 30K | 17ms | 28ms | 3ms | 8ms |
| Файловая система Linux | 4K | 17ms | 11ms | 1ms | 8ms |
| Файловая система Linux | 1K | 18ms | 9ms | 1ms | 8ms |
| Файловая система Linux | 32 | 19ms | 8ms | 1ms | 7ms |
| Раздел security | 30K | 12ms | 12ms | 4ms | 12ms |
| Раздел security | 4K | 12ms | 3ms | 1ms | 11ms |
| Раздел security | 1K | 13ms | 2ms | 1ms | 11ms |
| Раздел security | 32 | 15ms | 3ms | 1ms | 14ms |
| Раздел rpmb | 30K | 23ms | 287ms | 16ms | 5ms |
| Раздел rpmb | 4K | 24ms | 50ms | 7ms | 6ms |
| Раздел rpmb | 1K | 23ms | 22ms | 5ms | 6ms |
| Раздел rpmb | 32 | 30ms | 12ms | 5ms | 5ms |

## 13 OTP

OTP означает One Time Programmable Memory: область допускает многократное чтение, но только однократную запись. В Secure OTP предусмотрены различные области OEM Zone для разных потребностей пользователей.

| Тип OTP | Описание | Поддерживаемые платформы |
| --- | --- | --- |
| OEM Cipher<br>Key | Эта OEM Zone хранит пользовательский ключ, который нельзя изменить после записи. После программирования пользователь может шифровать/расшифровывать указанным ключом. | rv1126, rv1109, rk3566, rk3568, rk3588,<br>rk3576, rk3528, rk3562, rv1106, rv1103,<br>rv1106b, rv1103b, rk3506, rv1126b |
| Protected<br>OEM Zone | Доступна только допустимым Trusted Applications (TA), работающим в OP-TEE OS. Небезопасный мир не может читать/писать эту OEM Zone напрямую. Пример: rk_test. | rk3308, px30, rk3326, rk3358, rk3566,<br>rk3568, rk3588, rv1126, rv1109, rk3528,<br>rk3562, rv1106, rv1103, rk3576,<br>rv1106b, rv1103b, rk3506, rv1126b |
| Non-<br>Protected<br>OEM Zone | Доступна из U-Boot и UserSpace; данные оказываются в памяти небезопасного мира. | rk3308, px30, rk3326, rk3358, rk3566,<br>rk3568, rk3588, rv1106, rv1103, rk3528,<br>rk3562, rk3576, rv1106b, rv1103b,<br>rk3506 |

Подробности приведены в документе `Rockchip_Developer_Guide_OTP_CN.pdf`.

## 14 TA API

### 14.1 Обзор

RK предоставляет следующие TA API как примеры распространённых TEE Internal API и для непосредственного использования разработчиком.

### 14.2 Возвращаемые значения API

Возвращаемые значения: TEE_SUCCESS — успех; TEE_ERROR_BAD_PARAMETERS — неверные параметры; прочие ошибки — см. tee_api_defines.h.

### 14.3 Описание API

#### 14.3.1 Crypto API

##### 14.3.1.1 rk_crypto_malloc_ctx

```text
crypto_ctx_t *rk_crypto_malloc_ctx(void);
```

Назначение: выделить контекст криптооперации. Параметры: нет.

##### 14.3.1.2 rk_crypto_free_ctx

```text
void rk_crypto_free_ctx(crypto_ctx_t **ctx);
```

Назначение: освободить контекст криптооперации после полного завершения алгоритма. Параметр ctx: контекст операции.

##### 14.3.1.3 rk_hash_crypto

```text
TEE_Result rk_hash_crypto(uint8_t *in, uint8_t *out, uint32_t in_len,
                          uint32_t out_len, uint32_t algo);
```

Назначение: вычисление дайджеста сообщения. Для обработки частями используйте rk_hash_begin/update/finish. Параметры: in — вход; in_len — длина входа; out — выход; out_len — длина выхода.

algo: тип алгоритма; TEE_ALG_MD5, TEE_ALG_SHA1, TEE_ALG_SHA224, TEE_ALG_SHA256,

TEE_ALG_SHA384, TEE_ALG_SHA512

##### 14.3.1.4 rk_hash_begin

```text
TEE_Result rk_hash_begin(crypto_ctx_t *ctx, uint32_t algo);
```

Назначение: инициализация поэтапного хеширования. ctx — контекст операции.

algo: тип алгоритма; TEE_ALG_MD5, TEE_ALG_SHA1, TEE_ALG_SHA224, TEE_ALG_SHA256,

TEE_ALG_SHA384, TEE_ALG_SHA512

##### 14.3.1.5 rk_hash_update

```text
TEE_Result rk_hash_update(crypto_ctx_t *ctx, uint8_t *in, uint32_t in_len);
```

Назначение: поэтапное хеширование, внутреннее накопление дайджеста входных данных. ctx — контекст; in — вход; in_len — длина входа.

##### 14.3.1.6 rk_hash_finish

```text
TEE_Result rk_hash_finish(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                          uint32_t in_len, uint32_t *out_len);
```

Назначение: обработать последнюю часть и вывести дайджест всех данных. ctx — контекст; in — вход; in_len — длина входа; out — выход; out_len — длина выхода.

##### 14.3.1.7 rk_cipher_crypto

```text
TEE_Result rk_cipher_crypto(uint8_t *in, uint8_t *out, uint32_t len,
                            uint8_t *key, uint32_t key_len, uint8_t *iv,
                            uint32_t algo, TEE_OperationMode mode);
```

Назначение: симметричное шифрование/расшифрование. Для частей используйте rk_cipher_begin/update/finish. in — вход; len — длина входа; out — выход; key — ключ для algo; key_len — длина ключа (поддержка зависит от algo); iv — начальный вектор; algo — тип алгоритма, список ниже (OP-TEE V1 не поддерживает SM).

```text
TEE_ALG_AES_ECB_NOPAD
TEE_ALG_AES_CBC_NOPAD
TEE_ALG_AES_CTR
TEE_ALG_AES_CTS
TEE_ALG_AES_XTS
TEE_ALG_SM4_ECB_NOPAD
TEE_ALG_SM4_CBC_NOPAD
TEE_ALG_SM4_CTR
TEE_ALG_DES_ECB_NOPAD
TEE_ALG_DES_CBC_NOPAD
TEE_ALG_DES3_ECB_NOPAD
TEE_ALG_DES3_CBC_NOPAD
```

mode: режим шифрования или расшифрования.

##### 14.3.1.8 rk_set_padding

```text
TEE_Result rk_set_padding(crypto_ctx_t *ctx, int padding);
```

Назначение: задать режим дополнения шифруемых/расшифровываемых данных. ctx — контекст; padding — режимы см. rk_padding_t.

##### 14.3.1.9 rk_cipher_begin

```text
TEE_Result rk_cipher_begin(crypto_ctx_t *ctx, uint8_t *key, uint32_t key_len,
                           uint8_t *iv, uint32_t algo, TEE_OperationMode mode);
```

Назначение: инициализация поэтапного симметричного шифрования/расшифрования. ctx — контекст; key — ключ; key_len — длина ключа, зависит от algo; iv — начальный вектор; algo — тип алгоритма, список ниже (OP-TEE V1 не поддерживает SM).

```text
TEE_ALG_AES_ECB_NOPAD
TEE_ALG_AES_CBC_NOPAD
TEE_ALG_AES_CTR
TEE_ALG_AES_CTS
TEE_ALG_AES_XTS
TEE_ALG_SM4_ECB_NOPAD
TEE_ALG_SM4_CBC_NOPAD
TEE_ALG_SM4_CTR
TEE_ALG_DES_ECB_NOPAD
TEE_ALG_DES_CBC_NOPAD
TEE_ALG_DES3_ECB_NOPAD
TEE_ALG_DES3_CBC_NOPAD
```

mode: режим шифрования или расшифрования.

##### 14.3.1.10 rk_cipher_update

```text
TEE_Result rk_cipher_update(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                            uint32_t in_len, uint32_t *out_len);
```

Назначение: шифровать/расшифровать очередные входные данные поэтапного алгоритма. ctx — контекст; in — вход для обработки; in_len — длина входа; out — выход; out_len — длина выхода.

##### 14.3.1.11 rk_cipher_finish

```text
TEE_Result rk_cipher_finish(crypto_ctx_t *ctx, uint8_t *out, uint32_t *out_len);
```

Назначение: завершить поэтапное симметричное шифрование/расшифрование. ctx — контекст; out — выход; out_len — длина выхода.

##### 14.3.1.12 rk_ae_begin

```text
TEE_Result rk_ae_begin(crypto_ctx_t *ctx, uint8_t *key, uint32_t key_len,
                       uint8_t *iv, uint32_t iv_len,
                       uint32_t add_len, uint32_t tag_len,
                       uint32_t payload_len, uint32_t algo, TEE_OperationMode mode);
```

Назначение: инициализация AES-CCM либо AES-GCM. ctx — контекст; key — ключ; key_len — длина, 16,24,32; iv — начальный вектор; iv_len — его длина; add_len — длина ADD для AES-CCM; tag_len — длина тега в битах: AES-GCM 128,120,112,104,96; AES-CCM 128,112,96,80,64,48,32; payload_len — длина полезных данных AES-CCM; algo — TEE_ALG_AES_GCM или TEE_ALG_AES_CCM; mode — шифрование/расшифрование.

##### 14.3.1.13 rk_ae_update

```text
TEE_Result rk_ae_update(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                        uint32_t in_len, uint32_t *out_len,
                        rk_ae_update_type_t is_aad);
```

Назначение: шифрование/расшифрование AES-CCM/AES-GCM. ctx — контекст; in — вход для обработки; in_len — длина входа; out — выход; out_len — длина выхода; is_add — наличие AAD (Additional Authentication Data).

##### 14.3.1.14 rk_ae_finish

```text
TEE_Result rk_ae_finish(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                        uint8_t *tag, uint32_t in_len,
                        uint32_t *out_len, uint32_t *tag_len);
```

Назначение: завершить AES-CCM/AES-GCM. ctx — контекст; in — последняя входная часть; in_len — её длина; out — выход; out_len — длина выхода; tag — тег в выходном буфере; tag_len — длина тега.

##### 14.3.1.15 rk_gen_rsa_key

```text
TEE_Result rk_gen_rsa_key(rsa_key_t *rsa_key, uint32_t key_len,
                          uint64_t public_exponent);
```

Назначение: случайная генерация открытого/закрытого RSA-ключа. rsa_key — созданная пара; key_len — длина RSA в байтах, 32,64,96,128,192,256,384,512; public_exponent — показатель, 3 или 65537.

##### 14.3.1.16 rk_rsa_crypto

```text
TEE_Result rk_rsa_crypto(uint8_t *in, uint8_t *out, uint32_t len,
                         rsa_key_t *key, uint32_t algo, TEE_OperationMode mode);
```

Назначение: RSA-шифрование/расшифрование; возможно также через rk_rsa_begin/finish. in — входные данные.

len — длина входа; out — выход; key — RSA-ключ; algo — режим дополнения RSA, поддерживаемые варианты ниже.

```text
TEE_ALG_RSAES_PKCS1_V1_5
TEE_ALG_RSAES_PKCS1_OAEP_MGF1_SHA1
TEE_ALG_RSAES_PKCS1_OAEP_MGF1_SHA224
TEE_ALG_RSAES_PKCS1_OAEP_MGF1_SHA256
TEE_ALG_RSAES_PKCS1_OAEP_MGF1_SHA384
TEE_ALG_RSAES_PKCS1_OAEP_MGF1_SHA512
TEE_ALG_RSA_NOPAD
```

mode — TEE_MODE_ENCRYPT либо TEE_MODE_DECRYPT.

##### 14.3.1.17 rk_rsa_sign

```text
TEE_Result rk_rsa_sign(uint8_t *digest, uint8_t *signature, uint32_t digest_len,
                       uint32_t *signature_len, rsa_key_t *key,
                       uint32_t salt_len, uint32_t algo, TEE_OperationMode mode);
```

Назначение: RSA-подпись/проверка; также через rk_rsa_begin/finish. digest — дайджест; signature — выходная подпись либо входная подпись для проверки; digest_len — длина дайджеста; signature_len — длина подписи; key — RSA-ключ; salt_len — необязательное число байтов соли, без параметра длина соли равна длине дайджеста; algo — алгоритм, см. GPD_TEE_Internal_Core_API_Specification, Table 6-4; mode — TEE_MODE_SIGN или TEE_MODE_VERIFY.

##### 14.3.1.18 rk_set_sign_mode

```text
TEE_Result rk_set_sign_mode(crypto_ctx_t *ctx, unsigned int mode);
```

Назначение: выбрать RSA-подпись данных либо дайджеста. Параметры:

ctx — контекст; mode — данные SIGN_DATA либо дайджест SIGN_DIGEST.

##### 14.3.1.19 rk_rsa_begin

```text
TEE_Result rk_rsa_begin(crypto_ctx_t *ctx, rsa_key_t *key,
                        uint32_t algo, TEE_OperationMode mode);
```

Назначение: инициализация RSA-шифрования, расшифрования, подписи или проверки. ctx — контекст; key — RSA-ключ; algo — дополнение, разрешённые значения зависят от mode, см. GPD_TEE_Internal_Core_API_Specification, Table 6-4; mode — TEE_MODE_ENCRYPT, TEE_MODE_DECRYPT, TEE_MODE_SIGN, TEE_MODE_VERIFY.

##### 14.3.1.20 rk_rsa_finish

```text
TEE_Result rk_rsa_finish(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                         uint32_t in_len, uint32_t *out_len, uint32_t salt_len);
```

Назначение: выполнить RSA-шифрование, расшифрование, подпись или проверку после rk_rsa_begin. ctx — контекст; in — вход; in_len — длина входа; out — выход; out_len — длина выхода; salt_len — необязательное число байтов соли.

##### 14.3.1.21 rk_gen_ec_key

```text
TEE_Result rk_gen_ec_key(ec_key_t *ec_key, uint32_t key_len, uint32_t curve);
```

Назначение: случайная генерация ECC-пары ключей.

ec_key — созданная открытая/закрытая пара ECC; key_len — длина в битах, 192,224,256,384,521; curve — ECC-кривая, поддерживаемые см. tee_api_defines.h.

##### 14.3.1.22 rk_ecdh_genkey

```text
TEE_Result rk_ecdh_genkey(uint8_t *private, uint8_t *publicx, uint32_t *publicy,
                          uint32_t algo,  uint32_t curve,
                          uint32_t keysize, uint8_t *out);
```

Назначение: ECDH для согласования симметричного ключа. private — закрытый ECC-ключ; publicx — X открытого ключа; publicy — Y открытого ключа.

algo: TEE_ALG_ECDH_P192, TEE_ALG_ECDH_P224, TEE_ALG_ECDH_P256, TEE_ALG_ECDH_P384,

TEE_ALG_ECDH_P521

curve: кривая ECC; TEE_ECC_CURVE_NIST_P192, TEE_ECC_CURVE_NIST_P224,

TEE_ECC_CURVE_NIST_P256, TEE_ECC_CURVE_NIST_P384, TEE_ECC_CURVE_NIST_P521. keysize — длина ключа в битах, 192,224,256,384,521; out — полученный симметричный ключ.

##### 14.3.1.23 rk_ecdsa_sign

```text
TEE_Result rk_ecdsa_sign(uint8_t *digest, uint8_t *signature,
                         uint32_t digest_len, uint32_t *signature_len,
                         ec_key_t *key, uint32_t algo, TEE_OperationMode mode);
```

Назначение: ECDSA-подпись/проверка, также через rk_ecdsa_begin/finish. digest — входной дайджест; signature — выходная подпись либо входная для проверки; digest_len — длина дайджеста; signature_len — длина подписи; key — ECC-ключ.

algo — TEE_ALG_ECDSA_P224, TEE_ALG_ECDSA_P256, TEE_ALG_ECDSA_P384, TEE_ALG_ECDSA_P521; mode — TEE_MODE_SIGN, TEE_MODE_VERIFY.

##### 14.3.1.24 rk_ecdsa_begin

```text
TEE_Result rk_ecdsa_begin(crypto_ctx_t *ctx, ec_key_t *key,
                          uint32_t algo,TEE_OperationMode mode);
```

Назначение: инициализация ECDSA-подписи/проверки. ctx — контекст; key — ECC-ключ; algo — TEE_ALG_ECDSA_P224, TEE_ALG_ECDSA_P256, TEE_ALG_ECDSA_P384, TEE_ALG_ECDSA_P521; mode — TEE_MODE_SIGN, TEE_MODE_VERIFY.

##### 14.3.1.25 rk_ecdsa_finish

```text
TEE_Result rk_ecdsa_finish(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                           uint32_t in_len, uint32_t *out_len);
```

Назначение: подписать входной дайджест либо проверить дайджест с подписью ECDSA. ctx — контекст; in — входной дайджест; out — выходная подпись либо входная для проверки; in_len — длина входа; out_len — длина подписи.

##### 14.3.1.26 rk_sm2_pke

```text
TEE_Result rk_sm2_pke(uint8_t *in, uint32_t in_len, uint8_t *out,
                      uint32_t *out_len, ec_key_t *key,
                      uint32_t algo, TEE_OperationMode mode);
```

Назначение: SM2-шифрование/расшифрование. OP-TEE V1 не поддерживает API.

in — вход для шифрования/расшифрования; in_len — длина входа; out — выход; out_len — длина выхода; key — SM2-ключ; algo — TEE_ALG_SM2_PKE; mode — TEE_MODE_ENCRYPT или TEE_MODE_DECRYPT.

##### 14.3.1.27 rk_sm2_dsa_sm3

```text
TEE_Result rk_sm2_dsa_sm3(uint8_t *digest, uint32_t digest_len,
                          uint8_t *signature, uint32_t *signature_len,
                          ec_key_t *key, uint32_t algo, TEE_OperationMode mode);
```

Назначение: SM2-подпись/проверка. OP-TEE V1 не поддерживает API. digest — SM3-дайджест; digest_len — всегда32; signature — выходная подпись либо входная для проверки; signature_len — длина подписи; key — SM2-ключ; algo — TEE_ALG_SM2_DSA_SM3; mode — TEE_MODE_SIGN либо TEE_MODE_VERIFY.

##### 14.3.1.28 rk_sm2_kep_genkey

```text
TEE_Result rk_sm2_kep_genkey(rk_sm2_kep_parms *kep_parms, uint8_t *share_key,
                             uint32_t share_key_len, uint8_t *conf_out);
```

Назначение: ECDH на основе SM2, не поддерживается OP-TEE V1. kep_parms — сведения о SM2-ключах, закрытый A и открытый B; share_key — согласованный симметричный ключ; share_key_len — длина share_key; conf_out — данные сеанса для проверки.

##### 14.3.1.29 rk_mac_crypto

```text
TEE_Result rk_mac_crypto(uint8_t *in, uint8_t *out, uint32_t in_len,
                         uint32_t *out_len, uint8_t *key, uint32_t key_len,
                         uint8_t *iv, uint32_t algo);
```

Назначение: вычислить MAC; для частей rk_mac_begin/update/finish. in — вход; in_len — длина входа; out — выход; out_len — длина выхода; key — MAC-ключ; key_len — длина ключа; iv — начальный вектор.

algo: алгоритм MAC (V1 не поддерживает SM), TEE_ALG_HMAC_MD5, TEE_ALG_HMAC_SHA1,

TEE_ALG_HMAC_SHA256, TEE_ALG_AES_CMAC, TEE_ALG_HMAC_SM3

##### 14.3.1.30 rk_mac_begin

```text
TEE_Result rk_mac_begin(crypto_ctx_t *ctx, uint8_t *key, uint32_t key_len,
                        uint8_t *iv, uint32_t algo);
```

Назначение: инициализация поэтапного MAC. ctx — контекст; key — MAC-ключ; key_len — длина ключа; iv — начальный вектор.

algo: алгоритм MAC (V1 не поддерживает SM), TEE_ALG_HMAC_MD5, TEE_ALG_HMAC_SHA1,

TEE_ALG_HMAC_SHA256, TEE_ALG_AES_CMAC, TEE_ALG_HMAC_SM3

##### 14.3.1.31 rk_mac_update

```text
TEE_Result rk_mac_update(crypto_ctx_t *ctx, uint8_t *in, uint32_t in_len);
```

Назначение

Поэтапный MAC: накопить входные данные для расчёта MAC. ctx — контекст; in — вход; in_len — длина входа.

##### 14.3.1.32 rk_mac_finish

```text
TEE_Result rk_mac_finish(crypto_ctx_t *ctx, uint8_t *in, uint8_t *mac,
                         uint32_t in_len, uint32_t *mac_len, rk_mac_mode_t mode);
```

Назначение: завершить MAC с последней частью либо проверить ожидаемый MAC по последней части. ctx — контекст; in — последняя часть; in_len — её длина; mac — выход MAC при mode=RK_MAC_SIGN, ожидаемый вход MAC при mode=RK_MAC_VERIFY; mac_len — длина MAC; mode — см. mac.

##### 14.3.1.33 rk_hkdf_genkey

```text
TEE_Result rk_hkdf_genkey(uint8_t *ikm, uint32_t ikm_len,
                          uint8_t *salt, uint32_t salt_len,
                          uint32_t *info, uint32_t info_len,
                          uint32_t algo, uint32_t okm_len, uint8_t *okm);
```

Назначение: выработка ключа HKDF. ikm — входной пароль; ikm_len — его длина; salt — входная соль; salt_len — её длина; info — входная информация; info_len — её длина.

algo: TEE_ALG_HKDF_MD5_DERIVE_KEY, TEE_ALG_HKDF_SHA1_DERIVE_KEY,

TEE_ALG_HKDF_SHA224_DERIVE_KEY, TEE_ALG_HKDF_SHA256_DERIVE_KEY, TEE_ALG_HKDF_SHA384_DERIVE_KEY, TEE_ALG_HKDF_SHA512_DERIVE_KEY. okm_len — заданная длина производного ключа; okm — производный ключ.

##### 14.3.1.34 rk_pkcs5_pbkdf2_hmac

```text
TEE_Result rk_pkcs5_pbkdf2_hmac(uint8_t *password, uint32_t password_len,
                                uint8_t *salt, uint32_t salt_len,
                                uint32_t iterations, uint32_t algo,
                                uint32_t key_len, uint8_t *out_key);
```

Назначение: выработка ключа по salt, iteration count и password. password — пароль; password_len — длина; salt — соль; salt_len — длина; iterations — число итераций; algo — TEE_ALG_PBKDF2_HMAC_SHA1_DERIVE_KEY; key_len — заданная длина ключа; out_key — производный ключ.

#### 14.3.2 HW Crypto API

##### 14.3.2.1 rk_user_ta_cipher

```text
TEE_Result rk_user_ta_cipher(rk_cipher_config *config, uint8_t *src, uint32_t len)
```

Назначение: User TA выполняет шифрование/расшифрование аппаратным Crypto. config — тип/режим алгоритма, ключ и другие параметры; src — вход/выход; len — длина данных. Пример исходников в rk_tee_user.

##### 14.3.2.2 rk_keylad_hmac

```text
TEE_Result rk_keylad_hmac(uint32_t algo, enum RK_OEM_OTP_KEYID otp_keyid,
                          uint32_t key_len, uint8_t *msg, uint32_t msg_len,
                          uint8_t *mac, uint32_t *mac_len)
```

Назначение: User TA вычисляет HMAC аппаратным Crypto с выбранным ключом OTP. Сначала ключ должен быть записан через OTP API. Поддерживается не всеми платформами; иначе TEE_ERROR_NOT_SUPPORTED. algo — режим алгоритма; otp_keyid — индекс ключа OTP; key_len — длина ключа; msg — вход; msg_len — длина входа; mac — выход; mac_len — длина выхода. Исходный пример в rk_tee_user.

##### 14.3.2.3 rk_keylad_cipher

```text
TEE_Result rk_keylad_cipher(enum RK_OEM_OTP_KEYID otp_keyid,
                            rk_cipher_config *config,
                            uint8_t *src, uint32_t len);
```

Назначение: User TA шифрует/расшифровывает аппаратным Crypto с выбранным OTP-ключом. Сначала запишите ключ через OTP API. На неподдерживаемых платформах возвращается TEE_ERROR_NOT_SUPPORTED. otp_keyid — индекс ключа OTP; config — тип/режим алгоритма, длина ключа и другие параметры; src — вход/выход; len — длина данных. Исходники:

Пример в проекте rk_tee_user.

#### 14.3.3 TRNG API

##### 14.3.3.1 rk_get_trng

```text
TEE_Result rk_get_trng(uint8_t *buffer, uint32_t size);
```

Назначение: User TA получает аппаратные случайные числа. На неподдерживаемых платформах TEE_ERROR_NOT_SUPPORTED. buffer — возвращаемые числа, объём памяти не меньше size; size — запрошенная длина. Исходный пример в rk_tee_user.

#### 14.3.4 Derive Key API

##### 14.3.4.1 rk_derive_ta_unique_key

```text
TEE_Result rk_derive_ta_unique_key(uint8_t *extra, uint16_t extra_size, uint8_t *key,
uint16_t key_size)
```

Назначение: User TA получает ключ, производный от аппаратного уникального ключа. Уникальный ключ записывается в каждый чип при производстве, поэтому производные ключи уникальны. OP-TEE V1 не поддерживает API; вместо него можно использовать TEE_DerivekeyFromHard. extra — вход для разных производных ключей; extra_size — длина входа; key — производный ключ; key_size — длина ключа. Пример в rk_tee_user.

#### 14.3.5 OTP API

##### 14.3.5.1 rk_otp_size

```text
TEE_Result rk_otp_size(uint32_t *otp_size);
```

Назначение: User TA получает общий размер Protected OEM Zone безопасного OTP. otp_size — возвращаемый размер OTP. Пример в rk_tee_user; подробности в разделе Protected OEM Zone документа Rockchip_Developer_Guide_OTP_CN.pdf.

##### 14.3.5.2 rk_otp_read

```text
TEE_Result rk_otp_read(uint32_t offset, uint8_t *data, uint32_t len);
```

Назначение: User TA читает Protected OEM Zone безопасного OTP. offset — смещение чтения; data — возвращаемые данные, память не меньше len; len — длина чтения. Пример в rk_tee_user; подробности в разделе Protected OEM Zone документа Rockchip_Developer_Guide_OTP_CN.pdf.

##### 14.3.5.3 rk_otp_write

```text
TEE_Result rk_otp_write(uint32_t offset, uint8_t *data, uint32_t len);
```

Назначение: User TA записывает Protected OEM Zone безопасного OTP. offset — смещение записи.

data — записываемые данные; len — длина data. Пример в rk_tee_user; подробности в разделе Protected OEM Zone документа Rockchip_Developer_Guide_OTP_CN.pdf.

##### 14.3.5.4 rk_write_oem_otp_key

```text
TEE_Result rk_write_oem_otp_key(enum RK_OEM_OTP_KEYID key_id,
                                uint8_t *key, uint32_t key_len)
```

Назначение: User TA программирует ключ OTP. key_id — индекс; key — записываемый ключ; key_len — длина ключа. Пример в rk_tee_user; раздел OEM Cipher Key документа Rockchip_Developer_Guide_OTP_CN.pdf.

##### 14.3.5.5 rk_is_oem_otp_key_written

```text
TEE_Result rk_is_oem_otp_key_written(enum RK_OEM_OTP_KEYID key_id, bool *is_written)
```

Назначение: User TA проверяет, записан ли ключ. Заблокированный ключ возвращает TEE_ERROR_ACCESS_DENIED. key_id — индекс; is_written — 0 не записан, 1 записан. Пример в rk_tee_user; раздел OEM Cipher Key документа Rockchip_Developer_Guide_OTP_CN.pdf.

##### 14.3.5.6 rk_oem_otp_key_set_read_lock

```text
TEE_Result rk_oem_otp_key_set_read_lock(enum RK_OEM_OTP_KEYID key_id)
```

Назначение: User TA блокирует ключ. После блокировки CPU не имеет доступа, ПО не может читать/писать ключ; только аппаратный Crypto читает и использует его. Функция доступна лишь на части платформ. key_id — индекс. Пример в rk_tee_user; раздел OEM Cipher Key документа Rockchip_Developer_Guide_OTP_CN.pdf.

## 15 PTA

### 15.1 Обзор

PTA встроена в TEE OS и также называется внутренней TA. Её интерфейсы реализуют функции, отсутствующие в TEE Internal API, и предоставляют разработчику примеры вызова либо прямое использование.

### 15.2 Функции PTA

#### 15.2.1 Защищённое хранение

Важные пользовательские данные шифруются TEE OS и хранятся в security, RPMB либо файловой системе Android/Linux. Обычно User TA вызывает TEE Internal API. Поскольку U-Boot также хранит критичные загрузочные данные, PTA предоставляет интерфейс безопасного хранения с выбором области через параметр.

#### 15.2.2 Чтение/запись OTP

OTP — однократно программируемое хранилище; записанные данные не изменяются. TEE Internal API не имеет OTP-интерфейсов, поэтому чтение/запись реализованы в PTA. PTA OTP может программировать следующие данные:

| Данные OTP | Назначение |
| --- | --- |
| Secure Boot Public Hash | Проверка допустимости открытого ключа при Secure Boot |
| AVB Attribute Hash | Проверка сертификата attribute в процессе AVB |
| OEM Cipher Key | Ключ шифрования/расшифрования аппаратного Crypto |
| Non-Protected OEM Zone | Несекретные OEM-данные, доступные небезопасному миру |
| Protected OEM Zone | Секретные OEM-данные, доступные только безопасному миру |
| TA Encrypt Key | Расшифровывает TA при загрузке зашифрованной TA в TEE OS |
| OEM Encrypt Data | Для защиты от копирования платы |
| OEM HUK | Аппаратно-уникальный OEM-ключ; см. раздел о выборе сильной/слабой схемы безопасности |

#### 15.2.3 Аппаратное шифрование/расшифрование Crypto

TEE Internal API по умолчанию предоставляет программную криптографию. Аппаратная реализована интерфейсом PTA: симметричные DES, TDES, AES, SM4 с возможностью выбора OTP-ключа; также HMAC с выбранным OTP-ключом.

#### 15.2.4 Аппаратные случайные числа

TEE Internal API не имеет интерфейса истинных случайных чисел; PTA реализует его. PTA TRNG выдаёт истинные аппаратно сгенерированные случайные данные произвольной длины.

#### 15.2.5 Выработка ключа из аппаратного уникального ключа

TEE Internal API не имеет выработки ключа из аппаратного уникального ключа; PTA реализует её. При производстве каждый чип получает HUK — случайное число от истинного генератора. HUK каждого чипа отличается, поэтому производные ключи уникальны.

### 15.3 Вызов PTA

U-Boot: исходники интерфейса u-boot/lib/optee_clientApi, описание — раздел Optee Client в Rockchip_Developer_Guide_UBoot_Nextdev_CN. Userspace: librkcrypto, описание Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf. User TA: rk_tee_user, описание — раздел TA API настоящего документа.

## 16 Дополнительные материалы

ARM TrustZone: https://developer.arm.com/ip-products/security-ip/trustzone. GlobalPlatform: https://globalplatform.org/ — доступны TEE Client API Specification для CA, TEE Internal Core API Specification для TA и другие архитектурные документы.

{% endraw %}

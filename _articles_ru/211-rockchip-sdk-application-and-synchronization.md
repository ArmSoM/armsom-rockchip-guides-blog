---
title: "Заявка на Rockchip SDK и синхронизация"
description: "Заявка на Rockchip SDK и синхронизация — V1.1.8"
excerpt: "Заявка на Rockchip SDK и синхронизация"
translation_key: "211-rockchip-sdk-application-and-synchronization"
slug: "211-rockchip-sdk-application-and-synchronization"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "development"
products: []
tags: [ArmSoM, Rockchip, SDK, Git, Repo]
---

{% raw %}

# Заявка на Rockchip SDK и синхронизация

Основа — китайский и английский документы Rockchip RK-YH-YF-801 V1.1.8 от 2025-10-24. Полностью сохранены технические материалы о заявке, авторизации, синхронизации, версиях SDK, инструментах и устранении ошибок. Исходная глава 4 содержит только контакты/жалобы и удалена вместе с юридическими, адресными и редакционными страницами; остальные номера глав сохранены. Матрица из 143 SDK и звёзды рекомендации — исторические сведения, не текущий статус сопровождения и не обещание поддержки плат ArmSoM. Заявки, загрузки, смена ключей, удаление репозиториев и аппаратные испытания не выполнялись.

Безопасность: отправляйте только открытый ключ .pub, никогда не закрытый ключ, .git-credentials или токены. Команда «резервной копии открытого ключа» архивирует весь ~/.ssh, включая возможные закрытые ключи; шифруйте архив и ограничивайте доступ. Ключи без пароля, StrictHostKeyChecking no и принятие неизвестного сервера в источнике не являются общими рекомендациями безопасности: независимо проверяйте отпечаток сервера и соблюдайте правила защиты ключей организации. Удаление репозиториев, --force-sync и перезапись могут уничтожить локальные изменения; сначала сделайте копию и проверьте точные цели.

Различия: английский текст говорит о трёх файлах авторизации, но перечисляет два; принято китайское число два. Каталог инструментов Linux — tools по китайскому оригиналу, а не английское Tools. Ошибочный английский заголовок 1.2.2 о базовых пакетах исправлен по китайскому на прямую серверную синхронизацию. RK1808 добавлен из английского списка ToyBrick. Английский раздел отправки ключа фактически показывает письмо активации Redmine; исходный снимок сохранён с этим пояснением. Большинство интерфейсов китайские/двуязычные. Использованы только проверенные изображения с удалёнными контактными подвалами; чисто контактные снимки исключены. Команды снимка release notes обрезаны по горизонтали и не являются полными исполняемыми командами.

Код источника сохранён буквально; его исполнимость не гарантируется: адрес в английской команде ssh-keygen записан как Markdown-ссылка, некоторые параметры -p используют тире –p, gitconfig содержит маркеры •, имя архива — id_ras_backup.tag.gz. Перед запуском проверьте синтаксис; эти ошибки оформления и написания не исправлены без пояснений.

<!-- source:en p5 unit:38 -->

## 1. Руководство по операциям

<!-- source:en p5 unit:39 -->

Глава описывает заявку на Rockchip SDK: открытый ключ, форму заявки и ответственное лицо для получения материалов.

<!-- source:en p5 unit:40 -->

### 1.1 Процесс и этапы получения SDK

<!-- source:en p5 unit:41 -->

Для получения Rockchip SDK выполните следующие действия:

<!-- source:en p5 unit:42 -->

#### 1.1.1 Порядок действий

<!-- source:en p5 unit:43 -->

Ниже показан процесс заявки на Rockchip SDK, включая все выпускаемые программные материалы.

<!-- source:en p5 unit:43f -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p005-application-flow.png)

<!-- source:en p5 unit:44 -->

#### 1.1.2 Заполнение регистрационной формы

<!-- source:en p5 unit:45 -->

При первом сотрудничестве с Rockchip после подписания делового соглашения система отправляет письмо «Rockchip Customer Information Form». Заполните регистрационные данные компании следующим образом:

<!-- source:en p6 unit:46 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p006-figure-01.png)

<!-- source:en p6 unit:47 -->

После перехода по ссылке «Fill out the Information Form» открывается следующая регистрационная форма:

<!-- source:en p7 unit:48 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p007-figure-01.png)

<!-- source:en p7 unit:49 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p007-figure-02.png)

<!-- source:en p8 unit:50 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p008-figure-01.png)

<!-- source:en p8 unit:51 -->

#### 1.1.3 Указание ответственного за получение материалов

<!-- source:en p8 unit:52 -->

«Окно получения документации» — назначенный компанией сотрудник, взаимодействующий с Rockchip и получающий сведения о выпусках ПО, аппаратуры и платформ. По политике источника каждому юридическому лицу предоставляется одна учётная запись, централизованно управляемая и используемая внутри организации. Обеспечьте резервное копирование всех материалов. При смене ответственного своевременно уведомляйте представителя Rockchip по электронной почте, чтобы обновить сведения и не пропускать уведомления. Рекомендуется общий адрес группы R&D, например xxrd@xx.com: это снижает риск потери информации при пересылке отдельными сотрудниками, задержек проекта и убытков.

<!-- source:en p8 unit:53 -->

#### 1.1.4 Предоставление заявки на SDK

<!-- source:en p8 unit:54 -->

Можно запросить одну или несколько версий SDK. Из-за большого числа чипов и версий см. список в разделе 2.1 или на Redmine: https://redmine.rock-chips.com/projects/fae/documents. Укажите нужные номера версий по требованиям проекта и отправьте заявку с рабочего адреса назначенному деловому контакту Rockchip для внутренней регистрации. Включите следующие сведения:

<!-- source:en p9 unit:55 -->

| Форма заявки на Rockchip SDK |  |
| --- | --- |
| № | Версия SDK для активации |
| 1 |  |
| 2 |  |
| 3 |  |
| 4 |  |
| 5 |  |
| 6 |  |
| 7 |  |

<!-- source:en p9 unit:56 -->

#### 1.1.5 Создание открытого ключа

<!-- source:en p9 unit:57 -->

В Ubuntu выполните следующую команду в своём каталоге:

<!-- source:en p9 unit:58 -->

```text
xx@ubuntu:~$ cd ~
xx@ubuntu:~$ ssh-keygen -t rsa -C [user@rock-chips.com](mailto:user@rock-chips.com)
```

<!-- source:en p9 unit:59 -->

Для создания открытого ключа источник предлагает выполнить команду выше без ввода пароля. user@rock-chips.com здесь обозначает рабочий, а не личный адрес вашей компании. После выполнения соответствующие файлы ключей создаются в следующем каталоге:

<!-- source:en p9 unit:60 -->

```text
xx@ubuntu:~$ ls -l .ssh/
total 12
-rw------- 1 rockchip rockchip 1675 Oct 31 2018 id_rsa
-rw-r--r-- 1 rockchip rockchip 403 Oct 31 2018 id_rsa.pub
```

<!-- source:en p9 unit:61 -->

Надёжно сохраните закрытый ключ id_rsa и пароль. После письма «Rockchip-SDK Public Key Submission» отправьте открытый ключ id_rsa.pub согласно инструкциям; см. раздел 1.1.6.

<!-- source:en p10 unit:62 -->

#### 1.1.6 Предоставление открытого ключа

<!-- source:en p10 unit:63 -->

После завершения внутренних процедур деловым контактом Rockchip система при необходимости отправляет «Rockchip-SDK Public Key Submission». Если ключ компании уже сохранён, повторная отправка не требуется и письмо не приходит. Оно отправляется только при первом сотрудничестве, когда открытый ключ ещё не зарегистрирован. Пример письма:

<!-- source:en p10 unit:64 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p010-figure-01.png)

<!-- source:en p10 unit:65 -->

При нажатии «SDK Kit Submission» открывается следующая страница:

<!-- source:en p11 unit:66 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p011-figure-01.png)

<!-- source:en p11 unit:67 -->

Скопируйте содержимое файла открытого ключа компании (*.pub) в указанное поле и отправьте; см. 1.1.5. Ссылка действительна 7 дней. Если ключ не предоставлен вовремя, система отправляет напоминание «Rockchip-SDK Kit Submission Timeout» и предоставляет продление на 24 часа. После пропуска продлённого срока необходимо заново запросить и активировать ссылку.

<!-- source:en p12 unit:68 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p012-figure-01.png)

<!-- source:en p12 unit:69 -->

#### 1.1.7 Резервное копирование открытого ключа

<!-- source:en p12 unit:70 -->

Надёжно сохраните резервную копию ключа компании, чтобы его потеря не помешала синхронизации с сервером Rockchip.

<!-- source:en p12 unit:71 -->

```text
xx@ubuntu:~$ tar zcvf id_ras_backup.tag.gz ~/.ssh
```

<!-- source:en p12 unit:72 -->

#### 1.1.8 Смена открытого ключа

<!-- source:en p12 unit:73 -->

Защищайте созданную пару ключей. Она не зависит от смены сервера или других изменений системы, не требует частого обновления и не мешает синхронизации SDK. Если пара потеряна или требует замены по особым причинам, обратитесь к деловому представителю Rockchip по электронной почте. После внутреннего согласования система повторно отправит ссылку для ключа. Пример письма:

<!-- source:en p13 unit:74 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p013-figure-01.png)

<!-- source:en p13 unit:75 -->

Ссылка действительна 7 дней; после истечения срока нужна новая заявка. Получив уведомление, отправьте новый ключ как можно скорее. После успешной отправки откроется следующая страница:

<!-- source:en p14 unit:76 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p014-figure-01.png)

<!-- source:en p14 unit:77 -->

После регистрации и активации обновления ключа Rockchip отправляет «Rockchip - Public Key Update Successful», подтверждая вступление нового ключа в силу. Пример письма:

<!-- source:en p15 unit:78 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p015-figure-01.png)

<!-- source:en p15 unit:79 -->

### 1.2 Получение доступа к SDK

<!-- source:en p15 unit:80 -->

На следующем этапе внутренних процедур приходит системное письмо «Rockchip-SDK has been activated»:

<!-- source:en p16 unit:81 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p016-figure-01.png)

<!-- source:en p16 unit:82 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p016-figure-02.png)

<!-- source:en p17 unit:83 -->

С развитием SDK расширяются функции и защита, увеличивается объём кода. Получить SDK можно двумя способами: напрямую синхронизировать с сервером через sync, загрузив полный исходный код вместе с базовым пакетом; либо сначала загрузить базовый пакет, затем через sync получить полный код.

<!-- source:en p17 unit:84 -->

#### 1.2.1 Проверка подлинности и разрешений — обязательный этап

<!-- source:en p17 unit:85 -->

Для защиты сервера добавлена обязательная дополнительная проверка разрешения на загрузку. Получите сценарий авторизации через git clone. При выполнении вручную вводятся учётная запись Gerrit, почта ответственного за документацию и имя файла закрытого ключа. Этапы: a. Получение сценария.

<!-- source:en p17 unit:86 -->

```text
xx@ubuntu:~$ git clone https://gerrit.rock-chips.com:8443/repo-release/tools/script
```

<!-- source:en p17 unit:87 -->

b. Запуск сценария

<!-- source:en p17 unit:88 -->

```text
xx@ubuntu:~$ ./Generate-Credential.x
```

<!-- source:en p17 unit:89 -->

Перейдите в каталог сценария и запустите его. Введите учётную запись Gerrit, почту ответственного за материалы и имя закрытого ключа. После проверки ключа и аккаунта выдаётся разрешение на загрузку и sync.

<!-- source:en p17 unit:90 -->

```text
└── script
├── Generate-Credential.x
└── README.md
```

<!-- source:en p17 unit:91 -->

c. Пример запуска сценария

<!-- source:en p17 unit:92 -->

```text
Please input your username (make sure to use the username exactly the same as the one in RK
email!!): Gerrit_Account
Please input your email (make sure to use the company email address!!): data_owner_email
Please input your SSH private key filename (e.g. id_rsa): id_rsa
```

<!-- source:en p17 unit:93 -->

Следующий вывод означает успешное выполнение сценария.

<!-- source:en p18 unit:94 -->

```text
Your Credential check has passed
New git credential will be added into your history!!
You are All Set!!
```

<!-- source:en p18 unit:95 -->

Если в конце появляется следующее сообщение, сценарий завершился ошибкой. Проверьте настройки по разделу 5.1 Q&A либо выясните, не блокируют ли защитные средства компании протокол загрузки SSH.

<!-- source:en p18 unit:96 -->

```text
Credential mismatch issue, please refer to the instruction documents attached to the
Rockchip-SDK Ready email to correctly configure the gerrit account and ssh key.
Do you want to retry (y/n)?
```

<!-- source:en p18 unit:97 -->

После успешной авторизации также создаются следующие два файла:

<!-- source:en p18 unit:98 -->

```text
└──~/.gitconfig # Contains Gerrit account information and configuration
└──~/.git-credentials # Contains the Gerrit account corresponding to the HTTPS download
authorization
```

<!-- source:en p18 unit:99 -->

После получения аккаунта запускайте сценарий с закрытым ключом, соответствующим ранее отправленному открытому ключу: файл id_rsa с правами 600. После привязки локального устройства загрузка становится доступной. Разрешение привязано к локальному системному пользователю, запустившему сценарий, и хранится в его домашнем каталоге. Копирование ~/.gitconfig и ~/.git-credentials в домашний каталог другого устройства или пользователя также позволяет напрямую загружать по HTTPS. Перед загрузкой проверьте наличие файлов авторизации в домашнем каталоге текущего пользователя. Повторный запуск создаёт новое разрешение и автоматически аннулирует старое.

<!-- source:en p18 unit:100 -->

#### 1.2.2 Прямая загрузка и синхронизация с сервера

<!-- source:en p18 unit:101 -->

Письмо об активации SDK содержит документ выпуска с адресом загрузки repo и способом синхронизации кода. Далее используется пример Rockchip_Android13_SDK_Developer_Guide_CN.pdf:

<!-- source:en p19 unit:102 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p019-figure-01.png)

<!-- source:en p19 unit:103 -->

Подробнее см. 1.2.1 «Проверка авторизации».

<!-- source:en p19 unit:104 -->

#### 1.2.3 Способы загрузки базового пакета

<!-- source:en p19 unit:105 -->

Базовый пакет содержит исходную функциональную версию кода, инструменты, документацию и историю версий репозиториев. Некоторые SDK превышают 100 ГБ, поэтому длительность sync зависит от скорости сети и может быть непредсказуемой. Для экономии времени сначала скопируйте базовый пакет, затем синхронизируйте: это уменьшает объём полной сетевой загрузки. Пакет является только исходной версией. Rockchip предоставляет три способа получения. Важно: базовый пакет не содержит полного SDK; обязательно выполните sync с сервером Rockchip для получения полной версии, стабильности и надёжности системы. a. FTP: предоставленные сведения индивидуальны для компании и включают адрес, способ соединения, порт, аккаунт и пароль. Из-за нестабильной скорости FTP и размера Android SDK рекомендуются также следующие два способа. b. Копирование на месте.

<!-- source:en p20 unit:106 -->

Ссылка записи на визит действует 7 дней; после истечения требуется новая заявка. По источнику копирование SDK на месте доступно в Фучжоу, Шэньчжэне и Шанхае; выберите ближайший офис. После «On-site Download Reservation» открывается следующее окно:

<!-- source:en p20 unit:107 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p020-figure-01.png)

<!-- source:en p20 unit:108 -->

Укажите имя, телефон, почту контактного лица, офис Rockchip (Фучжоу, Шэньчжэнь или Шанхай) и время визита. После успешной отправки появится подтверждение:

<!-- source:en p21 unit:109 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p021-figure-01.png)

<!-- source:en p21 unit:110 -->

После успешной записи контактное лицо получает письмо «Rockchip-SDK On-site Download Reservation Information». Пример:

<!-- source:en p22 unit:111 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p022-figure-01.png)

<!-- source:en p23 unit:113 -->

После уведомления прибудьте в выбранное место вовремя, взяв ёмкий внешний диск или иной носитель USB 3.0, совместимый с компьютерами Rockchip. Для нескольких SDK рекомендуется минимум 512 ГБ свободного места, чтобы избежать задержек из-за нехватки ёмкости. Об изменении визита своевременно предупредите контактное лицо, чтобы не нарушать согласование и сроки проекта. c. Доставка диска: по способу «Mailing Hardware Method» отправьте ёмкий внешний диск или носитель с обязательной поддержкой USB 3.0. Для нескольких версий также рекомендуется минимум 512 ГБ свободного места. По описанному процессу после получения посылки Rockchip организует обратную отправку SF Express в течение одного рабочего дня.

<!-- source:en p23 unit:114 -->

### 1.3 Загрузка с последующей серверной синхронизацией

<!-- source:en p23 unit:115 -->

SDK, скопированный на месте или загруженный FTP, — только базовый пакет. Для полной версии обязательно выполните сетевой sync поверх него. Подробная процедура — в Rockchip_Android13_SDK_Developer_Guide_EN.pdf. Общая схема:

<!-- source:en p23 unit:116 -->

#### 1.3.1 Проверка целостности файлов

<!-- source:en p23 unit:117 -->

При FTP-передаче, копировании на месте или доставке диска архивы SDK могут повредиться. После копирования в среду разработки проверьте целостность. Например, для Rockchip_Android13.0_SDK_RELEASE.tar.gz рядом с архивом *.tar.gz предоставляется отдельный файл MD5. Для других SDK контрольные суммы предоставляются аналогично.

<!-- source:en p23 unit:118 -->

```text
xx@ubuntu:~$ md5sum Rockchip_Android13.0_SDK_RELEASE.tar.gz*
cb37437acfdd4d10cbae1809ee37c91d  Rockchip_Android13.0_SDK_RELEASE.tar.gz00
7a446207302810dfe08e386c9018faed  Rockchip_Android13.0_SDK_RELEASE.tar.gz01
68a68fe3127f0a9b8a97727b2fd27106  Rockchip_Android13.0_SDK_RELEASE.tar.gz02
4a6b06b48709eb0357e3aa5b18ba63d4  Rockchip_Android13.0_SDK_RELEASE.tar.gz03
b24083f7c4d36bba730e421d2c0a444b  Rockchip_Android13.0_SDK_RELEASE.tar.gz04
362641e26f93c600f12ea21bd178dac9  Rockchip_Android13.0_SDK_RELEASE.tar.gz05
97d0ab6b7d9d523496544605eaedf6f2  Rockchip_Android13.0_SDK_RELEASE.tar.gz06
d8958db52f86982490b66732e6daf0ea  Rockchip_Android13.0_SDK_RELEASE.tar.gz07
7f65e490ef4541997dd21c559262ca1e  Rockchip_Android13.0_SDK_RELEASE.tar.gz08
942f811b75b58aacb73628a6e3a304a5  Rockchip_Android13.0_SDK_RELEASE.tar.gz09
8f742ea39960725d7f6d8660e6974b48  Rockchip_Android13.0_SDK_RELEASE.tar.gz10
4d4342750dc746dbe5e2b9fc93254eb7  Rockchip_Android13.0_SDK_RELEASE.tar.gz11
0c15e71f234fb242b0b494cf25382672  Rockchip_Android13.0_SDK_RELEASE.tar.gz12
921b93b045f9d1d71f308d8d9df4e3ca  Rockchip_Android13.0_SDK_RELEASE.tar.gz13
22c9261fa4e3700287c525ec25075691  Rockchip_Android13.0_SDK_RELEASE.tar.gz14
```

<!-- source:en p24 unit:119 -->

Сравните результат md5sum с суммой Rockchip. Полное совпадение означает, что архив цел и не повреждён; при различии скопируйте или загрузите его заново.

<!-- source:en p24 unit:120 -->

#### 1.3.2 Обновление SDK

<!-- source:en p24 unit:121 -->

SDK Rockchip официально выпускается после внутренних испытаний и приёмки. Стабильность и зрелость повышаются последующими итерациями, поэтому регулярно синхронизируйтесь с сервером для новых функций и повышения надёжности. Сведения о версии см. в выпускном документе, например Rockchip_Android13_SDK_Developer_Guide_CN.pdf. Способ sync и диагностика — в разделе 5.4.

<!-- source:en p24 unit:122 -->

### 1.4 Получение аппаратной документации

<!-- source:en p24 unit:123 -->

Аппаратная документация Rockchip и SDK KIT предоставляются отдельно. Ниже показана процедура заявки на аппаратные материалы.

<!-- source:en p24 unit:123f -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p024-hardware-flow.png)

<!-- source:en p24 unit:125 -->

Аппаратная документация организована по чиповым платформам; за один раз можно запросить одну или несколько платформ. Она включает эталонные схемы питания, DDR-шаблоны, правила аппаратного проектирования и примеры основных функций. При проектировании соблюдайте: a. Используйте схему управления питанием эталонного дизайна. b. Применяйте соответствующий DDR-шаблон напрямую, без изменений. c. Используйте перечень ключевых компонентов Rockchip, включая DDR, eMMC, Flash, WiFi/BT, Camera. d. Поддерживайте актуальность документации, поскольку она оптимизируется. Если планируется отступление от этих правил, заранее согласуйте его с деловым контактом Rockchip. Иначе техническая команда может не обеспечить стабильную эффективную поддержку, что повлияет на сроки проекта.

<!-- source:en p25 unit:126 -->

Обновления аппаратной документации проверяются на https://redmine.rock-chips.com/projects/fae/documents в списке версий эталонных схем. Если полученная версия старее указанной, запросите новую у ответственного Rockchip для более эффективной разработки.

<!-- source:en p25 unit:127 -->

## 2. Версии SDK

<!-- source:en p25 unit:128 -->

Описаны три официальных канала получения SDK: a. Внутренний сервер Rockchip — требуется стандартная процедура заявки. b. Открытый репозиторий GitHub — общедоступная загрузка без заявки. c. Сообщество Toybrick — SDK отдельных платформ, также без заявки.

<!-- source:en p25 unit:129 -->

### 2.1 Официальные версии SDK

<!-- source:en p25 unit:130 -->

Ниже перечислены поддерживаемые чипами Rockchip версии Android OS/Linux OS, типы изделий и уровень технической поддержки. Примечания: a. Подробности версий: https://redmine.rock-chips.com/documents/54. b. Индекс рекомендации отражает приоритет сопровождения основных SDK на дату источника; учитывайте его при выборе. c. Две версии Android SDK длительного сопровождения для промышленных изделий: RK3399_ANDROID7.1-Industry-SDK_V1.0 и RK3288_ANDROID7.1_TABLET-SDK_V1.00_20170629. d. Android express включает GMS и предназначен пользователям с сертификацией Google и соглашением MADA. При необходимости запросите express; стандартная версия не содержит GMS. e. Суффиксы чипа уточняйте по datasheet: S — малый корпус; M — автомобильное исполнение; J — промышленное; K — расширенный температурный диапазон, например -20°C…85°C или -40°C…85°C, согласно конкретной документации.

<!-- source:en p26 unit:131 -->

-S обозначает пластину SMIC. f. Версии для NAS, NVR, контроллеров отображения, массивов SoC, периферийных вычислительных блоков и PCIe-соединений: RK3588_Rockchip_Linux_SDK-SmartHub, RK3576_Rockchip_Linux_SDK-SmartHub, RK3568_Rockchip_Linux_SDK-SmartHub.

<!-- source:en p27 unit:132 -->

| Чип | Версия SDK (идентификатор источника) | Рекомендация |
| --- | --- | --- |
| RK3588(S/J/M) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(версия express)</code> | <code>*****</code> |
| RK3588(S/J/M) | <code>RK3588_Rockchip_Android15.0(версия express)</code> | <code>*</code> |
| RK3588(S/J/M) | <code>Rockchip_Android14.0(версия express)</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588M_Rockchip_Android14.0_SDK-Car</code> | <code>**</code> |
| RK3588(S/J/M) | <code>RK3588_ANDROID13.0_SDK_RELEASE(версия express)</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588M_Android12_SDK_Release-Car</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_RKTTS_SDK</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_IPC_SDK_202205</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588M_QNX_AAOS12_SDK</code> | <code>**</code> |
| RK3588(S/J/M) | <code>RK3588_LINUX6.1_SDK_RELEASE</code> | <code>*****</code> |
| RK3588(S/J/M) | <code>RK3588_LINUX_EDGE_SDK_202206</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_Rockchip_Linux_SDK-SmartHub</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_LINUX_NVR_SDK_Release_V1.0.0_20220304</code> | <code>*</code> |
| RK3576(S/J/M) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(версия express)</code> | <code>*****</code> |
| RK3576(S/J/M) | <code>Rockchip_Android15.0(версия express)</code> | <code>**</code> |
| RK3576(S/J/M) | <code>Rockchip_Android14.0(версия express)</code> | <code>**</code> |
| RK3576(S/J/M) | <code>RK3576M_Android14.0_SDK-Car</code> | <code>**</code> |
| RK3576(S/J/M) | <code>RK3576M_Android14.0_SDK-Car</code> | <code>**</code> |
| RK3576(S/J/M) | <code>Rockchip_Android14.0_SDK_Release-Media_Streaming</code> | <code>**</code> |
| RK3576(S/J/M) | <code>RK3576_Android11_CloudDesk_SDK</code> | <code>*</code> |
| RK3576(S/J/M) | <code>RK3576_Android9.0_SDK_Release</code> | <code>*</code> |
| RK3576(S/J/M) | <code>RK3576_NVR_SDK</code> | <code>**</code> |
| RK3576(S/J/M) | <code>Rk3576_RKTTS_SDK</code> | <code>*</code> |
| RK3576(S/J/M) | <code>RK3576_LINUX6.1_SDK</code> | <code>*****</code> |
| RK3576(S/J/M) | <code>RK3576_Rockchip_Linux_SDK-SmartHub</code> | <code>**</code> |
| RK3568/6(J/M) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(версия express)</code> | <code>*****</code> |
| RK3568/6(J/M) | <code>Rockchip_Android15.0(версия express)</code> | <code>**</code> |
| RK3568/6(J/M) | <code>Rockchip_Android14.0(версия express)</code> | <code>**</code> |
| RK3568/6(J/M) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(версия express)</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3568(6)_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3568(6)_ANDROID11.0_SDK_RELEASE_V1.0.0_20210106</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3566_ANDROID11.0_EBOOK_SDK_RELEASE_V1.0.0_20210126</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK356X_ANDROID11_CLOUDDESK_SDK_202307</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK356X_AMP_SDK_RELEASE</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK356X_NVR_SDK_V1.4.0_20220611</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3568_RK3566_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3568/6(J/M) | <code>RK3568_Rockchip_Linux_SDK-SmartHub</code> | <code>**</code> |
| RK3568/6(J/M) | <code>RK356X_STANDALONE_SDK_RELEASE_V1.0.0_20210713</code> | <code>*</code> |
| RK3562(J) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(версия express)</code> | <code>*****</code> |
| RK3562(J) | <code>RK3562_Android15.0(версия express)</code> | <code>**</code> |
| RK3562(J) | <code>RK3562_Android14.0(версия express)</code> | <code>**</code> |
| RK3562(J) | <code>RK3562_Rockchip_Android14.0_SDK_Release-Media_Streaming</code> | <code>**</code> |
| RK3562(J) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(версия express)</code> | <code>*</code> |
| RK3562(J) | <code>RK3528_ANDROID9.0-Box_ALPHA_V0.0.1_20221202</code> | <code>*</code> |
| RK3562(J) | <code>RK3562_RKTTS_SDK</code> | <code>*</code> |
| RK3562(J) | <code>RK3562_LINUX5.10_SDK_V1.0.0_20230620</code> | <code>**</code> |
| RK3562(J) | <code>RK3562_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3528(J/A) | <code>RK3528_Rockchip_Android14.0_SDK_Release-Media_Streaming</code> | <code>*****</code> |
| RK3528(J/A) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(версия express)</code> | <code>*</code> |
| RK3528(J/A) | <code>RK3528_ANDROID9.0-Box_ALPHA_V0.0.1_20221202</code> | <code>*</code> |
| RK3528(J/A) | <code>Rockchip_RK3528_Linux_SDK_20230410</code> | <code>*****</code> |
| RK3506(J) | <code>RK3506_Linux6.1_SDK</code> | <code>*****</code> |
| RK3506(J) | <code>RK3506_RT-Thread_SDK_Release</code> | <code>**</code> |
| RK3399(K) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(версия express)</code> | <code>*****</code> |
| RK3399(K) | <code>Rockchip_Android15.0(версия express)</code> | <code>**</code> |
| RK3399(K) | <code>Rockchip_Android14.0(версия express)</code> | <code>**</code> |
| RK3399(K) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(версия express)</code> | <code>**</code> |
| RK3399(K) | <code>RK3399_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_ANDROID11.0_SDK_RELEASE_V1.0.0_20210106</code> | <code>*</code> |
| RK3399(K) | <code>Rockchip_Android10.0_SDK_Release_20191211</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_Android9.0_SDK_V1.0_20190104</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_Android8.1_SDK_V1.00_20180517</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_ANDROID7.1-Industry-SDK_V1.0</code> | <code>***</code> |
| RK3399(K) | <code>RK3399_LINUX6.1_SDK_RELEASE</code> | <code>*****</code> |
| RK3399(K) | <code>RK3399_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3399PRO | <code>RK3399Pro_Android9.0_SDK_V1.00_20190806</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID12.0_SDK_RELEASE</code> | <code>*****</code> |
| RK3328 | <code>RK3328_ANDROID11.0_BOX_SDK_V1.0.1_20201030</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID10.0-BOX_V1.0_20191125</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID9.0-BOX-SDK_V1.0_20181206</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID8.1-BOX-SDK_V1.0_20180319</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID7.1_BOX-SDK_v1.00_20170223</code> | <code>*</code> |
| RK3328 | <code>RK3328_linux_v1.00_20170419</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(версия express)</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>Rockchip_Android15.0_SDK(версия express)</code> | <code>**</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>Rockchip_Android14.0_SDK(версия express)</code> | <code>**</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(версия express)</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID11.0_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID10.0_SDK_20191211</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID9.0_SDK_20180925</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID8.1-TABLET-SDK_V1.0.0_20180505</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>PX30_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>PX30_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>Rockchip_RK3326_Linux6.1</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3358_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3358_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3308(J/M) | <code>RK3308_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3308(J/M) | <code>RK3308_LINUX5.10_SDK_RELEASE</code> | <code>**</code> |
| RK3308(J/M) | <code>RK3308_Linux_PartyBox_SDK</code> | <code>**</code> |
| RK3288(W/K) | <code>RK3288W_ANDROID12.0_SDK_RELEASE</code> | <code>*****</code> |
| RK3288(W/K) | <code>RK3288(W_Version)_ANDROID11.0_SDK_RELEASE</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288_ANDROID10.0_SDK_Release</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288(W-Version)_Android9.0_SDK_V1.0_20190410</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288W_ANDROID8.1_SDK_V1.0_20180508</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288_ANDROID7.1_TABLET-SDK_V1.00_20170629</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288_LINUX5.10_SDK</code> | <code>**</code> |
| RK3229 | <code>RK3229_ANDROID10.0_BOX_SDK_V1.0_20200109</code> | <code>***</code> |
| RK3229 | <code>RK3229_ANDROID9.0_BOX_SDK_V1.0_2019012</code> | <code>*</code> |
| RK3229 | <code>RK3229_ANDROID8.1-BOX-SDK_V1.0_20180423</code> | <code>*</code> |
| RK3229 | <code>RK3229_ANDROID7.1_BOX-SDK_V1.00_20170831</code> | <code>*</code> |
| RK3229 | <code>RK3229_ANDROID6.0-RBOX-SDK_V1.00_20160831</code> | <code>*</code> |
| RK3229 | <code>RK3229_wireless_dongle_v1.00_20161130</code> | <code>**</code> |
| RK182X | <code>RK182X_AI_COPROCESSOR_SDK</code> | <code>*****</code> |
| RK182X | <code>RK182X_RT-THREAD_SDK</code> | <code>*****</code> |
| PX3SE | <code>PX3SE_LINUX_SDK_V0.2</code> | <code>**</code> |
| PX3SE | <code>PX3SE_ANDROID7.1_SDK_V1.00_20170719/td&gt;</code> | <code>**</code> |
| RK3128(H) | <code>RK3128H_ANDROID8.1-BOX-SDK_V1.0_20180601</code> | <code>***</code> |
| RK3128(H) | <code>RK312X_ANDROID7.1-TABLET-SDK_V1.00_20170519</code> | <code>*</code> |
| RK3128(H) | <code>RK3128_ANDROID7.1-BOX-SDK_V1.00_20170823</code> | <code>*</code> |
| RK3128(H) | <code>RK312X_LINUX5.10_SDK_RELEASE_202304</code> | <code>*</code> |
| RK3126(C) | <code>Rockchip_Android10.0_SDK_Release_20191211</code> | <code>****</code> |
| RK3126(C) | <code>RK3126C_ANDROID9.0_SDK_V1.0_20190103</code> | <code>*</code> |
| RK3126(C) | <code>RK3126C_ANDROID8.1-SDK_V1.00_20180105</code> | <code>*</code> |
| RK3126(C) | <code>RK312X_ANDROID7.1-TABLET-SDK_V1.00_20170519</code> | <code>*</code> |
| RK3126(C) | <code>RK312X_LINUX5.10_SDK_RELEASE</code> | <code>**</code> |
| RK3066 | <code>RK3066_ANDROID4.4.2-SDK_V1.00_2014.02.12</code> | <code>*</code> |
| RK3036 | <code>RK3036_wireless_dongle_v1.00_20161130</code> | <code>*</code> |
| RK3036 | <code>RK3036_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK2118(M) | <code>RK2118_RT-Thread_SDK</code> | <code>*****</code> |
| RK2116(M) | <code>RK2116_RT-Thread_SDK</code> | <code>*****</code> |
| RK2108 | <code>RK2108_RT-THEAD_SDK_V1.0.0_20200812</code> | <code>*</code> |
| RK2106 | <code>RK2106_FreeRTOS_BETA_V0.1_20181229</code> | <code>**</code> |
| RV1126B(P) | <code>RV1126B_Linux6.1_SDK</code> | <code>*****</code> |
| RV1126B(P) | <code>RV1126B_Linux_IPC_SDK-IPC, CVR</code> | <code>*****</code> |
| RV(K)1108 | <code>RV1108_LINUX_SDK_V2.1_20190329</code> | <code>*</code> |
| RV(K)1108 | <code>RV1108_CVR_V1.4_20180604</code> | <code>*</code> |
| RV(K)1108 | <code>RV110X_LINUX_IPC_SDK_V1.2_20170607</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1106_RV1103_IPC_LINUX_SDK</code> | <code>*****</code> |
| RV1106/3(B) | <code>RV1106B_RV1103B_LINUX_IPC_SDK</code> | <code>*****</code> |
| RV1106/3(B) | <code>RV1106_RV1103_Linux_CVR_SDK-CVR</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1106_RV1103_SMART_DOOR_LINUX_SDK</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1103_SCANER_LINUX_SDK_V0.0.1_20220915</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1106_RV1103_Linux_Battery_IPC_Doorbell-电池IPC和⻔铃</code> | <code>*</code> |
| RKNanoD | <code>RKNANOD_MP3_SDK_V1.3_20161102</code> | <code>***</code> |
| RKNanoD | <code>RKNANOD_WIRELESS_AUDIO_SDK_V1.6_201611149</code> | <code>*</code> |
| RK628 | <code>RK628(сторонний)</code> | <code>**</code> |
| SOFIA3GR | <code>SOFIA3GR_Android6.0-SDK_20160428</code> | <code>*</code> |
| SOFIA3GR | <code>SoFIA_3G-R_ANDROID5.1-SDK行⻋记录仪</code> | <code>*</code> |
| XMM6321 | <code>XMM6321_Phone_Android4.4-SDK(обновления прекращены)</code> | <code>*</code> |
| XMM6321 | <code>XMM6321_Watch_Android4.4-SDK_20151015(обновления прекращены)</code> | <code>*</code> |

<!-- source:en p32 unit:142 -->

### 2.2 Открытые материалы

<!-- source:en p32 unit:143 -->

Часть подробной документации Rockchip открыта на https://opensource.rock-chips.com/wiki_Main_Page. Перечислены платформы RK3568, RK3399, RK3288, RK3328 и PX30.

<!-- source:en p33 unit:144 -->

### 2.3 Открытое сообщество

<!-- source:en p33 unit:145 -->

Сообщество ToyBrick ориентировано на ИИ и предлагает эффективную, удобную и стабильную среду разработки для быстрого освоения приложений и внедрения промышленных ИИ-продуктов. Поддерживаются RK3588, RK3399PRO, RK1808, RK3568 и другие решения. Доступны способы покупки плат, SDK Android OS/Linux OS, полная аппаратная документация, документы разработки ПО и инструменты. Подробнее: http://t.rock-chips.com/forum.php. Вопросы плат ToyBrick отправляются непосредственно в сообщество https://t.rock-chips.com/forum.php, а не в Redmine https://redmine.rock-chips.com. В особых случаях обратитесь к деловому контакту Rockchip для координации.

<!-- source:en p33 unit:146 -->

### 2.4 Публикация исправлений

<!-- source:en p33 unit:147 -->

Исправления платформы Rockchip: https://redmine.rock-chips.com/projects/rockchip_patch/issues. Решайте о применении конкретного исправления по его содержанию и требованиям проекта.

<!-- source:en p33 unit:148 -->

## 3. Документация и инструменты

<!-- source:en p33 unit:149 -->

Документы и инструменты Rockchip выпускаются синхронно с SDK. Поддерживаются две основные системы — Android OS и Linux OS; пути размещения немного различаются, поэтому сверяйтесь со структурой конкретного SDK.

<!-- source:en p33 unit:150 -->

### 3.1 Android SDK

<!-- source:en p33 unit:151 -->

В Android OS SDK документы находятся в RKDocs корневого каталога SDK, инструменты — в RKTools.

<!-- source:en p34 unit:152 -->

### 3.2 Linux SDK

<!-- source:en p34 unit:153 -->

В Linux OS SDK документы находятся в docs, инструменты — в tools корневого каталога SDK. При каждом обновлении кода документы и инструменты интегрируются в соответствующие версии SDK. Между версиями состав может отличаться, поэтому используйте строго соответствующие текущему SDK инструменты. Несовпадение версий кода и инструментов может приводить к ошибкам прошивки или запуска системы и существенно замедлять разработку.

<!-- source:en p34 unit:158 -->

## 5. Вопросы и ответы

<!-- source:en p34 unit:159 -->

Раздел описывает распространённые проблемы при заявке на SDK Rockchip и его использовании.

<!-- source:en p35 unit:160 -->

### 5.1 Управление SDK

<!-- source:en p35 unit:161 -->

Для каждого базового SDK отдельно запрашивается разрешение синхронизации. Неавторизованные аккаунты не могут обновлять код сервера Rockchip через Repo. Конкретный способ синхронизации см. в выпускной документации базового пакета.

<!-- source:en p35 unit:161cn -->

Дополнение китайского источника: надёжно храните SDK Rockchip и управляйте им. Повторное предоставление материалов не выполняется автоматически; при утрате подайте новую заявку через деловой контакт.

<!-- source:en p35 unit:162 -->

### 5.2 Обновление кода SDK

<!-- source:en p35 unit:163 -->

#### 5.2.1 Синхронизация SDK

<!-- source:en p35 unit:164 -->

Право синхронизации запрашивается отдельно для каждого базового пакета; без него repo не обновит код с сервера Rockchip. Способ синхронизации см. в выпускных документах, предоставленных с пакетом.

<!-- source:en p35 unit:165 -->

#### 5.2.2 Заявки на SDK нескольких платформ

<!-- source:en p35 unit:166 -->

SDK разных чиповых платформ Rockchip запрашиваются отдельно. Например, при наличии доступа к RK3288 и новой потребности в RK3399 обратитесь к деловому контакту для оформления SDK новой платформы. После одобрения техническая команда предоставляет доступ к материалам.

<!-- source:en p35 unit:167 -->

### 5.3 Управление версиями

<!-- source:en p35 unit:168 -->

Rockchip управляет SDK инструментом repo по подходу Google. Не рекомендуется удалять историю repo/git: это усложняет обновления и техническую поддержку. Если по историческим причинам требуется убрать исходную историю и вести разработку в собственном git или svn, используйте следующий подход.

<!-- source:en p35 unit:169 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/en-p035-version-control.png)

<!-- source:en p35 unit:170 -->

Рекомендуются две отдельные среды: промежуточный сервер и сервер повседневной разработки. Промежуточный сервер синхронизируется с Rockchip и переносит изменения на локальный сервер; он также служит эталоном версии при взаимодействии с Rockchip. Сервер разработки можно адаптировать под проект и привычный процесс. Преимущество: технической команде Rockchip проще точно определить версию кода при диагностике.

<!-- source:en p36 unit:171 -->

Также решается проблема серверов разработки, не имеющих прямой синхронизации из-за сетевых ограничений: обновления переносятся через промежуточный сервер и сохраняют согласованность кода.

<!-- source:en p36 unit:172 -->

### 5.4 Обработка ошибок синхронизации SDK

<!-- source:en p36 unit:173 -->

#### 5.4.1 Проверка перед синхронизацией SDK

<!-- source:en p36 unit:174 -->

Перед синхронизацией проверьте среду. a. Файлы SSH: в ~/.ssh/ должны находиться id_rsa (закрытый ключ), id_rsa.pub (открытый ключ), known_hosts (создаётся автоматически при первом SSH-соединении). Проверьте следующей командой:

<!-- source:en p36 unit:175 -->

```text
xx@ubuntu:~$ ls -l ~/.ssh/
-rw------- 1 xx xx  1675 Apr 9 08:40 id_rsa
-rw-r--r-- 1 xx xx 400 Apr 9 08:40 id_rsa.pub
-rw-r--r-- 1 xx xx  2220 Apr 9 08:40 known_hosts
```

<!-- source:en p36 unit:176 -->

b. Ограничение закрытых ключей: источник предполагает не более одного ключа в .ssh. Если нужны несколько, используйте key-chain согласно выпускной документации. c. Права закрытого ключа: id_rsa должен иметь 600. Иначе выполните:

<!-- source:en p36 unit:177 -->

```text
xx@ubuntu:~$ chmod 600  ~/.ssh/id_rsa
```

<!-- source:en p36 unit:178 -->

d. Проверка сети — ping и доступность портов:

<!-- source:en p36 unit:179 -->

```text
`Non-chinese mainland customers`
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8443
Trying 54.151.98.191...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8222
```

<!-- source:en p37 unit:180 -->

```text
Trying 54.151.98.191...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.

`Chinese mainland customers`
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8443
Trying 58.22.7.114...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8222
Trying 58.22.7.114...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.
```

<!-- source:en p37 unit:181 -->

Отсутствие ответа указывает на ограничение порта. Попросите ИТ-службу проверить блокировку сети. e. Соответствие ключей: создайте открытый ключ для сравнения следующей командой:

<!-- source:en p37 unit:182 -->

```text
xx@ubuntu:~$ ssh-keygen -y -f id_rsa > id_rsa.pub.tobecompared
```

<!-- source:en p37 unit:183 -->

Затем сравните id_rsa.pub.tobecompare с id_rsa.pub, игнорируя почту в конце. При несовпадении ключи не образуют пару и должны быть созданы заново. f. Проверка SSH: получите адрес SDK из выпускного документа. Если указан repo init --repo-url https://gerrit.rock-chips.com, проверьте соединение следующей SSH-командой:

<!-- source:en p37 unit:184 -->

```text
xx@ubuntu:~$ ssh -vT Gerrit_account@gerrit.rock-chips.com –p 8222
```

<!-- source:en p37 unit:185 -->

Следующая тестовая команда:

<!-- source:en p37 unit:186 -->

```text
xx@ubuntu:~$ ssh -vT xxx@gerrit.rock-chips.com -p 8222
OpenssH_7.4p1, OpenSSL 1.0.2k-fips 26 Jan 2017
debug1: Reading configuration data /home/gerrit/ .ssh/config
debug1: /home/gerrit/.ssh/config line 11: Applying options for gerrit.rock-chips.com
debug1: Reading configuration data /etc/ssh/ssh_config
debug1 /etc/ssh/ssh_config line 58: Applying options for *
debug1: Connecting to gerrit.rock-chips.com [***] port 8222
debug1: Connection established.
...
debug1: SSH2_MSG_SERVICE_ACCEPT received
debug1: Authentications that can continue: publickey
```

<!-- source:en p38 unit:187 -->

```text
debug1: Next authentication method: publickey
debug1: Trying private key:/home/gerrit.ssh/id_rsa
debug1: Authentication **
succeeded** (publickey).
Authenticated to gerrit.rock-chips.com_([xxxx]:8222).debugi: channel e: new [client-session]
debug1: Entering interactive session.
debug1: pledge: network debugi: Sending environment.
debug1: Sending env LANG = en_us.UTF-8

   ****welcome to Gerrit code Review****

 Hi xxx, you have **successfully connected** over SSH.
 Unfortunately, interactive shells are disabled.
 To clone a hosted Git repository, use:

 git clone ssh: / /xxx@gerrit.rock-chips.com:29418/REPOSITORY_NANE.git

debug1: channel 0: free: client-session, nchannels 1
Connection to gerrit.rock-chips.com closed by remote host.
Transferred: sent 2484,received 1904 bytes, in 50.0 seconds
Bytes per second: sent 49.6,received 38.0
debugl: Exit status_-l
```

<!-- source:en p38 unit:188 -->

При запросе «Are you sure you want to continue connecting (yes/no)?» источник предлагает ввести yes. Сообщение successfully connected означает успешный SSH. При неудаче возможны ошибки среды ПК/сервера или блокировка защитными средствами. Проверьте на другом ПК/сервере либо через мобильную точку доступа. Виртуальные машины с мостовой сетью часто имеют проблемы SSH. g. Проверьте ~/.ssh/config и следующее содержимое:

<!-- source:en p38 unit:189 -->

```text
xx@ubuntu:~$ cat ~/.ssh/config
Host gerrit.rock-chips.com
 HostName gerrit.rock-chips.com
 User **Gerrit account**
 Port 8222
 IdentityFile ~/.ssh/**private key file name**
 PreferredAuthentications publickey
 StrictHostKeyChecking no
 UserKnownHostsFile ~/.ssh/known_hosts
 PubKeyAcceptedKeyTypes +ssh-rsa
```

<!-- source:en p38 unit:190 -->

Если файла нет, создайте его вручную и задайте правильные права.

<!-- source:en p39 unit:191 -->

```text
xx@ubuntu:~$ ls -l  ~/.ssh/config
-rw-r--r-- 1 xx xx 220 Nov 28 18:43 config
```

<!-- source:en p39 unit:192 -->

h. После проверки среды начните синхронизацию по выпускной документации SDK.

<!-- source:en p39 unit:193 -->

#### 5.4.2 Ошибки синхронизации SDK и решения

<!-- source:en p39 unit:194 -->

Ниже перечислены типичные ошибки и решения. a. Ошибка версии Python. Пример журнала:

<!-- source:en p39 unit:195 -->

```text
Traceback (most recent call last):
File "/root/repo/main.py", line 628, in <module>
_Main(sys.argv[1:])
File "/root/repo/main.py", line 602, in _Main
result = run()
File "/root/repo/main.py", line 595, in <lambda>
run = lambda: repo._Run(name, gopts, argv) or 0
File "/root/repo/main.py", line 264, in _Run
result = cmd.Execute(copts, cargs)
File "/root/repo/subcmds/init.py", line 531, in Execute
self._SyncManifest(opt)
File "/root/repo/subcmds/init.py", line 324, in _SyncManifest
clone_filter=opt.clone_filter):
File "/root/repo/project.py", line 1144, in Sync_NetworkHalf
clone_filter=clone_filter, retry_fetches=retry_fetches):
File "/root/repo/project.py", line 2139, in _RemoteFetch
ret = gitcmd.Wait()
File "/root/repo/git_command.py", line 379, in Wait
rc = self._CaptureOutput()
File "/root/repo/git_command.py", line 407, in _CaptureOutput
s.dest.write(buf)
UnicodeEncodeError: 'ascii' codec can't encode characters in position 8-12: ordinal not in
range(128)
Or
Traceback (most recent call last):Start related error
```

<!-- source:en p39 unit:196 -->

Решение: перейдите на рекомендуемую версию Python 3.10.x или новее; при использовании Python 2 —

<!-- source:en p39 unit:197 -->

2.7.11 или новее. Выполните следующие шаги, чтобы избежать проблем версий repo или среды Python.

<!-- source:en p40 unit:198 -->

```text
xx@ubuntu:~$ ./Gerrit_Account (Gerrit Account naming script).x (Make sure authorization
script has been run and the authorization file has been generated according to the
"Authentication and Authorization Mode (Mandatory)" chapter of this document.)
xx@ubuntu:~$ git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo (tag
v2.18)
xx@ubuntu:~$ cd rksdk (Switch to the sdk directory)
xx@ubuntu:~/rksdk$ ../repo/repo sync -c (Call just downloaded repo tool to resynchronize)
```

<!-- source:en p40 unit:199 -->

b. При создании ключа задан пароль. Пример журнала:

<!-- source:en p40 unit:200 -->

```text
Enter passphrase for key '/home/junyikeji/.ssh/id_rsa':
```

<!-- source:en p40 unit:201 -->

Решение: рекомендуется единое управление ключами через keychain; альтернативный вариант источника — сбросить пароль закрытого ключа на пустой:

<!-- source:en p40 unit:202 -->

```text
xx@ubuntu:~$ ssh-keygen -f ~/.ssh/id_rsa –p
```

<!-- source:en p40 unit:203 -->

c. Проблема прав SDK. Пример журнала:

<!-- source:en p40 unit:204 -->

```text
Get ssh://git@ww.rockchip.com,cn:2222/Android s/rk3588-manifests.git
fatal: Could not read from remote repos itory.

please make sure you have the correct access rights
and the repository exists.
```

<!-- source:en p40 unit:205 -->

Решение: проверьте наличие разрешения на соответствующий SDK. d. Ошибка настройки git. Пример журнала:

<!-- source:en p40 unit:206 -->

```text
Please tell me who you are.
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
to set your account's default identity.
```

<!-- source:en p40 unit:207 -->

Решение: настройте глобальные сведения пользователя Git либо создайте .gitconfig:

<!-- source:en p41 unit:208 -->

```text
xx@ubuntu:~$ vi ~/.gitconfig
[color]
•       ui = true
[user]
•       name = xxx(fill in your name)
•       email = yyy(fill in your email)
```

<!-- source:en p41 unit:209 -->

e. Сбой синхронизации отдельного репозитория или повреждение ссылки. Пример журнала:

<!-- source:en p41 unit:210 -->

```text
From ssh://www.rockchip.com.cn/repo/android/RKTools
[new branch] android-5.1 -> rk/android-5.1
[new branch] remotes/rk/rk3288/mid/android-5.1 -> rk/remotes/rk/rk3288/mid/android-5.1
[new branch] rk3036/wireless_dongle/5.1/develop -> rk/rk3036/wireless_dongle/5.1/develop
error: 'refs/remotes/rk/rk312x' exists; cannot create 'refs/remotes/rk/rk312x/mid/android-
5.1'
! [new branch] rk312x/mid/android-5.1 -> rk/rk312x/mid/android-5.1 (unable to update local
ref)
error: unable to resolve reference refs/remotes/rk/rk322x/box/android-5.1: Not a directory
! [new branch] rk322x/box/android-5.1 -> rk/rk322x/box/android-5.1 (unable to update local
ref)
error: 'refs/remotes/rk/rk3288' exists; cannot create 'refs/remotes/rk/rk3288/mid/android-
5.1'
```

<!-- source:en p41 unit:211 -->

Решение источника: удалить каталог ошибочного подрепозитория и синхронизировать заново:

<!-- source:en p41 unit:212 -->

```text
xx@ubuntu:~$ rm -rf RKTools
xx@ubuntu:~$ .repo/repo/repo sync
```

<!-- source:en p41 unit:213 -->

Либо при ошибке checkout удалите соответствующие зеркальные и рабочие репозитории в трёх следующих местах, затем продолжите sync. Такие ошибки часто возникают после ручного прерывания синхронизации и повреждения локальных данных.

<!-- source:en p41 unit:214 -->

```text
xx@ubuntu:~$ rm -rf .repo/project-objects/(sub-repository)
xx@ubuntu:~$ rm -rf .repo/projects/(sub-repository)
xx@ubuntu:~$ rm -rf ./(sub-repository)
```

<!-- source:en p41 unit:215 -->

f. Ошибка locale. Пример журнала:

<!-- source:en p42 unit:216 -->

```text
projects: 50% (235/469) perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
LANGUAGE = (unset),
LC_ALL = (unset),
LC_PAPER = "zh_CN.UTF-8",
LC_ADDRESS = "zh_CN.UTF-8",
LC_MONETARY = "zh_CN.UTF-8",
LC_NUMERIC = "zh_CN.UTF-8",
LC_TELEPHONE = "zh_CN.UTF-8",
LC_IDENTIFICATION = "zh_CN.UTF-8",
LC_MEASUREMENT = "zh_CN.UTF-8",
LC_TIME = "zh_CN.UTF-8",
LC_NAME = "zh_CN.UTF-8",
LANG = "en_US.UTF-8"
are supported and installed on your system.
perl: warning: Falling back to the standard locale ("C").
```

<!-- source:en p42 unit:217 -->

Решение: добавьте следующее в конец .bashrc и загрузите конфигурацию:

<!-- source:en p42 unit:218 -->

```text
xx@ubuntu:~$ vi ~/.bashrc
export LC_ALL=C
```

<!-- source:en p42 unit:219 -->

Сохраните и выполните:

<!-- source:en p42 unit:220 -->

```text
xx@ubuntu:~$ source ~/.bashrc
```

<!-- source:en p42 unit:221 -->

g. GitError: требуется force-sync. Пример журнала:

<!-- source:en p42 unit:222 -->

```text
GitError: --force-sync not enabled; cannot overwrite a local work tree. If you're
comfortable with the possibility of losing the work tree's git metadata, use `repo sync --
force-sync frameworks/native` to proceed.
```

<!-- source:en p42 unit:223 -->

Решение источника: используйте repo v2.18 и повторите синхронизацию.

<!-- source:en p42 unit:224 -->

```text
xx@ubuntu:~$ git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo (Download
the tag v2.18 repo tool under your local home directory)
xx@ubuntu:~$ cd rksdk (Switch to the sdk directory)
xx@ubuntu:~/rksdk$ ../repo/repo sync -c --force-sync(Call just downloaded repo tool to
resynchronize)
```

<!-- source:en p43 unit:225 -->

h. Ошибка выполнения fetch. Пример журнала:

<!-- source:en p43 unit:226 -->

```text
Fetching projects: 99% (477/481) Fetching projectplatform/external/libusb-compat
Fetching project platform/external/libseccomp-helper
error: Cannot fetch android/rk/u-boot
```

<!-- source:en p43 unit:227 -->

Решение: проверьте repo v2.18 и правильность разрешений доступа.

<!-- source:en p43 unit:228 -->

```text
xx@ubuntu:~$ git clone "https://gerrit.rock-chips.com:8443/repo-release/tools/repo"
xx@ubuntu:~$ cd rksdk (Switch to the sdk directory)
xx@ubuntu:~/rksdk$ ../repo/repo sync -c --force-sync(Call just downloaded repo tool to
resynchronize)
```

<!-- source:en p43 unit:229 -->

i. Ошибка при использовании sudo. Пример журнала:

<!-- source:en p43 unit:230 -->

```text
xx@ubuntu:~$ sudo .repo/repo/repo sync -c
xx: Permission dented (publickey).
fatal: could not read from remote repository.
Please make sure you have the correct access rights and the repository exists.
Caborted by user
```

<!-- source:en p43 unit:231 -->

Решение: выполняйте repo от того же пользователя, который запускал авторизацию, без sudo.

<!-- source:en p43 unit:232 -->

```text
xx@ubuntu:~$ .repo/repo/repo sync -c
```

<!-- source:en p43 unit:233 -->

j. Ошибка загрузки HTTPS. Пример журнала:

<!-- source:en p43 unit:234 -->

```text
gnutls_handshake() failed: An unexpected TLS packet was received
Or
gnutls_handshake() failed: Start related error
```

<!-- source:en p43 unit:235 -->

Решение: обновите системные компоненты git, curl и gnutls.

<!-- source:en p44 unit:236 -->

```text
xx@ubuntu:~$ sudo apt-get update
xx@ubuntu:~$ sudo apt upgrade git -y
xx@ubuntu:~$ sudo apt upgrade curl -y
```

<!-- source:en p44 unit:237 -->

Если после обновления и переустановки зависимостей ошибка сохраняется, используйте один из вариантов. Рекомендуется Ubuntu 20 или новее для сборки Android SDK и Linux SDK. Либо загружайте по SSH, как показано ниже:

<!-- source:en p44 unit:238 -->

```text
xx@ubuntu:~$repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b master -m
Android14.xml

update:

xx@ubuntu:~$ repo init --repo-url ssh://username@gerrit.rock-chips.com:8222/repo-
release/tools/repo
-u ssh://username@gerrit.rock-chips.com:8222/Android_U/manifests -b master -m
Android14.xml
```

<!-- source:en p44 unit:239 -->

Неописанные проблемы отправляйте в официальную систему ошибок Rockchip https://redmine.rock-chips.com/. Команда Rockchip поможет с их решением; локальные сетевые причины отказа соединения пользователь устраняет самостоятельно.

{% endraw %}

---
title: "Руководство по тестированию ПО и системы Rockchip Linux"
description: "Руководство по тестированию ПО и системы Rockchip Linux — V2.0.2"
excerpt: "Руководство по тестированию ПО и системы Rockchip Linux"
translation_key: "200-rockchip-linux-software-test"
slug: "200-rockchip-linux-software-test"
lang: "ru"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "system"
products: []
tags: [ArmSoM, Rockchip, Linux, Test, Buildroot]
---

{% raw %}

# Руководство по тестированию ПО и системы Rockchip Linux

Основа — китайский и английский RK-SM-YF-352 V2.0.2 от 2024-05-16; техническая основа — китайский текст. Сохранены все пять глав, команды, параметры и снимки. Это справочник для ArmSoM: проверяйте конкретную плату, SoC, SDK/BSP и периферию. Тесты устройств не выполнялись. Внимание: запись dd перезаписывает разделы, подготовка/обновление SD предусматривает стирание flash, а меню recovery содержит wipe all. Сохраните резервные копии и проверьте цели; не запускайте примеры на устройствах с ценными данными. killall bash завершает также посторонние процессы Bash.

## 1. Функциональные тесты

### 1.1 Buildroot

#### 1.1.1 Видеозапись

Видеозапись:

```text
rkisp_demo --device=/dev/video1 --output=/tmp/isp.yuv --iqfile=/etc/iqfiles/OV5695.xml
```

Воспроизведение: скопируйте файл /tmp/cif.yuv на ПК командой adb pull /tmp/cif.yuv /tmp/cif.yuv и откройте программой просмотра YUV.

#### 1.1.2 Запись звука

Синтаксис: arecord -c каналы -r частота_дискретизации -f формат_отсчётов -d длительность /путь/имя_файла. Каналы ch_tbl="2 4 6 8"; частоты fs_tbl="8000 11025 16000 22050 32000 44100 48000 64000 88200 96000 176400 192000"; форматы bits_tbl="S16_LE S24_LE S32_LE". Источник перечисляет контейнеры «wmv, wav, mp3 и т. д.»; см. примечание о поддержке форматов. Пример ограниченной записи: через 10 секунд автоматически завершить и сохранить.

```text
arecord -c 2 -r 44100 -f S16_LE –d 10 /tmp/record.wav
```

Запись без ограничения времени: Ctrl+C завершает запись с сохранением.

```text
arecord -c 2 -r 44100 -f S16_LE /tmp/record.wav
```

Воспроизведение записанного файла:

```text
aplay /tmp/record.wav
```

#### 1.1.3 Подключение Wi-Fi

Способ 1: скрипт wifi_start.sh. Если он включён в SDK, передайте после имени скрипта SSID и пароль.

```text
wifi_start.sh WiFi-AP password
```

Способ 2: изменить файл конфигурации.

```text
$ vi /data/cfg/wpa_supplicant.conf
ctrl_interface=/var/run/wpa_supplicant #It is not recommended to modify by default!
ap_scan=1
update_config=1 #This configuration enables the hotspots configured by the wpa_cli command to be saved in the
conf file (wpa_cli save_config)
#Encrypted wi-fi
network={
    ssid="WiFi-AP"   # Wi-Fi name
    psk="password"   # Wi-Fi password
    key_mgmt=WPA-PSK # Authentication method
}
#Unencrypted Wi-Fi:
network={
    ssid="WiFi-AP"  # Wi-Fi name
    key_mgmt=NONE   # Authentication method
}

#Let the wpa_supplicant process re-read the above configuration:
wpa_cli -i wlan0 -p /var/run/wpa_supplicant reconfigure
#Initiate connection:
wpa_cli -i wlan0 -p /var/run/wpa_supplicant reconnect
```

Способ 3: инструмент wpa_cli.

```text
#EncryptedWi-Fi:
wpa_cli -i wlan0 -p /var/run/wpa_supplicant remove_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant ap_scan 1
wpa_cli -i wlan0 -p /var/run/wpa_supplicant add_network
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 ssid "WiFi-AP"
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 key_mgmt WPA-PSK
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 psk '"password"'
wpa_cli -i wlan0 -p /var/run/wpa_supplicant select_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant save_config #Save the above configuration to the conf file
#Unencrypted Wi-Fi:
wpa_cli -i wlan0 -p /var/run/wpa_supplicant remove_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant ap_scan 1
wpa_cli -i wlan0 -p /var/run/wpa_supplicant add_network
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 ssid "WiFi-AP"
wpa_cli -i wlan0 -p /var/run/wpa_supplicant set_network 0 key_mgmt NONE
wpa_cli -i wlan0 -p /var/run/wpa_supplicant select_network 0
wpa_cli -i wlan0 -p /var/run/wpa_supplicant save_config
```

Проверка состояния подключения:

```text
wpa_cli -i wlan0 -p /var/run/wpa_supplicant status
```

Подробности: Rockchip_Developer_Guide_Linux_WIFI_BT_CN.pdf.

#### 1.1.4 Воспроизведение звука

```text
aplay /media/usb0/musicdemo.wmv
```

#### 1.1.5 Системное время

```text
date                               #check system time
date --set='2018-12-24 15:17:42'   #Set system time
hwclock --show                     #check hardware time
hwclock --systohc                  #synchronous display of hardware time and system time
```

#### 1.1.6 Часы RTC

Проверьте изменение времени в текущем состоянии и после перезапуска.

```text
cat /sys/class/rtc/rtc0/time
```

#### 1.1.7 Воспроизведение видео

Воспроизведение в одном окне:

```text
gst-play-1.0 /oem/SampleVideo_1280x720_5mb.mp4
```

Воспроизведение в нескольких окнах:

```text
sh /rockchip-test/video/test_gst_multivideo.sh
```

#### 1.1.8 Обновление и загрузка с SD-карты

Вставьте SD-карту в ПК, запустите SD_Firmware_Tool.exe, выберите обновление прошивки/загрузку с SD и файл update.img, затем создайте карту. Источник предписывает перевести устройство в maskrom, стереть flash и выключить питание. Вставьте подготовленную карту и включите устройство: прошивка будет записана автоматически. Стирание уничтожает данные; сначала проверьте плату и резервные копии.

![Руководство по тестированию ПО и системы Rockchip Linux — en 6](/docs/rockchip-linux-software-test/assets/en-p006-figure-01.png)

#### 1.1.9 Поиск файла

```text
find ./ -name ***
```

#### 1.1.10 Просмотр оперативной памяти

```text
cat /proc/meminfo or free –h
```

#### 1.1.11 Использование дискового пространства

```text
df -h
```

### 1.2 Debian

#### 1.2.1 Расположение терминала

Откройте Start → System Tools → LXTerminal.

#### 1.2.2 Подключение Wi-Fi

Введите следующую команду в последовательной консоли:

```text
nmcli r wifi on  #steps 1：turn on Wi-Fi
nmcli dev wifi   #steps 2：scan nearby AP
#steps 3：connect AP
nmcli dev wifi connect "DIR-803" password "839919060" ifname wlan0
nmcli r wifi off #steps 4：turn off Wi-Fi
```

#### 1.2.3 Разное изображение на двух экранах

Командой xrandr определите подключённые дисплеи. Английский пример обнаруживает HDMI-1 и DP-1; китайский — HDMI-1 и DSI-1.

```text
root@linaro-alip:/# xrandr
Screen 0: minimum 320 x 200, current 1920 x 1920, maximum 16384 x 16384
HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis) 0mm x 0mm
   1920x1080     60.00 +  60.00*   50.00    30.00    24.00
   1920x1080i    60.00    50.00    50.00
   1280x1024     60.02
   1280x720      60.00    50.00    50.00
   720x576       50.00    50.00
   720x576i      50.00
   720x480       59.94    59.94
   720x480i      59.94
HDMI-2 disconnected (normal left inverted right x axis y axis)
```

```text
DSI-1 connected 1080x1920+0+0 (normal left inverted right x axis y axis) 0mm x 0mm
   1080x1920     59.90*+
DP-1 disconnected (normal left inverted right x axis y axis)
DP-2 disconnected (normal left inverted right x axis y axis)
```

Команда xrandr задаёт взаимное расположение экранов:

```text
su linaro-c "DISPLAY=:0 xrandr--output HDMI-1--above DSI-1"
```

Вместо --above источник перечисляет right-of, left-of, below, same-as, preferred, off. Учитывайте синтаксис соответствующей опции. Подробности: Rockchip_Developer_Guide_Linux_Graphics_CN.pdf.

#### 1.2.4 Разный звук для двух экранов

Способ 1: в нижнем левом углу откройте Sound&amp;Video → PulseAudio Volume Control; китайский источник уточняет вкладку Playback.

![Руководство по тестированию ПО и системы Rockchip Linux — en 7](/docs/rockchip-linux-software-test/assets/en-p007-figure-01.png)

Способ 2: командой aplay определите звуковую карту и выберите её для воспроизведения.

```text
root@linaro-alip:/# aplay -l
**** List of PLAYBACK Hardware Devices ****
card 0: rockchipdp0 [rockchip,dp0], device 0: rockchip,dp0 spdif-hifi-0 [rockchip,dp0 spdif-hifi-0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 1: rockchipes8388 [rockchip-es8388], device 0: dailink-multicodecs ES8323.7-0011-0 [dailink-multicodecs
ES8323.7-0011-0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 2: rockchiphdmi0 [rockchip-hdmi0], device 0: rockchip-hdmi0 i2s-hifi-0 [rockchip-hdmi0 i2s-hifi-0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0

dp0: aplay-Dplughw:0,0/dev/urandom
es8388: aplay-Dplughw:1,0/dev/urandom
hdmi0: aplay-Dplughw:2,0/dev/urandom
```

Способ 3: откройте песню и перетащите окно с основного экрана на дополнительный; затем аналогично выберите звуковую карту на основном экране. Это обеспечивает раздельный звук. Подробности: Rockchip_Developer_Guide_Linux_Graphics_CN.pdf.

#### 1.2.5 Поворот экрана

Поворот normal/left/right:

```text
vi /etc/X11/xorg.conf.d/20-modesetting.conf
```

Замените normal на left или right; изменение вступит в силу после перезапуска.

## 2. Тестирование производительности

### 2.1 Чтение и запись диска

Сначала проверьте узлы через fdisk -l. В источнике последний раздел mmcblk0p8 (14.6G) используется как доступный для записи userdata для теста eMMC. Это не означает, что последний раздел любой платы пригоден для записи; следующий тест уничтожает его данные.

```text
root@linaro-alip:~# fdisk -l
Disk /dev/mmcblk0: 29.1 GiB, 31268536320 bytes, 61071360 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 1124E418-9008-41F8-9E3D-8D872216C8A1
Device           Start      End  Sectors  Size Type
/dev/mmcblk0p1    16384    24575     8192    4M unknown
/dev/mmcblk0p2    24576    32767     8192    4M unknown
/dev/mmcblk0p3    32768   163839   131072   64M unknown
/dev/mmcblk0p4   163840   425983   262144  128M unknown
/dev/mmcblk0p5   425984   491519    65536   32M unknown
/dev/mmcblk0p6   491520 29851647 29360128   14G unknown
/dev/mmcblk0p7 29851648 30113791   262144  128M unknown
/dev/mmcblk0p8 30507008 61071295 30564288 14.6G unknown
```

#### 2.1.1 Чтение и запись eMMC

Запись:

```text
dd if=/dev/zero of=/dev/mmcblk0p8 bs=1M count=2000 oflag=direct,nonblock
```

Чтение:

```text
dd if=/dev/mmcblk0p8 of=/dev/null bs=1M count=2000 iflag=direct,nonblock
```

#### 2.1.2 Чтение и запись USB-накопителя

Запись:

```text
dd if=/dev/zero of=/dev/sda1 bs=1M count=2000 oflag=direct,nonblock
```

Чтение:

```text
dd if=/dev/sda1 of=/dev/null bs=1M count=2000 iflag=direct,nonblock
```

### 2.2 Режим производительности

```text
echo performance | tee $(find /sys/ -name *governor)
```

### 2.3 Частоты CPU и DDR

```text
cat /sys/kernel/debug/clk/clk_summary |grep -E "cpu|arm|ddr"
```

### 2.4 Оценка производительности glmark2

Buildroot glmark2: тест с отображением на экране.

```text
sh /rockchip-test/gpu/test_fullscreen_glmark2.sh
```

Тест без отображения на экране:

```text
sh /rockchip-test/gpu/test_offscreen_glmark2.sh
```

## 3. Аппаратная стабильность

### 3.1 IO-DOMAINS

Аппаратное напряжение всех доменов питания GPIO должно соответствовать программной конфигурации. До серийного выпуска повторно проверьте напряжения, особенно питание IO Wi-Fi, FLASH и Ethernet. При настройке 1.8 V и реальном питании 3.3 V низковольтные цепи работают с перенапряжением и со временем повреждаются. При настройке 3.3 V и питании 1.8 V работа будет ненормальной. Метод проверки приведён в документации конкретного чипа; для RK3568: Rockchip_RK356X_Introduction_IO_Power_Domains_Configuration_CN.pdf.

### 3.2 Питание

Источник рекомендует эталонную схему питания Rockchip. При изменениях схемы или компонентов, особенно при дискретных источниках вместо рекомендованного PMIC, проверьте все основные линии запуска чипа: VDD_LOGIC, VDD_ARM, VCC_PMU, VCC_DDR и другие. Проверки включают последовательность включения при холодном старте и перезапуске, напряжения и пульсации под высокой нагрузкой.

### 3.3 Сигналы

После разработки схемы источник рекомендует передать её инженерам Rockchip через Redmine для проверки; DDR должен строго соответствовать эталонной схеме. Чипы DDR, EMMC и FLASH следует выбирать из AVL, получаемого через Redmine.

### 3.4 Высокая и низкая температура

Помимо комнатной температуры проведите нагрузочные тесты CPU, DDR, перезапусков и холодного старта при высоких и низких температурах реального рабочего диапазона изделия, чтобы проверить его стабильность.

## 4. Программная стабильность

Раздел описывает базовые инструменты пакета Rockchip test и их применение для проверки программной стабильности изделия.

### 4.1 Базовые инструменты

#### 4.1.1 stressapptest

##### 4.1.1.1 Обзор

stressapptest (Stressful Application Test) создаёт потоки копирования и прямого чтения/записи диска, максимально нагружая память для эффективной проверки. Случайные данные от процессора и IO к памяти имитируют реальные условия и позволяют проверить стабильность аппаратуры. Инструмент применялся Google и доступен по Apache 2.0. Назначения: нагрузочное тестирование, квалификация и отладка аппаратуры, проверка интерфейса памяти и дисков.

##### 4.1.1.2 Применение

Типичная команда запуска:

```text
stressapptest -s 20 -M 256 -m 8 -W    # Test 256MB, running 8 "warm copy" threads. Exit after 20 seconds.
stressapptest --help                  # list the available arguments.
```

Основные параметры:

| Параметр | Значение / по умолчанию |
|---|---|
| `-M mbytes` | Проверяемая RAM в MB; вся доступная память определяется автоматически |
| `-s seconds` | Длительность в секундах; 20 |
| `-m threads` | Потоки копирования памяти; автоматически по числу CPU |
| `-W` | Копирование с большей нагрузкой CPU; false |
| `-n ipaddr` | Сетевой поток к ipaddr; нет |
| `--listen` | Прослушивание и ответы сетевым потокам; 0 |
| `-f filename` | Дисковый поток с временным filename; нет |
| `-F` | Не проверять каждую транзакцию, использовать libc memcpy; false |
| `-l logfile` | Файл журнала; нет |
| `-v level` | Подробность 0–20; по умолчанию 8 |

#### 4.1.2 memtester

##### 4.1.2.1 Обзор

Утилита пользовательского пространства для поиска ошибок подсистемы памяти. Переносима и собирается на 32- и 64-битных Unix-подобных системах, включая проприетарные Unix и Mac OS X. Начиная с версии 4.1.0 разработчики встраиваемых систем могут задавать начальный физический адрес памяти для проверки.

##### 4.1.2.2 Применение

```text
memtester [-p physaddrbase [-d device]] <mem>[B|K|M|G] [loops]
```

Отдельные проверки внутри цикла:

```text
Stuck Address
Random Value
Compare XOR
Compare SUB
Compare MUL
Compare DIV
Compare OR
Compare AND
Sequential Increment
Solid Bits
Block Sequential
Checkerboard
Bit Spread
Bit Flip
Walking Ones
Walking Zeroes
8-bit Writes
16-bit Writes
```

### 4.2 Rockchip Test

Журналы нагрузочных тестов сохраняются в /userdata/rockchip-test; до запуска обеспечьте права чтения и записи каталога. Полный журнал последовательной консоли помогает локализовать ошибки: подключите последовательный порт изделия и включите сохранение всех сообщений на хосте.

#### 4.2.1 Включение конфигурации

Для включения пакета Rockchip-test в Buildroot нужны следующие настройки:

```text
#  - stress test on cpu and memory
BR2_PACKAGE_STRESSAPPTEST=y
#  - memtest used to testing the memory subsystem for faults
BR2_PACKAGE_MEMTESTER=y
#  - audio, reboot, bluetooth, ddr, dvfs, flash, suspend/resume, wifi
BR2_PACKAGE_ROCKCHIP_TEST=y
```

#### 4.2.2 Список тестов

Поддерживаемые нагрузочные тесты:

```text
# bash /rockchip-test/rockchip_test.sh
"******************************************************"
"***                                                ***"
"***          *****************************         ***"
"***          *     ROCKCHIP TEST TOOLS    *         ***"
"***          *  V2.0 updated on 20220928  *         ***"
"***          *****************************         ***"
"***                                                ***"
"*****************************************************"

"*****************************************************"
"ddr test:              1 (ddr stress test)"
"cpu test:              2 (cpu stress test)"
"gpu test:              3 (gpu stress test)"
"npu test:              4 (npu stress test)"
"suspend_resume test:   5 (suspend resume test)"
"reboot test:           6 (auto reboot test)"
"power lost test:       7 (power lost test)"
"flash stress test:     8 (flash stress test)"
"recovery test:         9 (recovery wipe all test)"
"audio test:           10 (audio test)"
"camera test:          11 (camera test)"
"video test:           12 (video test)"
"bluetooth test:       13 (bluetooth on off test)"
"wifi test:            14 (wifi on off test)"
"chromium test:        15 (chromium with video test)"
"*****************************************************"
```

#### 4.2.3 Масштаб проверки

Для каждого теста рекомендуется не менее 10 устройств × 24 часа; масштаб корректируется по требованиям проекта к стабильности.

#### 4.2.4 Методы запуска

Ниже показан запуск отдельных тестов на примере memtester из DDR-нагрузки. Можно использовать меню rockchip_test или непосредственно соответствующий скрипт.

##### 4.2.4.1 Rockchip Test

```text
bash rockchip-test/rockchip_test.sh
```

Введите 1 — номер DDR Test в списке нагрузочных тестов.

```text
"*****************************************************"
"***                                               ***"
"***            DDR TEST                           ***"
"***                                               ***"
"*****************************************************"
"*****************************************************"
"memtester:                                      1"
"stressapptest:                                  2"
"stressapptest + memtester:                      3"
"ddr auto scaling:                               4"
"stressapptest + memtester + ddr auto scaling:   5"
"*****************************************************"
```

Затем введите 1 для memtester, чтобы запустить тест.

##### 4.2.4.2 Прямой запуск

```text
bash /rockchip-test/ddr/memtester_test.sh
```

#### 4.2.5 Подробности тестов

##### 4.2.5.1 Тестирование DDR

Нагрузка DDR поддерживает пять сценариев:

```text
"memtester:                                      1"
"stressapptest:                                  2"
"stressapptest + memtester:                      3"
"DDR auto scaling:                               4"
"stressapptest + memtester + DDR auto scaling:   5"
```

Без изменения частоты выберите 3: stressapptest + memtester. При поддержке изменения частоты выберите 5: stressapptest + memtester + автоматическое изменение частоты DDR. Входной скрипт — ddr_test.sh, с ним работают три скрипта ниже. В обоих источниках этот абзац ошибочно называет нагрузку CPU; по контексту речь о DDR.

```text
/rockchip-test/ddr/ddr_freq_scaling.sh
/rockchip-test/ddr/memtester_test.sh
/rockchip-test/ddr/stressapptest_test.sh
```

###### 4.2.5.1.1 Изменение частоты DDR

Без аргументов скрипт автоматически меняет частоту.

```text
bash /rockchip-test/ddr/ddr_freq_scaling.sh
cnt: 0, ddr freq: success change to 528000000 Hz
..
cnt:100, ddr freq: success change to 324000000 Hz
```

При передаче поддерживаемой частоты скрипт переключается на неё.

```text
bash /rockchip-test/ddr/ddr_freq_scaling.sh 528000000
ddr freq: success change to 528000000 Hz
```

Если частота не поддерживается, скрипт выводит доступные частоты и текущую.

```text
bash /rockchip-test/ddr/ddr_freq_scaling.sh 1
ddr freq: 1 is not in available frequencies: 324000000 528000000
ddr freq: now 528000000 Hz
```

Остановить тест:

```text
killall bash
```

###### 4.2.5.1.2 stressapptest_test

По умолчанию скрипт stressapptest использует половину доступной памяти и останавливается через 24 часа. Остановить тест:

```text
killall stressapptest
```

###### 4.2.5.1.3 memtester_test

По умолчанию memtester использует половину доступной памяти. Остановить тест:

```text
killall memtester
```

Внимание: memtester не прекращает работу автоматически при ошибке; необходимо наблюдать за его журналом.

##### 4.2.5.2 Тестирование CPU

Нагрузка CPU поддерживает три сценария:

```text
"stressapptest test:                               1"
"cpu auto scaling:                                 2"
"stressapptest + cpu auto scaling:                 3"
```

Без изменения частоты выберите 2 — stressapptest. С изменением частоты выберите 3 — stressapptest и автоматическое изменение частоты CPU. Тест состоит из входного скрипта cpu_test.sh и cpu_freq_scaling.sh.

###### 4.2.5.2.1 Изменение частоты CPU

Без аргументов скрипт автоматически меняет частоту.

```text
bash /rockchip-test/cpu/cpu_freq_scaling.sh
cnt: 0, cpu freq policy:0 success change to 816000 KHz
...
cnt: 100, cpu freq policy:0 success change to 1104000 KHz
```

При передаче поддерживаемой частоты выполняется переключение на неё.

```text
bash /rockchip-test/cpu/cpu_freq_scaling.sh 1104000
cpu freq policy:0 success change to 1104000 KHz
```

При неподдерживаемой частоте выводятся доступные частоты и текущая.

```text
bash /rockchip-test/cpu/cpu_freq_scaling.sh 1
cpu freq: 1 is not in available frequencies: 600000 816000 1008000 1104000 1416000
cpu freq: now 1104000 Hz
```

Остановить тест:

```text
killall bash
```

##### 4.2.5.3 Тестирование flash

Создать 7 случайных файлов данных размером до 5 MB в $test_dir/src_test_data, скопировать их в пять подкаталогов $test_dir/des_test_data и сравнить MD5. Повторить 200 раз.

##### 4.2.5.4 Ожидание и пробуждение

Для автоматического ожидания/пробуждения необходим исправный RTC. По умолчанию тест завершается после 10 000 циклов; интервал до пробуждения случайный, от 3 до 6 секунд.

##### 4.2.5.5 Тест перезапуска

По умолчанию тест завершается после 10 000 перезапусков. Через 8 секунд после каждого запуска система автоматически выключается. Досрочная остановка:

```text
echo off > /userdata/rockchip_test/reboot_cnt
```

При включённом CONFIG_PSTORE_RAM после каждого запуска скрипт проверяет журнал предыдущего выключения на сбои и другие аномалии; при обнаружении тест останавливается.

##### 4.2.5.6 Тестирование GPU

Нагрузочный тест GPU основан на glmark-es2 и скрипте test_stress_glmark2.sh, запускающем glmark-es2 с run-forever. glmark-es2 — тест OpenGL ES 2.0, использующий только совместимое с OpenGL ES 2.0 подмножество API OpenGL 2.0.

##### 4.2.5.7 Тестирование камеры

Доступны два способа нагрузочного тестирования камеры:

1. camera_stresstest_rkisp_demo.sh. В Buildroot должны быть включены следующие настройки:

```text
BR2_PACKAGE_CAMERA_ENGINE_RKAIQ_RKISP_DEMO=y
```

rkisp_demo не требует настройки ISP-конвейера через media-ctl. USB-камеры этим способом не тестируются. Циклически захватываются по 100 кадров с интерфейсов ISP и CIF без проверки размера файла.

2. camera_stresstest_v4l2.sh. В Buildroot должны быть включены следующие настройки:

```text
BR2_PACKAGE_LIBV4L_UTILS=y
```

Для v4l2-ctl может понадобиться настройка ISP-конвейера через media-ctl. Этот способ охватывает USB-камеры. Циклически захватываются по 5 кадров 640x480 с USB, ISP и CIF с проверкой размера файла. Выберите способ согласно реальному применению.

##### 4.2.5.8 Тестирование видео

Видео непрерывно воспроизводятся из /mnt/udisk/videos или /userdata/videos. До теста поместите нужные файлы в один из каталогов; первым проверяется /userdata/videos. Если оба каталога отсутствуют, выводится сообщение и тест завершается.

##### 4.2.5.9 Тестирование Wi-Fi и BT

Wi-Fi и BT автоматически включаются и выключаются.

### 4.3 Пользовательские сценарии

В дополнение к отдельным функциональным тестам можно моделировать реальное использование продукта для нагрузочной проверки стабильности. Например, типичный сценарий ручки-переводчика:

Включить → сканировать и распознать → воспроизвести перевод → оставить до второго уровня ожидания → пробудить и использовать снова; возможны случайные переключения Wi-Fi/BT.

Команды базовых скриптов позволяют построить этот реальный сценарий:

Включить → цикл (захват v4l2 → воспроизведение aplay → pm-suspend → пробуждение RTC); во время бодрствования случайно переключать Wi-Fi/BT.

## 5. Планируемые дополнения

### 5.1 Добавить методы анализа распространённых проблем

### 5.2 Добавить тесты NPU, recovery, звука, браузера и отключения питания

## Различия источников, ошибки и ограничения

- Оба источника — V2.0.2: китайский 20 страниц, английский 14. Только английский содержит поиск файла 1.1.9; последующие номера памяти/диска сдвинуты на один. Заголовок df -h ошибочно говорит о памяти; китайский правильно указывает дисковое пространство.
- Две последовательности сценария на английской странице 14 выходят за границы и отсутствуют в извлечённом тексте. Они восстановлены по китайской странице 20 как обычный текст. Глава 5 — планы источника, а не готовые инструкции NPU, recovery, звука, браузера и отключения питания.
- Запись создаёт /tmp/isp.yuv, а чтение использует /tmp/cif.yuv: согласуйте имена. Печатные –d в arecord и –h в free заменяются ASCII -d и -h; “or” не оператор shell. Список wmv/mp3 и aplay musicdemo.wmv — примеры, не гарантия поддержки форматов.
- Китайский текст и вывод xrandr указывают HDMI-1 и DSI-1; английский ошибочно пишет DP-1. В английских xrandr и aplay-Dplughw отсутствуют пробелы. Китайские примеры: su linaro -c "DISPLAY=:0 xrandr --output HDMI-1 --above DSI-1" и aplay -Dplughw:0,0 /dev/urandom (номер карты может быть 1 или 2). --preferred/--off не являются опциями взаимного расположения и не заменяются механически.
- Раздел DDR ошибочно назван нагрузкой CPU. Меню CPU: 1=stressapptest, 2=cpu auto scaling, 3=комбинация, но оба текста рекомендуют 2 без изменения частоты. Сверяйте реальное меню. Примеры CPU обычно используют KHz, последняя строка неверной частоты — Hz; DDR использует Hz. Единицы не взаимозаменяемы.
- -W и -F stressapptest по умолчанию false; китайский ошибочно переводит это как «неправильно». Таблица уточняет отключённое состояние. Каталог журналов /userdata/rockchip-test и /userdata/rockchip_test/reboot_cnt различаются дефисом/подчёркиванием: проверяйте скрипты. Комментарии кода, диагностика, SSID и пароли сохранены как примеры, без выполнения или использования.

{% endraw %}

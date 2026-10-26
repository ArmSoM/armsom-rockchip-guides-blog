---

title: "Rockchip RMSL Linux: потоки глубины, API, декодирование и вывод"

description: "Rockchip RMSL Linux: потоки глубины, API, декодирование и вывод · V1.0.1"

excerpt: "Rockchip RMSL Linux: потоки глубины, API, декодирование и вывод"

translation_key: 184-rockchip-linux-rmsl

slug: 184-rockchip-linux-rmsl

lang: ru

date: "2026-10-24"

category: camera

tags: [ArmSoM, Rockchip, RMSL, Camera, Linux]

---



{% raw %}



Справка платформы: V1.0.1 производителя (RK-KF-YF-355) описывает RMSL и API Linux SDK. Камера структурированного света 3D содержит проектор 30 тысяч точек, RGB-камеру 5 Мп, ИК-камеру 1 Мп с глобальным затвором и ИК-подсветку; применения — платежи, контроль доступа, распознавание жестов/тела и точное 3D-моделирование. Конкретные платы ArmSoM, ядра и BSP не проверены; проверьте питание USB, библиотеки и узлы. Производительность взята из оригинала, не измерена ArmSoM; команды не выполнялись. ZH использует китайские рисунки, EN/RU/DE — английские.



[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)



<!-- en PDF p.4; unit 0 -->

## 1. Интерфейс модуля RMSL

<!-- en PDF p.4; unit 1 -->

### 1.1 Обзор

<!-- en PDF p.4; unit 2 -->

Модуль Rockchip RMSL — USB-устройство plug-and-play с тремя одновременными выходами: Depth, RGB и IR. Depth выдаёт YUYV, RGB и IR — MJPG.

<!-- en PDF p.4; unit 3 -->

| Видео | Макс.<br>разрешение | Формат | Частота<br>кадров | Описание |
| --- | --- | --- | --- | --- |
| Depth | 640x480 | YUYV | 15fps | Карта диспаратности; алгоритм преобразует её в карту глубины или облако точек |
| RGB | 1920x1080 | MJPG | 30fps | RGB-изображение с декодированием в NV12 |
| IR | 640x480 | MJPG | 15fps | ИК-изображение с декодированием в NV12 |

<!-- en PDF p.4; unit 4 -->

### 1.2 Модель RMSL

<!-- en PDF p.4; unit 5 -->

Модель RK RMSL определяется по серийному номеру SN. Поддерживаемые на момент документа модули структурированного света перечислены ниже.

<!-- en PDF p.4; unit 6 -->

| Модель | Соответствующий SN | Интерфейс |
| --- | --- | --- |
| RMSL201-1301 | R2011301xxxxxxxxx | USB |

<!-- en PDF p.4; unit 7 -->

### 1.3 Настройка Buildroot

<!-- en PDF p.4; unit 8 -->

В Buildroot Linux SDK интерфейсы разработки и примеры расположены в app/demo/rmsl. По умолчанию программа не собирается. Включите BR2_PACKAGE_APP_DEMO_RMSL и зависимости: BR2_PACKAGE_CAMERA_ENGINE_RKISP для получения потока V4L2; BR2_PACKAGE_MPP для декодирования MJPG; BR2_PACKAGE_LINUX_RGA для обработки YUV перед выводом; BR2_PACKAGE_LIBDRM для вывода на экран (необязательно). Если параметра или исходников rmsl demo нет, обновите SDK либо получите их из указанного в оригинале репозитория GitHub.

<!-- en PDF p.5; unit 9 -->

external/camera_engine_rkisp/ требуется обновить до 86dc5bf1 apps: rkisp_api: add usb camera supports. Если SDK не обновлён, код доступен в репозитории GitHub.

<!-- en PDF p.5; unit 10 -->

### 1.4 Сборка и запуск

<!-- en PDF p.5; unit 11 -->

В каталоге SDK выполните следующую команду сборки модуля:

<!-- en PDF p.5; unit 12 -->

```text
# make app_demo
```

<!-- en PDF p.5; unit 13 -->

Для повторной сборки используйте:

<!-- en PDF p.5; unit 14 -->

```text
# make app_demo-dirclean
# make app_demo
```

<!-- en PDF p.5; unit 15 -->

После сборки создаются два исполняемых файла: rmsl_linux_demo и rmsl_tool.

<!-- en PDF p.5; unit 16 -->

```text
# ls -1 /usr/bin/rmsl*
/usr/bin/rmsl_linux_demo
/usr/bin/rmsl_tool
```

<!-- en PDF p.5; unit 17 -->

Из-за большого числа зависимостей рекомендуется полная чистая сборка Buildroot после настройки по §1.3. Подключите RMSL и получите сведения об устройстве через rmsl_tool. Запрос узлов устройства:

<!-- en PDF p.5; unit 18 -->

```text
# rmsl_tool --list_devices
Device /dev/video6 info:
      usb interface: UVC DEPTH
        driver name: uvcvideo
          card type: RV1108
           bus_info: usb-ff340000.usb-1
Device /dev/video8 info:
      usb interface: UVC RGB
        driver name: uvcvideo
          card type: RV1108
           bus_info: usb-ff340000.usb-1
Device /dev/video10 info:
      usb interface: UVC IR
        driver name: uvcvideo
          card type: RV1108
           bus_info: usb-ff340000.usb-1
```

<!-- en PDF p.5; unit 19 -->

В примере три узла /dev/video6, /dev/video8, /dev/video10 соответствуют DEPTH, RGB и IR. Также выводятся USB-узел, сведения о драйвере и прочие данные. Запрос SN и версии ПО RMSL:

<!-- en PDF p.6; unit 20 -->

```text
# rmsl_tool --get_sn --get_version --device /dev/video6
SN: R2011301200801448
Version: 2.2.0
```

<!-- en PDF p.6; unit 21 -->

Перед получением потока инициализируйте устройство:

<!-- en PDF p.6; unit 22 -->

```text
# rmsl_tool --init --device /dev/video6
```

<!-- en PDF p.6; unit 23 -->

После завершения потока выполните деинициализацию:

<!-- en PDF p.6; unit 24 -->

```text
# rmsl_tool --deinit --device /dev/video6
```

<!-- en PDF p.6; unit 25 -->

После завершения потока можно также сбросить устройство:

<!-- en PDF p.6; unit 26 -->

```text
# rmsl_tool --reset --device /dev/video6
```

<!-- en PDF p.6; unit 27 -->

После инициализации RMSL поток доступен стандартным инструментам, например v4l2-ctl и vlc; соблюдайте формат и размер потока. rmsl_linux_demo показывает полный цикл: инициализация, захват, декодирование, деинициализация и вывод. Пример сам инициализирует RMSL, поэтому предварительно вызывать rmsl_tool не требуется. Справка rmsl_linux_demo:

<!-- en PDF p.6; unit 28 -->

```text
# rmsl_linux_demo --help
Usage of rmsl_linux_demo:
To display and/or save decode frames to files:
 --screen-width,   screen width,  required if need display
 --screen-height,  screen height, required if need display
 --no-display,     disable display, by default it's enabled
 --save-ir-to,     path to save IR    decoded frames in NV12
 --save-depth-to,  path to save DEPTH decoded frames with bpp = 16
 --save-rgb-to,    path to save RGB   decoded frames in NV12
```

<!-- en PDF p.6; unit 29 -->

rmsl_linux_demo получает поток, сохраняет его в файл и отображает на экране. Вывод включён по умолчанию; параметр --no-display отключает его. Вывод изображения на экран:

<!-- en PDF p.6; unit 30 -->

```text
# rmsl_linux_demo --screen-width 1536 --screen-height 2048

UVC DEPTH: /dev/video5: draw in (0, 480)[640 x 480]
UVC RGB: /dev/video7: draw in (320, 0)[640 x 480]
UVC IR: /dev/video9: draw in (640, 480)[640 x 480]
```

<!-- en PDF p.7; unit 31 -->

![RMSL · en PDF p.7](/docs/rockchip-linux-rmsl/assets/en-p007-figure-01.png)

<!-- en PDF p.7; unit 32 -->

На экране RK3288 (1536x2048) сверху вниз и слева направо показаны RGB, DEPTH, IR. Все изображения имеют размер 640x480. Для Depth карта диспаратности непосредственно показывается как RGB565. Следующий пример отключает вывод и сохраняет декодированные кадры:

<!-- en PDF p.7; unit 33 -->

```text
# rmsl_linux_demo --no-display \
                  --save-ir-to    /tmp/ir.bin  \
                  --save-rgb-to   /tmp/rgb.bin \
                  --save-depth-to /tmp/depth.bin
```

<!-- en PDF p.7; unit 34 -->

В этом примере вывод отключён, три потока сохраняются: ir.bin — кадры NV12 640x480; rgb.bin — NV12 640x480; depth.bin — данные глубины 640x480, 2 байта на пиксель. По умолчанию три потока имеют размер 640×480, но RGB-камера поддерживает 1080p. На ПК файлы можно просматривать YUVPlayer (Windows) или mplayer (Linux). Примеры команд mplayer:

<!-- en PDF p.7; unit 35 -->

```text
# mplayer /tmp/ir.bin -loop 0 -demuxer rawvideo -fps 15 \
    -rawvideo w=640:h=480:size=$((640*480*3/2)):format=nv12

# mplayer /tmp/rgb.bin -loop 0 -demuxer rawvideo -fps 15 \
    -rawvideo w=640:h=480:size=$((640*480*3/2)):format=nv12

# mplayer /tmp/depth.bin -loop 0 -demuxer rawvideo -fps 15 \
    -rawvideo w=640:h=480:size=$((640*480*2)):format=rgb16
```

<!-- en PDF p.8; unit 36 -->

## 2. Исходный код примера

<!-- en PDF p.8; unit 37 -->

Каталог app/demo/rmsl/ содержит настройки RMSL, интерфейсы запросов, захват, декодирование и вывод.

<!-- en PDF p.8; unit 38 -->

```text
# tree app/demo/rmsl/
app/demo/rmsl/
├── CMakeLists.txt
├── main.c              # main of rmsl_linux_demo
├── rkdrm_display.c     # use DRM to display directly on Overlay Plane of
Rockchip devices
├── rkdrm_display.h
├── rmsl_api.h          # RMSL API Definition
├── rmsl_ctrl.c         # Implementation of rmsl control, query and other
routines
├── rmsl_depth.c        # Implementation of depth image conversion
├── rmsl_tool.c         # The rmsl_tool source code
├── vpu_decode.c        # vpu jpeg hardware decoding interface
└── vpu_decode.h
```

<!-- en PDF p.8; unit 39 -->

### 2.1 Интерфейс управления RMSL

<!-- en PDF p.8; unit 40 -->

Получение версии:

<!-- en PDF p.8; unit 41 -->

```text
int rmsl_get_version(int fd, char *ver, int size);
```

<!-- en PDF p.8; unit 42 -->

Параметры: fd — дескриптор узла /dev/video; ver — возвращаемая версия; size — размер массива ver, не меньше RMSL_DATA_SIZE_QUERY. Возвращается 0 при успехе, код ошибки при сбое. Получение серийного номера:

<!-- en PDF p.8; unit 43 -->

```text
int rmsl_get_sn(int fd, char *sn, int size);
```

<!-- en PDF p.8; unit 44 -->

Параметры: fd — дескриптор /dev/video; sn — возвращаемый серийный номер; size — размер массива sn, не меньше RMSL_DATA_SIZE_QUERY. Возвращается 0 при успехе, код ошибки при сбое. Инициализация и деинициализация:

<!-- en PDF p.8; unit 45 -->

```text
int rmsl_init_device(int fd);
int rmsl_deinit_device(int fd);
```

<!-- en PDF p.8; unit 46 -->

Инициализация/деинициализация управляет выдачей данных видеоузлом.

<!-- en PDF p.9; unit 47 -->

Параметр fd — дескриптор видеоузла. Возвращается 0 при успехе, код ошибки при сбое. Сброс устройства:

<!-- en PDF p.9; unit 48 -->

```text
int rmsl_reset_device(int fd);
```

<!-- en PDF p.9; unit 49 -->

Параметр fd — дескриптор видеоузла. Возвращается 0 при успехе, код ошибки при сбое. Переход в режим suspend:

<!-- en PDF p.9; unit 50 -->

```text
int rmsl_suspend_device(int fd);
```

<!-- en PDF p.9; unit 51 -->

Параметр fd — дескриптор видеоузла. Возвращается 0 при успехе, код ошибки при сбое. Получение путей видеоустройств:

<!-- en PDF p.9; unit 52 -->

```text
int rmsl_get_devices(char *dev_depth, char *dev_ir, char *dev_rgb, int silent);
```

<!-- en PDF p.9; unit 53 -->

Получает пути трёх видеоузлов, например /dev/video6 и /dev/video8. dev_depth возвращает путь Depth, dev_ir — IR, dev_rgb — RGB. silent=1 отключает журнал, 0 выводит сообщения. Возвращается 0 при успехе, код ошибки при сбое. Преобразование Depth в облако точек и карту глубины:

<!-- en PDF p.9; unit 54 -->

```text
int rmsl_get_point_cloud_depth(const uint16_t *pIn, struct rmsl_pc *pc_out,
                               uint16_t *depth_out, int width, int height);
```

<!-- en PDF p.9; unit 55 -->

По карте диспаратности вычисляются облако точек и карта глубины. pIn — кадр диспаратности от Depth, 16 бит на пиксель; pc_out — облако точек, NULL отключает его вычисление; depth_out — карта глубины, NULL отключает её вычисление; width и height — ширина и высота. Возвращаемое значение 0 означает успешное вычисление.

<!-- en PDF p.10; unit 56 -->

Отрицательное значение означает ошибку. Английский оригинал пишет «A positive 0» для случая, когда исходный кадр уже является картой глубины и вычисление не требуется (такого случая пока нет); китайский текст указывает значение больше 0. Это расхождение оригиналов, а не новый код возврата.

<!-- en PDF p.10; unit 57 -->

### 2.2 Получение потока

<!-- en PDF p.10; unit 58 -->

rmsl_linux_demo получает поток через rkisp_api.so. В отличие от обычной USB-камеры нужна дополнительная инициализация. Подробности интерфейса rkisp_api.so см. в Rockchip_Developer_Guide_Linux_Camera_EN.pdf.

<!-- en PDF p.10; unit 59 -->

### 2.3 Декодирование

<!-- en PDF p.10; unit 60 -->

Пример декодирует MJPG библиотекой Rockchip MPP: поток rkisp_api передаётся MPP. Затем RGA может масштабировать/копировать декодированный буфер для вывода, поэтому буфер декодирования выделяется через RGA. Исходный код:

<!-- en PDF p.10; unit 61 -->

```text
ret = vpu_decode_jpeg_init(&ctx->decoder, ctx->width, ctx->height);
while (has new frame)
    vpu_decode_jpeg_doing(&ctx->decoder, ctx->cur_frame->buf,
            ctx->cur_frame->size, ctx->rga_bo_fd, ctx->rga_bo.ptr);
vpu_decode_jpeg_done(&ctx->decoder);
```

<!-- en PDF p.10; unit 62 -->

decoder — дескриптор декодера VPU; rga_bo_fd — дескриптор буфера RGA; rga_bo.ptr — его виртуальный адрес.

<!-- en PDF p.10; unit 63 -->

### 2.4 Отображение

<!-- en PDF p.10; unit 64 -->

Для эффективной обработки с учётом возможностей разных SoC rmsl_linux_demo напрямую использует libdrm. RGA копирует три изображения по заданным смещениям целевого буфера, затем передаёт его в overlay-плоскость Rockchip VOP. Схема ниже.

<!-- en PDF p.11; unit 65 -->

Кадр MJPG RGB-камеры; кадр MJPG IR-камеры.

![RMSL · en PDF p.11](/docs/rockchip-linux-rmsl/assets/en-p011-vector-01.png)

<!-- en PDF p.11; unit 66 -->

Оба кадра декодируются MPP.

<!-- en PDF p.11; unit 67 -->

Кадр Depth-камеры; кадр RGB NV12; кадр IR NV12.

<!-- en PDF p.11; unit 68 -->

Для Depth: алгоритмическое вычисление или копирование RGA. Для RGB и IR: преобразование RGA в RGB565 и копирование.

<!-- en PDF p.11; unit 69 -->

Ветви алгоритма дают карту глубины и облако точек. Три изображения объединяются в буфер вывода.

<!-- en PDF p.11; unit 70 -->

Вывод через overlay-слой VOP.

<!-- en PDF p.11; unit 71 -->

Предполагается доступность только одного overlay-слоя, например на px30/rk3326. RGA копирует изображения по разным смещениям одного буфера. Карту диспаратности показывают как RGB565 только для демонстрации: оба формата имеют 16 бит на пиксель, поэтому контуры хорошо различимы. Дополнительное преобразование/копирование RGA ускоряется аппаратно. На px30, rk3288 и rk3399 пример показывает 15fps; максимум ограничен 15fps камер IR и Depth. Возможные улучшения: при нескольких overlay-плоскостях показывать NV12 непосредственно в отдельных плоскостях. Всего нужны три: RGB NV12, IR NV12 и Depth. Это позволяет пропустить преобразование/копирование RGA; RGB может достичь 30fps. Многопоточность улучшает параллелизм, особенно при обработке облака точек с вычислениями с плавающей точкой.

<!-- en PDF p.11; unit 72 -->

#### 2.4.1 Интеграция с QT

<!-- en PDF p.11; unit 73 -->

Если QT рисует меню, кнопки и другой UI, зарезервируйте область главного окна для video overlay. Видео всегда находится над UI: если всплывающий диалог или меню пересекается с видео, временно скрывайте overlay-плоскость. Это лишь вариант архитектуры; проектируйте приложение по своим требованиям.

<!-- en PDF p.11; unit 74 -->

## 3. Частые вопросы

<!-- en PDF p.12; unit 75 -->

### 3.1 Отключение устройства после открытия камеры

<!-- en PDF p.12; unit 76 -->

Причина в недостаточном питании. Подключите устройство через USB-концентратор с внешним питанием.

## Различия оригиналов

Противоречие «A positive 0» и китайского «больше 0» отмечено выше; проверяйте реальную библиотеку. Отличающиеся примеры другого оригинала ниже независимы, не объединяйте их в сценарий.

**CN PDF p.8 · 37**

```text
# tree app/demo/rmsl/
app/demo/rmsl/
├── CMakeLists.txt
├── main.c              # rmsl_linux_demo的主程序
├── rkdrm_display.c     # ⽤于overlay直接显⽰
├── rkdrm_display.h
├── rmsl_api.h          # rmsl 主要接⼝定义
├── rmsl_ctrl.c         # rmsl 控制、查询等⽅法的实现
├── rmsl_depth.c        # 深度图转换的实现
├── rmsl_tool.c         # rmsl_tool的主程序
├── vpu_decode.c        # vpu jpeg硬件解码接⼝
└── vpu_decode.h
```

{% endraw %}

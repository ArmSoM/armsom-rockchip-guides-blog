---

title: "Полный справочник API Rockchip PCIe EP: Linux RC, Windows ioctl и EP"

description: "Полный справочник API Rockchip PCIe EP: Linux RC, Windows ioctl и EP — V3.3.0."

excerpt: "Полный справочник API Rockchip PCIe EP: Linux RC, Windows ioctl и EP — V3.3.0."

translation_key: 110-rockchip-pcie-ep-standard-card-apis

slug: 110-rockchip-pcie-ep-standard-card-apis

lang: ru

date: "2026-10-23"

author: "ArmSoM Editorial · Rockchip source documentation"

category: interfaces

products: []

tags: [ArmSoM, Rockchip, PCIe, API, DMA, Chips Connect]

---

{% raw %}

# Полный справочник API Rockchip PCIe EP: Linux RC, Windows ioctl и EP

Оригинал V3.3.0, по 57 страниц в каждом языке. Сохранены API, синтаксис, параметры, результаты, структуры и примеры. Это платформенный справочник: проверьте возможности EP/RC конкретной ArmSoM, версию chips_connect SDK, ядро и ABI драйвера. Поддержка на ArmSoM не проверялась; сброс, загрузка прошивок и DMA не выполнялись. Независимых технических рисунков нет; таблицы редактируемые.

> Вопросы оригинала: описание bar5 указывает bar1; rk_pcie_task_destroy ссылается на rk_pcie_ap_init; предварительный rk_pcie_dev_init отличается от rk_pcie_device_init; заголовок Windows говорит EP, но содержит RC ioctl. Сверьте с соответствующим SDK, не исправляя имена догадками.

> Различие API: китайские страницы 30 и 56 содержат `E_TASK_MSG_DESTORY`, английские — `E_TASK_MSG_DESTROY`. Написание оригиналов сохранено; русский и немецкий следуют английскому. При компиляции сверяйтесь с заголовком SDK. Повторные вызовы `pthread_mutex_unlock` и условие `if (ret)` сохранены, выполнение не проверялось.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Справочник Chips Connect API

### 1.1 PCIe Linux RC

#### 1.1.1 rk_pcie_get_pci_bus_addresses



**Описание**

 Получить адреса шин всех подходящих PCI-устройств системы. 

**Синтаксис**



```text
int rk_pcie_get_pci_bus_addresses(int vendor_id, int device_id, struct pcie_dev_bus
*pci_bus)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| vendor_id | Идентификатор производителя PCIe | Вход |
| device_id | Идентификатор продукта PCIe | Вход |
| pci_bus | Структура адреса шины PCI | Выход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**

 См. пример rk_pcie_device_init. 

**Связанные темы**

 rk_pcie_get_pci_bus_addresses

#### 1.1.2 rk_pcie_device_init



**Описание**

 Инициализировать устройство PCIe.



**Синтаксис**



```text
RK_PCIE_HANDLES rk_pcie_device_init(struct pcie_dev_attr_st *dev)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| dev | Структура настройки устройства PCIe | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| Не NULL | Успех |
| NULL | Ошибка |



**Пример**



```text
#define VENDOR_ID                   0x1d87
#define DEVICE_ID                   0x356a

struct pcie_dev_bus dev_bus;
struct pcie_dev_attr_st dev_attr;
RK_PCIE_HANDLES rk_handle;
int ret;

ret = rk_pcie_get_pci_bus_addresses(VENDOR_ID, DEVICE_ID, &dev_bus);
if (ret != 0) {
    printf("get pci bus address fail\n");
    return -1;
}

printf("ep dev max num : %d\n", dev_bus.dev_max_num);
if (dev_bus.dev_max_num == 0) {
    printf("no ep device, exit ... \n");
} else {
    // Initialize PCIe device
    dev_attr.using_rc_dma = 0; // Disable RC DMA, use EP DMA transfer
    dev_attr.rc_dma_chn = 0;
    dev_attr.vendor_id = VENDOR_ID;
    dev_attr.device_id = DEVICE_ID;
    dev_attr.use_dma_only_in_rc = 0;
    // Select the first matching device
    memcpy(dev_attr.pci_bus_address, dev_bus.pci_bus_address[0],
strlen(dev_bus.pci_bus_address[0]));

    // Initialize EP device
    rk_handle = rk_pcie_device_init(&dev_attr);
    if (rk_handle == NULL) {
        printf("pcie device init fail:%s \n", dev_attr.pci_bus_address);
        return -1;
    }

    // Deinitialize PCIe device, release resources
    ret = rk_pcie_device_deinit(rk_handle, 0);
    if (ret != 0) {
        printf("pcie deinit device fail....ret = %d\n", ret);
        return -1;
    }
}
```



**Связанные темы**

 rk_pcie_device_deinit

#### 1.1.3 rk_pcie_device_deinit



**Описание**

 Деинициализировать устройство PCIe и освободить ресурсы. 

**Синтаксис**



```text
int rk_pcie_device_deinit(RK_PCIE_HANDLES handles, int en_remove)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| en_remove | Освободить ресурсы и удалить устройство | Вход |



**Возвращаемое значение**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Нормально |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**

 См. пример rk_pcie_device_init. 

**Связанные темы**

 rk_pcie_device_init

#### 1.1.4 rk_pcie_task_create



**Описание**

 Создать задачу по атрибутам, выделить память и организовать управление BUFF. Вызов блокируется, ожидая вызова интерфейса создания задачи устройством EP. 

**Синтаксис**



```text
int rk_pcie_task_create(RK_PCIE_HANDLES handles, struct pcie_task_attr_st *task)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| task | Структура настройки PCIe Task | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| Больше 0 | Успех, task_id |
| Меньше 0 | Ошибка; см. коды ошибок |



**Пример**



```text
// Select the first matching device
rc_ctx.rk_handle = rk_pcie_device_init(&rc_ctx.dev_attr);
if (rc_ctx.rk_handle == NULL) {
    printf("pcie device init fail:%s \n", rc_ctx.dev_attr.pci_bus_address);
    return -1;
}

rc_ctx.task_attr.send_buff_num = 5; // Number of send buffers
rc_ctx.task_attr.send_buff_size = 1048576;   // Size of send buffer
rc_ctx.task_attr.recv_buff_num = 5; // Number of receive buffers
rc_ctx.task_attr.recv_buff_size = 8294408 ;  // Size of receive buffer
rc_ctx.task_attr.wait_timeout_ms = -1;  // Blocking wait
rc_ctx.task_id = rk_pcie_task_create(rc_ctx.rk_handle, &rc_ctx.task_attr);
if (rc_ctx.task_id < 0) {
    printf("pcie init create task fail....\n");
    return -1;
}

rk_pcie_get_ep_mode(rc_ctx.rk_handle, &rc_ctx.devmode);
printf("ep ap init, dev mode: %d, submode: %d\n", rc_ctx.devmode.mode,
rc_ctx.devmode.submode);
ret = rk_pcie_task_destroy(rc_ctx.rk_handle, rc_ctx.task_id);
if (ret != 0) {
    printf("pcie destory task fail....ret = %d\n", ret);
    return -1;
}
```



**Связанные темы**

 rk_pcie_task_destroy 

**Примечание**

 Интерфейс зависит от rk_pcie_dev_init: сначала инициализируйте устройство, затем задачу.

#### 1.1.5 rk_pcie_task_destroy



**Описание**

 Деинициализировать Task, освободив её память и ресурсы управления BUFF. 

**Синтаксис**



```text
int rk_pcie_task_destroy(RK_PCIE_HANDLES handles, int task_id)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| task_id | ID задачи | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Нормально |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**

 См. пример rk_pcie_ap_init. 

**Связанные темы**

 rk_pcie_ap_init

#### 1.1.6 rk_pcie_boot_init



**Описание**

 Инициализировать PCIE BOOT. 

**Синтаксис**



```text
int rk_pcie_boot_init(RK_PCIE_HANDLES handles)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Нормально |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
// Initialize PCIE device
rc_ctx.rk_handle = rk_pcie_device_init(&rc_ctx.dev_attr);
if (rc_ctx.rk_handle == NULL) {
    printf("device init fail \n");
    return -1;
}

// Initialize PCIE Boot
ret = rk_pcie_boot_init(rc_ctx.rk_handle);
if (ret != 0) {
    printf("pcie boot init ep fail....ret = %d\n", ret);
    return -1;
}

// pcie boot
rk_pcie_boot_download_firmware_list(&rc_ctx, &pcie_boot_info, &pcie_boot_ini);

// ep boot
rk_ep_boot_download_firmware_list(&rc_ctx, &ep_boot_info, &ep_boot_ini);

// Release PCIE Boot resources
ret = rk_pcie_boot_deinit(rc_ctx.rk_handle);
if (ret != 0) {
    printf("pcie boot deinit ep fail....ret = %d\n", ret);
    return -1;
}

printf("download ep end\n");
```



**Связанные темы**

 rk_pcie_boot_deinit 

**Примечание**

 Интерфейс зависит от rk_pcie_dev_init: сначала инициализируйте устройство, затем boot.

#### 1.1.7 rk_pcie_boot_deinit



**Описание**

 Деинициализировать PCIe BOOT. 

**Синтаксис**



```text
int rk_pcie_boot_deinit(RK_PCIE_HANDLES handles)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Нормально |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**

 rk_pcie_boot_init 

**Связанные темы**

 rk_pcie_boot_init

#### 1.1.8 rk_pcie_boot_download_firmware



**Описание**

 Загрузить прошивку PCIE BOOT. 

**Синтаксис**



```text
int rk_pcie_boot_download_firmware(RK_PCIE_HANDLES handles, unsigned char *firmware, size_t
firmware_size, unsigned long remote_load_addr)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| firmware | Данные прошивки | Вход |
| firmware_size | Размер прошивки | Вход |
| remote_load_addr | Адрес загрузки удалённой прошивки | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Нормально |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
int rk_ep_download_firmware(struct rc_context_st *rc_ctx, char *firmware, unsigned long
load_addr)
{
    int fd;
    unsigned long len;
    unsigned long size = 1024 * 1024;
    void *buffer = malloc(size);
    int ret;
    fd = open(firmware, O_RDONLY);
    if (fd == -1) {
        printf(" open %s file error, ret = %d \n", firmware, fd);
        return -1;
    }

    while ((len = read(fd, buffer, size)) > 0) {
        ret = rk_pcie_boot_download_firmware(rc_ctx->rk_handle, buffer, len, load_addr);
        if (ret != 0) {
            return -1;
        }

        load_addr += len;
    }

    close(fd);
    return 0;
}
```



**Связанные темы**

 rk_ep_download_firmware

#### 1.1.9 rk_pcie_boot_run



**Описание**

 Запустить прошивку PCIe BOOT. 

**Синтаксис**



```text
int rk_pcie_boot_run(RK_PCIE_HANDLES handles)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Нормально |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**

 rk_pcie_boot_init 

**Связанные темы**

 rk_pcie_boot_run

#### 1.1.10 rk_pcie_get_ep_info



**Описание**

 Получить информацию состояния EP, максимум 96KB. 

**Синтаксис**



```text
int rk_pcie_get_ep_info(RK_PCIE_HANDLES handles, void *status, size_t status_size)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| status | Указатель void, структура состояния определяется пользователем | Выход |
| status_size | Размер структуры состояния | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Нормально |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
struct ep_info_st {
    unsigned int link_status;
    unsigned int temp;
    long long timestamp;
    unsigned char cpu_load;
    unsigned char npu_load;
    unsigned char gpu_load;
};

long long timestamp;
while(1) {
    ret = rk_pcie_get_ep_info(rc_ctx.rk_handle, ep_info, sizeof(struct ep_info_st));
    if(timestamp == ep_info->timestamp) {
        printf("EP device status is abnormal \n");
        break;
    }
    timestamp = ep_info->timestamp;
}
```



**Связанные темы**

 rk_pcie_get_ep_info

#### 1.1.11 rk_pcie_get_user_cmd



**Описание**

 Получить указатель на определённую область BAR0 для пользовательских команд, максимум 256KB. 

**Синтаксис**



```text
void *rk_pcie_get_user_cmd(RK_PCIE_HANDLES handles)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |



**Возвращаемое значение**



| Возвращаемое значение | Описание |
| --- | --- |
| Не NULL | Успех, указатель пользовательской командной области |
| NULL | Ошибка |



**Пример**



```text
struct user_cmd_st {
    unsigned int max_chn;
    unsigned int width;
    unsigned int height;
    unsigned int codecid;
    unsigned int output_id;
    unsigned int init;
};

user_cmd = (struct user_cmd_st *)rk_pcie_get_user_cmd(rc_ctx.rk_handle);
user_cmd->max_chn = rc_ctx.max_chn;
user_cmd->width = rc_ctx.width;
user_cmd->height = rc_ctx.height;
user_cmd->codecid = rc_ctx.codecid;
user_cmd->output_id = 1; //0:RGB888 1:BGRA8888
user_cmd->init = 1;
```



**Связанные темы**

 rk_pcie_get_user_cmd

#### 1.1.12 rk_pcie_get_buff



**Описание**

 Получить доступный буфер PCIe. 

**Синтаксис**



```text
struct pcie_buff_node *rk_pcie_get_buff(RK_PCIE_HANDLES handles, int task_id, enum
EBuff_Type type)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| task_id | ID задачи | Вход |
| type | Тип буфера PCIE | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| Не NULL | Указатель доступного буфера |
| NULL | Нет указателя доступного буфера |



**Пример**



```text
node = rk_pcie_get_buff(ctx->rk_handle, ctx->task_id, E_RECV); //Obtain an available receive BUF
if (node) {
    if (check_info(node->vir_addr + node->size - CHECK_SIZE) == 0) { //Verify the BUF data is correct
        pthread_mutex_unlock(&ctx->mutex_stream_speed);
        ctx->stream_speed_index++;
        pthread_mutex_unlock(&ctx->mutex_stream_speed);
        memset(node->vir_addr + node->size - CHECK_SIZE, 0, CHECK_SIZE);
    } else {
        printf("check data ==================== error \n");
        for (int i = 0; i < CHECK_SIZE; i++) {
            unsigned char *p = node->vir_addr + node->size - CHECK_SIZE;
            printf("%d ", p[i]);
        }
        printf("\ncheck data ===ssss========node->size = %d======== error \n", (int)node-
>size);
    }
    rk_pcie_release_buff(ctx->rk_handle, ctx->task_id, node);  //Release BUF
} else {
    usleep(1000);
}
```



**Связанные темы**

 rk_pcie_release_buff

#### 1.1.13 rk_pcie_send_buff



**Описание**

 Отправить буфер PCIE, блокируясь до завершения DMA. 

**Синтаксис**



```text
int rk_pcie_send_buff(RK_PCIE_HANDLES handles, int task_id, struct pcie_buff_node *pbuff)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| task_id | ID задачи | Вход |
| pbuff | Указатель буфера PCIE | Вход |



**Возвращаемое значение**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успешная отправка: данные переданы DMA. |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
node = rk_pcie_get_buff(ctx->rk_handle, ctx->task_id, E_SEND); // Get an available send buffer
if (node) {
    node->size = buffer_size;
    // Operate on the buffer, write data
    memcpy(node->vir_addr, mptr, node->size);
    add_check_info(node->vir_addr + node->size - CHECK_SIZE);
    rk_pcie_send_buff(ctx->rk_handle, ctx->task_id, node); // Send to the other end
    index++;
} else {
    usleep(1000);
}
```



**Связанные темы**

 rk_pcie_send_buff

#### 1.1.14 rk_pcie_get_bar1_user_buffer



**Описание**

 Получить виртуальный адрес отображения bar1. 

**Синтаксис**



```text
void *rk_pcie_get_bar1_user_buffer(RK_PCIE_HANDLES handles)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор всех подходящих устройств | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| void * | Виртуальный адрес |
| NULL | Ошибка; см. коды ошибок |

#### 1.1.15 rk_pcie_get_bar5_user_buffer



**Описание**

 Получить виртуальный адрес отображения bar1. 

**Синтаксис**



```text
void *rk_pcie_get_bar5_user_buffer(RK_PCIE_HANDLES handles)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор всех подходящих устройств | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| void * | Виртуальный адрес |
| NULL | Ошибка; см. коды ошибок |

#### 1.1.16 rk_pcie_set_bar_inbound_cpu_addr



**Описание**

 Настроить входящее отображение BAR. 

**Синтаксис**



```text
u_int64_t rk_pcie_set_bar_inbound_cpu_addr(RK_PCIE_HANDLES handles, u_int32_t atu_index,
u_int64_t cpu_address, u_int32_t size)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор всех подходящих устройств | Вход |
| atu_index | Индекс ATU | Вход |
| cpu_address | Отображённый адрес CPU | Вход |
| size | Ограничение размера отображения | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| cpu_address | Возвращает адрес CPU |

#### 1.1.17 rk_pcie_release_buff



**Описание**

 Освободить буфер PCIE. 

**Синтаксис**



```text
int rk_pcie_release_buff(RK_PCIE_HANDLES handles, int task_id, struct pcie_buff_node *pbuff)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор всех подходящих устройств | Вход |
| task_id | ID задачи | Вход |
| pbuff | Указатель буфера PCIE | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успешно освобождено |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**

 rk_pcie_get_buff 

**Связанные темы**

 rk_pcie_release_buff

#### 1.1.18 rk_pcie_get_buff_max_size



**Описание**

 Получить максимально поддерживаемый размер буфера. 

**Синтаксис**



```text
long rk_pcie_get_buff_max_size(RK_PCIE_HANDLES handles, int task_id, enum EBuff_Type type)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор всех подходящих устройств | Вход |
| task_id | ID задачи | Вход |
| type | Тип буфера PCIE | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| Больше или равно 0 | Размер буфера |
| Меньше 0 | Ошибка; см. коды ошибок |



**Пример**



```text
long buffer_size = rk_pcie_get_buff_max_size(ctx->rk_handle, ctx->task_id, E_SEND);
```



**Связанные темы**

 rk_pcie_get_buff_max_size

#### 1.1.19 rk_pcie_get_ep_mode



**Описание**

 Получить текущий режим EP: loader, kernel, application и другие. Определения режимов находятся в rk_pcie_rc.h. 

**Синтаксис**



```text
int rk_pcie_get_ep_mode(RK_PCIE_HANDLES handles, struct pcie_dev_mode *devmode)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| devmode | Структура режима устройства | Выход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
struct rc_context_st {
    RK_PCIE_HANDLES rk_handle;
    struct pcie_task_attr_st dev_attr;
    struct pcie_dev_mode devmode;
}rc_ctx;

// Initialize the first matching device
rc_ctx.rk_handle = rk_pcie_device_init(&rc_ctx.dev_attr);
if (rc_ctx.rk_handle == NULL) {
    printf("device init fail \n");
    usleep(1000000);
    continue;
}

rk_pcie_get_ep_mode(rc_ctx.rk_handle, &rc_ctx.devmode);
printf("111 ep device init, dev mode: 0x%.2x, submode: 0x%.2x\n", rc_ctx.devmode.mode,
rc_ctx.devmode.submode);
```



**Связанные темы**

 rk_pcie_get_ep_mode

#### 1.1.20 Повторное сканирование PCI-устройств



**Описание**

 Повторно сканировать PCI-устройства системы. Для восстановления EP после аварийного перезапуска нужно удалить устройство, затем выполнить повторное сканирование. 

**Синтаксис**



```text
void rk_pcie_rescan_devices(void)
```



**Параметры**



Нет 

**Возвращаемое значение**

 Нет 

**Пример**

 Нет 

**Связанные темы**

 rk_pcie_rescan_devices

#### 1.1.21 rk_pcie_send_msg_to_ep_bus



**Описание**

 Отправить сообщение на EP, максимум 1504Bytes за сообщение. 

**Синтаксис**



```text
int rk_pcie_send_msg_to_ep_bus(RK_PCIE_HANDLES handles, int task_id, void *data, size_t
size)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| task_id | ID задачи | Вход |
| data | Указатель сообщения | Вход |
| size | Длина сообщения | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
rc_ctx.task_attr.send_buff_num = 5;
rc_ctx.task_attr.send_buff_size = 5 * 1024 * 1024;
rc_ctx.task_attr.recv_buff_num = 5;
rc_ctx.task_attr.recv_buff_size = 5 * 1024 * 1024;
rc_ctx.task_attr.wait_timeout_ms = -1;
rc_ctx.task_id = rk_pcie_task_create(rc_ctx.rk_handle, &rc_ctx.task_attr);
if (rc_ctx.task_id < 0) {
    printf("pcie init create task fail....\n");
    return -1;
}

rk_pcie_get_ep_mode(rc_ctx.rk_handle, &rc_ctx.devmode);
printf("ep ap init, dev mode: 0x%.2x, submode: 0x%.2x\n", rc_ctx.devmode.mode,
rc_ctx.devmode.submode);

rc_ctx.user_cmd.cmd = EP_TEST_STATUS_RUN_APP;
rk_pcie_send_msg_to_ep_bus(rc_ctx.rk_handle, rc_ctx.task_id, (void *)&rc_ctx.user_cmd,
sizeof(struct task_user_cmd_st));
```



**Связанные темы**

 rk_pcie_send_msg_to_ep_bus

#### 1.1.22 rk_pcie_get_msg_for_task_id



**Описание**

 Получить сообщения EP по ID задачи. 

**Синтаксис**



```text
int rk_pcie_get_msg_for_task_id(RK_PCIE_HANDLES handles, struct pcie_task_msg_st *msg, int
task_id, int timeout_ms)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| msg | Указатель структуры сообщения | Выход |
| task_id | ID задачи | Вход |
| timeout_ms | Тайм-аут в ms; -1 — блокирующий режим с бесконечным ожиданием в ядре (не рекомендуется). Рекомендуется 100ms. | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
unsigned char cmd;
struct pcie_task_msg_st msg;
ret = rk_pcie_get_msg_for_task_id(rc_ctx.rk_handle, &msg, rc_ctx.task_id, 100);
if (ret == RK_PCIE_OK) {
    cmd = msg.data[0];
    printf("recv ep msg: %d \n", cmd);
    if (cmd == 10) {
        break;
    }
}
```



**Связанные темы**

 rk_pcie_get_msg_for_task_id

#### 1.1.23 rk_pcie_get_ep_obj_info



**Описание**

 Получить основные сведения об EP. 

**Синтаксис**



```text
int rk_pcie_get_ep_obj_info(RK_PCIE_HANDLES handles, struct pcie_ep_obj_info_for_user *info)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| info | Буфер основных сведений | Выход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
struct pcie_ep_obj_info_for_user info;
ret = rk_pcie_get_msg_for_task_id(rc_ctx.rk_handle, &info);
if (ret == RK_PCIE_OK) {
    return ret;
}
```

#### 1.1.24 rk_pcie_get_ep_err_event_count



**Описание**

 Получить счётчики ошибок PCIe EP. 

**Синтаксис**



```text
int rk_pcie_get_ep_err_event_count(RK_PCIE_HANDLES handles, struct pcie_err_event_count
*info)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |
| info | Счётчик ошибок PCIe | Выход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
struct pcie_err_event_count info;
ret = rk_pcie_get_ep_err_event_count(rc_ctx.rk_handle, &info);
if (ret == RK_PCIE_OK) {
    return ret;
}
```

#### 1.1.25 rk_pcie_is_alive



**Описание**

 Проверить состояние линии PCIe. 

**Синтаксис**



```text
int rk_pcie_is_alive(RK_PCIE_HANDLES handles);
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| cc_true | Линия исправна |
| cc_false | Линия неисправна |



**Пример**



```text
ret = rk_pcie_is_alive(rc_ctx.rk_handle);
if (!ret) {
    printf("PCIe link down\n");
    return ret;
}
```

#### 1.1.26 rk_pcie_device_hardware_reset



**Описание**

 Пользовательский интерфейс драйвера ядра для аппаратного сброса. Драйвер должен реализовать ioctl PCIE_EP_RESET_CTRL. В ходе операции управление PERST# выполняет аппаратный сброс EP. 

**Синтаксис**



```text
int rk_pcie_device_hardware_reset(RK_PCIE_HANDLES handles);
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| handles | Дескриптор устройства | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Сброс успешен |
| Ненулевое значение | Сброс не удался или не поддерживается; см. коды ошибок |



**Пример**

 До сброса остановите все транзакции PCIe. Например:

```text
printf("Reset beging...\n");
/* Reset Progress: Stop all transmision */
rc_ctx.recv_ep_exit = 1;
rc_ctx.send_ep_exit = 1;
for (int i = 0; i < THREADS_MAX; i++) {
    pthread_join(rc_ctx.thr_recv_ep[i], NULL);
    pthread_join(rc_ctx.thr_send_ep[i], NULL);
}
usleep(500000);

/* Reset Progress: Destroy task */
ret = rk_pcie_task_destroy(rc_ctx.rk_handle, rc_ctx.task_id);
if (ret != 0) {
    printf("pcie destroy task fail....ret = %d\n", ret);
    return -1;
}
usleep(100000);

/* Reset Progress: Hardware reset */
ret = rk_pcie_device_hardware_reset(rc_ctx.rk_handle);
if (ret != 0) {
    printf("pcie device hardware reset fail....ret = %d\n", ret);
}

/* Reset Progress: Wait for link up */
usleep(1000000);

/* Reset Progress: Deinit device */
ret = rk_pcie_device_deinit(rc_ctx.rk_handle, 1);
if (ret != 0) {
    printf("pcie deinit device fail....ret = %d\n", ret);
    return -1;
}

/* Reset Progress: Rescan PCI */
rk_pcie_rescan_devices();
printf("Reset done\n");

return 0;
```

#### 1.1.27 Типы данных

Типы и структуры данных PCIE RC: RK_PCIE_HANDLES: Определяет дескриптор устройства. EBuff_Type: Определяет тип буфера PCIE. ETask_Msg_Type: Определяет тип сообщения Task. struct pcie_buff_node: Определяет атрибуты буфера PCIE. struct pcie_dev_bus: Определяет сведения о шине PCI-устройства.

struct pcie_dev_mode: Определяет режим PCIE EP. struct pcie_dev_attr_st: Определяет атрибуты PCIE EP. struct pcie_task_attr_st: Определяет атрибуты Task. struct pcie_task_msg_st: Определяет структуру сообщения Task. struct pcie_ep_obj_info_for_user: Определяет основные сведения PCIe. struct pcie_err_event_count: Определяет сведения об ошибках PCIe.

##### 1.1.27.1 RK_PCIE_HANDLES



**Описание**

 Определяет дескриптор устройства. 

**Определение**



```text
typedef void* RK_PCIE_HANDLES;
```

##### 1.1.27.2 EBuff_Type



**Описание**

 Определяет типы буфера PCIE. 

**Определение**



```text
enum EBuff_Type {
    E_SEND = 0,
    E_RECV,
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| E_SEND | Передающий буфер. |
| E_RECV | Принимающий буфер. |

##### 1.1.27.3 ETask_Msg_Type



**Пояснение**

 Определяет типы сообщений PCIE. 

**Определение**



```text
enum ETask_Msg_Type {
    E_TASK_MSG_NONE = 0,
    E_TASK_MSG_CREATE,
    E_TASK_MSG_DESTROY,
    E_TASK_MSG_USER,
    E_TASK_MSG_MAX,
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| E_TASK_MSG_NONE | Значение по умолчанию, без значения. |
| E_TASK_MSG_CREATE | Создание задачи. |
| E_TASK_MSG_DESTROY | Уничтожение задачи. |
| E_TASK_MSG_USER | Пользовательское сообщение. |
| E_TASK_MSG_MAX | Максимальный тип сообщения. |

##### 1.1.27.4 Узел буфера PCIe



**Пояснение**

 Определяет структуру атрибутов буфера PCIE. 

**Определение**



```text
struct pcie_buff_node{
    void *vir_addr;
    size_t phy_addr;
    size_t size;
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| vir_addr | Виртуальный адрес. |
| phy_addr | Физический адрес. |
| size | Размер памяти: для отправки пользователь задаёт объём данных не больше ёмкости буфера; для приёма — размер данных другой стороны. |

##### 1.1.27.5 Шина PCIe-устройства



**Пояснение**

 Определяет информацию шины PCI-устройств. 

**Определение**



```text
struct pcie_dev_bus {
    int dev_max_num;
    char pci_bus_address[PCI_DEV_MAX][PCI_BUS_MAX_NAME];
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| dev_max_num | Число подходящих устройств системы. |
| pci_bus_address | Адрес шины PCI-устройств. |

##### 1.1.27.6 Режим устройства PCIe EP



**Описание**

 Определяет режим устройства PCIe EP. 

**Определение**



```text
struct pcie_dev_mode {
    unsigned short mode;
    unsigned short submode;
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| mode | Текущий режим EP:<br>#define RKEP_MODE_BOOTROM 1<br>#define RKEP_MODE_LOADER 2<br>#define RKEP_MODE_KERNEL 3<br>#define RKEP_MODE_FUN0 4<br>#define RKEP_MODE_ERR 0xffff //Device exception requires reload |
| submode | Состояние режима EP:<br>#define RKEP_SMODE_INIT 0<br>#define RKEP_SMODE_LNKRDY 1<br>#define RKEP_SMODE_LNKUP 2<br>#define RKEP_SMODE_FWDLRDY 0x10<br>#define RKEP_SMODE_FWDLDONE 0x11<br>#define RKEP_SMODE_APPRDY 0x20<br>#define RKEP_SMODE_APPDEINIT 0x21<br>#define RKEP_SMODE_ERR 0xffff |

##### 1.1.27.7 pcie_dev_attr_st



**Описание**

 Определяет структуру атрибутов устройства PCIE EP. 

**Определение**



```text
struct pcie_dev_st {
    int vendor_id;
    int device_id;
    char pci_bus_address[PCI_BUS_MAX_NAME];
    unsigned char using_rc_dma: 1;
    unsigned char rc_dma_chn: 1;
    unsigned char enable_speed: 1;
    unsigned char use_dma_only_in_rc: 1; // Only call DMA to transmit and receive data on the RC side
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| vendor_id | ID производителя EP. |
| device_id | ID устройства EP. |
| pci_bus_address | Адрес шины EP. |
| using_rc_dma | При соединении RK режим включает DMA RC для повышения скорости. Для нескольких EP рекомендуется отключить его и использовать DMA EP. |
| rc_dma_chn | DMA RC поддерживает два канала: 0/1. |
| enable_speed | Включить статистику скорости; общую скорость EP показывает cat /tmp/pcie_debug*. |
| use_dma_only_in_rc | Вызывать DMA для передачи и приёма только на RC. |

##### 1.1.27.8 Структура атрибутов PCIe Task



**Описание**

 Определяет структуру атрибутов PCIe Task. 

**Определение**



```text
struct pcie_task_attr_st {
    int wait_timeout_ms;
    unsigned int send_buff_num;
    size_t send_buff_size;
    unsigned int recv_buff_num;
    size_t recv_buff_size;
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| wait_timeout_ms | Тайм-аут интерфейса; -1 — блокирующий режим. |
| send_buff_num | Количество передающих буферов PCIE для чередования. |
| send_buff_size | Размер передающего буфера. |
| recv_buff_num | Количество принимающих буферов PCIE для чередования. |
| recv_buff_size | Размер принимающего буфера. |

##### 1.1.27.9 pcie_task_msg_st



**Описание**

 Определяет структуру сообщения PCIE Task. 

**Определение**



```text
struct pcie_task_msg_st {
    enum ETask_Msg_Type type;
    int task_id;
    size_t size;
    char lock;
    unsigned char data[TASK_MSG_DATA_SIZE];
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| type | Тип сообщения. |
| task_id | ID задачи. |
| size | Длина сообщения. |
| lock | Зарезервировано. |
| data | Содержимое сообщения. |

##### 1.1.27.10 pcie_ep_obj_info_for_user



**Описание**

 Определяет структуру основных сведений PCIE. 

**Определение**



```text
struct pcie_ep_obj_info_for_user {
    unsigned int magic;
    unsigned int rc_cc_version;
    unsigned int ep_cc_version;
    unsigned int func_drv_version;
    unsigned short vid;
    unsigned int did;
    unsigned int sub_vid;
    unsigned int sub_did;
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| magic | Сигнатура Chips Connect, 32 бита, по умолчанию 0x524B4550; задаётся драйвером ядра EP |
| rc_cc_version | Версия Chips Connect RC, 32-битный возрастающий счётчик; 0x1 соответствует V1 |
| ep_cc_version | Версия Chips Connect EP, 32-битный возрастающий счётчик; 0x1 соответствует V1 |
| func_drv_version | Версия драйвера PCIe: 32 бита, старшие 8 резервные, остальные группы по 8 бит задают части версии; 0x00030100 соответствует V3.1.0 |
| vid | ID производителя PCI, 16 бит |
| did | ID устройства PCI, 16 бит |
| sub_vid | ID производителя подсистемы, 16 бит |
| sub_did | ID устройства подсистемы, 16 бит |

##### 1.1.27.11 pcie_err_event_count



**Описание**

 Определяет структуру счётчиков ошибок PCIe. 

**Определение**



```text
struct pcie_err_event_count {
    unsigned char ebuf_overflow;
    unsigned char ebuf_under_run;
    unsigned char decode_error;
    unsigned char running_disparity_error;
    unsigned char skp_os_parity_error;
    unsigned char sync_header_error;
    unsigned char ctl_skp_os_parity_error;
    unsigned char detect_ei_infer;
    unsigned char receiver_error;
    unsigned char rx_recovery_request;
    unsigned char n_fts_timeout;
    unsigned char framing_error;
    unsigned char deskew_error;
    unsigned char bad_tlp;
    unsigned char lrc_error;
    unsigned char bad_dllp;
    unsigned char replay_number_rollover;
    unsigned char replay_timeout;
    unsigned char rx_nak_dllp;
    unsigned char tx_nak_dllp;
    unsigned char retry_tlp;
    unsigned char fc_timeout;
    unsigned char poisoned_tlp;
    unsigned char ecr_error;
    unsigned char unsupported_request;
    unsigned char completer_abort;
    unsigned char completion_timeout;
    /* The location above is hardware information and cannot be changed */
    unsigned char redundant_phase;
};
```



**Поля**



| Имя поля | Сокращение | Описание |
| --- | --- | --- |
| ebuf_overflow | EBUF Overflow | - |
| ebuf_under_run | EBUF Under-run | - |
| decode_error | Decode Ошибка | Ошибка декодирования пакета, сбой сигнала |
| running_disparity_error | Running Disparity Ошибка | Ошибка дисбаланса 8b/10b, сбой сигнала Gen2 |
| skp_os_parity_error | SKP OS Parity Ошибка | Ошибка чётности SKP, сбой сигнала Gen3 |
| sync_header_error | SYNC Header Ошибка | Ошибка заголовка синхронизации, сбой сигнала |
| ctl_skp_os_parity_error | CTL SKP OS Parity Ошибка | Ошибка чётности управляемой SKP-последовательности, сбой сигнала Gen3 |
| detect_ei_infer | Detect EI Infer | Обнаружены перекрёстные помехи |
| receiver_error | Receiver Ошибка | Ошибка приёмника |
| rx_recovery_request | Rx Recovery Request | RX получает запрос периферии на recovery для коррекции сигнала |
| n_fts_timeout | N_FTS Timeout | n_FTS периферии не соответствует стандарту; неправильный переход L0s → L0 вызывает recovery |
| framing_error | Framing Ошибка | Ошибка декодирования кадра, сбой сигнала |
| deskew_error | Deskew Ошибка | Ошибка deskew, сбой сигнала |
| bad_tlp | BAD TLP | Получен ошибочный TLP |
| lrc_error | LCRC Ошибка | Ошибка CRC линии, сбой сигнала |
| bad_dllp | BAD DLLP | Ошибочный пакет DLLP, сбой сигнала |
| replay_number_rollover | Replay Number Rollover | Повторные пакеты переполнили буфер повторов |
| replay_timeout | Replay Timeout | Тайм-аут повторной передачи ошибочных пакетов |
| rx_nak_dllp | Rx Nak DLLP | Получен DLLP снизу, доступ отклонён |
| tx_nak_dllp | Tx Nak DLLP | Нижестоящее устройство отклонило отправленный DLLP |
| retry_tlp | Retry TLP | Число повторно переданных TLP, показатель частоты ошибок |
| fc_timeout | FC Timeout | Тайм-аут обновления управления потоком |
| poisoned_tlp | Poisoned TLP | Зарегистрирован ошибочный тип TLP, возможны сбой линии или изменение бита RAM |
| ecr_error | ECRC Ошибка | Ошибка конечного CRC, сбой сигнала |
| unsupported_request | Unsupported Request | Получен неподдерживаемый тип запроса TLP, возможно из-за отказа доступа периферии |
| completer_abort | Completer Abort | Запрос RC получен, но внутренняя ошибка требует прекращения доступа |
| completion_timeout | Completion Timeout | Тайм-аут чтения ресурсов периферии и возврата TLP |
| redundant_phase | Резервная фаза | Счётчик для проверки непрерывного обновления состояния |

### 1.2 PCIE Windows EP

Драйверы Windows предоставляют приложениям следующие ioctl:

| ioctl | Описание функции |
| --- | --- |
| IOCTL_RKEP_DOWNLOAD_FIRMWARE | Передать прошивку EP |
| IOCTL_RKEP_BOOT_RUN | Запустить EP после передачи прошивки |
| IOCTL_RKEP_CREATE_TASK | Создать задачу |
| IOCTL_RKEP_DESTROY_TASK | Освободить задачу |
| IOCTL_RKEP_SEND_BUF | Отправить буфер EP |
| IOCTL_RKEP_GET_BUF | Получить буферные данные EP |
| IOCTL_RKEP_GET_EP_MODE | Получить текущий режим EP |
| IOCTL_RKEP_SEND_MSG_TO_EP_BUS | Отправить событие сообщения EP |
| IOCTL_RKEP_GET_MSG_FOR_TASK_ID | Получить событие сообщения EP |

#### 1.2.1 Типы данных

Типы и структуры данных PCIE RC: RK_PCIE_TASK_ATTR: Определяет атрибуты Task. RK_PCIE_DESTROY_TASK: Структура освобождения Task.

RK_PCIE_IOCTL_STATUS: Определяет структуру состояния вызова ioctl PCIE. RK_PCIE_TASK_MSG: Определяет структуру сообщения Task. RK_PCIE_BUFF_NODE: Определяет структуру PCIE EP BUF. RK_PCIE_DEV_MODE: Определяет структуру режима PCIE EP. RK_PCIE_TASK_INFO: Определяет структуру информации Task. RK_PCIE_DOWNLOAD_FIRMWARE: Определяет структуру загрузки прошивки.

##### 1.2.1.1 RK_PCIE_TASK_ATTR



**Описание**

 Определяет структуру атрибутов PCIE Task. 

**Определение**



```text
typedef struct _RK_PCIE_TASK_ATTR {
    int WaitTimeoutMs;
    int SendBuffNum;
    int SendBuffSize;
    int RecvBuffNum;
    int RecvBuffSize;
}  RK_PCIE_TASK_ATTR, *PRK_PCIE_TASK_ATTR;
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| WaitTimeoutMs | Тайм-аут интерфейса; блокирующий режим не поддерживается. |
| SendBuffNum | Количество передающих буферов PCIE для чередования. |
| SendBuffSize | Размер передающего буфера. |
| RecvBuffNum | Количество принимающих буферов PCIE для чередования. |
| RecvBuffSize | Размер принимающего буфера. |

##### 1.2.1.2 RK_PCIE_DESTROY_TASK



**Описание**

 Определяет структуру освобождения PCIE Task. 

**Определение**



```text
typedef struct _RK_PCIE_DESTROY_TASK {
    int TaskID;
}  RK_PCIE_DESTROY_TASK, *PRK_PCIE_DESTROY_TASK;
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| TaskID | ID освобождаемой задачи |

##### 1.2.1.3 RK_PCIE_IOCTL_STATUS



**Описание**

 Определяет структуру состояния вызова ioctl PCIE. 

**Определение**



```text
typedef struct _RK_PCIE_IOCTL_STATUS {
    int Status;
    char Data[0];
} RK_PCIE_IOCTL_STATUS, *PRK_PCIE_IOCTL_STATUS;
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| Состояние | Результат ioctl; см. enum _RK_PCIE_RET |
| Данные | Данные, возвращённые ioctl |

##### 1.2.1.4 RK_PCIE_TASK_MSG



**Описание**

 Определяет структуру сообщения Task. 

**Определение**



```text
typedef struct _RK_PCIE_TASK_MSG {
    int TaskID;
    int Size;
    char Data[TASK_MSG_DATA_SIZE];
} RK_PCIE_TASK_MSG, *PRK_PCIE_TASK_MSG;
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| TaskID | ID задачи |
| Размер | Длина сообщения, максимум 1504 Bytes |
| Данные | Содержимое сообщения |

##### 1.2.1.5 RK_PCIE_BUFF_NODE



**Описание**

 Определяет структуру PCIE EP BUF. 

**Определение**



```text
typedef struct _RK_PCIE_BUFF_NODE {
    int Size;
    int TaskID;
    int TimeOut10Ms;
    char Reserved[52];  // 64 = 52 + 4 + 4 + 4
    char Data[0];
} RK_PCIE_BUFF_NODE, *PRK_PCIE_BUFF_NODE;
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| Размер | Длина данных |
| TaskID | ID задачи |
| TimeOut10Ms | Тайм-аут интерфейса без блокирующего режима, минимальная единица 10ms. |
| Зарезервировано | Резервный размер |
| Данные | Данные |

##### 1.2.1.6 RK_PCIE_DEV_MODE



**Описание**

 Определяет структуру режима устройства PCIE EP. 

**Определение**



```text
typedef struct _RK_PCIE_DEV_MODE {
    unsigned short Mode;
    unsigned short SubMode;
} RK_PCIE_DEV_MODE, *PRK_PCIE_DEV_MODE;
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| Режим | Текущий режим EP:<br>#define RKEP_MODE_BOOTROM 1<br>#define RKEP_MODE_LOADER 2<br>#define RKEP_MODE_KERNEL 3<br>#define RKEP_MODE_FUN0 4<br>#define RKEP_MODE_ERR 0xffff //Device exception, reload required |
| SubMode | Состояние режима EP:<br>#define RKEP_SMODE_INIT 0<br>#define RKEP_SMODE_LNKRDY 1<br>#define RKEP_SMODE_LNKUP 2<br>#define RKEP_SMODE_FWDLRDY 0x10<br>#define RKEP_SMODE_FWDLDONE 0x11<br>#define RKEP_SMODE_APPRDY 0x20<br>#define RKEP_SMODE_APPDEINIT 0x21<br>#define RKEP_SMODE_ERR 0xffff |

##### 1.2.1.7 RK_PCIE_TASK_INFO



**Описание**

 Определяет структуру информации Task. 

**Определение**



```text
typedef struct _RK_PCIE_TASK_INFO {
    int TaskID;
} RK_PCIE_TASK_INFO, *PRK_PCIE_TASK_INFO;
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| TaskID | ID задачи |

##### 1.2.1.8 RK_PCIE_DOWNLOAD_FIRMWARE



**Описание**

 Определяет структуру загрузки прошивки. 

**Определение**



```text
typedef struct _RK_PCIE_DOWNLOAD_FIRMWARE {
    size_t RemoteLoadAddr;
    size_t Size;
    char Data[0];
} RK_PCIE_DOWNLOAD_FIRMWARE, *PRK_PCIE_DOWNLOAD_FIRMWARE;
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| RemoteLoadAddr | Адрес памяти EP |
| Размер | Длина прошивки |
| Данные | Содержимое прошивки |

### 1.3 Конечная точка PCIE

#### 1.3.1 rk_pcie_device_init



**Описание**

 Инициализирует устройство PCIe. 

**Синтаксис**



```text
int rk_pcie_device_init(void)
```



**Параметры**

 Нет 

**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
typedef struct
{
    pthread_t thr_recv_rc;
    pthread_t thr_send_rc;
    char recv_rc_exit;
    char send_rc_exit;
} ep_context_st;
int main(void)
{
    int ret = 0;
    struct task_context_st task_ctx[PCIE_DMA_TASK_MAX] = {0};
    struct pcie_task_msg_st msg;
    struct task_user_cmd_st *user_cmd;

    ret = rk_pcie_device_init();
    if (ret != 0) {
        printf("pcie init device error....\n");
        return -1;
    }

    while (1) {
        ret = rk_pcie_get_msg_for_bus(&msg, 100);
        if (ret) {
            printf("task_id:%d type:%d size:%ld \n", msg.task_id, msg.type, msg.size);
            switch (msg.type) {
            case E_TASK_MSG_CREATE:
                task_create(&task_ctx[msg.task_id], msg.task_id);
                break;
            case E_TASK_MSG_DESTORY:
                task_destory(&task_ctx[msg.task_id], msg.task_id);
                break;
            case E_TASK_MSG_USER: {
                user_cmd = (struct task_user_cmd_st *)msg.data;
                switch (user_cmd->cmd) {
                case TASK_USER_CMD_INIT_APP:
                    app_create(&task_ctx[msg.task_id], msg.task_id);
                    break;
                case TASK_USER_CMD_DEINIT_APP:
                    app_destory(&task_ctx[msg.task_id], msg.task_id);
                    break;
                }
            }
            break;
            default:
                printf("error msg type!!! \n");
                break;
            }
        }
    }

    rk_pcie_device_deinit();

    return 0;
}
```



**Связанные темы**

 rk_pcie_device_deinit

#### 1.3.2 rk_pcie_device_deinit



**Описание**

 Деинициализировать PCIe, освободить ресурсы. 

**Синтаксис**



```text
int rk_pcie_device_deinit(void)
```

#### 1.3.3 rk_pcie_task_create



**Описание**

 Создать Task, инициализировать память и управление BUFF. 

**Синтаксис**



```text
int rk_pcie_task_create(int task_id)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| task_id | ID задачи, переданный сообщением RC | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**

 См. пример rk_pcie_device_init. 

**Связанные темы**

 rk_pcie_device_deinit

#### 1.3.4 rk_pcie_task_destroy



**Описание**

 Деинициализировать Task, освободить память, управление BUFF и прочие ресурсы. 

**Синтаксис**



```text
int rk_pcie_task_destroy(int task_id)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| task_id | ID задачи | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**

 См. пример rk_pcie_device_init. 

**Связанные темы**

 rk_pcie_device_init

#### 1.3.5 rk_pcie_set_ep_info



**Описание**

 Задать информацию состояния EP. 

**Синтаксис**



```text
int rk_pcie_set_ep_info(void *status, size_t status_size)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| status | Указатель void, структура состояния определяется пользователем | Вход |
| status_size | Размер структуры состояния | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
struct ep_info_st {
    unsigned int link_status;
    unsigned int temp;
    long long timestamp;
    unsigned char cpu_load;
    unsigned char npu_load;
    unsigned char gpu_load;
};

ep_info_st ep_info;
while(1) {
    ep_info.timestamp = time(NULL);
    rk_pcie_set_ep_info((void *)&ep_info, sizeof(struct ep_info_st));
}
```



**Связанные темы**

 rk_pcie_get_ep_info

#### 1.3.6 rk_pcie_get_user_cmd



**Описание**

 Получить указатель на область BAR0 для пользовательских команд. 

**Синтаксис**



```text
void *rk_pcie_get_user_cmd(void)
```



**Параметры**

 Нет 

**Возвращаемое значение**



| Возвращаемое значение | Описание |
| --- | --- |
| Не NULL | Успех, указатель памяти пользовательской командной области |
| NULL | Ошибка |



**Пример**



```text
struct user_cmd_st {
    unsigned int max_chn;
    unsigned int width;
    unsigned int height;
    unsigned int codecid;
    unsigned int output_id;
    unsigned int init;
};
ep_ctx.user_cmd = rk_pcie_get_user_cmd();

while(ep_ctx.user_cmd->init != 1) {
    usleep(1000);
}

ep_ctx.video_obj.width = ep_ctx.user_cmd->width;
ep_ctx.video_obj.height = ep_ctx.user_cmd->height;
ep_ctx.video_obj.input_mode = ep_ctx.user_cmd->codecid;
ep_ctx.video_obj.output_mode = ep_ctx.user_cmd->output_id;
ep_ctx.video_obj.max_chn = ep_ctx.user_cmd->max_chn;
ep_ctx.max_chn = ep_ctx.video_obj.max_chn;
```



**Связанные темы**

 rk_pcie_get_user_cmd

#### 1.3.7 rk_pcie_get_bar1_user_buffer



**Описание**

 Получить виртуальный адрес отображения bar1. 

**Синтаксис**



```text
void *rk_pcie_get_bar1_user_buffer(void)
```



**Параметры**

 Нет. 

**Возвращаемое значение**



| Возвращаемое значение | Описание |
| --- | --- |
| void * | Виртуальный адрес |
| NULL | Ошибка; см. коды ошибок |

#### 1.3.8 rk_pcie_get_bar5_user_buffer



**Описание**

 Получить виртуальный адрес отображения bar1. 

**Синтаксис**



```text
void *rk_pcie_get_bar5_user_buffer(void)
```



**Параметры**



Нет. 

**Возвращаемое значение**



| Возвращаемое значение | Описание |
| --- | --- |
| void * | Виртуальный адрес |
| NULL | Ошибка; см. коды ошибок |

#### 1.3.9 rk_pcie_set_bar_inbound_cpu_addr



**Описание**

 Настроить входящее отображение BAR. 

**Синтаксис**



```text
u_int64_t rk_pcie_set_bar_inbound_cpu_addr(u_int32_t atu_index, u_int64_t cpu_address,
u_int32_t size)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| atu_index | Индекс ATU | Вход |
| cpu_address | Отображённый адрес CPU | Вход |
| size | Ограничение размера отображения | Вход |



**Возвращаемое значение**



| Возвращаемое значение | Описание |
| --- | --- |
| cpu_address | Возвращает адрес CPU |

#### 1.3.10 rk_pcie_get_buff



**Описание**

 Получить доступный буфер PCIE. 

**Синтаксис**



```text
struct pcie_buff_node *rk_pcie_get_buff(int task_id, enum EBuff_Type type)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| task_id | ID задачи | Вход |
| type | Тип буфера PCIE | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| Не NULL | Указатель доступного буфера |
| NULL | Нет доступного буфера |



**Пример**



```text
node = rk_pcie_get_buff(ctx->task_id, E_SEND);
if (node) {
    node->size = buffer_size;
    memset(node->vir_addr, index, node->size);
    add_check_info(node->vir_addr + node->size - CHECK_SIZE);
    rk_pcie_send_buff(ctx->task_id, node);
    index++;
} else {
    usleep(1000);
}
```



**Связанные темы**

 rk_pcie_send_buff

#### 1.3.11 rk_pcie_send_buff



**Описание**

 Отправить буфер PCIE. 

**Синтаксис**



```text
int rk_pcie_send_buff(int task_id, struct pcie_buff_node *pbuff)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| task_id | ID задачи | Вход |
| pbuff | Указатель буфера PCIE | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успешно отправлено |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**

 rk_pcie_get_buff 

**Связанные темы**

 rk_pcie_get_buff

#### 1.3.12 rk_pcie_release_buff



**Описание**

 Освободить буфер PCIE. 

**Синтаксис**



```text
int rk_pcie_release_buff(int task_id, struct pcie_buff_node *pbuff)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| task_id | ID задачи | Вход |
| pbuff | Указатель буфера PCIE | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успешно освобождено |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**



```text
node = rk_pcie_get_buff(ctx->task_id, E_RECV);
if (node) {
    if (check_info(node->vir_addr + node->size - CHECK_SIZE) == 0) {
        pthread_mutex_lock(&ctx->mutex_stream_speed);
        ctx->stream_speed_index++;
        pthread_mutex_unlock(&ctx->mutex_stream_speed);
        // if (mptr != NULL) {
        //     memcpy(mptr, node->vir_addr, node->size);
        // }
        memset(node->vir_addr + node->size - CHECK_SIZE, 0, CHECK_SIZE);
    } else {
        printf("check data ==================== error \n");
        for (int i = 0; i < CHECK_SIZE; i++) {
            unsigned char *p = node->vir_addr + node->size - CHECK_SIZE;
            printf("%d ", p[i]);
        }
        printf("\ncheck data ===ssss========node->size = %d======== error \n", (int)node-
>size);
    }
    rk_pcie_release_buff(ctx->task_id, node);
} else {
    usleep(1000);
}
```



**Связанные темы**

 rk_pcie_release_buff

#### 1.3.13 rk_pcie_get_buff_max_size



**Описание**

 Получить максимально поддерживаемый размер буфера. 

**Синтаксис**



```text
long rk_pcie_get_buff_max_size(int task_id, enum EBuff_Type type)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| task_id | ID задачи | Вход |
| type | Тип буфера PCIE | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| Больше или равно 0 | Размер буфера |
| Меньше 0 | Ошибка; см. коды ошибок |



**Пример**



```text
long buffer_size = rk_pcie_get_buff_max_size(ctx->task_id, E_SEND);
```



**Связанные темы**

 rk_pcie_get_buff_max_size

#### 1.3.14 rk_pcie_get_msg_for_bus



**Описание**

 Ожидать сообщение RC. 

**Синтаксис**



```text
int rk_pcie_get_msg_for_bus(struct pcie_task_msg_st *msg, int timeout_ms)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| timeout_ms | Тайм-аут в ms; -1 — блокирующий режим с бесконечным ожиданием в ядре (не рекомендуется). Рекомендуется 100ms. | Вход |



**Возвращаемые значения**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**

 См. пример rk_pcie_device_init. 

**Связанные темы**

 rk_pcie_device_deinit

#### 1.3.15 rk_pcie_send_msg_to_rc_task



**Описание**

 Отправить сообщение RC. 

**Синтаксис**



```text
int rk_pcie_send_msg_to_rc_task(int task_id, void *data, size_t size)
```



**Параметры**



| Имя параметра | Описание | Вход/выход |
| --- | --- | --- |
| task_id | ID задачи | Вход |
| data | Указатель сообщения | Вход |
| size | Длина сообщения | Вход |



**Возвращаемое значение**



| Возвращаемое значение | Описание |
| --- | --- |
| 0 | Успех |
| Ненулевое значение | Ошибка; см. коды ошибок |



**Пример**

 См. пример rk_pcie_device_init. 

**Связанные темы**

 rk_pcie_device_deinit

#### 1.3.16 Типы данных

Типы и структуры данных PCIE RC: EBuff_Type: Определяет тип буфера PCIe. ETask_Msg_Type: Определяет тип сообщения Task. struct pcie_buff_node: Определяет атрибуты буфера PCIe. struct pcie_task_msg_st: Определяет атрибуты сообщения.

##### 1.3.16.1 EBuff_Type



**Описание**

 Определяет типы буфера PCIE. 

**Определение**



```text
enum EBuff_Type {
    E_SEND = 0,
    E_RECV,
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| E_SEND | Передающий буфер. |
| E_RECV | Принимающий буфер. |

##### 1.3.16.2 ETask_Msg_Type



**Описание**

 Определяет типы сообщений задач. 

**Определение**



```text
enum ETask_Msg_Type {
    E_TASK_MSG_NONE = 0,
    E_TASK_MSG_CREATE,
    E_TASK_MSG_DESTROY,
    E_TASK_MSG_USER,
    E_TASK_MSG_MAX,
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| E_TASK_MSG_NONE | Значение по умолчанию, без значения |
| E_TASK_MSG_CREATE | Создать задачу |
| E_TASK_MSG_DESTROY | Уничтожить задачу |
| E_TASK_MSG_USER | Пользовательское сообщение |
| E_TASK_MSG_MAX | Максимальный тип сообщения |

##### 1.3.16.3 Узел буфера PCIe



**Описание**

 Определяет атрибуты буфера PCIe. Изменения структуры должны одновременно выполняться на RC и EP. 

**Определение**



```text
struct pcie_buff_node {
    void *vir_addr;
    size_t phy_addr;
    size_t size;
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| vir_addr | Виртуальный адрес. |
| phy_addr | Физический адрес. |
| size | Размер памяти: для отправки пользователь задаёт объём данных не больше ёмкости буфера; для приёма — размер данных другой стороны. |

##### 1.3.16.4 pcie_task_msg_st



**Описание**

 Определяет атрибуты сообщения. Структуру необходимо изменять одновременно на RC и EP. 

**Определение**



```text
struct pcie_task_msg_st {
    enum ETask_Msg_Type type;
    int task_id;
    size_t size;
    char lock;
    unsigned char data[TASK_MSG_DATA_SIZE];
};
```



**Поля**



| Имя поля | Описание |
| --- | --- |
| type | Тип сообщения. |
| task_id | ID задачи. |
| size | Длина сообщения. |
| lock | Зарезервировано. |
| data | Содержимое сообщения. |

### 1.4 Коды ошибок

| Код ошибки | Макроопределение | Описание |
| --- | --- | --- |
| -1 | RK_PCIE_ERR_BAD | Неисправная линия PCIE |
| -2 | RK_PCIE_ERR_UNKNOWN | Системная ошибка |
| -3 | RK_PCIE_ERR_NULL_PTR | Нулевой указатель |
| -4 | RK_PCIE_ERR_MALLOC | Ошибка выделения памяти |
| -5 | RK_PCIE_ERR_OPEN_FILE | Ошибка открытия файла |
| -6 | RK_PCIE_ERR_VALUE | Значение ошибки |
| -8 | RK_PCIE_ERR_TIMEOUT | Возврат по тайм-ауту |
| -10 | RK_PCIE_ERR_UNSUPPORT | Неподдерживаемая функция |
| -13 | RK_PCIE_ERR_HW_UNSUPPORT | Аппаратура не поддерживается |
| -15 | RK_PCIE_ERR_MMAP | Ошибка mmap |
| -65 | RK_PCIE_ERR_INIT | Ошибка инициализации |
| -66 | RK_PCIE_ERR_NOINIT | Система не инициализирована |
| -68 | RK_PCIE_ERR_NOMEM | Недостаточно памяти |
| -69 | RK_PCIE_ERR_OUTOF_RANGE | Параметр вне диапазона |

{% endraw %}

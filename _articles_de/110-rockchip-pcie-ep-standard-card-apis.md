---

title: "Vollständige Rockchip PCIe EP-API-Referenz: Linux RC, Windows ioctl und EP"

description: "Vollständige Rockchip PCIe EP-API-Referenz: Linux RC, Windows ioctl und EP — V3.3.0."

excerpt: "Vollständige Rockchip PCIe EP-API-Referenz: Linux RC, Windows ioctl und EP — V3.3.0."

translation_key: 110-rockchip-pcie-ep-standard-card-apis

slug: 110-rockchip-pcie-ep-standard-card-apis

lang: de

date: "2026-10-23"

author: "ArmSoM Editorial · Rockchip source documentation"

category: interfaces

products: []

tags: [ArmSoM, Rockchip, PCIe, API, DMA, Chips Connect]

---

{% raw %}

# Vollständige Rockchip PCIe EP-API-Referenz: Linux RC, Windows ioctl und EP

Quelle V3.3.0, jeweils 57 Seiten. APIs, Syntax, Parameter, Rückgaben, Strukturen und Beispiele bleiben erhalten. Plattformreferenz: EP/RC-Fähigkeit der konkreten ArmSoM-Platine, chips_connect-SDK-Version, Kernel und Treiber-ABI prüfen. ArmSoM-Unterstützung wurde nicht getestet; Reset, Firmwaredownload und DMA wurden nicht ausgeführt. Keine eigenständigen technischen Abbildungen; Tabellen sind editierbar.

> Quellenabweichungen: bar5-Getter werden als bar1 beschrieben; rk_pcie_task_destroy verweist auf rk_pcie_ap_init; Voraussetzung rk_pcie_dev_init unterscheidet sich von rk_pcie_device_init; Windows heißt im Titel EP, enthält aber RC-ioctl. Mit dem passenden SDK abgleichen und API-Namen nicht erraten.

> API-Abweichung: Auf chinesischen Seiten 30 und 56 steht `E_TASK_MSG_DESTORY`, im Englischen `E_TASK_MSG_DESTROY`. Die Schreibweisen bleiben erhalten; Russisch und Deutsch folgen Englisch. Beim Kompilieren den passenden SDK-Header prüfen. Wiederholte Aufrufe von `pthread_mutex_unlock` und die Bedingung `if (ret)` bleiben ohne Laufzeitprüfung erhalten.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip Linux](https://github.com/rockchip-linux/kernel)

## 1. Chips Connect-API-Referenz

### 1.1 PCIe Linux RC

#### 1.1.1 rk_pcie_get_pci_bus_addresses



**Beschreibung**

 Busadressen aller passenden PCI-Geräte im System abrufen. 

**Syntax**



```text
int rk_pcie_get_pci_bus_addresses(int vendor_id, int device_id, struct pcie_dev_bus
*pci_bus)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| vendor_id | PCIe-Herstellerkennung | Eingabe |
| device_id | PCIe-Produktkennung | Eingabe |
| pci_bus | PCI-Busadressstruktur | Ausgabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**

 Siehe Beispiel unter rk_pcie_device_init. 

**Verwandte Themen**

 rk_pcie_get_pci_bus_addresses

#### 1.1.2 rk_pcie_device_init



**Beschreibung**

 PCIe-Gerät initialisieren.



**Syntax**



```text
RK_PCIE_HANDLES rk_pcie_device_init(struct pcie_dev_attr_st *dev)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| dev | PCIe-Gerätekonfigurationsstruktur | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| Nicht NULL | Erfolg |
| NULL | Fehler |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_device_deinit

#### 1.1.3 rk_pcie_device_deinit



**Beschreibung**

 PCIe-Gerät deinitialisieren und Ressourcen freigeben. 

**Syntax**



```text
int rk_pcie_device_deinit(RK_PCIE_HANDLES handles, int en_remove)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| en_remove | Ressourcen freigeben und Gerät entfernen | Eingabe |



**Rückgabewert**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Normal |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**

 Siehe Beispiel unter rk_pcie_device_init. 

**Verwandte Themen**

 rk_pcie_device_init

#### 1.1.4 rk_pcie_task_create



**Beschreibung**

 Task anhand der Attribute erstellen, Speicher zuweisen und BUFFs verwalten. Der Aufruf blockiert, bis das EP-Gerät die Task-Erstellung aufruft. 

**Syntax**



```text
int rk_pcie_task_create(RK_PCIE_HANDLES handles, struct pcie_task_attr_st *task)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| task | PCIe-Task-Konfigurationsstruktur | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| Größer als 0 | Erfolg, task_id |
| Kleiner als 0 | Fehler; siehe Fehlercodes |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_task_destroy 

**Hinweis**

 Die Schnittstelle benötigt rk_pcie_dev_init: zuerst das Gerät, danach die Task initialisieren.

#### 1.1.5 rk_pcie_task_destroy



**Beschreibung**

 Task deinitialisieren und zugehörigen Speicher sowie BUFF-Verwaltungsressourcen freigeben. 

**Syntax**



```text
int rk_pcie_task_destroy(RK_PCIE_HANDLES handles, int task_id)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| task_id | Task-ID | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Normal |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**

 Siehe Beispiel unter rk_pcie_ap_init. 

**Verwandte Themen**

 rk_pcie_ap_init

#### 1.1.6 rk_pcie_boot_init



**Beschreibung**

 PCIE BOOT initialisieren. 

**Syntax**



```text
int rk_pcie_boot_init(RK_PCIE_HANDLES handles)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Normal |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_boot_deinit 

**Hinweis**

 Die Schnittstelle benötigt rk_pcie_dev_init: zuerst das Gerät, danach boot initialisieren.

#### 1.1.7 rk_pcie_boot_deinit



**Beschreibung**

 PCIe BOOT deinitialisieren. 

**Syntax**



```text
int rk_pcie_boot_deinit(RK_PCIE_HANDLES handles)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Normal |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**

 rk_pcie_boot_init 

**Verwandte Themen**

 rk_pcie_boot_init

#### 1.1.8 rk_pcie_boot_download_firmware



**Beschreibung**

 PCIE BOOT-Firmware herunterladen. 

**Syntax**



```text
int rk_pcie_boot_download_firmware(RK_PCIE_HANDLES handles, unsigned char *firmware, size_t
firmware_size, unsigned long remote_load_addr)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| firmware | Firmwaredaten | Eingabe |
| firmware_size | Firmwaregröße | Eingabe |
| remote_load_addr | Ladeadresse der entfernten Firmware | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Normal |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



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



**Verwandte Themen**

 rk_ep_download_firmware

#### 1.1.9 rk_pcie_boot_run



**Beschreibung**

 PCIe BOOT-Firmware starten. 

**Syntax**



```text
int rk_pcie_boot_run(RK_PCIE_HANDLES handles)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Normal |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**

 rk_pcie_boot_init 

**Verwandte Themen**

 rk_pcie_boot_run

#### 1.1.10 rk_pcie_get_ep_info



**Beschreibung**

 EP-Statusinformationen abrufen, maximal 96KB. 

**Syntax**



```text
int rk_pcie_get_ep_info(RK_PCIE_HANDLES handles, void *status, size_t status_size)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| status | void-Zeiger, Statusstruktur vom Benutzer definiert | Ausgabe |
| status_size | Größe der Statusstruktur | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Normal |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_get_ep_info

#### 1.1.11 rk_pcie_get_user_cmd



**Beschreibung**

 Speicherzeiger an einer bestimmten BAR0-Position für benutzerdefinierte Befehle abrufen, maximal 256KB. 

**Syntax**



```text
void *rk_pcie_get_user_cmd(RK_PCIE_HANDLES handles)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |



**Rückgabewert**



| Rückgabewert | Beschreibung |
| --- | --- |
| Nicht NULL | Erfolg, Zeiger auf benutzerdefinierten Befehlsbereich |
| NULL | Fehler |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_get_user_cmd

#### 1.1.12 rk_pcie_get_buff



**Beschreibung**

 Verfügbaren PCIe-Puffer abrufen. 

**Syntax**



```text
struct pcie_buff_node *rk_pcie_get_buff(RK_PCIE_HANDLES handles, int task_id, enum
EBuff_Type type)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| task_id | Task-ID | Eingabe |
| type | PCIE-Puffertyp | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| Nicht NULL | Zeiger auf verfügbaren Puffer |
| NULL | Kein Zeiger auf verfügbaren Puffer |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_release_buff

#### 1.1.13 rk_pcie_send_buff



**Beschreibung**

 PCIE-Puffer senden und bis zum DMA-Abschluss blockieren. 

**Syntax**



```text
int rk_pcie_send_buff(RK_PCIE_HANDLES handles, int task_id, struct pcie_buff_node *pbuff)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| task_id | Task-ID | Eingabe |
| pbuff | PCIE-Pufferzeiger | Eingabe |



**Rückgabewert**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich gesendet: Daten per DMA übertragen. |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_send_buff

#### 1.1.14 rk_pcie_get_bar1_user_buffer



**Beschreibung**

 Virtuelle Mapping-Adresse von bar1 abrufen. 

**Syntax**



```text
void *rk_pcie_get_bar1_user_buffer(RK_PCIE_HANDLES handles)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Handle aller passenden Geräte | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| void * | Virtuelle Adresse |
| NULL | Fehler; siehe Fehlercodes |

#### 1.1.15 rk_pcie_get_bar5_user_buffer



**Beschreibung**

 Virtuelle Mapping-Adresse von bar1 abrufen. 

**Syntax**



```text
void *rk_pcie_get_bar5_user_buffer(RK_PCIE_HANDLES handles)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Handle aller passenden Geräte | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| void * | Virtuelle Adresse |
| NULL | Fehler; siehe Fehlercodes |

#### 1.1.16 rk_pcie_set_bar_inbound_cpu_addr



**Beschreibung**

 Eingehendes BAR-Mapping einstellen. 

**Syntax**



```text
u_int64_t rk_pcie_set_bar_inbound_cpu_addr(RK_PCIE_HANDLES handles, u_int32_t atu_index,
u_int64_t cpu_address, u_int32_t size)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Handle aller passenden Geräte | Eingabe |
| atu_index | ATU-Index | Eingabe |
| cpu_address | Abgebildete CPU-Adresse | Eingabe |
| size | Größenbegrenzung des Mappings | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| cpu_address | Gibt CPU-Adresse zurück |

#### 1.1.17 rk_pcie_release_buff



**Beschreibung**

 PCIE-Puffer freigeben. 

**Syntax**



```text
int rk_pcie_release_buff(RK_PCIE_HANDLES handles, int task_id, struct pcie_buff_node *pbuff)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Handle aller passenden Geräte | Eingabe |
| task_id | Task-ID | Eingabe |
| pbuff | PCIE-Pufferzeiger | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich freigegeben |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**

 rk_pcie_get_buff 

**Verwandte Themen**

 rk_pcie_release_buff

#### 1.1.18 rk_pcie_get_buff_max_size



**Beschreibung**

 Maximal unterstützte Puffergröße abrufen. 

**Syntax**



```text
long rk_pcie_get_buff_max_size(RK_PCIE_HANDLES handles, int task_id, enum EBuff_Type type)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Handle aller passenden Geräte | Eingabe |
| task_id | Task-ID | Eingabe |
| type | PCIE-Puffertyp | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| Größer oder gleich 0 | Puffergröße |
| Kleiner als 0 | Fehler; siehe Fehlercodes |



**Beispiel**



```text
long buffer_size = rk_pcie_get_buff_max_size(ctx->rk_handle, ctx->task_id, E_SEND);
```



**Verwandte Themen**

 rk_pcie_get_buff_max_size

#### 1.1.19 rk_pcie_get_ep_mode



**Beschreibung**

 Aktuellen EP-Modus abrufen: loader, kernel, application und weitere. Modusdefinitionen stehen in rk_pcie_rc.h. 

**Syntax**



```text
int rk_pcie_get_ep_mode(RK_PCIE_HANDLES handles, struct pcie_dev_mode *devmode)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| devmode | Gerätemodusstruktur | Ausgabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_get_ep_mode

#### 1.1.20 PCI-Geräte erneut scannen



**Beschreibung**

 PCI-Geräte des Systems erneut scannen. Zur Wiederherstellung nach abnormalem EP-Neustart das Gerät entfernen und anschließend erneut scannen. 

**Syntax**



```text
void rk_pcie_rescan_devices(void)
```



**Parameter**



Keine 

**Rückgabewert**

 Keine 

**Beispiel**

 Keine 

**Verwandte Themen**

 rk_pcie_rescan_devices

#### 1.1.21 rk_pcie_send_msg_to_ep_bus



**Beschreibung**

 Nachricht zum EP senden, maximal 1504Bytes je Nachricht. 

**Syntax**



```text
int rk_pcie_send_msg_to_ep_bus(RK_PCIE_HANDLES handles, int task_id, void *data, size_t
size)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| task_id | Task-ID | Eingabe |
| data | Nachrichtenzeiger | Eingabe |
| size | Nachrichtenlänge | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_send_msg_to_ep_bus

#### 1.1.22 rk_pcie_get_msg_for_task_id



**Beschreibung**

 EP-Nachrichten anhand der Task-ID abrufen. 

**Syntax**



```text
int rk_pcie_get_msg_for_task_id(RK_PCIE_HANDLES handles, struct pcie_task_msg_st *msg, int
task_id, int timeout_ms)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| msg | Zeiger auf Nachrichtenstruktur | Ausgabe |
| task_id | Task-ID | Eingabe |
| timeout_ms | Timeout in ms; -1 bedeutet blockierendes unbegrenztes Warten im Kernel (nicht empfohlen). Empfohlen: 100ms. | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_get_msg_for_task_id

#### 1.1.23 rk_pcie_get_ep_obj_info



**Beschreibung**

 Grundinformationen des EP-Geräts abrufen. 

**Syntax**



```text
int rk_pcie_get_ep_obj_info(RK_PCIE_HANDLES handles, struct pcie_ep_obj_info_for_user *info)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| info | Puffer für Grundinformationen | Ausgabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



```text
struct pcie_ep_obj_info_for_user info;
ret = rk_pcie_get_msg_for_task_id(rc_ctx.rk_handle, &info);
if (ret == RK_PCIE_OK) {
    return ret;
}
```

#### 1.1.24 rk_pcie_get_ep_err_event_count



**Beschreibung**

 PCIe EP-Fehlerereigniszähler abrufen. 

**Syntax**



```text
int rk_pcie_get_ep_err_event_count(RK_PCIE_HANDLES handles, struct pcie_err_event_count
*info)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |
| info | PCIe-Fehlerereigniszähler | Ausgabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



```text
struct pcie_err_event_count info;
ret = rk_pcie_get_ep_err_event_count(rc_ctx.rk_handle, &info);
if (ret == RK_PCIE_OK) {
    return ret;
}
```

#### 1.1.25 rk_pcie_is_alive



**Beschreibung**

 PCIe-Verbindungszustand prüfen. 

**Syntax**



```text
int rk_pcie_is_alive(RK_PCIE_HANDLES handles);
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| cc_true | Verbindung normal |
| cc_false | Verbindung fehlerhaft |



**Beispiel**



```text
ret = rk_pcie_is_alive(rc_ctx.rk_handle);
if (!ret) {
    printf("PCIe link down\n");
    return ret;
}
```

#### 1.1.26 rk_pcie_device_hardware_reset



**Beschreibung**

 Benutzerdefinierte Kerneltreiberschnittstelle für Hardware-Reset. Der Gerätetreiber muss ioctl PCIE_EP_RESET_CTRL implementieren. Dabei wird PERST# zum Hardware-Reset des EP angesteuert. 

**Syntax**



```text
int rk_pcie_device_hardware_reset(RK_PCIE_HANDLES handles);
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| handles | Gerätehandle | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Reset erfolgreich |
| Ungleich null | Reset fehlgeschlagen oder nicht unterstützt; siehe Fehlercodes |



**Beispiel**

 Vor dem Reset alle PCIe-Transaktionen anhalten. Beispiel:

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

#### 1.1.27 Datentypen

PCIE RC-Datentypen und -strukturen: RK_PCIE_HANDLES: Definiert das Gerätehandle. EBuff_Type: Definiert den PCIE-Puffertyp. ETask_Msg_Type: Definiert den Task-Nachrichtentyp. struct pcie_buff_node: Definiert PCIE-Pufferattribute. struct pcie_dev_bus: Definiert PCI-Gerätebusinformationen.

struct pcie_dev_mode: Definiert den PCIE EP-Modus. struct pcie_dev_attr_st: Definiert PCIE EP-Geräteattribute. struct pcie_task_attr_st: Definiert Task-Attribute. struct pcie_task_msg_st: Definiert die Task-Nachrichtenstruktur. struct pcie_ep_obj_info_for_user: Definiert PCIe-Grundinformationen. struct pcie_err_event_count: Definiert PCIe-Fehlerereignisinformationen.

##### 1.1.27.1 RK_PCIE_HANDLES



**Beschreibung**

 Definiert das Gerätehandle. 

**Definition**



```text
typedef void* RK_PCIE_HANDLES;
```

##### 1.1.27.2 EBuff_Type



**Beschreibung**

 Definiert die PCIE-Puffertypen. 

**Definition**



```text
enum EBuff_Type {
    E_SEND = 0,
    E_RECV,
};
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| E_SEND | Sendepuffer. |
| E_RECV | Empfangspuffer. |

##### 1.1.27.3 ETask_Msg_Type



**Erläuterung**

 Definiert die PCIE-Nachrichtentypen. 

**Definition**



```text
enum ETask_Msg_Type {
    E_TASK_MSG_NONE = 0,
    E_TASK_MSG_CREATE,
    E_TASK_MSG_DESTROY,
    E_TASK_MSG_USER,
    E_TASK_MSG_MAX,
};
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| E_TASK_MSG_NONE | Standardwert, ohne Bedeutung. |
| E_TASK_MSG_CREATE | Task-Erstellung. |
| E_TASK_MSG_DESTROY | Task-Zerstörung. |
| E_TASK_MSG_USER | Benutzerdefinierte Nachricht. |
| E_TASK_MSG_MAX | Maximaler Nachrichtentyp. |

##### 1.1.27.4 PCIe-Pufferknoten



**Erläuterung**

 Definiert die PCIE-Pufferattributstruktur. 

**Definition**



```text
struct pcie_buff_node{
    void *vir_addr;
    size_t phy_addr;
    size_t size;
};
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| vir_addr | Virtuelle Adresse. |
| phy_addr | Physische Adresse. |
| size | Speichergröße: Beim Senden setzt der Benutzer die Datenmenge höchstens auf die Pufferkapazität; beim Empfang ist es die Datenmenge der Gegenseite. |

##### 1.1.27.5 PCIe-Gerätebus



**Erläuterung**

 Definiert PCI-Gerätebusinformationen. 

**Definition**



```text
struct pcie_dev_bus {
    int dev_max_num;
    char pci_bus_address[PCI_DEV_MAX][PCI_BUS_MAX_NAME];
};
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| dev_max_num | Anzahl passender Geräte im System. |
| pci_bus_address | Busadresse der PCI-Geräte. |

##### 1.1.27.6 PCIe EP-Gerätemodus



**Beschreibung**

 Definiert den PCIe EP-Gerätemodus. 

**Definition**



```text
struct pcie_dev_mode {
    unsigned short mode;
    unsigned short submode;
};
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| mode | Aktueller EP-Modus:<br>#define RKEP_MODE_BOOTROM 1<br>#define RKEP_MODE_LOADER 2<br>#define RKEP_MODE_KERNEL 3<br>#define RKEP_MODE_FUN0 4<br>#define RKEP_MODE_ERR 0xffff //Device exception requires reload |
| submode | EP-Modusstatus:<br>#define RKEP_SMODE_INIT 0<br>#define RKEP_SMODE_LNKRDY 1<br>#define RKEP_SMODE_LNKUP 2<br>#define RKEP_SMODE_FWDLRDY 0x10<br>#define RKEP_SMODE_FWDLDONE 0x11<br>#define RKEP_SMODE_APPRDY 0x20<br>#define RKEP_SMODE_APPDEINIT 0x21<br>#define RKEP_SMODE_ERR 0xffff |

##### 1.1.27.7 pcie_dev_attr_st



**Beschreibung**

 Definiert die PCIE EP-Geräteattributstruktur. 

**Definition**



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



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| vendor_id | Hersteller-ID des EP. |
| device_id | Geräte-ID des EP. |
| pci_bus_address | Busadresse des EP. |
| using_rc_dma | Bei RK-Verbindungen nutzt dieser Modus RC-DMA zur Geschwindigkeitssteigerung. Bei mehreren EPs deaktivieren und EP-DMA verwenden. |
| rc_dma_chn | RC-DMA unterstützt zwei Kanäle: 0/1. |
| enable_speed | Geschwindigkeitsstatistik aktivieren; cat /tmp/pcie_debug* zeigt die gesamte EP-Übertragungsrate. |
| use_dma_only_in_rc | DMA nur auf RC-Seite zum Senden und Empfangen aufrufen. |

##### 1.1.27.8 PCIe-Task-Attributstruktur



**Beschreibung**

 Definiert die PCIe-Task-Attributstruktur. 

**Definition**



```text
struct pcie_task_attr_st {
    int wait_timeout_ms;
    unsigned int send_buff_num;
    size_t send_buff_size;
    unsigned int recv_buff_num;
    size_t recv_buff_size;
};
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| wait_timeout_ms | Schnittstellen-Timeout; -1 für blockierenden Modus. |
| send_buff_num | Anzahl umlaufender PCIE-Sendepuffer. |
| send_buff_size | Größe des Sendepuffers. |
| recv_buff_num | Anzahl umlaufender PCIE-Empfangspuffer. |
| recv_buff_size | Größe des Empfangspuffers. |

##### 1.1.27.9 pcie_task_msg_st



**Beschreibung**

 Definiert die PCIE-Task-Nachrichtenstruktur. 

**Definition**



```text
struct pcie_task_msg_st {
    enum ETask_Msg_Type type;
    int task_id;
    size_t size;
    char lock;
    unsigned char data[TASK_MSG_DATA_SIZE];
};
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| type | Nachrichtentyp. |
| task_id | Task-ID. |
| size | Nachrichtenlänge. |
| lock | Reserviert. |
| data | Nachrichteninhalt. |

##### 1.1.27.10 pcie_ep_obj_info_for_user



**Beschreibung**

 Definiert die PCIE-Grundinformationsstruktur. 

**Definition**



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



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| magic | Chips Connect-Magic, 32 Bit, Standard 0x524B4550; vom EP-Kerneltreiber gesetzt |
| rc_cc_version | Chips Connect RC-Version, aufsteigender 32-Bit-Zähler; 0x1 entspricht V1 |
| ep_cc_version | Chips Connect EP-Version, aufsteigender 32-Bit-Zähler; 0x1 entspricht V1 |
| func_drv_version | PCIe-Treiberversion: 32 Bit, oberste 8 reserviert, übrige 8-Bit-Gruppen bilden Versionsbestandteile; 0x00030100 entspricht V3.1.0 |
| vid | PCI-Hersteller-ID, 16 Bit |
| did | PCI-Geräte-ID, 16 Bit |
| sub_vid | Subsystem-Hersteller-ID, 16 Bit |
| sub_did | Subsystem-Geräte-ID, 16 Bit |

##### 1.1.27.11 pcie_err_event_count



**Beschreibung**

 Definiert die PCIe-Fehlerereigniszählerstruktur. 

**Definition**



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



**Felder**



| Feldname | Abkürzung | Beschreibung |
| --- | --- | --- |
| ebuf_overflow | EBUF Overflow | - |
| ebuf_under_run | EBUF Under-run | - |
| decode_error | Decode Fehler | Paketdecodierungsfehler, Signalfehler |
| running_disparity_error | Running Disparity Fehler | Disparitätsfehler in 8b/10b, Gen2-Signalfehler |
| skp_os_parity_error | SKP OS Parity Fehler | SKP-Paritätsfehler, Gen3-Signalfehler |
| sync_header_error | SYNC Header Fehler | Synchronisationsheaderfehler, Signalproblem |
| ctl_skp_os_parity_error | CTL SKP OS Parity Fehler | Paritätsfehler der gesteuerten SKP-Sequenz, Gen3-Signalfehler |
| detect_ei_infer | Detect EI Infer | Signalübersprechen erkannt |
| receiver_error | Receiver Fehler | Empfängerfehler |
| rx_recovery_request | Rx Recovery Request | RX empfängt Peripherieanforderung für recovery zur Signalkorrektur |
| n_fts_timeout | N_FTS Timeout | n_FTS der Peripherie entspricht nicht dem Standard; fehlerhafter Übergang L0s → L0 führt zu recovery |
| framing_error | Framing Fehler | Rahmendecodierungsfehler, Signalfehler |
| deskew_error | Deskew Fehler | Deskew-Fehler, Signalfehler |
| bad_tlp | BAD TLP | Fehlerhaftes TLP empfangen |
| lrc_error | LCRC Fehler | Link-CRC-Fehler, Signalfehler |
| bad_dllp | BAD DLLP | Fehlerhaftes DLLP, Signalfehler |
| replay_number_rollover | Replay Number Rollover | Wiederholungspakete überlaufen den Replay-Puffer |
| replay_timeout | Replay Timeout | Timeout bei Wiederholung fehlerhafter Pakete |
| rx_nak_dllp | Rx Nak DLLP | DLLP von downstream empfangen und Zugriff abgelehnt |
| tx_nak_dllp | Tx Nak DLLP | Gesendetes DLLP wurde downstream abgelehnt |
| retry_tlp | Retry TLP | Anzahl erneut gesendeter TLPs als Maß für die Fehlerrate |
| fc_timeout | FC Timeout | Timeout bei Flusskontrollaktualisierung |
| poisoned_tlp | Poisoned TLP | Fehlerhafter TLP-Typ gemeldet, möglicherweise Linkfehler oder RAM-Bitflip |
| ecr_error | ECRC Fehler | End-CRC-Fehler, Signalfehler |
| unsupported_request | Unsupported Request | Nicht unterstützter TLP-Anfragetyp empfangen, möglicherweise wegen verweigertem Peripheriezugriff |
| completer_abort | Completer Abort | RC-Anfrage empfangen, interner Fehler erfordert Abbruch des Zugriffs |
| completion_timeout | Completion Timeout | Timeout beim Lesen von Peripherieressourcen und bei TLP-Antwort |
| redundant_phase | Reservierte Phase | Zählvariable zur Prüfung fortlaufender Statusaktualisierung |

### 1.2 PCIE Windows EP

Windows-Treiber stellen Anwendungen folgende ioctl-Funktionen bereit:

| ioctl | Funktionsbeschreibung |
| --- | --- |
| IOCTL_RKEP_DOWNLOAD_FIRMWARE | Firmware zum EP übertragen |
| IOCTL_RKEP_BOOT_RUN | EP nach Firmwareübertragung starten |
| IOCTL_RKEP_CREATE_TASK | Task erstellen |
| IOCTL_RKEP_DESTROY_TASK | Task freigeben |
| IOCTL_RKEP_SEND_BUF | Puffer zum EP senden |
| IOCTL_RKEP_GET_BUF | Pufferdaten vom EP abrufen |
| IOCTL_RKEP_GET_EP_MODE | Aktuellen EP-Modus abrufen |
| IOCTL_RKEP_SEND_MSG_TO_EP_BUS | Nachrichtenereignis zum EP senden |
| IOCTL_RKEP_GET_MSG_FOR_TASK_ID | Nachrichtenereignis vom EP empfangen |

#### 1.2.1 Datentypen

PCIE RC-Datentypen und -strukturen: RK_PCIE_TASK_ATTR: Definiert Task-Attribute. RK_PCIE_DESTROY_TASK: Struktur zur Task-Freigabe.

RK_PCIE_IOCTL_STATUS: Definiert die PCIE-ioctl-Aufrufstatusstruktur. RK_PCIE_TASK_MSG: Definiert die Task-Nachrichtenstruktur. RK_PCIE_BUFF_NODE: Definiert die PCIE EP BUF-Struktur. RK_PCIE_DEV_MODE: Definiert die PCIE EP-Modusstruktur. RK_PCIE_TASK_INFO: Definiert die Task-Informationsstruktur. RK_PCIE_DOWNLOAD_FIRMWARE: Definiert die Firmwaredownload-Struktur.

##### 1.2.1.1 RK_PCIE_TASK_ATTR



**Beschreibung**

 Definiert die PCIE-Task-Attributstruktur. 

**Definition**



```text
typedef struct _RK_PCIE_TASK_ATTR {
    int WaitTimeoutMs;
    int SendBuffNum;
    int SendBuffSize;
    int RecvBuffNum;
    int RecvBuffSize;
}  RK_PCIE_TASK_ATTR, *PRK_PCIE_TASK_ATTR;
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| WaitTimeoutMs | Schnittstellen-Timeout; blockierender Modus nicht unterstützt. |
| SendBuffNum | Anzahl umlaufender PCIE-Sendepuffer. |
| SendBuffSize | Größe des Sendepuffers. |
| RecvBuffNum | Anzahl umlaufender PCIE-Empfangspuffer. |
| RecvBuffSize | Größe des Empfangspuffers. |

##### 1.2.1.2 RK_PCIE_DESTROY_TASK



**Beschreibung**

 Definiert die Struktur zum Freigeben einer PCIE Task. 

**Definition**



```text
typedef struct _RK_PCIE_DESTROY_TASK {
    int TaskID;
}  RK_PCIE_DESTROY_TASK, *PRK_PCIE_DESTROY_TASK;
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| TaskID | ID der freizugebenden Task |

##### 1.2.1.3 RK_PCIE_IOCTL_STATUS



**Beschreibung**

 Definiert die PCIE-ioctl-Aufrufstatusstruktur. 

**Definition**



```text
typedef struct _RK_PCIE_IOCTL_STATUS {
    int Status;
    char Data[0];
} RK_PCIE_IOCTL_STATUS, *PRK_PCIE_IOCTL_STATUS;
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| Status | ioctl-Rückgabewert; siehe enum _RK_PCIE_RET |
| Daten | Von ioctl zurückgegebene Daten |

##### 1.2.1.4 RK_PCIE_TASK_MSG



**Beschreibung**

 Definiert die Task-Nachrichtenstruktur. 

**Definition**



```text
typedef struct _RK_PCIE_TASK_MSG {
    int TaskID;
    int Size;
    char Data[TASK_MSG_DATA_SIZE];
} RK_PCIE_TASK_MSG, *PRK_PCIE_TASK_MSG;
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| TaskID | Task-ID |
| Größe | Nachrichtenlänge, maximal 1504 Bytes |
| Daten | Nachrichteninhalt |

##### 1.2.1.5 RK_PCIE_BUFF_NODE



**Beschreibung**

 Definiert die PCIE EP BUF-Struktur. 

**Definition**



```text
typedef struct _RK_PCIE_BUFF_NODE {
    int Size;
    int TaskID;
    int TimeOut10Ms;
    char Reserved[52];  // 64 = 52 + 4 + 4 + 4
    char Data[0];
} RK_PCIE_BUFF_NODE, *PRK_PCIE_BUFF_NODE;
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| Größe | Datenlänge |
| TaskID | Task-ID |
| TimeOut10Ms | Schnittstellen-Timeout ohne blockierenden Modus, kleinste Einheit 10ms. |
| Reserviert | Reservierte Größe |
| Daten | Daten |

##### 1.2.1.6 RK_PCIE_DEV_MODE



**Beschreibung**

 Definiert die Struktur des PCIE EP-Gerätemodus. 

**Definition**



```text
typedef struct _RK_PCIE_DEV_MODE {
    unsigned short Mode;
    unsigned short SubMode;
} RK_PCIE_DEV_MODE, *PRK_PCIE_DEV_MODE;
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| Modus | Aktueller EP-Modus:<br>#define RKEP_MODE_BOOTROM 1<br>#define RKEP_MODE_LOADER 2<br>#define RKEP_MODE_KERNEL 3<br>#define RKEP_MODE_FUN0 4<br>#define RKEP_MODE_ERR 0xffff //Device exception, reload required |
| SubMode | EP-Modusstatus:<br>#define RKEP_SMODE_INIT 0<br>#define RKEP_SMODE_LNKRDY 1<br>#define RKEP_SMODE_LNKUP 2<br>#define RKEP_SMODE_FWDLRDY 0x10<br>#define RKEP_SMODE_FWDLDONE 0x11<br>#define RKEP_SMODE_APPRDY 0x20<br>#define RKEP_SMODE_APPDEINIT 0x21<br>#define RKEP_SMODE_ERR 0xffff |

##### 1.2.1.7 RK_PCIE_TASK_INFO



**Beschreibung**

 Definiert die Task-Informationsstruktur. 

**Definition**



```text
typedef struct _RK_PCIE_TASK_INFO {
    int TaskID;
} RK_PCIE_TASK_INFO, *PRK_PCIE_TASK_INFO;
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| TaskID | Task-ID |

##### 1.2.1.8 RK_PCIE_DOWNLOAD_FIRMWARE



**Beschreibung**

 Definiert die Firmwaredownload-Struktur. 

**Definition**



```text
typedef struct _RK_PCIE_DOWNLOAD_FIRMWARE {
    size_t RemoteLoadAddr;
    size_t Size;
    char Data[0];
} RK_PCIE_DOWNLOAD_FIRMWARE, *PRK_PCIE_DOWNLOAD_FIRMWARE;
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| RemoteLoadAddr | EP-Speicheradresse |
| Größe | Firmwarelänge |
| Daten | Firmwareinhalt |

### 1.3 PCIE-Endpunkt

#### 1.3.1 rk_pcie_device_init



**Beschreibung**

 Initialisiert das PCIe-Gerät. 

**Syntax**



```text
int rk_pcie_device_init(void)
```



**Parameter**

 Keine 

**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_device_deinit

#### 1.3.2 rk_pcie_device_deinit



**Beschreibung**

 PCIe deinitialisieren, Ressourcen freigeben. 

**Syntax**



```text
int rk_pcie_device_deinit(void)
```

#### 1.3.3 rk_pcie_task_create



**Beschreibung**

 Task erstellen, Speicher und BUFF-Verwaltung initialisieren. 

**Syntax**



```text
int rk_pcie_task_create(int task_id)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| task_id | Task-ID, per Nachricht vom RC übermittelt | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**

 Siehe Beispiel unter rk_pcie_device_init. 

**Verwandte Themen**

 rk_pcie_device_deinit

#### 1.3.4 rk_pcie_task_destroy



**Beschreibung**

 Task deinitialisieren, Speicher, BUFF-Verwaltung und weitere Ressourcen freigeben. 

**Syntax**



```text
int rk_pcie_task_destroy(int task_id)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| task_id | Task-ID | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**

 Siehe Beispiel unter rk_pcie_device_init. 

**Verwandte Themen**

 rk_pcie_device_init

#### 1.3.5 rk_pcie_set_ep_info



**Beschreibung**

 EP-Statusinformationen setzen. 

**Syntax**



```text
int rk_pcie_set_ep_info(void *status, size_t status_size)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| status | void-Zeiger, Statusstruktur vom Benutzer definiert | Eingabe |
| status_size | Größe der Statusstruktur | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_get_ep_info

#### 1.3.6 rk_pcie_get_user_cmd



**Beschreibung**

 Zeiger auf einen BAR0-Bereich für benutzerdefinierte Befehle abrufen. 

**Syntax**



```text
void *rk_pcie_get_user_cmd(void)
```



**Parameter**

 Keine 

**Rückgabewert**



| Rückgabewert | Beschreibung |
| --- | --- |
| Nicht NULL | Erfolg, Speicherzeiger auf benutzerdefinierten Befehlsbereich |
| NULL | Fehler |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_get_user_cmd

#### 1.3.7 rk_pcie_get_bar1_user_buffer



**Beschreibung**

 Virtuelle Mapping-Adresse von bar1 abrufen. 

**Syntax**



```text
void *rk_pcie_get_bar1_user_buffer(void)
```



**Parameter**

 Keine. 

**Rückgabewert**



| Rückgabewert | Beschreibung |
| --- | --- |
| void * | Virtuelle Adresse |
| NULL | Fehler; siehe Fehlercodes |

#### 1.3.8 rk_pcie_get_bar5_user_buffer



**Beschreibung**

 Virtuelle Mapping-Adresse von bar1 abrufen. 

**Syntax**



```text
void *rk_pcie_get_bar5_user_buffer(void)
```



**Parameter**



Keine. 

**Rückgabewert**



| Rückgabewert | Beschreibung |
| --- | --- |
| void * | Virtuelle Adresse |
| NULL | Fehler; siehe Fehlercodes |

#### 1.3.9 rk_pcie_set_bar_inbound_cpu_addr



**Beschreibung**

 Eingehendes BAR-Mapping einstellen. 

**Syntax**



```text
u_int64_t rk_pcie_set_bar_inbound_cpu_addr(u_int32_t atu_index, u_int64_t cpu_address,
u_int32_t size)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| atu_index | ATU-Index | Eingabe |
| cpu_address | Abgebildete CPU-Adresse | Eingabe |
| size | Größenbegrenzung des Mappings | Eingabe |



**Rückgabewert**



| Rückgabewert | Beschreibung |
| --- | --- |
| cpu_address | Gibt CPU-Adresse zurück |

#### 1.3.10 rk_pcie_get_buff



**Beschreibung**

 Verfügbaren PCIE-Puffer abrufen. 

**Syntax**



```text
struct pcie_buff_node *rk_pcie_get_buff(int task_id, enum EBuff_Type type)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| task_id | Task-ID | Eingabe |
| type | PCIE-Puffertyp | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| Nicht NULL | Zeiger auf verfügbaren Puffer |
| NULL | Kein verfügbarer Puffer |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_send_buff

#### 1.3.11 rk_pcie_send_buff



**Beschreibung**

 PCIE-Puffer senden. 

**Syntax**



```text
int rk_pcie_send_buff(int task_id, struct pcie_buff_node *pbuff)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| task_id | Task-ID | Eingabe |
| pbuff | PCIE-Pufferzeiger | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich gesendet |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**

 rk_pcie_get_buff 

**Verwandte Themen**

 rk_pcie_get_buff

#### 1.3.12 rk_pcie_release_buff



**Beschreibung**

 PCIE-Puffer freigeben. 

**Syntax**



```text
int rk_pcie_release_buff(int task_id, struct pcie_buff_node *pbuff)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| task_id | Task-ID | Eingabe |
| pbuff | PCIE-Pufferzeiger | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolgreich freigegeben |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**



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



**Verwandte Themen**

 rk_pcie_release_buff

#### 1.3.13 rk_pcie_get_buff_max_size



**Beschreibung**

 Maximal unterstützte Puffergröße abrufen. 

**Syntax**



```text
long rk_pcie_get_buff_max_size(int task_id, enum EBuff_Type type)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| task_id | Task-ID | Eingabe |
| type | PCIE-Puffertyp | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| Größer oder gleich 0 | Puffergröße |
| Kleiner als 0 | Fehler; siehe Fehlercodes |



**Beispiel**



```text
long buffer_size = rk_pcie_get_buff_max_size(ctx->task_id, E_SEND);
```



**Verwandte Themen**

 rk_pcie_get_buff_max_size

#### 1.3.14 rk_pcie_get_msg_for_bus



**Beschreibung**

 Auf eine RC-Nachricht warten. 

**Syntax**



```text
int rk_pcie_get_msg_for_bus(struct pcie_task_msg_st *msg, int timeout_ms)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| timeout_ms | Timeout in ms; -1 bedeutet blockierendes unbegrenztes Warten im Kernel (nicht empfohlen). Empfohlen: 100ms. | Eingabe |



**Rückgabewerte**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**

 Siehe Beispiel unter rk_pcie_device_init. 

**Verwandte Themen**

 rk_pcie_device_deinit

#### 1.3.15 rk_pcie_send_msg_to_rc_task



**Beschreibung**

 Nachricht zum RC senden. 

**Syntax**



```text
int rk_pcie_send_msg_to_rc_task(int task_id, void *data, size_t size)
```



**Parameter**



| Parametername | Beschreibung | Eingabe/Ausgabe |
| --- | --- | --- |
| task_id | Task-ID | Eingabe |
| data | Nachrichtenzeiger | Eingabe |
| size | Nachrichtenlänge | Eingabe |



**Rückgabewert**



| Rückgabewert | Beschreibung |
| --- | --- |
| 0 | Erfolg |
| Ungleich null | Fehler; siehe Fehlercodes |



**Beispiel**

 Siehe Beispiel unter rk_pcie_device_init. 

**Verwandte Themen**

 rk_pcie_device_deinit

#### 1.3.16 Datentypen

PCIE RC-Datentypen und -strukturen: EBuff_Type: Definiert den PCIe-Puffertyp. ETask_Msg_Type: Definiert den Task-Nachrichtentyp. struct pcie_buff_node: Definiert PCIe-Pufferattribute. struct pcie_task_msg_st: Definiert Nachrichtenattribute.

##### 1.3.16.1 EBuff_Type



**Beschreibung**

 Definiert die PCIE-Puffertypen. 

**Definition**



```text
enum EBuff_Type {
    E_SEND = 0,
    E_RECV,
};
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| E_SEND | Sendepuffer. |
| E_RECV | Empfangspuffer. |

##### 1.3.16.2 ETask_Msg_Type



**Beschreibung**

 Definiert die Task-Nachrichtentypen. 

**Definition**



```text
enum ETask_Msg_Type {
    E_TASK_MSG_NONE = 0,
    E_TASK_MSG_CREATE,
    E_TASK_MSG_DESTROY,
    E_TASK_MSG_USER,
    E_TASK_MSG_MAX,
};
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| E_TASK_MSG_NONE | Standardwert, ohne Bedeutung |
| E_TASK_MSG_CREATE | Task erstellen |
| E_TASK_MSG_DESTROY | Task zerstören |
| E_TASK_MSG_USER | Benutzerdefinierte Nachricht |
| E_TASK_MSG_MAX | Maximaler Nachrichtentyp |

##### 1.3.16.3 PCIe-Pufferknoten



**Beschreibung**

 Definiert PCIe-Pufferattribute. Änderungen müssen gleichzeitig auf RC und EP erfolgen. 

**Definition**



```text
struct pcie_buff_node {
    void *vir_addr;
    size_t phy_addr;
    size_t size;
};
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| vir_addr | Virtuelle Adresse. |
| phy_addr | Physische Adresse. |
| size | Speichergröße: Beim Senden setzt der Benutzer die Datenmenge höchstens auf die Pufferkapazität; beim Empfang ist es die Datenmenge der Gegenseite. |

##### 1.3.16.4 pcie_task_msg_st



**Beschreibung**

 Definiert Nachrichtenattribute. Die Struktur muss gleichzeitig auf RC und EP geändert werden. 

**Definition**



```text
struct pcie_task_msg_st {
    enum ETask_Msg_Type type;
    int task_id;
    size_t size;
    char lock;
    unsigned char data[TASK_MSG_DATA_SIZE];
};
```



**Felder**



| Feldname | Beschreibung |
| --- | --- |
| type | Nachrichtentyp. |
| task_id | Task-ID. |
| size | Nachrichtenlänge. |
| lock | Reserviert. |
| data | Nachrichteninhalt. |

### 1.4 Fehlercodes

| Fehlercode | Makrodefinition | Beschreibung |
| --- | --- | --- |
| -1 | RK_PCIE_ERR_BAD | Fehlerhafte PCIE-Verbindung |
| -2 | RK_PCIE_ERR_UNKNOWN | Systemfehler |
| -3 | RK_PCIE_ERR_NULL_PTR | Nullzeigerfehler |
| -4 | RK_PCIE_ERR_MALLOC | Speicherzuweisungsfehler |
| -5 | RK_PCIE_ERR_OPEN_FILE | Dateiöffnungsfehler |
| -6 | RK_PCIE_ERR_VALUE | Fehlerwert |
| -8 | RK_PCIE_ERR_TIMEOUT | Timeout-Rückgabe |
| -10 | RK_PCIE_ERR_UNSUPPORT | Nicht unterstützte Funktion |
| -13 | RK_PCIE_ERR_HW_UNSUPPORT | Hardware nicht unterstützt |
| -15 | RK_PCIE_ERR_MMAP | mmap-Fehler |
| -65 | RK_PCIE_ERR_INIT | Initialisierungsfehler |
| -66 | RK_PCIE_ERR_NOINIT | System nicht initialisiert |
| -68 | RK_PCIE_ERR_NOMEM | Zu wenig Speicher |
| -69 | RK_PCIE_ERR_OUTOF_RANGE | Parameter außerhalb des Bereichs |

{% endraw %}

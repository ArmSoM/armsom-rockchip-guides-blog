---
title: "RKNN2 SDK V2.5.0 · Bereitstellung verschlüsselter Modelle"
description: "RKNN2 SDK V2.5.0 · Bereitstellung verschlüsselter Modelle · Vollständige Entwicklerhandbuchreihe"
excerpt: "Bereitstellung verschlüsselter Modelle"
translation_key: "rknn-v250-sdk-guide-encryption"
slug: "rknn-v250-sdk-guide-encryption"
lang: "de"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

Plattformreferenz nach dem Rockchip RKNN2 SDK Development Guide V2.5.0. Erfasst werden nur die im Original genannten SoCs sowie Linux-/Android-Runtime- und Toolkit-Kombinationen. Funktionen gelten unter den jeweiligen Chip-, SDK-, Treiber- und Kernelbedingungen und nicht automatisch für jedes ArmSoM-Board. Prüfen Sie vor der Bereitstellung BSP, NPU-Treiber, Runtime und Modellversion des konkreten Boards. Es erfolgte keine ArmSoM-Hardwarevalidierung; Protokolle, Leistungswerte und Beispiele stammen aus dem Original.

Quellen und Prüfung: Chinesisch folgt der chinesischen V2.5.0 (182 Seiten); Englisch, Russisch und Deutsch folgen der englischen V2.5.0 (208 Seiten). Quellenspezifische technische Angaben bleiben erhalten; Inhalte älterer Versionen werden nicht als neue Fakten dargestellt. Chinesische Abbildungen stammen aus dem chinesischen PDF, EN/RU/DE-Abbildungen aus dem englischen PDF einschließlich separat extrahierter Vektorflussdiagramme. Abschnitts- und Formelnummern bleiben erhalten. Einige Querverweise verwenden alte Kapitelnummern; Dynamic-Shape-Beispiele enthalten „1224+140=264“, TP_NORM-Aussagen widersprechen sich, und init()/rknn.val_perf() weichen von späteren API-Beschreibungen ab. Diese Quellenprobleme bleiben dokumentiert und sind vor Ausführung anhand der tatsächlichen V2.5.0-Header und API-Referenzen zu prüfen. Code und Parameter bleiben erhalten; PDF-Umbrüche und Tabellenfortsetzungen wurden bereinigt.

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 18/22**

[1. Softwarestack und Grundbegriffe](/de/articles/rknn-v250-sdk-guide-overview/)

[2. Entwicklungsumgebung, Versionen und Board-Anbindung](/de/articles/rknn-v250-sdk-guide-environment/)

[3. Entwicklungsablauf und Schnittstellenwahl](/de/articles/rknn-v250-sdk-guide-workflow/)

[4. Modellkonvertierung und ONNX-Bearbeitung](/de/articles/rknn-v250-sdk-guide-conversion/)

[5. Quantisierung, hybride Quantisierung und QAT](/de/articles/rknn-v250-sdk-guide-quantization/)

[6. Inferenz sowie Genauigkeits-, Leistungs- und Speicherbewertung](/de/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime-Lebenszyklus, Layouts und Speicher](/de/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. Zero-Copy-Schnittstellen und Ein-/Ausgabebedingungen](/de/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C-API-Bereitstellung und Codegenerierung](/de/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Python-Bereitstellung mit Toolkit Lite2](/de/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul-API und Matrixlayouts](/de/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU-Mehrkernkonfiguration und Leistung](/de/articles/rknn-v250-sdk-guide-multicore/)

[13. Modelle mit dynamischen Formen und Bereitstellung](/de/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Inferenz mit mehreren Batches](/de/articles/rknn-v250-sdk-guide-multi-batch/)

[15. NPU-SRAM auf RK3588/RK3576](/de/articles/rknn-v250-sdk-guide-sram/)

[16. Cache-Kohärenz und Sparse-Inferenz](/de/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Benutzerdefinierte Operatoren: Python und C API](/de/articles/rknn-v250-sdk-guide-custom-operators/)

**Bereitstellung verschlüsselter Modelle**

[19. Diagnose von Genauigkeitsproblemen](/de/articles/rknn-v250-sdk-guide-accuracy/)

[20. Leistungsanalyse und Netzwerkoptimierung](/de/articles/rknn-v250-sdk-guide-performance/)

[21. Speicheranalyse, gemeinsame Nutzung und Wiederverwendung](/de/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, Fehlerbehandlung und Referenzen](/de/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.2.2 Verschlüsselte Modelle bereitstellen

Das RKNN-SDK unterstützt Offline-Modellverschlüsselung und Entschlüsselung zur Laufzeit.

Modellverschlüsselung ist nur ein Teil des Schutzes und verhindert Angriffe nicht vollständig. Direkten Zugriff Dritter möglichst vermeiden und den Schutz auf Systemebene verstärken.

Hinweis: Das ältere Verfahren rknn.export_encrypted_rknn_model()/crypt_level bleibt kompatibel, wird aber nicht mehr empfohlen. Das hier beschriebene hybride Verfahren verwenden.

Verwendet wird eine hybride Verschlüsselungsarchitektur:

AES-256-CTR: symmetrische Verschlüsselung des Modellkörpers, leistungsfähig und mit Entschlüsselung per wahlfreiem Zugriff; nur 256bit werden unterstützt.

RSA-OAEP: asymmetrischer Schutz des AES-Schlüssels für sichere Schlüsselverteilung.

Schlüsselsystem:

| Key | Typ | Owner | Purpose |
| --- | --- | --- | --- |
| Benutzerschlüssel | Symmetrischer AES-256-Schlüssel | Vom Benutzer erzeugt | Modellkörper ver-/entschlüsseln |
| RK-Schlüsselpaar | Asymmetrisches RSA-2048-Schlüsselpaar | Von RK vorinstalliert | Öffentlicher Schlüssel verschlüsselt den Benutzerschlüssel; der im Chip eingebaute private Schlüssel entschlüsselt ihn. |

Format der verschlüsselten Datei:

| Offset | Length | Content |
| --- | --- | --- |
| 0 – 63 | 64 Byte | Unverschlüsselter RKNN-Dateiheader; RKCE-Verschlüsselungskennung an Offset 24–47. |
| 64+ | body | Mit AES-256-CTR verschlüsselter Modellkörper |

Schlüssel-Umschlag user_key_iv.enc: RKKE-Header (16 Byte) + RSA-OAEP(AES key ‖ AES IV).

#### 4.2.2.1 VERSCHLÜSSELUNG AUF PC/SERVER

Konvertierungsskript, Beispiele und öffentlicher RK-Schlüssel befinden sich in rknpu2/examples/rknn_encrypt_demo im Projekt rknpu2.

Ein konvertiertes .rknn-Modell mit rknn_model_encrypt.py verschlüsseln:

```text
python3 rknn_model_encrypt.py --model model.rknn \
                                --rk-pubkey rk_public_key.pem \
                                [--output-dir ./encrypted] \
                                [--aes-bits 256]
```

Ausgabedateien:

| File | Beschreibung |
| --- | --- |
| model.rknn | Verschlüsseltes Modell: Klartext-RKNN-Header + RKCE-Kennung + AES-CTR-Chiffrat |
| model_key.bin | RSA-OAEP-verschlüsselter Schlüssel-Umschlag mit RKKE-Header; zusammen mit dem Modell bereitstellen. |

Rockchip stellt den öffentlichen Schlüssel rk_public_key.pem bereit. Ein damit verschlüsselter Benutzerschlüssel kann nur vom im Chip eingebauten privaten RSA-Schlüssel entschlüsselt werden.

#### 4.2.2.2 VERSCHLÜSSELTE MODELLE AUF DEM BOARD LADEN

Zur Laufzeit wird der Schlüssel-Umschlag über rknn_init_extend.user_key übergeben; rknn_init() entschlüsselt intern. Der anschließende Inferenzablauf entspricht einem unverschlüsselten Modell. Laden ist über einen Dateipfad (size=0) oder einen Speicherpuffer möglich.

```text
#include "rknn_api.h"

/* 1. Load the key envelope into memory */
size_t key_env_size = 0;
void* key_env = load_file("model_key.bin", &key_env_size);
if (!key_env) {
    printf("load key envelope failed!\n");
    return -1;
}

/* 2. Pass the key envelope via rknn_init_extend.user_key */
rknn_init_extend init_ext;
rknn_decrypt_key_mem key_mem;
memset(&init_ext, 0, sizeof(rknn_init_extend));
key_mem.key_data = key_env;
key_mem.key_size = (uint32_t)key_env_size;
init_ext.user_key = &key_mem;

/* 3. rknn_init decrypts internally; subsequent usage is the same as a plaintext
model */
rknn_context ctx = 0;
int ret = rknn_init(&ctx, (void*)"model.rknn", 0, 0, &init_ext);
if (ret < 0) {
    if (ret == RKNN_ERR_KEY_INVALID)
        printf("key envelope invalid / RSA unwrap failed\n");
    else if (ret == RKNN_ERR_DECRYPT_FAILED)
        printf("AES-CTR model body decryption failed\n");
    else if (ret == RKNN_ERR_SOC_BIND_FAILED)
        printf("current SoC is not in the bound platform list\n");
    memset(key_env, 0, key_env_size);
    free(key_env);
    return -1;
}

/* 4. The user-side key memory can be released after rknn_init returns */
memset(key_env, 0, key_env_size);
free(key_env);

/* 5. Proceed with the normal inference flow: rknn_query / rknn_inputs_set /
rknn_run / ... */
```

rknn_decrypt_key_mem und der über key_data referenzierte Puffer gehören dem Aufrufer. Die Runtime kopiert den Umschlag innerhalb von rknn_init(); danach kann er freigegeben werden. Vorher den Schlüsselspeicher möglichst mit memset auf 0 setzen, um das Risiko einer Schlüsseloffenlegung zu verringern.

Unterstützte Plattformen: RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B/RV1106/RV1103B

#### 4.2.2.3 KOMPATIBILITÄT VERSCHLÜSSELTER MODELLE MIT EXTERNER SPEICHERZUWEISUNG UND SPEICHERWIEDERVERWENDUNG

Bei Initialisierung sind verschlüsselte Modelle nur mit der Wiederverwendung extern zugewiesenen Internal-Speichers kompatibel. Mit RKNN_FLAG_INTERNAL_ALLOC_OUTSIDE initialisieren und Speicher über rknn_set_internal_mem() setzen. Mehrere Modelle können denselben Internal-Block wiederverwenden. Details siehe „Internal Memory Reuse“ in 5.3.3.

Verschlüsselte Modelle sind mit folgenden Funktionen inkompatibel:

Gemeinsame Gewichte: Initialisierung mit RKNN_FLAG_SHARE_WEIGHT_MEM wird nicht unterstützt.

Externe Gewichtsspeicherzuweisung: rknn_set_weight_mem() wird nicht unterstützt.

Kontextwiederverwendung: rknn_dup_context() wird nicht unterstützt.

{% endraw %}

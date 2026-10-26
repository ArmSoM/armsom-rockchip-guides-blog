---
title: "Rockchip TEE SDK: TrustZone, CA/TA und sicherer Speicher"
description: "Rockchip TEE SDK: TrustZone, CA/TA und sicherer Speicher — V1.16.1."
translation_key: "143-rockchip-tee-sdk"
slug: "143-rockchip-tee-sdk"
lang: "de"
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "production"
products: []
tags: [ArmSoM, Rockchip, TEE, TrustZone, OTP]
excerpt: "Rockchip TEE SDK: TrustZone, CA/TA und sicherer Speicher — V1.16.1."
---

{% raw %}

Vollständiger technischer Inhalt der chinesischen/englischen Originale V1.16.1 (64/69 Seiten). Für ArmSoM konkrete SoC-, SDK/BSP-, OP-TEE-V1/V2-, U-Boot-, Kernel- und Bibliotheksversionen abgleichen; keine Zusage für alle Boards. Android-, Treiber- und Firmwareanforderungen der Quelle bleiben erhalten. Keine ArmSoM-Hardwaretests; Leistungswerte, Befehle und Ausgaben sind Herstellerbeispiele.

> OTP-Programmierung, Schlüsseländerungen, Lebenszyklus- und Sicherheitsstufeneinstellungen können unumkehrbar sein oder Boot-/Datenzugriff verhindern. Chip und Software prüfen, dann auf dedizierten Testgeräten validieren. Keine Programmier-, Sperr-, Schlüssel- oder Sicherheitskonfigurationsoperation wurde ausgeführt. Der Android-/Bedrohungsüberblick beschreibt den historischen Dokumentkontext, nicht alle heutigen Android-Geräte.

> Quellunterschiede: (1) salt_len bei rk_rsa_sign: Chinesisch S.50 „falls nicht vorhanden“, Englisch S.55 „if it is 0“; beide nennen dann die Digestlänge. Die Bedingungen sind nicht gleichwertig; beide bleiben dokumentiert, das Verhalten ist im SDK zu prüfen. (2) Signierbeispiel: Chinesisch RK3588/Android12, Englisch allgemein arm64/OP-TEE V2/Android12. Die konkrete chinesische Plattform bleibt erhalten, ohne den Geltungsbereich auszudehnen. (3) Der chinesische Rollbackabschnitt nennt nur TA in REE FS Klartext; Englisch bezeichnet zusätzlich Secure Storage so. Dieser Artikel folgt Chinesisch und erklärt sicheren Speicher nicht zu Klartextspeicherung. (4) trusted-key-Text nennt key_ctl, das Installationspaket keyutils und Aufrufe keyctl; die Quellnamen bleiben unterscheidbar. (5) In der crypto_aes-Tabelle steht ursprünglich AED; als Quellschreibweise markiert, keine API-Umbenennung.

[ArmSoM Docs](https://docs.armsom.org/) · [OP-TEE](https://optee.readthedocs.io/) · [GlobalPlatform](https://globalplatform.org/)

## 1 Leseleitfaden

Die folgenden Schritte dienen als Leitfaden zum Lesen dieses Dokuments und zur Nutzung von TEE.

1. TEE-Grundlagen kennenlernen: TrustZone-Hardware-/Softwarearchitektur und TEE-Basiswissen lesen.

2. Funktionen bestimmen und konfigurieren. OPTEE-Version: Plattformabschnitt. Sicherheitsstufe: Abschnitt zur wählbaren Sicherheitsstufe. TA-Signaturschlüssel: TA-Signierung. Zusätzlicher TA-Schutz: TA im sicheren Speicher, verschlüsselte TA und REE-FS-TA-Rollbackschutz. Sicherer Speicher/Leistung: Speicherabschnitt. OTP: OTP-Abschnitt.

3. TEE-Umgebung einrichten. Dateisystem des sicheren Speichers: Sicherer Speicher und Parameter.txt. TEE-Firmware aktivieren: Firmwareabschnitt. TEE in U-Boot aktivieren: U-Boot-TEE-Treiber. TEE im Kernel aktivieren: TEE-Linux-Kerneltreiber.

4. CA/TA testen. Umgebung/Projektverzeichnisse: TEE-Bibliotheken, Umgebungskonfiguration, Android und Linux. RK-Demos kennenlernen und bauen: CA/TA-Demos, Android und Linux. Bibliotheken und Demos installieren und testen: Android-/Linux-Abschnitte.

5. CA/TA entwickeln. TA-Debugging im entsprechenden Abschnitt kennenlernen. Entwicklung anhand der Demos und TA-APIs: CA/TA-Demos und TA-API-Beschreibung.

## 2 Einführung in TrustZone

### 2.1 Was ist TrustZone

ARM TrustZone ist ein systemweiter Sicherheitsansatz für leistungsfähige Plattformen, darunter sichere Zahlungen, Digital Rights Management (DRM), Unternehmens- und Webdienste. Die Technik ist eng mit CortexTM-A integriert und wird über AMBA-AXI und spezielle TrustZone-IP-Blöcke im System erweitert. Dadurch lassen sich Speicher, Kryptoblöcke, Tastaturen und Bildschirme gegen Softwareangriffe schützen. Nach dem TrustZone Ready Program entwickelte Geräte bieten eine Plattform für eine vollständige Trusted Execution Environment (TEE) sowie sicherheitsbewusste Anwendungen und Dienste. Smartphones und Tablets sind offene Softwareplattformen geworden, die große Anwendungen aus dem Internet laden. OEMs prüfen deren Qualität, können aber nicht jede Funktion testen; Angreifer entwickeln ständig neue Schadsoftware. Gleichzeitig übernehmen Mobilgeräte wichtige Dienste: zeitlich begrenztes Bezahlen/Ansehen neuer Filme, Fernzahlung von Rechnungen und Bankkontoverwaltung. Diese Geschäftsmodelle machen Telefone zum Ziel von Malware, Trojanern und Rootkits. Fortschrittliche ARM-TrustZone-Sicherheit zusammen mit manipulationsresistenten SecurCoreTM-Elementen ermöglicht funktionsreiche offene Betriebsumgebungen mit starken Sicherheitslösungen. Vertrauenswürdige Anwendungen laufen auf TrustZone-SoCs in einer TEE getrennt vom Hauptbetriebssystem und sind vor Software-/Malwareangriffen geschützt. Der Wechsel in den sicheren Modus bietet Hardwareisolation. Vertrauenswürdige Anwendungen sind üblicherweise voneinander gekapselt, sodass etwa Anwendungen verschiedener Zahlungsanbieter auf einem Gerät koexistieren. TrustZone-Unterstützung gehört zur Grundfunktion aller Cortex-A-Prozessoren und wurde durch ARM-Architektursicherheitserweiterungen eingeführt. Diese liefern ein konsistentes Programmiermodell über Anbieter, Plattformen und Anwendungen hinweg sowie eine tatsächlich hardwaregestützte sichere Umgebung.

### 2.2 TrustZone-Hardware-/Softwarearchitektur

#### 2.2.1 Hardwarearchitektur

Die TrustZone-Hardwarearchitektur bietet einen Sicherheitsrahmen gegen zahlreiche konkrete Bedrohungen, keine starre fertige Lösung. SoC-Entwickler wählen Komponenten für Funktionen in der sicheren Umgebung. Hauptziel ist eine programmierbare Umgebung, die Vertraulichkeit und Integrität von Werten gegen bestimmte Angriffe schützt. Damit lassen sich vielfältige Sicherheitslösungen aufbauen, die mit traditionellen Ansätzen zeit- und arbeitsaufwendig wären.

![Abbildung 1: englische Quelle, Seite 11](/docs/rockchip-tee-sdk/assets/en-p011-figure-01.png)

*Abbildung 1: englische Quelle, Seite 11*

Die Sicherheit entsteht durch Trennung aller SoC-Hardware-/Softwareressourcen in die sichere Welt für das Sicherheitssubsystem und die normale Welt für alles andere. Hardwarelogik im TrustZone-fähigen AMBA3-AXITM-Bus verhindert Zugriffe normaler Komponenten auf sichere Ressourcen und schafft eine starke Grenze. Sensible Ressourcen in der sicheren Welt und zuverlässig dort ausgeführte Software schützen gegen zahlreiche Angriffe, auch schwer abzuwehrende Fälle wie Passworteingabe über Tastatur/Touchscreen. Hardwareisolation sensibler Peripherie reduziert die zu bewertenden Subsysteme und Zertifizierungskosten. Der zweite Aspekt sind Erweiterungen bestimmter ARM-Kerne: Ein physischer Kern führt Code beider Welten sicher und effizient im Zeitscheibenbetrieb aus. Ein dedizierter Sicherheitskern entfällt; Chipfläche und Energie werden gespart, leistungsfähige Sicherheitssoftware läuft neben der normalen Umgebung. Der Kontextwechsel virtueller Prozessoren erfolgt über den neuen Monitormodus. Der Eintritt aus der normalen Welt ist streng kontrolliert und wird als Ausnahme behandelt. Auslöser sind die Secure-Monitor-Call-Instruktion (SMC) oder bestimmte Hardwareausnahmen. IRQ, FIQ, externe Datenabbruch- und Prefetch-Abbruchausnahmen lassen sich für den Wechsel konfigurieren. Monitorsoftware ist implementierungsabhängig; typischerweise speichert sie den aktuellen Weltzustand, stellt den Zielzustand wieder her und setzt über die Ausnahmerückkehr die Ausführung fort. Der letzte Aspekt ist eine sicherheitsbewusste Debug-Infrastruktur, die sicheres Debugging kontrolliert, ohne die Beobachtbarkeit der normalen Welt einzuschränken.

#### 2.2.2 Softwarearchitektur

![Abbildung 2: englische Quelle, Seite 12](/docs/rockchip-tee-sdk/assets/en-p012-figure-01.png)

*Abbildung 2: englische Quelle, Seite 12*

Die sichere Welt benötigt Software zur Nutzung der dort gespeicherten sensiblen Werte. Mögliche Architekturen reichen von einem dedizierten sicheren Betriebssystem bis zu einer synchronen Codebibliothek, mit vielen Zwischenformen. Ein separater sicherer Kernel ist komplex, ermöglicht aber scheinbar gleichzeitige unabhängige Anwendungen, Laufzeit-Downloads neuer Anwendungen und Aufgaben unabhängig von der normalen Welt. Das ähnelt AMP mit zwei physischen Kernen: Jeder virtuelle Prozessor hat ein eigenes Betriebssystem, Hardwareinterrupts verdrängen die andere Welt und verschaffen Prozessorzeit. Enge Integration über ein Kommunikationsprotokoll, das sichere Aufgaben ihren anfordernden normalen Threads zuordnet, bietet viele SMP-Vorteile. Beispielsweise erbt eine sichere Anwendung die Priorität der unterstützten normalen Aufgabe und ermöglicht weiche Echtzeitreaktionen für Medienanwendungen. Die Sicherheitserweiterungen sind ein offener ARM-Architekturbestandteil; Entwickler können daher eigene sichere Softwareumgebungen schaffen.

#### 2.2.3 TrustZone und TEE

Zahlungen, Onlinebanking, Inhaltsschutz und Unternehmensauthentifizierung verbessern Integrität, Funktion und Nutzererlebnis mithilfe dreier TrustZone-Eigenschaften:

1. Sichere Softwareausführungsumgebung gegen Malwareangriffe aus dem umfangreichen Hauptbetriebssystem.

2. Bekannter zuverlässiger Hardware-Vertrauensanker zur Integritätsprüfung von Daten/Anwendungen der normalen Welt, ohne die sichere Umgebung zu kompromittieren.

3. Bedarfsgerechter Zugriff auf sichere Peripherie wie Speicher, Tastatur/Touchscreen und sogar Anzeige. TrustZone mit offenen APIs bildet eine TEE. Für ihre Funktionen und Konsistenz werden vertrauenswürdige Anwendungen benötigt. Typischerweise liegen Teile in beiden Welten, etwa kritische Speicherung und Verarbeitung in der sicheren Welt. Isolation von anderen vertrauenswürdigen Anwendungen erlaubt mehrere vertrauenswürdige Dienste nebeneinander.

Die von GlobalPlatform verwaltete Standardisierung der TEE-APIs ermöglicht interoperable vertrauenswürdige Anwendungen und Dienste von Dienstanbietern, Betreibern und OEMs. TrustZone benötigt keine separate Sicherheitshardware zur Integritätsprüfung von Gerät/Nutzer: Der Hardware-Vertrauensanker sitzt im Hauptchipsatz. In der TEE laufen nur vertrauenswürdige Anwendungen, geschützt gegen Hacker, Viren und Malware. Hardwareisolation trennt TEE von Softwareangriffswegen und erstreckt sich bis zur physischen Ein-/Ausgabeperipherie, einschließlich Tastatur/Touchscreen. Dadurch werden mehr und bessere Dienste mit schnellerem, einfacherem Zugriff jederzeit und überall möglich. Die Quelldarstellung erklärt, dass Bootloader auf den meisten Android-Geräten die Kernelechtheit nicht prüfen. Nutzer könnten einen manipulierten Kernel für Root-Zugriff auf alle Dateien, Anwendungen und Ressourcen installieren. Schäden daran verursachen Dienstausfälle; Malware gefährdet Unternehmensdaten. Secure Boot verhindert nicht autorisierte Bootloader und Kernel. Von einer bekannten vertrauenswürdigen Instanz kryptografisch signierte Betriebssystem-/Komponentenimages gelten als autorisiert. Secure-Boot-Komponenten bilden die erste Abwehrlinie gegen Malwareangriffe.

## 3 TEE-Umgebung

### 3.1 Plattformen

Rockchip-Android-SDKs ab 7.1 unterstützen TEE standardmäßig, ältere Versionen nicht. Im Linux-SDK ist TEE standardmäßig deaktiviert, kann aber gemäß den folgenden Abschnitten eingerichtet werden. Rockchip verwendet OP-TEE mit GlobalPlatform-konformen APIs. Es gibt OP-TEE V1 und V2.

1. OP-TEE V1: RK312x, RK322x, RK3288, RK3328, RK322xh, RK3368, RK3399, RK3399Pro.

2. OP-TEE V2: RK3326/PX30, RK3358, RK3308, RK1808, RV1109/RV1126, RK3566/RK3568, RK3588, RK3528, RK3562, RV1106 und spätere Plattformen. Firmware, Bibliotheken und TA-Dateien unterscheiden sich; Komponenten sind passend zur Plattform auszuwählen. Nicht in der V1-Liste enthaltene Plattformen gelten als V2.

### 3.2 Parameter.txt

OP-TEE unterstützt mehrere sichere Speicherdateisysteme (siehe Speicherabschnitt). Für den security-Speicher muss die Partition in parameter.txt definiert sein; dort stehen Positionen und Größen der Images/Partitionen. 0x00002000@0x000xxxxx(security) ergänzen: 0x00002000 bedeutet 4M Größe, 0x000xxxxx die Startadresse. An die tatsächliche parameter.txt anpassen; normalerweise ist die Partition bereits definiert.

### 3.3 TEE-Firmware

TEE-Firmware heißt auch TEE binary oder Secure OS, auf 64-Bit-Plattformen BL32. Der Secure-OS-Quellcode ist standardmäßig nicht offen. Binärdateien liegen in u-boot/tools/rk_tools/bin oder rkbin/bin.

1. Auf ARMv7 packt u-boot/tools/loaderimage die TEE-Binärdatei in trust.img. Dateinamensschema:

```text
<platform>_tee_[ta]_<version>.bin
such as: rkbin/bin/rk35/rk3506_tee_v1.26.bin
such as: rkbin/bin/rk35/rk3506_tee_ta_v1.00.bin
```

Ein Name mit ta unterstützt User TA, ohne ta nicht. U-Boot verwendet beim Packen standardmäßig TOS.ini oder die durch CONFIG_TRUST_INI angegebene Datei. Beispielsweise verweist RK3506TOS.ini auf Firmware ohne ta; daher führt RK3506 standardmäßig keine User TA aus. Dafür CONFIG_TRUST_INI="RK3506TOS_TA.ini" setzen, das auf die ta-Variante verweist. RK3506-Schnellstart startet TEE, jedoch nicht U-Boot; U-Boot kann sicheren Speicher daher nicht automatisch aussparen. Bei ta-Firmware zusätzlich folgende Konfiguration unter reserved_memory im Kernel-DTS eintragen, um den TEE-Speicher auszusparen.

```text
trust@1 {
    reg = <0x3c00000 0x140000>;
};
```

Auf anderen Plattformen spart U-Boot sicheren TEE-Speicher automatisch aus; zusätzliche Kernel-DTS-Konfiguration ist nicht nötig.

2. Auf ARMv8 packt u-boot/tools/trust_merger BL31/BL32 und weitere Dateien in trust.img. TEE-Dateinamensschema:

```text
<platform>_bl32_<version>.bin
such as: rkbin/bin/rk35/rk3588_bl32_v1.18.bin
```

3. Falls in rkbin/RKTRUST/.ini unter [BL32_OPTION] SEC=0 steht, auf SEC=1 ändern; sonst enthält trust.img kein SecureOS und TEE-Dienste laufen nicht.

4. RK3566/RK3568, RK3588, RK3528, RK3562, RV1106 und spätere Plattformen packen TEE in uboot.img; trust.img entsteht nicht. Folgende Ausgabe zeigt laufende TEE-Firmware einer OPTEE-V1-Plattform.

```text
INF [0x0] TEE-CORE:init_primary_helper:337: Initializing (1.1.0-278-gef70f120a #9 Fri Sep 17
09:39:24 UTC 2021 aarch64)
INF [0x0] TEE-CORE:init_primary_helper:338: Release version: 1.2
INF [0x0] TEE-CORE:init_teecore:83: teecore inits done
INFO:    BL31: Preparing for EL3 exit to normal world
INFO:    Entry point address = 0x200000
INFO:    SPSR = 0x3c9
```

Folgende Ausgabe zeigt laufende TEE-Firmware einer OPTEE-V2-Plattform.

```text
I/TC: OP-TEE version: 3.13.0-897-g5813e173a
I/TC: OP-TEE memory: TEEOS 0x200000 TA 0xc00000 SHM 0x200000
I/TC: Primary CPU initializing
I/TC: Primary CPU switching to normal world boot
INFO:    BL31: Preparing for EL3 exit to normal world
INFO:    Entry point address = 0x200000
INFO:    SPSR = 0x3c9
```

### 3.4 TEE-Treiber in U-Boot

Bestimmte Sicherheitsoperationen werden bereits in U-Boot benötigt, etwa OP-TEE zum Lesen bestimmter Daten. U-Boot implementiert OP-TEE Client zur Kommunikation. Der Treiber liegt in lib/optee_client; die API entspricht GP.

#### 3.4.1 Makrodefinitionen

CONFIG_OPTEE_CLIENT ist der Hauptschalter für OP-TEE-Aufrufe aus U-Boot. CONFIG_OPTEE_V1 gilt für V1-, CONFIG_OPTEE_V2 für V2-Plattformen. Ohne CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION wählt U-Boot den sicheren Speicher nach Hardware: eMMC nutzt RPMB, NAND die security-Partition. Mit dem Makro wird immer security statt RPMB genutzt. Es gilt nur für U-Boot, nicht Kernel/Userspace. RPMB ist sicherer und stabiler, aber weniger bequem: Beim Austausch durch fremdes eMMC oder Wechsel des SoC genügt bei security Löschen und Neuprogrammieren des Flashs; RPMB kann das Flashwerkzeug nicht löschen, dafür ist besondere Firmware vor erneuter Programmierung erforderlich. Bequemlichkeit und Sicherheit abwägen. Manche Plattformen aktivieren das Makro standardmäßig; bei hohen Sicherheitsanforderungen kann es entfernt werden.

#### 3.4.2 Gemeinsamer Speicher

U-Boot/OP-TEE-Kommunikation benötigt gemeinsamen Speicher, reserviert durch TEEC_AllocateSharedMemory(). Die Größe ist plattformabhängig; empfohlen sind höchstens 1M. Größere Daten in mehreren Teilen übertragen. Anschließend mit TEEC_ReleaseSharedMemory() freigeben.

#### 3.4.3 Sicheren Speicher testen

##### 3.4.3.1 Testschritte

Der folgende Test prüft sicheres Lesen/Schreiben zyklisch und erkennt die Hardware: eMMC testet RPMB und security, NAND nur security. Für eMMC muss CONFIG_SUPPORT_EMMC_RPMB in U-Boot aktiviert sein.

1. U-Boot-Serienkonsole öffnen: Geräte-UART mit PC verbinden, am PC ctrl+c halten und Gerät starten. Erkennt es ctrl+c beim Start, hält es in U-Boot an.

2. Test mit folgendem Befehl starten.

```text
=> mmc testsecurestorage
```

##### 3.4.3.2 Häufige Fehler untersuchen

```text
"TEEC: Could not find device"
```

Kein eMMC-/NAND-Gerät gefunden: U-Boot-Treiber und mögliche Hardwareschäden prüfen.

```text
"TEEC: Could not find security partition"
```

Bei security liegen verschlüsselte Daten in dieser Partition. Definition in parameter.txt prüfen.

```text
"TEEC: verify [%d] fail, cleanning ...."
```

Tritt bei erstmaliger Nutzung von security oder unerlaubter Datenänderung auf; die gesamte security-Partition wird geleert.

```text
"TEEC: Not enough space available in secure storage !"
```

Zu wenig Speicher: Datengröße, Dateianzahl und große Mengen früher gespeicherter, nicht gelöschter Daten prüfen.

```text
INF [0x0] TEE-CORE:storage_read_obj:201: Warning! head data not find!
ERR [0x0] TEE-CORE:storage_read_obj:210: cpu or emmc was replaced!
```

Beim U-Boot-Start speichert TEE kritische Daten verschlüsselt in security oder RPMB; der Schlüssel ist CPU-gebunden. CPU-Wechsel verhindert Entschlüsselung und U-Boot-Start. Auch zuvor genutztes Austausch-eMMC mit alten security-/RPMB-Daten verursacht Fehler. Alte Daten müssen gelöscht werden: Bei security eMMC formatieren; für RPMB spezielle Firmware beim Support anfordern.

```text
“optee check api revision fail”
```

U-Boot und TEE passen nicht zusammen; U-Boot ist neuer. Zwei Lösungsalternativen:

1. U-Boot auf cf13b78438 (tag: android-10.0-mid-rkr9) rockchip: spl: add rollback index check with otp zurücksetzen.

2. Folgende Commits zurücknehmen: 396e3049bd rochchip: board: only map op-tee share memory as dcache enabled; 7a349fdcbd lib: optee_client: add optee initialize flag; 74eb602743 lib: optee_client: update to new optee msg for optee v1 platform; 102dfafc4a rochchip: board: map op-tee memory as dcache enabled. Veröffentlichte SDK-Versionen passen normalerweise zusammen.

```text
"optee api revision mismatch with u-boot/kernel, panic"
```

Erscheint die Meldung beim U-Boot-Start, ist U-Boot älter als TEE und inkompatibel. Auf 396e3049bd (tag: android-10.0-mid-rkr11, tag: android-10.0-mid-rkr10) rochchip: board: only map op-tee share memory as dcache enabled oder neuer aktualisieren.

Bei Ausgabe während des Android-Starts android/vendor/rockchip/common auf 8bc7bf97 (tag: android-10.0-mid-rkr10) vpu: librockit: add Rockit MetadataRetriever oder neuer aktualisieren.

Bei Ausgabe während des Linux-Starts linux/external/security/bin auf f59085c optee_v1: lib: arm&amp;arm64: update binary and library oder neuer aktualisieren. Veröffentlichte SDK-Komponenten passen normalerweise zusammen.

#### 3.4.4 User TA in U-Boot

Dieser Abschnitt beschreibt eigene TA-Anwendungen bereits in U-Boot.

1. Vorhandensein des Funktionscommits prüfen; andernfalls U-Boot aktualisieren.

```text
436fc6d8486 lib: optee_clientApi: support load user ta for optee v1
4d4c5043204 lib: optee_clientApi: add user ta test demo
b122ee17db0 lib: optee_clientApi: support load user ta
deb4d4879d5 lib: optee_clientApi: support pack TA to image
```

2. TA nach u-boot/lib/optee_clientApi/userta kopieren. Mehrere TAs sind möglich; standardmäßig liegt dort die rktest-TA zum Testen.

3. TA mit folgendem Befehl in userta.img packen.

```text
cd lib/optee_clientApi
./tabinary_to_img.py --tadir ./userta --out ./userta/userta.img
```

4. In parameter.txt eine userta-Partition größer als userta.img hinzufügen.

5. parameter.txt und userta.img mit dem Flashwerkzeug programmieren.

6. U-Boot kann trusty_oem_user_ta_transfer und trusty_oem_user_ta_storage zum Testen der rktest-TA aufrufen. Diese Funktionen als Vorbild für eigene TA-Aufrufe verwenden.

### 3.5 TEE-Linux-Kerneltreiber

TEE-Linux-Treiber liegen in security/optee_linuxdriver/ und drivers/tee/.

#### 3.5.1 OP-TEE V1

Der Treiber für OP-TEE-V1-Plattformen liegt in security/optee_linuxdriver/ und ist normalerweise aktiv. Zur Aktivierung folgende config-Einträge ergänzen:

```text
CONFIG_TEE_SUPPORT=y
```

Der OP-TEE-V1-Linux-Treiber wird schrittweise abgelöst; V1-Plattformen verwenden den V2-Treiber. Ist die Version im TEE-Binärnamen unter rkbin/bin &gt;= v2.00, zusätzlich V2 aktivieren. Ab August 2020 veröffentlichte Android10+- und Linux-Versionen verwenden standardmäßig den V2-Kerneltreiber.

#### 3.5.2 OP-TEE V2

Der OP-TEE-V2-Treiber liegt in drivers/tee/. Sicherstellen, dass das Plattform-DTSI folgenden Knoten enthält:

```text
firmware {
    optee: optee {
        compatible = "linaro,optee-tz";
        method = "smc";
        #status = "disabled";
    };
};
```

Der Knoten ist normalerweise vorhanden, jedoch setzen manche Plattformen status = "disabled"; und deaktivieren ihn. Zum Aktivieren diese Zeile entfernen. Zwei config-Einträge ergänzen:

```text
CONFIG_TEE=y
CONFIG_OPTEE=y
```

#### 3.5.3 Treiberaktivierung prüfen

/dev/opteearmtz00 zeigt einen aktiven V1-Kerneltreiber; /dev/tee0 und /dev/teepriv0 einen aktiven V2-Treiber.

### 3.6 trusted key aktivieren

trusted key ist eine sichere Schlüsselverwaltung des Linux-Kernels. Sie nutzt TPM oder TEE, damit Schlüsselinhalte nicht im normalen Speicher/Userspace offenliegen.

#### 3.6.1 trusted key im Kernel

Zwei config-Einträge ergänzen:

```text
CONFIG_TRUSTED_KEYS=y
CONFIG_TRUSTED_KEYS_TEE=y
```

#### 3.6.2 trusted key in optee_os

1. Unterstützung in BL32 ist nötig. Unterstützte Plattformen und BL32-Versionen:

| Chipplattform | Version |
| --- | --- |
| RK3588 | >= rk3588_bl32_v1.21.bin |

2. Bei aktivem TEE-Backend von trusted_key erscheint folgende Ausgabe:

```text
root@linaro-alip:/# dmesg | grep trusted
[    1.814593] Initialise system trusted keyrings
[    2.456306] Key type trusted registered
```

#### 3.6.3 Verwendung

Unter Ubuntu beispielsweise zuerst key_ctl installieren:

```text
sudo apt-get install keyutils
```

Das Hinzufügen eines Schlüssels mit folgendem Befehl prüfen:

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

### 3.7 TEE-Bibliotheken

Android-TEE-Komponenten liegen in vendor/rockchip/common/security oder hardware/rockchip/optee des Android-Baums. V1/V2 sind enthalten; Dateien passend zur Plattform wählen:

1. lib: 32-/64-Bit-tee-supplicant, libteec.so und keymaster-/gatekeeper-Bibliotheken.

2. ta: kompilierte keymaster-/gatekeeper- und weitere TAs. Linux-TEE-Komponenten liegen in external/security/bin des Linux-Baums; ebenfalls V1/V2 plattformgerecht wählen:

1. lib: 32-/64-Bit-tee-supplicant, libteec.so und weitere CA-Bibliotheken.

2. ta: kompilierte TA-Dateien.

## 4 CA/TA entwickeln und testen

### 4.1 Umgebung einrichten

1. Der Buildfehler No module named Crypto.Signature bedeutet eine fehlende Python-Kryptobibliothek auf dem Entwicklungsrechner. Ausführen:

```text
pip uninstall Crypto
pip uninstall pycrypto
pip install pycrypto
```

2. Bei ModuleNotFoundError: No module named 'Cryptodome' auf dem Host das Python-Paket installieren: pip3 install [--user] pycryptodomex

### 4.2 CA/TA-Demos

RK liefert CA/TA-Demos als Entwicklungsbeispiel und TEE-Test. Quellen: external/rk_tee_user unter Android beziehungsweise external/security/rk_tee_user unter Linux. Enthalten sind rktest und xtest; xtest wird nur im Android-Repository external/rk_tee_user/v2 unterstützt und ist der offene OPTEE-Test mit recht umfassenden Fällen. Für Umgebungstests und Entwicklungsvorlagen reicht meist rktest; dessen Funktionen folgen.

Die Demo-CA heißt rktest, die TA 1db57234-dacd-462d-9bb1ae79de44e2a5.ta oder 1db57234-dacd-462d-9bb1-ae79de44e2a5.ta. Ein CA-Argument wählt die Funktion. CA-Name, Leerzeichen und ein beliebiges Zeichen zeigen verfügbare Argumente. Die Tabelle enthält implementierte Tests; sie decken nur häufige Funktionen ab, nicht alle OPTEE-Möglichkeiten.

| Parameter | Funktion | Hinweis |
| --- | --- | --- |
| transfer_data | Parameterübergabe zwischen CA und TA |  |
| storage | Sicheren Speicher testen | Vor dem Test müssen die Kernel-Geräteknoten vorhanden sein: `/dev/block/by-name/security` für die security-Partition; für rpmb werden `/dev/block/mmcblk%u`, `/dev/block/mmcblk%urpmb` und `/sys/class/mmc_host/mmc%u/mmc%u:0001/cid` benötigt, wobei %u 0, 1 oder 2 ist. Fehlende Knoten mit dem entsprechenden Knoten verknüpfen. |
| storage_speed | Leistung des sicheren Speichers testen |  |
| property | property abrufen |  |
| crypto_sha | SHA testen |  |
| crypto_aes | AED testen (Quellschreibweise) |  |
| crypto_rsa | RSA: Ver-/Entschlüsselung, Signieren/Prüfen |  |
| secstor_ta | TA in sicheren Speicher integrieren | Zuerst den Abschnitt zum Integrieren einer TA in sicheren Speicher lesen und das Funktionsprinzip verstehen. |
| otp_read | OEM_S_OTP lesen | OTP-Tests sind standardmäßig ausgeblendet; zur Aktivierung eine Definition in /host/rk_test/main.c setzen. OTP-Eigenschaften stehen im Abschnitt „OTP“. |
| otp_write | OEM_S_OTP schreiben |  |
| otp_size | Gesamtgröße von OEM_S_OTP |  |
| otp_ns_read | OEM_NS_OTP lesen |  |
| otp_ns_write | OEM_NS_OTP schreiben |  |
| trng | trng-Daten abrufen |  |
| socket | Socket-Kommunikation zwischen CA und TA |  |

Beispiel zum Testaufruf:

```text
# rktest transfer_data
# rktest [command]
```

Bei Erfolg meldet die CA PASS, bei Fehler Fail.

### 4.3 Android

#### 4.3.1 Verzeichnisse

CA/TA-Entwicklung liegt in external/rk_tee_user des Android-Baums:

1. Android.mk: Buildwerkzeuge und zu bauende CA-Dateien.

2. host: CA-Quellen.

3. ta: TA-Quellen.

4. export*: Umgebung zum Bauen der TA.

#### 4.3.2 Build und Entwicklung

Enthält external/rk_tee_user nur v1/ und v2/, wurde master in develop-next übernommen und wird aufgegeben. Zusammenführungspunkt auf master: 492f1cbf testapp: support new OP-TEE MSG. Mit folgenden Befehlen bauen.

```text
#OP-TEE V1平台进⼊v1⽬录
cd external/rk_tee_user/v1
#OP-TEE V2平台进⼊v2⽬录
cd external/rk_tee_user/v2
rm -rf out/
./build.sh ta
mm
```

Fehlen v1/ und v2/, verwendet external/rk_tee_user noch zwei Zweige: Für V1 master, für V2 develop-next wählen. Danach ausführen:

```text
cd external/rk_tee_user/
rm -rf out/
./build.sh ta (git log包含“Android.mk: remove build ta from android”则执⾏，否则不执⾏)
mm
```

Der Build erzeugt CA (Client Application, normale Welt) und TA (Trust Application, sichere Welt). Die CA ist eine normale ausführbare Datei unter Android-out. Die TA hat UUID-Namen und .ta-Endung und liegt im passenden Unterordner von rk_tee_user/ta, rk_tee_user/out/ta, rk_tee_user/v1/out/ta oder rk_tee_user/v2/out/ta.

#### 4.3.3 TEE-Umgebung testen

1. Über adb shell auf das Gerät zugreifen.

2. TEE-Bibliotheken, CA und TA installieren. Android 7: libteec.so nach /system/lib oder /system/lib64; tee-supplicant und CA nach /system/bin; /system/lib/optee_armtz für TAs anlegen. Android 8+: libteec.so nach /vendor/lib oder /vendor/lib64; tee-supplicant und CA nach /vendor/bin; /vendor/lib/optee_armtz für TAs anlegen. Startet tee-supplicant automatisch, sind er und libteec.so bereits vorhanden und brauchen keinen erneuten Push. V1/V2 und 32/64 Bit unterscheiden. Nach Push Ausführungsrechte von tee-supplicant und CA prüfen.

3. Startet tee-supplicant nicht automatisch, manuell mit root im Hintergrund starten:

```text
# tee-supplicant &
```

tee_supp_rk_fs_init: unsupported bedeutet, dass parameter.txt keine security-Partition definiert; siehe parameter.txt-Abschnitt. Bei ausschließlicher RPMB-/REE-Dateisystemnutzung ist die Meldung ignorierbar.

4. CA zum TA-Aufruf und TEE-Test starten. Das enthaltene rktest prüft Grundfunktionen:

```text
# rktest [command]
```

5. Bestehen die rktest-Befehle, ist TEE bereit zur Entwicklung. Bei Fehlern zuerst Treiber/Komponenten prüfen; auch rk_tee_user und TEE OS können inkompatibel sein. Typische V1-Zuordnung: TEE binary unter rkbin/bin mit version &gt;= v2.00 passt zu 492f1cbf testapp: support new OP-TEE MSG; version &lt; v2.00 zu e8d7215d Android.mk: support build in android R oder 466515ec add tools for user to resign TA. Für OP-TEE V2:

TEE-Startausgabe "OP-TEE version: 3.13.0" entspricht a566557 - v2: update to keep up with v3.13.0 of optee_test.

TEE-Startausgabe "OP-TEE version: 3.6.0" entspricht 1aa969e2 Android.mk: support build in android R.

TEE-Startausgabe "OP-TEE version: 3.3.0" entspricht aa0a0c00 Android.mk: remove build ta from android.

Android-TEE-Startausgabe "OP-TEE version: 2.5.0" entspricht 1ec9913a add tools for user to resign TA.

#### 4.3.4 Step By Step

Beispiel: arm64 mit OP-TEE V2 auf Android12.

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

#### 4.3.5 CA/TA entwickeln

CA/TA als Vorlage verwenden. UUID in Makefile und Headern durch eine neue, mit uuidgen erzeugte UUID ersetzen. user_ta_header_defines.h unter include jeder TA definiert 32KB Heap (TA_DATA_SIZE) und 2KB Stack (TA_STACK_SIZE). Möglichst unverändert lassen; nötigenfalls erhöhen, jedoch Heap höchstens 1MB und Stack höchstens 64KB.

```text
#define TA_STACK_SIZE               (2 * 1024)
#define TA_DATA_SIZE                (32 * 1024)
```

### 4.4 Linux

#### 4.4.1 Verzeichnisse

CA/TA-Umgebung: external/security/rk_tee_user im Linux-Baum.

1. build.sh: Buildskript; Anweisungen in den Kommentaren.

2. Makefile: Werkzeuge und zu bauende CA-Dateien.

3. host: CA-Quellen und zugehöriges Makefile.

4. ta: TA-Quellen.

5. export*: TA-Buildumgebung.

#### 4.4.2 Build und Entwicklung

Enthält external/security/rk_tee_user nur v1/ und v2/, wurde master in develop-next übernommen und wird aufgegeben. Zusammenführungspunkt auf master: 492f1cbf testapp: support new OP-TEE MSG. Folgende Befehle ausführen.

```text
#OP-TEE V1平台进⼊v1⽬录
cd external/security/rk_tee_user/v1
#OP-TEE V2平台进⼊v2⽬录
cd external/security/rk_tee_user/v2
rm -rf out/
./build.sh 3232 （32位平台执⾏，CA 32bits，TA 32bits）
./build.sh 6432 （64位平台执⾏，CA 64bits，TA 32bits）
```

Ohne v1/ und v2/ bestehen noch zwei Zweige in external/security/rk_tee_user: master für V1, develop-next für V2. Wechseln und ausführen:

```text
cd external/security/rk_tee_user/
rm -rf out/
./build.sh 3232 （32位平台执⾏，CA 32bits，TA 32bits）
./build.sh 6432 （64位平台执⾏，CA 64bits，TA 32bits）
```

Der Build erzeugt CA in der normalen und TA in der sicheren Welt. Die CA ist eine normale ausführbare Datei im passenden Ordner von rk_tee_user/out, rk_tee_user/v1/out oder rk_tee_user/v2/out. Die TA ist UUID.ta im passenden Ordner von rk_tee_user/out/ta, rk_tee_user/v1/out/ta oder rk_tee_user/v2/out/ta.

#### 4.4.3 TEE-Umgebung testen

1. Über adb shell anmelden.

2. Bibliotheken, CA und TA installieren: libteec.so* und andere Bibliotheken nach /lib oder /lib64; tee-supplicant und CA nach /usr/bin; /lib/optee_armtz für TA anlegen. Bei tee-supplicant-Autostart sind dieser und libteec.so bereits vorhanden, kein erneuter Push nötig. V1/V2 und 32/64 Bit unterscheiden. Nach Push Ausführungsrechte von tee-supplicant und CA prüfen.

3. Übrige Schritte entsprechen dem obigen Android-Abschnitt.

#### 4.4.4 Step By Step

Beispiel: arm64 mit OP-TEE V2 auf Linux.

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

#### 4.4.5 CA/TA entwickeln

CA/TA als Vorlage verwenden. UUID in Makefile und Headern durch eine neue, mit uuidgen erzeugte UUID ersetzen. user_ta_header_defines.h unter include jeder TA definiert 32KB Heap (TA_DATA_SIZE) und 2KB Stack (TA_STACK_SIZE). Möglichst unverändert lassen; nötigenfalls erhöhen, jedoch Heap höchstens 1MB und Stack höchstens 64KB.

```text
#define TA_STACK_SIZE               (2 * 1024)
#define TA_DATA_SIZE                (32 * 1024)
```

### 4.5 rk_tee_service

#### 4.5.1 Funktionen

rk_tee_service bietet häufige TEE-Sicherheitsfunktionen über einfache Schnittstellen. Es ist im Kern eine CA/TA-Anwendung; zuerst TEE gemäß dem Umgebungstestabschnitt prüfen.

rk_tee_service kann direkt zum Ver-/Entschlüsseln sensibler Daten in der TA aufgerufen werden. TEE leitet den Schlüssel aus dem geräteeindeutigen HUK ab; Geräte haben daher verschiedene Schlüssel und Daten von A lassen sich auf B nicht entschlüsseln, was Missbrauch verhindert. Wegen gemeinsamem Speicher höchstens 1M pro Aufruf empfohlen; größere Daten aufteilen. OP-TEE V2 wird unterstützt, V1 derzeit nicht.

#### 4.5.2 Komponenten

Linux und Android ab12 werden unterstützt.

| Komponente | Android-Verzeichnis | Linux-Verzeichnis |
| --- | --- | --- |
| librk_tee_service.so | hardware/rockchip/optee/v2/arm<br>hardware/rockchip/optee/v2/arm64 | external/security/bin/optee_v2/lib/arm<br>external/security/bin/optee_v2/lib/arm64 |
| rk_tee_service.h | hardware/rockchip/optee/v2/include | external/security/bin/optee_v2/include |
| 4367fd45-4469-42a6-925d-3857b952704a.ta | hardware/rockchip/optee/v2/ta | external/security/bin/optee_v2/ta |

Userspace-Anwendungen rufen librk_tee_service.so direkt auf; Parameter siehe rk_tee_service.h. 4367fd45-4469-42a6-925d-3857b952704a.ta unter Linux nach /lib/optee_armtz, unter Android nach /vendor/lib/optee_armtz legen.

#### 4.5.3 Demo-Beispiel

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

### 4.6 xtest testen

xtest ist der quelloffene Testcode von OPTEE mit einem umfangreichen Satz von Tests. Dieser Abschnitt beschreibt seine Verwendung. Das folgende Beispiel verwendet eine arm64-Plattform mit OP-TEE V2 unter Android 13.

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

Das folgende Beispiel verwendet eine arm64-Plattform mit OP-TEE V2 unter Linux.

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

## 5 TA-Signierung

### 5.1 Prinzip

Beim Übersetzen einer TA signiert das Build-Skript die Anwendung automatisch mit dem Schlüssel aus `export-user_ta/keys` oder `export-ta_arm32/keys` im Projekt rk_tee_user. Es handelt sich um einen 2048-Bit-RSA-Schlüssel im PEM-Format; das Ergebnis ist eine TA-Datei im Format `.ta`. Das TEE-Binary enthält einen öffentlichen RSA-Schlüssel. Beim Laden prüft TEE OS damit die Authentizität der TA. Nur eine erfolgreich geprüfte TA darf ausgeführt werden; so wird die Ausführung auf zulässige TAs beschränkt.

### 5.2 Öffentlichen Schlüssel ersetzen

Damit die TA von Entwickler A nicht auf der Platine von Entwickler B ausgeführt werden kann, wird der Austausch des öffentlichen Schlüssels empfohlen. Die Werkzeuge zum Ersetzen des öffentlichen Schlüssels im TEE-Binary liegen unter `tools/` im Projekt rk_tee_user. Austausch unter Linux:

```text
./change_puk  --teebin  <TEE binary>
```

Dieser Befehl erzeugt automatisch den 2048-Bit-RSA-Schlüssel `oemkey.pem` im aktuellen Verzeichnis und ersetzt den ursprünglichen öffentlichen Schlüssel im TEE-Binary durch den öffentlichen Anteil dieses Schlüssels.

```text
./change_puk  --teebin  <TEE binary> --key oemkey.pem
```

Zum Ersetzen des ursprünglichen öffentlichen Schlüssels im TEE-Binary kann auch der öffentliche Anteil eines vom Entwickler vorgegebenen Schlüssels verwendet werden; dessen Länge muss 2048 Bit betragen. Unter Windows öffnen Sie `Windows_change_puk.exe` und klicken auf „生成oemkey.pem“, um einen Schlüssel zu erzeugen und zu speichern. Wählen Sie den erzeugten Schlüssel und das TEE-Binary aus und klicken Sie auf „修改公钥“. Da das Programm die Fremdbibliothek `BouncyCastle.Crypto.dll` aufruft, muss diese im selben Verzeichnis wie `Windows_change_puk.exe` liegen. Ersetzen Sie anschließend das TEE-Binary mit dem ursprünglichen Schlüssel unter `rkbin/` durch das neue Binary, übersetzen Sie U-Boot neu und schreiben Sie die erzeugte Firmware `trust.img`. Bei einigen Plattformen ist trust in `uboot.img` enthalten und es gibt kein separates `trust.img`; dort wird `uboot.img` geschrieben.

Erzeugten oder gewählten Schlüssel in oem_privkey.pem umbenennen, Schlüssel in rk_tee_user/export-user_ta/keys oder export-ta_arm32/keys ersetzen und CA/TA neu bauen. Die TA lädt mit dem neuen öffentlichen Schlüssel in TEE binary; falsch signierte TAs werden abgelehnt.

### 5.3 TA-Signierung Schritt für Schritt

Dieses Beispiel verwendet RK3588 mit Android 12.

```text
cd /home1/xxxx/rk_android_12/external/rk_tee_user/v2/tools/change_puk_tool-release/change_puk_linux

chmod +x change_puk

./change_puk --teebin /home1/xxxx/rk_android_12/rkbin/bin/rk35/rk3588_bl32_v1.17.bin

cp oem_privkey.pem /home1/xxxx/rk_android_12/external/rk_tee_user/v2/export-ta_arm32/keys/

cp oem_privkey.pem /home1/xxxx/rk_android_12/external/rk_tee_user/v2/export-ta_arm64/keys/

//重新编译烧写uboot固件，重新编译CA TA应⽤
```

## 6 TA in sicheren Speicher einbetten

Nach der Entwicklung liegt eine TA normalerweise im Klartext im ungesicherten Dateisystem. Manche OEMs mit höheren Sicherheitsanforderungen möchten die TA nicht im Klartext offenlegen. Dafür unterstützt OP-TEE V2 das Ablegen der TA im sicheren Speicher; OP-TEE V1 unterstützt dies noch nicht.

### 6.1 Prinzip

Die CA liest die TA-Datei aus dem ungesicherten Dateisystem und übergibt die Daten an OP-TEE OS. Dieses prüft zunächst die Authentizität der TA. Bei erfolgreicher Prüfung erzeugt es einen zufälligen TA-Verschlüsselungsschlüssel, verschlüsselt die TA und speichert die verschlüsselten Daten zusammen mit dem Schlüssel sicher: in der Partition security, falls definiert, ansonsten im Android- oder Linux-Dateisystem. Der Schlüssel für den sicheren Speicher wird aus dem hardwareeindeutigen Schlüssel abgeleitet und ist für jedes Gerät verschieden. Anschließend muss der Entwickler die TA-Datei selbst aus dem ungesicherten Dateisystem löschen, damit der Klartext nicht offengelegt wird. Danach kann die CA die TA normal aufrufen. OP-TEE OS sucht anhand der übergebenen uuid nach der TA im sicheren Speicher. Bei einem Treffer wird sie entschlüsselt, geladen und ausgeführt; andernfalls wird die entsprechende TA im ungesicherten Dateisystem gesucht.

### 6.2 Referenzimplementierung

Nachfolgend steht der CA-Code. Der Entwickler kann zunächst die TA-Datei lesen und ihre Daten anschließend mit `install_ta` an OP-TEE OS übergeben.

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

## 7 TA verschlüsseln

Der vorherige Abschnitt zum Ablegen von TAs im sicheren Speicher beschreibt eine Möglichkeit, den Klartext zu schützen. Allerdings belegt dies sicheren Speicherplatz; bei beschädigten Speicherdaten kann die abgelegte TA nicht verwendet werden. Außerdem wird der Verschlüsselungsschlüssel zufällig erzeugt und nicht vom Entwickler vorgegeben. Dieser Abschnitt beschreibt ein anderes Verfahren zur TA-Verschlüsselung, das OP-TEE V2, jedoch noch nicht OP-TEE V1 unterstützt.

### 7.1 TA-Verschlüsselungsmethode

Wenn der TA-Quellcode vorliegt, aktivieren Sie `CFG_ENCRYPT_TA` in `export-ta_arm32/mk/link.mk` und setzen Sie `TA_ENC_KEY` auf Ihren eigenen Verschlüsselungsschlüssel. Das Build-Skript signiert und verschlüsselt die TA dann automatisch. Liegt nur das TA-Binary ohne Quellcode vor, kann es mit einem Werkzeug aus `tools/` im Projekt rk_tee_user verschlüsselt werden. Befehl zum Verschlüsseln einer Klartext-TA:

```text
python3 ta_encrypt_tool.py --key oem_privkey.pem --in 1db57234-dacd-462d-9bb1-ae79de44e2a5.ta --enc_key 'b64d239b1f3c7d3b06506229cd8ff7c8af2bb4db2168621ac62c84948468c4f4'
```

Befehl zum erneuten Verschlüsseln einer bereits verschlüsselten TA:

```text
python3 ta_encrypt_tool.py --key oem_privkey.pem --in 1db57234-dacd-462d-9bb1-ae79de44e2a5.ta --ori_enc_key 'b64d239b1f3c7d3b06506229cd8ff7c8af2bb4db2168621ac62c84948468c4f4' --enc_key 'c74d239b1f3c7d3b06506229cd8ff7c8af2bb4db2168621ac62c84948468c4f4'
```

Werkzeugparameter: `--key` bezeichnet die Datei mit dem eigenen asymmetrischen Schlüssel zum Signieren der TA. `--in` bezeichnet die TA-Datei. `--enc_key` ist der eigene symmetrische Schlüssel zur TA-Verschlüsselung. `--ori_enc_key` ist der ursprüngliche symmetrische Schlüssel der bereits verschlüsselten TA.

### 7.2 TA encryption key programmieren

Zum Schreiben des TA encryption key dient `RKDevInfoWriteTool` ab Version 1.2.8 im Verzeichnis RKTools des SDK-Projekts. Legen Sie zunächst eine Schlüsseldatei an, öffnen Sie sie im Hex-Editor und tragen Sie Ihren 32-Byte-Schlüssel ein. Aktivieren Sie in RKDevInfoWriteTool „TA encryption key“, wählen Sie die neue Datei aus und stellen Sie sicher, dass sich das Gerät im LOADER-Modus befindet. Klicken Sie zum Schreiben auf „写入“. Der Schlüssel wird im OTP des Geräts gespeichert: Geschriebene OTP-Daten sind unveränderlich, daher kann der Schlüssel pro Gerät nur einmal geschrieben werden. Um eine Offenlegung zu verhindern, unterstützt das Werkzeug kein Auslesen des TA encryption key.

![Abbildung 3: englische Quelle, Seite 37](/docs/rockchip-tee-sdk/assets/en-p037-figure-01.png)

*Abbildung 3: englische Quelle, Seite 37*

### 7.3 TA entschlüsseln und starten

Eine verschlüsselte TA wird genauso verwendet wie eine Klartext-TA. OP-TEE OS erkennt beim Laden automatisch die Verschlüsselung, liest den TA encryption key aus dem OTP, entschlüsselt die TA und führt sie aus. Der gesamte Vorgang erfolgt automatisch.

### 7.4 Soft TA encryption key

Soll der zusätzliche Schritt zum Schreiben des TA encryption key ins OTP entfallen, kann der Soft TA encryption key verwendet werden. Dies ist ein symmetrischer Schlüssel im TEE-Binary. Ist ein Schlüssel im OTP vorhanden, verwendet OP-TEE OS vorrangig diesen zum Entschlüsseln und Ausführen der TA; dies bietet höhere Sicherheit.

Ist kein TA encryption key im OTP gespeichert, entschlüsselt und startet OP-TEE OS die TA mit dem Soft TA encryption key; das Sicherheitsniveau ist geringer. Der Entwickler muss den Soft TA encryption key im TEE-Binary mit dem Werkzeug aus `tools/` im Projekt rk_tee_user ersetzen. Befehl zum Ersetzen des Standardschlüssels:

```text
./change_ta_enc_key --teebin <TEE binary> --takey 'b64d239b1f3c7d3b06506229cd8ff7c8af2bb4db2168621ac62c84948468c4f4'
```

Werkzeugparameter: `--teebin` ist der Pfad zur TEE-Binary-Firmware. `--takey` ist der private 32-Byte-Schlüssel des Entwicklers; er muss mit dem zur TA-Verschlüsselung verwendeten Schlüssel übereinstimmen.

## 8 REE-FS-TA-Rollbackschutz

Wie im Abschnitt zum Ablegen von TAs im sicheren Speicher beschrieben, unterstützt OP-TEE V2 sowohl Klartext-TAs im ungesicherten Dateisystem REE FS als auch TAs im Secure Storage. Für Klartext-TAs im REE FS bietet OP-TEE V2 einen Rollback-Schutz, der ein Herabstufen der TA-Version aus der ungesicherten REE-Umgebung verhindert.

### 8.1 Rollbackschutz verwenden

Der Rollback-Schutz für TAs im REE FS ist immer aktiviert. Entwickler nutzen ihn, indem sie die TA-Version mit `CFG_TA_VERSION` im Makefile festlegen. Ist `CFG_TA_VERSION` nicht definiert, erkennt das System Version 0 und erlaubt TAs mit derselben Versionsnummer. Wird im Makefile wie im folgenden Beispiel ein aktueller Wert größer als 0 festgelegt, ist ein späteres Herabstufen dieser TA-Version untersagt.

```text
# unsigned integer format
CFG_TA_VERSION=1
```

## 9 Wählbare Sicherheitsstufen

### 9.1 Geltungsbereich

Das Verfahren gilt für RK3588, RK3528, RK3562 und nachfolgende neue Plattformen.

### 9.2 Hinweise

Beachten Sie vor der Nutzung Folgendes: Konfigurieren Sie `CONFIG_OPTEE_SECURITY_LEVEL` in U-Boot vor dem ersten Firmware-Schreiben entsprechend Ihren Anforderungen. Der Chip unterstützt diese Konfiguration nur einmal; nachträglich lässt sie sich nicht ändern. Der SDK-Standard ist level0. Wurde eine Testplatine bereits mit level0-Firmware beschrieben, startet sie nach dem Schreiben von level1 oder level2 möglicherweise nicht mehr. Verwenden Sie deshalb nach einer Änderung von `CONFIG_OPTEE_SECURITY_LEVEL` vorzugsweise ein neues Gerät zum Testen. Bei „Hochsicherheitsverfahren 1“ muss zuerst OEM HUK mit RKDevInfoWriteTool V1.3.5 oder neuer geschrieben werden.

### 9.3 Beschreibung

Der Entwickler kann das OPTEE-Sicherheitsniveau konfigurieren. Die verschiedenen Stufen bieten unterschiedliche Schutzstärken für eMMC und sicheren Speicher.

| Sicherheitsstufe | Beschreibung | CONFIG_OPTEE_SECURITY_LEVEL (U-Boot) |
| --- | --- | --- |
| Starke Sicherheit 2 | Starke Bindung des Controllers an eMMC-/Secure-Storage-Daten. Beim Controllerwechsel auch den eMMC-Chip ersetzen und andere sichere Speicherdaten löschen. | 2 |
| Starke Sicherheit 1 | Schwache Bindung des Controllers an eMMC/ sicheren Speicher. Schutzschlüssel werden aus dem vom Entwickler festgelegten OEM HUK abgeleitet. Nach Controllerwechsel sind bisheriger eMMC-Chip und Daten mit demselben eingespielten OEM HUK weiter nutzbar. | 1 |
| Schwache Sicherheit | Keine Bindung der eMMC-/Secure-Storage-Daten an den Controller. Nach dessen Austausch können bisheriger eMMC-Chip und andere sichere Daten weiterverwendet werden. | 0 oder nicht konfiguriert |

Die Unterschiede der Sicherheitsstufen ergeben sich aus den Schlüsseln für eMMC und sicheren Speicher. HUK (Hardware Unique Key) dient zur Ableitung von RPMB Key, Secure Storage Key und weiteren Schlüsseln; je nach Sicherheitsstufe kommt eine andere HUK-Variante zum Einsatz, siehe Abbildung. Hard HUK wird aus dem Device Root Key abgeleitet und ist gerätespezifisch. Der Device Root Key wird bei der Chipherstellung in das sichere OTP geschrieben. OEM HUK wird vom Entwickler festgelegt und in das sichere OTP geschrieben. Soft HUK wird von Rockchip festgelegt, ist für alle Chips identisch und in der Firmware eingebettet. RPMB Key schützt die Speicherung in der RPMB-Partition des eMMC-Chips. Secure Storage Key schützt den sicheren Speicher. Other Key bezeichnet Schlüssel für andere Zwecke in OP-TEE.

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

## 10 TA-Debugging

### 10.1 OP-TEE-V1-Plattformen

Bei einer Ausnahme in der TA werden folgende Informationen ausgegeben.

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

In der Ausnahmemeldung ist `pc` beziehungsweise `elr` die Fehleradresse und `load addr` die virtuelle Ladeadresse der TA. Somit ergibt `elr - load addr = 0x402000a0 - 0x40200000 = 0xa0` den Offset der fehlerhaften Anweisung innerhalb der TA. Neben der TA-Datei liegt `uuid.dmp`, die Disassemblierung der TA mit den Funktionsoffsets. Suchen Sie darin nach `a0`: `a0: 681b ldr r3, [r3, #0]` kennzeichnet den Ausnahmeoffset und `testapp_ta.c:97` die Zeile 97 in testapp_ta.c.

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

### 10.2 OP-TEE-V2-Plattformen

Bei einer Ausnahme in der TA werden folgende Informationen ausgegeben.

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

In der Ausnahmemeldung ist `pc` beziehungsweise `elr` die Fehleradresse. `region 0` bis `region 8` geben die Adressen der TA-Segmente im Speicher an. Hier gehört `0xc00870a4` zu `region 7`; daher ist `elr - region 7 : va = 0xc00870a4 - 0xc0087000 = 0xa4` der Offset der fehlerhaften Anweisung in der TA. Neben der TA liegt die Disassemblierungsdatei `uuid.dmp` mit den Funktionsoffsets. Suchen Sie nach `a4`: `a4: 681b ldr r3, [r3, #0]` kennzeichnet den Ausnahmeoffset, `testapp_ta.c:101` verweist auf Zeile 101 in testapp_ta.c.

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

### 10.3 Aufrufstack anzeigen

Wenn beim Debuggen neben der Ausnahmeadresse auch der gesamte Aufrufstack benötigt wird, stellt OP-TEE V2 das Skript `export-ta_arm32/scripts/symbolize.py` bereit. OP-TEE V1 unterstützt diese Funktion noch nicht. Passen Sie zuerst den vom Skript benötigten Compilerpfad an Ihre lokale Installation an.

```text
#32位TA执⾏
export PATH=/home1/hisping/rk_px30_linux/prebuilts/gcc/linux-x86/arm/gcc-linaro-6.3.1-2017.05-x86_64_arm-linux-gnueabihf/bin:$PATH
export CROSS_COMPILE=arm-linux-gnueabihf-

#64位TA执⾏
export PATH=/home1/hisping/rk_px30_linux/prebuilts/gcc/linux-x86/aarch64/gcc-linaro-6.3.1-2017.05-x86_64_aarch64-linux-gnu/bin:$PATH
export CROSS_COMPILE=aarch64-linux-gnu-
```

Führen Sie anschließend das Skript aus. Der Parameter `-d` verweist auf das Verzeichnis der übersetzten TA.

```text
./export-ta_arm32/scripts/symbolize.py -d out/ta/testapp/
```

Im dritten Schritt wartet das Skript auf die Ausnahmemeldungen. Kopieren Sie diese und fügen Sie sie ein; das Ergebnis sieht wie folgt aus. `Call stack` enthält den Funktionsaufrufstack.

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

## 11 Speicher

### 11.1 OP-TEE V1

| Plattform | TEE_RAM | TA_RAM | SHMEM |
| --- | --- | --- | --- |
| RK312x | 1M | 12M | 1M |
| RK322x | 1M | 12M | 2M |
| RK3288 | 1M | 12M | 2M |
| RK3368 | 2M | 24M | 4M |
| RK3328/RK322xH | 2M | 24M | 4M |
| RK3399/RK3399Pro | 2M | 24M | 4M |

Hinweis: Secure OS läuft in TEE_RAM, die TA in TA_RAM; SHMEM ist gemeinsam genutzter Speicher.

### 11.2 OP-TEE V2

| Plattform | TEE_RAM | TA_RAM | SHMEM |
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

Hinweis: Secure OS läuft in TEE_RAM, die TA in TA_RAM; SHMEM ist gemeinsam genutzter Speicher. OPTEE OS unterstützt die Ausgabe der Größe des sicheren Speichers. Die folgenden Informationen sind im Startprotokoll zu finden.

```text
I/TC: OP-TEE memory: TEEOS 0x200000 TA 0xc00000 SHM 0x200000
I/TC: Primary CPU initializing
I/TC: Primary CPU switching to normal world boot
```

Weicht die im Startprotokoll ausgegebene Größe von der obigen Liste ab, ist die Protokollausgabe maßgeblich.

## 12 Sicherer Speicher

### 12.1 Partitionen

1. Sicherer Speicher ist eine wichtige Funktion von OPTEE OS. Wichtige Benutzerdaten werden von OPTEE OS verschlüsselt und in security, RPMB oder im Android-/Linux-Dateisystem gespeichert. Es gibt drei Varianten. Erstens: Bei `storageID = TEE_STORAGE_PRIVATE_RPMB` im TA-Code wird eMMC RPMB genutzt; dessen Größe hängt vom eMMC-Modell ab und beträgt häufig 4M. Zweitens: Ist in parameter.txt eine security-Partition definiert und setzt die TA `storageID = TEE_STORAGE_PRIVATE_REE`, liegen die Daten in security; derzeit sind dort 512k nutzbar. Drittens: Ist keine security-Partition in parameter.txt definiert und setzt die TA `storageID = TEE_STORAGE_PRIVATE_REE`, erfolgt die im Folgenden beschriebene Speicherung im Dateisystem.

Bei der dritten Variante liegen die Daten unter `/metadata/tee`, `/data/vendor/tee` oder `/data/tee` im Android-/Linux-Dateisystem. Stellen Sie sicher, dass tee-supplicant auf das Verzeichnis zugreifen darf. Der Gesamtspeicherplatz ist nicht begrenzt. Nachteil: Das Gerät muss eMMC verwenden und U-Boot darf `CONFIG_OPTEE_ALWAYS_USE_SECURITY_PARTITION` nicht definieren; sichere Daten der U-Boot-Phase werden dann standardmäßig in eMMC RPMB gespeichert.

2. Zum sicheren Speicher unter U-Boot siehe den Abschnitt „TEE-Treiber in U-Boot“.

3. Während des Schreibens in den sicheren Speicher darf die Stromversorgung nicht ausfallen. Die Originaldokumentation berichtet von Tests zum Schutz vor Stromausfällen, garantiert jedoch keine Dateisystemintegrität. Reduzieren Sie deshalb Schreibvorgänge wichtiger Daten und sorgen Sie bei Zugriffen auf sichere Daten für stabile Bedingungen. Theoretisch bietet RPMB einen besseren Schutz vor Stromausfällen als security und das Android-/Linux-Dateisystem.

### 12.2 Leistungstest

Test aus der Originaldokumentation: OPTEE V1 auf RK3399 Linux mit fester CPU-Frequenz 1200000 und fester DDR-Frequenz 200000000.

| Speicherbereich | Datengröße | Datei anlegen | Schreiben | Lesen | Datei löschen |
| --- | --- | --- | --- | --- | --- |
| Linux-Dateisystem | 30K | 16ms | 67ms | 61ms | 19ms |
| Linux-Dateisystem | 4K | 17ms | 23ms | 13ms | 7ms |
| Linux-Dateisystem | 1K | 18ms | 16ms | 7ms | 6ms |
| Linux-Dateisystem | 32 | 23ms | 16ms | 7ms | 7ms |
| security-Partition | 30K | 97ms | 181ms | 54ms | 277ms |
| security-Partition | 4K | 101ms | 74ms | 14ms | 101ms |
| security-Partition | 1K | 104ms | 56ms | 7ms | 64ms |
| security-Partition | 32 | 103ms | 55ms | 7ms | 73ms |
| rpmb-Partition | 30K | 20ms | 233ms | 10ms | 7ms |
| rpmb-Partition | 4K | 20ms | 36ms | 3ms | 6ms |
| rpmb-Partition | 1K | 22ms | 14ms | 2ms | 6ms |
| rpmb-Partition | 32 | 27ms | 8ms | 2ms | 6ms |

Test aus der Originaldokumentation: OPTEE V2 auf RK356x Linux mit fester CPU-Frequenz 1416000 und fester DDR-Frequenz 324000000.

| Speicherbereich | Datengröße | Datei anlegen | Schreiben | Lesen | Datei löschen |
| --- | --- | --- | --- | --- | --- |
| Linux-Dateisystem | 30K | 17ms | 28ms | 3ms | 8ms |
| Linux-Dateisystem | 4K | 17ms | 11ms | 1ms | 8ms |
| Linux-Dateisystem | 1K | 18ms | 9ms | 1ms | 8ms |
| Linux-Dateisystem | 32 | 19ms | 8ms | 1ms | 7ms |
| security-Partition | 30K | 12ms | 12ms | 4ms | 12ms |
| security-Partition | 4K | 12ms | 3ms | 1ms | 11ms |
| security-Partition | 1K | 13ms | 2ms | 1ms | 11ms |
| security-Partition | 32 | 15ms | 3ms | 1ms | 14ms |
| rpmb-Partition | 30K | 23ms | 287ms | 16ms | 5ms |
| rpmb-Partition | 4K | 24ms | 50ms | 7ms | 6ms |
| rpmb-Partition | 1K | 23ms | 22ms | 5ms | 6ms |
| rpmb-Partition | 32 | 30ms | 12ms | 5ms | 5ms |

## 13 OTP

OTP steht für One Time Programmable Memory: Der Bereich kann mehrfach gelesen, aber nur einmal beschrieben werden. Secure OTP enthält verschiedene OEM-Zone-Bereiche für unterschiedliche Benutzeranforderungen.

| OTP-Typ | Beschreibung | Unterstützte Plattformen |
| --- | --- | --- |
| OEM Cipher<br>Key | Diese OEM Zone speichert einen Benutzerschlüssel, der nach dem Schreiben unveränderlich ist. Anschließend kann mit dem angegebenen Schlüssel ver- und entschlüsselt werden. | rv1126, rv1109, rk3566, rk3568, rk3588,<br>rk3576, rk3528, rk3562, rv1106, rv1103,<br>rv1106b, rv1103b, rk3506, rv1126b |
| Protected<br>OEM Zone | Nur gültige Trusted Applications (TA) unter OP-TEE OS dürfen diese OEM Zone verwenden. Die nicht sichere Welt kann sie nicht direkt lesen/schreiben. Beispiel: rk_test. | rk3308, px30, rk3326, rk3358, rk3566,<br>rk3568, rk3588, rv1126, rv1109, rk3528,<br>rk3562, rv1106, rv1103, rk3576,<br>rv1106b, rv1103b, rk3506, rv1126b |
| Non-<br>Protected<br>OEM Zone | Aus U-Boot und UserSpace zugänglich; Daten werden im Speicher der nicht sicheren Welt offengelegt. | rk3308, px30, rk3326, rk3358, rk3566,<br>rk3568, rk3588, rv1106, rv1103, rk3528,<br>rk3562, rk3576, rv1106b, rv1103b,<br>rk3506 |

Weitere Einzelheiten enthält `Rockchip_Developer_Guide_OTP_CN.pdf`.

## 14 TA-API

### 14.1 Übersicht

RK stellt folgende TA-APIs als Beispiele häufiger TEE Internal APIs und zur direkten Nutzung bereit.

### 14.2 API-Rückgabewerte

Rückgaben: TEE_SUCCESS — Erfolg; TEE_ERROR_BAD_PARAMETERS — ungültige Parameter; weitere Fehler siehe tee_api_defines.h.

### 14.3 API-Beschreibung

#### 14.3.1 Crypto API

##### 14.3.1.1 rk_crypto_malloc_ctx

```text
crypto_ctx_t *rk_crypto_malloc_ctx(void);
```

Funktion: Kontextressourcen einer Kryptooperation reservieren. Parameter: keine.

##### 14.3.1.2 rk_crypto_free_ctx

```text
void rk_crypto_free_ctx(crypto_ctx_t **ctx);
```

Funktion: Kryptokontext nach vollständigem Algorithmusablauf freigeben. Parameter ctx: Operationskontext.

##### 14.3.1.3 rk_hash_crypto

```text
TEE_Result rk_hash_crypto(uint8_t *in, uint8_t *out, uint32_t in_len,
                          uint32_t out_len, uint32_t algo);
```

Funktion: Nachrichtendigest berechnen. Für Teilverarbeitung rk_hash_begin/update/finish verwenden. Parameter: in — Eingabe; in_len — Eingabelänge; out — Ausgabe; out_len — Ausgabelänge.

algo: Algorithmustyp; TEE_ALG_MD5, TEE_ALG_SHA1, TEE_ALG_SHA224, TEE_ALG_SHA256,

TEE_ALG_SHA384, TEE_ALG_SHA512

##### 14.3.1.4 rk_hash_begin

```text
TEE_Result rk_hash_begin(crypto_ctx_t *ctx, uint32_t algo);
```

Funktion: schrittweise Hashberechnung initialisieren. ctx — Operationskontext.

algo: Algorithmustyp; TEE_ALG_MD5, TEE_ALG_SHA1, TEE_ALG_SHA224, TEE_ALG_SHA256,

TEE_ALG_SHA384, TEE_ALG_SHA512

##### 14.3.1.5 rk_hash_update

```text
TEE_Result rk_hash_update(crypto_ctx_t *ctx, uint8_t *in, uint32_t in_len);
```

Funktion: schrittweise Hashberechnung, interne Digestberechnung über Eingabedaten. ctx — Kontext; in — Eingabe; in_len — Eingabelänge.

##### 14.3.1.6 rk_hash_finish

```text
TEE_Result rk_hash_finish(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                          uint32_t in_len, uint32_t *out_len);
```

Funktion: letzten Teil verarbeiten und Digest aller Daten ausgeben. ctx — Kontext; in — Eingabe; in_len — Eingabelänge; out — Ausgabe; out_len — Ausgabelänge.

##### 14.3.1.7 rk_cipher_crypto

```text
TEE_Result rk_cipher_crypto(uint8_t *in, uint8_t *out, uint32_t len,
                            uint8_t *key, uint32_t key_len, uint8_t *iv,
                            uint32_t algo, TEE_OperationMode mode);
```

Funktion: symmetrisch ver-/entschlüsseln. Für Teile rk_cipher_begin/update/finish verwenden. in — Eingabe; len — Eingabelänge; out — Ausgabe; key — Schlüssel für algo; key_len — Schlüssellänge (abhängig von algo); iv — Initialisierungsvektor; algo — Algorithmustyp, Liste unten (OP-TEE V1 unterstützt kein SM).

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

mode: Verschlüsselungs- oder Entschlüsselungsmodus.

##### 14.3.1.8 rk_set_padding

```text
TEE_Result rk_set_padding(crypto_ctx_t *ctx, int padding);
```

Funktion: Auffüllmodus für Ver-/Entschlüsselungsdaten setzen. ctx — Kontext; padding — unterstützte Modi siehe rk_padding_t.

##### 14.3.1.9 rk_cipher_begin

```text
TEE_Result rk_cipher_begin(crypto_ctx_t *ctx, uint8_t *key, uint32_t key_len,
                           uint8_t *iv, uint32_t algo, TEE_OperationMode mode);
```

Funktion: schrittweise symmetrische Ver-/Entschlüsselung initialisieren. ctx — Kontext; key — Schlüssel; key_len — Schlüssellänge, abhängig von algo; iv — Initialisierungsvektor; algo — Algorithmustyp, Liste unten (OP-TEE V1 unterstützt kein SM).

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

mode: Verschlüsselungs- oder Entschlüsselungsmodus.

##### 14.3.1.10 rk_cipher_update

```text
TEE_Result rk_cipher_update(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                            uint32_t in_len, uint32_t *out_len);
```

Funktion: nächsten Eingabeteil schrittweise ver-/entschlüsseln. ctx — Kontext; in — zu verarbeitende Eingabe; in_len — Eingabelänge; out — Ausgabe; out_len — Ausgabelänge.

##### 14.3.1.11 rk_cipher_finish

```text
TEE_Result rk_cipher_finish(crypto_ctx_t *ctx, uint8_t *out, uint32_t *out_len);
```

Funktion: schrittweise symmetrische Ver-/Entschlüsselung abschließen. ctx — Kontext; out — Ausgabe; out_len — Ausgabelänge.

##### 14.3.1.12 rk_ae_begin

```text
TEE_Result rk_ae_begin(crypto_ctx_t *ctx, uint8_t *key, uint32_t key_len,
                       uint8_t *iv, uint32_t iv_len,
                       uint32_t add_len, uint32_t tag_len,
                       uint32_t payload_len, uint32_t algo, TEE_OperationMode mode);
```

Funktion: AES-CCM oder AES-GCM initialisieren. ctx — Kontext; key — Schlüssel; key_len — Länge, 16,24,32; iv — Initialisierungsvektor; iv_len — Vektorlänge; add_len — ADD-Länge für AES-CCM; tag_len — Taglänge in Bit: AES-GCM 128,120,112,104,96; AES-CCM 128,112,96,80,64,48,32; payload_len — AES-CCM-Nutzdatenlänge; algo — TEE_ALG_AES_GCM oder TEE_ALG_AES_CCM; mode — Ver-/Entschlüsselung.

##### 14.3.1.13 rk_ae_update

```text
TEE_Result rk_ae_update(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                        uint32_t in_len, uint32_t *out_len,
                        rk_ae_update_type_t is_aad);
```

Funktion: AES-CCM-/AES-GCM-Ver-/Entschlüsselung. ctx — Kontext; in — Eingabe; in_len — Eingabelänge; out — Ausgabe; out_len — Ausgabelänge; is_add — ob AAD (Additional Authentication Data) vorliegt.

##### 14.3.1.14 rk_ae_finish

```text
TEE_Result rk_ae_finish(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                        uint8_t *tag, uint32_t in_len,
                        uint32_t *out_len, uint32_t *tag_len);
```

Funktion: AES-CCM/AES-GCM abschließen. ctx — Kontext; in — letzter Eingabeteil; in_len — dessen Länge; out — Ausgabe; out_len — Ausgabelänge; tag — Tag im Ausgabepuffer; tag_len — Taglänge.

##### 14.3.1.15 rk_gen_rsa_key

```text
TEE_Result rk_gen_rsa_key(rsa_key_t *rsa_key, uint32_t key_len,
                          uint64_t public_exponent);
```

Funktion: zufälliges RSA-Schlüsselpaar erzeugen. rsa_key — erzeugtes Paar; key_len — RSA-Länge in Bytes, 32,64,96,128,192,256,384,512; public_exponent — Exponent, 3 oder 65537.

##### 14.3.1.16 rk_rsa_crypto

```text
TEE_Result rk_rsa_crypto(uint8_t *in, uint8_t *out, uint32_t len,
                         rsa_key_t *key, uint32_t algo, TEE_OperationMode mode);
```

Funktion: RSA-Ver-/Entschlüsselung, auch über rk_rsa_begin/finish möglich. in — Eingabedaten.

len — Eingabelänge; out — Ausgabe; key — RSA-Schlüssel; algo — RSA-Paddingmodus, unterstützte Varianten unten.

```text
TEE_ALG_RSAES_PKCS1_V1_5
TEE_ALG_RSAES_PKCS1_OAEP_MGF1_SHA1
TEE_ALG_RSAES_PKCS1_OAEP_MGF1_SHA224
TEE_ALG_RSAES_PKCS1_OAEP_MGF1_SHA256
TEE_ALG_RSAES_PKCS1_OAEP_MGF1_SHA384
TEE_ALG_RSAES_PKCS1_OAEP_MGF1_SHA512
TEE_ALG_RSA_NOPAD
```

mode — TEE_MODE_ENCRYPT oder TEE_MODE_DECRYPT.

##### 14.3.1.17 rk_rsa_sign

```text
TEE_Result rk_rsa_sign(uint8_t *digest, uint8_t *signature, uint32_t digest_len,
                       uint32_t *signature_len, rsa_key_t *key,
                       uint32_t salt_len, uint32_t algo, TEE_OperationMode mode);
```

Funktion: RSA-Signierung/-Prüfung, auch über rk_rsa_begin/finish. digest — Digest; signature — erzeugte oder zu prüfende Signatur; digest_len — Digestlänge; signature_len — Signaturlänge; key — RSA-Schlüssel; salt_len — optionale Salt-Bytezahl, ohne Angabe entspricht sie der Digestlänge; algo — Algorithmus, siehe GPD_TEE_Internal_Core_API_Specification, Table 6-4; mode — TEE_MODE_SIGN oder TEE_MODE_VERIFY.

##### 14.3.1.18 rk_set_sign_mode

```text
TEE_Result rk_set_sign_mode(crypto_ctx_t *ctx, unsigned int mode);
```

Funktion: RSA-Signierung von Daten oder Digest wählen. Parameter:

ctx — Kontext; mode — Daten SIGN_DATA oder Digest SIGN_DIGEST.

##### 14.3.1.19 rk_rsa_begin

```text
TEE_Result rk_rsa_begin(crypto_ctx_t *ctx, rsa_key_t *key,
                        uint32_t algo, TEE_OperationMode mode);
```

Funktion: RSA-Ver-/Entschlüsselung, Signierung oder Prüfung initialisieren. ctx — Kontext; key — RSA-Schlüssel; algo — Padding, erlaubte Werte hängen von mode ab, siehe GPD_TEE_Internal_Core_API_Specification, Table 6-4; mode — TEE_MODE_ENCRYPT, TEE_MODE_DECRYPT, TEE_MODE_SIGN, TEE_MODE_VERIFY.

##### 14.3.1.20 rk_rsa_finish

```text
TEE_Result rk_rsa_finish(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                         uint32_t in_len, uint32_t *out_len, uint32_t salt_len);
```

Funktion: nach rk_rsa_begin RSA-Ver-/Entschlüsselung, Signierung oder Prüfung ausführen. ctx — Kontext; in — Eingabe; in_len — Eingabelänge; out — Ausgabe; out_len — Ausgabelänge; salt_len — optionale Salt-Bytezahl.

##### 14.3.1.21 rk_gen_ec_key

```text
TEE_Result rk_gen_ec_key(ec_key_t *ec_key, uint32_t key_len, uint32_t curve);
```

Funktion: zufälliges ECC-Schlüsselpaar erzeugen.

ec_key — erzeugtes öffentliches/privates ECC-Paar; key_len — Bitlänge, 192,224,256,384,521; curve — ECC-Kurve, unterstützte siehe tee_api_defines.h.

##### 14.3.1.22 rk_ecdh_genkey

```text
TEE_Result rk_ecdh_genkey(uint8_t *private, uint8_t *publicx, uint32_t *publicy,
                          uint32_t algo,  uint32_t curve,
                          uint32_t keysize, uint8_t *out);
```

Funktion: ECDH zur Vereinbarung eines symmetrischen Schlüssels. private — privater ECC-Schlüssel; publicx — X des öffentlichen Schlüssels; publicy — Y des öffentlichen Schlüssels.

algo: TEE_ALG_ECDH_P192, TEE_ALG_ECDH_P224, TEE_ALG_ECDH_P256, TEE_ALG_ECDH_P384,

TEE_ALG_ECDH_P521

curve: ECC-Kurve; TEE_ECC_CURVE_NIST_P192, TEE_ECC_CURVE_NIST_P224,

TEE_ECC_CURVE_NIST_P256, TEE_ECC_CURVE_NIST_P384, TEE_ECC_CURVE_NIST_P521. keysize — Schlüssellänge in Bit, 192,224,256,384,521; out — ausgegebener symmetrischer Schlüssel.

##### 14.3.1.23 rk_ecdsa_sign

```text
TEE_Result rk_ecdsa_sign(uint8_t *digest, uint8_t *signature,
                         uint32_t digest_len, uint32_t *signature_len,
                         ec_key_t *key, uint32_t algo, TEE_OperationMode mode);
```

Funktion: ECDSA-Signierung/-Prüfung, auch über rk_ecdsa_begin/finish. digest — Eingabedigest; signature — erzeugte oder zu prüfende Signatur; digest_len — Digestlänge; signature_len — Signaturlänge; key — ECC-Schlüssel.

algo — TEE_ALG_ECDSA_P224, TEE_ALG_ECDSA_P256, TEE_ALG_ECDSA_P384, TEE_ALG_ECDSA_P521; mode — TEE_MODE_SIGN, TEE_MODE_VERIFY.

##### 14.3.1.24 rk_ecdsa_begin

```text
TEE_Result rk_ecdsa_begin(crypto_ctx_t *ctx, ec_key_t *key,
                          uint32_t algo,TEE_OperationMode mode);
```

Funktion: ECDSA-Signierung/-Prüfung initialisieren. ctx — Kontext; key — ECC-Schlüssel; algo — TEE_ALG_ECDSA_P224, TEE_ALG_ECDSA_P256, TEE_ALG_ECDSA_P384, TEE_ALG_ECDSA_P521; mode — TEE_MODE_SIGN, TEE_MODE_VERIFY.

##### 14.3.1.25 rk_ecdsa_finish

```text
TEE_Result rk_ecdsa_finish(crypto_ctx_t *ctx, uint8_t *in, uint8_t *out,
                           uint32_t in_len, uint32_t *out_len);
```

Funktion: Eingabedigest mit ECDSA signieren oder Digest/Signatur prüfen. ctx — Kontext; in — Eingabedigest; out — erzeugte oder zu prüfende Signatur; in_len — Eingabelänge; out_len — Signaturlänge.

##### 14.3.1.26 rk_sm2_pke

```text
TEE_Result rk_sm2_pke(uint8_t *in, uint32_t in_len, uint8_t *out,
                      uint32_t *out_len, ec_key_t *key,
                      uint32_t algo, TEE_OperationMode mode);
```

Funktion: SM2-Ver-/Entschlüsselung. OP-TEE V1 unterstützt diese API nicht.

in — zu ver-/entschlüsselnde Eingabe; in_len — Eingabelänge; out — Ausgabe; out_len — Ausgabelänge; key — SM2-Schlüssel; algo — TEE_ALG_SM2_PKE; mode — TEE_MODE_ENCRYPT oder TEE_MODE_DECRYPT.

##### 14.3.1.27 rk_sm2_dsa_sm3

```text
TEE_Result rk_sm2_dsa_sm3(uint8_t *digest, uint32_t digest_len,
                          uint8_t *signature, uint32_t *signature_len,
                          ec_key_t *key, uint32_t algo, TEE_OperationMode mode);
```

Funktion: SM2-Signierung/-Prüfung. Nicht in OP-TEE V1 unterstützt. digest — SM3-Digest; digest_len — fest32; signature — erzeugte oder zu prüfende Signatur; signature_len — Signaturlänge; key — SM2-Schlüssel; algo — TEE_ALG_SM2_DSA_SM3; mode — TEE_MODE_SIGN oder TEE_MODE_VERIFY.

##### 14.3.1.28 rk_sm2_kep_genkey

```text
TEE_Result rk_sm2_kep_genkey(rk_sm2_kep_parms *kep_parms, uint8_t *share_key,
                             uint32_t share_key_len, uint8_t *conf_out);
```

Funktion: SM2-basiertes ECDH, nicht von OP-TEE V1 unterstützt. kep_parms — SM2-Schlüsselinformationen mit privatem A- und öffentlichem B-Schlüssel; share_key — vereinbarter symmetrischer Schlüssel; share_key_len — Länge; conf_out — Sitzungsinformationen zur Prüfung.

##### 14.3.1.29 rk_mac_crypto

```text
TEE_Result rk_mac_crypto(uint8_t *in, uint8_t *out, uint32_t in_len,
                         uint32_t *out_len, uint8_t *key, uint32_t key_len,
                         uint8_t *iv, uint32_t algo);
```

Funktion: MAC berechnen; für Teile rk_mac_begin/update/finish. in — Eingabe; in_len — Eingabelänge; out — Ausgabe; out_len — Ausgabelänge; key — MAC-Schlüssel; key_len — Schlüssellänge; iv — Initialisierungsvektor.

algo: MAC-Algorithmus (V1 unterstützt kein SM), TEE_ALG_HMAC_MD5, TEE_ALG_HMAC_SHA1,

TEE_ALG_HMAC_SHA256, TEE_ALG_AES_CMAC, TEE_ALG_HMAC_SM3

##### 14.3.1.30 rk_mac_begin

```text
TEE_Result rk_mac_begin(crypto_ctx_t *ctx, uint8_t *key, uint32_t key_len,
                        uint8_t *iv, uint32_t algo);
```

Funktion: schrittweise MAC-Berechnung initialisieren. ctx — Kontext; key — MAC-Schlüssel; key_len — Schlüssellänge; iv — Initialisierungsvektor.

algo: MAC-Algorithmus (V1 unterstützt kein SM), TEE_ALG_HMAC_MD5, TEE_ALG_HMAC_SHA1,

TEE_ALG_HMAC_SHA256, TEE_ALG_AES_CMAC, TEE_ALG_HMAC_SM3

##### 14.3.1.31 rk_mac_update

```text
TEE_Result rk_mac_update(crypto_ctx_t *ctx, uint8_t *in, uint32_t in_len);
```

Funktion

Schrittweiser MAC: Eingabedaten für MAC-Berechnung sammeln. ctx — Kontext; in — Eingabe; in_len — Eingabelänge.

##### 14.3.1.32 rk_mac_finish

```text
TEE_Result rk_mac_finish(crypto_ctx_t *ctx, uint8_t *in, uint8_t *mac,
                         uint32_t in_len, uint32_t *mac_len, rk_mac_mode_t mode);
```

Funktion: MAC mit letztem Teil abschließen oder erwarteten MAC anhand des letzten Teils prüfen. ctx — Kontext; in — letzter Teil; in_len — dessen Länge; mac — MAC-Ausgabe bei mode=RK_MAC_SIGN, erwarteter Eingabe-MAC bei mode=RK_MAC_VERIFY; mac_len — MAC-Länge; mode — siehe mac.

##### 14.3.1.33 rk_hkdf_genkey

```text
TEE_Result rk_hkdf_genkey(uint8_t *ikm, uint32_t ikm_len,
                          uint8_t *salt, uint32_t salt_len,
                          uint32_t *info, uint32_t info_len,
                          uint32_t algo, uint32_t okm_len, uint8_t *okm);
```

Funktion: HKDF-Schlüsselableitung. ikm — Eingabepasswort; ikm_len — dessen Länge; salt — Eingabesalt; salt_len — dessen Länge; info — Eingabeinfo; info_len — deren Länge.

algo: TEE_ALG_HKDF_MD5_DERIVE_KEY, TEE_ALG_HKDF_SHA1_DERIVE_KEY,

TEE_ALG_HKDF_SHA224_DERIVE_KEY, TEE_ALG_HKDF_SHA256_DERIVE_KEY, TEE_ALG_HKDF_SHA384_DERIVE_KEY, TEE_ALG_HKDF_SHA512_DERIVE_KEY. okm_len — vorgegebene Länge des abgeleiteten Schlüssels; okm — abgeleiteter Schlüssel.

##### 14.3.1.34 rk_pkcs5_pbkdf2_hmac

```text
TEE_Result rk_pkcs5_pbkdf2_hmac(uint8_t *password, uint32_t password_len,
                                uint8_t *salt, uint32_t salt_len,
                                uint32_t iterations, uint32_t algo,
                                uint32_t key_len, uint8_t *out_key);
```

Funktion: Schlüssel aus salt, iteration count und password ableiten. password — Passwort; password_len — Länge; salt — Salt; salt_len — Länge; iterations — Iterationszahl; algo — TEE_ALG_PBKDF2_HMAC_SHA1_DERIVE_KEY; key_len — vorgegebene Schlüssellänge; out_key — abgeleiteter Schlüssel.

#### 14.3.2 HW Crypto API

##### 14.3.2.1 rk_user_ta_cipher

```text
TEE_Result rk_user_ta_cipher(rk_cipher_config *config, uint8_t *src, uint32_t len)
```

Funktion: User TA ver-/entschlüsselt mit Hardware-Crypto. config — Algorithmustyp/-modus, Schlüssel und weitere Parameter; src — Ein-/Ausgabe; len — Datenlänge. Beispielquellen in rk_tee_user.

##### 14.3.2.2 rk_keylad_hmac

```text
TEE_Result rk_keylad_hmac(uint32_t algo, enum RK_OEM_OTP_KEYID otp_keyid,
                          uint32_t key_len, uint8_t *msg, uint32_t msg_len,
                          uint8_t *mac, uint32_t *mac_len)
```

Funktion: User TA berechnet Hardware-Crypto-HMAC mit ausgewähltem OTP-Schlüssel. Zuerst muss der Schlüssel über OTP API programmiert sein. Nur manche Plattformen unterstützen dies, sonst TEE_ERROR_NOT_SUPPORTED. algo — Algorithmusmodus; otp_keyid — OTP-Schlüsselindex; key_len — Schlüssellänge; msg — Eingabe; msg_len — Eingabelänge; mac — Ausgabe; mac_len — Ausgabelänge. Beispielquellen in rk_tee_user.

##### 14.3.2.3 rk_keylad_cipher

```text
TEE_Result rk_keylad_cipher(enum RK_OEM_OTP_KEYID otp_keyid,
                            rk_cipher_config *config,
                            uint8_t *src, uint32_t len);
```

Funktion: User TA ver-/entschlüsselt mit Hardware-Crypto und ausgewähltem OTP-Schlüssel. Zuerst Schlüssel über OTP API programmieren. Nicht unterstützte Plattformen liefern TEE_ERROR_NOT_SUPPORTED. otp_keyid — OTP-Schlüsselindex; config — Algorithmustyp/-modus, Schlüssellänge und weitere Parameter; src — Ein-/Ausgabe; len — Datenlänge. Quellen:

Beispiel im Projekt rk_tee_user.

#### 14.3.3 TRNG API

##### 14.3.3.1 rk_get_trng

```text
TEE_Result rk_get_trng(uint8_t *buffer, uint32_t size);
```

Funktion: User TA erhält Hardwarezufallszahlen. Nicht unterstützte Plattformen liefern TEE_ERROR_NOT_SUPPORTED. buffer — zurückgegebene Zahlen, Speicher mindestens size; size — angeforderte Länge. Beispielquellen in rk_tee_user.

#### 14.3.4 Derive Key API

##### 14.3.4.1 rk_derive_ta_unique_key

```text
TEE_Result rk_derive_ta_unique_key(uint8_t *extra, uint16_t extra_size, uint8_t *key,
uint16_t key_size)
```

Funktion: User TA erhält einen vom hardwareeindeutigen Schlüssel abgeleiteten Schlüssel. Jeder Chip erhält bei der Herstellung einen eindeutigen Schlüssel; Ableitungen sind daher eindeutig. OP-TEE V1 unterstützt diese API nicht; alternativ TEE_DerivekeyFromHard verwenden. extra — Eingabe für verschiedene Ableitungen; extra_size — Eingabelänge; key — abgeleiteter Schlüssel; key_size — Schlüssellänge. Beispiel in rk_tee_user.

#### 14.3.5 OTP API

##### 14.3.5.1 rk_otp_size

```text
TEE_Result rk_otp_size(uint32_t *otp_size);
```

Funktion: User TA erhält die Gesamtgröße der Protected OEM Zone im sicheren OTP. otp_size — zurückgegebene OTP-Größe. Beispiel in rk_tee_user; Details im Abschnitt Protected OEM Zone von Rockchip_Developer_Guide_OTP_CN.pdf.

##### 14.3.5.2 rk_otp_read

```text
TEE_Result rk_otp_read(uint32_t offset, uint8_t *data, uint32_t len);
```

Funktion: User TA liest die Protected OEM Zone des sicheren OTP. offset — Leseoffset; data — Rückgabedaten, Speicher mindestens len; len — Leselänge. Beispiel in rk_tee_user; Details im Abschnitt Protected OEM Zone von Rockchip_Developer_Guide_OTP_CN.pdf.

##### 14.3.5.3 rk_otp_write

```text
TEE_Result rk_otp_write(uint32_t offset, uint8_t *data, uint32_t len);
```

Funktion: User TA schreibt in die Protected OEM Zone des sicheren OTP. offset — Schreiboffset.

data — zu schreibende Daten; len — Datenlänge. Beispiel in rk_tee_user; Details im Abschnitt Protected OEM Zone von Rockchip_Developer_Guide_OTP_CN.pdf.

##### 14.3.5.4 rk_write_oem_otp_key

```text
TEE_Result rk_write_oem_otp_key(enum RK_OEM_OTP_KEYID key_id,
                                uint8_t *key, uint32_t key_len)
```

Funktion: User TA programmiert einen OTP-Schlüssel. key_id — Index; key — zu schreibender Schlüssel; key_len — Länge. Beispiel in rk_tee_user; Abschnitt OEM Cipher Key von Rockchip_Developer_Guide_OTP_CN.pdf.

##### 14.3.5.5 rk_is_oem_otp_key_written

```text
TEE_Result rk_is_oem_otp_key_written(enum RK_OEM_OTP_KEYID key_id, bool *is_written)
```

Funktion: User TA prüft, ob ein Schlüssel programmiert ist. Bei gesperrtem Schlüssel wird TEE_ERROR_ACCESS_DENIED geliefert. key_id — Index; is_written — 0 nicht programmiert, 1 programmiert. Beispiel in rk_tee_user; Abschnitt OEM Cipher Key von Rockchip_Developer_Guide_OTP_CN.pdf.

##### 14.3.5.6 rk_oem_otp_key_set_read_lock

```text
TEE_Result rk_oem_otp_key_set_read_lock(enum RK_OEM_OTP_KEYID key_id)
```

Funktion: User TA sperrt einen Schlüssel. Danach hat die CPU keinen Zugriff; Software kann ihn nicht lesen/schreiben, nur Hardware-Crypto kann ihn lesen und nutzen. Nur manche Plattformen unterstützen dies. key_id — Index. Beispiel in rk_tee_user; Abschnitt OEM Cipher Key von Rockchip_Developer_Guide_OTP_CN.pdf.

## 15 PTA

### 15.1 Übersicht

PTA ist in TEE OS eingebettet und heißt auch interne TA. Ihre Schnittstellen implementieren nicht in TEE Internal API enthaltene Funktionen und bieten Aufrufbeispiele oder direkte Nutzung.

### 15.2 PTA-Funktionen

#### 15.2.1 Sichere Speicherung

Wichtige Nutzerdaten werden von TEE OS verschlüsselt in security, RPMB oder dem Android-/Linux-Dateisystem gespeichert. Normalerweise ruft User TA TEE Internal API auf. Da U-Boot kritische Bootdaten speichern muss, bietet PTA eine sichere Speicherschnittstelle mit Bereichsauswahl per Parameter.

#### 15.2.2 OTP lesen/schreiben

OTP ist einmal programmierbarer Speicher; geschriebene Daten sind unveränderlich. TEE Internal API enthält keine OTP-Schnittstellen, daher implementiert PTA Lesen/Schreiben. PTA OTP kann folgende Daten programmieren:

| OTP-Daten | Beschreibung |
| --- | --- |
| Secure Boot Public Hash | Prüft den öffentlichen Schlüssel beim Secure Boot |
| AVB Attribute Hash | Prüft das attribute-Zertifikat im AVB-Ablauf |
| OEM Cipher Key | Ver-/Entschlüsselungsschlüssel für Hardware-Crypto |
| Non-Protected OEM Zone | Nicht sensible OEM-Daten, für die nicht sichere Welt zugänglich |
| Protected OEM Zone | Sensible OEM-Daten, nur für die sichere Welt zugänglich |
| TA Encrypt Key | Entschlüsselt eine verschlüsselte TA beim Laden durch TEE OS |
| OEM Encrypt Data | Für den Schutz vor Board-Kopien |
| OEM HUK | Eindeutiger OEM-Hardwareschlüssel; siehe Abschnitt zur Auswahl starker/schwacher Sicherheit |

#### 15.2.3 Hardware-Crypto-Ver-/Entschlüsselung

TEE Internal API bietet standardmäßig Softwarekryptografie. Hardwarekryptografie wird über PTA bereitgestellt: symmetrisches DES, TDES, AES und SM4 mit wählbarem OTP-Schlüssel sowie HMAC mit wählbarem OTP-Schlüssel.

#### 15.2.4 Hardwarezufallszahlen

TEE Internal API enthält keine Schnittstelle für echte Zufallszahlen; PTA implementiert sie. PTA TRNG liefert echte hardwaregenerierte Zufallsdaten beliebiger Länge.

#### 15.2.5 Hardwareeindeutige Schlüsselableitung

TEE Internal API enthält keine Ableitung vom hardwareeindeutigen Schlüssel; PTA implementiert sie. Jeder Chip erhält bei der Herstellung einen HUK aus einem echten Zufallsgenerator. HUKs unterscheiden sich pro Chip, daher sind abgeleitete Schlüssel eindeutig.

### 15.3 PTA aufrufen

U-Boot: Schnittstellenquellen u-boot/lib/optee_clientApi, Beschreibung im Abschnitt Optee Client von Rockchip_Developer_Guide_UBoot_Nextdev_CN. Userspace: librkcrypto, Beschreibung Rockchip_Developer_Guide_Crypto_HWRNG_CN.pdf. User TA: rk_tee_user, Beschreibung im TA-API-Abschnitt dieses Dokuments.

## 16 Weitere Quellen

ARM TrustZone: https://developer.arm.com/ip-products/security-ip/trustzone. GlobalPlatform: https://globalplatform.org/ — dort stehen TEE Client API Specification für CA, TEE Internal Core API Specification für TA und weitere Architekturdokumente bereit.

{% endraw %}

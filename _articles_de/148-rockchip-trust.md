---
title: "Rockchip Trust: vollständiger Leitfaden zu TrustZone, PSCI, sicherer Welt und PANIC"
description: "Rockchip Trust: vollständiger Leitfaden zu TrustZone, PSCI, sicherer Welt und PANIC — V1.1.1"
excerpt: "Rockchip Trust: vollständiger Leitfaden zu TrustZone, PSCI, sicherer Welt und PANIC"
translation_key: 148-rockchip-trust
slug: 148-rockchip-trust
lang: de
date: "2026-10-23"
author: "ArmSoM Editorial · Rockchip source documentation"
category: linux
products: []
tags: [ArmSoM, Rockchip, TrustZone, PSCI, OP-TEE]
---

{% raw %}

# Rockchip Trust: vollständiger Leitfaden zu TrustZone, PSCI, sicherer Welt und PANIC

Beide Quellen tragen V1.1.1. Geltungsbereich: RK3036/RK3126C/RK3288/RK322X/RK3368/RK3328/RK3399/PX30/RK3308; Kernel 3.10, 4.4 und 4.19. Nur ArmSoM-Plattformreferenz: Platine, SoC, SDK/BSP, trust/ATF/OP-TEE und Kernel prüfen; keine universelle Platinenunterstützung. Chinesisch nutzt chinesische, EN/RU/DE englische Originalbilder. Logs sind Quellbeispiele; keine Hardwaretests oder Änderungen der Sicherheitskonfiguration.

> Speicherbereiche, Einsprungadressen und Logs gehören zu Quellbeispielen; nicht ungeprüft auf andere BSPs übertragen. Adressen und Registerwerte bleiben erhalten. Historische Aussagen zur Binärbereitstellung gelten nicht pauschal für heutige Plattformen.

Technisches Vorwort: Die Quelle beschreibt Trust als Rockchip-SDK-Firmware, erläutert seine Rolle und die Sammlung von Fehlerinformationen. Vollständiger Quellzugriff wird als auf einige interne Ingenieure beschränkt beschrieben, grundlegende Funktionen für RK322x/RK3328/RK3368/RK3399/PX30 jedoch ausdrücklich als offen. Dies sind historische Quellaussagen, keine Garantie aktueller Verfügbarkeit. Der vollständige technische Text bleibt erhalten, nicht nur eine Zusammenfassung.

[ArmSoM Docs](https://docs.armsom.org/) · [Rockchip tools](https://github.com/rockchip-linux/rkdeveloptool)

## 1. ARM TrustZone

ARM TrustZone [1] ist eine Grundfunktion von Cortex-A-Prozessoren, eingeführt durch ARM-Sicherheitserweiterungen. Diese bieten über Anbieter, Plattformen und Anwendungen hinweg ein einheitliches Programmiermodell mit hardwaregestützter sicherer Umgebung. TrustZone schützt systemweit Anwendungen wie sichere Zahlungen, DRM, Unternehmens- und Webdienste. Die enge Cortex-A-Integration wird über den AMBA-AXI-Bus und spezielle TrustZone-IP-Blöcke erweitert und bietet Sicherheit auf Hardwareebene. So können sicherer Speicher, Kryptoblöcke, Tastaturen und Bildschirme gegen Softwareangriffe geschützt werden. Verbreitete Open-Source-Implementierungen sind ARM Trusted Firmware und OP-TEE OS [2], niedrigstufige ARM-Firmwareprojekte, die gemeinsam oder getrennt einsetzbar sind.

### 1.1 Systemarchitektur

Die folgende 64-Bit-Architektur verwendet ARM TrustZone. Links liegt die nicht sichere, rechts die sichere Welt. Die sichere Welt darf Ressourcen beider Welten nutzen; die nicht sichere nur ihre eigenen. Zugriffe auf sichere Ressourcen aus der nicht sicheren Welt verursachen Hardware-Busfehler oder ähnliche Ausnahmen und erhalten keinen Zugriff. ARM Trusted Firmware verbindet beide Welten. Eine nicht sichere CPU tritt über die ARM-SMC-Instruktion zunächst in ARM Trusted Firmware ein; Secure Monitor setzt ihren Status auf sicher und wechselt dann in die sichere Welt. Umgekehrt gilt dasselbe. Der Statuswechsel erfolgt auf Hardwareebene. Rockchip Trust kombiniert ARM Trusted Firmware und OP-TEE OS und implementiert die benötigten sicheren Funktionen sowie Secure Monitor als Kern des Weltwechsels.

![TrustZone-Architekturdiagramm der englischen Quelle](/docs/rockchip-trust/assets/en-p006-figure-01.png)

*TrustZone-Architekturdiagramm der englischen Quelle*

![TrustZone-Architekturdiagramm der englischen Quelle](/docs/rockchip-trust/assets/en-p006-figure-02.png)

*TrustZone-Architekturdiagramm der englischen Quelle*

### 1.2 CPU-Privilegstufen

Das nächste Diagramm zeigt CPU-Privilegmodi mit TrustZone. Eine 64-Bit-CPU besitzt EL0, EL1, EL2 und EL3; EL0/EL1 sind je nach Welt sicher oder nicht sicher. Eine 32-Bit-CPU besitzt Mon, Hyp, SVC, ABT, IRQ, FIQ, UND, SYS und USER; SVC, ABT, IRQ, FIQ, UND, SYS und USER haben ebenfalls sichere/nicht sichere Varianten. Rockchip Trust entspricht funktional EL3 plus sicherem EL1.

![TrustZone-Architekturdiagramm der englischen Quelle](/docs/rockchip-trust/assets/en-p007-figure-01.png)

*TrustZone-Architekturdiagramm der englischen Quelle*

![TrustZone-Architekturdiagramm der englischen Quelle](/docs/rockchip-trust/assets/en-p007-figure-02.png)

*TrustZone-Architekturdiagramm der englischen Quelle*

## 2. Trust auf Rockchip-Plattformen

### 2.1 Implementierung

Die beschriebenen 64-Bit-SoCs von Rockchip verwenden ARM Trusted Firmware mit OP-TEE OS; 32-Bit-SoCs verwenden OP-TEE OS.

### 2.2 Startablauf

ARM Trusted Firmware beschreibt EL0, EL1, EL2 und EL3 sowie die Startstufen BL1, BL2, BL31, BL32 und BL33. Die eigenen Quellen implementieren BL1, BL2 und BL31. Rockchip nutzt nur dessen BL31 und implementiert BL1/BL2 selbst. Daher bezeichnet ARM Trusted Firmware bei Rockchip üblicherweise BL31; BL32 ist OP-TEE OS. Zuordnung: Maskrom (BL1), Loader (BL2), Trust (BL31: ARM Trusted Firmware + BL32: OP-TEE OS), U-Boot (BL33). Android-Firmware-Startfolge:

```text
Maskrom -> Loader -> Trust -> U-Boot -> kernel -> Android
```

![TrustZone-Architekturdiagramm der englischen Quelle](/docs/rockchip-trust/assets/en-p008-figure-01.png)

*TrustZone-Architekturdiagramm der englischen Quelle*

### 2.3 Firmware beziehen

Die Quelle beschreibt die Bereitstellung als Binärdateien ohne vollständigen Quellcode. Trust-Binärdateien liegen im U-Boot-Projekt:

```text
./tools/rk_tools/bin/rk30/
./tools/rk_tools/bin/rk31/
./tools/rk_tools/bin/rk32/
./tools/rk_tools/bin/rk33/
```

Beim Bauen von uboot.img für eine Plattform wird gleichzeitig trust.img im U-Boot-Hauptverzeichnis erstellt. Eine ini-Datei referenziert die Binärdateien für das Paket. Diese ini-Dateien liegen im U-Boot-Projekt:

```text
tools/rk_tools/RKTRUST/
```

Entwickler können auch das separate rkbin-Repository mit den Plattform-Binärdateien herunterladen.

### 2.4 Aktivierung über DTS

#### 2.4.1 Kernel 3.10

##### 2.4.1.1 32-Bit-Plattformen

(1) Einen psci-Knoten ergänzen:

```text
psci {
    compatible      = "arm,psci";
    method          = "smc";
    cpu_suspend     = <0x84000001>;
    cpu_off         = <0x84000002>;
    cpu_on          = <0x84000003>;
    affinity_info   = <0x84000004>;
};
```

(2) psci=enable in chosen oder parameter ergänzen.

```text
chosen {
    bootargs = "psci=enable vmalloc=496M cma=4M rockchip_jtag";
};
```

##### 2.4.1.2 64-Bit-Plattformen

(1) Einen psci-Knoten ergänzen:

```text
psci {
        compatible = "arm,psci-0.2";
        method = "smc";
};
```

(2) enable-method = "psci"; unter dem cpu-Knoten ergänzen.

```text
cpus {
        #address-cells = <2>;
        #size-cells = <0>;

        cpu@0 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x0>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@1 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x1>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@2 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x2>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@3 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x3>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };

        .....
};
```

#### 2.4.2 Kernel 4.4+

##### 2.4.2.1 32-Bit-Plattformen

Den psci-Knoten ergänzen:

```text
psci {
        compatible = "arm,psci-1.0";
        method = "smc";
};
```

##### 2.4.2.2 64-Bit-Plattformen

(1) Einen psci-Knoten ergänzen:

```text
psci {
        compatible = "arm,psci-1.0";
        method = "smc";
};
```

(2) enable-method = "psci"; unter dem cpu-Knoten ergänzen.

```text
cpus {
        #address-cells = <2>;
        #size-cells = <0>;

        cpu@0 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x0>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@1 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x1>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@2 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x2>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };
        cpu@3 {
                device_type = "cpu";
                compatible = "arm,cortex-a53", "arm,armv8";
                reg = <0x0 0x3>;
                enable-method = "psci";
                cpu-idle-states = <&CPU_SLEEP>;
        };

        .....
};
```

#### 2.4.3 Kernel-Dokumentation

Die Kernel-Dokumentation erläutert PSCI hier:

```text
./Documentation/devicetree/bindings/arm/psci.txt
```

### 2.5 Laufzeitspeicher und Lebensdauer

#### 2.5.1 Laufzeitspeicher

ARM Trusted Firmware läuft bei DRAM-Offsets 0M–2M mit Einsprungadresse 0x10000 (64KB). OP-TEE OS läuft bei 132M–148M; die Endadresse hängt von Plattformanforderungen ab. Einsprungadresse: 0x08400000 (132M).

#### 2.5.2 Lebensdauer

Nach der Initialisierung beim Einschalten bleibt Trust während des gesamten Betriebs im Speicher resident.

### 2.6 Security

Mit TrustZone ist Firmware auf beide Welten verteilt. Bei Rockchip laufen Loader und Trust sicher; U-Boot, Kernel und Android nicht sicher, ausgenommen sichere Treiber und Anwendungen.

### 2.7 Funktionen

#### 2.7.1 PSCI(Power State Coordination Interface)

SoC-IC-Entwürfe unterscheiden sich stark, besonders bei der CPU-Stromverwaltung. Herstellerspezifische Softwareabläufe fragmentieren den Kernelcode und erschweren eine Vereinheitlichung. Normale Entwickler benötigen diese eng an CPU-Architektur und IC-Entwurf gebundenen, schwer vollständig verständlichen oder implementierbaren Details selten. Der Kernel verlagert CPU-Stromverwaltung deshalb bevorzugt in Herstellerfirmware und behält die Steuerungsstrategie, um Code zu vereinheitlichen. Dafür wurde PSCI (Power State Coordination Interface) [3] eingeführt. Die CPU-Kern-Stromverwaltungsschnittstellen treten über ARM-SMC-Instruktionen in Trust ein und erledigen CPU-Ein-/Ausschalten, tiefen System-Suspend, Reset, Abschalten usw. Wesentliche Schnittstellen:

```text
PSCI_VERSION
PSCI_FEATURES
CPU_ON
CPU_OFF
CPU_SUSPEND
SYSTEM_SUSPEND
AFFINITY_INFO
SYSTEM_OFF
SYSTEM_RESET
......
```

Codepfade für Kernel 4.4+

```text
./arch/arm/kvm/psci.c
./arch/arm/kernel/smccc-call.S
./arch/arm64/kernel/psci.c
./arch/arm64/kernel/smccc-call.S
./drivers/firmware/psci.c
./drivers/firmware/rockchip_sip.c
```

Codepfade für Kernel 3.10

```text
./arch/arm/kernel/psci.c
./arch/arm64/kernel/psci.c
./arch/arm/mach-rockchip/psci.c
```

#### 2.7.2 Secure Monitor

Secure Monitor verbindet CPU-Zustandswechsel zwischen sicherer und nicht sicherer Welt. Er ist in Trust implementiert; ohne ihn wäre kein Sicherheitszustandswechsel möglich und TrustZone verlöre seinen Zweck. Der Eintritt erfolgt per SMC. Das ARM-Handbuch erklärt: Die Secure-Monitor-Call-Ausnahme gehört ausschließlich zu den Security Extensions; SMC fordert eine Secure-Monitor-Funktion an und versetzt den Prozessor in Monitor mode.

#### 2.7.3 Sicherheitskonfiguration

Neben Cortex-A-Integration wird TrustZone über AMBA AXI und spezielle System-IPs erweitert. Die Sicherheitseinstellungen dieser IP-Module müssen daher konfiguriert werden, gewöhnlich in Trust.

#### 2.7.4 Schutz sicherer Daten

Schutz sicherer Daten umfasst den Speicherschutz von Sicherheitsinformationen für Zahlungen, DRM, Unternehmens- und Webdienste.

## 3. Rockchip-Trust-Fehlersuche

Die Quelle beschreibt öffentlich bereitgestellte Trust-Firmware als binär. Debuggingmöglichkeiten sind begrenzt und erfordern häufig spezielle JTAG-Werkzeuge. Normale Nutzer können Trust-Fehler meist nicht selbst beheben; daher Fehlerzustand erhalten und ausreichend Informationen für den Trust-Maintainer sammeln. Nutzer sollten Trust-Meldungen, Firmwareversionen und PANIC-Ausgaben erkennen können.

### 3.1 Beispiel eines Startprotokolls

```text
NOTICE:  BL31: v1.3(debug):4c793da
NOTICE:  BL31: Built : 18:13:44, Dec 25 2017
NOTICE:  BL31:Rockchip release version: v1.3
INFO:    ARM GICv2 driver initialized
INFO:    Using opteed sec cpu_context!
INFO:    boot cpu mask: 1
INFO:    plat_rockchip_pmu_init: pd status 0xe
INFO:    BL31: Initializing runtime services
INFO:    BL31: Initializing BL32
INF [0x0] TEE-CORE:init_primary_helper:337: Initializing (1.1.0-127-g27532f4 #54
Mon Dec 18 02:01:14 UTC 2017 aarch64)
INF [0x0] TEE-CORE:init_primary_helper:338: Release version: 1.4
INF [0x0] TEE-CORE:init_teecore:83: teecore inits done
INFO:    BL31: Preparing for EL3 exit to normal world
INFO:    Entry point address = 0x200000
INFO:    SPSR = 0x3c9
```

### 3.2 Protokollmeldungen erkennen

Abgesehen vom Startprotokoll verwendet ARM Trusted Firmware zur Laufzeit gewöhnlich dieses Format ohne Zeitstempel:

```text
INFO: *********
```

OP-TEE-OS-Format ohne Zeitstempel:

```text
INF [0x0] TEE-CORE: *********
```

### 3.3 Firmwareversionen erkennen

ARM-Trusted-Firmware-Version: 4c793da.

```text
NOTICE:  BL31: v1.3(debug):4c793da
```

OP-TEE-OS-Version: 27532f4 (führendes g ignorieren).

```text
INF [0x0] TEE-CORE:init_primary_helper:337: Initializing (1.1.0-127-g27532f4 #54
Mon Dec 18 02:01:14 UTC 2017 aarch64)
```

### 3.4 PANIC-Meldungen erkennen

#### 3.4.1 ARM-Trusted-Firmware-Panic

```text
Unhandled Exception in EL3.
x30 =           0x00000000ff00fff0
x0 =            0x00000000000101c0
x1 =            0x0000000000000000
x2 =            0x0000000000000000
x3 =            0x0000000000000000
x4 =            0x0000000000cd383b
x5 =            0x0000000000080001
x6 =            0x0000000080803520
x7 =            0x00000000000342a0
x8 =            0x00000000000101c0
x9 =            0x0000000000000000
x10 =           0x0000000000000000
x11 =           0x0000000000000000
x12 =           0x0000000000000001
x13 =           0x00000000000101b8
x14 =           0x000000000001a950
x15 =           0x0000000000000000
x16 =           0x00000000000101c0
x17 =           0x0000000000000000
x18 =           0x0000000000000000
x19 =           0x0000000000000000
x20 =           0x0000000040000000
x21 =           0x0000000000000040
x22 =           0x00000000000305b0
x23 =           0x000000000001016c
x24 =           0x00000000000101c0
x25 =           0x0000000000000000
x26 =           0x0000000000000000
x27 =           0x0000000000000000
x28 =           0x0000000000035bf8
x29 =           0x0000000000000000
scr_el3 =       0x00000000000101c0
sctlr_el3 =     0x0000000000000000
cptr_el3 =      0x0000000000000000
tcr_el3 =       0x0000000000000000
daif =          0x0000000000000238
mair_el3 =      0x0000000000cd383b
spsr_el3 =      0x0000000000000000
elr_el3 =       0x0000000080803520
ttbr0_el3 =     0x00000000000101c0
esr_el3 =       0x0000000000000000
far_el3 =       0x0000000000000000
spsr_el1 =      0x00000000000101c0
elr_el1 =       0x0000000000000000
spsr_abt =      0x0000000000000000
......
```

#### 3.4.2 OP-TEE-OS-Panic

```text
core data-abort at address 0xc121b16c

 fsr 0x00000805  ttbr0 0x6847446a  ttbr1 0x6847006a  cidr 0x2
 cpu #0          cpsr 0x200001d1
 r0 0x20068000      r4 0x68407195    r8 0x00000000   r12 0x00000000
 r1 0x00000049      r5 0x6848068b    r9 0x6840a3bd    sp 0xc121b1a4
 r2 0x6848068c      r6 0x6848068c   r10 0x684808cc    lr 0x684296a6
 r3 0x0000001f      r7 0x00000001   r11 0x68404f9d    pc 0x6840041c

ERR [0x0] TEE-CORE:tee_pager_handle_fault:125: Unexpected page fault! Trap CPU
PANIC: tee_pager_handle_fault core/arch/arm/include/mm/tee_pager.h:126
```

## 4. Anhang: Referenzen

[0] Open-Source-Downloads:

ARM Trusted Firmware:https://github.com/ARM-software/arm-trusted-firmware

OP-TEE OS:https://github.com/OP-TEE/optee_os

[1] ARM TrustZone:

https://www.arm.com/products/security-on-arm/trustzone

https://developer.arm.com/technologies/trustzone

[2] OP-TEE-Website: https://www.op-tee.org/

[3] PSCI:http://infocenter.arm.com/help/topic/com.arm.doc.den0022c/DEN0022C_Power_State_Coordination_Interface.pdf "Power State Coordination Interface PDD (ARM DEN 0022C)"

{% endraw %}

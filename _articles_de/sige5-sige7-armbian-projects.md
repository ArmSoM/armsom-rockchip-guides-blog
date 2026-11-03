---
title: "Sige5 / Sige7 mit Armbian: sechs Linux-Projekte für die Praxis"
description: "Desktop, Container, Dateidienste, Automatisierung und Edge-Vision auf Sige5 oder Sige7 mit klaren Prüfschritten planen."
excerpt: "Desktop, Container, Dateidienste, Automatisierung und Edge-Vision auf Sige5 oder Sige7 mit klaren Prüfschritten planen."
translation_key: "sige5-sige7-armbian-projects"
slug: "sige5-sige7-armbian-projects"
lang: "de"
date: "2026-11-03"
author: "ArmSoM"
category: "linux"
products: ["Sige5", "Sige7"]
tags: ["Armbian", "Linux", "ArmSoM", "Rockchip", "Debian", "Ubuntu"]
image: "/assets/rk3576/sige5.png"
---

![Sige5 / Sige7 mit Armbian: sechs Linux-Projekte für die Praxis](/assets/rk3576/sige5.png)

*Offizielle ArmSoM-Produktabbildung; Chipfunktionen belegen nicht die vollständige Beschleunigungsunterstützung eines Armbian-Images.*

Eine Spezifikation beantwortet nur einen Teil der Auswahlfrage. Womit muss das Gerät kommunizieren, welche Daten behalten, wer bedient es und wie wird es nach einem Fehler wiederhergestellt? Sige5 und Sige7 sind vollständige Einplatinenplattformen. Mit Armbian kann aus einem einzelnen Dienst schrittweise eine Linux-Anwendung entstehen.

Die sechs Szenarien sind Entwicklungsvorschläge, keine Liste getesteter Programme oder Benchmarks. Treiber und Anwendungsversionen des gewählten Images müssen separat geprüft werden.

## 1. Mit den Anschlüssen beginnen

| Plattform | Auswahlmerkmale | Zuerst zu prüfende Aufgaben |
|---|---|---|
| Sige5 | RK3576, zweimal Gigabit-Ethernet, NVMe-Erweiterung | Datenerfassung, Gerätedienste, Linux-Entwicklung |
| Sige7 | RK3588, zweimal 2.5GbE, PCIe-3.0-Speichererweiterung | Mehrere Dienste, Speicherprototypen mit höherem Bandbreitenbedarf |

Das sind Hardwaremerkmale, keine Durchsatzgarantien unter Armbian. Speicher, Kühlung, Software und Gegenstelle beeinflussen das Ergebnis. Details enthalten die Produktseiten von [Sige5](https://www.armsom.org/sige5) und [Sige7](https://www.armsom.org/sige7). RAM, Speicher und Zubehör der konkreten Variante prüfen.

Armbian führt getrennte Einträge für [Sige5](https://armbian.com/boards/armsom-sige5) und [Sige7](https://armbian.com/boards/armsom-sige7). Ähnliche Platinenformen machen Images nicht austauschbar. Die Einträge haben derzeit Community-Status; Image-Auswahl und erster Start stehen im Einstiegsartikel dieser Reihe.


![ArmSoM Sige7](/assets/rk3588/sige7.png)

*Offizielle ArmSoM-Produktabbildung; Chipfunktionen belegen nicht die vollständige Beschleunigungsunterstützung eines Armbian-Images.*

## 2. Projekt eins: eigener Linux-Entwicklungsdesktop

Editor, Terminal, Git-Arbeitsverzeichnis und serielle Werkzeuge auf einer Platine reduzieren den Wechsel zwischen Rechnern. Denkbar sind Unterricht, kleine Software-Builds, Netzwerkdiagnose oder ein dediziertes Entwicklungsterminal.

Mit einem Monitor, Tastatur und Maus beginnen. Anmeldung, Anzeigemodus, Audio und Netzwerk prüfen, danach den tatsächlichen Editor einrichten. Pakete müssen zur Zielarchitektur passen. Ein funktionierender Desktop beweist keine Beschleunigung von Browser-Videos, 3D oder jeder Grafik-API. Eine echte Aufgabe abnehmen: Projekt bearbeiten, bauen, externes Gerät verbinden und nach erneuter Anmeldung weiterarbeiten.

## 3. Projekt zwei: lokale Containerdienste

Dashboard, Projektdokumentation oder Nachrichtendienst eignen sich als überschaubare Bereitstellungsaufgabe. Erst eine Anwendung betreiben, dann den Nutzen von Containern bewerten. Sie trennen Abhängigkeiten, ersetzen aber keine Host-Kerneltreiber. Images müssen die CPU-Architektur unterstützen.

Persistente Daten vom Containerlebenszyklus trennen. Logrotation, Ressourcenlimits und Zustandsprüfungen vorsehen. Nur notwendige Ports zunächst im lokalen Netz öffnen; Verwaltungsoberflächen nicht direkt ins Internet stellen. Neustart, Dienstabbruch, vollen Speicher und Wiederherstellung testen. Ein neu erstellter Container ohne wiederhergestellte Daten ist noch keine vollständige Rückkehr zum Betrieb.

## 4. Projekt drei: Dateibibliothek und Sicherungsknoten

Familienfotos, Projektarchive oder kleine Teamfreigaben liefern ein sinnvolleres Anfangsziel als maximalen Durchsatz. Vor der Dienstwahl Laufwerkserkennung und Einhängepunkte prüfen. Stabile Laufwerkskennungen verhindern, dass geänderte Gerätenamen Schreibzugriffe umleiten.

Systemmedium, Nutzdaten und Sicherungen trennen. Eine Netzwerkfreigabe ist keine Datensicherung; mehrere Laufwerke ersetzen keine externe oder offline gehaltene Kopie. Große Dateien, viele kleine Dateien, parallele Clients und Integrität nach Stromunterbrechung prüfen. Sige7-Schnittstellen können die Auswahl begründen, ihre Nennraten sind aber keine gemessenen Übertragungswerte.

## 5. Projekt vier: Automatisierungs- und IoT-Konsole

Sensorwerte sammeln, Zustände anzeigen und Nachrichten weiterreichen lässt sich schrittweise erweitern. Erfassung, Nachrichten, Regeln und Darstellung trennen. Den Ablauf zuerst mit simulierten Daten verbinden, danach reale Geräte anschließen.

Bei GPIO, I2C und seriellen Verbindungen Pins, Pegel, Multiplexing und Treiber prüfen. UART ist kein RS485; Feldschnittstellen benötigen häufig Transceiver und Isolation. Auch USB-Funkkoordinatoren brauchen passende Treiber. Abnehmen sollten Sie sicheres Verhalten ohne Netzwerk, Vermeidung doppelter Befehle nach Wiederverbindung und die Erkennung veralteter Daten bei abweichenden Uhren.

## 6. Projekt fünf: Netzwerk- und Betriebslabor

Zwei Ethernetanschlüsse helfen beim Aufbau eines isolierten Labors für Routing, Überwachung und Fernverwaltung. Einen unabhängigen Verwaltungsweg erhalten, Schnittstellennamen dokumentieren und Konfigurationen schrittweise ändern. Eine lokale Konsole ermöglicht Wiederherstellung bei Fehlern.

Diese nicht destruktiven Prüfungen aktivieren weder Routing noch Firewallregeln:

```sh
ip -br link
ip route
ss -lnt
lsblk -o NAME,SIZE,TYPE,MOUNTPOINTS
df -h
```

Versuchskonfigurationen nicht direkt ins Büronetz übernehmen. Adresskonflikte, Verbindungsabbruch, Beständigkeit nach Neustart und Verwaltungsrechte prüfen; Internetzugang allein genügt nicht.

## 7. Projekt sechs: Edge-Vision-Prototyp

Erfassung, Vorverarbeitung, Inferenz und Darstellung getrennt entwickeln. Zuerst mit Bilddateien eine Genauigkeitsreferenz schaffen, dann die Kamera anschließen. Vor höheren Bildraten reproduzierbare Ergebnisse erreichen. So wird sichtbar, ob Aufnahme, Modell oder Anzeige begrenzen.

Eine NPU im Prozessor bedeutet nicht, dass eine Anwendung sie nach der Armbian-Installation automatisch nutzt. Kerneltreiber, RKNN-Laufzeit, Modellkonvertierung und Integration müssen zusammenpassen. Kamera, ISP und Videocodecs haben eigene Voraussetzungen. Ende-zu-Ende-Latenz, Genauigkeit, CPU-Auslastung, Temperatur und Bildverluste über längere Zeit messen. TOPS ersetzen keine Anwendungsmessung. Ein CPU-Referenzpfad hilft bei Fehlern in der Beschleunigungskette.

## 8. Eine Abnahmetabelle führen

| Phase | Aufzubewahrende Nachweise |
|---|---|
| Grundstart | Hardwarestand, Image, Kernel und Versorgung |
| Funktion | Reale Eingaben, Sollausgaben, Fehler- und Wiederanlaufverfahren |
| Dauerlauf | Speichertrend, Logwachstum, Temperatur und Fehler |
| Wartung | Wiederherstellung, Updatevergleich und Rückkehrverfahren |

Ein Szenario zuerst wiederherstellbar machen, dann Dienste kombinieren. Desktop plus Speicher oder Erfassung plus Nachrichten benötigt erneute Prüfung auf Ressourcenkonflikte. ArmSoM-Unterlagen und Armbian-Konfigurationen liefern den Ausgangspunkt; die Anwendungsprüfung entscheidet über die Eignung.

## 9. Produkte und Umsetzung

- [Sige5 und Varianten](https://www.armsom.org/sige5) · [Hardwareunterlagen](https://docs.armsom.org/armsom-sige5)
- [Sige7 und Varianten](https://www.armsom.org/sige7) · [Hardwareunterlagen](https://docs.armsom.org/armsom-sige7)
- [Armbian-Dokumentation](https://docs.armbian.com/): Installations- und Softwareverfahren am aktuellen Image prüfen.

## Weitere Artikel dieser Reihe

- [ArmSoM × Armbian: vom passenden Image zum ersten Linux-Projekt](/de/articles/armsom-armbian-getting-started/)
- [CM5 mit Armbian: vom Modulprototyp zum eigenen Linux-Gerät](/de/articles/cm5-armbian-custom-device/)

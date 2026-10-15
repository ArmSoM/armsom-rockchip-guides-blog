# Rockchip GPIO Output Clocks - editorial notes

## Sources and pairing

- Chinese: `Rockchip_Developer_Guide_Gpio_Output_Clocks_CN.pdf`.
- English: `Rockchip_Developer_Guide_GPIO_Output_Clocks_EN.pdf`, 29 pages, V1.4.0, 2025-04-16.
- The source topic and technical chapter sequence are paired. English naming differs only in `GPIO` capitalization.

## Processing record

- Technical concepts, pin-to-clock mapping, IO command examples and software/DTS implementation sections were reviewed.
- The documents contain no independently extractable technical images; mappings are restored as editable tables.
- Cover legal/contact material, intended-audience section and revision history are omitted. Original PDFs were not changed.

## Verification limits

- Pin availability, IO voltage, mux values, debugfs nodes and register write masks depend on the exact package, board and BSP.
- `io -4` examples remain source-specific; no cross-SoC or ArmSoM validation is claimed.

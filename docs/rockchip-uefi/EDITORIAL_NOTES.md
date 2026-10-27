# 207 UEFI 校对记录

- 主稿：cn/en Linux/Uefi/Rockchip_Developer_Guide_UEFI_{CN,EN}.pdf，均12页，RK-KF-YF-935 V1.4.0。
- 补充比对：cn/RK3588/UEFI/Rockchip_Developer_Guide_UEFI_CN.pdf，10页，同ID与版本；完整技术内容检查为相同，差别为分页/目录编号，不另建重复主题。
- 章节覆盖：§1代码树；§2两个构建入口、DTB前提；§3eMMC/SPI Nor；§4Android/GRUB和cmdline；§5.1–5.4SPI/PCIe/显示/USB，包含全部C代码、补丁和末页USB函数。
- 已移除封面声明日期密级、读者修订表及重复静态目录；保留技术版本与所有命令参数、GUID、寄存器。
- 中文2图用中文原图；英俄德2图用英文原图。图为工具界面，未用整页PDF替代正文。
- 合并parameter长行、GUID长行、toolchain路径、edk2路径、cmdline换行；代码diff的+/-、十六进制值全部保留。分离代码块中的“改成/changed to”说明。
- 疑点：boot_uef.img和boot_uefi.img混用；SPI源路径boot/与eMMC的u-boot/不同；RockchipPlatfromLib拼写不擅改；内核包5.10.66与包版本5.10.84-1并存；$CUR_DIR片段未定义；均保留或在正文提醒。
- 中英差异：中文明确build.sh kernel、英文只说build.sh；正文补录，未执行脚本。
- 不声称ArmSoM已验证，不照抄EVB寄存器到其他板卡；ACPI支持状态限定原文版本。
- PDF联系表已检查；静态四语完整性与全站构建、SEO、浏览器验收由主代理统一汇总。

# ArmSoMNAS 用户案例校对记录

日期：2026-11-11。用户提供 `Compact and mobile NAS community Eng.pdf`（9 页），要求撰写用户案例并将 BananaNAS 改为 ArmSoMNAS。本文正文、标题、摘要、slug、alt 均使用 ArmSoMNAS；BananalNAS 变体未进入文章。保留 UberNAS 社区归属，不将用户设计改写成 ArmSoM 自研/已售标准套装。原 PDF 不修改、不上传，本记录完成于本地预览阶段；用户随后已明确批准四语文章、配图和相关记录一并提交发布，发布结果以对应 Git 提交和部署记录为准。

四语：中文、英文、俄文、德文，使用同一 translation_key，category=projects、products=[Sige7]，自动进入现有应用案例栏目、文章列表和搜索。

8 张原始图像从 PDF 内嵌图直接提取并原样复制，未重绘、去标或生成硬件细节：p.2 Twin NVMe；p.3 UPS 和 OLED；p.4 两张整机图；p.5 紧凑桌面；p.6 收纳包；p.8 OMV 界面。省略重复的 p.7 外观照片及 p.9 二维码，保留社区文字链接。外壳/PCB 标记及截图主机名保留原样。图注说明图示属于作者原型。

编辑核对：
- 原稿 Amsom/Armsom/Sige 7 统一为 ArmSoM/Sige7；NVME 规范为 NVMe。
- 原稿提及 BPI-M7 或 Sige7 两种主板，本文只讲 Sige7 方案；不据照片推定所有原型都装同一主板。
- 双盘扩展没有拓扑、单盘 lane 宽度和驱动细节，不宣称 2×x4 或任意双盘适配。
- 原稿 RPi 2040 按 RP2040 规范书写，同时正文明确原写法与待核对边界；USB HID 不等于完整自动关机已验证。
- 两节 LiFePO4 18650，不混写为普通锂离子电芯；没有给出容量、充放电电路或接线教程。
- 约 1.5 小时续航归于案例作者；测试负载、电芯容量、SSD 和截止条件缺失，不写作 ArmSoM 实测。
- 原稿 p.8 截图显示多个 sda–sde 与 nvme 设备、历史时间及 pixelnas 主机名；明确是参考管理界面，不将其容量、温度和 uptime 归于本文双盘原型。
- 不继承“替代任意电脑”“没有技术限制”等绝对说法；不虚构吞吐、整机尺寸、续航、热测试或当前销售状态。
- RAID 0/1 与独立备份分开；应用场景是编辑建议，非已部署客户名单。
- 原稿称社区逾千人，未当作当前统计引用；保留社区贡献和用户协作主线。

2026-11-11 复核官方资料：Sige7 的 RK3588、双 2.5GbE、M.2 PCIe 3.0 x4 来自 https://docs.armsom.org/armsom-sige7；Armbian https://armbian.com/boards/armsom-sige7 标记 Community；OMV https://www.openmediavault.org/ 提供 Web 存储管理。原型具体发行版/内核/OMV 版本未知，不使用当前下载版本冒充原型版本。

复用四语切换、目录、SEO、搜索、sitemap 和主页应用案例逻辑；不修改全站布局、robots、验证文件。不声称获得搜索引擎收录。构建与预览验收结果另记。

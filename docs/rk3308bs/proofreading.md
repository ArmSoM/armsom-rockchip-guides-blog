# RK3308B-S / P2 Pro 校对记录

本批4主题、16个中英俄德页面，仅供本地审核，未提交或发布。Datasheet文章为工程导读，非72页逐行译文，完整原文提供下载。

## 来源与图片
- 用户提供 RK3308B-S Datasheet V1.0，2021-10-10，72页；副本路径和SHA256见 source-manifest.json。
- 框图取第15页，标识图第17页，B-S封装顶/侧/底视第18页；保留原图标注与水印，修复裁切边界，未使用H-S图替代。
- 产品图与板卡布局来自 https://docs.armsom.org/armsom-p2pro ，四语共用官方原图并本地化alt。
- 芯片网页 https://www.rock-chips.com/a/cn/product/RK33xilie/2018/0614/908.html
- 产品 https://www.armsom.org/product-page/p2pro 和 https://www.armsom.org/p2pro
- BSP https://github.com/ArmSoM/armsom-p2pro-bsp

## 保留差异与适用边界
- B-S为外部内存，H-S内置64MB DDR2不可套用于B-S。
- PDF第67页最大A35频率1.1GHz；P2 Pro官方资料有1.2GHz与1.3GHz，未擅自统一。
- 通用RK3308网页RGB/MCU上限720P；附件B-S写1080p，不等于P2 Pro具有HDMI视频接口。
- 文档蓝牙5.0与独立产品页4.2不一致，需按模块和BSP确认。
- 芯片Ta 0–85°C，P2 Pro文档0–70°C，未混用。
- eMMC与PoE为可选配置；单百兆以太网；40针不代表树莓派兼容。
- 保留CPU推荐电压最小/最大TBD、典型0.90V；Codec电流不解释为整板功耗。
- 无硬件实测，无客户部署或算法性能承诺；BSP及具体内核以交付镜像为准。

## 校对范围
四语标题、章节、表格、示例命令、下载链接与关联文章一致；英文原图用于所有语言。原PDF未修改，下载副本校验哈希。构建后验证结果见preview-qa.json；浏览器验收另行完成。

## 本地验收完成
Jekyll构建通过；16/16页面HTTP、canonical、hreflang、sitemap、搜索、图片与内部链接检查通过；PDF副本SHA256一致。浏览器390px宽度无页面横向溢出，表格overflow auto，目录展开、跳转和aria-current高亮通过。预览端口4034，仅绑定127.0.0.1。未commit、push或发布。

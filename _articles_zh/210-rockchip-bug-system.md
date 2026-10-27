---
title: "Rockchip Bug 系统使用指南"
description: "Rockchip Bug 系统使用指南 — V1.1.3"
excerpt: "Rockchip Bug 系统使用指南"
translation_key: "210-rockchip-bug-system"
slug: "210-rockchip-bug-system"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "linux"
products: []
tags: [ArmSoM, Rockchip, SDK, Redmine, Linux]
---

{% raw %}

# Rockchip Bug 系统使用指南

ArmSoM 开发流程参考，依据 Rockchip Bug 系统中英 V1.1.3 原稿（24/27 页）。这是 SDK 支持与问题反馈流程，不是板卡驱动能力说明；无特定 SoC、SDK 或内核的兼容性承诺。使用相关服务需已有合法账户、商务授权和对应 SDK 权限。本文不授予访问权，未登录、修改账户、提交问题或进行硬件验证。

安全说明：原稿共享 FTP 密码不公开，需向授权接口人获取。重置密码邮件截图使用已遮盖完整令牌链接的脱敏副本，保留文字步骤；其余界面图按原语言使用。非技术第 5 章联系人/投诉渠道删除，保留原第 6 章编号。Camera 链接中英有差异，正文并列记录。`data/arn/trace.txt` 及 Android manifest 列表末尾反引号为原文疑点，未猜测改写。历史服务器路径仅作来源记录，可用性未验证。

## 1. 使用说明

### 1.1 申请流程

Rockchip Bug系统访问的网站是:https://redmine.rock-chips.com/。现在,Redmine账号将由Rockchip系统自动创建,申请流程如下:SDK_申请流程

![SDK 申请流程](/docs/rockchip-bug-system/assets/cn-p004-flowchart.png)

Rockchip规定是一用戶只能申请一个Redmine账号,据特殊情况可以开通多个Redmine账号,具体请与Rockchip对应商务或者接口人沟通,协助在Rockchip内部申请,批准后即可开通。如:您们有较多Rockchip平台的项目,或者您们部⻔较大且人员较多还相对独立,这影响到我们双方不便利的沟通等原因均可。

### 1.2 登录方法

您完成如上的商务流程后,Rockchip系统会发送一份邮件通知《Rockchip Redmine账号创建成功》如下:

![原稿操作界面 — 4](/docs/rockchip-bug-system/assets/cn-p004-figure-01.png)

Rockchip会将创建好的Redmine账号、初始密码及已关联邮箱,通过邮件发送给您,然后您可直接使用Redmine地址进行登录。

### 1.3 账号激活

您使用Rockchip提供登录名和初始化密码激活您的账号。

![原稿操作界面 — 5](/docs/rockchip-bug-system/assets/cn-p005-figure-01.png)

您通过这些步骤激活并登录您的Redmine,接下来开始您的Redmine之旅。

### 1.4 提交问题

您登录进入Rockchip的Redmine系统,问题提交步骤如下:

#### 1.4.1 选择FAE项目

在如下⻚面的右上方下拉列表选择“FAE项目”,如下图:

![原稿操作界面 — 5](/docs/rockchip-bug-system/assets/cn-p005-figure-02.png)

#### 1.4.2 创建问题

a. 在如下面界面,点击红色框中“+”的“新建问题”;

![原稿操作界面 — 6](/docs/rockchip-bug-system/assets/cn-p006-figure-01.png)

b. 接着弹出一个文本框“Redmine 提示,请仔细阅读注意事项,这能提高您的工作效率;在看完后,点击“确定”按钮后,退出通知文本框;

![原稿操作界面 — 6](/docs/rockchip-bug-system/assets/cn-p006-figure-02.png)

#### 1.4.3 填写问题具体内容

当您进入创建问题⻚面后,填写主题问题详细内容,让配合解决该问题的技术人员仅通过此次描述就能理解具体需求,这样能提高双方工作效率;

![原稿操作界面 — 7](/docs/rockchip-bug-system/assets/cn-p007-figure-01.png)

### 1.5 属性的说明

跟踪:包含defect、feature、support和test, 请您根据具体问题的实际类别来填写;主题:简要描述问题。要求命名方式:芯片名字+SDK版本+问题概要描述。例如:“RK3588_Rockchip_Android13.0_SDK xx不能工作”;描述:请尽量详细描述问题:复现异常的详细步骤、对比的详细数据、目标数据、状态、分析的初步结论等;要提供log、截图、现场照片或者视频等放于附件中,这不能超过10M。如超过,需通过其他方式(或者网盘的链接等)给Rockchip做分析;状态:包含New、Confirmed、Feedback、Resolved、Closed、Hangup和Reopen的 7种状态分别是:New:您提交的问题;Confirmed: 问题已指派工程师跟进,工程师正在处理该问题;Feedback:工程师针对问题提供可行性建议,不确定您是否接受;Resolved:工程师认为此问题已经解决,等待您的验证;Closed:问题经过验证已经得到解决,关闭问题;Hangup:问题暂时没有很有效的解决方法;Reopen:问题得到解决,在后续又重现并需要重新处理。优先级:分为低、普通、紧急、立刻;

目标版本:请选择此项目所使用的 SDK版本号;RK芯片经销商:具体的代理商/分销商,如不清楚,请您在内部咨询相关负责人;产品类型:具体产品类型;Component_fae:请选择对应模块,如果是分不清楚选择others;Seriousness:问题的严重性,分为:Fatal、Serious、Bad和Warning;Problem-type:共性问题、特殊问题、一般问题、简单问题;联系方式Name &amp; Tel.:请填写贵司提交本问题的工程师联系方式,以便问题进一步沟通确认问题的信息及状态;Probability of occurrence:此问题出现的概率;您提交问题后,由Rockchip工程师进行处理,问题处理结束后,请务必及时关闭问题,将问题状态更新为Closed。若挂太多“悬而未解的”的问题(如:您们没更新Rockchip提供的解决方法后的问题状态),这会影响你们所有提交到Redmine系统的问题的处理速度。

### 1.6 搜索简介

Rockchip已把Redmine系统中的共性问题提取出来,方便您随时能自主搜索和学习Rockchip平台已处理过的问题。链接是:https://redmine.rock-chips.com/projects/redmine-issues/issues

### 1.7 硬件审图

您导入Rockchip平台的第一个项目或与Rockchip商务确认的关键项目,强烈建议给Rockchip硬件配合审核这项目的原理图和PCB Layout图(这两个文件是需要提供原始图纸,防止遗漏,同时提高审图工程师的工作效率)。在项目没特殊需求情况下,原则上Rockchip只检查一次(原理图和PCB Layout一起审核)。有特殊需要,请发邮件给对应的Rockchip接口人或者商务,让他们来推动对应人员配合。强烈建议您使用Rockchip提供的DDR模板(直接拷⻉不要做任何修改),这提供的DDR模板是仿真过的,同时有客戶大批量产了,能确保系统的稳定性和可靠性。若有改动一定提交给Rockchip确认,并联系Rockchip商务协调资源仿真,以免影响您们项目开发的进度。当您有保密等特殊原因,不能提供原理图和PCB Layout的原始文件,可以安排工程师带上图纸一起来Rockchip办公室现场审核(这需要提前预约:因为配合审图的人员,可能被分配在深圳、福州或者上海)。

## 2. 系统设置

### 2.1 功能简介

在此分别介绍Redmine系统的个人账号设置,如设置个人账号基础信息、语言、多人邮件同时使用,邮件通知状态等。在 Redmine任一界面的右上⻆,点击进入‘我的账号’;

![原稿操作界面 — 9](/docs/rockchip-bug-system/assets/cn-p009-figure-01.png)

然后进入如下“我的账号”设置界面。

![原稿操作界面 — 9](/docs/rockchip-bug-system/assets/cn-p009-figure-02.png)

### 2.2 设置方法

#### 2.2.1 设置基本信息

在‘我的账号’界面的下方,可以设置名字、姓氏和邮件地址。

![原稿操作界面 — 9](/docs/rockchip-bug-system/assets/cn-p009-figure-03.png)

注:请用贵司的具体公司名称及工作邮件地址,便于Rockchip识别和维护,以免影响贵司账号使用。

#### 2.2.2 设置系统语言

a. 在‘我的账号’界面的下方,点击选择您需要的“语言”。

![原稿操作界面 — 10](/docs/rockchip-bug-system/assets/cn-p010-figure-01.png)

b. 在“语言”下拉列表选择具体语言后,点击按钮“保存”即可。

![原稿操作界面 — 11](/docs/rockchip-bug-system/assets/cn-p011-figure-01.png)

#### 2.2.3 设置邮件通知

您可以根据贵司项目需求,设置Redmine系统推送邮件通知内容。a. 在‘我的账号’界面右边,点击“邮件通知”下拉列表。

![原稿操作界面 — 12](/docs/rockchip-bug-system/assets/cn-p012-figure-01.png)

b. 根据您的需求,选择对应邮件通知,有如下选项供选择:收取我的项目的所有通知收取选中项目的所有通知只收取我关注或参与的项目的通知只发送我关注或指派给我的相关信息只发送我关注或我创建的相关信息不收取任何通知

![原稿操作界面 — 13](/docs/rockchip-bug-system/assets/cn-p013-figure-01.png)

c. 如果不需要收到自己提交的修改的通知,把如下“不要发送对我自己提交的修改的通知”选中即可。

![原稿操作界面 — 13](/docs/rockchip-bug-system/assets/cn-p013-figure-02.png)

#### 2.2.4 设置多人使用

一个Redmine账号可以多人同时使用,这样多个邮箱能同时收到一条“问题”的更新信息,能及时了解进展情况,加快了解决问题的效率。a. 在‘我的账号’界面右上⻆,点击进入‘电子邮件’;

![原稿操作界面 — 14](/docs/rockchip-bug-system/assets/cn-p014-figure-01.png)

b. 随后弹出如下界面,请添加邮箱,点击‘新增’保存即可。

![原稿操作界面 — 14](/docs/rockchip-bug-system/assets/cn-p014-figure-02.png)

c. 添加邮箱成功后,除了在‘邮箱地址’的主邮箱能收到“问题”的动态信息,如下‘电子邮件’列表中邮件地址均可以获取到这信息;

![原稿操作界面 — 15](/docs/rockchip-bug-system/assets/cn-p015-figure-01.png)

d. 添加成功后,在2.2.1 设置基本信息设置的邮件地址会如有邮件通知。

![原稿操作界面 — 15](/docs/rockchip-bug-system/assets/cn-p015-figure-02.png)

e. 如邮箱使用者离职等人员变动,请及时将其从列表中删除,避免并造成对邮件列表的占用和项目的保密性。

![原稿操作界面 — 15](/docs/rockchip-bug-system/assets/cn-p015-figure-03.png)

f. 删除成功后,在2.2.1 设置基本信息设置的邮件地址会如有邮件通知。

![原稿操作界面 — 16](/docs/rockchip-bug-system/assets/cn-p016-figure-01.png)

#### 2.2.5 修改密码

a. 在‘我的账号’界面右边,点击按钮“修改密码”,弹出如界面;

![原稿操作界面 — 16](/docs/rockchip-bug-system/assets/cn-p016-figure-02.png)

b. 在您输入当前密码和新密码后,点击“按钮”应用弹出如下界面,即修改成功。

![原稿操作界面 — 17](/docs/rockchip-bug-system/assets/cn-p017-figure-01.png)

c. 同时,您将收到以下电子邮件通知。

![原稿操作界面 — 17](/docs/rockchip-bug-system/assets/cn-p017-figure-02.png)

#### 2.2.6 找回密码

如果在使用过程中忘记了密码,通过2.2.1 设置基本信息设置的邮件找回密码。a. 打开Rockchip官方访问地址:https://redmine.rock-chips.com/login,点击按钮“忘记密码”。

![原稿操作界面 — 18](/docs/rockchip-bug-system/assets/cn-p018-figure-01.png)

b. 在如下界面,填写2.2.1 设置基本信息的邮件,点击按钮"提交"。

![原稿操作界面 — 18](/docs/rockchip-bug-system/assets/cn-p018-figure-02.png)

c . “提交”成功后,有如下提示:

![原稿操作界面 — 18](/docs/rockchip-bug-system/assets/cn-p018-figure-03.png)

d. 查看2.2.1 设置基本信息的邮箱,将收到如下带有登录名的链接。（图中完整重置链接已遮盖；请使用自己的授权邮件。）

![重置密码邮件（中文原稿脱敏副本，完整重置链接已遮盖）](/docs/rockchip-bug-system/assets/cn-p019-figure-01-redacted.png)

e. 打开如上链接后,输入该账号新密码。

![原稿操作界面 — 19](/docs/rockchip-bug-system/assets/cn-p019-figure-02.png)

g. 设置完如上密码后,跳转到登录⻚面再次登录,同时2.2.1 设置基本信息的邮箱收到如下信息:

![原稿操作界面 — 19](/docs/rockchip-bug-system/assets/cn-p019-figure-03.png)

## 3. 系统上的资料说明

在此系统上,Rockchip是把一些平台资料分开放在Redmine和对应的FTP上,方便客戶及时查阅(https://redmine.rock-chips.com/projects/fae/documents)。主要有平台性的技术简报、平台关键物料(Flash、DDR、eMMC、Wi-Fi和Camera)支持列表等:

### 3.1 FTP的服务器

在此FTP(FTP地址:[ ftp://www.rockchip.com.cn]账号名: rkwifi 密码：[向授权接口人获取])上存放了平台共性资料,具体如下:Wi-Fi相关的支持列表、驱动、认证工具等,均可通过此ftp获取。您在调试Wi-Fi/BT时,可以参考附件分析排查相关问题;(01-Wifi、02-BT、11-Linux平台)个性化功能补丁;(05-补丁Patch:多窗口、色温调节、多u盘多分区挂载、回音消除降噪补丁、HDMI_IN、a2dpsink蓝牙音箱补丁等)应用程序的源码;(06-各类源码:播放器、pcba测试、压力测试、Wifidisplay、OtaUpdate等)主流平台的芯片datasheet;(08-Datasheet)Linux平台的资料;(11-Linux平台:包括DPDK、Linux平台支持的Wi-Fi及BT等各类应用源码)Android平台Google的安全补丁;(10-Security_Patch)RKIVE硬件加速模块的文档及patch;(12-Rockchip_RKIVE_Simulator_release)主流平台对应的SDK版本及SDK的发布文档;(13-Rockchip_SDK_Release_Note)

### 3.2 Redmine的文档栏

在Redmine上的文档栏(https://redmine.rock-chips.com/projects/fae/documents),列出了入⻔类文档、EVB板固件、平台支持关键物料列表、SDK支持列表、发布的平台补丁、技术简报及模块开发资料,详⻅如下:

#### 3.2.1 补丁发布

Redmine访问路径是:https://redmine.rock-chips.com/projects/rockchip_patch/issues

#### 3.2.2 EVB板的资料

Readmine访问路径是:https://redmine.rock-chips.com/projects/fae/urllist

#### 3.2.3 技术信息简报

Redmine访问路径是:https://redmine.rock-chips.com/projects/fae/boards/6

#### 3.2.4 硬件参考设计版本和DDR模板列表

Redmine访问路径:https://redmine.rock-chips.com/documents/116,这里包括硬件设计版本及各个芯片平台支持的DDR模板及版本。如果您拿到的资源低于此版本,请与RK资料窗口申请最新版本。

#### 3.2.5 关键物料Flash支持列表

Redmine访问路径是:https://redmine.rock-chips.com/documents/46

#### 3.2.6 关键物料DDR支持列表

Redmine访问路径是:https://redmine.rock-chips.com/documents/49

#### 3.2.7 关键物料eMMC支持列表

Redmine访问路径是:https://redmine.rock-chips.com/documents/50

#### 3.2.8 关键物料Wi-Fi支持列表

Redmine访问路径是:https://redmine.rockchip.com.cn/documents/52,与Wi-Fi相关的支持列表、驱动、认证工具等,均可通过 FTP获取,此是地址:(ftp://www.rockchip.com.cn);账号名:rkwifi ;密码：[向授权接口人获取]

#### 3.2.9 关键物料摄像头推荐列表

Redmine访问路径是:https://redmine.rockchip.com.cn/documents/53。英文原稿对应链接为 https://redmine.rock-chips.com/documents/50 ，两稿不一致，需核实实际资源。

#### 3.2.10 SDK支持的版本及发布文档

Redmine访问路径是:https://redmine.rock-chips.com/documents/117您的第一版硬件的关键物料(Flash、eMMC、DDR、Wi-Fi和Camera)必须需用RK AVL中的颗粒或者模型,不然板子回来后如果系统跑不起来或者基本功能不能用(如Wi-Fi和Camera不能正常工作),Rockchip工程师不能快速定位具体原因并解决。待项目基本功能调通和整机稳定后,您考虑做一些兼容物料的验证(如:Flash、DDR、eMMC、Wi-Fi和Camera),如果您需要Rockchip配合的调试这些物料,请给Rockchip的对应商务或者接口人发邮件申请。

## 4. 现场支持

Rockchip会根据您公司情况、项目进度安排和具体问题的状态,安排合适人员到现场提供技术支持服务。这里的现场技术支持包括两种方式:您到Rockchip现场支持和Rockchip到您们的现场支持;

### 4.1 到Rockchip现场支持

如下几种情况,您可以申请到Rockchip现场处理:现场审图(原理图和PCB Layout图);需借助Rockchip硬件设备或者实验室测试;需要特殊的软硬件环境Rockchip才能配合解决;通过Bug系统沟通已无法解决的问题,需现场配合,如搭建复现环境等;由于Bug系统的处理速度已不能满足项目当前进度;重点项目需要紧急攻关的。这些问题都需至少提前一天(工作日)预约申请到Rockchip现场处理,预约方式是给对应Rockchip的商务或者技术接口人先沟通,他们同意后,Rockchip内部根据客戶具体问题确认,才安排上海、深圳或者福州的合适人员接待并处理。

### 4.2 到客戶现场支持

如下几种情况,您可以申请Rockchip到现场处理:现场审图,重点项目需Rockchip到现场一起审图(原理图和PCB Layout图);需Rockchip配合到实验室测试验证;需要特殊的软硬件环境Rockchip才能配合解决;通过Bug系统沟通已无法解决的问题,需现场配合,如是在生产线上的问题、搭建复现环境等;由于Bug系统的处理速度已不能满足此项目的当前进度;重点项目需要紧急攻关。由于Rockchip研发资源非常紧张,这些问题您是需至少要提前两天(工作日)预约申请Rockchip到现场处理,预约方式是给对应Rockchip的商务或者技术接口人先沟通,他们同意后,Rockchip内部根据客戶具体问题状态,然后安排上海、深圳或者福州的合适人员出差。一般是建议客戶最好能到Rockchip现场处理,由于去客戶现场人员有限,能够在客戶现场解决的问题也不多。

## 6. Q&amp;A

### 6.1 提交软件Case的例子

为了尽快解决问题,减少沟通成本,这里举了一个例子。

#### 6.1.1 提交问题必需提供的信息

a. logcat以及kernel的log;logcat信息:串口或者adb shell下面输入命令logcat -v time(如果干扰信息比较多,抓取有效log前最好执行一下logcat -c,比如启动某个apk时异常,那么比较好的log就是在启动这个apk前先执行一下logcat -c,然后在执行logcat -v time,之后在启动apk,这样获取的信息就比较容易找到关键信息);kernel信息:串口直接输出或者adb shell下面执行命令dmesg。如果应用发生无响应或者是强制关闭的,提供一下trace文件(data/arn/trace.txt)。b. 基本的操作流程,即Rockchip的工程师根据说明,可以复制这过程,并复现这问题;c. sdk版本信息的确认;RK3588 Linux SDK为例:

```text
~/linux_rk3588/.repo/manifests$ ls  rk3588_*
rk3588_linux_release.xml  rk3588_nvr_linux.xml

rk3588_linux:
RK3588_Linux5.10_SDK_Note.md            rk3588_linux_beta_v0.1.1_20220421.xml
rk3588_linux_release_v1.0.2_20220820.xml  rk3588_linux_release_v1.0.5_20221120.xml
rk3588_linux_release_v1.1.1_20230520.xml
rk3588_linux_alpha_v0.0.1_20220115.xml  rk3588_linux_release_v1.0.0_20220520.xml
rk3588_linux_release_v1.0.3_20220920.xml  rk3588_linux_release_v1.0.6_20221220.xml
rk3588_linux_release_v1.2.0_20230620.xml
rk3588_linux_beta_v0.1.0_20220414.xml   rk3588_linux_release_v1.0.1_20220620.xml
rk3588_linux_release_v1.0.4_20221020.xml  rk3588_linux_release_v1.1.0_20230420.xml
rk3588_linux_release_v1.2.1_20230720.xml

rk3588_nvr_linux:
rk3588_linux_nvr_release_v1.0.0_20220304.xml  rk3588_linux_nvr_release_v1.3.0_20220805.xml
rk3588_linux_nvr_release_v1.5.0_20230105.xml
rk3588_linux_nvr_release_v1.1.0_20220418.xml  rk3588_linux_nvr_release_v1.4.0_20221015.xml
rk3588_linux_nvr_release_v1.6.0_20230510.xml
rk3588_linux_nvr_release_v1.2.0_20220610.xml  rk3588_linux_nvr_release_v1.4.1_20221114.xml
RK3588_Linux_NVR_SDK_Note.md
```

在提交问题时,除了要把SDK大版本选择正确外,还请也告知SDK的更新的小版本:如:rk3588_linux_release_v1.2.1_20230720.xml或者rk3588_linux_nvr_release_v1.6.0_20230510.xml。RK3588 Android13 SDK为例

```text
~/rockchip_android13.0_sdk_release/.repo/manifests/include$ ls
partner_gms_express.xml      rk3326_repository.xml  rk3528_repository.xml
rk356x_repository.xml  rk_checkout_repository.xml
partner_modules_express.xml  rk3399_repository.xml  rk3562_repository.xml
rk3588_repository.xml  rk_modules_repository.xml`
```

同上,在提交问题时,除了要把SDK大版本选择正确外,还请也告知SDK的更新的小版本:如 rk3588_repository.xml或者rk3399_repository.xml。查看RK维护的Android版本

```text
~/rockchip_android13.0_sdk_release/.repo/manifests/include$ cat rk3588_repository.xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest>
  <project path="device/rockchip/rk3588" name="rk/device/rockchip/rk3588" remote="rk"
revision="refs/tags/android-13.0-mid-rkr5" />
</manifest>
```

这里的“android-13.0-mid-rkr5”,是RK3588 android13 R5版本。

[ArmSoM Docs](https://docs.armsom.org/)

[Rockchip Redmine](https://redmine.rock-chips.com/)

{% endraw %}

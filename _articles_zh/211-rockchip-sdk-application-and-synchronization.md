---
title: "Rockchip SDK 申请及同步指南"
description: "Rockchip SDK 申请及同步指南 — V1.1.8"
excerpt: "Rockchip SDK 申请及同步指南"
translation_key: "211-rockchip-sdk-application-and-synchronization"
slug: "211-rockchip-sdk-application-and-synchronization"
lang: "zh"
date: "2026-10-26"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "development"
products: []
tags: [ArmSoM, Rockchip, SDK, Git, Repo]
---

{% raw %}

# Rockchip SDK 申请及同步指南

依据 Rockchip RK-YH-YF-801 V1.1.8（2025-10-24）中英文原稿，保留申请、授权、同步、SDK 版本、工具及故障处理的完整技术内容。原第 4 章纯联络/投诉信息及封面法律、受众和修订页已移除，其他章节保留原编号。143 行 SDK 矩阵及推荐星级是原稿历史记录，不代表当前维护状态或 ArmSoM 板卡适配承诺。未执行账号申请、下载、密钥变更、仓库删除或硬件测试。

安全提示：仅提交 `.pub` 公钥，不能提交私钥、`.git-credentials` 或授权令牌。原稿“备份公钥”命令实际打包整个 `~/.ssh`，其中可能包含私钥；需加密保管并限制访问。原稿无口令密钥、`StrictHostKeyChecking no` 和接受未知主机的做法不是通用安全建议，应独立核验主机指纹并按组织要求保护密钥。删除仓库、`--force-sync` 和覆盖操作可能丢失未提交改动，执行前应备份并核对目标。

中英文差异：英文称授权生成 three files，但仅列两个；采用中文两个。Linux 工具目录采用中文 `tools`（英文为 `Tools`）。英文 1.2.2 标题误写基础包，按中文恢复为服务器直接同步；ToyBrick 支持列表补入英文的 RK1808。英文公钥提交小节的邮件截图实际为 Redmine 账号开通，仍保留对应原图并注明。界面截图多为中文/双语；图片仅使用已审核版本，联系人页脚已裁除，纯联络截图未发布。发布说明截图中的命令横向截断，不能作为完整可执行命令。

原稿代码按字面保留，不保证可直接执行：英文 ssh-keygen 的邮箱带 Markdown 链接语法，部分 -p 写为长横线 –p，gitconfig 带 • 项目符号，备份文件名为 id_ras_backup.tag.gz。执行时应核对实际命令语法；这些排版及拼写疑点不作静默修正。

<!-- source:cn p4 unit:0 -->

## 1. 使用说明

<!-- source:cn p4 unit:1 -->

本章节介绍Rockchip的SDK 申请流程:包括公钥、SDK申请表及资料接收窗口等内容。

<!-- source:cn p4 unit:2 -->

### 1.1 申请SDK步骤

<!-- source:cn p4 unit:3 -->

申请Rockchip SDK步骤如下:

<!-- source:cn p4 unit:4 -->

#### 1.1.1 申请流程

<!-- source:cn p4 unit:5 -->

Rockchip 的 SDK（包括所有发布的软件资料）申请流程如下。

<!-- source:cn p4 unit:5f -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p004-application-flow.png)

<!-- source:cn p4 unit:6 -->

#### 1.1.2 填写信息登记表

<!-- source:cn p4 unit:7 -->

如果您是首次与 Rockchip 建立合作的新用戶,在双方完成相关商务协议签署后,系统将发送《Rockchip 客戶信息表》通知邮件,供您填写贵司的建档信息。具体内容如下:

<!-- source:cn p5 unit:8 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p005-figure-01.png)

<!-- source:cn p5 unit:9 -->

在您点击“信息登记表填写”链接后,这登记的信息如下:

<!-- source:cn p6 unit:10 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p006-figure-01.png)

<!-- source:cn p6 unit:11 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p006-figure-02.png)

<!-- source:cn p7 unit:12 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p007-figure-01.png)

<!-- source:cn p7 unit:13 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p007-figure-02.png)

<!-- source:cn p7 unit:14 -->

#### 1.1.3 提供资料接收窗口

<!-- source:cn p7 unit:15 -->

资料接收窗口是指贵司指定的资料负责人,负责与 Rockchip 对接,接收我们推送的软硬件资料及平台相关的发布信息。根据规定,每家实体公司仅能分配一个账号,该账号需由贵司内部统一管理、共享使用,并妥善做好资料备份。如窗口人员发生变更,请及时通过邮件通知 Rockchip 对应的商务负责人,以便及时更新信息,避免错过后续重要通知。

<!-- source:cn p8 unit:16 -->

注:建议将资料接收窗口的邮箱设置为贵司研发团队的公共邮箱(如 xxrd@xx.com),以避免因个人转发疏漏而造成信息遗漏,从而影响项目开发进度或产生不必要的损失。

<!-- source:cn p8 unit:17 -->

#### 1.1.4 提供SDK申请表

<!-- source:cn p8 unit:18 -->

您可以申请一个或多个 SDK 版本。由于 Rockchip 芯片型号及对应 SDK 版本较多,具体请参考以下列表(请参考2.1节 2.1 SDK版本号列表 或者Redmine平台:https://redmine.rock-chips.com/projects/fae/documents的SDK支持版本的列表及说明)。请根据需求提供所需的 SDK 版本号,并使用您的工作邮箱将申请信息发送给 Rockchip 对应的商务负责人,以便其在内部流程中完成备案。申请时请按如下要求填写:

<!-- source:cn p8 unit:19 -->

| Rockchip SDK申请表 |  |
| --- | --- |
| 序号 | 申请开通SDK的版本号 |
| 1 |  |
| 2 |  |
| 3 |  |
| 4 |  |
| 5 |  |
| 6 |  |
| 7 |  |

<!-- source:cn p8 unit:20 -->

#### 1.1.5 生成公钥

<!-- source:cn p8 unit:21 -->

在Ubuntu OS的您目录下执行如下命令,即可:

<!-- source:cn p8 unit:22 -->

```text
xx@ubuntu:~$ cd ~
xx@ubuntu:~$ ssh-keygen -t rsa -C user@rock-chips.com
```

<!-- source:cn p8 unit:23 -->

注:生成公钥只需执行上述命令,无需输入密码。user@rock-chips.com是贵司的工作邮箱,不能使用私人邮箱。您执行命令后,在如下目录生成对应的 文件:key

<!-- source:cn p8 unit:24 -->

```text
xx@ubuntu:~$ ls -l .ssh/
total 12
-rw------- 1 rockchip rockchip 1675 Oct 31 2018 id_rsa
-rw-r--r-- 1 rockchip rockchip 403 Oct 31 2018 id_rsa.pub
```

<!-- source:cn p9 unit:25 -->

请妥善保存生成的私钥文件 id_rsa 和密码,在贵司收到《Rockchip-SDK 公钥提交》邮件通知后,请根据邮件说明提交 id_rsa.pub 公钥,详⻅1.1.6节 1.1.6 提供公钥。

<!-- source:cn p9 unit:26 -->

#### 1.1.6 提供公钥

<!-- source:cn p9 unit:27 -->

当 Rockchip 对应的商务负责人完成内部流程后,系统将根据情况发送《Rockchip-SDK 公钥提交》邮件。如果系统中已存有贵司的公钥,无需重复提交,邮件也不会再次推送。仅在双方首次合作、系统尚未记录贵司公钥的情况下,才会发送该邮件。邮件内容如下所示:

<!-- source:cn p9 unit:28 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p009-figure-01.png)

<!-- source:cn p9 unit:29 -->

当您点击“SDK Kit提交”,弹出如下⻚面:

<!-- source:cn p10 unit:30 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p010-figure-01.png)

<!-- source:cn p10 unit:31 -->

请您把贵司的公钥 key(*.pub) 的内容直接复制进去并提交,请参1.1.5节 1.1.5 生成公钥。Rockchip提交公钥的链接有效期是7天。若在有效期内未完成提交,系统将发送《Rockchip-SDK Kit提交超时》提醒邮件,并提供24小时的续期机会。若续期后仍未完成,您将需重新提交申请并激活新的链接:

<!-- source:cn p11 unit:32 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p011-figure-01.png)

<!-- source:cn p11 unit:33 -->

#### 1.1.7 备份公钥

<!-- source:cn p11 unit:34 -->

请您妥善备份贵司的公钥,以免遗失,导致与Rockchip服务器无法同步代码。

<!-- source:cn p11 unit:35 -->

```text
xx@ubuntu:~$ tar zcvf id_rsa_backup.tag.gz ~/.ssh
```

<!-- source:cn p11 unit:36 -->

#### 1.1.8 更换公钥

<!-- source:cn p11 unit:37 -->

请妥善保管生成的一整套公私钥,该密钥与服务器更换等操作无关,不需要频繁更换,也不会影响 SDK 同步。如若公私钥确实丢失或因其他特殊原因需更换,请邮件联系 Rockchip 对应的商务负责人。待其在内部流程中申请并审核通过后,系统将重新发送公钥提交链接给您。相关邮件内容如下所示:

<!-- source:cn p12 unit:38 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p012-figure-01.png)

<!-- source:cn p12 unit:39 -->

该链接的有效期是7天,逾期将无法使用,需重新申请。收到通知后,请尽快提交新的公钥。提交成功后,系统将跳转至如下⻚面:

<!-- source:cn p13 unit:40 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p013-figure-01.png)

<!-- source:cn p13 unit:41 -->

当公钥更新流程在 Rockchip 完成归档并生效后,您将收到系统推送的《Rockchip-公钥更新成功》通知邮件,表示该公钥已正式生效。邮件内容如下所示:

<!-- source:cn p14 unit:42 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p014-figure-01.png)

<!-- source:cn p14 unit:43 -->

### 1.2 获取SDK的下载方法

<!-- source:cn p14 unit:44 -->

当Rockchip内部流程继续往下一个节点后,您会收到系统推送邮件《Rockchip-SDK已开通》通知:

<!-- source:cn p15 unit:45 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p015-figure-01.png)

<!-- source:cn p15 unit:46 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p015-figure-02.png)

<!-- source:cn p16 unit:47 -->

随着 SDK 版本的迭代,功能不断丰富,安全等级逐步提升,SDK 的代码总量也在同步增加。目前有两种获取方式:直接与服务器同步 sync 并下载完整的代码和 SDK 基础包;下载 SDK 基础包后,再通过同步 sync 获取完整的代码。

<!-- source:cn p16 unit:48 -->

#### 1.2.1 授权验证(必需)

<!-- source:cn p16 unit:49 -->

为了确保代码服务器的安全性,我们新增加了下载权限的必需二次验证。通过 git clone 方法获取下载授权脚本,此方法需要手动输入您的 Gerrit 账号、资料负责人邮箱以及私钥文件名,具体步骤如下:a. 获取脚本

<!-- source:cn p16 unit:50 -->

```text
xx@ubuntu:~$ git clone https://gerrit.rock-chips.com:8443/repo-release/tools/script
```

<!-- source:cn p16 unit:51 -->

b. 运行脚本

<!-- source:cn p16 unit:52 -->

```text
xx@ubuntu:~$ ./Generate-Credential.x
```

<!-- source:cn p16 unit:53 -->

切换到脚本所在目录并运行,输入您的 Gerrit 账号、资料负责人邮箱以及私钥文件名。通过密钥和账号验证后,您将获得下载及同步 sync 授权。

<!-- source:cn p16 unit:54 -->

```text
└── script
├── Generate-Credential.x
└── README.md
```

<!-- source:cn p16 unit:55 -->

c. 脚本目运行范例

<!-- source:cn p16 unit:56 -->

```text
Please input your username (make sure to use the username exactly the same as the one in RK
email!!): Gerrit_Account
Please input your email (make sure to use the company email address!!): dataowneremail
Please input your SSH private key filename (e.g. id_rsa): id_rsa
```

<!-- source:cn p16 unit:57 -->

当最终运行输出如下提示,脚本运行成功。

<!-- source:cn p16 unit:58 -->

```text
Your Credential check has passed
New git credential will be added into your history!!
You are All Set!!
```

<!-- source:cn p17 unit:59 -->

当最终运行输出以下提示时,表示脚本运行失败。请根据5.1 Q&A 章节检查是否由配置问题引起,或确认贵公司本地安全设备是否阻断了下载协议通信(SSH)。

<!-- source:cn p17 unit:60 -->

```text
Credential mismatch issue, please refer to the instruction documents attached to the
Rockchip-SDK Ready email to correctly configure the gerrit account and ssh key.
Do you want to retry (y/n)?
```

<!-- source:cn p17 unit:61 -->

成功运行该授权脚本也将生成了如下两个文件:

<!-- source:cn p17 unit:62 -->

```text
└──~/.gitconfig # 包含Gerrit账号信息和配置
└──~/.git-credentials # 包含Gerrit账号对应HTTPS下载授权
```

<!-- source:cn p17 unit:63 -->

注:收到账号后,请确保使用之前提交的公钥对应的私钥(私钥文件权限为600,且私钥文件名为 id_rsa)运行脚本,绑定本地设备后即可正常下载数据。下载授权将与运行授权脚本的本地系统账戶绑定,并保存在该账戶的 Home目录下。如果将 ~/.gitconfig 和 ~/.git-credentials 这两个文件复制到其他设备或账戶的 Home 目录下,您也可以通过 HTTPS 协议直接进行下载。因此,在执行下载前,请确保本地系统账戶的 Home 目录中存在相应的授权文件。重新运行授权脚本将生成新的授权,旧的下载授权将自动失效。

<!-- source:cn p17 unit:64 -->

#### 1.2.2 服务器直接同步的下载方法

<!-- source:cn p17 unit:65 -->

在《SDK已开通的通知邮件》中,您将找到对应的 SDK 发布说明文档,文档中包括了下载(repo)地址及同步下载代码的方法。以下以《Rockchip_Android13_SDK_Developer_Guide_CN.pdf》为例:

<!-- source:cn p18 unit:66 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p018-figure-01.png)

<!-- source:cn p18 unit:67 -->

这里需确保授权成功,详⻅1.2.1章节 1.2.1 授权验证。

<!-- source:cn p18 unit:68 -->

#### 1.2.3 提供基础包的下载方法

<!-- source:cn p18 unit:69 -->

我们提供的基础包包含初级功能代码、开发工具、开发文档及各个仓库的版本记录。由于某些 SDK 版本已超过100GB,受限于网速,下载(同步)时间可能无法预估。为了节省时间,您可以先拷⻉ SDK 基础包,再进行同步,这样可以减少下载整个工程代码的时间。这里的基础包仅为初始版本,Rockchip 提供了三种下载方式供您选择,具体如下:特别强调:此基础包并非完整的 SDK 代码。必须与 Rockchip 服务器同步 sync 后,才能获取完整的版本代码,并确保系统的稳定性与可靠性。a. FTP的下载如上所示,提供的 FTP 下载方式包括专属于贵司的信息:FTP 地址、连接方式、端口号、FTP 账号和密码。由于 FTP下载速度不稳定,且 Android SDK 本身较大,建议您考虑使用以下另外两种下载方式:b. 现场拷⻉的下载现场预约链接的 有效期为7天,逾期后需重新申请。Rockchip 提供福州、深圳和上海三个办公点供您现场拷⻉ SDK资料,您可以选择距离最近的地点进行预约。点击“现场下载预约”后,将弹出如下图:

<!-- source:cn p19 unit:70 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p019-figure-01.png)

<!-- source:cn p19 unit:71 -->

请根据上图提示,填写现场拷⻉ SDK 基础包的联系人姓名、电话、电子邮箱、Rockchip 地点(福州、深圳或上海)以及到访时间。提交成功后,将显示如下图提示:

<!-- source:cn p20 unit:72 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p020-figure-01.png)

<!-- source:cn p20 unit:73 -->

成功预约后,联系人将收到来自 Rockchip 系统的邮件通知《Rockchip-SDK版本现场下载预约信息》,内容如下:

<!-- source:cn p21 unit:74 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p021-figure-01.png)

<!-- source:cn p22 unit:76 -->

收到邮件通知后,请根据预约时间,携带大容量的移动硬盘或其他存储设备(需支持 USB 3.0 接口,以确保与Rockchip 主机兼容)。如果需要多个 SDK 版本,建议您的存储设备至少预留 512GB 以上的空间,以避免空间不足影响进度。请准时到达所选地点。如有时间调整,请第一时间通知对应负责人,以免影响双方配合及贵司后续工作。c. 磁盘邮寄请根据上图所示的“邮寄硬件方式”,将您的大容量移动硬盘或其他存储设备(需支持 USB 3.0 接口,以确保与Rockchip 主机兼容)寄出。如需多个 SDK 版本,建议您的存储设备至少预留 512GB 以上空间,以避免空间不足影响进度。我们收到快递后,将在一个工作日内安排顺丰快递寄回。

<!-- source:cn p22 unit:77 -->

### 1.3 更新SDK的步骤及方法

<!-- source:cn p22 unit:78 -->

从Rockchip拷⻉(或者通过FTP下载)的SDK仅为基础包,要获取完整版本,必须在此基础包上通过网络同步(sync)更新。同步方法及步骤请参⻅ 《Rockchip_Android13_SDK_Developer_Guide_CN.pdf》 中的说明,具体如下:

<!-- source:cn p22 unit:79 -->

#### 1.3.1 检查文件完整性

<!-- source:cn p22 unit:80 -->

通过 FTP 下载、现场拷⻉或邮递磁盘拷⻉的压缩包文件,在复制过程中容易出现错误。将文件拷⻉到开发环境后,需使用以下方法验证文件完整性。以 Rockchip_Android13.0_SDK_RELEASE.tar.gz 文件为例,其他 SDK 也同样提供相应的 MD5 值,且该值保存在单独的文件中,与 *.tar.gz 包一同提供给您。

<!-- source:cn p22 unit:81 -->

```text
xx@ubuntu:~$ md5sum Rockchip_Android13.0_SDK_RELEASE.tar.gz*
cb37437acfdd4d10cbae1809ee37c91d  Rockchip_Android13.0_SDK_RELEASE.tar.gz00
7a446207302810dfe08e386c9018faed  Rockchip_Android13.0_SDK_RELEASE.tar.gz01
68a68fe3127f0a9b8a97727b2fd27106  Rockchip_Android13.0_SDK_RELEASE.tar.gz02
4a6b06b48709eb0357e3aa5b18ba63d4  Rockchip_Android13.0_SDK_RELEASE.tar.gz03
b24083f7c4d36bba730e421d2c0a444b  Rockchip_Android13.0_SDK_RELEASE.tar.gz04
362641e26f93c600f12ea21bd178dac9  Rockchip_Android13.0_SDK_RELEASE.tar.gz05
97d0ab6b7d9d523496544605eaedf6f2  Rockchip_Android13.0_SDK_RELEASE.tar.gz06
d8958db52f86982490b66732e6daf0ea  Rockchip_Android13.0_SDK_RELEASE.tar.gz07
7f65e490ef4541997dd21c559262ca1e  Rockchip_Android13.0_SDK_RELEASE.tar.gz08
942f811b75b58aacb73628a6e3a304a5  Rockchip_Android13.0_SDK_RELEASE.tar.gz09
8f742ea39960725d7f6d8660e6974b48  Rockchip_Android13.0_SDK_RELEASE.tar.gz10
4d4342750dc746dbe5e2b9fc93254eb7  Rockchip_Android13.0_SDK_RELEASE.tar.gz11
0c15e71f234fb242b0b494cf25382672  Rockchip_Android13.0_SDK_RELEASE.tar.gz12
921b93b045f9d1d71f308d8d9df4e3ca  Rockchip_Android13.0_SDK_RELEASE.tar.gz13
22c9261fa4e3700287c525ec25075691  Rockchip_Android13.0_SDK_RELEASE.tar.gz14
```

<!-- source:cn p22 unit:82 -->

使用命令 md5sum 校验后,将输出的 MD5 值与 Rockchip 提供的 MD5 值进行对比。如果两者完全一致,说明压缩文件完整;如果不一致,则表示文件已损坏,需要重新拷⻉或下载。

<!-- source:cn p23 unit:83 -->

#### 1.3.2 更新SDK方法

<!-- source:cn p23 unit:84 -->

Rockchip 的 SDK 在通过内部测试验收标准后,才会对外正式发布。由于 SDK 的稳定性和成熟度是通过多次迭代和更新逐步完善的,您需要定期与 Rockchip 服务器同步更新,保持代码在最新状态,以便体验平台的新功能和系统的健壮性。相关 SDK 版本信息请参考发布说明文档(如《Rockchip_Android13_SDK_Developer_Guide_CN.pdf》)。有关SDK 同步方法和故障排查,请参⻅第 5.4 节 5.4 SDK同步异常处理。

<!-- source:cn p23 unit:85 -->

### 1.4 申请硬件资料流程及方法

<!-- source:cn p23 unit:86 -->

目前 Rockchip 的硬件资料与 SDK KIT 分开提供，硬件资料申请流程如下。

<!-- source:cn p23 unit:86f -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p023-hardware-flow.png)

<!-- source:cn p23 unit:88 -->

Rockchip 的硬件资料按芯片平台划分,您可以一次申请一个或多个平台的资源。资料内容主要包括平台硬件参考设计,如电源方案、DDR 模板、硬件设计指南以及主要功能的设计参考。设计产品硬件时,您需要注意以下几点:a. 电源管理方案必须使用参考设计中的方案;b. DDR 模板必须直接使用参考设计中的对应模板,不得修改;c. 关键物料必须使用 Rockchip 提供的关键物料列表(如 DDR、eMMC、Flash、WiFi/BT、Camera 等);d. 资料必须保持定期更新,Rockchip 会持续优化。如您在硬件设计中不打算遵循上述条款,请提前与 Rockchip 对应的商务负责人沟通确认。否则,Rockchip 技术团队可能无法提供稳定有效的技术支持,这可能会对您的项目进度造成不利影响。您还可以查看 Rockchip 硬件资料的更新状态:https://redmine.rock-chips.com/projects/fae/documents(硬件参考设计版本列表)。如您获得的资料版本低于此列表,请联系 Rockchip 资料窗口,以获取最新版本,提升项目开发效率。

<!-- source:cn p23 unit:89 -->

## 2. SDK版本

<!-- source:cn p23 unit:90 -->

本章节主要介绍 Rockchip SDK 的获取方式。目前官方提供三种渠道:a. Rockchip 内部服务器,此方式需通过正式的 SDK 申请流程获取;b. 开源 GitHub 仓库,可直接下载公开的 SDK,无需申请流程;c. Toybrick 开源社区,提供部分平台的 SDK 下载,同样不需要申请流程。

<!-- source:cn p24 unit:91 -->

### 2.1 SDK版本号列表

<!-- source:cn p24 unit:92 -->

以下是 Rockchip 官方发布的芯片支持的 Android OS 和 Linux OS 版本,以及每个版本支持的产品类型和当前技术支持力度的详细信息:

<!-- source:cn p24 unit:93 -->

注:a. 所有 SDK 版本详细信息请参考(SDK 支持版本的列表及说明):https://redmine.rock-chips.com/documents/54

b. 推荐指数反映了 Rockchip 当前主推的 SDK 版本的维护热度。在确定项目时,请参考此参数选择对应的 SDK 版本;

c. 当前⻓期维护的两个行业产品类Android SDK版本:RK3399_ANDROID7.1-Industry-SDK_V1.0RK3288_ANDROID7.1_TABLET-SDK_V1.00_20170629

d. Android的express版本包含 GMS 包,适用于通过 Google 认证并拥有 MADA 资质的用戶。若您有此需求,请申请 express 版本;未带 GMS 包的为 Android标准版本;

e. 关于芯片后缀字母的解释,具体请参考相应的芯片说明书:S-->表示小尺寸的封装版型号;M-->表示符合⻋规版本的型号;J-->表示符合工规版本的型号;K-->表示符合宽温版本的型号(如:-20°C ~ 85°C 和-40°C~85°C,具体详⻅对应的Datasheet);-S-->表示SMIC的晶元。

f. 适用NAS、NVR、显控、SoC阵列、边缘计算盒和PCIe互联等产品形态的SDK版本:RK3588_Rockchip_Linux_SDK-SmartHubRK3576_Rockchip_Linux_SDK-SmartHubRK3568_Rockchip_Linux_SDK-SmartHub

<!-- source:cn p25 unit:94 -->

| 芯片 | SDK 版本（原稿标识） | 推荐星级 |
| --- | --- | --- |
| RK3588(S/J/M) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express版本)</code> | <code>*****</code> |
| RK3588(S/J/M) | <code>RK3588_Rockchip_Android15.0(express版本)</code> | <code>*</code> |
| RK3588(S/J/M) | <code>Rockchip_Android14.0(express版本)</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588M_Rockchip_Android14.0_SDK-Car</code> | <code>**</code> |
| RK3588(S/J/M) | <code>RK3588_ANDROID13.0_SDK_RELEASE(express版本)</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588M_Android12_SDK_Release-Car</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_RKTTS_SDK</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_IPC_SDK_202205</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588M_QNX_AAOS12_SDK</code> | <code>**</code> |
| RK3588(S/J/M) | <code>RK3588_LINUX6.1_SDK_RELEASE</code> | <code>*****</code> |
| RK3588(S/J/M) | <code>RK3588_LINUX_EDGE_SDK_202206</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_Rockchip_Linux_SDK-SmartHub</code> | <code>*</code> |
| RK3588(S/J/M) | <code>RK3588_LINUX_NVR_SDK_Release_V1.0.0_20220304</code> | <code>*</code> |
| RK3576(S/J/M) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express版本)</code> | <code>*****</code> |
| RK3576(S/J/M) | <code>Rockchip_Android15.0(express版本)</code> | <code>**</code> |
| RK3576(S/J/M) | <code>Rockchip_Android14.0(express版本)</code> | <code>**</code> |
| RK3576(S/J/M) | <code>RK3576M_Android14.0_SDK-Car</code> | <code>**</code> |
| RK3576(S/J/M) | <code>RK3576M_Android14.0_SDK-Car</code> | <code>**</code> |
| RK3576(S/J/M) | <code>Rockchip_Android14.0_SDK_Release-Media_Streaming</code> | <code>**</code> |
| RK3576(S/J/M) | <code>RK3576_Android11_CloudDesk_SDK</code> | <code>*</code> |
| RK3576(S/J/M) | <code>RK3576_Android9.0_SDK_Release</code> | <code>*</code> |
| RK3576(S/J/M) | <code>RK3576_NVR_SDK</code> | <code>**</code> |
| RK3576(S/J/M) | <code>Rk3576_RKTTS_SDK</code> | <code>*</code> |
| RK3576(S/J/M) | <code>RK3576_LINUX6.1_SDK</code> | <code>*****</code> |
| RK3576(S/J/M) | <code>RK3576_Rockchip_Linux_SDK-SmartHub</code> | <code>**</code> |
| RK3568/6(J/M) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express版本)</code> | <code>*****</code> |
| RK3568/6(J/M) | <code>Rockchip_Android15.0(express版本)</code> | <code>**</code> |
| RK3568/6(J/M) | <code>Rockchip_Android14.0(express版本)</code> | <code>**</code> |
| RK3568/6(J/M) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(express版本)</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3568(6)_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3568(6)_ANDROID11.0_SDK_RELEASE_V1.0.0_20210106</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3566_ANDROID11.0_EBOOK_SDK_RELEASE_V1.0.0_20210126</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK356X_ANDROID11_CLOUDDESK_SDK_202307</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK356X_AMP_SDK_RELEASE</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK356X_NVR_SDK_V1.4.0_20220611</code> | <code>*</code> |
| RK3568/6(J/M) | <code>RK3568_RK3566_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3568/6(J/M) | <code>RK3568_Rockchip_Linux_SDK-SmartHub</code> | <code>**</code> |
| RK3568/6(J/M) | <code>RK356X_STANDALONE_SDK_RELEASE_V1.0.0_20210713</code> | <code>*</code> |
| RK3562(J) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express版本)</code> | <code>*****</code> |
| RK3562(J) | <code>RK3562_Android15.0(express版本)</code> | <code>**</code> |
| RK3562(J) | <code>RK3562_Android14.0(express版本)</code> | <code>**</code> |
| RK3562(J) | <code>RK3562_Rockchip_Android14.0_SDK_Release-Media_Streaming</code> | <code>**</code> |
| RK3562(J) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(express版本)</code> | <code>*</code> |
| RK3562(J) | <code>RK3528_ANDROID9.0-Box_ALPHA_V0.0.1_20221202</code> | <code>*</code> |
| RK3562(J) | <code>RK3562_RKTTS_SDK</code> | <code>*</code> |
| RK3562(J) | <code>RK3562_LINUX5.10_SDK_V1.0.0_20230620</code> | <code>**</code> |
| RK3562(J) | <code>RK3562_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3528(J/A) | <code>RK3528_Rockchip_Android14.0_SDK_Release-Media_Streaming</code> | <code>*****</code> |
| RK3528(J/A) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(express版本)</code> | <code>*</code> |
| RK3528(J/A) | <code>RK3528_ANDROID9.0-Box_ALPHA_V0.0.1_20221202</code> | <code>*</code> |
| RK3528(J/A) | <code>Rockchip_RK3528_Linux_SDK_20230410</code> | <code>*****</code> |
| RK3506(J) | <code>RK3506_Linux6.1_SDK</code> | <code>*****</code> |
| RK3506(J) | <code>RK3506_RT-Thread_SDK_Release</code> | <code>**</code> |
| RK3399(K) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express版本)</code> | <code>*****</code> |
| RK3399(K) | <code>Rockchip_Android15.0(express版本)</code> | <code>**</code> |
| RK3399(K) | <code>Rockchip_Android14.0(express版本)</code> | <code>**</code> |
| RK3399(K) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(express版本)</code> | <code>**</code> |
| RK3399(K) | <code>RK3399_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_ANDROID11.0_SDK_RELEASE_V1.0.0_20210106</code> | <code>*</code> |
| RK3399(K) | <code>Rockchip_Android10.0_SDK_Release_20191211</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_Android9.0_SDK_V1.0_20190104</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_Android8.1_SDK_V1.00_20180517</code> | <code>*</code> |
| RK3399(K) | <code>RK3399_ANDROID7.1-Industry-SDK_V1.0</code> | <code>***</code> |
| RK3399(K) | <code>RK3399_LINUX6.1_SDK_RELEASE</code> | <code>*****</code> |
| RK3399(K) | <code>RK3399_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3399PRO | <code>RK3399Pro_Android9.0_SDK_V1.00_20190806</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID12.0_SDK_RELEASE</code> | <code>*****</code> |
| RK3328 | <code>RK3328_ANDROID11.0_BOX_SDK_V1.0.1_20201030</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID10.0-BOX_V1.0_20191125</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID9.0-BOX-SDK_V1.0_20181206</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID8.1-BOX-SDK_V1.0_20180319</code> | <code>*</code> |
| RK3328 | <code>RK3328_ANDROID7.1_BOX-SDK_v1.00_20170223</code> | <code>*</code> |
| RK3328 | <code>RK3328_linux_v1.00_20170419</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>ROCKCHIP_ANDROID16.0_SSI_SDK(express版本)</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>Rockchip_Android15.0_SDK(express版本)</code> | <code>**</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>Rockchip_Android14.0_SDK(express版本)</code> | <code>**</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>ROCKCHIP_ANDROID13.0_SDK_RELEASE(express版本)</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID12.0_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID11.0_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID10.0_SDK_20191211</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID9.0_SDK_20180925</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326&amp;PX30_ANDROID8.1-TABLET-SDK_V1.0.0_20180505</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>PX30_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>PX30_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>Rockchip_RK3326_Linux6.1</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3326_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3358_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3326(-S) / PX30(-S/K) / RK3358(M/J) | <code>RK3358_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK3308(J/M) | <code>RK3308_Linux6.1_SDK_Release</code> | <code>*****</code> |
| RK3308(J/M) | <code>RK3308_LINUX5.10_SDK_RELEASE</code> | <code>**</code> |
| RK3308(J/M) | <code>RK3308_Linux_PartyBox_SDK</code> | <code>**</code> |
| RK3288(W/K) | <code>RK3288W_ANDROID12.0_SDK_RELEASE</code> | <code>*****</code> |
| RK3288(W/K) | <code>RK3288(W_Version)_ANDROID11.0_SDK_RELEASE</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288_ANDROID10.0_SDK_Release</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288(W-Version)_Android9.0_SDK_V1.0_20190410</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288W_ANDROID8.1_SDK_V1.0_20180508</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288_ANDROID7.1_TABLET-SDK_V1.00_20170629</code> | <code>*</code> |
| RK3288(W/K) | <code>RK3288_LINUX5.10_SDK</code> | <code>**</code> |
| RK3229 | <code>RK3229_ANDROID10.0_BOX_SDK_V1.0_20200109</code> | <code>***</code> |
| RK3229 | <code>RK3229_ANDROID9.0_BOX_SDK_V1.0_2019012</code> | <code>*</code> |
| RK3229 | <code>RK3229_ANDROID8.1-BOX-SDK_V1.0_20180423</code> | <code>*</code> |
| RK3229 | <code>RK3229_ANDROID7.1_BOX-SDK_V1.00_20170831</code> | <code>*</code> |
| RK3229 | <code>RK3229_ANDROID6.0-RBOX-SDK_V1.00_20160831</code> | <code>*</code> |
| RK3229 | <code>RK3229_wireless_dongle_v1.00_20161130</code> | <code>**</code> |
| RK182X | <code>RK182X_AI_COPROCESSOR_SDK</code> | <code>*****</code> |
| RK182X | <code>RK182X_RT-THREAD_SDK</code> | <code>*****</code> |
| PX3SE | <code>PX3SE_LINUX_SDK_V0.2</code> | <code>**</code> |
| PX3SE | <code>PX3SE_ANDROID7.1_SDK_V1.00_20170719/td&gt;</code> | <code>**</code> |
| RK3128(H) | <code>RK3128H_ANDROID8.1-BOX-SDK_V1.0_20180601</code> | <code>***</code> |
| RK3128(H) | <code>RK312X_ANDROID7.1-TABLET-SDK_V1.00_20170519</code> | <code>*</code> |
| RK3128(H) | <code>RK3128_ANDROID7.1-BOX-SDK_V1.00_20170823</code> | <code>*</code> |
| RK3128(H) | <code>RK312X_LINUX5.10_SDK_RELEASE_202304</code> | <code>*</code> |
| RK3126(C) | <code>Rockchip_Android10.0_SDK_Release_20191211</code> | <code>****</code> |
| RK3126(C) | <code>RK3126C_ANDROID9.0_SDK_V1.0_20190103</code> | <code>*</code> |
| RK3126(C) | <code>RK3126C_ANDROID8.1-SDK_V1.00_20180105</code> | <code>*</code> |
| RK3126(C) | <code>RK312X_ANDROID7.1-TABLET-SDK_V1.00_20170519</code> | <code>*</code> |
| RK3126(C) | <code>RK312X_LINUX5.10_SDK_RELEASE</code> | <code>**</code> |
| RK3066 | <code>RK3066_ANDROID4.4.2-SDK_V1.00_2014.02.12</code> | <code>*</code> |
| RK3036 | <code>RK3036_wireless_dongle_v1.00_20161130</code> | <code>*</code> |
| RK3036 | <code>RK3036_LINUX5.10_SDK_RELEASE</code> | <code>*</code> |
| RK2118(M) | <code>RK2118_RT-Thread_SDK</code> | <code>*****</code> |
| RK2116(M) | <code>RK2116_RT-Thread_SDK</code> | <code>*****</code> |
| RK2108 | <code>RK2108_RT-THEAD_SDK_V1.0.0_20200812</code> | <code>*</code> |
| RK2106 | <code>RK2106_FreeRTOS_BETA_V0.1_20181229</code> | <code>**</code> |
| RV1126B(P) | <code>RV1126B_Linux6.1_SDK</code> | <code>*****</code> |
| RV1126B(P) | <code>RV1126B_Linux_IPC_SDK-IPC、CVR</code> | <code>*****</code> |
| RV(K)1108 | <code>RV1108_LINUX_SDK_V2.1_20190329</code> | <code>*</code> |
| RV(K)1108 | <code>RV1108_CVR_V1.4_20180604</code> | <code>*</code> |
| RV(K)1108 | <code>RV110X_LINUX_IPC_SDK_V1.2_20170607</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1106_RV1103_IPC_LINUX_SDK</code> | <code>*****</code> |
| RV1106/3(B) | <code>RV1106B_RV1103B_LINUX_IPC_SDK</code> | <code>*****</code> |
| RV1106/3(B) | <code>RV1106_RV1103_Linux_CVR_SDK-CVR</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1106_RV1103_SMART_DOOR_LINUX_SDK</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1103_SCANER_LINUX_SDK_V0.0.1_20220915</code> | <code>*</code> |
| RV1106/3(B) | <code>RV1106_RV1103_Linux_Battery_IPC_Doorbell-电池IPC和⻔铃</code> | <code>*</code> |
| RKNanoD | <code>RKNANOD_MP3_SDK_V1.3_20161102</code> | <code>***</code> |
| RKNanoD | <code>RKNANOD_WIRELESS_AUDIO_SDK_V1.6_201611149</code> | <code>*</code> |
| RK628 | <code>RK628(第三方)</code> | <code>**</code> |
| SOFIA3GR | <code>SOFIA3GR_Android6.0-SDK_20160428</code> | <code>*</code> |
| SOFIA3GR | <code>SoFIA_3G-R_ANDROID5.1-SDK行⻋记录仪</code> | <code>*</code> |
| XMM6321 | <code>XMM6321_Phone_Android4.4-SDK(停止更新)</code> | <code>*</code> |
| XMM6321 | <code>XMM6321_Watch_Android4.4-SDK_20151015(停止更新)</code> | <code>*</code> |

<!-- source:cn p30 unit:104 -->

### 2.2 开源资料

<!-- source:cn p30 unit:105 -->

我们Rockchip已开源部分详细资料https://opensource.rock-chips.com/wiki_Main_Page,现在已有RK3568、RK3399、RK3288、RK3328和PX30平台。

<!-- source:cn p31 unit:106 -->

### 2.3 开源社区

<!-- source:cn p31 unit:107 -->

Rockchip 官方推出了专注于 AI 开发的 ToyBrick 开源社区,旨在为开发者提供高效、便捷且稳定的开发平台,助力快速上手 AI 应用开发,加速 AI 行业产品的落地进程,全面提升行业应用生态。该平台支持多个核心方案,包括RK3588、RK3399PRO、RK1808（英文原稿补充）、RK3568 等,提供以下资源:对应平台的开源开发板购买方式、Android OS 与 Linux OS 的SDK 下载、完整的硬件资料、软件开发文档与工具支持。详细内容请访问 ToyBrick 官方社区:http://t.rock-chips.com/forum.php。

<!-- source:cn p31 unit:108 -->

注:ToyBrick 开发板相关问题请统一在开源社区提交(https://t.rock-chips.com/forum.php)。该类问题不通过Rockchip 的 Redmine Bug 系统处理https://redmine.rock-chips.com上处理。如遇特殊情况,请联系 Rockchip 对应的商务窗口以协助协调处理。

<!-- source:cn p31 unit:109 -->

### 2.4 补丁发布

<!-- source:cn p31 unit:110 -->

我们Rockchip官方推出平台补丁发布连接:https://redmine.rock-chips.com/projects/rockchip_patch/issues。请根据补丁具体的情况,结合您对应项目来确定是否添加对应的补丁。

<!-- source:cn p31 unit:111 -->

## 3. 文档与工具

<!-- source:cn p31 unit:112 -->

Rockchip 官方提供给客戶的文档和开发工具,均与对应的 SDK 同步发布。目前主要支持两套 SDK 体系:AndroidOS 和 Linux OS,这两套 SDK 中文档和工具的存放路径略有差异,具体请参照各自 SDK 中的目录结构。

<!-- source:cn p31 unit:113 -->

### 3.1 Android SDK

<!-- source:cn p31 unit:114 -->

如下是Android OS SDK存放文档和工具的路径:存放文档路径是:SDK根目录下的RKDocs文件夹中;存放工具路径是:SDK根目录下的RKTools文件夹中。

<!-- source:cn p31 unit:115 -->

### 3.2 Linux SDK

<!-- source:cn p31 unit:116 -->

如下是Linux OS SDK存放文档和工具的路径:存放文档路径是:SDK根目录下的docs文件夹中;存放工具路径是:SDK根目录下的tools文件夹中。

<!-- source:cn p31 unit:117 -->

注:Rockchip 提供的文档与工具会随着代码的更新同步集成至对应的 SDK 版本中。由于不同 SDK 版本所包含的工具和文档可能存在差异,因此在开发过程中请务必使用与当前 SDK 版本严格对应的工具。 如果代码与工具版本不匹配,可能导致固件烧录失败、系统无法正常启动等异常问题,严重影响开发进度。

<!-- source:cn p32 unit:122 -->

## 5. Q&A

<!-- source:cn p32 unit:123 -->

本章节汇总了您在申请或使用 Rockchip SDK 过程中可能遇到的常⻅问题。

<!-- source:cn p32 unit:124 -->

### 5.1 SDK管理

<!-- source:cn p32 unit:125 -->

请您妥善保存并合理管控Rockchip SDK,Rockchip概不重复提供资料。如果有资料遗失,需与Rockchip对应的商务窗口申请。

<!-- source:cn p32 unit:126 -->

### 5.2 SDK代码更新

<!-- source:cn p32 unit:127 -->

#### 5.2.1 SDK同步

<!-- source:cn p32 unit:128 -->

每个 SDK 基础包需单独申请代码同步权限,未授权账号将无法通过 repo 与 Rockchip 服务器同步代码。具体同步方法请参考随基础包提供的 SDK 发布说明文档。

<!-- source:cn p32 unit:129 -->

#### 5.2.2 SDK多个平台申请

<!-- source:cn p32 unit:130 -->

Rockchip 不同芯片平台的 SDK 需分别申请授权。例如:若贵司已获 RK3288 平台 SDK,后续新增 RK3399 项目,需联系对应商务负责人协助办理新平台的 SDK 申请流程。经审批通过后,技术团队方可开放相关资料。

<!-- source:cn p33 unit:131 -->

### 5.3 版本控制器

<!-- source:cn p33 unit:132 -->

Rockchip SDK 代码管理采用与 Google 同步的 Repo 工具。建议保留 SDK 中的 repo 及 git 版本历史,避免因删除版本记录导致后续同步、维护及技术支持工作复杂化。由于一些的历史原因,要删掉SDK的版本记录,建议采用内部版本控制系统(如或)进行开发管理,可以gitsvn参考如下方法。

<!-- source:cn p33 unit:133 -->

![SDK](/docs/rockchip-sdk-application-and-synchronization/assets/cn-p033-version-control.png)

<!-- source:cn p33 unit:135 -->

建议维护两套代码环境:一套作为“中转站”,另一套用于日常开发。中转站的作用是与 Rockchip 官方服务器进行代码同步,并将差异部分迁移至本地开发服务器;同时也是与 Rockchip 对接时确认代码版本的参考基准。而开发服务器则可根据您的项目需求和使用习惯进行个性化配置。此方式具有以下优势:有助于 Rockchip 原厂在协助排查问题时,准确定位代码版本;可解决部分开发服务器因无法联网而无法直接同步代码的问题,通过中转站迁移更新内容,保障开发环境的代码一致性。

<!-- source:cn p33 unit:136 -->

### 5.4 SDK同步异常处理

<!-- source:cn p33 unit:137 -->

#### 5.4.1 SDK同步前确认

<!-- source:cn p33 unit:138 -->

在开始同步代码之前,请务必完成以下检查步骤,确保环境配置无误:a. SSH密钥文件确认确认目录下包含文件:~/.ssh/(私钥)id_rsa(公钥)id_rsa.pub(首次SSH连接自动生成)known_hosts

<!-- source:cn p33 unit:139 -->

```text
xx@ubuntu:~$ ls -l ~/.ssh/
-rw------- 1 xx xx  1675 Apr 9 08:40 id_rsa
-rw-r--r-- 1 xx xx 400 Apr 9 08:40 id_rsa.pub
-rw-r--r-- 1 xx xx  2220 Apr 9 08:40 known_hosts
```

<!-- source:cn p33 unit:140 -->

b. 私钥文件数量限制目录下不得存在多个key文件。若确需多个key,请按照SDK发布说明使用管理。.sshkey-chainc. 私钥权限设置

<!-- source:cn p34 unit:141 -->

确保文件权限为,否则请执行:id_rsa600

<!-- source:cn p34 unit:142 -->

```text
xx@ubuntu:~$ chmod 600  ~/.ssh/id_rsa
```

<!-- source:cn p34 unit:143 -->

d. 网络连接确认(ping及端口通)

<!-- source:cn p34 unit:144 -->

```text
`⾮中国⼤陆客⼾`
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8443
Trying 54.151.98.191...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8222
Trying 54.151.98.191...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.

`中国⼤陆客⼾`
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8443
Trying 58.22.7.114...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.
xx@ubuntu:~$ telnet gerrit.rock-chips.com 8222
Trying 58.22.7.114...
Connected to gerrit.rock-chips.com.
Escape character is '^]'.
```

<!-- source:cn p34 unit:145 -->

若无返回,说明访问端口受限,请联系公司IT排查网络拦截。e. 公钥与私钥是否匹配使用以下命令生成用于比对的公钥:

<!-- source:cn p34 unit:146 -->

```text
xx@ubuntu:~$ ssh-keygen -y -f id_rsa > id_rsa.pub.tobecompared
```

<!-- source:cn p34 unit:147 -->

然后对比与内容(忽略尾部邮箱部分)。若不一致,说明不匹配,请重id_rsa.pub.tobecompareid_rsa.pubkey新生成。f. SSH连接测试查阅申请的SDK发布说明文档里获取SDK下载地址,若包含了repo init --repo-url https://gerrit.rock-则使用下面 命令测试:chips.com ssh

<!-- source:cn p34 unit:148 -->

```text
xx@ubuntu:~$ ssh -vT ⽤⼾名@gerrit.rock-chips.com –p 8222
```

<!-- source:cn p35 unit:149 -->

如下测试命令:

<!-- source:cn p35 unit:150 -->

```text
xx@ubuntu:~$ ssh -vT xxx@gerrit.rock-chips.com -p 8222
OpenssH_7.4p1, OpenSSL 1.0.2k-fips 26 Jan 2017
debug1: Reading configuration data /home/gerrit/ .ssh/config
debug1: /home/gerrit/.ssh/config line 11: Applying options for gerrit.rock-chips.com
debug1: Reading configuration data /etc/ssh/ssh_config
debug1 /etc/ssh/ssh_config line 58: Applying options for *
debug1: Connecting to gerrit.rock-chips.com [***] port 8222
debug1: Connection established.
...
debug1: SSH2_MSG_SERVICE_ACCEPT received
debug1: Authentications that can continue: publickey
debug1: Next authentication method: publickey
debug1: Trying private key:/home/gerrit.ssh/id_rsa
debug1: Authentication **
succeeded** (publickey).
Authenticated to gerrit.rock-chips.com_([xxxx]:8222).debugi: channel e: new [client-session]
debug1: Entering interactive session.
debug1: pledge: network debugi: Sending environment.
debug1: Sending env LANG = en_us.UTF-8

   ****welcome to Gerrit code Review****

 Hi xxx, you have **successfully connected** over SSH.
 Unfortunately, interactive shells are disabled.
 To clone a hosted Git repository, use:

 git clone ssh: / /xxx@gerrit.rock-chips.com:29418/REPOSITORY_NANE.git

debug1: channel 0: free: client-session, nchannels 1
Connection to gerrit.rock-chips.com closed by remote host.
Transferred: sent 2484,received 1904 bytes, in 50.0 seconds
Bytes per second: sent 49.6,received 38.0
debugl: Exit status_-l
```

<!-- source:cn p35 unit:151 -->

执行ssh命令的时候,如果出现“Are you sure you want to continue connecting (yes/no)?”的提示,请输入“yes”回⻋。执行测试命令后,正常将会显示有successfully connected 字样即可,说明 ssh 是连通的。如果不通,可能PC(或者服务器)环境设置有问题或者网络通信被安全设备拦截,可以换个PC(或者服务器)或者热点网络验证一下。注意虚拟机使用桥接的网络,常会出现 不通的情况。sshg. SSH配置文件检查( ~/.ssh/config )确保配置文件存在,内容如下:

<!-- source:cn p36 unit:152 -->

```text
xx@ubuntu:~$ cat ~/.ssh/config
Host gerrit.rock-chips.com
 HostName gerrit.rock-chips.com
 User **⽤⼾名**
 Port 8222
 IdentityFile ~/.ssh/**私钥⽂件名**
 PreferredAuthentications publickey
 StrictHostKeyChecking no
 UserKnownHostsFile ~/.ssh/known_hosts
 PubKeyAcceptedKeyTypes +ssh-rsa
```

<!-- source:cn p36 unit:153 -->

若无该文件,请手动创建,并设置权限:

<!-- source:cn p36 unit:154 -->

```text
xx@ubuntu:~$ ls -l  ~/.ssh/config
-rw-r--r-- 1 xx xx 220 Nov 28 18:43 config
```

<!-- source:cn p36 unit:155 -->

h. 完成环境确认后请根据SDK发布说明中的流程,开始执行代码同步。

<!-- source:cn p36 unit:156 -->

#### 5.4.2 SDK同步时报错及解决方法

<!-- source:cn p36 unit:157 -->

以下为在使用 SDK 同步过程中可能遇到的常⻅错误及对应解决方法:a. python版本错误错误日志示例:

<!-- source:cn p36 unit:158 -->

```text
Traceback (most recent call last):
File "/root/repo/main.py", line 628, in <module>
_Main(sys.argv[1:])
File "/root/repo/main.py", line 602, in _Main
result = run()
File "/root/repo/main.py", line 595, in <lambda>
run = lambda: repo._Run(name, gopts, argv) or 0
File "/root/repo/main.py", line 264, in _Run
result = cmd.Execute(copts, cargs)
File "/root/repo/subcmds/init.py", line 531, in Execute
self._SyncManifest(opt)
File "/root/repo/subcmds/init.py", line 324, in _SyncManifest
clone_filter=opt.clone_filter):
File "/root/repo/project.py", line 1144, in Sync_NetworkHalf
clone_filter=clone_filter, retry_fetches=retry_fetches):
File "/root/repo/project.py", line 2139, in _RemoteFetch
ret = gitcmd.Wait()
File "/root/repo/git_command.py", line 379, in Wait
```

<!-- source:cn p37 unit:159 -->

```text
rc = self._CaptureOutput()
File "/root/repo/git_command.py", line 407, in _CaptureOutput
s.dest.write(buf)
UnicodeEncodeError: 'ascii' codec can't encode characters in position 8-12: ordinal not in
range(128)
或
Traceback (most recent call last):开头相关报错
```

<!-- source:cn p37 unit:160 -->

解决方法:建议使用 python 3.x(不高于 3.10),如使用 python 2.x,请确保版本 ≤ 2.7.11。并依照以下步骤操作,避免因或环境异常导致版本问题:repopython

<!-- source:cn p37 unit:161 -->

```text
xx@ubuntu:~$ ./Gerrit_Account (Gerrit账号命名脚本).x    # 运⾏授权脚本，确认授权⽂件已⽣成
xx@ubuntu:~$ git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo #下载 v2.18
版repo ⼯具
xx@ubuntu:~$ cd rksdk   # 进⼊SDK⽬录
xx@ubuntu:~/rksdk$ ../repo/repo sync -c  # 使⽤ repo ⼯具同步代码
```

<!-- source:cn p37 unit:162 -->

b. 生成 SSH Key 时设置了密码,导致需要手动输入提示信息:

<!-- source:cn p37 unit:163 -->

```text
Enter passphrase for key '/home/junyikeji/.ssh/id_rsa':
```

<!-- source:cn p37 unit:164 -->

解决方法:建议使用工具统一管理密钥,或重设私钥密码为空:keychain

<!-- source:cn p37 unit:165 -->

```text
xx@ubuntu:~$ ssh-keygen -f ~/.ssh/id_rsa –p
```

<!-- source:cn p37 unit:166 -->

c. SDK权限问题错误日志:

<!-- source:cn p37 unit:167 -->

```text
Get ssh://git@ww.rockchip.com,cn:2222/Android s/rk3588-manifests.git
fatal: Could not read from remote repos itory.

please make sure you have the correct access rights
and the repository exists.
```

<!-- source:cn p37 unit:168 -->

解决方法:请确认是否已申请相应 SDK 权限。d. git 用戶信息未配置错误日志:

<!-- source:cn p38 unit:169 -->

```text
Please tell me who you are.
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
to set your account's default identity.
```

<!-- source:cn p38 unit:170 -->

解决方法:配置全局 Git 用戶信息或创建 .gitconfig 文件:

<!-- source:cn p38 unit:171 -->

```text
xx@ubuntu:~$ vi ~/.gitconfig
[color]
•       ui = true
[user]
•       name = xxx(填写您的名称)
•       email = yyy（填写您的邮箱）
```

<!-- source:cn p38 unit:172 -->

e. 子仓库同步失败或引用损坏错误日志:

<!-- source:cn p38 unit:173 -->

```text
From https://gerrit.rock-chips.com:8443/android/RKTools
[new branch] android-5.1 -> rk/android-5.1
[new branch] remotes/rk/rk3288/mid/android-5.1 -> rk/remotes/rk/rk3288/mid/android-5.1
[new branch] rk3036/wireless_dongle/5.1/develop -> rk/rk3036/wireless_dongle/5.1/develop
error: 'refs/remotes/rk/rk312x' exists; cannot create 'refs/remotes/rk/rk312x/mid/android-
5.1'
! [new branch] rk312x/mid/android-5.1 -> rk/rk312x/mid/android-5.1 (unable to update local
ref)
error: unable to resolve reference refs/remotes/rk/rk322x/box/android-5.1: Not a directory
! [new branch] rk322x/box/android-5.1 -> rk/rk322x/box/android-5.1 (unable to update local
ref)
error: 'refs/remotes/rk/rk3288' exists; cannot create 'refs/remotes/rk/rk3288/mid/android-
5.1'
或
stdout:fatal:not a git repository:/xxx/.repo/projects/android/RKTools
```

<!-- source:cn p38 unit:174 -->

解决方法:删除出错子仓库目录后重新同步:

<!-- source:cn p38 unit:175 -->

```text
xx@ubuntu:~$ rm -rf RKTools
xx@ubuntu:~$ .repo/repo/repo sync
```

<!-- source:cn p38 unit:176 -->

或者本地仓库报错,需要删除如下3处下对应镜像和非镜像仓库路径,再继续同步(此类同步失败多由于手checkout动中断同步引起,导致本地同步数据损坏)。

<!-- source:cn p39 unit:177 -->

```text
xx@ubuntu:~$ rm -rf .repo/project-objects/(⼦仓库)
xx@ubuntu:~$ rm -rf .repo/projects/(⼦仓库)
xx@ubuntu:~$ rm -rf ./(⼦仓库)
```

<!-- source:cn p39 unit:178 -->

f. locale 设置异常错误日志:

<!-- source:cn p39 unit:179 -->

```text
projects: 50% (235/469) perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
LANGUAGE = (unset),
LC_ALL = (unset),
LC_PAPER = "zh_CN.UTF-8",
LC_ADDRESS = "zh_CN.UTF-8",
LC_MONETARY = "zh_CN.UTF-8",
LC_NUMERIC = "zh_CN.UTF-8",
LC_TELEPHONE = "zh_CN.UTF-8",
LC_IDENTIFICATION = "zh_CN.UTF-8",
LC_MEASUREMENT = "zh_CN.UTF-8",
LC_TIME = "zh_CN.UTF-8",
LC_NAME = "zh_CN.UTF-8",
LANG = "en_US.UTF-8"
are supported and installed on your system.
perl: warning: Falling back to the standard locale ("C").
```

<!-- source:cn p39 unit:180 -->

解决方法:在末尾添加以下内容并加载配置:.bashrc

<!-- source:cn p39 unit:181 -->

```text
xx@ubuntu:~$ vi ~/.bashrc
export LC_ALL=C
```

<!-- source:cn p39 unit:182 -->

保存后执行:

<!-- source:cn p39 unit:183 -->

```text
xx@ubuntu:~$ source ~/.bashrc
```

<!-- source:cn p39 unit:184 -->

g. GitError 报错(需启用 force-sync )错误日志:

<!-- source:cn p39 unit:185 -->

```text
GitError: --force-sync not enabled; cannot overwrite a local work tree. If you're
comfortable with the possibility of losing the work tree's git metadata, use `repo sync --
force-sync frameworks/native` to proceed.
```

<!-- source:cn p40 unit:186 -->

解决方法: 使用 v2.18 版 repo 并启用 --force-sync 参数重新同步:

<!-- source:cn p40 unit:187 -->

```text
xx@ubuntu:~$ git clone https://gerrit.rock-chips.com:8443/repo-release/tools/repo #于本地home
⽬录下下载 tag v2.18 repo⼯具
xx@ubuntu:~$ cd rksdk #切换到sdk所在⽬录下
xx@ubuntu:~/rksdk$ ../repo/repo sync -c --force-sync #调⽤刚下载repo⼯具重新同步
```

<!-- source:cn p40 unit:188 -->

h. fetch 报错错误日志:

<!-- source:cn p40 unit:189 -->

```text
Fetching projects: 99% (477/481) Fetching projectplatform/external/libusb-compat
Fetching project platform/external/libseccomp-helper
error: Cannot fetch android/rk/u-boot
```

<!-- source:cn p40 unit:190 -->

解决方法: 确认使用 v2.18 版 repo 工具,并确保访问权限正确:

<!-- source:cn p40 unit:191 -->

```text
xx@ubuntu:~$ git clone "https://gerrit.rock-chips.com:8443/repo-release/tools/repo"
xx@ubuntu:~$ cd rksdk #切换到sdk所在⽬录
xx@ubuntu:~/rksdk$ ../repo/repo sync -c --force-sync #调⽤刚下载repo⼯具重新同步
```

<!-- source:cn p40 unit:192 -->

i. 使用 sudo 报错:错误日志:

<!-- source:cn p40 unit:193 -->

```text
xx@ubuntu:~$ sudo .repo/repo/repo sync -c
xx: Permission dented (publickey).
fatal: could not read from remote repository.
Please make sure you have the correct access rights and the repository exists.
Caborted by user
```

<!-- source:cn p40 unit:194 -->

解决方法:请使用运行授权脚本的同一用戶进行操作,不要使用:reposudo

<!-- source:cn p40 unit:195 -->

```text
xx@ubuntu:~$ .repo/repo/repo sync -c
```

<!-- source:cn p40 unit:196 -->

j. https下载报错错误日志:

<!-- source:cn p41 unit:197 -->

```text
gnutls_handshake() failed: An unexpected TLS packet was received
或
gnutls_handshake() failed: #开头相关报错
```

<!-- source:cn p41 unit:198 -->

解决方法:更新系统中、和模块:gitcurlgnutls

<!-- source:cn p41 unit:199 -->

```text
xx@ubuntu:~$ sudo apt-get update
xx@ubuntu:~$ sudo apt upgrade git -y
xx@ubuntu:~$ sudo apt upgrade curl -y
```

<!-- source:cn p41 unit:200 -->

如果通过升级重装依赖,仍无法解决此问题,请使用如下两种方式之一:建议使用Ubuntu20或者以上系统版本(编译Android SDK或者Linux SDK均需要此环境) ;或者 协议链接下载,示例如下:ssh

<!-- source:cn p41 unit:201 -->

```text
xx@ubuntu:~$repo init --repo-url https://gerrit.rock-chips.com:8443/repo-release/tools/repo
-u https://gerrit.rock-chips.com:8443/Android_U/manifests -b master -m
Android14.xml

改为：

xx@ubuntu:~$ repo init --repo-url ssh://username@gerrit.rock-chips.com:8222/repo-
release/tools/repo
-u ssh://username@gerrit.rock-chips.com:8222/Android_U/manifests -b master -m
Android14.xml
```

<!-- source:cn p41 unit:202 -->

若遇到以上未覆盖的问题,请提交至Rockchip官方Bug系统(https://redmine.rock-chips.com/)上,Rockchoip团队将协助您解决。因本地网络问题导致的连接失败需用戶自行处理。

{% endraw %}

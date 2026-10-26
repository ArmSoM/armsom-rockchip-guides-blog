# 中英源码差异（保留各语言原稿）

去除行首尾空白后对照；不将注释翻译差异或示例排版差异当作硬件实测差异。中文独有通用echo占位示例已经在EN/RU/DE明确补充来源。

```diff
--- CN source code
+++ EN source code
@@ -23,27 +23,27 @@
 
 Invalid parameters: invaild GraphicBuffer, can not get fd and virtual address,
 
-D librga  : <<<<-------- print rgaLog -------->>>>                              //以下部分为传⼊librga的参数打印。
-D librga  : src->hnd = 0x0 , dst->hnd = 0x0 , src1->hnd = 0x0                   //三个通道 （src、src1、dst）传⼊的内存句柄的值
-D librga  : src: Fd = 00 , phyAddr = 0x0 , virAddr = 0xb400007431ed6040         //src通道传⼊的内存类型对应的值，对应为DMA_FD、物理地址、虚拟地址。
-D librga  : dst: Fd = 00 , phyAddr = 0x0 , virAddr = 0xb400007431b4f040         //dst通道传⼊的内存类型对应的值，对应为DMA_FD、物理地址、虚拟地址。
-D librga  : src: Fd = -01 , buf = 0xb400007431ed6040, mmuFlag = 1, mmuType = 0  //src通道将配置传递的内存类型对应的值以及是否使能MMU，这⾥HAL层选择虚拟地址传⼊驱动。
-D librga  : dst: Fd = -01 , buf = 0xb400007431b4f040, mmuFlag = 1, mmuType = 0  //dst通道将配置传递的内存类型对应的值以及是否使能MMU，这⾥HAL层选择虚拟地址传⼊驱动。
-E librga  : blend = 0 , perpixelAlpha = 1                                       //混合模式以及图像格式是否本⾝存在Alpha值
-D librga  : scaleMode = 0 , stretch = 0;                                        //缩放模式 （RGA1）。
-E librga  : rgaVersion = 3.200000  , ditherEn =0                                //硬件版本号， 16阶灰度图（Y4）dither使能。
-D librga  : srcMmuFlag = 1 , dstMmuFlag = 1 , rotateMode = 0                    //MMU使能标志位，旋转模式。
-D librga  : <<<<-------- rgaReg -------->>>>                                    //以下为配置⼊驱动的参数打印。
-E librga  : render_mode=0 rotate_mode=0                                         //RGA运⾏模式，旋转模式。
-E librga  : src:[0,b400007431ed6040,b400007431fb7040],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0    //src通道的内存、图像参数、格式信息。
-E librga  : dst:[0,b400007431b4f040,b400007431c30040],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0    //dst通道的内存、图像参数、格式信息。
-E librga  : pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0                        //pat/src1通道的内存、图像参数、格式信息，由于当前模式没有使⽤到该通道，所以参数均为0。 //以下部分开发者通常不⽤关⼼，为librga配置⼊驱动的不同模式的相关参数。
-E librga  : ROP:[0,0,0],LUT[0]                                                  //ROP模式配置，LUT表配置
-E librga  : color:[0,0,0,0,0]                                                   //colorkey配置（max color, min color）, 填充颜⾊配置(前景⾊配置，背景⾊配置，颜⾊填充配置)
-E librga  : MMU:[1,0,80000521]                                                  //MMU配置
-E librga  : mode[0,0,0,0]                                                       //palette、 csc、colorkey配置
-E librga  : Full CSC : en[0]                                                    //full csc使能标志
-E librga  : gr_color_x [0, 0, 0]                                                //填充颜⾊配置，对应R、G、B的颜⾊值
+D librga  : <<<<-------- print rgaLog -------->>>>                              //The parameters passed to librga are printed as follows.
+D librga  : src->hnd = 0x0 , dst->hnd = 0x0 , src1->hnd = 0x0                   //The handle passed in by the three channels (src、src1、dst).
+D librga  : src: Fd = 00 , phyAddr = 0x0 , virAddr = 0xb400007431ed6040         //Parameters passed in src channel, representing DMA_FD, physical address and virtual address respectively.
+D librga  : dst: Fd = 00 , phyAddr = 0x0 , virAddr = 0xb400007431b4f040         //Parameters passed in dst channel, representing DMA_FD, physical address, and virtual address respectively.
+D librga  : src: Fd = -01 , buf = 0xb400007431ed6040, mmuFlag = 1, mmuType = 0  //The src channel configures the value for the type of memory passed and whether or not MMU is enabled, where the HAL selects the virtual address to pass into the driver.
+D librga  : dst: Fd = -01 , buf = 0xb400007431b4f040, mmuFlag = 1, mmuType = 0  //The dst channel configures the value for the type of memory passed and whether or not MMU is enabled, where HAL selects the virtual address to pass in the driver.
+E librga  : blend = 0 , perpixelAlpha = 1                                       //Blending mode and whether the image format includes an Alpha value.
+D librga  : scaleMode = 0 , stretch = 0;                                        //scale mode (RGA1).
+E librga  : rgaVersion = 3.200000  , ditherEn =0                                //Hardware version, Y4 Dither enabled.
+D librga  : srcMmuFlag = 1 , dstMmuFlag = 1 , rotateMode = 0                    //MMU enable flag, rotation mode.
+D librga  : <<<<-------- rgaReg -------->>>>                                    //Parameters configuration of the driver are printed as follows.
+E librga  : render_mode=0 rotate_mode=0                                         //RGA rendering mode, rotation mode.
+E librga  : src:[0,b400007431ed6040,b400007431fb7040],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0    //Memory, image parameters, format information of src channel.
+E librga  : dst:[0,b400007431b4f040,b400007431c30040],x-y[0,0],w-h[1280,720],vw-vh[1280,720],f=0    //Memory, image parameters, format information of dst channel.
+E librga  : pat:[0,0,0],x-y[0,0],w-h[0,0],vw-vh[0,0],f=0                        //Memory, image parameters, format information of pat/src1 channel. This channel is not used in current mode, therefore the parameters are set to 0. //The following are some of the parameters that developers usually don't have to care about, which is to configure for librga different modes of the driver.
+E librga  : ROP:[0,0,0],LUT[0]                                                  //ROP and LUT configuration.
+E librga  : color:[0,0,0,0,0]                                                   //Colorkey configuration（max color, min color）, color-filling configuration (foreground color, background color, color-filling).
+E librga  : MMU:[1,0,80000521]                                                  //MMU configuration.
+E librga  : mode[0,0,0,0]                                                       //Palette、 csc、colorkey configuration.
+E librga  : Full CSC : en[0]                                                    //Full csc enabled flag.
+E librga  : gr_color_x [0, 0, 0]                                                // Color-filling configuration, corresponding the value of R, G, B.
 
 /sys/kernel/debug
 
@@ -65,8 +65,6 @@
 'echo int > debug' to enable/disable interruppt log printing.
 'echo check > debug' to enable/disable check mode.
 'echo stop > debug' to enable/disable stop using hardware
-
-echo <cmd> > <节点名>
 
 /# cd /sys/kernel/debug/rkrga/
 /# cat debug
@@ -123,49 +121,52 @@
 /# dmesg -c
 [ 5096.412419] rga2: close rga2 reg!
 
-rga2: open rga2 test MSG!                               //msg⽇志开启打印。
-rga2: cmd is RGA2_GET_VERSION                           //获取版本号功能，每个进程第⼀次调⽤ librga时会查询硬件版本。
-rga2: cmd is RGA_BLIT_SYNC                              //显⽰当前传⼊的⼯作模式。
-rga2: render_mode:bitblt,bitblit_mode=0,rotate_mode:0   //render_mode显⽰调⽤接⼝， bitblit_mode为当前混合模式（0：双通道模式——A+B->B， 1：三通道模式A+B->C），rotate_mode为旋转⻆度。
+rga2: open rga2 test MSG!                               //Open 'msg' log printing.
+rga2: cmd is RGA2_GET_VERSION                           //Get version number, which queries hardware version the first time each process calls librga.
+rga2: cmd is RGA_BLIT_SYNC                              //Current working mode.
+rga2: render_mode:bitblt,bitblit_mode=0,rotate_mode:0   //Render_mode: display calling interface, bitblit_mode: current blending mode（0：two-channel mode A+B->B, 1: three-channel mode A+B->C, rotate_mode: rotation angle.
 rga2: src : y=0 uv=b4000072cc8bc040 v=b4000072cc99d040 aw=1280 ah=720 vw=1280 vh=720
-xoff=0 yoff=0 format=RGBA8888  //src通道的图像数据参数：y: 如有则为fd的值， uv：如有则为虚拟地址的值， v：vw * vh + uv， aw、ah：实宽实⾼，即实际操作图像区域，vw、vh：虚宽虚⾼，即图像本⾝⼤⼩， xoff、yoff：x、y⽅向的偏移量，format：传⼊的图像数据格式。
+xoff=0 yoff=0 format=RGBA8888
+//Parameters of src channel of image data y:fd, uv:virtual address, v：vw * vh + uv, aw and ah：actual width and height, the actual area of image. operation, vw、vh:virtual width and height, the size of image itself, xoff、yoff: offset in the x and y directions, format：image format.
 rga2: dst : y=0 uv=b4000072cc535040 v=b4000072cc616040 aw=1280 ah=720 vw=1280 vh=720
-xoff=0 yoff=0 format=RGBA8888  //dst通道的图像数据参数。
-rga2: mmu : src=01 src1=00 dst=01 els=00                //MMU使能标志，0为关闭，1为开启。
-rga2: alpha : flag 0 mode0=0 mode1=0                    //blend相关配置
-rga2: blend mode is no blend                            //blend混合模式
-rga2: yuv2rgb mode is 0                                 //csc模式
+xoff=0 yoff=0 format=RGBA8888
+//Parameters of dst channel of image data.
+rga2: mmu : src=01 src1=00 dst=01 els=00                //MMU enabled flag，0 for close，1 for open.
+rga2: alpha : flag 0 mode0=0 mode1=0                    //Configuration of blending.
+rga2: blend mode is no blend                            //Blend mode.
+rga2: yuv2rgb mode is 0                                 //Csc mode.
 rga2: *** rga2_blit_sync proc ***
 
 rga: import buffer info:
 rga_common: external: memory = 0xb400007458406000, type = virt_addr
-//memory：内存的数值，type：内存类型
+//memory：memory value，type： memory type
 rga_common: memory param: w = 1280, h = 720, f = RGBA8888(0x0), size = 0
-//w/h/f：以图像画布的形式描述内存⼤⼩，size：内存⼤⼩
-rga_dma_buf: iova_align size = 3686400              //iova对⻬后的⼤⼩
-
-rga: Blit mode: request id = 192732                 //运⾏模式以及request id
+//w/h/f：Describe the memory size in the form of image canvas, size: memory size
+rga_dma_buf: iova_align size = 3686400
+
+rga: Blit mode: request id = 192732                 //running mode and request id
 rga_debugger: render_mode = 0, bitblit_mode=0, rotate_mode = 0
-//render_mode显⽰调⽤接⼝， bitblit_mode为当前混合模式（0：双通道模式——A+B->B， 1：三通道模式A+B->C），rotate_mode为旋转⻆度。
+//render_modedisplay calling interface，bitblit_mode: current blending mode（0：two-channel mode A+B->B, 1: three-channel mode A+B->C, rotate_mode: rotation angle.
 rga_debugger: src: y = 19 uv = 0 v = e1000 aw = 1280 ah = 720 vw = 1280 vh = 720
-//src通道的图像数据参数：y: 如有则为 fd的值， uv：如有则为虚拟地址的值， v：vw * vh + uv， aw、ah：实宽实⾼，即实际操作图像区域， vw、vh：虚宽虚⾼，即图像本⾝⼤⼩。
+//Parameters of src channel of image data y:fd, uv:virtual address, v：vw * vh + uv, aw and ah：actual width and height, the actual area of image. operation, vw、vh:virtual width and height, the size of image itself.
 rga_debugger: src: xoff = 0, yoff = 0, format = 0x0, rd_mode = 1
-//xoff、yoff：x、y⽅向的偏移量， format：传⼊的图像数据格式，rd_mode：当前通道读/写数据模式（1：raster，2：FBC，3：tile 16*16）
+//, xoff、yoff: offset in the x and y directions, format：image format, rd_mode：Current channel read/write data mode（1：raster，2：FBC，3：tile 16*16）.
 rga_debugger: dst: y=1a uv=0 v=e1000 aw=1280 ah=720 vw=1280 vh=720
-//dst通道的图像数据参数
+//Parameters of dst channel of image data.
 rga_debugger: dst: xoff = 0, yoff = 0, format = 0x0, rd_mode = 1
-rga_debugger: mmu: mmu_flag=0 en=0                  //MMU使能标志，0为关闭，1为开启。使⽤rga_buffer_handle_t调⽤时禁⽤该配置，由驱动抉择最优配置。
-rga_debugger: alpha: rop_mode = 0                   //alpha/ROP模式使能
-rga_debugger: yuv2rgb mode is 0                     //CSC模式
+rga_debugger: mmu: mmu_flag=0 en=0                  //MMU enabled flag，0 for close，1 for open.This configuration is disabled when called with
+rga_buffer_handle_t, and the driver chooses the optimal configuration.
+rga_debugger: alpha: rop_mode = 0                   //alpha/ROP mode enable/disable.
+rga_debugger: yuv2rgb mode is 0                     //CSC mode config
 rga_debugger: set core = 0, priority = 0, in_fence_fd = -1
-//set_core：⽤⼾态指定的核⼼， priority：⽤⼾态指定的优先级，in_fence_fd：⽤⼾态传递的acquire_fence fd
+//set_core：user mode specified core，priority：user mode specified priority，in_fence_fd：acquire_fence fd passed by user mode.
 
 rga_policy: start policy on core = 1
 rga_policy: start policy on core = 2
-rga_policy: start policy on core = 4                //遍历所有的核⼼⽀持情况
-rga_policy: RGA2 only support under 4G memory!      //对应核⼼不⽀持的原因⽇志
-rga_policy: optional_cores = 3                      //当前请求可匹配的硬件核⼼合集
-rga_policy: assign core: 1                          //匹配后绑定的硬件核⼼标识
+rga_policy: start policy on core = 4                //Iterate over all core support cases.
+rga_policy: RGA2 only support under 4G memory!      //Corresponding to the log of the reason why the core does not support.
+rga_policy: optional_cores = 3                      //The current request can match the hardware core collection.
+rga_policy: assign core: 1                          //The hardware core identifier bound after matching.
 
 rga3_reg: render_mode:bitblt, bitblit_mode=0, rotate_mode:0
 rga3_reg: win0: y = ffc70000 uv = ffd51000 v = ffd89400 src_w = 1280 src_h = 720
@@ -179,8 +180,8 @@
 rga3_reg: blend mode is no blend
 rga3_reg: yuv2rgb mode is 0
 
-rga2: open rga2 reg!                                    //reg⽇志开启打印。
-rga2: CMD_REG                                           //功能寄存器配置
+rga2: open rga2 reg!                                    //Open 'reg' log printing.
+rga2: CMD_REG                                           //Configuration of command register.
 rga2: 00000000 00000000 00000040 000e1040
 rga2: 00119440 00000000 00000500 02cf04ff
 rga2: 00000000 00000000 00000000 00000000
@@ -189,11 +190,11 @@
 rga2: 00000000 00000000 0000ff00 ffffffff
 rga2: 00000007 00000000 00000000 00000101
 rga2: 07a80000 00000000 07a800e4 00000000
-rga2: CSC_REG                                           //full csc寄存器配置
-rga2: 00000000 00000000 00000000 00000000
-rga2: 00000000 00000000 00000000 00000000
-rga2: 00000000 00000000 00000000 00000000
-rga2: CMD_READ_BACK_REG                                 //功能寄存器回读值
+rga2: CSC_REG                                           //Configuration of full csc register.
+rga2: 00000000 00000000 00000000 00000000
+rga2: 00000000 00000000 00000000 00000000
+rga2: 00000000 00000000 00000000 00000000
+rga2: CMD_READ_BACK_REG                                 //Read back of full command register.
 rga2: 00000000 00000000 00000040 000e1040
 rga2: 00119440 00000000 00000500 02cf04ff
 rga2: 00000000 00000000 00000000 00000000
@@ -202,34 +203,34 @@
 rga2: 00000000 00000000 0000ff00 ffffffff
 rga2: 00000007 00000000 00000000 00000101
 rga2: 07a80000 00000000 07a800e4 00000000
-rga2: CSC_READ_BACK_REG                                 //full csc寄存器回读值
-rga2: 00000000 00000000 00000000 00000000
-rga2: 00000000 00000000 00000000 00000000
-rga2: 00000000 00000000 00000000 00000000
-
-rga2: sync one cmd end time 2414                    //打印本次⼯作RGA硬件的耗时，单位为us
-
-rga3_reg: set cmd use time = 196                    //开始处理请求到配置寄存器的耗时，单位为us
-rga_job: hw use time = 554                          //硬件启动到硬件中断返回耗时，单位为us
-rga_job: (pid:3197) job done use time = 751         //开始处理请求到请求完成的耗时，单位为us
-rga_job: (pid:3197) job clean use time = 933        //开始处理请求到请求资源处理完毕的耗时，单位为us
-
-rga_mm: request[3300], get buffer_handle info cost 188 us       //获取当前buffer_handle信息耗时（虚拟地址则包含cache同步的耗时）
-rga3_reg: request[3300], generate register cost time 2 us       //⽣成寄存器配置耗时
-rga3_reg: request[3300], set register cost time 301 us          //配置寄存器耗时
-rga_job: request[3300], hardware[RGA3_core0] cost time 539 us   //对应的硬件核⼼完成任务耗时
-rga_mm: request[3300], put buffer_handle info cost 153 us       //释放当前buffer_handle信息耗时（虚拟地址则包含cache同步的耗时）
-rga_job: request[3300], job done total cost time 1023 us        //当前job从提交到完成返回⽤⼾态的全部耗时
-rga_job: request[3300], job cleanup total cost time 1030 us     //当前job从提交到资源释放完毕的全部耗时
+rga2: CSC_READ_BACK_REG                                 //Read back of full csc register.
+rga2: 00000000 00000000 00000000 00000000
+rga2: 00000000 00000000 00000000 00000000
+rga2: 00000000 00000000 00000000 00000000
+
+rga2: sync one cmd end time 2414                    //Print the RGA. hardware time of the work,in us.
+
+rga3_reg: set cmd use time = 196                    //Time elapsed from start processing request to configuration register.
+rga_job: hw use time = 554                          //Time-consuming from hardware startup to hardware interrupt return.
+rga_job: (pid:3197) job done use time = 751         //Time-consuming from the start of processing the request to the completion of the request.
+rga_job: (pid:3197) job clean use time = 933        //Time-consuming from the start of processing the request to the completion of the request resource processing.
+
+rga_mm: request[3300], get buffer_handle info cost 188 us
+rga3_reg: request[3300], generate register cost time 2 us
+rga3_reg: request[3300], set register cost time 301 us
+rga_job: request[3300], hardware[RGA3_core0] cost time 539 us
+rga_mm: request[3300], put buffer_handle info cost 153 us
+rga_job: request[3300], job done total cost time 1023 us
+rga_job: request[3300], job cleanup total cost time 1030 us
 
 /# cat driver_version
 RGA multicore Device Driver: v1.2.23
 
 /# cat load
-num of scheduler = 3                                    //当前搭载硬件核⼼数
+num of scheduler = 3                                    //The number of hardware cores currently equipped.
 ================= load ==================
 scheduler[0]: rga3_core0
-load = 0%                                      //对应核⼼负载占⽐
+load = 0%                                      //Core load ratio.
 -----------------------------------
 scheduler[1]: rga3_core1
 load = 0%
@@ -240,13 +241,13 @@
 
 /# cat mm_session
 rga_mm dump:
-buffer count = 3                                        //内存管理器内保存的buffer数量
+buffer count = 3                                        //The number of buffers saved in the memory manager
 ===============================================================
-handle = 34 refcount = 1 mm_flag = 0x2  tgid = 3210     //内存句柄、引⽤计数、内存标识、进程号打印
+handle = 34 refcount = 1 mm_flag = 0x2  tgid = 3210
 virtual address:
 va = 0xb400007286e1c000, pages = 0x00000000ae081f65, size = 3686400
 iova = 0xffc70000, offset = 0x0, sgt = 0x00000000cc976f9e, size = 3686400, map_core = 0x1
-//内存信息
+//memory information
 ---------------------------------------------------------------
 handle = 35 refcount = 1 mm_flag = 0x2  tgid = 3210
 virtual address:
@@ -261,12 +262,12 @@
 
 /# cat request_manager
 rga internal request dump:
-request count = 1                                       //任务管理器内任务请求数量
+request count = 1                                       //The number of job requests in the job manager.
 ===============================================================
 ------------------ request: 200073 ------------------
 set cmd num: 1, finish job: 0, failed job: 0, flags = 0x0, ref = 2
-//任务请求完成情况
-cmd dump:                                      //任务请求参数
+//Job request completion status.
+cmd dump:                                      //Job request information.
 rotate_mode = 0
 src: y = 25 uv = 0 v = e1000 aw = 1280 ah = 720 vw = 1280 vh = 720
 src: xoff = 0, yoff = 0, format = 0x0, rd_mode = 1
@@ -279,7 +280,7 @@
 
 /# cat hardware
 ===================================
-rga3_core0, core 1: version: 3.0.76831                  //搭载核⼼的硬件版本、⽀持的功能选项等参数
+rga3_core0, core 1: version: 3.0.76831                  //Parameters such as the hardware version equipped with the core and supported function options.
 input range: 68x2 ~ 8176x8176
 output range: 68x2 ~ 8128x8128
 scale limit: 1/8 ~ 8
@@ -318,7 +319,7 @@
 /# dmesg -c
 rga_debugger: dump image 1
 
-.... RGA运⾏ ....
+.... RGA running ....
 
 /# dmesg -c
 rga_debugger: dump image to:
@@ -329,11 +330,11 @@
 /# ls /data/rga_image/
 1_core1_dst_plane0_virt_addr_w1280_h720_RGBA8888.bin
 1_core1_src_plane0_virt_addr_w1280_h720_RGBA8888.bin
-//输⼊（src）、输出（dst）运⾏图像数据
-
-cat /sys/kernel/debug/clk/clk_summary | grep rga                //查询rga频率，其中的aclk的频率
-
-echo 400000000 > /sys/kernel/debug/clk/aclk_rga/clk_rate        //400000000修改为想要修改的频率
+//Input (src), output (dst) running image data
+
+cat /sys/kernel/debug/clk/clk_summary | grep rga                //Query rga frequency.
+
+echo 400000000 > /sys/kernel/debug/clk/aclk_rga/clk_rate        //Modify 400000000 to the needed frequency.
 
 diff --git a/arch/arm/boot/dts/rk3288-android.dtsi b/arch/arm/boot/dts/rk3288-android.dtsi
 index 02938b0..10a1dc4 100644
@@ -351,8 +352,8 @@
 RgaBlit(1483) RGA_BLIT fail: Invalid argument
 Failed to call RockChipRga interface, please use 'dmesg' command to view driver error log.
 
-rga_policy: invalid function policy                         //标识存在⽆效的参数，这⾥是指没有硬件能够访问当前请求配置的内存。
-rga_job: job assign failed                                  //匹配硬件核⼼失败
+rga_policy: invalid function policy                         //Indicates that there are invalid parameters, which means that no hardware can access the memory configured by the current request.
+rga_job: job assign failed                                  //Failed to match hardware core
 rga_job: failed to get scheduler, rga_job_commit(403)
 rga_job: (pid:3524) job clean use time = 19
 rga_job: request[282567] task[0] job_commit failed.
@@ -361,7 +362,7 @@
 
 rga_policy: start policy on core = 4
 [82116.782252] rga_policy: RGA2 only support under 4G memory!
-//标识当前搭载的RGA2核⼼仅⽀持4G以内的内存。 [82116.782256] rga_policy: optional_cores = 0 [82116.782258] rga_policy: invalid function policy [82116.782260] rga_policy: assign core: -1 [82116.782262] rga_job: job assign failed
+//Indicates that the currently equipped RGA2 core only supports memory within 4G. [82116.782256] rga_policy: optional_cores = 0 [82116.782258] rga_policy: invalid function policy [82116.782260] rga_policy: assign core: -1 [82116.782262] rga_job: job assign failed
 
 /# cat hardware
 
@@ -391,24 +392,24 @@
 Fatal error: Failed to call RockChipRga interface, please use 'dmesg' command to view driver
 error log.
 
-E librga  : err ws[100,1280,1280]                                           //标识单签虚宽存在问题
-E librga  : [RgaBlit,731]Error srcRect                                      //标识是src通道报错
-E rockchiprga: fd-vir-phy-hnd-format[0, 0xb400006eb6ea9040, 0x0, 0x0, 0]    //对应src通道的输⼊地址（fd、虚拟地址、物理地址、handle）。
-E rockchiprga: rect[100, 0, 1280, 720, 1280, 720, 1, 0]                     //对应src通道的图像参数依次为：x⽅向偏移、y⽅向偏移、实际操作区域的宽、实际操作区域的⾼、图像宽（虚⾼）、图像⾼（虚⾼）、图像格式、size（⽬前没有使⽤到的参数）。
-E rockchiprga: f-blend-size-rotation-col-log-mmu[0, 0, 0, 0, 0, 0, 1]       //标识着本次调⽤中的模式配置。
-E rockchiprga: fd-vir-phy-hnd-format[0, 0xb400006eb2ea6040, 0x0, 0x0, 0]    //对应dst通道的参数
+E librga  : err ws[100,1280,1280]                                           //Represent the width stride error.
+E librga  : [RgaBlit,731]Error srcRect                                      //Represent the src channel error.
+E rockchiprga: fd-vir-phy-hnd-format[0, 0xb400006eb6ea9040, 0x0, 0x0, 0]    //Input address (fd, virtual address, physical address, handle) of  corresponding src channel.
+E rockchiprga: rect[100, 0, 1280, 720, 1280, 720, 1, 0]                     //Image parameters of corresponding src channel are: X direction offset, Y direction offset, width of the actual operation area, height of the actual operation area, image width (virtual width), image height (virtual height), image format, size ( parameters currently not used) respectively.
+E rockchiprga: f-blend-size-rotation-col-log-mmu[0, 0, 0, 0, 0, 0, 1]       //Represents the mode configuration in the call.
+E rockchiprga: fd-vir-phy-hnd-format[0, 0xb400006eb2ea6040, 0x0, 0x0, 0]    //Parameters of corresponding dst channel.
 E rockchiprga: rect[0, 0, 1920, 1080, 1920, 1080, 1, 0]
 E rockchiprga: f-blend-size-rotation-col-log-mmu[0, 0, 0, 0, 0, 0, 1]
-E rockchiprga: This output the user parameters when rga call blit fail      //报错信息
-
-(1) drm buffer申请选项增加ROCKCHIP_BO_ALLOC_KMAP定义。
+E rockchiprga: This output the user parameters when rga call blit fail      //Error information.
+
+(1) drm buffer application options add ROCKCHIP_BO_ALLOC_KMAP definition.
 +   /* keep kmap for cma buffer or alloc kmap for other type memory */
 +   ROCKCHIP_BO_ALLOC_KMAP  = 1 << 4,
-(2) 申请drm内存时，增加新增的drm buffer选项ROCKCHIP_BO_ALLOC_KMAP。
+(2) When applying for drm memory, add drm buffer option ROCKCHIP_BO_ALLOC_KMAP.
 struct drm_mode_create_dumb arg;
 ...
 -   arg.flags = ROCKCHIP_BO_CONTIG;
-+   arg.flags = ROCKCHIP_BO_CONTIG | ROCKCHIP_BO_ALLOC_KMAP;    //ROCKCHIP_BO_ALLOC_KMAP仅与 ROCKCHIP_BO_CONTIG共同使⽤时有效。
++   arg.flags = ROCKCHIP_BO_CONTIG | ROCKCHIP_BO_ALLOC_KMAP;    //ROCKCHIP_BO_ALLOC_KMAP is valid only when used together with ROCKCHIP_BO_CONTIG.
 ret = drmIoctl(drm_fd, DRM_IOCTL_MODE_CREATE_DUMB, &arg);
 
 commit 1a81ee3e2d3726b9382ff2c48d08f4d837bc0143
@@ -427,7 +428,7 @@
 Failed to call RockChipRga interface, please use 'dmesg' command to view driver error log.
 
 /# echo msg > /sys/kerne/debug/rkrga/debug
-/# dmesg                        //For logs opened through nodes, the printing level is KERNEL_DEBUG. You need to run the dmesg command to view the corresponding logs on the serial port or adb. [ 4802.344683] rga2: open rga2 reg!
+/# dmesg       //For logs opened through nodes, the printing level is KERNEL_DEBUG. You need to run the dmesg command to view the corresponding logs on the serial port or adb. [ 4802.344683] rga2: open rga2 reg!
 
 /# cat /sys/kerne/debug/rkrga/debug
 REG [DIS]
@@ -437,18 +438,18 @@
 MM [DIS]
 
 rga_policy: start policy on core = 4
-rga_policy: RGA2 only support under 4G memory!     //标识当前搭载的RGA2核⼼仅⽀持4G以内的内存。
+rga_policy: RGA2 only support under 4G memory! //Indicates that the current RGA2 core only supports memory within 4G.
 rga_policy: optional_cores = 0
 rga_policy: invalid function policy
 rga_policy: assign core: -1
 rga_job: job assign failed
 rga_policy: start policy on core = 1
-rga_policy: core = 1, break on rga_check_dst      //对应核⼼不⽀持的原因⽇志，这⾥是dst通道的图像参数不满⾜当前核⼼要求（可以查阅⽂档确认该核⼼⽀持情况，这⾥core 0x1、0x2为RGA3核⼼，0x4为RGA2核⼼）
+rga_policy: core = 1, break on rga_check_dst //Corresponding to the core unsupported reason log, here is the image parameter of the dst channel does not meet the current core requirements (you can check the document to confirm the core support, here core 0x1, 0x2 are RGA3 core, 0x4 is RGA2 core)
 rga_policy: start policy on core = 2
-rga_policy: core = 2, break on rga_check_dst      //对应核⼼不⽀持的原因⽇志，同上。
+rga_policy: core = 2, break on rga_check_dst //Corresponding to the log of reasons not supported by the core, same as above.
 rga_policy: start policy on core = 4
-rga_policy: RGA2 only support under 4G memory!    //对应核⼼不⽀持的原因⽇志，标识当前不匹配原因为该核⼼不⽀持4G内存空间以外的内存。
+rga_policy: RGA2 only support under 4G memory! //Corresponding to the reason log that the core does not support, it indicates that the reason for the current mismatch is that the core does not support memory other than 4G memory space.
 rga_policy: optional_cores = 0
 rga_policy: invalid function policy
-rga_policy: assign core: -1                       //遍历全部核⼼后，⽆可匹配核⼼，则上报匹配失败错误。
+rga_policy: assign core: -1 // After traversing all cores, if there is no matching core, a matching failure error will be reported.
 rga_job: job assign failed
```

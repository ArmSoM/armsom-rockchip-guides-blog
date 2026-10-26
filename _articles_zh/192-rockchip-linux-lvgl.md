---
title: "Rockchip Linux LVGL 与 OpenGL(ES) Gallery"
description: "Rockchip Linux LVGL 与 OpenGL(ES) Gallery — V1.2.1"
excerpt: "Rockchip Linux LVGL 与 OpenGL(ES) Gallery"
translation_key: "192-rockchip-linux-lvgl"
slug: "192-rockchip-linux-lvgl"
lang: "zh"
date: "2026-10-24"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "media"
products: []
tags: [ArmSoM, Rockchip, Linux]
---

{% raw %}

# Rockchip Linux LVGL 与 OpenGL(ES) Gallery

ArmSoM 平台参考，依据对应中英文 Rockchip 原稿；具体板卡、SoC、SDK/BSP、内核及外设需逐项匹配，不代表所有 ArmSoM 板卡支持。原稿示例和测试结果不是 ArmSoM 实测，未执行命令或硬件验证。

对应 Buildroot LVGL 8.4.x / 9.1.x 与 Rockchip lv_gl 扩展；示例含原稿有意省略部分。

中英 V1.2.1；保留全部7章、API参数及版本9的lv_drivers合并脚注。中文13图取中文原稿，英俄德13图取英文原稿。原稿动画示例有意省略代码，不能当成完整可编译程序；透明度与可见度用语有混用，原意和疑点注明，代码不改。

| 系统 | 版本 |
| --- | --- |
| Buildroot | 8.4.x |
| Buildroot | 9.1.x |

## 1. LVGL 简介

LVGL 是一个较为流行的免费和开源的嵌入式图形库,可以在MCU、MPU以及各种屏幕上绘制美观的UI。LVGL 是完全开源的,除了部分扩展功能外没有外部依赖,这使得它的移植非常简单。它可与任何现代 MCU 或 MPU配合使用,并可与任何 (RT)OS 或裸机设置一起使用,以驱动电子纸、单色、OLED 或 TFT 显示器,甚至监视器。因此,甚至可以在Windows、Linux上调试UI界面,有一些基础的平台无关的UI调试,反复编译烧录固件是十分繁琐的,这时就可以在PC上搭建环境调试,再拷⻉到嵌入式设备上编译运行。

## 2. LVGL 源码

在通用Linux SDK中,LVGL有三个源码仓库,分别为lvgl,lv_drivers 1 ,lvgl_demo。其中lvgl仓库为LVGL框架源码,lv_drivers为一些比较常用的显示接口,比如drm,sdl,wayland等,lvgl_demo则是由RK编写的一些应用示例,比如如何调用一些基本的初始化,如何将官方的DEMO运行起来等。其中lvgl与lv_drivers源码均通过官方github仓库下载,并打上RK提供的一些补丁,详⻅与。lvgl_demo源码则在同步SDK时下buildroot/package/lvgl/lvgl/buildroot/package/lvgl/lv_drivers/载,路径为 。&lt;SDK&gt;/app/lvgl_demo

## 3. LVGL 配置

LVGL的配置主要区别在于渲染后端的选择,目前可选DRM直接送显,通过SDL送显,以及通过RKADK送显。其中DRM配置使用在没有GPU或RGA的平台如RK3308等,SDL配置使用在有GPU的平台如RK3568等,RKADK使用在有GPU或RGA的平台。

### 3.1 配置文件说明

常用的配置已保存在 目录下。&lt;SDK&gt;/buildroot/configs/rockchip/gui/lvgl/

```text
<SDK>/buildroot/configs/rockchip/gui/lvgl/
├── lvgl_drm.config     # 软链接V8版本配置，兼容旧⽂件路径
├── lvgl_rkadk.config   # 软链接V8版本配置，兼容旧⽂件路径
├── lvgl_sdl.config     # 软链接V8版本配置，兼容旧⽂件路径
├── music.config            # LVGL官⽅⾳乐播放器⽰例
├── rk_demo.config          # Rockchip家电显控⽰例
├── v8                      # V8版本配置⽂件
│   ├── base.config         # 基础配置⽂件，配置LVGL的特性，功能等
│   ├── lvgl_drm.config     # DRM配置⽂件，使⽤DRM送显
│   ├── lvgl_rkadk.config   # RKADK配置⽂件，使⽤RKADK送显
│   └── lvgl_sdl.config     # SDL配置⽂件，使⽤SDL送显
├── v9                      # V9版本配置⽂件
│   ├── base.config
│   ├── lvgl_drm.config
│   ├── lvgl_rkadk.config
│   └── lvgl_sdl.config
└── widgets.config          # LVGL官⽅组件⽰例
```

### 3.2 配置文件使用说明

在板级配置文件中引用LVGL配置文件即可,以RK3308为例:

```text
$ cat buildroot/configs/rockchip_rk3308_bs_32_ia_release_defconfig | grep lvgl
# 选择后端
#include "gui/lvgl/lvgl_drm.config"
# 选择应⽤
#include "gui/lvgl/rk_demo.config"
```

### 3.3 SDL配置补充说明

如果选择了SDL配置文件,则还需要手动开启SDL后端选项:

```text
BR2_PACKAGE_SDL2=y
BR2_PACKAGE_SDL2_OPENGLES=y
# 如果是在WAYLAND环境下，则开启WAYLAND后端。依据具体环境选择
BR2_PACKAGE_SDL2_WAYLAND=y
```

在SDL配置环境下,如果需要额外的OpenGL(ES)接口支持,则可以开启:

```text
BR2_PACKAGE_LV_DRIVERS_USE_OPENGL=y
```

## 4. LVGL 编译

```text
cd buildroot
source envsetup.sh
# 选择板⼦对应配置
# V8 版本编译如下三个包
make lvgl lv_drivers lvgl_demo -j20
# V9 版本编译如下两个包
make lvgl lvgl_demo -j20
```

需要注意,如果进入buildroot menuconfig修改了LVGL相关的配置,建议将每个仓库都重新编译一遍,避免配置不一致导致链接或运行出错,如:

```text
cd buildroot
# V8 版本编译如下三个包
make lvgl-reconfigure lv_drivers-reconfigure lvgl_demo-reconfigure -j20
# V9 版本编译如下两个包
make lvgl-reconfigure lvgl_demo-reconfigure -j20
```

## 5. LVGL_DEMO 代码说明

源码路径为 。&lt;SDK&gt;/app/lvgl_demo/

### 5.1 目录结构

```text
app/lvgl_demo/
├── cJSON   # cJSON源码
├── common  # 通⽤组件
├── gallery # 图库应⽤
├── lv_demo # 基础⽰例程序，运⾏官⽅DEMO
├── lvgl8   # V8版本接⼝适配，包含显⽰，触摸等
├── lvgl9   # V9版本接⼝适配，包含显⽰，触摸等
├── rk_demo
│   ├── asr                 # ASR应⽤
│   ├── furniture_control   # 家电显控
│   ├── home                # DEMO⾸⻚
│   ├── include             # rkwifibt等头⽂件
│   ├── intercom_homepage   # 楼宇对讲
│   │   ├── intercom_call   # 对讲呼叫
│   │   └── video_monitor   # RTSP码流播放
│   ├── layout              # 布局组件
│   ├── resource            # 图⽚、字体资源
│   ├── rockit              # rockit相关适配
│   ├── setting             # 系统设置
│   ├── smart_home          # 智能家居
│   └── wifibt              # rkwifibt相关适配
├── sys     # 时间戳，soc信息，cpu信息等接⼝
└── tools   # 代码⻛格格式化⼯具
```

### 5.2 lv_demo 代码说明

源码路径为,主要作为一个示例程序,演示如何将官方的DEMO运行起来。以下说&lt;SDK&gt;/app/lvgl_demo/lv_demo明略过一些无关的代码,仅挑选需要关注的代码进行说明。

```text
/* <SDK>/app/lvgl_demo/lv_demo/main.c */
...
int main(int argc, char **argv)
{
    lv_port_init();

    /* 根据配置选择对应的DEMO初始化，绘制对应UI */
#if LV_USE_DEMO_WIDGETS
    lv_demo_widgets();
#elif LV_USE_DEMO_BENCHMARK
    lv_demo_benchmark();
#elif LV_USE_DEMO_MUSIC
    lv_demo_music();
#endif
    while (!quit)
    {
        /* 调⽤LVGL任务处理函数，LVGL所有的事件、绘制、送显等都在该接⼝内完成 */
        lv_task_handler();
        usleep(100);
    }

    return 0;
}
```

```text
/* <SDK>/app/lvgl_demo/lvgl8/lv_port_init.c */
/* 触摸旋转 */
/* 0, 90, 180, 270 */
static int g_indev_rotation = 0;
/* 显⽰旋转 */
/* 0, 90, 180, 270 */
static int g_disp_rotation = 0;

void lv_port_init(void)
{
    /* LVGL框架初始化 */
    lv_init();

    /* 显⽰初始化 */
    lv_port_disp_init(0, 0, g_disp_rotation);
    /* 触摸初始化 */
    lv_port_indev_init(g_indev_rotation);
}
```

```text
/* <SDK>/app/lvgl_demo/lvgl9/lv_port_init.c */
/* 触摸旋转 */
/* 0, 90, 180, 270 */
static int g_indev_rotation = 0;
/* 显⽰旋转 */
/* 0, 90, 180, 270 */
static int g_disp_rotation = 0;
/* ⽇志等级 */
static int log_level = LV_LOG_LEVEL_WARN;
...
void lv_port_init(void)
{
    const char *buf;

    /* LVGL框架初始化 */
    lv_init();

    /* 通过环境变量获取⽇志等级 */
    buf = getenv("LV_DEBUG");
    if (buf)
        log_level = buf[0] - '0';
    /* 设置⽇志回调 */
    lv_log_register_print_cb(print_cb);
    /* 设置系统时钟回调 */
    lv_tick_set_cb(lv_systick);
    /* 设置延时回调 */
    lv_delay_set_cb(lv_sysdelay);

    /* 显⽰初始化 */
    lv_port_disp_init(0, 0, g_disp_rotation);
    /* 触摸初始化 */
    lv_port_indev_init(g_indev_rotation);
}
```

## 6. OpenGL(ES)接口说明

由于LVGL本身不支持OpenGL(ES)接口,且SDL不支持3D对象,因此针对一些需要使用到相关功能的应用,封装出一套lv_gl接口,使LVGL应用可以在原有的UI应用上直接叠加上3D图像效果。

### 6.1 文件说明

```text
lv_drivers/sdl/gl/
├── gl.c                // 接⼝实现
├── gl.h                // 接⼝及外部结构体定义
├── mat.c               // 矩阵函数实现
├── mat.h               // 矩阵函数定义
└── shaders             // OpenGL着⾊器
    ├── bgra_cube.frag  // BGRA格式⽴⽅体⽚段着⾊器
    ├── bgra.frag       // BGRA格式图⽚⽚段着⾊器
    ├── common.vert     // 通⽤顶点着⾊器，包含旋转矩阵、缩放矩阵等
    ├── cube.vert       // ⽴⽅体顶点着⾊器
    ├── default.vert    // 图⽚顶点着⾊器
    ├── rgba_cube.frag  // RGBA格式⽴⽅体⽚段着⾊器
    └── rgba.frag       // RGBA格式图⽚⽚段着⾊器
```

### 6.2 枚举说明

#### 6.2.1 颜色格式

目前支持的是LV_GL_FMT_RGBA和LV_GL_FMT_BGRA,后续考虑加入YUV格式支持。

```text
enum {
    LV_GL_FMT_ALPHA,
    LV_GL_FMT_LUMINANCE,
    LV_GL_FMT_LUMINANCE_ALPHA,
    LV_GL_FMT_INTENSITY,
    LV_GL_FMT_RGB,
    LV_GL_FMT_RGBA,
    LV_GL_FMT_BGRA,
};
```

#### 6.2.2 纹理类型

用于区分平面图形和立方体图形,使用不同的渲染方式

```text
enum {
    GL_TEX_TYPE_2D,
    GL_TEX_TYPE_CUBE,
};
```

#### 6.2.3 立方体平面

用于选择立方体平面,在导入图像,或使用立方体对象作为渲染目标时选择目标面。

```text
enum {
    CUBE_LEFT,
    CUBE_RIGHT,
    CUBE_TOP,
    CUBE_BOTTOM,
    CUBE_FRONT,
    CUBE_BACK,
};
```

在OpenGL的坐标中,屏幕中间为原点(0, 0),X坐标向右为正,Y坐标向上为正,Z坐标垂直于屏幕向外为正,因此,当一个立方体被创建,无旋转的情况下,面向用戶的方向为正(CUBE_FRONT),其余方向类推,如下图所示(虚线表示不可⻅部分):

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p010-figure-01.png)

### 6.3 结构体说明

应用上使用,主要关注lv_gl_img_t,lv_gl_tex_t,lv_gl_obj_t三个结构体。lv_gl_img_t用于将外部图片导入为GPU纹理对象

```text
typedef struct {
    /* 图⽚像素数据地址 */
    const void *pixels;
    /* 图⽚格式 */
    int format;
    /* 宽 */
    int w;
    /* ⾼ */
    int h;
} lv_gl_img_t;
```

lv_gl_tex_t储存GPU纹理对象及相关信息

```text
typedef struct {
    /* 宽 */
    int w;
    /* ⾼ */
    int h;
} lv_gl_size_t;

typedef struct {
    /* GPU纹理对象 */
    GLuint gl_tex;
    /* GPU FBO帧缓冲对象，⽤于将该纹理作为FB时使⽤ */
    GLuint FBO;
    /* 纹理⼤⼩，普通2D纹理仅有第⼀组size有效，⽴⽅体有6个⾯则有6组size信息 */
    lv_gl_size_t size[6];
    /* 纹理格式 */
    int format;
    /* 纹理类型，⽤于区分2D和⽴⽅体 */
    int type;
    /* 引⽤计数 */
    int ref_cnt;
} lv_gl_tex_t;
```

lv_gl_obj_t储存GPU渲染对象及相关信息,如顶点、变换参数等

```text
typedef struct {
    float x, y, z;
} lv_gl_vec_t;

typedef struct {
    /* 宽 */
    int w;
    /* ⾼ */
    int h;
    /* Y⽅向纹理翻转，应⽤可以忽略，按默认0即可 */
    int reverse_y;
    /* 绑定的纹理 */
    lv_gl_tex_t *tex;
    /* 渲染区域（位置及⼤⼩） */
    SDL_Rect r;
    /* 视图区域（位置及⼤⼩） */
    SDL_Rect view;
    /* 裁剪区域（位置及⼤⼩） */
    SDL_Rect crop;
    /* 视图区域需要更新，内部使⽤，应⽤可忽略 */
    int view_dirty;
    /* 裁剪区域需要更新，内部使⽤，应⽤可忽略 */
    int crop_dirty;
    /* 裁剪区域使能 */
    int crop_en;
} lv_gl_base_t;

typedef struct {
    lv_gl_base_t base;
    /* GPU VAO，顶点数组对象，会将VBO及⼀些属性配置缓存，⽅便快速切换 */
    GLuint VAO;
    /* GPU VBO，顶点缓冲对象，存储坐标、纹理顶点信息 */
    GLuint VBO;
    /* 输出⽬标，默认GL_TEXTURE_2D，如果需要在⽴⽅体上渲染，则通过该变量指定渲染的⾯ */
    int out_type;
    /*
     * ⼿动指定2D对象的四个顶点坐标
     * 默认顶点为全屏（注意是framebuffer的视图⼤⼩，⽽不是屏幕的全屏，两者可以不相等）
     * 再通过设置scale, offset等属性进⾏矩阵变换。也可以通过该属性⾃由指定顶点坐标
     * 但不建议两种⽅式共同使⽤，涉及的变换⽐较复杂，⼈⼒计算不好估算最终的效果
     * x, y, z范围均为[-1, 1]
     */
    lv_gl_vec_t p[4];
    /* ⼿动指定纹理的引⽤范围，在只需要使⽤到纹理的部分切⽚时使⽤ */
    SDL_Rect tp;

    /* 全局透明度 */
    float alpha;
    /*
     * 以下变换的顺序为：
     * 默认顶点坐标pos * offset * scale * self_rot * view_rot * perspective * move
     * 从左到右依次计算，其中perspective为视图转换，实现近⼤远⼩效果
     */
    /* 三轴⽅向的缩放 */
    lv_gl_vec_t scale;
    /* 三轴⽅向的偏移 */
    lv_gl_vec_t offset;
    /* 三轴⽅向的旋转 */
    lv_gl_vec_t self_rot;
    /* 三轴⽅向的视⻆旋转 */
    lv_gl_vec_t view_rot;
    /* 三轴⽅向的位移 */
    lv_gl_vec_t move;
} lv_gl_obj_t;
```

### 6.4 函数说明



`void lv_gl_set_render_cb(lv_gl_render_cb_t cb);`

注册应用层渲染回调,对象的渲染只能在回调里完成cb:渲染回调函数指针

`void lv_gl_set_fb(lv_gl_obj_t *obj);`

设置framebufferobj:不为空时则后续的渲染会将图像合成在该对象的纹理内存中,为空则表示恢复到默认的framebuffer,直接渲染到屏幕上

`void lv_gl_read_pixels(void *ptr, SDL_Rect *r, int type);`

将当前的framebuffer的指定区域拷⻉到内存中ptr:目标内存r:目标区域,起始点及大小type:目标类型,传0则默认GL_TEXTURE_2D,如果需要读取立方体的面,则通过该变量指定

`lv_gl_tex_t *lv_gl_tex_create(int type, int w, int h, lv_gl_img_t *img);`

创建纹理对象type:纹理类型,GL_TEX_TYPE_2D或GL_TEX_TYPE_CUBEw:纹理宽度,img不为空时会使用img中的宽度值,该值被忽略h:纹理高度,img不为空时会使用img中的高度值,该值被忽略

img:导入的图像,为空时则会只会在GPU内申请对应空间(默认值全为0.0),不为空时则会将对应图像也导入到GPU内。如果纹理类型为GL_TEX_TYPE_CUBE,则该参数需要传入一个大小至少为6的数组返回值:lv_gl_tex_t *,纹理对象指针

`void lv_gl_tex_del(lv_gl_tex_t *tex);`

删除纹理对象tex:纹理对象指针

`void lv_gl_tex_import_img(lv_gl_tex_t *tex, lv_gl_img_t *img);`

纹理对象导入外部图像,如果纹理对象在创建时已经传入过图像指针,则该接口不需要再次被调用。如果需要更换图像,或者创建时仅创建空内存,则使用该接口导入图像tex:纹理对象指针img:导入的图像地址。如果纹理类型为GL_TEX_TYPE_CUBE,则该参数需要传入一个大小至少为6的数组

`void lv_gl_tex_clear(lv_gl_tex_t *tex, float r, float g, float b, float a);`

将纹理对象使用指定颜色填充tex:纹理对象指针r:红色通道g:绿色通道b:蓝色通道a:透明度通道

`lv_gl_obj_t *lv_gl_obj_create(int w, int h);`

创建渲染对象。创建后的对象无法直接渲染,需要绑定纹理后才可渲染w:宽度,用于缩放计算h:高度,用于缩放计算返回值:lv_gl_obj_t *,渲染对象指针

`void lv_gl_obj_del(lv_gl_obj_t *obj);`

删除渲染对象obj:渲染对象

`void lv_gl_obj_resize(lv_gl_obj_t *obj, lv_gl_obj_t *parent);`

根据渲染目标重设渲染缩放大小。默认创建的渲染对象为全屏显示,因此需要使用该接口重置scale参数。需要注意的是,该接口使用obj的宽高和parent的视图宽高进行计算,而非和parent的宽高进行计算obj:渲染对象parent:渲染目标。为空时则选为默认值,即屏幕

`void lv_gl_obj_move(lv_gl_obj_t *obj, lv_gl_obj_t *parent);`

根据渲染目标重设渲染位置。根据scale和base.r的值与parent的视图宽高进行计算,由于使用了scale的值,该接口建议在resize之后调用,且scale有手动修改时,均建议重新调用下该接口obj:渲染对象parent:渲染目标。为空时则选为默认值,即屏幕

`void lv_gl_obj_reset_points(lv_gl_obj_t *obj);`

将渲染对象的顶点参数重置,即全屏显示

obj:渲染对象

`void lv_gl_obj_reset_tex_points(lv_gl_obj_t *obj);`

将渲染对象的纹理顶点参数重置,即使用全图obj:渲染对象

`void lv_gl_obj_update_vao(lv_gl_obj_t *obj);`

根据当前的顶点参数和纹理顶点参数更新渲染对象的VAO和VBO。因此如果手动修改了顶点参数和纹理顶点参数后,需要调用该接口才会生效。如未创建过则会创建新的VAO和VBO。obj:渲染对象

`void lv_gl_obj_release_vao(lv_gl_obj_t *obj);`

释放VAO和VBO,使用默认的参数obj:渲染对象

`void lv_gl_obj_bind_tex(lv_gl_obj_t *obj, lv_gl_tex_t *tex);`

绑定纹理对象,纹理对象引用计数会加1。如果渲染对象已经有绑定的纹理对象,则会对原有的纹理对象减引用,当引用小于等于0时会自动释放。因此需要注意,该接口可能触发内存释放,应用上需要避免外部引用纹理对象和重复释放obj:渲染对象tex:纹理对象

`void lv_gl_obj_set_crop(lv_gl_obj_t *obj, SDL_Rect *r, int en);`

设置裁剪范围,以屏幕左下⻆为原点坐标,向上为Y正方向,向右为X正方向,与LVGL默认的左上⻆为原点不同,需要特别注意obj:渲染对象,为空时表示屏幕r:裁剪范围,起始坐标和大小,为空时起始坐标重置为原点,大小重置为渲染对象大小en:为1使能裁剪,为0关闭裁剪

`void lv_gl_obj_get_crop(lv_gl_obj_t *obj, SDL_Rect *r);`

获取裁剪范围obj:渲染对象,为空时表示屏幕r:裁剪范围,起始坐标和大小

`void lv_gl_obj_set_viewport(lv_gl_obj_t *obj, SDL_Rect *r);`

设置视图范围,以屏幕左下⻆为原点坐标,向上为Y正方向,向右为X正方向,与LVGL默认的左上⻆为原点不同,需要特别注意obj:渲染对象,为空时表示屏幕r:视图范围,起始坐标和大小,为空时起始坐标重置为原点,大小重置为渲染对象大小

`void lv_gl_obj_get_viewport(lv_gl_obj_t *obj, SDL_Rect *r);`

获取视图范围obj:渲染对象,为空时表示屏幕r:视图范围,起始坐标和大小

`void lv_gl_obj_render(lv_gl_obj_t *obj);`

将渲染对象渲染在framebuffer上,只能在回调中使用

obj:渲染对象

## 7. Gallery DEMO代码说明

针对相册,图库类应用,新增Gallery DEMO,包含多个动画效果,如滑入,淡入,立方体旋转,立方体翻转,立方体文字显示,滚筒图片预览,照片流等

### 7.1 目录结构

```text
gallery/
├── anims                   // 动画实现
│   ├── cube_flip.c         // ⽴⽅体翻转动画
│   ├── cube_flip.h
│   ├── cube_lyric.c        // ⽴⽅体字符渲染
│   ├── cube_lyric.h
│   ├── cube_rotate.c       // ⽴⽅体旋转
│   ├── cube_rotate.h
│   ├── fade_out.c          // 淡出
│   ├── fade_out.h
│   ├── fade_slide_out.c    // 滑动淡出
│   ├── fade_slide_out.h
│   ├── fold.c              // 照⽚折叠
│   ├── fold.h
│   ├── photo_stream.c      // 照⽚流
│   ├── photo_stream.h
│   ├── roller.c            // 滚桶图⽚预览
│   ├── roller.h
│   ├── slide_out.c         // 滑动退出
│   ├── slide_out.h
│   ├── stiker.c            // 贴图测试
│   └── stiker.h
├── CMakeLists.txt
├── gallery.c               // UI⼊⼝。渲染对象，纹理初始化等
├── gallery.h
├── main.c                  // 应⽤⼊⼝。lvgl，屏幕，触摸初始化等
├── main.h
└── pics                    // 图⽚资源
```

### 7.2 UI入口函数

main.c内函数与lv_demo 代码说明一致,不做过多介绍,主要介绍UI相关代码。

```text
// gallery.c

/* 定义在⽴⽅体字符渲染动画中⽤到的字符，每两⾏渲染到⼀个⾯上，共12⾏ */
static char *lyric[]...

/* 各个动画中⽤到的纹理对象 */
lv_gl_tex_t *tex_cube;
lv_gl_tex_t *tex_2d[6];
lv_gl_tex_t *tex_roller;
lv_gl_tex_t *tex_fb;

/* 各个动画中⽤到的渲染对象 */
lv_gl_obj_t *obj_fb;
lv_gl_obj_t *obj_img0;
lv_gl_obj_t *obj_img1;
lv_gl_obj_t *obj_cube;
lv_gl_obj_t *obj_fold[4];
lv_gl_obj_t *obj_roller_items[6];
lv_gl_obj_t *obj_roller;
/*
 * ⽴⽅体字符渲染动画中⽤到的结构体，共12⾏则会创建⼀个12个成员的lyric_row数组
 * 每个lyric_row内都包含了当前⾏的所有单个字符
 */
lyric_row *obj_lyrics;

/*
 * 视图⼤⼩，为屏幕⼤⼩减去按钮矩阵的⼤⼩
 * 即屏幕分为两部分，下半部分为按钮，⽤于交互触发动画，上半部分为动画渲染区域
 */
SDL_Rect view;

/* 屏幕完整⼤⼩ */
SDL_Rect screen;

/* 指⽰当前动画是否在播放中，⼀次只能等待⼀个动画播放完成 */
int animing = 0;

/* ttf⽂件导⼊的字体 */
lv_ft_info_t ttf_main;

/* lvgl对象，屏幕 */
lv_obj_t *scr;
/* lvgl对象，图⽚，⽤于图⽚切换动画 */
lv_obj_t *img1;
/* lvgl对象，图⽚，⽤于图⽚切换动画  */
lv_obj_t *img2;
/* lvgl对象，动画区域容器 */
lv_obj_t *anim_area;
/* lvgl对象，按钮矩阵 */
lv_obj_t *btn_mat;
/* lvgl对象，进度条，显⽰动画进度 */
lv_obj_t *slider;
/* lvgl对象，照⽚流容器 */
lv_obj_t *photo_box;
/* lvgl对象，照⽚流图⽚ */
lv_obj_t *photos[6];
/* 定义了所有的动画，各个动画都通过宏定义在各⾃的头⽂件中，并在此处引⽤ */
static lv_anim_t anims[]...

/* 定义按钮矩阵的⽂字，与动画顺序⼀⼀对应 */
static const char *btnm_map[]...

/* 按钮矩阵回调，⽤于触发动画 */
static void event_handler(lv_event_t * e)

/* 字体初始化，⽤于中⽂字符渲染 */
static void font_init(void)

/* 创建渲染画布，⽤于后续将⽂字渲染为图⽚ */
static label_canvas *create_canvas(lv_color_t color, lv_font_t *font)

/* 将⽂字渲染为图⽚，并创建GPU渲染对象，⾃动绑定纹理后返回 */
static lv_gl_obj_t *utf8_to_obj(lv_gl_obj_t *parent, label_canvas *lc, char *text)

/* 通⽤动画起始回调，⽤于重置⼀些动画参数 */
void common_anim_start(void)

/* 纹理对象初始化 */
static void tex_init(void)

/* UI⼊⼝ */
void gallery(void)
```

```text
// gallery.h
typedef struct
{
    /* 指定字体及渲染颜⾊ */
    lv_draw_label_dsc_t label_dsc;
    /* 画布buffer，⽤于反复利⽤，减少申请内存次数 */
    lv_img_dsc_t *img_dsc;
    /* 画布对象 */
    lv_obj_t *canvas;
} label_canvas;

typedef struct {
    /* 字符转出的GPU渲染对象 */
    lv_gl_obj_t **objs;
    /* 当前⾏字符⻓度 */
    int len;
} lyric_row;
```

### 7.3 动画

由于lv_gl无法自动触发渲染,需要在动画回调中触发LVGL框架渲染流程,目前是在所有的动画回调中使用lv_obj_invalidate(lv_layer_top())触发渲染,同时由于top layer没有子对象,不会影响到正常的渲染性能。

#### 7.3.1 立方体翻转

效果说明动画效果如图所示,通过立方体的旋转,实现两张照片的切换,旋转过程中立方体适当缩小

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p018-figure-01.png)

通过X轴旋转15度视⻆可以更好的观察这个动画

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p018-figure-02.png)

代码说明

```text
/* anims/cube_flip.c */
/*
 * 定义额外的三个⼦动画。应⽤中将完整的动画分为4步，每步旋转90度
 * 第⼀个动画定义在anims/cube_flip.h中，从0度转到90度
 * 第⼀个⼦动画从90度旋转到180度
 * 第⼆个⼦动画从180度转到270度
 * 第三个⼦动画从270度转到360度
 * 每个⼦动画都设定了act_time = -1000，从⽽实现每个动作之间间隔1s
 */
static lv_anim_t sub_anims[]...
/* 设置⽴⽅体动画视图范围，所有⽴⽅体动画通⽤ */
SDL_Rect cube_view;
/* 根据当前的动画进度设置缩放效果 */
#define ZOOM_IN ...
/* ⽴⽅体动画渲染回调，所有⽴⽅体动画通⽤ */
void anim_cube_render(void)
/*
 * ⽴⽅体动画起始回调，所有⽴⽅体动画通⽤
 * 特别注意，在起始回调中将视图修改为⼀个特别的值
 * ⾸先取默认视图中宽⾼较⼩的⼀边（⽐如宽⽐⾼⼩，则取宽）
 * 并将该值除0.57 + 2作为新的视图的宽⾼值（视图需要为正⽅形，否则后续变换可能异常）
 * 由于正⽅体的中⼼到任意⼀⻆的距离d=sqrt(3)/2*a
 * a为边⻓，且等于2.0（坐标系为[-1，-1，-1]-[1, 1, 1]）
 * 因此为了保证⽆论如何旋转，⽴⽅体的任意⻆都不会超出坐标系
 * 即d应该始终⼩于1.0
 * 则选择缩放⽐例为0.57。sqrt(3)/2*a*0.57=0.9873
 * +2仅为经验值，保证⽴⽅体略微超出屏幕，不让左右留有缝隙，根据实际应⽤情况可去除
 */
void anim_cube_start(lv_anim_t *a)
/* 起始回调 */
void anim_cube_flip_start(lv_anim_t *a)
/* 动画回调，根据当前动画进度，设置Y轴旋转⻆度和缩放⽐例 */
void anim_cube_flip(void *var, int32_t v)
/* 结束回调，根据a->var的值判断当前是第⼏段动画，并执⾏下⼀段动画或结束 */
void anim_cube_flip_end(lv_anim_t *a)
```

#### 7.3.2 立方体旋转

效果说明通过简单的360度旋转展示不同面上的照片

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p020-figure-01.png)

代码说明

```text
/* anims/cube_rotate.c */
/* 起始回调，直接调⽤anim_cube_start，说明⻅前⼀⼩节 */
void anim_cube_rotate_start(lv_anim_t *a)
/* 动画回调，设置缩放为0.57(原因⻅前⼀节)，并根据动画进度设置X，Y轴的旋转⻆度 */
void anim_cube_rotate(void *var, int32_t v)
/* 结束回调，恢复动画标志位，恢复进度条 */
void anim_cube_rotate_end(lv_anim_t *a)
```

#### 7.3.3 立方体字符渲染

效果说明依次旋转立方体6个面,并在当前显示的面上绘制字符,将字符替换为歌词即可配合音乐实现3D歌词展示

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p020-figure-02.png)

代码说明

```text
/* anims/cube_lyric.c */
/*
 * 定义额外的两个⼦动画。应⽤中将每次旋转，每⾏⽂字的渲染都分为⼦动画去完成
 * 动画从左⾯开始，主动画完成左⾯的两⾏绘制
 * 主动画完成后使能第⼀个旋转⼦动画，从左⾯旋转到右⾯
 * 旋转完成后使能第⼀个渲染⼦动画，完成右⾯的两⾏绘制
 * 绘制完成后使能第⼆个旋转⼦动画，如此循环直⾄6个⾯绘制完成
 */
static lv_anim_t sub_anims[]...
/* 表⽰当前绘制进⾏到第⼏⾏的第⼏个字 */
static int line;
static int row;
static int col;
/*
 * 渲染回调，和普通的⽴⽅体不同，多了⼀步在⽴⽅体上绘制，因此独⽴⼀个回调
 * 在这个回调中
 * 第⼀步先将⽴⽅体设置为framebuffer，表⽰后续的渲染都会绘制到⽴⽅体上
 * 第⼆步绘制当前字符
 * 第三步将framebuffer重置，表⽰后续的渲染直接显⽰到屏幕上
 * 第四步将⽴⽅体渲染到屏幕上
 */
void anim_cube_lyric_render(void)
/*
 * 起始回调，先调⽤⽴⽅体通⽤起始回调，并将渲染回调设置为anim_cube_lyric_render
 * 再将⽴⽅体旋转到左⾯，⽅便后续动画进⾏
 */
void anim_cube_lyric_start(lv_anim_t *a)
/* 绘制动画回调，根据当前进度，更新字符索引，触发渲染 */
void anim_cube_lyric(void *var, int32_t v)
/* 旋转动画回调，根据当前进度，旋转⽴⽅体到合适的⾯ */
void anim_cube_lyric_sub(void *var, int32_t v)
/* 旋转动画结束回调，根据下⼀⾏⽂字的⻓度，更新绘制动画的时⻓（按每字300ms计算），并启动绘制动画 */
void anim_cube_lyric_sub_end(lv_anim_t *a)
/*
 * 绘制动画结束回调，每次绘制完⾏数加⼀
 * 如果⾏数是奇数，说明当前⾯还有⼀⾏未显⽰，根据下⼀⾏⽂字的⻓度
 * 更新绘制动画的时⻓（按每字300ms计算），并启动绘制动画
 * 如果⾏数是偶数，说明当前⾯已绘制完成，启动旋转动画
 * 如果所有12⾏都绘制完成，则结束动画
 * DEMO中共12⾏，每⾯2⾏，如果是其他⾏数规划，则逻辑会有不同
 */
void anim_cube_lyric_end(lv_anim_t *a)
```

#### 7.3.4 图片折叠

效果说明图一向内折叠退出,图二分两部分从画面外向内位移

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p022-figure-01.png)

代码说明

```text
/* anims/fold.c */
/* 渲染回调。应⽤将两张图分为四个部分（每张都分为左右两部分），因此在渲染回调中调⽤了四次渲染 */
static void anim_fold_render(void)
/*
 * 起始回调
 * 1 将视图设置为480x480（图⽚⼤⼩，可选，根据实际情况调整）
 * 2 根据新视图重置4个渲染对象的缩放参数
 * 3 将图⽚切分为4块，obj_fold[0]为图⼀左半，obj_fold[1]为图⼀右半，以此类推
 * 4 设置渲染回调
 */
void anim_fold_start(lv_anim_t *a)
/*
 * 动画回调
 * 由于该需求使⽤旋转变换相对复杂，因为旋转轴在不停发⽣变化，且需要根据偏移值反推旋转⻆度等
 * 因此通过直接设置顶点坐标来实现，只需要在动画回调中不停更新四个对象各个顶点的X轴坐标即可
 * ⽽obj_fold[0]的右边两点和obj_fold[1]的左边两点是固定向内折且不变的
 * 因此这4个点的X坐标不需要改变，仅需将Z坐标设置为负值即可（⽬前是设定为0~-0.2，根据效果调整）
 * 顶点着⾊器内的透视变换会⾃动变换出近⼤远⼩的效果
 */
void anim_fold(void *var, int32_t v)
/* 结束回调 */
void anim_fold_end(lv_anim_t *a)
```

#### 7.3.5 滚桶图片预览

效果说明六张图片构成一个桶形,旋转展示每张图片

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p023-figure-01.png)

代码说明

```text
/* anims/roller.c */
/* 渲染回调，将6张图⽚依次渲染 */
void anim_roller_render(void)
/*
 * 起始回调
 * 1 将视图设置为2000x2000，因为涉及到旋转，因此为了避免图⽚超出坐标造成裁切丢失画⾯，设为⼀个较⼤值
 * 2 将渲染对象根据新视图重新计算⼤⼩，并且将Z轴偏移设为0.20785，使图⽚距离中⼼有⼀定距离，
 *   从⽽形成桶形。Z轴计算为简单的勾股定理，sqrt(240^2 - 120^2) / 2000 * 2.0 = 0.20785
 *   图⽚宽240（⻅下图），由于正好是六边形，因此简单的sqrt(240^2 - 120^2) 即可计算出每个⾯到
 *   中⼼的距离，2000是视图⼤⼩，由此算出缩放⽐例，再乘上范围2.0（坐标-1.0~1.0）即可得到偏移值
 *   如果不是六边形，则需要通过其他⽅式计算距离，计算缩放⽐例和偏移值的⽅式不变
 * 3 将X轴旋转设为30，Z轴旋转设为15，为了有⼀个倾斜的效果，根据需要随意设置
 */
void anim_roller_start(lv_anim_t *a)
/* 动画回调。为每张图⽚Y轴加上旋转值，第⼀张图为0度加上旋转值，第⼆张图为60度加上旋转值，依次类推 */
void anim_roller(void *var, int32_t v)
/* 结束回调 */
void anim_roller_end(lv_anim_t *a)
```

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p023-figure-02.png)

#### 7.3.6 贴图测试

在一个背景图上,每次按一小格步进一段距离,贴上一张小图

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p024-figure-01.png)

代码说明

```text
/* anims/stiker.c */
/*
 * 渲染回调
 * 1 将obj_fb设为framebuffer
 * 2 将obj_fb清除为(0.0, 0.0, 0.0, 1.0)，因为混合⽅式中，最终的alpha为d.a，即底图的alpha，
 *   因此这边需要设为1.0，否则图⽚将透明或不可⻅
 * 3 将obj_img1渲染到obj_fb上作为背景图
 * 4 将obj_img0渲染到obj_fb上作为贴图
 * 5 重置framebuffer，将obj_fb渲染到屏幕上
 * 实际使⽤中，可以将两张图⽚直接渲染到屏幕上，DEMO只是为了演⽰合成功能及framebuffer功能
 */
static void anim_stiker_render(void)
/* 起始回调。将贴图的坐标设为0,0，并调⽤lv_gl_obj_move更新参数值 */
void anim_stiker_start(lv_anim_t *a)
/* 动画回调。根据当前动画进度，设置贴图坐标，并调⽤lv_gl_obj_move更新参数值 */
void anim_stiker(void *var, int32_t v)
/* 结束回调 */
void anim_stiker_end(lv_anim_t *a)
```

#### 7.3.7 滑动退出

效果说明一个简单的滑动退出的DEMO,如图所示,图一向左逐渐滑出画面,同时图二向左滑入画面

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p025-figure-01.png)

代码说明

```text
/* anims/slide_out.c */
/* 调⽤通⽤的起始回调，并将动画区域设为可⻅ */
void anim_slide_out_start(lv_anim_t *a)
/* 动画回调，根据当前动画进度更新两张图⽚的X坐标 */
void anim_slide_out(void *var, int32_t v)
/* 结束回调 */
void anim_slide_out_end(lv_anim_t *a)
```

#### 7.3.8 图片淡出

效果说明一个简单的淡入淡出DEMO,如图所示,图一透明度降低逐渐淡出画面,同时图二增加透明度逐渐淡入画面

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p025-figure-02.png)

代码说明

```text
/* anims/fade_out.c */
/* 调⽤通⽤的起始回调，并将动画区域设为可⻅ */
void anim_fade_out_start(lv_anim_t *a)
/* 动画回调，根据当前动画进度更新两张图⽚的透明度 */
void anim_fade_out(void *var, int32_t v)
/* 结束回调 */
void anim_fade_out_end(lv_anim_t *a)
```

#### 7.3.9 滑动淡出

效果说明将前两种动画结合,图一滑出的同时降低透明度,同时图二滑入画面

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p026-figure-01.png)

代码说明

```text
/* anims/fade_slide_out.c */
/* 调⽤通⽤的起始回调，并将动画区域设为可⻅ */
void anim_fade_slide_out_start(lv_anim_t *a)
/* 动画回调，根据当前动画进度更新两张图⽚的X坐标及图⼀的透明度 */
void anim_fade_slide_out(void *var, int32_t v)
/* 结束回调 */
void anim_fade_slide_out_end(lv_anim_t *a)
```

#### 7.3.10 照片流

效果说明6张图片由上往下滚动播放,触摸或鼠标点按时暂停动画并随鼠标移动,放开后继续动画

![中文原稿技术配图](/docs/rockchip-linux-lvgl/assets/cn-p027-figure-01.png)

代码说明

```text
/* anims/photo_stream.c */
/* 图⽚⾼度 */
static int32_t img_h = 480;
/* 图⽚间隔 */
static int32_t gap_h = 20;
/*
 * 根据图⽚⾼度、图⽚间隔、图⽚数量计算出最⼤的Y坐标
 * max_y = n * img_h + (n - 1) * gap_h
 */
static int32_t max_y;
/*
 * 边界值，与max_y类似，⽤于在图⽚到达max_y后重置到照⽚流顶部继续循环
 * boundary = n * img_h + n * gap_h
 * 由于图⽚循环后需要回到顶部继续轮转，且与第⼀张图还需要有⼀个间隔，因此boundary⽐max_y多⼀个gap_h
 */
static int32_t boundary;
/* 定时更新图⽚坐标 */
static lv_timer_t *timer;
/* 定时器定时增加的坐标偏移 */
static int32_t timer_ofs = 0;
/* 上⼀次触摸增加的坐标偏移 */
static int32_t touch_ofs_s = 0;
/* 本次触摸增加的坐标偏移 */
static int32_t touch_ofs = 0;
/* 更新并检查图⽚Y坐标，实现动画效果 */
static void update_y(void)
/* 定时器回调，timer_ofs⾃增 */
static void lv_timer_cb(lv_timer_t *timer)
/*
 * 触摸回调
 * 在LV_EVENT_PRESSED回调中暂停定时器，并获取按下的坐标
 * 在LV_EVENT_PRESSING回调中获取当前触摸坐标，和按下坐标对⽐加上touch_ofs_s计算出偏移值并更新坐标
 * 在LV_EVENT_RELEASED回调中重新启⽤定时器，并将此次触摸偏移量记录到touch_ofs_s
 * 之所以分了三个偏移量，是为了保证触摸按下和触摸释放时的动画坐标连续，避免出现坐标瞬移
 */
static void touch_handler(lv_event_t * e)
/* 停⽌照⽚流 */
void anim_photo_stream_stop(void)
/* 照⽚流初始化，创建定时器，计算出max_y，boundary等 */
void anim_photo_stream_start(lv_anim_t *a)
/* 动画回调
 * 实际上照⽚流是使⽤定时器实现的，与动画⽆关，这边使⽤动画接⼝只是为了接⼝统⼀
 * ⽅便嵌⼊到DEMO框架中，实际应⽤开发使⽤定时器即可
 */
void anim_photo_stream(void *var, int32_t v)
void anim_photo_stream_end(lv_anim_t *a)
```

1. 在V9版本中,官方已将lv_drivers合并至lvgl主仓库。

## 中文原稿补充说明

中英文代码注释详略不同，保留各自原码。中文说明补充：`furniture_control` 是家电显控，`intercom_homepage` 是楼宇对讲，`intercom_call` 是对讲呼叫，`video_monitor` 播放 RTSP，`smart_home` 是智能家居，`wifibt` 适配 rkwifibt。VAO 缓存 VBO 和属性配置以便切换，VBO 保存坐标和纹理顶点，FBO 用于将纹理作为 framebuffer。Gallery 的歌词共12行，每个立方体面两行，`lyric_row` 数组有12个成员，每项包含该行的字符；屏幕下部是交互按钮，上部为动画区域，一次等待一个动画结束。贴图示例的最终 alpha 为目标底图的 `d.a`，因此清除颜色的 alpha 设为1.0，否则可能透明或不可见。

中文§1进一步限定：除部分扩展功能外无需外部依赖。可在Windows或Linux PC搭建环境，调试与平台无关的UI，避免反复编译烧写，完成后将代码拷到嵌入式设备编译运行；实际扩展仍需对应依赖。

## 相关原稿链接

[ArmSoM Docs](https://docs.armsom.org/)



{% endraw %}

---
weight: 10
title: Windows 的字体渲染
description: 使用无 hinting 字体和字体替换工具改善 Windows 字体显示效果
bookFlatSection: false
bookCollapseSection: false
bookHidden: false
---

# Windows 的字体渲染

2027 年了，有什么方法依然可以用来改进 Windows 字体渲染效果？

这些年，社区里出现过不少改善 Windows 字体显示效果的方案，例如 MacType、noMeiryoUI，以及移除字体中的 hinting 信息等。

## Hinting 是什么？

在低屏幕分辨率或小字号下，矢量字体的线条常常会落在两个像素之间，导致笔画模糊、粗细不均或变形。

Hinting 会告诉渲染引擎如何微调这些笔画和端点，让字体在小尺寸下依然边缘清晰、易于阅读。

微软雅黑的 hinting 据说是逐字人工微调的，造价非常高。

这项技术在低分辨率屏幕时代尤其重要，但同时也会让部分字形可能偏离原本的设计比例，出现笔画粗细不均、字形细节被改变等现象。

### 如何移除 hinting

2019 年，少数派作者曾经发表过一篇关于 Windows 字体渲染优化的 [文章](https://sspai.com/post/57729)，其中介绍了一种通过处理系统字体、移除 hinting 信息来改善显示效果的方案。

文章讨论了 Windows 10 1909 的字体显示问题：在 150% 以下的缩放比例下，部分字号的字体渲染表现不理想。

移除 hinting 信息后，在一些显示环境下，这样能够获得更均匀的笔画和更自然的字形。

文中推荐使用 [系统字体替换工具]( https://www.fishlee.net/soft/SysFontReplacer/) 替换系统字体。这也是本文采用的方案。

## 新雅黑 Noble Scarlet

2017 年 10 月，微软在 Windows 10 Insider Preview 释出了新版的微软雅黑 11.3 Noble Scarlet，它还有一个比较有意思的中文名字：堕朱砂。

相比传统版本的微软雅黑，Noble Scarlet 字重更加丰富，调整了字形比例，中宫收窄、字距加大、重心更协调。

不过，它最终并没有正式推出，微软在后续更新换回了旧版的雅黑。可能是砍刀部再次发力。

远景论坛的 [@碧海潮声](https://bbs.pcbeta.com/viewthread-1960120-1-1.html) 在微软的测试版字体基础上补充和完善，持续迭代新雅黑。这也是本文字体来源。

## Inter 字体

我本来是不推荐替换非原装字体的，但是 Segoe 是 Vista 时代开始使用之后一直没有换过，现在看来效果是在是有些「古早味」，即使去除 hinting 后字体效果依然很毛糙，字形也不够现代。

正好我偶然发现 Inter 在 Windows 11 的效果非常棒，非常接近苹果的 San Francisco 字体的观感，Inter 字体是一款现代的、专为 UI 设计的字体，所以用此字体替换 Segoe UI。

使用原版 Inter 字体无需去除 hinting（因为原本就没有 hinting），替代字体制作方案来自 [ZH-Font-Replacement](https://github.com/ReRokutosei/ZH-Font-Replacement) 项目。

## 最终组合

这次处理的字体主要分为三个部分。

**第一部分：Windows 10 原版字体**

从 Windows 10 最终版本中提取系统字体，按照上文的方案去除 hinting。

得到一套 Windows 10 原版字体的无 hinting 版本。

**第二部分：Noble Scarlet**

获取微软雅黑 11.3 字体文件，同样移除 hinting。

得到 Noble Scarlet 无 hinting 版本。

**第三部分：Inter 生成 Segoe UI**

使用 Inter 字体作为基础，按照上文的方案生成 Segoe UI 替代字体。

得到替换 Segoe UI 的 Inter 字体。

**下载地址：**

https://wwary.lanzoub.com/b01i5z4d4h
密码:80gw

内容如下：

- `noble_scarlet.zip`：新版雅黑 Noble Scarlet。
- `ms_yahei.zip`：Windows 10 最终版的原版雅黑无 hinting 版本。
- `inter.zip`：由 Inter 生成的 Segoe 替换字体。
- `windows_10_font.zip`：Windows 10 最终版本的其他无 hinting 系统字体。

## 替换步骤

**字体替换涉及系统文件，操作前务必做好备份，并保留原始字体以便恢复。**

1. 使用上面的 [系统字体替换工具]( https://www.fishlee.net/soft/SysFontReplacer/) 替换对应的组合中的字体。

- **Windows 10**：`noble_scarlet + inter + windows_10_font`

- **Windows 11**：`noble_scarlet + inter` （其他系统字体等待补齐，等我下次需要提取的时候顺手弄一下。）

如果不喜欢新雅黑，可以将 `noble_scarlet` 更换为原版雅黑 `ms_yahei`。

2. 对于新雅黑 `noble_scarlet` 的新增三个字重不需要替换，直接右键为所有用户安装即可。

3. 替换完成后，建议重新运行 Windows 的 ClearType 文本调整向导，根据自己的显示器进行校准。

## 实际使用体验

这套字体组合的主要目标是改善非高分屏环境下的文字显示效果。

从实际使用感受来看，处理后的字体在非高分屏上表现更自然，部分字号下笔画更加均匀，文字整体的视觉观感也更舒服。

新版微软雅黑的多级字重也是一个非常明显的提升，视觉层次会更加丰富。

## 浏览器设置

浏览器访问的网页中日文、韩文和繁体中文可能会因为字体选择不同而出现不统一的显示效果。

可以尝试将浏览器中对应语言的字体设置为微软雅黑，效果更加好。

---

相关资料：

- [2019 年末，我们能采用什么方式改善 Windows 的字体渲染？](https://sspai.com/post/57729)
- [[技术] 原版雅黑、修正版雅黑、鸿蒙替换雅黑](https://bbs.pcbeta.com/viewthread-1960120-1-1.html)
- [ZH-Font-Replacement](https://github.com/ReRokutosei/ZH-Font-Replacement)
- [系统字体替换工具]( https://www.fishlee.net/soft/SysFontReplacer/)

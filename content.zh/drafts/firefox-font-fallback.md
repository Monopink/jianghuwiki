---
weight: 10
title: "Firefox 等宽字体 Fallback"
bookFlatSection: false
bookCollapseSection: false
bookHidden: false
---

# Firefox 等宽字体 Fallback

本网站代码内容字体 CSS 是长这样：

```
font-family: "Roboto Mono", monospace, system-ui, sans-serif;
```

网页在 Chromium 系浏览器打开，按照预设顺序，代码中西文字符以 Roboto Mono 显示，中文字符以 `system-ui` 显示，Windows 系统为 Microsoft Yahei。

但是在 Windows 的 Firefox 浏览器，西文为 Roboto Mono，中文却是 SimSun（宋体）。

即便将设置中对应语言下的 Monospace 字体设置为一款不包含中文字形的字体，并且网页语言也被浏览器正确识别，也无济于事，等宽字体依然 Fallback 到了 SimSun。

在 `about:config` 中搜索 `font.name-list.monospace`，可以看到 `zh-CN` 包括 SimSun 等字体，`zh-HK`、`zh-TW` 包括 MingLiU（细明体）等字体。

将原本的字体删掉换成不包含中文字形的字体（例如 Consolas），中文字体就正确地 Fallback 到了`system-ui`。

猜测可能是因为不知道何种原因导致设置中的简体中文等宽字体设置未生效，中文字体 Fallback 到`font.name-list.monospace.zh-CN` 中指定 Simsun，而不是网站指定的 `system-ui`。

>参考资料：[如何在浏览器中彻底干掉某些字体-bgm.tv](https://bgm.tv/group/topic/368926)

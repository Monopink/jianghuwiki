---
weight: 10
title: "Windows 用户隔离"
bookFlatSection: false
bookCollapseSection: false
bookHidden: false
---

# ACL 命令

## 安装软件

1. Powershell 输入：

```shell
$cred = Get-Credential
```

2. 输入用户名及密码

3. 继续输入：

```
Start-Process powershell -ArgumentList '-Command Start-Process powershell' -Credential $cred -LoadUserProfile
```

4. 新窗口输入

```shell
$env:__COMPAT_LAYER = 'RunAsInvoker'
```
```
cd ~
```
```
& '软件包路径'
```

## 原文链接

[新建一个账户就能隔离毒瘤应用：Windows 自带权限工具妙用 ](https://sspai.com/post/58668)
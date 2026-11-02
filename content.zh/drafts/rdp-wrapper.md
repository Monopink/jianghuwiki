---
weight: 10
title: "RDP Wrapper"
bookFlatSection: false
bookCollapseSection: false
bookHidden: false
---

# RDP Wrapper

## 使用步骤

1. 从项目的 [Releases](https://github.com/stascorp/rdpwrap/releases) 下载发布包并解压。

2. 以管理员身份运行 `install.bat`。默认在线安装会从 GitHub 获取最新配置文件。

3. 打开 `RDPConf.exe`，检查服务、监听状态和当前系统版本的支持情况，并按需配置。

4. 使用 `RDPCheck.exe` 进行本机测试；也可以在其他设备上使用远程桌面客户端连接，输入目标电脑地址和有权限的 Windows 账户。

5. 如显示 `not supported`，可联网以管理员身份运行 `update.bat` 更新配置，再检查状态；仍不支持时，查看项目 Issues 中对应的系统版本。

卸载时，以管理员身份运行 `uninstall.bat`。

## 更新 rdpwrap.ini

1. 更新 `rdpwrap.ini` 配置文件

- 打开 [RDP Wrapper项目 Issues](https://github.com/) 。

- 找到适配你当前 Windows 版本和 `termsrv.dll` 构建版本（Build Number）的最新 `rdpwrap.ini` 文本。

- 替换本地目录中的配置文件：`C:\Program Files\RDP Wrapper\rdpwrap.ini`。

2. 以管理员身份打开命令提示符（CMD），依次执行以下命令重启服务：


```cmd
net stop termservice
net start termservice
```

3. 再次打开 `RDPConf.exe`，查看状态是否全部变为绿色（Supported / Listening）。

---
weight: 10
title: "Adobe Indesign"
bookFlatSection: false
bookCollapseSection: false
bookHidden: false
---

## Indesign 防止单字成行

新建一个字符样式

```
\w\w[[:punct:]]*$
```

```
\w\w[[:punct:]]*~a$
```

## 替换引号

GREP 替换

```
"([^"]+)"
```

```
“$1”
```
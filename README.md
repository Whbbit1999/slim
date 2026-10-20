# picgo-plugin-slim

PicGo 上传前图片处理插件，基于 [sharp](https://github.com/lovell/sharp)。上传前可以转换格式、缩放尺寸、压缩质量。

**其他语言：** [简体中文](https://github.com/Whbbit1999/slim/blob/master/README.md) · [繁體中文](https://github.com/Whbbit1999/slim/blob/master/README.zh-TW.md) · [English](https://github.com/Whbbit1999/slim/blob/master/README.en.md) · [한국어](https://github.com/Whbbit1999/slim/blob/master/README.ko.md) · [日本語](https://github.com/Whbbit1999/slim/blob/master/README.ja.md)

## 能做什么

1. **格式转换** —— 选定哪些源格式需要处理（png / jpg / webp / avif / tiff），统一转成 WebP / AVIF / JPEG / PNG / TIFF
2. **尺寸缩放** —— 按原图尺寸上传，或限制最长边 / 宽度 / 高度等比缩小（只缩不放）
3. **质量控制** —— 1-100 的编码质量

三项可以单独开关，比如只缩尺寸不改格式、只压缩不改尺寸。

## 安装

在 PicGo 插件设置里搜索 `slim` 安装，或者手动装到 PicGo 的 baseDir 中。

装完重启 PicGo，在插件设置里启用。

## 配置

| 配置 | 说明 |
| --- | --- |
| `convertFrom` | 需要处理的源格式，未勾选的直接上传原图 |
| `convertTo` | 输出格式，或「不转换」保持源格式 |
| `resizeMode` | `original` / `maxEdge` / `maxWidth` / `maxHeight` |
| `maxSize` | 像素上限，0 表示不限制 |
| `quality` | 1-100，png 低于 100 时启用调色板量化 |
| `skipIfLarger` | 处理后变大则保留原图（默认开） |

```jsonc
{
  "picgo-plugin-slim": {
    "convertFrom": ["png", "jpg", "webp"],
    "convertTo": "webp",
    "resizeMode": "maxEdge",
    "maxSize": 1920,
    "quality": 80,
    "skipIfLarger": true
  },
  "picgoPlugins": { "picgo-plugin-slim": true }
}
```

## 说明

- 源格式按图片内容判定，不看扩展名
- 目标格式与源格式相同时仍会按 `quality` 重新编码
- 扩展名始终跟随真实格式；文件名主干和 PicGo 自己的重命名设置不受影响
- 单张处理失败只记日志，按原图继续上传
- gif / svg / heic 不处理
- 透明通道保留
- 配置界面文案跟随 PicGo 语言：简体中文 / 繁體中文 / English / 한국어 / 日本語

## 开发

```bash
npm install
npm test
```

## 许可证

[MIT](https://github.com/Whbbit1999/slim/blob/master/LICENSE) © whbbit1999

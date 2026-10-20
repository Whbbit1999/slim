# picgo-plugin-slim

A PicGo plugin that processes images before upload, powered by [sharp](https://github.com/lovell/sharp). Convert format, resize, and compress before the file leaves your machine.

**Other languages:** [简体中文](https://github.com/Whbbit1999/slim/blob/master/README.md) · [繁體中文](https://github.com/Whbbit1999/slim/blob/master/README.zh-TW.md) · [English](https://github.com/Whbbit1999/slim/blob/master/README.en.md) · [한국어](https://github.com/Whbbit1999/slim/blob/master/README.ko.md) · [日本語](https://github.com/Whbbit1999/slim/blob/master/README.ja.md)

## What it does

1. **Format conversion** — pick which source formats to process (png / jpg / webp / avif / tiff) and convert them all to WebP / AVIF / JPEG / PNG / TIFF
2. **Resizing** — upload at original size, or scale down proportionally by longest edge / width / height (never enlarges)
3. **Quality control** — encoder quality from 1 to 100

Each of the three works on its own: resize without changing format, or compress without resizing.

## Install

Search for `slim` in PicGo's plugin settings, or install it manually into PicGo's baseDir.

Restart PicGo after installing, then enable the plugin in its settings.

## Configuration

| Option | Description |
| --- | --- |
| `convertFrom` | Source formats to process; unchecked formats are uploaded as-is |
| `convertTo` | Output format, or "keep original" to preserve the source format |
| `resizeMode` | `original` / `maxEdge` / `maxWidth` / `maxHeight` |
| `maxSize` | Pixel limit, 0 means no limit |
| `quality` | 1-100; png below 100 uses palette quantization |
| `skipIfLarger` | Keep the original when the result is larger (on by default) |

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

## Notes

- The source format is detected from the image content, not the file extension
- When the target format matches the source, the image is still re-encoded at `quality`
- The extension always follows the real format; the filename stem and PicGo's own rename settings are untouched
- A failed image is only logged; the original is uploaded instead
- gif / svg / heic are left alone
- Alpha channels are preserved
- The settings UI follows PicGo's language: 简体中文 / 繁體中文 / English / 한국어 / 日本語

## Development

```bash
npm install
npm test
```

## License

[MIT](https://github.com/Whbbit1999/slim/blob/master/LICENSE) © whbbit1999

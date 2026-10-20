# picgo-plugin-slim

PicGo 上傳前圖片處理外掛，基於 [sharp](https://github.com/lovell/sharp)。上傳前可以轉換格式、縮放尺寸、壓縮品質。

**其他語言：** [简体中文](https://github.com/Whbbit1999/slim/blob/master/README.md) · [繁體中文](https://github.com/Whbbit1999/slim/blob/master/README.zh-TW.md) · [English](https://github.com/Whbbit1999/slim/blob/master/README.en.md) · [한국어](https://github.com/Whbbit1999/slim/blob/master/README.ko.md) · [日本語](https://github.com/Whbbit1999/slim/blob/master/README.ja.md)

## 能做什麼

1. **格式轉換** —— 選定哪些來源格式需要處理（png / jpg / webp / avif / tiff），統一轉成 WebP / AVIF / JPEG / PNG / TIFF
2. **尺寸縮放** —— 按原圖尺寸上傳，或限制最長邊 / 寬度 / 高度等比縮小（只縮不放）
3. **品質控制** —— 1-100 的編碼品質

三項可以單獨開關，例如只縮尺寸不改格式、只壓縮不改尺寸。

## 安裝

在 PicGo 外掛設定裡搜尋 `slim` 安裝，或手動裝到 PicGo 的 baseDir 中。

裝完重啟 PicGo，在外掛設定裡啟用。

## 設定

| 設定 | 說明 |
| --- | --- |
| `convertFrom` | 需要處理的來源格式，未勾選的直接上傳原圖 |
| `convertTo` | 輸出格式，或「不轉換」保持來源格式 |
| `resizeMode` | `original` / `maxEdge` / `maxWidth` / `maxHeight` |
| `maxSize` | 像素上限，0 表示不限制 |
| `quality` | 1-100，png 低於 100 時啟用調色盤量化 |
| `skipIfLarger` | 處理後變大則保留原圖（預設開） |

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

## 說明

- 來源格式依圖片內容判定，不看副檔名
- 目標格式與來源格式相同時仍會依 `quality` 重新編碼
- 副檔名始終跟隨真實格式；檔名主幹和 PicGo 自己的重新命名設定不受影響
- 單張處理失敗只記日誌，按原圖繼續上傳
- gif / svg / heic 不處理
- 透明通道保留
- 設定介面文案跟隨 PicGo 語言：简体中文 / 繁體中文 / English / 한국어 / 日本語

## 開發

```bash
npm install
npm test
```

## 授權

[MIT](https://github.com/Whbbit1999/slim/blob/master/LICENSE) © whbbit1999

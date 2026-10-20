# picgo-plugin-slim

[sharp](https://github.com/lovell/sharp) ベースの PicGo アップロード前画像処理プラグインです。アップロード前に形式変換・リサイズ・品質圧縮を行います。

**他の言語:** [简体中文](https://github.com/Whbbit1999/slim/blob/master/README.md) · [繁體中文](https://github.com/Whbbit1999/slim/blob/master/README.zh-TW.md) · [English](https://github.com/Whbbit1999/slim/blob/master/README.en.md) · [한국어](https://github.com/Whbbit1999/slim/blob/master/README.ko.md) · [日本語](https://github.com/Whbbit1999/slim/blob/master/README.ja.md)

## できること

1. **形式変換** —— 処理する元画像の形式（png / jpg / webp / avif / tiff）を選び、WebP / AVIF / JPEG / PNG / TIFF に変換します
2. **リサイズ** —— 元のサイズでアップロードするか、長辺 / 幅 / 高さを上限に等比縮小します（拡大はしません）
3. **品質制御** —— 1〜100 のエンコード品質

3 つは個別に切り替えられます。形式はそのままでサイズだけ縮小したり、サイズはそのままで圧縮だけ行えます。

## インストール

PicGo のプラグイン設定で `slim` を検索してインストールするか、PicGo の baseDir に手動でインストールします。

インストール後に PicGo を再起動し、プラグイン設定で有効化してください。

## 設定

| 項目 | 説明 |
| --- | --- |
| `convertFrom` | 処理する元の形式。チェックしない形式はそのままアップロードされます |
| `convertTo` | 出力形式。「変換しない」は元の形式を維持します |
| `resizeMode` | `original` / `maxEdge` / `maxWidth` / `maxHeight` |
| `maxSize` | ピクセル上限。0 は無制限 |
| `quality` | 1〜100。png は 100 未満でパレット量子化します |
| `skipIfLarger` | 処理後に大きくなったら元画像を保持（既定でオン） |

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

## 補足

- 元の形式はファイル拡張子ではなく画像の内容から判定します
- 変換先の形式が元と同じでも `quality` で再エンコードします
- 拡張子は常に実際の形式に従います。ファイル名の本体と PicGo 自体のリネーム設定には影響しません
- 個々の画像処理に失敗した場合はログのみ残し、元画像をアップロードします
- gif / svg / heic は処理しません
- アルファチャンネルは保持されます
- 設定画面の文言は PicGo の言語に従います: 简体中文 / 繁體中文 / English / 한국어 / 日本語

## 開発

```bash
npm install
npm test
```

## ライセンス

[MIT](https://github.com/Whbbit1999/slim/blob/master/LICENSE) © whbbit1999

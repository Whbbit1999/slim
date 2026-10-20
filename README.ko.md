# picgo-plugin-slim

[sharp](https://github.com/lovell/sharp) 기반의 PicGo 업로드 전 이미지 처리 플러그인입니다. 업로드 전에 형식 변환, 크기 조정, 품질 압축을 수행합니다.

**다른 언어:** [简体中文](https://github.com/Whbbit1999/slim/blob/master/README.md) · [繁體中文](https://github.com/Whbbit1999/slim/blob/master/README.zh-TW.md) · [English](https://github.com/Whbbit1999/slim/blob/master/README.en.md) · [한국어](https://github.com/Whbbit1999/slim/blob/master/README.ko.md) · [日本語](https://github.com/Whbbit1999/slim/blob/master/README.ja.md)

## 기능

1. **형식 변환** —— 처리할 원본 형식(png / jpg / webp / avif / tiff)을 선택하고 WebP / AVIF / JPEG / PNG / TIFF로 변환합니다
2. **크기 조정** —— 원본 크기로 업로드하거나, 긴 변 / 너비 / 높이 기준으로 비율을 유지하며 축소합니다(확대하지 않음)
3. **품질 제어** —— 1-100 인코딩 품질

세 기능은 각각 따로 켤 수 있습니다. 형식은 그대로 두고 크기만 줄이거나, 크기는 그대로 두고 압축만 할 수 있습니다.

## 설치

PicGo 플러그인 설정에서 `slim`을 검색해 설치하거나, PicGo의 baseDir에 직접 설치합니다.

설치 후 PicGo를 재시작하고 플러그인 설정에서 활성화하세요.

## 설정

| 항목 | 설명 |
| --- | --- |
| `convertFrom` | 처리할 원본 형식. 체크하지 않은 형식은 원본 그대로 업로드됩니다 |
| `convertTo` | 출력 형식. "변환 안 함"은 원본 형식을 유지합니다 |
| `resizeMode` | `original` / `maxEdge` / `maxWidth` / `maxHeight` |
| `maxSize` | 픽셀 제한. 0은 제한 없음 |
| `quality` | 1-100. png는 100 미만일 때 팔레트 양자화를 사용합니다 |
| `skipIfLarger` | 결과가 더 크면 원본을 유지합니다(기본 켜짐) |

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

## 참고

- 원본 형식은 파일 확장자가 아니라 이미지 내용으로 판별합니다
- 대상 형식이 원본과 같아도 `quality`로 다시 인코딩합니다
- 확장자는 항상 실제 형식을 따릅니다. 파일 이름 본문과 PicGo 자체의 이름 변경 설정은 건드리지 않습니다
- 개별 이미지 처리에 실패하면 로그만 남기고 원본을 업로드합니다
- gif / svg / heic는 처리하지 않습니다
- 알파 채널은 유지됩니다
- 설정 화면 문구는 PicGo 언어를 따릅니다: 简体中文 / 繁體中文 / English / 한국어 / 日本語

## 개발

```bash
npm install
npm test
```

## 라이선스

[MIT](https://github.com/Whbbit1999/slim/blob/master/LICENSE) © whbbit1999

// PicGo 内置语言（v1.5+ 内置 zh-CN/zh-TW/en，GUI 1.7+ 内置 ko/ja），注册后在 config() 里用 translate(key) 取文案
const localesZH = {
  PLUGIN_NAME: '图片压缩转换 (slim)',

  CONVERT_FROM_ALIAS: '需要处理的源图格式',
  CONVERT_FROM_MESSAGE: '勾选的格式会进行格式转换/缩放/压缩，未勾选的直接上传原图',

  CONVERT_TO_ALIAS: '转换成格式',
  CONVERT_TO_MESSAGE: '选择输出格式；"不转换"表示保持源格式，仅缩放/压缩',
  CONVERT_TO_KEEP: '不转换（保持原格式）',

  RESIZE_MODE_ALIAS: '尺寸处理',
  RESIZE_MODE_MESSAGE: '按原图尺寸上传，或按下面的像素限制等比缩小',
  RESIZE_ORIGINAL: '原图尺寸（不压缩尺寸）',
  RESIZE_MAX_EDGE: '限制最长边',
  RESIZE_MAX_WIDTH: '限制宽度',
  RESIZE_MAX_HEIGHT: '限制高度',

  MAX_SIZE_ALIAS: '尺寸上限（像素）',
  MAX_SIZE_MESSAGE: '配合上面的尺寸处理使用，0 表示不限制；只缩小不放大',

  QUALITY_ALIAS: '质量 1-100',
  QUALITY_MESSAGE: '有损格式生效（jpeg/webp/avif）；png 低于 100 时使用调色板量化',

  SKIP_IF_LARGER_ALIAS: '变大时保留原图',
  SKIP_IF_LARGER_MESSAGE: '处理后的文件更小时才替换，否则按原图上传'
}

const localesTW = {
  PLUGIN_NAME: '圖片壓縮轉換 (slim)',

  CONVERT_FROM_ALIAS: '需要處理的來源圖格式',
  CONVERT_FROM_MESSAGE: '勾選的格式會進行格式轉換/縮放/壓縮，未勾選的直接上傳原圖',

  CONVERT_TO_ALIAS: '轉換成格式',
  CONVERT_TO_MESSAGE: '選擇輸出格式；「不轉換」表示保持來源格式，僅縮放/壓縮',
  CONVERT_TO_KEEP: '不轉換（保持原格式）',

  RESIZE_MODE_ALIAS: '尺寸處理',
  RESIZE_MODE_MESSAGE: '按原圖尺寸上傳，或按下面的像素限制等比縮小',
  RESIZE_ORIGINAL: '原圖尺寸（不壓縮尺寸）',
  RESIZE_MAX_EDGE: '限制最長邊',
  RESIZE_MAX_WIDTH: '限制寬度',
  RESIZE_MAX_HEIGHT: '限制高度',

  MAX_SIZE_ALIAS: '尺寸上限（像素）',
  MAX_SIZE_MESSAGE: '配合上面的尺寸處理使用，0 表示不限制；只縮小不放大',

  QUALITY_ALIAS: '品質 1-100',
  QUALITY_MESSAGE: '有損格式生效（jpeg/webp/avif）；png 低於 100 時使用調色盤量化',

  SKIP_IF_LARGER_ALIAS: '變大時保留原圖',
  SKIP_IF_LARGER_MESSAGE: '處理後的檔案更小時才替換，否則按原圖上傳'
}

const localesEN = {
  PLUGIN_NAME: 'Image compress & convert (slim)',

  CONVERT_FROM_ALIAS: 'Source formats to process',
  CONVERT_FROM_MESSAGE: 'Checked formats are converted/resized/compressed; others are uploaded as-is',

  CONVERT_TO_ALIAS: 'Convert to',
  CONVERT_TO_MESSAGE: 'Output format; "keep original" only resizes/compresses',
  CONVERT_TO_KEEP: 'Keep original (no conversion)',

  RESIZE_MODE_ALIAS: 'Resize',
  RESIZE_MODE_MESSAGE: 'Upload at original size, or scale down to the pixel limit below',
  RESIZE_ORIGINAL: 'Original size (no resizing)',
  RESIZE_MAX_EDGE: 'Limit longest edge',
  RESIZE_MAX_WIDTH: 'Limit width',
  RESIZE_MAX_HEIGHT: 'Limit height',

  MAX_SIZE_ALIAS: 'Size limit (px)',
  MAX_SIZE_MESSAGE: 'Used with the resize option above; 0 means no limit; never enlarges',

  QUALITY_ALIAS: 'Quality 1-100',
  QUALITY_MESSAGE: 'Applies to lossy formats (jpeg/webp/avif); png below 100 uses palette quantization',

  SKIP_IF_LARGER_ALIAS: 'Keep original if larger',
  SKIP_IF_LARGER_MESSAGE: 'Replace only when the result is smaller, otherwise upload the original'
}

const localesKO = {
  PLUGIN_NAME: '이미지 압축 및 변환 (slim)',

  CONVERT_FROM_ALIAS: '처리할 원본 이미지 형식',
  CONVERT_FROM_MESSAGE: '체크한 형식은 변환/크기 조정/압축을 수행하고, 체크하지 않은 형식은 원본 그대로 업로드합니다',

  CONVERT_TO_ALIAS: '변환할 형식',
  CONVERT_TO_MESSAGE: '출력 형식을 선택합니다. "변환 안 함"은 원본 형식을 유지하고 크기 조정/압축만 합니다',
  CONVERT_TO_KEEP: '변환 안 함 (원본 형식 유지)',

  RESIZE_MODE_ALIAS: '크기 처리',
  RESIZE_MODE_MESSAGE: '원본 크기로 업로드하거나 아래 픽셀 제한까지 비율을 유지하며 축소합니다',
  RESIZE_ORIGINAL: '원본 크기 (축소 안 함)',
  RESIZE_MAX_EDGE: '긴 변 제한',
  RESIZE_MAX_WIDTH: '너비 제한',
  RESIZE_MAX_HEIGHT: '높이 제한',

  MAX_SIZE_ALIAS: '크기 제한 (px)',
  MAX_SIZE_MESSAGE: '위의 크기 처리와 함께 사용합니다. 0은 제한 없음이며 축소만 하고 확대하지 않습니다',

  QUALITY_ALIAS: '품질 1-100',
  QUALITY_MESSAGE: '손실 형식(jpeg/webp/avif)에 적용됩니다. png는 100 미만일 때 팔레트 양자화를 사용합니다',

  SKIP_IF_LARGER_ALIAS: '커지면 원본 유지',
  SKIP_IF_LARGER_MESSAGE: '처리 결과가 더 작을 때만 교체하고, 그렇지 않으면 원본을 업로드합니다'
}

const localesJA = {
  PLUGIN_NAME: '画像の圧縮・変換 (slim)',

  CONVERT_FROM_ALIAS: '処理する元画像の形式',
  CONVERT_FROM_MESSAGE: 'チェックした形式は変換/リサイズ/圧縮します。チェックしない形式はそのままアップロードします',

  CONVERT_TO_ALIAS: '変換後の形式',
  CONVERT_TO_MESSAGE: '出力形式を選択します。「変換しない」は元の形式のままリサイズ/圧縮のみ行います',
  CONVERT_TO_KEEP: '変換しない（元の形式のまま）',

  RESIZE_MODE_ALIAS: 'サイズ処理',
  RESIZE_MODE_MESSAGE: '元のサイズでアップロードするか、下のピクセル上限まで等比縮小します',
  RESIZE_ORIGINAL: '元のサイズ（縮小しない）',
  RESIZE_MAX_EDGE: '長辺を制限',
  RESIZE_MAX_WIDTH: '幅を制限',
  RESIZE_MAX_HEIGHT: '高さを制限',

  MAX_SIZE_ALIAS: 'サイズ上限（px）',
  MAX_SIZE_MESSAGE: '上のサイズ処理と併用します。0 は無制限。縮小のみで拡大はしません',

  QUALITY_ALIAS: '品質 1-100',
  QUALITY_MESSAGE: '非可逆形式（jpeg/webp/avif）で有効。png は 100 未満でパレット量子化します',

  SKIP_IF_LARGER_ALIAS: '大きくなったら元画像を保持',
  SKIP_IF_LARGER_MESSAGE: '処理後に小さくなった場合のみ置き換え、それ以外は元画像をアップロードします'
}

// config() 在 register 之后调用，此时 ctx.i18n 可用；单测直接调 config() 时回落中文
const translate = (ctx, key) => {
  if (ctx && ctx.i18n) return ctx.i18n.translate(key)
  return localesZH[key] || key
}

module.exports = {
  localesZH,
  localesTW,
  localesEN,
  localesKO,
  localesJA,
  translate
}

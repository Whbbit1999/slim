const sharp = require('sharp')

const PLUGIN_ID = 'picgo-plugin-slim'

const DEFAULT_CONFIG = {
  convertFrom: ['png', 'jpg', 'webp'],
  convertTo: 'webp',
  resizeMode: 'original',
  maxSize: 1920,
  quality: 80,
  skipIfLarger: true
}

const FORMAT_CHOICES = ['png', 'jpg', 'webp', 'avif', 'tiff']
const CONVERT_TO_CHOICES = ['', 'webp', 'avif', 'jpg', 'png', 'tiff']

const RESIZE_MODES = [
  { name: '原图尺寸（不压缩尺寸）', value: 'original' },
  { name: '限制最长边', value: 'maxEdge' },
  { name: '限制宽度', value: 'maxWidth' },
  { name: '限制高度', value: 'maxHeight' }
]

// sharp 的编码器：source 与 target 相同时也走这里，用 quality 重新压缩
const ENCODERS = {
  jpeg: (img, q) => img.jpeg({ quality: q, mozjpeg: true }),
  png: (img, q) => img.png({ compressionLevel: 9, palette: q < 100, quality: q }),
  webp: (img, q) => img.webp({ quality: q }),
  avif: (img, q) => img.avif({ quality: q }),
  tiff: (img) => img.tiff()
}

const EXT_BY_FORMAT = { jpeg: 'jpg', png: 'png', webp: 'webp', avif: 'avif', tiff: 'tiff' }
const MIME_BY_FORMAT = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  tiff: 'image/tiff'
}

// 配置里用 jpg 给用户看，sharp 里叫 jpeg
const toSharpFormat = (format) => (format === 'jpg' ? 'jpeg' : format)
const toConfigFormat = (format) => (format === 'jpeg' ? 'jpg' : format)

const clamp = (value, min, max, fallback) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return fallback
  return Math.min(max, Math.max(min, Math.round(num)))
}

function resolveConfig (ctx) {
  const raw = (ctx.getConfig && ctx.getConfig(PLUGIN_ID)) || {}
  const convertFrom = Array.isArray(raw.convertFrom) && raw.convertFrom.length > 0
    ? raw.convertFrom.map((f) => toSharpFormat(String(f).toLowerCase()))
    : DEFAULT_CONFIG.convertFrom.map(toSharpFormat)
  const convertTo = raw.convertTo === undefined || raw.convertTo === null
    ? DEFAULT_CONFIG.convertTo
    : String(raw.convertTo).toLowerCase()
  const resizeMode = RESIZE_MODES.some((m) => m.value === raw.resizeMode)
    ? raw.resizeMode
    : DEFAULT_CONFIG.resizeMode

  return {
    convertFrom,
    convertTo: convertTo === '' ? '' : toSharpFormat(convertTo),
    resizeMode,
    maxSize: clamp(raw.maxSize, 0, 100000, DEFAULT_CONFIG.maxSize),
    quality: clamp(raw.quality, 1, 100, DEFAULT_CONFIG.quality),
    skipIfLarger: raw.skipIfLarger === undefined ? DEFAULT_CONFIG.skipIfLarger : Boolean(raw.skipIfLarger)
  }
}

function buildResize (config, width, height) {
  if (config.resizeMode === 'original' || !config.maxSize || !width || !height) return null
  if (config.resizeMode === 'maxWidth') return { width: config.maxSize, withoutEnlargement: true }
  if (config.resizeMode === 'maxHeight') return { height: config.maxSize, withoutEnlargement: true }
  // 最长边：fit inside 同时限制宽高，等比缩小到不超过 maxSize
  return { width: config.maxSize, height: config.maxSize, fit: 'inside', withoutEnlargement: true }
}

function replaceExt (fileName, ext) {
  if (!fileName) return fileName
  return `${fileName.replace(/\.[^./\\]+$/, '')}.${ext}`
}

async function processItem (item, config, log) {
  if (!item.buffer) return
  const before = item.buffer.length
  const meta = await sharp(item.buffer, { failOn: 'none' }).metadata()
  const sourceFormat = meta.format
  if (!sourceFormat || !ENCODERS[sourceFormat]) return
  if (!config.convertFrom.includes(sourceFormat)) {
    log.info(`[slim] ${item.fileName || ''} 源格式 ${toConfigFormat(sourceFormat)} 不在处理列表，跳过`)
    return
  }

  const requestedTarget = config.convertTo || sourceFormat
  // 非法目标格式（手改配置文件时）直接保持原格式
  const targetFormat = ENCODERS[requestedTarget] ? requestedTarget : sourceFormat
  const resize = buildResize(config, meta.width, meta.height)
  if (!resize && targetFormat === sourceFormat && config.quality >= 100) {
    log.info(`[slim] ${item.fileName || ''} 无需转换/缩放/压缩，跳过`)
    return
  }

  let img = sharp(item.buffer, { failOn: 'none' })
  if (resize) img = img.resize(resize)
  const { data, info } = await ENCODERS[targetFormat](img, config.quality).toBuffer({ resolveWithObject: true })

  if (config.skipIfLarger && data.length >= before) {
    log.info(`[slim] ${item.fileName || ''} 处理后 ${before} -> ${data.length} 字节，未变小，保留原图`)
    return
  }

  item.buffer = data
  item.size = info.size
  item.width = info.width
  item.height = info.height
  const ext = EXT_BY_FORMAT[targetFormat]
  if (item.extname !== `.${ext}`) {
    // 扩展名必须跟随真实格式，否则 .png 里装 webp 内容会被 CDN/客户端按 png 处理；
    // 文件名只换扩展名，主干保持原样，PicGo 的 renameFn 之后仍可改名
    item.extname = `.${ext}`
    item.mimeType = MIME_BY_FORMAT[targetFormat]
    item.fileName = replaceExt(item.fileName, ext)
  }
  log.info(
    `[slim] ${item.fileName || ''} ${toConfigFormat(sourceFormat)} -> ${toConfigFormat(targetFormat)}` +
    ` ${meta.width}x${meta.height} -> ${info.width}x${info.height}` +
    ` ${before} -> ${data.length} 字节 (-${(100 - (data.length / before) * 100).toFixed(1)}%)`
  )
}

async function handle (ctx) {
  const log = ctx.log || console
  const config = resolveConfig(ctx)
  for (const item of ctx.output || []) {
    try {
      await processItem(item, config, log)
    } catch (err) {
      // 处理失败不阻断上传，按原图继续
      log.error(`[slim] ${item.fileName || ''} 处理失败，按原图上传: ${err.message}`)
    }
  }
}

function config (ctx) {
  const current = resolveConfig(ctx)
  return [
    {
      name: 'convertFrom',
      type: 'checkbox',
      alias: '需要处理的源图格式',
      message: '勾选的格式会进行格式转换/缩放/压缩，未勾选的直接上传原图',
      choices: FORMAT_CHOICES.map((value) => ({ name: value, value })),
      default: current.convertFrom.map(toConfigFormat),
      required: false
    },
    {
      name: 'convertTo',
      type: 'list',
      alias: '转换成格式',
      message: '选择输出格式；"不转换"表示保持源格式，仅缩放/压缩',
      choices: CONVERT_TO_CHOICES.map((value) => ({
        name: value === '' ? '不转换（保持原格式）' : value,
        value
      })),
      default: current.convertTo === '' ? '' : toConfigFormat(current.convertTo),
      required: false
    },
    {
      name: 'resizeMode',
      type: 'list',
      alias: '尺寸处理',
      message: '按原图尺寸上传，或按下面的像素限制等比缩小',
      choices: RESIZE_MODES,
      default: current.resizeMode,
      required: false
    },
    {
      name: 'maxSize',
      type: 'input',
      alias: '尺寸上限（像素）',
      message: '配合上面的尺寸处理使用，0 表示不限制；只缩小不放大',
      default: current.maxSize,
      required: false
    },
    {
      name: 'quality',
      type: 'input',
      alias: '质量 1-100',
      message: '有损格式生效（jpeg/webp/avif）；png 低于 100 时使用调色板量化',
      default: current.quality,
      required: false
    },
    {
      name: 'skipIfLarger',
      type: 'confirm',
      alias: '变大时保留原图',
      message: '处理后的文件更小时才替换，否则按原图上传',
      default: current.skipIfLarger,
      required: false
    }
  ]
}

module.exports = (ctx) => {
  const register = () => {
    ctx.helper.beforeUploadPlugins.register('slim', {
      handle,
      config,
      name: '图片压缩转换 (slim)'
    })
  }
  return { register, config }
}

module.exports.PLUGIN_ID = PLUGIN_ID
module.exports.resolveConfig = resolveConfig
module.exports.handle = handle
module.exports.buildResize = buildResize

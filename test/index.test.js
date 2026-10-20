const test = require('node:test')
const assert = require('node:assert')
const sharp = require('sharp')
const plugin = require('../src/index')

const makeCtx = (config, settings = {}) => {
  const logs = []
  return {
    logs,
    getConfig: (key) => {
      if (key === 'picgo-plugin-slim') return config
      return key.startsWith('settings.') ? settings[key.slice('settings.'.length)] : undefined
    },
    log: {
      info: (msg) => logs.push(msg),
      error: (msg) => logs.push(msg)
    },
    output: []
  }
}

// 生成一张有噪点的 PNG，保证重新压缩后有可见的体积差异
const makePng = (width, height) => {
  const channels = 3
  const buf = Buffer.alloc(width * height * channels)
  for (let i = 0; i < buf.length; i++) buf[i] = (i * 37) % 256
  return sharp(buf, { raw: { width, height, channels } }).png({ compressionLevel: 0 }).toBuffer()
}

test('convertTo webp 时修改 buffer/扩展名/尺寸', async () => {
  const ctx = makeCtx({ convertFrom: ['png'], convertTo: 'webp', resizeMode: 'original', quality: 80 })
  ctx.output = [{ buffer: await makePng(64, 48), fileName: 'a.png', extname: '.png', size: 0 }]

  await plugin.handle(ctx)

  const item = ctx.output[0]
  assert.strictEqual(item.extname, '.webp')
  assert.strictEqual(item.fileName, 'a.webp')
  assert.strictEqual(item.mimeType, 'image/webp')
  assert.strictEqual(item.width, 64)
  assert.strictEqual(item.height, 48)
  assert.strictEqual((await sharp(item.buffer).metadata()).format, 'webp')
})

test('按最长边缩小，且不放大', async () => {
  const ctx = makeCtx({ convertFrom: ['png'], convertTo: '', resizeMode: 'maxEdge', maxSize: 32, quality: 90 })
  ctx.output = [
    { buffer: await makePng(64, 48), fileName: 'big.png', extname: '.png' },
    { buffer: await makePng(20, 10), fileName: 'small.png', extname: '.png' }
  ]

  await plugin.handle(ctx)

  assert.deepStrictEqual([ctx.output[0].width, ctx.output[0].height], [32, 24])
  assert.deepStrictEqual([ctx.output[1].width, ctx.output[1].height], [20, 10])
})

test('未开启 PicGo 重命名时保留名称主干，但扩展名必须是真实格式', async () => {
  // 不能出现 .png 里装 webp 内容，否则 CDN 会按 png 发 Content-Type
  for (const settings of [{}, { rename: false, autoRename: false }]) {
    const ctx = makeCtx({ convertFrom: ['png'], convertTo: 'webp', quality: 80 }, settings)
    ctx.output = [{ buffer: await makePng(32, 32), fileName: 'my-photo.png', extname: '.png' }]

    await plugin.handle(ctx)

    const item = ctx.output[0]
    assert.strictEqual(item.fileName, 'my-photo.webp')
    assert.strictEqual(item.extname, '.webp')
    assert.strictEqual(item.mimeType, 'image/webp')
    assert.strictEqual((await sharp(item.buffer).metadata()).format, 'webp')
  }
})

test('源格式不在处理列表时原样返回', async () => {
  const ctx = makeCtx({ convertFrom: ['jpg'], convertTo: 'webp' })
  const original = await makePng(16, 16)
  ctx.output = [{ buffer: original, fileName: 'a.png', extname: '.png' }]

  await plugin.handle(ctx)

  assert.strictEqual(ctx.output[0].buffer, original)
  assert.strictEqual(ctx.output[0].extname, '.png')
})

test('处理后更大时保留原图（skipIfLarger）', async () => {
  const ctx = makeCtx({ convertFrom: ['png'], convertTo: 'tiff', skipIfLarger: true })
  const original = await makePng(16, 16)
  ctx.output = [{ buffer: original, fileName: 'a.png', extname: '.png' }]

  await plugin.handle(ctx)

  assert.strictEqual(ctx.output[0].buffer, original)
  assert.strictEqual(ctx.output[0].extname, '.png')
})

test('处理失败不抛出，按原图上传', async () => {
  const ctx = makeCtx({ convertFrom: ['png'], convertTo: 'webp' })
  const broken = Buffer.from('not an image')
  ctx.output = [{ buffer: broken, fileName: 'a.png', extname: '.png' }]

  await plugin.handle(ctx)

  assert.strictEqual(ctx.output[0].buffer, broken)
  assert.ok(ctx.logs.some((msg) => msg.includes('处理失败')))
})

test('非法配置回落到默认值', () => {
  const config = plugin.resolveConfig(makeCtx({ convertFrom: [], convertTo: 'bmp', resizeMode: 'nope', quality: 999, maxSize: -5 }))
  assert.deepStrictEqual(config.convertFrom, ['png', 'jpeg', 'webp'])
  assert.strictEqual(config.convertTo, 'bmp')
  assert.strictEqual(config.resizeMode, 'original')
  assert.strictEqual(config.quality, 100)
  assert.strictEqual(config.maxSize, 0)
})

test('config schema 的默认值都在 choices 里（GUI 下拉才能正确回显）', () => {
  const ctx = makeCtx({ convertFrom: ['jpg'], convertTo: 'jpg', resizeMode: 'maxEdge', maxSize: 800, quality: 60 })
  for (const field of plugin(ctx).config(ctx)) {
    if (field.type === 'list' || field.type === 'checkbox') {
      const values = field.choices.map((c) => (typeof c === 'string' ? c : c.value))
      const defaults = Array.isArray(field.default) ? field.default : [field.default]
      for (const d of defaults) assert.ok(values.includes(d), `${field.name} 的默认值 ${d} 不在 choices 中`)
    }
  }
})

test('config 文案随 ctx.i18n 切换语言', () => {
  const store = { 'zh-CN': {}, 'zh-TW': {}, en: {}, ko: {}, ja: {} }
  const ctx = makeCtx({})
  ctx.i18n = {
    addLocale: (lang, pack) => { store[lang] = { ...store[lang], ...pack } },
    translate: (key) => store[ctx.lang][key] || key
  }
  ctx.helper = { beforeUploadPlugins: { register: () => {} } }
  ctx.lang = 'zh-CN'
  const p = plugin(ctx)
  p.register()

  assert.strictEqual(p.config(ctx).find((f) => f.name === 'quality').alias, '质量 1-100')
  ctx.lang = 'en'
  assert.strictEqual(p.config(ctx).find((f) => f.name === 'quality').alias, 'Quality 1-100')
  assert.deepStrictEqual(
    p.config(ctx).find((f) => f.name === 'resizeMode').choices.map((c) => c.name),
    ['Original size (no resizing)', 'Limit longest edge', 'Limit width', 'Limit height']
  )
  ctx.lang = 'ko'
  assert.strictEqual(p.config(ctx).find((f) => f.name === 'quality').alias, '품질 1-100')
  ctx.lang = 'ja'
  assert.strictEqual(p.config(ctx).find((f) => f.name === 'quality').alias, '品質 1-100')
  assert.strictEqual(p.config(ctx).find((f) => f.name === 'convertTo').choices[0].name, '変換しない（元の形式のまま）')
})

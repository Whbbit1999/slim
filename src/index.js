const {
  PLUGIN_ID,
  FORMAT_CHOICES,
  CONVERT_TO_CHOICES,
  RESIZE_MODES
} = require('./config')
const { localesZH, localesTW, localesEN, localesKO, localesJA, translate } = require('./i18n')
const { resolveConfig, buildResize, handle, toConfigFormat } = require('./transform')

const config = (ctx) => {
  const t = (key) => translate(ctx, key)
  const current = resolveConfig(ctx)
  return [
    {
      name: 'convertFrom',
      type: 'checkbox',
      alias: t('CONVERT_FROM_ALIAS'),
      message: t('CONVERT_FROM_MESSAGE'),
      choices: FORMAT_CHOICES.map((value) => ({ name: value, value })),
      default: current.convertFrom.map(toConfigFormat),
      required: false
    },
    {
      name: 'convertTo',
      type: 'list',
      alias: t('CONVERT_TO_ALIAS'),
      message: t('CONVERT_TO_MESSAGE'),
      choices: CONVERT_TO_CHOICES.map((value) => ({
        name: value === '' ? t('CONVERT_TO_KEEP') : value,
        value
      })),
      default: current.convertTo === '' ? '' : toConfigFormat(current.convertTo),
      required: false
    },
    {
      name: 'resizeMode',
      type: 'list',
      alias: t('RESIZE_MODE_ALIAS'),
      message: t('RESIZE_MODE_MESSAGE'),
      choices: RESIZE_MODES.map(({ name, value }) => ({ name: t(name), value })),
      default: current.resizeMode,
      required: false
    },
    {
      name: 'maxSize',
      type: 'input',
      alias: t('MAX_SIZE_ALIAS'),
      message: t('MAX_SIZE_MESSAGE'),
      default: current.maxSize,
      required: false
    },
    {
      name: 'quality',
      type: 'input',
      alias: t('QUALITY_ALIAS'),
      message: t('QUALITY_MESSAGE'),
      default: current.quality,
      required: false
    },
    {
      name: 'skipIfLarger',
      type: 'confirm',
      alias: t('SKIP_IF_LARGER_ALIAS'),
      message: t('SKIP_IF_LARGER_MESSAGE'),
      default: current.skipIfLarger,
      required: false
    }
  ]
}

module.exports = (ctx) => {
  const register = () => {
    // 添加语言包（旧版 PicGo 没有 i18n，跳过；缺 ko/ja 的语言包时 addLocale 返回 false，不影响其他语言）
    if (ctx.i18n) {
      ctx.i18n.addLocale('zh-CN', localesZH)
      ctx.i18n.addLocale('zh-TW', localesTW)
      ctx.i18n.addLocale('en', localesEN)
      ctx.i18n.addLocale('ko', localesKO)
      ctx.i18n.addLocale('ja', localesJA)
    }

    ctx.helper.beforeUploadPlugins.register('slim', {
      handle,
      config,
      name: translate(ctx, 'PLUGIN_NAME')
    })
  }
  return { register, config }
}

module.exports.PLUGIN_ID = PLUGIN_ID
module.exports.resolveConfig = resolveConfig
module.exports.handle = handle
module.exports.buildResize = buildResize

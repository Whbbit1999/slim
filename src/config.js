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

// name 是 i18n key，界面上再用 translate 翻出来
const RESIZE_MODES = [
  { name: 'RESIZE_ORIGINAL', value: 'original' },
  { name: 'RESIZE_MAX_EDGE', value: 'maxEdge' },
  { name: 'RESIZE_MAX_WIDTH', value: 'maxWidth' },
  { name: 'RESIZE_MAX_HEIGHT', value: 'maxHeight' }
]

module.exports = {
  PLUGIN_ID,
  DEFAULT_CONFIG,
  FORMAT_CHOICES,
  CONVERT_TO_CHOICES,
  RESIZE_MODES
}

const pkg = require('../package.json')

hexo.extend.filter.register('before_generate', () => {
    const{ version, log } = hexo

    if (version.replace(/(^.*\..*)\..*/, '$1') < 5.3) {
        log.error('Hexo v5.3.0+ is required.')
        process.exit(1)
    }
})

hexo.extend.injector.register('head_end', () => {
  const { version } = require('../package.json');
  return `<script>window.THEME_VERSION = '${version}';</script>`;
});
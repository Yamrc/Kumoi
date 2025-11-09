let iframe = null
let cfg = null

function updateTheme() {
	if (!iframe || !cfg) return
	const theme = document.documentElement.getAttribute('data-theme') || 'light'
	iframe.contentWindow?.postMessage({
		giscus: { setConfig: { theme: theme === 'dark' ? 'noborder_dark' : 'noborder_light' } }
	}, 'https://giscus.app')
}

export function mountGiscus(config) {
	if (!config?.repo || document.querySelector('.giscus')) return
	cfg = config

	const el = document.getElementById('comments')
	if (!el) return

	const s = document.createElement('script')
	s.src = 'https://giscus.app/client.js'
	s.crossOrigin = 'anonymous'
	s.async = true
	const theme = document.documentElement.getAttribute('data-theme') || 'light'
	s.setAttribute('data-repo', config.repo)
	s.setAttribute('data-repo-id', config.repo_id)
	s.setAttribute('data-category', config.category)
	s.setAttribute('data-category-id', config.category_id)
	s.setAttribute('data-reactions-enabled', config.reactions_enabled ? '1' : '0')
	s.setAttribute('data-mapping', config.mapping || 'pathname')
	s.setAttribute('data-theme', theme === 'dark' ? 'noborder_dark' : 'noborder_light')
	s.setAttribute('data-lang', config.language || 'en')
	s.setAttribute('data-input-position', 'top')
	s.setAttribute('data-loading', 'lazy')
	el.appendChild(s)

	const originalThemeChange = window.onThemeChange
	window.onThemeChange = (mode) => {
		originalThemeChange?.(mode)
		updateTheme()
	}

	new MutationObserver(updateTheme).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme']
	})

	const waitFor = (cond, fn, max = 50, delay = 100) => {
		let n = 0
		const loop = () => {
			if (cond()) return fn()
			if (++n >= max) return
			setTimeout(loop, delay)
		}
		loop()
	}

	const run = () => {
		waitFor(() => !!document.querySelector('iframe.giscus-frame'), () => {
			iframe = document.querySelector('iframe.giscus-frame')
		})
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run, { once: true })
		window.addEventListener('load', run, { once: true })
	} else run()
}

export function unmountGiscus() {
	const el = document.getElementById('comments')
	el?.querySelectorAll('script[src*="giscus"], iframe').forEach(n => n.remove())
	iframe = null
	cfg = null
}

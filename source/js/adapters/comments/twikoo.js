export function mountTwikoo(cfg) {
	if (!cfg || !cfg.env_id) { console.warn('[Twikoo] Missing env_id'); return }
	const el = document.getElementById('comments')
	if (!el) return

	const init = () => {
		try {
			if (window.twikoo && window.twikoo.init) {
				window.twikoo.init({ envId: cfg.env_id, el: '#comments', lang: 'zh-CN' })
				console.debug('[Twikoo] Initialized')
			}
		} catch (e) { console.error('[Twikoo] Init error', e) }
	}

	const waitFor = (fn, max = 50, delay = 100) => {
		let n = 0
		const loop = () => {
			if (window.twikoo && window.twikoo.init) return fn()
			if (++n >= max) return console.error('[Twikoo] Script timeout')
			setTimeout(loop, delay)
		}
		loop()
	}

	const run = () => waitFor(init)
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run, { once: true })
		window.addEventListener('load', run, { once: true })
	} else run()
}

export function unmountTwikoo() {
	const el = document.getElementById('comments')
	if (el) el.innerHTML = ''
}

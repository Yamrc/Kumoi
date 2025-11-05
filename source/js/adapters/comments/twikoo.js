export function mountTwikoo(cfg) {
    if (!cfg || !cfg.env_id) { console.warn('[Twikoo] Missing env_id'); return }
    const initComments = () => {
        const el = document.getElementById('comments')
        if (!el) return
        try {
            if (window.twikoo && window.twikoo.init) {
                window.twikoo.init({ envId: cfg.env_id, el: '#comments', lang: 'zh-CN' })
                console.debug('[Twikoo] Initialized')
            }
        } catch (e) { console.error('[Twikoo] Init error', e) }
    }
    const initCount = () => {
        const anchors = Array.from(document.querySelectorAll('a.twikoo-count'))
        if (!anchors.length) return
        const pathOf = a => a.dataset.path || (() => { try { return new URL(a.getAttribute('href'), location.origin).pathname } catch { return '' } })()
        const urls = anchors.map(pathOf)
        const update = (list) => {
            list.forEach(item => {
                const target = anchors.find(a => pathOf(a) === item.url)
                if (target) target.textContent = String(item.count || 0)
            })
            console.debug('[Twikoo] Count updated', urls.length)
        }
        try {
            if (window.twikoo && window.twikoo.getCommentsCount) {
                window.twikoo.getCommentsCount({ envId: cfg.env_id, urls, includeReply: true }).then(update).catch(e => console.error('[Twikoo] Count error', e))
            }
        } catch (e) { console.error('[Twikoo] Count init error', e) }
    }
    const waitFor = (cond, fn, max = 50, delay = 100) => {
        let n = 0
        const loop = () => {
            if (cond()) return fn()
            if (++n >= max) return console.error('[Twikoo] Script timeout')
            setTimeout(loop, delay)
        }
        loop()
    }
    const run = () => {
        waitFor(() => !!(window.twikoo && (window.twikoo.init || window.twikoo.getCommentsCount)), () => {
            initComments(); initCount()
        })
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true })
        window.addEventListener('load', run, { once: true })
    } else run()
}

export function unmountTwikoo() {
	const el = document.getElementById('comments')
	if (el) el.innerHTML = ''
}

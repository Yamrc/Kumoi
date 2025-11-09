export function mountGiscus(cfg) {
	if (!cfg || !cfg.repo || document.querySelector('.giscus')) return
	const s = document.createElement('script')
	s.src = 'https://giscus.app/client.js'

	s.setAttribute('data-repo', cfg.repo)
	s.setAttribute('data-repo-id', cfg.repo_id)
	s.setAttribute('data-category', cfg.category)
	s.setAttribute('data-category-id', cfg.category_id)

	s.setAttribute('data-reactions-enabled', cfg.reactions_enabled ? '1' : '0' || '1')
	s.setAttribute('data-mapping', cfg.mapping || 'pathname')
	s.setAttribute('data-theme', 'noborder_light')
	s.setAttribute('data-lang', cfg.language || 'en')
	s.setAttribute('data-input-position', 'top')
	s.setAttribute('data-loading', 'lazy')
	s.crossOrigin = 'anonymous'
	s.async = true
	const el = document.getElementById('comments') || document.body
	el.appendChild(s)
}

export function unmountGiscus() {
	const el = document.getElementById('comments')
	if (!el) return
	el.querySelectorAll('script[src*="giscus"], iframe').forEach(n => n.remove())
}

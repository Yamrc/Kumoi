export function mountGiscus(cfg) {
	if (!cfg || !cfg.repo || document.querySelector('giscus-widget')) return
	const s = document.createElement('script')
	s.src = 'https://giscus.app/client.js'
	s.setAttribute('data-repo', cfg.repo)
	if (cfg.repo_id) s.setAttribute('data-repo-id', cfg.repo_id)
	if (cfg.category) s.setAttribute('data-category', cfg.category)
	if (cfg.category_id) s.setAttribute('data-category-id', cfg.category_id)
	s.setAttribute('data-mapping', cfg.mapping || 'pathname')
	s.setAttribute('data-theme', cfg.theme || 'auto')
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

// TODO
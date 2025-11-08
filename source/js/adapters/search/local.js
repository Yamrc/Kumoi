export function initLocalSearch(opts = {}) {
	const { input: selInput = '#local-search-input', results: selBox = '#local-search-results', stats: selStats = '#local-search-stats', i18n = {} } = opts
	const input = document.querySelector(selInput)
	const box = document.querySelector(selBox)
	const stats = document.querySelector(selStats)
	if (!input || !box) return

	let index = null
	let loading = false

	async function ensureIndex() {
		if (index || loading) return index
		loading = true
		try {
			const resp = await fetch('/search.json', { cache: 'no-store' })
			if (resp.ok) index = await resp.json()
			loading = false
		} catch { console.error('[Search] Failed to fetch search.json, hexo-generator-searchdb is required.') }
		return index || []
	}

	function getContentSnippet(content, keyword) {
		if (!content || !keyword) return ''
		const idx = content.toLowerCase().indexOf(keyword.toLowerCase())
		if (idx === -1) return content.substring(0, 150)
		return content.substring(Math.max(0, idx - 50), Math.min(content.length, idx + keyword.length + 100))
	}

	function highlight(text, keyword) {
		if (!keyword || !text) return escapeHtml(text || '')
		return escapeHtml(text).replace(new RegExp(`(${escapeRegex(keyword)})`, 'gi'), '<mark class="search-keyword">$1</mark>')
	}

	function escapeRegex(s) {
		return (s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	}

	function render(items) {
		const q = input.value.trim()
		if (!items.length) {
			box.innerHTML = ''
			if (stats) stats.textContent = ''
			return
		}
		box.innerHTML = items.slice(0, 20).map(i => {
			const title = highlight(i.title, q)
			const snippet = getContentSnippet(i.content, q)
			const content = snippet ? highlight(snippet, q) : ''
			return `<div class="item"><a href="${i.url}"><span class="search-result-title">${title}</span>${content ? `<span class="search-result-content">${content}...</span>` : ''}</a></div>`
		}).join('')
		if (stats && i18n.stats) {
			stats.textContent = i18n.stats.replace('${count}', items.length)
		}
	}

	input.addEventListener('input', async () => {
		const q = input.value.trim().toLowerCase()
		if (!q) { render([]); return }
		const data = await ensureIndex()
		const res = (data || []).filter(i => (i.title || '').toLowerCase().includes(q) || (i.content || '').toLowerCase().includes(q))
		render(res)
	})
}

function escapeHtml(s) {
	return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]))
}

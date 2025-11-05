export function initLocalSearch(opts = {}) {
	const selInput = opts.input || '#local-search-input'
	const selBox = opts.results || '#local-search-results'
	const input = document.querySelector(selInput)
	const box = document.querySelector(selBox)
	if (!input || !box) return

	let index = null
	let loading = false

	async function ensureIndex() {
		if (index || loading) return index
		loading = true
		try {
			const resp = await fetch('/search.json', { cache: 'no-store' })
			if (resp.ok) index = await resp.json()
		} catch { console.error('[Search] Fetch failed') }
		if (!index) {
			try {
				const resp = await fetch('/search.xml', { cache: 'no-store' })
				if (resp.ok) {
					const text = await resp.text()
					const parser = new DOMParser()
					const xml = parser.parseFromString(text, 'application/xml')
					index = Array.from(xml.querySelectorAll('entry')).map(e => ({
						title: e.querySelector('title')?.textContent || '',
						content: e.querySelector('content')?.textContent || '',
						url: e.querySelector('url')?.textContent || ''
					}))
				}
			} catch { console.error('[Search] Fetch failed') }
		}
		loading = false
		return index || []
	}

	function render(items) {
		if (!items.length) { box.innerHTML = ''; box.style.display = 'none'; return }
		box.style.display = 'block'
		box.innerHTML = items.slice(0, 20).map(i => `\n<div class="item"><a href="${i.url}">${escapeHtml(i.title)}</a></div>`).join('')
	}

	input.addEventListener('input', async () => {
		const q = input.value.trim().toLowerCase()
		if (!q) { render([]); return }
		const data = await ensureIndex()
		const res = (data || []).filter(i =>
			(i.title || '').toLowerCase().includes(q) || (i.content || '').toLowerCase().includes(q)
		)
		render(res)
	})
}

function escapeHtml(s) {
	return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]))
}

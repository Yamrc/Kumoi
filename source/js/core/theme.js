let listeners = []
let current = null

function dispatch(mode) {
	current = mode
	try {
		window.dispatchEvent(new CustomEvent('themechange', { detail: { mode } }))
	} catch (_) {}
	listeners.forEach(fn => { try { fn(mode) } catch (_) {} })
}

function readPreferred() {
	const m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
	return m && m.matches ? 'dark' : 'light'
}

export const Theme = {
	init() {
		const saved = localStorage.getItem('theme')
		const initial = (saved === 'dark' || saved === 'light') ? saved : readPreferred()
		document.documentElement.setAttribute('data-theme', initial)
		current = initial
		if (window.matchMedia) {
			const mq = window.matchMedia('(prefers-color-scheme: dark)')
			if (mq && mq.addEventListener) {
				mq.addEventListener('change', () => {
					if (!localStorage.getItem('theme')) {
						this.set(readPreferred())
					}
				})
			}
		}
	},
	set(mode) {
		if (mode !== 'dark' && mode !== 'light') return
		if (current === mode) return
		document.documentElement.setAttribute('data-theme', mode)
		localStorage.setItem('theme', mode)
		dispatch(mode)
	},
	toggle() {
		this.set(current === 'dark' ? 'light' : 'dark')
	},
	get() {
		return current || (document.documentElement.getAttribute('data-theme') || 'light')
	},
	onChange(fn) {
		if (typeof fn === 'function') listeners.push(fn)
		return () => { listeners = listeners.filter(f => f !== fn) }
	}
}



function animateIn(el, animation) {
	el.style.display = 'block'
	el.style.animation = animation
}

function animateOut(el, animation) {
	el.addEventListener('animationend', () => {
		el.style.display = ''
		el.style.animation = ''
	}, { once: true })
	el.style.animation = animation
}

export function initSearchModal({ onOpen } = {}) {
	const modal = document.getElementById('search-modal')
	const backdrop = modal?.querySelector('.search-backdrop')
	const dialog = modal?.querySelector('.search-dialog')
	const openBtn = document.getElementById('open-search')
	const closeBtn = document.getElementById('close-search')
	if (!modal || !backdrop || !dialog || !openBtn || !closeBtn) return

	let closing = false

	const show = () => {
		if (closing) return
		modal.classList.remove('hidden')
		document.body.style.overflow = 'hidden'
		animateIn(backdrop, 'to_show .2s')
		animateIn(dialog, 'titleScale .2s')
		onOpen?.()
		setTimeout(() => modal.querySelector('input')?.focus(), 300)
	}
	const hide = () => {
		if (closing) return
		closing = true
		animateOut(dialog, 'search_close .2s')
		animateOut(backdrop, 'to_hide .2s')
		dialog.addEventListener('animationend', () => {
			modal.classList.add('hidden')
			document.body.style.overflow = ''
			closing = false
		}, { once: true })
	}

	openBtn.addEventListener('click', show)
	closeBtn.addEventListener('click', hide)
	backdrop.addEventListener('click', hide)
	window.addEventListener('keydown', e => e.key === 'Escape' && !modal.classList.contains('hidden') && hide())
}

export function initSearchModal({ onOpen } = {}) {
	const modal = document.getElementById('search-modal')
	const openBtn = document.getElementById('open-search')
	const closeBtn = document.getElementById('close-search')
	if (!modal || !openBtn || !closeBtn) return

	const show = () => {
		modal.classList.remove('hidden')
		document.body.style.overflow = 'hidden'
		if (onOpen) onOpen()
		const input = modal.querySelector('input')
		input && input.focus()
	}
	const hide = () => {
		modal.classList.add('hidden')
		document.body.style.overflow = ''
	}

	openBtn.addEventListener('click', show)
	closeBtn.addEventListener('click', hide)
	modal.addEventListener('click', e => {
		if (e.target.classList.contains('search-backdrop')) hide()
	})
	window.addEventListener('keydown', e => { if (e.key === 'Escape') hide() })
}

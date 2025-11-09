export function initNav() {
	const header = document.getElementById('header')
	if (!header || !header.classList.contains('fixed')) return

	const threshold = 56

	function updateHeader() {
		const scroll = window.scrollY || document.documentElement.scrollTop
		if (scroll > threshold) {
			header.classList.add('scrolled')
			return
		}
		header.classList.remove('scrolled')
	}

	updateHeader()
	window.addEventListener('scroll', updateHeader, { passive: true })
}

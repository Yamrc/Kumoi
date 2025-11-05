export function initLazyload() {
	const imgs = document.querySelectorAll('img[data-src]')
	if (!imgs.length) return
	if (!('IntersectionObserver' in window)) {
		imgs.forEach(img => (img.src = img.dataset.src))
		return
	}
	const io = new IntersectionObserver(entries => {
		entries.forEach(e => {
			if (!e.isIntersecting) return
			const img = e.target
			img.src = img.dataset.src
			io.unobserve(img)
		})
	}, { rootMargin: '200px' })
	imgs.forEach(img => io.observe(img))
}

export function initLightbox() {
	document.querySelectorAll('.post-content img').forEach(img => {
		if (img.dataset.lbBound) return
		img.dataset.lbBound = '1'
		img.style.cursor = 'zoom-in'
		img.addEventListener('click', () => {
			window.open(img.src, '_blank')
		})
	})
}

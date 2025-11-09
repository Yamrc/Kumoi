export function initRightSide() {
	const root = document.getElementById('rightside')
	if (!root) return
	root.addEventListener('click', e => {
		const target = e.target.closest('[data-action]')
		if (!target) return
		const action = target.getAttribute('data-action')
		if (action === 'go-top') window.scrollTo({ top: 0, behavior: 'smooth' })
		if (action === 'toggle-theme') toggleTheme()
		if (action === 'toggle-toc') toggleTOC()
	})
}

function toggleTheme() {
	const el = document.documentElement
	const now = el.getAttribute('data-theme') || 'light'
	const next = now === 'dark' ? 'light' : 'dark'
	el.setAttribute('data-theme', next)
	updateAuthorBackground(next)
	if (window.onThemeChange) {
		window.onThemeChange(next)
	}
}

export function updateAuthorBackground(theme) {
	const card = document.querySelector('.widget.card-info')
	if (!card) return
	const bgImg = card.getAttribute('data-bg')
	const bgImgDark = card.getAttribute('data-bg-dark')
	if (theme === 'dark' && bgImgDark) {
		card.style.backgroundImage = `url(${bgImgDark})`
	} else if (bgImg) {
		card.style.backgroundImage = `url(${bgImg})`
	}
}

export function initAuthorBackground() {
	const theme = document.documentElement.getAttribute('data-theme') || 'light'
	updateAuthorBackground(theme)
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
				const theme = document.documentElement.getAttribute('data-theme') || 'light'
				updateAuthorBackground(theme)
			}
		})
	})
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
}

function toggleTOC() {
	const mobileToc = document.getElementById('toc-mobile')
	if (mobileToc) {
		const display = getComputedStyle(mobileToc).display
		mobileToc.style.display = display === 'none' ? 'block' : 'none'
	}
}

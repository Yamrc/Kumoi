import { Theme } from '../core/theme.js'

export function initRightSide() {
	const root = document.getElementById('rightside')
	if (!root) return
	root.addEventListener('click', e => {
		const target = e.target.closest('[data-action]')
		if (!target) return
		switch (target.getAttribute('data-action')) {
			case 'go-top':
				window.scrollTo({ top: 0, behavior: 'smooth' })
				break
			case 'toggle-theme':
				Theme.toggle()
				break
			case 'toggle-toc':
				toggleTOC()
				break
		}
	})
	window.addEventListener('resize', () => {
		if (isDesktop()) toggleTOC(false)
	})
}

const isDesktop = () => window.matchMedia('(min-width: 1025px)').matches

let tocPanel = null
let tocInitialized = false

function toggleTOC(force) {
	if (force !== false && isDesktop()) return
	if (!tocPanel) tocPanel = document.getElementById('toc-mobile')
	if (!tocPanel) return
	if (!tocInitialized) initMobileTOC()
	const open = force ?? !tocPanel.classList.contains('open')
	if (open === tocPanel.classList.contains('open')) return
	tocPanel.classList.toggle('open', open)
	tocPanel.setAttribute('aria-hidden', open ? 'false' : 'true')
	document.body.classList.toggle('toc-mobile-open', open)
}

function initMobileTOC() {
	tocInitialized = true
	const close = () => toggleTOC(false)
	tocPanel.querySelectorAll('[data-toc-close]').forEach(btn => btn.addEventListener('click', close))
	tocPanel.querySelector('.toc-mobile-backdrop')?.addEventListener('click', close)
	tocPanel.addEventListener('click', e => {
		if (!tocPanel.classList.contains('open')) return
		if (e.target.closest('.toc-link')) close()
	})
	window.addEventListener('keydown', e => {
		if (e.key === 'Escape' && tocPanel.classList.contains('open')) close()
	})
}

export function updateAuthorBackground(theme) {
	const card = document.querySelector('.widget.card-info')
	if (!card) return
	const bgImg = card.getAttribute('data-bg')
	const bgImgDark = card.getAttribute('data-bg-dark')
	if (theme === 'dark' && bgImgDark) card.style.backgroundImage = `url(${bgImgDark})`
	else if (bgImg) card.style.backgroundImage = `url(${bgImg})`
}

export function initAuthorBackground() {
	const theme = document.documentElement.getAttribute('data-theme') || 'light'
	updateAuthorBackground(theme)
	window.addEventListener('themechange', e => {
		updateAuthorBackground((e && e.detail && e.detail.mode) || Theme.get())
	})
}

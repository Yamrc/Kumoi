export function initCode() {
	const pres = document.querySelectorAll('pre[class*="language-"]')
	if (!pres.length) return

	pres.forEach(pre => {
		if (pre.closest('figure.highlight')) return

		const figure = document.createElement('figure')
		figure.className = 'highlight'
		pre.parentNode.insertBefore(figure, pre)
		figure.appendChild(pre)

		const langName = (pre.getAttribute('data-language') || pre.className.match(/language-([a-z0-9+-]+)/i)?.[1] || 'PLAINTEXT').toUpperCase()
		
		const tools = document.createElement('div')
		tools.className = 'tools'
		tools.innerHTML = `
			<i class="fas fa-angle-down expand"></i>
			<div class="code-lang">${langName}</div>
			<div class="copy-notice"></div>
			<i class="fas fa-paste copy-button"></i>
		`

		figure.insertBefore(tools, pre)

		const height = pre.scrollHeight
		pre.style.maxHeight = `${height}px`

		tools.addEventListener('click', e => {
			const target = e.target
			if (target.classList.contains('expand')) {
				const isClosed = figure.classList.toggle('closed')
				if (isClosed) {
					pre.style.maxHeight = '0'
					pre.style.paddingTop = '0'
					pre.style.paddingBottom = '0'
					return
				}
				pre.style.maxHeight = `${height}px`
				pre.style.paddingTop = ''
				pre.style.paddingBottom = ''
			} else if (target.classList.contains('copy-button')) {
				const code = pre.querySelector('code')
				if (!code) return
				const copyNotice = tools.querySelector('.copy-notice')
				navigator.clipboard.writeText(code.textContent || '').then(() => {
					copyNotice.textContent = 'Copied!'
					copyNotice.style.opacity = '1'
					setTimeout(() => { copyNotice.style.opacity = '0' }, 800)
				}).catch(() => console.error('[Clipboard] Failed to copy text'))
			}
		})
	})

	if (window.Prism && window.Prism.highlightAll) {
		window.Prism.highlightAll()
	}
}

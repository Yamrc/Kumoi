export function initCode() {
	document.querySelectorAll('pre > code').forEach(code => {
		const pre = code.parentElement
		if (pre.dataset.toolbarBound) return
		pre.dataset.toolbarBound = '1'

		const langMatch = (code.className.match(/language-([a-z0-9+-]+)/i) || [,'plain'])[1]
		const label = document.createElement('span')
		label.className = 'code-lang'
		label.textContent = langMatch

		const copyBtn = document.createElement('button')
		copyBtn.className = 'code-copy'
		copyBtn.type = 'button'
		copyBtn.textContent = 'Copy'
		copyBtn.addEventListener('click', async () => {
			try {
				await navigator.clipboard.writeText(code.textContent || '')
				copyBtn.textContent = 'Copied'
				setTimeout(() => (copyBtn.textContent = 'Copy'), 1200)
			} catch {}
		})

		const foldBtn = document.createElement('button')
		foldBtn.className = 'code-fold'
		foldBtn.type = 'button'
		foldBtn.textContent = 'Fold'
		foldBtn.addEventListener('click', () => {
			const collapsed = pre.classList.toggle('collapsed')
			foldBtn.textContent = collapsed ? 'Unfold' : 'Fold'
		})

		const fullBtn = document.createElement('button')
		fullBtn.className = 'code-fullscreen-btn'
		fullBtn.type = 'button'
		fullBtn.textContent = 'Full'
		fullBtn.addEventListener('click', () => {
			pre.classList.toggle('code-fullscreen')
		})

		const bar = document.createElement('div')
		bar.className = 'code-toolbar'
		bar.appendChild(label)
		bar.appendChild(copyBtn)
		bar.appendChild(foldBtn)
		bar.appendChild(fullBtn)

		pre.prepend(bar)
	})

	if (window.Prism && window.Prism.highlightAll) {
		window.Prism.highlightAll()
	}
}

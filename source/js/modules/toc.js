export function initTOC() {
	let headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3')
	if (!headings.length) {
		const title = document.querySelector('h1.post-title')
		if (title) headings = [title]
		else return
	}

	const sidebarTocWidget = document.getElementById('sidebar-toc')
	const sidebarToc = document.getElementById('toc-sidebar')
	const sidebarList = sidebarToc?.querySelector('.toc-list')
	if (sidebarList && sidebarTocWidget) {
		sidebarList.innerHTML = ''
		headings.forEach(h => {
			const id = h.id || h.textContent.trim().toLowerCase().replace(/\s+/g, '-')
			h.id = id
			const li = document.createElement('li')
			const a = document.createElement('a')
			a.href = `#${id}`
			a.textContent = h.textContent
			li.appendChild(a)
			sidebarList.appendChild(li)
		})
		if (sidebarList.children.length > 0) {
			sidebarTocWidget.style.display = 'block'
			observe(headings, sidebarList)
		} else {
			sidebarTocWidget.style.display = 'none'
		}
	}

	const mobileToc = document.getElementById('toc-mobile-nav')
	const mobileList = mobileToc?.querySelector('.toc-list')
	if (mobileList) {
		mobileList.innerHTML = ''
		headings.forEach(h => {
			const id = h.id || h.textContent.trim().toLowerCase().replace(/\s+/g, '-')
			const li = document.createElement('li')
			const a = document.createElement('a')
			a.href = `#${id}`
			a.textContent = h.textContent
			li.appendChild(a)
			mobileList.appendChild(li)
		})
	}
}

function observe(headings, list) {
	if (!('IntersectionObserver' in window) || !list) return
	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			const id = entry.target.id
			const link = list.querySelector(`a[href="#${CSS.escape(id)}"]`)
			if (!link) return
			link.classList.toggle('active', entry.isIntersecting)
		})
	}, { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] })
	headings.forEach(h => observer.observe(h))
}

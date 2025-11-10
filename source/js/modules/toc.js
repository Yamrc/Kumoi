const HEADING_SELECTOR = '.post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6'
const HEADER_GAP = 20

let teardownTOC = null

const $ = s => document.querySelector(s)
const text = n => (n.textContent || n.innerText || '').trim()
const slug = s => (s || '').trim().toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '') || 'section'
const headerOffset = () => { const h = $('#header'); return h && h.classList.contains('fixed') ? h.offsetHeight + HEADER_GAP : HEADER_GAP }
const offTop = el => { let top = 0, cur = el; while (cur) { top += cur.offsetTop; cur = cur.offsetParent } return top }
const scrollPercent = article => {
	if (!article) return ''
	const scrollTop = window.scrollY || document.documentElement.scrollTop
	const docHeight = article.scrollHeight
	const winHeight = window.innerHeight
	if (docHeight <= winHeight) return '0%'
	const value = Math.round((scrollTop / (docHeight - winHeight)) * 100)
	return `${Math.min(100, Math.max(0, value))}%`
}
const smoothTo = heading => {
	const top = heading.getBoundingClientRect().top + window.scrollY - headerOffset()
	window.scrollTo({ top, behavior: 'smooth' })
}
const debounce = (fn, wait = 120) => { let timer = null; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), wait) } }

function ensureId(heading) {
	if (heading.id) return heading.id
	const base = slug(text(heading) || 'section')
	let id = base
	let index = 1
	while (document.getElementById(id)) id = `${base}-${index++}`
	heading.id = id
	return id
}

function collectHeadings() {
	const headings = document.querySelectorAll(HEADING_SELECTOR)
	if (!headings.length) {
		const title = $('h1.post-title')
		return title ? [{ heading: title, id: ensureId(title), level: 1, label: text(title) || 'Section', link: null, item: null, top: 0 }] : []
	}
	return Array.from(headings, heading => ({
		heading,
		id: ensureId(heading),
		level: parseInt(heading.tagName.charAt(1), 10),
		label: text(heading) || 'Section',
		link: null,
		item: null,
		top: 0
	}))
}

function renderList(nodes, container, captureNodes) {
	if (!container) return
	if (!nodes.length) { container.innerHTML = ''; return }

	const fragment = document.createDocumentFragment()
	const stack = [{ level: 0, list: fragment }]
	const counters = Array(7).fill(0)

	nodes.forEach((node, index) => {
		while (stack.length > 1 && stack[stack.length - 1].level >= node.level) stack.pop()
		for (let i = node.level + 1; i <= 6; i++) counters[i] = 0
		counters[node.level] += 1

		const numbering = `${counters.slice(1, node.level + 1).join('.')}.`
		const li = document.createElement('li')
		li.className = 'toc-item'
		const link = document.createElement('a')
		link.className = 'toc-link'
		link.href = `#${node.id}`
		link.textContent = `${numbering} ${node.label}`
		li.appendChild(link)
		stack[stack.length - 1].list.appendChild(li)

		if (captureNodes && !node.link) {
			node.link = link
			node.item = li
		}

		const next = nodes[index + 1]
		if (next && next.level > node.level) {
			const childList = document.createElement('ol')
			childList.className = 'toc-child'
			li.classList.add('has-children')
			li.appendChild(childList)
			stack.push({ level: node.level, list: childList })
		}
	})

	container.innerHTML = ''
	container.appendChild(fragment)
}

function createTracker(nodes, article, meter) {
	if (!nodes.length) return { destroy: () => {}, activate: () => {} }

	const indexOf = new Map(nodes.map((node, i) => [node.id, i]))
	const offsets = new Array(nodes.length).fill(0)
	const expanded = new Set()
	let active = -1
	let lock = null

	const markExpanded = item => {
		const chain = []
		let current = item
		while (current) {
			chain.push(current)
			current = current.parentElement?.closest('.toc-item') || null
		}
		expanded.forEach(el => {
			if (!chain.includes(el)) {
				el.classList.remove('expanded')
				expanded.delete(el)
			}
		})
		chain.forEach(el => {
			if (!expanded.has(el)) {
				el.classList.add('expanded')
				expanded.add(el)
			}
		})
	}

	const setActive = index => {
		if (index === active || index < 0 || index >= nodes.length) return
		if (active !== -1) nodes[active].link.classList.remove('active')
		const node = nodes[index]
		node.link.classList.add('active')
		if (node.item) markExpanded(node.item)
		active = index
	}

	const updateOffsets = () => nodes.forEach((node, i) => { offsets[i] = offTop(node.heading) })
	const updateMeter = () => { if (meter) meter.textContent = scrollPercent(article) }
	const seek = threshold => {
		let i = active >= 0 ? active : 0
		if (offsets[i] > threshold) while (i > 0 && offsets[i] > threshold) i--
		else while (i + 1 < offsets.length && offsets[i + 1] <= threshold) i++
		return i
	}

	const apply = () => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop
		const threshold = scrollTop + headerOffset()
		const now = Date.now()
		if (lock && now < lock.until) {
			setActive(lock.index)
			if (Math.abs(scrollTop - lock.target) < 2) lock = null
			updateMeter()
			return
		}
		lock = null
		setActive(seek(threshold))
		updateMeter()
	}

	const onScroll = () => apply()
	const onResize = debounce(() => { updateOffsets(); apply() })

	updateOffsets()
	apply()

	window.addEventListener('scroll', onScroll, { passive: true })
	window.addEventListener('resize', onResize)
	window.addEventListener('load', onResize)

	return {
		destroy() {
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', onResize)
			window.removeEventListener('load', onResize)
		},
		activate(id) {
			const index = indexOf.get(id)
			if (index == null) return
			updateOffsets()
			lock = { index, target: offsets[index] - headerOffset(), until: Date.now() + 1200 }
			setActive(index)
			updateMeter()
		}
	}
}

function attachClicks(host, onActivate) {
	if (!host) return () => {}
	const handler = e => {
		const link = e.target.closest('.toc-link')
		if (!link) return
		e.preventDefault()
		const hash = link.getAttribute('href') || ''
		const id = decodeURIComponent(hash.split('#')[1] || '')
		const heading = id && document.getElementById(id)
		if (!heading) return
		onActivate?.(id)
		smoothTo(heading)
	}
	host.addEventListener('click', handler)
	return () => host.removeEventListener('click', handler)
}

export function initTOC() {
	if (typeof teardownTOC === 'function') {
		teardownTOC()
		teardownTOC = null
	}

	const nodes = collectHeadings()
	if (!nodes.length) return

	const cleanup = []
	const article = $('.post-content') || $('main')

	const sidebarWidget = $('#sidebar-toc')
	const sidebarNav = $('#toc-sidebar')
	const sidebarList = sidebarNav?.querySelector('.toc-list')

	if (sidebarWidget && sidebarList) {
		renderList(nodes, sidebarList, true)
		if (nodes[0].link) {
			sidebarWidget.style.display = 'block'
			const tracker = createTracker(nodes, article, sidebarWidget.querySelector('.toc-percentage'))
			cleanup.push(() => tracker.destroy())
			cleanup.push(attachClicks(sidebarNav, tracker.activate))
		} else {
			sidebarWidget.style.display = 'none'
		}
	}

	const mobileNav = $('#toc-mobile-nav')
	const mobileList = mobileNav?.querySelector('.toc-list')
	if (mobileList) {
		renderList(nodes, mobileList, false)
		cleanup.push(attachClicks(mobileNav))
	}

	teardownTOC = () => cleanup.forEach(fn => fn && fn())
}

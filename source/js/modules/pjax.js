import { onPjaxComplete } from '../core/lifecycle.js'
import { unmountTwikoo } from '../adapters/comments/twikoo.js'
import { unmountGiscus } from '../adapters/comments/giscus.js'

let pjax = null

function unmountComments() {
	const provider = document.body?.dataset?.commentsProvider
	if (provider === 'twikoo') unmountTwikoo()
	else if (provider === 'giscus') unmountGiscus()
}

function reinitScripts() {
	document.querySelectorAll('script[data-pjax]').forEach(item => {
		const newScript = document.createElement('script')
		const content = item.text || item.textContent || item.innerHTML || ''
		Array.from(item.attributes).forEach(attr => {
			if (attr.name !== 'data-pjax') newScript.setAttribute(attr.name, attr.value)
		})
		if (content) newScript.appendChild(document.createTextNode(content))
		item.parentNode?.replaceChild(newScript, item)
	})
}

function getConfig() {
	const body = document.body
	if (!body) return { enable: false }
	const enable = body.dataset.pjaxEnable === 'true'
	if (!enable) return { enable: false }
	const excludeStr = body.dataset.pjaxExclude
	let exclude = null
	if (excludeStr) {
		try {
			exclude = JSON.parse(excludeStr)
		} catch (e) {
			console.warn('[PJAX] Invalid exclude config', e)
		}
	}
	return { enable: true, exclude }
}

export function initPjax() {
	const config = getConfig()
	if (!config.enable || typeof Pjax === 'undefined') return

	const selectors = ['head > title', '#body-wrap', '.js-pjax']
	let exclude = 'a[target="_blank"], a[href^="#"], a[href^="javascript:"]'
	if (config.exclude && Array.isArray(config.exclude)) {
		config.exclude.forEach(val => {
			exclude += `, a[href="${val}"]`
		})
	}

	pjax = new Pjax({
		elements: 'a:not(' + exclude + ')',
		selectors: selectors,
		cacheBust: false,
		scrollRestoration: false
	})

	document.addEventListener('pjax:send', () => {
		unmountComments()
	})

	document.addEventListener('pjax:complete', () => {
		reinitScripts()
		onPjaxComplete()
	})

	document.addEventListener('pjax:error', e => {
		if (e.request?.status === 404) {
			if (redirectCount > 1 || !pjax) {
				window.location.href = e.request.responseURL || window.location.href
				return
			}
			pjax.loadUrl('/404.html')
		}
	})
}


function pickRandom(arr, n) {
	const a = arr.slice()
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
	return a.slice(0, n)
}

// TODO
// hexo.extend.helper.register('recommend_posts', function () {
// 	const theme = this.theme || {}
// 	const opt = (((theme.home || {}).recommend) || {})
// 	if (!opt.enable) return []
// 	const count = Number(opt.count || 3)
// 	const mode = opt.mode || 'pin_first'
// 	const posts = this.site.posts && this.site.posts.sort('date', -1).toArray() || []
// 	if (!posts.length) return []

// 	if (mode === 'pin_first') {
// 		const pinned = posts.filter(p => p.pin)
// 		if (pinned.length >= count) return pinned.slice(0, count)
// 		const remain = count - pinned.length
// 		const others = posts.filter(p => !p.pin)
// 		return pinned.concat(pickRandom(others, remain))
// 	}
// 	return pickRandom(posts, count)
// })

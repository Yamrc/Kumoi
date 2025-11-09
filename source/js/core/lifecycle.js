import { initTOC } from '../modules/toc.js'
import { initCode } from '../modules/code.js'
import { initLazyload } from '../modules/lazyload.js'
import { initLightbox } from '../modules/lightbox.js'
import { initRightSide, initAuthorBackground, updateAuthorBackground } from '../modules/rightside.js'
import { initNav } from '../modules/nav.js'

function initTheme() {
	const savedTheme = localStorage.getItem('theme')
	if (savedTheme === 'dark' || savedTheme === 'light') {
		document.documentElement.setAttribute('data-theme', savedTheme)
		updateAuthorBackground(savedTheme)
	}
}

export function init() {
	initTheme()
	initCode()
	initTOC()
	initLazyload()
	initLightbox()
	initRightSide()
	initNav()
	initAuthorBackground()

	console.debug(`
く__,.ヘヽ.        /  ,ー､ 〉
         ＼ ', !-─‐-i  /  /´
         ／｀ｰ'       L/／｀ヽ､
       /   ／,   /|   ,   ,       ',
     ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
      ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
        !,/7 '0'     ´0iソ|    |
        |.从"    _     ,,,, / |./    |
        ﾚ'| i＞.､,,__  _,.イ /   .i   |
          ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
            | |/i 〈|/   i  ,.ﾍ |  i  |
           .|/ /  ｉ：    ﾍ!    ＼  |
            kヽ>､ﾊ    _,.ﾍ､    /､!
            !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
            ﾚ'ヽL__|___i,___,ンﾚ|ノ
                ﾄ-,/  |___./
                'ｰ'    !_,.:
%cHello from Kumoi %c ${window.THEME_VERSION}`,
	"padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #FF6699; font-weight: bold;",
	"padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: #FF9999; font-weight: bold;")
}

export function onThemeChange(mode) {
	document.documentElement.setAttribute('data-theme', mode)
	updateAuthorBackground(mode)
}

export function onPjaxComplete() {
	init()
}

init()

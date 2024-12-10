'use strict'

import WebFont from 'webfontloader'

export default class SliderWebfont {
  #fontFamily
  #sliderContainer

  constructor (fontFamily, sliderContainer) {
    this.#sliderContainer = sliderContainer
    this.#fontFamily = fontFamily
    this.#init()
    this.#addFontFamily()
  }

  #init () {
    const fontFamily = (Array.isArray(this.#fontFamily) ? this.#fontFamily : [this.#fontFamily])
    console.log(fontFamily)
    WebFont.load({
      google: {
        families: this.#fontFamily
      }
    })
  };

  #addFontFamily () {
    const fontTag = (this.#fontFamily.includes(',')) ? this.#fontFamily.map(el => el.split(':')[0]) : this.#fontFamily
    this.#sliderContainer.forEach(el => {
      el.style.fontFamily = ''
      el.style.fontFamily = fontTag
    })
  }
}

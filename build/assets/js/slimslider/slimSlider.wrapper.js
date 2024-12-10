import SliderHelpers from './slimSlider.helpers.js'

export default class SliderWrapper {
  #container
  wrapper
  wrapperDomElement
  elementsToWrap
  #opts

  constructor (options, container, elementsToWrap) {
    this.#opts = options
    this.#container = container
    this.elementsToWrap = elementsToWrap
    this.init()
  }

  init () {
    this.wrapper = SliderHelpers.wrapAround(this.elementsToWrap, SliderHelpers.createWrapperElement(this.#opts.sliderWrapperClass))
    this.#container.innerHTML = ''
    this.#container.insertAdjacentElement('afterbegin', this.wrapper)
    this.wrapperDomElement = this.#container.querySelector(`.${this.#opts.sliderWrapperClass}`)
    this.setWrapperHeight()
    !this.#opts.slidesRowWrap && this.#setWrapperWidth()
  }

  async setWrapperHeight (el) {
    this.#getWrapperMaxHeight().then((res) => {
      this.wrapper.style.height = `${res}px`
      return this.wrapper.style.height
    })
  }

  #setWrapperWidth () {
    const wrapperWidth = `${(this.elementsToWrap.length / this.#opts.slidesShow) * 100}%`
    this.wrapperDomElement.style.width = wrapperWidth
  }

  async #getWrapperMaxHeight () {
    try {
      const imagesTarget = this.#getImagesForWrapperMaxHeight()
      const sliderElementsHeights = await Promise.all(imagesTarget.map(async (el, index) => {
        const elementClass = `.${this.#opts.sliderClass} .${this.#opts.sliderWrapperClass} > *:nth-child(${index + 1})`
        await SliderHelpers.waitForElement(elementClass, 200)
        return Number(parseInt(window.getComputedStyle(document.querySelectorAll(elementClass + '> img')[0]).height))
      }))
      return Math.min(...sliderElementsHeights)
    } catch (err) {
      console.error(
        `Error in 'SliderHelpers.waitForElement' \r\n 
        Promise for following elements could not be resolved:\r\n`,
        err,
        'Element heights could not be returned \r\n'
      )
    }
  }

  #getImagesForWrapperMaxHeight () {
    if ([...this.elementsToWrap].length) {
      return [...this.elementsToWrap].map(el => el.childNodes[0])
    } else { return [...this.elementsToWrap] }
  }
}

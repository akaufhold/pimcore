import Slider from './slimSlider.js'
import SliderWebfont from './slimSlider.webfont.js'

export default class SliderResponsive {
  #sliders = []
  #sliderCssClass
  #sliderSelector
  viewportWidth
  #breakpoints
  #defaultOptions
  #opts
  resizeTimeout

  constructor (
    options,
    sliderCssClass = `.${options.sliderClass}`
  ) {
    this.#opts = Object.assign({}, options)
    this.#defaultOptions = Object.assign({}, options)
    this.#sliderCssClass = sliderCssClass
    this.#sliderSelector = document.querySelectorAll(sliderCssClass)
    // console.log(sliderCssClass, document.querySelectorAll(sliderCssClass))
    this.init()
  }

  init () {
    this.#opts.fontFamily && new SliderWebfont(this.#opts.fontFamily, this.#sliderSelector)
    this.#setViewport()
    this.#getBreakpoints()
    this.#setViewportOptions()
    this.#initAllSliders()
    window.addEventListener('resize', this.reinitAllSliders.bind(this), true)
  }

  #setViewport () {
    this.viewportWidth = window.innerWidth || document.documentElement.clientWidth
  }

  #getBreakpoints () {
    const {responsive} = this.#opts
    this.#breakpoints = responsive.map(el => el.breakpoint)
  }

  #setViewportOptions () {
    const viewportOptions = this.#getOverrideOptionsForViewport()
    const overrideOptions = viewportOptions[0]?.options
    if (overrideOptions) {
      for (const option of Object.entries(overrideOptions)) {
        this.#opts[option[0]] = option[1]
      }
    } else {
      this.#opts = Object.assign({}, this.#defaultOptions)
    }
  }

  #getOverrideOptionsForViewport () {
    let viewportOptions
    let minViewport = 0
    const target = this.#breakpoints.filter(el => el > this.viewportWidth)
    if (target.length) {
      minViewport = target.reduce((last, next) => Math.min(last, next))
    }
    target && (viewportOptions = this.#opts.responsive.filter(el => {
      return el.breakpoint === minViewport
    }))
    return viewportOptions
  }

  #initAllSliders () {
    this.#sliderSelector.forEach(slider => {
      this.#sliders.push(new Slider(slider, this.#opts))
    })
  }

  reinitAllSliders () {
    if (!this.resizeTimeout) {
      this.resizeTimeout = setTimeout(() => {
        this.#setViewport()
        this.#setViewportOptions()
        this.#sliders.forEach(slider => {
          slider.setOptions(this.#opts)
          slider.init()
          this.resizeTimeout = null
        })
      }, 100)
    }
  }
}

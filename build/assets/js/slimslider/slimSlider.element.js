import SliderHelpers from './slimSlider.helpers.js'

export default class SliderElement {
  #sliderContainer
  elementWrapper = false
  elementIsWrapped = false
  elementnode
  opts
  #index
  #slidesCount
  #dataAttrCount

  constructor (
    options,
    sliderContainer,
    element,
    index,
    slidesCount,
    noWrap
  ) {
    this.opts = options
    this.#sliderContainer = sliderContainer
    this.elementnode = element
    this.#index = this.opts.index = index
    this.#slidesCount = this.opts.slidesCount = slidesCount
    this.noWrap = noWrap
    this.init()
  }

  init () {
    // (typeof this.elementnode.dataset === 'object') && this.#setElementWrapperType('figure')
    this.isElWrapperRequired() && this.#setElementWrapper()
    this.#setElementStyles(this.elementWrapper ? this.elementWrapper : this.elementnode)
    this.#setElementClasses()
    SliderHelpers.setElClass(this.elementnode, this.opts.elementClass);
    (this.opts.transition === 'parallax') && (this.parallaxLayers = Array.from(this.elementWrapper.querySelectorAll('.parallax'))) && this.#initParallaxLayers()
    this.opts.overlay.enabled && this.elementWrapper.appendChild(this.#createElementContentWrapper(this.opts.transition))
    this.#createExtraElements(this.opts.transition)
    this.#setElementCSSVars(this.opts.transition)
  }

  #initParallaxLayers () {
    const parallaxLayersData = this.parallaxLayers.map(layer => ({
      element: layer,
      speedX: parseFloat(layer.dataset.speed_x || 1),
      speedY: parseFloat(layer.dataset.speed_y || 1),
      offsetX: parseFloat(layer.dataset.offset_x || 0),
      offsetY: parseFloat(layer.dataset.offset_y || 0)
    }))
    this.parallaxLayers.forEach((el) => {
      el.style.width = (!Number.isNaN(Number(el.dataset.width))) ? el.dataset.width + '%' : el.dataset.width
      el.style.height = (!Number.isNaN(Number(el.dataset.height))) ? el.dataset.height + '%' : el.dataset.height
    })
    this.elementWrapper.addEventListener('mousemove', (e) => this.#parallaxMove(e, parallaxLayersData))
  }

  #parallaxMove (e, parallaxLayersData) {
    let animationFrameId = null
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }

    animationFrameId = requestAnimationFrame(() => {
      const rect = this.elementWrapper.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      parallaxLayersData.forEach(({element, width, height, speedX, speedY, offsetX, offsetY}) => {
        const translateX = offsetX + (mouseX / rect.width - 0.5) * speedX * 100
        const translateY = offsetY + (mouseY / rect.height - 0.5) * speedY * 100
        element.style.transform = `translate3d(${translateX}%, ${translateY}%, 0)`
        element.style.width = `${width}%`
        element.style.height = `${height}%`
        // console.log(`${width}%`, `${height}%`)
      })
    })
  }

  #setElementWrapperType (type) {
    this.opts.elementType = type
  }

  isElWrapperRequired () {
    this.elementIsWrapped = (this.opts.transition === 'parallax') || ((this.opts.vignette || this.opts.zoom || typeof this.elementnode.dataset === 'object') && this.noWrap === false)
    return this.elementIsWrapped
  }

  #setElementWrapper () {
    this.#index === 0 && (this.#sliderContainer.innerHTML = '')
    if (this.opts.transition === 'parallax') {
      this.elementWrapper = this.elementnode
      SliderHelpers.setElClass(this.elementWrapper, this.opts.sliderParallaxWrapperClass)
    } else {
      this.elementWrapper = SliderHelpers.wrapAround(
        this.elementnode,
        SliderHelpers.createWrapperElement(this.opts.elementWrapperClass, this.opts.elementType)
      )
      this.#sliderContainer.insertAdjacentElement('beforeEnd', this.elementWrapper)
    }
  }

  #setElementStyles (el) {
    const curColumn = this.opts.slidesRowWrap ? (this.#index + 1) % this.opts.slidesShow : (this.#index + 1)
    SliderHelpers.setElStyle(el, 'gridRowStart', 1);
    (curColumn === 0) ? SliderHelpers.setElStyle(el, 'gridColumnStart', this.opts.slidesShow) : SliderHelpers.setElStyle(el, 'gridColumnStart', curColumn)
  }

  #setElementClasses () {
    this.opts.type === 'gallery' && SliderHelpers.setElClass(this.elementWrapper, 'parallel')
    this.opts.zoom && SliderHelpers.setElClass(this.elementWrapper, 'zoom')
    this.opts.vignette && SliderHelpers.setElClass(this.elementWrapper, 'vignette')
    this.elementnode.querySelector('video') !== null && SliderHelpers.setElClass(this.elementWrapper, 'video')
  }

  #createElementContentWrapper (transition) {
    const {text, link, linktype} = this.elementnode.dataset
    // console.log(text, link, linktype)
    let textWrap; let linkWrap; let elementWrapper = SliderHelpers.createWrapperElement('slider-image-overlay', 'div')
    elementWrapper.classList.add(`overlay-style-${this.opts.overlay.style}`)
    elementWrapper.style.fontSize = `${11 - this.opts.slidesShow}px`
    elementWrapper = this.#createElementHeader(elementWrapper)
    text && (textWrap = this.#createElementContent(text, 'description', 'div')) && (elementWrapper = SliderHelpers.wrapAround(textWrap, elementWrapper))

    if (link) {
      linkWrap = this.#createElementContentLink(link, linktype, linkWrap, elementWrapper)
      elementWrapper = SliderHelpers.wrapAround(linkWrap, elementWrapper)
      linkWrap = this.#createElementButton(linkWrap)
    }
    return elementWrapper
  }

  #createElementHeader (elementWrapper) {
    const {head, head2} = this.elementnode.dataset
    let headerWrap, headerWrapper, header, header2;
    (head || head2) && (headerWrap = this.#createElementContent('', 'header-wrap', 'div'))
    head && (header = this.#createElementContent(head, 'header', this.opts.headerTag)) && (headerWrap.appendChild(header))
    head2 && (header2 = this.#createElementContent(head2, 'header', this.opts.headerTag)) && (headerWrap.appendChild(header2));
    (head || head2) && (headerWrapper = SliderHelpers.wrapAround(headerWrap, elementWrapper))
    return headerWrapper
  }

  #createElementContent (text, cssClass, htmlTag) {
    const wrapperElement = SliderHelpers.createWrapperElement(`slider-${cssClass}`, htmlTag)
    wrapperElement.innerHTML = text
    return wrapperElement
  }

  #createElementContentLink = (link, linktype, linkWrap) => {
    if (linktype === 'backend') {
      linkWrap = document.createElement('a')
      const linkOuter = link.trim()
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = linkOuter
      linkWrap = tempDiv.firstChild
    } else {
      linkWrap = this.#createElementContent('mehr', 'link', 'a')
    }
    return linkWrap
  }

  #createElementButton (linkWrap) {
    let linkChilds
    if (this.opts.overlay.button === 'scale') {
      for (let i = 0; i < 4; i++) {
        linkChilds = this.#createElementContent('', 'link-back', 'span')
        linkWrap = SliderHelpers.wrapAround(linkChilds, linkWrap)
      }
      SliderHelpers.setElClass(linkWrap, `${this.opts.sliderLinkClass}-${this.opts.overlay.button}`)
    }
    return linkWrap
  }

  #setElementCSSVars (transition) {
    const elToStyle = this.elementWrapper || this.elementnode
    console.log(elToStyle)
    elToStyle.style.setProperty('--animation-duration', `${this.opts.transitionDuration / 1000}s`)
    elToStyle.style.setProperty('--transition-duration', `${this.opts.transitionDuration / 1000}s`);
    ((transition === 'circle') || (transition === 'rect')) && this.#sliderContainer.style.setProperty('--stroke-width', `${100 / this.opts.transitionSegments * 2}%`)
  }

  #createExtraElements (transition) {
    transition === 'circle' && this.#createEECirle()
    transition === 'rect' && this.#createEERect()
    transition === 'slices' && this.#createEEClones(transition)
    transition === 'tiles' && this.#createEEClones(transition)
    transition === 'tiles-rotate' && this.#createEEClones(transition)
    transition === 'shutter' && this.#createEEClones(transition)
  }

  #createEECirle () {
    this.elementWrapper.insertAdjacentElement('beforeend', SliderHelpers.createSvg('circle', 'center', this.opts.transitionSegments))
  }

  #createEERect () {
    this.elementWrapper.insertAdjacentElement('beforeend', SliderHelpers.createSvg('rect', 'center', this.opts.transitionSegments))
  }

  async #createEEClones (transition) {
    this.elementWrapper.style.setProperty('--transition-delay', `${this.opts.transitionDuration / 1000}s`)
    this.elementWrapper.style.setProperty('--transition-duration', `${this.opts.transitionDuration / 1000}s}`)
    const clonedElements = await this.#createClones(this.elementnode, transition, this.opts)
    this.elementWrapper.insertAdjacentElement('beforeend', clonedElements)
  }

  /* TRANSITION CLONES */
  #createClones (sliderElement, cloneType, options) {
    let cloneWrapper = document.createElement('div')
    cloneWrapper.classList.add('slider-transition-overlay')
    sliderElement.localName === 'video' && cloneType === 'shutter' && this.#createElementContentWrapperBackground(cloneWrapper, this.opts.transition)
    cloneType === 'slices' && (cloneWrapper = this.#createCloneSlices(sliderElement, cloneWrapper, options, cloneType))
    cloneType === 'shutter' && (cloneWrapper = this.#createCloneSlices(sliderElement, cloneWrapper, options, cloneType))
    cloneType === 'tiles' && (cloneWrapper = this.#createCloneTiles(sliderElement, cloneWrapper, options, cloneType))
    cloneType === 'tiles-rotate' && (cloneWrapper = this.#createCloneTiles(sliderElement, cloneWrapper, options, cloneType))
    return cloneWrapper
  }

  async #createElementContentWrapperBackground (elementWrapper, transition) {
    const loadedElement = await SliderHelpers.getLoadedElement(this.elementnode)
    elementWrapper.appendChild(this.#createCloneVideoCanvas(this.elementnode, loadedElement, 'back', 0, 'shutter'))
  }

  /* TRANSITION SLICES AND SHUTTER */
  async #createCloneSlices (sliderElement, cloneWrapper, options, cloneType) {
    const translateY = `${100 * (Math.floor(options.index / options.slidesShow))}%`
    const loadedElement = await SliderHelpers.getLoadedElement(sliderElement, sliderElement.localName)
    loadedElement.screen = this.#createCloneVideoScreen(sliderElement, loadedElement)
    for (let x = 0; x < options.transitionSegments; x++) {
      const clone = document.createElement('div')
      const cloneElement = await this.#createCloneElement(sliderElement, loadedElement, x, '_', cloneType)
      this.#createCloneSliceStyle(clone, options, x, cloneType, translateY);
      (cloneType === 'shutter') && SliderHelpers.setElStyle(cloneElement, 'transform', 'translate3d(\'-10%\',0,0)')
      SliderHelpers.setElClass(cloneElement, 'slider-transition-clone-img')
      clone.appendChild(cloneElement)
      cloneWrapper.appendChild(clone)
    }
    return cloneWrapper
  }

  #createCloneSliceStyle (clone, options, i, cloneType, translateY) {
    if (cloneType === 'slices') {
      const transitionDuration = `${(options.transitionDuration - ((options.transitionDuration / (options.transitionSegments * 2)) * i)) / 1000}s`
      SliderHelpers.setElStyle(clone, 'transitionDuration', transitionDuration)
      SliderHelpers.setElStyle(clone, 'animationDuration', transitionDuration)
      SliderHelpers.setElStyle(clone, 'transform', `translateY(${translateY})`)
    }
    if (cloneType === 'shutter') {
      const translateX = `${Math.round(Math.random() * 80) * (Math.round(Math.random()) * 2 - 1)}%`
      SliderHelpers.setElStyle(clone, 'transform', `translate3d(${translateX},0,0)`)
    }
    SliderHelpers.setElClass(clone, 'slider-transition-clone')
    SliderHelpers.setElStyle(clone, 'width', `${100 / options.transitionSegments}%`)
    SliderHelpers.setCssTransitionTiming(clone, options.transitionTiming)
  }

  /* TRANSITION TILES */
  async #createCloneTiles (sliderElement, cloneWrapper, options, cloneType) {
    const loadedElement = await SliderHelpers.getLoadedElement(sliderElement)
    loadedElement.screen = await this.#createCloneVideoScreen(sliderElement, loadedElement)
    for (let y = 0; y < options.transitionSegments; y++) {
      for (let x = 0; x < options.transitionSegments; x++) {
        // let cloneElement = document.createElement('canvas');
        const cloneElement = await this.#createCloneElement(sliderElement, loadedElement, x, y, cloneType)
        SliderHelpers.setElClass(cloneElement, 'slider-transition-clone-img')
        const clone = document.createElement('div')
        this.#createCloneTilesStyle(clone, options, cloneType, x, y)
        clone.appendChild(cloneElement)
        cloneWrapper.appendChild(clone)
      }
    }
    return cloneWrapper
  }

  #createCloneTilesStyle (clone, options, cloneType, x, y) {
    const translateX = `${50 * (x - (options.transitionSegments / 2))}%`
    const translateY = `${50 * (y - (options.transitionSegments / 2))}%`
    const transitionDuration = `${(options.transitionDuration - ((options.transitionDuration / options.transitionSegments) * x)) / 1000}s`
    let transitionDelay = `${(x + y / (options.transitionSegments * 2 - x)) * options.transitionSegments / options.transitionSegments / 1000 * (options.transitionDuration / options.transitionSegments)}s`
    cloneType === 'tiles-rotate' && (transitionDelay = `${(x * options.transitionDuration / 10000 + y * options.transitionDuration / 10000)}s`)
    cloneType === 'tiles' && SliderHelpers.setElStyle(clone, 'transform', `translate3d(${translateX},${translateY},0)`)
    SliderHelpers.setElStyle(clone, 'transitionDuration', transitionDuration)
    SliderHelpers.setElStyle(clone, 'animationDuration', transitionDuration)
    SliderHelpers.setElStyle(clone, 'transitionDelay', transitionDelay)
    SliderHelpers.setElStyle(clone, 'animationDelay', transitionDelay)
    SliderHelpers.setElClass(clone, 'slider-transition-clone')
    SliderHelpers.setElStyle(clone, 'width', `${100 / options.transitionSegments}%`)
    SliderHelpers.setElStyle(clone, 'height', `${100 / options.transitionSegments}%`)
    SliderHelpers.setCssTransitionTiming(clone, options.transitionTiming)
  }

  /* ClONE ELEMENTS */
  async #createCloneVideoScreen (sliderElement, loadedElement) {
    // console.log(loadedElement.target);
    const canvas = document.createElement('canvas')
    const {clientWidth: width, clientHeight: height} = loadedElement.target
    Object.assign(canvas, {width, height})
    sliderElement.addEventListener('seeked', function (e) {
      // console.log('seeked');
      const ctx = canvas.getContext('2d')
      ctx.drawImage(sliderElement, 0, 0, width, height)
      ctx.filter = 'contrast(100%)'
    }, {once: true})
    SliderHelpers.wait(0.15)
    return canvas
  }

  async #createCloneElement (sliderElement, loadedElement, x, y, cloneType) {
    let clonedImg
    sliderElement.localName === 'img' && (clonedImg = this.#createCloneImage(sliderElement, loadedElement, x, y, cloneType))
    sliderElement.localName === 'video' && (clonedImg = this.#createCloneVideoCanvas(loadedElement, x, y, cloneType))
    return clonedImg
  }

  #createCloneImage (originalImg, loadedImg, x, y, cloneType) {
    const clonedImg = document.createElement('img')
    clonedImg.src = originalImg.src
    clonedImg.width = loadedImg.target.clientWidth
    clonedImg.height = loadedImg.target.clientHeight
    clonedImg.style.left = `${x * -100}%`
    cloneType.includes('tiles') && (clonedImg.style.top = `${y * -100}%`)
    SliderHelpers.setElClass(clonedImg, 'slider-transition-clone-img')
    return clonedImg
  };

  async #createCloneVideoCanvas (loadedElement, x, y, cloneType) {
    const canvas = document.createElement('canvas')
    const destCtx = canvas.getContext('2d')
    const {clientWidth: width, clientHeight: height} = loadedElement.target
    Object.assign(canvas, {width, height})
    destCtx.drawImage(loadedElement.screen, 0, 0, width, height)
    document.querySelector('.test1').appendChild(loadedElement.screen)
    canvas.style.left = `${x * -100}%`
    cloneType.includes('tiles') && (canvas.style.top = `${y * -100}%`)
    x === 'back' && (canvas.classList.add(`slider-transition-clone-img${x}`))
    return canvas
  };
}

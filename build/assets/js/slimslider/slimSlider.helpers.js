export default class SliderHelpers {
  interval

  static clearInterval () {
    clearInterval(this.interval)
  }

  static wait (sec) {
    return new Promise((resolve) => { setTimeout(resolve, sec * 1000) })
  }

  static loop (sec) {
    return new Promise((resolve) => {
      clearInterval(this.interval)
      this.interval = setInterval(resolve, sec * 1000)
    })
  }

  static setElStyle (el, styleProp, value) {
    el.style[styleProp] = value
  }

  static setElClass (el, cssClass) {
    el.classList.add(cssClass)
  }

  static rmElClass (el, cssClass) {
    el.classList.remove(cssClass)
  }

  static setCssTransitionTiming (el, prop) {
    this.setElStyle(el, 'transitionTimingFunction', `${prop}`)
  }

  static wrapAround (el, wrapper) {
    console.log(el)
    console.log(wrapper);
    (el.length > 1 && el.nodeType !== 3) ? el.forEach(el => wrapper.appendChild(el)) : wrapper.appendChild(el)
    return wrapper
  }

  static isEven (value) {
    if (value % 2 === 0) { return true } else return false
  }

  static isFirst (value, slidesShow) {
    if ((value + 1) % slidesShow === 1) { return true } else return false
  }

  static isLast (value, slidesShow) {
    if ((value + 1) % slidesShow === 0) { return true } else return false
  }

  static createWrapperElement (cssClass, htmlElType = 'div') {
    const wrapper = document.createElement(htmlElType);
    (cssClass !== '') && SliderHelpers.setElClass(wrapper, cssClass)
    return wrapper
  }

  static waitForElement (querySelector, timeout) {
    return new Promise((resolve, reject) => {
      let timer = false
      const element = document.querySelectorAll(querySelector)
      if (element.length) return resolve()
      const observer = new MutationObserver(() => {
        if (element.length) {
          observer.disconnect()
          if (timer !== false) clearTimeout(timer)
          return resolve()
        }
      })
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
      if (timeout) {
        timer = setTimeout(() => {
          observer.disconnect()
          reject(new Error(`Failed to wait for element > ${element}`))
        }, timeout)
      }
    })
  }

  static createSvg (svgType, align = 'left', sectionsTotal) {
    const circle = document.createElement('div')
    circle.classList.add('slider-transition-overlay', align)
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.id = `${svgType}Svg`
    svg.classList.add(`${svgType}-amount-${sectionsTotal}`)
    svgType === 'circle' && (svg = this.createSvgCircles(svg, sectionsTotal))
    svgType === 'rect' && (svg = this.createSvgRects(svg, sectionsTotal))
    circle.appendChild(svg)
    return circle
  }

  static createSvgCircles (svg, sectionsTotal) {
    for (let i = 0; i < sectionsTotal; i++) {
      svg.innerHTML += `<circle id="circle${i}" class="circle${i}" cx="50%" cy="50%" r="${(100 / sectionsTotal * i)}%"></circle>`
    }
    return svg
  }

  static createSvgRects (svg, sectionsTotal) {
    for (let i = 0; i < sectionsTotal; i++) {
      svg.innerHTML += `<rect id="rect${i}" class="rect${i}" x="${100 / sectionsTotal * i}%" y="0" width="${100 / sectionsTotal}%" height="100%"></circle>`
    }
    return svg
  }

  static getLoadedElement (element, type) {
    const eventType = (type === 'video' ? 'seeked' : 'DOMContentLoaded')
    return new Promise(function (resolve, reject) {
      element.addEventListener(eventType, resolve)
      element.addEventListener('error', () => reject(new Error(`Failed to load img > ${element.src}`)), false)
      element.dispatchEvent(new Event(eventType))
    })
  }

  static startVideo (video, delay) {
    setTimeout(function () {
      video.currentTime = 0
      video.play()
    }, delay)
  }

  static pauseVideo (video, delay = 0) {
    setTimeout(function () {
      video.pause()
    }, delay)
  }

  static mergeOptions (defaultOptions, options) {
    const optionsSynced = {}
    Object.assign(optionsSynced, defaultOptions)
    optionsSynced.controls = {}
    for (const dataSetKey in options) {
      if (dataSetKey.includes('controls')) {
        const ctrlSubPropStr = dataSetKey.split('controls')[1].at(0).toLowerCase() + dataSetKey.split('controls')[1].substring(1)
        optionsSynced.controls[ctrlSubPropStr] = (Number.isInteger(Number(options[dataSetKey])) ? Number(options[dataSetKey]) : options[dataSetKey])
      } else if (dataSetKey.includes('overlay')) {
        const ctrlSubPropStr = dataSetKey.split('overlay')[1].at(0).toLowerCase() + dataSetKey.split('overlay')[1].substring(1)
        optionsSynced.overlay[ctrlSubPropStr] = (Number.isInteger(Number(options[dataSetKey])) ? Number(options[dataSetKey]) : options[dataSetKey])
      } else {
        optionsSynced[dataSetKey] = (Number.isInteger(Number(options[dataSetKey])) ? Number(options[dataSetKey]) : options[dataSetKey])
      }
    }
    console.log(optionsSynced)
    return optionsSynced
  }
}

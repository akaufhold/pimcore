const options = {
  autoplay: true,
  colorTheme: 'navy',
  controls: {
    arrows: true,
    direction: 'horizontal',
    dots: true,
    dotsCount: 'fitRows', /* fitRows or all/empty */
    events: true,
    keys: true,
    numbers: true,
    progressBar: true
  },
  events: {
    touch: {
      threshold: 100
    }
  },
  delay: 12,
  elementWrapperClass: 'slider-image-wrapper',
  elementType: 'picture',
  elementClass: 'slider-image',
  fontFamily: [
    'Catamaran:400,500,600,700,800,900',
    'Montserrat:400,500,600,700,800,900',
    'Lato:300,400,700,900'
  ],
  headerTag: 'h3',
  light: true,
  loop: true,
  margin: 0,
  overlay: {
    enabled: 'true',
    button: 'scale',
    style: 'circle'
  },
  progressClass: 'slider-progress',
  responsive: [
    {
      breakpoint: 1366,
      options: {
        slidesShow: 1,
        controls: {
          dots: false
        }
      }
    },
    {
      breakpoint: 1024,
      options: {
        slidesShow: 1
      }
    },
    {
      breakpoint: 768,
      options: {
        slidesShow: 1
      }
    }
  ],
  slidesShow: 1,
  slidesRowWrap: true,
  sliderClass: 'slider',
  sliderWrapperClass: 'slider-wrapper',
  sliderParallaxWrapperClass: 'slider-parallax',
  sliderLinkClass: 'slider-link',
  sliderInitClass: 'slider-init',
  transition: 'rect',
  transitionTiming: 'ease-out',
  transitionSegments: 10,
  transitionDuration: 2000,
  type: 'slider', /* slider or gallery */
  vignette: false,
  zoom: false
}

const transitions = {
  fade: 'opacity',
  slide: 'transform',
  rotate: 'transform',
  clip: 'clip',
  blur: 'transform',
  circle: 'stroke-width',
  rect: 'stroke-width',
  slices: 'transform',
  tiles: 'transform',
  'tiles-rotate': 'transform',
  shutter: 'transform'
}

export {options, transitions}

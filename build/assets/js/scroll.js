document.addEventListener('scroll', (e) => {
  let ticking
  const scollPosY = window.scrollY

  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (scollPosY > 0) {
        document.body.classList.add('is-scrolled')
      } else {
        document.body.classList.remove('is-scrolled')
      }
    })

    ticking = true
  }
})

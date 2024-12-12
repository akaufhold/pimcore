const bmClassName = 'burger-menu'

window.addEventListener('load', (event) => {
  const mainNavigation = document.getElementsByClassName('main-navigation')[0]
  document.getElementsByClassName(bmClassName)[0].addEventListener('click', function (e) {
    console.log(e)
    mainNavigation.classList.toggle('opened')
    e.target.classList.toggle('opened')
  })
})

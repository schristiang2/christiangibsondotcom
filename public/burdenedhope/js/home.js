/* Home: nav is transparent over the hero, then turns solid black once you scroll past it. */
(function () {
  var header = document.querySelector('header');
  var hero = document.querySelector('section[aria-label="Hero"]');
  if (!header || !hero) return;
  function update() {
    var solid = hero.getBoundingClientRect().bottom <= header.offsetHeight;
    header.style.backgroundColor = solid ? '#121110' : 'transparent';
    header.style.borderBottomColor = solid ? '#2A2724' : 'transparent';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

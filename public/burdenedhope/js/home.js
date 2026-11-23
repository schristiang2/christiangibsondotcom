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

/* Home, phones only: size the hero to the visitor's screen height so it fills the first screen exactly.
   Measured once on load and again on rotation or a real width change, not on every scroll,
   so the page doesn't jump when the phone's address bar shows or hides. Desktop is untouched. */
(function () {
  var hero = document.querySelector('section[aria-label="Hero"]');
  if (!hero) return;
  var phone = window.matchMedia('(max-width: 760px)');
  var lastWidth = 0;
  function size(force) {
    if (!phone.matches) { hero.style.removeProperty('--bh-hero-h'); return; }
    if (!force && window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    var top = hero.getBoundingClientRect().top + window.scrollY; // space above the hero (the announcement bar)
    hero.style.setProperty('--bh-hero-h', Math.max(window.innerHeight - top, 480) + 'px');
  }
  size(true);
  window.addEventListener('orientationchange', function () { setTimeout(function () { size(true); }, 250); });
  window.addEventListener('resize', function () { size(false); });
})();

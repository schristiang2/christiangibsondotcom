// Golf Monkey redesign preview — menus + back-to-top button.
(function () {
  // Desktop layout menu (shown at in-between widths)
  var header = document.querySelector('.gm-header');
  var btn = document.querySelector('.gm-menu');
  if (header && btn) {
    btn.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Mobile layout menu
  var mbtn = document.querySelector('.gm-mmenu');
  var mnav = document.getElementById('m-nav');
  if (mbtn && mnav) {
    mbtn.addEventListener('click', function () {
      var open = mnav.hasAttribute('hidden');
      if (open) mnav.removeAttribute('hidden'); else mnav.setAttribute('hidden', '');
      mbtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Floating back-to-top (desktop layout)
  var top = document.querySelector('.gm-top');
  if (top) {
    var update = function () {
      var doc = document.documentElement;
      var nearBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 700;
      top.classList.toggle('show', window.scrollY > 400 && nearBottom);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();

// Golf Monkey redesign preview — mobile menu + back-to-top button.
(function () {
  var header = document.querySelector('.gm-header');
  var btn = document.querySelector('.gm-menu');
  if (header && btn) {
    btn.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

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

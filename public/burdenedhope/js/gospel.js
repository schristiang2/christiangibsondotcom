/* The Gospel: "Read the Scripture" toggles. Scroll animations are pure CSS. */
(function () {
  document.querySelectorAll('[data-toggle]').forEach(function (btn) {
    var box = document.querySelector('[data-verses="' + btn.getAttribute('data-toggle') + '"]');
    if (!box) return;
    btn.addEventListener('click', function () {
      var opening = box.hidden;
      box.hidden = !opening;
      btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
      btn.firstChild.nodeValue = opening ? 'Hide Scripture' : 'Read the Scripture';
    });
  });
})();

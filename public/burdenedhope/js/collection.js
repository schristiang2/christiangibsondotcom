/* Collection: category filters. */
(function () {
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-cat]'));
  function pick(cat) {
    buttons.forEach(function (b) {
      var on = b.getAttribute('data-filter') === cat;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.background = on ? '#121110' : 'transparent';
      b.style.color = on ? '#F6F2EA' : '#121110';
    });
    cards.forEach(function (c) {
      c.style.display = (cat === 'All' || c.getAttribute('data-cat') === cat) ? '' : 'none';
    });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { pick(b.getAttribute('data-filter')); });
  });
})();

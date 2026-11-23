/* Product pages: color swatches swap the main photo, sizes update the price, add-to-cart counter (demo only).
   Each page describes its product in <script type="application/json" id="pdp-data">. */
(function () {
  var dataEl = document.getElementById('pdp-data');
  if (!dataEl) return;
  var d = JSON.parse(dataEl.textContent);
  var state = { color: 0, size: d.size, cart: 0 };
  var main = document.getElementById('pdp-main');
  var colorName = document.getElementById('pdp-color');
  var price = document.getElementById('pdp-price');
  var add = document.getElementById('pdp-add');
  var cart = document.getElementById('pdp-cart');
  var swatches = Array.prototype.slice.call(document.querySelectorAll('[data-swatch]'));
  var sizes = Array.prototype.slice.call(document.querySelectorAll('[data-size]'));

  // preload the color photos so swatches swap instantly
  d.colors.forEach(function (c) { var i = new Image(); i.src = c[1]; });

  function cost() { return (state.size && d.up[state.size]) || d.base; }

  function render() {
    var c = d.colors[state.color];
    main.src = c[1];
    main.alt = d.altFmt.replace('{c}', c[0]);
    if (colorName) colorName.textContent = c[0];
    price.textContent = '$' + cost();
    swatches.forEach(function (s, i) {
      var on = i === state.color;
      s.setAttribute('aria-pressed', on ? 'true' : 'false');
      s.style.boxShadow = on ? '0 0 0 3px #F6F2EA, 0 0 0 5px #121110' : 'none';
    });
    sizes.forEach(function (s) {
      var on = s.getAttribute('data-size') === state.size;
      s.setAttribute('aria-pressed', on ? 'true' : 'false');
      s.style.background = on ? '#121110' : 'transparent';
      s.style.color = on ? '#F6F2EA' : '#121110';
    });
    var label = d.colors.length > 1 ? c[0] : '';
    if (state.size) label += (label ? ', ' : '') + state.size;
    add.textContent = state.cart > 0 ? 'Added' + (label ? ' — ' + label : '') : 'Add to cart — $' + cost();
    if (cart) {
      cart.lastChild.nodeValue = String(state.cart);
      cart.setAttribute('aria-label', 'Cart, ' + state.cart + ' items');
    }
  }

  swatches.forEach(function (s) {
    s.addEventListener('click', function () { state.color = Number(s.getAttribute('data-swatch')); render(); });
  });
  sizes.forEach(function (s) {
    s.addEventListener('click', function () { state.size = s.getAttribute('data-size'); render(); });
  });
  add.addEventListener('click', function () { state.cart += 1; render(); });
  render();
})();

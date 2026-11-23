/* Product (The Brand Tee): color swatches swap the main photo, sizes update the price, add-to-cart counter. */
(function () {
  var colors = [
    ['Faded Khaki', '/burdenedhope/images/tee-khaki-back.jpg'], ['Faded Eucalyptus', '/burdenedhope/images/tee-eucalyptus-back.jpg'],
    ['Faded Bone', '/burdenedhope/images/tee-bone-back.jpg'], ['Faded White', '/burdenedhope/images/tee-white-back.jpg'],
    ['Faded Black', '/burdenedhope/images/tee-black-back.jpg'], ['Faded Coal', '/burdenedhope/images/tee-coal-back.jpg'],
    ['Faded Grey', '/burdenedhope/images/tee-grey-back.jpg'], ['Faded Indigo', '/burdenedhope/images/tee-indigo-back.jpg']
  ];
  var priceFor = { '2XL': 44, '3XL': 46 };
  var state = { color: 0, size: 'L', cart: 0 };
  var main = document.getElementById('pdp-main');
  var colorName = document.getElementById('pdp-color');
  var price = document.getElementById('pdp-price');
  var add = document.getElementById('pdp-add');
  var cart = document.getElementById('pdp-cart');
  var swatches = Array.prototype.slice.call(document.querySelectorAll('[data-swatch]'));
  var sizes = Array.prototype.slice.call(document.querySelectorAll('[data-size]'));
  // preload the color photos so swatches swap instantly
  colors.forEach(function (c) { var i = new Image(); i.src = c[1]; });
  function cost() { return priceFor[state.size] || 42; }
  function render() {
    var c = colors[state.color];
    main.src = c[1];
    main.alt = 'The Brand Tee in ' + c[0] + ', back print';
    colorName.textContent = c[0];
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
    add.textContent = state.cart > 0 ? 'Added — ' + c[0] + ', ' + state.size : 'Add to cart — $' + cost();
    cart.lastChild.nodeValue = String(state.cart);
    cart.setAttribute('aria-label', 'Cart, ' + state.cart + ' items');
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

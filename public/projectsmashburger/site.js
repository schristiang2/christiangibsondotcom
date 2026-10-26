// Project Smashburger pages: mobile menu, photo carousel, menu tabs + form submission.
(function () {
  // ---- Mobile menu (hamburger)
  var burger = document.querySelector('.ps-burger');
  var menu = document.getElementById('ps-menu');
  if (burger && menu) {
    var closeBtn = menu.querySelector('.ps-menu-close');
    var openMenu = function () {
      menu.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };
    var closeMenu = function () {
      menu.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      burger.focus();
    };
    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) closeMenu();
    });
  }

  // ---- "Follow us" photo carousel arrows (mobile)
  var track = document.querySelector('.ps-carousel');
  if (track) {
    var step = function (dir) {
      var w = track.clientWidth;
      var max = track.scrollWidth - w;
      var next = Math.round(track.scrollLeft / w) * w + dir * w;
      if (next > max + 1) next = 0;
      if (next < 0) next = max;
      track.scrollTo({ left: next, behavior: 'smooth' });
    };
    var prev = document.querySelector('.ps-prev');
    var nxt = document.querySelector('.ps-next');
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (nxt) nxt.addEventListener('click', function () { step(1); });
  }

  // ---- Menu tabs (home page)
  var tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pick = btn.getAttribute('data-tab');
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-tab') === pick;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.style.textDecoration = on ? 'underline' : 'none';
      });
      document.querySelectorAll('[data-panel]').forEach(function (p) {
        p.hidden = p.getAttribute('data-panel') !== pick;
      });
    });
  });

  // ---- Forms (booking, contact, newsletter)
  var FALLBACK =
    'Sorry, that didn’t go through. Please call (828) 398-9739 or email projectsmashburger@gmail.com.';

  document.querySelectorAll('form[data-ps-form]').forEach(function (form) {
    var kind = form.getAttribute('data-ps-form');
    var submit = form.querySelector('[type="submit"]');
    var success = form.parentElement.querySelector('[data-ps-success]');
    var formDisplay = form.style.display;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = { formType: kind };
      new FormData(form).forEach(function (v, k) {
        if (k === 'menu') (data.menu = data.menu || []).push(String(v));
        else data[k] = String(v);
      });

      var label = submit.textContent;
      submit.disabled = true;
      submit.textContent = 'Sending…';
      var err = form.querySelector('[data-ps-error]');
      if (err) err.remove();

      fetch('/api/projectsmashburger-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          if (kind === 'newsletter') {
            form.reset();
            submit.textContent = 'Thanks!';
            return;
          }
          if (success) {
            form.style.display = 'none';
            success.hidden = false;
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          submit.disabled = false;
          submit.textContent = label;
        })
        .catch(function () {
          submit.disabled = false;
          submit.textContent = label;
          var p = document.createElement('p');
          p.setAttribute('role', 'alert');
          p.setAttribute('data-ps-error', '');
          p.style.cssText = 'margin:0;font-size:14.68px;text-transform:none;flex-basis:100%;color:' +
            (kind === 'newsletter' ? '#000' : '#ff8a80');
          p.textContent = FALLBACK;
          form.appendChild(p);
        });
    });

    var reset = success && success.querySelector('[data-ps-reset]');
    if (reset) {
      reset.addEventListener('click', function () {
        form.reset();
        success.hidden = true;
        form.style.display = formDisplay;
      });
    }
  });
})();

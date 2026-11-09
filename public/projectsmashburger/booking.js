// Project Smashburger — "Book the Trailer" popup: one question at a time,
// choices advance automatically, review screen before sending.
(function () {
  var overlay = document.getElementById('bk-overlay');
  if (!overlay) return;

  var STEPS = [
    { key: 'hoa', q: 'Is the request for a neighborhood/HOA?', type: 'choice', row: true,
      options: ['Yes', 'No'] },
    { key: 'date', q: 'What is the date of your event?', type: 'fields',
      fields: [{ key: 'date', label: 'Event date', type: 'date' }] },
    { key: 'location', q: 'What is the location for your event?', type: 'fields',
      hint: 'Street address, venue or neighborhood name, and city.',
      fields: [{ key: 'location', label: 'Event location', type: 'text', autocomplete: 'street-address' }] },
    { key: 'hours', q: 'What are the hours of your event?', type: 'fields',
      fields: [{ key: 'startTime', label: 'Starts', type: 'time' }, { key: 'endTime', label: 'Ends', type: 'time' }] },
    { key: 'guests', q: 'How many people are you expecting?', type: 'fields',
      fields: [{ key: 'guests', label: 'Estimated guests', type: 'number', min: 1, inputmode: 'numeric' }] },
    { key: 'payment', q: 'Who is paying for the food?', type: 'choice',
      options: ['Everyone pays for their own food', 'One person or company is paying'] },
    { key: 'trucks', q: 'How many food trucks are you going to have at the event?',
      hint: 'Not including dessert and/or coffee.', type: 'choice', row: true,
      options: ['Just us', '2', '3', '4', '5+'] },
    { key: 'entryFee', q: 'What is the entry fee for the event?', type: 'fields',
      quick: 'No entry fee',
      fields: [{ key: 'entryFee', label: 'Entry fee', type: 'text', placeholder: 'e.g. $10 per person' }] },
    { key: 'contact', q: 'What is the best email or phone number to reach you?', type: 'fields',
      hint: 'Add an email, a phone number, or both.',
      needOne: ['email', 'phone'],
      fields: [
        { key: 'name', label: 'Your name', type: 'text', autocomplete: 'name' },
        { key: 'email', label: 'Email', type: 'email', autocomplete: 'email', optional: true },
        { key: 'phone', label: 'Phone number', type: 'tel', autocomplete: 'tel', optional: true }
      ] }
  ];

  var REVIEW = [
    ['hoa', 'Neighborhood/HOA?', 0], ['date', 'Date', 1], ['location', 'Location', 2],
    ['hours', 'Hours', 3], ['guests', 'People expected', 4], ['payment', 'Who pays', 5],
    ['trucks', 'Food trucks (not incl. dessert/coffee)', 6], ['entryFee', 'Entry fee', 7],
    ['name', 'Name', 8], ['email', 'Email', 8], ['phone', 'Phone', 8]
  ];

  var answers = {};
  var index = 0;
  var editing = false; // came from the review screen
  var lastFocus = null;

  var stage = overlay.querySelector('.bk-stage');
  var bar = overlay.querySelector('.bk-progress-bar');
  var count = overlay.querySelector('.bk-count');
  var closeBtn = overlay.querySelector('.bk-close');

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === 'class') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    if (text != null) e.textContent = text;
    return e;
  }

  function fmtDate(v) {
    if (!v) return '';
    var d = new Date(v + 'T12:00:00');
    return isNaN(d) ? v : d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
  }
  function fmtTime(v) {
    if (!v) return '';
    var p = v.split(':'), h = +p[0], m = p[1];
    return ((h % 12) || 12) + ':' + m + (h < 12 ? ' AM' : ' PM');
  }
  function display(key) {
    if (key === 'date') return fmtDate(answers.date);
    if (key === 'hours') return fmtTime(answers.startTime) + ' – ' + fmtTime(answers.endTime);
    return answers[key] || '';
  }

  function setProgress(i) {
    var total = STEPS.length;
    bar.style.width = Math.round((Math.min(i, total) / total) * 100) + '%';
    count.textContent = i < total ? 'Question ' + (i + 1) + ' of ' + total : 'Review your answers';
  }

  function navRow(showBack, nextLabel, onNext) {
    var nav = el('div', { class: 'bk-nav' });
    var back = el('button', { type: 'button', class: 'bk-back' }, '← Back');
    if (!showBack) back.hidden = true;
    back.addEventListener('click', function () { go(editing ? STEPS.length : index - 1); });
    nav.appendChild(back);
    if (onNext) {
      var right = el('div');
      right.appendChild(el('span', { class: 'bk-enter' }, 'or press Enter'));
      var next = el('button', { type: 'button', class: 'bk-primary' }, nextLabel);
      next.addEventListener('click', onNext);
      right.appendChild(next);
      nav.appendChild(right);
    }
    return nav;
  }

  // Each rendered step may move forward only once (guards double taps and
  // date pickers that fire 'change' more than once).
  var stepToken = 0;
  function advanceFrom(token) {
    if (token !== stepToken) return;
    stepToken++;
    go(editing ? STEPS.length : index + 1);
  }

  function renderStep(step) {
    var token = stepToken;
    var advance = function () { advanceFrom(token); };
    var wrap = el('div', { class: 'bk-step' });
    var qid = 'bk-q-' + step.key;
    wrap.appendChild(el('h2', { class: 'bk-q', id: qid, tabindex: '-1' }, step.q));
    if (step.hint) wrap.appendChild(el('p', { class: 'bk-hint' }, step.hint));
    var body = el('div', { class: 'bk-body' });
    wrap.appendChild(body);

    if (step.type === 'choice') {
      var group = el('div', { class: 'bk-choices' + (step.row ? ' bk-row' : ''), role: 'group', 'aria-labelledby': qid });
      step.options.forEach(function (opt) {
        var b = el('button', { type: 'button', class: 'bk-choice', 'aria-pressed': String(answers[step.key] === opt) }, opt);
        b.addEventListener('click', function () {
          answers[step.key] = opt;
          group.querySelectorAll('.bk-choice').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          setTimeout(advance, 220);
        });
        group.appendChild(b);
      });
      body.appendChild(group);
      wrap.appendChild(navRow(index > 0 || editing, null, null));
      return wrap;
    }

    var grid = el('div', { class: 'bk-fields' });
    var inputs = [];
    step.fields.forEach(function (f) {
      var id = 'bk-f-' + f.key;
      var field = el('div', { class: 'bk-field' });
      field.appendChild(el('label', { for: id }, f.label));
      var inp = el('input', { id: id, class: 'bk-input', type: f.type });
      if (!f.optional) inp.setAttribute('required', 'required');
      if (f.autocomplete) inp.setAttribute('autocomplete', f.autocomplete);
      if (f.placeholder) inp.setAttribute('placeholder', f.placeholder);
      if (f.min != null) inp.setAttribute('min', f.min);
      if (f.inputmode) inp.setAttribute('inputmode', f.inputmode);
      if (f.type === 'date') {
        var t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
        inp.setAttribute('min', t.toISOString().slice(0, 10));
      }
      inp.value = answers[f.key] || '';
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submitFields(); } });
      field.appendChild(inp);
      grid.appendChild(field);
      inputs.push({ f: f, inp: inp });
    });
    body.appendChild(grid);

    if (step.quick) {
      var quick = el('div', { class: 'bk-choices bk-row', style: 'margin-top: 14px' });
      var qb = el('button', { type: 'button', class: 'bk-choice', 'aria-pressed': String(answers[step.key] === step.quick) }, step.quick);
      qb.addEventListener('click', function () {
        answers[step.key] = step.quick;
        inputs[0].inp.value = '';
        qb.setAttribute('aria-pressed', 'true');
        setTimeout(advance, 220);
      });
      quick.appendChild(qb);
      body.appendChild(quick);
    }

    var err = el('p', { class: 'bk-err', role: 'alert' });
    body.appendChild(err);

    function submitFields() {
      for (var i = 0; i < inputs.length; i++) {
        var x = inputs[i], v = x.inp.value.trim();
        if (step.quick && !v && answers[step.key] === step.quick) continue;
        if (x.f.optional && !v) continue;
        if (!v || !x.inp.checkValidity()) {
          err.textContent = !v ? 'Please fill in ' + x.f.label.toLowerCase() + '.' : 'Please check ' + x.f.label.toLowerCase() + '.';
          x.inp.focus();
          return;
        }
      }
      if (step.needOne && !inputs.some(function (x) { return step.needOne.indexOf(x.f.key) > -1 && x.inp.value.trim(); })) {
        err.textContent = 'Please add an email or phone number so we can reach you.';
        inputs[1].inp.focus();
        return;
      }
      if (step.key === 'hours' && inputs[0].inp.value >= inputs[1].inp.value) {
        err.textContent = 'The end time should be after the start time.';
        inputs[1].inp.focus();
        return;
      }
      inputs.forEach(function (x) {
        var v = x.inp.value.trim();
        if (v) answers[x.f.key] = v; else if (x.f.optional) delete answers[x.f.key];
      });
      advance();
    }

    // Date pickers: picking a date moves on by itself.
    if (step.fields.length === 1 && step.fields[0].type === 'date') {
      inputs[0].inp.addEventListener('change', function () {
        if (inputs[0].inp.value && inputs[0].inp.checkValidity()) setTimeout(submitFields, 250);
      });
    }

    wrap.appendChild(navRow(index > 0 || editing, editing ? 'Save' : 'Next', submitFields));
    wrap._focus = inputs[0].inp;
    return wrap;
  }

  function renderReview() {
    var wrap = el('div', { class: 'bk-step' });
    wrap.appendChild(el('h2', { class: 'bk-q', tabindex: '-1' }, 'Look good?'));
    wrap.appendChild(el('p', { class: 'bk-hint' }, 'Check your answers before sending. Tap edit to change one.'));
    var list = el('ul', { class: 'bk-review' });
    REVIEW.forEach(function (r) {
      if ((r[0] === 'email' || r[0] === 'phone') && !answers[r[0]]) return;
      var li = el('li');
      var t = el('div', { class: 'bk-review-text' });
      t.appendChild(el('span', { class: 'bk-review-q' }, r[1]));
      t.appendChild(el('span', { class: 'bk-review-a' }, display(r[0])));
      li.appendChild(t);
      var edit = el('button', { type: 'button', class: 'bk-edit', 'aria-label': 'Edit ' + r[1] }, 'Edit');
      edit.addEventListener('click', function () { editing = true; go(r[2]); });
      li.appendChild(edit);
      list.appendChild(li);
    });
    var body = el('div', { class: 'bk-body' });
    body.appendChild(list);
    var err = el('p', { class: 'bk-err', role: 'alert' });
    body.appendChild(err);
    body.appendChild(el('p', { class: 'bk-hint' }, 'Sending a request doesn’t lock in your date — we’ll confirm with you by phone or email.'));
    wrap.appendChild(body);

    var nav = el('div', { class: 'bk-nav' });
    var back = el('button', { type: 'button', class: 'bk-back' }, '← Back');
    back.addEventListener('click', function () { editing = false; go(STEPS.length - 1); });
    var send = el('button', { type: 'button', class: 'bk-primary' }, 'Submit Request');
    send.addEventListener('click', function () {
      send.disabled = true;
      send.textContent = 'Sending…';
      err.textContent = '';
      var payload = { formType: 'booking' };
      for (var k in answers) payload[k] = answers[k];
      fetch('/api/projectsmashburger-form', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        renderDone();
      }).catch(function () {
        send.disabled = false;
        send.textContent = 'Submit Request';
        err.textContent = 'Sorry, that didn’t go through. Please call (828) 398-9739 or email projectsmashburger@gmail.com.';
      });
    });
    nav.appendChild(back);
    nav.appendChild(send);
    wrap.appendChild(nav);
    return wrap;
  }

  function renderDone() {
    bar.style.width = '100%';
    count.textContent = 'Sent';
    var wrap = el('div', { class: 'bk-step bk-done', role: 'status' });
    wrap.appendChild(el('h2', { class: 'bk-q', tabindex: '-1' }, 'Request received!'));
    wrap.appendChild(el('p', { class: 'bk-hint' }, 'Thanks for thinking of us. We’ll check the calendar and get back to you soon.'));
    var ok = el('button', { type: 'button', class: 'bk-primary', style: 'margin-top: 28px' }, 'Done');
    ok.addEventListener('click', function () { answers = {}; close(); });
    wrap.appendChild(ok);
    stage.replaceChildren(wrap);
    ok.focus();
  }

  function go(i) {
    stepToken++;
    index = Math.max(0, Math.min(i, STEPS.length));
    if (index === STEPS.length) editing = false;
    setProgress(index);
    var node = index < STEPS.length ? renderStep(STEPS[index]) : renderReview();
    stage.replaceChildren(node);
    var target = node._focus || node.querySelector('.bk-choice[aria-pressed="true"]') || node.querySelector('.bk-choice') || node.querySelector('.bk-q');
    if (target) target.focus({ preventScroll: true });
  }

  function open() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    editing = false;
    go(Object.keys(answers).length ? Math.min(index, STEPS.length) : 0);
  }
  function close() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-bk-open]').forEach(function (b) { b.addEventListener('click', open); });
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function (e) {
    if (overlay.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { // keep focus inside the popup
      var f = overlay.querySelectorAll('button:not([disabled]):not([hidden]), input');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  if (location.hash === '#start') open();
})();

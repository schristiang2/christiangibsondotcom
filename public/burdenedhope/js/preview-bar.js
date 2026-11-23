/* Concept preview bar: remove this file (and its <script> tag) when the site goes live. */
(function () {
  var pages = [
    ['/burdenedhope', 'Home'], ['/burdenedhope/collection', 'Collection'], ['/burdenedhope/product', 'Product'],
    ['/burdenedhope/gospel', 'The Gospel'], ['/burdenedhope/prelaunch', 'Pre-launch']
  ];
  var here = location.pathname.replace(/\/(index)?(\.html)?$/, '').replace(/\.html$/, '') || '/burdenedhope';
  var bar = document.createElement('nav');
  bar.setAttribute('aria-label', 'Concept pages');
  bar.className = 'bh-preview';
  var html = '<span class="bh-preview__by">BurdenedHope concept · Christian Gibson</span><span class="bh-preview__links">';
  pages.forEach(function (p) {
    html += '<a href="' + p[0] + '"' + (p[0] === here ? ' aria-current="page"' : '') + '>' + p[1] + '</a>';
  });
  html += '</span><button type="button" aria-label="Hide this bar">×</button>';
  bar.innerHTML = html;
  bar.querySelector('button').addEventListener('click', function () { bar.remove(); });
  var css = document.createElement('style');
  css.textContent = '.bh-preview{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:999;display:flex;align-items:center;gap:16px;max-width:calc(100% - 24px);padding:6px 6px 6px 18px;background:rgba(18,17,16,.94);color:#ECE5D8;border:1px solid #3A3631;font:14px/1.2 "EB Garamond",Georgia,serif;box-shadow:0 6px 24px rgba(0,0,0,.25)}' +
    '.bh-preview__by{color:#C9B48A;white-space:nowrap}' +
    '.bh-preview__links{display:flex;gap:14px;overflow-x:auto;white-space:nowrap}' +
    '.bh-preview a{color:#ECE5D8;text-decoration:none;padding:10px 0}.bh-preview a[aria-current]{text-decoration:underline;text-underline-offset:5px}' +
    '.bh-preview button{background:none;border:0;color:#B5AC9F;font-size:20px;width:36px;height:36px;cursor:pointer}' +
    '@media (max-width:760px){.bh-preview{display:none}}';
  document.head.appendChild(css);
  document.body.appendChild(bar);
})();

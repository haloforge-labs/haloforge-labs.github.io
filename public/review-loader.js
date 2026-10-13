(function () {
  try {
    var flag = new URLSearchParams(location.search).get('review');
    if (flag === '1') localStorage.setItem('hf-review', '1');
    if (flag === '0') localStorage.removeItem('hf-review');
    if (localStorage.getItem('hf-review') !== '1') return;
  } catch (e) { return; }
  var accent = '';
  try { accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(); } catch (e) {}
  var s = document.createElement('script');
  s.src = '/vendor/annotate-1.5.3.js';
  s.defer = true;
  s.dataset.project = 'haloforge-site';
  s.dataset.accent = accent || '#a00000';
  s.dataset.note = 'Review round. Highlight text, draw a box or drop a pin, then export your notes as JSON and send the file.';
  document.head.appendChild(s);
})();

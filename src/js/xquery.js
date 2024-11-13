function _(e) { if(!e) return e; e.$ = (q) => $(q, e); e.$$ = (q) => $$(q, e); e._$ = (q) => _$(q, e); return e; }
function $(q, e = document) { r = e.querySelector(q); return _(r); }
function $$(q, e = document) { r = [...e.querySelectorAll(q)]; r.map((j) => _(j)); return r; }
function _$(q, e = document) { r = document.createElement(q); e.appendChild(r); return _(r); }

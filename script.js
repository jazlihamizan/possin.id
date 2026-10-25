/* ============================================================
   Possin v2 — interaksi
   ============================================================ */
(function(){
  /* Reset scroll ke atas saat memuat ulang (kecuali ada hash) */
  try{history.scrollRestoration='manual';}catch(e){}
  if(!location.hash)window.scrollTo(0,0);
})();

/* ---- Menu mobile: buka/tutup di dalam pill navbar ---- */
(function(){
  var b=document.getElementById('burger'),m=document.getElementById('mobileMenu');
  if(!b||!m)return;
  function set(v){
    m.classList.toggle('open',v);
    b.setAttribute('aria-expanded',v?'true':'false');
    b.setAttribute('aria-label',v?'Tutup menu':'Buka menu');
  }
  b.addEventListener('click',function(){set(!m.classList.contains('open'))});
  m.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
  window.matchMedia('(min-width:901px)').addEventListener('change',function(e){if(e.matches)set(false)});
})();

/* ---- Navbar: sembunyi saat scroll ke bawah, muncul saat scroll ke atas ---- */
(function(){
  var s=document.getElementById('navShell');
  if(!s)return;
  var lastY=window.scrollY;
  function onScroll(){
    var y=window.scrollY,menu=document.getElementById('mobileMenu');
    if(menu&&menu.classList.contains('open')){lastY=y;return}
    if(y<90){s.classList.remove('nav-hide');lastY=y;return}
    if(y>lastY+6){s.classList.add('nav-hide');lastY=y}
    else if(y<lastY-6){s.classList.remove('nav-hide');lastY=y}
  }
  window.addEventListener('scroll',onScroll,{passive:true});
})();

/* ---- Tombol scroll-to-top ---- */
(function(){
  var t=document.getElementById('scrollTop');
  if(!t)return;
  function onScroll(){t.classList.toggle('show',window.scrollY>600)}
  window.addEventListener('scroll',onScroll,{passive:true});
  t.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
})();

/* ---- Reveal: animasi masuk saat elemen terlihat ---- */
(function(){
  var els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver'in window)||!els.length)return;
  document.documentElement.classList.add('rv-js');
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:.12});
  els.forEach(function(el){io.observe(el)});
})();

/* ---- Form contact: susun pesan WhatsApp dari input nama + pesan ---- */
(function(){
  var f=document.querySelector('form[data-wa]');
  if(!f)return;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var n=(f.querySelector('[name=nama]')||{}).value||'';
    var p=(f.querySelector('[name=pesan]')||{}).value||'';
    var t='Halo Possin, saya'+(n?' '+n:'')+'. '+(p?p:'');
    window.open('https://wa.me/6285721631961?text='+encodeURIComponent(t),'_blank','noopener');
  });
})();

/* ---- Filter kategori blog (halaman blog) ---- */
(function(){
  var bar=document.querySelector('.filter-bar');
  if(!bar)return;
  var btns=Array.prototype.slice.call(bar.querySelectorAll('.filter-btn'));
  var cards=Array.prototype.slice.call(document.querySelectorAll('.post-card'));
  if(!btns.length||!cards.length)return;
  function apply(cat){
    btns.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-filter')===cat?'true':'false')});
    cards.forEach(function(c){c.hidden=!(cat==='semua'||c.getAttribute('data-cat')===cat)});
  }
  bar.addEventListener('click',function(e){
    var b=e.target.closest('.filter-btn');
    if(b)apply(b.getAttribute('data-filter'));
  });
})();

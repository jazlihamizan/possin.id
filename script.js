(function(){
  var b=document.querySelector('.burger'),o=document.getElementById('menu-hp');
  if(!b||!o)return;
  function set(v){
    o.classList.toggle('open',v);
    o.inert=!v;
    b.setAttribute('aria-expanded',v?'true':'false');
    b.setAttribute('aria-label',v?'Tutup menu':'Buka menu');
    document.documentElement.classList.toggle('lock',v);
  }
  set(false);
  b.addEventListener('click',function(){set(!o.classList.contains('open'))});
  o.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
  window.matchMedia('(min-width:701px)').addEventListener('change',function(e){if(e.matches)set(false)});
})();

/* Filter kategori blog: hanya jalan di halaman yang punya .filter-bar */
(function(){
  var bar=document.querySelector('.filter-bar');
  if(!bar)return;
  var btns=Array.prototype.slice.call(bar.querySelectorAll('.filter-btn'));
  var cards=Array.prototype.slice.call(document.querySelectorAll('.post-card'));
  if(!btns.length||!cards.length)return;
  function apply(cat){
    btns.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-filter')===cat?'true':'false')});
    cards.forEach(function(c){
      var show=(cat==='semua'||c.getAttribute('data-cat')===cat);
      c.hidden=!show;
    });
  }
  bar.addEventListener('click',function(e){
    var b=e.target.closest('.filter-btn');
    if(b)apply(b.getAttribute('data-filter'));
  });
})();

/* Reveal demo fitur: hanya jalan di halaman yang punya .df-reveal */
(function(){
  var els=document.querySelectorAll('.df-reveal');
  if(!('IntersectionObserver' in window)||!els.length)return;
  document.documentElement.classList.add('df-js');
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.15});
  els.forEach(function(el){io.observe(el);});
})();

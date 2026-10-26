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
  var els=document.querySelectorAll('.reveal,.reveal-wipe');
  if(!('IntersectionObserver'in window)||!els.length)return;
  document.documentElement.classList.add('rv-js');
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:.12});
  els.forEach(function(el){io.observe(el)});
})();

/* ---- Ground shift: lapisan warna dasar yang bergerak hangat saat section berganti ---- */
(function(){
  if(!('IntersectionObserver'in window))return;
  var layer=document.createElement('div');
  layer.className='bg-shift';
  layer.setAttribute('aria-hidden','true');
  document.body.insertBefore(layer,document.body.firstChild);
  var secs=document.querySelectorAll('[data-bg]');
  if(!secs.length)return;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting)layer.style.setProperty('--bgcur',e.target.getAttribute('data-bg'));
    });
  },{rootMargin:'-40% 0px -40% 0px'});
  secs.forEach(function(s){io.observe(s)});
})();

/* ---- Kinetik: judul menyusun kata demi kata saat pertama kali terlihat ---- */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!('IntersectionObserver'in window))return;
  var heads=document.querySelectorAll('.hero h1,.sec-head h2,.cta-band h2,.page-hero h1,.df-hero h1');
  if(!heads.length)return;
  function split(el){
    var frag=document.createDocumentFragment(),i=0;
    Array.prototype.forEach.call(el.childNodes,function(n){
      if(n.nodeType===3){
        n.textContent.split(/(\s+)/).forEach(function(w){
          if(w.trim()){
            var s=document.createElement('span');s.className='kw';s.textContent=w;
            s.style.setProperty('--i',i++);
            frag.appendChild(s);
          }else frag.appendChild(document.createTextNode(w));
        });
      }else if(n.nodeType===1){
        var s=document.createElement('span');s.className='kw';s.appendChild(n);
        s.style.setProperty('--i',i++);
        frag.appendChild(s);
      }else frag.appendChild(n);
    });
    el.textContent='';el.appendChild(frag);
  }
  heads.forEach(split);
  document.documentElement.classList.add('kw-js');
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('kw-in');io.unobserve(e.target)}
    });
  },{threshold:.15});
  heads.forEach(function(h){io.observe(h)});
  /* pengaman: IOkadang tidak memicu di lingkungan tertentu; pastikan kata tetap muncul */
  var ticking=false;
  function sweep(){
    var vh=(window.innerHeight||0)*.92;
    heads.forEach(function(h){
      if(!h.classList.contains('kw-in')&&h.getBoundingClientRect().top<vh)h.classList.add('kw-in');
    });
    ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ticking=true;requestAnimationFrame(sweep)}
  },{passive:true});
})();

/* ---- Hero depth: parallax multi-bidang + tilt ringan mengikuti kursor ---- */
(function(){
  var stage=document.querySelector('.hero-stage');
  if(!stage)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  var lowEnd=(navigator.deviceMemory&&navigator.deviceMemory<=4)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);
  if(lowEnd)return;
  var mqMobile=window.matchMedia('(max-width:767px)');
  var planes=[
    {s:'.hs-app',f:.18},{s:'.hs-woman',f:.35},{s:'.hs-floor',f:.5},
    {s:'.hs-receipt',f:.6},{s:'.hs-sales',f:.75}
  ].map(function(p){return{sel:p.s,f:p.f,el:stage.querySelector(p.s)}}).filter(function(p){return p.el});
  var ticking=false;
  function apply(){
    var r=stage.getBoundingClientRect(),vh=window.innerHeight||1;
    var prog=(vh/2-(r.top+r.height/2))/(vh/2+r.height/2);
    var amp=mqMobile.matches?42:120;
    planes.forEach(function(p){
      var y=Math.max(-amp,Math.min(amp,-prog*p.f*amp*1.5));
      p.el.style.setProperty('--py',y+'px');
    });
    ticking=false;
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(apply)}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  apply();
  /* tilt: hanya perangkat dengan pointer presisi */
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(!fine||mqMobile.matches)return;
  var visual=document.querySelector('.hero-visual');
  var tilt=false;
  visual.addEventListener('pointermove',function(e){
    if(!tilt){tilt=true;requestAnimationFrame(function(){
      var r=visual.getBoundingClientRect();
      var tx=((e.clientY-r.top)/r.height-.5)*-4;
      var ty=((e.clientX-r.left)/r.width-.5)*4;
      stage.style.setProperty('--tx',tx.toFixed(2)+'deg');
      stage.style.setProperty('--ty',ty.toFixed(2)+'deg');
      tilt=false;
    })}
  });
  visual.addEventListener('pointerleave',function(){
    stage.style.setProperty('--tx','0deg');stage.style.setProperty('--ty','0deg');
  });
})();

/* ---- Signature move: garis coret tergambar + angka menghitung naik ---- */
(function(){
  var box=document.querySelector('.total-harga');
  if(!box)return;
  var numEl=box.querySelector('.total-price');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!numEl){return}
  var target=parseInt((numEl.textContent||'').replace(/\D/g,''),10);
  if(!target)return;
  var fmt=function(n){return 'Rp'+n.toLocaleString('id-ID')};
  if(reduce||!('IntersectionObserver'in window)){return}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      io.disconnect();
      var start=null,dur=900;
      numEl.textContent=fmt(0);
      requestAnimationFrame(function step(t){
        if(!start)start=t;
        var p=Math.min(1,(t-start)/dur);
        var ease=1-Math.pow(1-p,3);
        numEl.textContent=fmt(Math.round(ease*target));
        if(p<1)requestAnimationFrame(step);else numEl.textContent=fmt(target);
      });
    });
  },{threshold:.3});
  io.observe(box);
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

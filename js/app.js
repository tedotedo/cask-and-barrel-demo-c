(function(){
'use strict';
var D=document;
// banner dismiss
var bn=D.querySelector('.banner-close');if(bn)bn.addEventListener('click',function(){D.querySelector('.banner').hidden=true;});
// mobile nav
var t=D.querySelector('.menu-toggle'),nav=D.getElementById('site-nav');
if(t&&nav){t.addEventListener('click',function(){var o=t.getAttribute('aria-expanded')==='true';t.setAttribute('aria-expanded',String(!o));nav.classList.toggle('open',!o);});
nav.addEventListener('click',function(e){if(e.target.tagName==='A'){t.setAttribute('aria-expanded','false');nav.classList.remove('open');}});}
// open now (Europe/London)
function openNow(){
 var el=D.querySelectorAll('[data-open-now]');if(!el.length)return;
 var H=JSON.parse(D.getElementById('hours-data').textContent);
 var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date()),g={};
 p.forEach(function(x){g[x.type]=x.value;});
 var day=g.weekday.toLowerCase().slice(0,3),mins=(+g.hour%24)*60+ +g.minute,h=H[day],txt,open=false;
 function m(s){var a=s.split(':');return +a[0]*60+ +a[1];}
 if(!h){txt='Today’s hours aren’t confirmed – ask at the bar';}
 else if(h.closed){txt='Closed today';}
 else if(mins>=m(h.open)&&mins<m(h.close)){open=true;txt='Open now · until '+h.close;}
 else if(mins<m(h.open)){txt='Closed · opens today at '+h.open;}
 else{txt='Closed for today';}
 el.forEach(function(e){e.textContent=txt;e.classList.toggle('is-open',open);});
 var row=D.querySelector('[data-day="'+day+'"]');if(row)row.classList.add('today');
}
openNow();
// lightbox
var dlg=D.getElementById('lb');
if(dlg&&dlg.showModal){
 var R=JSON.parse(D.getElementById('ranges-data').textContent),last=null;
 function pic(i,w,h){return '<img src="'+i.base+'.jpg" width="'+(i.width||1024)+'" height="'+(i.height||576)+'" alt="'+i.alt.replace(/"/g,'&quot;')+'" decoding="async">';}
 D.addEventListener('click',function(e){
  var b=e.target.closest('[data-range]');
  if(b){var r=R[b.getAttribute('data-range')];if(!r)return;last=b;
   D.getElementById('lb-title').textContent=r.title;
   D.getElementById('lb-body').innerHTML='<figure>'+pic(r.glass)+'<figcaption>'+r.glass.caption+'</figcaption></figure><figure>'+pic(r.image)+'<figcaption>'+r.caption+'</figcaption></figure>';
   dlg.showModal();return;}
  if(e.target===dlg||e.target.closest('[data-close]')){dlg.close();}
 });
 dlg.addEventListener('close',function(){if(last)last.focus();});
}
// reveal
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var items=D.querySelectorAll('.reveal');
if(rm||!('IntersectionObserver' in window)){items.forEach(function(i){i.classList.add('in');});}
else{var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{rootMargin:'0px 0px -8% 0px'});items.forEach(function(i){io.observe(i);});}
// videos: play only when visible, never under reduced motion
D.querySelectorAll('video[data-lazyvid]').forEach(function(v){
 if(rm){v.removeAttribute('autoplay');v.controls=true;return;}
 if(!('IntersectionObserver' in window))return;
 new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){});}else v.pause();});},{threshold:.25}).observe(v);
});
})();

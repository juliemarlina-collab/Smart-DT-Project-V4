/* js/smartdt-assets.js */
/* Centralised local asset source for Smart DT Project. */
(function(){
  'use strict';

  const A = {
    brand:{ logo:'assets/brand/smartdt-logo.svg' },
    heroes:{
      welcome:'assets/heroes/welcome.svg',
      registration:'assets/heroes/registration.svg',
      login:'assets/heroes/login.svg',
      dashboard:'assets/heroes/dashboard.svg',
      empathy:'assets/heroes/phase-01-empathy.svg',
      define:'assets/heroes/phase-02-define.svg',
      ideation:'assets/heroes/phase-03-ideation.svg',
      prototype:'assets/heroes/phase-04-prototype.svg',
      test:'assets/heroes/phase-05-test.svg',
      progress:'assets/heroes/progress.svg',
      profile:'assets/heroes/profile.svg'
    },
    nav:{
      dashboard:'assets/icons/nav-dashboard.svg',
      learn:'assets/icons/nav-learn.svg',
      projects:'assets/icons/nav-projects.svg',
      progress:'assets/icons/nav-progress.svg',
      profile:'assets/icons/nav-profile.svg'
    }
  };
  window.SMART_DT_ASSETS = A;

  const legacyMap = {
    'https://iili.io/Cd3i8QV.png':A.brand.logo,
    'https://iili.io/Cdztj2e.png':A.heroes.welcome,
    'https://iili.io/CdztVBS.png':A.heroes.registration,
    'https://iili.io/CdztWE7.png':A.heroes.login,
    'https://iili.io/CdztX49.png':A.heroes.dashboard,
    'https://iili.io/CdztwYu.png':A.heroes.empathy,
    'https://iili.io/CdztNkb.png':A.heroes.define,
    'https://iili.io/CdztOpj.png':A.heroes.ideation,
    'https://iili.io/CdztkTx.png':A.heroes.prototype,
    'https://iili.io/CdztLDv.png':A.heroes.prototype,
    'https://iili.io/CdztvhQ.png':A.heroes.test,
    'https://iili.io/CdztgEP.png':A.heroes.progress,
    'https://iili.io/Cdztr41.png':A.heroes.profile,
    'https://iili.io/Cd3ksWu.png':A.nav.dashboard,
    'https://iili.io/Cd3wdpn.png':A.nav.learn,
    'https://iili.io/Cd3kixe.png':A.nav.projects,
    'https://iili.io/Cd3k4O7.png':A.nav.progress,
    'https://iili.io/Cd3k6b9.png':A.nav.profile
  };

  function replaceLegacyImages(){
    document.querySelectorAll('img').forEach(img=>{
      const src = img.getAttribute('src') || '';
      if(legacyMap[src]) img.setAttribute('src', legacyMap[src]);
    });
  }

  const css = `
  :root{--smart-phone:430px;--smart-tablet:900px;--smart-desktop:1200px;}
  .app{width:100%!important;max-width:var(--smart-phone)!important;margin:0 auto!important;min-height:100vh!important;overflow-x:hidden!important;}
  .page{width:100%!important;padding-left:16px!important;padding-right:16px!important;padding-bottom:98px!important;}
  .hero-card,.hero-card.compact{width:100%!important;max-width:100%!important;margin:14px auto 18px!important;padding:10px!important;border-radius:28px!important;overflow:hidden!important;background:#fff!important;display:flex!important;justify-content:center!important;align-items:center!important;}
  .hero-card img,.hero-card.compact img,.hero-img-wide{width:100%!important;max-width:450px!important;height:auto!important;max-height:220px!important;object-fit:contain!important;object-position:center center!important;display:block!important;transform:none!important;background:#fff!important;}
  .bottom-nav{position:fixed!important;bottom:0!important;left:50%!important;transform:translateX(-50%)!important;width:100%!important;max-width:var(--smart-phone)!important;height:74px!important;display:grid!important;grid-template-columns:repeat(5,1fr)!important;background:#fff!important;z-index:1000!important;}
  .bottom-nav img,.nav-icon-img{width:24px!important;height:24px!important;min-width:24px!important;min-height:24px!important;max-width:24px!important;max-height:24px!important;object-fit:contain!important;}
  .bottom-nav .nav-label{font-size:10.5px!important;line-height:1.1!important;white-space:nowrap!important;font-weight:700!important;}
  .badge-grid-v9{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;}
  #gateList,.gate-list-v9,.gate-lock-screen,.gate-await-notice,.supervisor-gate-section,[data-gate]{display:none!important;}
  @media (min-width:600px) and (max-width:1023px){.app{max-width:var(--smart-tablet)!important}.bottom-nav{max-width:var(--smart-tablet)!important;height:80px!important}.page{padding-left:36px!important;padding-right:36px!important}.hero-card,.hero-card.compact{max-width:820px!important;margin-top:20px!important;margin-bottom:24px!important}.hero-card img,.hero-card.compact img,.hero-img-wide{max-width:620px!important;max-height:280px!important}.badge-grid-v9{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
  @media (min-width:1024px){.app{max-width:var(--smart-desktop)!important}.bottom-nav{max-width:var(--smart-desktop)!important}.page{padding-left:48px!important;padding-right:48px!important}.hero-card,.hero-card.compact{max-width:980px!important;margin-top:24px!important;margin-bottom:28px!important}.hero-card img,.hero-card.compact img,.hero-img-wide{max-width:760px!important;max-height:300px!important}.intro-card,.overall-card-v9,.progress-section-v9,.card{max-width:1040px!important;margin-left:auto!important;margin-right:auto!important}.badge-grid-v9{grid-template-columns:repeat(4,minmax(0,1fr))!important}}
  `;

  function inject(){
    if(!document.getElementById('smartdt-universal-layout-fix')){
      const style=document.createElement('style');
      style.id='smartdt-universal-layout-fix';
      style.textContent=css;
      document.head.appendChild(style);
    }
    replaceLegacyImages();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',inject);
  else inject();
})();
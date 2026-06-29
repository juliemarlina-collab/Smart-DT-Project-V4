/* js/smartdt-assets.js */
/* Smart DT One-File Universal Layout Fix
   Replace this file only. It runs on every page that already loads smartdt-assets.js.
   Purpose: make Dashboard, Phase pages, Projects, Profile and Progress use the same responsive layout and hero sizing.
*/

(function () {
  "use strict";

  /* Minimal asset map preserved for safety */
  window.SMART_DT_ASSETS = window.SMART_DT_ASSETS || {
    brand: {
      logo: "https://iili.io/Cd3i8QV.png"
    },
    heroes: {
      welcome: "https://iili.io/Cdztj2e.png",
      registration: "https://iili.io/CdztVBS.png",
      login: "https://iili.io/CdztWE7.png",
      dashboard: "https://iili.io/CdztX49.png",
      empathy: "https://iili.io/CdztwYu.png",
      define: "https://iili.io/CdztNkb.png",
      ideation: "https://iili.io/CdztOpj.png",
      prototype: "https://iili.io/CdztkTx.png",
      test: "https://iili.io/CdztvhQ.png",
      progress: "https://iili.io/CdztgEP.png",
      profile: "https://iili.io/Cdztr41.png"
    },
    nav: {
      dashboard: "https://iili.io/Cd3ksWu.png",
      learn: "https://iili.io/Cd3wdpn.png",
      projects: "https://iili.io/Cd3kixe.png",
      progress: "https://iili.io/Cd3k4O7.png",
      profile: "https://iili.io/Cd3k6b9.png"
    }
  };

  const css = `
/* Injected by js/smartdt-assets.js — applies to all pages */
:root{
  --smart-phone:430px;
  --smart-tablet:900px;
  --smart-desktop:1200px;
}

/* App shell: phone / tablet / PC */
.app{
  width:100% !important;
  max-width:var(--smart-phone) !important;
  margin:0 auto !important;
  min-height:100vh !important;
  overflow-x:hidden !important;
}

.page{
  width:100% !important;
  padding-left:16px !important;
  padding-right:16px !important;
  padding-bottom:98px !important;
}

/* Universal hero layout for existing pages */
.hero-card,
.hero-card.compact{
  width:100% !important;
  max-width:100% !important;
  margin:14px auto 18px !important;
  padding:10px !important;
  border-radius:28px !important;
  overflow:hidden !important;
  background:#fff !important;
  display:flex !important;
  justify-content:center !important;
  align-items:center !important;
}

.hero-card img,
.hero-card.compact img,
.hero-img-wide{
  width:100% !important;
  max-width:450px !important;
  height:auto !important;
  max-height:220px !important;
  object-fit:contain !important;
  object-position:center center !important;
  display:block !important;
  transform:none !important;
  background:#fff !important;
}

/* Dashboard cards */
.dashboard-container{
  width:100% !important;
  max-width:1200px !important;
  margin:0 auto !important;
  padding:1rem !important;
}

.dashboard-grid{
  display:grid !important;
  grid-template-columns:1fr !important;
  gap:1rem !important;
  margin-bottom:80px !important;
}

.dashboard-card{
  background:#fff !important;
  border-radius:18px !important;
  padding:1.25rem !important;
  box-shadow:0 10px 26px rgba(8,27,68,.06) !important;
  border:1px solid #e2e8f0 !important;
}

/* Hide old supervisor gate UI */
#gateList,
.gate-list-v9,
.gate-lock-screen,
.gate-await-notice,
.supervisor-gate-section,
[data-gate]{
  display:none !important;
}

/* Bottom nav control */
.bottom-nav{
  position:fixed !important;
  bottom:0 !important;
  left:50% !important;
  transform:translateX(-50%) !important;
  width:100% !important;
  max-width:var(--smart-phone) !important;
  height:74px !important;
  display:grid !important;
  grid-template-columns:repeat(5,1fr) !important;
  background:#fff !important;
  z-index:1000 !important;
}

.bottom-nav img,
.nav-icon-img,
.nav-item svg{
  width:24px !important;
  height:24px !important;
  min-width:24px !important;
  min-height:24px !important;
  max-width:24px !important;
  max-height:24px !important;
  object-fit:contain !important;
}

.bottom-nav .nav-label{
  font-size:10.5px !important;
  line-height:1.1 !important;
  white-space:nowrap !important;
  font-weight:700 !important;
}

/* Badge grid */
.badge-grid-v9{
  display:grid !important;
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  gap:12px !important;
}

/* Tablet */
@media (min-width:600px) and (max-width:1023px){
  .app{
    max-width:var(--smart-tablet) !important;
  }

  .bottom-nav{
    max-width:var(--smart-tablet) !important;
    height:80px !important;
  }

  .page{
    padding-left:36px !important;
    padding-right:36px !important;
  }

  .hero-card,
  .hero-card.compact{
    max-width:820px !important;
    margin-top:20px !important;
    margin-bottom:24px !important;
  }

  .hero-card img,
  .hero-card.compact img,
  .hero-img-wide{
    max-width:620px !important;
    max-height:280px !important;
  }

  .progress-page .hero-card img,
  .progress-page .hero-card.compact img,
  .progress-page .hero-img-wide{
    max-width:720px !important;
    max-height:300px !important;
  }

  .dashboard-grid{
    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
    gap:1.25rem !important;
  }

  .badge-grid-v9{
    grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  }
}

/* Desktop / PC */
@media (min-width:1024px){
  .app{
    max-width:var(--smart-desktop) !important;
  }

  .bottom-nav{
    max-width:var(--smart-desktop) !important;
  }

  .page{
    padding-left:48px !important;
    padding-right:48px !important;
  }

  .hero-card,
  .hero-card.compact{
    max-width:980px !important;
    margin-top:24px !important;
    margin-bottom:28px !important;
  }

  .hero-card img,
  .hero-card.compact img,
  .hero-img-wide{
    max-width:760px !important;
    max-height:300px !important;
  }

  .progress-page .hero-card img,
  .progress-page .hero-card.compact img,
  .progress-page .hero-img-wide{
    max-width:860px !important;
    max-height:320px !important;
  }

  .intro-card,
  .overall-card-v9,
  .progress-section-v9,
  .card{
    max-width:1040px !important;
    margin-left:auto !important;
    margin-right:auto !important;
  }

  .dashboard-grid{
    grid-template-columns:repeat(3,minmax(0,1fr)) !important;
    margin-bottom:0 !important;
  }

  .badge-grid-v9{
    grid-template-columns:repeat(4,minmax(0,1fr)) !important;
  }
}
`;

  function injectSmartDTLayoutFix() {
    if (document.getElementById("smartdt-universal-layout-fix")) return;
    const style = document.createElement("style");
    style.id = "smartdt-universal-layout-fix";
    style.textContent = css;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectSmartDTLayoutFix);
  } else {
    injectSmartDTLayoutFix();
  }
})();

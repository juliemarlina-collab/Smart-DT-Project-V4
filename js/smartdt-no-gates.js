/* Smart DT V4 Fix 01: remove supervisor gates without changing templates yet */
(function(){
  'use strict';
  const routes={
    '01':'phase01-empathy.html',
    '02':'phase02-define.html',
    '03':'phase03-ideation.html',
    '04':'phase04-prototype.html',
    '05':'phase05-test.html'
  };
  function unlock(){
    try{
      ['1','2','3'].forEach(n=>localStorage.setItem('df_gate_'+n,'approved'));
      ['01','02','03','04','05'].forEach(ph=>{
        localStorage.setItem('df_unlocked_phase'+ph,'true');
      });
    }catch(e){}
  }
  function nextOpenPhase(){
    try{
      for(let i=1;i<=5;i++){
        const ph=String(i).padStart(2,'0');
        if(localStorage.getItem('df_submitted_phase'+ph)!=='true') return ph;
      }
    }catch(e){}
    return '05';
  }
  function cleanText(){
    document.querySelectorAll('body *').forEach(el=>{
      if(el.children.length || !el.textContent) return;
      el.textContent=el.textContent
        .replace(/Supervisor Feedback/gi,'Submission Status')
        .replace(/Gate approval and comments/gi,'Draft · Submitted · Updated')
        .replace(/Supervisor Gate/gi,'Final Submission')
        .replace(/Gate 1|Gate 2|Gate 3/gi,'Submit Final')
        .replace(/supervisor feedback will appear after submissions and gate reviews/gi,'Submission status will appear after you save drafts and submit final work.')
        .replace(/sent to your supervisor/gi,'saved as final submission');
    });
  }
  function removeLocks(){
    const lock=document.getElementById('gateLockScreen');
    if(lock) lock.remove();
    const main=document.querySelector('main');
    if(main) main.style.display='';
    document.querySelectorAll('[data-tab="templatesPanel"]').forEach(tab=>{
      tab.classList.remove('locked');
      tab.removeAttribute('aria-disabled');
      tab.title='Templates unlocked';
      const note=tab.querySelector('.lock-note');
      if(note) note.remove();
    });
  }
  function patchButtons(){
    document.querySelectorAll('[data-continue]').forEach(btn=>{
      if(btn.dataset.noGatePatched) return;
      btn.dataset.noGatePatched='true';
      btn.addEventListener('click',e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        const ph=nextOpenPhase();
        location.href=routes[ph]||routes['01'];
      },true);
    });
    document.querySelectorAll('[data-submit-phase]').forEach(btn=>{
      if(btn.dataset.noSupervisorSubmitPatched) return;
      btn.dataset.noSupervisorSubmitPatched='true';
      btn.addEventListener('click',()=>setTimeout(()=>{unlock();removeLocks();cleanText();},100),true);
    });
  }
  function boot(){
    unlock();
    removeLocks();
    cleanText();
    patchButtons();
    new MutationObserver(()=>{unlock();removeLocks();cleanText();patchButtons();}).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();

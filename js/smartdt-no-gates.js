/* Smart DT V4: remove supervisor gates without changing templates */
(function(){
  'use strict';
  const routes={
    '01':'phase01-empathy.html','02':'phase02-define.html','03':'phase03-ideation.html','04':'phase04-prototype.html','05':'phase05-test.html',portfolio:'portfolio-completion.html'
  };
  function setApproved(){
    try{
      ['1','2','3'].forEach(n=>localStorage.setItem('df_gate_'+n,'approved'));
      ['01','02','03','04','05'].forEach(ph=>localStorage.setItem('df_unlocked_phase'+ph,'true'));
    }catch(e){}
  }
  function removeGateUI(){
    const lock=document.getElementById('gateLockScreen');
    if(lock) lock.remove();
    const main=document.querySelector('main');
    if(main) main.style.display='';
    document.querySelectorAll('#gateList,.gate-list-v9').forEach(el=>{
      const sec=el.closest('section');
      if(sec) sec.remove(); else el.remove();
    });
    document.querySelectorAll('*').forEach(el=>{
      if(el.children.length || !el.textContent) return;
      el.textContent=el.textContent
        .replace(/Supervisor Gates/gi,'Template Submission Workflow')
        .replace(/Supervisor Feedback/gi,'Submission Status')
        .replace(/Gate approval and comments/gi,'Draft · Submitted · Updated')
        .replace(/sent to your supervisor/gi,'saved as final submission')
        .replace(/Your supervisor will review your work and approve[^.]*\./gi,'Your final submission has been saved.');
    });
  }
  function nextOpenPhase(){
    try{for(let i=1;i<=5;i++){const ph=String(i).padStart(2,'0');if(localStorage.getItem('df_submitted_phase'+ph)!=='true') return ph;}}catch(e){}
    return '05';
  }
  function patchContinue(){
    document.querySelectorAll('[data-continue],#continuePhaseBtn').forEach(btn=>{
      if(btn.dataset.noGatePatched) return;
      btn.dataset.noGatePatched='true';
      btn.addEventListener('click',e=>{e.preventDefault();location.href=routes[nextOpenPhase()]||routes['01'];},true);
    });
  }
  function boot(){
    setApproved();removeGateUI();patchContinue();
    new MutationObserver(()=>{setApproved();removeGateUI();patchContinue();}).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();

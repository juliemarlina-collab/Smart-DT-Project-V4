(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const store = {
    get:k=>localStorage.getItem(k)||'',
    set:(k,v)=>localStorage.setItem(k,v),
    json:(k,def={})=>{try{return JSON.parse(localStorage.getItem(k)||'')||def}catch{return def}},
    setJson:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
  };
  function initials(name){
    const n=(name||store.get('df_student_name')||'Student').trim();
    return n.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase() || 'ST';
  }
  function hydrateHeader(){
    $$('.avatar').forEach(a=>a.textContent=initials(store.get('df_student_name')||store.get('df_email')||'Student'));
    $$('.student-name').forEach(e=>e.textContent=store.get('df_student_name')||'Student');
  }
  function currentPhase(){
    for(let i=1;i<=5;i++){ if(store.get(`df_submitted_phase0${i}`)!=='true') return i; }
    return 5;
  }
  function completionPct(){
    let done=0; for(let i=1;i<=5;i++) if(store.get(`df_submitted_phase0${i}`)==='true') done++;
    return Math.round((done/5)*100);
  }
  function setupAuth(){
    const reg=$('#registrationForm');
    if(reg){
      reg.addEventListener('submit',e=>{
        e.preventDefault();
        const data=Object.fromEntries(new FormData(reg));
        Object.entries(data).forEach(([k,v])=>store.set(k,v.trim()));
        store.set('df_registered','true');
        location.href='dashboard.html';
      });
    }
    const login=$('#loginForm');
    if(login){
      login.addEventListener('submit',e=>{
        e.preventDefault();
        const data=Object.fromEntries(new FormData(login));
        Object.entries(data).forEach(([k,v])=>store.set(k,v.trim()));
        store.set('df_registered','true');
        if(!store.get('df_student_name')) store.set('df_student_name',(data.df_email||'Student').split('@')[0]);
        location.href='dashboard.html';
      });
    }
  }
  function setupAccordions(){
    $$('.accordion-item').forEach((item,idx)=>{
      const btn=$('.acc-head',item);
      if(idx===0) item.classList.add('open');
      btn?.addEventListener('click',()=>item.classList.toggle('open'));
    });
  }
  function setupDashboard(){
    if(!document.body.matches('[data-page="dashboard"]')) return;
    hydrateHeader();
    $('.greeting-name') && ($('.greeting-name').textContent=store.get('df_student_name')||'Student');
    $('.project-title') && ($('.project-title').textContent=store.get('df_project_name')||'My FYP Project');
    const meta = `${store.get('df_team')||'My Team'} · ${store.get('df_supervisor')||'My Supervisor'}`;
    $('.project-meta') && ($('.project-meta').textContent=meta);
    const pct=completionPct(); $$('.progress-fill').forEach(e=>e.style.width=pct+'%'); $('.pct') && ($('.pct').textContent=pct+'%');
    const cp=currentPhase();
    $$('.step').forEach((s,i)=>{s.classList.toggle('done',i+1<cp);s.classList.toggle('active',i+1===cp)});
    $('[data-continue]')?.addEventListener('click',()=>{location.href=`phase0${cp}-empathy.html`.replace('02-empathy','02-define').replace('03-empathy','03-ideation').replace('04-empathy','04-prototype').replace('05-empathy','05-test')});
  }
  const quizSets = {
    '01': [
      {q:'What is the MAIN goal of the Empathy phase?',a:0,o:['To understand users real feelings, needs and experiences','To build the final product immediately','To choose the cheapest solution','To prepare a presentation only']},
      {q:'Should you already know the solution before interviewing users?',a:1,o:['True — decide first','False — keep an open mind and discover','True — the app requires it','False — no interviews are needed']},
      {q:'Which is the BEST interview question for Empathy?',a:2,o:['Do you agree my idea is good?','Do you want our product?','Tell me about your experience using the canteen during peak hours.','Is this problem serious?']},
      {q:'Is interviewing one person enough for the Empathy phase?',a:1,o:['True — one user is enough','False — interview at least 3 users to find patterns','True — if the user is your friend','False — no interviews are needed']},
      {q:'Which tool maps what a user SAYS, THINKS, DOES and FEELS?',a:3,o:['Persona only','Problem Statement','SCAMPER','Empathy Map']}
    ],
    '02': [
      {q:'What is the MAIN output of the Define phase?',a:0,o:['A clear user-centred problem statement based on research','A finished prototype','A list of random ideas','A final presentation script']},
      {q:'Should the problem statement include a solution?',a:1,o:['True — include the app idea immediately','False — define the problem only, never the solution','True — supervisors prefer solutions first','False — skip the problem statement']},
      {q:'Which HMW question is correctly formatted?',a:2,o:['We should build a canteen app.','Can you make students eat faster?','How might we help students eat lunch faster on campus?','Why is the canteen crowded?']},
      {q:'Can you skip Define if Empathy was thorough enough?',a:1,o:['True — Empathy is enough','False — Empathy and Define serve different purposes','True — go straight to Ideation','False — skip Ideation instead']},
      {q:'What should a good problem statement focus on?',a:1,o:['The technology your team likes','The user’s need and the insight behind it','The cheapest available solution','The supervisor’s preferred product']}
    ]
  };
  function activePhase(){ return document.body.dataset.phase || (document.title.includes('Phase 02') ? '02' : '01'); }
  function activeQuiz(){ return quizSets[activePhase()] || quizSets['01']; }
  function setupTabs(){
    $$('.tab').forEach(btn=>btn.addEventListener('click',()=>{
      const id=btn.dataset.tab; $$('.tab').forEach(b=>b.classList.toggle('active',b===btn)); $$('.panel').forEach(p=>p.classList.toggle('active',p.id===id));
    }));
    $$('.subtab').forEach(btn=>btn.addEventListener('click',()=>{
      const id=btn.dataset.subtab; $$('.subtab').forEach(b=>b.classList.toggle('active',b===btn)); $$('.template-panel').forEach(p=>p.classList.toggle('active',p.id===id));
    }));
    $$('.switch button').forEach(btn=>btn.addEventListener('click',()=>{
      const box=btn.closest('.template-card'); const mode=btn.dataset.mode;
      $$('.switch button',box).forEach(b=>b.classList.toggle('active',b===btn));
      $('.sample',box)?.classList.toggle('hidden',mode!=='sample');
      $('.fill',box)?.classList.toggle('active',mode==='fill');
    }));
  }
  function setupQuiz(){
    const box=$('#quizBox'); if(!box) return;
    const quiz=activeQuiz();
    let current=0; const selected=Array(quiz.length).fill(null);
    const render=()=>{
      const item=quiz[current], letters=['A','B','C','D'];
      box.innerHTML=`<div class="quiz-card"><span class="q-count">Question ${current+1} of ${quiz.length}</span><div class="q-title">${item.q}</div><div>${item.o.map((o,i)=>`<button type="button" class="option ${selected[current]===i?'selected':''}" data-i="${i}"><span class="option-letter">${letters[i]}</span><span class="option-text">${o}</span></button>`).join('')}</div><div class="quiz-nav"><button class="btn ghost" id="qBack" ${current===0?'disabled':''}>Back</button><span></span><button class="btn primary" id="qNext">${current===quiz.length-1?'Submit Quiz':'Next'}</button></div></div>`;
      $$('.option',box).forEach(b=>b.addEventListener('click',()=>{selected[current]=Number(b.dataset.i);render()}));
      $('#qBack').onclick=()=>{if(current>0){current--;render()}};
      $('#qNext').onclick=()=>{ if(selected[current]===null){alert('Please choose an answer.'); return;} if(current<quiz.length-1){current++;render();} else { const phase=activePhase(); const score=selected.reduce((s,v,i)=>s+(v===quiz[i].a?1:0),0); store.set(`df_quiz_phase${phase}`,String(score)); alert(`Quiz score: ${score}/5. ${score>=3?'Templates unlocked.':'Try again to unlock templates.'}`); if(score>=3){ $('[data-tab="templatesPanel"]')?.click(); } } };
    }; render();
  }
  function setupForms(){
    $$('[data-save]').forEach(btn=>btn.addEventListener('click',()=>{
      const form=btn.closest('form')||document; const data={};
      $$('input,textarea,select',form).forEach(el=>{ if(el.name) data[el.name]=el.value; });
      const phase=activePhase(); store.setJson(`df_phase${phase}_draft`,data); alert('Draft saved on this device.');
    }));
    
    $('[data-submit-phase]')?.addEventListener('click',()=>{
      const phase=activePhase();
      store.set(`df_submitted_phase${phase}`,'true');
      const nextMap={
        '01':{label:'Phase 02 Define',url:'phase02-define.html'},
        '02':{label:'Phase 03 Ideation',url:'phase03-ideation.html'},
        '03':{label:'Phase 04 Prototype',url:'phase04-prototype.html'},
        '04':{label:'Phase 05 Test',url:'phase05-test.html'},
        '05':{label:'Progress page',url:'progress.html'}
      };
      const next=nextMap[phase];
      const msg=`Phase ${phase} submitted locally. Progress updated.${next ? '\n\nContinue to '+next.label+' now?' : ''}`;
      if(next && confirm(msg)) location.href=next.url;
      else if(!next) alert(`Phase ${phase} submitted locally. Progress updated.`);
    });

    $('[data-print]')?.addEventListener('click',()=>window.print());
    $('#startRec')?.addEventListener('click',()=>alert('Recording placeholder: connect browser MediaRecorder/API later.'));
    $('#pauseRec')?.addEventListener('click',()=>alert('Recording paused placeholder.'));
    $('#stopRec')?.addEventListener('click',()=>alert('Recording stopped placeholder.'));
    $('#autoTranscribe')?.addEventListener('click',()=>alert('Auto Transcribe placeholder: connect AI transcription later.'));
  }
  function setupNavActive(){
    const page=document.body.dataset.page;
    $$('.nav-item').forEach(a=>a.classList.toggle('active',a.dataset.nav===page));
  }
  document.addEventListener('DOMContentLoaded',()=>{hydrateHeader();setupAuth();setupAccordions();setupDashboard();setupTabs();setupQuiz();setupForms();setupNavActive();});
})();

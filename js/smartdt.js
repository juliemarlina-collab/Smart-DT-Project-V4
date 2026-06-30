(function(){
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const store = {
    get: k => localStorage.getItem(k) || '',
    set: (k,v) => localStorage.setItem(k, String(v)),
    del: k => localStorage.removeItem(k),
    json: (k,def={}) => { try { return JSON.parse(localStorage.getItem(k) || '') || def; } catch { return def; } },
    setJson: (k,v) => localStorage.setItem(k, JSON.stringify(v))
  };

  const PHASE_ROUTES = {
    '01': 'phase01-empathy.html',
    '02': 'phase02-define.html',
    '03': 'phase03-ideation.html',
    '04': 'phase04-prototype.html',
    '05': 'phase05-test.html',
    portfolio: 'portfolio-completion.html'
  };

  const NEXT_PHASE = {
    '01': { label:'Phase 02 Define', url:'phase02-define.html', badge:'Empathy Explorer' },
    '02': { label:'Phase 03 Ideation', url:'phase03-ideation.html', badge:'Problem Framer' },
    '03': { label:'Phase 04 Prototype', url:'phase04-prototype.html', badge:'Idea Generator' },
    '04': { label:'Phase 05 Testing', url:'phase05-test.html', badge:'Prototype Builder' },
    '05': { label:'Portfolio Completion', url:'portfolio-completion.html', badge:'User Tester' }
  };

  const PHASE_TEMPLATES = {
    '01': ['t00','t01','t02','t03','t04'],
    '02': ['t05','t06'],
    '03': ['t07','t08','t09','t10'],
    '04': ['t11','t12','t13'],
    '05': ['t14','t15','t16']
  };

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
      {q:'What should a good problem statement focus on?',a:1,o:['The technology your team likes','The user’s need and the insight behind it','The cheapest available solution','The supervisor’s preferred product']},
      {q:'Can you skip Define if Empathy was thorough enough?',a:1,o:['True — Empathy is enough','False — Empathy and Define serve different purposes','True — go straight to Ideation','False — skip Ideation instead']},
      {q:'What does Define help the team do?',a:2,o:['Decorate the app','Finish the poster only','Turn research into a clear problem focus','Avoid user evidence']}
    ],
    '03': [
      {q:'What is the main rule of Ideation?',a:0,o:['Generate many ideas before judging','Choose the first good idea','Start prototyping immediately','Skip discussion']},
      {q:'What is T07 used for?',a:1,o:['Building the final prototype','Organising connected ideas visually','Writing the final report','Testing with users']},
      {q:'SCAMPER helps teams to...',a:2,o:['Delete all ideas','Score ideas only','Improve ideas by changing or adapting them','Avoid creativity']},
      {q:'The 4-quadrant matrix compares ideas by...',a:3,o:['Colour and size','Team popularity','Number of sketches','Impact and effort']},
      {q:'What happens after Phase 03?',a:0,o:['Move to Prototype','Return to registration','Skip to final pitch','Stop the project']}
    ],
    '04': [
      {q:'What is the main purpose of a prototype?',a:0,o:['To make an idea testable','To create the perfect final product','To avoid user feedback','To decorate the portfolio']},
      {q:'Which prototype format is acceptable?',a:3,o:['Only an expensive app','Only a completed product','Only a professional video','Sketch, model, mock-up, wireframe, simulation or poster']},
      {q:'Why must prototype evidence be saved?',a:1,o:['To make the page longer','To prove what was built and prepare for testing','To skip the pitch','To replace the prototype']},
      {q:'What should a pitch explain?',a:2,o:['Only team names','Only colours and design','User need, prototype, evidence and impact','Only the final price']},
      {q:'What happens after Phase 04?',a:0,o:['Move to Phase 05 Testing','Return to Ideation','Skip to registration','Stop the project']}
    ],
    '05': [
      {q:'Who should you select as test participants?',a:1,o:['Your friends and family for convenience','Real target users who match the Persona','Only your classmates','Your supervisor only']},
      {q:'What is the purpose of testing?',a:0,o:['To learn what works and what needs improvement','To defend the prototype','To avoid criticism','To finish without feedback']},
      {q:'What should you do during a user test?',a:2,o:['Persuade users to like it','Change the design during the test','Observe and listen without interfering','Ask only yes/no questions']},
      {q:'What happens after collecting feedback?',a:1,o:['Submit without analysis','Find patterns and plan improvements','Delete the prototype','Restart from registration']},
      {q:'What makes a reflection genuine?',a:3,o:['One short sentence','Only positive comments','Copying another group','Explaining real learning, challenges and improvement']}
    ]
  };

  function phase(){
    if (document.body.dataset.phase) return document.body.dataset.phase.padStart(2,'0');
    const t = document.title;
    if (/Phase 05|Test/i.test(t)) return '05';
    if (/Phase 04|Prototype/i.test(t)) return '04';
    if (/Phase 03|Ideation/i.test(t)) return '03';
    if (/Phase 02|Define/i.test(t)) return '02';
    if (/Phase 01|Empathy/i.test(t)) return '01';
    return '';
  }

  function escapeHtml(str){ return String(str||'').replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function initials(name){ return (name || 'Student').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase() || 'ST'; }
  function toast(msg){
    let el = $('#smartToast');
    if(!el){ el=document.createElement('div'); el.id='smartToast'; el.className='smart-toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2600);
  }

  function syncToGoogleSheets(){
    store.set('df_last_sync_status','disabled');
    store.set('df_last_sync_action','local_only');
    return Promise.resolve(false);
  }

  function bridgePhase01(){
    const completed = store.get('p01_completed') === 'true' || store.get('p01_badge') || store.get('p01_empathy_badge') || store.get('df_badge_empathy_explorer') === 'true';
    if(completed && store.get('df_submitted_phase01') !== 'true'){
      store.set('df_submitted_phase01','true');
      store.set('df_unlocked_phase01','true');
      store.set('df_unlocked_phase02','true');
      store.set('df_badge_empathy_explorer','true');
      if(!store.get('df_quiz_phase01')) store.set('df_quiz_phase01', store.get('p01_quiz_score') || '3');
      store.setJson('df_phase01_submission', { bridgedFrom:'phase01-self-contained', submittedAt:new Date().toISOString() });
    }
  }

  function hydrateHeader(){
    const name = store.get('df_student_name') || (store.get('df_email') ? store.get('df_email').split('@')[0] : 'Student');
    $$('.student-name').forEach(e=>e.textContent=name);
    $$('.avatar,.profile-initials').forEach(e=>e.textContent=initials(name));
  }

  function isPhaseSubmitted(n){ return store.get('df_submitted_phase'+n)==='true'; }
  function quizScore(n){ return store.get('df_quiz_phase'+n); }
  function quizPassed(n){ const s = parseInt(quizScore(n)||'-1',10); return s >= 3 || store.get('df_unlocked_phase'+n)==='true'; }
  function completedCount(){ let c=0; ['01','02','03','04','05'].forEach(n=>{ if(isPhaseSubmitted(n)) c++; }); return c; }
  function currentPhase(){ for(const n of ['01','02','03','04','05']){ if(!isPhaseSubmitted(n)) return n; } return 'portfolio'; }

  function formValues(root){
    const data={};
    $$('input, textarea, select', root).forEach(el=>{
      if(!el.name) return;
      if(el.type === 'file') data[el.name] = el.files && el.files.length ? Array.from(el.files).map(f=>f.name).join(', ') : '';
      else if(el.type === 'checkbox') data[el.name] = el.checked ? 'true' : 'false';
      else data[el.name] = el.value;
    });
    return data;
  }

  function applyValues(root,data){
    $$('input, textarea, select', root).forEach(el=>{
      if(!el.name || data[el.name] === undefined || el.type === 'file') return;
      if(el.type === 'checkbox') el.checked = data[el.name] === 'true';
      else el.value = data[el.name];
    });
  }

  function panelIdFor(el){
    const panel = el.closest('.template-panel');
    if(panel?.id) return panel.id;
    const card = el.closest('.template-card');
    const title = card?.querySelector('h2')?.textContent || 'general';
    return title.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'') || 'general';
  }

  function saveTemplateFrom(btn){
    const ph=phase(); if(!ph) return;
    const panel = btn.closest('.template-panel') || btn.closest('.template-card') || document;
    const tid = panelIdFor(btn);
    const all = store.json('df_phase'+ph+'_templates',{});
    all[tid] = { savedAt: new Date().toISOString(), values: formValues(panel) };
    store.setJson('df_phase'+ph+'_templates', all);
    store.set('df_template_phase'+ph+'_'+tid, 'true');
    updateTemplateStatuses();
    toast(`Saved ${tid.toUpperCase()} on this device.`);
  }

  function restoreTemplates(){
    const ph=phase(); if(!ph) return;
    const all = store.json('df_phase'+ph+'_templates',{});
    Object.entries(all).forEach(([tid,entry])=>{ const panel = document.getElementById(tid); if(panel && entry.values) applyValues(panel,entry.values); });
    updateTemplateStatuses();
  }

  function templateFilled(id){
    const ph=phase();
    if(store.get('df_template_phase'+ph+'_'+id)==='true') return true;
    const panel=document.getElementById(id); if(!panel) return false;
    return Object.values(formValues(panel)).some(v => String(v||'').trim() !== '');
  }

  function updateTemplateStatuses(){
    const ph=phase(); if(!ph) return;
    $$('.template-panel').forEach(panel=>{
      const done = templateFilled(panel.id);
      panel.classList.toggle('template-saved', done);
      const status = panel.querySelector('.status');
      if(status){ status.textContent = done ? 'Saved' : 'Not Started'; status.classList.toggle('saved',done); }
    });
    $$('.subtab').forEach(btn=>{ const id=btn.dataset.subtab; if(id) btn.classList.toggle('saved', templateFilled(id)); });
  }

  function switchPanel(id){
    $$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
    $$('.panel').forEach(p=>p.classList.toggle('active',p.id===id));
    if(id==='templatesPanel') setTimeout(updateTemplateStatuses,50);
  }

  function setupTabs(){
    $$('.tab').forEach(btn=>btn.addEventListener('click',()=>switchPanel(btn.dataset.tab)));
    $$('.subtab').forEach(btn=>btn.addEventListener('click',()=>{
      const id=btn.dataset.subtab;
      $$('.subtab').forEach(b=>b.classList.toggle('active',b===btn));
      $$('.template-panel').forEach(p=>p.classList.toggle('active',p.id===id));
    }));
    $$('[data-next-subtab]').forEach(btn=>btn.addEventListener('click',()=>{
      const next = btn.dataset.nextSubtab;
      const target = next ? document.querySelector(`[data-subtab="${next}"]`) : null;
      if(target){ target.click(); setTimeout(()=>document.getElementById(next)?.scrollIntoView({behavior:'smooth',block:'start'}), 50); }
    }));
    $$('.switch button').forEach(btn=>btn.addEventListener('click',()=>{
      const box=btn.closest('.template-card'); if(!box) return;
      const mode=btn.dataset.mode;
      $$('.switch button',box).forEach(b=>b.classList.toggle('active',b===btn));
      $$('[data-panel="sample"], .sample-panel',box).forEach(p=>{p.hidden=mode!=='sample'; p.classList.toggle('hidden',mode!=='sample');});
      $$('[data-panel="fill"], .fill-panel, .fill',box).forEach(p=>{p.hidden=mode!=='fill'; p.classList.toggle('active',mode==='fill');});
    }));
  }

  function setupQuiz(){
    const box=$('#quizBox'); if(!box) return;
    const ph=phase(); const quiz=quizSets[ph] || quizSets['01'];
    let current=0; const selected=Array(quiz.length).fill(null); const letters=['A','B','C','D'];
    function render(){
      const q=quiz[current]; const pct=Math.round(((current+1)/quiz.length)*100);
      box.innerHTML = `<div class="quiz-card smart-quiz"><div class="quiz-progress"><span>Question ${current+1} of ${quiz.length}</span><b>${pct}%</b></div><div class="quiz-bar"><span style="width:${pct}%"></span></div><span class="q-count">Phase ${ph} · Quick Check</span><h2 class="q-title">${escapeHtml(q.q)}</h2><div class="options-list">${q.o.map((o,i)=>`<button type="button" class="option ${selected[current]===i?'selected':''}" data-opt="${i}"><span class="option-letter">${letters[i]}</span><span class="option-text">${escapeHtml(o)}</span></button>`).join('')}</div><div class="quiz-nav"><button type="button" class="btn ghost" id="qPrev" ${current===0?'disabled':''}>Back</button><span class="quiz-status">Select A, B, C or D</span><button type="button" class="btn primary" id="qNext">${current===quiz.length-1?'Submit Quiz':'Next'}</button></div></div>`;
      $$('.option',box).forEach(btn=>btn.addEventListener('click',()=>{selected[current]=Number(btn.dataset.opt); render();}));
      $('#qPrev')?.addEventListener('click',()=>{if(current>0){current--; render();}});
      $('#qNext')?.addEventListener('click',()=>{if(selected[current]===null){toast('Please choose an answer first.'); return;} if(current<quiz.length-1){current++; render(); return;} showQuizResult();});
    }
    function showQuizResult(){
      const score=selected.reduce((s,v,i)=>s+(v===quiz[i].a?1:0),0);
      store.set('df_quiz_phase'+ph,String(score)); if(score>=3) store.set('df_unlocked_phase'+ph,'true');
      const passed=score>=3;
      box.innerHTML=`<div class="quiz-result ${passed?'pass':'retry'}"><div class="result-badge">${passed?'✓':'!'}</div><h2>${passed?'Quiz Passed':'Try Again'}</h2><p>You scored <strong>${score}/5</strong>. ${passed?'You may complete the templates and submit this phase.':'Score 3/5 or more to pass.'}</p><div class="result-actions"><button type="button" class="btn ghost" id="reviewQuiz">Review Quiz</button>${passed?'<button type="button" class="btn primary" id="openTemplates">Open Templates</button>':'<button type="button" class="btn primary" id="retryQuiz">Retry Quiz</button>'}</div></div>`;
      $('#reviewQuiz')?.addEventListener('click',()=>{current=0; render();});
      $('#retryQuiz')?.addEventListener('click',()=>{current=0; selected.fill(null); render();});
      $('#openTemplates')?.addEventListener('click',()=>switchPanel('templatesPanel'));
    }
    render();
  }

  function setupForms(){
    restoreTemplates();
    $$('[data-save]').forEach(btn=>btn.addEventListener('click',()=>saveTemplateFrom(btn)));
    $$('[data-print]').forEach(btn=>btn.addEventListener('click',()=>window.print()));
    const submit=$('[data-submit-phase]');
    if(submit){
      submit.addEventListener('click',()=>{
        const ph=phase(); const expected=PHASE_TEMPLATES[ph] || $$('.template-panel').map(p=>p.id);
        const missing=expected.filter(id=>document.getElementById(id) && !templateFilled(id));
        if(missing.length && !confirm(`Some templates are not saved yet: ${missing.map(x=>x.toUpperCase()).join(', ')}.\n\nSubmit Phase ${ph} anyway?`)) return;
        const allData={}; expected.forEach(id=>{const panel=document.getElementById(id); if(panel) allData[id]=formValues(panel);});
        store.setJson('df_phase'+ph+'_submission',{submittedAt:new Date().toISOString(),templates:allData});
        store.set('df_submitted_phase'+ph,'true');
        if(NEXT_PHASE[ph]) store.set('df_badge_'+NEXT_PHASE[ph].badge.toLowerCase().replace(/\s+/g,'_'),'true');
        showSubmitSuccess(ph,NEXT_PHASE[ph]);
      });
    }
  }

  function showSubmitSuccess(ph,next){
    const panel=$('.panel.active') || $('main') || document.body;
    const card=document.createElement('div'); card.className='submit-success-card';
    const badge=next?.badge || 'Smart DT Badge';
    card.innerHTML=`<div class="success-mark">✓</div><h2>Congratulations!</h2><p>Phase ${ph} has been saved successfully.</p><p><strong>Feedback:</strong> You have completed the required templates and passed the quick check.</p><p><strong>Badge Awarded:</strong> ${escapeHtml(badge)}</p><div class="success-actions"><a class="btn ghost" href="progress.html">View Progress</a>${next?`<a class="btn primary" href="${next.url}">Go to ${next.label}</a>`:''}</div>`;
    panel.prepend(card); card.scrollIntoView({behavior:'smooth',block:'start'}); toast(`Phase ${ph} submitted.`);
  }

  function setupAuth(){
    const reg=$('#registrationForm');
    if(reg) reg.addEventListener('submit',e=>{e.preventDefault(); const data=Object.fromEntries(new FormData(reg)); Object.entries(data).forEach(([k,v])=>store.set(k,(v||'').trim())); store.set('df_registered','true'); location.href='dashboard.html';});
    const login=$('#loginForm');
    if(login) login.addEventListener('submit',e=>{e.preventDefault(); const data=Object.fromEntries(new FormData(login)); Object.entries(data).forEach(([k,v])=>store.set(k,(v||'').trim())); store.set('df_registered','true'); if(!store.get('df_student_name')) store.set('df_student_name',(data.df_email||'Student').split('@')[0]); location.href='dashboard.html';});
  }

  function setupDashboard(){
    if(document.body.dataset.page!=='dashboard') return;
    hydrateHeader();
    $('.greeting-name') && ($('.greeting-name').textContent=store.get('df_student_name')||'Student');
    $('.project-title') && ($('.project-title').textContent=store.get('df_project_name')||'My FYP Project');
    const meta=`${store.get('df_team')||'My Team'} · ${store.get('df_supervisor')||'My Supervisor'}`;
    $('.project-meta') && ($('.project-meta').textContent=meta);
    const pct=Math.round(completedCount()/5*100);
    $$('.progress-fill').forEach(e=>e.style.width=pct+'%'); $('.pct') && ($('.pct').textContent=pct+'%');
    const cp=currentPhase();
    $$('.step').forEach((s,i)=>{const n=String(i+1).padStart(2,'0'); s.classList.toggle('done',n<cp||cp==='portfolio'); s.classList.toggle('active',n===cp);});
    $('[data-continue]')?.addEventListener('click',()=>{location.href=PHASE_ROUTES[cp]||'phase01-empathy.html';});
  }

  function badgeData(){
    const d=completedCount();
    return [
      {name:'Empathy Explorer', icon:'🧭', earned:isPhaseSubmitted('01'), text:'Phase 01 completed'},
      {name:'Problem Framer', icon:'🎯', earned:isPhaseSubmitted('02'), text:'Phase 02 completed'},
      {name:'Idea Generator', icon:'💡', earned:isPhaseSubmitted('03'), text:'Phase 03 completed'},
      {name:'Prototype Builder', icon:'🧱', earned:isPhaseSubmitted('04'), text:'Phase 04 completed'},
      {name:'User Tester', icon:'🧪', earned:isPhaseSubmitted('05'), text:'Phase 05 completed'},
      {name:'DT Graduate', icon:'🏆', earned:d>=5, text:'All phases completed'}
    ];
  }

  function renderProgress(){
    if(document.body.dataset.page!=='progress') return;
    const phases=[
      {n:'01', name:'Phase 01 — Empathy', url:'phase01-empathy.html'},
      {n:'02', name:'Phase 02 — Define', url:'phase02-define.html'},
      {n:'03', name:'Phase 03 — Ideation', url:'phase03-ideation.html'},
      {n:'04', name:'Phase 04 — Prototype', url:'phase04-prototype.html'},
      {n:'05', name:'Phase 05 — Test', url:'phase05-test.html'}
    ];
    const done=completedCount(), pct=Math.round(done/5*100), current=currentPhase();
    $('#progressDoneText') && ($('#progressDoneText').textContent=`${done} of 5 phases complete`);
    $('#progressPct') && ($('#progressPct').textContent=pct+'%');
    $('#progressFill') && ($('#progressFill').style.width=pct+'%');
    const list=$('#phaseProgressList');
    if(list){list.innerHTML=phases.map(p=>{const q=quizScore(p.n); const isDone=isPhaseSubmitted(p.n); const isCurrent=current===p.n; return `<a class="phase-card-v9 ${isDone?'done':''} ${isCurrent?'current':''}" href="${p.url}"><span class="phase-num-v9">${isDone?'✓':p.n}</span><span class="phase-body-v9"><strong>${p.name}</strong><span class="phase-tags-v9"><em class="tag-v9 ${q?'pass':'locked'}">${q?'Quiz '+q+'/5':'Quiz pending'}</em><em class="tag-v9 ${isDone?'done':'pending'}">${isDone?'Submitted':'Not submitted'}</em></span></span><span class="phase-arrow-v9">›</span></a>`;}).join('');}
    const gates=$('#gateList'); if(gates){gates.innerHTML='<div class="gate-row-v9"><span class="gate-info-v9"><strong>Supervisor gates removed</strong><small>Students now move phase by phase after completion.</small></span><span class="gate-pill-v9 approved">Updated</span></div>';}
    const grid=$('#badgeGrid'); if(grid){grid.innerHTML=badgeData().map(b=>`<div class="badge-card-v9 ${b.earned?'':'locked'}"><strong style="font-size:32px">${b.icon}</strong><strong>${b.name}</strong><small>${b.text}</small></div>`).join('');}
    $('#continuePhaseBtn')?.addEventListener('click',()=>{location.href=PHASE_ROUTES[current]||'phase01-empathy.html';});
  }

  function renderProfile(){
    if(document.body.dataset.page!=='profile') return;
    const name=store.get('df_student_name') || (store.get('df_email') ? store.get('df_email').split('@')[0] : 'Student');
    $('.profile-name') && ($('.profile-name').textContent=name);
    $('[data-field="reg"]') && ($('[data-field="reg"]').textContent=store.get('df_reg_no')||store.get('df_registration_no')||'Not added');
    $('[data-field="class"]') && ($('[data-field="class"]').textContent=store.get('df_class')||'Not added');
    $('[data-field="team"]') && ($('[data-field="team"]').textContent=store.get('df_team')||'My Team');
    $('[data-field="supervisor"]') && ($('[data-field="supervisor"]').textContent=store.get('df_supervisor')||'My Supervisor');
    $('[data-field="project"]') && ($('[data-field="project"]').textContent=store.get('df_project_name')||'Not added');
    $('#profileTasks') && ($('#profileTasks').textContent=['01','02','03','04','05'].filter(n=>!isPhaseSubmitted(n)).length);
    $('#profileEvidence') && ($('#profileEvidence').textContent=completedCount());
    $('#profileFeedback') && ($('#profileFeedback').textContent=completedCount());
    $('#profileBadges') && ($('#profileBadges').textContent=badgeData().filter(b=>b.earned).length);
    $('#logoutBtn')?.addEventListener('click',()=>{ if(confirm('Log out from Smart DT Project on this device?')){ store.del('df_registered'); location.href='welcome.html'; } });
  }

  function renderPortfolio(){
    if(document.body.dataset.page!=='portfolio') return;
    const done=completedCount(); const allDone=done>=5;
    const summary=$('#portfolioSummary');
    if(summary){summary.innerHTML=`<div class="portfolio-student-row"><div class="portfolio-avatar">${escapeHtml(initials(store.get('df_student_name')||'Student'))}</div><div><h2 class="portfolio-student-name">${escapeHtml(store.get('df_student_name')||'Student')}</h2><p class="portfolio-student-meta">${escapeHtml(store.get('df_project_name')||'My FYP Project')}</p></div></div><div class="portfolio-stats-row"><div class="portfolio-stat ${allDone?'done':''}"><strong>${done}/5</strong><span>Phases<br>Submitted</span></div><div class="portfolio-stat ${allDone?'done':''}"><strong>${badgeData().filter(b=>b.earned).length}</strong><span>Badges<br>Earned</span></div></div>${allDone?'<div class="portfolio-ready-banner">All phases complete — ready for portfolio submission!</div>':'<div class="portfolio-pending-banner">Complete all phases to finish your Smart DT journey.</div>'}`;}
    const checklist=$('#portfolioChecklist');
    if(checklist){checklist.innerHTML=['Phase 01 Empathy completed','Phase 02 Define completed','Phase 03 Ideation completed','Phase 04 Prototype completed','Phase 05 Test completed'].map((label,i)=>{const n=String(i+1).padStart(2,'0'); const done=isPhaseSubmitted(n); return `<li class="portfolio-checklist-item ${done?'done':''}"><span class="checklist-dot ${done?'done':''}">${done?'✓':'○'}</span><span>${label}</span></li>`;}).join('');}
    $('#portfolioPrintBtn')?.addEventListener('click',()=>window.print());
    $('#portfolioProgressBtn')?.addEventListener('click',()=>{location.href='progress.html';});
  }

  function setupNavActive(){ const page=document.body.dataset.page; $$('.nav-item').forEach(a=>a.classList.toggle('active',a.dataset.nav===page)); }

  document.addEventListener('DOMContentLoaded',()=>{
    bridgePhase01();
    hydrateHeader();
    setupAuth();
    setupDashboard();
    setupTabs();
    setupQuiz();
    setupForms();
    setupNavActive();
    renderProgress();
    renderProfile();
    renderPortfolio();
  });
})();
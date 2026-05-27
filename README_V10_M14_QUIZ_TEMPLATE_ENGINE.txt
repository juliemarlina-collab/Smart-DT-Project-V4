Smart DT V10 — M14 Quiz + Template Engine Stabilisation

Milestone covered:
M14 — Quiz + template engine
- Quiz locks/unlocks templates.
- Phase quiz score saves as df_quiz_phase01..05.
- Templates unlock only after score is 3/5 or above.
- Template Save buttons save data locally per template panel.
- Saved templates update visual Saved status.
- Form data restores after refresh, except file inputs due browser security.
- Submit phase stores df_phaseXX_submission and df_submitted_phaseXX.
- Submit flow gives direct next-phase button.
- Gate status keys added for Gate 1 / Gate 2 / Gate 3.
- Progress/profile continue reading localStorage.

Updated files:
- js/smartdt.js
- css/smartdt.css
- phase01-empathy.html (added data-phase="01")

Test checklist:
1. Open phase01-empathy.html.
2. Click Templates before quiz. It should redirect to Quiz with message.
3. Pass quiz with 3/5 or more. Templates should unlock.
4. Fill and Save T00/T01. Refresh page. Saved text should remain.
5. Submit phase. Success card should show next phase button.
6. Go to progress.html. Phase status and quiz score should update.
7. Repeat for Phase 02 to Phase 05.

Next milestone after this is M15 — Google Sheets connection, but only after full localStorage flow is tested.

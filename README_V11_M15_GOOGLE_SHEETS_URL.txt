Smart DT V11 — M15 Google Sheets Web App URL Added

Apps Script Web App URL wired into js/smartdt.js:
https://script.google.com/macros/s/AKfycbxlebje7xNNM5lshlG07XMoynY8r0WHQjuAT8jXVoGujZYfmF-HNeX-a1u8wbbFzgVY/exec

What now sends to Apps Script:
- student_registration
- student_login
- quiz_score
- template_save
- phase_submit
- profile_update

Payload format:
{
  action: string,
  source: 'Smart DT Project',
  appVersion: 'v11-m15-google-sheets-url',
  page: body data-page,
  phase: current phase number,
  timestamp: ISO date/time,
  student: { studentName, email, regNo, className, team, supervisor, projectName },
  payload: object
}

Important testing notes:
1. Open the live deployed app, not local file://, when testing Apps Script.
2. Register/login once and check the Sheet.
3. Submit one quiz and one template.
4. Submit one phase.
5. Check localStorage key df_last_sync_status. It should become sent.

Because the app sends with no-cors/beacon for mobile compatibility, the browser will not read the Apps Script response. The Google Sheet is the source of truth for whether the row was received.

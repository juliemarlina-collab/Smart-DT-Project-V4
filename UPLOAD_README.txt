UPLOAD TO GITHUB ROOT, NOT INSIDE _template_sources_backup.

Correct structure:
Smart-DT-Project-V4/
  phase01-empathy.html
  phase01-templates.html
  css/empathy-phase.css
  js/empathy-phase.js
  assets/brand/logo-icon.svg
  assets/icons/menu.svg
  assets/heroes/empathy-overview-hero.svg
  assets/heroes/empathy-template-hero.svg
  assets/shared/pink-blob.svg
  assets/shared/dt-coach.svg

This regenerated version removes:
- duplicate Smart DT logo inside the page body
- duplicate 01 badge/counter inside the page body
- dot-grid background in the hero

It keeps:
- top header logo
- top 01/05 counter
- menu icon
- pink blob
- hero illustration
- buttons and bottom nav

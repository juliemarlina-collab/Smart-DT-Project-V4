Smart DT V12 — Hosted Asset Link Fix

Updated from the latest GitHub HTML package and FreeImage Asset Tracker workbook.

What changed:
- Rebuilt js/smartdt-assets.js from SmartDT_FreeImage_Asset_Tracker_Heroes_1920x1080_UPDATED.xlsx.
- Replaced old CJ* iili.io URLs with updated Cd* URLs where available.
- Added automatic hosted asset injection for header logo, hero images, bottom navigation icons and status badges.
- Added PNG sizing CSS based on the tracker display sizes.
- Kept the Apps Script Web App URL connection from V11.

Upload/replace these in GitHub:
- all .html files
- css/smartdt.css
- js/smartdt-assets.js
- js/smartdt.js

Important:
- Every HTML file must load js/smartdt-assets.js before js/smartdt.js.
- FreeImage assets will not connect from the Google Sheet automatically; this package embeds the tracker data into smartdt-assets.js and replaces the visible links.

// js/smartdt-no-gates.js
// Smart DT Thursday Stable Fix
// Purpose:
// 1. Remove/ignore supervisor gate blocking.
// 2. Support Phase 01 draft save/load for T01-T04.
// 3. Keep existing quiz, badges, templates and progress features usable.

(function () {
  "use strict";

  // Final Phase 01 template flow
  const phase01Templates = ["T01", "T02", "T03", "T04"];

  // ------------------------------------------------------------
  // 1. GATE-FREE STUDENT FLOW
  // ------------------------------------------------------------
  // Auto-clear old supervisor gate locks from localStorage.
  function disableSupervisorGates() {
    try {
      ["1", "2", "3"].forEach((gateNo) => {
        localStorage.setItem(`df_gate_${gateNo}`, "approved");
      });

      // Remove old lock screen if rendered by older JS.
      const lockScreen = document.getElementById("gateLockScreen");
      if (lockScreen) lockScreen.remove();

      // Restore hidden main content if older gate guard hid it.
      const main = document.querySelector("main");
      if (main && main.style.display === "none") {
        main.style.display = "";
      }

      // Hide any remaining gate UI section.
      document.querySelectorAll(
        "#gateList, .gate-list-v9, .gate-lock-screen, .gate-await-notice, [data-gate], .supervisor-gate-section"
      ).forEach((el) => {
        el.style.display = "none";
      });
    } catch (error) {
      console.warn("Smart DT gate-free setup warning:", error);
    }
  }

  // ------------------------------------------------------------
  // 2. SAVE DRAFT FUNCTION
  // ------------------------------------------------------------
  window.saveTemplateDraft = function saveTemplateDraft(templateId) {
    const formElement =
      document.getElementById(`form-${templateId}`) ||
      document.getElementById(`form-${templateId.toLowerCase()}`) ||
      document.querySelector(`[data-template-form="${templateId}"]`) ||
      document.querySelector(`#${templateId.toLowerCase()} form`);

    if (!formElement) {
      console.warn(`Form for ${templateId} not found.`);
      alert(`${templateId} form not found. Please check the template form ID.`);
      return;
    }

    const formData = new FormData(formElement);
    const dataObject = Object.fromEntries(formData.entries());

    // Save to localStorage with a unique project prefix.
    localStorage.setItem(`smartdt_draft_${templateId}`, JSON.stringify(dataObject));

    // Also save using lowercase key for compatibility.
    localStorage.setItem(`smartdt_draft_${templateId.toLowerCase()}`, JSON.stringify(dataObject));

    alert(
      `${templateId} Draft Saved! (Saved to this device)\n\n` +
      `Need help syncing across devices? Contact support at +60 11-1627 3327.`
    );
  };

  // ------------------------------------------------------------
  // 3. LOAD DRAFT FUNCTION
  // ------------------------------------------------------------
  window.loadTemplateDraft = function loadTemplateDraft(templateId) {
    const savedData =
      localStorage.getItem(`smartdt_draft_${templateId}`) ||
      localStorage.getItem(`smartdt_draft_${templateId.toLowerCase()}`);

    if (!savedData) return;

    let dataObject = {};
    try {
      dataObject = JSON.parse(savedData);
    } catch (error) {
      console.warn(`Saved data for ${templateId} cannot be read.`, error);
      return;
    }

    const formElement =
      document.getElementById(`form-${templateId}`) ||
      document.getElementById(`form-${templateId.toLowerCase()}`) ||
      document.querySelector(`[data-template-form="${templateId}"]`) ||
      document.querySelector(`#${templateId.toLowerCase()} form`);

    if (!formElement) return;

    Object.keys(dataObject).forEach((key) => {
      const input = formElement.querySelector(`[name="${key}"]`);
      if (!input) return;

      if (input.type === "checkbox") {
        input.checked = dataObject[key] === "on" || dataObject[key] === "true";
      } else if (input.type === "radio") {
        const radio = formElement.querySelector(`[name="${key}"][value="${dataObject[key]}"]`);
        if (radio) radio.checked = true;
      } else {
        input.value = dataObject[key];
      }
    });
  };

  // ------------------------------------------------------------
  // 4. INITIALIZE ON PAGE LOAD
  // ------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    disableSupervisorGates();

    // Auto-load drafts if the user returns to the Empathy phase.
    phase01Templates.forEach((templateId) => {
      window.loadTemplateDraft(templateId);
    });

    // Watch for old gate UI injected later and hide it.
    const observer = new MutationObserver(() => disableSupervisorGates());
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();

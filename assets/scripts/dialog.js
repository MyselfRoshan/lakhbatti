// Constants
const FOCUSABLE_ELEMENTS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const dialogType = Object.freeze({
  SIDEBAR: "sidebar",
  CENTRAL: "central",
});

/**
 * Initialize a dialog with specified type and options
 * @param {Object} options Configuration options
 * @param {string} options.type Type of dialog (sidebar, central, custom)
 * @param {string} options.triggerSelector Selector for trigger button(s)
 * @param {string} options.dialogSelector Selector for the dialog element
 * @param {string} [options.closeSelector] Selector for close button (optional)
 * @param {boolean} [options.hasForm=false] Whether the dialog contains a form
 * @param {Function} [options.onOpen] Callback when dialog opens
 * @param {Function} [options.onClose] Callback when dialog closes
 * @param {Function} [options.onSubmit] Callback when form is submitted
 * @param {string} [options.position='right'] Position for sidebar ('left' or 'right')
 */
export function initDialog(options) {
  const {
    type,
    triggerSelector,
    dialogSelector,
    closeSelector = ".close-btn",
    hasForm = false,
    onOpen = () => {},
    onClose = () => {},
    onSubmit = () => {},
    position = "right",
  } = options;
  const dialog =
    typeof dialogSelector === "string"
      ? document.querySelector(dialogSelector)
      : dialogSelector;

  const closeButton = closeSelector
    ? dialog.querySelector(closeSelector)
    : null;

  if (!dialog) {
    console.log("Dialog not found", dialog);
    return null;
  }

  if (!(dialog instanceof HTMLDialogElement)) {
    console.error("Element must be a <dialog> element");
    return null;
  }

  let previousActiveElement = null;
  const dialogId = dialog.id || `dialog-${Math.random().toString(36).slice(2)}`;

  // Initialize existing triggers
  function initializeTrigger(trigger) {
    trigger.setAttribute("aria-controls", dialogId);
    trigger.setAttribute("aria-expanded", "false");
  }

  // Set up MutationObserver for dynamic triggers
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches(triggerSelector)) {
            initializeTrigger(node);
          }
          const triggers = node.querySelectorAll(triggerSelector);
          triggers.forEach(initializeTrigger);
        }
      });
    });
  });

  // Event delegation for trigger clicks
  function handleTriggerClick(e) {
    const trigger = e.target.closest(triggerSelector);
    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
      openDialog(trigger);
    }
  }

  // Initialize existing triggers
  document.querySelectorAll(triggerSelector).forEach(initializeTrigger);

  initializeDialog();

  // Initialize dialog
  function initializeDialog() {
    try {
      switch (type) {
        case dialogType.SIDEBAR:
          dialog.classList.add("sidebar-dialog");
          dialog.dataset.position = position;
          break;
        case dialogType.CENTRAL:
          dialog.classList.add("central-dialog");
          break;
      }

      if (hasForm) {
        dialog.addEventListener("submit", (event) => {
          const activeForm = getActiveDialogForm(dialog);
          if (activeForm) onSubmit(dialog, activeForm, event);
        });
      }

      dialog.classList.add("dialog");
    } catch (error) {
      console.error("Error initializing dialog:", error);
    }
  }

  function openDialog(trigger) {
    try {
      // Store current focus
      previousActiveElement = document.activeElement;

      dialog.showModal();

      // Set up focus trap
      setupFocusTrap();

      // Call onOpen callback
      onOpen(dialog, trigger);
    } catch (error) {
      console.error("Error opening dialog:", error);
    }
  }

  function closeDialog() {
    try {
      dialog.close();

      // Restore focus
      previousActiveElement?.focus();

      // Call onClose callback
      onClose(dialog);
    } catch (error) {
      console.error("Error closing dialog:", error);
    }
  }

  function handleSubmit(e) {
    try {
      const formData = new FormData(e.target);
      onSubmit(formData, e.target, e);
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
  }

  function handleOutsideClick(e) {
    try {
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      const isInsideSelect =
        e.target.closest("select") &&
        e.target.closest("select").closest(dialogSelector);

      const isInsideInput =
        e.target.closest("input") &&
        e.target.closest("input").closest(dialogSelector);

      if (dialog.open && !isInDialog && !isInsideSelect && !isInsideInput) {
        closeDialog();
      }
    } catch (error) {
      console.error("Error handling outside click:", error);
    }
  }

  function handleKeydown(e) {
    try {
      switch (e.key) {
        case "Escape":
          if (dialog.open) {
            e.preventDefault();
            closeDialog();
          }
          break;
        case "Tab":
          if (dialog.open) {
            trapFocus(e);
          }
          break;
      }
    } catch (error) {
      console.error("Error handling keydown:", error);
    }
  }

  function setupFocusTrap() {
    const focusableElements = dialog.querySelectorAll(FOCUSABLE_ELEMENTS);
    if (focusableElements.length) {
      focusableElements[0].focus();
    }
  }

  function trapFocus(e) {
    const focusableElements = dialog.querySelectorAll(FOCUSABLE_ELEMENTS);
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    if (!e.shiftKey && document.activeElement === lastFocusableElement) {
      firstFocusableElement?.focus();
      e.preventDefault();
    }

    if (e.shiftKey && document.activeElement === firstFocusableElement) {
      lastFocusableElement?.focus();
      e.preventDefault();
    }
  }

  // Event Listeners
  document.addEventListener("click", handleTriggerClick);
  observer.observe(document.body, { subtree: true, childList: true });

  closeButton?.addEventListener("click", closeDialog);

  dialog.addEventListener("click", handleOutsideClick);
  dialog.addEventListener("keydown", handleKeydown);

  // Return control methods and cleanup
  return {
    open: openDialog,
    close: closeDialog,
    destroy: () => {
      document.removeEventListener("click", handleTriggerClick);
      observer.disconnect();
      closeButton.removeEventListener("click", closeDialog);
      dialog.removeEventListener("click", handleOutsideClick);
      dialog.removeEventListener("keydown", handleKeydown);
      dialog.classList.remove("sidebar-dialog", "central-dialog", "dialog");

      if (hasForm) {
        const form =
          dialog.querySelector("form[data-active='true']") ??
          dialog.querySelector("form");
        if (form) {
          form.removeEventListener("submit", handleSubmit);
        }
      }
    },
    reinit: () => {
      // Re-initialize with same options
      initializeDialog();
      document.querySelectorAll(triggerSelector).forEach(initializeTrigger);
      document.addEventListener("click", handleTriggerClick);

      closeButton.addEventListener("click", closeDialog);

      dialog.addEventListener("click", handleOutsideClick);
      dialog.addEventListener("keydown", handleKeydown);

      if (hasForm) {
        dialog.addEventListener("submit", (e) => {
          const activeForm = getActiveDialogForm(dialog);
          if (activeForm) {
            onSubmit(dialog, activeForm, e);
          }
        });
      }
    },
  };
}

/**
 * Get the active form within a dialog element
 * @param {HTMLDialogElement} dialog The dialog element
 * @returns {HTMLFormElement|null} The active form or null if not found
 */
export function getActiveDialogForm(dialog) {
  if (!dialog) return null;

  // First try to find forms with data-active attribute
  const formsWithActive = dialog.querySelectorAll("form[data-active]");
  for (const form of formsWithActive) {
    if (form.dataset.active === "true") {
      return form;
    }
  }

  // If no active form found, check if there's only one form
  const allForms = dialog.querySelectorAll("form");
  if (allForms.length === 1) {
    return allForms[0];
  }

  // If multiple forms but none active, return the first form with data-active
  return formsWithActive[0] || null;
}

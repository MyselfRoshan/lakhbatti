import "../library/iconify.min.js";
import { initDialog } from "./dialog.js";
// Contact us tabs
const tabs = document.querySelectorAll(".task__tabs>.tab");
const slider = document.querySelector(".task__tabs");
const tasks = document.querySelectorAll(".tasks");
// const contactForms = document.querySelectorAll(".contact-form");
// const tabDataList = document.querySelector("#tabDataList")
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((tab) => tab.classList.remove("tab-active"));
    tab.classList.add("tab-active");

    const { offsetWidth, offsetLeft } = tab;

    slider.style.setProperty("--_slide-width", offsetWidth + "px");
    slider.style.setProperty("--_slide-left", offsetLeft + "px");

    // const activeTabValue = tab.dataset.value;
    updateTabData(tasks, tab);
    // updateTabData(contactForms, activeTabValue);
  });
});

const initialActiveTab = document.querySelector(".tab.tab-active");

const { offsetWidth, offsetLeft } = initialActiveTab;

slider.style.setProperty("--_slide-width", offsetWidth + "px");
slider.style.setProperty("--_slide-left", offsetLeft + "px");

function updateTabData(containers, activeTab) {
  // console.log(containers);
  containers.forEach((container) => (container.dataset.active = "false"));
  containers.forEach((container) => {
    if (container.dataset.section === activeTab.dataset.value)
      container.dataset.active = "true";
  });
}

let today = new Date();
let tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
// flatpickr("#datepicker input", {
flatpickr("#datepicker", {
  inline: true,
  minDate: tomorrow,
  defaultDate: tomorrow,
  onChange: function (selectedDates, dateStr, instance) {
    //...
    // console.log(dateStr, selectedDates, instance);
    console.log(dateStr, selectedDates);
  },
});

initDialog({
  type: "central",
  triggerSelector: ".btn.danger",
  dialogSelector: "#clockoutDialog",
  closeSelector: ".cancel-btn",
});

initDialog({
  type: "central",
  triggerSelector: ".btn.success",
  dialogSelector: "#clockinDialog",
  closeSelector: ".cancel-btn",
});

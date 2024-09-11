const openNav = document.querySelector("#open-nav");
const closeNav = document.querySelector("#close-nav");
const navToToggle = document.querySelector("#nav-to-toggle");

openNav.addEventListener("click", () => {
  navToToggle.classList.remove("translate-x-full");
  navToToggle.classList.remove("scale-0");
});
closeNav.addEventListener("click", () => {
  navToToggle.classList.add("translate-x-full");
  navToToggle.classList.add("scale-0");
});

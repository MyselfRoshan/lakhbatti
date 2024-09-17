const openNav = document.querySelector("#open-nav")
const closeNav = document.querySelector("#close-nav")
const navToToggle = document.querySelector("#nav-to-toggle")

openNav.addEventListener("click", () => {
    navToToggle.classList.toggle("translate-x-full")
})
closeNav.addEventListener("click", () => {
    navToToggle.classList.remove("translate-x-full")
})

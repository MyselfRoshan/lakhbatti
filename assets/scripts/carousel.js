document.addEventListener("DOMContentLoaded", function () {
    var splide = new Splide("#storiesCards", {
        type: "loop",
        // perPage: 4,
        height: "18.75rem",
        autoHeight: true,
        gap: "1.5rem",
        wheel: true,
        autoplay: true,
        interval: 4000,
        flickMaxPages: 3,
        flickPower: 500,
        arrows: false,
        // fixedHeight: 500,
    })
    splide.mount()
    console.log(splide)
})
